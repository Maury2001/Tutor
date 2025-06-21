"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Eye, Microscope, Download, Save, Plus } from "lucide-react"

interface Observation {
  id: string
  timestamp: string
  specimen: string
  magnification: number
  observation: string
  sketches: string[]
  questions: string[]
}

interface ScientificNotebookProps {
  currentSpecimen: string
  magnification: number
  experimentTime: number
}

export function ScientificNotebook({ currentSpecimen, magnification, experimentTime }: ScientificNotebookProps) {
  const [observations, setObservations] = useState<Observation[]>([])
  const [currentObservation, setCurrentObservation] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [hypothesis, setHypothesis] = useState("")
  const [conclusion, setConclustion] = useState("")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const addObservation = () => {
    if (!currentObservation.trim()) return

    const newObservation: Observation = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      specimen: currentSpecimen,
      magnification,
      observation: currentObservation,
      sketches: [],
      questions: currentQuestion ? [currentQuestion] : [],
    }

    setObservations((prev) => [...prev, newObservation])
    setCurrentObservation("")
    setCurrentQuestion("")
  }

  const specimenNames = {
    "plant-parts": "Plant Cell",
    "animal-cells": "Animal Cell",
  }

  const generateLabReport = () => {
    const report = `
VIRTUAL MICROSCOPY LAB REPORT
============================
Date: ${new Date().toLocaleDateString()}
Total Experiment Time: ${formatTime(experimentTime)}
Student: [Your Name]
Grade: 4-6 CBC Science

HYPOTHESIS:
${hypothesis || "What do you think you will observe?"}

MATERIALS:
- Virtual Microscope
- Plant cell specimen
- Animal cell specimen
- Magnification: 40x - 1000x

PROCEDURE:
1. Prepared virtual specimens
2. Observed at various magnifications
3. Recorded detailed observations
4. Compared plant and animal cells

OBSERVATIONS:
${observations
  .map(
    (obs, index) => `
${index + 1}. Time: ${obs.timestamp}
   Specimen: ${specimenNames[obs.specimen as keyof typeof specimenNames]}
   Magnification: ${obs.magnification}x
   Observation: ${obs.observation}
   ${obs.questions.length > 0 ? `Questions: ${obs.questions.join(", ")}` : ""}
`,
  )
  .join("")}

CONCLUSION:
${conclusion || "What did you learn from this experiment?"}

QUESTIONS FOR FURTHER INVESTIGATION:
${observations.flatMap((obs) => obs.questions).join("\n")}
`

    // Create downloadable file
    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `microscopy-lab-report-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4" />
          Scientific Laboratory Notebook
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="observations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="observations">Observations</TabsTrigger>
            <TabsTrigger value="hypothesis">Hypothesis</TabsTrigger>
            <TabsTrigger value="report">Lab Report</TabsTrigger>
          </TabsList>

          <TabsContent value="observations" className="space-y-4">
            {/* Current Status */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 text-xs font-medium mb-2">
                <Eye className="h-3 w-3" />
                Current Observation
              </div>
              <div className="text-xs space-y-1">
                <div>Specimen: {specimenNames[currentSpecimen as keyof typeof specimenNames]}</div>
                <div>Magnification: {magnification}x</div>
                <div>Time: {formatTime(experimentTime)}</div>
              </div>
            </div>

            {/* Add New Observation */}
            <div className="space-y-2">
              <label className="text-sm font-medium">What do you observe?</label>
              <Textarea
                value={currentObservation}
                onChange={(e) => setCurrentObservation(e.target.value)}
                placeholder="Describe what you see in detail... (e.g., 'I can see green oval structures moving slowly around the cell. They appear to be chloroplasts...')"
                className="text-sm"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Questions that arise:</label>
              <Input
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                placeholder="What questions do you have? (e.g., 'Why do the chloroplasts move?')"
                className="text-sm"
              />
            </div>

            <Button onClick={addObservation} disabled={!currentObservation.trim()} size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Record Observation
            </Button>

            {/* Previous Observations */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <h4 className="text-sm font-medium">Previous Observations ({observations.length})</h4>
              {observations.map((obs, index) => (
                <div key={obs.id} className="bg-gray-50 p-3 rounded border text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-gray-600">{obs.timestamp}</span>
                    <Badge variant="secondary" className="text-xs">
                      {specimenNames[obs.specimen as keyof typeof specimenNames]} - {obs.magnification}x
                    </Badge>
                  </div>
                  <p className="text-gray-800">{obs.observation}</p>
                  {obs.questions.length > 0 && (
                    <div className="text-blue-600">
                      <strong>Question:</strong> {obs.questions.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hypothesis" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Hypothesis</label>
              <Textarea
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                placeholder="What do you think you will observe? What differences do you expect between plant and animal cells?"
                className="text-sm"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Conclusion</label>
              <Textarea
                value={conclusion}
                onChange={(e) => setConclustion(e.target.value)}
                placeholder="What did you learn? How did your observations compare to your hypothesis?"
                className="text-sm"
                rows={3}
              />
            </div>

            <Button size="sm" variant="outline" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Hypothesis & Conclusion
            </Button>
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700 text-xs font-medium mb-2">
                <Microscope className="h-3 w-3" />
                Lab Report Summary
              </div>
              <div className="text-xs space-y-1">
                <div>Total Observations: {observations.length}</div>
                <div>Experiment Duration: {formatTime(experimentTime)}</div>
                <div>Specimens Studied: {new Set(observations.map((obs) => obs.specimen)).size}</div>
                <div>Questions Generated: {observations.flatMap((obs) => obs.questions).length}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Scientific Method Checklist:</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={hypothesis.length > 0} readOnly />
                  <span>Hypothesis recorded</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={observations.length > 0} readOnly />
                  <span>Observations documented</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={observations.flatMap((obs) => obs.questions).length > 0} readOnly />
                  <span>Questions formulated</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={conclusion.length > 0} readOnly />
                  <span>Conclusion written</span>
                </div>
              </div>
            </div>

            <Button onClick={generateLabReport} size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Complete Lab Report
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
