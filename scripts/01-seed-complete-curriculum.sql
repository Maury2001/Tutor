-- Complete CBC Curriculum Seed Data

-- Insert Learning Areas for Grade 9 (as example)
INSERT INTO learning_areas (code, name, description, grade_level, weekly_lessons) VALUES
('integrated-science-grade9', 'Integrated Science', 'Advanced scientific concepts and applications', 'grade9', 5),
('agriculture-nutrition-grade9', 'Agriculture and Nutrition', 'Advanced agricultural techniques and nutrition', 'grade9', 4),
('pre-technical-grade9', 'Pre-Technical Studies', 'Advanced technical skills and safety', 'grade9', 4),
('creative-arts-grade9', 'Creative Arts and Sports', 'Advanced artistic techniques and sports', 'grade9', 5),
('mathematics-grade9', 'Mathematics', 'Advanced mathematical concepts', 'grade9', 5),
('english-grade9', 'English', 'Advanced English language and literature', 'grade9', 5),
('kiswahili-grade9', 'Kiswahili', 'Advanced Kiswahili language and literature', 'grade9', 4),
('social-studies-grade9', 'Social Studies', 'Advanced social concepts and citizenship', 'grade9', 4),
('religious-education-grade9', 'Religious Education', 'Advanced moral and spiritual development', 'grade9', 4)
ON CONFLICT (code) DO NOTHING;

-- Insert Strands for Integrated Science Grade 9
INSERT INTO strands (learning_area_id, code, name, description, sequence_order) VALUES
((SELECT id FROM learning_areas WHERE code = 'integrated-science-grade9'), 'mixtures-elements-compounds-grade9', 'Mixtures, Elements and Compounds', 'Understanding matter composition', 1),
((SELECT id FROM learning_areas WHERE code = 'integrated-science-grade9'), 'living-things-environment-grade9', 'Living Things and Their Environment', 'Biological processes and ecosystems', 2),
((SELECT id FROM learning_areas WHERE code = 'integrated-science-grade9'), 'force-energy-grade9', 'Force and Energy', 'Physics concepts and applications', 3)
ON CONFLICT (learning_area_id, code) DO NOTHING;

-- Insert Sub-strands for Mixtures, Elements and Compounds
INSERT INTO sub_strands (strand_id, code, name, description, sequence_order, practical_projects) VALUES
((SELECT id FROM strands WHERE code = 'mixtures-elements-compounds-grade9'), 'structure-atom-grade9', 'Structure of the atom', 'Atomic structure and properties', 1, '["Model atomic structures using locally available materials"]'),
((SELECT id FROM strands WHERE code = 'mixtures-elements-compounds-grade9'), 'metals-alloys-grade9', 'Metals and Alloys', 'Properties and uses of metals and alloys', 2, '["Metals and Alloys Exhibition"]'),
((SELECT id FROM strands WHERE code = 'mixtures-elements-compounds-grade9'), 'water-hardness-grade9', 'Water hardness', 'Understanding water properties', 3, '["Water Testing Station"]')
ON CONFLICT (strand_id, code) DO NOTHING;

-- Insert Learning Outcomes for Structure of the atom
INSERT INTO learning_outcomes (sub_strand_id, code, description, sequence_order) VALUES
((SELECT id FROM sub_strands WHERE code = 'structure-atom-grade9'), 'atomic-understanding-grade9', 'Understand atomic structure and electron arrangement', 1)
ON CONFLICT (sub_strand_id, code) DO NOTHING;

-- Insert Learning Objectives for atomic understanding
INSERT INTO learning_objectives (learning_outcome_id, code, description, activities, practical_simulations, sequence_order) VALUES
((SELECT id FROM learning_outcomes WHERE code = 'atomic-understanding-grade9'), 'atomic-structure-grade9', 'Describe atomic structure and electron arrangement', 
'["Structure of the atom (protons, electrons, neutrons)", "Atomic number and mass number of elements", "Electron arrangement of elements", "Energy level diagrams (cross or dot)", "Metals and non-metals"]',
'["Atomic structure builder", "Electron configuration app", "Periodic table explorer"]', 1)
ON CONFLICT (learning_outcome_id, code) DO NOTHING;

-- Insert more sub-strands for Living Things and Environment
INSERT INTO sub_strands (strand_id, code, name, description, sequence_order, practical_projects) VALUES
((SELECT id FROM strands WHERE code = 'living-things-environment-grade9'), 'nutrition-plants-grade9', 'Nutrition in plants', 'Photosynthesis and plant nutrition', 1, '["Photosynthesis Laboratory - experiments demonstrating conditions for photosynthesis"]'),
((SELECT id FROM strands WHERE code = 'living-things-environment-grade9'), 'nutrition-animals-grade9', 'Nutrition in animals', 'Animal feeding and digestion', 2, '["Digestive System Model - working model showing digestion process"]'),
((SELECT id FROM strands WHERE code = 'living-things-environment-grade9'), 'reproduction-plants-grade9', 'Reproduction in plants', 'Plant reproductive processes', 3, '["School Botanical Garden", "Seed Dispersal Collection"]'),
((SELECT id FROM strands WHERE code = 'living-things-environment-grade9'), 'interdependence-life-grade9', 'The interdependence of life', 'Ecosystem relationships', 4, '["Ecosystem Mapping - create food chains and food webs from local environment"]')
ON CONFLICT (strand_id, code) DO NOTHING;

-- Insert sub-strands for Force and Energy
INSERT INTO sub_strands (strand_id, code, name, description, sequence_order, practical_projects) VALUES
((SELECT id FROM strands WHERE code = 'force-energy-grade9'), 'curved-mirrors-grade9', 'Curved mirrors', 'Properties and applications of curved mirrors', 1, '["Curved Mirror Applications - construct solar cookers, periscopes"]'),
((SELECT id FROM strands WHERE code = 'force-energy-grade9'), 'waves-grade9', 'Waves', 'Wave properties and applications', 2, '["Wave Demonstration Center", "Communication Technology"]')
ON CONFLICT (strand_id, code) DO NOTHING;

-- Insert sample practical projects
INSERT INTO practical_projects (title, description, grade_level, learning_area_id, strand_id, sub_strand_id, objectives, materials_needed, instructions, assessment_criteria, duration_days) VALUES
('Chemistry in Our Lives', 'Comprehensive chemistry investigation project', 'grade9', 
(SELECT id FROM learning_areas WHERE code = 'integrated-science-grade9'),
(SELECT id FROM strands WHERE code = 'mixtures-elements-compounds-grade9'),
(SELECT id FROM sub_strands WHERE code = 'structure-atom-grade9'),
'["Create 3D models of atoms", "Display metals and alloys", "Test water hardness", "Demonstrate rust prevention"]',
'["Wire, beads, clay", "Metal samples", "Water samples", "pH testing kit"]',
'["Collect materials", "Build atomic models", "Test water samples", "Document findings"]',
'["Accuracy of models", "Understanding of concepts", "Quality of presentation", "Scientific method application"]',
14)
ON CONFLICT DO NOTHING;

-- Insert sample assessment
INSERT INTO assessments (title, description, assessment_type, grade_level, learning_area_id, strand_id, questions, total_marks, duration_minutes, instructions) VALUES
('Atomic Structure Assessment', 'Test understanding of atomic structure concepts', 'formative', 'grade9',
(SELECT id FROM learning_areas WHERE code = 'integrated-science-grade9'),
(SELECT id FROM strands WHERE code = 'mixtures-elements-compounds-grade9'),
'[
  {
    "id": 1,
    "type": "multiple_choice",
    "question": "What are the three main subatomic particles?",
    "options": ["Protons, neutrons, electrons", "Protons, ions, electrons", "Neutrons, ions, atoms", "Electrons, atoms, molecules"],
    "correct_answer": 0,
    "marks": 2
  },
  {
    "id": 2,
    "type": "short_answer",
    "question": "Explain the difference between atomic number and mass number.",
    "marks": 5
  }
]',
7, 30, 'Answer all questions. Show your working where applicable.')
ON CONFLICT DO NOTHING;
