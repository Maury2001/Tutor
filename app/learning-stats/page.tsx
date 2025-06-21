"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, TrendingUp, Clock, Target, Award, BookOpen, Zap } from "lucide-react"
import { ProgressTracker } from "@/components/progress/progress-tracker"
import { useState, useEffect } from "react"

export default function LearningStatsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchLearningStats()
    }
  }, [user])

  const fetchLearningStats = async () => {
    try {
      const response = await fetch("/api/student/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch learning stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Please log in to view your learning statistics.</p>
          <Button onClick={() => router.push("/auth/signin")} className="mt-4">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  const studyTime = stats?.studyTime || { total: 24.5, thisWeek: 8.2, average: 3.5 }
  const lessonsCompleted = stats?.lessonsCompleted || { total: 42, thisWeek: 8, thisMonth: 15 }
  const averageScore = stats?.averageScore || { current: 87, improvement: 5, trend: "up" }
  const achievements = stats?.achievements || { total: 12, recent: 3, badges: [] }

  const subjectPerformance = stats?.subjectPerformance || [
    { name: "Mathematics", score: 92, progress: 85, trend: "up", color: "bg-blue-600" },
    { name: "Science", score: 85, progress: 78, trend: "up", color: "bg-green-600" },
    { name: "English", score: 78, progress: 72, trend: "stable", color: "bg-yellow-600" },
    { name: "Social Studies", score: 88, progress: 80, trend: "up", color: "bg-purple-600" },
    { name: "Kiswahili", score: 75, progress: 68, trend: "down", color: "bg-orange-600" },
  ]

  const recentAchievements = stats?.recentAchievements || [
    {
      title: "Math Master",
      description: "Completed 10 math lessons",
      icon: "🏆",
      date: "2 days ago",
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      title: "Science Explorer",
      description: "Finished virtual lab experiment",
      icon: "🔬",
      date: "1 week ago",
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Reading Star",
      description: "Read 5 stories this month",
      icon: "📚",
      date: "3 days ago",
      color: "bg-blue-50 border-blue-200",
    },
  ]

  const learningStreak = stats?.learningStreak || { current: 7, longest: 12, thisMonth: 15 }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Statistics</h1>
              <p className="text-gray-600">Track your educational progress and achievements</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800">Active Learner</Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyTime.total} hrs</div>
              <p className="text-xs text-muted-foreground">This month</p>
              <div className="mt-2 text-xs">
                <span className="text-green-600">+{studyTime.thisWeek}hrs this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessonsCompleted.total}</div>
              <p className="text-xs text-muted-foreground">+{lessonsCompleted.thisWeek} from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore.current}%</div>
              <p className="text-xs text-muted-foreground">+{averageScore.improvement}% improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{achievements.total}</div>
              <p className="text-xs text-muted-foreground">Badges earned</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subject Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Subject Performance
                  </CardTitle>
                  <CardDescription>Your progress across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjectPerformance.map((subject, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            {subject.name}
                            {subject.trend === "up" && <TrendingUp className="h-3 w-3 ml-1 text-green-500" />}
                            {subject.trend === "down" && (
                              <TrendingUp className="h-3 w-3 ml-1 text-red-500 rotate-180" />
                            )}
                          </span>
                          <span className="font-medium">{subject.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${subject.color} h-2 rounded-full`}
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Streak */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                    Learning Streak
                  </CardTitle>
                  <CardDescription>Your consistent learning activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{learningStreak.current}</div>
                    <p className="text-lg font-medium">Days in a row!</p>
                    <p className="text-sm text-gray-600 mb-4">Keep up the great work</p>

                    <div className="grid grid-cols-7 gap-2 mt-4">
                      {Array.from({ length: 7 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            i < learningStreak.current ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      <p>Longest streak: {learningStreak.longest} days</p>
                      <p>This month: {learningStreak.thisMonth} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectPerformance.map((subject, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {subject.name}
                      <Badge
                        className={
                          subject.score >= 90
                            ? "bg-green-100 text-green-800"
                            : subject.score >= 80
                              ? "bg-blue-100 text-blue-800"
                              : subject.score >= 70
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }
                      >
                        {subject.score}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{subject.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${subject.color} h-2 rounded-full`}
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Trend</span>
                        <div className="flex items-center">
                          {subject.trend === "up" && (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-600">Improving</span>
                            </>
                          )}
                          {subject.trend === "down" && (
                            <>
                              <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
                              <span className="text-red-600">Declining</span>
                            </>
                          )}
                          {subject.trend === "stable" && (
                            <>
                              <div className="w-4 h-4 bg-gray-400 rounded-full mr-1"></div>
                              <span className="text-gray-600">Stable</span>
                            </>
                          )}
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTracker />
          </TabsContent>

          <TabsContent value="achievements">
            {/* Recent Achievements */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentAchievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg border ${achievement.color}`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* All Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>All Achievements</CardTitle>
                <CardDescription>Complete collection of your learning badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { name: "First Steps", icon: "👶", earned: true, description: "Completed first lesson" },
                    { name: "Math Wizard", icon: "🧙‍♂️", earned: true, description: "Solved 100 math problems" },
                    { name: "Science Explorer", icon: "🔬", earned: true, description: "Completed 5 experiments" },
                    { name: "Reading Champion", icon: "📚", earned: true, description: "Read 10 stories" },
                    { name: "Streak Master", icon: "🔥", earned: true, description: "7-day learning streak" },
                    { name: "Perfect Score", icon: "💯", earned: true, description: "Scored 100% on quiz" },
                    {
                      name: "Quick Learner",
                      icon: "⚡",
                      earned: false,
                      description: "Complete lesson in under 5 minutes",
                    },
                    { name: "Dedication", icon: "🏆", earned: false, description: "30-day learning streak" },
                  ].map((badge, index) => (
                    <div
                      key={index}
                      className={`text-center p-4 rounded-lg border ${badge.earned ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"}`}
                    >
                      <div className={`text-3xl mb-2 ${!badge.earned && "grayscale opacity-50"}`}>{badge.icon}</div>
                      <h3 className={`font-semibold text-sm ${badge.earned ? "text-yellow-800" : "text-gray-500"}`}>
                        {badge.name}
                      </h3>
                      <p className={`text-xs mt-1 ${badge.earned ? "text-yellow-600" : "text-gray-400"}`}>
                        {badge.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
