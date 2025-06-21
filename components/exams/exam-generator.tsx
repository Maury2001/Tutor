"use client"

import { useState } from "react"
import { FileText, Download, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/providers/auth-provider"

interface Question {
  id: string
  type: "multiple-choice" | "short-answer" | "essay" | "true-false"
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  difficulty: "easy" | "medium" | "hard"
}

interface ExamConfig {
  title: string
  subject: string
  gradeLevel: string
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
  topics: string[]
}

const SUBJECTS = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Science",
  "Social Studies",
  "Creative Arts",
  "Physical Education",
  "Religious Education",
]

const GRADE_LEVELS = [
  "PP1",
  "PP2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
]

export function ExamGenerator() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("config")
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    title: "",
    subject: "",
    gradeLevel: "",
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
    topics: [],
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [newTopic, setNewTopic] = useState("")

  const addTopic = () => {
    if (newTopic.trim() && !examConfig.topics.includes(newTopic.trim())) {
      setExamConfig((prev) => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()],
      }))
      setNewTopic("")
    }
  }

  const removeTopic = (topic: string) => {
    setExamConfig((prev) => ({
      ...prev,
      topics: prev.topics.filter((t) => t !== topic),
    }))
  }

  const generateExam = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/exams/generate", {
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
      setQuestions(data.questions)
      setActiveTab("preview")
    } catch (error) {
      console.error("Error generating exam:", error)
      alert("Failed to generate exam. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const exportExam = async (format: "pdf" | "docx") => {
    try {
      const response = await fetch("/api/exams/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examConfig,
          questions,
          format,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to export exam")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${examConfig.title}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting exam:", error)
      alert("Failed to export exam. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exam Generator</h1>
          <p className="text-gray-600">Create CBC-aligned assessments for your students</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="preview" disabled={questions.length === 0}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="manage">Manage Exams</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Configuration</CardTitle>
              <CardDescription>
                Set up your exam parameters and let AI generate questions based on CBC curriculum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title</Label>
                  <Input
                    id="title"
                    value={examConfig.title}
                    onChange={(e) => setExamConfig((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Mathematics Mid-Term Exam"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={examConfig.subject}
                    onValueChange={(value) => setExamConfig((prev) => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade Level</Label>
                  <Select
                    value={examConfig.gradeLevel}
                    onValueChange={(value) => setExamConfig((prev) => ({ ...prev, gradeLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADE_LEVELS.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              {/* Topics */}
              <div className="space-y-4">
                <Label>Topics to Cover</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add a topic..."
                    onKeyPress={(e) => e.key === "Enter" && addTopic()}
                  />
                  <Button onClick={addTopic} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {examConfig.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                      {topic}
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => removeTopic(topic)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div className="space-y-4">
                <Label>Question Distribution</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="multipleChoice">Multiple Choice</Label>
                    <Input
                      id="multipleChoice"
                      type="number"
                      value={examConfig.questionTypes.multipleChoice}
                      onChange={(e) =>
                        setExamConfig((prev) => ({
                          ...prev,
                          questionTypes: {
                            ...prev.questionTypes,
                            multipleChoice: Number.parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortAnswer">Short Answer</Label>
                    <Input
                      id="shortAnswer"
                      type="number"
                      value={examConfig.questionTypes.shortAnswer}
                      onChange={(e) =>
                        setExamConfig((prev) => ({
                          ...prev,
                          questionTypes: {
                            ...prev.questionTypes,
                            shortAnswer: Number.parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="essay">Essay</Label>
                    <Input
                      id="essay"
                      type="number"
                      value={examConfig.questionTypes.essay}
                      onChange={(e) =>
                        setExamConfig((prev) => ({
                          ...prev,
                          questionTypes: {
                            ...prev.questionTypes,
                            essay: Number.parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trueFalse">True/False</Label>
                    <Input
                      id="trueFalse"
                      type="number"
                      value={examConfig.questionTypes.trueFalse}
                      onChange={(e) =>
                        setExamConfig((prev) => ({
                          ...prev,
                          questionTypes: {
                            ...prev.questionTypes,
                            trueFalse: Number.parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Difficulty Distribution */}
              <div className="space-y-4">
                <Label>Difficulty Distribution (%)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="easy">Easy</Label>
                    <Input
                      id="easy"
                      type="number"
                      value={examConfig.difficulty.easy}
                      onChange={(e) =>
                        setExamConfig((prev) => ({
                          ...prev,
                          difficulty: {
                            ...prev.difficulty,
                            easy: Number.parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medium">Medium</Label>
                    <Input
                      id="medium"
                      type="number"
                      value={examConfig.difficulty.medium}
                      onChange={(e) =>
                        setExamConfig((prev) => ({
                          ...prev,
                          difficulty: {
                            ...prev.difficulty,
                            medium: Number.parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hard">Hard</Label>
                    <Input
                      id="hard"
                      type="number"
                      value={examConfig.difficulty.hard}
                      onChange={(e) =>
                        setExamConfig((prev) => ({
                          ...prev,
                          difficulty: {
                            ...prev.difficulty,
                            hard: Number.parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={generateExam}
                  disabled={isGenerating || !examConfig.title || !examConfig.subject || !examConfig.gradeLevel}
                  className="min-w-32"
                >
                  {isGenerating ? "Generating..." : "Generate Exam"}
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
                  <CardTitle>{examConfig.title}</CardTitle>
                  <CardDescription>
                    {examConfig.subject} • {examConfig.gradeLevel} • {examConfig.duration} minutes
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => exportExam("pdf")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" onClick={() => exportExam("docx")}>
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

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            question.difficulty === "easy"
                              ? "secondary"
                              : question.difficulty === "medium"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline">{question.points} pts</Badge>
                      </div>
                    </div>

                    {question.type === "multiple-choice" && question.options && (
                      <div className="ml-4 space-y-1">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === "true-false" && (
                      <div className="ml-4 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">A.</span>
                          <span>True</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">B.</span>
                          <span>False</span>
                        </div>
                      </div>
                    )}

                    {(question.type === "short-answer" || question.type === "essay") && (
                      <div className="ml-4">
                        <div className="border-b border-gray-300 w-full h-8" />
                        {question.type === "essay" && (
                          <>
                            <div className="border-b border-gray-300 w-full h-8 mt-2" />
                            <div className="border-b border-gray-300 w-full h-8 mt-2" />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Management</CardTitle>
              <CardDescription>View and manage your created exams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exams created yet</h3>
                <p className="text-gray-600">Create your first exam using the configuration tab</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
