"use client"

import { useState, useEffect } from "react"
import {
  BookOpen,
  Trophy,
  TrendingUp,
  Calendar,
  FileText,
  Brain,
  Target,
  LogOut,
  Lightbulb,
  Building,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/providers/auth-provider"
import { safeDateFormat } from "@/utils/date-helpers"
import { useRouter } from "next/navigation"

interface StudentStats {
  totalLessons: number
  completedLessons: number
  averageScore: number
  streak: number
  tokensUsed: number
  recentActivities: Activity[]
  upcomingAssignments: Assignment[]
  subjectProgress: SubjectProgress[]
  aiRecommendations: string[]
}

interface Activity {
  id: string
  type: "lesson" | "quiz" | "assignment" | "tutor"
  title: string
  subject: string
  score?: number
  timestamp: Date
}

interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: Date
  status: "pending" | "submitted" | "graded"
  score?: number
}

interface SubjectProgress {
  subject: string
  progress: number
  totalTopics: number
  completedTopics: number
  averageScore: number
}

export function StudentDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/auth/signin")
  }

  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentStats()
  }, [])

  const fetchStudentStats = async () => {
    try {
      setLoading(true)

      // Use fast cache for better performance
      const cacheKey = `student-stats-${user?.id || "default"}`

      // Try to get from cache first
      const cachedStats = localStorage.getItem(cacheKey)
      if (cachedStats) {
        try {
          const parsed = JSON.parse(cachedStats)
          const cacheTime = parsed.timestamp || 0
          const now = Date.now()

          // Use cache if less than 5 minutes old
          if (now - cacheTime < 300000) {
            setStats(parsed.data)
            setLoading(false)
            return
          }
        } catch (e) {
          // Invalid cache, continue to fetch
        }
      }

      // Fetch from API with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      try {
        const response = await fetch("/api/student/stats", {
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Cache the result
        const cacheData = {
          data,
          timestamp: Date.now(),
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))

        setStats(data)
      } catch (fetchError) {
        clearTimeout(timeoutId)

        if (fetchError.name === "AbortError") {
          console.warn("Request timed out, using fallback data")
        } else {
          console.error("API fetch failed:", fetchError)
        }

        // Use fallback mock data if API fails
        const fallbackStats: StudentStats = {
          totalLessons: 120,
          completedLessons: 78,
          averageScore: 82,
          streak: 5,
          tokensUsed: 1250,
          recentActivities: [
            {
              id: "act1",
              type: "lesson",
              title: "Introduction to Fractions",
              subject: "Mathematics",
              score: 85,
              timestamp: new Date(Date.now() - 3600000),
            },
            {
              id: "act2",
              type: "quiz",
              title: "Plants and Animals Quiz",
              subject: "Science",
              score: 90,
              timestamp: new Date(Date.now() - 86400000),
            },
          ],
          upcomingAssignments: [
            {
              id: "asg1",
              title: "Math Problem Set",
              subject: "Mathematics",
              dueDate: new Date(Date.now() + 86400000),
              status: "pending",
            },
          ],
          subjectProgress: [
            {
              subject: "Mathematics",
              progress: 65,
              totalTopics: 40,
              completedTopics: 26,
              averageScore: 78,
            },
            {
              subject: "Science",
              progress: 80,
              totalTopics: 35,
              completedTopics: 28,
              averageScore: 85,
            },
          ],
          aiRecommendations: [
            "Focus on improving your understanding of fractions.",
            "Try the new photosynthesis lab to boost your science skills.",
          ],
        }

        setStats(fallbackStats)
      }
    } catch (error) {
      console.error("Error in fetchStudentStats:", error)
      // Set minimal fallback data
      setStats({
        totalLessons: 0,
        completedLessons: 0,
        averageScore: 0,
        streak: 0,
        tokensUsed: 0,
        recentActivities: [],
        upcomingAssignments: [],
        subjectProgress: [],
        aiRecommendations: [],
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-pulse">
        {/* Loading skeleton */}
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg p-4 sm:p-6 h-24 sm:h-32"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-20 sm:h-24"></div>
          ))}
        </div>
        <div className="bg-gray-200 rounded-lg h-48 sm:h-64"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Unable to load dashboard</div>
          <div className="text-red-500 text-sm mb-4">Please check your connection and try again</div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const completionRate = (stats.completedLessons / stats.totalLessons) * 100

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section - Mobile Responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold mb-2">Hello {user?.name}! 👋</h1>
            <p className="text-blue-100 text-sm sm:text-base mb-3">
              Ready to learn something amazing today? Let's continue your CBC journey!
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <span className="bg-white/20 px-2 py-1 rounded whitespace-nowrap">Grade {user?.gradeLevel || "6"}</span>
              <span className="bg-white/20 px-2 py-1 rounded whitespace-nowrap">🔥 {stats.streak} day streak</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 ml-2 sm:ml-4"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Lessons Completed</CardTitle>
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.completedLessons}</div>
            <p className="text-xs text-muted-foreground">of {stats.totalLessons} total lessons</p>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Learning Streak</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.streak}</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">AI Tokens Used</CardTitle>
            <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.tokensUsed}</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Token Usage & Management - Mobile Responsive */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800 flex items-center text-lg sm:text-xl">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            AI Token Usage & Management
          </CardTitle>
          <CardDescription className="text-purple-700 text-sm">
            Track your AI interactions and token consumption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.tokensUsed}</div>
              <div className="text-xs sm:text-sm text-gray-600">Tokens Used</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl sm:text-2xl font-bold text-green-600">2,500</div>
              <div className="text-xs sm:text-sm text-gray-600">Tokens Remaining</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">3,750</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Allocated</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Token Usage Progress</span>
              <span>{Math.round((stats.tokensUsed / 3750) * 100)}%</span>
            </div>
            <Progress value={(stats.tokensUsed / 3750) * 100} className="h-3" />
          </div>
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm sm:text-base">Recent AI Interactions:</h4>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span>• Math Tutor Session</span>
                <span className="text-gray-500">45 tokens</span>
              </div>
              <div className="flex justify-between">
                <span>• Science Question Help</span>
                <span className="text-gray-500">32 tokens</span>
              </div>
              <div className="flex justify-between">
                <span>• Essay Writing Assistant</span>
                <span className="text-gray-500">67 tokens</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI-Driven Recommendations - Mobile Responsive */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center text-lg sm:text-xl">
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Personalized AI Recommendations
          </CardTitle>
          <CardDescription className="text-blue-700 text-sm">Based on your learning history</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {stats.aiRecommendations.map((recommendation, index) => (
              <li key={index} className="text-xs sm:text-sm text-blue-700">
                {recommendation}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* School & Enrollment Information - Mobile Responsive */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center text-lg sm:text-xl">
            <Building className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            School & Enrollment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">School Information</h4>
              <div className="space-y-1 text-xs sm:text-sm">
                <div>
                  <strong>School:</strong> Hilltop Primary School
                </div>
                <div>
                  <strong>Location:</strong> Nairobi, Kenya
                </div>
                <div>
                  <strong>Class:</strong> Grade 6A
                </div>
                <div>
                  <strong>Student ID:</strong> HPS-2024-{user?.id || "001"}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Enrollment Status</h4>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex items-center">
                  <Badge className="bg-green-100 text-green-800 mr-2 text-xs">Active</Badge>
                  <span>Enrolled</span>
                </div>
                <div>
                  <strong>Start Date:</strong> January 15, 2024
                </div>
                <div>
                  <strong>Subscription:</strong> School Premium Plan
                </div>
                <div>
                  <strong>Access Level:</strong> Full CBC Curriculum
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Learning Goals - Mobile Responsive */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center text-lg sm:text-xl">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Today's Learning Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm">Complete Mathematics: Fractions lesson</span>
              <Badge variant="outline" className="text-green-600 text-xs">
                In Progress
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm">Practice 5 Science questions</span>
              <Badge className="bg-green-100 text-green-800 text-xs">Not Started</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm">Read English comprehension passage</span>
              <Badge className="bg-blue-100 text-blue-800 text-xs">Completed ✓</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Tabs */}
      <Tabs defaultValue="progress" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-3 min-w-max">
            <TabsTrigger value="progress" className="text-xs sm:text-sm">
              Progress
            </TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs sm:text-sm">
              Assignments
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm">
              Recent Activity
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Subject Progress</CardTitle>
              <CardDescription className="text-sm">Your progress across different CBC subjects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.subjectProgress.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">{subject.subject}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {subject.completedTopics} of {subject.totalTopics} topics completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{subject.progress}%</div>
                      <div className="text-xs text-gray-600">Avg: {subject.averageScore}%</div>
                    </div>
                  </div>
                  <Progress value={subject.progress} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Upcoming Assignments</CardTitle>
              <CardDescription className="text-sm">Keep track of your assignments and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.upcomingAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No upcoming assignments</h3>
                  <p className="text-sm text-gray-600">You're all caught up! Check back later for new assignments.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-sm sm:text-base">{assignment.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{assignment.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-xs sm:text-sm font-medium">Due: {safeDateFormat(assignment.dueDate)}</p>
                          <Badge
                            variant={
                              assignment.status === "pending"
                                ? "destructive"
                                : assignment.status === "submitted"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
              <CardDescription className="text-sm">Your learning activities from the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === "lesson" && <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
                      {activity.type === "quiz" && <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />}
                      {activity.type === "assignment" && <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />}
                      {activity.type === "tutor" && <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate text-sm sm:text-base">{activity.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{activity.subject}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {activity.score && (
                        <Badge variant="outline" className="text-xs">
                          {activity.score}%
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">{safeDateFormat(activity.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions - Mobile Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-sm">Jump into your learning activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div onClick={() => router.push("/tutor/cbc")}>
              <Button className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2 bg-blue-600 hover:bg-blue-700">
                <Brain className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Ask TutorBot</span>
              </Button>
            </div>
            <div onClick={() => router.push("/cbc-learning-platform")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <BookOpen className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Study Materials</span>
              </Button>
            </div>
            <div onClick={() => router.push("/exams")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <FileText className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Practice Tests</span>
              </Button>
            </div>
            <div onClick={() => router.push("/gamification")}>
              <Button
                variant="outline"
                className="h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2"
              >
                <Trophy className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="text-xs text-center leading-tight">Achievements</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
