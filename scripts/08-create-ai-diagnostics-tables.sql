-- Create table for AI diagnostics
CREATE TABLE IF NOT EXISTS ai_diagnostics (
  id SERIAL PRIMARY KEY,
  api_key_status BOOLEAN NOT NULL,
  network_status BOOLEAN NOT NULL,
  implementation_status BOOLEAN NOT NULL,
  database_status BOOLEAN NOT NULL,
  overall_status TEXT NOT NULL,
  details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create table for AI error logs
CREATE TABLE IF NOT EXISTS ai_error_logs (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  component TEXT,
  endpoint TEXT,
  status_code INTEGER,
  request_id TEXT,
  model_name TEXT,
  additional_info JSONB,
  stack_trace TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on error type for faster filtering
CREATE INDEX IF NOT EXISTS idx_ai_error_logs_type ON ai_error_logs(type);

-- Create index on creation date for time-based queries
CREATE INDEX IF NOT EXISTS idx_ai_error_logs_created_at ON ai_error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_diagnostics_created_at ON ai_diagnostics(created_at);

-- Create view for error summary
CREATE OR REPLACE VIEW ai_error_summary AS
SELECT
  type,
  COUNT(*) as error_count,
  MIN(created_at) as first_occurrence,
  MAX(created_at) as last_occurrence
FROM ai_error_logs
GROUP BY type
ORDER BY error_count DESC;

-- Create function to get recent errors
CREATE OR REPLACE FUNCTION get_recent_ai_errors(hours_ago INTEGER DEFAULT 24)
RETURNS TABLE (
  id INTEGER,
  message TEXT,
  type TEXT,
  component TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.message,
    e.type,
    e.component,
    e.created_at
  FROM 
    ai_error_logs e
  WHERE 
    e.created_at >= NOW() - (hours_ago * INTERVAL '1 hour')
  ORDER BY 
    e.created_at DESC;
END;
$$ LANGUAGE plpgsql;
