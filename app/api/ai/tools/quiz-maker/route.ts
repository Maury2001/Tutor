import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, grade, topic, questionCount, timeLimit, difficulty } = body

    if (!subject || !grade || !topic) {
      return NextResponse.json({ error: "Subject, grade, and topic are required" }, { status: 400 })
    }

    const prompt = `Create an interactive quiz for:
Subject: ${subject}
Grade: ${grade}
Topic: ${topic}
Number of Questions: ${questionCount}
Time Limit: ${timeLimit} minutes
Difficulty: ${difficulty}

Please include:
1. ${questionCount} multiple-choice questions with 4 options each
2. Clear, concise questions appropriate for ${grade} students
3. Correct answers marked
4. Brief explanations for each answer
5. Point values for each question
6. Instructions for students
7. CBC curriculum alignment

Ensure questions test different levels of understanding (knowledge, comprehension, application).`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
      temperature: 0.6,
    })

    return NextResponse.json({
      content: text,
      metadata: {
        subject,
        grade,
        topic,
        questionCount,
        timeLimit,
        difficulty,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
