"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { AnswerKeyItem } from "./answer-key-item"

interface Question {
  id: string
  type: "multiple-choice" | "short-answer" | "essay" | "true-false"
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  difficulty: "easy" | "medium" | "hard"
}

interface AnswerKeyProps {
  title: string
  subject: string
  gradeLevel: string
  duration: number
  questions: Question[]
  onExport?: (format: "pdf") => void
  onPrint?: () => void
}

export function AnswerKey({ title, subject, gradeLevel, duration, questions, onExport, onPrint }: AnswerKeyProps) {
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

  const questionTypeStats = {
    multipleChoice: questions.filter((q) => q.type === "multiple-choice"),
    shortAnswer: questions.filter((q) => q.type === "short-answer"),
    essay: questions.filter((q) => q.type === "essay"),
    trueFalse: questions.filter((q) => q.type === "true-false"),
  }

  const difficultyStats = {
    easy: questions.filter((q) => q.difficulty === "easy").length,
    medium: questions.filter((q) => q.difficulty === "medium").length,
    hard: questions.filter((q) => q.difficulty === "hard").length,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Answer Key</CardTitle>
              <CardDescription className="text-lg mt-2">
                {title} • {subject} • {gradeLevel} • {duration} minutes
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {onPrint && (
                <Button variant="outline" onClick={onPrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              )}
              {onExport && (
                <Button variant="outline" onClick={() => onExport("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Exam Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-3">Question Distribution</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Multiple Choice:</span>
                  <Badge variant="outline">{questionTypeStats.multipleChoice.length} questions</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Short Answer:</span>
                  <Badge variant="outline">{questionTypeStats.shortAnswer.length} questions</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Essay:</span>
                  <Badge variant="outline">{questionTypeStats.essay.length} questions</Badge>
                </div>
                <div className="flex justify-between">
                  <span>True/False:</span>
                  <Badge variant="outline">{questionTypeStats.trueFalse.length} questions</Badge>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-3">Points Distribution</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Multiple Choice:</span>
                  <Badge variant="outline">
                    {questionTypeStats.multipleChoice.reduce((sum, q) => sum + q.points, 0)} pts
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Short Answer:</span>
                  <Badge variant="outline">
                    {questionTypeStats.shortAnswer.reduce((sum, q) => sum + q.points, 0)} pts
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Essay:</span>
                  <Badge variant="outline">{questionTypeStats.essay.reduce((sum, q) => sum + q.points, 0)} pts</Badge>
                </div>
                <div className="flex justify-between">
                  <span>True/False:</span>
                  <Badge variant="outline">
                    {questionTypeStats.trueFalse.reduce((sum, q) => sum + q.points, 0)} pts
                  </Badge>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total:</span>
                  <Badge>{totalPoints} pts</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Grading Guidelines */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-900 mb-3">General Grading Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
              <div>
                <h4 className="font-medium mb-2">Objective Questions:</h4>
                <ul className="space-y-1">
                  <li>• Multiple Choice: Full marks for correct answer only</li>
                  <li>• True/False: Full marks for correct answer only</li>
                  <li>• No partial credit for objective questions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Subjective Questions:</h4>
                <ul className="space-y-1">
                  <li>• Short Answer: Award partial marks for correct method</li>
                  <li>• Essay: Use detailed rubric provided for each question</li>
                  <li>• Consider student's reasoning and explanation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Grade Scale */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-900 mb-3">Suggested Grade Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-purple-800">
              <div className="text-center">
                <div className="font-bold">A</div>
                <div>{Math.round(totalPoints * 0.9)}+ pts (90%+)</div>
              </div>
              <div className="text-center">
                <div className="font-bold">B</div>
                <div>
                  {Math.round(totalPoints * 0.8)}-{Math.round(totalPoints * 0.89)} pts (80-89%)
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold">C</div>
                <div>
                  {Math.round(totalPoints * 0.7)}-{Math.round(totalPoints * 0.79)} pts (70-79%)
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold">D</div>
                <div>
                  {Math.round(totalPoints * 0.6)}-{Math.round(totalPoints * 0.69)} pts (60-69%)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Question Answers */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Detailed Answer Key</h2>
        {questions.map((question, index) => (
          <AnswerKeyItem key={question.id} question={question} questionNumber={index + 1} />
        ))}
      </div>
    </div>
  )
}
