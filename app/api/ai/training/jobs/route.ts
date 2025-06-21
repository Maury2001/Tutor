import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock training jobs data with proper date objects
    const mockJobs = [
      {
        id: "1",
        name: "CBC Mathematics Model",
        status: "completed",
        progress: 100,
        startedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        completedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        modelType: "fine-tuned-gpt-3.5",
        dataset: "cbc-math-grade-7",
        accuracy: 94.5,
      },
      {
        id: "2",
        name: "CBC Science Model",
        status: "training",
        progress: 67,
        startedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        completedAt: null,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        modelType: "fine-tuned-gpt-4",
        dataset: "cbc-science-grade-8",
        accuracy: null,
      },
    ]

    return NextResponse.json(mockJobs)
  } catch (error) {
    console.error("Error fetching training jobs:", error)
    return NextResponse.json({ error: "Failed to fetch training jobs" }, { status: 500 })
  }
}
