import { createServerClient } from "./server"
import { createClient } from "./client"

export async function getLearningAreas(gradeLevel: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("learning_areas")
    .select(`
      *,
      strands (
        *,
        sub_strands (
          *,
          learning_outcomes (
            *,
            learning_objectives (*)
          )
        )
      )
    `)
    .eq("grade_level", gradeLevel)
    .order("name")

  if (error) {
    console.error("Error fetching learning areas:", error)
    return []
  }

  return data || []
}

export async function getStrandsByLearningArea(learningAreaId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("strands")
    .select(`
      *,
      sub_strands (
        *,
        learning_outcomes (
          *,
          learning_objectives (*)
        )
      )
    `)
    .eq("learning_area_id", learningAreaId)
    .order("sequence_order")

  if (error) {
    console.error("Error fetching strands:", error)
    return []
  }

  return data || []
}

export async function getLearningObjectives(subStrandId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("learning_objectives")
    .select(`
      *,
      learning_outcomes!inner (
        *,
        sub_strands!inner (
          id
        )
      )
    `)
    .eq("learning_outcomes.sub_strands.id", subStrandId)
    .order("sequence_order")

  if (error) {
    console.error("Error fetching learning objectives:", error)
    return []
  }

  return data || []
}

// Client-side functions
export async function getLearningAreasClient(gradeLevel: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("learning_areas").select("*").eq("grade_level", gradeLevel).order("name")

  if (error) {
    console.error("Error fetching learning areas:", error)
    return []
  }

  return data || []
}
