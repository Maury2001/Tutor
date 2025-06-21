-- First, ensure the required tables exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'student',
    grade_level VARCHAR(20),
    school_name VARCHAR(255),
    mobile_number VARCHAR(20),
    county VARCHAR(100),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'student',
    grade_level VARCHAR(20),
    school_name VARCHAR(255),
    mobile_number VARCHAR(20),
    county VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remove any existing admin user to avoid conflicts
DELETE FROM auth_credentials WHERE email = 'workerpeter@gmail.com';
DELETE FROM user_profiles WHERE email = 'workerpeter@gmail.com';
DELETE FROM users WHERE email = 'workerpeter@gmail.com';

-- Create the admin user
INSERT INTO users (
    id,
    email,
    name,
    role,
    school_name,
    is_active,
    email_verified,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'workerpeter@gmail.com',
    'Peter Worker',
    'admin',
    'System Administration',
    true,
    true,
    NOW(),
    NOW()
);

-- Create user profile for admin
INSERT INTO user_profiles (
    id,
    user_id,
    email,
    name,
    role,
    school_name,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'workerpeter@gmail.com'),
    'workerpeter@gmail.com',
    'Peter Worker',
    'admin',
    'System Administration',
    NOW(),
    NOW()
);

-- Create auth credentials (password hash for "2020")
INSERT INTO auth_credentials (
    id,
    user_id,
    email,
    password_hash,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'workerpeter@gmail.com'),
    'workerpeter@gmail.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBVJ3fEBV9OERG', -- bcrypt hash for "2020"
    NOW(),
    NOW()
);

-- Verify the admin user was created
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.is_active,
    ac.password_hash IS NOT NULL as has_password
FROM users u
LEFT JOIN auth_credentials ac ON u.id = ac.user_id
WHERE u.email = 'workerpeter@gmail.com';
