import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, subject, grade, topic, format } = body

    if (!type || !subject || !grade || !topic) {
      return NextResponse.json({ error: "Type, subject, grade, and topic are required" }, { status: 400 })
    }

    const prompt = `Create educational ${type} content for:
Subject: ${subject}
Grade: ${grade}
Topic: ${topic}
Format: ${format}

Please create engaging, age-appropriate content that includes:
1. Clear learning objectives
2. Step-by-step instructions or explanations
3. Interactive elements or activities
4. Visual descriptions where applicable
5. Assessment opportunities
6. Extension activities
7. CBC curriculum alignment

Make it suitable for Kenyan students and include local context where relevant.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    return NextResponse.json({
      content: text,
      metadata: {
        type,
        subject,
        grade,
        topic,
        format,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
