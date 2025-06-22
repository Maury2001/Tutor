"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIGuidancePanel } from "@/components/virtual-lab/ai-guidance-panel"
import { ScientificNotebook } from "@/components/virtual-lab/scientific-notebook"
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Beaker, Eye, Target, BookOpen, Lightbulb } from "lucide-react"
import Link from "next/link"

interface OsmosisExperiment {
  id: string
  name: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  cbcAlignment: string[]
  learningOutcomes: string[]
}

interface ExperimentState {
  isRunning: boolean
  currentStep: number
  timeElapsed: number
  observations: string[]
  waterMovement: number
  concentration: {
    inside: number
    outside: number
  }
  cellSize: number
  completed: boolean
}

const OSMOSIS_EXPERIMENTS: OsmosisExperiment[] = [
  {
    id: "potato-osmosis",
    name: "Potato Cell Osmosis Investigation",
    description: "Investigate water movement in potato cells using different salt solutions",
    difficulty: "beginner",
    duration: "45 minutes",
    cbcAlignment: [
      "Grade 9 - Living Things and Their Environment",
      "Cell Structure and Function",
      "Transport in Plants",
    ],
    learningOutcomes: [
      "Observe osmosis in plant cells",
      "Understand hypotonic and hypertonic solutions",
      "Explain water movement across cell membranes",
    ],
  },
  {
    id: "egg-membrane-osmosis",
    name: "Blood Cell Osmosis Study",
    description: "Observe how blood cells respond to different saline concentrations",
    difficulty: "intermediate",
    duration: "60 minutes",
    cbcAlignment: ["Grade 9 - Cell Biology", "Membrane Transport", "Human Biology"],
    learningOutcomes: [
      "Observe cell membrane behavior",
      "Understand isotonic solutions in medicine",
      "Analyze concentration effects on animal cells",
    ],
  },
  {
    id: "plant-cell-plasmolysis",
    name: "Onion Cell Plasmolysis",
    description: "Observe plasmolysis and deplasmolysis in onion cells under microscope",
    difficulty: "advanced",
    duration: "75 minutes",
    cbcAlignment: ["Grade 9 - Advanced Cell Biology", "Plant Physiology", "Microscopy Techniques"],
    learningOutcomes: [
      "Observe plasmolysis under microscope",
      "Understand turgor pressure",
      "Explain plant cell water relations",
    ],
  },
  {
    id: "dialysis-tubing",
    name: "Dialysis Tubing Membrane Model",
    description: "Model cell membrane using dialysis tubing and observe selective permeability",
    difficulty: "intermediate",
    duration: "50 minutes",
    cbcAlignment: ["Grade 9 - Cell Transport", "Membrane Models", "Diffusion and Osmosis"],
    learningOutcomes: ["Model semi-permeable membranes", "Measure water movement rates", "Calculate osmotic potential"],
  },
]

export default function OsmosisExperimentPage() {
  const [selectedExperiment, setSelectedExperiment] = useState<string>("potato")
  const [solutionType, setSolutionType] = useState<"hypotonic" | "hypertonic">("hypotonic")

  const EXPERIMENT_TYPES = [
    {
      id: "potato",
      name: "Potato Cell Osmosis",
      icon: "🥔",
      description: "Observe water movement in potato cells using salt solutions",
      cellType: "plant",
      background: "bg-yellow-100 border-yellow-600",
    },
    {
      id: "onion",
      name: "Onion Cell Plasmolysis",
      icon: "🧅",
      description: "Study plasmolysis and deplasmolysis in onion epidermis",
      cellType: "plant",
      background: "bg-purple-100 border-purple-600",
    },
    {
      id: "blood",
      name: "Blood Cell Osmosis",
      icon: "🩸",
      description: "Examine crenation and hemolysis in red blood cells",
      cellType: "animal",
      background: "bg-red-100 border-red-600",
    },
    {
      id: "dialysis",
      name: "Dialysis Membrane Model",
      icon: "🧪",
      description: "Model selective permeability using dialysis tubing",
      cellType: "artificial",
      background: "bg-blue-100 border-blue-600",
    },
  ]
  const [experimentState, setExperimentState] = useState<ExperimentState>({
    isRunning: false,
    currentStep: 0,
    timeElapsed: 0,
    observations: [],
    waterMovement: 0,
    concentration: solutionType === "hypotonic" ? { inside: 50, outside: 10 } : { inside: 20, outside: 80 },
    cellSize: 100,
    completed: false,
  })
  const [aiInsights, setAiInsights] = useState<string>("")
  const [studentProgress, setStudentProgress] = useState({
    completedSteps: [],
    currentObservations: [],
    challenges: [],
  })

  // Simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (experimentState.isRunning) {
      interval = setInterval(() => {
        setExperimentState((prev) => {
          const newTimeElapsed = prev.timeElapsed + 1
          const osmosisRate = calculateOsmosisRate(prev.concentration)
          const newWaterMovement = prev.waterMovement + osmosisRate
          const newCellSize = Math.max(70, Math.min(140, 100 + newWaterMovement * 0.3))

          // Update concentrations based on water movement
          const newConcentrations = updateConcentrations(prev.concentration, osmosisRate)

          return {
            ...prev,
            timeElapsed: newTimeElapsed,
            waterMovement: newWaterMovement,
            cellSize: newCellSize,
            concentration: newConcentrations,
          }
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [experimentState.isRunning])

  const calculateOsmosisRate = (concentration: { inside: number; outside: number }) => {
    const gradient = concentration.outside - concentration.inside
    const maxRate = 2.0 // Maximum rate limit
    const rate = gradient * 0.05 // Slower, more realistic rate
    return Math.max(-maxRate, Math.min(maxRate, rate))
  }

  const updateConcentrations = (current: { inside: number; outside: number }, waterMovement: number) => {
    // More realistic concentration changes due to water movement
    const dilutionFactor = Math.abs(waterMovement) * 0.005

    if (waterMovement > 0) {
      // Water moving into cell - dilutes internal concentration
      return {
        inside: Math.max(5, current.inside - dilutionFactor),
        outside: Math.min(95, current.outside + dilutionFactor * 0.3),
      }
    } else if (waterMovement < 0) {
      // Water moving out of cell - concentrates internal solution
      return {
        inside: Math.min(95, current.inside + dilutionFactor),
        outside: Math.max(5, current.outside - dilutionFactor * 0.3),
      }
    }

    return current
  }

  const startExperiment = async () => {
    setExperimentState((prev) => ({ ...prev, isRunning: true }))

    // Get AI insights for the experiment
    try {
      const response = await fetch("/api/virtual-lab/osmosis-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentId: selectedExperiment,
          studentLevel: "grade-9",
          currentStep: experimentState.currentStep,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiInsights(data.guidance)
      }
    } catch (error) {
      console.error("Failed to get AI insights:", error)
    }
  }

  const pauseExperiment = () => {
    setExperimentState((prev) => ({ ...prev, isRunning: false }))
  }

  const resetExperiment = () => {
    setExperimentState({
      isRunning: false,
      currentStep: 0,
      timeElapsed: 0,
      observations: [],
      waterMovement: 0,
      concentration: solutionType === "hypotonic" ? { inside: 50, outside: 10 } : { inside: 20, outside: 80 },
      cellSize: 100,
      completed: false,
    })
  }

  const changeSolutionType = (newType: "hypotonic" | "hypertonic") => {
    setSolutionType(newType)
    setExperimentState({
      isRunning: false,
      currentStep: 0,
      timeElapsed: 0,
      observations: [],
      waterMovement: 0,
      concentration: newType === "hypotonic" ? { inside: 50, outside: 10 } : { inside: 20, outside: 80 },
      cellSize: 100,
      completed: false,
    })
  }

  const addObservation = (observation: string) => {
    setExperimentState((prev) => ({
      ...prev,
      observations: [
        ...prev.observations,
        `${Math.floor(prev.timeElapsed / 60)}:${(prev.timeElapsed % 60).toString().padStart(2, "0")} - ${observation}`,
      ],
    }))

    setStudentProgress((prev) => ({
      ...prev,
      currentObservations: [...prev.currentObservations, observation],
    }))
  }

  const nextStep = () => {
    const newStep = experimentState.currentStep + 1
    setExperimentState((prev) => ({ ...prev, currentStep: newStep }))
    setStudentProgress((prev) => ({
      ...prev,
      completedSteps: [...prev.completedSteps, experimentState.currentStep],
    }))
  }

  const getStepInstructions = (step: number) => {
    const instructions = {
      0: "Set up your experiment materials and prepare the solutions",
      1: "Place the specimen in the hypotonic solution and start observations",
      2: "Record initial measurements and cell appearance",
      3: "Monitor water movement and document changes every 5 minutes",
      4: "Switch to hypertonic solution and observe reverse osmosis",
      5: "Record final measurements and analyze results",
    }
    return instructions[step as keyof typeof instructions] || "Experiment complete"
  }

  const getSolutionType = () => {
    const diff = experimentState.concentration.outside - experimentState.concentration.inside
    if (Math.abs(diff) < 2) return "ISOTONIC"
    return diff > 0 ? "HYPERTONIC" : "HYPOTONIC"
  }

  const isNearEquilibrium = Math.abs(experimentState.concentration.outside - experimentState.concentration.inside) < 3

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
        <h1 className="text-3xl font-bold">Osmosis Virtual Laboratory</h1>
        <p className="text-gray-600">Grade 9 CBC Curriculum - Interactive Osmosis Experiments</p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline">Grade 9</Badge>
          <Badge variant="outline">CBC Aligned</Badge>
          <Badge variant="outline">AI Enhanced</Badge>
        </div>
      </div>

      {/* Solution Type Switch */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            Solution Type Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => changeSolutionType("hypotonic")}
                variant={solutionType === "hypotonic" ? "default" : "outline"}
                className={`px-6 py-3 ${
                  solutionType === "hypotonic"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">Hypotonic Solution</div>
                  <div className="text-xs opacity-80">Low salt concentration (10%)</div>
                  <div className="text-xs opacity-80">Water enters cell</div>
                </div>
              </Button>

              <div className="flex flex-col items-center space-y-2">
                <div className="text-sm font-medium text-gray-600">Switch Solution</div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      solutionType === "hypertonic" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </div>

              <Button
                onClick={() => changeSolutionType("hypertonic")}
                variant={solutionType === "hypertonic" ? "default" : "outline"}
                className={`px-6 py-3 ${
                  solutionType === "hypertonic"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-red-600 text-red-600 hover:bg-red-50"
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">Hypertonic Solution</div>
                  <div className="text-xs opacity-80">High salt concentration (80%)</div>
                  <div className="text-xs opacity-80">Water leaves cell</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-center">
              <span className="font-semibold">Current Setup: </span>
              <span className={solutionType === "hypotonic" ? "text-blue-600" : "text-red-600"}>
                {solutionType === "hypotonic" ? "Hypotonic" : "Hypertonic"} Solution
              </span>
              <span className="text-gray-600 ml-2">
                (External: {solutionType === "hypotonic" ? "10%" : "80%"} | Internal:{" "}
                {solutionType === "hypotonic" ? "50%" : "20%"})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experiment Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Select Osmosis Experiment Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXPERIMENT_TYPES.map((experiment) => (
              <Card
                key={experiment.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedExperiment === experiment.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedExperiment(experiment.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{experiment.icon}</div>
                  <h3 className="font-semibold text-sm mb-2">{experiment.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{experiment.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {experiment.cellType} cell
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Experiment Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Experiment Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  {EXPERIMENT_TYPES.find((exp) => exp.id === selectedExperiment)?.name}
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
            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Step {experimentState.currentStep + 1} of 6</span>
                    <span>
                      Time: {Math.floor(experimentState.timeElapsed / 60)}:
                      {(experimentState.timeElapsed % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <Progress value={(experimentState.currentStep / 5) * 100} className="mb-2" />
                  <p className="text-sm text-gray-600">{getStepInstructions(experimentState.currentStep)}</p>
                </div>

                {/* Step Controls */}
                <div className="flex justify-between">
                  <Button
                    onClick={() =>
                      setExperimentState((prev) => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }))
                    }
                    disabled={experimentState.currentStep === 0}
                    variant="outline"
                    size="sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={nextStep} disabled={experimentState.currentStep >= 5} size="sm">
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Osmosis Simulation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Osmosis Simulation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Visual Simulation */}
                <div className="relative bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg p-8 min-h-[400px] flex items-center justify-center overflow-hidden">
                  {/* Solution Background with Particles */}
                  <div className="absolute inset-0">
                    {/* External Solution Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-blue-150 to-blue-200 opacity-60" />

                    {/* Salt Solution Particles - Dynamic based on concentration */}
                    {Array.from({ length: Math.floor(experimentState.concentration.outside / 2) }).map((_, i) => (
                      <div
                        key={`salt-${i}`}
                        className={`absolute w-2 h-2 rounded-full transition-all duration-500 ${
                          experimentState.isRunning ? "animate-pulse" : ""
                        }`}
                        style={{
                          backgroundColor: `rgba(255, 165, 0, ${experimentState.concentration.outside / 100})`,
                          left: `${5 + (i % 8) * 11}%`,
                          top: `${10 + Math.floor(i / 8) * 12}%`,
                          animationDelay: `${i * 0.1}s`,
                          transform: experimentState.isRunning
                            ? `translate(${Math.sin(experimentState.timeElapsed * 0.1 + i) * 3}px, ${Math.cos(experimentState.timeElapsed * 0.1 + i) * 3}px)`
                            : "none",
                        }}
                      />
                    ))}

                    {/* Water Molecules */}
                    {Array.from({ length: Math.max(12, Math.abs(experimentState.waterMovement * 3)) }).map((_, i) => {
                      const isMovingIn = experimentState.waterMovement > 0
                      const angle = (i * 45) % 360
                      const cellCenterX = 50
                      const cellCenterY = 50
                      const currentRadius = isMovingIn
                        ? Math.max(40, 80 - (experimentState.timeElapsed % 60))
                        : Math.min(80, 40 + (experimentState.timeElapsed % 60))

                      const x = cellCenterX + Math.cos((angle * Math.PI) / 180) * currentRadius
                      const y = cellCenterY + Math.sin((angle * Math.PI) / 180) * currentRadius

                      const targetX = cellCenterX + Math.cos((angle * Math.PI) / 180) * (experimentState.cellSize / 4)
                      const targetY = cellCenterY + Math.sin((angle * Math.PI) / 180) * (experimentState.cellSize / 4)

                      const progress = isMovingIn
                        ? (experimentState.timeElapsed % 40) / 40
                        : 1 - (experimentState.timeElapsed % 40) / 40

                      return (
                        <div
                          key={`water-${i}`}
                          className={`absolute w-3 h-3 bg-blue-500 rounded-full shadow-lg transition-all duration-300 ${
                            experimentState.isRunning ? "animate-bounce" : ""
                          }`}
                          style={{
                            left: `${isMovingIn ? x + (targetX - x) * progress : targetX + (x - targetX) * progress}%`,
                            top: `${isMovingIn ? y + (targetY - y) * progress : targetY + (y - targetY) * progress}%`,
                            animationDelay: `${i * 0.1}s`,
                            opacity: 0.9,
                            boxShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
                            transform: `scale(${0.8 + Math.sin(experimentState.timeElapsed * 0.3 + i) * 0.3})`,
                            zIndex: 5,
                          }}
                        />
                      )
                    })}

                    {/* Dynamic Experiment Background with Enhanced Simulation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {selectedExperiment === "potato" && (
                        <>
                          {/* Potato Cell Background - Larger for Better Visibility */}
                          <div
                            className="absolute bg-yellow-100 border-4 border-yellow-600 opacity-30 transition-all duration-1000"
                            style={{
                              width: `${experimentState.cellSize + 80}px`, // Increased from +40 to +80
                              height: `${experimentState.cellSize + 70}px`, // Increased from +30 to +70
                              borderRadius: "40% 60% 60% 40%",
                              transform: `rotate(${experimentState.timeElapsed * 0.5}deg)`,
                              boxShadow: "0 0 25px rgba(180, 83, 9, 0.5)",
                            }}
                          />

                          {/* Cell Wall Structure - More Visible */}
                          <div
                            className="absolute border-8 border-yellow-800 bg-transparent opacity-70 transition-all duration-1000"
                            style={{
                              width: `${experimentState.cellSize + 100}px`,
                              height: `${experimentState.cellSize + 90}px`,
                              borderRadius: "45% 65% 65% 45%",
                              left: "-50px",
                              top: "-45px",
                              borderStyle: "dashed",
                            }}
                          />

                          {/* Potato Cell Osmosis Explanation Overlay */}
                          {experimentState.isRunning && (
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 shadow-lg max-w-sm">
                              <div className="text-sm font-bold text-yellow-800 mb-2 text-center">
                                🥔 POTATO CELL OSMOSIS
                              </div>
                              <div className="text-xs text-yellow-700 space-y-1">
                                {experimentState.waterMovement > 0.3 ? (
                                  <>
                                    <div>• Water entering cell (hypotonic solution)</div>
                                    <div>• Cell membrane pressing against rigid cell wall</div>
                                    <div>• Vacuole expanding with incoming water</div>
                                    <div>• Turgor pressure increasing - cell becomes firm</div>
                                    <div>• Starch granules dispersing in cytoplasm</div>
                                  </>
                                ) : experimentState.waterMovement < -0.3 ? (
                                  <>
                                    <div>• Water leaving cell (hypertonic solution)</div>
                                    <div>• Cell membrane shrinking away from wall</div>
                                    <div>• Vacuole losing water and collapsing</div>
                                    <div>• Turgor pressure decreasing - cell wilting</div>
                                    <div>• Starch granules concentrating</div>
                                  </>
                                ) : (
                                  <>
                                    <div>• Water movement balanced (isotonic)</div>
                                    <div>• Cell membrane stable against wall</div>
                                    <div>• Normal turgor pressure maintained</div>
                                    <div>• Healthy potato cell state</div>
                                    <div>• Starch granules evenly distributed</div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Enhanced Starch Granules Movement - More Visible */}
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div
                              key={`starch-${i}`}
                              className="absolute w-4 h-4 bg-purple-500 rounded-full opacity-80 animate-pulse border border-purple-700"
                              style={{
                                left: `${42 + (i % 4) * 4}%`,
                                top: `${42 + Math.floor(i / 4) * 4}%`,
                                transform: experimentState.isRunning
                                  ? `translate(${Math.sin(experimentState.timeElapsed * 0.2 + i) * (experimentState.waterMovement > 0 ? 4 : 2)}px, ${Math.cos(experimentState.timeElapsed * 0.2 + i) * (experimentState.waterMovement > 0 ? 4 : 2)}px)`
                                  : "none",
                                animationDelay: `${i * 0.2}s`,
                                boxShadow: "0 0 6px rgba(147, 51, 234, 0.8)",
                              }}
                            />
                          ))}

                          {/* Vacuole Visualization - Shows Expansion/Contraction */}
                          <div
                            className="absolute bg-yellow-200 border-3 border-yellow-500 opacity-70 transition-all duration-1000 rounded-full"
                            style={{
                              width: `${Math.max(30, experimentState.cellSize * 0.7)}px`,
                              height: `${Math.max(30, experimentState.cellSize * 0.7)}px`,
                              left: "50%",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              boxShadow:
                                experimentState.waterMovement > 0.3
                                  ? "inset 0 0 20px rgba(180, 83, 9, 0.8)"
                                  : experimentState.waterMovement < -0.3
                                    ? "inset 0 0 10px rgba(180, 83, 9, 0.4)"
                                    : "inset 0 0 15px rgba(180, 83, 9, 0.6)",
                            }}
                          />

                          {/* Cell Membrane Position Indicator */}
                          <div
                            className="absolute border-4 border-yellow-600 bg-transparent transition-all duration-1000"
                            style={{
                              width: `${experimentState.cellSize + (experimentState.waterMovement > 0.3 ? 20 : experimentState.waterMovement < -0.3 ? -10 : 5)}px`,
                              height: `${experimentState.cellSize + (experimentState.waterMovement > 0.3 ? 15 : experimentState.waterMovement < -0.3 ? -10 : 5)}px`,
                              borderRadius: "40% 60% 60% 40%",
                              left: "50%",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              borderStyle: experimentState.waterMovement > 0.3 ? "solid" : "dashed",
                              opacity: 0.9,
                            }}
                          />

                          {/* Nucleus Visualization */}
                          <div
                            className="absolute w-10 h-10 bg-yellow-800 rounded-full opacity-90 transition-all duration-1000 border-3 border-yellow-900"
                            style={{
                              left:
                                experimentState.waterMovement < -0.3
                                  ? `${47 + Math.sin(experimentState.timeElapsed * 0.1) * 2}%`
                                  : "50%",
                              top:
                                experimentState.waterMovement < -0.3
                                  ? `${47 + Math.cos(experimentState.timeElapsed * 0.1) * 2}%`
                                  : "50%",
                              transform: "translate(-50%, -50%)",
                              boxShadow: "0 0 12px rgba(133, 77, 14, 0.8)",
                            }}
                          />

                          {/* Water Movement Arrows for Potato Cells */}
                          {experimentState.isRunning &&
                            Math.abs(experimentState.waterMovement) > 0.2 &&
                            Array.from({ length: 8 }).map((_, i) => {
                              const angle = (i * 45) % 360
                              const arrowDistance = 90
                              const arrowX = 50 + Math.cos((angle * Math.PI) / 180) * arrowDistance
                              const arrowY = 50 + Math.sin((angle * Math.PI) / 180) * arrowDistance
                              const isInward = experimentState.waterMovement > 0

                              return (
                                <div
                                  key={`potato-arrow-${i}`}
                                  className="absolute transition-all duration-500"
                                  style={{
                                    left: `${arrowX}%`,
                                    top: `${arrowY}%`,
                                    transform: `translate(-50%, -50%) rotate(${isInward ? angle + 180 : angle}deg)`,
                                  }}
                                >
                                  <div
                                    className={`w-8 h-2 ${isInward ? "bg-blue-600" : "bg-red-600"} relative animate-pulse rounded`}
                                  >
                                    <div
                                      className={`absolute right-0 top-0 w-0 h-0 border-l-6 border-t-3 border-b-3 border-transparent ${isInward ? "border-l-blue-600" : "border-l-red-600"}`}
                                    />
                                  </div>
                                </div>
                              )
                            })}

                          {/* Turgor Pressure Effects Visualization */}
                          {experimentState.waterMovement > 0.5 && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-100 border-2 border-green-400 rounded-lg p-2">
                              <div className="text-xs font-bold text-green-800 text-center mb-1">
                                💪 HIGH TURGOR PRESSURE
                              </div>
                              <div className="text-xs text-green-700 text-center">
                                Cell wall under pressure - firm and rigid
                              </div>
                            </div>
                          )}

                          {/* Low Turgor Pressure Warning */}
                          {experimentState.waterMovement < -0.5 && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-100 border-2 border-orange-400 rounded-lg p-2">
                              <div className="text-xs font-bold text-orange-800 text-center mb-1">
                                ⚠️ LOW TURGOR PRESSURE
                              </div>
                              <div className="text-xs text-orange-700 text-center">
                                Cell becoming flaccid - potato wilting
                              </div>
                            </div>
                          )}

                          {/* Turgor Pressure Visualization */}
                          <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-lg p-2 border">
                            <div className="text-xs font-semibold mb-1">Turgor Pressure</div>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-1000 ${
                                  experimentState.waterMovement > 0.3
                                    ? "bg-green-500"
                                    : experimentState.waterMovement < -0.3
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                }`}
                                style={{
                                  width: `${Math.max(0, Math.min(100, (experimentState.cellSize - 70) * 2))}%`,
                                }}
                              />
                            </div>
                            <div className="text-xs mt-1 text-center">
                              {experimentState.waterMovement > 0.3
                                ? "HIGH"
                                : experimentState.waterMovement < -0.3
                                  ? "LOW"
                                  : "NORMAL"}
                            </div>
                          </div>
                        </>
                      )}

                      {selectedExperiment === "onion" && (
                        <>
                          {/* Onion Cell Background - Larger for Better Visibility */}
                          <div
                            className="absolute bg-purple-100 border-4 border-purple-600 opacity-30 transition-all duration-1000"
                            style={{
                              width: `${experimentState.cellSize + 60}px`, // Increased from +20 to +60
                              height: `${experimentState.cellSize + 60}px`, // Increased from +20 to +60
                              borderRadius: "15px", // Slightly more rounded
                              transform: `rotate(${experimentState.timeElapsed * 0.3}deg)`,
                              boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)",
                            }}
                          />

                          {/* Cell Wall Structure - More Visible */}
                          <div
                            className="absolute border-8 border-purple-800 bg-transparent opacity-60 transition-all duration-1000"
                            style={{
                              width: `${experimentState.cellSize + 80}px`,
                              height: `${experimentState.cellSize + 80}px`,
                              borderRadius: "20px",
                              left: "-40px",
                              top: "-40px",
                              borderStyle: "dashed",
                            }}
                          />

                          {/* Plasmolysis Explanation Overlay */}
                          {experimentState.isRunning && (
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-purple-50 border-2 border-purple-400 rounded-lg p-3 shadow-lg max-w-sm">
                              <div className="text-sm font-bold text-purple-800 mb-2 text-center">
                                🧅 ONION CELL PLASMOLYSIS
                              </div>
                              <div className="text-xs text-purple-700 space-y-1">
                                {experimentState.waterMovement > 0.3 ? (
                                  <>
                                    <div>• Water entering cell (hypotonic solution)</div>
                                    <div>• Cell membrane pressing against cell wall</div>
                                    <div>• Vacuole expanding and becoming turgid</div>
                                    <div>• Cell becomes firm and rigid</div>
                                  </>
                                ) : experimentState.waterMovement < -0.3 ? (
                                  <>
                                    <div>• Water leaving cell (hypertonic solution)</div>
                                    <div>• Cell membrane shrinking away from wall</div>
                                    <div>• Vacuole collapsing and losing water</div>
                                    <div>• Plasmolysis occurring - cell wilting</div>
                                  </>
                                ) : (
                                  <>
                                    <div>• Water movement balanced (isotonic)</div>
                                    <div>• Cell membrane stable against wall</div>
                                    <div>• Normal cell turgor pressure</div>
                                    <div>• Healthy cell state maintained</div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Enhanced Cytoplasmic Strands during Plasmolysis */}
                          {experimentState.waterMovement < -0.3 &&
                            Array.from({ length: 12 }).map((_, i) => {
                              const angle = (i * 30) % 360
                              const strandLength = 25 + i * 2
                              const strandX = 50 + Math.cos((angle * Math.PI) / 180) * 30
                              const strandY = 50 + Math.sin((angle * Math.PI) / 180) * 30

                              return (
                                <div
                                  key={`strand-${i}`}
                                  className="absolute bg-purple-600 opacity-70 animate-pulse"
                                  style={{
                                    width: "2px",
                                    height: `${strandLength}px`,
                                    left: `${strandX}%`,
                                    top: `${strandY}%`,
                                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                                    borderRadius: "1px",
                                    animationDelay: `${i * 0.15}s`,
                                    boxShadow: "0 0 4px rgba(147, 51, 234, 0.8)",
                                  }}
                                />
                              )
                            })}

                          {/* Vacuole Visualization - Shows Shrinking During Plasmolysis */}
                          <div
                            className="absolute bg-purple-200 border-2 border-purple-400 opacity-60 transition-all duration-1000 rounded-lg"
                            style={{
                              width: `${Math.max(20, experimentState.cellSize * 0.6)}px`,
                              height: `${Math.max(20, experimentState.cellSize * 0.6)}px`,
                              left: "50%",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              boxShadow:
                                experimentState.waterMovement < -0.3
                                  ? "inset 0 0 15px rgba(147, 51, 234, 0.8)"
                                  : "inset 0 0 8px rgba(147, 51, 234, 0.4)",
                            }}
                          />

                          {/* Cell Membrane Position Indicator */}
                          <div
                            className="absolute border-4 border-purple-500 bg-transparent transition-all duration-1000"
                            style={{
                              width: `${experimentState.cellSize + (experimentState.waterMovement < -0.3 ? -20 : 10)}px`,
                              height: `${experimentState.cellSize + (experimentState.waterMovement < -0.3 ? -20 : 10)}px`,
                              borderRadius: experimentState.waterMovement < -0.3 ? "25px" : "15px",
                              left: "50%",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              borderStyle: experimentState.waterMovement < -0.3 ? "solid" : "dashed",
                              opacity: 0.8,
                            }}
                          />

                          {/* Nucleus Movement During Plasmolysis */}
                          <div
                            className="absolute w-8 h-8 bg-purple-800 rounded-full opacity-80 transition-all duration-1000 border-2 border-purple-900"
                            style={{
                              left:
                                experimentState.waterMovement < -0.3
                                  ? `${48 + Math.sin(experimentState.timeElapsed * 0.1) * 3}%`
                                  : "50%",
                              top:
                                experimentState.waterMovement < -0.3
                                  ? `${48 + Math.cos(experimentState.timeElapsed * 0.1) * 3}%`
                                  : "50%",
                              transform: "translate(-50%, -50%)",
                              boxShadow: "0 0 10px rgba(88, 28, 135, 0.8)",
                            }}
                          />

                          {/* Water Movement Arrows for Onion Cells */}
                          {experimentState.isRunning &&
                            Math.abs(experimentState.waterMovement) > 0.2 &&
                            Array.from({ length: 8 }).map((_, i) => {
                              const angle = (i * 45) % 360
                              const arrowDistance = 80
                              const arrowX = 50 + Math.cos((angle * Math.PI) / 180) * arrowDistance
                              const arrowY = 50 + Math.sin((angle * Math.PI) / 180) * arrowDistance
                              const isInward = experimentState.waterMovement > 0

                              return (
                                <div
                                  key={`onion-arrow-${i}`}
                                  className="absolute transition-all duration-500"
                                  style={{
                                    left: `${arrowX}%`,
                                    top: `${arrowY}%`,
                                    transform: `translate(-50%, -50%) rotate(${isInward ? angle + 180 : angle}deg)`,
                                  }}
                                >
                                  <div
                                    className={`w-6 h-1 ${isInward ? "bg-blue-500" : "bg-red-500"} relative animate-pulse`}
                                  >
                                    <div
                                      className={`absolute right-0 top-0 w-0 h-0 border-l-4 border-t-2 border-b-2 border-transparent ${isInward ? "border-l-blue-500" : "border-l-red-500"}`}
                                    />
                                  </div>
                                </div>
                              )
                            })}

                          {/* Plasmolysis Stage Indicator */}
                          {experimentState.waterMovement < -0.5 && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-100 border-2 border-red-400 rounded-lg p-2">
                              <div className="text-xs font-bold text-red-800 text-center mb-1">
                                ⚠️ SEVERE PLASMOLYSIS
                              </div>
                              <div className="text-xs text-red-700 text-center">
                                Cell membrane completely separated from wall
                              </div>
                            </div>
                          )}

                          {/* Turgor Pressure Visualization */}
                          <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-lg p-2 border">
                            <div className="text-xs font-semibold mb-1">Turgor Pressure</div>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-1000 ${
                                  experimentState.waterMovement > 0.3
                                    ? "bg-green-500"
                                    : experimentState.waterMovement < -0.3
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                }`}
                                style={{
                                  width: `${Math.max(0, Math.min(100, (experimentState.cellSize - 70) * 2))}%`,
                                }}
                              />
                            </div>
                            <div className="text-xs mt-1 text-center">
                              {experimentState.waterMovement > 0.3
                                ? "HIGH"
                                : experimentState.waterMovement < -0.3
                                  ? "LOW"
                                  : "NORMAL"}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Blood Cell Background with Enhanced Crenation/Hemolysis Effects - Larger for Better Visibility */}
                      {selectedExperiment === "blood" && (
                        <>
                          {/* Blood Cell Background with Dynamic Shape Changes - Increased Size */}
                          <div
                            className="absolute bg-red-100 border-4 border-red-600 opacity-30 transition-all duration-1000"
                            style={{
                              width: `${experimentState.cellSize + 60}px`, // Increased from no addition to +60
                              height: `${(experimentState.cellSize + 60) * 0.6}px`, // Increased proportionally
                              borderRadius: experimentState.waterMovement < -0.5 ? "20% 80% 20% 80%" : "50%",
                              transform: `rotate(${experimentState.timeElapsed * 0.7}deg) ${
                                experimentState.waterMovement < -0.5 ? "scaleX(0.7) scaleY(0.8)" : "scaleX(1)"
                              }`,
                              boxShadow: "0 0 30px rgba(239, 68, 68, 0.6)",
                            }}
                          />

                          {/* Cell Wall Structure - More Visible for Blood Cells */}
                          <div
                            className="absolute border-6 border-red-800 bg-transparent opacity-70 transition-all duration-1000"
                            style={{
                              width: `${experimentState.cellSize + 80}px`,
                              height: `${(experimentState.cellSize + 80) * 0.6}px`,
                              borderRadius: "50%",
                              left: "-40px",
                              top: "-24px",
                              borderStyle: "dotted",
                            }}
                          />

                          {/* Blood Cell Osmosis Explanation Overlay */}
                          {experimentState.isRunning && (
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-50 border-2 border-red-400 rounded-lg p-3 shadow-lg max-w-sm">
                              <div className="text-sm font-bold text-red-800 mb-2 text-center">
                                🩸 BLOOD CELL OSMOSIS
                              </div>
                              <div className="text-xs text-red-700 space-y-1">
                                {experimentState.waterMovement > 1.0 ? (
                                  <>
                                    <div>• Water entering cell rapidly (hypotonic solution)</div>
                                    <div>• Cell membrane stretching beyond capacity</div>
                                    <div>• Hemoglobin leaking out of cell</div>
                                    <div>• HEMOLYSIS - cell bursting and fragmenting</div>
                                    <div>• Red blood cell destroyed completely</div>
                                  </>
                                ) : experimentState.waterMovement < -0.5 ? (
                                  <>
                                    <div>• Water leaving cell rapidly (hypertonic solution)</div>
                                    <div>• Cell membrane shrinking and wrinkling</div>
                                    <div>• Spiky projections forming on surface</div>
                                    <div>• CRENATION - cell becoming star-shaped</div>
                                    <div>• Reduced oxygen-carrying capacity</div>
                                  </>
                                ) : (
                                  <>
                                    <div>• Water movement balanced (isotonic solution)</div>
                                    <div>• Cell maintains biconcave disc shape</div>
                                    <div>• Normal flexibility for blood flow</div>
                                    <div>• Optimal oxygen-carrying function</div>
                                    <div>• Healthy red blood cell state</div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Enhanced Crenation Spikes Visualization - More Visible */}
                          {experimentState.waterMovement < -0.5 &&
                            Array.from({ length: 16 }).map((_, i) => {
                              const angle = (i * 22.5) % 360
                              const spikeRadius = (experimentState.cellSize + 60) * 0.4
                              const spikeX = 50 + Math.cos((angle * Math.PI) / 180) * spikeRadius
                              const spikeY = 50 + Math.sin((angle * Math.PI) / 180) * spikeRadius

                              return (
                                <div
                                  key={`crenation-spike-${i}`}
                                  className="absolute w-3 h-8 bg-red-600 opacity-80 animate-pulse border border-red-800"
                                  style={{
                                    left: `${spikeX}%`,
                                    top: `${spikeY}%`,
                                    transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${0.8 + Math.sin(experimentState.timeElapsed * 0.5 + i) * 0.4})`,
                                    borderRadius: "50% 50% 0 0",
                                    animationDelay: `${i * 0.1}s`,
                                    boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)",
                                  }}
                                />
                              )
                            })}

                          {/* Enhanced Hemolysis Fragments with Realistic Movement - More Visible */}
                          {experimentState.waterMovement > 1.0 &&
                            Array.from({ length: 15 }).map((_, i) => {
                              const angle = (i * 24) % 360
                              const fragmentRadius = (experimentState.cellSize + 60) * (0.6 + i * 0.1)
                              const fragmentX = 50 + Math.cos((angle * Math.PI) / 180) * fragmentRadius
                              const fragmentY = 50 + Math.sin((angle * Math.PI) / 180) * fragmentRadius

                              return (
                                <div
                                  key={`hemolysis-fragment-${i}`}
                                  className="absolute bg-red-400 rounded-full opacity-90 animate-bounce border-2 border-red-600"
                                  style={{
                                    width: `${4 + i * 0.8}px`,
                                    height: `${4 + i * 0.8}px`,
                                    left: `${fragmentX}%`,
                                    top: `${fragmentY}%`,
                                    transform: `translate(-50%, -50%) scale(${0.6 + Math.sin(experimentState.timeElapsed * 0.3 + i) * 0.6})`,
                                    animationDelay: `${i * 0.12}s`,
                                    animationDuration: "2s",
                                    boxShadow: "0 0 8px rgba(239, 68, 68, 0.9)",
                                  }}
                                />
                              )
                            })}

                          {/* Enhanced Hemoglobin Release Visualization - More Visible */}
                          {experimentState.waterMovement > 1.0 &&
                            Array.from({ length: 20 }).map((_, i) => (
                              <div
                                key={`hemoglobin-${i}`}
                                className="absolute w-2 h-2 bg-red-700 rounded-full opacity-80 animate-ping border border-red-900"
                                style={{
                                  left: `${40 + (i % 6) * 3}%`,
                                  top: `${40 + Math.floor(i / 6) * 3}%`,
                                  animationDelay: `${i * 0.08}s`,
                                  animationDuration: "1.2s",
                                  boxShadow: "0 0 6px rgba(153, 27, 27, 0.8)",
                                }}
                              />
                            ))}

                          {/* Cell Membrane Flexibility Visualization */}
                          <div
                            className="absolute border-4 border-red-500 bg-transparent transition-all duration-1000"
                            style={{
                              width: `${experimentState.cellSize + (experimentState.waterMovement > 1.0 ? 40 : experimentState.waterMovement < -0.5 ? -10 : 20)}px`,
                              height: `${(experimentState.cellSize + (experimentState.waterMovement > 1.0 ? 40 : experimentState.waterMovement < -0.5 ? -10 : 20)) * 0.6}px`,
                              borderRadius: experimentState.waterMovement < -0.5 ? "30% 70% 30% 70%" : "50%",
                              left: "50%",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              borderStyle: experimentState.waterMovement > 1.0 ? "dashed" : "solid",
                              opacity: 0.9,
                            }}
                          />

                          {/* Hemoglobin Concentration Visualization */}
                          <div
                            className="absolute bg-red-300 rounded-full opacity-70 transition-all duration-1000 border-2 border-red-500"
                            style={{
                              width: `${Math.max(20, (experimentState.cellSize + 40) * 0.5)}px`,
                              height: `${Math.max(12, (experimentState.cellSize + 40) * 0.3)}px`,
                              left: "50%",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              boxShadow:
                                experimentState.waterMovement > 1.0
                                  ? "inset 0 0 20px rgba(239, 68, 68, 0.9)"
                                  : experimentState.waterMovement < -0.5
                                    ? "inset 0 0 15px rgba(153, 27, 27, 0.8)"
                                    : "inset 0 0 10px rgba(239, 68, 68, 0.6)",
                            }}
                          />

                          {/* Water Movement Arrows for Blood Cells */}
                          {experimentState.isRunning &&
                            Math.abs(experimentState.waterMovement) > 0.2 &&
                            Array.from({ length: 8 }).map((_, i) => {
                              const angle = (i * 45) % 360
                              const arrowDistance = 95
                              const arrowX = 50 + Math.cos((angle * Math.PI) / 180) * arrowDistance
                              const arrowY = 50 + Math.sin((angle * Math.PI) / 180) * arrowDistance
                              const isInward = experimentState.waterMovement > 0

                              return (
                                <div
                                  key={`blood-arrow-${i}`}
                                  className="absolute transition-all duration-500"
                                  style={{
                                    left: `${arrowX}%`,
                                    top: `${arrowY}%`,
                                    transform: `translate(-50%, -50%) rotate(${isInward ? angle + 180 : angle}deg)`,
                                  }}
                                >
                                  <div
                                    className={`w-8 h-2 ${isInward ? "bg-blue-600" : "bg-red-600"} relative animate-pulse rounded`}
                                  >
                                    <div
                                      className={`absolute right-0 top-0 w-0 h-0 border-l-6 border-t-3 border-b-3 border-transparent ${isInward ? "border-l-blue-600" : "border-l-red-600"}`}
                                    />
                                  </div>
                                </div>
                              )
                            })}

                          {/* Hemolysis Warning */}
                          {experimentState.waterMovement > 1.0 && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-100 border-2 border-blue-400 rounded-lg p-2">
                              <div className="text-xs font-bold text-blue-800 text-center mb-1">
                                💥 SEVERE HEMOLYSIS
                              </div>
                              <div className="text-xs text-blue-700 text-center">
                                Cell membrane ruptured - hemoglobin released
                              </div>
                            </div>
                          )}

                          {/* Crenation Warning */}
                          {experimentState.waterMovement < -0.5 && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-100 border-2 border-orange-400 rounded-lg p-2">
                              <div className="text-xs font-bold text-orange-800 text-center mb-1">
                                ⭐ SEVERE CRENATION
                              </div>
                              <div className="text-xs text-orange-700 text-center">
                                Cell dehydrated - spiky projections formed
                              </div>
                            </div>
                          )}

                          {/* Cell Health Indicator */}
                          <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-lg p-2 border">
                            <div className="text-xs font-semibold mb-1">Cell Health</div>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-1000 ${
                                  experimentState.waterMovement > 1.0 || experimentState.waterMovement < -0.5
                                    ? "bg-red-500"
                                    : Math.abs(experimentState.waterMovement) > 0.3
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.max(0, Math.min(100, 100 - Math.abs(experimentState.waterMovement) * 30))}%`,
                                }}
                              />
                            </div>
                            <div className="text-xs mt-1 text-center">
                              {experimentState.waterMovement > 1.0 || experimentState.waterMovement < -0.5
                                ? "CRITICAL"
                                : Math.abs(experimentState.waterMovement) > 0.3
                                  ? "STRESSED"
                                  : "HEALTHY"}
                            </div>
                          </div>
                        </>
                      )}

                      {selectedExperiment === "dialysis" && (
                        <>
                          {/* Dialysis Tubing Background */}
                          <div
                            className="absolute bg-blue-100 border-4 border-blue-600 opacity-20 transition-all duration-1000"
                            style={{
                              width: `${experimentState.cellSize + 60}px`,
                              height: `${experimentState.cellSize + 80}px`,
                              borderRadius: "20px",
                              transform: `rotate(${experimentState.timeElapsed * 0.2}deg)`,
                            }}
                          />

                          {/* Selective Permeability Visualization */}
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div
                              key={`pore-${i}`}
                              className="absolute w-2 h-8 bg-blue-400 opacity-50 animate-pulse"
                              style={{
                                left: `${40 + i * 3}%`,
                                top: `${30 + (i % 2) * 40}%`,
                                borderRadius: "50%",
                                animationDelay: `${i * 0.2}s`,
                              }}
                            />
                          ))}
                        </>
                      )}

                      {/* Universal Water Flow Visualization */}
                      {experimentState.isRunning && Math.abs(experimentState.waterMovement) > 0.3 && (
                        <>
                          {/* Water Flow Streams */}
                          {Array.from({ length: 6 }).map((_, i) => {
                            const angle = (i * 60) % 360
                            const streamRadius = 70
                            const streamX = 50 + Math.cos((angle * Math.PI) / 180) * streamRadius
                            const streamY = 50 + Math.sin((angle * Math.PI) / 180) * streamRadius
                            const isInward = experimentState.waterMovement > 0

                            return (
                              <div
                                key={`water-stream-${i}`}
                                className={`absolute transition-all duration-500 ${
                                  isInward ? "animate-pulse" : "animate-bounce"
                                }`}
                                style={{
                                  left: `${streamX}%`,
                                  top: `${streamY}%`,
                                  transform: `translate(-50%, -50%) rotate(${isInward ? angle + 180 : angle}deg)`,
                                }}
                              >
                                <div className="flex items-center space-x-1">
                                  {Array.from({ length: 3 }).map((_, j) => (
                                    <div
                                      key={j}
                                      className="w-2 h-2 bg-blue-400 rounded-full opacity-80"
                                      style={{
                                        animationDelay: `${j * 0.2}s`,
                                        transform: `scale(${0.8 + Math.sin(experimentState.timeElapsed * 0.5 + j) * 0.4})`,
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )
                          })}

                          {/* Osmotic Pressure Waves */}
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={`pressure-wave-${i}`}
                              className="absolute border-2 border-blue-300 opacity-30 animate-ping rounded-full"
                              style={{
                                width: `${100 + i * 50 + (experimentState.timeElapsed % 30) * 2}px`,
                                height: `${100 + i * 50 + (experimentState.timeElapsed % 30) * 2}px`,
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: "3s",
                              }}
                            />
                          ))}
                        </>
                      )}

                      {/* Concentration Gradient Visualization */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div
                          className="absolute left-0 top-0 w-1/3 h-full rounded-l-lg transition-all duration-1000"
                          style={{
                            background: `radial-gradient(circle, rgba(255, 165, 0, ${experimentState.concentration.outside / 150}), transparent)`,
                          }}
                        />
                        <div
                          className="absolute right-0 top-0 w-1/3 h-full rounded-r-lg transition-all duration-1000"
                          style={{
                            background: `radial-gradient(circle, rgba(255, 165, 0, ${experimentState.concentration.outside / 150}), transparent)`,
                          }}
                        />
                      </div>

                      {/* Real-time Process Indicators */}
                      {experimentState.isRunning && (
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-95 rounded-lg p-2 shadow-lg border">
                          <div className="text-xs font-bold text-center mb-1">
                            {experimentState.waterMovement > 0
                              ? "🔵 WATER ENTERING"
                              : experimentState.waterMovement < 0
                                ? "🔴 WATER LEAVING"
                                : "⚖️ EQUILIBRIUM"}
                          </div>
                          <div className="text-xs text-center text-gray-600">
                            Rate: {Math.abs(experimentState.waterMovement).toFixed(2)} mL/min
                          </div>
                          {selectedExperiment === "blood" && experimentState.waterMovement < -0.5 && (
                            <div className="text-xs text-red-600 font-semibold text-center mt-1">
                              ⚠️ CRENATION ACTIVE
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Water Movement Indicators */}
                    <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-lg p-2 text-xs">
                      <div className="font-semibold text-blue-800">Water Movement</div>
                      <div
                        className={`${experimentState.waterMovement > 0 ? "text-green-600" : experimentState.waterMovement < 0 ? "text-red-600" : "text-yellow-600"}`}
                      >
                        {experimentState.waterMovement > 0
                          ? "INTO cell"
                          : experimentState.waterMovement < 0
                            ? "OUT OF cell"
                            : "EQUILIBRIUM"}
                      </div>
                    </div>

                    {/* Solution Type Indicator */}
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-lg p-2 text-xs">
                      <div className="font-semibold text-orange-800">Solution Type</div>
                      <div
                        className={`${experimentState.concentration.outside > experimentState.concentration.inside ? "text-red-600" : experimentState.concentration.outside < experimentState.concentration.inside ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {getSolutionType()}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Cell Representation */}
                  <div className="relative z-10">
                    {selectedExperiment === "potato" && (
                      <>
                        <div
                          className="border-4 border-yellow-700 bg-transparent transition-all duration-1000 absolute"
                          style={{
                            width: `${experimentState.cellSize + 25}px`,
                            height: `${experimentState.cellSize + 20}px`,
                            borderRadius: "40% 60% 60% 40%",
                            left: "-12px",
                            top: "-10px",
                            boxShadow: "inset 0 0 20px rgba(180, 83, 9, 0.3)",
                          }}
                        />
                        <div
                          className={`border-4 transition-all duration-1000 flex items-center justify-center relative ${
                            experimentState.waterMovement > 0
                              ? "border-green-600 bg-green-50"
                              : experimentState.waterMovement < 0
                                ? "border-red-600 bg-red-50"
                                : "border-yellow-600 bg-yellow-50"
                          }`}
                          style={{
                            width: `${experimentState.cellSize}px`,
                            height: `${experimentState.cellSize - 10}px`,
                            borderRadius: "40% 60% 60% 40%",
                          }}
                        >
                          <div className="text-center z-20 relative bg-white bg-opacity-90 rounded-lg p-2 shadow-md">
                            <div className="text-xs font-bold text-yellow-800">Potato Cell</div>
                            <div className="text-xs">Conc: {experimentState.concentration.inside.toFixed(1)}%</div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedExperiment === "onion" && (
                      <>
                        <div
                          className="border-4 border-purple-700 bg-transparent transition-all duration-1000 absolute"
                          style={{
                            width: `${experimentState.cellSize + 20}px`,
                            height: `${experimentState.cellSize + 20}px`,
                            borderRadius: "10px",
                            left: "-10px",
                            top: "-10px",
                          }}
                        />
                        <div
                          className={`border-4 transition-all duration-1000 flex items-center justify-center relative ${
                            experimentState.waterMovement > 0
                              ? "border-green-600 bg-green-50"
                              : experimentState.waterMovement < 0
                                ? "border-red-600 bg-red-50"
                                : "border-purple-600 bg-purple-50"
                          }`}
                          style={{
                            width: `${experimentState.cellSize}px`,
                            height: `${experimentState.cellSize}px`,
                            borderRadius: experimentState.waterMovement < 0 ? "20px" : "10px",
                          }}
                        >
                          <div className="text-center z-20 relative bg-white bg-opacity-90 rounded-lg p-2 shadow-md">
                            <div className="text-xs font-bold text-purple-800">Onion Cell</div>
                            <div className="text-xs">
                              {experimentState.waterMovement < -0.5 ? "PLASMOLYZED" : "NORMAL"}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedExperiment === "blood" && (
                      <div
                        className={`border-6 transition-all duration-1000 flex items-center justify-center relative ${
                          experimentState.waterMovement > 1.0
                            ? "border-blue-600 bg-blue-50 animate-pulse" // Hemolysis
                            : experimentState.waterMovement < -0.5
                              ? "border-red-800 bg-red-100" // Crenation
                              : "border-red-600 bg-red-50" // Normal
                        }`}
                        style={{
                          width: `${experimentState.cellSize + 40}px`, // Increased from no addition to +40
                          height: `${(experimentState.cellSize + 40) * 0.6}px`, // Increased proportionally
                          borderRadius: experimentState.waterMovement < -0.5 ? "30% 70% 30% 70%" : "50%", // Irregular when crenated
                          transform: experimentState.waterMovement < -0.5 ? "scaleX(0.7) scaleY(0.9)" : "scaleX(1)",
                          boxShadow:
                            experimentState.waterMovement < -0.5
                              ? "inset 0 0 20px rgba(153, 27, 27, 0.9), 0 0 25px rgba(239, 68, 68, 0.7)"
                              : experimentState.waterMovement > 1.0
                                ? "0 0 30px rgba(59, 130, 246, 0.9)"
                                : "0 0 15px rgba(239, 68, 68, 0.4)",
                        }}
                      >
                        {/* Enhanced Crenation Surface Texture - More Visible */}
                        {experimentState.waterMovement < -0.5 &&
                          Array.from({ length: 16 }).map((_, i) => (
                            <div
                              key={`surface-spike-${i}`}
                              className="absolute w-2 h-4 bg-red-800 opacity-90 border border-red-900"
                              style={{
                                left: `${8 + (i % 5) * 18}%`,
                                top: `${8 + Math.floor(i / 5) * 18}%`,
                                transform: `rotate(${i * 22.5}deg)`,
                                borderRadius: "50% 50% 0 0",
                                boxShadow: "0 0 4px rgba(153, 27, 27, 0.8)",
                              }}
                            />
                          ))}

                        {/* Enhanced Cell Content Display */}
                        <div className="text-center z-20 relative bg-white bg-opacity-95 rounded-lg p-3 shadow-lg border-2">
                          <div className="text-sm font-bold text-red-800 mb-1">
                            {experimentState.waterMovement > 1.0
                              ? "🔴 HEMOLYZED"
                              : experimentState.waterMovement < -0.5
                                ? "⭐ CRENATED"
                                : "🩸 NORMAL RBC"}
                          </div>
                          <div className="text-xs mt-1 space-y-1">
                            {experimentState.waterMovement > 1.0 ? (
                              <>
                                <div>Cell burst - fragments visible</div>
                                <div>Hemoglobin released into plasma</div>
                                <div>Complete cell destruction</div>
                              </>
                            ) : experimentState.waterMovement < -0.5 ? (
                              <>
                                <div>Spiky projections formed</div>
                                <div>Reduced flexibility</div>
                                <div>Impaired oxygen transport</div>
                              </>
                            ) : (
                              <>
                                <div>Biconcave disc shape</div>
                                <div>Flexible membrane</div>
                                <div>Normal oxygen capacity</div>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-2">
                            Size: {(experimentState.cellSize + 40).toFixed(0)}% | Health:{" "}
                            {experimentState.waterMovement > 1.0 || experimentState.waterMovement < -0.5
                              ? "Critical"
                              : "Good"}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedExperiment === "dialysis" && (
                      <div
                        className="border-4 border-blue-700 bg-blue-50 transition-all duration-1000 flex items-center justify-center relative"
                        style={{
                          width: `${experimentState.cellSize + 40}px`,
                          height: `${experimentState.cellSize + 60}px`,
                          borderRadius: "20px",
                        }}
                      >
                        <div className="text-center z-20 relative bg-white bg-opacity-90 rounded-lg p-2 shadow-md">
                          <div className="text-xs font-bold text-blue-800">Dialysis Tubing</div>
                          <div className="text-xs">Semi-permeable</div>
                          <div className="text-xs">Membrane Model</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Concentration Gradient Visualization */}
                  <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-md">
                    <div className="text-sm font-semibold mb-2">Solution Gradient</div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-400 rounded" />
                      <span className="text-xs">High Conc: {experimentState.concentration.outside.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-4 h-4 bg-purple-500 rounded" />
                      <span className="text-xs">Low Conc: {experimentState.concentration.inside.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Osmosis Direction Indicator */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-md">
                    <div className="text-sm font-semibold mb-2">Water Movement</div>
                    <div className="flex items-center gap-2">
                      {experimentState.waterMovement > 0 ? (
                        <>
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span className="text-xs text-blue-600">Into Cell</span>
                        </>
                      ) : experimentState.waterMovement < 0 ? (
                        <>
                          <ArrowLeft className="h-4 w-4 text-red-600" />
                          <span className="text-xs text-red-600">Out of Cell</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                          <span className="text-xs text-yellow-600">Equilibrium</span>
                        </>
                      )}
                    </div>
                    <div className="text-xs mt-1">
                      Rate: {Math.abs(experimentState.waterMovement).toFixed(2)} mL/min
                    </div>
                  </div>

                  {/* Pressure Indicator */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md">
                    <div className="text-sm font-semibold mb-2">Turgor Pressure</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          experimentState.cellSize > 100
                            ? "bg-green-500"
                            : experimentState.cellSize < 100
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                        style={{ width: `${Math.min(100, (experimentState.cellSize - 80) * 2)}%` }}
                      />
                    </div>
                    <div className="text-xs mt-1">
                      {experimentState.cellSize > 110 ? "High" : experimentState.cellSize < 90 ? "Low" : "Normal"}
                    </div>
                  </div>

                  {/* Time-based Effects */}
                  {experimentState.timeElapsed > 30 && (
                    <div className="absolute bottom-4 right-4 bg-yellow-100 border border-yellow-400 rounded-lg p-2">
                      <div className="text-xs font-semibold text-yellow-800">
                        {experimentState.cellSize > 120
                          ? "Cell may burst!"
                          : experimentState.cellSize < 80
                            ? "Cell plasmolysis!"
                            : "Approaching equilibrium"}
                      </div>
                    </div>
                  )}

                  {/* Crenation Educational Panel */}
                  {selectedExperiment === "blood" && experimentState.waterMovement < -0.5 && (
                    <div className="absolute bottom-4 right-4 bg-red-50 border-2 border-red-400 rounded-lg p-3 max-w-xs">
                      <div className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                        ⭐ CRENATION OCCURRING
                      </div>
                      <div className="text-xs text-red-700 space-y-1">
                        <div>• Cell losing water rapidly</div>
                        <div>• Membrane forming spiky projections</div>
                        <div>• Reduced oxygen-carrying capacity</div>
                        <div>• Can block small blood vessels</div>
                      </div>
                      <div className="text-xs text-red-600 mt-2 font-semibold">
                        Medical Alert: Dangerous in IV therapy!
                      </div>
                    </div>
                  )}
                </div>

                {/* Real-time Data */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{experimentState.waterMovement.toFixed(1)}</div>
                      <div className="text-xs text-gray-600">Water Movement (mL)</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{experimentState.cellSize.toFixed(0)}%</div>
                      <div className="text-xs text-gray-600">Cell Size</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {(experimentState.concentration.outside - experimentState.concentration.inside).toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">Gradient</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Observations */}
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => addObservation("Cell appears swollen")} variant="outline" size="sm">
                    Cell Swelling
                  </Button>
                  <Button onClick={() => addObservation("Cell appears shrunken")} variant="outline" size="sm">
                    Cell Shrinking
                  </Button>
                  <Button onClick={() => addObservation("No visible change")} variant="outline" size="sm">
                    No Change
                  </Button>
                  <Button onClick={() => addObservation("Membrane appears turgid")} variant="outline" size="sm">
                    Turgid Membrane
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experiment Tabs */}
          <Tabs defaultValue="observations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="observations">Observations</TabsTrigger>
              <TabsTrigger value="data">Data Analysis</TabsTrigger>
              <TabsTrigger value="theory">Theory</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
            </TabsList>

            <TabsContent value="observations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Experiment Observations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {experimentState.observations.length === 0 ? (
                      <p className="text-gray-500 italic">
                        No observations recorded yet. Start the experiment and add observations!
                      </p>
                    ) : (
                      experimentState.observations.map((obs, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded border-l-4 border-blue-500">
                          {obs}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Analysis & Calculations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Osmotic Pressure Calculation</h4>
                        <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                          π = iMRT
                          <br />π = Osmotic Pressure
                          <br />i = van't Hoff factor
                          <br />M = Molarity
                          <br />R = Gas constant
                          <br />T = Temperature
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Water Potential</h4>
                        <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                          Ψ = Ψₛ + Ψₚ
                          <br />Ψ = Water Potential
                          <br />
                          Ψₛ = Solute Potential
                          <br />
                          Ψₚ = Pressure Potential
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Current Experiment Data</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 p-2">Time (min)</th>
                              <th className="border border-gray-300 p-2">Cell Size (%)</th>
                              <th className="border border-gray-300 p-2">Internal Conc. (%)</th>
                              <th className="border border-gray-300 p-2">External Conc. (%)</th>
                              <th className="border border-gray-300 p-2">Water Movement</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 p-2">
                                {Math.floor(experimentState.timeElapsed / 60)}
                              </td>
                              <td className="border border-gray-300 p-2">{experimentState.cellSize.toFixed(1)}</td>
                              <td className="border border-gray-300 p-2">
                                {experimentState.concentration.inside.toFixed(1)}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {experimentState.concentration.outside.toFixed(1)}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {experimentState.waterMovement.toFixed(2)} mL
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Osmosis Theory & CBC Curriculum Alignment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">What is Osmosis?</h4>
                      <p className="text-gray-700">
                        Osmosis is the movement of water molecules across a semi-permeable membrane from an area of
                        lower solute concentration to an area of higher solute concentration. This process continues
                        until equilibrium is reached.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Concepts (Grade 9 CBC)</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Semi-permeable membranes and selective permeability</li>
                        <li>Concentration gradients and equilibrium</li>
                        <li>Hypotonic, isotonic, and hypertonic solutions</li>
                        <li>Turgor pressure in plant cells</li>
                        <li>Plasmolysis and deplasmolysis</li>
                        <li>Water potential and osmotic pressure</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">CBC Learning Outcomes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {OSMOSIS_EXPERIMENTS[0].learningOutcomes.map((outcome, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Real-World Applications</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Plant water uptake and transport</li>
                        <li>Food preservation (salting, drying)</li>
                        <li>Medical treatments (IV fluids, dialysis)</li>
                        <li>Water purification systems</li>
                        <li>Agricultural irrigation practices</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Osmosis Assessment - 5 Questions</CardTitle>
                  <p className="text-sm text-gray-600">Answer all questions based on your experiment observations</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-semibold mb-2 text-blue-800">Question 1: Process Understanding (4 marks)</h4>
                      <p className="mb-3">
                        Explain what happens to the plant cell when it is placed in a{" "}
                        <strong>hypotonic solution</strong>. Describe the movement of water molecules and the final
                        state of the cell.
                      </p>
                      <textarea
                        className="w-full p-3 border rounded resize-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Explain the process step by step, including: direction of water movement, reason for movement, and final cell condition..."
                      />
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50">
                      <h4 className="font-semibold mb-2 text-green-800">Question 2: Data Analysis (5 marks)</h4>
                      <p className="mb-3">
                        Based on your experiment data, calculate the <strong>rate of water movement</strong> and explain
                        what factors affect this rate. Current data: Cell size changed from 100% to{" "}
                        {experimentState.cellSize.toFixed(1)}% in {Math.floor(experimentState.timeElapsed / 60)}{" "}
                        minutes.
                      </p>
                      <textarea
                        className="w-full p-3 border rounded resize-none focus:ring-2 focus:ring-green-500"
                        rows={4}
                        placeholder="Show your calculations and identify 3 factors that affect osmosis rate..."
                      />
                    </div>

                    <div className="p-4 border rounded-lg bg-purple-50">
                      <h4 className="font-semibold mb-2 text-purple-800">
                        Question 3: Concentration Effects (4 marks)
                      </h4>
                      <p className="mb-3">
                        Compare what would happen if you placed the same cell in solutions with different
                        concentrations:
                        <br />• Solution A: 5% salt concentration
                        <br />• Solution B: 15% salt concentration
                        <br />• Solution C: 25% salt concentration
                      </p>
                      <textarea
                        className="w-full p-3 border rounded resize-none focus:ring-2 focus:ring-purple-500"
                        rows={4}
                        placeholder="Predict and explain the cell behavior in each solution, using terms: hypotonic, isotonic, hypertonic..."
                      />
                    </div>

                    <div className="p-4 border rounded-lg bg-orange-50">
                      <h4 className="font-semibold mb-2 text-orange-800">
                        Question 4: Real-World Application (4 marks)
                      </h4>
                      <p className="mb-3">
                        A farmer in Kenya notices that his crops are wilting even though he waters them regularly. He
                        discovers the soil has high salt content due to over-fertilization. Using your knowledge of
                        osmosis, explain why the plants are wilting and suggest a solution.
                      </p>
                      <textarea
                        className="w-full p-3 border rounded resize-none focus:ring-2 focus:ring-orange-500"
                        rows={4}
                        placeholder="Explain the osmotic problem and provide practical solutions for the farmer..."
                      />
                    </div>

                    <div className="p-4 border rounded-lg bg-red-50">
                      <h4 className="font-semibold mb-2 text-red-800">Question 5: Critical Thinking (3 marks)</h4>
                      <p className="mb-3">
                        Predict what would happen if the cell membrane suddenly became{" "}
                        <strong>completely permeable</strong>
                        to all substances (not just water). How would this affect osmosis and the cell's survival?
                      </p>
                      <textarea
                        className="w-full p-3 border rounded resize-none focus:ring-2 focus:ring-red-500"
                        rows={4}
                        placeholder="Analyze the consequences of losing selective permeability..."
                      />
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-600">Total: 20 marks | Time: 30 minutes</div>
                      <Button className="bg-blue-600 hover:bg-blue-700">Submit Assessment</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Guidance Panel */}
        <div className="space-y-6">
          <AIGuidancePanel
            experimentType="osmosis"
            gradeLevel="grade-9"
            currentStep={experimentState.currentStep}
            studentProgress={studentProgress}
          />

          <ScientificNotebook
            experimentId={selectedExperiment}
            observations={experimentState.observations}
            onAddObservation={addObservation}
          />
        </div>
      </div>
    </div>
  )
}
