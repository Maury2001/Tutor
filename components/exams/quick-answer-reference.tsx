"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface Question {
  id: string
  type: "multiple-choice" | "short-answer" | "essay" | "true-false"
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  difficulty: "easy" | "medium" | "hard"
}

interface QuickAnswerReferenceProps {
  questions: Question[]
}

export function QuickAnswerReference({ questions }: QuickAnswerReferenceProps) {
  const getQuickAnswer = (question: Question) => {
    if (question.type === "multiple-choice" && typeof question.correctAnswer === "number") {
      return String.fromCharCode(65 + question.correctAnswer)
    }
    if (question.type === "true-false") {
      return question.correctAnswer === "true" ? "T" : "F"
    }
    return "See detailed key"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Quick Answer Reference
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className={`text-center p-3 rounded-lg border ${
                question.type === "multiple-choice" || question.type === "true-false"
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="font-bold text-lg">{index + 1}</div>
              <div className="text-sm font-medium">{getQuickAnswer(question)}</div>
              <Badge variant="outline" className="text-xs mt-1">
                {question.points}pt
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-600">
          <p>T = True, F = False, A/B/C/D = Multiple choice answers</p>
          <p>"See detailed key" = Open-ended questions requiring manual grading</p>
        </div>
      </CardContent>
    </Card>
  )
}
