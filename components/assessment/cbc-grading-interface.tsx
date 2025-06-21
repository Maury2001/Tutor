"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  CBC_PERFORMANCE_LEVELS,
  CBC_COMPETENCY_AREAS,
  CBC_ASSESSMENT_CRITERIA,
} from "@/components/ui/select"
import { Save, Send, FileText, User, Calendar, BookOpen, Target, CheckCircle, AlertCircle, Award } from "lucide-react"

interface StudentGrade {
  studentId: string
  studentName: string
  subject: string
  assessmentTitle: string
  date: string
  competencyGrades: {
    [competencyId: string]: {
      level: number
      feedback: string
      evidence: string[]
    }
  }
  criteriaGrades: {
    [criteriaId: string]: {
      level: number
      feedback: string
      strengths: string[]
      improvements: string[]
    }
  }
  overallGrade: number
  teacherComments: string
  nextSteps: string[]
  parentCommunication: {
    sent: boolean
    date?: string
    method: "email" | "sms" | "call" | "meeting"
  }
}

interface CBCGradingInterfaceProps {
  studentId?: string
  assessmentId?: string
  onSave?: (grade: StudentGrade) => void
  onSubmit?: (grade: StudentGrade) => void
}

export function CBCGradingInterface({
  studentId = "student-001",
  assessmentId = "assessment-001",
  onSave,
  onSubmit,
}: CBCGradingInterfaceProps) {
  const [currentGrade, setCurrentGrade] = useState<StudentGrade>({
    studentId,
    studentName: "John Kamau",
    subject: "Mathematics",
    assessmentTitle: "Fractions and Decimals Assessment",
    date: new Date().toISOString().split("T")[0],
    competencyGrades: {},
    criteriaGrades: {},
    overallGrade: 0,
    teacherComments: "",
    nextSteps: [],
    parentCommunication: {
      sent: false,
      method: "email",
    },
  })

  const [activeTab, setActiveTab] = useState("competencies")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getPerformanceLevelColor = (level: number) => {
    switch (level) {
      case 4:
        return "bg-green-100 text-green-800 border-green-300"
      case 3:
        return "bg-blue-100 text-blue-800 border-blue-300"
      case 2:
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case 1:
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getPerformanceLevelLabel = (level: number) => {
    const levelMap = {
      4: "Exceeds Expectations",
      3: "Meets Expectations",
      2: "Approaches Expectations",
      1: "Below Expectations",
    }
    return levelMap[level as keyof typeof levelMap] || "Not Assessed"
  }

  const updateCompetencyGrade = (competencyId: string, field: string, value: any) => {
    setCurrentGrade((prev) => ({
      ...prev,
      competencyGrades: {
        ...prev.competencyGrades,
        [competencyId]: {
          ...prev.competencyGrades[competencyId],
          [field]: value,
        },
      },
    }))
  }

  const updateCriteriaGrade = (criteriaId: string, field: string, value: any) => {
    setCurrentGrade((prev) => ({
      ...prev,
      criteriaGrades: {
        ...prev.criteriaGrades,
        [criteriaId]: {
          ...prev.criteriaGrades[criteriaId],
          [field]: value,
        },
      },
    }))
  }

  const calculateOverallGrade = () => {
    const competencyLevels = Object.values(currentGrade.competencyGrades)
      .map((g) => g.level)
      .filter(Boolean)
    const criteriaLevels = Object.values(currentGrade.criteriaGrades)
      .map((g) => g.level)
      .filter(Boolean)

    const allLevels = [...competencyLevels, ...criteriaLevels]
    if (allLevels.length === 0) return 0

    const average = allLevels.reduce((sum, level) => sum + level, 0) / allLevels.length
    return Math.round(average * 10) / 10
  }

  const handleSave = () => {
    const updatedGrade = {
      ...currentGrade,
      overallGrade: calculateOverallGrade(),
    }
    setCurrentGrade(updatedGrade)
    onSave?.(updatedGrade)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const finalGrade = {
      ...currentGrade,
      overallGrade: calculateOverallGrade(),
    }

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit?.(finalGrade)
    setIsSubmitting(false)
  }

  const addNextStep = () => {
    const newStep = prompt("Enter next learning step:")
    if (newStep) {
      setCurrentGrade((prev) => ({
        ...prev,
        nextSteps: [...prev.nextSteps, newStep],
      }))
    }
  }

  const removeNextStep = (index: number) => {
    setCurrentGrade((prev) => ({
      ...prev,
      nextSteps: prev.nextSteps.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">CBC Grading Interface</CardTitle>
                <p className="text-muted-foreground">Competency-Based Assessment and Grading</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Grade"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Student & Assessment Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Student</div>
                <div className="font-medium">{currentGrade.studentName}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Subject</div>
                <div className="font-medium">{currentGrade.subject}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Assessment</div>
                <div className="font-medium">{currentGrade.assessmentTitle}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-medium">{new Date(currentGrade.date).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Grade Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Overall Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{calculateOverallGrade() || "—"}</div>
              <div className="text-sm text-gray-600">Overall Grade</div>
              <Badge className={getPerformanceLevelColor(Math.round(calculateOverallGrade()))}>
                {getPerformanceLevelLabel(Math.round(calculateOverallGrade()))}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {Object.keys(currentGrade.competencyGrades).length}
              </div>
              <div className="text-sm text-gray-600">Competencies Assessed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {Object.keys(currentGrade.criteriaGrades).length}
              </div>
              <div className="text-sm text-gray-600">Criteria Evaluated</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grading Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="competencies">Core Competencies</TabsTrigger>
          <TabsTrigger value="criteria">Assessment Criteria</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & Comments</TabsTrigger>
          <TabsTrigger value="communication">Parent Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="competencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CBC Core Competencies Assessment</CardTitle>
              <p className="text-sm text-muted-foreground">
                Evaluate student performance across the 7 core competencies
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {CBC_COMPETENCY_AREAS.map((competency) => (
                <div key={competency.value} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{competency.label}</h4>
                    <Select
                      value={currentGrade.competencyGrades[competency.value]?.level?.toString() || ""}
                      onValueChange={(value) =>
                        updateCompetencyGrade(competency.value, "level", Number.parseInt(value))
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select performance level" />
                      </SelectTrigger>
                      <SelectContent>
                        {CBC_PERFORMANCE_LEVELS.map((level) => (
                          <SelectItem
                            key={level.value}
                            value={level.value.split("_")[level.value.split("_").length - 1]}
                          >
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {currentGrade.competencyGrades[competency.value]?.level && (
                    <div className="space-y-3">
                      <div>
                        <Badge
                          className={getPerformanceLevelColor(currentGrade.competencyGrades[competency.value].level)}
                        >
                          {getPerformanceLevelLabel(currentGrade.competencyGrades[competency.value].level)}
                        </Badge>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Feedback & Evidence</label>
                        <Textarea
                          value={currentGrade.competencyGrades[competency.value]?.feedback || ""}
                          onChange={(e) => updateCompetencyGrade(competency.value, "feedback", e.target.value)}
                          placeholder="Provide specific feedback and evidence for this competency..."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Criteria Evaluation</CardTitle>
              <p className="text-sm text-muted-foreground">Assess student performance across key learning criteria</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {CBC_ASSESSMENT_CRITERIA.map((criteria) => (
                <div key={criteria.value} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{criteria.label}</h4>
                    <Select
                      value={currentGrade.criteriaGrades[criteria.value]?.level?.toString() || ""}
                      onValueChange={(value) => updateCriteriaGrade(criteria.value, "level", Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select performance level" />
                      </SelectTrigger>
                      <SelectContent>
                        {CBC_PERFORMANCE_LEVELS.map((level) => (
                          <SelectItem
                            key={level.value}
                            value={level.value.split("_")[level.value.split("_").length - 1]}
                          >
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {currentGrade.criteriaGrades[criteria.value]?.level && (
                    <div className="space-y-3">
                      <div>
                        <Badge className={getPerformanceLevelColor(currentGrade.criteriaGrades[criteria.value].level)}>
                          {getPerformanceLevelLabel(currentGrade.criteriaGrades[criteria.value].level)}
                        </Badge>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Detailed Feedback</label>
                        <Textarea
                          value={currentGrade.criteriaGrades[criteria.value]?.feedback || ""}
                          onChange={(e) => updateCriteriaGrade(criteria.value, "feedback", e.target.value)}
                          placeholder="Provide detailed feedback for this criteria..."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={currentGrade.teacherComments}
                  onChange={(e) => setCurrentGrade((prev) => ({ ...prev, teacherComments: e.target.value }))}
                  placeholder="Provide overall comments about the student's performance..."
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Next Learning Steps</span>
                  <Button size="sm" onClick={addNextStep}>
                    <Target className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentGrade.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{step}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeNextStep(index)}>
                        ×
                      </Button>
                    </div>
                  ))}
                  {currentGrade.nextSteps.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No next steps added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parent Communication</CardTitle>
              <p className="text-sm text-muted-foreground">Manage communication with parents about this assessment</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Communication Method</label>
                  <Select
                    value={currentGrade.parentCommunication.method}
                    onValueChange={(value: any) =>
                      setCurrentGrade((prev) => ({
                        ...prev,
                        parentCommunication: { ...prev.parentCommunication, method: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="meeting">In-Person Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {currentGrade.parentCommunication.sent ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                    <span className="text-sm">
                      {currentGrade.parentCommunication.sent ? "Communication Sent" : "Pending Communication"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Communication Preview</h4>
                <div className="text-sm text-blue-700">
                  <p>
                    <strong>Student:</strong> {currentGrade.studentName}
                  </p>
                  <p>
                    <strong>Assessment:</strong> {currentGrade.assessmentTitle}
                  </p>
                  <p>
                    <strong>Overall Performance:</strong>{" "}
                    {getPerformanceLevelLabel(Math.round(calculateOverallGrade()))}
                  </p>
                  <p>
                    <strong>Key Strengths:</strong> Based on competency assessments
                  </p>
                  <p>
                    <strong>Areas for Growth:</strong> Based on criteria evaluation
                  </p>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() =>
                  setCurrentGrade((prev) => ({
                    ...prev,
                    parentCommunication: {
                      ...prev.parentCommunication,
                      sent: true,
                      date: new Date().toISOString(),
                    },
                  }))
                }
                disabled={currentGrade.parentCommunication.sent}
              >
                <Send className="mr-2 h-4 w-4" />
                {currentGrade.parentCommunication.sent ? "Communication Sent" : "Send to Parent"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
