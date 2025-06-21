"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Brain, Sparkles, Target, TrendingUp, Users } from "lucide-react"
import { GRADE_LEVELS, getStrands, getSubStrands, CBC_CURRICULUM } from "@/lib/cbc-curriculum"
import AdaptiveTutorInterface from "@/components/tutor/adaptive-tutor-interface"

export default function AdaptiveTutorPage() {
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [selectedLearningArea, setSelectedLearningArea] = useState<string>("")
  const [selectedStrand, setSelectedStrand] = useState<string>("")
  const [selectedSubStrand, setSelectedSubStrand] = useState("")
  const [studentId] = useState(() => `student_${Date.now()}`) // Generate unique student ID

  // Get available options based on selections
  const availableLearningAreas = selectedGrade ? CBC_CURRICULUM[selectedGrade as any] || [] : []
  const availableStrands =
    selectedGrade && selectedLearningArea ? getStrands(selectedGrade as any, selectedLearningArea) : []
  const availableSubStrands =
    selectedGrade && selectedLearningArea && selectedStrand
      ? getSubStrands(selectedGrade as any, selectedLearningArea, selectedStrand)
      : []

  const curriculumContext = {
    gradeLevel: selectedGrade,
    learningArea: selectedLearningArea,
    learningAreaName: availableLearningAreas.find((la) => la.id === selectedLearningArea)?.name || "",
    strand: selectedStrand,
    strandName: availableStrands.find((s) => s.id === selectedStrand)?.name || "",
    subStrand: selectedSubStrand,
    subStrandName: availableSubStrands.find((ss) => ss.id === selectedSubStrand)?.name || "",
  }

  const handleResponseUpdate = (data: any) => {
    console.log("Adaptive response data:", data)
    // Handle any updates from the adaptive tutor
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-700/20 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Adaptive AI Tutor</h1>
              <p className="text-purple-100 text-lg">Personalized learning that adapts to your performance and style</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="font-medium">AI-Powered</span>
              </div>
              <p className="text-sm text-purple-100 mt-1">Advanced AI adapts to your learning style</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-green-300" />
                <span className="font-medium">Personalized</span>
              </div>
              <p className="text-sm text-purple-100 mt-1">Tailored content for your skill level</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-blue-300" />
                <span className="font-medium">Adaptive</span>
              </div>
              <p className="text-sm text-purple-100 mt-1">Difficulty adjusts based on performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Context Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Learning Context
          </CardTitle>
          <CardDescription className="text-base">
            Select your grade and subject. The AI will adapt its teaching style based on your performance and learning
            patterns.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <Label htmlFor="grade" className="text-sm font-medium text-gray-700">
                Grade Level
              </Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_LEVELS.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade.toUpperCase().replace("GRADE", "Grade ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="learning-area" className="text-sm font-medium text-gray-700">
                Learning Area
              </Label>
              <Select value={selectedLearningArea} onValueChange={setSelectedLearningArea} disabled={!selectedGrade}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {availableLearningAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="strand" className="text-sm font-medium text-gray-700">
                Strand (Optional)
              </Label>
              <Select value={selectedStrand} onValueChange={setSelectedStrand} disabled={!selectedLearningArea}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select strand" />
                </SelectTrigger>
                <SelectContent>
                  {availableStrands.map((strand) => (
                    <SelectItem key={strand.id} value={strand.id}>
                      {strand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="sub-strand" className="text-sm font-medium text-gray-700">
                Sub-Strand (Optional)
              </Label>
              <Select value={selectedSubStrand} onValueChange={setSelectedSubStrand} disabled={!selectedStrand}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select sub-strand" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubStrands.map((subStrand) => (
                    <SelectItem key={subStrand.id} value={subStrand.id}>
                      {subStrand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedGrade && selectedLearningArea && (
            <div className="mt-6">
              <Alert className="border-blue-200 bg-blue-50">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Active Context:</strong> {selectedGrade.toUpperCase().replace("GRADE", "Grade ")} -{" "}
                  {curriculumContext.learningAreaName}
                  {curriculumContext.strandName && ` > ${curriculumContext.strandName}`}
                  {curriculumContext.subStrandName && ` > ${curriculumContext.subStrandName}`}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adaptive Tutor Interface */}
      {selectedGrade && selectedLearningArea && (
        <AdaptiveTutorInterface
          studentId={studentId}
          curriculumContext={curriculumContext}
          onResponseUpdate={handleResponseUpdate}
        />
      )}

      {/* How It Works */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">How Adaptive Learning Works</CardTitle>
          <CardDescription>
            Our AI-powered system continuously adapts to provide the most effective learning experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Performance Analysis</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The AI continuously analyzes your responses, accuracy, learning patterns, and time spent on different
                topics
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Content Adaptation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Based on your performance, the system adjusts difficulty, provides additional examples, or moves to
                advanced topics
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Personalized Support</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Receive customized explanations, hints, and learning strategies tailored to your unique learning style
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border">
            <h4 className="font-semibold text-lg mb-4 text-gray-900">Advanced Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Real-time Difficulty Adjustment</p>
                  <p className="text-sm text-gray-600">Questions become easier or harder based on your performance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Learning Style Recognition</p>
                  <p className="text-sm text-gray-600">
                    Adapts to visual, auditory, or kinesthetic learning preferences
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Progress Tracking</p>
                  <p className="text-sm text-gray-600">Detailed analytics on your learning journey and improvements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Curriculum Alignment</p>
                  <p className="text-sm text-gray-600">
                    Perfectly aligned with CBC curriculum standards and objectives
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
