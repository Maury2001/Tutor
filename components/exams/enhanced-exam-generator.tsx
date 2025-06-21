"use client"

import { useState, useCallback } from "react"
import { FileText, Download, Plus, Trash2, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CurriculumSelector } from "@/components/curriculum/curriculum-selector"

interface Question {
  id: string
  type: "multiple-choice" | "short-answer" | "essay" | "true-false"
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  difficulty: "easy" | "medium" | "hard"
  learningObjective?: string
}

interface ExamConfig {
  title: string
  grade: string | null
  learningArea: string | null
  strand: string | null
  subStrand: string | null
  duration: number
  totalPoints: number
  instructions: string
  questionTypes: {
    multipleChoice: number
    shortAnswer: number
    essay: number
    trueFalse: number
  }
  difficulty: {
    easy: number
    medium: number
    hard: number
  }
  specificObjectives: string[]
}

export function EnhancedExamGenerator() {
  const [activeTab, setActiveTab] = useState("curriculum")
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    title: "",
    grade: null,
    learningArea: null,
    strand: null,
    subStrand: null,
    duration: 60,
    totalPoints: 100,
    instructions: "",
    questionTypes: {
      multipleChoice: 10,
      shortAnswer: 5,
      essay: 2,
      trueFalse: 5,
    },
    difficulty: {
      easy: 40,
      medium: 40,
      hard: 20,
    },
    specificObjectives: [],
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [newObjective, setNewObjective] = useState("")

  // Use useCallback to prevent infinite re-renders
  const handleCurriculumSelection = useCallback((selection: any) => {
    setExamConfig((prev) => ({
      ...prev,
      grade: selection.grade,
      learningArea: selection.learningArea,
      strand: selection.strand,
      subStrand: selection.subStrand,
    }))
  }, [])

  const addObjective = useCallback(() => {
    if (newObjective.trim() && !examConfig.specificObjectives.includes(newObjective.trim())) {
      setExamConfig((prev) => ({
        ...prev,
        specificObjectives: [...prev.specificObjectives, newObjective.trim()],
      }))
      setNewObjective("")
    }
  }, [newObjective, examConfig.specificObjectives])

  const removeObjective = useCallback((objective: string) => {
    setExamConfig((prev) => ({
      ...prev,
      specificObjectives: prev.specificObjectives.filter((obj) => obj !== objective),
    }))
  }, [])

  const generateExam = useCallback(async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/exams/generate-cbc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(examConfig),
      })

      if (!response.ok) {
        throw new Error("Failed to generate exam")
      }

      const data = await response.json()
      setQuestions(data.questions || [])
      setActiveTab("preview")
    } catch (error) {
      console.error("Error generating exam:", error)
      alert("Failed to generate exam. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }, [examConfig])

  const exportExam = useCallback(async (format: "pdf" | "docx") => {
    alert(`Exporting exam as ${format}... (This would download the file in a real implementation)`)
  }, [])

  // Memoize computed values to prevent unnecessary re-renders
  const canGenerate = examConfig.grade && examConfig.learningArea && examConfig.title

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CBC Exam Generator</h1>
          <p className="text-gray-600">Create curriculum-aligned assessments with AI assistance</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
          <TabsTrigger value="curriculum" className="text-xs md:text-sm">
            Curriculum
          </TabsTrigger>
          <TabsTrigger value="config" className="text-xs md:text-sm">
            Config
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={questions.length === 0} className="text-xs md:text-sm">
            Preview
          </TabsTrigger>
          <TabsTrigger value="manage" className="text-xs md:text-sm">
            Manage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-6">
          <CurriculumSelector onSelectionChange={handleCurriculumSelection} showObjectives={true} />

          {examConfig.grade && examConfig.learningArea && (
            <Card>
              <CardHeader>
                <CardTitle>Specific Learning Objectives</CardTitle>
                <CardDescription>Add specific learning objectives you want to assess in this exam</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Add a specific learning objective..."
                    onKeyPress={(e) => e.key === "Enter" && addObjective()}
                  />
                  <Button onClick={addObjective} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {examConfig.specificObjectives.map((objective) => (
                    <Badge key={objective} variant="secondary" className="flex items-center gap-1">
                      {objective}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeObjective(objective)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Configuration</CardTitle>
              <CardDescription>Configure exam parameters and question distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title</Label>
                  <Input
                    id="title"
                    value={examConfig.title}
                    onChange={(e) => setExamConfig((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Grade 3 Math Test"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={examConfig.duration}
                    onChange={(e) =>
                      setExamConfig((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 60 }))
                    }
                    min="15"
                    max="180"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={examConfig.instructions}
                  onChange={(e) => setExamConfig((prev) => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Enter exam instructions for students..."
                  rows={3}
                />
              </div>

              {/* Question Types */}
              {/* Difficulty Distribution */}

              <div className="flex justify-end">
                <Button onClick={generateExam} disabled={isGenerating || !canGenerate} className="min-w-32">
                  {isGenerating ? (
                    <>
                      <Brain className="mr-2 h-4 w-4 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate CBC Exam
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{examConfig.title || "Generated Exam"}</CardTitle>
                  <CardDescription>
                    {examConfig.grade?.toUpperCase()} • {examConfig.duration} minutes
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => exportExam("pdf")} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" onClick={() => exportExam("docx")} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export Word
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {examConfig.instructions && (
                <div>
                  <h3 className="font-medium mb-2">Instructions:</h3>
                  <p className="text-gray-700">{examConfig.instructions}</p>
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <div key={question.id} className="space-y-3 p-3 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <h4 className="font-medium text-sm md:text-base">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge
                            variant={
                              question.difficulty === "easy"
                                ? "secondary"
                                : question.difficulty === "medium"
                                  ? "default"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {question.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {question.points} pts
                          </Badge>
                        </div>
                      </div>

                      {question.type === "multiple-choice" && question.options && (
                        <div className="ml-2 md:ml-4 space-y-1">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-start space-x-2 text-sm">
                              <span className="font-medium flex-shrink-0">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span className="break-words">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      No questions generated yet. Configure and generate an exam first.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Management</CardTitle>
              <CardDescription>View and manage your CBC-aligned exams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exams created yet</h3>
                <p className="text-gray-600">Create your first CBC-aligned exam using the curriculum selector</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
