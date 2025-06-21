"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, BookOpen, Award, Clock, TrendingUp, MessageSquare, FileText, Calendar } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  gradeLevel: string
  class: string
  avatar?: string
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

interface StudentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  student: Student | null
  onSendMessage?: (studentId: string) => void
  onGenerateReport?: (studentId: string) => void
}

export function StudentDetailsModal({
  isOpen,
  onClose,
  student,
  onSendMessage,
  onGenerateReport,
}: StudentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!student) return null

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600"
    if (progress >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const handleSendMessage = () => {
    if (onSendMessage && student) {
      onSendMessage(student.id)
    } else {
      // Default implementation
      window.open(
        `mailto:${student?.email}?subject=Student Progress Update&body=Hello, I wanted to discuss ${student?.name}'s progress...`,
      )
    }
    onClose()
  }

  const handleGenerateReport = () => {
    if (onGenerateReport && student) {
      onGenerateReport(student.id)
    } else {
      // Default implementation - create a simple report
      const reportData = {
        studentName: student?.name,
        overallProgress: student?.progress?.overall,
        subjects: student?.progress?.subjects,
        generatedAt: new Date().toISOString(),
      }

      const reportContent = `
Student Progress Report
======================
Student: ${reportData.studentName}
Overall Progress: ${reportData.overallProgress}%
Generated: ${new Date(reportData.generatedAt).toLocaleDateString()}

Subject Breakdown:
${Object.entries(reportData.subjects || {})
  .map(([subject, data]) => `${subject}: ${data.completion}% complete, Average Score: ${data.averageScore}%`)
  .join("\n")}
      `

      // Create and download the report
      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${student?.name}_progress_report.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  // Add safe calculations with fallbacks
  const totalTimeSpent = Object.values(student.progress?.subjects || {}).reduce(
    (sum, subject) => sum + (subject?.timeSpent || 0),
    0,
  )

  const averageScore =
    Object.keys(student.progress?.subjects || {}).length > 0
      ? Object.values(student.progress.subjects).reduce((sum, subject) => sum + (subject?.averageScore || 0), 0) /
        Object.keys(student.progress.subjects).length
      : 0

  const lessonsCompleted =
    student.progress?.recentActivities?.filter((activity) => activity.status === "completed").length || 0

  const achievements = (student.progress?.badges || []).map((badge, index) => ({
    id: index.toString(),
    title: badge,
    description: `Earned for excellent performance`,
    earnedDate: new Date().toLocaleDateString(),
    icon: "award",
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-semibold">{student.name}</div>
              <div className="text-sm text-gray-600">
                {student.gradeLevel} • {student.email}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold">{student.progress.overall}%</div>
                  <div className="text-xs text-gray-600">Overall Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold">{totalTimeSpent}h</div>
                  <div className="text-xs text-gray-600">This Week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold">{lessonsCompleted}</div>
                  <div className="text-xs text-gray-600">Lessons Done</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg mx-auto mb-2">
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold">{achievements.length}</div>
                  <div className="text-xs text-gray-600">Achievements</div>
                </CardContent>
              </Card>
            </div>

            {/* Subject Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subject Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(student.progress.subjects).map(([subject, progress]) => (
                  <div key={subject}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{subject}</span>
                      <span className={getProgressColor(progress.completion)}>{progress.completion}%</span>
                    </div>
                    <Progress value={progress.completion} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleSendMessage} className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" onClick={handleGenerateReport} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Progress Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Weekly Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Average Score</div>
                      <div className="text-2xl font-bold text-green-600">{averageScore}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Learning Streak</div>
                      <div className="text-2xl font-bold text-blue-600">{student.progress.streaks.current} days</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Subject Breakdown</h4>
                  <div className="space-y-3">
                    {Object.entries(student.progress.subjects).map(([subject, progress]) => (
                      <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{subject}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={progress.completion} className="w-24 h-2" />
                          <span className={`text-sm font-medium ${getProgressColor(progress.completion)}`}>
                            {progress.completion}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {student.progress.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{activity.type}</div>
                          <div className="text-sm text-gray-600">{activity.subject}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{activity.date.toLocaleDateString()}</div>
                        {activity.score && (
                          <Badge variant={activity.score >= 80 ? "default" : "secondary"}>{activity.score}%</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Award className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                        <div className="text-xs text-gray-500">Earned: {achievement.earnedDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
