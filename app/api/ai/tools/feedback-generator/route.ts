import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentWork, rubric, grade, subject } = body

    if (!studentWork || !grade || !subject) {
      return NextResponse.json({ error: "Student work, grade, and subject are required" }, { status: 400 })
    }

    const prompt = `Generate personalized feedback for a ${grade} student's work in ${subject}:

Student Work: ${studentWork}
Assessment Rubric: ${rubric || "Standard CBC assessment criteria"}

Please provide:
1. Positive reinforcement (what the student did well)
2. Specific areas for improvement
3. Constructive suggestions for next steps
4. Encouragement and motivation
5. Connection to CBC learning outcomes
6. Actionable recommendations
7. Age-appropriate language for ${grade} level

Make the feedback supportive, specific, and growth-oriented.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1500,
      temperature: 0.7,
    })

    return NextResponse.json({
      content: text,
      metadata: {
        grade,
        subject,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating feedback:", error)
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 })
  }
}
