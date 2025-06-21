"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Brain,
  Microscope,
  FileText,
  Award,
  AlertTriangle,
  Star,
  Download,
  Upload,
  BarChart3,
  Target,
  Lightbulb,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react"

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - all non-functional
  const mockStats = {
    totalStudents: 28,
    activeMaterials: 15,
    pendingAssignments: 7,
    completionRate: 85,
  }

  const mockStudents = [
    {
      id: 1,
      name: "Alice Wanjiku",
      grade: "Grade 6",
      performance: 92,
      status: "excellent",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 2,
      name: "John Kiprotich",
      grade: "Grade 6",
      performance: 78,
      status: "good",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 3,
      name: "Mary Achieng",
      grade: "Grade 6",
      performance: 45,
      status: "needs-attention",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 4,
      name: "David Mwangi",
      grade: "Grade 6",
      performance: 88,
      status: "excellent",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 5,
      name: "Grace Nyambura",
      grade: "Grade 6",
      performance: 67,
      status: "good",
      avatar: "/placeholder-user.jpg",
    },
  ]

  const mockMaterials = [
    { id: 1, title: "Mathematics Worksheets", type: "PDF", uploaded: "2 days ago", downloads: 24 },
    { id: 2, title: "Science Lab Guide", type: "Document", uploaded: "1 week ago", downloads: 18 },
    { id: 3, title: "English Reading Comprehension", type: "PDF", uploaded: "3 days ago", downloads: 31 },
  ]

  const mockAssignments = [
    { id: 1, title: "Math Quiz Chapter 5", dueDate: "2024-01-15", submitted: 22, total: 28, status: "active" },
    { id: 2, title: "Science Project", dueDate: "2024-01-20", submitted: 15, total: 28, status: "active" },
    { id: 3, title: "English Essay", dueDate: "2024-01-12", submitted: 28, total: 28, status: "completed" },
  ]

  const mockRecommendations = [
    "Consider providing additional support for students struggling with fractions",
    "Great engagement in science experiments - continue hands-on activities",
    "Reading comprehension scores are improving - keep up the current approach",
  ]

  // Non-functional handlers
  const handleNonFunctional = () => {
    alert("This feature is not functional in this demo version")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Here's your class overview.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleNonFunctional}>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" onClick={handleNonFunctional}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Materials</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeMaterials}</div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.pendingAssignments}</div>
              <p className="text-xs text-muted-foreground">Due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.completionRate}%</div>
              <Progress value={mockStats.completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Tools Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI-Powered Teaching Tools
            </CardTitle>
            <CardDescription>Access advanced AI tools to enhance your teaching experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <Button variant="outline" className="h-20 flex flex-col" onClick={handleNonFunctional}>
                <Brain className="h-6 w-6 mb-2" />
                <span className="text-xs">AI Teaching Tools</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={handleNonFunctional}>
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-xs">AI Monitoring</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={handleNonFunctional}>
                <MessageSquare className="h-6 w-6 mb-2" />
                <span className="text-xs">CBC AI Tutor</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={handleNonFunctional}>
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="text-xs">Student Progress</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={handleNonFunctional}>
                <Microscope className="h-6 w-6 mb-2" />
                <span className="text-xs">Virtual Lab</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={handleNonFunctional}>
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-xs">Upload Materials</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={handleNonFunctional}>
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-xs">Create Exams</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={handleNonFunctional}>
                <BookOpen className="h-6 w-6 mb-2" />
                <span className="text-xs">Materials Library</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={handleNonFunctional}>
                <Target className="h-6 w-6 mb-2" />
                <span className="text-xs">Career Guidance</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={handleNonFunctional}>
                <Award className="h-6 w-6 mb-2" />
                <span className="text-xs">Gamification</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStudents
                      .filter((s) => s.status === "excellent")
                      .map((student) => (
                        <div key={student.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.grade}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">{student.performance}%</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Students Needing Attention */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                    Needs Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStudents
                      .filter((s) => s.status === "needs-attention")
                      .map((student) => (
                        <div key={student.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.grade}</p>
                            </div>
                          </div>
                          <Badge variant="destructive">{student.performance}%</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-blue-500" />
                  AI Teaching Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Student Management</h3>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleNonFunctional}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" onClick={handleNonFunctional}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {mockStudents.map((student) => (
                <Card key={student.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{student.name}</h4>
                          <p className="text-sm text-gray-500">{student.grade}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={student.performance} className="w-24" />
                            <span className="text-sm">{student.performance}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            student.status === "excellent"
                              ? "default"
                              : student.status === "good"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {student.status}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={handleNonFunctional}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Teaching Materials</h3>
              <Button onClick={handleNonFunctional}>
                <Plus className="h-4 w-4 mr-2" />
                Upload New Material
              </Button>
            </div>

            <div className="grid gap-4">
              {mockMaterials.map((material) => (
                <Card key={material.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <h4 className="font-semibold">{material.title}</h4>
                          <p className="text-sm text-gray-500">
                            {material.type} • Uploaded {material.uploaded}
                          </p>
                          <p className="text-sm text-gray-500">{material.downloads} downloads</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handleNonFunctional}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleNonFunctional}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleNonFunctional}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Assignments & Assessments</h3>
              <Button onClick={handleNonFunctional}>
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </div>

            <div className="grid gap-4">
              {mockAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <ClipboardList className="h-8 w-8 text-green-500" />
                        <div>
                          <h4 className="font-semibold">{assignment.title}</h4>
                          <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                          <p className="text-sm text-gray-500">
                            {assignment.submitted}/{assignment.total} submitted
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={assignment.status === "completed" ? "default" : "secondary"}>
                          {assignment.status}
                        </Badge>
                        {assignment.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : assignment.status === "active" ? (
                          <Clock3 className="h-5 w-5 text-orange-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                    <p className="text-gray-500">Chart placeholder - Non-functional</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Mathematics</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-24" />
                        <span className="text-sm">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Science</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={78} className="w-24" />
                        <span className="text-sm">78%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>English</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={92} className="w-24" />
                        <span className="text-sm">92%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Teaching Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700">Engagement Rate</h4>
                    <p className="text-2xl font-bold text-blue-600">87%</p>
                    <p className="text-sm text-blue-500">+5% from last month</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700">Assignment Completion</h4>
                    <p className="text-2xl font-bold text-green-600">94%</p>
                    <p className="text-sm text-green-500">+2% from last month</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-700">AI Tool Usage</h4>
                    <p className="text-2xl font-bold text-purple-600">76%</p>
                    <p className="text-sm text-purple-500">+12% from last month</p>
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
