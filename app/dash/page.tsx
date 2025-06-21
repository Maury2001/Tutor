"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, BarChart3, Settings, Brain, Microscope, Calculator, Globe, LogOut, User } from "lucide-react"

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/signin")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "teacher":
        return "bg-blue-100 text-blue-800"
      case "school":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const getQuickActions = () => {
    switch (user.role) {
      case "admin":
        return [
          { title: "Admin Panel", href: "/admin", icon: Users, description: "Manage users and system settings" },
          { title: "System Config", href: "/admin/config", icon: Settings, description: "Configure platform settings" },
          { title: "Analytics", href: "/analytics", icon: BarChart3, description: "View system analytics" },
          { title: "AI Tools", href: "/ai-tools", icon: Brain, description: "AI management dashboard" },
        ]
      case "teacher":
        return [
          {
            title: "AI Teaching Tools",
            href: "/teacher/ai-tools",
            icon: Brain,
            description: "AI-powered lesson planning",
          },
          {
            title: "Student Progress",
            href: "/teacher/progress",
            icon: BarChart3,
            description: "Track student performance",
          },
          { title: "Virtual Lab", href: "/virtual-lab", icon: Microscope, description: "Science experiments" },
          { title: "CBC Curriculum", href: "/curriculum", icon: BookOpen, description: "Curriculum resources" },
        ]
      case "school":
        return [
          {
            title: "School Dashboard",
            href: "/school/dashboard",
            icon: Users,
            description: "Manage school operations",
          },
          { title: "Performance Reports", href: "/school/reports", icon: BarChart3, description: "School analytics" },
          { title: "CBC Resources", href: "/curriculum", icon: BookOpen, description: "Curriculum management" },
          { title: "Settings", href: "/school/settings", icon: Settings, description: "School configuration" },
        ]
      default: // student
        return [
          {
            title: "CBC AI Tutor",
            href: "/tutor/cbc",
            icon: Brain,
            description: "Get personalized help with CBC topics",
          },
          {
            title: "Virtual Lab",
            href: "/virtual-lab",
            icon: Microscope,
            description: "Interactive science experiments",
          },
          {
            title: "Math Practice",
            href: "/math-practice",
            icon: Calculator,
            description: "Practice mathematics skills",
          },
          { title: "Learning Path", href: "/learning-path", icon: Globe, description: "Your personalized journey" },
        ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2">
              <div className="relative">
                <img
                  src="/tutorbot-logo.png"
                  alt="TutorBot AI Logo"
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling.style.display = "block";
                  }}
                />
                <div className="hidden">
                  <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TutorBot AI
              </span>
            </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <Badge className={getRoleColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-600">
            {user.role === "admin" && "Manage the CBC TutorBot system and monitor all activities."}
            {user.role === "teacher" && "Access AI-powered tools to enhance your teaching experience."}
            {user.role === "school" && `Manage ${user.schoolName || "your school"} and track performance.`}
            {user.role === "student" &&
              `Continue your Grade ${user.gradeLevel?.replace("grade", "").replace("pp", "PP") || "5"} CBC learning journey.`}
          </p>
        </div>

        {/* Admin Dashboard - All Available Actions */}
        {user.role === "admin" && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-purple-800">🛡️ Complete Admin Dashboard</CardTitle>
                <CardDescription>All administrative functions and system management tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {/* System Management */}
                  <Button
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-600 hover:bg-purple-700"
                    onClick={() => router.push("/admin")}
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-xs">Admin Panel</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/config-verification")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Config Check</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/database-setup")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Database Setup</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/training")}
                  >
                    <Brain className="h-6 w-6" />
                    <span className="text-xs">AI Training</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/ai-diagnostic")}
                  >
                    <Brain className="h-6 w-6" />
                    <span className="text-xs">AI Diagnostic</span>
                  </Button>

                  {/* Analytics & Monitoring */}
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/teacher/ai-monitoring")}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-xs">AI Monitoring</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/production-test")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Production Test</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => window.open("/api/health", "_blank")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">System Health</span>
                  </Button>

                  {/* Content Management */}
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/upload")}
                  >
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs">Upload Materials</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/curriculum-api")}
                  >
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs">Curriculum API</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/exams/cbc")}
                  >
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs">Exam Generator</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/gamification")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Gamification</span>
                  </Button>

                  {/* Virtual Lab & Learning */}
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/virtual-lab")}
                  >
                    <Microscope className="h-6 w-6" />
                    <span className="text-xs">Virtual Lab</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/learning-path")}
                  >
                    <Globe className="h-6 w-6" />
                    <span className="text-xs">Learning Paths</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/tutor")}
                  >
                    <Brain className="h-6 w-6" />
                    <span className="text-xs">AI Tutor</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/ai-tools")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">AI Tools</span>
                  </Button>

                  {/* Reports & Analytics */}
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/parent-involvement-report")}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-xs">Parent Reports</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/teacher/student-progress")}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-xs">Student Progress</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/teacher/ai-tools")}
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-xs">Teacher Tools</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/pdf-report-generator")}
                  >
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs">PDF Reports</span>
                  </Button>

                  {/* Specialized Features */}
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/career-counseling")}
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-xs">Career Counseling</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/stem-consultations")}
                  >
                    <Microscope className="h-6 w-6" />
                    <span className="text-xs">STEM Consults</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/cbc-pathway-guidance")}
                  >
                    <Globe className="h-6 w-6" />
                    <span className="text-xs">CBC Pathways</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/live-coding")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Live Coding</span>
                  </Button>

                  {/* Testing & Development */}
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/test-api")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Test APIs</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/deployment-test")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Deployment</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/supabase-setup")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Supabase Setup</span>
                  </Button>

                  {/* Additional Admin Features */}
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/admin/subscriptions")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Subscriptions</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/admin/token-demo")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">Token Demo</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/training")}
                  >
                    <Brain className="h-6 w-6" />
                    <span className="text-xs">AI Training</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/ai-training/gpu-clusters")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">GPU Clusters</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/ai-training/parameters")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-xs">AI Parameters</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => router.push("/ai-training/templates")}
                  >
                    <Brain className="h-6 w-6" />
                    <span className="text-xs">AI Templates</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Regular Quick Actions Grid for Non-Admin Users */}
        {user.role !== "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {getQuickActions().map((action, index) => (
              <div key={index} className="group">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full group-hover:scale-105">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <action.icon className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
                      <CardTitle className="text-lg group-hover:text-blue-700">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">{action.description}</CardDescription>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        // For now, show coming soon for non-essential routes
                        if (
                          action.href === "/tutor/cbc" ||
                          action.href === "/virtual-lab" ||
                          action.href === "/admin"
                        ) {
                          router.push(action.href)
                        } else {
                          alert(`${action.title} - Coming Soon! This feature is being developed.`)
                        }
                      }}
                    >
                      {action.href === "/tutor/cbc" || action.href === "/virtual-lab" || action.href === "/admin"
                        ? "Open"
                        : "Coming Soon"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
                {user.gradeLevel && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Grade Level</span>
                    <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                      {user.gradeLevel.toUpperCase().replace("GRADE", "Grade ")}
                    </span>
                  </div>
                )}
                {user.schoolName && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">School</span>
                    <span className="text-sm font-medium truncate max-w-32" title={user.schoolName}>
                      {user.schoolName}
                    </span>
                  </div>
                )}
                {user.county && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">County</span>
                    <span className="text-sm font-medium">{user.county}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">Profile Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.role === "student" ? "Ready" : "Active"}</div>
                  <div className="text-sm text-gray-600">{user.role === "student" ? "to Learn" : "Account"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">New</div>
                  <div className="text-sm text-gray-600">User</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-orange-600" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Account Created</p>
                    <p className="text-gray-600">Welcome to CBC TutorBot!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Profile Setup</p>
                    <p className="text-gray-600">All details configured</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Start Exploring</p>
                    <p className="text-gray-600">Try the features above</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-specific additional content */}
        {user.role === "student" && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-blue-800">Your Learning Journey</CardTitle>
                <CardDescription className="text-blue-600">
                  Personalized CBC curriculum for Grade {user.gradeLevel?.replace("grade", "") || "5"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">AI Tutor</h3>
                    <p className="text-sm text-gray-600">Get personalized help</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Microscope className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Virtual Lab</h3>
                    <p className="text-sm text-gray-600">Hands-on experiments</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Calculator className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Practice</h3>
                    <p className="text-sm text-gray-600">Interactive exercises</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
