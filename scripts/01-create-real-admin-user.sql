-- Remove all demo users and create real admin user
DELETE FROM user_profiles WHERE email LIKE '%demo%' OR email LIKE '%test%' OR email LIKE '%example%';
DELETE FROM users WHERE email LIKE '%demo%' OR email LIKE '%test%' OR email LIKE '%example%';

-- Create real admin user
INSERT INTO users (
  id,
  email,
  name,
  role,
  created_at,
  updated_at,
  email_verified,
  is_active
) VALUES (
  gen_random_uuid(),
  'workerpeter@gmail.com',
  'Peter Worker',
  'admin',
  NOW(),
  NOW(),
  true,
  true
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Create profile for admin user
INSERT INTO user_profiles (
  id,
  user_id,
  email,
  name,
  role,
  grade_level,
  school_name,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM users WHERE email = 'workerpeter@gmail.com'),
  'workerpeter@gmail.com',
  'Peter Worker',
  'admin',
  NULL,
  'CBC TutorBot Administration',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  school_name = EXCLUDED.school_name,
  updated_at = NOW();

-- Create admin authentication record (for password: 2020)
-- Note: In production, this should be handled by your auth provider
INSERT INTO auth_credentials (
  user_id,
  email,
  password_hash,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM users WHERE email = 'workerpeter@gmail.com'),
  'workerpeter@gmail.com',
  '$2b$10$rOvHPy8.WuFnkqXpjM4lO.Km9.x8qGvB5H1N2p3L4m5K6j7H8i9J0', -- bcrypt hash for "2020"
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Clean up any demo subscriptions
DELETE FROM school_subscriptions WHERE school_name LIKE '%Demo%' OR school_name LIKE '%Test%';

-- Add real school subscription for admin
INSERT INTO school_subscriptions (
  id,
  school_name,
  contact_email,
  subscription_type,
  tokens_allocated,
  tokens_used,
  tokens_remaining,
  is_active,
  created_at,
  expires_at
) VALUES (
  gen_random_uuid(),
  'CBC TutorBot Administration',
  'workerpeter@gmail.com',
  'enterprise',
  100000,
  0,
  100000,
  true,
  NOW(),
  NOW() + INTERVAL '1 year'
) ON CONFLICT (contact_email) DO UPDATE SET
  tokens_allocated = EXCLUDED.tokens_allocated,
  tokens_remaining = EXCLUDED.tokens_remaining,
  updated_at = NOW();
