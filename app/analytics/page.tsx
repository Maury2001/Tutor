"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, TrendingUp, Users, Activity, Download, RefreshCw, AlertCircle } from "lucide-react"
import { LearningAnalytics } from "@/components/analytics/learning-analytics"
import { useEffect, useState } from "react"

interface AnalyticsData {
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  totalMaterials: number
  totalTokensUsed: number
  systemHealth: {
    status: string
    uptime: number
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
  }
  aiModelUsage: Array<{
    model: string
    requests: number
    tokensUsed: number
    averageResponseTime: number
  }>
  userActivity: Array<{
    date: string
    activeUsers: number
    newRegistrations: number
    totalSessions: number
  }>
  subscriptionStats: {
    basic: number
    premium: number
    enterprise: number
    totalRevenue: number
  }
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [stats, setStats] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/admin/stats")
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`)
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch analytics")

      // Set mock data as fallback
      setStats({
        totalUsers: 1247,
        totalStudents: 1089,
        totalTeachers: 158,
        totalMaterials: 342,
        totalTokensUsed: 45678,
        systemHealth: {
          status: "healthy",
          uptime: 168,
          cpuUsage: 45,
          memoryUsage: 62,
          diskUsage: 38,
        },
        aiModelUsage: [
          {
            model: "GPT-4",
            requests: 2341,
            tokensUsed: 23456,
            averageResponseTime: 1200,
          },
          {
            model: "Claude-3",
            requests: 1876,
            tokensUsed: 18234,
            averageResponseTime: 980,
          },
        ],
        userActivity: [
          {
            date: "2024-01-15",
            activeUsers: 234,
            newRegistrations: 12,
            totalSessions: 456,
          },
          {
            date: "2024-01-14",
            activeUsers: 198,
            newRegistrations: 8,
            totalSessions: 389,
          },
        ],
        subscriptionStats: {
          basic: 892,
          premium: 234,
          enterprise: 121,
          totalRevenue: 45670,
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    if (!stats) return

    const dataStr = JSON.stringify(stats, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `analytics-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Please log in to view analytics.</p>
          <Button onClick={() => router.push("/auth/signin")} className="mt-4">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Analytics</h1>
              <p className="text-gray-600">Comprehensive platform insights and metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers?.toLocaleString() || "0"}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalStudents || 0} students, {stats?.totalTeachers || 0} teachers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTokensUsed?.toLocaleString() || "0"}</div>
              <p className="text-xs text-muted-foreground">Tokens used this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Materials</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalMaterials?.toLocaleString() || "0"}</div>
              <p className="text-xs text-muted-foreground">Available resources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge
                  className={
                    stats?.systemHealth?.status === "healthy"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {stats?.systemHealth?.status || "Unknown"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{stats?.systemHealth?.uptime || 0}h uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Usage</CardTitle>
                  <CardDescription>Performance metrics by AI model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.aiModelUsage?.map((model, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{model.model}</h4>
                          <p className="text-sm text-gray-600">{model.requests.toLocaleString()} requests</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{model.averageResponseTime}ms</div>
                          <div className="text-xs text-gray-500">{model.tokensUsed.toLocaleString()} tokens</div>
                        </div>
                      </div>
                    )) || <p className="text-gray-500">No data available</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Recent user engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.userActivity?.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{new Date(activity.date).toLocaleDateString()}</h4>
                          <p className="text-sm text-gray-600">{activity.activeUsers} active users</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{activity.totalSessions} sessions</div>
                          <div className="text-xs text-gray-500">+{activity.newRegistrations} new</div>
                        </div>
                      </div>
                    )) || <p className="text-gray-500">No data available</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="learning">
            {user.gradeLevel && <LearningAnalytics studentId={user.id} gradeLevel={user.gradeLevel} />}
          </TabsContent>

          <TabsContent value="users">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                  <CardDescription>User distribution by subscription type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Basic</span>
                      <Badge variant="outline">{stats?.subscriptionStats?.basic || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Premium</span>
                      <Badge variant="secondary">{stats?.subscriptionStats?.premium || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Enterprise</span>
                      <Badge>{stats?.subscriptionStats?.enterprise || 0}</Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center font-medium">
                        <span>Total Revenue</span>
                        <span>${stats?.subscriptionStats?.totalRevenue?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Resources</CardTitle>
                  <CardDescription>Current system resource usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU Usage</span>
                        <span>{stats?.systemHealth?.cpuUsage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${stats?.systemHealth?.cpuUsage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memory Usage</span>
                        <span>{stats?.systemHealth?.memoryUsage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${stats?.systemHealth?.memoryUsage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Disk Usage</span>
                        <span>{stats?.systemHealth?.diskUsage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${stats?.systemHealth?.diskUsage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>System performance and response times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {stats?.aiModelUsage?.[0]?.averageResponseTime || 0}ms
                    </div>
                    <p className="text-sm text-gray-600">Avg AI Response Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats?.systemHealth?.uptime || 0}h</div>
                    <p className="text-sm text-gray-600">System Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {((stats?.totalTokensUsed || 0) / (stats?.totalUsers || 1)).toFixed(1)}
                    </div>
                    <p className="text-sm text-gray-600">Tokens per User</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
