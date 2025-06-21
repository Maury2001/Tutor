"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Thermometer, Settings, Info, Save, RotateCcw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ModelTemperature {
  id: string
  name: string
  category: string
  currentTemperature: number
  recommendedTemperature: number
  status: "active" | "inactive" | "training"
  lastUpdated: string
  performanceImpact: "low" | "medium" | "high"
}

const mockModelTemperatures: ModelTemperature[] = [
  {
    id: "1",
    name: "CBC Mathematics Tutor",
    category: "Mathematics",
    currentTemperature: 0.3,
    recommendedTemperature: 0.2,
    status: "active",
    lastUpdated: "2024-01-15 14:30",
    performanceImpact: "low",
  },
  {
    id: "2",
    name: "Science Experiment Guide",
    category: "Science",
    currentTemperature: 0.7,
    recommendedTemperature: 0.6,
    status: "active",
    lastUpdated: "2024-01-15 12:15",
    performanceImpact: "medium",
  },
  {
    id: "3",
    name: "English Language Assistant",
    category: "English Language",
    currentTemperature: 0.8,
    recommendedTemperature: 0.7,
    status: "active",
    lastUpdated: "2024-01-15 10:45",
    performanceImpact: "high",
  },
  {
    id: "4",
    name: "Assessment Generator",
    category: "Assessment",
    currentTemperature: 0.1,
    recommendedTemperature: 0.1,
    status: "training",
    lastUpdated: "2024-01-15 09:20",
    performanceImpact: "low",
  },
]

export function ModelTemperatureControl() {
  const [models, setModels] = useState<ModelTemperature[]>(mockModelTemperatures)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  const getTemperatureColor = (temp: number) => {
    if (temp <= 0.3) return "text-blue-600"
    if (temp <= 0.6) return "text-green-600"
    if (temp <= 0.8) return "text-yellow-600"
    return "text-red-600"
  }

  const getTemperatureDescription = (temp: number) => {
    if (temp <= 0.2) return "Very Conservative - Highly predictable, factual responses"
    if (temp <= 0.4) return "Conservative - Focused, consistent responses with minimal variation"
    if (temp <= 0.6) return "Balanced - Good mix of accuracy and creativity"
    if (temp <= 0.8) return "Creative - More varied and expressive responses"
    return "Very Creative - Highly varied, experimental responses"
  }

  const getPerformanceImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateTemperature = (modelId: string, newTemperature: number) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId
          ? {
              ...model,
              currentTemperature: newTemperature,
              lastUpdated: new Date().toLocaleString(),
              performanceImpact: newTemperature <= 0.3 ? "low" : newTemperature <= 0.6 ? "medium" : "high",
            }
          : model,
      ),
    )
  }

  const resetToRecommended = (modelId: string) => {
    const model = models.find((m) => m.id === modelId)
    if (model) {
      updateTemperature(modelId, model.recommendedTemperature)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-orange-600" />
            <span>AI Model Temperature Control</span>
          </CardTitle>
          <CardDescription>
            Adjust the creativity and randomness of AI model responses. Lower values = more predictable, higher values =
            more creative.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Temperature Guide:</strong> 0.0-0.3 (Conservative), 0.3-0.6 (Balanced), 0.6-0.9 (Creative),
              0.9-1.0 (Very Creative)
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {models.map((model) => (
              <Card key={model.id} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription>{model.category}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant={model.status === "active" ? "default" : "secondary"}>{model.status}</Badge>
                      <Badge className={getPerformanceImpactColor(model.performanceImpact)}>
                        {model.performanceImpact} impact
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Temperature Display */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Temperature:</span>
                    <span className={`text-2xl font-bold ${getTemperatureColor(model.currentTemperature)}`}>
                      {model.currentTemperature.toFixed(1)}
                    </span>
                  </div>

                  {/* Temperature Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Conservative (0.0)</span>
                      <span>Creative (1.0)</span>
                    </div>
                    <Slider
                      value={[model.currentTemperature]}
                      onValueChange={(value) => updateTemperature(model.id, value[0])}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                      disabled={model.status === "training"}
                    />
                  </div>

                  {/* Temperature Description */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{getTemperatureDescription(model.currentTemperature)}</p>
                  </div>

                  {/* Recommended vs Current */}
                  <div className="flex items-center justify-between text-sm">
                    <span>Recommended: {model.recommendedTemperature.toFixed(1)}</span>
                    {model.currentTemperature !== model.recommendedTemperature && (
                      <Button size="sm" variant="outline" onClick={() => resetToRecommended(model.id)}>
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-2 border-t">
                    <div className="text-xs text-gray-500">Last updated: {model.lastUpdated}</div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedModel(model.id)}
                        disabled={model.status === "training"}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Temperature Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Impact Analysis</CardTitle>
          <CardDescription>How temperature settings affect model behavior in CBC tutoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Low Temperature (0.0-0.3)</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Consistent, factual responses</li>
                <li>• Best for mathematics and exact sciences</li>
                <li>• Minimal creative variation</li>
                <li>• High accuracy and reliability</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Medium Temperature (0.3-0.7)</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Balanced accuracy and creativity</li>
                <li>• Good for general tutoring</li>
                <li>• Varied explanations and examples</li>
                <li>• Engaging student interactions</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">High Temperature (0.7-1.0)</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Creative and varied responses</li>
                <li>• Best for creative writing and arts</li>
                <li>• Multiple solution approaches</li>
                <li>• Higher risk of inaccuracies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
