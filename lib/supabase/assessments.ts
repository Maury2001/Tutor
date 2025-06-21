import { createServerClient } from "./server"
import { createClient } from "./client"

export async function getAssessments(gradeLevel: string, learningAreaId?: string) {
  const supabase = createServerClient()

  let query = supabase
    .from("assessments")
    .select(`
      *,
      learning_areas (name, code),
      strands (name, code)
    `)
    .eq("grade_level", gradeLevel)
    .eq("is_published", true)

  if (learningAreaId) {
    query = query.eq("learning_area_id", learningAreaId)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching assessments:", error)
    return []
  }

  return data || []
}

export async function submitAssessment(
  assessmentId: string,
  studentId: string,
  answers: Record<string, any>,
  timeTaken: number,
) {
  const supabase = createClient()

  // Calculate score based on answers
  const assessment = await supabase.from("assessments").select("questions, total_marks").eq("id", assessmentId).single()

  if (assessment.error) {
    console.error("Error fetching assessment:", assessment.error)
    return null
  }

  const questions = assessment.data.questions as any[]
  let totalScore = 0
  let maxScore = 0

  questions.forEach((question: any) => {
    maxScore += question.marks || 0
    const userAnswer = answers[question.id]

    if (question.type === "multiple_choice") {
      if (userAnswer === question.correct_answer) {
        totalScore += question.marks || 0
      }
    }
    // Add more question type scoring logic here
  })

  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0

  const { data, error } = await supabase
    .from("assessment_submissions")
    .insert({
      assessment_id: assessmentId,
      student_id: studentId,
      answers,
      score: totalScore,
      max_score: maxScore,
      percentage,
      time_taken_minutes: timeTaken,
      submitted_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error("Error submitting assessment:", error)
    return null
  }

  return data?.[0] || null
}

export async function getStudentSubmissions(studentId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("assessment_submissions")
    .select(`
      *,
      assessments (
        title,
        description,
        assessment_type,
        learning_areas (name)
      )
    `)
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false })

  if (error) {
    console.error("Error fetching submissions:", error)
    return []
  }

  return data || []
}
