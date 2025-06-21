"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trophy, Target, Clock, Star } from "lucide-react"

interface MasterySession {
  id: string
  curriculum: any
  preferences: any
  totalQuestions: number
  currentQuestion: number
  score: number
  timeLimit: number
  timeRemaining: number
  questions: any[]
  answers: any[]
  competencyLevels: any
}

interface MasteryCheckInterfaceProps {
  session: MasterySession
  onSessionUpdate: (session: MasterySession) => void
  onComplete: (results: any) => void
}

export function MasteryCheckInterface({ session, onSessionUpdate, onComplete }: MasteryCheckInterfaceProps) {
  const [currentQuestionData, setCurrentQuestionData] = useState<any>(null)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [textAnswer, setTextAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [timer, setTimer] = useState(session.timeRemaining)

  useEffect(() => {
    loadCurrentQuestion()
  }, [session.currentQuestion])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const loadCurrentQuestion = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/generate-mastery-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          curriculum: session.curriculum,
          preferences: session.preferences,
          questionNumber: session.currentQuestion,
          totalQuestions: session.totalQuestions,
          previousAnswers: session.answers,
        }),
      })

      const data = await response.json()
      setCurrentQuestionData(data.question)
      setSelectedAnswer("")
      setTextAnswer("")
    } catch (error) {
      console.error("Error loading question:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    const answer = currentQuestionData.type === "multiple-choice" ? selectedAnswer : textAnswer

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/evaluate-mastery-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestionData,
          answer,
          curriculum: session.curriculum,
        }),
      })

      const data = await response.json()

      const updatedAnswers = [
        ...session.answers,
        {
          questionId: currentQuestionData.id,
          answer,
          correct: data.isCorrect,
          score: data.score,
          feedback: data.feedback,
        },
      ]

      const updatedSession = {
        ...session,
        currentQuestion: session.currentQuestion + 1,
        score: session.score + (data.score || 0),
        answers: updatedAnswers,
        competencyLevels: { ...session.competencyLevels, ...data.competencyUpdate },
      }

      onSessionUpdate(updatedSession)

      if (updatedSession.currentQuestion >= session.totalQuestions) {
        handleAssessmentComplete(updatedSession)
      }
    } catch (error) {
      console.error("Error submitting answer:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTimeUp = () => {
    // Auto-submit current answer or mark as incomplete
    handleAssessmentComplete(session)
  }

  const handleAssessmentComplete = async (finalSession: MasterySession) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/generate-mastery-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: finalSession,
          curriculum: session.curriculum,
        }),
      })

      const results = await response.json()
      setShowResults(true)
      onComplete(results)
    } catch (error) {
      console.error("Error generating results:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = () => {
    return (session.currentQuestion / session.totalQuestions) * 100
  }

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Mastery Assessment Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">
              {Math.round((session.score / session.totalQuestions) * 100)}%
            </div>
            <p className="text-lg">Assessment completed successfully!</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{session.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {session.answers.filter((a) => a.correct).length}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{session.score}</div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatTime(session.timeLimit - timer)}</div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Assessment Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Mastery Assessment - {session.curriculum.subStrand}
          </CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline">
                Question {session.currentQuestion + 1} of {session.totalQuestions}
              </Badge>
              <Badge variant="secondary">Score: {session.score}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className={timer < 300 ? "text-red-600 font-bold" : ""}>{formatTime(timer)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Assessment Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading assessment question...</p>
            </div>
          ) : currentQuestionData ? (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{currentQuestionData.difficulty}</Badge>
                  <Badge variant="secondary">{currentQuestionData.competency}</Badge>
                </div>
                <h3 className="font-medium mb-2">{currentQuestionData.question}</h3>
                {currentQuestionData.context && (
                  <p className="text-sm text-muted-foreground">{currentQuestionData.context}</p>
                )}
                {currentQuestionData.image && (
                  <img
                    src={currentQuestionData.image || "/placeholder.svg"}
                    alt="Question illustration"
                    className="mt-2 rounded max-w-full"
                  />
                )}
              </div>

              {currentQuestionData.type === "multiple-choice" ? (
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  <div className="space-y-3">
                    {currentQuestionData.options.map((option: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="text-answer">Your Answer:</Label>
                  <Textarea
                    id="text-answer"
                    placeholder="Type your detailed answer here..."
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={
                    isLoading || (currentQuestionData.type === "multiple-choice" ? !selectedAnswer : !textAnswer.trim())
                  }
                  className="flex-1"
                >
                  {session.currentQuestion + 1 === session.totalQuestions ? "Complete Assessment" : "Next Question"}
                </Button>
                <Button variant="outline" onClick={() => setSelectedAnswer("")}>
                  Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Loading question...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competency Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Competency Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(session.competencyLevels).map(([competency, level]: [string, any]) => (
              <div key={competency} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{competency}</span>
                  <span>{level}%</span>
                </div>
                <Progress value={level} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {level >= 80 ? "Mastered" : level >= 60 ? "Developing" : "Needs Practice"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
