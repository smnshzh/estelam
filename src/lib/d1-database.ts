// Cloudflare D1 Database Integration
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first(): Promise<any>;
  run(): Promise<D1Result>;
  all(): Promise<D1Result>;
}

export interface D1Result {
  success: boolean;
  meta: {
    changes: number;
    last_row_id: number;
    duration: number;
  };
  results?: any[];
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

// Database service for Cloudflare D1
export class D1DatabaseService {
  constructor(private db: D1Database) {}

  // User operations
  async createUser(user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: 'admin' | 'seller' | 'user';
  }): Promise<any> {
    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, name, phone, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    return await stmt.bind(user.id, user.email, user.name, user.phone, user.role).run();
  }

  async getUserById(id: string): Promise<any> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    return await stmt.bind(id).first();
  }

  async getUserByEmail(email: string): Promise<any> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    return await stmt.bind(email).first();
  }

  // Seller operations
  async createSeller(seller: {
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
  }): Promise<any> {
    const id = crypto.randomUUID();
    const stmt = this.db.prepare(`
      INSERT INTO sellers (id, user_id, business_name, business_type, description, address, latitude, longitude, phone, email, website, status, verification_votes, verification_threshold)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    return await stmt.bind(
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
      'pending',
      0,
      10
    ).run();
  }

  async getSellerById(id: string): Promise<any> {
    const stmt = this.db.prepare('SELECT * FROM sellers WHERE id = ?');
    return await stmt.bind(id).first();
  }

  async getSellersByLocation(lat: number, lng: number, radius: number = 10): Promise<any[]> {
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
    return result.results || [];
  }

  async updateSellerStatus(id: string, status: string): Promise<any> {
    const stmt = this.db.prepare('UPDATE sellers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return await stmt.bind(status, id).run();
  }

  // Review operations
  async createReview(review: {
    seller_id: string;
    user_id: string;
    rating: number;
    title?: string;
    comment?: string;
    service_quality?: number;
    price_fairness?: number;
    cleanliness?: number;
    location_accessibility?: number;
  }): Promise<any> {
    const id = crypto.randomUUID();
    const stmt = this.db.prepare(`
      INSERT INTO reviews (id, seller_id, user_id, rating, title, comment, service_quality, price_fairness, cleanliness, location_accessibility)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    return await stmt.bind(
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
  }

  async getReviewsBySeller(sellerId: string): Promise<any[]> {
    const stmt = this.db.prepare(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.seller_id = ? 
      ORDER BY r.created_at DESC
    `);
    const result = await stmt.bind(sellerId).all();
    return result.results || [];
  }

  async getAverageRating(sellerId: string): Promise<number> {
    const stmt = this.db.prepare('SELECT AVG(rating) as avg_rating FROM reviews WHERE seller_id = ?');
    const result = await stmt.bind(sellerId).first();
    return result?.avg_rating || 0;
  }

  // Alert operations
  async createAlert(alert: {
    seller_id: string;
    title: string;
    message: string;
    alert_type: 'special_offer' | 'closure' | 'new_product' | 'event' | 'general';
    start_date?: string;
    end_date?: string;
  }): Promise<any> {
    const id = crypto.randomUUID();
    const stmt = this.db.prepare(`
      INSERT INTO seller_alerts (id, seller_id, title, message, alert_type, start_date, end_date, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    return await stmt.bind(
      id,
      alert.seller_id,
      alert.title,
      alert.message,
      alert.alert_type,
      alert.start_date,
      alert.end_date,
      true
    ).run();
  }

  async getActiveAlertsBySeller(sellerId: string): Promise<any[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM seller_alerts 
      WHERE seller_id = ? AND is_active = TRUE 
      AND (end_date IS NULL OR end_date > CURRENT_TIMESTAMP)
      ORDER BY created_at DESC
    `);
    const result = await stmt.bind(sellerId).all();
    return result.results || [];
  }

  // Verification operations
  async voteForSeller(sellerId: string, voterId: string, voteType: 'approve' | 'reject', reason?: string): Promise<any> {
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
    return await updateStmt.bind(voteCount, sellerId).run();
  }

  async checkSellerVerification(sellerId: string): Promise<boolean> {
    const seller = await this.getSellerById(sellerId);
    if (!seller) return false;
    
    return seller.verification_votes >= seller.verification_threshold;
  }
}
