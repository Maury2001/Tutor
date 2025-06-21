"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, PlayCircle, Trophy } from "lucide-react"

interface ProgressData {
  learning_area_name: string
  total_objectives: number
  completed_objectives: number
  in_progress_objectives: number
  completion_percentage: number
  total_time_minutes: number
  average_score: number
}

interface ProgressTrackerProps {
  studentId: string
  gradeLevel: string
}

export function ProgressTracker({ studentId, gradeLevel }: ProgressTrackerProps) {
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
  }, [studentId, gradeLevel])

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/progress/analytics?grade_level=${gradeLevel}`)
      const result = await response.json()

      if (result.success) {
        setProgressData(result.data.progress_summary)
      }
    } catch (error) {
      console.error("Error fetching progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (objectiveId: string, status: string, percentage: number) => {
    try {
      const response = await fetch("/api/progress/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          objective_id: objectiveId,
          status,
          completion_percentage: percentage,
          time_spent: 5, // Default 5 minutes
        }),
      })

      if (response.ok) {
        fetchProgress() // Refresh data
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "mastered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <PlayCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500"
    if (percentage >= 70) return "bg-blue-500"
    if (percentage >= 50) return "bg-yellow-500"
    return "bg-gray-300"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalProgress =
    progressData.reduce((acc, curr) => acc + curr.completion_percentage, 0) / progressData.length || 0
  const totalTime = progressData.reduce((acc, curr) => acc + curr.total_time_minutes, 0)
  const totalCompleted = progressData.reduce((acc, curr) => acc + curr.completed_objectives, 0)

  return (
    <div className="space-y-6">
      {/* Overall Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Overall Progress - Grade {gradeLevel.replace("grade", "")}
          </CardTitle>
          <CardDescription>Your learning journey across all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalCompleted}</div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(totalTime / 60)}h</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(totalProgress)}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
          </div>
          <Progress value={totalProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Subject-wise Progress */}
      <div className="grid gap-4">
        {progressData.map((subject, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{subject.learning_area_name}</CardTitle>
                <Badge variant={subject.completion_percentage >= 70 ? "default" : "secondary"}>
                  {Math.round(subject.completion_percentage)}% Complete
                </Badge>
              </div>
              <CardDescription>
                {subject.completed_objectives} of {subject.total_objectives} objectives completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress
                  value={subject.completion_percentage}
                  className={`h-2 ${getStatusColor(subject.completion_percentage)}`}
                />

                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {subject.completed_objectives} completed
                  </span>
                  <span className="flex items-center gap-1">
                    <PlayCircle className="h-3 w-3 text-blue-500" />
                    {subject.in_progress_objectives} in progress
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    {Math.round(subject.total_time_minutes / 60)}h spent
                  </span>
                </div>

                {subject.average_score > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-gray-600">Average Score:</span>
                    <Badge variant={subject.average_score >= 70 ? "default" : "secondary"}>
                      {Math.round(subject.average_score)}%
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {progressData.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Progress Yet</h3>
            <p className="text-gray-500 mb-4">Start learning to see your progress here!</p>
            <Button onClick={() => (window.location.href = "/tutor")}>Start Learning</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
