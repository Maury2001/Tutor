-- Complete Database Setup Script
-- This script combines all database setup steps for easy configuration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
    CREATE TYPE grade_level AS ENUM (
      'playgroup', 'pp1', 'pp2', 'grade1', 'grade2', 'grade3', 
      'grade4', 'grade5', 'grade6', 'grade7', 'grade8', 'grade9'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'parent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assessment_type AS ENUM ('formative', 'summative', 'practical', 'project');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'mastered');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'student',
  grade_level grade_level,
  school_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Areas table
CREATE TABLE IF NOT EXISTS learning_areas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  grade_level grade_level NOT NULL,
  weekly_lessons INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strands table
CREATE TABLE IF NOT EXISTS strands (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  learning_area_id UUID REFERENCES learning_areas(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sequence_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(learning_area_id, code)
);

-- Sub-strands table
CREATE TABLE IF NOT EXISTS sub_strands (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  strand_id UUID REFERENCES strands(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sequence_order INTEGER DEFAULT 0,
  practical_projects JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(strand_id, code)
);

-- Learning Outcomes table
CREATE TABLE IF NOT EXISTS learning_outcomes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sub_strand_id UUID REFERENCES sub_strands(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  sequence_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sub_strand_id, code)
);

-- Learning Objectives table
CREATE TABLE IF NOT EXISTS learning_objectives (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  learning_outcome_id UUID REFERENCES learning_outcomes(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  activities JSONB DEFAULT '[]',
  practical_simulations JSONB DEFAULT '[]',
  sequence_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(learning_outcome_id, code)
);

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT,
  file_url TEXT,
  file_size BIGINT,
  grade_level grade_level NOT NULL,
  learning_area_id UUID REFERENCES learning_areas(id),
  strand_id UUID REFERENCES strands(id),
  sub_strand_id UUID REFERENCES sub_strands(id),
  tags JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assessment_type assessment_type NOT NULL,
  grade_level grade_level NOT NULL,
  learning_area_id UUID REFERENCES learning_areas(id),
  strand_id UUID REFERENCES strands(id),
  sub_strand_id UUID REFERENCES sub_strands(id),
  questions JSONB NOT NULL DEFAULT '[]',
  total_marks INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  instructions TEXT,
  created_by UUID REFERENCES profiles(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  learning_area_id UUID REFERENCES learning_areas(id),
  strand_id UUID REFERENCES strands(id),
  sub_strand_id UUID REFERENCES sub_strands(id),
  learning_outcome_id UUID REFERENCES learning_outcomes(id),
  learning_objective_id UUID REFERENCES learning_objectives(id),
  status progress_status DEFAULT 'not_started',
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, learning_objective_id)
);

-- Assessment Submissions table
CREATE TABLE IF NOT EXISTS assessment_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  score DECIMAL(5,2),
  max_score DECIMAL(5,2),
  percentage DECIMAL(5,2),
  time_taken_minutes INTEGER,
  feedback TEXT,
  graded_by UUID REFERENCES profiles(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  graded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(assessment_id, student_id)
);

-- Practical Projects table
CREATE TABLE IF NOT EXISTS practical_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  grade_level grade_level NOT NULL,
  learning_area_id UUID REFERENCES learning_areas(id),
  strand_id UUID REFERENCES strands(id),
  sub_strand_id UUID REFERENCES sub_strands(id),
  objectives JSONB DEFAULT '[]',
  materials_needed JSONB DEFAULT '[]',
  instructions JSONB DEFAULT '[]',
  assessment_criteria JSONB DEFAULT '[]',
  duration_days INTEGER,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Submissions table
CREATE TABLE IF NOT EXISTS project_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES practical_projects(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  submission_data JSONB NOT NULL DEFAULT '{}',
  files JSONB DEFAULT '[]',
  reflection TEXT,
  score DECIMAL(5,2),
  feedback TEXT,
  status progress_status DEFAULT 'not_started',
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID REFERENCES profiles(id)
);

-- Tutor Chat Sessions table
CREATE TABLE IF NOT EXISTS tutor_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  grade_level grade_level NOT NULL,
  learning_area_id UUID REFERENCES learning_areas(id),
  topic TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  tokens_used INTEGER DEFAULT 0,
  session_duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Analytics table
CREATE TABLE IF NOT EXISTS student_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_time_minutes INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  assessments_taken INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0.00,
  tokens_used INTEGER DEFAULT 0,
  activities JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Class Enrollments table
CREATE TABLE IF NOT EXISTS class_enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  grade_level grade_level NOT NULL,
  subject_area TEXT,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(teacher_id, student_id, class_name)
);

-- Gamification Tables

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
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_grade_level ON profiles(grade_level);
CREATE INDEX IF NOT EXISTS idx_learning_areas_grade ON learning_areas(grade_level);
CREATE INDEX IF NOT EXISTS idx_materials_grade_area ON materials(grade_level, learning_area_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_objective ON student_progress(learning_objective_id);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_student ON assessment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_tutor_sessions_student ON tutor_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_student_analytics_date ON student_analytics(student_id, date);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_teacher ON class_enrollments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_student ON class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at ON point_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_completed ON user_achievements(completed);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE strands ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_strands ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practical_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Teachers can view their students' profiles" ON profiles;
CREATE POLICY "Teachers can view their students' profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE teacher_id = auth.uid() 
      AND student_id = profiles.id 
      AND is_active = true
    )
  );

-- Learning Areas policies (public read)
DROP POLICY IF EXISTS "Anyone can view learning areas" ON learning_areas;
CREATE POLICY "Anyone can view learning areas" ON learning_areas
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify learning areas" ON learning_areas;
CREATE POLICY "Only admins can modify learning areas" ON learning_areas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Strands policies (public read)
DROP POLICY IF EXISTS "Anyone can view strands" ON strands;
CREATE POLICY "Anyone can view strands" ON strands
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify strands" ON strands;
CREATE POLICY "Only admins can modify strands" ON strands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Sub-strands policies (public read)
DROP POLICY IF EXISTS "Anyone can view sub-strands" ON sub_strands;
CREATE POLICY "Anyone can view sub-strands" ON sub_strands
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify sub-strands" ON sub_strands;
CREATE POLICY "Only admins can modify sub-strands" ON sub_strands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Learning Outcomes policies (public read)
DROP POLICY IF EXISTS "Anyone can view learning outcomes" ON learning_outcomes;
CREATE POLICY "Anyone can view learning outcomes" ON learning_outcomes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify learning outcomes" ON learning_outcomes;
CREATE POLICY "Only admins can modify learning outcomes" ON learning_outcomes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Learning Objectives policies (public read)
DROP POLICY IF EXISTS "Anyone can view learning objectives" ON learning_objectives;
CREATE POLICY "Anyone can view learning objectives" ON learning_objectives
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify learning objectives" ON learning_objectives;
CREATE POLICY "Only admins can modify learning objectives" ON learning_objectives
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Materials policies
DROP POLICY IF EXISTS "Anyone can view public materials" ON materials;
CREATE POLICY "Anyone can view public materials" ON materials
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own materials" ON materials;
CREATE POLICY "Users can view their own materials" ON materials
  FOR SELECT USING (uploaded_by = auth.uid());

DROP POLICY IF EXISTS "Teachers can upload materials" ON materials;
CREATE POLICY "Teachers can upload materials" ON materials
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('teacher', 'admin')
    )
  );

DROP POLICY IF EXISTS "Users can update their own materials" ON materials;
CREATE POLICY "Users can update their own materials" ON materials
  FOR UPDATE USING (uploaded_by = auth.uid());

-- Student Progress policies
DROP POLICY IF EXISTS "Students can view their own progress" ON student_progress;
CREATE POLICY "Students can view their own progress" ON student_progress
  FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can update their own progress" ON student_progress;
CREATE POLICY "Students can update their own progress" ON student_progress
  FOR ALL USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Teachers can view their students' progress" ON student_progress;
CREATE POLICY "Teachers can view their students' progress" ON student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE teacher_id = auth.uid() 
      AND student_id = student_progress.student_id 
      AND is_active = true
    )
  );

-- Assessment Submissions policies
DROP POLICY IF EXISTS "Students can view their own submissions" ON assessment_submissions;
CREATE POLICY "Students can view their own submissions" ON assessment_submissions
  FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can create their own submissions" ON assessment_submissions;
CREATE POLICY "Students can create their own submissions" ON assessment_submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Teachers can view their students' submissions" ON assessment_submissions;
CREATE POLICY "Teachers can view their students' submissions" ON assessment_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE teacher_id = auth.uid() 
      AND student_id = assessment_submissions.student_id 
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Teachers can grade submissions" ON assessment_submissions;
CREATE POLICY "Teachers can grade submissions" ON assessment_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE teacher_id = auth.uid() 
      AND student_id = assessment_submissions.student_id 
      AND is_active = true
    )
  );

-- Tutor Sessions policies
DROP POLICY IF EXISTS "Students can view their own tutor sessions" ON tutor_sessions;
CREATE POLICY "Students can view their own tutor sessions" ON tutor_sessions
  FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can create their own tutor sessions" ON tutor_sessions;
CREATE POLICY "Students can create their own tutor sessions" ON tutor_sessions
  FOR INSERT WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can update their own tutor sessions" ON tutor_sessions;
CREATE POLICY "Students can update their own tutor sessions" ON tutor_sessions
  FOR UPDATE USING (student_id = auth.uid());

-- Student Analytics policies
DROP POLICY IF EXISTS "Students can view their own analytics" ON student_analytics;
CREATE POLICY "Students can view their own analytics" ON student_analytics
  FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "System can update analytics" ON student_analytics;
CREATE POLICY "System can update analytics" ON student_analytics
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Teachers can view their students' analytics" ON student_analytics;
CREATE POLICY "Teachers can view their students' analytics" ON student_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE teacher_id = auth.uid() 
      AND student_id = student_analytics.student_id 
      AND is_active = true
    )
  );

-- Class Enrollments policies
DROP POLICY IF EXISTS "Teachers can manage their classes" ON class_enrollments;
CREATE POLICY "Teachers can manage their classes" ON class_enrollments
  FOR ALL USING (teacher_id = auth.uid());

DROP POLICY IF EXISTS "Students can view their enrollments" ON class_enrollments;
CREATE POLICY "Students can view their enrollments" ON class_enrollments
  FOR SELECT USING (student_id = auth.uid());

-- Gamification RLS Policies
DROP POLICY IF EXISTS "Users can view their own points" ON user_points;
CREATE POLICY "Users can view their own points" ON user_points
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own transactions" ON point_transactions;
CREATE POLICY "Users can view their own transactions" ON point_transactions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own badges" ON user_badges;
CREATE POLICY "Users can view their own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view badges" ON badges;
CREATE POLICY "Anyone can view badges" ON badges
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
CREATE POLICY "Anyone can view achievements" ON achievements
    FOR SELECT USING (true);

-- Create leaderboard view
DROP VIEW IF EXISTS leaderboard_view;
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
    p.id as user_id,
    p.full_name as user_name,
    p.avatar_url,
    p.grade_level,
    p.school_name,
    COALESCE(up.total_points, 0) as total_points,
    COALESCE(up.level, 1) as level,
    COUNT(ub.id) as badge_count
FROM profiles p
LEFT JOIN user_points up ON p.id = up.user_id
LEFT JOIN user_badges ub ON p.id = ub.user_id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, p.avatar_url, p.grade_level, p.school_name, up.total_points, up.level
ORDER BY COALESCE(up.total_points, 0) DESC;

-- Create weekly leaderboard view
DROP VIEW IF EXISTS weekly_leaderboard_view;
CREATE OR REPLACE VIEW weekly_leaderboard_view AS
SELECT 
    p.id as user_id,
    p.full_name as user_name,
    p.avatar_url,
    p.grade_level,
    p.school_name,
    COALESCE(up.weekly_points, 0) as weekly_points,
    COALESCE(up.level, 1) as level,
    COUNT(ub.id) as badge_count
FROM profiles p
LEFT JOIN user_points up ON p.id = up.user_id
LEFT JOIN user_badges ub ON p.id = ub.user_id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, p.avatar_url, p.grade_level, p.school_name, up.weekly_points, up.level
ORDER BY COALESCE(up.weekly_points, 0) DESC;

-- Function to get progress summary for a student
CREATE OR REPLACE FUNCTION get_progress_summary(
  student_id UUID,
  grade_level grade_level
)
RETURNS TABLE (
  learning_area_name TEXT,
  total_objectives INTEGER,
  completed_objectives INTEGER,
  in_progress_objectives INTEGER,
  completion_percentage DECIMAL,
  total_time_minutes INTEGER,
  average_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    la.name as learning_area_name,
    COUNT(sp.id)::INTEGER as total_objectives,
    COUNT(CASE WHEN sp.status IN ('completed', 'mastered') THEN 1 END)::INTEGER as completed_objectives,
    COUNT(CASE WHEN sp.status = 'in_progress' THEN 1 END)::INTEGER as in_progress_objectives,
    CASE 
      WHEN COUNT(sp.id) > 0 THEN 
        (COUNT(CASE WHEN sp.status IN ('completed', 'mastered') THEN 1 END)::DECIMAL / COUNT(sp.id)::DECIMAL) * 100
      ELSE 0
    END as completion_percentage,
    COALESCE(SUM(sp.time_spent_minutes), 0)::INTEGER as total_time_minutes,
    COALESCE(AVG(sp.completion_percentage), 0) as average_score
  FROM learning_areas la
  LEFT JOIN strands s ON s.learning_area_id = la.id
  LEFT JOIN sub_strands ss ON ss.strand_id = s.id
  LEFT JOIN learning_outcomes lo ON lo.sub_strand_id = ss.id
  LEFT JOIN learning_objectives obj ON obj.learning_outcome_id = lo.id
  LEFT JOIN student_progress sp ON sp.learning_objective_id = obj.id AND sp.student_id = $1
  WHERE la.grade_level = $2
  GROUP BY la.id, la.name
  ORDER BY la.name;
END;
$$ LANGUAGE plpgsql;

-- Function to update daily analytics
CREATE OR REPLACE FUNCTION update_daily_analytics(
  p_student_id UUID,
  p_date DATE,
  p_time_spent INTEGER,
  p_lessons_completed INTEGER DEFAULT 0,
  p_assessments_taken INTEGER DEFAULT 0,
  p_average_score DECIMAL DEFAULT 0,
  p_tokens_used INTEGER DEFAULT 0,
  p_activities JSONB DEFAULT '[]'::JSONB
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO student_analytics (
    student_id,
    date,
    total_time_minutes,
    lessons_completed,
    assessments_taken,
    average_score,
    tokens_used,
    activities
  )
  VALUES (
    p_student_id,
    p_date,
    p_time_spent,
    p_lessons_completed,
    p_assessments_taken,
    p_average_score,
    p_tokens_used,
    p_activities
  )
  ON CONFLICT (student_id, date)
  DO UPDATE SET
    total_time_minutes = student_analytics.total_time_minutes + EXCLUDED.total_time_minutes,
    lessons_completed = student_analytics.lessons_completed + EXCLUDED.lessons_completed,
    assessments_taken = student_analytics.assessments_taken + EXCLUDED.assessments_taken,
    average_score = CASE 
      WHEN EXCLUDED.average_score > 0 THEN 
        (student_analytics.average_score + EXCLUDED.average_score) / 2
      ELSE student_analytics.average_score
    END,
    tokens_used = student_analytics.tokens_used + EXCLUDED.tokens_used,
    activities = student_analytics.activities || EXCLUDED.activities;
END;
$$ LANGUAGE plpgsql;

-- Function to get class performance summary
CREATE OR REPLACE FUNCTION get_class_performance(
  p_teacher_id UUID,
  p_class_name TEXT
)
RETURNS TABLE (
  student_name TEXT,
  student_email TEXT,
  grade_level grade_level,
  total_progress DECIMAL,
  lessons_completed INTEGER,
  assessments_taken INTEGER,
  average_score DECIMAL,
  last_active TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.full_name as student_name,
    p.email as student_email,
    p.grade_level,
    COALESCE(AVG(sp.completion_percentage), 0) as total_progress,
    COALESCE(SUM(CASE WHEN sp.status IN ('completed', 'mastered') THEN 1 ELSE 0 END), 0)::INTEGER as lessons_completed,
    COALESCE(COUNT(asub.id), 0)::INTEGER as assessments_taken,
    COALESCE(AVG(asub.percentage), 0) as average_score,
    MAX(sp.last_accessed) as last_active
  FROM class_enrollments ce
  JOIN profiles p ON p.id = ce.student_id
  LEFT JOIN student_progress sp ON sp.student_id = ce.student_id
  LEFT JOIN assessment_submissions asub ON asub.student_id = ce.student_id
  WHERE ce.teacher_id = p_teacher_id 
    AND ce.class_name = p_class_name 
    AND ce.is_active = true
  GROUP BY p.id, p.full_name, p.email, p.grade_level
  ORDER BY p.full_name;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-enroll students in curriculum
CREATE OR REPLACE FUNCTION auto_enroll_student_curriculum(
  p_student_id UUID,
  p_grade_level grade_level
)
RETURNS VOID AS $$
DECLARE
  obj_record RECORD;
BEGIN
  -- Create progress records for all learning objectives in the grade level
  FOR obj_record IN
    SELECT obj.id as objective_id, la.id as area_id, s.id as strand_id, ss.id as sub_strand_id, lo.id as outcome_id
    FROM learning_areas la
    JOIN strands s ON s.learning_area_id = la.id
    JOIN sub_strands ss ON ss.strand_id = s.id
    JOIN learning_outcomes lo ON lo.sub_strand_id = ss.id
    JOIN learning_objectives obj ON obj.learning_outcome_id = lo.id
    WHERE la.grade_level = p_grade_level
  LOOP
    INSERT INTO student_progress (
      student_id,
      learning_area_id,
      strand_id,
      sub_strand_id,
      learning_outcome_id,
      learning_objective_id,
      status,
      completion_percentage
    )
    VALUES (
      p_student_id,
      obj_record.area_id,
      obj_record.strand_id,
      obj_record.sub_strand_id,
      obj_record.outcome_id,
      obj_record.objective_id,
      'not_started',
      0
    )
    ON CONFLICT (student_id, learning_objective_id) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

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

-- Trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role, grade_level, school_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    COALESCE((NEW.raw_user_meta_data->>'grade_level')::grade_level, NULL),
    COALESCE(NEW.raw_user_meta_data->>'school_name', '')
  );
  
  -- Auto-enroll student in curriculum if grade level is provided
  IF NEW.raw_user_meta_data->>'grade_level' IS NOT NULL THEN
    PERFORM auto_enroll_student_curriculum(
      NEW.id, 
      (NEW.raw_user_meta_data->>'grade_level')::grade_level
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger to update analytics when progress is updated
CREATE OR REPLACE FUNCTION update_analytics_on_progress()
RETURNS TRIGGER AS $$
DECLARE
  time_diff INTEGER;
BEGIN
  -- Calculate time difference if this is an update
  time_diff := COALESCE(NEW.time_spent_minutes, 0) - COALESCE(OLD.time_spent_minutes, 0);
  
  -- Update daily analytics
  PERFORM update_daily_analytics(
    NEW.student_id,
    CURRENT_DATE,
    GREATEST(time_diff, 0),
    CASE WHEN NEW.status IN ('completed', 'mastered') AND OLD.status NOT IN ('completed', 'mastered') THEN 1 ELSE 0 END,
    0, -- assessments taken (handled separately)
    0, -- average score (calculated separately)
    0, -- tokens used (handled separately)
    jsonb_build_array(
      jsonb_build_object(
        'type', 'progress_update',
        'objective_id', NEW.learning_objective_id,
        'status', NEW.status,
        'completion', NEW.completion_percentage,
        'timestamp', NOW()
      )
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS on_progress_updated ON student_progress;
CREATE TRIGGER on_progress_updated
  AFTER UPDATE ON student_progress
  FOR EACH ROW EXECUTE FUNCTION update_analytics_on_progress();

-- Trigger to update analytics when assessment is submitted
CREATE OR REPLACE FUNCTION update_analytics_on_assessment()
RETURNS TRIGGER AS $$
BEGIN
  -- Update daily analytics for assessment submission
  PERFORM update_daily_analytics(
    NEW.student_id,
    CURRENT_DATE,
    COALESCE(NEW.time_taken_minutes, 0),
    0, -- lessons completed
    1, -- assessments taken
    COALESCE(NEW.percentage, 0), -- average score
    0, -- tokens used
    jsonb_build_array(
      jsonb_build_object(
        'type', 'assessment_submission',
        'assessment_id', NEW.assessment_id,
        'score', NEW.percentage,
        'timestamp', NEW.submitted_at
      )
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS on_assessment_submitted ON assessment_submissions;
CREATE TRIGGER on_assessment_submitted
  AFTER INSERT ON assessment_submissions
  FOR EACH ROW EXECUTE FUNCTION update_analytics_on_assessment();

-- Trigger to update analytics when tutor session is created/updated
CREATE OR REPLACE FUNCTION update_analytics_on_tutor_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Update daily analytics for tutor session
  PERFORM update_daily_analytics(
    NEW.student_id,
    CURRENT_DATE,
    COALESCE(NEW.session_duration_minutes, 0),
    0, -- lessons completed
    0, -- assessments taken
    0, -- average score
    COALESCE(NEW.tokens_used, 0), -- tokens used
    jsonb_build_array(
      jsonb_build_object(
        'type', 'tutor_session',
        'session_id', NEW.id,
        'topic', NEW.topic,
        'duration', NEW.session_duration_minutes,
        'tokens', NEW.tokens_used,
        'timestamp', NEW.updated_at
      )
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS on_tutor_session_updated ON tutor_sessions;
CREATE TRIGGER on_tutor_session_updated
  AFTER INSERT OR UPDATE ON tutor_sessions
  FOR EACH ROW EXECUTE FUNCTION update_analytics_on_tutor_session();

-- Complete Database Setup for CBC Tutorbot Platform
-- This script creates all necessary tables, indexes, and initial data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS ai_interactions CASCADE;
DROP TABLE IF EXISTS student_progress CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS learning_materials CASCADE;
DROP TABLE IF EXISTS curriculum_outcomes CASCADE;
DROP TABLE IF EXISTS curriculum_sub_strands CASCADE;
DROP TABLE IF EXISTS curriculum_strands CASCADE;
DROP TABLE IF EXISTS curriculum_learning_areas CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'parent')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Create schools table
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    county VARCHAR(100),
    sub_county VARCHAR(100),
    type VARCHAR(50) DEFAULT 'primary' CHECK (type IN ('primary', 'secondary', 'mixed')),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 12),
    class_name VARCHAR(100),
    student_id VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    parent_contact VARCHAR(20),
    learning_preferences JSONB DEFAULT '{}',
    accessibility_needs TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create curriculum learning areas table
CREATE TABLE curriculum_learning_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    grade_levels INTEGER[] DEFAULT '{1,2,3,4,5,6,7,8}',
    color_code VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create curriculum strands table
CREATE TABLE curriculum_strands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learning_area_id UUID REFERENCES curriculum_learning_areas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    grade_levels INTEGER[] DEFAULT '{1,2,3,4,5,6,7,8}',
    sequence_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(learning_area_id, code)
);

-- Create curriculum sub-strands table
CREATE TABLE curriculum_sub_strands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strand_id UUID REFERENCES curriculum_strands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    grade_levels INTEGER[] DEFAULT '{1,2,3,4,5,6,7,8}',
    sequence_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(strand_id, code)
);

-- Create curriculum outcomes table
CREATE TABLE curriculum_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_strand_id UUID REFERENCES curriculum_sub_strands(id) ON DELETE CASCADE,
    grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 12),
    outcome_text TEXT NOT NULL,
    outcome_code VARCHAR(100),
    learning_indicators TEXT[],
    suggested_activities TEXT[],
    assessment_criteria TEXT[],
    resources TEXT[],
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    estimated_duration_minutes INTEGER DEFAULT 60,
    prerequisites TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning materials table
CREATE TABLE learning_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    material_type VARCHAR(50) DEFAULT 'lesson' CHECK (material_type IN ('lesson', 'worksheet', 'quiz', 'video', 'audio', 'image', 'document')),
    file_url TEXT,
    thumbnail_url TEXT,
    learning_area_id UUID REFERENCES curriculum_learning_areas(id) ON DELETE SET NULL,
    strand_id UUID REFERENCES curriculum_strands(id) ON DELETE SET NULL,
    sub_strand_id UUID REFERENCES curriculum_sub_strands(id) ON DELETE SET NULL,
    outcome_id UUID REFERENCES curriculum_outcomes(id) ON DELETE SET NULL,
    grade_levels INTEGER[] DEFAULT '{1,2,3,4,5,6,7,8}',
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    duration_minutes INTEGER DEFAULT 30,
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessments table
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assessment_type VARCHAR(50) DEFAULT 'quiz' CHECK (assessment_type IN ('quiz', 'test', 'exam', 'assignment', 'project')),
    questions JSONB NOT NULL DEFAULT '[]',
    answer_key JSONB DEFAULT '{}',
    total_marks INTEGER DEFAULT 0,
    passing_marks INTEGER DEFAULT 0,
    time_limit_minutes INTEGER,
    learning_area_id UUID REFERENCES curriculum_learning_areas(id) ON DELETE SET NULL,
    strand_id UUID REFERENCES curriculum_strands(id) ON DELETE SET NULL,
    sub_strand_id UUID REFERENCES curriculum_sub_strands(id) ON DELETE SET NULL,
    outcome_id UUID REFERENCES curriculum_outcomes(id) ON DELETE SET NULL,
    grade_levels INTEGER[] DEFAULT '{1,2,3,4,5,6,7,8}',
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    instructions TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz attempts table
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    answers JSONB DEFAULT '{}',
    score INTEGER DEFAULT 0,
    total_marks INTEGER DEFAULT 0,
    percentage DECIMAL(5,2) DEFAULT 0.00,
    time_taken_minutes INTEGER,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT false,
    feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student progress table
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    learning_area_id UUID REFERENCES curriculum_learning_areas(id) ON DELETE CASCADE,
    strand_id UUID REFERENCES curriculum_strands(id) ON DELETE SET NULL,
    sub_strand_id UUID REFERENCES curriculum_sub_strands(id) ON DELETE SET NULL,
    outcome_id UUID REFERENCES curriculum_outcomes(id) ON DELETE SET NULL,
    grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 12),
    mastery_level DECIMAL(5,2) DEFAULT 0.00 CHECK (mastery_level BETWEEN 0 AND 100),
    attempts_count INTEGER DEFAULT 0,
    total_time_minutes INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    strengths TEXT[],
    weaknesses TEXT[],
    recommendations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, learning_area_id, strand_id, sub_strand_id, outcome_id, grade_level)
);

-- Create AI interactions table
CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    interaction_type VARCHAR(50) DEFAULT 'chat' CHECK (interaction_type IN ('chat', 'tutor', 'assessment', 'feedback', 'content_generation')),
    prompt TEXT NOT NULL,
    response TEXT,
    context JSONB DEFAULT '{}',
    learning_area_id UUID REFERENCES curriculum_learning_areas(id) ON DELETE SET NULL,
    strand_id UUID REFERENCES curriculum_strands(id) ON DELETE SET NULL,
    grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 12),
    ai_model VARCHAR(100) DEFAULT 'gpt-4',
    tokens_used INTEGER DEFAULT 0,
    response_time_ms INTEGER,
    quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_school_id ON user_profiles(school_id);
CREATE INDEX idx_user_profiles_grade_level ON user_profiles(grade_level);
CREATE INDEX idx_curriculum_strands_learning_area ON curriculum_strands(learning_area_id);
CREATE INDEX idx_curriculum_sub_strands_strand ON curriculum_sub_strands(strand_id);
CREATE INDEX idx_curriculum_outcomes_sub_strand ON curriculum_outcomes(sub_strand_id);
CREATE INDEX idx_curriculum_outcomes_grade ON curriculum_outcomes(grade_level);
CREATE INDEX idx_learning_materials_learning_area ON learning_materials(learning_area_id);
CREATE INDEX idx_learning_materials_grade_levels ON learning_materials USING GIN(grade_levels);
CREATE INDEX idx_assessments_learning_area ON assessments(learning_area_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_assessment ON quiz_attempts(assessment_id);
CREATE INDEX idx_student_progress_user ON student_progress(user_id);
CREATE INDEX idx_student_progress_learning_area ON student_progress(learning_area_id);
CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_type ON ai_interactions(interaction_type);
CREATE INDEX idx_ai_interactions_created ON ai_interactions(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_curriculum_learning_areas_updated_at BEFORE UPDATE ON curriculum_learning_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_curriculum_strands_updated_at BEFORE UPDATE ON curriculum_strands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_curriculum_sub_strands_updated_at BEFORE UPDATE ON curriculum_sub_strands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_curriculum_outcomes_updated_at BEFORE UPDATE ON curriculum_outcomes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_materials_updated_at BEFORE UPDATE ON learning_materials FOR EACH ROW EXECUTE FUNCTION update_learning_materials_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_assessments_updated_at_column();
CREATE TRIGGER update_quiz_attempts_updated_at BEFORE UPDATE ON quiz_attempts FOR EACH ROW EXECUTE FUNCTION update_quiz_attempts_updated_at_column();
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress FOR EACH ROW EXECUTE FUNCTION update_student_progress_updated_at_column();
CREATE TRIGGER update_ai_interactions_updated_at BEFORE UPDATE ON ai_interactions FOR EACH ROW EXECUTE FUNCTION update_ai_interactions_updated_at_column();

-- Insert sample data
INSERT INTO schools (name, code, county, sub_county, type) VALUES
('Nairobi Primary School', 'NPS001', 'Nairobi', 'Westlands', 'primary'),
('Mombasa Academy', 'MBA002', 'Mombasa', 'Mvita', 'primary'),
('Kisumu Learning Center', 'KLC003', 'Kisumu', 'Kisumu East', 'primary');

-- Insert CBC Learning Areas
INSERT INTO curriculum_learning_areas (name, code, description, grade_levels, color_code, icon) VALUES
('Mathematics', 'MATH', 'Mathematical concepts and problem-solving skills', '{1,2,3,4,5,6,7,8}', '#FF6B6B', 'calculator'),
('English', 'ENG', 'Language and literacy development', '{1,2,3,4,5,6,7,8}', '#4ECDC4', 'book-open'),
('Kiswahili', 'KIS', 'Kiswahili language development', '{1,2,3,4,5,6,7,8}', '#45B7D1', 'globe'),
('Science and Technology', 'SCI', 'Scientific inquiry and technological literacy', '{1,2,3,4,5,6,7,8}', '#96CEB4', 'microscope'),
('Social Studies', 'SS', 'Understanding society and environment', '{1,2,3,4,5,6,7,8}', '#FFEAA7', 'users'),
('Creative Arts', 'CA', 'Artistic expression and creativity', '{1,2,3,4,5,6,7,8}', '#DDA0DD', 'palette'),
('Physical and Health Education', 'PHE', 'Physical fitness and health awareness', '{1,2,3,4,5,6,7,8}', '#98D8C8', 'heart'),
('Religious Education', 'RE', 'Moral and spiritual development', '{1,2,3,4,5,6,7,8}', '#F7DC6F', 'book');

COMMIT;
