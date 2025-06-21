import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables safely
    const hasGoogleClientId = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID.length > 10)
    const hasGoogleClientSecret = !!(process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET.length > 10)
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL

    // Auto-detect base URL
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

    const config = {
      environment: process.env.NODE_ENV || "development",
      baseUrl,
      nextAuthUrl: process.env.NEXTAUTH_URL || baseUrl,
      providers: {
        credentials: true,
        google: hasGoogleClientId && hasGoogleClientSecret,
      },
      configuration: {
        nextAuthSecret: hasNextAuthSecret,
        nextAuthUrl: hasNextAuthUrl,
        googleClientId: hasGoogleClientId,
        googleClientSecret: hasGoogleClientSecret,
      },
      status: "configured",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Config API error:", error)
    return NextResponse.json(
      {
        error: "Configuration check failed",
        message: "Unable to retrieve configuration",
        timestamp: new Date().toISOString(),
        status: "error",
      },
      { status: 500 },
    )
  }
}
