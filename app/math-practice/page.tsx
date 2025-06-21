"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Minus, X, Divide, Trophy, Clock, CheckCircle, RotateCcw, Home } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

interface MathProblem {
  id: number
  question: string
  answer: number
  options: number[]
  operation: string
  difficulty: number
}

interface PracticeSession {
  operation: string
  score: number
  totalQuestions: number
  timeSpent: number
  accuracy: number
}

export default function MathPracticePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null)
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<number>(0)
  const [difficulty, setDifficulty] = useState(1)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      endPractice()
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  // Load saved progress
  useEffect(() => {
    if (user) {
      const savedBestStreak = localStorage.getItem(`math-best-streak-${user.id}`)
      if (savedBestStreak) {
        setBestStreak(Number.parseInt(savedBestStreak))
      }
    }
  }, [user])

  const generateProblem = useCallback((operation: string, difficultyLevel = 1): MathProblem => {
    let num1: number, num2: number, answer: number, question: string
    const maxNum = Math.min(10 + difficultyLevel * 10, 100)

    switch (operation) {
      case "addition":
        num1 = Math.floor(Math.random() * maxNum) + 1
        num2 = Math.floor(Math.random() * maxNum) + 1
        answer = num1 + num2
        question = `${num1} + ${num2} = ?`
        break
      case "subtraction":
        num1 = Math.floor(Math.random() * maxNum) + Math.max(20, difficultyLevel * 5)
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1
        answer = num1 - num2
        question = `${num1} - ${num2} = ?`
        break
      case "multiplication":
        const maxMult = Math.min(12, 6 + difficultyLevel)
        num1 = Math.floor(Math.random() * maxMult) + 1
        num2 = Math.floor(Math.random() * maxMult) + 1
        answer = num1 * num2
        question = `${num1} × ${num2} = ?`
        break
      case "division":
        num2 = Math.floor(Math.random() * Math.min(10, 3 + difficultyLevel)) + 2
        answer = Math.floor(Math.random() * Math.min(10, 5 + difficultyLevel)) + 1
        num1 = num2 * answer
        question = `${num1} ÷ ${num2} = ?`
        break
      default:
        num1 = 1
        num2 = 1
        answer = 2
        question = "1 + 1 = ?"
    }

    // Generate wrong options
    const options = [answer]
    const range = Math.max(5, Math.floor(answer * 0.3))

    while (options.length < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * (range * 2)) - range
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer)
      }
    }

    return {
      id: Date.now(),
      question,
      answer,
      options: options.sort(() => Math.random() - 0.5),
      operation,
      difficulty: difficultyLevel,
    }
  }, [])

  const startPractice = (operation: string) => {
    setSelectedOperation(operation)
    setCurrentProblem(generateProblem(operation, difficulty))
    setScore(0)
    setTotalQuestions(0)
    setTimeLeft(60)
    setIsActive(true)
    setShowResult(false)
    setSessionStartTime(Date.now())
    setStreak(0)
  }

  const handleAnswer = async (selectedAnswer: number) => {
    if (!currentProblem || showResult) return

    setUserAnswer(selectedAnswer)
    setTotalQuestions((prev) => prev + 1)

    const isCorrect = selectedAnswer === currentProblem.answer

    if (isCorrect) {
      setScore((prev) => prev + 1)
      setStreak((prev) => {
        const newStreak = prev + 1
        if (newStreak > bestStreak) {
          setBestStreak(newStreak)
          if (user) {
            localStorage.setItem(`math-best-streak-${user.id}`, newStreak.toString())
          }
        }
        return newStreak
      })

      // Increase difficulty after 3 correct answers in a row
      if (streak > 0 && (streak + 1) % 3 === 0) {
        setDifficulty((prev) => Math.min(prev + 1, 5))
      }
    } else {
      setStreak(0)
      // Decrease difficulty after wrong answer
      setDifficulty((prev) => Math.max(prev - 1, 1))
    }

    setShowResult(true)

    // Save progress to API
    try {
      await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          activity: "math_practice",
          operation: currentProblem.operation,
          correct: isCorrect,
          difficulty: currentProblem.difficulty,
          timeSpent: 1,
        }),
      })
    } catch (error) {
      console.error("Failed to save progress:", error)
    }

    setTimeout(() => {
      if (selectedOperation && isActive) {
        setCurrentProblem(generateProblem(selectedOperation, difficulty))
        setUserAnswer(null)
        setShowResult(false)
      }
    }, 1500)
  }

  const endPractice = async () => {
    setIsActive(false)
    const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000)
    const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0

    const session: PracticeSession = {
      operation: selectedOperation || "",
      score,
      totalQuestions,
      timeSpent,
      accuracy,
    }

    // Save session to localStorage
    if (user) {
      const sessions = JSON.parse(localStorage.getItem(`math-sessions-${user.id}`) || "[]")
      sessions.push({ ...session, date: new Date().toISOString() })
      localStorage.setItem(`math-sessions-${user.id}`, JSON.stringify(sessions.slice(-10))) // Keep last 10 sessions
    }

    setCurrentProblem(null)
  }

  const resetPractice = () => {
    setSelectedOperation(null)
    setCurrentProblem(null)
    setUserAnswer(null)
    setScore(0)
    setTotalQuestions(0)
    setShowResult(false)
    setTimeLeft(60)
    setIsActive(false)
    setDifficulty(1)
    setStreak(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Please log in to practice math.</p>
          <Button onClick={() => router.push("/auth/signin")} className="mt-4">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Math Practice</h1>
              <p className="text-gray-600">Interactive mathematics exercises and problem solving</p>
            </div>
          </div>
          {isActive && (
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-100 text-red-800">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeLeft)}
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                Score: {score}/{totalQuestions}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">Streak: {streak}</Badge>
              <Badge className="bg-purple-100 text-purple-800">Level: {difficulty}</Badge>
            </div>
          )}
        </div>

        {!selectedOperation ? (
          /* Operation Selection */
          <div className="space-y-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Choose Your Practice Mode</CardTitle>
                <CardDescription>
                  Select a mathematical operation to practice. Difficulty adapts to your performance!
                </CardDescription>
                {bestStreak > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800 mx-auto">Best Streak: {bestStreak}</Badge>
                )}
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => startPractice("addition")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Addition</CardTitle>
                  <CardDescription>Practice adding numbers together</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Practice</Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => startPractice("subtraction")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Minus className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle>Subtraction</CardTitle>
                  <CardDescription>Practice subtracting numbers</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-red-600 hover:bg-red-700">Start Practice</Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => startPractice("multiplication")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <X className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Multiplication</CardTitle>
                  <CardDescription>Practice multiplication tables</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Start Practice</Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => startPractice("division")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Divide className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Division</CardTitle>
                  <CardDescription>Practice division problems</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Practice</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : currentProblem ? (
          /* Practice Session */
          <div className="space-y-8">
            <Card className="text-center border-2 border-blue-200">
              <CardHeader>
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <Badge className="bg-blue-100 text-blue-800">
                    {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800">Level {difficulty}</Badge>
                </div>
                <CardTitle className="text-5xl font-bold text-blue-600 mb-4">{currentProblem.question}</CardTitle>
                {streak > 0 && <Badge className="bg-yellow-100 text-yellow-800">🔥 {streak} in a row!</Badge>}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {currentProblem.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        showResult
                          ? option === currentProblem.answer
                            ? "default"
                            : option === userAnswer
                              ? "destructive"
                              : "outline"
                          : "outline"
                      }
                      className="h-16 text-xl font-semibold transition-all hover:scale-105"
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                    >
                      {option}
                      {showResult && option === currentProblem.answer && <CheckCircle className="h-5 w-5 ml-2" />}
                    </Button>
                  ))}
                </div>

                {showResult && (
                  <div className="mt-6">
                    <Badge
                      className={
                        userAnswer === currentProblem.answer
                          ? "bg-green-100 text-green-800 text-lg px-4 py-2"
                          : "bg-red-100 text-red-800 text-lg px-4 py-2"
                      }
                    >
                      {userAnswer === currentProblem.answer
                        ? "🎉 Correct!"
                        : `❌ Incorrect - Answer: ${currentProblem.answer}`}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={resetPractice}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Change Operation
              </Button>
              <Button variant="outline" onClick={endPractice}>
                <Trophy className="h-4 w-4 mr-2" />
                End Practice
              </Button>
            </div>
          </div>
        ) : (
          /* Results */
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl">Practice Complete!</CardTitle>
              <CardDescription className="text-lg">Great job on your math practice session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">
                      {score}/{totalQuestions}
                    </div>
                    <p className="text-sm text-gray-600">Questions Correct</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">
                      {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
                    </div>
                    <p className="text-sm text-gray-600">Accuracy</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">{bestStreak}</div>
                    <p className="text-sm text-gray-600">Best Streak</p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mt-8">
                  <Button onClick={() => selectedOperation && startPractice(selectedOperation)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Practice Again
                  </Button>
                  <Button variant="outline" onClick={resetPractice}>
                    Choose Different Operation
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
