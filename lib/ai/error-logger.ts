/**
 * AI Integration Error Logger
 *
 * This utility provides detailed error logging for AI integration issues,
 * with structured error categorization and persistence.
 */

import { createClient } from "@supabase/supabase-js"

export enum AIErrorType {
  API_KEY = "api_key",
  NETWORK = "network",
  RATE_LIMIT = "rate_limit",
  IMPLEMENTATION = "implementation",
  MODEL = "model",
  CONTENT_FILTER = "content_filter",
  UNKNOWN = "unknown",
}

export interface AIErrorDetails {
  message: string
  type: AIErrorType
  component?: string
  endpoint?: string
  statusCode?: number
  requestId?: string
  modelName?: string
  additionalInfo?: any
}

export class AIError extends Error {
  type: AIErrorType
  component?: string
  endpoint?: string
  statusCode?: number
  requestId?: string
  modelName?: string
  additionalInfo?: any
  timestamp: Date

  constructor(details: AIErrorDetails) {
    super(details.message)
    this.name = "AIError"
    this.type = details.type
    this.component = details.component
    this.endpoint = details.endpoint
    this.statusCode = details.statusCode
    this.requestId = details.requestId
    this.modelName = details.modelName
    this.additionalInfo = details.additionalInfo
    this.timestamp = new Date()
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      component: this.component,
      endpoint: this.endpoint,
      statusCode: this.statusCode,
      requestId: this.requestId,
      modelName: this.modelName,
      additionalInfo: this.additionalInfo,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    }
  }
}

export async function logAIError(error: AIError | Error): Promise<void> {
  // First, log to console for immediate visibility
  console.error("[AI ERROR]", error)

  try {
    // Then attempt to persist to database
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Cannot log AI error: Missing Supabase credentials")
      return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Prepare error data for storage
    const errorData =
      error instanceof AIError
        ? {
            message: error.message,
            type: error.type,
            component: error.component,
            endpoint: error.endpoint,
            status_code: error.statusCode,
            request_id: error.requestId,
            model_name: error.modelName,
            additional_info: error.additionalInfo,
            stack_trace: error.stack,
            created_at: error.timestamp.toISOString(),
          }
        : {
            message: error.message,
            type: AIErrorType.UNKNOWN,
            stack_trace: error.stack,
            created_at: new Date().toISOString(),
          }

    // Insert into error log table
    await supabase.from("ai_error_logs").insert(errorData)
  } catch (logError) {
    // If logging fails, at least we tried
    console.error("Failed to persist AI error to database:", logError)
  }
}

export function parseOpenAIError(error: any): AIError {
  // Default values
  let type = AIErrorType.UNKNOWN
  let statusCode = undefined
  let message = error.message || "Unknown OpenAI error"

  // Extract more details if available
  if (error.response) {
    statusCode = error.response.status

    // Categorize based on status code
    if (statusCode === 401) {
      type = AIErrorType.API_KEY
      message = "Invalid API key"
    } else if (statusCode === 429) {
      type = AIErrorType.RATE_LIMIT
      message = "Rate limit exceeded"
    } else if (statusCode === 400) {
      // Check for content filter issues
      if (error.response.data?.error?.code === "content_filter") {
        type = AIErrorType.CONTENT_FILTER
        message = "Content filtered by OpenAI"
      } else {
        type = AIErrorType.IMPLEMENTATION
        message = error.response.data?.error?.message || "Bad request to OpenAI API"
      }
    } else if (statusCode >= 500) {
      type = AIErrorType.MODEL
      message = "OpenAI service error"
    }
  } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
    type = AIErrorType.NETWORK
    message = "Network connectivity issue"
  }

  // Create structured error
  return new AIError({
    message,
    type,
    statusCode,
    endpoint: error.response?.request?.path,
    requestId: error.response?.headers?.["x-request-id"],
    modelName: error.response?.config?.data?.model,
    additionalInfo: error.response?.data,
  })
}

export function parseGroqError(error: any): AIError {
  // Default values
  let type = AIErrorType.UNKNOWN
  let statusCode = undefined
  let message = error.message || "Unknown Groq error"

  // Extract more details if available
  if (error.response) {
    statusCode = error.response.status

    // Categorize based on status code
    if (statusCode === 401) {
      type = AIErrorType.API_KEY
      message = "Invalid Groq API key"
    } else if (statusCode === 429) {
      type = AIErrorType.RATE_LIMIT
      message = "Groq rate limit exceeded"
    } else if (statusCode === 400) {
      type = AIErrorType.IMPLEMENTATION
      message = error.response.data?.error?.message || "Bad request to Groq API"
    } else if (statusCode >= 500) {
      type = AIErrorType.MODEL
      message = "Groq service error"
    }
  } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
    type = AIErrorType.NETWORK
    message = "Network connectivity issue"
  }

  // Create structured error
  return new AIError({
    message,
    type,
    statusCode,
    endpoint: error.response?.request?.path,
    requestId: error.response?.headers?.["x-request-id"],
    modelName: error.response?.config?.data?.model,
    additionalInfo: error.response?.data,
  })
}

export function createAIErrorHandler(component: string) {
  return (error: any) => {
    let aiError: AIError

    // Check if it's already an AIError
    if (error instanceof AIError) {
      aiError = error
      aiError.component = aiError.component || component
    }
    // Parse known API errors
    else if (error.response && error.response.config?.baseURL?.includes("api.openai.com")) {
      aiError = parseOpenAIError(error)
      aiError.component = component
    } else if (error.response && error.response.config?.baseURL?.includes("api.groq.com")) {
      aiError = parseGroqError(error)
      aiError.component = component
    }
    // Generic error
    else {
      aiError = new AIError({
        message: error.message || "Unknown error",
        type: AIErrorType.UNKNOWN,
        component,
        additionalInfo: { originalError: error },
      })
    }

    // Log the error
    logAIError(aiError)

    // Return the structured error for further handling
    return aiError
  }
}
