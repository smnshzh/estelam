// Cloudflare KV Storage Integration
export interface KVNamespace {
  get(key: string): Promise<string | null>;
  get(key: string, type: 'text'): Promise<string | null>;
  get(key: string, type: 'json'): Promise<any>;
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>;
  get(key: string, type: 'stream'): Promise<ReadableStream | null>;
  
  put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream): Promise<void>;
  put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: {
    expirationTtl?: number;
    expiration?: number;
    metadata?: any;
  }): Promise<void>;
  
  delete(key: string): Promise<void>;
  
  list(options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{
    keys: Array<{
      name: string;
      expiration?: number;
      metadata?: any;
    }>;
    list_complete: boolean;
    cursor?: string;
  }>;
}

// KV Service for caching and session management
export class KVService {
  constructor(private kv: KVNamespace) {}

  // User session management
  async setUserSession(userId: string, sessionData: any, ttl: number = 3600): Promise<void> {
    const key = `session:${userId}`;
    await this.kv.put(key, JSON.stringify(sessionData), { expirationTtl: ttl });
  }

  async getUserSession(userId: string): Promise<any> {
    const key = `session:${userId}`;
    const data = await this.kv.get(key, 'json');
    return data;
  }

  async deleteUserSession(userId: string): Promise<void> {
    const key = `session:${userId}`;
    await this.kv.delete(key);
  }

  // Seller cache management
  async cacheSellerData(sellerId: string, sellerData: any, ttl: number = 1800): Promise<void> {
    const key = `seller:${sellerId}`;
    await this.kv.put(key, JSON.stringify(sellerData), { expirationTtl: ttl });
  }

  async getCachedSellerData(sellerId: string): Promise<any> {
    const key = `seller:${sellerId}`;
    return await this.kv.get(key, 'json');
  }

  async invalidateSellerCache(sellerId: string): Promise<void> {
    const key = `seller:${sellerId}`;
    await this.kv.delete(key);
  }

  // Location-based caching
  async cacheLocationSellers(lat: number, lng: number, radius: number, sellers: any[], ttl: number = 900): Promise<void> {
    const key = `location:${lat.toFixed(4)}:${lng.toFixed(4)}:${radius}`;
    await this.kv.put(key, JSON.stringify(sellers), { expirationTtl: ttl });
  }

  async getCachedLocationSellers(lat: number, lng: number, radius: number): Promise<any[]> {
    const key = `location:${lat.toFixed(4)}:${lng.toFixed(4)}:${radius}`;
    const data = await this.kv.get(key, 'json');
    return data || [];
  }

  // Review cache management
  async cacheSellerReviews(sellerId: string, reviews: any[], ttl: number = 1800): Promise<void> {
    const key = `reviews:${sellerId}`;
    await this.kv.put(key, JSON.stringify(reviews), { expirationTtl: ttl });
  }

  async getCachedSellerReviews(sellerId: string): Promise<any[]> {
    const key = `reviews:${sellerId}`;
    const data = await this.kv.get(key, 'json');
    return data || [];
  }

  async invalidateReviewCache(sellerId: string): Promise<void> {
    const key = `reviews:${sellerId}`;
    await this.kv.delete(key);
  }

  // Alert cache management
  async cacheActiveAlerts(sellerId: string, alerts: any[], ttl: number = 300): Promise<void> {
    const key = `alerts:${sellerId}`;
    await this.kv.put(key, JSON.stringify(alerts), { expirationTtl: ttl });
  }

  async getCachedActiveAlerts(sellerId: string): Promise<any[]> {
    const key = `alerts:${sellerId}`;
    const data = await this.kv.get(key, 'json');
    return data || [];
  }

  async invalidateAlertCache(sellerId: string): Promise<void> {
    const key = `alerts:${sellerId}`;
    await this.kv.delete(key);
  }

  // User preferences
  async setUserPreferences(userId: string, preferences: any): Promise<void> {
    const key = `preferences:${userId}`;
    await this.kv.put(key, JSON.stringify(preferences));
  }

  async getUserPreferences(userId: string): Promise<any> {
    const key = `preferences:${userId}`;
    return await this.kv.get(key, 'json');
  }

  // Analytics and metrics
  async incrementCounter(key: string, ttl: number = 86400): Promise<number> {
    const currentValue = await this.kv.get(key, 'text');
    const newValue = (parseInt(currentValue || '0') + 1).toString();
    await this.kv.put(key, newValue, { expirationTtl: ttl });
    return parseInt(newValue);
  }

  async getCounter(key: string): Promise<number> {
    const value = await this.kv.get(key, 'text');
    return parseInt(value || '0');
  }

  // Rate limiting
  async checkRateLimit(userId: string, action: string, limit: number, window: number): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const key = `rate_limit:${userId}:${action}`;
    const current = await this.kv.get(key, 'text');
    const count = parseInt(current || '0');
    
    if (count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + window * 1000
      };
    }
    
    const newCount = count + 1;
    await this.kv.put(key, newCount.toString(), { expirationTtl: window });
    
    return {
      allowed: true,
      remaining: limit - newCount,
      resetTime: Date.now() + window * 1000
    };
  }

  // Search index for sellers
  async addToSearchIndex(sellerId: string, searchData: {
    business_name: string;
    business_type: string;
    address: string;
    description?: string;
  }): Promise<void> {
    const searchTerms = [
      sellerId,
      searchData.business_name.toLowerCase(),
      searchData.business_type.toLowerCase(),
      searchData.address.toLowerCase(),
      ...(searchData.description ? searchData.description.toLowerCase().split(' ') : [])
    ];

    for (const term of searchTerms) {
      const key = `search:${term}`;
      const existing = await this.kv.get(key, 'json');
      const sellers = existing || [];
      if (!sellers.includes(sellerId)) {
        sellers.push(sellerId);
        await this.kv.put(key, JSON.stringify(sellers));
      }
    }
  }

  async searchSellers(query: string): Promise<string[]> {
    const searchKey = `search:${query.toLowerCase()}`;
    return await this.kv.get(searchKey, 'json') || [];
  }

  // Cleanup expired data
  async cleanupExpiredData(): Promise<void> {
    // This would be called periodically to clean up expired data
    // Implementation depends on specific cleanup requirements
  }
}
