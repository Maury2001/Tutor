"use client"

import { useState, useEffect } from "react"
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  LogOut,
  Brain,
  Calendar,
  Lightbulb,
  Building,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/components/providers/auth-provider"
import { safeDateFormat } from "@/utils/date-helpers"
import { useRouter } from "next/navigation"

interface TeacherStats {
  totalStudents: number
  activeMaterials: number
  pendingAssignments: number
  averageClassScore: number
  recentUploads: Upload[]
  studentProgress: StudentProgress[]
  upcomingDeadlines: Deadline[]
  classPerformance: ClassPerformance[]
  aiRecommendations: string[] // Added AI recommendations
}

interface Upload {
  id: string
  title: string
  subject: string
  uploadDate: Date
  downloads: number
}

interface StudentProgress {
  id: string
  name: string
  email: string
  gradeLevel: string
  progress: number
  lastActive: Date
  averageScore: number
}

interface Deadline {
  id: string
  title: string
  subject: string
  dueDate: Date
  submissionsCount: number
  totalStudents: number
}

interface ClassPerformance {
  subject: string
  averageScore: number
  totalAssignments: number
  completionRate: number
}

export function TeacherDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth/signin")
  }

  const [stats, setStats] = useState<TeacherStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeacherStats()
  }, [])

  const fetchTeacherStats = async () => {
    try {
      // For demo purposes, we'll use mock data instead of making an actual API call
      // In a real application, this would be: const response = await fetch("/api/teacher/stats")

      // Mock data
      const mockStats: TeacherStats = {
        totalStudents: 87,
        activeMaterials: 24,
        pendingAssignments: 12,
        averageClassScore: 76,
        recentUploads: [
          {
            id: "upl1",
            title: "Fractions Worksheet",
            subject: "Mathematics",
            uploadDate: new Date(Date.now() - 86400000), // 1 day ago
            downloads: 45,
          },
          {
            id: "upl2",
            title: "Plant Life Cycle",
            subject: "Science",
            uploadDate: new Date(Date.now() - 172800000), // 2 days ago
            downloads: 32,
          },
          {
            id: "upl3",
            title: "Reading Comprehension",
            subject: "English",
            uploadDate: new Date(Date.now() - 259200000), // 3 days ago
            downloads: 28,
          },
        ],
        studentProgress: [
          {
            id: "std1",
            name: "John Kamau",
            email: "john.k@example.com",
            gradeLevel: "Grade 5",
            progress: 78,
            lastActive: new Date(Date.now() - 3600000), // 1 hour ago
            averageScore: 82,
          },
          {
            id: "std2",
            name: "Mary Wanjiku",
            email: "mary.w@example.com",
            gradeLevel: "Grade 5",
            progress: 65,
            lastActive: new Date(Date.now() - 7200000), // 2 hours ago
            averageScore: 75,
          },
          {
            id: "std3",
            name: "David Ochieng",
            email: "david.o@example.com",
            gradeLevel: "Grade 5",
            progress: 92,
            lastActive: new Date(Date.now() - 86400000), // 1 day ago
            averageScore: 90,
          },
        ],
        upcomingDeadlines: [
          {
            id: "dead1",
            title: "Math Assignment",
            subject: "Mathematics",
            dueDate: new Date(Date.now() + 86400000), // Tomorrow
            submissionsCount: 15,
            totalStudents: 30,
          },
          {
            id: "dead2",
            title: "Science Project",
            subject: "Science",
            dueDate: new Date(Date.now() + 259200000), // 3 days from now
            submissionsCount: 8,
            totalStudents: 30,
          },
          {
            id: "dead3",
            title: "Book Report",
            subject: "English",
            dueDate: new Date(Date.now() + 432000000), // 5 days from now
            submissionsCount: 5,
            totalStudents: 30,
          },
        ],
        classPerformance: [
          {
            subject: "Mathematics",
            averageScore: 72,
            totalAssignments: 15,
            completionRate: 85,
          },
          {
            subject: "Science",
            averageScore: 78,
            totalAssignments: 12,
            completionRate: 90,
          },
          {
            subject: "English",
            averageScore: 75,
            totalAssignments: 10,
            completionRate: 82,
          },
          {
            subject: "Social Studies",
            averageScore: 80,
            totalAssignments: 8,
            completionRate: 88,
          },
        ],
        aiRecommendations: [
          "Focus on creating more engaging materials for mathematics.",
          "Encourage students to use the AI tutor for personalized help.",
          "Review student progress reports to identify struggling students.",
        ],
      }

      setStats(mockStats)
    } catch (error) {
      console.error("Error fetching teacher stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!stats) {
    return <div>Error loading dashboard</div>
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Good morning, {user?.name}! 👨‍🏫</h1>
            <p className="text-green-100">Ready to inspire young minds today? Your students are waiting!</p>
            <div className="mt-3 flex items-center space-x-4 text-sm">
              <span className="bg-white/20 px-2 py-1 rounded">{stats.totalStudents} Students</span>
              <span className="bg-white/20 px-2 py-1 rounded">📚 {stats.activeMaterials} Materials</span>
              <span className="bg-white/20 px-2 py-1 rounded">⏰ {stats.pendingAssignments} Pending</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {/* {stats.systemHealth.status !== "healthy" && (
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
      )} */}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Materials</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMaterials}</div>
            <p className="text-xs text-muted-foreground">Available to students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">Need grading</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageClassScore}%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management & School Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Management Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-xl font-bold text-blue-600">{stats.totalStudents}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">Active Teachers</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Recent Enrollments:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>• John Kamau (Grade 5)</span>
                    <span className="text-gray-500">2 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Mary Wanjiku (Grade 6)</span>
                    <span className="text-gray-500">1 week ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• David Ochieng (Grade 4)</span>
                    <span className="text-gray-500">2 weeks ago</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              School Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Hilltop Primary School</h4>
                <p className="text-sm text-gray-600">Nairobi, Kenya • Est. 1995</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Principal:</strong>
                  <br />
                  Dr. Jane Muthoni
                </div>
                <div>
                  <strong>Contact:</strong>
                  <br />
                  +254-712-345-678
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm">School Subscription:</span>
                  <Badge className="bg-purple-100 text-purple-800">Premium Plan</Badge>
                </div>
                <div className="text-xs text-gray-500 mt-1">Expires: December 31, 2024</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Driven Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Personalized AI Recommendations
          </CardTitle>
          <CardDescription className="text-blue-700">Based on class performance and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {stats.aiRecommendations.map((recommendation, index) => (
              <li key={index} className="text-sm text-blue-700">
                {recommendation}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* AI Token Management & Analytics */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Token Management & Analytics
          </CardTitle>
          <CardDescription className="text-orange-700">
            Monitor and manage AI token usage across your classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl font-bold text-orange-600">15,750</div>
              <div className="text-sm text-gray-600">Tokens Allocated</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl font-bold text-blue-600">8,420</div>
              <div className="text-sm text-gray-600">Tokens Used</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl font-bold text-green-600">7,330</div>
              <div className="text-sm text-gray-600">Tokens Remaining</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl font-bold text-purple-600">53%</div>
              <div className="text-sm text-gray-600">Usage Rate</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Token Usage</span>
                <span>8,420 / 15,750 (53%)</span>
              </div>
              <Progress value={53} className="h-3" />
            </div>

            <div>
              <h4 className="font-medium mb-3">Token Usage by Class:</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Grade 5A Mathematics</span>
                    <span>2,340 tokens</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Grade 6B Science</span>
                    <span>1,890 tokens</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Grade 4C English</span>
                    <span>1,560 tokens</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Recent AI Interactions:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>• Student help with fractions</span>
                  <span className="text-gray-500">45 tokens • 2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span>• Generated math worksheet</span>
                  <span className="text-gray-500">120 tokens • 1 day ago</span>
                </div>
                <div className="flex justify-between">
                  <span>• Science experiment guidance</span>
                  <span className="text-gray-500">78 tokens • 2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded border-l-4 border-blue-500">
              <div>
                <p className="font-medium">Grade 5 Mathematics</p>
                <p className="text-sm text-gray-600">Fractions and Decimals</p>
              </div>
              <span className="text-sm text-blue-600">9:00 - 10:00 AM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border-l-4 border-green-500">
              <div>
                <p className="font-medium">Grade 6 Science</p>
                <p className="text-sm text-gray-600">Plant Growth</p>
              </div>
              <span className="text-sm text-green-600">11:00 - 12:00 PM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border-l-4 border-orange-500">
              <div>
                <p className="font-medium">Staff Meeting</p>
                <p className="text-sm text-gray-600">Curriculum Review</p>
              </div>
              <span className="text-sm text-orange-600">2:00 - 3:00 PM</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Progress</CardTitle>
                  <CardDescription>Monitor your students' learning progress</CardDescription>
                </div>
                <Button onClick={() => router.push("/admin/students")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.studentProgress.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.gradeLevel}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{student.progress}% Complete</p>
                        <p className="text-xs text-gray-600">Avg: {student.averageScore}%</p>
                      </div>
                      <div className="w-24">
                        <Progress value={student.progress} />
                      </div>
                      <Badge
                        variant={
                          new Date().getTime() - new Date(student.lastActive).getTime() < 24 * 60 * 60 * 1000
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {new Date().getTime() - new Date(student.lastActive).getTime() < 24 * 60 * 60 * 1000
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/teacher/student-progress?studentId=${student.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Uploads</CardTitle>
                  <CardDescription>Materials you've uploaded recently</CardDescription>
                </div>
                <Button onClick={() => router.push("/upload")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Material
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentUploads.map((upload) => (
                  <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium">{upload.title}</h4>
                        <p className="text-sm text-gray-600">{upload.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{upload.downloads} downloads</p>
                        <p className="text-xs text-gray-600">{safeDateFormat(upload.uploadDate)}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assignment Deadlines</CardTitle>
                  <CardDescription>Upcoming deadlines and submission status</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium">{deadline.title}</h4>
                        <p className="text-sm text-gray-600">{deadline.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {deadline.submissionsCount} / {deadline.totalStudents} submitted
                        </p>
                        <p className="text-xs text-gray-600">Due: {safeDateFormat(deadline.dueDate)}</p>
                      </div>
                      <div className="w-24">
                        <Progress value={(deadline.submissionsCount / deadline.totalStudents) * 100} />
                      </div>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Performance</CardTitle>
              <CardDescription>Performance metrics across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.classPerformance.map((performance) => (
                  <div key={performance.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{performance.subject}</h4>
                        <p className="text-sm text-gray-600">{performance.totalAssignments} assignments</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Avg: {performance.averageScore}%</div>
                        <div className="text-xs text-gray-600">{performance.completionRate}% completion</div>
                      </div>
                    </div>
                    <Progress value={performance.averageScore} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common teaching tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div onClick={() => router.push("/exams/cbc")}>
              <Button className="h-20 w-full flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700">
                <Plus className="h-6 w-6" />
                <span>Create Assessment</span>
              </Button>
            </div>
            <div onClick={() => router.push("/upload")}>
              <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center space-y-2">
                <FileText className="h-6 w-6" />
                <span>Upload Material</span>
              </Button>
            </div>
            <div onClick={() => router.push("/teacher/ai-tools")}>
              <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center space-y-2">
                <Brain className="h-6 w-6" />
                <span>AI Insights</span>
              </Button>
            </div>
            <div onClick={() => router.push("/teacher/ai-monitoring")}>
              <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>Class Analytics</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
