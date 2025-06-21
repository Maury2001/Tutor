"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Brain, MessageSquare, ArrowRight, Lightbulb, BookOpen } from "lucide-react"

interface GuidedSession {
  id: string
  curriculum: any
  preferences: any
  currentStep: number
  totalSteps: number
  progress: number
  understanding: number
  chatHistory: any[]
}

interface GuidedLearningInterfaceProps {
  session: GuidedSession
  onSessionUpdate: (session: GuidedSession) => void
}

export function GuidedLearningInterface({ session, onSessionUpdate }: GuidedLearningInterfaceProps) {
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [chatInput, setChatInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showActivity, setShowActivity] = useState(false)

  useEffect(() => {
    loadCurrentLesson()
  }, [session.currentStep])

  const loadCurrentLesson = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/generate-guided-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          curriculum: session.curriculum,
          preferences: session.preferences,
          step: session.currentStep,
          totalSteps: session.totalSteps,
          understanding: session.understanding,
        }),
      })

      const data = await response.json()
      setCurrentLesson(data.lesson)
    } catch (error) {
      console.error("Error loading lesson:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return

    const userMessage = { role: "user", content: chatInput, timestamp: new Date() }
    const updatedHistory = [...session.chatHistory, userMessage]

    setIsLoading(true)
    setChatInput("")

    try {
      const response = await fetch("/api/ai/guided-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatInput,
          curriculum: session.curriculum,
          preferences: session.preferences,
          lessonContext: currentLesson,
          chatHistory: session.chatHistory,
        }),
      })

      const data = await response.json()
      const aiMessage = { role: "assistant", content: data.response, timestamp: new Date() }

      const updatedSession = {
        ...session,
        chatHistory: [...updatedHistory, aiMessage],
        understanding: data.understanding || session.understanding,
      }
      onSessionUpdate(updatedSession)
    } catch (error) {
      console.error("Error in chat:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = () => {
    const updatedSession = {
      ...session,
      currentStep: Math.min(session.currentStep + 1, session.totalSteps),
      progress: Math.min(100, ((session.currentStep + 1) / session.totalSteps) * 100),
    }
    onSessionUpdate(updatedSession)
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Guided Learning - {session.curriculum.subStrand}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline">
              Step {session.currentStep} of {session.totalSteps}
            </Badge>
            <Badge variant="secondary">Understanding: {session.understanding}%</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Lesson Progress</span>
              <span>{Math.round(session.progress)}%</span>
            </div>
            <Progress value={session.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lesson Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Lesson Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p>Loading personalized lesson...</p>
              </div>
            ) : currentLesson ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">{currentLesson.title}</h3>
                  <p className="text-sm text-blue-800">{currentLesson.objective}</p>
                </div>

                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                </div>

                {currentLesson.examples && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Examples
                    </h4>
                    <div className="space-y-2">
                      {currentLesson.examples.map((example: any, index: number) => (
                        <div key={index} className="text-sm">
                          <strong>{example.title}:</strong> {example.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentLesson.activity && (
                  <div className="space-y-2">
                    <Button onClick={() => setShowActivity(!showActivity)} variant="outline" className="w-full">
                      {showActivity ? "Hide" : "Show"} Interactive Activity
                    </Button>
                    {showActivity && (
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium mb-2">{currentLesson.activity.title}</h4>
                        <p className="text-sm mb-3">{currentLesson.activity.instructions}</p>
                        <div className="space-y-2">
                          {currentLesson.activity.steps?.map((step: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <span className="text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleNextStep} disabled={session.currentStep >= session.totalSteps}>
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Next Step
                  </Button>
                  <Button variant="outline" onClick={loadCurrentLesson}>
                    Refresh Content
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Loading lesson content...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Chat Assistant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              AI Learning Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chat History */}
              <div className="h-64 overflow-y-auto border rounded-lg p-3 space-y-3">
                {session.chatHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm">
                    Ask me anything about this lesson! I'm here to help you understand.
                  </div>
                ) : (
                  session.chatHistory.map((message: any, index: number) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-2 text-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                        AI is thinking...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask a question about this lesson..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleChatSubmit()
                    }
                  }}
                />
                <Button onClick={handleChatSubmit} disabled={!chatInput.trim() || isLoading}>
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{session.currentStep}</div>
              <div className="text-sm text-muted-foreground">Current Step</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{session.understanding}%</div>
              <div className="text-sm text-muted-foreground">Understanding</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{session.chatHistory.length}</div>
              <div className="text-sm text-muted-foreground">Questions Asked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{Math.round(session.progress)}%</div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
