-- Row Level Security Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Teachers can view their students' profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE teacher_id = auth.uid() 
      AND student_id = profiles.id 
      AND is_active = true
    )
  );

-- Learning Areas policies (public read)
CREATE POLICY "Anyone can view learning areas" ON learning_areas
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify learning areas" ON learning_areas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Strands policies (public read)
CREATE POLICY "Anyone can view strands" ON strands
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify strands" ON strands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Sub-strands policies (public read)
CREATE POLICY "Anyone can view sub-strands" ON sub_strands
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify sub-strands" ON sub_strands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Learning Outcomes policies (public read)
CREATE POLICY "Anyone can view learning outcomes" ON learning_outcomes
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify learning outcomes" ON learning_outcomes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Learning Objectives policies (public read)
CREATE POLICY "Anyone can view learning objectives" ON learning_objectives
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify learning objectives" ON learning_objectives
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Materials policies
CREATE POLICY "Anyone can view public materials" ON materials
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own materials" ON materials
  FOR SELECT USING (uploaded_by = auth.uid());

CREATE POLICY "Teachers can upload materials" ON materials
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Users can update their own materials" ON materials
  FOR UPDATE USING (uploaded_by = auth.uid());

-- Student Progress policies
CREATE POLICY "Students can view their own progress" ON student_progress
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can update their own progress" ON student_progress
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Teachers can view their students' progress" ON student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE teacher_id = auth.uid() 
      AND student_id = student_progress.student_id 
      AND is_active = true
    )
  );

-- Assessment Submissions policies
CREATE POLICY "Students can view their own submissions" ON assessment_submissions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can create their own submissions" ON assessment_submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can view their students' submissions" ON assessment_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE teacher_id = auth.uid() 
      AND student_id = assessment_submissions.student_id 
      AND is_active = true
    )
  );

CREATE POLICY "Teachers can grade submissions" ON assessment_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE teacher_id = auth.uid() 
      AND student_id = assessment_submissions.student_id 
      AND is_active = true
    )
  );

-- Tutor Sessions policies
CREATE POLICY "Students can view their own tutor sessions" ON tutor_sessions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can create their own tutor sessions" ON tutor_sessions
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own tutor sessions" ON tutor_sessions
  FOR UPDATE USING (student_id = auth.uid());

-- Student Analytics policies
CREATE POLICY "Students can view their own analytics" ON student_analytics
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "System can update analytics" ON student_analytics
  FOR ALL USING (true);

CREATE POLICY "Teachers can view their students' analytics" ON student_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE teacher_id = auth.uid() 
      AND student_id = student_analytics.student_id 
      AND is_active = true
    )
  );

-- Class Enrollments policies
CREATE POLICY "Teachers can manage their classes" ON class_enrollments
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can view their enrollments" ON class_enrollments
  FOR SELECT USING (student_id = auth.uid());

-- Execute the Row Level Security policies to ensure proper data access control based on user roles and relationships.
