-- Supabase Setup Script for CBC Tutorbot Platform
-- Run this script in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'parent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE grade_level AS ENUM (
        'playgroup', 'pp1', 'pp2', 
        'grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6',
        'grade7', 'grade8', 'grade9'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'mastered');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'student',
    grade_level grade_level,
    school_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning areas table
CREATE TABLE IF NOT EXISTS public.learning_areas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    grade_level grade_level NOT NULL,
    weekly_lessons INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student progress table
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    learning_area_id UUID REFERENCES public.learning_areas(id),
    strand_id UUID,
    sub_strand_id UUID,
    learning_outcome_id UUID,
    learning_objective_id UUID,
    status progress_status DEFAULT 'not_started',
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student analytics table
CREATE TABLE IF NOT EXISTS public.student_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_time_minutes INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    assessments_taken INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    activities JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- Create AI interactions table
CREATE TABLE IF NOT EXISTS public.ai_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    learning_area_id UUID REFERENCES public.learning_areas(id),
    grade_level grade_level,
    ai_model TEXT DEFAULT 'gpt-4o',
    tokens_used INTEGER DEFAULT 0,
    response_time_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Learning areas: Public read access
CREATE POLICY "Learning areas are publicly readable" ON public.learning_areas
    FOR SELECT USING (true);

-- Student progress: Students can only see their own progress
CREATE POLICY "Students can view own progress" ON public.student_progress
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can update own progress" ON public.student_progress
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can modify own progress" ON public.student_progress
    FOR UPDATE USING (auth.uid() = student_id);

-- Student analytics: Students can only see their own analytics
CREATE POLICY "Students can view own analytics" ON public.student_analytics
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own analytics" ON public.student_analytics
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- AI interactions: Users can only see their own interactions
CREATE POLICY "Users can view own AI interactions" ON public.ai_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI interactions" ON public.ai_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.student_progress
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample learning areas
INSERT INTO public.learning_areas (code, name, description, grade_level, weekly_lessons) VALUES
('ENG-G1', 'English Activities', 'English language learning activities', 'grade1', 5),
('KIS-G1', 'Kiswahili', 'Kiswahili language activities', 'grade1', 5),
('MATH-G1', 'Mathematical Activities', 'Mathematics learning activities', 'grade1', 5),
('ENV-G1', 'Environmental Activities', 'Environmental studies', 'grade1', 3),
('CRE-G1', 'Christian Religious Education', 'Christian religious studies', 'grade1', 2),
('MOVE-G1', 'Movement and Creative Activities', 'Physical education and creative arts', 'grade1', 3)
ON CONFLICT (code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_grade_level ON public.profiles(grade_level);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON public.student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_status ON public.student_progress(status);
CREATE INDEX IF NOT EXISTS idx_student_analytics_student_date ON public.student_analytics(student_id, date);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON public.ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON public.ai_interactions(created_at);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

COMMIT;
