-- Seed CBC Curriculum Data
-- This script populates the curriculum with CBC-specific content

-- Mathematics Strands
INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Numbers', 'NUM', 'Number concepts and operations', '{1,2,3,4,5,6,7,8}', 1 
FROM curriculum_learning_areas WHERE code = 'MATH';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Measurement', 'MEAS', 'Measurement concepts and applications', '{1,2,3,4,5,6,7,8}', 2 
FROM curriculum_learning_areas WHERE code = 'MATH';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Geometry', 'GEOM', 'Shapes, space and geometric relationships', '{1,2,3,4,5,6,7,8}', 3 
FROM curriculum_learning_areas WHERE code = 'MATH';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Data Handling', 'DATA', 'Statistics and data interpretation', '{3,4,5,6,7,8}', 4 
FROM curriculum_learning_areas WHERE code = 'MATH';

-- English Strands
INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Listening and Speaking', 'LS', 'Oral communication skills', '{1,2,3,4,5,6,7,8}', 1 
FROM curriculum_learning_areas WHERE code = 'ENG';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Reading', 'READ', 'Reading comprehension and fluency', '{1,2,3,4,5,6,7,8}', 2 
FROM curriculum_learning_areas WHERE code = 'ENG';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Writing', 'WRITE', 'Written communication skills', '{1,2,3,4,5,6,7,8}', 3 
FROM curriculum_learning_areas WHERE code = 'ENG';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Language Use', 'LANG', 'Grammar and language structure', '{1,2,3,4,5,6,7,8}', 4 
FROM curriculum_learning_areas WHERE code = 'ENG';

-- Science and Technology Strands
INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Living Things and Their Environment', 'LIFE', 'Biology and ecology concepts', '{1,2,3,4,5,6,7,8}', 1 
FROM curriculum_learning_areas WHERE code = 'SCI';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Matter and Materials', 'MATTER', 'Chemistry and materials science', '{1,2,3,4,5,6,7,8}', 2 
FROM curriculum_learning_areas WHERE code = 'SCI';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Energy and Forces', 'ENERGY', 'Physics concepts and applications', '{1,2,3,4,5,6,7,8}', 3 
FROM curriculum_learning_areas WHERE code = 'SCI';

INSERT INTO curriculum_strands (learning_area_id, name, code, description, grade_levels, sequence_order) 
SELECT id, 'Technology and Innovation', 'TECH', 'Technological literacy and innovation', '{1,2,3,4,5,6,7,8}', 4 
FROM curriculum_learning_areas WHERE code = 'SCI';

-- Mathematics Sub-strands (Numbers)
INSERT INTO curriculum_sub_strands (strand_id, name, code, description, grade_levels, sequence_order)
SELECT id, 'Whole Numbers', 'WN', 'Understanding and working with whole numbers', '{1,2,3,4,5,6,7,8}', 1
FROM curriculum_strands WHERE code = 'NUM';

INSERT INTO curriculum_sub_strands (strand_id, name, code, description, grade_levels, sequence_order)
SELECT id, 'Fractions', 'FRAC', 'Understanding and working with fractions', '{3,4,5,6,7,8}', 2
FROM curriculum_strands WHERE code = 'NUM';

INSERT INTO curriculum_sub_strands (strand_id, name, code, description, grade_levels, sequence_order)
SELECT id, 'Decimals', 'DEC', 'Understanding and working with decimals', '{4,5,6,7,8}', 3
FROM curriculum_strands WHERE code = 'NUM';

-- Sample Curriculum Outcomes for Grade 3 Mathematics
INSERT INTO curriculum_outcomes (sub_strand_id, grade_level, outcome_text, outcome_code, learning_indicators, suggested_activities, assessment_criteria)
SELECT 
    ss.id,
    3,
    'By the end of Grade 3, the learner should be able to count, read and write whole numbers up to 999.',
    'MATH.NUM.WN.3.1',
    ARRAY['Counts objects up to 999', 'Reads number names up to 999', 'Writes numerals up to 999', 'Identifies place value'],
    ARRAY['Counting games with objects', 'Number line activities', 'Place value charts', 'Number formation practice'],
    ARRAY['Correctly counts objects', 'Accurately reads numbers', 'Properly writes numerals', 'Identifies place value correctly']
FROM curriculum_sub_strands ss
JOIN curriculum_strands s ON ss.strand_id = s.id
JOIN curriculum_learning_areas la ON s.learning_area_id = la.id
WHERE la.code = 'MATH' AND s.code = 'NUM' AND ss.code = 'WN';

INSERT INTO curriculum_outcomes (sub_strand_id, grade_level, outcome_text, outcome_code, learning_indicators, suggested_activities, assessment_criteria)
SELECT 
    ss.id,
    3,
    'By the end of Grade 3, the learner should be able to perform addition and subtraction of whole numbers up to 999.',
    'MATH.NUM.WN.3.2',
    ARRAY['Adds numbers without regrouping', 'Adds numbers with regrouping', 'Subtracts without regrouping', 'Subtracts with regrouping'],
    ARRAY['Mental math exercises', 'Story problems', 'Number bond activities', 'Calculator verification'],
    ARRAY['Correctly performs addition', 'Accurately performs subtraction', 'Shows working clearly', 'Explains reasoning']
FROM curriculum_sub_strands ss
JOIN curriculum_strands s ON ss.strand_id = s.id
JOIN curriculum_learning_areas la ON s.learning_area_id = la.id
WHERE la.code = 'MATH' AND s.code = 'NUM' AND ss.code = 'WN';

-- Sample users for testing
INSERT INTO users (email, name, role) VALUES
('teacher@example.com', 'Mary Wanjiku', 'teacher'),
('student@example.com', 'John Kamau', 'student'),
('admin@example.com', 'Admin User', 'admin');

-- Sample user profiles
INSERT INTO user_profiles (user_id, school_id, grade_level, class_name, student_id)
SELECT 
    u.id,
    s.id,
    3,
    '3A',
    'STD001'
FROM users u, schools s
WHERE u.email = 'student@example.com' AND s.code = 'NPS001'
LIMIT 1;

COMMIT;
