"use client"

import { IntegratedTrainingDashboard } from "@/components/training/integrated-training-dashboard"

export default function TrainingDashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Training Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage training materials, monitor model performance, and optimize AI capabilities
        </p>
      </div>

      <IntegratedTrainingDashboard />
    </div>
  )
}
