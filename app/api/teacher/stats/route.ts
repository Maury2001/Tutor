import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate database query delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock teacher statistics
    const stats = {
      totalStudents: 45,
      activeMaterials: 23,
      pendingAssignments: 8,
      averageClassScore: 76,
      recentUploads: [
        {
          id: "1",
          title: "Fractions Worksheet",
          subject: "Mathematics",
          uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          downloads: 15,
        },
        {
          id: "2",
          title: "Plant Biology Notes",
          subject: "Science",
          uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          downloads: 22,
        },
      ],
      studentProgress: [
        {
          id: "1",
          name: "Alice Johnson",
          email: "alice@example.com",
          gradeLevel: "Grade 5",
          progress: 85,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          averageScore: 88,
        },
        {
          id: "2",
          name: "Bob Smith",
          email: "bob@example.com",
          gradeLevel: "Grade 5",
          progress: 72,
          lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          averageScore: 75,
        },
        {
          id: "3",
          name: "Carol Davis",
          email: "carol@example.com",
          gradeLevel: "Grade 5",
          progress: 90,
          lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          averageScore: 92,
        },
      ],
      upcomingDeadlines: [
        {
          id: "1",
          title: "Math Quiz 3",
          subject: "Mathematics",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          submissionsCount: 12,
          totalStudents: 25,
        },
        {
          id: "2",
          title: "Science Project",
          subject: "Science",
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          submissionsCount: 8,
          totalStudents: 25,
        },
      ],
      classPerformance: [
        {
          subject: "Mathematics",
          averageScore: 78,
          totalAssignments: 12,
          completionRate: 85,
        },
        {
          subject: "Science",
          averageScore: 82,
          totalAssignments: 10,
          completionRate: 90,
        },
        {
          subject: "English",
          averageScore: 75,
          totalAssignments: 8,
          completionRate: 88,
        },
      ],
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching teacher stats:", error)
    return NextResponse.json({ error: "Failed to fetch teacher statistics" }, { status: 500 })
  }
}
