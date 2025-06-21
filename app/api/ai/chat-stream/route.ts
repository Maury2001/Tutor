import type { NextRequest } from "next/server"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { messages, userContext, subject, gradeLevel } = await request.json()

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured",
          fallback: true,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Enhanced system prompt with more context
    const systemPrompt = `You are TutorBot AI, an expert tutoring assistant for the Kenyan Competency-Based Curriculum (CBC).

Context:
- Subject: ${subject || "General"}
- Grade Level: ${gradeLevel || "Not specified"}
- User Context: ${userContext || "Student"}

Your capabilities:
1. **Curriculum Expertise**: Deep knowledge of CBC learning areas, strands, and sub-strands
2. **Adaptive Teaching**: Adjust explanations based on grade level and learning style
3. **Assessment Creation**: Generate quizzes, tests, and practice exercises
4. **Progress Tracking**: Analyze learning patterns and provide insights
5. **Multi-subject Support**: Mathematics, Science, Languages, Social Studies, etc.

Teaching approach:
- Use age-appropriate language and examples
- Encourage critical thinking and problem-solving
- Provide step-by-step explanations
- Offer multiple learning pathways
- Connect concepts to real-world applications
- Be patient, supportive, and encouraging

Always aim to make learning engaging, accessible, and effective for Kenyan students.`

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      maxTokens: 800,
      temperature: 0.7,
    })

    return result.toAIStreamResponse()
  } catch (error: any) {
    console.error("AI Streaming Error:", error)

    // Return a proper error response for streaming
    return new Response(
      JSON.stringify({
        error: "AI service temporarily unavailable",
        details: error.message,
        fallback: true,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
