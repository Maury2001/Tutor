import { createServerClient } from "./server"
import { createClient } from "./client"

export async function getCurrentUser() {
  const supabase = createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Get profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return {
    ...user,
    profile,
  }
}

export async function updateProfile(
  userId: string,
  updates: {
    full_name?: string
    role?: "student" | "teacher" | "admin" | "parent"
    grade_level?: string
    school_name?: string
    avatar_url?: string
  },
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()

  if (error) {
    console.error("Error updating profile:", error)
    return null
  }

  return data?.[0] || null
}

export async function signUpWithProfile(
  email: string,
  password: string,
  profileData: {
    full_name: string
    role: "student" | "teacher" | "admin" | "parent"
    grade_level?: string
    school_name?: string
  },
) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: profileData,
    },
  })

  if (error) {
    console.error("Error signing up:", error)
    return { user: null, error }
  }

  return { user: data.user, error: null }
}
