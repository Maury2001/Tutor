"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trees, ArrowLeft, Play, Pause, RotateCcw, Sun, Droplets, Thermometer } from "lucide-react"
import Link from "next/link"
import { AIGuidancePanel } from "@/components/virtual-lab/ai-guidance-panel"
import { AILabAssistant } from "@/components/virtual-lab/ai-lab-assistant"

export default function EcosystemExperiment() {
  const [isRunning, setIsRunning] = useState(false)
  const [timer, setTimer] = useState(0)
  const [temperature, setTemperature] = useState(25)
  const [rainfall, setRainfall] = useState(50)
  const [sunlight, setSunlight] = useState(75)
  const [windSpeed, setWindSpeed] = useState(10)
  const [selectedEcosystem, setSelectedEcosystem] = useState("savanna")
  const [quizCountdown, setQuizCountdown] = useState(15 * 60) // 15 minutes in seconds
  const [quizAvailable, setQuizAvailable] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)

  const [quizQuestions] = useState([
    {
      id: 1,
      question: "What percentage of energy is transferred from producers to primary consumers?",
      options: ["100%", "50%", "10%", "1%"],
      correct: 2,
      explanation: "Only about 10% of energy is transferred between trophic levels due to metabolic processes.",
    },
    {
      id: 2,
      question: "Which organisms are at the first trophic level?",
      options: ["Primary consumers", "Secondary consumers", "Producers", "Decomposers"],
      correct: 2,
      explanation:
        "Producers (plants) are at the first trophic level as they convert solar energy into chemical energy.",
    },
    {
      id: 3,
      question: "What role do decomposers play in the ecosystem?",
      options: ["Convert solar energy", "Hunt other animals", "Recycle nutrients", "Control temperature"],
      correct: 2,
      explanation: "Decomposers break down dead organisms and return nutrients to the soil for producers to use.",
    },
    {
      id: 4,
      question: "Why do food chains rarely have more than 4-5 trophic levels?",
      options: ["Not enough space", "Energy loss at each level", "Too much competition", "Climate limitations"],
      correct: 1,
      explanation:
        "Energy loss (about 90%) at each trophic level means there's insufficient energy to support many levels.",
    },
  ])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (quizCountdown > 0) {
      interval = setInterval(() => {
        setQuizCountdown((prev) => {
          if (prev <= 1) {
            setQuizAvailable(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [quizCountdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const ecosystems = {
    savanna: {
      name: "Kenyan Savanna",
      description: "Grasslands with scattered trees, home to wildlife",
      image: "/placeholder.svg?height=300&width=400&text=Savanna+Ecosystem",
      organisms: [
        { name: "Acacia Trees", type: "producer", x: 15, y: 75, color: "bg-green-500", icon: "🌳" },
        { name: "Grass", type: "producer", x: 45, y: 85, color: "bg-green-400", icon: "🌱" },
        { name: "Insects", type: "primary", x: 60, y: 70, color: "bg-blue-500", icon: "🐛" },
        { name: "Zebras", type: "primary", x: 70, y: 55, color: "bg-blue-500", icon: "🦓" },
        { name: "Lions", type: "secondary", x: 25, y: 25, color: "bg-orange-500", icon: "🦁" },
        { name: "Birds", type: "secondary", x: 40, y: 30, color: "bg-orange-500", icon: "🐦" },
        { name: "Termites", type: "decomposer", x: 80, y: 80, color: "bg-amber-600", icon: "🐜" },
      ],
    },
    forest: {
      name: "Mountain Forest",
      description: "Dense forest ecosystem with diverse plant life",
      image: "/placeholder.svg?height=300&width=400&text=Forest+Ecosystem",
      organisms: [
        { name: "Cedar Trees", type: "producer", x: 20, y: 70, color: "bg-green-600", icon: "🌲" },
        { name: "Ferns", type: "producer", x: 50, y: 80, color: "bg-green-400", icon: "🌿" },
        { name: "Insects", type: "primary", x: 75, y: 75, color: "bg-blue-500", icon: "🐞" },
        { name: "Monkeys", type: "primary", x: 35, y: 35, color: "bg-blue-500", icon: "🐒" },
        { name: "Birds", type: "secondary", x: 65, y: 20, color: "bg-orange-500", icon: "🐦" },
      ],
    },
    coastal: {
      name: "Coastal Ecosystem",
      description: "Marine and terrestrial life interaction",
      image: "/placeholder.svg?height=300&width=400&text=Coastal+Ecosystem",
      organisms: [
        { name: "Mangroves", type: "producer", x: 25, y: 65, color: "bg-green-500", icon: "🌴" },
        { name: "Seaweed", type: "producer", x: 55, y: 75, color: "bg-green-400", icon: "🌊" },
        { name: "Crabs", type: "primary", x: 40, y: 50, color: "bg-blue-500", icon: "🦀" },
        { name: "Fish", type: "secondary", x: 70, y: 40, color: "bg-orange-500", icon: "🐟" },
        { name: "Coral", type: "decomposer", x: 80, y: 70, color: "bg-amber-600", icon: "🪸" },
      ],
    },
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Calculate score and complete quiz
      const score = selectedAnswers.reduce((total, answer, index) => {
        return total + (answer === quizQuestions[index].correct ? 1 : 0)
      }, 0)
      setQuizScore(score)
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setQuizCompleted(false)
    setQuizScore(0)
    setShowQuiz(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header with Ecosystem Relationships */}
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
                <Trees className="h-6 w-6 text-green-500" />
                Ecosystem Interdependence Simulation
              </h1>
              <p className="text-gray-600">Grade 7-9 • CBC Aligned • Biotic & Abiotic Interactions</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Simulation Time</div>
              <div className="text-lg font-mono font-semibold">{formatTime(timer)}</div>
            </div>
            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={() => setIsRunning(true)} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Ecosystem
                </Button>
              ) : (
                <Button onClick={() => setIsRunning(false)} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button
                onClick={() => {
                  setIsRunning(false)
                  setTimer(0)
                }}
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Quiz Countdown</div>
              <div
                className={`text-lg font-mono font-semibold ${quizCountdown === 0 ? "text-green-600" : "text-orange-600"}`}
              >
                {quizCountdown === 0 ? "Quiz Ready!" : formatCountdown(quizCountdown)}
              </div>
            </div>
            <Button
              onClick={() => setShowQuiz(true)}
              disabled={!quizAvailable}
              className={`${quizAvailable ? "bg-green-600 hover:bg-green-700 animate-pulse" : "bg-gray-400"}`}
            >
              {quizAvailable ? "🎯 Start Quiz" : "⏳ Quiz Locked"}
            </Button>
          </div>
        </div>

        {/* Biotic & Abiotic Relationships Panel */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">🦁 Biotic Interactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>Predation (Hunter-Prey)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span>Parasitism (Host-Parasite)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Symbiosis (Mutual Benefit)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Competition (Resource Rivalry)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-600 rounded-full animate-pulse"></div>
                <span>Saprophytic (Decomposition)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">🌡️ Abiotic Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Temperature: {temperature}°C</div>
              <div>Light: {sunlight}%</div>
              <div>Water: {rainfall}%</div>
              <div>Wind: {windSpeed} km/h</div>
              <div>Pressure: {Math.floor(Math.random() * 50 + 1000)} hPa</div>
              <div>pH: {(6.5 + Math.random() * 2).toFixed(1)}</div>
              <div>Salinity: {Math.floor(Math.random() * 35)} ppt</div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">⚡ Energy Flow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                <span>Solar Energy → Producers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                <span>Producers → Primary Consumers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <span>Primary → Secondary Consumers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                <span>All → Decomposers → Nutrients</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Ecosystem Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trees className="h-5 w-5" />
                  {ecosystems[selectedEcosystem as keyof typeof ecosystems].name}
                </CardTitle>
                <CardDescription>
                  {ecosystems[selectedEcosystem as keyof typeof ecosystems].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Ecosystem Visualization */}
                  <div className="relative bg-gradient-to-b from-blue-200 to-green-200 rounded-lg p-4 h-[600px] overflow-hidden">
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      {/* Dynamic Background Based on Environment */}
                      <div
                        className="w-full h-full transition-all duration-1000 relative"
                        style={{
                          background: `linear-gradient(to bottom, 
         rgba(135, 206, 235, ${sunlight / 100}) 0%, 
         rgba(34, 139, 34, ${(rainfall + sunlight) / 200}) 50%, 
         rgba(139, 69, 19, ${temperature / 50}) 100%)`,
                          filter: `brightness(${0.7 + sunlight / 200}) contrast(${0.8 + rainfall / 200})`,
                        }}
                      >
                        {/* Wind Effect - Moving clouds/particles */}
                        {windSpeed > 15 && (
                          <div className="absolute inset-0 pointer-events-none">
                            {[...Array(8)].map((_, i) => (
                              <div
                                key={`wind-${i}`}
                                className="absolute w-8 h-4 bg-white/20 rounded-full"
                                style={{
                                  left: `${-10 + i * 15}%`,
                                  top: `${10 + Math.random() * 30}%`,
                                  animationName: "windMove",
                                  animationDuration: `${3 + Math.random() * 2}s`,
                                  animationTimingFunction: "linear",
                                  animationIterationCount: "infinite",
                                  animationDelay: `${i * 0.5}s`,
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Add wind animation keyframes */}
                        <style jsx>{`
                          @keyframes windMove {
                            0% { transform: translateX(-100px) translateY(0px); opacity: 0; }
                            10% { opacity: 0.6; }
                            90% { opacity: 0.6; }
                            100% { transform: translateX(calc(100vw + 100px)) translateY(-20px); opacity: 0; }
                          }
                        `}</style>
                      </div>

                      {/* Weather Effects */}
                      {rainfall > 60 && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-0.5 h-4 bg-blue-300 opacity-60 animate-bounce"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${0.5 + Math.random()}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Dynamic Organisms with Live Behavior - Enhanced Food Chain/Web Visualization */}
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Corrected Energy Flow - Sun to All Organisms */}
                        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                          <defs>
                            {/* Arrow markers for energy flow */}
                            <marker id="solar-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
                              <polygon points="0 0, 10 4, 0 8" fill="#fbbf24" />
                            </marker>
                            <marker
                              id="producer-arrow"
                              markerWidth="10"
                              markerHeight="8"
                              refX="9"
                              refY="4"
                              orient="auto"
                            >
                              <polygon points="0 0, 10 4, 0 8" fill="#10b981" />
                            </marker>
                            <marker
                              id="primary-arrow"
                              markerWidth="10"
                              markerHeight="8"
                              refX="9"
                              refY="4"
                              orient="auto"
                            >
                              <polygon points="0 0, 10 4, 0 8" fill="#3b82f6" />
                            </marker>
                            <marker
                              id="secondary-arrow"
                              markerWidth="10"
                              markerHeight="8"
                              refX="9"
                              refY="4"
                              orient="auto"
                            >
                              <polygon points="0 0, 10 4, 0 8" fill="#f59e0b" />
                            </marker>
                            <marker
                              id="decomposer-arrow"
                              markerWidth="8"
                              markerHeight="6"
                              refX="7"
                              refY="3"
                              orient="auto"
                            >
                              <polygon points="0 0, 8 3, 0 6" fill="#8b5cf6" />
                            </marker>
                          </defs>

                          {/* Step 1: Sun to ALL Producers (100% solar energy) */}
                          {ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms
                            .filter((o) => o.type === "producer")
                            .map((producer, index) => (
                              <g key={`sun-to-producer-${index}`}>
                                <line
                                  x1="50%"
                                  y1="15%"
                                  x2={`${producer.x}%`}
                                  y2={`${producer.y}%`}
                                  stroke="#fbbf24"
                                  strokeWidth={isRunning ? "4" : "3"}
                                  strokeDasharray={isRunning ? "12,6" : "8,4"}
                                  markerEnd="url(#solar-arrow)"
                                  className={isRunning ? "animate-pulse" : ""}
                                  opacity="0.9"
                                />
                                {/* Energy percentage label */}
                                {isRunning && (
                                  <text
                                    x={`${(50 + producer.x) / 2}%`}
                                    y={`${(15 + producer.y) / 2 - 2}%`}
                                    fill="#f59e0b"
                                    fontSize="10"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    className="animate-pulse"
                                  >
                                    100%
                                  </text>
                                )}
                              </g>
                            ))}

                          {/* Step 2: Producers to Primary Consumers (10% energy transfer) */}
                          {ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms
                            .filter((o) => o.type === "primary")
                            .map((primary, pIndex) =>
                              ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms
                                .filter((o) => o.type === "producer")
                                .map((producer, prIndex) => (
                                  <g key={`producer-to-primary-${pIndex}-${prIndex}`}>
                                    <line
                                      x1={`${producer.x}%`}
                                      y1={`${producer.y}%`}
                                      x2={`${primary.x}%`}
                                      y2={`${primary.y}%`}
                                      stroke="#10b981"
                                      strokeWidth={isRunning ? "3" : "2"}
                                      strokeDasharray={isRunning ? "8,4" : "6,3"}
                                      markerEnd="url(#producer-arrow)"
                                      className={isRunning ? "animate-pulse" : ""}
                                      opacity="0.8"
                                    />
                                    {/* Energy transfer efficiency label */}
                                    {isRunning && prIndex === 0 && (
                                      <text
                                        x={`${(producer.x + primary.x) / 2}%`}
                                        y={`${(producer.y + primary.y) / 2 - 2}%`}
                                        fill="#10b981"
                                        fontSize="9"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        className="animate-pulse"
                                      >
                                        10%
                                      </text>
                                    )}
                                  </g>
                                )),
                            )}

                          {/* Step 3: Primary to Secondary Consumers (1% energy transfer) */}
                          {ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms
                            .filter((o) => o.type === "secondary")
                            .map((secondary, sIndex) =>
                              ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms
                                .filter((o) => o.type === "primary")
                                .map((primary, pIndex) => (
                                  <g key={`primary-to-secondary-${sIndex}-${pIndex}`}>
                                    <line
                                      x1={`${primary.x}%`}
                                      y1={`${primary.y}%`}
                                      x2={`${secondary.x}%`}
                                      y2={`${secondary.y}%`}
                                      stroke="#3b82f6"
                                      strokeWidth={isRunning ? "3" : "2"}
                                      strokeDasharray={isRunning ? "6,3" : "4,2"}
                                      markerEnd="url(#primary-arrow)"
                                      className={isRunning ? "animate-pulse" : ""}
                                      opacity="0.7"
                                    />
                                    {/* Energy transfer efficiency label */}
                                    {isRunning && pIndex === 0 && (
                                      <text
                                        x={`${(primary.x + secondary.x) / 2}%`}
                                        y={`${(primary.y + secondary.y) / 2 - 2}%`}
                                        fill="#3b82f6"
                                        fontSize="9"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        className="animate-pulse"
                                      >
                                        1%
                                      </text>
                                    )}
                                  </g>
                                )),
                            )}

                          {/* Step 4: All Dead Organisms to Decomposers (Nutrient Cycling) */}
                          {ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms
                            .filter((o) => o.type === "decomposer")
                            .map((decomposer, dIndex) =>
                              ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms
                                .filter((o) => o.type !== "decomposer")
                                .map((organism, oIndex) => (
                                  <g key={`to-decomposer-${dIndex}-${oIndex}`}>
                                    <path
                                      d={`M ${organism.x}% ${organism.y}% Q ${(organism.x + decomposer.x) / 2}% ${Math.min(organism.y, decomposer.y) - 8}% ${decomposer.x}% ${decomposer.y}%`}
                                      stroke="#8b5cf6"
                                      strokeWidth={isRunning ? "2" : "1"}
                                      strokeDasharray={isRunning ? "4,2" : "3,2"}
                                      fill="none"
                                      markerEnd="url(#decomposer-arrow)"
                                      className={isRunning ? "animate-pulse" : ""}
                                      opacity="0.4"
                                    />
                                  </g>
                                )),
                            )}

                          {/* Step 5: Decomposers back to Soil/Producers (Nutrient Return) */}
                          {ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms
                            .filter((o) => o.type === "decomposer")
                            .map((decomposer, dIndex) =>
                              ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms
                                .filter((o) => o.type === "producer")
                                .map((producer, pIndex) => (
                                  <g key={`decomposer-to-soil-${dIndex}-${pIndex}`}>
                                    <path
                                      d={`M ${decomposer.x}% ${decomposer.y}% Q ${(decomposer.x + producer.x) / 2}% ${Math.max(decomposer.y, producer.y) + 8}% ${producer.x}% ${producer.y + 5}%`}
                                      stroke="#22c55e"
                                      strokeWidth={isRunning ? "2" : "1"}
                                      strokeDasharray={isRunning ? "3,3" : "2,2"}
                                      fill="none"
                                      markerEnd="url(#producer-arrow)"
                                      className={isRunning ? "animate-pulse" : ""}
                                      opacity="0.5"
                                    />
                                    {/* Nutrient cycling label */}
                                    {isRunning && pIndex === 0 && (
                                      <text
                                        x={`${(decomposer.x + producer.x) / 2}%`}
                                        y={`${Math.max(decomposer.y, producer.y) + 10}%`}
                                        fill="#22c55e"
                                        fontSize="8"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        className="animate-pulse"
                                      >
                                        NUTRIENTS
                                      </text>
                                    )}
                                  </g>
                                )),
                            )}
                        </svg>

                        {/* Organisms with Enhanced Positioning and Interactions */}
                        {ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms.map((organism, index) => {
                          const populationHealth = Math.max(
                            0.2,
                            Math.min(1, (sunlight + rainfall + (50 - Math.abs(temperature - 25))) / 150),
                          )
                          const isHealthy = populationHealth > 0.6
                          const movementRange = isRunning ? 8 : 0

                          return (
                            <div
                              key={index}
                              className="absolute transition-all duration-3000"
                              style={{
                                left: `${organism.x + (isRunning ? Math.sin(timer / 4 + index) * movementRange : 0) + (windSpeed > 20 ? Math.sin(timer / 2) * (windSpeed / 10) : 0)}%`,
                                top: `${organism.y + (isRunning ? Math.cos(timer / 5 + index) * movementRange : 0) + (windSpeed > 25 ? Math.cos(timer / 3) * 2 : 0)}%`,
                                transform: "translate(-50%, -50%)",
                                zIndex: 10,
                              }}
                            >
                              {/* Organism with Trophic Level Styling */}
                              <div
                                className={`relative ${organism.color} rounded-full ${
                                  isRunning ? "animate-pulse" : ""
                                } transition-all duration-1000 flex items-center justify-center text-lg shadow-lg border-4`}
                                style={{
                                  width: `${32 + populationHealth * 20}px`,
                                  height: `${32 + populationHealth * 20}px`,
                                  opacity: 0.8 + populationHealth * 0.2,
                                  borderColor:
                                    organism.type === "producer"
                                      ? "#10b981"
                                      : organism.type === "primary"
                                        ? "#3b82f6"
                                        : organism.type === "secondary"
                                          ? "#f59e0b"
                                          : "#8b5cf6",
                                  boxShadow: `0 0 ${isRunning ? 15 : 8}px ${
                                    organism.type === "producer"
                                      ? "rgba(16, 185, 129, 0.5)"
                                      : organism.type === "primary"
                                        ? "rgba(59, 130, 246, 0.5)"
                                        : organism.type === "secondary"
                                          ? "rgba(245, 158, 11, 0.5)"
                                          : "rgba(139, 92, 246, 0.5)"
                                  }`,
                                }}
                              >
                                <span
                                  className="text-white font-bold"
                                  style={{ fontSize: `${12 + populationHealth * 4}px` }}
                                >
                                  {organism.icon}
                                </span>

                                {/* Trophic Level Indicator */}
                                <div className="absolute -top-3 -left-3">
                                  <div
                                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                                      organism.type === "producer"
                                        ? "bg-green-500"
                                        : organism.type === "primary"
                                          ? "bg-blue-500"
                                          : organism.type === "secondary"
                                            ? "bg-orange-500"
                                            : "bg-purple-500"
                                    }`}
                                  >
                                    {organism.type === "producer"
                                      ? "1"
                                      : organism.type === "primary"
                                        ? "2"
                                        : organism.type === "secondary"
                                          ? "3"
                                          : "D"}
                                  </div>
                                </div>

                                {/* Energy Level Indicator */}
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                                  <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                                    {Math.floor(populationHealth * 100)}%
                                  </div>
                                </div>

                                {/* Updated Energy Level Indicators for each organism */}
                                {isRunning && (
                                  <>
                                    {/* Producer Energy Capture */}
                                    {organism.type === "producer" && (
                                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                                        <div className="flex flex-col items-center">
                                          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce mb-1" />
                                          <div className="text-xs text-yellow-600 font-semibold">100%</div>
                                          <div className="text-xs text-green-600 font-semibold">SOLAR</div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Primary Consumer Energy Transfer */}
                                    {organism.type === "primary" && (
                                      <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                                        <div className="flex flex-col items-center">
                                          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping mb-1" />
                                          <div className="text-xs text-green-600 font-semibold">10%</div>
                                          <div className="text-xs text-gray-600">from plants</div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Secondary Consumer Energy Transfer */}
                                    {organism.type === "secondary" && (
                                      <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                                        <div className="flex flex-col items-center">
                                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping mb-1" />
                                          <div className="text-xs text-blue-600 font-semibold">1%</div>
                                          <div className="text-xs text-gray-600">from prey</div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Decomposer Nutrient Cycling */}
                                    {organism.type === "decomposer" && (
                                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                                        <div className="flex flex-col items-center">
                                          <svg width="24" height="24" className="animate-spin mb-1">
                                            <circle
                                              cx="12"
                                              cy="12"
                                              r="8"
                                              stroke="#8b5cf6"
                                              strokeWidth="2"
                                              fill="none"
                                              strokeDasharray="8,4"
                                            />
                                          </svg>
                                          <div className="text-xs text-purple-600 font-semibold">RECYCLE</div>
                                          <div className="text-xs text-gray-600">nutrients</div>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}

                                {/* Organism Information Card */}
                                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white/95 px-3 py-2 rounded-lg shadow-lg border text-center min-w-max">
                                  <div className="font-semibold text-sm">{organism.name}</div>
                                  <div className="text-xs text-gray-600 capitalize">
                                    {organism.type === "producer"
                                      ? "Producer (Trophic Level 1)"
                                      : organism.type === "primary"
                                        ? "Primary Consumer (Level 2)"
                                        : organism.type === "secondary"
                                          ? "Secondary Consumer (Level 3)"
                                          : "Decomposer (All Levels)"}
                                  </div>
                                  {isRunning && (
                                    <div className="text-xs mt-1">
                                      {organism.type === "producer" && (
                                        <span className="text-green-600">🌱 Converting solar energy</span>
                                      )}
                                      {organism.type === "primary" && (
                                        <span className="text-blue-600">🦓 Eating plants (10% efficiency)</span>
                                      )}
                                      {organism.type === "secondary" && (
                                        <span className="text-orange-600">🦁 Hunting prey (1% efficiency)</span>
                                      )}
                                      {organism.type === "decomposer" && (
                                        <span className="text-purple-600">♻️ Recycling nutrients</span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Health and Environmental Stress Indicators */}
                                {!isHealthy && isRunning && (
                                  <div className="absolute -top-6 -right-6">
                                    <div className="w-4 h-4 bg-red-500 rounded-full animate-ping flex items-center justify-center">
                                      <span className="text-white text-xs">!</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}

                        {/* Updated Energy Flow Legend */}
                        {isRunning && (
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
                            <div className="font-semibold text-sm mb-3 text-center">🔄 Energy Flow & Food Web</div>
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-yellow-400"></div>
                                <span>☀️ Sun → Producers (100% solar energy)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-green-500"></div>
                                <span>🌱 Producers → Primary (10% energy transfer)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-blue-500"></div>
                                <span>🦓 Primary → Secondary (1% energy transfer)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-purple-500 opacity-60"></div>
                                <span>💀 Dead organisms → Decomposers</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-green-400 opacity-60"></div>
                                <span>♻️ Decomposers → Soil nutrients</span>
                              </div>
                              <div className="pt-2 border-t border-gray-200">
                                <div className="text-center font-semibold text-orange-600">
                                  Energy Loss: 90% at each level!
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Sun with Dynamic Intensity and Rotation */}
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                        <div
                          className={`rounded-full flex items-center justify-center text-lg shadow-lg transition-all duration-1000 relative ${
                            isRunning ? "animate-spin" : ""
                          }`}
                          style={{
                            width: `${20 + sunlight / 5}px`,
                            height: `${20 + sunlight / 5}px`,
                            backgroundColor: `rgba(251, 191, 36, ${0.6 + sunlight / 200})`,
                            boxShadow: `0 0 ${sunlight / 5}px rgba(251, 191, 36, 0.6), 0 0 ${sunlight / 3}px rgba(255, 165, 0, 0.4)`,
                            animationDuration: isRunning ? "8s" : "0s",
                            animationTimingFunction: "linear",
                            animationIterationCount: "infinite",
                          }}
                        >
                          {/* Rotating inner corona */}
                          <div
                            className={`absolute inset-0 rounded-full ${isRunning ? "animate-spin" : ""}`}
                            style={{
                              background: `conic-gradient(from 0deg, 
          rgba(255, 215, 0, 0.8) 0deg, 
          rgba(255, 165, 0, 0.6) 60deg, 
          rgba(255, 140, 0, 0.8) 120deg, 
          rgba(255, 215, 0, 0.6) 180deg, 
          rgba(255, 165, 0, 0.8) 240deg, 
          rgba(255, 140, 0, 0.6) 300deg, 
          rgba(255, 215, 0, 0.8) 360deg)`,
                              animationDuration: isRunning ? "12s" : "0s",
                              animationDirection: "reverse",
                              animationTimingFunction: "ease-in-out",
                              animationIterationCount: "infinite",
                              opacity: sunlight / 150,
                            }}
                          />

                          {/* Pulsing outer glow */}
                          <div
                            className={`absolute inset-0 rounded-full ${isRunning ? "animate-ping" : ""}`}
                            style={{
                              background: `radial-gradient(circle, 
          rgba(255, 215, 0, 0.3) 0%, 
          rgba(255, 165, 0, 0.2) 50%, 
          transparent 70%)`,
                              transform: `scale(${1 + sunlight / 200})`,
                              animationDuration: "3s",
                              animationIterationCount: "infinite",
                            }}
                          />

                          {/* Sun emoji with breathing effect */}
                          <span
                            className={`relative z-10 ${isRunning ? "animate-pulse" : ""}`}
                            style={{
                              fontSize: `${12 + sunlight / 10}px`,
                              filter: `brightness(${1 + sunlight / 200}) saturate(${1 + sunlight / 100})`,
                              textShadow: "0 0 8px rgba(255, 215, 0, 0.8)",
                              animationDuration: "2s",
                            }}
                          >
                            ☀️
                          </span>

                          {/* Intensity indicator ring */}
                          {isRunning && (
                            <div
                              className="absolute inset-0 rounded-full border-2 animate-spin"
                              style={{
                                borderColor: `rgba(255, 215, 0, ${sunlight / 200})`,
                                borderStyle: "dashed",
                                animationDuration: "6s",
                                animationDirection: "reverse",
                                transform: `scale(${1.2 + sunlight / 300})`,
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Live Ecosystem Stats Overlay */}
                      {isRunning && (
                        <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg text-xs space-y-1">
                          <div className="font-semibold text-green-400">🌱 Live Ecosystem Data</div>
                          <div>
                            Producers:{" "}
                            {
                              ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms.filter(
                                (o) => o.type === "producer",
                              ).length
                            }{" "}
                            species
                          </div>
                          <div>
                            Primary Consumers:{" "}
                            {
                              ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms.filter(
                                (o) => o.type === "primary",
                              ).length
                            }{" "}
                            species
                          </div>
                          <div>
                            Secondary Consumers:{" "}
                            {
                              ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms.filter(
                                (o) => o.type === "secondary",
                              ).length
                            }{" "}
                            species
                          </div>
                          <div>
                            Decomposers:{" "}
                            {
                              ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms.filter(
                                (o) => o.type === "decomposer",
                              ).length
                            }{" "}
                            species
                          </div>
                          <div className="pt-1 border-t border-gray-600">
                            <div className="text-yellow-400">⚡ Energy Flow: {isRunning ? "Active" : "Paused"}</div>
                            <div className="text-blue-400">💧 Water Cycle: {rainfall > 50 ? "Active" : "Low"}</div>
                            <div className="text-green-400">
                              🔄 Nutrient Cycle: {isRunning ? "Processing" : "Dormant"}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Population Health Warning */}
                      {isRunning && (sunlight < 30 || rainfall < 20 || temperature < 10 || temperature > 40) && (
                        <div className="absolute top-4 right-4 bg-red-500/90 text-white p-2 rounded-lg text-xs animate-pulse">
                          ⚠️ Environmental Stress Detected!
                          <div className="text-xs mt-1">
                            {sunlight < 30 && <div>• Low sunlight affecting producers</div>}
                            {rainfall < 20 && <div>• Drought conditions</div>}
                            {(temperature < 10 || temperature > 40) && <div>• Extreme temperature</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Environmental Status Panel */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm flex items-center gap-2 shadow-sm">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">{sunlight}%</div>
                        <div className="text-xs text-gray-600">Sunlight</div>
                      </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm flex items-center gap-2 shadow-sm">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">{rainfall}%</div>
                        <div className="text-xs text-gray-600">Rainfall</div>
                      </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm flex items-center gap-2 shadow-sm">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">{temperature}°C</div>
                        <div className="text-xs text-gray-600">Temperature</div>
                      </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm shadow-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                        ></div>
                        <div>
                          <div className="font-medium text-gray-700">{isRunning ? "Running" : "Paused"}</div>
                          <div className="text-xs text-gray-600">Simulation</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interaction Guidelines */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                    <div className="font-semibold text-gray-700 mb-3">Ecosystem Interaction Guide</div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span>Solar Energy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>
                          Producers (
                          {
                            ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms.filter(
                              (o) => o.type === "producer",
                            ).length
                          }
                          )
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>
                          Primary Consumers (
                          {
                            ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms.filter(
                              (o) => o.type === "primary",
                            ).length
                          }
                          )
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>
                          Secondary Consumers (
                          {
                            ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms.filter(
                              (o) => o.type === "secondary",
                            ).length
                          }
                          )
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                        <span>
                          Decomposers (
                          {
                            ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms.filter(
                              (o) => o.type === "decomposer",
                            ).length
                          }
                          )
                        </span>
                      </div>
                    </div>
                    {isRunning && (
                      <div className="text-green-600 font-medium mt-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        <span>Showing live organism interactions and energy flow</span>
                      </div>
                    )}
                  </div>

                  {/* Environmental Controls */}
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Sun className="h-4 w-4 inline mr-1" />
                        Sunlight
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sunlight}
                        onChange={(e) => setSunlight(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-center mt-1">{sunlight}%</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Droplets className="h-4 w-4 inline mr-1" />
                        Rainfall
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={rainfall}
                        onChange={(e) => setRainfall(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-center mt-1">{rainfall}%</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Thermometer className="h-4 w-4 inline mr-1" />
                        Temperature
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-center mt-1">{temperature}°C</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">💨 Wind Speed</label>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={windSpeed}
                        onChange={(e) => setWindSpeed(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-center mt-1">{windSpeed} km/h</div>
                    </div>
                  </div>

                  {/* Ecosystem Selection */}
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(ecosystems).map(([key, ecosystem]) => (
                      <Card
                        key={key}
                        className={`cursor-pointer transition-all ${
                          selectedEcosystem === key ? "ring-2 ring-green-500" : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedEcosystem(key)}
                      >
                        <CardContent className="p-3">
                          <h4 className="font-medium text-sm">{ecosystem.name}</h4>
                          <p className="text-xs text-gray-600">{ecosystem.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Enhanced Organisms List */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">
                      Ecosystem Organisms ({ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms.map((organism, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                          <div className={`w-3 h-3 ${organism.color} rounded-full`}></div>
                          <div>
                            <div className="text-sm font-medium">{organism.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{organism.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Lab Instructor */}
          <div className="space-y-6">
            <AILabAssistant
              experimentType="ecosystem-simulation"
              context={{
                currentEcosystem: ecosystems[selectedEcosystem as keyof typeof ecosystems].name,
                environmentalConditions: {
                  temperature: temperature,
                  rainfall: rainfall,
                  sunlight: sunlight,
                },
                simulationState: {
                  isRunning: isRunning,
                  timer: timer,
                  selectedEcosystem: selectedEcosystem,
                },
                organisms: ecosystems[selectedEcosystem as keyof typeof ecosystems].organisms,
                quizStatus: {
                  available: quizAvailable,
                  completed: quizCompleted,
                  score: quizCompleted ? quizScore : null,
                },
              }}
            />

            <AIGuidancePanel
              experimentType="ecosystem"
              gradeLevel="Grade 7-9"
              currentStep={1}
              studentProgress={{
                completedSteps: [],
                currentObservations: [
                  `Studying ${ecosystems[selectedEcosystem as keyof typeof ecosystems].name}`,
                  `Environmental conditions: ${temperature}°C, ${rainfall}% rainfall, ${sunlight}% sunlight`,
                ],
                challenges: [],
              }}
            />
          </div>
        </div>

        {/* Quiz Modal */}
        {showQuiz && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {!quizCompleted ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Ecosystem Quiz</h2>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          Question {currentQuestionIndex + 1} of {quizQuestions.length}
                        </span>
                        <Button onClick={() => setShowQuiz(false)} variant="outline" size="sm">
                          Close
                        </Button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                        ></div>
                      </div>

                      <h3 className="text-lg font-semibold mb-4">{quizQuestions[currentQuestionIndex].question}</h3>

                      <div className="space-y-3">
                        {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                              selectedAnswers[currentQuestionIndex] === index
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {currentQuestionIndex === quizQuestions.length - 1 ? "Complete Quiz" : "Next Question"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">🎉</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                        <p className="text-lg text-gray-600">
                          You scored {quizScore} out of {quizQuestions.length} questions correctly
                        </p>
                        <div className="mt-4">
                          <div className="text-3xl font-bold text-green-600">
                            {Math.round((quizScore / quizQuestions.length) * 100)}%
                          </div>
                        </div>
                      </div>

                      <div className="mb-6 text-left">
                        <h3 className="font-semibold mb-4">Review Your Answers:</h3>
                        <div className="space-y-4">
                          {quizQuestions.map((question, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <p className="font-medium mb-2">{question.question}</p>
                              <p
                                className={`text-sm ${selectedAnswers[index] === question.correct ? "text-green-600" : "text-red-600"}`}
                              >
                                Your answer: {question.options[selectedAnswers[index]]}
                                {selectedAnswers[index] === question.correct ? " ✓" : " ✗"}
                              </p>
                              {selectedAnswers[index] !== question.correct && (
                                <p className="text-sm text-green-600">
                                  Correct answer: {question.options[question.correct]}
                                </p>
                              )}
                              <p className="text-xs text-gray-600 mt-2">{question.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <Button onClick={resetQuiz} variant="outline">
                          Close Quiz
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentQuestionIndex(0)
                            setSelectedAnswers([])
                            setQuizCompleted(false)
                            setQuizScore(0)
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Retake Quiz
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
