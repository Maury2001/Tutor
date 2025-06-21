import type { TrainingJob, TrainingConfig, ModelVersion } from "./types"

export class TrainingManager {
  private trainingJobs: Map<string, TrainingJob> = new Map()
  private models: Map<string, ModelVersion> = new Map()

  async startTraining(
    name: string,
    modelType: string,
    datasetId: string,
    config: TrainingConfig,
  ): Promise<TrainingJob> {
    const job: TrainingJob = {
      id: this.generateId(),
      name,
      modelType: modelType as any,
      datasetId,
      config,
      status: "queued",
      progress: 0,
      createdAt: new Date(),
    }

    this.trainingJobs.set(job.id, job)

    // Start training process
    this.executeTraining(job)

    return job
  }

  private async executeTraining(job: TrainingJob): Promise<void> {
    try {
      job.status = "running"
      job.startedAt = new Date()

      // Simulate training process with progress updates
      for (let epoch = 1; epoch <= job.config.epochs; epoch++) {
        await this.trainEpoch(job, epoch)
        job.progress = (epoch / job.config.epochs) * 100

        // Simulate metrics calculation
        job.metrics = {
          loss: Math.max(0.1, 2.0 - epoch * 0.1),
          accuracy: Math.min(0.95, 0.3 + epoch * 0.05),
          validationLoss: Math.max(0.15, 2.2 - epoch * 0.1),
          validationAccuracy: Math.min(0.9, 0.25 + epoch * 0.05),
          perplexity: Math.max(1.5, 10 - epoch * 0.5),
        }

        // Early stopping check
        if (this.shouldEarlyStop(job)) {
          console.log(`Early stopping at epoch ${epoch}`)
          break
        }
      }

      job.status = "completed"
      job.completedAt = new Date()
      job.progress = 100

      // Create model version
      await this.createModelVersion(job)
    } catch (error) {
      job.status = "failed"
      job.error = error instanceof Error ? error.message : "Unknown error"
    }
  }

  private async trainEpoch(job: TrainingJob, epoch: number): Promise<void> {
    // Simulate training time
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Training ${job.name} - Epoch ${epoch}/${job.config.epochs}`)
  }

  private shouldEarlyStop(job: TrainingJob): boolean {
    if (!job.metrics) return false

    // Simple early stopping logic
    return job.metrics.validationAccuracy > 0.85 && job.metrics.validationLoss < 0.3
  }

  private async createModelVersion(job: TrainingJob): Promise<void> {
    if (!job.metrics) return

    const model: ModelVersion = {
      id: this.generateId(),
      name: `${job.name}_v${Date.now()}`,
      version: "1.0.0",
      modelType: job.modelType,
      trainingJobId: job.id,
      status: "ready",
      metrics: job.metrics,
      isActive: false,
    }

    this.models.set(model.id, model)
  }

  async getTrainingJob(id: string): Promise<TrainingJob | null> {
    return this.trainingJobs.get(id) || null
  }

  async listTrainingJobs(): Promise<TrainingJob[]> {
    return Array.from(this.trainingJobs.values())
  }

  async cancelTraining(id: string): Promise<void> {
    const job = this.trainingJobs.get(id)
    if (job && job.status === "running") {
      job.status = "cancelled"
    }
  }

  async deployModel(modelId: string): Promise<void> {
    const model = this.models.get(modelId)
    if (!model) throw new Error("Model not found")

    // Deactivate other models of the same type
    for (const [id, m] of this.models) {
      if (m.modelType === model.modelType && m.isActive) {
        m.isActive = false
      }
    }

    model.status = "deployed"
    model.isActive = true
    model.deployedAt = new Date()
  }

  async listModels(): Promise<ModelVersion[]> {
    return Array.from(this.models.values())
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
