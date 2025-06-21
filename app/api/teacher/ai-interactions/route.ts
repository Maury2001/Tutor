import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const studentId = searchParams.get("studentId")
    const learningAreaId = searchParams.get("learningAreaId")
    const days = Number.parseInt(searchParams.get("days") || "30")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")

    const supabase = createServerClient()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    // Base query for interactions
    let query = supabase
      .from("learning_interactions")
      .select(`
        *,
        profiles!learning_interactions_user_id_fkey(full_name, grade_level, avatar_url),
        learning_areas(name, code),
        strands(name, code)
      `)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .eq("interaction_type", "ai_tutoring")

    // Apply filters if provided
    if (classId) {
      query = query.eq("profiles.class_id", classId)
    }

    if (studentId) {
      query = query.eq("user_id", studentId)
    }

    if (learningAreaId) {
      query = query.eq("learning_area_id", learningAreaId)
    }

    // Get total count for pagination
    const { count } = await query.count()

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Get paginated results
    const { data: interactions, error } = await query.order("created_at", { ascending: false }).range(from, to)

    if (error) {
      console.error("Error fetching AI interactions:", error)
      return NextResponse.json({ error: "Failed to fetch interactions" }, { status: 500 })
    }

    // Get summary statistics
    const { data: summary } = await supabase.rpc("get_ai_interaction_summary", {
      p_teacher_id: session.user.id,
      p_days: days,
      p_class_id: classId || null,
      p_learning_area_id: learningAreaId || null,
    })

    // Get popular topics
    const { data: popularTopics } = await supabase.rpc("get_popular_ai_topics", {
      p_teacher_id: session.user.id,
      p_days: days,
      p_class_id: classId || null,
      p_learning_area_id: learningAreaId || null,
      p_limit: 10,
    })

    // Get student engagement metrics
    const { data: studentEngagement } = await supabase.rpc("get_student_ai_engagement", {
      p_teacher_id: session.user.id,
      p_days: days,
      p_class_id: classId || null,
    })

    return NextResponse.json({
      interactions,
      summary: summary || {},
      popularTopics: popularTopics || [],
      studentEngagement: studentEngagement || [],
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    })
  } catch (error) {
    console.error("Error in AI interactions API:", error)
    return NextResponse.json({ error: "Failed to fetch AI interaction data" }, { status: 500 })
  }
}
