-- Create database functions for complex queries

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
