// Auto-generate data for CBC TutorBot platform
// This script generates:
// 1. Complete curriculum content for all grades
// 2. Sample users (students, teachers, parents)
// 3. Learning materials and assessments
// 4. Student progress data
// 5. Gamification data (points, badges, achievements)

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "https://your-project.supabase.co"
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key"
const supabase = createClient(supabaseUrl, supabaseKey)

// Configuration
const NUM_STUDENTS = 50
const NUM_TEACHERS = 10
const NUM_PARENTS = 20
const DAYS_OF_ACTIVITY = 30

// Grade levels in CBC
const GRADE_LEVELS = [
  "playgroup",
  "pp1",
  "pp2",
  "grade1",
  "grade2",
  "grade3",
  "grade4",
  "grade5",
  "grade6",
  "grade7",
  "grade8",
  "grade9",
]

// Learning areas per grade
const LEARNING_AREAS = {
  playgroup: ["Communication", "Mathematics", "Environmental"],
  pp1: ["Language", "Mathematics", "Environmental", "Psychomotor", "Creative"],
  pp2: ["Language", "Mathematics", "Environmental", "Psychomotor", "Creative"],
  grade1: ["English", "Kiswahili", "Mathematics", "Environmental", "Creative Arts", "Religious Education"],
  grade2: ["English", "Kiswahili", "Mathematics", "Environmental", "Creative Arts", "Religious Education"],
  grade3: ["English", "Kiswahili", "Mathematics", "Environmental", "Creative Arts", "Religious Education"],
  grade4: [
    "English",
    "Kiswahili",
    "Mathematics",
    "Science & Technology",
    "Social Studies",
    "Creative Arts",
    "Religious Education",
  ],
  grade5: [
    "English",
    "Kiswahili",
    "Mathematics",
    "Science & Technology",
    "Social Studies",
    "Creative Arts",
    "Religious Education",
  ],
  grade6: [
    "English",
    "Kiswahili",
    "Mathematics",
    "Science & Technology",
    "Social Studies",
    "Creative Arts",
    "Religious Education",
  ],
  grade7: [
    "English",
    "Kiswahili",
    "Mathematics",
    "Integrated Science",
    "Health Education",
    "Pre-Technical Studies",
    "Social Studies",
    "Creative Arts",
    "Religious Education",
  ],
  grade8: [
    "English",
    "Kiswahili",
    "Mathematics",
    "Integrated Science",
    "Health Education",
    "Pre-Technical Studies",
    "Social Studies",
    "Creative Arts",
    "Religious Education",
  ],
  grade9: [
    "English",
    "Kiswahili",
    "Mathematics",
    "Integrated Science",
    "Health Education",
    "Pre-Technical Studies",
    "Social Studies",
    "Creative Arts",
    "Religious Education",
  ],
}

// School names
const SCHOOL_NAMES = [
  "Nairobi Primary School",
  "Mombasa Academy",
  "Kisumu Junior School",
  "Eldoret Preparatory",
  "Nakuru West Primary",
  "Thika Road Academy",
  "Nyeri Hills School",
  "Kakamega Primary",
  "Machakos Elementary",
  "Kitale International School",
]

// First names
const FIRST_NAMES = [
  "Aisha",
  "Amani",
  "Baraka",
  "Chege",
  "Dalia",
  "Eshe",
  "Faraji",
  "Gathoni",
  "Halima",
  "Imani",
  "Jabari",
  "Kamau",
  "Leila",
  "Makena",
  "Nala",
  "Otieno",
  "Pendo",
  "Quinter",
  "Ruto",
  "Saidi",
  "Taji",
  "Umi",
  "Wangari",
  "Xolani",
  "Yohana",
  "Zawadi",
  "John",
  "Mary",
  "David",
  "Sarah",
  "Michael",
  "Elizabeth",
]

// Last names
const LAST_NAMES = [
  "Mwangi",
  "Ochieng",
  "Kamau",
  "Wanjiku",
  "Otieno",
  "Njoroge",
  "Kimani",
  "Auma",
  "Odhiambo",
  "Wambui",
  "Kariuki",
  "Adhiambo",
  "Ndungu",
  "Akinyi",
  "Gitau",
  "Onyango",
  "Njeri",
  "Owino",
  "Wanjiru",
  "Mutua",
  "Nyambura",
  "Ouma",
  "Waithaka",
  "Atieno",
  "Ngugi",
  "Awuor",
  "Karanja",
  "Akoth",
  "Mbugua",
  "Anyango",
]

// Helper functions
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateEmail(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(1, 999)}@example.com`
}

function generatePassword(): string {
  return `Password${getRandomInt(100, 999)}`
}

function generateDate(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

// Generate users
async function generateUsers() {
  console.log("Generating users...")

  // Generate students
  for (let i = 0; i < NUM_STUDENTS; i++) {
    const firstName = getRandomElement(FIRST_NAMES)
    const lastName = getRandomElement(LAST_NAMES)
    const email = generateEmail(firstName, lastName)
    const gradeLevel = getRandomElement(GRADE_LEVELS)
    const schoolName = getRandomElement(SCHOOL_NAMES)

    try {
      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: generatePassword(),
        email_confirm: true,
        user_metadata: {
          full_name: `${firstName} ${lastName}`,
          role: "student",
          grade_level: gradeLevel,
          school_name: schoolName,
        },
      })

      if (authError) throw authError

      console.log(`Created student: ${firstName} ${lastName} (${email})`)

      // Initialize user points
      await supabase.from("user_points").insert({
        user_id: authUser.user.id,
        total_points: getRandomInt(0, 5000),
        weekly_points: getRandomInt(0, 500),
        monthly_points: getRandomInt(0, 2000),
        streak_days: getRandomInt(0, 30),
        level: getRandomInt(1, 10),
        experience_points: getRandomInt(0, 10000),
      })

      // Generate student progress
      await generateStudentProgress(authUser.user.id, gradeLevel)

      // Generate badges and achievements
      await generateUserBadges(authUser.user.id)
      await generateUserAchievements(authUser.user.id)
    } catch (error) {
      console.error(`Error creating student ${email}:`, error)
    }
  }

  // Generate teachers
  for (let i = 0; i < NUM_TEACHERS; i++) {
    const firstName = getRandomElement(FIRST_NAMES)
    const lastName = getRandomElement(LAST_NAMES)
    const email = generateEmail(firstName, lastName)
    const schoolName = getRandomElement(SCHOOL_NAMES)

    try {
      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: generatePassword(),
        email_confirm: true,
        user_metadata: {
          full_name: `${firstName} ${lastName}`,
          role: "teacher",
          school_name: schoolName,
        },
      })

      if (authError) throw authError

      console.log(`Created teacher: ${firstName} ${lastName} (${email})`)
    } catch (error) {
      console.error(`Error creating teacher ${email}:`, error)
    }
  }

  // Generate parents
  for (let i = 0; i < NUM_PARENTS; i++) {
    const firstName = getRandomElement(FIRST_NAMES)
    const lastName = getRandomElement(LAST_NAMES)
    const email = generateEmail(firstName, lastName)

    try {
      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: generatePassword(),
        email_confirm: true,
        user_metadata: {
          full_name: `${firstName} ${lastName}`,
          role: "parent",
        },
      })

      if (authError) throw authError

      console.log(`Created parent: ${firstName} ${lastName} (${email})`)
    } catch (error) {
      console.error(`Error creating parent ${email}:`, error)
    }
  }
}

// Generate curriculum content for all grades
async function generateCurriculum() {
  console.log("Generating curriculum content...")

  for (const gradeLevel of GRADE_LEVELS) {
    const learningAreas = LEARNING_AREAS[gradeLevel]

    for (const areaName of learningAreas) {
      try {
        // Create learning area
        const { data: area, error: areaError } = await supabase
          .from("learning_areas")
          .insert({
            code: `${areaName.toLowerCase().replace(/\s+/g, "-")}-${gradeLevel}`,
            name: areaName,
            description: `${areaName} for ${gradeLevel}`,
            grade_level: gradeLevel,
            weekly_lessons: getRandomInt(3, 6),
          })
          .select("id")
          .single()

        if (areaError) throw areaError

        // Create 3-5 strands per learning area
        const numStrands = getRandomInt(3, 5)
        for (let i = 1; i <= numStrands; i++) {
          const { data: strand, error: strandError } = await supabase
            .from("strands")
            .insert({
              learning_area_id: area.id,
              code: `strand-${i}-${areaName.toLowerCase().replace(/\s+/g, "-")}-${gradeLevel}`,
              name: `Strand ${i}: ${getRandomStrandName(areaName)}`,
              description: `Strand ${i} for ${areaName} in ${gradeLevel}`,
              sequence_order: i,
            })
            .select("id")
            .single()

          if (strandError) throw strandError

          // Create 2-4 sub-strands per strand
          const numSubStrands = getRandomInt(2, 4)
          for (let j = 1; j <= numSubStrands; j++) {
            const { data: subStrand, error: subStrandError } = await supabase
              .from("sub_strands")
              .insert({
                strand_id: strand.id,
                code: `sub-strand-${j}-strand-${i}-${areaName.toLowerCase().replace(/\s+/g, "-")}-${gradeLevel}`,
                name: `Sub-Strand ${j}: ${getRandomSubStrandName(areaName)}`,
                description: `Sub-Strand ${j} for Strand ${i} in ${areaName}, ${gradeLevel}`,
                sequence_order: j,
                practical_projects: JSON.stringify([`${areaName} Project ${j}.1`, `${areaName} Project ${j}.2`]),
              })
              .select("id")
              .single()

            if (subStrandError) throw subStrandError

            // Create 2-3 learning outcomes per sub-strand
            const numOutcomes = getRandomInt(2, 3)
            for (let k = 1; k <= numOutcomes; k++) {
              const { data: outcome, error: outcomeError } = await supabase
                .from("learning_outcomes")
                .insert({
                  sub_strand_id: subStrand.id,
                  code: `lo-${k}-sub-${j}-strand-${i}-${gradeLevel}`,
                  description: `By the end of the sub-strand, the learner should be able to ${getRandomOutcomeDescription(areaName)}`,
                  sequence_order: k,
                })
                .select("id")
                .single()

              if (outcomeError) throw outcomeError

              // Create 2-4 learning objectives per outcome
              const numObjectives = getRandomInt(2, 4)
              for (let l = 1; l <= numObjectives; l++) {
                await supabase.from("learning_objectives").insert({
                  learning_outcome_id: outcome.id,
                  code: `obj-${l}-lo-${k}-sub-${j}-strand-${i}-${gradeLevel}`,
                  description: `${getRandomObjectiveDescription(areaName)}`,
                  activities: JSON.stringify([
                    `Activity ${l}.1: ${getRandomActivityName(areaName)}`,
                    `Activity ${l}.2: ${getRandomActivityName(areaName)}`,
                  ]),
                  practical_simulations: JSON.stringify([`Simulation ${l}.1: ${getRandomSimulationName(areaName)}`]),
                  sequence_order: l,
                })
              }
            }
          }
        }

        console.log(`Generated curriculum for ${areaName} in ${gradeLevel}`)
      } catch (error) {
        console.error(`Error generating curriculum for ${areaName} in ${gradeLevel}:`, error)
      }
    }
  }
}

// Generate learning materials
async function generateMaterials() {
  console.log("Generating learning materials...")

  // Get all learning areas
  const { data: areas, error: areasError } = await supabase.from("learning_areas").select("id, name, grade_level")

  if (areasError) {
    console.error("Error fetching learning areas:", areasError)
    return
  }

  // Get all teachers
  const { data: teachers, error: teachersError } = await supabase.from("profiles").select("id").eq("role", "teacher")

  if (teachersError || !teachers.length) {
    console.error("Error fetching teachers:", teachersError)
    return
  }

  // Generate 5-10 materials per learning area
  for (const area of areas) {
    const numMaterials = getRandomInt(5, 10)

    for (let i = 1; i <= numMaterials; i++) {
      const materialType = getRandomElement(["document", "video", "presentation", "worksheet", "quiz"])
      const teacher = getRandomElement(teachers)

      try {
        await supabase.from("materials").insert({
          title: `${area.name} - ${getRandomMaterialTitle(area.name, materialType)}`,
          description: `${getRandomMaterialDescription(area.name, materialType)}`,
          content_type: materialType,
          file_url: `https://example.com/materials/${area.grade_level}/${area.name.toLowerCase().replace(/\s+/g, "-")}/${i}.${getFileExtension(materialType)}`,
          file_size: getRandomInt(100000, 10000000),
          grade_level: area.grade_level,
          learning_area_id: area.id,
          tags: JSON.stringify([
            area.name,
            area.grade_level,
            materialType,
            getRandomElement(["beginner", "intermediate", "advanced"]),
          ]),
          is_public: Math.random() > 0.2, // 80% are public
          uploaded_by: teacher.id,
        })
      } catch (error) {
        console.error(`Error creating material for ${area.name}:`, error)
      }
    }

    console.log(`Generated ${numMaterials} materials for ${area.name} in ${area.grade_level}`)
  }
}

// Generate assessments
async function generateAssessments() {
  console.log("Generating assessments...")

  // Get all learning areas
  const { data: areas, error: areasError } = await supabase.from("learning_areas").select("id, name, grade_level")

  if (areasError) {
    console.error("Error fetching learning areas:", areasError)
    return
  }

  // Get all teachers
  const { data: teachers, error: teachersError } = await supabase.from("profiles").select("id").eq("role", "teacher")

  if (teachersError || !teachers.length) {
    console.error("Error fetching teachers:", teachersError)
    return
  }

  // Generate 3-5 assessments per learning area
  for (const area of areas) {
    const numAssessments = getRandomInt(3, 5)

    for (let i = 1; i <= numAssessments; i++) {
      const assessmentType = getRandomElement(["formative", "summative", "practical", "project"])
      const teacher = getRandomElement(teachers)
      const numQuestions = getRandomInt(5, 15)
      const questions = []
      let totalMarks = 0

      // Generate questions
      for (let j = 1; j <= numQuestions; j++) {
        const questionType = getRandomElement(["multiple_choice", "short_answer", "true_false", "matching", "essay"])
        const marks = getRandomInt(1, 5)
        totalMarks += marks

        questions.push({
          id: j,
          type: questionType,
          question: getRandomQuestion(area.name, questionType),
          marks: marks,
          options:
            questionType === "multiple_choice"
              ? [
                  `Option A: ${getRandomAnswer(area.name)}`,
                  `Option B: ${getRandomAnswer(area.name)}`,
                  `Option C: ${getRandomAnswer(area.name)}`,
                  `Option D: ${getRandomAnswer(area.name)}`,
                ]
              : undefined,
          correct_answer:
            questionType === "multiple_choice"
              ? getRandomInt(0, 3)
              : questionType === "true_false"
                ? Math.random() > 0.5
                : undefined,
        })
      }

      try {
        await supabase.from("assessments").insert({
          title: `${area.name} - ${getRandomAssessmentTitle(area.name, assessmentType)}`,
          description: `${getRandomAssessmentDescription(area.name, assessmentType)}`,
          assessment_type: assessmentType,
          grade_level: area.grade_level,
          learning_area_id: area.id,
          questions: questions,
          total_marks: totalMarks,
          duration_minutes: getRandomInt(30, 90),
          instructions: `Answer all questions. ${
            assessmentType === "practical"
              ? "Complete all practical tasks as instructed."
              : assessmentType === "project"
                ? "Submit your project by the deadline."
                : "Write clearly and show your working where necessary."
          }`,
          created_by: teacher.id,
          is_published: Math.random() > 0.2, // 80% are published
        })
      } catch (error) {
        console.error(`Error creating assessment for ${area.name}:`, error)
      }
    }

    console.log(`Generated ${numAssessments} assessments for ${area.name} in ${area.grade_level}`)
  }
}

// Generate student progress
async function generateStudentProgress(studentId: string, gradeLevel: string) {
  console.log(`Generating progress for student ${studentId} in ${gradeLevel}...`)

  // Get learning objectives for the student's grade
  const { data: objectives, error: objectivesError } = await supabase
    .from("learning_objectives")
    .select(`
      id,
      learning_outcome_id,
      learning_outcomes!inner(
        id,
        sub_strand_id,
        sub_strands!inner(
          id,
          strand_id,
          strands!inner(
            id,
            learning_area_id,
            learning_areas!inner(
              id,
              grade_level
            )
          )
        )
      )
    `)
    .eq("learning_outcomes.sub_strands.strands.learning_areas.grade_level", gradeLevel)

  if (objectivesError) {
    console.error("Error fetching learning objectives:", objectivesError)
    return
  }

  if (!objectives || objectives.length === 0) {
    console.log(`No objectives found for grade ${gradeLevel}`)
    return
  }

  // Generate progress for each objective
  for (const objective of objectives) {
    // Randomly determine progress status
    const statusRandom = Math.random()
    const status =
      statusRandom < 0.3
        ? "not_started"
        : statusRandom < 0.6
          ? "in_progress"
          : statusRandom < 0.9
            ? "completed"
            : "mastered"

    // Calculate completion percentage based on status
    const completionPercentage =
      status === "not_started"
        ? 0
        : status === "in_progress"
          ? getRandomInt(10, 90)
          : status === "completed"
            ? 100
            : 100

    // Calculate time spent based on completion
    const timeSpent =
      status === "not_started" ? 0 : status === "in_progress" ? getRandomInt(5, 60) : getRandomInt(30, 120)

    // Random date within the last 30 days
    const lastAccessed = status === "not_started" ? null : generateDate(getRandomInt(0, DAYS_OF_ACTIVITY))

    try {
      await supabase.from("student_progress").insert({
        student_id: studentId,
        learning_area_id: objective.learning_outcomes.sub_strands.strands.learning_area_id,
        strand_id: objective.learning_outcomes.sub_strands.strand_id,
        sub_strand_id: objective.learning_outcomes.sub_strand_id,
        learning_outcome_id: objective.learning_outcome_id,
        learning_objective_id: objective.id,
        status: status,
        completion_percentage: completionPercentage,
        time_spent_minutes: timeSpent,
        last_accessed: lastAccessed,
      })
    } catch (error) {
      console.error(`Error creating progress for student ${studentId} on objective ${objective.id}:`, error)
    }
  }

  // Generate assessment submissions
  await generateAssessmentSubmissions(studentId, gradeLevel)

  // Generate tutor sessions
  await generateTutorSessions(studentId, gradeLevel)

  // Generate analytics
  await generateStudentAnalytics(studentId)
}

// Generate assessment submissions
async function generateAssessmentSubmissions(studentId: string, gradeLevel: string) {
  // Get published assessments for the student's grade
  const { data: assessments, error: assessmentsError } = await supabase
    .from("assessments")
    .select("id, total_marks, questions")
    .eq("grade_level", gradeLevel)
    .eq("is_published", true)

  if (assessmentsError) {
    console.error("Error fetching assessments:", assessmentsError)
    return
  }

  if (!assessments || assessments.length === 0) {
    return
  }

  // Get teachers for grading
  const { data: teachers, error: teachersError } = await supabase.from("profiles").select("id").eq("role", "teacher")

  if (teachersError || !teachers.length) {
    console.error("Error fetching teachers:", teachersError)
    return
  }

  // Submit 0-5 assessments
  const numSubmissions = getRandomInt(0, Math.min(5, assessments.length))
  const submittedAssessments = assessments.slice(0, numSubmissions)

  for (const assessment of submittedAssessments) {
    // Generate random answers
    const answers = {}
    for (const question of assessment.questions) {
      if (question.type === "multiple_choice") {
        answers[question.id] = getRandomInt(0, 3)
      } else if (question.type === "true_false") {
        answers[question.id] = Math.random() > 0.5
      } else if (question.type === "short_answer") {
        answers[question.id] = getRandomAnswer(question.question)
      } else if (question.type === "matching") {
        answers[question.id] = [getRandomInt(0, 3), getRandomInt(0, 3), getRandomInt(0, 3), getRandomInt(0, 3)]
      } else {
        answers[question.id] = `Essay response for question ${question.id}`
      }
    }

    // Calculate score (60-100%)
    const score = getRandomInt(Math.floor(assessment.total_marks * 0.6), assessment.total_marks)
    const percentage = (score / assessment.total_marks) * 100

    // Random submission time in the last 30 days
    const submittedAt = generateDate(getRandomInt(0, DAYS_OF_ACTIVITY))

    // 80% chance of being graded
    const isGraded = Math.random() > 0.2
    const gradedAt = isGraded ? generateDate(getRandomInt(0, Math.min(DAYS_OF_ACTIVITY, 7))) : null
    const gradedBy = isGraded ? getRandomElement(teachers).id : null

    try {
      await supabase.from("assessment_submissions").insert({
        assessment_id: assessment.id,
        student_id: studentId,
        answers: answers,
        score: score,
        max_score: assessment.total_marks,
        percentage: percentage,
        time_taken_minutes: getRandomInt(15, 90),
        feedback: isGraded ? getRandomFeedback(percentage) : null,
        graded_by: gradedBy,
        submitted_at: submittedAt,
        graded_at: gradedAt,
      })
    } catch (error) {
      console.error(`Error creating assessment submission for student ${studentId}:`, error)
    }
  }
}

// Generate tutor sessions
async function generateTutorSessions(studentId: string, gradeLevel: string) {
  // Get learning areas for the student's grade
  const { data: areas, error: areasError } = await supabase
    .from("learning_areas")
    .select("id, name")
    .eq("grade_level", gradeLevel)

  if (areasError) {
    console.error("Error fetching learning areas:", areasError)
    return
  }

  if (!areas || areas.length === 0) {
    return
  }

  // Generate 0-10 tutor sessions
  const numSessions = getRandomInt(0, 10)

  for (let i = 0; i < numSessions; i++) {
    const area = getRandomElement(areas)
    const sessionDuration = getRandomInt(5, 45)
    const tokensUsed = getRandomInt(500, 5000)
    const createdAt = generateDate(getRandomInt(0, DAYS_OF_ACTIVITY))

    // Generate mock conversation
    const messages = [
      {
        role: "user",
        content: getRandomQuestion(area.name, "open"),
        timestamp: createdAt,
      },
      {
        role: "assistant",
        content: getRandomAnswer(area.name),
        timestamp: createdAt,
      },
    ]

    // Add 1-5 more exchanges
    const numExchanges = getRandomInt(1, 5)
    for (let j = 0; j < numExchanges; j++) {
      messages.push({
        role: "user",
        content: getRandomQuestion(area.name, "open"),
        timestamp: createdAt,
      })

      messages.push({
        role: "assistant",
        content: getRandomAnswer(area.name),
        timestamp: createdAt,
      })
    }

    try {
      await supabase.from("tutor_sessions").insert({
        student_id: studentId,
        grade_level: gradeLevel,
        learning_area_id: area.id,
        topic: getRandomTutorTopic(area.name),
        messages: messages,
        tokens_used: tokensUsed,
        session_duration_minutes: sessionDuration,
        created_at: createdAt,
        updated_at: createdAt,
      })
    } catch (error) {
      console.error(`Error creating tutor session for student ${studentId}:`, error)
    }
  }
}

// Generate student analytics
async function generateStudentAnalytics(studentId: string) {
  // Generate analytics for the last 30 days
  for (let daysAgo = 0; daysAgo < DAYS_OF_ACTIVITY; daysAgo++) {
    // 70% chance of having activity on a given day
    if (Math.random() > 0.3) {
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)
      const dateStr = date.toISOString().split("T")[0]

      // Generate random activity data
      const totalTime = getRandomInt(15, 180)
      const lessonsCompleted = getRandomInt(0, 5)
      const assessmentsTaken = getRandomInt(0, 2)
      const averageScore = getRandomInt(60, 100)
      const tokensUsed = getRandomInt(0, 3000)

      // Generate activities
      const numActivities = getRandomInt(1, 5)
      const activities = []

      for (let i = 0; i < numActivities; i++) {
        const activityType = getRandomElement(["lesson", "assessment", "tutor", "material"])

        activities.push({
          type: activityType,
          timestamp: `${dateStr}T${String(getRandomInt(8, 20)).padStart(2, "0")}:${String(getRandomInt(0, 59)).padStart(2, "0")}:00Z`,
          duration: getRandomInt(5, 45),
          details:
            activityType === "lesson"
              ? { objective_id: `obj-${getRandomInt(1, 100)}`, completed: Math.random() > 0.3 }
              : activityType === "assessment"
                ? { assessment_id: `assess-${getRandomInt(1, 50)}`, score: getRandomInt(60, 100) }
                : activityType === "tutor"
                  ? { session_id: `session-${getRandomInt(1, 30)}`, tokens: getRandomInt(500, 2000) }
                  : { material_id: `material-${getRandomInt(1, 100)}` },
        })
      }

      try {
        await supabase.from("student_analytics").insert({
          student_id: studentId,
          date: dateStr,
          total_time_minutes: totalTime,
          lessons_completed: lessonsCompleted,
          assessments_taken: assessmentsTaken,
          average_score: averageScore,
          tokens_used: tokensUsed,
          activities: activities,
        })
      } catch (error) {
        console.error(`Error creating analytics for student ${studentId} on ${dateStr}:`, error)
      }
    }
  }
}

// Generate user badges
async function generateUserBadges(userId: string) {
  // Get all badges
  const { data: badges, error: badgesError } = await supabase.from("badges").select("id, points")

  if (badgesError) {
    console.error("Error fetching badges:", badgesError)
    return
  }

  if (!badges || badges.length === 0) {
    return
  }

  // Award 0-5 random badges
  const numBadges = getRandomInt(0, 5)
  const awardedBadges = badges.slice(0, numBadges)

  for (const badge of awardedBadges) {
    try {
      // Award badge
      await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badge.id,
        earned_at: generateDate(getRandomInt(0, DAYS_OF_ACTIVITY)),
      })

      // Add points transaction
      await supabase.from("point_transactions").insert({
        user_id: userId,
        points: badge.points,
        type: "earned",
        source: "badge_earned",
        description: `Earned a badge worth ${badge.points} points`,
        metadata: { badge_id: badge.id },
        created_at: generateDate(getRandomInt(0, DAYS_OF_ACTIVITY)),
      })
    } catch (error) {
      console.error(`Error awarding badge to user ${userId}:`, error)
    }
  }
}

// Generate user achievements
async function generateUserAchievements(userId: string) {
  // Get all achievements
  const { data: achievements, error: achievementsError } = await supabase.from("achievements").select("id, points")

  if (achievementsError) {
    console.error("Error fetching achievements:", achievementsError)
    return
  }

  if (!achievements || achievements.length === 0) {
    return
  }

  // Process 0-8 random achievements
  const numAchievements = getRandomInt(0, 8)
  const processedAchievements = achievements.slice(0, numAchievements)

  for (const achievement of processedAchievements) {
    // 60% chance of completing the achievement
    const completed = Math.random() > 0.4
    const progress = completed ? 100 : getRandomInt(10, 90)
    const completedAt = completed ? generateDate(getRandomInt(0, DAYS_OF_ACTIVITY)) : null

    try {
      // Add achievement progress
      await supabase.from("user_achievements").insert({
        user_id: userId,
        achievement_id: achievement.id,
        progress: progress,
        completed: completed,
        completed_at: completedAt,
        created_at: generateDate(getRandomInt(DAYS_OF_ACTIVITY, DAYS_OF_ACTIVITY * 2)),
        updated_at: generateDate(getRandomInt(0, DAYS_OF_ACTIVITY)),
      })

      // Add points transaction if completed
      if (completed) {
        await supabase.from("point_transactions").insert({
          user_id: userId,
          points: achievement.points,
          type: "earned",
          source: "achievement_unlocked",
          description: `Unlocked an achievement worth ${achievement.points} points`,
          metadata: { achievement_id: achievement.id },
          created_at: completedAt,
        })
      }
    } catch (error) {
      console.error(`Error processing achievement for user ${userId}:`, error)
    }
  }
}

// Generate class enrollments
async function generateClassEnrollments() {
  console.log("Generating class enrollments...")

  // Get all teachers
  const { data: teachers, error: teachersError } = await supabase.from("profiles").select("id").eq("role", "teacher")

  if (teachersError || !teachers.length) {
    console.error("Error fetching teachers:", teachersError)
    return
  }

  // Get all students
  const { data: students, error: studentsError } = await supabase
    .from("profiles")
    .select("id, grade_level")
    .eq("role", "student")

  if (studentsError || !students.length) {
    console.error("Error fetching students:", studentsError)
    return
  }

  // Group students by grade level
  const studentsByGrade = {}
  for (const student of students) {
    if (!studentsByGrade[student.grade_level]) {
      studentsByGrade[student.grade_level] = []
    }
    studentsByGrade[student.grade_level].push(student)
  }

  // Create 2-4 classes per teacher
  for (const teacher of teachers) {
    const numClasses = getRandomInt(2, 4)

    for (let i = 1; i <= numClasses; i++) {
      // Select a random grade level that has students
      const availableGrades = Object.keys(studentsByGrade).filter((grade) => studentsByGrade[grade].length > 0)
      if (availableGrades.length === 0) continue

      const gradeLevel = getRandomElement(availableGrades)
      const className = `${gradeLevel.toUpperCase()} ${getRandomElement(["Alpha", "Beta", "Gamma", "Delta", "Omega", "Red", "Blue", "Green", "Yellow"])} Class`
      const subjectArea = getRandomElement(LEARNING_AREAS[gradeLevel])

      // Enroll 5-20 students from this grade
      const availableStudents = studentsByGrade[gradeLevel]
      const numStudents = Math.min(getRandomInt(5, 20), availableStudents.length)
      const enrolledStudents = availableStudents.slice(0, numStudents)

      // Remove enrolled students from available pool
      studentsByGrade[gradeLevel] = availableStudents.slice(numStudents)

      // Create enrollments
      for (const student of enrolledStudents) {
        try {
          await supabase.from("class_enrollments").insert({
            teacher_id: teacher.id,
            student_id: student.id,
            class_name: className,
            grade_level: gradeLevel,
            subject_area: subjectArea,
            enrolled_at: generateDate(getRandomInt(DAYS_OF_ACTIVITY, DAYS_OF_ACTIVITY * 2)),
            is_active: Math.random() > 0.1, // 90% active
          })
        } catch (error) {
          console.error(`Error enrolling student ${student.id} in class ${className}:`, error)
        }
      }

      console.log(`Created class ${className} with ${enrolledStudents.length} students`)
    }
  }
}

// Helper functions for generating content
function getRandomStrandName(subject: string): string {
  const strandNames = {
    English: ["Listening and Speaking", "Reading", "Writing", "Grammar", "Literature"],
    Kiswahili: ["Kusikiliza na Kuzungumza", "Kusoma", "Kuandika", "Sarufi", "Fasihi"],
    Mathematics: ["Numbers", "Measurement", "Geometry", "Algebra", "Statistics"],
    Science: ["Scientific Investigation", "Life Sciences", "Physical Sciences", "Earth and Space"],
    "Social Studies": ["Citizenship", "Governance", "Social Relations", "Economics"],
    "Creative Arts": ["Visual Arts", "Music", "Dance", "Drama", "Media Arts"],
    "Religious Education": ["Faith", "Morality", "Worship", "Sacred Texts", "Religious Leaders"],
    default: ["Core Concepts", "Applications", "Skills Development", "Critical Thinking", "Practical Work"],
  }

  const options = strandNames[subject] || strandNames["default"]
  return getRandomElement(options)
}

function getRandomSubStrandName(subject: string): string {
  const subStrandNames = {
    English: [
      "Vocabulary Development",
      "Comprehension Skills",
      "Text Types",
      "Language Structures",
      "Creative Expression",
    ],
    Mathematics: ["Whole Numbers", "Fractions", "Decimals", "Shapes", "Data Handling", "Patterns"],
    Science: ["Plants", "Animals", "Human Body", "Materials", "Forces", "Energy", "Environment"],
    default: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
  }

  const options = subStrandNames[subject] || subStrandNames["default"]
  return getRandomElement(options)
}

function getRandomOutcomeDescription(subject: string): string {
  const outcomes = [
    "demonstrate understanding of key concepts in",
    "apply knowledge and skills related to",
    "analyze and interpret information about",
    "create and present work that shows mastery of",
    "evaluate and make judgments about",
    "communicate effectively about",
    "solve problems related to",
    "investigate and explore",
    "develop critical thinking skills through",
    "appreciate and value the importance of",
  ]

  return `${getRandomElement(outcomes)} ${subject.toLowerCase()}`
}

function getRandomObjectiveDescription(subject: string): string {
  const objectives = [
    "identify and describe",
    "explain the relationship between",
    "demonstrate the ability to",
    "create a model showing",
    "compare and contrast",
    "analyze the effects of",
    "evaluate the importance of",
    "apply knowledge of",
    "solve problems involving",
    "communicate ideas about",
  ]

  const topics = {
    English: ["parts of speech", "sentence structures", "text types", "literary devices", "comprehension strategies"],
    Mathematics: [
      "number operations",
      "geometric shapes",
      "measurement units",
      "data representation",
      "algebraic expressions",
    ],
    Science: [
      "living organisms",
      "physical properties",
      "natural phenomena",
      "scientific processes",
      "environmental systems",
    ],
    default: ["key concepts", "fundamental principles", "core skills", "essential knowledge", "basic applications"],
  }

  const topicOptions = topics[subject] || topics["default"]
  return `${getRandomElement(objectives)} ${getRandomElement(topicOptions)} in ${subject.toLowerCase()}`
}

function getRandomActivityName(subject: string): string {
  const activities = [
    "Group Discussion",
    "Hands-on Experiment",
    "Research Project",
    "Role Play",
    "Presentation",
    "Field Trip",
    "Debate",
    "Quiz",
    "Worksheet",
    "Game",
    "Demonstration",
    "Reflection",
  ]

  return `${getRandomElement(activities)} on ${subject}`
}

function getRandomSimulationName(subject: string): string {
  const simulations = [
    "Interactive Model",
    "Virtual Lab",
    "Digital Exploration",
    "Online Simulation",
    "Animated Demonstration",
    "3D Visualization",
    "Augmented Reality Experience",
  ]

  return `${getRandomElement(simulations)} of ${subject} Concepts`
}

function getRandomMaterialTitle(subject: string, type: string): string {
  const titles = {
    document: ["Guide to", "Introduction to", "Notes on", "Summary of", "Handbook for"],
    video: ["Video Lesson on", "Tutorial on", "Explanation of", "Demonstration of", "Visual Guide to"],
    presentation: ["Slideshow on", "Presentation about", "Overview of", "Visual Summary of", "Key Points on"],
    worksheet: ["Practice Exercises for", "Worksheet on", "Activities for", "Problems on", "Questions about"],
    quiz: ["Assessment on", "Quiz for", "Test your knowledge on", "Review Questions for", "Self-Check on"],
  }

  const topics = {
    English: ["Grammar Rules", "Essay Writing", "Reading Comprehension", "Vocabulary Building", "Literary Analysis"],
    Mathematics: [
      "Number Operations",
      "Geometry Basics",
      "Fractions and Decimals",
      "Algebra Concepts",
      "Data Handling",
    ],
    Science: [
      "Plant Life Cycles",
      "Animal Classification",
      "Forces and Motion",
      "States of Matter",
      "Environmental Conservation",
    ],
    default: ["Key Concepts", "Fundamental Principles", "Core Skills", "Essential Knowledge", "Basic Applications"],
  }

  const titlePrefixes = titles[type] || titles["document"]
  const topicOptions = topics[subject] || topics["default"]

  return `${getRandomElement(titlePrefixes)} ${getRandomElement(topicOptions)}`
}

function getRandomMaterialDescription(subject: string, type: string): string {
  const descriptions = {
    document: "A comprehensive document covering key concepts and examples.",
    video: "An engaging video explaining concepts with visual demonstrations.",
    presentation: "A slide presentation with clear explanations and illustrations.",
    worksheet: "Practice exercises to reinforce learning with answer key.",
    quiz: "A set of questions to test understanding and knowledge.",
  }

  return `${descriptions[type] || "Educational material"} For ${subject} students.`
}

function getFileExtension(type: string): string {
  const extensions = {
    document: "pdf",
    video: "mp4",
    presentation: "pptx",
    worksheet: "pdf",
    quiz: "pdf",
  }

  return extensions[type] || "pdf"
}

function getRandomAssessmentTitle(subject: string, type: string): string {
  const titles = {
    formative: ["Quick Check on", "Progress Check for", "Learning Check on", "Concept Check for"],
    summative: ["End of Term Test on", "Final Assessment on", "Comprehensive Exam on", "Unit Test for"],
    practical: ["Practical Assessment on", "Lab Test for", "Hands-on Evaluation of", "Skills Test on"],
    project: ["Project Assignment on", "Creative Project for", "Research Project about", "Inquiry Project on"],
  }

  const topics = {
    English: ["Grammar and Punctuation", "Reading Comprehension", "Writing Skills", "Vocabulary", "Literature"],
    Mathematics: ["Number Operations", "Geometry", "Measurement", "Algebra", "Statistics"],
    Science: [
      "Living Things",
      "Materials and Matter",
      "Forces and Energy",
      "Earth and Space",
      "Scientific Investigation",
    ],
    default: ["Unit 1", "Unit 2", "Term 1 Content", "Core Concepts", "Key Skills"],
  }

  const titlePrefixes = titles[type] || titles["formative"]
  const topicOptions = topics[subject] || topics["default"]

  return `${getRandomElement(titlePrefixes)} ${getRandomElement(topicOptions)}`
}

function getRandomAssessmentDescription(subject: string, type: string): string {
  const descriptions = {
    formative: `A short assessment to check understanding of ${subject} concepts.`,
    summative: `A comprehensive assessment covering all ${subject} topics studied this term.`,
    practical: `A hands-on assessment to demonstrate practical skills in ${subject}.`,
    project: `A project-based assessment requiring application of ${subject} knowledge.`,
  }

  return descriptions[type] || `An assessment for ${subject}.`
}

function getRandomQuestion(subject: string, type: string): string {
  const questionStarters = {
    multiple_choice: ["Which of the following", "Select the correct", "Choose the best", "Identify the"],
    short_answer: ["Explain briefly", "Define the term", "Describe how", "What is meant by"],
    true_false: [
      "State whether it is true or false that",
      "Is it correct to say that",
      "Determine if the following statement is true:",
    ],
    matching: ["Match the following", "Connect each item in Column A with the appropriate item in Column B"],
    essay: ["Write an essay discussing", "Explain in detail", "Analyze the following", "Evaluate the importance of"],
    open: ["Can you explain", "How does", "What is the relationship between", "Why is it important to understand"],
  }

  const topics = {
    English: ["parts of speech", "sentence structures", "literary devices", "text types", "comprehension strategies"],
    Mathematics: [
      "number operations",
      "geometric shapes",
      "measurement units",
      "data representation",
      "algebraic expressions",
    ],
    Science: [
      "living organisms",
      "physical properties",
      "natural phenomena",
      "scientific processes",
      "environmental systems",
    ],
    default: ["key concepts", "fundamental principles", "core skills", "essential knowledge", "basic applications"],
  }

  const starters = questionStarters[type] || questionStarters["open"]
  const topicOptions = topics[subject] || topics["default"]

  return `${getRandomElement(starters)} ${getRandomElement(topicOptions)} in ${subject}?`
}

function getRandomAnswer(subject: string): string {
  const answers = [
    `The key concept in ${subject} relates to understanding the fundamental principles.`,
    `This involves applying knowledge of ${subject} to solve real-world problems.`,
    `The correct approach is to analyze the components and their relationships.`,
    `It's important to consider multiple perspectives when studying ${subject}.`,
    `The process requires careful observation and systematic recording of data.`,
    `This demonstrates how theory can be applied in practical situations.`,
    `The answer can be found by examining the evidence and drawing logical conclusions.`,
    `This illustrates the connection between different aspects of ${subject}.`,
    `The solution involves breaking down the problem into manageable steps.`,
    `This shows how ${subject} concepts build upon each other in a progressive manner.`,
  ]

  return getRandomElement(answers)
}

function getRandomFeedback(score: number): string {
  if (score >= 90) {
    return getRandomElement([
      "Excellent work! You've demonstrated a thorough understanding of the concepts.",
      "Outstanding performance! Your answers show deep comprehension of the material.",
      "Superb job! You've mastered the content exceptionally well.",
      "Fantastic work! Your responses are comprehensive and accurate.",
    ])
  } else if (score >= 75) {
    return getRandomElement([
      "Good work! You've shown a solid understanding of most concepts.",
      "Well done! Your answers demonstrate good knowledge of the material.",
      "Strong performance! You've grasped most of the key ideas.",
      "Good job! Your work shows clear understanding with a few minor areas to improve.",
    ])
  } else if (score >= 60) {
    return getRandomElement([
      "Satisfactory work. You've understood the basic concepts but need more practice with some topics.",
      "Adequate performance. Review the areas where you lost marks to strengthen your understanding.",
      "You've demonstrated basic understanding. Focus on developing deeper comprehension of key concepts.",
      "You're on the right track. Continue practicing to improve your mastery of the material.",
    ])
  } else {
    return getRandomElement([
      "You need more practice with these concepts. Review the material and try again.",
      "There are significant gaps in your understanding. Please revisit the lessons and seek help if needed.",
      "You're struggling with key concepts. Schedule a session with your teacher for additional support.",
      "More work is needed to master this content. Focus on the fundamentals before moving forward.",
    ])
  }
}

function getRandomTutorTopic(subject: string): string {
  return getRandomElement([
    `Help with ${subject} homework`,
    `Understanding ${subject} concepts`,
    `Preparing for ${subject} test`,
    `Clarifying ${subject} problems`,
    `Reviewing ${subject} material`,
    `Exploring advanced ${subject} topics`,
    `${subject} project assistance`,
    `${subject} exam preparation`,
  ])
}

// Main execution
async function main() {
  console.log("Starting data generation...")

  try {
    // Generate curriculum first
    await generateCurriculum()

    // Generate users (which also generates progress, badges, achievements)
    await generateUsers()

    // Generate materials and assessments
    await generateMaterials()
    await generateAssessments()

    // Generate class enrollments
    await generateClassEnrollments()

    console.log("Data generation complete!")
  } catch (error) {
    console.error("Error in data generation:", error)
  }
}

main()
