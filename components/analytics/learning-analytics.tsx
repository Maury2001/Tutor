"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Clock, BookOpen, Target, Award, Calendar, Activity } from "lucide-react"

interface AnalyticsData {
  progress_summary: any[]
  analytics: any[]
}

interface LearningAnalyticsProps {
  studentId: string
  gradeLevel: string
}

export function LearningAnalytics({ studentId, gradeLevel }: LearningAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")

  useEffect(() => {
    fetchAnalytics()
  }, [studentId, gradeLevel, timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/progress/analytics?grade_level=${gradeLevel}&days=${timeRange}`)
      const result = await response.json()

      if (result.success) {
        setAnalyticsData(result.data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Analytics Data</h3>
          <p className="text-gray-500">Start learning to see your analytics!</p>
        </CardContent>
      </Card>
    )
  }

  const { progress_summary, analytics } = analyticsData

  // Calculate summary statistics
  const totalTime = analytics.reduce((acc, day) => acc + day.total_time_minutes, 0)
  const totalLessons = analytics.reduce((acc, day) => acc + day.lessons_completed, 0)
  const totalAssessments = analytics.reduce((acc, day) => acc + day.assessments_taken, 0)
  const averageScore =
    analytics.length > 0 ? analytics.reduce((acc, day) => acc + day.average_score, 0) / analytics.length : 0

  // Prepare chart data
  const dailyProgressData = analytics.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: Math.round((day.total_time_minutes / 60) * 10) / 10, // Convert to hours with 1 decimal
    lessons: day.lessons_completed,
    score: day.average_score,
  }))

  const subjectProgressData = progress_summary.map((subject) => ({
    name: subject.learning_area_name.replace(" Grade " + gradeLevel.replace("grade", ""), ""),
    completed: subject.completed_objectives,
    total: subject.total_objectives,
    percentage: subject.completion_percentage,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Study Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(totalTime / 60)}h {totalTime % 60}m
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
                <p className="text-2xl font-bold text-green-600">{totalLessons}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assessments Taken</p>
                <p className="text-2xl font-bold text-purple-600">{totalAssessments}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-yellow-600">{Math.round(averageScore)}%</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">Time Range:</span>
        <div className="flex gap-1">
          {["7", "30", "90"].map((days) => (
            <Button
              key={days}
              variant={timeRange === days ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(days)}
            >
              {days} days
            </Button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Daily Progress</TabsTrigger>
          <TabsTrigger value="subjects">Subject Breakdown</TabsTrigger>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Study Time</CardTitle>
              <CardDescription>Hours spent learning each day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="time" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
              <CardDescription>Completion status across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectProgressData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${Math.round(percentage)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {subjectProgressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Assessment scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Subject Details */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Detailed breakdown by learning area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progress_summary.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{subject.learning_area_name}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>
                      {subject.completed_objectives}/{subject.total_objectives} objectives
                    </span>
                    <span>{Math.round(subject.total_time_minutes / 60)}h spent</span>
                    {subject.average_score > 0 && (
                      <Badge variant={subject.average_score >= 70 ? "default" : "secondary"}>
                        {Math.round(subject.average_score)}% avg
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{Math.round(subject.completion_percentage)}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
