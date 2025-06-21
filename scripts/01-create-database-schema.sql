-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE grade_level AS ENUM (
  'playgroup', 'pp1', 'pp2', 'grade1', 'grade2', 'grade3', 
  'grade4', 'grade5', 'grade6', 'grade7', 'grade8', 'grade9'
);

CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'parent');

CREATE TYPE assessment_type AS ENUM ('formative', 'summative', 'practical', 'project');

CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'mastered');

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
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
CREATE TABLE learning_areas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  grade_level grade_level NOT NULL,
  weekly_lessons INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strands table
CREATE TABLE strands (
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
CREATE TABLE sub_strands (
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
CREATE TABLE learning_outcomes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sub_strand_id UUID REFERENCES sub_strands(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  sequence_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sub_strand_id, code)
);

-- Learning Objectives table
CREATE TABLE learning_objectives (
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
CREATE TABLE materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT, -- 'pdf', 'video', 'audio', 'interactive', 'simulation'
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
CREATE TABLE assessments (
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
CREATE TABLE student_progress (
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
CREATE TABLE assessment_submissions (
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
CREATE TABLE practical_projects (
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
CREATE TABLE project_submissions (
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
CREATE TABLE tutor_sessions (
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
CREATE TABLE student_analytics (
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
CREATE TABLE class_enrollments (
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

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_grade_level ON profiles(grade_level);
CREATE INDEX idx_learning_areas_grade ON learning_areas(grade_level);
CREATE INDEX idx_materials_grade_area ON materials(grade_level, learning_area_id);
CREATE INDEX idx_student_progress_student ON student_progress(student_id);
CREATE INDEX idx_student_progress_objective ON student_progress(learning_objective_id);
CREATE INDEX idx_assessment_submissions_student ON assessment_submissions(student_id);
CREATE INDEX idx_tutor_sessions_student ON tutor_sessions(student_id);
CREATE INDEX idx_student_analytics_date ON student_analytics(student_id, date);
CREATE INDEX idx_class_enrollments_teacher ON class_enrollments(teacher_id);
CREATE INDEX idx_class_enrollments_student ON class_enrollments(student_id);

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
