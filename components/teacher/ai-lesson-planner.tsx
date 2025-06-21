"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, FileText, CheckSquare, Download, Copy, Loader2, Sparkles, Target, Clock, Users } from "lucide-react"

interface LessonPlanForm {
  subject: string
  grade: string
  topic: string
  duration: number
  learningObjectives: string[]
  resources: string[]
  specialNeeds: string
  assessmentType: string
}

interface AssessmentForm {
  subject: string
  grade: string
  topic: string
  assessmentType: "formative" | "summative" | "diagnostic" | "peer" | "self"
  questionTypes: string[]
  difficulty: "easy" | "medium" | "hard" | "mixed"
  duration: number
  learningObjectives: string[]
  includeRubric: boolean
}

export function AILessonPlanner() {
  const [activeTab, setActiveTab] = useState("lesson-plan")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")

  // Lesson Plan Form State
  const [lessonForm, setLessonForm] = useState<LessonPlanForm>({
    subject: "",
    grade: "",
    topic: "",
    duration: 40,
    learningObjectives: [""],
    resources: [""],
    specialNeeds: "",
    assessmentType: "",
  })

  // Assessment Form State
  const [assessmentForm, setAssessmentForm] = useState<AssessmentForm>({
    subject: "",
    grade: "",
    topic: "",
    assessmentType: "formative",
    questionTypes: [],
    difficulty: "mixed",
    duration: 60,
    learningObjectives: [""],
    includeRubric: true,
  })

  const subjects = [
    "Mathematics",
    "English",
    "Kiswahili",
    "Science",
    "Social Studies",
    "Creative Arts",
    "Physical Education",
    "Life Skills",
  ]

  const grades = ["PP1", "PP2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]

  const questionTypes = [
    "Multiple Choice",
    "Short Answer",
    "Essay Questions",
    "True/False",
    "Fill in the Blanks",
    "Matching",
    "Problem Solving",
    "Practical Tasks",
  ]

  const generateLessonPlan = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/lesson-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonForm),
      })

      const data = await response.json()
      setGeneratedContent(data.lessonPlan)
    } catch (error) {
      console.error("Error generating lesson plan:", error)
      setGeneratedContent("Failed to generate lesson plan. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const generateAssessment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/assessment-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentForm),
      })

      const data = await response.json()
      setGeneratedContent(data.assessment)
    } catch (error) {
      console.error("Error generating assessment:", error)
      setGeneratedContent("Failed to generate assessment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addObjective = (type: "lesson" | "assessment") => {
    if (type === "lesson") {
      setLessonForm((prev) => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, ""],
      }))
    } else {
      setAssessmentForm((prev) => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, ""],
      }))
    }
  }

  const updateObjective = (index: number, value: string, type: "lesson" | "assessment") => {
    if (type === "lesson") {
      const newObjectives = [...lessonForm.learningObjectives]
      newObjectives[index] = value
      setLessonForm((prev) => ({ ...prev, learningObjectives: newObjectives }))
    } else {
      const newObjectives = [...assessmentForm.learningObjectives]
      newObjectives[index] = value
      setAssessmentForm((prev) => ({ ...prev, learningObjectives: newObjectives }))
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            AI Teaching Assistant
          </CardTitle>
          <p className="text-muted-foreground">Generate CBC-aligned lesson plans and assessments with AI assistance</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Forms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lesson-plan" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Lesson Plan
                </TabsTrigger>
                <TabsTrigger value="assessment" className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Assessment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lesson-plan" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={lessonForm.subject}
                      onValueChange={(value) => setLessonForm((prev) => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select
                      value={lessonForm.grade}
                      onValueChange={(value) => setLessonForm((prev) => ({ ...prev, grade: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    placeholder="Enter lesson topic"
                    value={lessonForm.topic}
                    onChange={(e) => setLessonForm((prev) => ({ ...prev, topic: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    type="number"
                    placeholder="40"
                    value={lessonForm.duration}
                    onChange={(e) =>
                      setLessonForm((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 40 }))
                    }
                  />
                </div>

                <div>
                  <Label>Learning Objectives</Label>
                  {lessonForm.learningObjectives.map((objective, index) => (
                    <Input
                      key={index}
                      placeholder={`Learning objective ${index + 1}`}
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value, "lesson")}
                      className="mt-2"
                    />
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addObjective("lesson")} className="mt-2">
                    Add Objective
                  </Button>
                </div>

                <div>
                  <Label htmlFor="specialNeeds">Special Considerations</Label>
                  <Textarea
                    placeholder="Any special needs or considerations for this lesson"
                    value={lessonForm.specialNeeds}
                    onChange={(e) => setLessonForm((prev) => ({ ...prev, specialNeeds: e.target.value }))}
                  />
                </div>

                <Button onClick={generateLessonPlan} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Lesson Plan...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Generate Lesson Plan
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="assessment" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={assessmentForm.subject}
                      onValueChange={(value) => setAssessmentForm((prev) => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select
                      value={assessmentForm.grade}
                      onValueChange={(value) => setAssessmentForm((prev) => ({ ...prev, grade: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    placeholder="Enter assessment topic"
                    value={assessmentForm.topic}
                    onChange={(e) => setAssessmentForm((prev) => ({ ...prev, topic: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assessmentType">Assessment Type</Label>
                    <Select
                      value={assessmentForm.assessmentType}
                      onValueChange={(value: any) => setAssessmentForm((prev) => ({ ...prev, assessmentType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formative">Formative</SelectItem>
                        <SelectItem value="summative">Summative</SelectItem>
                        <SelectItem value="diagnostic">Diagnostic</SelectItem>
                        <SelectItem value="peer">Peer Assessment</SelectItem>
                        <SelectItem value="self">Self Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={assessmentForm.difficulty}
                      onValueChange={(value: any) => setAssessmentForm((prev) => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Question Types</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {questionTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={assessmentForm.questionTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAssessmentForm((prev) => ({
                                ...prev,
                                questionTypes: [...prev.questionTypes, type],
                              }))
                            } else {
                              setAssessmentForm((prev) => ({
                                ...prev,
                                questionTypes: prev.questionTypes.filter((t) => t !== type),
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={type} className="text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Learning Objectives</Label>
                  {assessmentForm.learningObjectives.map((objective, index) => (
                    <Input
                      key={index}
                      placeholder={`Learning objective ${index + 1}`}
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value, "assessment")}
                      className="mt-2"
                    />
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addObjective("assessment")} className="mt-2">
                    Add Objective
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeRubric"
                    checked={assessmentForm.includeRubric}
                    onCheckedChange={(checked) => setAssessmentForm((prev) => ({ ...prev, includeRubric: !!checked }))}
                  />
                  <Label htmlFor="includeRubric">Include Assessment Rubric</Label>
                </div>

                <Button onClick={generateAssessment} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Assessment...
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Generate Assessment
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Content
              </span>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    CBC Aligned
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activeTab === "lesson-plan" ? `${lessonForm.duration} min` : `${assessmentForm.duration} min`}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {activeTab === "lesson-plan" ? lessonForm.grade : assessmentForm.grade}
                  </Badge>
                </div>
                <Separator />
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">{generatedContent}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Generated content will appear here</p>
                <p className="text-sm">Fill out the form and click generate to create your lesson plan or assessment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
