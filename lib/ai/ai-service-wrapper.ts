/**
 * AI Service Wrapper
 *
 * This utility provides a standardized interface for interacting with AI services,
 * with built-in error handling, logging, and diagnostics.
 */

import { OpenAI } from "openai"
import { createAIErrorHandler, type AIError } from "./error-logger"
import { logDiagnosticResult, runAIDiagnostics } from "./diagnostic-tool"

interface AIServiceConfig {
  apiKey?: string
  model?: string
  maxRetries?: number
  timeout?: number
  organization?: string
}

interface CompletionOptions {
  prompt: string
  model?: string
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
  stream?: boolean
}

interface ChatOptions {
  messages: Array<{ role: string; content: string }>
  model?: string
  maxTokens?: number
  temperature?: number
  stream?: boolean
}

export class AIService {
  private openai: OpenAI | null = null
  private defaultModel: string
  private errorHandler: (error: any) => AIError
  private maxRetries: number
  private isConfigured = false

  constructor(config: AIServiceConfig = {}) {
    const apiKey = config.apiKey || process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.warn("OpenAI API key not found - AI service will use fallback responses")
      this.isConfigured = false
    } else {
      try {
        this.openai = new OpenAI({
          apiKey,
          organization: config.organization,
          timeout: config.timeout || 30000,
          maxRetries: 0, // We'll handle retries ourselves
        })
        this.isConfigured = true
      } catch (error) {
        console.error("Failed to initialize OpenAI client:", error)
        this.isConfigured = false
      }
    }

    this.defaultModel = config.model || "gpt-3.5-turbo"
    this.maxRetries = config.maxRetries || 2
    this.errorHandler = createAIErrorHandler("AIService")
  }

  async completion(options: CompletionOptions): Promise<string> {
    if (!this.isConfigured || !this.openai) {
      return this.generateFallbackResponse(options.prompt)
    }

    const model = options.model || this.defaultModel
    let retries = 0

    while (true) {
      try {
        const messages = []

        if (options.systemPrompt) {
          messages.push({
            role: "system",
            content: options.systemPrompt,
          })
        }

        messages.push({
          role: "user",
          content: options.prompt,
        })

        const response = await this.openai.chat.completions.create({
          model,
          messages,
          max_tokens: options.maxTokens,
          temperature: options.temperature,
          stream: options.stream || false,
        })

        return response.choices[0].message.content || ""
      } catch (error) {
        if (retries >= this.maxRetries) {
          console.error("AI completion failed after retries:", error)
          return this.generateFallbackResponse(options.prompt)
        }

        retries++
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retries)))
      }
    }
  }

  async chat(options: ChatOptions): Promise<string> {
    if (!this.isConfigured || !this.openai) {
      const lastMessage = options.messages[options.messages.length - 1]
      return this.generateFallbackResponse(lastMessage?.content || "")
    }

    const model = options.model || this.defaultModel
    let retries = 0

    while (true) {
      try {
        const response = await this.openai.chat.completions.create({
          model,
          messages: options.messages,
          max_tokens: options.maxTokens,
          temperature: options.temperature,
          stream: options.stream || false,
        })

        return response.choices[0].message.content || ""
      } catch (error) {
        if (retries >= this.maxRetries) {
          console.error("AI chat failed after retries:", error)
          const lastMessage = options.messages[options.messages.length - 1]
          return this.generateFallbackResponse(lastMessage?.content || "")
        }

        retries++
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retries)))
      }
    }
  }

  async streamChat(options: ChatOptions): Promise<ReadableStream | null> {
    if (!this.isConfigured || !this.openai) {
      return null
    }

    const model = options.model || this.defaultModel

    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages: options.messages,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        stream: true,
      })

      return response as unknown as ReadableStream
    } catch (error) {
      console.error("AI stream chat failed:", error)
      return null
    }
  }

  async runDiagnostics(): Promise<any> {
    try {
      const report = await runAIDiagnostics()
      await logDiagnosticResult(report)
      return report
    } catch (error) {
      console.error("Diagnostics failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        configured: this.isConfigured,
      }
    }
  }

  private generateFallbackResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes("math") || lowerPrompt.includes("mathematics")) {
      return "Mathematics is a fundamental subject in the CBC curriculum. It develops logical thinking and problem-solving skills. What specific math topic would you like help with?"
    }

    if (lowerPrompt.includes("science")) {
      return "Science in the CBC curriculum covers biology, chemistry, and physics. It encourages hands-on learning and scientific inquiry. What science concept can I help you understand?"
    }

    if (lowerPrompt.includes("english") || lowerPrompt.includes("language")) {
      return "English Language focuses on communication and literacy skills. The CBC approach emphasizes practical language use, reading comprehension, and creative writing. How can I assist you with English?"
    }

    if (lowerPrompt.includes("kiswahili")) {
      return "Kiswahili ni lugha muhimu katika mtaala wa CBC. Inalenga kuimarisha ujuzi wa mawasiliano na utamaduni wa Kiafrika. Je, ungependa msaada gani katika Kiswahili?"
    }

    return "I'm here to help you learn! While I'm having some technical difficulties connecting to the AI service right now, I can still try to assist you with the CBC curriculum. Could you please tell me more specifically what you'd like to learn about?"
  }

  isServiceConfigured(): boolean {
    return this.isConfigured
  }
}

// Create a singleton instance with default config
let aiServiceInstance: AIService | null = null

export function getAIService(config?: AIServiceConfig): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(config)
  }
  return aiServiceInstance
}
