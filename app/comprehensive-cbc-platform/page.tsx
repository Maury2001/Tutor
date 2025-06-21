"use client"

import { useState } from "react"
import { ComprehensiveCurriculumSelector } from "@/components/curriculum/comprehensive-curriculum-selector"
import { AdaptiveLearningInterface } from "@/components/learning/adaptive-learning-interface"
import { ComprehensiveTeacherDashboard } from "@/components/teacher/comprehensive-teacher-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, BookOpen, Brain, Award, BarChart3 } from "lucide-react"

interface CurriculumSelection {
  grade: string
  learningArea: string
  strand: string
  subStrand: string
  mode: "revision" | "guided" | "mastery" | null
}

interface LearningSession {
  id: string
  studentId: string
  curriculum: {
    grade: string
    learningArea: string
    strand: string
    subStrand: string
  }
  mode: "revision" | "guided" | "mastery"
  startTime: Date
  progress: number
  questionsAnswered: number
  correctAnswers: number
  currentDifficulty: number
  adaptations: string[]
  learningObjectives: string[]
  completedObjectives: string[]
}

export default function ComprehensiveCBCPlatform() {
  const [userRole, setUserRole] = useState<"student" | "teacher" | null>(null)
  const [currentSelection, setCurrentSelection] = useState<CurriculumSelection | null>(null)
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null)

  const handleSelectionComplete = (selection: CurriculumSelection) => {
    setCurrentSelection(selection)

    // Create new learning session
    const session: LearningSession = {
      id: `session_${Date.now()}`,
      studentId: "current_user", // In real implementation, get from auth
      curriculum: {
        grade: selection.grade,
        learningArea: selection.learningArea,
        strand: selection.strand,
        subStrand: selection.subStrand,
      },
      mode: selection.mode!,
      startTime: new Date(),
      progress: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      currentDifficulty: 5,
      adaptations: [],
      learningObjectives: [],
      completedObjectives: [],
    }

    setCurrentSession(session)
  }

  const handleSessionUpdate = (updatedSession: LearningSession) => {
    setCurrentSession(updatedSession)
  }

  const handleGenerateQuiz = () => {
    console.log("Generating adaptive quiz for current session...")
    // In real implementation, this would open quiz generation interface
  }

  const handleRequestHelp = (topic: string) => {
    console.log(`Requesting help for topic: ${topic}`)
    // In real implementation, this would trigger AI assistance
  }

  const handleBackToSelection = () => {
    setCurrentSelection(null)
    setCurrentSession(null)
  }

  // Role selection screen
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary rounded-full">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Kenya CBC Learning Platform</h1>
            <p className="text-xl text-gray-600 mb-2">Adaptive AI-Powered Education for Every Child</p>
            <p className="text-gray-500">
              Personalized learning experiences based on the Kenya Competency-Based Curriculum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Portal */}
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary"
              onClick={() => setUserRole("student")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Student Portal</CardTitle>
                <p className="text-muted-foreground">Interactive learning with AI tutoring</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span>Adaptive Learning Paths</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <span>AI-Powered Tutoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span>Progress Tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-orange-500" />
                    <span>Performance Analytics</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Learning Modes Available:</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">Revision</Badge>
                    <Badge variant="secondary">Guided Learning</Badge>
                    <Badge variant="secondary">Mastery Check</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Dashboard */}
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary"
              onClick={() => setUserRole("teacher")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Teacher Dashboard</CardTitle>
                <p className="text-muted-foreground">Comprehensive classroom management & analytics</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <span>Learning Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span>AI-Generated Content</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-green-500" />
                    <span>Progress Reports</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-orange-500" />
                    <span>Curriculum Tools</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">AI Tools Available:</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">Quiz Generator</Badge>
                    <Badge variant="secondary">Summary Notes</Badge>
                    <Badge variant="secondary">Progress Analytics</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">PP1-Grade 12</div>
                <div className="text-sm text-muted-foreground">Full CBC Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">7+</div>
                <div className="text-sm text-muted-foreground">Learning Areas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">AI-Powered</div>
                <div className="text-sm text-muted-foreground">Adaptive Learning</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Real-time</div>
                <div className="text-sm text-muted-foreground">Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Teacher Dashboard
  if (userRole === "teacher") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                <span className="text-xl font-semibold">CBC Teacher Dashboard</span>
              </div>
              <Button variant="outline" onClick={() => setUserRole(null)}>
                Switch Role
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6">
          <ComprehensiveTeacherDashboard teacherId="current_teacher" selectedClass="grade4_class1" />
        </div>
      </div>
    )
  }

  // Student Learning Interface
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <span className="text-xl font-semibold">CBC Learning Platform</span>
              {currentSession && (
                <Badge variant="outline" className="ml-2">
                  {currentSession.mode.charAt(0).toUpperCase() + currentSession.mode.slice(1)} Mode
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {currentSession && (
                <Button variant="outline" onClick={handleBackToSelection}>
                  Change Topic
                </Button>
              )}
              <Button variant="outline" onClick={() => setUserRole(null)}>
                Switch to Teacher
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {!currentSession ? (
          <ComprehensiveCurriculumSelector onSelectionComplete={handleSelectionComplete} />
        ) : (
          <AdaptiveLearningInterface
            session={currentSession}
            onSessionUpdate={handleSessionUpdate}
            onGenerateQuiz={handleGenerateQuiz}
            onRequestHelp={handleRequestHelp}
          />
        )}
      </div>
    </div>
  )
}
