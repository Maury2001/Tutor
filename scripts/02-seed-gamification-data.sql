-- Seed Gamification Data

-- Insert Badges
INSERT INTO badges (name, description, icon, category, rarity, requirements, points) VALUES
('First Steps', 'Complete your first lesson', '🎯', 'milestone', 'common', '[{"type": "lessons_completed", "value": 1}]', 10),
('Quick Learner', 'Complete 5 lessons in one day', '⚡', 'streak', 'rare', '[{"type": "daily_lessons", "value": 5}]', 25),
('Dedicated Student', 'Study for 7 consecutive days', '📚', 'streak', 'rare', '[{"type": "streak_days", "value": 7}]', 50),
('Science Explorer', 'Complete 10 science lessons', '🔬', 'subject', 'rare', '[{"type": "subject_lessons", "subject": "science", "value": 10}]', 30),
('Math Wizard', 'Score 90% or higher on 5 math assessments', '🧮', 'subject', 'epic', '[{"type": "subject_score", "subject": "math", "score": 90, "count": 5}]', 75),
('Assessment Ace', 'Complete 25 assessments', '🏆', 'milestone', 'epic', '[{"type": "assessments_completed", "value": 25}]', 100),
('Tutor Chat Champion', 'Have 50 tutor conversations', '💬', 'special', 'epic', '[{"type": "tutor_sessions", "value": 50}]', 80),
('Knowledge Seeker', 'Earn 1000 total points', '🎓', 'milestone', 'legendary', '[{"type": "total_points", "value": 1000}]', 150),
('Consistency King', 'Maintain a 30-day learning streak', '👑', 'streak', 'legendary', '[{"type": "streak_days", "value": 30}]', 200),
('Unstoppable', 'Reach level 10', '🚀', 'special', 'legendary', '[{"type": "level", "value": 10}]', 300)
ON CONFLICT (name) DO NOTHING;

-- Insert Achievements
INSERT INTO achievements (name, description, icon, category, points, requirements, is_secret) VALUES
('Welcome Aboard', 'Complete your profile setup', '👋', 'getting_started', 5, '[{"type": "profile_complete", "value": 1}]', false),
('First Victory', 'Score 100% on any assessment', '🎯', 'assessment', 20, '[{"type": "perfect_score", "value": 1}]', false),
('Speed Demon', 'Complete a lesson in under 5 minutes', '💨', 'special', 15, '[{"type": "lesson_time", "value": 5, "operator": "less_than"}]', false),
('Night Owl', 'Study between 10 PM and 6 AM', '🦉', 'special', 10, '[{"type": "study_time", "start": "22:00", "end": "06:00"}]', true),
('Early Bird', 'Study before 7 AM', '🐦', 'special', 10, '[{"type": "study_time", "start": "05:00", "end": "07:00"}]', true),
('Weekend Warrior', 'Study on both Saturday and Sunday', '⚔️', 'streak', 25, '[{"type": "weekend_study", "value": 1}]', false),
('Perfectionist', 'Score 100% on 10 assessments', '💯', 'assessment', 100, '[{"type": "perfect_scores", "value": 10}]', false),
('Curious Mind', 'Ask 100 questions to the tutor', '❓', 'tutor', 50, '[{"type": "tutor_questions", "value": 100}]', false),
('Subject Master', 'Complete all lessons in any subject', '🎓', 'curriculum', 150, '[{"type": "subject_complete", "value": 1}]', false),
('Grade Champion', 'Complete 80% of your grade curriculum', '🏅', 'curriculum', 200, '[{"type": "grade_progress", "value": 80}]', false),
('Social Butterfly', 'Share 5 achievements', '🦋', 'social', 30, '[{"type": "achievements_shared", "value": 5}]', true),
('Helping Hand', 'Help 3 classmates with questions', '🤝', 'social', 40, '[{"type": "peer_help", "value": 3}]', true),
('Time Master', 'Study for exactly 60 minutes in one session', '⏰', 'special', 35, '[{"type": "session_duration", "value": 60}]', true),
('Comeback Kid', 'Improve assessment score by 30% after retaking', '📈', 'improvement', 45, '[{"type": "score_improvement", "value": 30}]', false),
('Explorer', 'Try all learning areas available for your grade', '🗺️', 'curriculum', 60, '[{"type": "areas_explored", "value": "all"}]', false)
ON CONFLICT (name) DO NOTHING;

-- Create some sample user points for demonstration (these would normally be created by triggers)
-- Note: These are just examples and would be created automatically when users interact with the system
