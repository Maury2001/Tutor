-- Function to get AI interaction summary statistics
CREATE OR REPLACE FUNCTION get_ai_interaction_summary(
  p_teacher_id UUID,
  p_days INTEGER DEFAULT 30,
  p_class_id UUID DEFAULT NULL,
  p_learning_area_id UUID DEFAULT NULL
)
RETURNS TABLE (
  total_interactions INTEGER,
  total_students INTEGER,
  avg_interactions_per_student NUMERIC,
  avg_tokens_per_interaction NUMERIC,
  total_time_minutes INTEGER,
  learning_area_distribution JSONB
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH teacher_students AS (
    SELECT DISTINCT s.id
    FROM profiles s
    JOIN classes c ON s.class_id = c.id
    WHERE c.teacher_id = p_teacher_id
    AND s.role = 'student'
    AND (p_class_id IS NULL OR s.class_id = p_class_id)
  ),
  filtered_interactions AS (
    SELECT 
      li.*,
      la.name as learning_area_name
    FROM learning_interactions li
    JOIN teacher_students ts ON li.user_id = ts.id
    LEFT JOIN learning_areas la ON li.learning_area_id = la.id
    WHERE li.created_at >= NOW() - (p_days || ' days')::INTERVAL
    AND li.interaction_type = 'ai_tutoring'
    AND (p_learning_area_id IS NULL OR li.learning_area_id = p_learning_area_id)
  ),
  area_distribution AS (
    SELECT 
      learning_area_id,
      learning_area_name,
      COUNT(*) as count
    FROM filtered_interactions
    WHERE learning_area_id IS NOT NULL
    GROUP BY learning_area_id, learning_area_name
  )
  SELECT
    COUNT(fi.*)::INTEGER as total_interactions,
    COUNT(DISTINCT fi.user_id)::INTEGER as total_students,
    ROUND(COUNT(fi.*)::NUMERIC / NULLIF(COUNT(DISTINCT fi.user_id), 0), 2) as avg_interactions_per_student,
    ROUND(AVG(fi.tokens_used), 2) as avg_tokens_per_interaction,
    SUM(fi.duration_seconds)::INTEGER / 60 as total_time_minutes,
    COALESCE(
      jsonb_object_agg(ad.learning_area_name, ad.count),
      '{}'::jsonb
    ) as learning_area_distribution
  FROM filtered_interactions fi
  LEFT JOIN area_distribution ad ON true
  GROUP BY true;
END;
$$;

-- Function to get popular AI topics
CREATE OR REPLACE FUNCTION get_popular_ai_topics(
  p_teacher_id UUID,
  p_days INTEGER DEFAULT 30,
  p_class_id UUID DEFAULT NULL,
  p_learning_area_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  topic TEXT,
  count INTEGER,
  learning_area_id UUID,
  learning_area_name TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH teacher_students AS (
    SELECT DISTINCT s.id
    FROM profiles s
    JOIN classes c ON s.class_id = c.id
    WHERE c.teacher_id = p_teacher_id
    AND s.role = 'student'
    AND (p_class_id IS NULL OR s.class_id = p_class_id)
  )
  SELECT
    li.content_summary as topic,
    COUNT(*)::INTEGER as count,
    li.learning_area_id,
    la.name as learning_area_name
  FROM learning_interactions li
  JOIN teacher_students ts ON li.user_id = ts.id
  LEFT JOIN learning_areas la ON li.learning_area_id = la.id
  WHERE li.created_at >= NOW() - (p_days || ' days')::INTERVAL
  AND li.interaction_type = 'ai_tutoring'
  AND (p_learning_area_id IS NULL OR li.learning_area_id = p_learning_area_id)
  GROUP BY li.content_summary, li.learning_area_id, la.name
  ORDER BY count DESC
  LIMIT p_limit;
END;
$$;

-- Function to get student engagement with AI
CREATE OR REPLACE FUNCTION get_student_ai_engagement(
  p_teacher_id UUID,
  p_days INTEGER DEFAULT 30,
  p_class_id UUID DEFAULT NULL
)
RETURNS TABLE (
  student_id UUID,
  student_name TEXT,
  grade_level TEXT,
  avatar_url TEXT,
  total_interactions INTEGER,
  total_time_minutes INTEGER,
  last_interaction TIMESTAMP,
  favorite_learning_area TEXT,
  average_session_minutes NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH teacher_students AS (
    SELECT DISTINCT s.id, s.full_name, s.grade_level, s.avatar_url
    FROM profiles s
    JOIN classes c ON s.class_id = c.id
    WHERE c.teacher_id = p_teacher_id
    AND s.role = 'student'
    AND (p_class_id IS NULL OR s.class_id = p_class_id)
  ),
  student_interactions AS (
    SELECT 
      ts.id as student_id,
      COUNT(li.*) as total_interactions,
      SUM(li.duration_seconds) / 60 as total_time_minutes,
      MAX(li.created_at) as last_interaction,
      AVG(li.duration_seconds) / 60 as average_session_minutes
    FROM teacher_students ts
    LEFT JOIN learning_interactions li ON ts.id = li.user_id
    WHERE (li.id IS NULL OR (
      li.created_at >= NOW() - (p_days || ' days')::INTERVAL
      AND li.interaction_type = 'ai_tutoring'
    ))
    GROUP BY ts.id
  ),
  favorite_areas AS (
    SELECT 
      li.user_id,
      la.name as learning_area_name,
      COUNT(*) as area_count,
      ROW_NUMBER() OVER (PARTITION BY li.user_id ORDER BY COUNT(*) DESC) as rn
    FROM learning_interactions li
    JOIN learning_areas la ON li.learning_area_id = la.id
    WHERE li.created_at >= NOW() - (p_days || ' days')::INTERVAL
    AND li.interaction_type = 'ai_tutoring'
    AND li.learning_area_id IS NOT NULL
    GROUP BY li.user_id, la.name
  )
  SELECT
    ts.id as student_id,
    ts.full_name as student_name,
    ts.grade_level,
    ts.avatar_url,
    COALESCE(si.total_interactions, 0)::INTEGER as total_interactions,
    COALESCE(si.total_time_minutes, 0)::INTEGER as total_time_minutes,
    si.last_interaction,
    fa.learning_area_name as favorite_learning_area,
    ROUND(COALESCE(si.average_session_minutes, 0), 2) as average_session_minutes
  FROM teacher_students ts
  LEFT JOIN student_interactions si ON ts.id = si.student_id
  LEFT JOIN favorite_areas fa ON ts.id = fa.user_id AND fa.rn = 1
  ORDER BY si.total_interactions DESC NULLS LAST;
END;
$$;

-- Create the learning_interactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS learning_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  learning_area_id UUID REFERENCES learning_areas(id),
  strand_id UUID REFERENCES strands(id),
  grade_level TEXT NOT NULL,
  interaction_type TEXT NOT NULL,
  content_summary TEXT,
  tokens_used INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_learning_interactions_user_id ON learning_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_interactions_learning_area_id ON learning_interactions(learning_area_id);
CREATE INDEX IF NOT EXISTS idx_learning_interactions_created_at ON learning_interactions(created_at);
