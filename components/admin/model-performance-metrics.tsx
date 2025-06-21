"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Zap,
  Database,
  Activity,
  Brain,
  Target,
  MessageSquare,
} from "lucide-react"

interface ModelMetrics {
  id: string
  name: string
  accuracy: number
  accuracyTrend: number
  responseTime: number
  dailyQueries: number
  userSatisfaction: number
  uptime: number
  tokenUsage: number
  costPerQuery: number
  activeSessions: number
  queueSize: number
  cpuLoad: number
  memoryUsage: number
}

interface TopicData {
  topic: string
  subject: string
  queries: number
  accuracy: number
}

const mockMetrics: ModelMetrics[] = [
  {
    id: "cbc-math",
    name: "CBC Mathematics",
    accuracy: 94.2,
    accuracyTrend: 2.1,
    responseTime: 850,
    dailyQueries: 1247,
    userSatisfaction: 4.6,
    uptime: 99.8,
    tokenUsage: 2847392,
    costPerQuery: 0.0023,
    activeSessions: 34,
    queueSize: 2,
    cpuLoad: 67,
    memoryUsage: 72,
  },
  {
    id: "cbc-science",
    name: "CBC Science",
    accuracy: 91.8,
    accuracyTrend: 1.4,
    responseTime: 920,
    dailyQueries: 892,
    userSatisfaction: 4.4,
    uptime: 99.5,
    tokenUsage: 1923847,
    costPerQuery: 0.0019,
    activeSessions: 28,
    queueSize: 1,
    cpuLoad: 54,
    memoryUsage: 68,
  },
  {
    id: "cbc-english",
    name: "CBC English",
    accuracy: 89.3,
    accuracyTrend: 3.2,
    responseTime: 780,
    dailyQueries: 1089,
    userSatisfaction: 4.5,
    uptime: 99.9,
    tokenUsage: 2156743,
    costPerQuery: 0.0021,
    activeSessions: 41,
    queueSize: 0,
    cpuLoad: 61,
    memoryUsage: 65,
  },
  {
    id: "cbc-assessment",
    name: "Assessment Generator",
    accuracy: 87.1,
    accuracyTrend: -0.8,
    responseTime: 1200,
    dailyQueries: 456,
    userSatisfaction: 4.2,
    uptime: 98.7,
    tokenUsage: 987234,
    costPerQuery: 0.0031,
    activeSessions: 12,
    queueSize: 3,
    cpuLoad: 43,
    memoryUsage: 58,
  },
]

const mockTopicData: TopicData[] = [
  { topic: "Fractions", subject: "Mathematics", queries: 234, accuracy: 96.2 },
  { topic: "Photosynthesis", subject: "Science", queries: 189, accuracy: 93.8 },
  { topic: "Reading Comprehension", subject: "English", queries: 167, accuracy: 91.4 },
  { topic: "Multiplication Tables", subject: "Mathematics", queries: 156, accuracy: 97.1 },
  { topic: "Water Cycle", subject: "Science", queries: 143, accuracy: 94.6 },
  { topic: "Creative Writing", subject: "English", queries: 128, accuracy: 88.9 },
  { topic: "Geometry Shapes", subject: "Mathematics", queries: 112, accuracy: 95.3 },
  { topic: "Animal Classification", subject: "Science", queries: 98, accuracy: 92.7 },
]

export function ModelPerformanceMetrics() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
    )
  }

  const getUsageBadge = (queries: number) => {
    if (queries > 200) return <Badge className="bg-green-100 text-green-800">High</Badge>
    if (queries > 100) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
    return <Badge className="bg-gray-100 text-gray-800">Low</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <span>Model Performance Metrics</span>
        </CardTitle>
        <CardDescription>Real-time performance monitoring and analytics for CBC TutorBot AI models</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="topics">Popular Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockMetrics.map((model) => (
                <Card key={model.id} className="border-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Accuracy</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold">{model.accuracy}%</span>
                        {getTrendIcon(model.accuracyTrend)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Response</span>
                      </div>
                      <span className="font-semibold">{model.responseTime}ms</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Daily Queries</span>
                      </div>
                      <span className="font-semibold">{model.dailyQueries}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Satisfaction</span>
                      </div>
                      <span className="font-semibold">{model.userSatisfaction}/5.0</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">Token Usage</span>
                    </div>
                    <div className="text-2xl font-bold">2.8M</div>
                    <div className="text-xs text-gray-500">This month</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Cost/Query</span>
                    </div>
                    <div className="text-2xl font-bold">$0.002</div>
                    <div className="text-xs text-gray-500">Average</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Activity className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium">Uptime</span>
                    </div>
                    <div className="text-2xl font-bold">99.7%</div>
                    <div className="text-xs text-gray-500">Last 30 days</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium">Cache Hit</span>
                    </div>
                    <div className="text-2xl font-bold">87.3%</div>
                    <div className="text-xs text-gray-500">Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accuracy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockMetrics.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription>Accuracy trends and improvements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Accuracy</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{model.accuracy}%</span>
                        {getTrendIcon(model.accuracyTrend)}
                        <span className={`text-sm ${model.accuracyTrend > 0 ? "text-green-600" : "text-red-600"}`}>
                          {Math.abs(model.accuracyTrend)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={model.accuracy} className="h-3" />
                    <div className="text-xs text-gray-500">Target: 95% | Baseline: 85%</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockMetrics.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription>Real-time usage statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Active Sessions:</span>
                        <div className="text-xl font-bold">{model.activeSessions}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Queue Size:</span>
                        <div className="text-xl font-bold">{model.queueSize}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">CPU Load:</span>
                        <div className="text-xl font-bold">{model.cpuLoad}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Memory:</span>
                        <div className="text-xl font-bold">{model.memoryUsage}%</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU Load</span>
                        <span>{model.cpuLoad}%</span>
                      </div>
                      <Progress value={model.cpuLoad} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memory Usage</span>
                        <span>{model.memoryUsage}%</span>
                      </div>
                      <Progress value={model.memoryUsage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Queried Topics by Subject</CardTitle>
                <CardDescription>Popular curriculum topics and their query frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopicData.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-gray-400">#{index + 1}</div>
                        <div>
                          <div className="font-medium">{topic.topic}</div>
                          <div className="text-sm text-gray-500">{topic.subject}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Queries</div>
                          <div className="font-bold">{topic.queries}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Accuracy</div>
                          <div className="font-bold">{topic.accuracy}%</div>
                        </div>
                        {getUsageBadge(topic.queries)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
