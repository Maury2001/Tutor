import { NextResponse } from "next/server"

export async function GET() {
  try {
    const mockDatasets = [
      {
        id: "1",
        name: "CBC Mathematics Grade 7",
        description: "Comprehensive dataset for Grade 7 mathematics curriculum",
        size: "2.3 GB",
        samples: 15420,
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: "ready",
        type: "text",
      },
      {
        id: "2",
        name: "CBC Science Grade 8",
        description: "Interactive science experiments and explanations",
        size: "1.8 GB",
        samples: 12350,
        createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: "processing",
        type: "multimodal",
      },
    ]

    return NextResponse.json(mockDatasets)
  } catch (error) {
    console.error("Error fetching datasets:", error)
    return NextResponse.json({ error: "Failed to fetch datasets" }, { status: 500 })
  }
}
