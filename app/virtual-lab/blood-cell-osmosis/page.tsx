"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BloodCellAnimation } from "@/components/virtual-lab/blood-cell-animation"
import { AIGuidancePanel } from "@/components/virtual-lab/ai-guidance-panel"
import { ScientificNotebook } from "@/components/virtual-lab/scientific-notebook"
import { Play, Pause, RotateCcw, Beaker, Droplets, Heart, AlertTriangle, BookOpen, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ExperimentState {
  isRunning: boolean
  timeElapsed: number
  solutionConcentration: number
  cellStates: {
    normal: number
    crenated: number
    hemolyzed: number
  }
  observations: string[]
  currentStep: number
}

export default function BloodCellOsmosisPage() {
  const [experimentState, setExperimentState] = useState<ExperimentState>({
    isRunning: false,
    timeElapsed: 0,
    solutionConcentration: 0.9, // Normal saline
    cellStates: { normal: 25, crenated: 0, hemolyzed: 0 },
    observations: [],
    currentStep: 0,
  })

  const [selectedScenario, setSelectedScenario] = useState<string>("normal-saline")

  // Predefined scenarios
  const scenarios = {
    "distilled-water": { concentration: 0.0, name: "Distilled Water", danger: "high" },
    hypotonic: { concentration: 0.3, name: "Hypotonic Solution", danger: "medium" },
    "normal-saline": { concentration: 0.9, name: "Normal Saline (0.9%)", danger: "none" },
    hypertonic: { concentration: 1.5, name: "Hypertonic Solution", danger: "medium" },
    "very-hypertonic": { concentration: 3.0, name: "Very Hypertonic (3%)", danger: "high" },
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (experimentState.isRunning) {
      interval = setInterval(() => {
        setExperimentState((prev) => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [experimentState.isRunning])

  const startExperiment = () => {
    setExperimentState((prev) => ({ ...prev, isRunning: true }))
  }

  const pauseExperiment = () => {
    setExperimentState((prev) => ({ ...prev, isRunning: false }))
  }

  const resetExperiment = () => {
    setExperimentState({
      isRunning: false,
      timeElapsed: 0,
      solutionConcentration: 0.9,
      cellStates: { normal: 25, crenated: 0, hemolyzed: 0 },
      observations: [],
      currentStep: 0,
    })
  }

  const handleScenarioChange = (scenarioKey: string) => {
    setSelectedScenario(scenarioKey)
    const scenario = scenarios[scenarioKey as keyof typeof scenarios]
    setExperimentState((prev) => ({
      ...prev,
      solutionConcentration: scenario.concentration,
      isRunning: false,
    }))
  }

  const handleConcentrationChange = (value: number[]) => {
    setExperimentState((prev) => ({
      ...prev,
      solutionConcentration: value[0],
    }))
  }

  const addObservation = (observation: string) => {
    const timestamp = `${Math.floor(experimentState.timeElapsed / 60)}:${(experimentState.timeElapsed % 60)
      .toString()
      .padStart(2, "0")}`
    setExperimentState((prev) => ({
      ...prev,
      observations: [...prev.observations, `${timestamp} - ${observation}`],
    }))
  }

  const handleCellStateChange = (cellStates: { normal: number; crenated: number; hemolyzed: number }) => {
    setExperimentState((prev) => ({
      ...prev,
      cellStates,
    }))
  }

  const getSolutionType = (concentration: number) => {
    if (concentration < 0.8) return "Hypotonic"
    if (concentration <= 1.1) return "Isotonic"
    return "Hypertonic"
  }

  const getDangerLevel = (concentration: number) => {
    if (concentration < 0.3 || concentration > 2.0) return "high"
    if (concentration < 0.7 || concentration > 1.3) return "medium"
    return "none"
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Link href="/virtual-lab">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Virtual Lab
          </Button>
        </Link>
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Heart className="h-8 w-8 text-red-600" />
          Blood Cell Osmosis Laboratory
        </h1>
        <p className="text-gray-600">Grade 9 CBC - Understanding Osmosis in Human Blood Cells</p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline">Grade 9</Badge>
          <Badge variant="outline">Human Biology</Badge>
          <Badge variant="outline">Medical Applications</Badge>
        </div>
      </div>

      {/* Experiment Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Beaker className="h-5 w-5" />
              Blood Cell Osmosis Experiment
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={experimentState.isRunning ? pauseExperiment : startExperiment}
                variant={experimentState.isRunning ? "secondary" : "default"}
              >
                {experimentState.isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button onClick={resetExperiment} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scenario Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Select Medical Scenario:</label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {Object.entries(scenarios).map(([key, scenario]) => (
                <Button
                  key={key}
                  onClick={() => handleScenarioChange(key)}
                  variant={selectedScenario === key ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    scenario.danger === "high"
                      ? "border-red-500 text-red-700"
                      : scenario.danger === "medium"
                        ? "border-yellow-500 text-yellow-700"
                        : "border-green-500 text-green-700"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">{scenario.name}</div>
                    <div className="text-xs opacity-75">{scenario.concentration}% NaCl</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Manual Concentration Control */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Manual Concentration Control: {experimentState.solutionConcentration.toFixed(1)}% NaCl
            </label>
            <Slider
              value={[experimentState.solutionConcentration]}
              onValueChange={handleConcentrationChange}
              max={3.0}
              min={0.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0% (Pure Water)</span>
              <span>0.9% (Normal Saline)</span>
              <span>3% (Very Hypertonic)</span>
            </div>
          </div>

          {/* Current Status */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-600" />
              <span className="text-sm">
                Solution: <strong>{getSolutionType(experimentState.solutionConcentration)}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm">
                Time: {Math.floor(experimentState.timeElapsed / 60)}:
                {(experimentState.timeElapsed % 60).toString().padStart(2, "0")}
              </span>
            </div>
            {getDangerLevel(experimentState.solutionConcentration) !== "none" && (
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={`h-4 w-4 ${
                    getDangerLevel(experimentState.solutionConcentration) === "high"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    getDangerLevel(experimentState.solutionConcentration) === "high"
                      ? "text-red-700"
                      : "text-yellow-700"
                  }`}
                >
                  {getDangerLevel(experimentState.solutionConcentration) === "high" ? "Dangerous" : "Caution"}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Animation Area */}
        <div className="lg:col-span-2 space-y-6">
          <BloodCellAnimation
            solutionConcentration={experimentState.solutionConcentration}
            isRunning={experimentState.isRunning}
            onStateChange={handleCellStateChange}
          />

          {/* Quick Observations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => addObservation("Cells appear normal and healthy")} variant="outline" size="sm">
                  Normal Cells
                </Button>
                <Button
                  onClick={() => addObservation("Cells are swelling and becoming spherical")}
                  variant="outline"
                  size="sm"
                >
                  Cell Swelling
                </Button>
                <Button
                  onClick={() => addObservation("Cells are bursting (hemolysis observed)")}
                  variant="outline"
                  size="sm"
                >
                  Hemolysis
                </Button>
                <Button
                  onClick={() => addObservation("Cells are shrinking and becoming spiky")}
                  variant="outline"
                  size="sm"
                >
                  Crenation
                </Button>
                <Button onClick={() => addObservation("No significant changes observed")} variant="outline" size="sm">
                  No Change
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Experiment Tabs */}
          <Tabs defaultValue="data" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="data">Live Data</TabsTrigger>
              <TabsTrigger value="theory">Theory</TabsTrigger>
              <TabsTrigger value="medical">Medical Applications</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Cell Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">{experimentState.cellStates.normal}</div>
                      <div className="text-sm text-green-700">Normal Cells</div>
                      <div className="text-xs text-gray-600 mt-1">Healthy biconcave shape</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg border">
                      <div className="text-2xl font-bold text-yellow-600">{experimentState.cellStates.crenated}</div>
                      <div className="text-sm text-yellow-700">Crenated Cells</div>
                      <div className="text-xs text-gray-600 mt-1">Shrunken with spikes</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border">
                      <div className="text-2xl font-bold text-red-600">{experimentState.cellStates.hemolyzed}</div>
                      <div className="text-sm text-red-700">Hemolyzed Cells</div>
                      <div className="text-xs text-gray-600 mt-1">Burst and fragmented</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Current Observations:</h4>
                    {experimentState.observations.length === 0 ? (
                      <p className="text-gray-500 italic">No observations recorded yet.</p>
                    ) : (
                      experimentState.observations.map((obs, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded border-l-4 border-blue-500 text-sm">
                          {obs}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Osmosis in Blood Cells - Theory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Concepts:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>
                        <strong>Osmosis:</strong> Movement of water across cell membranes
                      </li>
                      <li>
                        <strong>Isotonic Solution:</strong> Same concentration as blood (0.9% NaCl)
                      </li>
                      <li>
                        <strong>Hypotonic Solution:</strong> Lower concentration than blood (causes swelling)
                      </li>
                      <li>
                        <strong>Hypertonic Solution:</strong> Higher concentration than blood (causes shrinking)
                      </li>
                      <li>
                        <strong>Hemolysis:</strong> Cell bursting due to excessive water intake
                      </li>
                      <li>
                        <strong>Crenation:</strong> Cell shrinking and becoming spiky
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Why This Happens:</h4>
                    <p className="text-sm text-gray-700">
                      Red blood cells have flexible membranes that allow water to pass through freely. When placed in
                      solutions with different salt concentrations, water moves to equalize the concentration on both
                      sides of the membrane. This can cause the cells to swell, shrink, or even burst.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Normal Saline (0.9% NaCl):</h4>
                    <p className="text-sm text-gray-700">
                      This concentration matches the osmotic pressure of blood plasma, so cells maintain their normal
                      shape and function. This is why medical IV fluids use this concentration.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    Medical Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-800">Intravenous (IV) Therapy:</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      IV fluids must be isotonic (0.9% saline) to prevent damage to blood cells. Using pure water would
                      cause massive hemolysis and could be fatal.
                    </p>
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <p className="text-xs text-blue-800">
                        <strong>Clinical Note:</strong> Normal saline is the most commonly used IV fluid because it
                        matches blood osmolarity and doesn't cause cell damage.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-green-800">Blood Storage & Transfusion:</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Blood banks store blood in special solutions that maintain cell integrity. Understanding osmosis
                      is crucial for preserving blood cells during storage.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-purple-800">Diagnostic Testing:</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      The osmotic fragility test uses hypotonic solutions to test how easily red blood cells break. This
                      helps diagnose certain blood disorders.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-orange-800">Dehydration Treatment:</h4>
                    <p className="text-sm text-gray-700">
                      When treating severe dehydration, doctors must carefully balance fluid replacement to avoid rapid
                      changes in blood osmolarity that could damage cells.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Blood Cell Osmosis Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-semibold mb-2 text-blue-800">Question 1: Medical Emergency (5 marks)</h4>
                    <p className="mb-3 text-sm">
                      A patient arrives at the hospital severely dehydrated. A new nurse accidentally gives the patient
                      pure water instead of normal saline through an IV. Predict what would happen to the patient's
                      blood cells and explain why this is dangerous.
                    </p>
                    <textarea
                      className="w-full p-3 border rounded resize-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Explain the osmotic effects and medical consequences..."
                    />
                  </div>

                  <div className="p-4 border rounded-lg bg-green-50">
                    <h4 className="font-semibold mb-2 text-green-800">Question 2: Solution Comparison (4 marks)</h4>
                    <p className="mb-3 text-sm">
                      Compare the effects of placing blood cells in:
                      <br />• 0.3% NaCl solution
                      <br />• 0.9% NaCl solution
                      <br />• 2.0% NaCl solution
                    </p>
                    <textarea
                      className="w-full p-3 border rounded resize-none focus:ring-2 focus:ring-green-500"
                      rows={4}
                      placeholder="Describe cell behavior in each solution and explain the mechanisms..."
                    />
                  </div>

                  <div className="p-4 border rounded-lg bg-purple-50">
                    <h4 className="font-semibold mb-2 text-purple-800">Question 3: Real-World Application (4 marks)</h4>
                    <p className="mb-3 text-sm">
                      Why do doctors use 0.9% saline solution for IV therapy instead of pure water? What would happen if
                      they used a 3% salt solution instead?
                    </p>
                    <textarea
                      className="w-full p-3 border rounded resize-none focus:ring-2 focus:ring-purple-500"
                      rows={4}
                      placeholder="Explain the medical reasoning and potential consequences..."
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">Total: 13 marks | Time: 25 minutes</div>
                    <Button className="bg-red-600 hover:bg-red-700">Submit Assessment</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Guidance Panel */}
        <div className="space-y-6">
          <AIGuidancePanel
            experimentType="blood-cell-osmosis"
            gradeLevel="grade-9"
            currentStep={experimentState.currentStep}
            studentProgress={{
              completedSteps: [],
              currentObservations: experimentState.observations,
              challenges: [],
            }}
          />

          <ScientificNotebook
            experimentId="blood-cell-osmosis"
            observations={experimentState.observations}
            onAddObservation={addObservation}
          />
        </div>
      </div>
    </div>
  )
}
