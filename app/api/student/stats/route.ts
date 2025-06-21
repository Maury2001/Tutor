import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Remove artificial delay for better performance
    // await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock student statistics with better performance
    const stats = {
      totalLessons: 45,
      completedLessons: 32,
      averageScore: 78,
      streak: 5,
      tokensUsed: 150,
      recentActivities: [
        {
          id: "1",
          type: "lesson",
          title: "Introduction to Fractions",
          subject: "Mathematics",
          score: 85,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          type: "quiz",
          title: "Photosynthesis Quiz",
          subject: "Science",
          score: 92,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          type: "tutor",
          title: "Asked about Grammar Rules",
          subject: "English",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
      ],
      upcomingAssignments: [
        {
          id: "1",
          title: "Math Problem Set 5",
          subject: "Mathematics",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending",
        },
        {
          id: "2",
          title: "Science Project",
          subject: "Science",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending",
        },
      ],
      subjectProgress: [
        {
          subject: "Mathematics",
          progress: 75,
          totalTopics: 20,
          completedTopics: 15,
          averageScore: 82,
        },
        {
          subject: "Science",
          progress: 60,
          totalTopics: 18,
          completedTopics: 11,
          averageScore: 78,
        },
        {
          subject: "English",
          progress: 85,
          totalTopics: 16,
          completedTopics: 14,
          averageScore: 88,
        },
        {
          subject: "Kiswahili",
          progress: 70,
          totalTopics: 15,
          completedTopics: 10,
          averageScore: 75,
        },
      ],
      aiRecommendations: [
        "Focus on improving your understanding of fractions.",
        "Try the new photosynthesis lab to boost your science skills.",
        "Practice reading comprehension to improve your English score.",
      ],
    }

    // Add cache headers for better performance
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching student stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch student statistics" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache",
        },
      },
    )
  }
}
