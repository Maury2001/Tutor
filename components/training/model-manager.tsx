"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Play, Pause, Settings, BarChart3, Clock, Database, Zap, AlertCircle } from "lucide-react"

interface ModelConfig {
  id: string
  name: string
  description: string
  category: string
  status: "active" | "inactive" | "training" | "error"
  version: string
  accuracy: number
  lastUpdated: string
  trainingData: number
  parameters: {
    temperature: number
    maxTokens: number
    topP: number
  }
}

const mockModels: ModelConfig[] = [
  {
    id: "cbc-math-tutor",
    name: "CBC Mathematics Tutor",
    description: "Specialized model for mathematics tutoring across all CBC grades",
    category: "Mathematics",
    status: "active",
    version: "v2.1.0",
    accuracy: 94.2,
    lastUpdated: "2024-01-15",
    trainingData: 15600,
    parameters: {
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
    },
  },
  {
    id: "cbc-science-guide",
    name: "Science Experiment Guide",
    description: "AI model for guiding science experiments and explanations",
    category: "Science",
    status: "active",
    version: "v1.8.2",
    accuracy: 91.8,
    lastUpdated: "2024-01-14",
    trainingData: 8900,
    parameters: {
      temperature: 0.6,
      maxTokens: 1536,
      topP: 0.85,
    },
  },
  {
    id: "cbc-english-assistant",
    name: "English Language Assistant",
    description: "Comprehensive English language learning and assessment model",
    category: "English",
    status: "training",
    version: "v1.5.1",
    accuracy: 89.3,
    lastUpdated: "2024-01-13",
    trainingData: 23400,
    parameters: {
      temperature: 0.8,
      maxTokens: 2048,
      topP: 0.92,
    },
  },
  {
    id: "cbc-assessment-gen",
    name: "Assessment Generator",
    description: "Model for generating CBC-aligned assessments and rubrics",
    category: "Assessment",
    status: "error",
    version: "v0.9.3",
    accuracy: 87.1,
    lastUpdated: "2024-01-12",
    trainingData: 6700,
    parameters: {
      temperature: 0.5,
      maxTokens: 1024,
      topP: 0.8,
    },
  },
]

export function ModelManager() {
  const [models, setModels] = useState<ModelConfig[]>(mockModels)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "training":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Zap className="h-4 w-4 text-green-600" />
      case "training":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "inactive":
        return <Pause className="h-4 w-4 text-gray-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Brain className="h-4 w-4 text-gray-600" />
    }
  }

  const handleModelAction = (modelId: string, action: string) => {
    setModels((prev) =>
      prev.map((model) => {
        if (model.id === modelId) {
          switch (action) {
            case "activate":
              return { ...model, status: "active" as const }
            case "deactivate":
              return { ...model, status: "inactive" as const }
            case "retrain":
              return { ...model, status: "training" as const }
            default:
              return model
          }
        }
        return model
      }),
    )
  }

  const updateModelParameter = (modelId: string, parameter: string, value: number) => {
    setModels((prev) =>
      prev.map((model) => {
        if (model.id === modelId) {
          return {
            ...model,
            parameters: {
              ...model.parameters,
              [parameter]: value,
            },
          }
        }
        return model
      }),
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span>AI Model Manager</span>
          </CardTitle>
          <CardDescription>Manage and configure AI models for the CBC TutorBot platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {models.map((model) => (
              <Card key={model.id} className="border-2 hover:border-purple-200 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(model.status)}
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription>{model.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Model Statistics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                      <span>Accuracy: {model.accuracy}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-blue-600" />
                      <span>Data: {model.trainingData.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span>Version: {model.version}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span>Updated: {model.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Model Parameters */}
                  <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium">Parameters</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Temperature:</span>
                        <div className="font-mono">{model.parameters.temperature}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Max Tokens:</span>
                        <div className="font-mono">{model.parameters.maxTokens}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Top P:</span>
                        <div className="font-mono">{model.parameters.topP}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-2">
                    <div className="flex space-x-2">
                      {model.status === "inactive" && (
                        <Button
                          size="sm"
                          onClick={() => handleModelAction(model.id, "activate")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      {model.status === "active" && (
                        <Button size="sm" variant="outline" onClick={() => handleModelAction(model.id, "deactivate")}>
                          <Pause className="h-4 w-4 mr-1" />
                          Deactivate
                        </Button>
                      )}
                      {model.status === "error" && (
                        <Button
                          size="sm"
                          onClick={() => handleModelAction(model.id, "retrain")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Retrain
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Expanded Configuration */}
                  {selectedModel === model.id && (
                    <div className="border-t pt-4 space-y-3">
                      <h4 className="text-sm font-medium">Configuration</h4>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-600">Temperature: {model.parameters.temperature}</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={model.parameters.temperature}
                            onChange={(e) =>
                              updateModelParameter(model.id, "temperature", Number.parseFloat(e.target.value))
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Max Tokens: {model.parameters.maxTokens}</label>
                          <input
                            type="range"
                            min="512"
                            max="4096"
                            step="256"
                            value={model.parameters.maxTokens}
                            onChange={(e) =>
                              updateModelParameter(model.id, "maxTokens", Number.parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Top P: {model.parameters.topP}</label>
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={model.parameters.topP}
                            onChange={(e) => updateModelParameter(model.id, "topP", Number.parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
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
