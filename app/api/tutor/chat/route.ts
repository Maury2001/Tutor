import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { withCache } from "@/lib/cache/redis"
import { createCacheKey } from "@/lib/cache/redis"

// Cache AI responses for 5 minutes (300 seconds)
const getCachedAIResponse = withCache(
  async (messages: any) => {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        messages: messages,
        maxTokens: 500,
        temperature: 0.7,
      })
      return { text, error: null }
    } catch (error) {
      console.error("OpenAI API error:", error)
      return {
        text: null,
        error: "AI service unavailable",
      }
    }
  },
  "ai-response",
  300,
)

export async function POST(request: NextRequest) {
  try {
    const { messages, userContext } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // System prompt for TutorBot AI
    const systemPrompt = `You are TutorBot AI, an intelligent tutoring assistant specialized in the Kenyan Competency-Based Curriculum (CBC). Your role is to:

1. Help students learn and understand concepts across all subjects and grade levels (PP1, PP2, Grade 1-12)
2. Generate quizzes, practice exercises, and learning materials
3. Explain complex topics in age-appropriate language
4. Provide personalized learning recommendations
5. Track and analyze learning progress
6. Support teachers with curriculum planning and assessment

Key guidelines:
- Always be encouraging and supportive
- Adapt your language to the student's grade level
- Reference CBC learning areas, strands, and sub-strands when relevant
- Provide practical examples and real-world applications
- Offer multiple learning approaches for different learning styles
- Be patient and break down complex concepts into smaller parts

Current user context: ${userContext || "General student"}

Respond in a helpful, educational, and engaging manner.`

    // Convert messages to the format expected by the AI SDK
    const formattedMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ]

    // Generate cache key based on messages content
    const cacheKey = createCacheKey("chat", [
      messages.map((m: any) => ({ role: m.role, content: m.content })),
      userContext,
    ])

    // Use cached AI response if available
    const { text, error } = await getCachedAIResponse(formattedMessages)

    if (error) {
      // Fallback response if OpenAI fails
      const fallbackResponse =
        "I'm having trouble connecting right now, but I'm here to help! You can ask me about creating quizzes, explaining concepts, generating practice exercises, or checking your learning progress. Please try again in a moment."

      return NextResponse.json({
        message: fallbackResponse,
        timestamp: new Date().toISOString(),
        fallback: true,
      })
    }

    return NextResponse.json({
      message: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Chat Error:", error)

    // Fallback response for any error
    return NextResponse.json(
      {
        message: "I'm having trouble processing your request. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        fallback: true,
      },
      { status: 500 },
    )
  }
}
