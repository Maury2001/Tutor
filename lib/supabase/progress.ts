import { createServerClient } from "./server"
import { createClient } from "./client"

export async function getStudentProgress(studentId: string, gradeLevel?: string) {
  const supabase = createServerClient()

  let query = supabase
    .from("student_progress")
    .select(`
      *,
      learning_areas (name, code),
      strands (name, code),
      sub_strands (name, code),
      learning_outcomes (description),
      learning_objectives (description, activities)
    `)
    .eq("student_id", studentId)

  if (gradeLevel) {
    query = query.eq("learning_areas.grade_level", gradeLevel)
  }

  const { data, error } = await query.order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching student progress:", error)
    return []
  }

  return data || []
}

export async function updateProgress(
  studentId: string,
  objectiveId: string,
  status: "not_started" | "in_progress" | "completed" | "mastered",
  completionPercentage: number,
  timeSpent = 0,
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("student_progress")
    .upsert({
      student_id: studentId,
      learning_objective_id: objectiveId,
      status,
      completion_percentage: completionPercentage,
      time_spent_minutes: timeSpent,
      last_accessed: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error("Error updating progress:", error)
    return null
  }

  return data?.[0] || null
}

export async function getProgressSummary(studentId: string, gradeLevel: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.rpc("get_progress_summary", {
    student_id: studentId,
    grade_level: gradeLevel as any,
  })

  if (error) {
    console.error("Error fetching progress summary:", error)
    return []
  }

  return data || []
}

export async function getStudentAnalytics(studentId: string, days = 30) {
  const supabase = createServerClient()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from("student_analytics")
    .select("*")
    .eq("student_id", studentId)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching student analytics:", error)
    return []
  }

  return data || []
}
