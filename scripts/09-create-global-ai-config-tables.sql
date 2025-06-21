-- Global AI Configuration Tables
-- This script creates tables to store system-wide AI configuration

-- Global AI Configuration table
CREATE TABLE IF NOT EXISTS global_ai_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- AI Model Configuration
INSERT INTO global_ai_config (config_key, config_value, description, category) VALUES
('default_model', '"llama3-70b-8192"', 'Default AI model for all users', 'models'),
('fallback_strategy', '"balanced"', 'Default fallback strategy when primary model fails', 'models'),
('temperature', '0.7', 'Default temperature setting for AI responses', 'parameters'),
('max_tokens', '800', 'Default maximum tokens for AI responses', 'parameters'),
('auto_fallback', 'true', 'Enable automatic fallback to other models', 'behavior'),
('show_model_info', 'false', 'Show model information in responses by default', 'behavior'),
('rate_limit_per_user', '100', 'Maximum AI requests per user per hour', 'limits'),
('daily_cost_limit', '50.00', 'Maximum daily AI cost in USD', 'limits'),
('enable_free_models_only', 'false', 'Restrict to free models only', 'cost_control'),
('maintenance_mode', 'false', 'Enable maintenance mode for AI services', 'system');

-- AI Provider Configuration
CREATE TABLE IF NOT EXISTS ai_provider_config (
    id SERIAL PRIMARY KEY,
    provider_name VARCHAR(50) NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1,
    config JSONB NOT NULL DEFAULT '{}',
    rate_limit INTEGER DEFAULT 1000,
    cost_per_token DECIMAL(10,6) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default provider configurations
INSERT INTO ai_provider_config (provider_name, is_enabled, priority, config, rate_limit, cost_per_token) VALUES
('groq', true, 1, '{"models": ["llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768", "gemma-7b-it"]}', 10000, 0),
('openai', true, 2, '{"models": ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"]}', 1000, 0.000015);

-- AI Usage Tracking
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    session_id VARCHAR(100),
    model_used VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    cost DECIMAL(10,6) DEFAULT 0,
    response_time_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Configuration History (for audit trail)
CREATE TABLE IF NOT EXISTS ai_config_history (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    changed_by UUID REFERENCES auth.users(id),
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_model_used ON ai_usage_logs(model_used);
CREATE INDEX IF NOT EXISTS idx_global_ai_config_category ON global_ai_config(category);
CREATE INDEX IF NOT EXISTS idx_global_ai_config_is_active ON global_ai_config(is_active);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_global_ai_config_updated_at 
    BEFORE UPDATE ON global_ai_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_provider_config_updated_at 
    BEFORE UPDATE ON ai_provider_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (only admins can modify global config)
ALTER TABLE global_ai_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_provider_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_config_history ENABLE ROW LEVEL SECURITY;

-- Admin access policies
CREATE POLICY "Admins can manage global AI config" ON global_ai_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.email IN ('admin@cbctutorbot.com', 'kiptoo@cbctutorbot.com'))
        )
    );

CREATE POLICY "Admins can manage provider config" ON ai_provider_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.email IN ('admin@cbctutorbot.com', 'kiptoo@cbctutorbot.com'))
        )
    );

-- Users can view their own usage logs
CREATE POLICY "Users can view own usage logs" ON ai_usage_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all usage logs
CREATE POLICY "Admins can view all usage logs" ON ai_usage_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.email IN ('admin@cbctutorbot.com', 'kiptoo@cbctutorbot.com'))
        )
    );

-- Config history is admin-only
CREATE POLICY "Admins can view config history" ON ai_config_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.email IN ('admin@cbctutorbot.com', 'kiptoo@cbctutorbot.com'))
        )
    );

-- Grant necessary permissions
GRANT ALL ON global_ai_config TO authenticated;
GRANT ALL ON ai_provider_config TO authenticated;
GRANT ALL ON ai_usage_logs TO authenticated;
GRANT ALL ON ai_config_history TO authenticated;
GRANT USAGE ON SEQUENCE global_ai_config_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE ai_provider_config_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE ai_usage_logs_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE ai_config_history_id_seq TO authenticated;
