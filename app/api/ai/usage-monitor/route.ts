import { type NextRequest, NextResponse } from "next/server"
import { OpenAICostMonitor } from "@/lib/ai/cost-management"

export async function GET() {
  try {
    const monitor = OpenAICostMonitor.getInstance()

    return NextResponse.json({
      success: true,
      usage: {
        daily: monitor.getDailyUsage(),
        monthly: monitor.getMonthlyUsage(),
      },
      limits: {
        dailyLimit: 2,
        monthlyLimit: 25,
      },
      status: "monitoring",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get usage data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    const monitor = OpenAICostMonitor.getInstance()

    if (action === "reset-daily") {
      monitor.resetDailyUsage()
      return NextResponse.json({ success: true, message: "Daily usage reset" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
