"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, TrendingUp, Users, BookOpen, Award } from "lucide-react"

interface Student {
  id: string
  name: string
  grade: string
  overallProgress: number
  subjectProgress: { [key: string]: number }
  lastActive: string
  achievements: number
}

interface ProgressReportsProps {
  students?: Student[]
  onGenerateReport?: (studentId: string, reportType: string) => void
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    grade: "Grade 7",
    overallProgress: 85,
    subjectProgress: { Math: 90, Science: 80, English: 85 },
    lastActive: "2024-01-15",
    achievements: 12,
  },
  {
    id: "2",
    name: "Bob Smith",
    grade: "Grade 7",
    overallProgress: 72,
    subjectProgress: { Math: 75, Science: 70, English: 71 },
    lastActive: "2024-01-14",
    achievements: 8,
  },
  {
    id: "3",
    name: "Carol Davis",
    grade: "Grade 8",
    overallProgress: 93,
    subjectProgress: { Math: 95, Science: 92, English: 92 },
    lastActive: "2024-01-15",
    achievements: 18,
  },
]

export function ProgressReports({ students = mockStudents, onGenerateReport }: ProgressReportsProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("all")
  const [reportType, setReportType] = useState<string>("individual")

  const filteredStudents =
    selectedGrade === "all" ? students : students.filter((student) => student.grade === selectedGrade)

  const handleGenerateReport = (studentId: string) => {
    if (onGenerateReport) {
      onGenerateReport(studentId, reportType)
    } else {
      // Default behavior - simulate report generation
      console.log(`Generating ${reportType} report for student ${studentId}`)
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600"
    if (progress >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressVariant = (progress: number): "default" | "secondary" | "destructive" => {
    if (progress >= 80) return "default"
    if (progress >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500" />
            Student Progress Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Grade:</label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="Grade 7">Grade 7</SelectItem>
                  <SelectItem value="Grade 8">Grade 8</SelectItem>
                  <SelectItem value="Grade 9">Grade 9</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Report Type:</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="parent">Parent Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="ml-auto flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Class Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            Class Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{filteredStudents.length}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">
                {Math.round(filteredStudents.reduce((acc, s) => acc + s.overallProgress, 0) / filteredStudents.length)}%
              </div>
              <div className="text-sm text-gray-600">Avg Progress</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{filteredStudents.filter((s) => s.overallProgress >= 80).length}</div>
              <div className="text-sm text-gray-600">High Performers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">{filteredStudents.reduce((acc, s) => acc + s.achievements, 0)}</div>
              <div className="text-sm text-gray-600">Total Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Student Reports */}
      <div className="grid gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{student.name}</h3>
                  <p className="text-sm text-gray-600">
                    {student.grade} • Last active: {student.lastActive}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getProgressVariant(student.overallProgress)}>
                    {student.overallProgress}% Complete
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => handleGenerateReport(student.id)}
                    className="flex items-center gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    Generate Report
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span className={getProgressColor(student.overallProgress)}>{student.overallProgress}%</span>
                  </div>
                  <Progress value={student.overallProgress} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(student.subjectProgress).map(([subject, progress]) => (
                    <div key={subject}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{subject}</span>
                        <span className={getProgressColor(progress)}>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{student.achievements} achievements earned</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
