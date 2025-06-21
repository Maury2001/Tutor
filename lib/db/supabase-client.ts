import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Server-side client with service role key
export const supabaseAdmin = createClient<Database>(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Database query helpers
export const dbQuery = {
  // Users
  async getUser(id: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) throw error
    return data
  },

  // Curriculum
  async getLearningAreas() {
    const { data, error } = await supabase
      .from("curriculum_learning_areas")
      .select("*")
      .eq("is_active", true)
      .order("name")

    if (error) throw error
    return data
  },

  async getStrandsByLearningArea(learningAreaId: string) {
    const { data, error } = await supabase
      .from("curriculum_strands")
      .select("*")
      .eq("learning_area_id", learningAreaId)
      .eq("is_active", true)
      .order("sequence_order")

    if (error) throw error
    return data
  },

  async getOutcomesByGrade(gradeLevel: number) {
    const { data, error } = await supabase
      .from("curriculum_outcomes")
      .select(`
        *,
        curriculum_sub_strands (
          *,
          curriculum_strands (
            *,
            curriculum_learning_areas (*)
          )
        )
      `)
      .eq("grade_level", gradeLevel)
      .eq("is_active", true)

    if (error) throw error
    return data
  },

  // Progress tracking
  async getStudentProgress(userId: string, gradeLevel: number) {
    const { data, error } = await supabase
      .from("student_progress")
      .select(`
        *,
        curriculum_learning_areas (*),
        curriculum_strands (*),
        curriculum_sub_strands (*),
        curriculum_outcomes (*)
      `)
      .eq("user_id", userId)
      .eq("grade_level", gradeLevel)

    if (error) throw error
    return data
  },

  // AI Interactions
  async logAIInteraction(interaction: {
    user_id: string
    interaction_type: string
    prompt: string
    response: string
    context?: any
    learning_area_id?: string
    grade_level?: number
    ai_model?: string
    tokens_used?: number
    response_time_ms?: number
  }) {
    const { data, error } = await supabase.from("ai_interactions").insert(interaction).select().single()

    if (error) throw error
    return data
  },

  // Assessments
  async getAssessmentsByGrade(gradeLevel: number, learningAreaId?: string) {
    let query = supabase
      .from("assessments")
      .select(`
        *,
        curriculum_learning_areas (*),
        curriculum_strands (*),
        curriculum_sub_strands (*)
      `)
      .contains("grade_levels", [gradeLevel])
      .eq("is_published", true)

    if (learningAreaId) {
      query = query.eq("learning_area_id", learningAreaId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async saveQuizAttempt(attempt: {
    user_id: string
    assessment_id: string
    answers: any
    score: number
    total_marks: number
    percentage: number
    time_taken_minutes?: number
    completed_at?: string
    is_completed: boolean
    feedback?: any
  }) {
    const { data, error } = await supabase.from("quiz_attempts").insert(attempt).select().single()

    if (error) throw error
    return data
  },
}

export default supabase
