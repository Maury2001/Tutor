import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, grade, topic, type, difficulty } = body

    if (!subject || !grade || !topic) {
      return NextResponse.json({ error: "Subject, grade, and topic are required" }, { status: 400 })
    }

    const prompt = `Create an engaging worksheet for:
Subject: ${subject}
Grade: ${grade}
Topic: ${topic}
Type: ${type || "practice worksheet"}
Difficulty: ${difficulty || "medium"}

Please include:
1. Clear title and instructions
2. Variety of question types (fill-in-the-blank, matching, short answer, etc.)
3. Visual elements descriptions where appropriate
4. Progressive difficulty levels
5. Answer key
6. Extension activities
7. CBC curriculum alignment notes
8. Space for student name and date

Make it age-appropriate for ${grade} students and engaging for Kenyan learners.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    return NextResponse.json({
      content: text,
      metadata: {
        subject,
        grade,
        topic,
        type,
        difficulty,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating worksheet:", error)
    return NextResponse.json({ error: "Failed to generate worksheet" }, { status: 500 })
  }
}
