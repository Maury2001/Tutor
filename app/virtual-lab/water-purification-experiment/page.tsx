"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Droplets,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Beaker,
  Thermometer,
  Timer,
  Eye,
  MessageCircle,
  BookOpen,
  Target,
  ArrowRight,
  ArrowLeft,
  TestTube,
  Filter,
  Zap,
  Flame,
  Microscope,
  ClipboardCheck,
  TrendingUp,
  Award,
} from "lucide-react"
import Link from "next/link"

interface ExperimentStep {
  id: number
  title: string
  description: string
  materials: string[]
  procedure: string[]
  safetyNotes: string[]
  expectedResults: string
  timeEstimate: string
  completed: boolean
  observations: string
  results: any
}

interface WaterSample {
  id: string
  name: string
  initialPH: number
  initialTurbidity: number
  initialBacteria: number
  currentPH: number
  currentTurbidity: number
  currentBacteria: number
  treatments: string[]
  color: string
}

export default function WaterPurificationExperiment() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timer, setTimer] = useState(0)
  const [experimentProgress, setExperimentProgress] = useState(0)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content:
        "Welcome to the Water Purification Methods experiment! I'm your AI lab assistant. I'll guide you through each step and help answer any questions. Ready to start? 🧪💧",
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")

  const [waterSamples, setWaterSamples] = useState<WaterSample[]>([
    {
      id: "clean",
      name: "Clean Water",
      initialPH: 7.0,
      initialTurbidity: 0,
      initialBacteria: 0,
      currentPH: 7.0,
      currentTurbidity: 0,
      currentBacteria: 0,
      treatments: [],
      color: "#87CEEB",
    },
    {
      id: "muddy",
      name: "Muddy Water",
      initialPH: 6.5,
      initialTurbidity: 85,
      initialBacteria: 1200,
      currentPH: 6.5,
      currentTurbidity: 85,
      currentBacteria: 1200,
      treatments: [],
      color: "#8B4513",
    },
    {
      id: "contaminated",
      name: "Contaminated Water",
      initialPH: 5.8,
      initialTurbidity: 45,
      initialBacteria: 2500,
      currentPH: 5.8,
      currentTurbidity: 45,
      currentBacteria: 2500,
      treatments: [],
      color: "#696969",
    },
  ])

  const experimentSteps: ExperimentStep[] = [
    {
      id: 1,
      title: "Initial Water Quality Assessment",
      description: "Test and record the quality of different water samples using virtual testing tools.",
      materials: ["Virtual water samples", "pH testing strips", "Turbidity meter", "Microscope simulation"],
      procedure: [
        "Select each water sample for testing",
        "Use pH strips to measure acidity levels",
        "Measure turbidity (cloudiness) using the digital meter",
        "Use microscope to count bacteria colonies",
        "Record all baseline measurements in your data sheet",
      ],
      safetyNotes: [
        "Handle virtual samples carefully",
        "Record baseline measurements accurately",
        "Ensure proper calibration of virtual instruments",
      ],
      expectedResults: "Complete baseline data for all three water samples showing different contamination levels",
      timeEstimate: "10 minutes",
      completed: false,
      observations: "",
      results: null,
    },
    {
      id: 2,
      title: "Physical Filtration Methods",
      description: "Test sand, charcoal, and cloth filtration methods on contaminated water samples.",
      materials: ["Sand filter", "Charcoal filter", "Cloth filter", "Collection containers"],
      procedure: [
        "Set up three different filtration systems",
        "Pour muddy water sample through sand filter",
        "Filter contaminated water through charcoal filter",
        "Test cloth filtration on both samples",
        "Collect filtered water in separate containers",
        "Observe and record changes in appearance",
      ],
      safetyNotes: ["Check filter integrity before use", "Ensure proper flow rates", "Observe changes carefully"],
      expectedResults:
        "Visibly cleaner water samples with reduced turbidity, especially from sand and charcoal filters",
      timeEstimate: "15 minutes",
      completed: false,
      observations: "",
      results: null,
    },
    {
      id: 3,
      title: "Chemical Treatment Testing",
      description: "Apply chemical treatment methods including chlorination and water purification tablets.",
      materials: ["Chlorine solution", "Water purification tablets", "Measuring tools", "Timer"],
      procedure: [
        "Add appropriate amount of chlorine to contaminated sample",
        "Dissolve purification tablet in muddy water sample",
        "Stir solutions gently and start timer",
        "Wait for recommended contact time (5 minutes)",
        "Observe color and odor changes",
        "Test pH levels after treatment",
      ],
      safetyNotes: [
        "Use proper chemical handling procedures",
        "Follow dosage instructions carefully",
        "Allow proper reaction time",
      ],
      expectedResults: "Reduced bacteria count and improved water clarity, slight chlorine odor in treated samples",
      timeEstimate: "12 minutes",
      completed: false,
      observations: "",
      results: null,
    },
    {
      id: 4,
      title: "Heat Treatment (Boiling)",
      description: "Test the effectiveness of boiling as a water purification method.",
      materials: ["Virtual heating element", "Thermometer", "Timer", "Heat-resistant containers"],
      procedure: [
        "Place water samples in heat-resistant containers",
        "Heat water to 100°C (boiling point)",
        "Maintain boiling for 3 minutes",
        "Monitor temperature throughout process",
        "Allow samples to cool safely",
        "Record temperature and time data",
      ],
      safetyNotes: [
        "Monitor temperature carefully",
        "Ensure complete boiling process",
        "Handle hot containers with care",
      ],
      expectedResults: "Complete elimination of bacteria, no change in chemical contamination or turbidity",
      timeEstimate: "10 minutes",
      completed: false,
      observations: "",
      results: null,
    },
    {
      id: 5,
      title: "Comparative Analysis",
      description: "Test all treated water samples and compare effectiveness of different methods.",
      materials: ["All treated samples", "Testing equipment", "Data analysis tools"],
      procedure: [
        "Test pH levels of all treated samples",
        "Measure turbidity of each sample",
        "Count bacteria colonies using microscope",
        "Compare results with initial baseline data",
        "Calculate percentage improvement for each method",
        "Rank methods by effectiveness",
      ],
      safetyNotes: [
        "Test all samples systematically",
        "Record detailed observations",
        "Ensure consistent testing procedures",
      ],
      expectedResults: "Clear comparison data showing relative effectiveness of each purification method",
      timeEstimate: "15 minutes",
      completed: false,
      observations: "",
      results: null,
    },
    {
      id: 6,
      title: "Results Analysis and Conclusions",
      description: "Analyze results, draw conclusions, and connect findings to real-world applications in Kenya.",
      materials: ["Data analysis tools", "Calculator", "Research resources"],
      procedure: [
        "Create graphs comparing all treatment methods",
        "Identify most effective method for each type of contamination",
        "Calculate cost-effectiveness of each method",
        "Research real-world applications in Kenya",
        "Write conclusions based on evidence",
        "Suggest improvements or combinations of methods",
      ],
      safetyNotes: [
        "Consider all evidence objectively",
        "Connect findings to learning objectives",
        "Support conclusions with data",
      ],
      expectedResults:
        "Valid scientific conclusions about water purification effectiveness with real-world applications",
      timeEstimate: "18 minutes",
      completed: false,
      observations: "",
      results: null,
    },
  ]

  const [steps, setSteps] = useState(experimentSteps)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  // Calculate progress
  useEffect(() => {
    const completedSteps = steps.filter((step) => step.completed).length
    setExperimentProgress((completedSteps / steps.length) * 100)
  }, [steps])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startExperiment = () => {
    setIsRunning(true)
    addChatMessage(
      "assistant",
      "Great! Let's begin with Step 1: Initial Water Quality Assessment. Click on each water sample to test its properties. 🔬",
    )
  }

  const pauseExperiment = () => {
    setIsRunning(false)
    addChatMessage(
      "assistant",
      "Experiment paused. Take your time to review your observations. Click resume when ready to continue! ⏸️",
    )
  }

  const resetExperiment = () => {
    setIsRunning(false)
    setTimer(0)
    setCurrentStep(0)
    setSteps(experimentSteps)
    setWaterSamples((prev) =>
      prev.map((sample) => ({
        ...sample,
        currentPH: sample.initialPH,
        currentTurbidity: sample.initialTurbidity,
        currentBacteria: sample.initialBacteria,
        treatments: [],
      })),
    )
    addChatMessage(
      "assistant",
      "Experiment reset! Ready to start fresh? Let's explore water purification methods together! 🔄",
    )
  }

  const completeStep = () => {
    setSteps((prev) => prev.map((step, index) => (index === currentStep ? { ...step, completed: true } : step)))

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      addChatMessage(
        "assistant",
        `Excellent work! Moving to Step ${currentStep + 2}: ${steps[currentStep + 1].title}. ${getStepGuidance(currentStep + 1)}`,
      )
    } else {
      setIsRunning(false)
      addChatMessage(
        "assistant",
        "🎉 Congratulations! You've completed the Water Purification Methods experiment! Your findings will help understand how to provide clean water in Kenya. Well done! 🏆",
      )
    }
  }

  const getStepGuidance = (stepIndex: number) => {
    const guidance = [
      "Start by testing each water sample. Notice the differences in color, pH, and contamination levels.",
      "Try different filters and observe how they affect water clarity. Which filter works best for muddy water?",
      "Chemical treatments are powerful! Observe how chlorine and tablets change the water properties.",
      "Boiling is a traditional method. Watch how heat affects bacteria but not chemical contamination.",
      "Now compare all your results! Which method worked best for each type of contamination?",
      "Time to analyze your data and think about real-world applications in Kenya!",
    ]
    return guidance[stepIndex] || "Keep up the great work!"
  }

  const addChatMessage = (role: string, content: string) => {
    setChatMessages((prev) => [...prev, { role, content }])
  }

  const sendChatMessage = () => {
    if (currentMessage.trim()) {
      addChatMessage("user", currentMessage)

      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "That's a great observation! In Kenya, many communities use similar methods. What do you think would work best in rural areas?",
          "Excellent question! The effectiveness depends on the type of contamination. Physical filters work well for particles, while chemical treatments target bacteria.",
          "You're thinking like a real scientist! Consider the cost and availability of materials when choosing purification methods for communities.",
          "That's exactly right! Boiling is widely used in Kenya because it's accessible, but it requires fuel. What alternatives might work?",
          "Great insight! Combining methods often gives the best results. Many water treatment plants use multiple steps.",
          "Perfect observation! The pH changes show how treatments affect water chemistry. This is important for taste and safety.",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        addChatMessage("assistant", randomResponse)
      }, 1000)

      setCurrentMessage("")
    }
  }

  const testWaterSample = (sampleId: string, testType: string) => {
    const sample = waterSamples.find((s) => s.id === sampleId)
    if (!sample) return

    let message = ""
    switch (testType) {
      case "ph":
        message = `${sample.name} pH Level: ${sample.currentPH} ${sample.currentPH < 6.5 ? "(Acidic - needs treatment)" : sample.currentPH > 8.5 ? "(Basic - needs treatment)" : "(Acceptable range)"}`
        break
      case "turbidity":
        message = `${sample.name} Turbidity: ${sample.currentTurbidity} NTU ${sample.currentTurbidity > 4 ? "(Too cloudy - needs filtration)" : "(Clear enough for drinking)"}`
        break
      case "bacteria":
        message = `${sample.name} Bacteria Count: ${sample.currentBacteria} CFU/ml ${sample.currentBacteria > 0 ? "(Contaminated - needs disinfection)" : "(Safe from bacteria)"}`
        break
    }

    addChatMessage("assistant", message)
  }

  const applyTreatment = (sampleId: string, treatment: string) => {
    setWaterSamples((prev) =>
      prev.map((sample) => {
        if (sample.id === sampleId) {
          const newSample = { ...sample, treatments: [...sample.treatments, treatment] }

          switch (treatment) {
            case "sand-filter":
              newSample.currentTurbidity = Math.max(0, sample.currentTurbidity * 0.2)
              newSample.color = sample.currentTurbidity > 50 ? "#B0C4DE" : sample.color
              break
            case "charcoal-filter":
              newSample.currentTurbidity = Math.max(0, sample.currentTurbidity * 0.1)
              newSample.currentPH = Math.min(8.0, sample.currentPH + 0.3)
              newSample.color = "#E6F3FF"
              break
            case "cloth-filter":
              newSample.currentTurbidity = Math.max(0, sample.currentTurbidity * 0.6)
              break
            case "chlorine":
              newSample.currentBacteria = 0
              newSample.currentPH = Math.max(6.5, sample.currentPH - 0.2)
              break
            case "purification-tablet":
              newSample.currentBacteria = Math.floor(sample.currentBacteria * 0.05)
              break
            case "boiling":
              newSample.currentBacteria = 0
              break
          }

          return newSample
        }
        return sample
      }),
    )

    const treatmentNames = {
      "sand-filter": "Sand Filtration",
      "charcoal-filter": "Charcoal Filtration",
      "cloth-filter": "Cloth Filtration",
      chlorine: "Chlorine Treatment",
      "purification-tablet": "Purification Tablet",
      boiling: "Boiling Treatment",
    }

    addChatMessage(
      "assistant",
      `Applied ${treatmentNames[treatment as keyof typeof treatmentNames]} to ${waterSamples.find((s) => s.id === sampleId)?.name}. Check the results! 🧪`,
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/virtual-lab/demo-creation">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Demo
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Droplets className="h-6 w-6 text-blue-500" />
                Water Purification Methods Experiment
              </h1>
              <p className="text-gray-600">Grade 7-9 • CBC Aligned • Interactive Virtual Lab</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Experiment Time</div>
              <div className="text-lg font-mono font-semibold">{formatTime(timer)}</div>
            </div>
            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={startExperiment} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  {timer === 0 ? "Start" : "Resume"}
                </Button>
              ) : (
                <Button onClick={pauseExperiment} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={resetExperiment} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Experiment Progress</span>
              <span className="text-sm text-gray-600">{Math.round(experimentProgress)}% Complete</span>
            </div>
            <Progress value={experimentProgress} className="w-full" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{steps.filter((s) => s.completed).length} steps completed</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Experiment Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Step */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    {currentStep + 1}
                  </div>
                  {steps[currentStep]?.title}
                  {steps[currentStep]?.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                </CardTitle>
                <CardDescription>{steps[currentStep]?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="procedure" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="procedure">Procedure</TabsTrigger>
                    <TabsTrigger value="materials">Materials</TabsTrigger>
                    <TabsTrigger value="safety">Safety</TabsTrigger>
                    <TabsTrigger value="observations">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="procedure" className="space-y-4">
                    <div className="space-y-3">
                      {steps[currentStep]?.procedure.map((step, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Timer className="h-4 w-4" />
                        Estimated time: {steps[currentStep]?.timeEstimate}
                      </div>
                      <Button onClick={completeStep} disabled={!isRunning} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Step
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="materials">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {steps[currentStep]?.materials.map((material, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Beaker className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{material}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="safety">
                    <div className="space-y-2">
                      {steps[currentStep]?.safetyNotes.map((note, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{note}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="observations">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="observations">Your Observations</Label>
                        <Textarea
                          id="observations"
                          placeholder="Record your observations, measurements, and thoughts here..."
                          value={steps[currentStep]?.observations || ""}
                          onChange={(e) => {
                            setSteps((prev) =>
                              prev.map((step, index) =>
                                index === currentStep ? { ...step, observations: e.target.value } : step,
                              ),
                            )
                          }}
                          className="mt-1"
                          rows={4}
                        />
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-1">Expected Results:</h4>
                        <p className="text-sm text-blue-800">{steps[currentStep]?.expectedResults}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Water Samples Interactive Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Virtual Water Samples
                </CardTitle>
                <CardDescription>Click on samples to test them, apply treatments to see changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {waterSamples.map((sample) => (
                    <div key={sample.id} className="border rounded-lg p-4 space-y-3">
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: sample.color }}
                          onClick={() =>
                            addChatMessage(
                              "assistant",
                              `Selected ${sample.name} for testing. What would you like to test first?`,
                            )
                          }
                        />
                        <h4 className="font-medium">{sample.name}</h4>
                        {sample.treatments.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {sample.treatments.map((treatment, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {treatment}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>pH:</span>
                          <span
                            className={
                              sample.currentPH < 6.5 || sample.currentPH > 8.5 ? "text-red-600" : "text-green-600"
                            }
                          >
                            {sample.currentPH.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Turbidity:</span>
                          <span className={sample.currentTurbidity > 4 ? "text-red-600" : "text-green-600"}>
                            {sample.currentTurbidity.toFixed(0)} NTU
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bacteria:</span>
                          <span className={sample.currentBacteria > 0 ? "text-red-600" : "text-green-600"}>
                            {sample.currentBacteria} CFU/ml
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testWaterSample(sample.id, "ph")}
                            className="text-xs p-1"
                          >
                            <Thermometer className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testWaterSample(sample.id, "turbidity")}
                            className="text-xs p-1"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testWaterSample(sample.id, "bacteria")}
                            className="text-xs p-1"
                          >
                            <Microscope className="h-3 w-3" />
                          </Button>
                        </div>

                        {currentStep >= 1 && (
                          <div className="grid grid-cols-2 gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => applyTreatment(sample.id, "sand-filter")}
                              className="text-xs p-1"
                              disabled={sample.treatments.includes("sand-filter")}
                            >
                              <Filter className="h-3 w-3 mr-1" />
                              Sand
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => applyTreatment(sample.id, "charcoal-filter")}
                              className="text-xs p-1"
                              disabled={sample.treatments.includes("charcoal-filter")}
                            >
                              <Filter className="h-3 w-3 mr-1" />
                              Charcoal
                            </Button>
                          </div>
                        )}

                        {currentStep >= 2 && (
                          <div className="grid grid-cols-2 gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => applyTreatment(sample.id, "chlorine")}
                              className="text-xs p-1"
                              disabled={sample.treatments.includes("chlorine")}
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Chlorine
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => applyTreatment(sample.id, "purification-tablet")}
                              className="text-xs p-1"
                              disabled={sample.treatments.includes("purification-tablet")}
                            >
                              <TestTube className="h-3 w-3 mr-1" />
                              Tablet
                            </Button>
                          </div>
                        )}

                        {currentStep >= 3 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => applyTreatment(sample.id, "boiling")}
                            className="text-xs p-1 w-full"
                            disabled={sample.treatments.includes("boiling")}
                          >
                            <Flame className="h-3 w-3 mr-1" />
                            Boil Water
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Chat Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Lab Assistant
                </CardTitle>
                <CardDescription>Ask questions and get real-time guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 mb-4">
                  <div className="space-y-3">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] p-2 rounded-lg text-sm ${
                            message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a question..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendChatMessage} size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Step Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                        index === currentStep
                          ? "bg-blue-100 border border-blue-200"
                          : step.completed
                            ? "bg-green-50"
                            : "hover:bg-gray-50"
                      }`}
                      onClick={() => setCurrentStep(index)}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : index === currentStep
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.completed ? <CheckCircle className="h-3 w-3" /> : index + 1}
                      </div>
                      <span className="text-sm font-medium flex-1">{step.title}</span>
                      <span className="text-xs text-gray-500">{step.timeEstimate}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Understand different water purification methods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Compare effectiveness of filtration techniques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Analyze water quality parameters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Connect findings to Kenya's water challenges</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Completion Modal/Card */}
        {experimentProgress === 100 && (
          <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 Experiment Complete!</h3>
                <p className="text-green-700 mb-4">
                  Excellent work! You've successfully completed the Water Purification Methods experiment. Your findings
                  contribute to understanding how to provide clean water solutions in Kenya.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{formatTime(timer)}</div>
                    <div className="text-sm text-gray-600">Total Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{steps.length}</div>
                    <div className="text-sm text-gray-600">Steps Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">A+</div>
                    <div className="text-sm text-gray-600">Grade Earned</div>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Results Analysis
                  </Button>
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" onClick={resetExperiment}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
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
