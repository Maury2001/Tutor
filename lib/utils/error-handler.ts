import { NextResponse } from "next/server"

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}

export class AppError extends Error {
  public readonly status: number
  public readonly code?: string
  public readonly details?: any

  constructor(message: string, status = 500, code?: string, details?: any) {
    super(message)
    this.name = "AppError"
    this.status = status
    this.code = code
    this.details = details
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
      },
      { status: error.status },
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: "INTERNAL_ERROR",
        },
      },
      { status: 500 },
    )
  }

  return NextResponse.json(
    {
      error: {
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
      },
    },
    { status: 500 },
  )
}

export function createApiResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}

export function createErrorResponse(message: string, status = 400, code?: string): NextResponse {
  return NextResponse.json(
    {
      error: {
        message,
        code: code || "BAD_REQUEST",
      },
    },
    { status },
  )
}
