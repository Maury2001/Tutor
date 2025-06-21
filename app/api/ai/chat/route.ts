import type { NextRequest } from "next/server"
import { createGroq } from "@ai-sdk/groq"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { createOptimizedAPI, fastResponses } from "@/lib/performance/optimized-api"
import { fastCache } from "@/lib/performance/fast-cache"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// Cache common responses
const getCachedResponse = (prompt: string) => {
  const cacheKey = `ai-response-${Buffer.from(prompt).toString("base64").slice(0, 32)}`
  return fastCache.get(cacheKey)
}

const setCachedResponse = (prompt: string, response: string) => {
  const cacheKey = `ai-response-${Buffer.from(prompt).toString("base64").slice(0, 32)}`
  fastCache.set(cacheKey, response, 300000) // 5 minutes
}

// Fast AI models configuration
const AI_MODELS = {
  "gpt-4o-mini": {
    provider: "openai",
    name: "GPT-4o Mini",
    speed: "fast",
    cost: "low",
  },
  "llama3-70b-8192": {
    provider: "groq",
    name: "Llama 3 70B",
    speed: "very fast",
    cost: "free",
  },
  "llama3-8b-8192": {
    provider: "groq",
    name: "Llama 3 8B",
    speed: "very fast",
    cost: "free",
  },
}

export const GET = createOptimizedAPI(
  async () => {
    return {
      models: AI_MODELS,
      defaultModel: "llama3-8b-8192", // Fastest model as default
    }
  },
  {
    cacheKey: () => "ai-models",
    cacheTTL: 3600000, // 1 hour
  },
)

export const POST = createOptimizedAPI(
  async (request: NextRequest) => {
    const startTime = Date.now()

    try {
      const body = await request.json()
      const { messages, selectedModel = "llama3-8b-8192" } = body

      if (!messages || !Array.isArray(messages)) {
        return fastResponses.error("Messages array is required", 400)
      }

      const lastMessage = messages[messages.length - 1]?.content || ""

      // Check cache for common queries
      const cachedResponse = getCachedResponse(lastMessage)
      if (cachedResponse) {
        return fastResponses.cached({
          message: cachedResponse,
          timestamp: new Date().toISOString(),
          modelUsed: "cached",
          responseTime: Date.now() - startTime,
          success: true,
        })
      }

      // Use fastest available model
      const modelConfig = AI_MODELS[selectedModel as keyof typeof AI_MODELS]
      let response = ""

      // System prompt optimized for speed
      const systemPrompt = `You are TutorBot AI for CBC curriculum. Be concise and helpful.
Current context: ${body.userContext || "General student"}
Respond briefly and clearly.`

      const formattedMessages = [
        { role: "system" as const, content: systemPrompt },
        ...messages.map((msg: any) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ]

      try {
        if (modelConfig.provider === "groq") {
          const { text } = await generateText({
            model: groq(selectedModel),
            messages: formattedMessages,
            maxTokens: 500, // Reduced for speed
            temperature: 0.7,
          })
          response = text
        } else if (modelConfig.provider === "openai" && process.env.OPENAI_API_KEY) {
          const { text } = await generateText({
            model: openai(selectedModel),
            messages: formattedMessages,
            maxTokens: 500, // Reduced for speed
            temperature: 0.7,
          })
          response = text
        } else {
          response = generateFallbackResponse(lastMessage)
        }

        // Cache successful responses
        if (response && response.length > 10) {
          setCachedResponse(lastMessage, response)
        }

        return fastResponses.success({
          message: response,
          timestamp: new Date().toISOString(),
          modelUsed: selectedModel,
          modelInfo: modelConfig,
          responseTime: Date.now() - startTime,
        })
      } catch (error) {
        console.warn(`Model ${selectedModel} failed, using fallback`)
        response = generateFallbackResponse(lastMessage)

        return fastResponses.success({
          message: response,
          timestamp: new Date().toISOString(),
          modelUsed: "fallback",
          fallbackUsed: true,
          responseTime: Date.now() - startTime,
        })
      }
    } catch (error) {
      console.error("AI Chat Error:", error)
      return fastResponses.error("AI service temporarily unavailable", 500)
    }
  },
  {
    enableCompression: true,
  },
)

// Optimized fallback responses
function generateFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()

  const responses = {
    math: "Math helps develop logical thinking. What specific topic do you need help with?",
    science: "Science encourages hands-on learning. Which concept would you like to explore?",
    english: "English develops communication skills. How can I help with language learning?",
    kiswahili: "Kiswahili ni muhimu kwa mawasiliano. Je, ungependa msaada gani?",
    default: "I'm here to help with CBC curriculum. What would you like to learn about?",
  }

  for (const [key, response] of Object.entries(responses)) {
    if (key !== "default" && message.includes(key)) {
      return response
    }
  }

  return responses.default
}
