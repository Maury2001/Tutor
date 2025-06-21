-- Create triggers for automatic updates

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
