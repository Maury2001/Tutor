import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentQuery, subject, grade, learningStyle, previousInteractions } = body

    if (!studentQuery || !subject || !grade) {
      return NextResponse.json({ error: "Student query, subject, and grade are required" }, { status: 400 })
    }

    const prompt = `Act as an adaptive AI tutor for a ${grade} student:

Subject: ${subject}
Student Question/Query: ${studentQuery}
Learning Style: ${learningStyle || "mixed"}
Previous Interactions: ${previousInteractions || "None"}

Please provide:
1. Clear, age-appropriate explanation
2. Step-by-step guidance if needed
3. Interactive questions to check understanding
4. Visual or practical examples
5. Connection to CBC curriculum
6. Encouragement and positive reinforcement
7. Follow-up questions or activities
8. Adaptive difficulty based on student response

Respond as a friendly, patient tutor using Kenyan context where relevant.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1500,
      temperature: 0.8,
    })

    return NextResponse.json({
      response: text,
      metadata: {
        subject,
        grade,
        learningStyle,
        respondedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error in adaptive tutor:", error)
    return NextResponse.json({ error: "Failed to generate tutor response" }, { status: 500 })
  }
}
