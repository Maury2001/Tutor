import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

interface LessonPlanRequest {
  subject: string
  grade: string
  topic: string
  duration: number // in minutes
  learningObjectives: string[]
  resources?: string[]
  specialNeeds?: string
  assessmentType?: string
}

export async function POST(request: NextRequest) {
  try {
    const lessonRequest: LessonPlanRequest = await request.json()

    const systemPrompt = `You are an expert CBC curriculum lesson planner for Kenyan schools. Create comprehensive, engaging lesson plans that:

1. Align with CBC competency-based learning
2. Include clear learning objectives and success criteria
3. Incorporate diverse teaching methodologies
4. Consider different learning styles and abilities
5. Include formative and summative assessment strategies
6. Use locally relevant examples and contexts
7. Promote critical thinking and problem-solving
8. Integrate cross-curricular connections where appropriate

Format your response as a structured lesson plan with clear sections.`

    const userPrompt = `Create a detailed lesson plan for:

Subject: ${lessonRequest.subject}
Grade: ${lessonRequest.grade}
Topic: ${lessonRequest.topic}
Duration: ${lessonRequest.duration} minutes
Learning Objectives: ${lessonRequest.learningObjectives.join(", ")}
${lessonRequest.resources ? `Available Resources: ${lessonRequest.resources.join(", ")}` : ""}
${lessonRequest.specialNeeds ? `Special Considerations: ${lessonRequest.specialNeeds}` : ""}
${lessonRequest.assessmentType ? `Assessment Focus: ${lessonRequest.assessmentType}` : ""}

Include:
1. Lesson Overview and Objectives
2. Materials and Resources Needed
3. Lesson Structure (Introduction, Development, Conclusion)
4. Teaching Activities and Methodologies
5. Assessment Strategies
6. Differentiation for Various Learning Needs
7. Homework/Extension Activities
8. Reflection and Evaluation Criteria`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 1500,
      temperature: 0.7,
    })

    return NextResponse.json({
      lessonPlan: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Lesson Planner Error:", error)
    return NextResponse.json({ error: "Failed to generate lesson plan" }, { status: 500 })
  }
}
