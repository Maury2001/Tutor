import { NextResponse } from "next/server"
import { cachedQuery } from "@/lib/db/postgres"
import { withCache } from "@/lib/cache/redis"

// Cache curriculum data for 1 hour (3600 seconds)
const getCachedCurriculum = withCache(
  async () => {
    return await cachedQuery("SELECT * FROM learning_areas ORDER BY id LIMIT 100")
  },
  "curriculum",
  3600,
)

export async function GET() {
  try {
    // Use cached data if available
    const data = await getCachedCurriculum()

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching curriculum:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch curriculum",
        message: "Database error occurred",
      },
      { status: 500 },
    )
  }
}
