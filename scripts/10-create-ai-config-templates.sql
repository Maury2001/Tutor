-- AI Configuration Templates
-- This script creates tables and data for pre-defined configuration sets

-- Configuration Templates table
CREATE TABLE IF NOT EXISTS ai_config_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    icon VARCHAR(50) DEFAULT 'settings',
    color VARCHAR(20) DEFAULT 'blue',
    is_system_template BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    config_data JSONB NOT NULL DEFAULT '{}',
    usage_stats JSONB DEFAULT '{"applied_count": 0, "last_applied": null}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Template Application History
CREATE TABLE IF NOT EXISTS ai_template_applications (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES ai_config_templates(id) ON DELETE CASCADE,
    applied_by UUID REFERENCES auth.users(id),
    previous_config JSONB,
    applied_config JSONB,
    application_reason TEXT,
    rollback_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert pre-defined system templates
INSERT INTO ai_config_templates (name, description, category, icon, color, is_system_template, config_data) VALUES

-- Cost-Conscious Mode
('Cost-Conscious Mode', 'Optimized for minimal costs using only free AI models with conservative limits', 'cost_control', 'dollar-sign', 'green', true, '{
    "default_model": "llama3-8b-8192",
    "fallback_strategy": "free_only",
    "temperature": 0.5,
    "max_tokens": 500,
    "auto_fallback": true,
    "show_model_info": false,
    "rate_limit_per_user": 50,
    "daily_cost_limit": 0,
    "enable_free_models_only": true,
    "maintenance_mode": false,
    "provider_priorities": {
        "groq": {"enabled": true, "priority": 1},
        "openai": {"enabled": false, "priority": 999}
    }
}'),

-- High Performance Mode
('High Performance Mode', 'Maximum quality responses using the best available AI models', 'performance', 'zap', 'purple', true, '{
    "default_model": "gpt-4o",
    "fallback_strategy": "quality_first",
    "temperature": 0.7,
    "max_tokens": 1500,
    "auto_fallback": true,
    "show_model_info": true,
    "rate_limit_per_user": 200,
    "daily_cost_limit": 100,
    "enable_free_models_only": false,
    "maintenance_mode": false,
    "provider_priorities": {
        "openai": {"enabled": true, "priority": 1},
        "groq": {"enabled": true, "priority": 2}
    }
}'),

-- Educational Mode
('Educational Mode', 'Balanced settings optimized for learning and teaching environments', 'education', 'graduation-cap', 'blue', true, '{
    "default_model": "llama3-70b-8192",
    "fallback_strategy": "balanced",
    "temperature": 0.6,
    "max_tokens": 800,
    "auto_fallback": true,
    "show_model_info": false,
    "rate_limit_per_user": 100,
    "daily_cost_limit": 25,
    "enable_free_models_only": false,
    "maintenance_mode": false,
    "provider_priorities": {
        "groq": {"enabled": true, "priority": 1},
        "openai": {"enabled": true, "priority": 2}
    }
}'),

-- Speed Optimized Mode
('Speed Optimized Mode', 'Fastest possible responses for high-traffic scenarios', 'performance', 'rocket', 'orange', true, '{
    "default_model": "llama3-8b-8192",
    "fallback_strategy": "speed_first",
    "temperature": 0.5,
    "max_tokens": 600,
    "auto_fallback": true,
    "show_model_info": false,
    "rate_limit_per_user": 300,
    "daily_cost_limit": 30,
    "enable_free_models_only": false,
    "maintenance_mode": false,
    "provider_priorities": {
        "groq": {"enabled": true, "priority": 1},
        "openai": {"enabled": true, "priority": 3}
    }
}'),

-- Creative Mode
('Creative Mode', 'Enhanced creativity settings for brainstorming and creative tasks', 'creativity', 'palette', 'pink', true, '{
    "default_model": "gpt-4o",
    "fallback_strategy": "quality_first",
    "temperature": 1.2,
    "max_tokens": 1200,
    "auto_fallback": true,
    "show_model_info": true,
    "rate_limit_per_user": 150,
    "daily_cost_limit": 40,
    "enable_free_models_only": false,
    "maintenance_mode": false,
    "provider_priorities": {
        "openai": {"enabled": true, "priority": 1},
        "groq": {"enabled": true, "priority": 2}
    }
}'),

-- Maintenance Mode
('Maintenance Mode', 'Minimal AI usage during system maintenance or updates', 'system', 'wrench', 'red', true, '{
    "default_model": "llama3-8b-8192",
    "fallback_strategy": "free_only",
    "temperature": 0.3,
    "max_tokens": 300,
    "auto_fallback": false,
    "show_model_info": true,
    "rate_limit_per_user": 10,
    "daily_cost_limit": 5,
    "enable_free_models_only": true,
    "maintenance_mode": true,
    "provider_priorities": {
        "groq": {"enabled": true, "priority": 1},
        "openai": {"enabled": false, "priority": 999}
    }
}'),

-- Testing Mode
('Testing Mode', 'Configuration for testing new features and AI model performance', 'development', 'flask', 'yellow', true, '{
    "default_model": "mixtral-8x7b-32768",
    "fallback_strategy": "balanced",
    "temperature": 0.8,
    "max_tokens": 1000,
    "auto_fallback": true,
    "show_model_info": true,
    "rate_limit_per_user": 500,
    "daily_cost_limit": 20,
    "enable_free_models_only": false,
    "maintenance_mode": false,
    "provider_priorities": {
        "groq": {"enabled": true, "priority": 1},
        "openai": {"enabled": true, "priority": 1}
    }
}'),

-- Peak Hours Mode
('Peak Hours Mode', 'Optimized for high traffic periods with load balancing', 'performance', 'trending-up', 'indigo', true, '{
    "default_model": "llama3-70b-8192",
    "fallback_strategy": "speed_first",
    "temperature": 0.6,
    "max_tokens": 700,
    "auto_fallback": true,
    "show_model_info": false,
    "rate_limit_per_user": 80,
    "daily_cost_limit": 60,
    "enable_free_models_only": false,
    "maintenance_mode": false,
    "provider_priorities": {
        "groq": {"enabled": true, "priority": 1},
        "openai": {"enabled": true, "priority": 2}
    }
}'),

-- Off-Hours Mode
('Off-Hours Mode', 'Relaxed settings for low-traffic periods with higher quality', 'performance', 'moon', 'slate', true, '{
    "default_model": "gpt-4o-mini",
    "fallback_strategy": "quality_first",
    "temperature": 0.8,
    "max_tokens": 1000,
    "auto_fallback": true,
    "show_model_info": false,
    "rate_limit_per_user": 150,
    "daily_cost_limit": 35,
    "enable_free_models_only": false,
    "maintenance_mode": false,
    "provider_priorities": {
        "openai": {"enabled": true, "priority": 1},
        "groq": {"enabled": true, "priority": 2}
    }
}'),

-- Exam Period Mode
('Exam Period Mode', 'Focused settings for exam preparation and assessment', 'education', 'clipboard-check', 'emerald', true, '{
    "default_model": "gpt-4o-mini",
    "fallback_strategy": "quality_first",
    "temperature": 0.4,
    "max_tokens": 900,
    "auto_fallback": true,
    "show_model_info": false,
    "rate_limit_per_user": 120,
    "daily_cost_limit": 30,
    "enable_free_models_only": false,
    "maintenance_mode": false,
    "provider_priorities": {
        "openai": {"enabled": true, "priority": 1},
        "groq": {"enabled": true, "priority": 2}
    }
}');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_config_templates_category ON ai_config_templates(category);
CREATE INDEX IF NOT EXISTS idx_ai_config_templates_is_active ON ai_config_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_config_templates_is_system ON ai_config_templates(is_system_template);
CREATE INDEX IF NOT EXISTS idx_ai_template_applications_template_id ON ai_template_applications(template_id);
CREATE INDEX IF NOT EXISTS idx_ai_template_applications_applied_by ON ai_template_applications(applied_by);
CREATE INDEX IF NOT EXISTS idx_ai_template_applications_created_at ON ai_template_applications(created_at);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_ai_config_templates_updated_at 
    BEFORE UPDATE ON ai_config_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE ai_config_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_template_applications ENABLE ROW LEVEL SECURITY;

-- Admin access policies for templates
CREATE POLICY "Admins can manage config templates" ON ai_config_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.email IN ('admin@cbctutorbot.com', 'kiptoo@cbctutorbot.com'))
        )
    );

-- Users can view active templates (for reference)
CREATE POLICY "Users can view active templates" ON ai_config_templates
    FOR SELECT USING (is_active = true);

-- Admin access for template applications
CREATE POLICY "Admins can manage template applications" ON ai_template_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.email IN ('admin@cbctutorbot.com', 'kiptoo@cbctutorbot.com'))
        )
    );

-- Grant necessary permissions
GRANT ALL ON ai_config_templates TO authenticated;
GRANT ALL ON ai_template_applications TO authenticated;
GRANT USAGE ON SEQUENCE ai_config_templates_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE ai_template_applications_id_seq TO authenticated;

-- Function to apply a template configuration
CREATE OR REPLACE FUNCTION apply_ai_config_template(
    template_id_param INTEGER,
    applied_by_param UUID,
    reason_param TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    template_record ai_config_templates%ROWTYPE;
    current_config JSONB;
    config_key TEXT;
    config_value JSONB;
    result JSONB;
BEGIN
    -- Get the template
    SELECT * INTO template_record 
    FROM ai_config_templates 
    WHERE id = template_id_param AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Template not found or inactive');
    END IF;
    
    -- Get current configuration for rollback
    SELECT jsonb_object_agg(config_key, config_value) INTO current_config
    FROM global_ai_config 
    WHERE is_active = true;
    
    -- Apply each configuration from the template
    FOR config_key, config_value IN SELECT * FROM jsonb_each(template_record.config_data)
    LOOP
        INSERT INTO global_ai_config (config_key, config_value, updated_by)
        VALUES (config_key, config_value, applied_by_param)
        ON CONFLICT (config_key) 
        DO UPDATE SET 
            config_value = EXCLUDED.config_value,
            updated_by = EXCLUDED.updated_by,
            updated_at = NOW();
    END LOOP;
    
    -- Log the template application
    INSERT INTO ai_template_applications (
        template_id, 
        applied_by, 
        previous_config, 
        applied_config, 
        application_reason,
        rollback_data
    ) VALUES (
        template_id_param,
        applied_by_param,
        current_config,
        template_record.config_data,
        reason_param,
        current_config
    );
    
    -- Update template usage stats
    UPDATE ai_config_templates 
    SET usage_stats = jsonb_set(
        jsonb_set(usage_stats, '{applied_count}', 
                 (COALESCE((usage_stats->>'applied_count')::INTEGER, 0) + 1)::TEXT::JSONB),
        '{last_applied}', to_jsonb(NOW()::TEXT)
    )
    WHERE id = template_id_param;
    
    result := jsonb_build_object(
        'success', true, 
        'message', 'Template applied successfully',
        'template_name', template_record.name,
        'configs_updated', jsonb_object_length(template_record.config_data)
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to rollback to previous configuration
CREATE OR REPLACE FUNCTION rollback_ai_config_template(
    application_id_param INTEGER,
    rolled_back_by_param UUID
) RETURNS JSONB AS $$
DECLARE
    application_record ai_template_applications%ROWTYPE;
    config_key TEXT;
    config_value JSONB;
    result JSONB;
BEGIN
    -- Get the application record
    SELECT * INTO application_record 
    FROM ai_template_applications 
    WHERE id = application_id_param;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Application record not found');
    END IF;
    
    -- Restore each configuration from rollback data
    FOR config_key, config_value IN SELECT * FROM jsonb_each(application_record.rollback_data)
    LOOP
        UPDATE global_ai_config 
        SET config_value = config_value,
            updated_by = rolled_back_by_param,
            updated_at = NOW()
        WHERE config_key = config_key;
    END LOOP;
    
    result := jsonb_build_object(
        'success', true, 
        'message', 'Configuration rolled back successfully',
        'configs_restored', jsonb_object_length(application_record.rollback_data)
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
