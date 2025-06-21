-- Create auth_credentials table for storing password hashes
CREATE TABLE IF NOT EXISTS auth_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_auth_credentials_email ON auth_credentials(email);
CREATE INDEX IF NOT EXISTS idx_auth_credentials_user_id ON auth_credentials(user_id);

-- Add RLS policies
ALTER TABLE auth_credentials ENABLE ROW LEVEL SECURITY;

-- Only allow users to access their own credentials
CREATE POLICY "Users can only access their own credentials" ON auth_credentials
  FOR ALL USING (auth.uid()::text = user_id::text);
