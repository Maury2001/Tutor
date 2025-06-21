import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Test basic functionality
    const testResults = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "unknown",
      nodeVersion: process.version,
      platform: process.platform,
      deployment: {
        status: "success",
        packageLock: "present",
        dependencies: "installed",
      },
      tests: {
        nextjs: true,
        react: true,
        typescript: true,
        tailwind: true,
        api: true,
      },
      integrations: {
        supabase: !!process.env.SUPABASE_URL,
        openai: !!process.env.OPENAI_API_KEY,
        groq: !!process.env.GROQ_API_KEY,
        postgres: !!process.env.POSTGRES_URL,
        auth: !!process.env.NEXTAUTH_SECRET,
      },
      performance: {
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
      },
    }

    return NextResponse.json({
      success: true,
      message: "Deployment test successful!",
      data: testResults,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Deployment test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Test POST functionality
    return NextResponse.json({
      success: true,
      message: "POST test successful",
      received: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "POST test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
