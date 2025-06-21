import { NextResponse } from "next/server"
import { sql } from "@/lib/db/neon"

export async function GET() {
  try {
    // Simple database test
    const result = await sql`SELECT NOW() as current_time, 'Hello from Neon!' as message`

    return NextResponse.json({
      success: true,
      data: result[0],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
