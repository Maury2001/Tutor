"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  Library,
  Brain,
  BarChart3,
  FileText,
  Globe,
  CheckCircle,
  Clock,
  Zap,
  TrendingUp,
  Database,
} from "lucide-react"
import { TrainingMaterialUpload } from "./training-material-upload"
import { TrainingMaterialLibrary } from "./training-material-library"
import { ModelManager } from "./model-manager"
import { TrainingAnalytics } from "./training-analytics"

interface TrainingStats {
  totalMaterials: number
  readyMaterials: number
  processingMaterials: number
  activeModels: number
  trainingAccuracy: number
  lastTrainingDate: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  variant: "default" | "secondary" | "outline"
}

export function IntegratedTrainingDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [trainingStats, setTrainingStats] = useState<TrainingStats>({
    totalMaterials: 24,
    readyMaterials: 18,
    processingMaterials: 3,
    activeModels: 4,
    trainingAccuracy: 92.5,
    lastTrainingDate: "2024-01-15",
  })
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTraining) {
        setTrainingProgress((prev) => {
          const newProgress = Math.min(prev + Math.random() * 5, 100)
          if (newProgress >= 100) {
            setIsTraining(false)
            setTrainingStats((prev) => ({
              ...prev,
              trainingAccuracy: prev.trainingAccuracy + Math.random() * 2,
              lastTrainingDate: new Date().toISOString().split("T")[0],
            }))
          }
          return newProgress
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isTraining])

  const quickActions: QuickAction[] = [
    {
      id: "upload",
      title: "Upload Materials",
      description: "Add new training documents",
      icon: <Upload className="h-5 w-5" />,
      action: () => setActiveTab("upload"),
      variant: "default",
    },
    {
      id: "retrain",
      title: "Start Retraining",
      description: "Retrain models with new data",
      icon: <Brain className="h-5 w-5" />,
      action: () => {
        setIsTraining(true)
        setTrainingProgress(0)
      },
      variant: "secondary",
    },
    {
      id: "library",
      title: "Browse Library",
      description: "Manage training materials",
      icon: <Library className="h-5 w-5" />,
      action: () => setActiveTab("library"),
      variant: "outline",
    },
    {
      id: "analytics",
      title: "View Analytics",
      description: "Check training performance",
      icon: <BarChart3 className="h-5 w-5" />,
      action: () => setActiveTab("analytics"),
      variant: "outline",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Training Status Alert */}
      {isTraining && (
        <Alert className="border-blue-200 bg-blue-50">
          <Brain className="h-4 w-4 animate-pulse" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">AI Model Training in Progress</span>
                <span className="text-sm">{trainingProgress.toFixed(0)}%</span>
              </div>
              <Progress value={trainingProgress} className="h-2" />
              <p className="text-sm text-blue-700">
                Training CBC Mathematics and Assessment models with latest materials...
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="training-stat-card border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold text-blue-600">{trainingStats.totalMaterials}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="training-stat-card border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready for Training</p>
                <p className="text-2xl font-bold text-green-600">{trainingStats.readyMaterials}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="training-stat-card border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-yellow-600">{trainingStats.processingMaterials}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="training-stat-card border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Model Accuracy</p>
                <p className="text-2xl font-bold text-purple-600">{trainingStats.trainingAccuracy.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="quick-actions-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common training tasks and operations</CardDescription>
        </CardHeader>
        <CardContent className="quick-actions-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                onClick={action.action}
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:scale-105 transition-transform duration-200"
                disabled={isTraining && action.id === "retrain"}
              >
                <div className="p-2 bg-gray-100 rounded-lg">{action.icon}</div>
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="training-tabs">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center space-x-2">
            <Library className="h-4 w-4" />
            <span>Library</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="model-overview-card">
              <CardHeader>
                <CardTitle>Active Models</CardTitle>
                <CardDescription>Current AI model status and performance</CardDescription>
              </CardHeader>
              <CardContent className="model-status-content space-y-4">
                {[
                  { name: "CBC Mathematics Tutor", accuracy: 94.2, status: "active", lastTrained: "2024-01-15" },
                  { name: "Science Experiment Guide", accuracy: 92.3, status: "active", lastTrained: "2024-01-14" },
                  { name: "English Language Assistant", accuracy: 89.7, status: "training", lastTrained: "2024-01-13" },
                  { name: "Assessment Generator", accuracy: 88.9, status: "active", lastTrained: "2024-01-12" },
                ].map((model) => (
                  <div key={model.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-gray-500">Last trained: {model.lastTrained}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-medium">{model.accuracy}%</div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                      </div>
                      <Badge variant={model.status === "active" ? "default" : "secondary"}>{model.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="recent-activity-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest training and upload activities</CardDescription>
              </CardHeader>
              <CardContent className="activity-content space-y-3">
                {[
                  {
                    action: "Uploaded",
                    item: "Grade 4 Math Curriculum.pdf",
                    time: "2 hours ago",
                    icon: <FileText className="h-4 w-4" />,
                  },
                  {
                    action: "Added URL",
                    item: "KICD Assessment Guidelines",
                    time: "4 hours ago",
                    icon: <Globe className="h-4 w-4" />,
                  },
                  {
                    action: "Model Trained",
                    item: "Mathematics Tutor",
                    time: "1 day ago",
                    icon: <Brain className="h-4 w-4" />,
                  },
                  {
                    action: "Uploaded",
                    item: "Science Experiments.docx",
                    time: "2 days ago",
                    icon: <FileText className="h-4 w-4" />,
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="p-2 bg-gray-100 rounded-lg">{activity.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {activity.action} <span className="text-gray-600">{activity.item}</span>
                      </div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <TrainingMaterialUpload />
        </TabsContent>

        <TabsContent value="library">
          <TrainingMaterialLibrary />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModelManager setActiveTrainingModel={() => {}} />
            <TrainingAnalytics modelId="math-model" isTraining={isTraining} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
