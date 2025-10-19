// Database connection and utilities for Cloudflare D1
export interface Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'seller' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Seller {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verification_votes: number;
  verification_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  seller_id: string;
  user_id: string;
  rating: number;
  title?: string;
  comment?: string;
  service_quality?: number;
  price_fairness?: number;
  cleanliness?: number;
  location_accessibility?: number;
  created_at: string;
  updated_at: string;
}

export interface SellerAlert {
  id: string;
  seller_id: string;
  title: string;
  message: string;
  alert_type: 'special_offer' | 'closure' | 'new_product' | 'event' | 'general';
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatChannel {
  id: string;
  name?: string;
  type: 'private' | 'group' | 'seller_support';
  seller_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SellerChangeRequest {
  id: string;
  seller_id: string;
  requester_id: string;
  field_name: string;
  old_value?: string;
  new_value: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

// Database utility functions
export class DatabaseService {
  constructor(private db: Database) {}

  // User operations
  async createUser(user: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, name, phone, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(user.id, user.email, user.name, user.phone, user.role).run();
    
    return this.getUserById(user.id);
  }

  async getUserById(id: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    const result = await stmt.bind(id).first();
    return result as User | null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    const result = await stmt.bind(email).first();
    return result as User | null;
  }

  // Seller operations
  async createSeller(seller: Omit<Seller, 'id' | 'created_at' | 'updated_at'>): Promise<Seller> {
    const id = crypto.randomUUID();
    const stmt = this.db.prepare(`
      INSERT INTO sellers (id, user_id, business_name, business_type, description, address, latitude, longitude, phone, email, website, status, verification_votes, verification_threshold)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(
      id,
      seller.user_id,
      seller.business_name,
      seller.business_type,
      seller.description,
      seller.address,
      seller.latitude,
      seller.longitude,
      seller.phone,
      seller.email,
      seller.website,
      seller.status,
      seller.verification_votes,
      seller.verification_threshold
    ).run();
    
    return this.getSellerById(id);
  }

  async getSellerById(id: string): Promise<Seller | null> {
    const stmt = this.db.prepare('SELECT * FROM sellers WHERE id = ?');
    const result = await stmt.bind(id).first();
    return result as Seller | null;
  }

  async getSellersByLocation(lat: number, lng: number, radius: number = 10): Promise<Seller[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM sellers 
      WHERE status = 'approved' 
      AND (
        6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians(?)) + 
          sin(radians(?)) * sin(radians(latitude))
        )
      ) <= ?
    `);
    
    const result = await stmt.bind(lat, lng, lat, radius).all();
    return result.results as Seller[];
  }

  async updateSellerStatus(id: string, status: Seller['status']): Promise<void> {
    const stmt = this.db.prepare('UPDATE sellers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    await stmt.bind(status, id).run();
  }

  // Review operations
  async createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
    const id = crypto.randomUUID();
    const stmt = this.db.prepare(`
      INSERT INTO reviews (id, seller_id, user_id, rating, title, comment, service_quality, price_fairness, cleanliness, location_accessibility)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(
      id,
      review.seller_id,
      review.user_id,
      review.rating,
      review.title,
      review.comment,
      review.service_quality,
      review.price_fairness,
      review.cleanliness,
      review.location_accessibility
    ).run();
    
    return this.getReviewById(id);
  }

  async getReviewById(id: string): Promise<Review | null> {
    const stmt = this.db.prepare('SELECT * FROM reviews WHERE id = ?');
    const result = await stmt.bind(id).first();
    return result as Review | null;
  }

  async getReviewsBySeller(sellerId: string): Promise<Review[]> {
    const stmt = this.db.prepare('SELECT * FROM reviews WHERE seller_id = ? ORDER BY created_at DESC');
    const result = await stmt.bind(sellerId).all();
    return result.results as Review[];
  }

  async getAverageRating(sellerId: string): Promise<number> {
    const stmt = this.db.prepare('SELECT AVG(rating) as avg_rating FROM reviews WHERE seller_id = ?');
    const result = await stmt.bind(sellerId).first();
    return result?.avg_rating || 0;
  }

  // Alert operations
  async createAlert(alert: Omit<SellerAlert, 'id' | 'created_at' | 'updated_at'>): Promise<SellerAlert> {
    const id = crypto.randomUUID();
    const stmt = this.db.prepare(`
      INSERT INTO seller_alerts (id, seller_id, title, message, alert_type, start_date, end_date, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(
      id,
      alert.seller_id,
      alert.title,
      alert.message,
      alert.alert_type,
      alert.start_date,
      alert.end_date,
      alert.is_active
    ).run();
    
    return this.getAlertById(id);
  }

  async getAlertById(id: string): Promise<SellerAlert | null> {
    const stmt = this.db.prepare('SELECT * FROM seller_alerts WHERE id = ?');
    const result = await stmt.bind(id).first();
    return result as SellerAlert | null;
  }

  async getActiveAlertsBySeller(sellerId: string): Promise<SellerAlert[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM seller_alerts 
      WHERE seller_id = ? AND is_active = TRUE 
      AND (end_date IS NULL OR end_date > CURRENT_TIMESTAMP)
      ORDER BY created_at DESC
    `);
    const result = await stmt.bind(sellerId).all();
    return result.results as SellerAlert[];
  }

  // Verification operations
  async voteForSeller(sellerId: string, voterId: string, voteType: 'approve' | 'reject', reason?: string): Promise<void> {
    const id = crypto.randomUUID();
    const stmt = this.db.prepare(`
      INSERT INTO seller_verification_votes (id, seller_id, voter_id, vote_type, reason)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(id, sellerId, voterId, voteType, reason).run();
    
    // Update vote count
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM seller_verification_votes 
      WHERE seller_id = ? AND vote_type = 'approve'
    `);
    const result = await countStmt.bind(sellerId).first();
    const voteCount = result?.count || 0;
    
    const updateStmt = this.db.prepare('UPDATE sellers SET verification_votes = ? WHERE id = ?');
    await updateStmt.bind(voteCount, sellerId).run();
  }

  async checkSellerVerification(sellerId: string): Promise<boolean> {
    const seller = await this.getSellerById(sellerId);
    if (!seller) return false;
    
    return seller.verification_votes >= seller.verification_threshold;
  }
}
