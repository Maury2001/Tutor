-- Extended CBC Curriculum Data for All Grade Levels
-- This script adds comprehensive curriculum data for grades 1-12

-- Insert additional learning areas for higher grades
INSERT INTO curriculum_learning_areas (name, code, description, grade_levels, weekly_lessons, is_core) VALUES
('Pure Mathematics', 'PMATH', 'Advanced mathematics for senior secondary', '{10,11,12}', 6, true),
('Applied Mathematics', 'AMATH', 'Practical mathematics applications', '{10,11,12}', 5, false),
('Physics', 'PHYS', 'Physical sciences', '{7,8,9,10,11,12}', 5, true),
('Chemistry', 'CHEM', 'Chemical sciences', '{7,8,9,10,11,12}', 5, true),
('Biology', 'BIO', 'Life sciences', '{7,8,9,10,11,12}', 5, true),
('Computer Science', 'CS', 'Computing and programming', '{7,8,9,10,11,12}', 4, false),
('Business Studies', 'BUS', 'Business and entrepreneurship', '{7,8,9,10,11,12}', 3, false),
('Geography', 'GEO', 'Physical and human geography', '{4,5,6,7,8,9,10,11,12}', 3, false),
('History', 'HIST', 'Historical studies', '{4,5,6,7,8,9,10,11,12}', 3, false),
('Religious Education', 'RE', 'Religious and moral education', '{1,2,3,4,5,6,7,8,9,10,11,12}', 2, false),
('Physical Education', 'PE', 'Physical fitness and sports', '{1,2,3,4,5,6,7,8,9,10,11,12}', 3, true),
('Creative Arts', 'ART', 'Visual and performing arts', '{1,2,3,4,5,6,7,8,9,10,11,12}', 3, false);

-- Physics Strands for Grades 7-12
INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Mechanics', 'MECH', 'Motion, forces, and energy', '{7,8,9,10,11,12}', 1 
FROM curriculum_learning_areas WHERE code = 'PHYS';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Waves and Sound', 'WAVE', 'Wave properties and sound phenomena', '{8,9,10,11,12}', 2 
FROM curriculum_learning_areas WHERE code = 'PHYS';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Electricity and Magnetism', 'ELEC', 'Electrical and magnetic phenomena', '{9,10,11,12}', 3 
FROM curriculum_learning_areas WHERE code = 'PHYS';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Modern Physics', 'MOD', 'Quantum physics and relativity', '{11,12}', 4 
FROM curriculum_learning_areas WHERE code = 'PHYS';

-- Chemistry Strands for Grades 7-12
INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Matter and Structure', 'MATT', 'Atomic structure and chemical bonding', '{7,8,9,10,11,12}', 1 
FROM curriculum_learning_areas WHERE code = 'CHEM';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Chemical Reactions', 'REACT', 'Types and mechanisms of chemical reactions', '{8,9,10,11,12}', 2 
FROM curriculum_learning_areas WHERE code = 'CHEM';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Organic Chemistry', 'ORG', 'Carbon compounds and their reactions', '{10,11,12}', 3 
FROM curriculum_learning_areas WHERE code = 'CHEM';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Physical Chemistry', 'PCHEM', 'Thermodynamics and kinetics', '{11,12}', 4 
FROM curriculum_learning_areas WHERE code = 'CHEM';

-- Biology Strands for Grades 7-12
INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Cell Biology', 'CELL', 'Cell structure and function', '{7,8,9,10,11,12}', 1 
FROM curriculum_learning_areas WHERE code = 'BIO';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Genetics', 'GEN', 'Heredity and genetic variation', '{9,10,11,12}', 2 
FROM curriculum_learning_areas WHERE code = 'BIO';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Evolution', 'EVOL', 'Evolution and natural selection', '{10,11,12}', 3 
FROM curriculum_learning_areas WHERE code = 'BIO';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Ecology', 'ECO', 'Ecosystems and environmental biology', '{8,9,10,11,12}', 4 
FROM curriculum_learning_areas WHERE code = 'BIO';

-- Pure Mathematics Strands for Grades 10-12
INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Calculus', 'CALC', 'Differential and integral calculus', '{10,11,12}', 1 
FROM curriculum_learning_areas WHERE code = 'PMATH';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Advanced Algebra', 'AALG', 'Complex numbers and advanced algebraic structures', '{10,11,12}', 2 
FROM curriculum_learning_areas WHERE code = 'PMATH';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Statistics and Probability', 'STAT', 'Advanced statistical methods', '{10,11,12}', 3 
FROM curriculum_learning_areas WHERE code = 'PMATH';

-- Computer Science Strands for Grades 7-12
INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Programming Fundamentals', 'PROG', 'Basic programming concepts', '{7,8,9,10,11,12}', 1 
FROM curriculum_learning_areas WHERE code = 'CS';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Data Structures', 'DATA', 'Organizing and managing data', '{9,10,11,12}', 2 
FROM curriculum_learning_areas WHERE code = 'CS';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Computer Systems', 'SYS', 'Hardware and software systems', '{8,9,10,11,12}', 3 
FROM curriculum_learning_areas WHERE code = 'CS';

-- Sample outcomes for Grade 10 Pure Mathematics
INSERT INTO curriculum_outcomes (sub_strand_id, grade_level, outcome_text, outcome_code, learning_indicators, suggested_activities, assessment_criteria)
SELECT 
    ss.id,
    10,
    'By the end of Grade 10, the learner should be able to find limits of functions and understand continuity.',
    'PMATH.CALC.LIM.10.1',
    ARRAY['Calculates limits using algebraic methods', 'Identifies discontinuities', 'Applies limit theorems', 'Solves limit problems graphically'],
    ARRAY['Limit calculation exercises', 'Graphical analysis', 'Real-world applications', 'Technology-assisted exploration'],
    ARRAY['Correctly applies limit rules', 'Identifies types of discontinuities', 'Explains limit concepts clearly', 'Solves complex limit problems']
FROM curriculum_sub_strands ss
JOIN curriculum_strands s ON ss.strand_id = s.id
JOIN curriculum_learning_areas la ON s.learning_area_id = la.id
WHERE la.code = 'PMATH' AND s.code = 'CALC' AND ss.name LIKE '%Limits%';

-- Sample outcomes for Grade 11 Physics
INSERT INTO curriculum_outcomes (sub_strand_id, grade_level, outcome_text, outcome_code, learning_indicators, suggested_activities, assessment_criteria)
SELECT 
    ss.id,
    11,
    'By the end of Grade 11, the learner should be able to analyze electromagnetic phenomena and apply electromagnetic laws.',
    'PHYS.ELEC.EM.11.1',
    ARRAY['Applies Faraday''s law', 'Calculates induced EMF', 'Explains electromagnetic induction', 'Designs simple electromagnetic devices'],
    ARRAY['Laboratory experiments', 'Electromagnetic simulations', 'Device construction projects', 'Problem-solving exercises'],
    ARRAY['Correctly applies electromagnetic laws', 'Explains phenomena scientifically', 'Designs functional devices', 'Solves quantitative problems']
FROM curriculum_sub_strands ss
JOIN curriculum_strands s ON ss.strand_id = s.id
JOIN curriculum_learning_areas la ON s.learning_area_id = la.id
WHERE la.code = 'PHYS' AND s.code = 'ELEC';

-- Sample outcomes for Grade 12 Chemistry
INSERT INTO curriculum_outcomes (sub_strand_id, grade_level, outcome_text, outcome_code, learning_indicators, suggested_activities, assessment_criteria)
SELECT 
    ss.id,
    12,
    'By the end of Grade 12, the learner should be able to predict and explain organic reaction mechanisms.',
    'CHEM.ORG.MECH.12.1',
    ARRAY['Identifies reaction mechanisms', 'Predicts reaction products', 'Explains stereochemistry', 'Designs synthetic pathways'],
    ARRAY['Mechanism drawing exercises', 'Synthesis planning', 'Stereochemistry models', 'Research projects'],
    ARRAY['Correctly draws mechanisms', 'Predicts products accurately', 'Explains stereochemical outcomes', 'Designs efficient syntheses']
FROM curriculum_sub_strands ss
JOIN curriculum_strands s ON ss.strand_id = s.id
JOIN curriculum_learning_areas la ON s.learning_area_id = la.id
WHERE la.code = 'CHEM' AND s.code = 'ORG';

-- Add sub-strands for the new strands
INSERT INTO curriculum_sub_strands (strand_id, name, code, description, grade_levels, sequence_order)
SELECT id, 'Limits and Continuity', 'LIM', 'Understanding limits and continuous functions', '{10,11,12}', 1
FROM curriculum_strands WHERE code = 'CALC';

INSERT INTO curriculum_sub_strands (strand_id, name, code, description, grade_levels, sequence_order)
SELECT id, 'Derivatives', 'DERIV', 'Differentiation and applications', '{10,11,12}', 2
FROM curriculum_strands WHERE code = 'CALC';

INSERT INTO curriculum_sub_strands (strand_id, name, code, description, grade_levels, sequence_order)
SELECT id, 'Integrals', 'INT', 'Integration and applications', '{11,12}', 3
FROM curriculum_strands WHERE code = 'CALC';

INSERT INTO curriculum_sub_strands (strand_id, name, code, description, grade_levels, sequence_order)
SELECT id, 'Electromagnetic Induction', 'EMI', 'Faraday''s law and applications', '{11,12}', 1
FROM curriculum_strands WHERE code = 'ELEC';

INSERT INTO curriculum_sub_strands (strand_id, name, code, description, grade_levels, sequence_order)
SELECT id, 'AC Circuits', 'AC', 'Alternating current analysis', '{11,12}', 2
FROM curriculum_strands WHERE code = 'ELEC';

INSERT INTO curriculum_sub_strands (strand_id, name, code, description, grade_levels, sequence_order)
SELECT id, 'Reaction Mechanisms', 'MECH', 'Organic reaction mechanisms', '{11,12}', 1
FROM curriculum_strands WHERE code = 'ORG';

INSERT INTO curriculum_sub_strands (strand_id, name, code, description, grade_levels, sequence_order)
SELECT id, 'Functional Groups', 'FUNC', 'Organic functional groups and reactions', '{10,11,12}', 2
FROM curriculum_strands WHERE code = 'ORG';

-- Update curriculum statistics
UPDATE curriculum_learning_areas SET 
    total_strands = (SELECT COUNT(*) FROM curriculum_strands WHERE learning_area_id = curriculum_learning_areas.id),
    total_outcomes = (
        SELECT COUNT(*) 
        FROM curriculum_outcomes co
        JOIN curriculum_sub_strands ss ON co.sub_strand_id = ss.id
        JOIN curriculum_strands s ON ss.strand_id = s.id
        WHERE s.learning_area_id = curriculum_learning_areas.id
    );

-- Insert sample assessment data for higher grades
INSERT INTO student_assessments (student_id, learning_area_id, assessment_type, grade_level, score, max_score, assessment_date, feedback)
SELECT 
    u.id,
    la.id,
    'Quiz',
    10,
    FLOOR(RANDOM() * 30 + 70)::INTEGER, -- Random score between 70-100
    100,
    CURRENT_DATE - INTERVAL '1 day' * FLOOR(RANDOM() * 30),
    'Good understanding of calculus concepts. Continue practicing limit problems.'
FROM users u
CROSS JOIN curriculum_learning_areas la
WHERE u.role = 'student' 
AND u.grade_level IN (10, 11, 12)
AND la.code IN ('PMATH', 'PHYS', 'CHEM', 'BIO')
AND RANDOM() < 0.3; -- Only 30% chance for each combination

-- Insert progress tracking for all grades
INSERT INTO student_progress (student_id, learning_area_id, strand_id, sub_strand_id, outcome_id, progress_percentage, mastery_level, last_activity_date)
SELECT 
    u.id,
    la.id,
    s.id,
    ss.id,
    co.id,
    FLOOR(RANDOM() * 40 + 60)::INTEGER, -- Random progress between 60-100%
    CASE 
        WHEN RANDOM() < 0.3 THEN 'beginner'
        WHEN RANDOM() < 0.7 THEN 'intermediate'
        ELSE 'advanced'
    END,
    CURRENT_DATE - INTERVAL '1 day' * FLOOR(RANDOM() * 7)
FROM users u
CROSS JOIN curriculum_learning_areas la
CROSS JOIN curriculum_strands s
CROSS JOIN curriculum_sub_strands ss
CROSS JOIN curriculum_outcomes co
WHERE u.role = 'student'
AND s.learning_area_id = la.id
AND ss.strand_id = s.id
AND co.sub_strand_id = ss.id
AND u.grade_level = ANY(la.grade_levels)
AND RANDOM() < 0.1; -- Only 10% chance for each combination to avoid too much data

-- Add AI interaction logs for higher grade subjects
INSERT INTO ai_interactions (user_id, interaction_type, subject_area, grade_level, query_text, response_text, tokens_used, response_time_ms, satisfaction_rating)
SELECT 
    u.id,
    'tutoring',
    la.name,
    u.grade_level,
    'Can you help me understand ' || la.name || ' concepts for grade ' || u.grade_level || '?',
    'I''d be happy to help you with ' || la.name || '! Let''s start with the fundamentals and build up your understanding step by step.',
    FLOOR(RANDOM() * 500 + 100)::INTEGER,
    FLOOR(RANDOM() * 2000 + 500)::INTEGER,
    FLOOR(RANDOM() * 2 + 4)::INTEGER -- Rating between 4-5
FROM users u
CROSS JOIN curriculum_learning_areas la
WHERE u.role = 'student'
AND u.grade_level = ANY(la.grade_levels)
AND u.grade_level >= 7
AND RANDOM() < 0.2; -- 20% chance for each combination

COMMIT;
