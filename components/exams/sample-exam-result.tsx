"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, FileText, Users } from "lucide-react"

export function SampleExamResult() {
  const sampleQuestions = [
    {
      id: "q1",
      type: "multiple-choice",
      question: "What number comes after 47?",
      options: ["46", "48", "49", "50"],
      difficulty: "easy",
      points: 2,
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "Which number is greater: 73 or 37?",
      options: ["73", "37", "They are equal", "Cannot tell"],
      difficulty: "easy",
      points: 2,
    },
    {
      id: "q3",
      type: "true-false",
      question: "The number 24 is an even number.",
      difficulty: "easy",
      points: 1,
    },
    {
      id: "q4",
      type: "short-answer",
      question: "Write the number that is 10 more than 65.",
      difficulty: "medium",
      points: 3,
    },
    {
      id: "q5",
      type: "essay",
      question: "Explain the difference between odd and even numbers. Give three examples of each.",
      difficulty: "hard",
      points: 10,
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">Exam Generated Successfully!</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm">18 Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm">45 Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Grade 3</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Mathematics</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Generated Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sampleQuestions.map((question, index) => (
            <div key={question.id} className="space-y-3 border-b pb-4 last:border-b-0">
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

              {question.type === "multiple-choice" && "options" in question && (
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
                      <div className="border-b border-gray-300 w-full h-8 mt-2" />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
