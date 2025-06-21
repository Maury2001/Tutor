"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, Clock, Target, AlertTriangle } from "lucide-react"

interface Student {
  id: string
  name: string
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
      }
    }
  }
}

interface ClassAnalyticsProps {
  students: Student[]
  classStats: {
    totalStudents: number
    averageProgress: number
    studentsNeedingHelp: number
    topPerformers: number
    averageTimeSpent: number
    completionRate: number
    subjectBreakdown: Record<string, number>
  }
}

export function ClassAnalytics({ students, classStats }: ClassAnalyticsProps) {
  const progressDistributionData = [
    { range: "90-100%", count: students.filter((s) => s.progress.overall >= 90).length, color: "#22c55e" },
    {
      range: "80-89%",
      count: students.filter((s) => s.progress.overall >= 80 && s.progress.overall < 90).length,
      color: "#3b82f6",
    },
    {
      range: "70-79%",
      count: students.filter((s) => s.progress.overall >= 70 && s.progress.overall < 80).length,
      color: "#f59e0b",
    },
    {
      range: "60-69%",
      count: students.filter((s) => s.progress.overall >= 60 && s.progress.overall < 70).length,
      color: "#f97316",
    },
    { range: "Below 60%", count: students.filter((s) => s.progress.overall < 60).length, color: "#ef4444" },
  ]

  const subjectPerformanceData = Object.entries(classStats.subjectBreakdown).map(([subject, completion]) => ({
    subject: subject.split(" ").pop(),
    completion: completion,
    averageScore:
      students.reduce((sum, student) => sum + (student.progress.subjects[subject]?.averageScore || 0), 0) /
      students.length,
  }))

  const classComparisonData = [
    { class: "9A", average: 78, students: students.filter((s) => s.class === "9A").length },
    { class: "9B", average: 72, students: students.filter((s) => s.class === "9B").length },
    { class: "8A", average: 82, students: students.filter((s) => s.class === "8A").length },
  ].filter((item) => item.students > 0)

  const engagementData = students
    .map((student) => ({
      name: student.name.split(" ")[0],
      timeSpent: Object.values(student.progress.subjects).reduce((sum, subject) => sum + subject.timeSpent, 0),
      progress: student.progress.overall,
    }))
    .sort((a, b) => b.timeSpent - a.timeSpent)
    .slice(0, 10)

  const getPerformanceInsights = () => {
    const insights = []

    if (classStats.studentsNeedingHelp / classStats.totalStudents > 0.3) {
      insights.push({
        type: "warning",
        title: "High Number of Struggling Students",
        description: `${classStats.studentsNeedingHelp} students (${Math.round((classStats.studentsNeedingHelp / classStats.totalStudents) * 100)}%) need additional support.`,
        icon: AlertTriangle,
      })
    }

    if (classStats.averageProgress > 80) {
      insights.push({
        type: "success",
        title: "Excellent Class Performance",
        description: `Class average of ${classStats.averageProgress.toFixed(1)}% indicates strong understanding.`,
        icon: Target,
      })
    }

    const lowEngagementStudents = students.filter(
      (s) => Object.values(s.progress.subjects).reduce((sum, subject) => sum + subject.timeSpent, 0) < 20,
    )

    if (lowEngagementStudents.length > 0) {
      insights.push({
        type: "info",
        title: "Low Engagement Alert",
        description: `${lowEngagementStudents.length} students have less than 20 hours of total study time.`,
        icon: Clock,
      })
    }

    return insights
  }

  const performanceInsights = getPerformanceInsights()

  return (
    <div className="space-y-6">
      {/* Performance Insights */}
      {performanceInsights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceInsights.map((insight, index) => (
            <Card
              key={index}
              className={`border-l-4 ${
                insight.type === "warning"
                  ? "border-l-orange-500 bg-orange-50"
                  : insight.type === "success"
                    ? "border-l-green-500 bg-green-50"
                    : "border-l-blue-500 bg-blue-50"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <insight.icon
                    className={`h-5 w-5 mt-0.5 ${
                      insight.type === "warning"
                        ? "text-orange-600"
                        : insight.type === "success"
                          ? "text-green-600"
                          : "text-blue-600"
                    }`}
                  />
                  <div>
                    <h4
                      className={`font-semibold text-sm ${
                        insight.type === "warning"
                          ? "text-orange-800"
                          : insight.type === "success"
                            ? "text-green-800"
                            : "text-blue-800"
                      }`}
                    >
                      {insight.title}
                    </h4>
                    <p
                      className={`text-sm ${
                        insight.type === "warning"
                          ? "text-orange-700"
                          : insight.type === "success"
                            ? "text-green-700"
                            : "text-blue-700"
                      }`}
                    >
                      {insight.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completion" fill="#16a34a" name="Completion %" />
                <Bar dataKey="averageScore" fill="#2563eb" name="Average Score %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Class Comparison */}
        {classComparisonData.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Class Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={classComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#7c3aed" name="Average Progress %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Student Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Top Engaged Students</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="timeSpent" fill="#f59e0b" name="Hours Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Class Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Students</span>
              <span className="font-semibold">{classStats.totalStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Progress</span>
              <span className="font-semibold">{classStats.averageProgress.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="font-semibold">{classStats.completionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Time Spent</span>
              <span className="font-semibold">{classStats.averageTimeSpent.toFixed(1)} hours</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
