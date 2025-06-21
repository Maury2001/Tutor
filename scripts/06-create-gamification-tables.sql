-- Create gamification tables for points, badges, achievements, and leaderboards

-- User Points Table
CREATE TABLE IF NOT EXISTS user_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    weekly_points INTEGER DEFAULT 0,
    monthly_points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Point Transactions Table
CREATE TABLE IF NOT EXISTS point_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'spent', 'bonus')),
    source VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    requirements JSONB NOT NULL DEFAULT '[]',
    points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    points INTEGER DEFAULT 0,
    requirements JSONB NOT NULL DEFAULT '[]',
    is_secret BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at ON point_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_completed ON user_achievements(completed);

-- Create leaderboard view
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
    p.id as user_id,
    p.full_name as user_name,
    p.avatar_url,
    p.grade_level,
    p.school_name,
    up.total_points,
    up.level,
    COUNT(ub.id) as badge_count
FROM profiles p
LEFT JOIN user_points up ON p.id = up.user_id
LEFT JOIN user_badges ub ON p.id = ub.user_id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, p.avatar_url, p.grade_level, p.school_name, up.total_points, up.level
ORDER BY up.total_points DESC NULLS LAST;

-- Create weekly leaderboard view
CREATE OR REPLACE VIEW weekly_leaderboard_view AS
SELECT 
    p.id as user_id,
    p.full_name as user_name,
    p.avatar_url,
    p.grade_level,
    p.school_name,
    up.weekly_points,
    up.level,
    COUNT(ub.id) as badge_count
FROM profiles p
LEFT JOIN user_points up ON p.id = up.user_id
LEFT JOIN user_badges ub ON p.id = ub.user_id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, p.avatar_url, p.grade_level, p.school_name, up.weekly_points, up.level
ORDER BY up.weekly_points DESC NULLS LAST;

-- Function to update user points
CREATE OR REPLACE FUNCTION update_user_points(
    p_user_id UUID,
    p_points INTEGER
)
RETURNS JSON AS $$
DECLARE
    current_points INTEGER;
    current_level INTEGER;
    new_level INTEGER;
    level_thresholds INTEGER[] := ARRAY[0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000, 13000, 16500, 20500, 25000, 30000, 35500, 41500, 48000, 55000, 62500];
    level_up BOOLEAN := false;
BEGIN
    -- Get current points and level
    SELECT total_points, level INTO current_points, current_level
    FROM user_points WHERE user_id = p_user_id;
    
    -- If no record exists, create one
    IF NOT FOUND THEN
        INSERT INTO user_points (user_id, total_points, experience_points, level)
        VALUES (p_user_id, GREATEST(0, p_points), GREATEST(0, p_points), 1);
        
        current_points := GREATEST(0, p_points);
        current_level := 1;
    ELSE
        -- Update points
        UPDATE user_points 
        SET 
            total_points = GREATEST(0, total_points + p_points),
            experience_points = GREATEST(0, experience_points + p_points),
            weekly_points = GREATEST(0, weekly_points + p_points),
            monthly_points = GREATEST(0, monthly_points + p_points),
            updated_at = NOW()
        WHERE user_id = p_user_id;
        
        current_points := GREATEST(0, current_points + p_points);
    END IF;
    
    -- Calculate new level
    new_level := current_level;
    FOR i IN 1..array_length(level_thresholds, 1) LOOP
        IF current_points >= level_thresholds[i] THEN
            new_level := i;
        ELSE
            EXIT;
        END IF;
    END LOOP;
    
    -- Update level if changed
    IF new_level > current_level THEN
        UPDATE user_points SET level = new_level WHERE user_id = p_user_id;
        level_up := true;
    END IF;
    
    RETURN json_build_object(
        'level_up', level_up,
        'new_level', new_level,
        'total_points', current_points
    );
END;
$$ LANGUAGE plpgsql;

-- Function to reset weekly points (to be called by a cron job)
CREATE OR REPLACE FUNCTION reset_weekly_points()
RETURNS void AS $$
BEGIN
    UPDATE user_points SET weekly_points = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly points (to be called by a cron job)
CREATE OR REPLACE FUNCTION reset_monthly_points()
RETURNS void AS $$
BEGIN
    UPDATE user_points SET monthly_points = 0;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own points" ON user_points
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions" ON point_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- Allow public read access to badges and achievements tables
CREATE POLICY "Anyone can view badges" ON badges
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view achievements" ON achievements
    FOR SELECT USING (true);
