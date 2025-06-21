"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Clock, Target, Award, AlertTriangle, Brain, MessageCircle } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  gradeLevel: string
  class: string
  progress: {
    overall: number
    subjects: {
      [key: string]: {
        completion: number
        averageScore: number
        timeSpent: number
        lastActivity: Date
        strugglingTopics: string[]
        masteredTopics: string[]
      }
    }
    recentActivities: Array<{
      type: string
      subject: string
      score?: number
      timeSpent: number
      date: Date
      status: "completed" | "in_progress" | "needs_help"
    }>
    streaks: {
      current: number
      longest: number
    }
    badges: string[]
    challenges: string[]
    nextRecommendations: string[]
  }
}

interface StudentProgressMonitorProps {
  student: Student
  onSendMessage?: (studentId: string, message: string) => void
  onAssignTask?: (studentId: string, task: string) => void
}

export function StudentProgressMonitor({ student, onSendMessage, onAssignTask }: StudentProgressMonitorProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState("week")

  // Generate mock time series data for charts
  const generateTimeSeriesData = () => {
    const days = selectedTimeRange === "week" ? 7 : selectedTimeRange === "month" ? 30 : 90
    const data = []

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        progress: Math.max(0, student.progress.overall - Math.random() * 20 + i * 2),
        timeSpent: Math.floor(Math.random() * 60) + 20,
        score: Math.floor(Math.random() * 30) + 70,
      })
    }

    return data
  }

  const timeSeriesData = generateTimeSeriesData()

  const subjectPerformanceData = Object.entries(student.progress.subjects).map(([subject, data]) => ({
    subject: subject.split(" ").pop(), // Get last word for shorter labels
    completion: data.completion,
    averageScore: data.averageScore,
    timeSpent: data.timeSpent,
  }))

  const getStreakColor = (streak: number) => {
    if (streak >= 10) return "text-green-600"
    if (streak >= 5) return "text-blue-600"
    return "text-gray-600"
  }

  const getLastActivityText = () => {
    const lastActivity = Math.max(...Object.values(student.progress.subjects).map((s) => s.lastActivity.getTime()))
    const hoursAgo = Math.floor((Date.now() - lastActivity) / (1000 * 60 * 60))

    if (hoursAgo < 1) return "Active now"
    if (hoursAgo < 24) return `${hoursAgo} hours ago`
    return `${Math.floor(hoursAgo / 24)} days ago`
  }

  return (
    <div className="space-y-6">
      {/* Student Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-medium text-blue-600">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-gray-600">
                  {student.gradeLevel} • {student.class}
                </p>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => onSendMessage?.(student.id, "")}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" size="sm" onClick={() => onAssignTask?.(student.id, "")}>
                <Target className="h-4 w-4 mr-2" />
                Assign Task
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{student.progress.overall}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
              <Progress value={student.progress.overall} className="mt-2" />
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStreakColor(student.progress.streaks.current)}`}>
                {student.progress.streaks.current}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
              <div className="text-xs text-gray-500">Best: {student.progress.streaks.longest}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{student.progress.badges.length}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
              <div className="flex justify-center mt-1">
                <Award className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{getLastActivityText()}</div>
              <div className="text-sm text-gray-600">Last Activity</div>
              <Clock className="h-4 w-4 text-gray-400 mx-auto mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="recommendations">Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Progress Trend</span>
                  <div className="flex gap-2">
                    {["week", "month", "quarter"].map((range) => (
                      <Button
                        key={range}
                        variant={selectedTimeRange === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeRange(range)}
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="progress" stroke="#2563eb" strokeWidth={2} name="Progress %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="timeSpent"
                      stroke="#16a34a"
                      fill="#16a34a"
                      fillOpacity={0.6}
                      name="Minutes Spent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Badges and Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.progress.badges.map((badge, index) => (
                  <Badge key={index} className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                    <Award className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
              {student.progress.badges.length === 0 && (
                <p className="text-gray-500 italic">
                  No badges earned yet. Encourage the student to complete more activities!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completion" fill="#2563eb" name="Completion %" />
                    <Bar dataKey="averageScore" fill="#16a34a" name="Average Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Subject Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(student.progress.subjects).map(([subject, data]) => (
                <Card key={subject}>
                  <CardHeader>
                    <CardTitle className="text-lg">{subject}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion</span>
                        <span>{data.completion}%</span>
                      </div>
                      <Progress value={data.completion} />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Score</span>
                        <span>{data.averageScore}%</span>
                      </div>
                      <Progress value={data.averageScore} className="bg-green-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Time Spent</span>
                        <div className="font-medium">{data.timeSpent}h</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Activity</span>
                        <div className="font-medium">
                          {Math.floor((Date.now() - data.lastActivity.getTime()) / (1000 * 60 * 60))}h ago
                        </div>
                      </div>
                    </div>

                    {data.masteredTopics.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-green-700">Mastered Topics:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {data.masteredTopics.map((topic, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.strugglingTopics.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-red-700">Struggling With:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {data.strugglingTopics.map((topic, index) => (
                            <Badge key={index} className="bg-red-100 text-red-800 text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.progress.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activity.status === "completed"
                            ? "bg-green-500"
                            : activity.status === "in_progress"
                              ? "bg-blue-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{activity.type}</div>
                        <div className="text-sm text-gray-600">{activity.subject}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.score && <div className="font-medium">{activity.score}%</div>}
                      <div className="text-sm text-gray-600">
                        {activity.timeSpent}min • {activity.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Identified Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.progress.challenges.length > 0 ? (
                <div className="space-y-3">
                  {student.progress.challenges.map((challenge, index) => (
                    <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-orange-800">{challenge}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-green-800 mb-2">No Major Challenges Identified</h3>
                  <p className="text-green-600">This student is performing well across all areas!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                AI-Generated Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.progress.nextRecommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-purple-800">{recommendation}</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => onAssignTask?.(student.id, recommendation)}>
                        Assign
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Personalized Learning Path</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    Based on {student.name}'s performance patterns, here's a suggested learning path:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                    <li>Strengthen foundational concepts in struggling areas</li>
                    <li>Provide additional practice with visual learning materials</li>
                    <li>Introduce peer collaboration opportunities</li>
                    <li>Set short-term achievable goals to build confidence</li>
                    <li>Regular check-ins and progress celebrations</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
