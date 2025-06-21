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
  Beaker,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Thermometer,
  Timer,
  MessageCircle,
  BookOpen,
  Target,
  ArrowRight,
  ArrowLeft,
  TestTube,
  Zap,
  Award,
  TrendingUp,
  Loader2,
} from "lucide-react"
import Link from "next/link"

interface ChemicalReaction {
  id: string
  name: string
  reactants: string[]
  products: string[]
  equation: string
  type: string
  color: string
  temperature: number
  gasProduced: boolean
  precipitate: boolean
  energyChange: "exothermic" | "endothermic" | "neutral"
}

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
}

export default function ChemicalReactionsPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timer, setTimer] = useState(0)
  const [experimentProgress, setExperimentProgress] = useState(0)
  const [selectedReaction, setSelectedReaction] = useState<string>("")
  const [reactionProgress, setReactionProgress] = useState(0)
  const [temperature, setTemperature] = useState(25)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content:
        "Welcome to the Chemical Reactions Laboratory! I'm your AI chemistry assistant. I'll guide you through different reaction types and help you understand chemical changes. Let's explore the fascinating world of chemical reactions! ⚗️🧪",
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isAIThinking, setIsAIThinking] = useState(false)

  const chemicalReactions: ChemicalReaction[] = [
    {
      id: "acid-base",
      name: "Acid-Base Neutralization",
      reactants: ["HCl", "NaOH"],
      products: ["NaCl", "H₂O"],
      equation: "HCl + NaOH → NaCl + H₂O",
      type: "Neutralization",
      color: "#87CEEB",
      temperature: 35,
      gasProduced: false,
      precipitate: false,
      energyChange: "exothermic",
    },
    {
      id: "combustion",
      name: "Methane Combustion",
      reactants: ["CH₄", "O₂"],
      products: ["CO₂", "H₂O"],
      equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
      type: "Combustion",
      color: "#FF6B35",
      temperature: 800,
      gasProduced: true,
      precipitate: false,
      energyChange: "exothermic",
    },
    {
      id: "precipitation",
      name: "Silver Chloride Formation",
      reactants: ["AgNO₃", "NaCl"],
      products: ["AgCl", "NaNO₃"],
      equation: "AgNO₃ + NaCl → AgCl↓ + NaNO₃",
      type: "Precipitation",
      color: "#F5F5DC",
      temperature: 25,
      gasProduced: false,
      precipitate: true,
      energyChange: "neutral",
    },
    {
      id: "decomposition",
      name: "Water Electrolysis",
      reactants: ["H₂O"],
      products: ["H₂", "O₂"],
      equation: "2H₂O → 2H₂ + O₂",
      type: "Decomposition",
      color: "#E0F6FF",
      temperature: 25,
      gasProduced: true,
      precipitate: false,
      energyChange: "endothermic",
    },
    {
      id: "synthesis",
      name: "Ammonia Synthesis",
      reactants: ["N₂", "H₂"],
      products: ["NH₃"],
      equation: "N₂ + 3H₂ → 2NH₃",
      type: "Synthesis",
      color: "#98FB98",
      temperature: 450,
      gasProduced: true,
      precipitate: false,
      energyChange: "exothermic",
    },
  ]

  const experimentSteps: ExperimentStep[] = [
    {
      id: 1,
      title: "Laboratory Safety and Setup",
      description: "Review safety protocols and prepare the virtual chemistry laboratory for experiments.",
      materials: ["Virtual fume hood", "Safety goggles", "Lab coat", "Chemical inventory", "Emergency procedures"],
      procedure: [
        "Put on virtual safety equipment (goggles, lab coat)",
        "Check fume hood ventilation system",
        "Review Material Safety Data Sheets (MSDS)",
        "Prepare clean glassware and measuring tools",
        "Set up data recording sheets",
        "Test emergency shower and eyewash stations",
      ],
      safetyNotes: [
        "Always wear appropriate PPE in the lab",
        "Never mix chemicals without proper knowledge",
        "Keep workspace clean and organized",
        "Know location of safety equipment",
      ],
      expectedResults: "Safe laboratory environment ready for chemical experiments",
      timeEstimate: "10 minutes",
      completed: false,
      observations: "",
    },
    {
      id: 2,
      title: "Acid-Base Neutralization",
      description: "Observe the neutralization reaction between hydrochloric acid and sodium hydroxide.",
      materials: ["HCl solution", "NaOH solution", "pH indicator", "Thermometer", "Beakers"],
      procedure: [
        "Measure 50mL of 0.1M HCl in a beaker",
        "Add universal indicator to observe pH changes",
        "Slowly add 0.1M NaOH drop by drop",
        "Monitor temperature changes with thermometer",
        "Record pH changes and color transitions",
        "Continue until neutralization point is reached",
      ],
      safetyNotes: [
        "Handle acids and bases with extreme care",
        "Add base to acid slowly to prevent splashing",
        "Monitor temperature to avoid overheating",
      ],
      expectedResults: "pH changes from acidic to neutral, temperature increases, color changes observed",
      timeEstimate: "15 minutes",
      completed: false,
      observations: "",
    },
    {
      id: 3,
      title: "Precipitation Reactions",
      description: "Create precipitates by mixing solutions and observe insoluble product formation.",
      materials: ["AgNO₃ solution", "NaCl solution", "Filter paper", "Funnel", "Beakers"],
      procedure: [
        "Prepare 0.1M silver nitrate solution",
        "Prepare 0.1M sodium chloride solution",
        "Mix equal volumes of both solutions",
        "Observe immediate precipitate formation",
        "Filter the mixture to separate precipitate",
        "Examine the white silver chloride precipitate",
      ],
      safetyNotes: [
        "Silver nitrate can stain skin and clothing",
        "Handle all chemicals with care",
        "Dispose of silver waste properly",
      ],
      expectedResults: "White precipitate of AgCl forms immediately upon mixing",
      timeEstimate: "12 minutes",
      completed: false,
      observations: "",
    },
    {
      id: 4,
      title: "Gas Evolution Reactions",
      description: "Study reactions that produce gases and observe their properties.",
      materials: ["Zinc metal", "HCl solution", "Gas collection tube", "Wooden splint", "Matches"],
      procedure: [
        "Place zinc granules in a test tube",
        "Add dilute hydrochloric acid",
        "Observe vigorous bubbling (hydrogen gas)",
        "Collect gas in inverted test tube",
        "Test gas with burning wooden splint",
        "Listen for characteristic 'pop' sound",
      ],
      safetyNotes: [
        "Hydrogen gas is highly flammable",
        "Keep flames away from gas collection",
        "Ensure good ventilation",
      ],
      expectedResults: "Hydrogen gas produced, confirmed by 'pop' test with burning splint",
      timeEstimate: "10 minutes",
      completed: false,
      observations: "",
    },
    {
      id: 5,
      title: "Combustion Analysis",
      description: "Analyze combustion reactions and their products using virtual flame tests.",
      materials: ["Methane gas", "Oxygen supply", "Bunsen burner", "Lime water", "Collection apparatus"],
      procedure: [
        "Set up controlled combustion apparatus",
        "Ignite methane in presence of oxygen",
        "Observe blue flame and heat production",
        "Collect combustion products",
        "Test for CO₂ using lime water",
        "Test for water vapor using cobalt chloride paper",
      ],
      safetyNotes: [
        "Handle flammable gases with extreme caution",
        "Ensure proper ventilation",
        "Keep fire extinguisher nearby",
      ],
      expectedResults: "Blue flame, CO₂ turns lime water milky, water vapor detected",
      timeEstimate: "18 minutes",
      completed: false,
      observations: "",
    },
    {
      id: 6,
      title: "Reaction Analysis and Conclusions",
      description: "Analyze all observed reactions, classify them, and draw scientific conclusions.",
      materials: ["Data sheets", "Calculator", "Periodic table", "Reference materials"],
      procedure: [
        "Review all experimental data collected",
        "Classify each reaction by type",
        "Calculate theoretical vs actual yields",
        "Identify patterns in reaction behavior",
        "Connect observations to chemical theory",
        "Prepare comprehensive lab report",
      ],
      safetyNotes: [
        "Review all safety incidents",
        "Properly dispose of all chemicals",
        "Clean and store equipment properly",
      ],
      expectedResults: "Complete understanding of reaction types with supporting evidence",
      timeEstimate: "20 minutes",
      completed: false,
      observations: "",
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
      "Excellent! Let's begin with laboratory safety. Remember, safety is our top priority in chemistry. Click through each safety step carefully! 🥽⚗️",
    )
  }

  const pauseExperiment = () => {
    setIsRunning(false)
    addChatMessage("assistant", "Experiment paused. Take time to review your observations and data. Safety first! ⏸️")
  }

  const resetExperiment = () => {
    setIsRunning(false)
    setTimer(0)
    setCurrentStep(0)
    setSteps(experimentSteps)
    setReactionProgress(0)
    setTemperature(25)
    addChatMessage(
      "assistant",
      "Laboratory reset! Ready to explore chemical reactions again? Let's be safe and systematic! 🔄",
    )
  }

  const completeStep = () => {
    setSteps((prev) => prev.map((step, index) => (index === currentStep ? { ...step, completed: true } : step)))

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      addChatMessage(
        "assistant",
        `Great work! Moving to Step ${currentStep + 2}: ${steps[currentStep + 1].title}. ${getStepGuidance(currentStep + 1)}`,
      )
    } else {
      setIsRunning(false)
      addChatMessage(
        "assistant",
        "🎉 Outstanding! You've completed the Chemical Reactions laboratory! You now understand different reaction types and their characteristics. Excellent scientific work! 🏆⚗️",
      )
    }
  }

  const getStepGuidance = (stepIndex: number) => {
    const guidance = [
      "Safety first! Make sure you understand all safety protocols before handling any chemicals.",
      "Watch the color changes and temperature rise as acid and base neutralize each other.",
      "Observe how two clear solutions can create a solid precipitate instantly!",
      "Listen for the 'pop' sound - that's hydrogen gas being produced!",
      "Notice the blue flame and test for the products of combustion.",
      "Time to analyze all your data and draw scientific conclusions!",
    ]
    return guidance[stepIndex] || "Keep up the excellent scientific work!"
  }

  const addChatMessage = (role: string, content: string) => {
    setChatMessages((prev) => [...prev, { role, content }])
  }

  const sendChatMessage = async () => {
    if (currentMessage.trim()) {
      addChatMessage("user", currentMessage)
      setIsAIThinking(true)

      setTimeout(() => {
        const response = getContextualAIResponse(currentMessage, [], chemicalReactions, currentStep)
        addChatMessage("assistant", response)
        setIsAIThinking(false)
      }, 1500)

      setCurrentMessage("")
    }
  }

  const getContextualAIResponse = (
    question: string,
    reactants: string[],
    reactions: ChemicalReaction[],
    step: number,
  ) => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("reaction") || lowerQuestion.includes("chemical")) {
      return `Great question! Chemical reactions involve breaking and forming bonds between atoms. You can identify them by observing color changes, gas production, temperature changes, or precipitate formation. What changes have you noticed?`
    }

    if (lowerQuestion.includes("safety") || lowerQuestion.includes("danger")) {
      return `Excellent safety awareness! Always wear protective equipment, work in well-ventilated areas, and never mix unknown chemicals. In our virtual lab, we can safely observe reactions that might be dangerous in real life.`
    }

    if (lowerQuestion.includes("temperature") || lowerQuestion.includes("heat")) {
      return `Temperature is crucial in chemical reactions! Higher temperatures usually increase reaction rates by giving molecules more energy to collide and react. Some reactions release heat (exothermic) while others absorb heat (endothermic).`
    }

    if (lowerQuestion.includes("kenya") || lowerQuestion.includes("real") || lowerQuestion.includes("life")) {
      return `Fantastic connection! In Kenya, chemical reactions are everywhere: cooking ugali (starch gelatinization), cement production, tea fermentation, and soap making. Understanding chemistry helps in agriculture, industry, and daily life!`
    }

    if (lowerQuestion.includes("step") || lowerQuestion.includes("procedure")) {
      return `You're on step ${step + 1}! ${getStepGuidance(step)} Take your time to observe carefully - good scientists are careful observers!`
    }

    const defaultResponses = [
      "Excellent question! Chemical reactions are all about atoms rearranging to form new substances with different properties.",
      "Great curiosity! Look for evidence of chemical change: color changes, gas bubbles, temperature changes, or new substances forming.",
      "Perfect observation! Chemistry is about understanding how and why substances change when they interact.",
      "Wonderful inquiry! Keep asking questions - that's how scientists discover new things!",
      "Great thinking! Chemical reactions follow patterns and rules that help us predict what will happen.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const startReaction = (reactionId: string) => {
    setSelectedReaction(reactionId)
    setReactionProgress(0)
    const reaction = chemicalReactions.find((r) => r.id === reactionId)
    if (reaction) {
      addChatMessage(
        "assistant",
        `Starting ${reaction.name}! Watch for ${reaction.type.toLowerCase()} characteristics.`,
      )

      // Simulate reaction progress
      const interval = setInterval(() => {
        setReactionProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            addChatMessage(
              "assistant",
              `Reaction complete! Notice the ${reaction.energyChange} energy change and ${reaction.precipitate ? "precipitate formation" : "product formation"}.`,
            )
            return 100
          }
          return prev + 10
        })
      }, 500)
    }
  }

  const getReactionColor = (reactionId: string, progress: number) => {
    const reaction = chemicalReactions.find((r) => r.id === reactionId)
    if (!reaction || progress === 0) return "#E5E7EB"

    const opacity = Math.min(progress / 100, 1)
    const color = reaction.color
    return `${color}${Math.floor(opacity * 255)
      .toString(16)
      .padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/virtual-lab">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Virtual Lab
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Beaker className="h-6 w-6 text-purple-500" />
                Chemical Reactions Laboratory
              </h1>
              <p className="text-gray-600">Grade 7-9 • CBC Aligned • Interactive Chemistry Lab</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Lab Time</div>
              <div className="text-lg font-mono font-semibold">{formatTime(timer)}</div>
            </div>
            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={startExperiment} className="bg-purple-600 hover:bg-purple-700">
                  <Play className="h-4 w-4 mr-2" />
                  {timer === 0 ? "Start Lab" : "Resume"}
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
              <span className="text-sm font-medium">Laboratory Progress</span>
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
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
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
                          <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
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
                      <Button
                        onClick={completeStep}
                        disabled={!isRunning}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Step
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="materials">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {steps[currentStep]?.materials.map((material, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <TestTube className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">{material}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="safety">
                    <div className="space-y-2">
                      {steps[currentStep]?.safetyNotes.map((note, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
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
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-1">Expected Results:</h4>
                        <p className="text-sm text-purple-800">{steps[currentStep]?.expectedResults}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Interactive Reaction Simulator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Interactive Reaction Simulator
                </CardTitle>
                <CardDescription>Click on reactions to simulate them and observe their properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chemicalReactions.map((reaction) => (
                    <div key={reaction.id} className="border rounded-lg p-4 space-y-3">
                      <div className="text-center">
                        <h4 className="font-medium">{reaction.name}</h4>
                        <p className="text-sm text-gray-600 font-mono">{reaction.equation}</p>
                        <Badge className="mt-1" variant="secondary">
                          {reaction.type}
                        </Badge>
                      </div>

                      <div
                        className="w-full h-16 rounded border-2 border-gray-300 flex items-center justify-center transition-all duration-500"
                        style={{
                          backgroundColor:
                            selectedReaction === reaction.id
                              ? getReactionColor(reaction.id, reactionProgress)
                              : "#F3F4F6",
                        }}
                      >
                        {selectedReaction === reaction.id && reactionProgress > 0 && (
                          <div className="text-center">
                            <div className="text-sm font-medium">
                              {reactionProgress < 100 ? "Reacting..." : "Complete!"}
                            </div>
                            <div className="text-xs text-gray-600">{reactionProgress}%</div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Energy Change:</span>
                          <span
                            className={
                              reaction.energyChange === "exothermic"
                                ? "text-red-600"
                                : reaction.energyChange === "endothermic"
                                  ? "text-blue-600"
                                  : "text-gray-600"
                            }
                          >
                            {reaction.energyChange}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gas Produced:</span>
                          <span className={reaction.gasProduced ? "text-green-600" : "text-gray-600"}>
                            {reaction.gasProduced ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Precipitate:</span>
                          <span className={reaction.precipitate ? "text-yellow-600" : "text-gray-600"}>
                            {reaction.precipitate ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => startReaction(reaction.id)}
                        disabled={selectedReaction === reaction.id && reactionProgress < 100}
                        className="w-full"
                      >
                        {selectedReaction === reaction.id && reactionProgress < 100 ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Reacting...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Reaction
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Chemistry Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Chemistry Assistant
                </CardTitle>
                <CardDescription>Ask questions about chemical reactions and get guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 mb-4">
                  <div className="space-y-3">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] p-3 rounded-lg text-sm ${
                            message.role === "user"
                              ? "bg-purple-500 text-white rounded-br-none"
                              : "bg-gray-100 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isAIThinking && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none text-sm">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-3 w-3 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                            AI is thinking...
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about reactions, safety, procedures..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                    className="flex-1"
                    disabled={isAIThinking}
                  />
                  <Button onClick={sendChatMessage} size="sm" disabled={isAIThinking || !currentMessage.trim()}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Help Buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage("What are chemical reactions?")
                      setTimeout(() => sendChatMessage(), 100)
                    }}
                    className="text-xs"
                  >
                    What are reactions?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage("How do I identify a chemical change?")
                      setTimeout(() => sendChatMessage(), 100)
                    }}
                    className="text-xs"
                  >
                    Identify changes?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage("Safety in chemistry?")
                      setTimeout(() => sendChatMessage(), 100)
                    }}
                    className="text-xs"
                  >
                    Safety tips?
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Temperature Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Temperature Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Current Temperature: {temperature}°C</Label>
                    <Input
                      type="range"
                      min="0"
                      max="100"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Temperature affects reaction rates:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Higher temperature = faster reactions</li>
                      <li>Lower temperature = slower reactions</li>
                      <li>Some reactions need specific temperatures</li>
                    </ul>
                  </div>
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
                    <span>Identify different types of chemical reactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Observe evidence of chemical changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Understand energy changes in reactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Apply safety protocols in chemistry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Connect reactions to real-world applications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Completion Modal/Card */}
        {experimentProgress === 100 && (
          <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-purple-800 mb-2">🎉 Chemistry Lab Complete!</h3>
                <p className="text-purple-700 mb-4">
                  Excellent work! You've successfully completed the Chemical Reactions laboratory and learned about
                  different reaction types, safety protocols, and chemical evidence.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{formatTime(timer)}</div>
                    <div className="text-sm text-gray-600">Total Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{steps.length}</div>
                    <div className="text-sm text-gray-600">Steps Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">A+</div>
                    <div className="text-sm text-gray-600">Chemistry Grade</div>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analysis
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
