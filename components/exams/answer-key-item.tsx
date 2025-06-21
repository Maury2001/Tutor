"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, BookOpen, PenTool } from "lucide-react"

interface Question {
  id: string
  type: "multiple-choice" | "short-answer" | "essay" | "true-false"
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  difficulty: "easy" | "medium" | "hard"
}

interface AnswerKeyItemProps {
  question: Question
  questionNumber: number
}

export function AnswerKeyItem({ question, questionNumber }: AnswerKeyItemProps) {
  const getCorrectAnswerDisplay = () => {
    if (question.type === "multiple-choice" && question.options && typeof question.correctAnswer === "number") {
      const correctLetter = String.fromCharCode(65 + question.correctAnswer)
      const correctOption = question.options[question.correctAnswer]
      return `${correctLetter}. ${correctOption}`
    }

    if (question.type === "true-false") {
      return question.correctAnswer === "true" ? "True" : "False"
    }

    return "See sample answer below"
  }

  const getSampleAnswer = () => {
    if (question.type === "short-answer") {
      // Generate sample answers based on question content
      if (question.question.toLowerCase().includes("convert") && question.question.toLowerCase().includes("kg")) {
        return "3.5 kg = 3.5 × 1000 = 3,500 grams"
      }
      if (question.question.toLowerCase().includes("simplest form") && question.question.includes("3/6")) {
        return "3/6 = 1/2 (divide both numerator and denominator by 3)"
      }
      if (question.question.toLowerCase().includes("least common multiple")) {
        return "LCM of 3 and 6 is 6 (multiples of 3: 3,6,9... multiples of 6: 6,12,18...)"
      }
      if (question.question.toLowerCase().includes("units") && question.question.toLowerCase().includes("length")) {
        return "Millimeter (mm), Centimeter (cm), Meter (m), Kilometer (km)"
      }
      if (question.question.toLowerCase().includes("round") && question.question.includes("3.456")) {
        return "3.456 rounded to the nearest hundredth is 3.46"
      }
      return "Sample answer would depend on the specific question content."
    }

    if (question.type === "essay") {
      if (question.question.toLowerCase().includes("perimeter and area")) {
        return `Sample Answer:
        
Perimeter is the distance around the outside of a shape, while area is the amount of space inside a shape.

Perimeter:
- Measured in linear units (cm, m, etc.)
- Formula for rectangle: P = 2(length + width)
- Real-life example: Fencing around a garden

Area:
- Measured in square units (cm², m², etc.)
- Formula for rectangle: A = length × width
- Real-life example: Carpet needed for a room

Key differences:
1. Perimeter measures the boundary, area measures the interior
2. Different units of measurement
3. Different formulas for calculation`
      }

      if (
        question.question.toLowerCase().includes("word problem") &&
        question.question.toLowerCase().includes("fractions")
      ) {
        return `Sample Answer:

Steps to solve fraction word problems:

1. Read the problem carefully and identify what is being asked
2. Identify the fractions involved
3. Determine the operation needed (add, subtract, multiply, divide)
4. Find common denominators if adding or subtracting
5. Perform the calculation
6. Simplify the answer if possible
7. Check if the answer makes sense

Example: "Sarah ate 1/4 of a pizza and John ate 1/3 of the same pizza. How much pizza was eaten in total?"

Solution:
- Need to add: 1/4 + 1/3
- Find common denominator: LCD of 4 and 3 is 12
- Convert: 1/4 = 3/12, 1/3 = 4/12
- Add: 3/12 + 4/12 = 7/12
- Answer: 7/12 of the pizza was eaten`
      }

      return "Sample essay answer would be provided based on the specific question requirements."
    }

    return null
  }

  const getMarkingCriteria = () => {
    if (question.type === "multiple-choice" || question.type === "true-false") {
      return `${question.points} points for correct answer, 0 points for incorrect answer`
    }

    if (question.type === "short-answer") {
      const fullPoints = question.points
      const partialPoints = Math.ceil(fullPoints * 0.6)
      return `${fullPoints} points for complete correct answer, ${partialPoints} points for partial credit with correct method, 0 points for incorrect answer`
    }

    if (question.type === "essay") {
      return `${question.points} points total:
      • Content accuracy and completeness (${Math.ceil(question.points * 0.4)} pts)
      • Use of examples and explanations (${Math.ceil(question.points * 0.3)} pts)
      • Organization and clarity (${Math.ceil(question.points * 0.2)} pts)
      • Grammar and presentation (${Math.ceil(question.points * 0.1)} pts)`
    }

    return ""
  }

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Question Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg">Question {questionNumber}</span>
                <Badge variant="outline">{question.type.replace("-", " ")}</Badge>
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
              <p className="text-gray-700 mb-3">{question.question}</p>
            </div>
          </div>

          {/* Question Options (for multiple choice) */}
          {question.type === "multiple-choice" && question.options && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Options:</h4>
              <div className="space-y-1">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 p-2 rounded ${
                      index === question.correctAnswer ? "bg-green-100 border border-green-300" : ""
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                    {index === question.correctAnswer && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Correct Answer */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-800">Correct Answer</h4>
            </div>
            <p className="text-green-700 font-medium">{getCorrectAnswerDisplay()}</p>
          </div>

          {/* Sample Answer (for open-ended questions) */}
          {(question.type === "short-answer" || question.type === "essay") && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                {question.type === "essay" ? (
                  <BookOpen className="h-5 w-5 text-blue-600" />
                ) : (
                  <PenTool className="h-5 w-5 text-blue-600" />
                )}
                <h4 className="font-medium text-blue-800">Sample Answer</h4>
              </div>
              <div className="text-blue-700 whitespace-pre-line">{getSampleAnswer()}</div>
            </div>
          )}

          {/* Marking Criteria */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <h4 className="font-medium text-orange-800">Marking Criteria</h4>
            </div>
            <div className="text-orange-700 text-sm whitespace-pre-line">{getMarkingCriteria()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
