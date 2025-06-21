import { NextResponse } from "next/server"

export async function GET() {
  try {
    const mockModels = [
      {
        id: "1",
        name: "CBC-Math-Tutor-v1.2",
        version: "1.2.0",
        status: "deployed",
        accuracy: 94.5,
        deployedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        modelType: "fine-tuned-gpt-3.5",
        size: "1.2 GB",
        usage: "active",
      },
      {
        id: "2",
        name: "CBC-Science-Tutor-v1.0",
        version: "1.0.0",
        status: "training",
        accuracy: null,
        deployedAt: null,
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        modelType: "fine-tuned-gpt-4",
        size: "2.1 GB",
        usage: "development",
      },
    ]

    return NextResponse.json(mockModels)
  } catch (error) {
    console.error("Error fetching models:", error)
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 })
  }
}
