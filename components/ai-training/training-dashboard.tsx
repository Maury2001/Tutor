"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { TrainingJob, TrainingDataset, ModelVersion } from "@/lib/ai/model-training/types"
import { Play, Pause, Square, Upload, Download, Settings, AlertCircle, RefreshCw } from "lucide-react"

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "Not available"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj instanceof Date && !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString() : "Invalid date"
  } catch {
    return "Invalid date"
  }
}

export function TrainingDashboard() {
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([])
  const [datasets, setDatasets] = useState<TrainingDataset[]>([])
  const [models, setModels] = useState<ModelVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load training jobs, datasets, and models with proper error handling
      const [jobsRes, datasetsRes, modelsRes] = await Promise.all([
        fetch("/api/ai/training/jobs").catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
        fetch("/api/ai/training/datasets").catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
        fetch("/api/ai/training/models").catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
      ])

      // Handle responses with fallbacks and date conversion
      const jobs = jobsRes.ok ? await jobsRes.json() : []
      const datasets = datasetsRes.ok ? await datasetsRes.json() : []
      const models = modelsRes.ok ? await modelsRes.json() : []

      // Convert date strings to Date objects for jobs
      const processedJobs = Array.isArray(jobs)
        ? jobs.map((job) => ({
            ...job,
            startedAt: job.startedAt ? new Date(job.startedAt) : null,
            completedAt: job.completedAt ? new Date(job.completedAt) : null,
            createdAt: job.createdAt ? new Date(job.createdAt) : new Date(),
          }))
        : []

      // Convert date strings to Date objects for datasets
      const processedDatasets = Array.isArray(datasets)
        ? datasets.map((dataset) => ({
            ...dataset,
            createdAt: dataset.createdAt ? new Date(dataset.createdAt) : new Date(),
            updatedAt: dataset.updatedAt ? new Date(dataset.updatedAt) : new Date(),
          }))
        : []

      // Convert date strings to Date objects for models
      const processedModels = Array.isArray(models)
        ? models.map((model) => ({
            ...model,
            deployedAt: model.deployedAt ? new Date(model.deployedAt) : null,
          }))
        : []

      setTrainingJobs(processedJobs)
      setDatasets(processedDatasets)
      setModels(processedModels)
    } catch (error) {
      console.error("Failed to load training data:", error)
      setError("Failed to load training data. Please try again.")
      // Set empty arrays as fallback
      setTrainingJobs([])
      setDatasets([])
      setModels([])
    } finally {
      setLoading(false)
    }
  }

  const startTraining = async (datasetId: string, modelType: string) => {
    try {
      const response = await fetch("/api/ai/training/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${modelType}_${Date.now()}`,
          modelType,
          datasetId,
          config: {
            epochs: 10,
            batchSize: 32,
            learningRate: 0.001,
            temperature: 0.7,
            maxTokens: 2048,
            validationSplit: 0.2,
            earlyStoppingPatience: 3,
          },
        }),
      })

      if (response.ok) {
        loadData() // Refresh data
      } else {
        setError("Failed to start training job")
      }
    } catch (error) {
      console.error("Failed to start training:", error)
      setError("Failed to start training job")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "running":
        return "bg-blue-500"
      case "failed":
        return "bg-red-500"
      case "cancelled":
        return "bg-gray-500"
      default:
        return "bg-yellow-500"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin mr-2" />
        <span>Loading training data...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Model Training Center</h1>
        <p className="text-muted-foreground">Train and manage custom AI models for the CBC Tutorbot Platform</p>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={loadData}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">Training Jobs ({trainingJobs.length})</TabsTrigger>
          <TabsTrigger value="datasets">Datasets ({datasets.length})</TabsTrigger>
          <TabsTrigger value="models">Models ({models.length})</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          {trainingJobs.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  No training jobs found. Create a new training job to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {trainingJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.name}</CardTitle>
                        <CardDescription>
                          {job.modelType} • Started {formatDate(job.startedAt)}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{Math.round(job.progress)}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>

                      {job.metrics && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Loss</span>
                            <div className="font-medium">{job.metrics.loss.toFixed(4)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Accuracy</span>
                            <div className="font-medium">{(job.metrics.accuracy * 100).toFixed(1)}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Val Loss</span>
                            <div className="font-medium">{job.metrics.validationLoss.toFixed(4)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Val Acc</span>
                            <div className="font-medium">{(job.metrics.validationAccuracy * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {job.status === "running" && (
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        )}
                        {job.status === "running" && (
                          <Button size="sm" variant="destructive">
                            <Square className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="datasets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Training Datasets</h2>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Dataset
            </Button>
          </div>

          {datasets.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No datasets found. Upload a dataset to start training models.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {datasets.map((dataset) => (
                <Card key={dataset.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{dataset.name}</CardTitle>
                        <CardDescription>{dataset.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{dataset.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {dataset.size.toLocaleString()} items • {dataset.format.toUpperCase()}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button size="sm" onClick={() => startTraining(dataset.id, "curriculum-tutor")}>
                          <Play className="h-4 w-4 mr-2" />
                          Train Model
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <h2 className="text-xl font-semibold">Trained Models</h2>

          {models.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No trained models found. Start a training job to create models.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {models.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription>
                          {model.modelType} • Version {model.version}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={model.isActive ? "default" : "outline"}>
                          {model.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{model.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Accuracy</span>
                        <div className="font-medium">{(model.metrics.accuracy * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Loss</span>
                        <div className="font-medium">{model.metrics.loss.toFixed(4)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Perplexity</span>
                        <div className="font-medium">{model.metrics.perplexity.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Deployed</span>
                        <div className="font-medium">
                          {formatDate(model.deployedAt) !== "Not available"
                            ? formatDate(model.deployedAt)
                            : "Not deployed"}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!model.isActive && model.status === "ready" && <Button size="sm">Deploy</Button>}
                      {model.isActive && (
                        <Button size="sm" variant="outline">
                          Deactivate
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Training Job</CardTitle>
              <CardDescription>Start training a new AI model with your custom dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Model Type</label>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option value="curriculum-tutor">Curriculum Tutor</option>
                    <option value="assessment-grader">Assessment Grader</option>
                    <option value="content-generator">Content Generator</option>
                    <option value="diagnostic-tool">Diagnostic Tool</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Dataset</label>
                  <select className="w-full mt-1 p-2 border rounded">
                    {datasets.map((dataset) => (
                      <option key={dataset.id} value={dataset.id}>
                        {dataset.name} ({dataset.size} items)
                      </option>
                    ))}
                  </select>
                </div>

                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
