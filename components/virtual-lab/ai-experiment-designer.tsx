"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Beaker, BookOpen, Target, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react"

interface ExperimentStep {
  stepNumber: number
  title: string
  description: string
  materials: string[]
  safetyNotes: string[]
  expectedOutcome: string
  troubleshooting: string[]
}

interface ExperimentDesign {
  title: string
  description: string
  learningObjectives: string[]
  cbcAlignment: {
    strand: string
    subStrand: string
    specificOutcomes: string[]
  }
  materials: string[]
  safetyPrecautions: string[]
  steps: ExperimentStep[]
  assessmentCriteria: string[]
  extensions: string[]
  realWorldApplications: string[]
}

interface ExperimentDesignResponse {
  success: boolean
  experimentDesign: ExperimentDesign
  designId: string
  timestamp: string
}

export function AIExperimentDesigner() {
  const [isLoading, setIsLoading] = useState(false)
  const [experimentDesign, setExperimentDesign] = useState<ExperimentDesign | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [topic, setTopic] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [learningObjectives, setLearningObjectives] = useState("")
  const [availableMaterials, setAvailableMaterials] = useState("")
  const [timeConstraints, setTimeConstraints] = useState("")
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [cbcStrand, setCbcStrand] = useState("")
  const [cbcSubStrand, setCbcSubStrand] = useState("")

  const handleDesignExperiment = async () => {
    if (!topic || !gradeLevel) {
      setError("Please provide both topic and grade level")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const requestData = {
        topic,
        gradeLevel,
        learningObjectives: learningObjectives.split("\n").filter((obj) => obj.trim()),
        availableMaterials: availableMaterials.split("\n").filter((mat) => mat.trim()),
        timeConstraints,
        difficulty,
        cbcStrand,
        cbcSubStrand,
      }

      const response = await fetch("/api/virtual-lab/experiment-designer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to design experiment")
      }

      const data: ExperimentDesignResponse = await response.json()

      if (data.success && data.experimentDesign) {
        setExperimentDesign(data.experimentDesign)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Error designing experiment:", err)
      setError(err instanceof Error ? err.message : "Failed to design experiment")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTopic("")
    setGradeLevel("")
    setLearningObjectives("")
    setAvailableMaterials("")
    setTimeConstraints("")
    setDifficulty("beginner")
    setCbcStrand("")
    setCbcSubStrand("")
    setExperimentDesign(null)
    setError(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">AI Experiment Designer</h1>
        <p className="text-gray-600">Create custom CBC-aligned virtual experiments with AI assistance</p>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            Experiment Design Parameters
          </CardTitle>
          <CardDescription>
            Provide details about your desired experiment and we'll create a comprehensive design
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Experiment Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., Plant vs Animal Cells, Atomic Structure, Forces and Motion"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Grade Level *</Label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grade 4-6">Grade 4-6 (Upper Primary)</SelectItem>
                  <SelectItem value="Grade 7-9">Grade 7-9 (Junior Secondary)</SelectItem>
                  <SelectItem value="Grade 10-12">Grade 10-12 (Senior Secondary)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={difficulty}
                onValueChange={(value: "beginner" | "intermediate" | "advanced") => setDifficulty(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeConstraints">Time Constraints</Label>
              <Input
                id="timeConstraints"
                placeholder="e.g., 45 minutes, 2 class periods"
                value={timeConstraints}
                onChange={(e) => setTimeConstraints(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cbcStrand">CBC Strand (Optional)</Label>
              <Input
                id="cbcStrand"
                placeholder="e.g., Living Things and Their Environment"
                value={cbcStrand}
                onChange={(e) => setCbcStrand(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cbcSubStrand">CBC Sub-Strand (Optional)</Label>
              <Input
                id="cbcSubStrand"
                placeholder="e.g., Cell Structure and Function"
                value={cbcSubStrand}
                onChange={(e) => setCbcSubStrand(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningObjectives">Learning Objectives (one per line)</Label>
            <Textarea
              id="learningObjectives"
              placeholder="e.g., Students will be able to identify cell organelles&#10;Students will compare plant and animal cells&#10;Students will understand cell function"
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableMaterials">Available Materials (one per line)</Label>
            <Textarea
              id="availableMaterials"
              placeholder="e.g., Virtual microscope&#10;Digital cell specimens&#10;Recording sheets&#10;Computers/tablets"
              value={availableMaterials}
              onChange={(e) => setAvailableMaterials(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleDesignExperiment} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Designing Experiment...
                </>
              ) : (
                <>
                  <Beaker className="mr-2 h-4 w-4" />
                  Design Experiment
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Experiment Design Results */}
      {experimentDesign && (
        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {experimentDesign.title}
              </CardTitle>
              <CardDescription>{experimentDesign.description}</CardDescription>
            </CardHeader>
          </Card>

          {/* CBC Alignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                CBC Curriculum Alignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Strand</Label>
                  <p className="text-sm text-gray-600">{experimentDesign.cbcAlignment.strand}</p>
                </div>
                <div>
                  <Label className="font-semibold">Sub-Strand</Label>
                  <p className="text-sm text-gray-600">{experimentDesign.cbcAlignment.subStrand}</p>
                </div>
              </div>
              <div className="mt-4">
                <Label className="font-semibold">Specific Learning Outcomes</Label>
                <ul className="mt-2 space-y-1">
                  {experimentDesign.cbcAlignment.specificOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {experimentDesign.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Materials and Safety */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Required Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {experimentDesign.materials.map((material, index) => (
                    <Badge key={index} variant="secondary">
                      {material}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Safety Precautions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {experimentDesign.safetyPrecautions.map((precaution, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      {precaution}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Experimental Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Experimental Procedure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {experimentDesign.steps.map((step, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.stepNumber}
                      </div>
                      <h4 className="font-semibold">{step.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <Label className="font-semibold text-xs">Materials Needed</Label>
                        <ul className="mt-1 space-y-1">
                          {step.materials.map((material, idx) => (
                            <li key={idx} className="text-gray-600">
                              • {material}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <Label className="font-semibold text-xs">Safety Notes</Label>
                        <ul className="mt-1 space-y-1">
                          {step.safetyNotes.map((note, idx) => (
                            <li key={idx} className="text-orange-600">
                              ⚠ {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <Label className="font-semibold text-xs">Expected Outcome</Label>
                        <p className="mt-1 text-green-600">{step.expectedOutcome}</p>
                      </div>

                      <div>
                        <Label className="font-semibold text-xs">Troubleshooting</Label>
                        <ul className="mt-1 space-y-1">
                          {step.troubleshooting.map((tip, idx) => (
                            <li key={idx} className="text-gray-600">
                              💡 {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment and Extensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {experimentDesign.assessmentCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {criteria}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Extension Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {experimentDesign.extensions.map((extension, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      {extension}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Real-World Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Real-World Applications in Kenya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experimentDesign.realWorldApplications.map((application, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-blue-800">{application}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
