"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  TrendingUp,
  Target,
  Clock,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  BarChart3,
  Zap,
} from "lucide-react"

interface AdaptiveResponse {
  content: string
  difficulty: number
  style: string
  adaptationReason: string
  followUpQuestions: string[]
  estimatedTime: number
  supportMaterials?: string[]
}

interface LearningInsight {
  type: string
  title: string
  description: string
  severity: "low" | "medium" | "high"
  recommendations: string[]
}

interface PerformanceInsights {
  overallAccuracy: number
  currentDifficulty: number
  learningStyle: string
  strengths: string[]
  areasForImprovement: string[]
  motivationLevel: string
  recommendations: string[]
}

interface AdaptiveTutorProps {
  studentId: string
  curriculumContext: any
  onResponseUpdate?: (data: any) => void
}

export default function AdaptiveTutorInterface({ studentId, curriculumContext, onResponseUpdate }: AdaptiveTutorProps) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [currentInsights, setCurrentInsights] = useState<LearningInsight[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceInsights | null>(null)
  const [sessionContext, setSessionContext] = useState({
    timeInSession: 0,
    questionsAsked: 0,
    previousTopics: [],
    mood: "neutral",
    energyLevel: "medium",
  })

  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionContext((prev) => ({
        ...prev,
        timeInSession: prev.timeInSession + 1,
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, userMessage])
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/tutor/adaptive-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          message,
          curriculumContext,
          sessionContext,
          performanceData: performanceData
            ? {
                recentScores: [performanceData.overallAccuracy],
                sessionDuration: sessionContext.timeInSession,
                attentionSpan: 20, // Default attention span
                helpRequestFrequency: 0,
                preferredLearningStyle: performanceData.learningStyle,
                currentApproach: "mixed",
              }
            : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage = {
          role: "assistant",
          content: data.response.content,
          timestamp: new Date(),
          adaptiveData: data.response,
          insights: data.insights,
        }

        setChatHistory((prev) => [...prev, assistantMessage])
        setCurrentInsights(data.insights || [])
        setPerformanceData(data.performanceInsights)

        // Update session context
        setSessionContext((prev) => ({
          ...prev,
          questionsAsked: prev.questionsAsked + 1,
          previousTopics: [...new Set([...prev.previousTopics, curriculumContext?.strand || "General"])],
        }))

        // Notify parent component
        if (onResponseUpdate) {
          onResponseUpdate(data)
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setChatHistory((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const updateStudentResponse = async (questionId: string, isCorrect: boolean, responseTime: number) => {
    try {
      await fetch("/api/tutor/adaptive-chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          questionId,
          isCorrect,
          responseTime,
          topic: curriculumContext?.strand || "General",
        }),
      })
    } catch (error) {
      console.error("Error updating student response:", error)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Target className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return "bg-green-500"
    if (difficulty <= 6) return "bg-yellow-500"
    if (difficulty <= 8) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Performance Dashboard */}
      {performanceData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold">{Math.round(performanceData.overallAccuracy * 100)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{performanceData.currentDifficulty}</span>
                    <div className={`w-3 h-3 rounded-full ${getDifficultyColor(performanceData.currentDifficulty)}`} />
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Session Time</p>
                  <p className="text-2xl font-bold">{sessionContext.timeInSession}m</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="text-2xl font-bold">{sessionContext.questionsAsked}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Learning Insights */}
      {currentInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Learning Insights
            </CardTitle>
            <CardDescription>AI-powered analysis of your learning patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentInsights.map((insight, index) => (
                <Alert key={index}>
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(insight.severity)}
                    <div className="flex-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      {insight.recommendations.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Recommendations:</p>
                          <ul className="text-xs space-y-1">
                            {insight.recommendations.slice(0, 2).map((rec, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <Zap className="h-3 w-3 text-blue-500" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths and Areas for Improvement */}
      {performanceData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {performanceData.strengths.length > 0 ? (
                  performanceData.strengths.map((strength, index) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {strength}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Keep learning to discover your strengths!</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-500" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {performanceData.areasForImprovement.length > 0 ? (
                  performanceData.areasForImprovement.map((area, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {area}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Great job! No major areas of concern.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Adaptive AI Tutor
          </CardTitle>
          <CardDescription>I adapt my teaching style based on your performance and learning patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Start chatting with your adaptive AI tutor!</p>
                <p className="text-sm">I'll adjust my teaching style based on how you learn best.</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Adaptive Information */}
                    {msg.adaptiveData && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Brain className="h-3 w-3" />
                          <span>Adaptive Response</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span>Difficulty:</span>
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${getDifficultyColor(msg.adaptiveData.difficulty)}`}
                              />
                              <span>{msg.adaptiveData.difficulty}/10</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Style:</span>
                            <Badge variant="outline" className="text-xs">
                              {msg.adaptiveData.style}
                            </Badge>
                          </div>
                          {msg.adaptiveData.adaptationReason !== "Continuing with current approach" && (
                            <div className="text-blue-600 dark:text-blue-400">
                              <Zap className="h-3 w-3 inline mr-1" />
                              {msg.adaptiveData.adaptationReason}
                            </div>
                          )}
                        </div>

                        {/* Follow-up Questions */}
                        {msg.adaptiveData.followUpQuestions && msg.adaptiveData.followUpQuestions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium mb-1">Follow-up questions:</p>
                            <div className="space-y-1">
                              {msg.adaptiveData.followUpQuestions.slice(0, 2).map((question: string, i: number) => (
                                <Button
                                  key={i}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-6 px-2"
                                  onClick={() => setMessage(question)}
                                >
                                  {question}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-xs opacity-70 mt-2">{msg.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask me anything about your studies..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              className="min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={!message.trim() || isLoading} className="px-6">
              {isLoading ? "Thinking..." : "Send"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
