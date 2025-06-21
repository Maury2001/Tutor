"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Users,
  BookOpen,
  Brain,
  TrendingUp,
  AlertTriangle,
  LogOut,
  DollarSign,
  Settings,
  Database,
  TestTube,
  Activity,
  Zap,
  Target,
  Trophy,
  FileText,
  MessageSquare,
  Microscope,
  Map,
  Wrench,
  BarChart3,
  LineChart,
  GraduationCap,
  FileDown,
  UserCheck,
  Atom,
  Compass,
  Code,
  CreditCard,
  Bug,
  Rocket,
  Server,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SubscriptionManagement } from "@/components/admin/subscription-management"
import { isAdmin } from "@/lib/admin-auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ModelSelector } from "@/components/ai/model-selector"
import { GlobalAIConfig } from "@/components/admin/global-ai-config"

interface AdminStats {
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  totalMaterials: number
  totalTokensUsed: number
  systemHealth: SystemHealth
  aiModelUsage: AIModelUsage[]
  userActivity: UserActivity[]
  subscriptionStats: SubscriptionStats
}

interface SystemHealth {
  status: "healthy" | "warning" | "critical"
  uptime: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
}

interface AIModelUsage {
  model: string
  requests: number
  tokensUsed: number
  averageResponseTime: number
}

interface UserActivity {
  date: string
  activeUsers: number
  newRegistrations: number
  totalSessions: number
}

interface SubscriptionStats {
  basic: number
  premium: number
  enterprise: number
  totalRevenue: number
}

export function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [showModelSelector, setShowModelSelector] = useState(false)
  const [selectedAIModel, setSelectedAIModel] = useState("llama3-70b-8192")
  const [aiPreferences, setAiPreferences] = useState({
    temperature: 0.7,
    maxTokens: 800,
    fallbackStrategy: "balanced",
    autoFallback: true,
    showModelInfo: true,
  })

  const [showGlobalAIConfig, setShowGlobalAIConfig] = useState(false)

  useEffect(() => {
    // Check admin access
    if (status === "loading") return

    if (!session?.user) {
      router.replace("/auth/signin")
      return
    }

    if (!isAdmin(session)) {
      router.replace("/dashboard")
      return
    }

    fetchAdminStats()
  }, [session, status, router])

  const fetchAdminStats = async () => {
    try {
      // Mock data for demonstration - replace with real API calls
      const mockStats: AdminStats = {
        totalUsers: 2847,
        totalStudents: 2234,
        totalTeachers: 456,
        totalMaterials: 1342,
        totalTokensUsed: 850000,
        systemHealth: {
          status: "healthy",
          uptime: 99.98,
          cpuUsage: 42,
          memoryUsage: 58,
          diskUsage: 37,
        },
        aiModelUsage: [
          {
            model: "Groq Llama3-8b",
            requests: 15200,
            tokensUsed: 675000,
            averageResponseTime: 420,
          },
          {
            model: "GPT-4o (Fallback)",
            requests: 3400,
            tokensUsed: 175000,
            averageResponseTime: 850,
          },
        ],
        userActivity: [
          {
            date: "2024-06-01",
            activeUsers: 1240,
            newRegistrations: 67,
            totalSessions: 3840,
          },
          {
            date: "2024-06-02",
            activeUsers: 1310,
            newRegistrations: 52,
            totalSessions: 4120,
          },
        ],
        subscriptionStats: {
          basic: 1850,
          premium: 720,
          enterprise: 277,
          totalRevenue: 45.8,
        },
      }

      setStats(mockStats)
    } catch (error) {
      console.error("Error fetching admin stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      const { signOut } = await import("next-auth/react")
      await signOut({ callbackUrl: "/auth/signin" })
    } catch (error) {
      console.error("Logout error:", error)
      window.location.href = "/auth/signin"
    } finally {
      setLogoutLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session?.user || !isAdmin(session)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div>Error loading dashboard</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section - Responsive */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold mb-2">
              🛡️ Admin Dashboard - Welcome {session.user.name || session.user.email}
            </h1>
            <p className="text-purple-100 text-sm sm:text-base mb-3">
              Monitor platform performance and manage the CBC TutorBot ecosystem
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <span className="bg-white/20 px-2 py-1 rounded whitespace-nowrap">
                {stats.systemHealth.status === "healthy" ? "✅" : "⚠️"} System {stats.systemHealth.status}
              </span>
              <span className="bg-white/20 px-2 py-1 rounded whitespace-nowrap">👥 {stats.totalUsers} Users</span>
              <span className="bg-white/20 px-2 py-1 rounded whitespace-nowrap">
                💰 ${stats.subscriptionStats.totalRevenue}k Revenue
              </span>
              <Badge className="bg-green-500 text-white text-xs">Admin Access Verified</Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 ml-2 sm:ml-4"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">{logoutLoading ? "Logging out..." : "Logout"}</span>
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {stats.systemHealth.status !== "healthy" && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-800">
                System Status: {stats.systemHealth.status.toUpperCase()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalStudents} students, {stats.totalTeachers} teachers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Materials</CardTitle>
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.totalMaterials}</div>
            <p className="text-xs text-muted-foreground">Educational resources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">AI Tokens Used</CardTitle>
            <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.totalTokensUsed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              ${stats.subscriptionStats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Monthly recurring</p>
          </CardContent>
        </Card>

        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">AI Costs Today</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">$1.85</div>
            <p className="text-xs text-muted-foreground">of $5.00 daily limit</p>
          </CardContent>
        </Card>
      </div>

      {/* Responsive Tabs */}
      <Tabs defaultValue="subscriptions" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-3 min-w-max">
            <TabsTrigger value="subscriptions" className="text-xs sm:text-sm">
              🎯 Subscriptions
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs sm:text-sm">
              System Health
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs sm:text-sm">
              AI Models
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">🏫 School Subscription Management</CardTitle>
              <CardDescription className="text-sm">
                Manage school subscriptions, packages, and token allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>{stats.systemHealth.cpuUsage}%</span>
                  </div>
                  <Progress value={stats.systemHealth.cpuUsage} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>{stats.systemHealth.memoryUsage}%</span>
                  </div>
                  <Progress value={stats.systemHealth.memoryUsage} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Disk Usage</span>
                    <span>{stats.systemHealth.diskUsage}%</span>
                  </div>
                  <Progress value={stats.systemHealth.diskUsage} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">AI Model Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.aiModelUsage.map((model) => (
                    <div key={model.model} className="border rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{model.model}</span>
                        <Badge variant="outline" className="text-xs">
                          {model.requests} requests
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 flex justify-between items-center">
                        <span>{model.tokensUsed.toLocaleString()} tokens</span>
                        <Badge variant="outline" className="text-xs">
                          {model.averageResponseTime}ms
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">AI Model Usage</CardTitle>
              <CardDescription className="text-sm">Monitor AI model performance and usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.aiModelUsage.map((model) => (
                  <div key={model.model} className="border rounded p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-sm sm:text-base">{model.model}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {model.requests.toLocaleString()} requests
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-600">Tokens Used:</span>
                        <div className="font-medium">{model.tokensUsed.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Response Time:</span>
                        <div className="font-medium">{model.averageResponseTime}ms</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comprehensive Quick Actions - Responsive Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Administrative Actions</CardTitle>
          <CardDescription className="text-sm">All available administrative functions and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-4">
            {/* System Management */}
            <div onClick={() => router.push("/admin")}>
              <Button className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2 bg-purple-600 hover:bg-purple-700">
                <Users className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">User Management</span>
              </Button>
            </div>

            <div onClick={() => router.push("/config-verification")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Settings className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Config Check</span>
              </Button>
            </div>

            <div onClick={() => router.push("/database-setup")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Database className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Database Setup</span>
              </Button>
            </div>

            <div onClick={() => router.push("/training")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Brain className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">AI Training</span>
              </Button>
            </div>

            {/* AI & Analytics */}
            <div onClick={() => router.push("/ai-diagnostic")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <TestTube className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">AI Diagnostic</span>
              </Button>
            </div>

            <div onClick={() => router.push("/teacher/ai-monitoring")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">AI Monitoring</span>
              </Button>
            </div>

            <div onClick={() => router.push("/production-test")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Activity className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Production Test</span>
              </Button>
            </div>

            <div onClick={() => window.open("/api/health", "_blank")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Zap className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">System Health</span>
              </Button>
            </div>

            {/* Content Management */}
            <div onClick={() => router.push("/upload")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <FileText className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Upload Materials</span>
              </Button>
            </div>

            <div onClick={() => router.push("/curriculum-api")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <BookOpen className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Curriculum API</span>
              </Button>
            </div>

            <div onClick={() => router.push("/exams/cbc")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Target className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Exam Generator</span>
              </Button>
            </div>

            <div onClick={() => router.push("/gamification")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Trophy className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Gamification</span>
              </Button>
            </div>

            {/* Virtual Lab & Learning */}
            <div onClick={() => router.push("/virtual-lab")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Microscope className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Virtual Lab</span>
              </Button>
            </div>

            <div onClick={() => router.push("/learning-path")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Map className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Learning Paths</span>
              </Button>
            </div>

            <div onClick={() => router.push("/tutor")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <MessageSquare className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">AI Tutor</span>
              </Button>
            </div>

            <div onClick={() => router.push("/ai-tools")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Wrench className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">AI Tools</span>
              </Button>
            </div>

            {/* Reports & Analytics */}
            <div onClick={() => router.push("/parent-involvement-report")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Parent Reports</span>
              </Button>
            </div>

            <div onClick={() => router.push("/teacher/student-progress")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <LineChart className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Student Progress</span>
              </Button>
            </div>

            <div onClick={() => router.push("/teacher/ai-tools")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <GraduationCap className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Teacher Tools</span>
              </Button>
            </div>

            <div onClick={() => router.push("/pdf-report-generator")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <FileDown className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">PDF Reports</span>
              </Button>
            </div>

            {/* Specialized Features */}
            <div onClick={() => router.push("/career-counseling")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <UserCheck className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Career Counseling</span>
              </Button>
            </div>

            <div onClick={() => router.push("/stem-consultations")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Atom className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">STEM Consults</span>
              </Button>
            </div>

            <div onClick={() => router.push("/cbc-pathway-guidance")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Compass className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">CBC Pathways</span>
              </Button>
            </div>

            <div onClick={() => router.push("/live-coding")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Code className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Live Coding</span>
              </Button>
            </div>

            {/* Subscription Management - Highlighted */}
            <div>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2 bg-green-50 hover:bg-green-100 border-green-200"
                onClick={() => {
                  // Scroll to subscriptions tab and activate it
                  const tabsElement = document.querySelector('[value="subscriptions"]') as HTMLElement
                  if (tabsElement) {
                    tabsElement.click()
                    setTimeout(() => {
                      tabsElement.scrollIntoView({ behavior: "smooth" })
                    }, 100)
                  }
                }}
              >
                <CreditCard className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                <span className="text-xs text-green-700 text-center leading-tight">Subscriptions</span>
              </Button>
            </div>

            {/* Testing & Development */}
            <div onClick={() => router.push("/test-api")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Bug className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Test APIs</span>
              </Button>
            </div>

            <div onClick={() => router.push("/deployment-test")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Rocket className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Deployment</span>
              </Button>
            </div>

            <div onClick={() => router.push("/supabase-setup")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Server className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Supabase Setup</span>
              </Button>
            </div>

            {/* AI Model Management - Updated with Global Config */}
            <Dialog open={showModelSelector} onOpenChange={setShowModelSelector}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100"
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Brain className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                    <span className="text-xs text-purple-700 font-medium text-center leading-tight">AI Models</span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>🤖 AI Model Management</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="selector" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="selector">Model Selector</TabsTrigger>
                    <TabsTrigger value="global">Global Config</TabsTrigger>
                  </TabsList>
                  <TabsContent value="selector">
                    <ModelSelector
                      selectedModel={selectedAIModel}
                      onModelChange={setSelectedAIModel}
                      preferences={aiPreferences}
                      onPreferencesChange={setAiPreferences}
                      className="border-0 shadow-none"
                    />
                  </TabsContent>
                  <TabsContent value="global">
                    <GlobalAIConfig />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* Global AI Configuration - New Dedicated Button */}
            <Dialog open={showGlobalAIConfig} onOpenChange={setShowGlobalAIConfig}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100"
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Settings className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                    <span className="text-xs text-blue-700 font-medium text-center leading-tight">
                      Global AI Config
                    </span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>⚙️ Global AI Configuration</DialogTitle>
                </DialogHeader>
                <GlobalAIConfig />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Buttons for Token Management - Responsive */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 text-lg sm:text-xl">🎯 Quick Token Management</CardTitle>
          <CardDescription className="text-blue-700 text-sm">
            Fast access to subscription and token allocation features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Button
              className="h-12 sm:h-16 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                const tabsElement = document.querySelector('[value="subscriptions"]') as HTMLElement
                if (tabsElement) {
                  tabsElement.click()
                  setTimeout(() => {
                    tabsElement.scrollIntoView({ behavior: "smooth" })
                  }, 100)
                }
              }}
            >
              <div className="flex flex-col items-center space-y-1">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs text-center leading-tight">View Subscriptions</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-12 sm:h-16 border-green-200 bg-green-50 hover:bg-green-100"
              onClick={() => {
                // This would open a modal or navigate to token allocation
                alert("Token allocation feature - Click 'Add Tokens' on any school subscription!")
              }}
            >
              <div className="flex flex-col items-center space-y-1">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <span className="text-xs text-green-700 text-center leading-tight">Allocate Tokens</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-12 sm:h-16 border-orange-200 bg-orange-50 hover:bg-orange-100"
              onClick={() => router.push("/admin/bulk-token-distribution")}
            >
              <div className="flex flex-col items-center space-y-1">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                <span className="text-xs text-orange-700 text-center leading-tight">Bulk Distribution</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-12 sm:h-16 border-purple-200 bg-purple-50 hover:bg-purple-100"
              onClick={() => setShowModelSelector(true)}
            >
              <div className="flex flex-col items-center space-y-1">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span className="text-xs text-purple-700 text-center leading-tight">AI Models</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
