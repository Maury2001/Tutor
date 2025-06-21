"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { RefreshCw, CheckCircle, XCircle, Brain, Lightbulb, Target, Clock } from "lucide-react"

interface RevisionSession {
  id: string
  curriculum: any
  preferences: any
  progress: number
  questionsAnswered: number
  correctAnswers: number
  currentTopic: string
  reviewItems: any[]
  timeSpent: number
}

interface RevisionModeInterfaceProps {
  session: RevisionSession
  onSessionUpdate: (session: RevisionSession) => void
}

export function RevisionModeInterface({ session, onSessionUpdate }: RevisionModeInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hint, setHint] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    generateRevisionQuestion()
  }, [])

  const generateRevisionQuestion = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/generate-revision-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          curriculum: session.curriculum,
          preferences: session.preferences,
          previousQuestions: session.reviewItems,
        }),
      })

      const data = await response.json()
      setCurrentQuestion(data.question)
      setHint(data.hint)
    } catch (error) {
      console.error("Error generating question:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          userAnswer,
          curriculum: session.curriculum,
        }),
      })

      const data = await response.json()
      setIsCorrect(data.isCorrect)
      setShowFeedback(true)

      // Update session
      const updatedSession = {
        ...session,
        questionsAnswered: session.questionsAnswered + 1,
        correctAnswers: session.correctAnswers + (data.isCorrect ? 1 : 0),
        progress: Math.min(100, session.progress + 10),
        reviewItems: [
          ...session.reviewItems,
          { question: currentQuestion, answer: userAnswer, correct: data.isCorrect },
        ],
      }
      onSessionUpdate(updatedSession)
    } catch (error) {
      console.error("Error checking answer:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextQuestion = () => {
    setUserAnswer("")
    setShowFeedback(false)
    setIsCorrect(false)
    generateRevisionQuestion()
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Revision Mode - {session.curriculum.subStrand}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{Math.floor(session.timeSpent / 60)} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{session.questionsAnswered} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>
                {Math.round((session.correctAnswers / Math.max(session.questionsAnswered, 1)) * 100)}% accuracy
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{session.progress}%</span>
            </div>
            <Progress value={session.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Review Question
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Generating personalized question...</p>
            </div>
          ) : currentQuestion ? (
            <>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium mb-2">{currentQuestion.title}</h3>
                <p className="text-sm">{currentQuestion.content}</p>
                {currentQuestion.image && (
                  <img
                    src={currentQuestion.image || "/placeholder.svg"}
                    alt="Question illustration"
                    className="mt-2 rounded"
                  />
                )}
              </div>

              {!showFeedback ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSubmitAnswer} disabled={!userAnswer.trim() || isLoading}>
                      Submit Answer
                    </Button>
                    <Button variant="outline" onClick={() => setHint(hint)}>
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Show Hint
                    </Button>
                  </div>
                  {hint && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Lightbulb className="h-4 w-4" />
                        <span className="font-medium">Hint:</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">{hint}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                        {isCorrect ? "Correct!" : "Not quite right"}
                      </span>
                    </div>
                    <p className={`text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                      {currentQuestion.feedback}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Explanation:</h4>
                    <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
                  </div>

                  <Button onClick={handleNextQuestion} className="w-full">
                    Continue Revision
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p>Loading question...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Revision Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{session.questionsAnswered}</div>
              <div className="text-sm text-muted-foreground">Questions Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{session.correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((session.correctAnswers / Math.max(session.questionsAnswered, 1)) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{session.progress}%</div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
