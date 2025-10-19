-- Users table (extended from SuperTokens)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'seller', 'user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customers/Stores table (for credit inquiry)
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  -- Credit-related fields
  credit_limit REAL DEFAULT 0,
  payment_terms TEXT,
  credit_score INTEGER DEFAULT 0 CHECK (credit_score >= 0 AND credit_score <= 100),
  risk_level TEXT DEFAULT 'unknown' CHECK (risk_level IN ('low', 'medium', 'high', 'unknown')),
  -- Status fields
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  verification_votes INTEGER DEFAULT 0,
  verification_threshold INTEGER DEFAULT 10,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customer verification votes
CREATE TABLE IF NOT EXISTS customer_verification_votes (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('approve', 'reject')),
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, voter_id)
);

-- Reviews table (for credit assessment)
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  -- Credit assessment fields
  payment_punctuality INTEGER CHECK (payment_punctuality >= 1 AND payment_punctuality <= 5),
  business_reputation INTEGER CHECK (business_reputation >= 1 AND business_reputation <= 5),
  financial_stability INTEGER CHECK (financial_stability >= 1 AND financial_stability <= 5),
  communication_quality INTEGER CHECK (communication_quality >= 1 AND communication_quality <= 5),
  -- General service fields
  service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
  price_fairness INTEGER CHECK (price_fairness >= 1 AND price_fairness <= 5),
  cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
  location_accessibility INTEGER CHECK (location_accessibility >= 1 AND location_accessibility <= 5),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, user_id)
);

-- Customer alerts/notifications
CREATE TABLE IF NOT EXISTS customer_alerts (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('credit_update', 'payment_reminder', 'special_offer', 'closure', 'new_product', 'event', 'general')),
  start_date DATETIME,
  end_date DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User subscriptions to customer alerts
CREATE TABLE IF NOT EXISTS user_customer_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, customer_id)
);

-- Chat channels
CREATE TABLE IF NOT EXISTS chat_channels (
  id TEXT PRIMARY KEY,
  name TEXT,
  type TEXT NOT NULL CHECK (type IN ('private', 'group', 'customer_support')),
  customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
  created_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chat channel members
CREATE TABLE IF NOT EXISTS chat_channel_members (
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(channel_id, user_id)
);

-- Customer information change requests
CREATE TABLE IF NOT EXISTS customer_change_requests (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  requester_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by TEXT REFERENCES users(id),
  reviewed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_location ON customers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_credit_score ON customers(credit_score);
CREATE INDEX IF NOT EXISTS idx_customers_risk_level ON customers(risk_level);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_customer ON customer_alerts(customer_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON customer_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON user_customer_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer ON user_customer_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_chat_channels_customer ON chat_channels(customer_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON chat_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_change_requests_customer ON customer_change_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_change_requests_status ON customer_change_requests(status);
