import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, subject, grade } = body

    if (!content || !subject || !grade) {
      return NextResponse.json({ error: "Content, subject, and grade are required" }, { status: 400 })
    }

    const prompt = `Analyze the following educational content for CBC curriculum alignment:

Subject: ${subject}
Grade: ${grade}
Content to Analyze: ${content}

Please provide:
1. CBC curriculum alignment score (1-10)
2. Specific learning outcomes addressed
3. Strand and sub-strand identification
4. Age-appropriateness assessment
5. Suggestions for improvement
6. Missing curriculum elements
7. Recommendations for better alignment
8. Cultural relevance for Kenyan context

Provide detailed analysis with specific references to CBC framework.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
      temperature: 0.6,
    })

    return NextResponse.json({
      analysis: text,
      metadata: {
        subject,
        grade,
        analyzedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error analyzing curriculum:", error)
    return NextResponse.json({ error: "Failed to analyze curriculum" }, { status: 500 })
  }
}
