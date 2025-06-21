"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StudentDetailsModal } from "@/components/teacher/student-details-modal"
import { Search, Download, Eye, MessageSquare, FileText } from "lucide-react"

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

export default function StudentProgressPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Alice Johnson",
        email: "alice.johnson@school.edu",
        gradeLevel: "Grade 7",
        class: "7A",
        progress: {
          overall: 85,
          subjects: {
            Mathematics: {
              completion: 90,
              averageScore: 88,
              timeSpent: 12,
              lastActivity: new Date(),
              strugglingTopics: ["Algebra"],
              masteredTopics: ["Geometry", "Fractions"],
            },
            Science: {
              completion: 80,
              averageScore: 85,
              timeSpent: 10,
              lastActivity: new Date(),
              strugglingTopics: ["Chemistry"],
              masteredTopics: ["Biology", "Physics"],
            },
            English: {
              completion: 88,
              averageScore: 92,
              timeSpent: 8,
              lastActivity: new Date(),
              strugglingTopics: [],
              masteredTopics: ["Grammar", "Literature"],
            },
          },
          recentActivities: [
            {
              type: "Quiz Completed",
              subject: "Mathematics",
              score: 95,
              timeSpent: 30,
              date: new Date(),
              status: "completed",
            },
            {
              type: "Assignment Submitted",
              subject: "Science",
              score: 88,
              timeSpent: 45,
              date: new Date(Date.now() - 86400000),
              status: "completed",
            },
          ],
          streaks: { current: 7, longest: 14 },
          badges: ["Math Wizard", "Science Explorer", "Perfect Attendance"],
          challenges: ["Complete 10 Math Problems", "Read 3 Science Articles"],
          nextRecommendations: ["Advanced Algebra", "Chemistry Basics"],
        },
      },
      {
        id: "2",
        name: "Bob Smith",
        email: "bob.smith@school.edu",
        gradeLevel: "Grade 7",
        class: "7B",
        progress: {
          overall: 72,
          subjects: {
            Mathematics: {
              completion: 65,
              averageScore: 70,
              timeSpent: 8,
              lastActivity: new Date(),
              strugglingTopics: ["Fractions", "Decimals"],
              masteredTopics: ["Basic Arithmetic"],
            },
            Science: {
              completion: 78,
              averageScore: 75,
              timeSpent: 9,
              lastActivity: new Date(),
              strugglingTopics: ["Physics"],
              masteredTopics: ["Biology"],
            },
            English: {
              completion: 74,
              averageScore: 72,
              timeSpent: 6,
              lastActivity: new Date(),
              strugglingTopics: ["Essay Writing"],
              masteredTopics: ["Reading Comprehension"],
            },
          },
          recentActivities: [
            {
              type: "Practice Session",
              subject: "Mathematics",
              score: 68,
              timeSpent: 25,
              date: new Date(),
              status: "needs_help",
            },
          ],
          streaks: { current: 3, longest: 8 },
          badges: ["Consistent Learner"],
          challenges: ["Improve Math Score", "Complete English Essay"],
          nextRecommendations: ["Fraction Practice", "Writing Workshop"],
        },
      },
    ]

    setTimeout(() => {
      setStudents(mockStudents)
      setFilteredStudents(mockStudents)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter students based on search and class
  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedClass !== "all") {
      filtered = filtered.filter((student) => student.class === selectedClass)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, selectedClass])

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedStudent(null)
  }

  const handleSendMessage = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    if (student) {
      window.open(
        `mailto:${student.email}?subject=Student Progress Update&body=Hello, I wanted to discuss ${student.name}'s progress...`,
      )
    }
  }

  const handleGenerateReport = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    if (student) {
      const reportContent = `
Student Progress Report
======================
Student: ${student.name}
Email: ${student.email}
Grade: ${student.gradeLevel}
Class: ${student.class}
Overall Progress: ${student.progress.overall}%
Generated: ${new Date().toLocaleDateString()}

Subject Breakdown:
${Object.entries(student.progress.subjects)
  .map(([subject, data]) => `${subject}: ${data.completion}% complete, Average Score: ${data.averageScore}%`)
  .join("\n")}

Recent Activities:
${student.progress.recentActivities
  .map(
    (activity) =>
      `${activity.date.toLocaleDateString()}: ${activity.type} - ${activity.subject} ${activity.score ? `(${activity.score}%)` : ""}`,
  )
  .join("\n")}

Badges Earned: ${student.progress.badges.join(", ")}
Current Streak: ${student.progress.streaks.current} days
      `

      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${student.name}_progress_report.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600"
    if (progress >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressBadgeVariant = (progress: number) => {
    if (progress >= 80) return "default"
    if (progress >= 60) return "secondary"
    return "destructive"
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading student progress...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Progress Monitor</h1>
          <p className="text-gray-600">Track and analyze student learning progress</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export All Reports
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Classes</option>
              <option value="7A">Grade 7A</option>
              <option value="7B">Grade 7B</option>
              <option value="8A">Grade 8A</option>
              <option value="8B">Grade 8B</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.class}</p>
                  </div>
                </div>
                <Badge variant={getProgressBadgeVariant(student.progress.overall)}>{student.progress.overall}%</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overall Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span className={getProgressColor(student.progress.overall)}>{student.progress.overall}%</span>
                </div>
                <Progress value={student.progress.overall} className="h-2" />
              </div>

              {/* Subject Progress */}
              <div className="space-y-2">
                {Object.entries(student.progress.subjects)
                  .slice(0, 3)
                  .map(([subject, progress]) => (
                    <div key={subject} className="flex justify-between text-sm">
                      <span>{subject}</span>
                      <span className={getProgressColor(progress.completion)}>{progress.completion}%</span>
                    </div>
                  ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="font-semibold">{student.progress.streaks.current}</div>
                  <div className="text-gray-600">Day Streak</div>
                </div>
                <div>
                  <div className="font-semibold">{student.progress.badges.length}</div>
                  <div className="text-gray-600">Badges</div>
                </div>
                <div>
                  <div className="font-semibold">
                    {Object.values(student.progress.subjects).reduce((sum, s) => sum + s.timeSpent, 0)}h
                  </div>
                  <div className="text-gray-600">This Week</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(student)}
                  className="flex-1 flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendMessage(student.id)}
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGenerateReport(student.id)}
                  className="flex items-center gap-1"
                >
                  <FileText className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student Details Modal */}
      <StudentDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        student={selectedStudent}
        onSendMessage={handleSendMessage}
        onGenerateReport={handleGenerateReport}
      />
    </div>
  )
}
