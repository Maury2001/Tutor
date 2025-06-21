"use client"

import { useState } from "react"
import { ModelManager } from "@/components/training/model-manager"
import { TrainingAnalytics } from "@/components/training/training-analytics"

export default function TrainingPage() {
  const [activeTrainingModel, setActiveTrainingModel] = useState<string | null>(null)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Model Training</h1>

      {/* Model Manager */}
      <ModelManager setActiveTrainingModel={setActiveTrainingModel} />

      {/* Training Analytics */}
      {activeTrainingModel && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Training Analytics</h2>
          <TrainingAnalytics modelId={activeTrainingModel} isTraining={true} />
        </div>
      )}
    </div>
  )
}
