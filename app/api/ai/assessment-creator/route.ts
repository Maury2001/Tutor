import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

interface AssessmentRequest {
  subject: string
  grade: string
  topic: string
  assessmentType: "formative" | "summative" | "diagnostic" | "peer" | "self"
  questionTypes: string[]
  difficulty: "easy" | "medium" | "hard" | "mixed"
  duration: number
  learningObjectives: string[]
  includeRubric: boolean
}

export async function POST(request: NextRequest) {
  try {
    const assessmentRequest: AssessmentRequest = await request.json()

    const systemPrompt = `You are an expert CBC assessment designer for Kenyan schools. Create comprehensive assessments that:

1. Align with CBC competency-based assessment principles
2. Test understanding, not just memorization
3. Include varied question types and difficulty levels
4. Provide clear marking schemes and rubrics
5. Consider diverse learning styles and abilities
6. Use authentic, contextually relevant scenarios
7. Promote higher-order thinking skills
8. Include self-reflection and peer assessment opportunities

Ensure all assessments are fair, valid, and reliable.`

    const userPrompt = `Create a comprehensive ${assessmentRequest.assessmentType} assessment for:

Subject: ${assessmentRequest.subject}
Grade: ${assessmentRequest.grade}
Topic: ${assessmentRequest.topic}
Question Types: ${assessmentRequest.questionTypes.join(", ")}
Difficulty Level: ${assessmentRequest.difficulty}
Duration: ${assessmentRequest.duration} minutes
Learning Objectives: ${assessmentRequest.learningObjectives.join(", ")}
Include Rubric: ${assessmentRequest.includeRubric ? "Yes" : "No"}

Structure the assessment with:
1. Clear Instructions for Students
2. Varied Question Types (${assessmentRequest.questionTypes.join(", ")})
3. Progressive Difficulty Levels
4. Detailed Marking Scheme
${assessmentRequest.includeRubric ? "5. Comprehensive Assessment Rubric" : ""}
6. Answer Key with Explanations
7. Feedback Guidelines for Teachers
8. Student Self-Assessment Section`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 2000,
      temperature: 0.6,
    })

    return NextResponse.json({
      assessment: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Assessment Creator Error:", error)
    return NextResponse.json({ error: "Failed to generate assessment" }, { status: 500 })
  }
}
