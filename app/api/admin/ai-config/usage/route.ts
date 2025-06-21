import { type NextRequest, NextResponse } from "next/server"
import { globalAIConfig } from "@/lib/ai/global-config"
import { isAdmin } from "@/lib/admin-auth"
import { getServerSession } from "next-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")
    const userId = searchParams.get("userId") || undefined

    const usageStats = await globalAIConfig.getUsageStats(userId, days)
    const costInfo = await globalAIConfig.checkDailyCostLimit()

    return NextResponse.json({
      usageStats,
      costInfo,
      success: true,
    })
  } catch (error: any) {
    console.error("Error fetching usage stats:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch usage statistics" }, { status: 500 })
  }
}
