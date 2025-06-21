export interface TrainingDataset {
  id: string
  name: string
  description: string
  type: "text" | "conversation" | "curriculum" | "assessment"
  size: number
  format: "json" | "csv" | "txt"
  createdAt: Date
  updatedAt: Date
  status: "preparing" | "ready" | "training" | "completed" | "error"
}

export interface TrainingJob {
  id: string
  name: string
  modelType: "curriculum-tutor" | "assessment-grader" | "content-generator" | "diagnostic-tool"
  datasetId: string
  config: TrainingConfig
  status: "queued" | "running" | "completed" | "failed" | "cancelled"
  progress: number
  metrics?: TrainingMetrics
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  error?: string
}

export interface TrainingConfig {
  epochs: number
  batchSize: number
  learningRate: number
  temperature: number
  maxTokens: number
  validationSplit: number
  earlyStoppingPatience: number
}

export interface TrainingMetrics {
  loss: number
  accuracy: number
  validationLoss: number
  validationAccuracy: number
  perplexity: number
  bleuScore?: number
}

export interface ModelVersion {
  id: string
  name: string
  version: string
  modelType: string
  trainingJobId: string
  status: "training" | "ready" | "deployed" | "archived"
  metrics: TrainingMetrics
  deployedAt?: Date
  isActive: boolean
}
