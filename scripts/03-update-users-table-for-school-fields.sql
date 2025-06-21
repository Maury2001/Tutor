-- Add new columns to users table for school-specific fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS school_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS county VARCHAR(100);

-- Add new columns to user_profiles table for school-specific fields
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS school_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS county VARCHAR(100);

-- Create index for better performance on school searches
CREATE INDEX IF NOT EXISTS idx_users_school_name ON users(school_name);
CREATE INDEX IF NOT EXISTS idx_users_county ON users(county);
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile_number);

-- Update any existing 'administrator' roles to 'school'
UPDATE users SET role = 'school' WHERE role = 'administrator';
UPDATE user_profiles SET role = 'school' WHERE role = 'administrator';

-- Create a table for Kenya counties (for reference and validation)
CREATE TABLE IF NOT EXISTS kenya_counties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(10),
  region VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert all 47 Kenya counties
INSERT INTO kenya_counties (name, code, region) VALUES
('Baringo', '30', 'Rift Valley'),
('Bomet', '36', 'Rift Valley'),
('Bungoma', '39', 'Western'),
('Busia', '40', 'Western'),
('Elgeyo-Marakwet', '28', 'Rift Valley'),
('Embu', '14', 'Eastern'),
('Garissa', '07', 'North Eastern'),
('Homa Bay', '43', 'Nyanza'),
('Isiolo', '11', 'Eastern'),
('Kajiado', '34', 'Rift Valley'),
('Kakamega', '37', 'Western'),
('Kericho', '35', 'Rift Valley'),
('Kiambu', '22', 'Central'),
('Kilifi', '03', 'Coast'),
('Kirinyaga', '20', 'Central'),
('Kisii', '45', 'Nyanza'),
('Kisumu', '42', 'Nyanza'),
('Kitui', '15', 'Eastern'),
('Kwale', '02', 'Coast'),
('Laikipia', '31', 'Rift Valley'),
('Lamu', '05', 'Coast'),
('Machakos', '16', 'Eastern'),
('Makueni', '17', 'Eastern'),
('Mandera', '09', 'North Eastern'),
('Marsabit', '10', 'Eastern'),
('Meru', '12', 'Eastern'),
('Migori', '44', 'Nyanza'),
('Mombasa', '01', 'Coast'),
('Murang''a', '21', 'Central'),
('Nairobi', '47', 'Nairobi'),
('Nakuru', '32', 'Rift Valley'),
('Nandi', '29', 'Rift Valley'),
('Narok', '33', 'Rift Valley'),
('Nyamira', '46', 'Nyanza'),
('Nyandarua', '18', 'Central'),
('Nyeri', '19', 'Central'),
('Samburu', '25', 'Rift Valley'),
('Siaya', '41', 'Nyanza'),
('Taita-Taveta', '06', 'Coast'),
('Tana River', '04', 'Coast'),
('Tharaka-Nithi', '13', 'Eastern'),
('Trans Nzoia', '26', 'Rift Valley'),
('Turkana', '23', 'Rift Valley'),
('Uasin Gishu', '27', 'Rift Valley'),
('Vihiga', '38', 'Western'),
('Wajir', '08', 'North Eastern'),
('West Pokot', '24', 'Rift Valley')
ON CONFLICT (name) DO NOTHING;

-- Create user_subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  subscription_type VARCHAR(50) NOT NULL DEFAULT 'free',
  token_allocation INTEGER DEFAULT 1000,
  tokens_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_type ON user_activity_logs(activity_type);
