"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Clock, Zap, AlertCircle, CheckCircle } from "lucide-react"

interface TrainingMetrics {
  epoch: number
  loss: number
  accuracy: number
  validationLoss: number
  validationAccuracy: number
  learningRate: number
  timestamp: string
}

const mockTrainingData: TrainingMetrics[] = [
  {
    epoch: 1,
    loss: 2.45,
    accuracy: 45.2,
    validationLoss: 2.38,
    validationAccuracy: 47.1,
    learningRate: 0.001,
    timestamp: "10:00:00",
  },
  {
    epoch: 2,
    loss: 1.89,
    accuracy: 62.3,
    validationLoss: 1.92,
    validationAccuracy: 61.8,
    learningRate: 0.001,
    timestamp: "10:05:00",
  },
  {
    epoch: 3,
    loss: 1.45,
    accuracy: 73.1,
    validationLoss: 1.52,
    validationAccuracy: 71.9,
    learningRate: 0.001,
    timestamp: "10:10:00",
  },
  {
    epoch: 4,
    loss: 1.12,
    accuracy: 81.4,
    validationLoss: 1.23,
    validationAccuracy: 79.2,
    learningRate: 0.0008,
    timestamp: "10:15:00",
  },
  {
    epoch: 5,
    loss: 0.89,
    accuracy: 87.6,
    validationLoss: 1.01,
    validationAccuracy: 85.3,
    learningRate: 0.0008,
    timestamp: "10:20:00",
  },
  {
    epoch: 6,
    loss: 0.72,
    accuracy: 91.2,
    validationLoss: 0.85,
    validationAccuracy: 89.1,
    learningRate: 0.0006,
    timestamp: "10:25:00",
  },
]

export function TrainingAnalytics({ modelId, isTraining }: { modelId: string; isTraining: boolean }) {
  const [metrics, setMetrics] = useState<TrainingMetrics[]>(mockTrainingData)
  const [currentEpoch, setCurrentEpoch] = useState(6)

  useEffect(() => {
    if (!isTraining) return

    const interval = setInterval(() => {
      setCurrentEpoch((prev) => prev + 1)
      setMetrics((prev) => {
        const newEpoch = prev.length + 1
        const lastMetric = prev[prev.length - 1]

        const newMetric: TrainingMetrics = {
          epoch: newEpoch,
          loss: Math.max(0.1, lastMetric.loss - (Math.random() * 0.1 + 0.05)),
          accuracy: Math.min(95, lastMetric.accuracy + (Math.random() * 2 + 1)),
          validationLoss: Math.max(0.1, lastMetric.validationLoss - (Math.random() * 0.08 + 0.03)),
          validationAccuracy: Math.min(93, lastMetric.validationAccuracy + (Math.random() * 1.5 + 0.8)),
          learningRate: lastMetric.learningRate * (Math.random() > 0.7 ? 0.9 : 1),
          timestamp: new Date().toLocaleTimeString(),
        }

        return [...prev, newMetric]
      })
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [isTraining])

  const latestMetrics = metrics[metrics.length - 1]

  return (
    <div className="space-y-6">
      {/* Current Training Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Current Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{latestMetrics.accuracy.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Training Loss</p>
                <p className="text-2xl font-bold text-orange-600">{latestMetrics.loss.toFixed(3)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Current Epoch</p>
                <p className="text-2xl font-bold text-blue-600">{currentEpoch}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Learning Rate</p>
                <p className="text-2xl font-bold text-purple-600">{latestMetrics.learningRate.toFixed(6)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accuracy Over Time</CardTitle>
            <CardDescription>Training and validation accuracy progression</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Training Accuracy" />
                <Line
                  type="monotone"
                  dataKey="validationAccuracy"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Validation Accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loss Over Time</CardTitle>
            <CardDescription>Training and validation loss reduction</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} name="Training Loss" />
                <Line
                  type="monotone"
                  dataKey="validationLoss"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Validation Loss"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Training Log */}
      <Card>
        <CardHeader>
          <CardTitle>Training Log</CardTitle>
          <CardDescription>Real-time training progress and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {metrics
              .slice(-10)
              .reverse()
              .map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Epoch {metric.epoch} completed - Accuracy: {metric.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {metric.timestamp}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
