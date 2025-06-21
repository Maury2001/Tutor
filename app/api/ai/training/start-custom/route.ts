import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { parameters, name } = await request.json()

    if (!parameters || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate parameters
    const validationErrors = validateTrainingParameters(parameters)
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Invalid parameters", details: validationErrors }, { status: 400 })
    }

    // Create training job with custom parameters
    const trainingJob = {
      id: `custom_${Date.now()}`,
      name,
      parameters,
      status: "queued",
      createdAt: new Date().toISOString(),
      progress: 0,
    }

    // In a real implementation, this would:
    // 1. Validate all parameters
    // 2. Generate training script
    // 3. Submit to training cluster
    // 4. Return job ID for monitoring

    console.log("Starting custom training with parameters:", parameters)

    return NextResponse.json({
      success: true,
      jobId: trainingJob.id,
      message: "Custom training job started successfully",
    })
  } catch (error) {
    console.error("Custom training error:", error)
    return NextResponse.json({ error: "Failed to start custom training" }, { status: 500 })
  }
}

function validateTrainingParameters(parameters: any): string[] {
  const errors: string[] = []

  // Validate required fields
  if (!parameters.modelType) errors.push("Model type is required")
  if (!parameters.epochs || parameters.epochs < 1) errors.push("Epochs must be at least 1")
  if (!parameters.batchSize || parameters.batchSize < 1) errors.push("Batch size must be at least 1")
  if (!parameters.learningRate || parameters.learningRate <= 0) errors.push("Learning rate must be positive")

  // Validate ranges
  if (parameters.dropout < 0 || parameters.dropout > 1) errors.push("Dropout must be between 0 and 1")
  if (parameters.hiddenSize < 64) errors.push("Hidden size must be at least 64")
  if (parameters.numLayers < 1) errors.push("Number of layers must be at least 1")

  // Validate CBC settings
  if (parameters.curriculumAlignment && parameters.gradeLevel.length === 0) {
    errors.push("At least one grade level must be selected for CBC alignment")
  }

  return errors
}
