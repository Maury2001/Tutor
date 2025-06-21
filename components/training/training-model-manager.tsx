"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Play, Pause, Square, Settings, BarChart3, Clock, Database, Zap } from "lucide-react"

interface TrainingModel {
  id: string
  name: string
  description: string
  category: string
  status: "idle" | "training" | "completed" | "error" | "paused"
  progress: number
  accuracy: number
  trainingTime: string
  materialsCount: number
  lastTrained: string
  version: string
}

const mockModels: TrainingModel[] = [
  {
    id: "1",
    name: "CBC Mathematics Tutor",
    description: "Specialized model for mathematics tutoring across all CBC grades",
    category: "Mathematics",
    status: "training",
    progress: 67,
    accuracy: 89.5,
    trainingTime: "2h 34m",
    materialsCount: 156,
    lastTrained: "2024-01-15",
    version: "v2.1",
  },
  {
    id: "2",
    name: "Science Experiment Guide",
    description: "AI model for guiding science experiments and explanations",
    category: "Science",
    status: "completed",
    progress: 100,
    accuracy: 92.3,
    trainingTime: "4h 12m",
    materialsCount: 89,
    lastTrained: "2024-01-14",
    version: "v1.8",
  },
  {
    id: "3",
    name: "English Language Assistant",
    description: "Comprehensive English language learning and assessment model",
    category: "English Language",
    status: "idle",
    progress: 0,
    accuracy: 87.1,
    trainingTime: "0m",
    materialsCount: 234,
    lastTrained: "2024-01-10",
    version: "v1.5",
  },
  {
    id: "4",
    name: "Assessment Generator",
    description: "Model for generating CBC-aligned assessments and rubrics",
    category: "Assessment",
    status: "error",
    progress: 23,
    accuracy: 0,
    trainingTime: "45m",
    materialsCount: 67,
    lastTrained: "2024-01-12",
    version: "v0.9",
  },
]

export function TrainingModelManager() {
  const [models, setModels] = useState<TrainingModel[]>(mockModels)
  const [trainingLogs, setTrainingLogs] = useState<{ [key: string]: string[] }>({})

  const addTrainingLog = (modelId: string, message: string) => {
    setTrainingLogs((prev) => ({
      ...prev,
      [modelId]: [...(prev[modelId] || []), `${new Date().toLocaleTimeString()}: ${message}`],
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "training":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "idle":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStartTraining = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId
          ? {
              ...model,
              status: "training" as const,
              progress: 0,
              trainingTime: "0m",
            }
          : model,
      ),
    )

    // Simulate training progress
    simulateTraining(modelId)
  }

  const simulateTraining = (modelId: string) => {
    let progress = 0
    const startTime = Date.now()

    const interval = setInterval(() => {
      progress += Math.random() * 5 + 2 // Random progress between 2-7%
      const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000)
      const elapsedSeconds = Math.floor(((Date.now() - startTime) % 60000) / 1000)
      const timeString = elapsedMinutes > 0 ? `${elapsedMinutes}m ${elapsedSeconds}s` : `${elapsedSeconds}s`

      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        setModels((prev) =>
          prev.map((model) =>
            model.id === modelId
              ? {
                  ...model,
                  status: "completed" as const,
                  progress: 100,
                  accuracy: Math.random() * 10 + 85, // Random accuracy between 85-95%
                  trainingTime: timeString,
                  lastTrained: new Date().toISOString().split("T")[0],
                  version: `v${(Number.parseFloat(model.version.slice(1)) + 0.1).toFixed(1)}`,
                }
              : model,
          ),
        )

        // Show completion notification
        alert(`Training completed for model! New accuracy: ${(Math.random() * 10 + 85).toFixed(1)}%`)
      } else {
        setModels((prev) =>
          prev.map((model) =>
            model.id === modelId
              ? {
                  ...model,
                  progress: Math.min(progress, 100),
                  trainingTime: timeString,
                }
              : model,
          ),
        )
      }
    }, 1000) // Update every second for demo purposes
  }

  const handlePauseTraining = (modelId: string) => {
    setModels((prev) => prev.map((model) => (model.id === modelId ? { ...model, status: "paused" as const } : model)))
  }

  const handleStopTraining = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) => (model.id === modelId ? { ...model, status: "idle" as const, progress: 0 } : model)),
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Model Training Manager</CardTitle>
          <CardDescription>Monitor and manage AI model training processes for CBC curriculum</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {models.map((model) => (
              <Card key={model.id} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Brain className="h-6 w-6 text-purple-600" />
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription>{model.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Training Progress */}
                  {model.status === "training" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Training Progress</span>
                        <span>{model.progress}%</span>
                      </div>
                      <Progress value={model.progress} className="h-2" />
                    </div>
                  )}

                  {/* Model Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                      <span>Accuracy: {model.accuracy}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>Time: {model.trainingTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-purple-600" />
                      <span>Materials: {model.materialsCount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-orange-600" />
                      <span>Version: {model.version}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-2">
                    <div className="flex space-x-2">
                      {model.status === "idle" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartTraining(model.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      {model.status === "training" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handlePauseTraining(model.id)}>
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleStopTraining(model.id)}>
                            <Square className="h-4 w-4 mr-1" />
                            Stop
                          </Button>
                        </>
                      )}
                      {model.status === "paused" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartTraining(model.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Resume
                        </Button>
                      )}
                      {model.status === "error" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartTraining(model.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">Last trained: {model.lastTrained}</div>
                  {/* Training Logs */}
                  {model.status === "training" && trainingLogs[model.id] && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Training Log:</h4>
                      <div className="text-xs space-y-1 max-h-20 overflow-y-auto">
                        {trainingLogs[model.id].slice(-3).map((log, index) => (
                          <div key={index} className="text-gray-600">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
