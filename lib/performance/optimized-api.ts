import { type NextRequest, NextResponse } from "next/server"

// Safe JSON serialization
const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj, (key, value) => {
      // Handle circular references and non-serializable values
      if (typeof value === "object" && value !== null) {
        if (value.constructor === Date) {
          return value.toISOString()
        }
        if (value.constructor === RegExp) {
          return value.toString()
        }
        if (typeof value.toString === "function" && value.constructor !== Object && !Array.isArray(value)) {
          return String(value)
        }
      }
      if (typeof value === "function") {
        return "[Function]"
      }
      if (typeof value === "undefined") {
        return null
      }
      return value
    })
  } catch (error) {
    console.warn("JSON stringify failed:", error)
    return JSON.stringify({ error: "Serialization failed", data: String(obj) })
  }
}

// Safe JSON parsing
const safeParse = (str: string): any => {
  try {
    return JSON.parse(str)
  } catch {
    return { error: "Invalid JSON", raw: str }
  }
}

// Optimized API wrapper with safe serialization
export function createOptimizedAPI<T>(
  handler: (req: NextRequest) => Promise<T>,
  options: {
    cacheKey?: (req: NextRequest) => string
    cacheTTL?: number
    enableCompression?: boolean
    rateLimit?: number
  } = {},
) {
  return async (req: NextRequest) => {
    const startTime = Date.now()

    try {
      // Execute handler
      const result = await handler(req)

      // Ensure result is serializable
      const safeResult = result === null || result === undefined ? { data: null } : result

      const responseTime = Date.now() - startTime

      return new NextResponse(safeStringify(safeResult), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Response-Time": `${responseTime}ms`,
          "Cache-Control": "public, max-age=60",
        },
      })
    } catch (error) {
      console.error("API Error:", error)

      const errorResponse = {
        success: false,
        error: String(error instanceof Error ? error.message : "Internal server error"),
        timestamp: new Date().toISOString(),
      }

      return new NextResponse(safeStringify(errorResponse), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "X-Response-Time": `${Date.now() - startTime}ms`,
        },
      })
    }
  }
}

// Fast response helpers with safe serialization
export const fastResponses = {
  success: (data: any, message = "Success") => {
    const response = { success: true, data: data || null, message: String(message) }
    return new NextResponse(safeStringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  },

  error: (message: string, status = 400) => {
    const response = { success: false, error: String(message) }
    return new NextResponse(safeStringify(response), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  },

  cached: (data: any, cacheAge = 300) => {
    const response = { data: data || null, cached: true }
    return new NextResponse(safeStringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${Number(cacheAge)}`,
      },
    })
  },
}
