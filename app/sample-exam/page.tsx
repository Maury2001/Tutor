"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Loader2, Plus, Trash2 } from "lucide-react"
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

interface AnswerKeyItemProps {
  question: Question
  questionNumber: number
}

const AnswerKeyItem: React.FC<AnswerKeyItemProps> = ({ question, questionNumber }) => {
  return (
    <div className="space-y-3 border rounded-md p-4">
      <h4 className="font-medium">
        {questionNumber}. {question.question}
      </h4>
      <div className="text-sm text-gray-700">
        <span className="font-medium">Answer:</span>
        {question.type === "multiple-choice" && question.correctAnswer ? (
          <p>Option {question.correctAnswer}</p>
        ) : question.type === "true-false" && question.correctAnswer ? (
          <p>{question.correctAnswer === "true" ? "True" : "False"}</p>
        ) : (
          <p>See marking guidelines for {question.type} questions.</p>
        )}
      </div>
    </div>
  )
}

export default function SampleExamPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("config")
  const [questions, setQuestions] = useState<Question[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [newTopic, setNewTopic] = useState("")
  const [showAnswerKey, setShowAnswerKey] = useState(false)
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    title: "Grade 5 Mathematics Mid-Term Exam",
    subject: "Mathematics",
    gradeLevel: "Grade 5",
    duration: 60,
    totalPoints: 100,
    instructions:
      "Answer all questions. Show your work for calculation problems. You have 60 minutes to complete this exam.",
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
    topics: ["Fractions", "Decimals", "Geometry", "Measurement", "Problem Solving"],
  })

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
    alert(`Exporting exam as ${format}... (This would download the file in a real implementation)`)
  }

  const exportAnswerKey = async (format: "pdf") => {
    alert(`Exporting answer key as ${format}... (This would download the answer key file in a real implementation)`)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sample Exam Generator</h1>
            <p className="text-gray-600">Create a customized Mathematics exam for Grade 5</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="preview" disabled={questions.length === 0}>
              Preview
            </TabsTrigger>
            <TabsTrigger value="answer-key" disabled={questions.length === 0}>
              Answer Key
            </TabsTrigger>
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={examConfig.subject}
                      onValueChange={(value) => setExamConfig((prev) => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Mathematics", "English", "Kiswahili", "Science", "Social Studies"].map((subject) => (
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
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"].map((grade) => (
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
                  <Button onClick={generateExam} disabled={isGenerating} className="min-w-32">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Exam"
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

          <TabsContent value="answer-key" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Answer Key - {examConfig.title}</CardTitle>
                    <CardDescription>Complete solutions and marking guide for teachers</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportAnswerKey("pdf")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Answer Key PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Marking Guidelines</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Multiple Choice: Full marks for correct answer only</li>
                    <li>• True/False: Full marks for correct answer only</li>
                    <li>• Short Answer: Award partial marks for showing work</li>
                    <li>• Essay: Use rubric for comprehensive assessment</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <AnswerKeyItem key={question.id} question={question} questionNumber={index + 1} />
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Total Points Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Multiple Choice:</span>
                      <span className="ml-2">
                        {questions.filter((q) => q.type === "multiple-choice").reduce((sum, q) => sum + q.points, 0)}{" "}
                        pts
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Short Answer:</span>
                      <span className="ml-2">
                        {questions.filter((q) => q.type === "short-answer").reduce((sum, q) => sum + q.points, 0)} pts
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Essay:</span>
                      <span className="ml-2">
                        {questions.filter((q) => q.type === "essay").reduce((sum, q) => sum + q.points, 0)} pts
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">True/False:</span>
                      <span className="ml-2">
                        {questions.filter((q) => q.type === "true-false").reduce((sum, q) => sum + q.points, 0)} pts
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <span className="font-bold">Total: {questions.reduce((sum, q) => sum + q.points, 0)} points</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
