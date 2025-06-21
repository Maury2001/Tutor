import { type NextRequest, NextResponse } from "next/server"
import { TrainingManager } from "@/lib/ai/model-training/training-manager"

const trainingManager = new TrainingManager()

export async function POST(request: NextRequest) {
  try {
    const { name, modelType, datasetId, config } = await request.json()

    if (!name || !modelType || !datasetId || !config) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const job = await trainingManager.startTraining(name, modelType, datasetId, config)

    return NextResponse.json(job)
  } catch (error) {
    console.error("Training start error:", error)
    return NextResponse.json({ error: "Failed to start training" }, { status: 500 })
  }
}
