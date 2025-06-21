import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data for admin dashboard
    const adminStats = {
      totalUsers: 1247,
      totalStudents: 1089,
      totalTeachers: 158,
      totalMaterials: 342,
      totalTokensUsed: 45678,
      systemHealth: {
        status: "healthy",
        uptime: 168, // hours
        cpuUsage: 45,
        memoryUsage: 62,
        diskUsage: 38,
      },
      aiModelUsage: [
        {
          model: "GPT-4",
          requests: 2341,
          tokensUsed: 23456,
          averageResponseTime: 1200,
        },
        {
          model: "Claude-3",
          requests: 1876,
          tokensUsed: 18234,
          averageResponseTime: 980,
        },
        {
          model: "Gemini Pro",
          requests: 1234,
          tokensUsed: 12456,
          averageResponseTime: 850,
        },
      ],
      userActivity: [
        {
          date: "2024-01-15",
          activeUsers: 234,
          newRegistrations: 12,
          totalSessions: 456,
        },
        {
          date: "2024-01-14",
          activeUsers: 198,
          newRegistrations: 8,
          totalSessions: 389,
        },
        {
          date: "2024-01-13",
          activeUsers: 267,
          newRegistrations: 15,
          totalSessions: 523,
        },
      ],
      subscriptionStats: {
        basic: 892,
        premium: 234,
        enterprise: 121,
        totalRevenue: 45670,
      },
    }

    return NextResponse.json(adminStats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch admin statistics" }, { status: 500 })
  }
}
