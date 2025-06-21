"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Microscope, ArrowLeft, Play, Pause, RotateCcw, ZoomIn, ZoomOut, Eye } from "lucide-react"
import Link from "next/link"
import { AIGuidancePanel } from "@/components/virtual-lab/ai-guidance-panel"
import { ScientificNotebook } from "@/components/virtual-lab/scientific-notebook"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MicroscopyExperiment() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentSpecimen, setCurrentSpecimen] = useState("plant-parts")
  const [magnification, setMagnification] = useState(100)
  const [timer, setTimer] = useState(0)

  const [quizMode, setQuizMode] = useState(false)
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const [timedChallengeMode, setTimedChallengeMode] = useState(false)
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(60) // 60 seconds default
  const [challengeDifficulty, setChallengeDifficulty] = useState("advanced")
  const [challengeScore, setChallengeScore] = useState(0)
  const [challengeStreak, setChallengeStreak] = useState(0)
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const [challengeQuestions, setChallengeQuestions] = useState<any[]>([])
  const [challengeCurrentQuestion, setChallengeCurrentQuestion] = useState(0)
  const [challengeAnswerTime, setChallengeAnswerTime] = useState(0)
  const [challengeStartTime, setChallengeStartTime] = useState(0)

  const [selectedOrganelle, setSelectedOrganelle] = useState<string | null>(null)
  const [showOrganelleInfo, setShowOrganelleInfo] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  // Timed Challenge Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timedChallengeMode && challengeTimeLeft > 0 && !challengeCompleted) {
      interval = setInterval(() => {
        setChallengeTimeLeft((time) => {
          if (time <= 1) {
            setTimedChallengeMode(false)
            setChallengeCompleted(true)
            return 0
          }
          return time - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timedChallengeMode, challengeTimeLeft, challengeCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const specimens = {
    "plant-parts": {
      name: "Plant Parts",
      description: "Explore leaf, stem, and root structures",
      image: "/placeholder.svg?height=300&width=300&text=Plant+Cell+Structure",
    },
    "animal-cells": {
      name: "Animal Cells",
      description: "Study animal cell components and organelles",
      image: "/placeholder.svg?height=300&width=300&text=Animal+Cell+Structure",
    },
  }

  const quizQuestions = {
    "plant-parts": [
      {
        question: "Which organelle is responsible for photosynthesis in plant cells?",
        options: ["Nucleus", "Chloroplast", "Vacuole", "Cell Wall"],
        correct: "Chloroplast",
        explanation:
          "Chloroplasts contain chlorophyll and are responsible for photosynthesis, converting sunlight into energy.",
      },
      {
        question: "What provides structural support and protection to plant cells?",
        options: ["Cell Membrane", "Cytoplasm", "Cell Wall", "Nucleus"],
        correct: "Cell Wall",
        explanation: "The cell wall is a rigid structure that provides support, protection, and shape to plant cells.",
      },
      {
        question: "Which organelle stores water and maintains turgor pressure in plants?",
        options: ["Mitochondria", "Vacuole", "Ribosome", "Golgi Apparatus"],
        correct: "Vacuole",
        explanation:
          "The large central vacuole stores water and helps maintain the plant's structure through turgor pressure.",
      },
      {
        question: "What controls all cellular activities and contains DNA?",
        options: ["Chloroplast", "Vacuole", "Nucleus", "Cell Wall"],
        correct: "Nucleus",
        explanation: "The nucleus is the control center of the cell, containing DNA and regulating gene expression.",
      },
      {
        question: "Which organelle processes and packages proteins from the ER?",
        options: ["Golgi Apparatus", "Ribosome", "Peroxisome", "Chloroplast"],
        correct: "Golgi Apparatus",
        explanation:
          "The Golgi apparatus modifies, packages, and ships proteins received from the endoplasmic reticulum.",
      },
    ],
    "animal-cells": [
      {
        question: "Which organelle is known as the 'powerhouse of the cell'?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"],
        correct: "Mitochondria",
        explanation:
          "Mitochondria produce ATP (energy) through cellular respiration, earning them the nickname 'powerhouse of the cell'.",
      },
      {
        question: "What organelle digests waste materials and worn-out cell parts?",
        options: ["Golgi Apparatus", "Lysosome", "Ribosome", "Centrosome"],
        correct: "Lysosome",
        explanation: "Lysosomes contain digestive enzymes that break down waste materials and cellular debris.",
      },
      {
        question: "Which structure controls what enters and exits the animal cell?",
        options: ["Cell Wall", "Cell Membrane", "Nucleus", "Cytoplasm"],
        correct: "Cell Membrane",
        explanation:
          "The cell membrane is selectively permeable, controlling the movement of substances in and out of the cell.",
      },
      {
        question: "What organelle helps organize cell division in animal cells?",
        options: ["Centrosome", "Lysosome", "Peroxisome", "Vesicle"],
        correct: "Centrosome",
        explanation: "The centrosome contains centrioles that help organize the spindle fibers during cell division.",
      },
      {
        question: "Which organelles are responsible for protein synthesis?",
        options: ["Lysosomes", "Vesicles", "Ribosomes", "Peroxisomes"],
        correct: "Ribosomes",
        explanation: "Ribosomes are the sites of protein synthesis, translating mRNA into proteins.",
      },
    ],
  }

  const timedChallengeQuestions = {
    beginner: [
      {
        question: "What gives plant cells their rigid structure?",
        options: ["Cell Membrane", "Cell Wall", "Nucleus", "Cytoplasm"],
        correct: "Cell Wall",
        points: 10,
        timeBonus: 5,
      },
      {
        question: "Which organelle produces energy in animal cells?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"],
        correct: "Mitochondria",
        points: 10,
        timeBonus: 5,
      },
      {
        question: "What controls the cell's activities?",
        options: ["Cytoplasm", "Nucleus", "Cell Wall", "Vacuole"],
        correct: "Nucleus",
        points: 10,
        timeBonus: 5,
      },
    ],
    intermediate: [
      {
        question: "Which organelle is responsible for photosynthesis?",
        options: ["Mitochondria", "Chloroplast", "Ribosome", "Golgi Apparatus"],
        correct: "Chloroplast",
        points: 15,
        timeBonus: 8,
      },
      {
        question: "What processes and packages proteins from the ER?",
        options: ["Golgi Apparatus", "Lysosome", "Peroxisome", "Centrosome"],
        correct: "Golgi Apparatus",
        points: 15,
        timeBonus: 8,
      },
      {
        question: "Which organelle digests cellular waste in animal cells?",
        options: ["Ribosome", "Lysosome", "Peroxisome", "Vesicle"],
        correct: "Lysosome",
        points: 15,
        timeBonus: 8,
      },
    ],
    advanced: [
      {
        question: "Which organelle contains cristae for ATP production?",
        options: ["Chloroplast", "Mitochondria", "Endoplasmic Reticulum", "Golgi Apparatus"],
        correct: "Mitochondria",
        points: 25,
        timeBonus: 15,
      },
      {
        question: "What organelle breaks down hydrogen peroxide and fatty acids?",
        options: ["Lysosome", "Peroxisome", "Ribosome", "Vesicle"],
        correct: "Peroxisome",
        points: 25,
        timeBonus: 15,
      },
      {
        question: "Which structure organizes microtubules during cell division?",
        options: ["Centrosome", "Nucleolus", "Centriole", "Spindle Fiber"],
        correct: "Centrosome",
        points: 25,
        timeBonus: 15,
      },
      {
        question: "What type of ER has ribosomes attached to its surface?",
        options: ["Smooth ER", "Rough ER", "Golgi ER", "Nuclear ER"],
        correct: "Rough ER",
        points: 25,
        timeBonus: 15,
      },
      {
        question: "Which organelle synthesizes lipids and steroids?",
        options: ["Rough ER", "Smooth ER", "Golgi Apparatus", "Ribosome"],
        correct: "Smooth ER",
        points: 25,
        timeBonus: 15,
      },
    ],
  }

  const organelleInfo = {
    "cell-wall": {
      name: "Cell Wall",
      description: "A rigid protective barrier that gives plant cells their shape and structure.",
      function: "Provides structural support, protection, and maintains cell shape",
      funFact: "Cell walls are made of cellulose, the same material used to make paper!",
      onlyIn: "Plant cells only",
    },
    nucleus: {
      name: "Nucleus",
      description: "The control center of the cell that contains DNA and controls all cellular activities.",
      function: "Controls cell growth, reproduction, and all cellular functions",
      funFact: "The nucleus is like the brain of the cell - it makes all the important decisions!",
      onlyIn: "Both plant and animal cells",
    },
    chloroplast: {
      name: "Chloroplast",
      description: "Green organelles that capture sunlight and convert it into food through photosynthesis.",
      function: "Makes food (glucose) from sunlight, water, and carbon dioxide",
      funFact: "Chloroplasts are green because they contain chlorophyll, the same thing that makes leaves green!",
      onlyIn: "Plant cells only",
    },
    vacuole: {
      name: "Vacuole",
      description: "A large storage compartment that holds water and helps maintain the plant's structure.",
      function: "Stores water, maintains turgor pressure, and provides structural support",
      funFact: "A plant's vacuole can take up 90% of the cell's volume - it's like a giant water balloon!",
      onlyIn: "Large in plant cells, small in animal cells",
    },
    mitochondria: {
      name: "Mitochondria",
      description: "The powerhouses of the cell that produce energy (ATP) for cellular activities.",
      function: "Produces energy through cellular respiration",
      funFact: "You have thousands of mitochondria in each of your cells working 24/7 to keep you energized!",
      onlyIn: "Both plant and animal cells (more in animal cells)",
    },
    ribosome: {
      name: "Ribosome",
      description: "Tiny structures that build proteins by following instructions from DNA.",
      function: "Synthesizes proteins needed for cell structure and function",
      funFact: "Ribosomes are like tiny protein factories - they can make thousands of proteins per minute!",
      onlyIn: "Both plant and animal cells",
    },
    lysosome: {
      name: "Lysosome",
      description: "The cell's cleanup crew that digests waste materials and worn-out cell parts.",
      function: "Breaks down waste, worn-out organelles, and harmful substances",
      funFact: "Lysosomes are like the cell's recycling center - they break down old parts to make new ones!",
      onlyIn: "Mainly in animal cells",
    },
    "golgi-apparatus": {
      name: "Golgi Apparatus",
      description: "The cell's post office that processes, packages, and ships proteins from the ER.",
      function: "Modifies, packages, and transports proteins and lipids",
      funFact: "The Golgi apparatus is named after Camillo Golgi, who discovered it in 1898!",
      onlyIn: "Both plant and animal cells",
    },
    "endoplasmic-reticulum": {
      name: "Endoplasmic Reticulum",
      description: "A network of membranes that transports materials throughout the cell.",
      function: "Synthesizes proteins (rough ER) and lipids (smooth ER), transports materials",
      funFact: "The ER is like the cell's highway system - it connects different parts of the cell!",
      onlyIn: "Both plant and animal cells",
    },
    centrosome: {
      name: "Centrosome",
      description: "An organelle that helps organize cell division and contains two centrioles.",
      function: "Organizes microtubules and helps with cell division",
      funFact: "During cell division, centrosomes act like anchors for the ropes that pull chromosomes apart!",
      onlyIn: "Animal cells only",
    },
    peroxisome: {
      name: "Peroxisome",
      description: "Small organelles that break down toxic substances and fatty acids.",
      function: "Detoxifies harmful substances and breaks down fatty acids",
      funFact: "Peroxisomes are like the cell's detox center - they clean up dangerous chemicals!",
      onlyIn: "Both plant and animal cells",
    },
  }

  const startQuiz = () => {
    setQuizMode(true)
    setCurrentQuizQuestion(0)
    setQuizScore(0)
    setSelectedAnswer("")
    setShowQuizResult(false)
    setQuizCompleted(false)
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const submitAnswer = () => {
    const currentQuestions = quizQuestions[currentSpecimen as keyof typeof quizQuestions]
    const isCorrect = selectedAnswer === currentQuestions[currentQuizQuestion].correct

    if (isCorrect) {
      setQuizScore(quizScore + 1)
    }

    setShowQuizResult(true)

    setTimeout(() => {
      if (currentQuizQuestion < currentQuestions.length - 1) {
        setCurrentQuizQuestion(currentQuizQuestion + 1)
        setSelectedAnswer("")
        setShowQuizResult(false)
      } else {
        setQuizCompleted(true)
      }
    }, 2000)
  }

  const resetQuiz = () => {
    setQuizMode(false)
    setCurrentQuizQuestion(0)
    setQuizScore(0)
    setSelectedAnswer("")
    setShowQuizResult(false)
    setQuizCompleted(false)
  }

  const getQuizGrade = () => {
    const percentage = (quizScore / quizQuestions[currentSpecimen as keyof typeof quizQuestions].length) * 100
    if (percentage >= 90) return { grade: "A", color: "text-green-600", message: "Excellent work!" }
    if (percentage >= 80) return { grade: "B", color: "text-blue-600", message: "Great job!" }
    if (percentage >= 70) return { grade: "C", color: "text-yellow-600", message: "Good effort!" }
    if (percentage >= 60) return { grade: "D", color: "text-orange-600", message: "Keep studying!" }
    return { grade: "F", color: "text-red-600", message: "Need more practice!" }
  }

  const startTimedChallenge = (difficulty: string, timeLimit: number) => {
    const questions = [...timedChallengeQuestions[difficulty as keyof typeof timedChallengeQuestions]]
    // Shuffle questions for variety
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5)

    setTimedChallengeMode(true)
    setChallengeDifficulty(difficulty)
    setChallengeTimeLeft(timeLimit)
    setChallengeQuestions(shuffledQuestions)
    setChallengeCurrentQuestion(0)
    setChallengeScore(0)
    setChallengeStreak(0)
    setChallengeCompleted(false)
    setSelectedAnswer("")
    setShowQuizResult(false)
    setChallengeStartTime(Date.now())
  }

  const handleChallengeAnswer = (answer: string) => {
    const currentQ = challengeQuestions[challengeCurrentQuestion]
    const answerTime = Date.now() - challengeStartTime
    const isCorrect = answer === currentQ.correct

    let points = 0
    if (isCorrect) {
      points = currentQ.points
      // Time bonus for quick answers (within 5 seconds)
      if (answerTime < 5000) {
        points += currentQ.timeBonus
      }
      setChallengeStreak(challengeStreak + 1)
    } else {
      setChallengeStreak(0)
    }

    // Streak bonus
    if (challengeStreak >= 2) {
      points += challengeStreak * 5
    }

    setChallengeScore(challengeScore + points)
    setSelectedAnswer(answer)
    setShowQuizResult(true)
    setChallengeAnswerTime(answerTime)

    setTimeout(() => {
      if (challengeCurrentQuestion < challengeQuestions.length - 1) {
        setChallengeCurrentQuestion(challengeCurrentQuestion + 1)
        setSelectedAnswer("")
        setShowQuizResult(false)
        setChallengeStartTime(Date.now())
      } else {
        setChallengeCompleted(true)
        setTimedChallengeMode(false)
      }
    }, 1500)
  }

  const resetTimedChallenge = () => {
    setTimedChallengeMode(false)
    setChallengeCompleted(false)
    setChallengeCurrentQuestion(0)
    setChallengeScore(0)
    setChallengeStreak(0)
    setChallengeQuestions([])
    setSelectedAnswer("")
    setShowQuizResult(false)
  }

  const getChallengeRank = () => {
    const maxPossibleScore = challengeQuestions.reduce((sum, q) => sum + q.points + q.timeBonus, 0)
    const percentage = (challengeScore / maxPossibleScore) * 100

    if (percentage >= 90) return { rank: "Cell Biology Master", color: "text-purple-600", icon: "👑" }
    if (percentage >= 80) return { rank: "Organelle Expert", color: "text-blue-600", icon: "🏆" }
    if (percentage >= 70) return { rank: "Microscopy Specialist", color: "text-green-600", icon: "🥇" }
    if (percentage >= 60) return { rank: "Cell Explorer", color: "text-yellow-600", icon: "🥈" }
    return { rank: "Biology Student", color: "text-gray-600", icon: "🥉" }
  }

  const handleOrganelleClick = (organelleKey: string) => {
    setSelectedOrganelle(organelleKey)
    setShowOrganelleInfo(true)
  }

  const closeOrganelleInfo = () => {
    setShowOrganelleInfo(false)
    setSelectedOrganelle(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
                <Microscope className="h-6 w-6 text-green-500" />
                Virtual Microscopy Lab
              </h1>
              <p className="text-gray-600">
                Integrated Science Grade 8 • Strand 2.0: LIVING THINGS & THEIR ENVIRONMENT • Substrand: THE CELL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Experiment Time</div>
              <div className="text-lg font-mono font-semibold">{formatTime(timer)}</div>
            </div>
            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={() => setIsRunning(true)} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Microscope Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="h-5 w-5" />
                  Virtual Microscope
                </CardTitle>
                <CardDescription>
                  Examining: {specimens[currentSpecimen as keyof typeof specimens].name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Microscope View */}
                  <div className="relative bg-black rounded-lg p-4 aspect-square max-w-md mx-auto">
                    <div className="absolute inset-4 bg-gray-900 rounded-full border-4 border-gray-600 overflow-hidden">
                      {/* Live Simulation Canvas */}
                      <div className="relative w-full h-full bg-gradient-radial from-blue-900 via-purple-900 to-black">
                        {/* Animated Cell Structures */}
                        {currentSpecimen === "plant-parts" && (
                          <>
                            {/* Cell Wall - Labeled */}
                            <div
                              className="absolute inset-2 border-2 border-green-400 rounded-lg animate-pulse opacity-80 group"
                              onClick={() => handleOrganelleClick("cell-wall")}
                            >
                              <div className="absolute -top-6 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Cell Wall
                              </div>
                            </div>

                            {/* Nucleus - Labeled */}
                            <div
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full animate-bounce opacity-90 shadow-lg shadow-blue-500/50 group cursor-pointer"
                              onClick={() => handleOrganelleClick("nucleus")}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                Nucleus (Control Center)
                              </div>
                            </div>

                            {/* Chloroplasts - Labeled */}
                            <div
                              className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75 group cursor-pointer"
                              onClick={() => handleOrganelleClick("chloroplast")}
                            >
                              <div className="absolute -top-6 -left-4 bg-green-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Chloroplast
                              </div>
                            </div>
                            <div
                              className="absolute top-3/4 right-1/4 w-3 h-3 bg-green-500 rounded-full animate-ping animation-delay-500 opacity-75 group cursor-pointer"
                              onClick={() => handleOrganelleClick("chloroplast")}
                            >
                              <div className="absolute -top-6 -left-4 bg-green-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Chloroplast
                              </div>
                            </div>
                            <div
                              className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-green-500 rounded-full animate-ping animation-delay-1000 opacity-75 group cursor-pointer"
                              onClick={() => handleOrganelleClick("chloroplast")}
                            >
                              <div className="absolute -top-6 -left-4 bg-green-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Chloroplast
                              </div>
                            </div>

                            {/* Vacuole - Labeled */}
                            <div
                              className="absolute top-1/3 right-1/3 w-6 h-6 border-2 border-cyan-400 rounded-full animate-pulse opacity-60 group cursor-pointer"
                              onClick={() => handleOrganelleClick("vacuole")}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                Vacuole (Water Storage)
                              </div>
                            </div>

                            {/* Cytoplasm - Labeled */}
                            <div className="absolute inset-3 bg-gradient-conic from-green-200/20 via-transparent to-green-200/20 rounded-lg animate-spin-slow group">
                              <div className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-75">
                                Cytoplasm
                              </div>
                            </div>
                            {/* Endoplasmic Reticulum - Labeled */}
                            <div
                              className="absolute top-1/4 right-1/2 w-8 h-1 bg-blue-300 rounded-sm animate-pulse opacity-70 group cursor-pointer"
                              onClick={() => handleOrganelleClick("endoplasmic-reticulum")}
                            >
                              <div className="absolute w-6 h-0.5 bg-blue-300 rounded-sm top-1 left-1"></div>
                              <div className="absolute w-4 h-0.5 bg-blue-300 rounded-sm top-2 left-2"></div>
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Endoplasmic Reticulum
                              </div>
                            </div>

                            {/* Golgi Apparatus - Labeled */}
                            <div
                              className="absolute bottom-1/3 left-1/2 w-6 h-3 group cursor-pointer"
                              onClick={() => handleOrganelleClick("golgi-apparatus")}
                            >
                              <div className="w-full h-0.5 bg-orange-400 rounded-sm mb-0.5"></div>
                              <div className="w-full h-0.5 bg-orange-400 rounded-sm mb-0.5"></div>
                              <div className="w-full h-0.5 bg-orange-400 rounded-sm"></div>
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Golgi Apparatus
                              </div>
                            </div>

                            {/* Peroxisomes - Labeled */}
                            <div
                              className="absolute top-2/3 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-75 group cursor-pointer"
                              onClick={() => handleOrganelleClick("peroxisome")}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Peroxisome
                              </div>
                            </div>
                            <div
                              className="absolute top-1/2 left-2/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-400 opacity-75 group cursor-pointer"
                              onClick={() => handleOrganelleClick("peroxisome")}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Peroxisome
                              </div>
                            </div>

                            {/* Nucleolus inside Nucleus - Labeled */}
                            <div
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-700 rounded-full animate-pulse opacity-90 group cursor-pointer"
                              onClick={() => handleOrganelleClick("nucleus")}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Nucleolus
                              </div>
                            </div>
                          </>
                        )}

                        {currentSpecimen === "animal-cells" && (
                          <>
                            {/* Cell Membrane - Labeled */}
                            <div
                              className="absolute inset-2 border-2 border-pink-400 rounded-full animate-pulse opacity-80 group"
                              onClick={() => handleOrganelleClick("cell-membrane")}
                            >
                              <div className="absolute -top-6 left-4 bg-pink-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Cell Membrane
                              </div>
                            </div>

                            {/* Nucleus - Labeled */}
                            <div
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-purple-600 rounded-full animate-bounce opacity-90 shadow-lg shadow-purple-600/50 group cursor-pointer"
                              onClick={() => handleOrganelleClick("nucleus")}
                            >
                              <div className="absolute inset-2 bg-purple-400 rounded-full animate-pulse"></div>
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                Nucleus & Nucleolus
                              </div>
                            </div>

                            {/* Mitochondria - Labeled */}
                            <div
                              className="absolute top-1/4 left-1/3 w-4 h-2 bg-red-500 rounded-full animate-pulse opacity-80 group cursor-pointer"
                              onClick={() => handleOrganelleClick("mitochondria")}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Mitochondria
                              </div>
                            </div>
                            <div
                              className="absolute bottom-1/3 right-1/4 w-4 h-2 bg-red-500 rounded-full animate-pulse animation-delay-300 opacity-80 group cursor-pointer"
                              onClick={() => handleOrganelleClick("mitochondria")}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Mitochondria
                              </div>
                            </div>
                            <div
                              className="absolute top-2/3 left-1/4 w-4 h-2 bg-red-500 rounded-full animate-pulse animation-delay-700 opacity-80 group cursor-pointer"
                              onClick={() => handleOrganelleClick("mitochondria")}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Mitochondria
                              </div>
                            </div>

                            {/* Ribosomes - Labeled */}
                            <div
                              className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping group cursor-pointer"
                              onClick={() => handleOrganelleClick("ribosome")}
                            >
                              <div className="absolute -top-4 -left-6 bg-yellow-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Ribosome
                              </div>
                            </div>
                            <div
                              className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping animation-delay-200 group cursor-pointer"
                              onClick={() => handleOrganelleClick("ribosome")}
                            >
                              <div className="absolute -top-4 -left-6 bg-yellow-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Ribosome
                              </div>
                            </div>
                            <div
                              className="absolute top-3/4 right-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-ping animation-delay-400 group cursor-pointer"
                              onClick={() => handleOrganelleClick("ribosome")}
                            >
                              <div className="absolute -top-4 -left-6 bg-yellow-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Ribosome
                              </div>
                            </div>

                            {/* Cytoplasm - Labeled */}
                            <div className="absolute inset-3 bg-gradient-radial from-pink-200/20 via-transparent to-pink-200/20 rounded-full animate-spin-slow group">
                              <div className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-75">
                                Cytoplasm
                              </div>
                            </div>
                            {/* Endoplasmic Reticulum - Labeled */}
                            <div
                              className="absolute top-1/3 left-1/4 w-8 h-1 bg-blue-300 rounded-sm animate-pulse opacity-70 group cursor-pointer"
                              onClick={() => handleOrganelleClick("endoplasmic-reticulum")}
                            >
                              <div className="absolute w-6 h-0.5 bg-blue-300 rounded-sm top-1 left-1"></div>
                              <div className="absolute w-4 h-0.5 bg-blue-300 rounded-sm top-2 left-2"></div>
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Endoplasmic Reticulum
                              </div>
                            </div>

                            {/* Golgi Apparatus - Labeled */}
                            <div
                              className="absolute bottom-1/4 right-1/3 w-6 h-3 group cursor-pointer"
                              onClick={() => handleOrganelleClick("golgi-apparatus")}
                            >
                              <div className="w-full h-0.5 bg-orange-400 rounded-sm mb-0.5"></div>
                              <div className="w-full h-0.5 bg-orange-400 rounded-sm mb-0.5"></div>
                              <div className="w-full h-0.5 bg-orange-400 rounded-sm"></div>
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Golgi Apparatus
                              </div>
                            </div>

                            {/* Lysosomes - Labeled */}
                            <div
                              className="absolute top-1/4 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-80 group cursor-pointer"
                              onClick={() => handleOrganelleClick("lysosome")}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Lysosome
                              </div>
                            </div>
                            <div
                              className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-bounce animation-delay-300 opacity-80 group cursor-pointer"
                              onClick={() => handleOrganelleClick("lysosome")}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Lysosome
                              </div>
                            </div>

                            {/* Centrosome - Labeled */}
                            <div
                              className="absolute top-1/3 right-1/2 w-3 h-3 group cursor-pointer"
                              onClick={() => handleOrganelleClick("centrosome")}
                            >
                              <div className="w-1 h-3 bg-yellow-500 rounded-full mx-auto"></div>
                              <div className="w-1 h-3 bg-yellow-500 rounded-full mx-auto transform rotate-90 -mt-3"></div>
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Centrosome
                              </div>
                            </div>

                            {/* Peroxisomes - Labeled */}
                            <div
                              className="absolute top-2/3 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-75 group cursor-pointer"
                              onClick={() => handleOrganelleClick("peroxisome")}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Peroxisome
                              </div>
                            </div>

                            {/* Vesicles - Labeled */}
                            <div
                              className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-60 group cursor-pointer"
                              onClick={() => handleOrganelleClick("vesicle")}
                            >
                              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Vesicle
                              </div>
                            </div>
                            <div
                              className="absolute bottom-1/2 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-ping animation-delay-200 opacity-60 group cursor-pointer"
                              onClick={() => handleOrganelleClick("vesicle")}
                            >
                              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Vesicle
                              </div>
                            </div>
                          </>
                        )}

                        {/* Magnification Effect */}
                        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 rounded-full"></div>

                        {/* Live Magnification Indicator */}
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                          {magnification}x LIVE
                        </div>

                        {/* Scanning Line Effect */}
                        <div className="absolute inset-0 overflow-hidden rounded-full">
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan opacity-60"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Organelle Information Modal */}
                  {showOrganelleInfo &&
                    selectedOrganelle &&
                    organelleInfo[selectedOrganelle as keyof typeof organelleInfo] && (
                      <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={closeOrganelleInfo}
                      >
                        <div
                          className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                              {organelleInfo[selectedOrganelle as keyof typeof organelleInfo].name}
                            </h3>
                            <button onClick={closeOrganelleInfo} className="text-gray-500 hover:text-gray-700 text-2xl">
                              ×
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">What is it?</h4>
                              <p className="text-gray-600 text-sm">
                                {organelleInfo[selectedOrganelle as keyof typeof organelleInfo].description}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">What does it do?</h4>
                              <p className="text-gray-600 text-sm">
                                {organelleInfo[selectedOrganelle as keyof typeof organelleInfo].function}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">Fun Fact! 🤓</h4>
                              <p className="text-blue-600 text-sm font-medium">
                                {organelleInfo[selectedOrganelle as keyof typeof organelleInfo].funFact}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">Found in:</h4>
                              <p className="text-green-600 text-sm font-medium">
                                {organelleInfo[selectedOrganelle as keyof typeof organelleInfo].onlyIn}
                              </p>
                            </div>

                            <div className="flex justify-center pt-4">
                              <button
                                onClick={closeOrganelleInfo}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
                              >
                                Got it! 👍
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Organelle Legend */}
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Organelle Identification Guide
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {currentSpecimen === "plant-parts" ? (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-green-400 rounded"></div>
                            <span>
                              <strong>Cell Wall:</strong> Rigid protective barrier
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>
                              <strong>Nucleus:</strong> Controls cell activities
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>
                              <strong>Chloroplasts:</strong> Make food from sunlight
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-cyan-400 rounded-full"></div>
                            <span>
                              <strong>Vacuole:</strong> Stores water and nutrients
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-300 rounded"></div>
                            <span>
                              <strong>Cytoplasm:</strong> Gel-like cell interior
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-0.5 bg-blue-300 rounded"></div>
                            <span>
                              <strong>Endoplasmic Reticulum:</strong> Protein and lipid synthesis
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-1 bg-orange-400 rounded"></div>
                            <span>
                              <strong>Golgi Apparatus:</strong> Processes and packages proteins
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>
                              <strong>Peroxisomes:</strong> Break down toxic substances
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-700 rounded-full"></div>
                            <span>
                              <strong>Nucleolus:</strong> Makes ribosomes
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-pink-400 rounded-full"></div>
                            <span>
                              <strong>Cell Membrane:</strong> Flexible cell boundary
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                            <span>
                              <strong>Nucleus:</strong> Contains DNA and controls cell
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-1 bg-red-500 rounded-full"></div>
                            <span>
                              <strong>Mitochondria:</strong> Powerhouses that make energy
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                            <span>
                              <strong>Ribosomes:</strong> Make proteins for the cell
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-300 rounded"></div>
                            <span>
                              <strong>Cytoplasm:</strong> Gel-like cell interior
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-0.5 bg-blue-300 rounded"></div>
                            <span>
                              <strong>Endoplasmic Reticulum:</strong> Protein and lipid synthesis
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-1 bg-orange-400 rounded"></div>
                            <span>
                              <strong>Golgi Apparatus:</strong> Processes and packages proteins
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>
                              <strong>Lysosomes:</strong> Digest waste and worn-out parts
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                            <span>
                              <strong>Centrosome:</strong> Organizes cell division
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>
                              <strong>Peroxisomes:</strong> Break down toxic substances
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-cyan-300 rounded-full"></div>
                            <span>
                              <strong>Vesicles:</strong> Transport materials
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                      <strong>Tip:</strong> Hover over organelles to see their labels, or click for more information!
                    </div>
                  </div>

                  {/* Detailed Comparison Table */}
                  <div className="bg-gradient-to-r from-green-50 to-pink-50 p-4 rounded-lg border shadow-sm mt-4">
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      ⚖️ Plant vs Animal Cell Comparison
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-medium">Organelle</th>
                            <th className="text-center p-2 font-medium text-green-700">🌱 Plant Cell</th>
                            <th className="text-center p-2 font-medium text-pink-700">🔴 Animal Cell</th>
                            <th className="text-left p-2 font-medium">Function</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs">
                          <tr className="border-b bg-white/50">
                            <td className="p-2 font-medium">Cell Wall</td>
                            <td className="text-center p-2">
                              ✅ <span className="text-green-600">Present</span>
                            </td>
                            <td className="text-center p-2">
                              ❌ <span className="text-gray-500">Absent</span>
                            </td>
                            <td className="p-2">Rigid protection & shape</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Cell Membrane</td>
                            <td className="text-center p-2">
                              ✅ <span className="text-green-600">Present</span>
                            </td>
                            <td className="text-center p-2">
                              ✅ <span className="text-pink-600">Present</span>
                            </td>
                            <td className="p-2">Controls entry/exit</td>
                          </tr>
                          <tr className="border-b bg-white/50">
                            <td className="p-2 font-medium">Nucleus</td>
                            <td className="text-center p-2">
                              ✅ <span className="text-green-600">Present</span>
                            </td>
                            <td className="text-center p-2">
                              ✅ <span className="text-pink-600">Present</span>
                            </td>
                            <td className="p-2">Controls cell activities</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Chloroplasts</td>
                            <td className="text-center p-2">
                              ✅ <span className="text-green-600">Present</span>
                            </td>
                            <td className="text-center p-2">
                              ❌ <span className="text-gray-500">Absent</span>
                            </td>
                            <td className="p-2">Make food from sunlight</td>
                          </tr>
                          <tr className="border-b bg-white/50">
                            <td className="p-2 font-medium">Large Vacuole</td>
                            <td className="text-center p-2">
                              ✅ <span className="text-green-600">One Large</span>
                            </td>
                            <td className="text-center p-2">
                              ⚠️ <span className="text-orange-600">Many Small</span>
                            </td>
                            <td className="p-2">Water storage</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Mitochondria</td>
                            <td className="text-center p-2">
                              ✅ <span className="text-green-600">Few</span>
                            </td>
                            <td className="text-center p-2">
                              ✅ <span className="text-pink-600">Many</span>
                            </td>
                            <td className="p-2">Produce energy</td>
                          </tr>
                          <tr className="border-b bg-white/50">
                            <td className="p-2 font-medium">Ribosomes</td>
                            <td className="text-center p-2">
                              ✅ <span className="text-green-600">Present</span>
                            </td>
                            <td className="text-center p-2">
                              ✅ <span className="text-pink-600">Present</span>
                            </td>
                            <td className="p-2">Make proteins</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Endoplasmic Reticulum</td>
                            <td className="text-center p-2">
                              ✅ <span className="text-green-600">Present</span>
                            </td>
                            <td className="text-center p-2">
                              ✅ <span className="text-pink-600">Present</span>
                            </td>
                            <td className="p-2">Protein & lipid synthesis</td>
                          </tr>
                          <tr className="border-b bg-white/50">
                            <td className="p-2 font-medium">Golgi Apparatus</td>
                            <td className="text-center p-2">
                              ✅ <span className="text-green-600">Present</span>
                            </td>
                            <td className="text-center p-2">
                              ✅ <span className="text-pink-600">Present</span>
                            </td>
                            <td className="p-2">Process & package proteins</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Lysosomes</td>
                            <td className="text-center p-2">
                              ⚠️ <span className="text-orange-600">Rare</span>
                            </td>
                            <td className="text-center p-2">
                              ✅ <span className="text-pink-600">Many</span>
                            </td>
                            <td className="p-2">Digest waste materials</td>
                          </tr>
                          <tr className="border-b bg-white/50">
                            <td className="p-2 font-medium">Centrosome</td>
                            <td className="text-center p-2">
                              ❌ <span className="text-gray-500">Absent</span>
                            </td>
                            <td className="text-center p-2">
                              ✅ <span className="text-pink-600">Present</span>
                            </td>
                            <td className="p-2">Organize cell division</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Peroxisomes</td>
                            <td className="text-center p-2">
                              ✅ <span className="text-green-600">Present</span>
                            </td>
                            <td className="text-center p-2">
                              ✅ <span className="text-pink-600">Present</span>
                            </td>
                            <td className="p-2">Break down toxins</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-green-100 p-2 rounded">
                        <strong className="text-green-800">🌱 Plant Cell Unique Features:</strong>
                        <ul className="mt-1 space-y-1 text-green-700">
                          <li>• Rigid cell wall for structure</li>
                          <li>• Chloroplasts for photosynthesis</li>
                          <li>• Large central vacuole</li>
                          <li>• Generally rectangular shape</li>
                        </ul>
                      </div>
                      <div className="bg-pink-100 p-2 rounded">
                        <strong className="text-pink-800">🔴 Animal Cell Unique Features:</strong>
                        <ul className="mt-1 space-y-1 text-pink-700">
                          <li>• Flexible cell membrane only</li>
                          <li>• More mitochondria for energy</li>
                          <li>• Multiple small vacuoles</li>
                          <li>• Generally round/irregular shape</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => setMagnification(Math.max(40, magnification - 50))}
                      variant="outline"
                      size="sm"
                    >
                      <ZoomOut className="h-4 w-4 mr-2" />
                      Zoom Out
                    </Button>
                    <Button
                      onClick={() => setMagnification(Math.min(1000, magnification + 50))}
                      variant="outline"
                      size="sm"
                    >
                      <ZoomIn className="h-4 w-4 mr-2" />
                      Zoom In
                    </Button>
                  </div>

                  {/* Quiz Mode Toggle and Timed Challenge */}
                  <div className="space-y-4">
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      >
                        🔬 Compare Cell Types
                      </Button>
                      <Button
                        onClick={startQuiz}
                        variant="outline"
                        size="sm"
                        className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                        disabled={quizMode || timedChallengeMode}
                      >
                        🧠 Start Quiz Mode
                      </Button>
                    </div>

                    {/* Timed Challenge Section */}
                    {!quizMode && !timedChallengeMode && (
                      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            ⚡ Timed Challenge Mode
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">ADVANCED</span>
                          </CardTitle>
                          <CardDescription>
                            Test your speed and accuracy under pressure! Race against time to identify organelles.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Button
                              onClick={() => startTimedChallenge("beginner", 90)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <div className="text-center">
                                <div className="font-bold">🌱 Beginner</div>
                                <div className="text-xs">90 seconds • 3 questions</div>
                              </div>
                            </Button>
                            <Button
                              onClick={() => startTimedChallenge("intermediate", 75)}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <div className="text-center">
                                <div className="font-bold">🔬 Intermediate</div>
                                <div className="text-xs">75 seconds • 3 questions</div>
                              </div>
                            </Button>
                            <Button
                              onClick={() => startTimedChallenge("advanced", 60)}
                              className="bg-purple-500 hover:bg-purple-600 text-white"
                            >
                              <div className="text-center">
                                <div className="font-bold">⚡ Advanced</div>
                                <div className="text-xs">60 seconds • 5 questions</div>
                              </div>
                            </Button>
                          </div>
                          <div className="mt-4 p-3 bg-white rounded-lg border text-sm">
                            <h5 className="font-medium mb-2">🏆 Scoring System:</h5>
                            <ul className="space-y-1 text-xs text-gray-600">
                              <li>
                                • <strong>Base Points:</strong> 10-25 per correct answer
                              </li>
                              <li>
                                • <strong>Speed Bonus:</strong> +5-15 for answers under 5 seconds
                              </li>
                              <li>
                                • <strong>Streak Bonus:</strong> +5 per consecutive correct answer
                              </li>
                              <li>
                                • <strong>Time Pressure:</strong> Less time = higher difficulty = more points!
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Timed Challenge Interface */}
                    {timedChallengeMode && (
                      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              ⚡ Timed Challenge -{" "}
                              {challengeDifficulty.charAt(0).toUpperCase() + challengeDifficulty.slice(1)}
                            </span>
                            <div className="flex items-center gap-4">
                              <div
                                className={`text-2xl font-bold ${challengeTimeLeft <= 10 ? "text-red-600 animate-pulse" : "text-orange-600"}`}
                              >
                                ⏰ {challengeTimeLeft}s
                              </div>
                              <Button onClick={resetTimedChallenge} variant="outline" size="sm">
                                Exit Challenge
                              </Button>
                            </div>
                          </CardTitle>
                          <CardDescription>
                            <div className="flex items-center justify-between">
                              <span>
                                Question {challengeCurrentQuestion + 1}/{challengeQuestions.length}
                              </span>
                              <div className="flex items-center gap-4 text-sm">
                                <span>
                                  Score: <strong className="text-orange-600">{challengeScore}</strong>
                                </span>
                                <span>
                                  Streak: <strong className="text-purple-600">{challengeStreak}🔥</strong>
                                </span>
                              </div>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {!challengeCompleted && challengeQuestions.length > 0 ? (
                            <div className="space-y-4">
                              {/* Progress Bar with Time Indicator */}
                              <div className="flex items-center gap-2 text-sm">
                                <span>Progress:</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${((challengeCurrentQuestion + 1) / challengeQuestions.length) * 100}%`,
                                    }}
                                  ></div>
                                  <div
                                    className="absolute top-0 right-0 bg-red-600 h-3 transition-all duration-1000"
                                    style={{
                                      width: `${(challengeTimeLeft / (challengeDifficulty === "advanced" ? 60 : challengeDifficulty === "intermediate" ? 75 : 90)) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              {/* Current Question */}
                              <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-bold text-lg">
                                    {challengeQuestions[challengeCurrentQuestion]?.question}
                                  </h4>
                                  <div className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                    +{challengeQuestions[challengeCurrentQuestion]?.points} pts
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                  {challengeQuestions[challengeCurrentQuestion]?.options.map(
                                    (option: string, index: number) => (
                                      <button
                                        key={index}
                                        onClick={() => handleChallengeAnswer(option)}
                                        disabled={showQuizResult}
                                        className={`text-left p-3 rounded-lg border-2 transition-all font-medium ${
                                          selectedAnswer === option
                                            ? showQuizResult
                                              ? option === challengeQuestions[challengeCurrentQuestion].correct
                                                ? "bg-green-100 border-green-500 text-green-700"
                                                : "bg-red-100 border-red-500 text-red-700"
                                              : "bg-orange-100 border-orange-500 text-orange-700"
                                            : showQuizResult &&
                                                option === challengeQuestions[challengeCurrentQuestion].correct
                                              ? "bg-green-100 border-green-500 text-green-700"
                                              : "bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-300"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span>
                                            {String.fromCharCode(65 + index)}. {option}
                                          </span>
                                          {showQuizResult &&
                                            option === challengeQuestions[challengeCurrentQuestion].correct && (
                                              <span className="text-green-600">✓</span>
                                            )}
                                        </div>
                                      </button>
                                    ),
                                  )}
                                </div>

                                {showQuizResult && (
                                  <div
                                    className={`mt-4 p-3 rounded-lg border-2 ${
                                      selectedAnswer === challengeQuestions[challengeCurrentQuestion].correct
                                        ? "bg-green-50 border-green-200"
                                        : "bg-red-50 border-red-200"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <p
                                        className={`font-bold ${
                                          selectedAnswer === challengeQuestions[challengeCurrentQuestion].correct
                                            ? "text-green-700"
                                            : "text-red-700"
                                        }`}
                                      >
                                        {selectedAnswer === challengeQuestions[challengeCurrentQuestion].correct
                                          ? `✅ Correct! +${challengeQuestions[challengeCurrentQuestion].points} points`
                                          : "❌ Incorrect!"}
                                      </p>
                                      <div className="text-sm text-gray-600">
                                        Answer time: {(challengeAnswerTime / 1000).toFixed(1)}s
                                      </div>
                                    </div>
                                    {challengeAnswerTime < 5000 &&
                                      selectedAnswer === challengeQuestions[challengeCurrentQuestion].correct && (
                                        <p className="text-sm text-orange-600 mt-1">
                                          ⚡ Speed bonus: +{challengeQuestions[challengeCurrentQuestion].timeBonus}{" "}
                                          points!
                                        </p>
                                      )}
                                    {challengeStreak >= 2 &&
                                      selectedAnswer === challengeQuestions[challengeCurrentQuestion].correct && (
                                        <p className="text-sm text-purple-600 mt-1">
                                          🔥 Streak bonus: +{challengeStreak * 5} points!
                                        </p>
                                      )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            /* Challenge Results */
                            <div className="text-center space-y-4">
                              <div className="text-6xl">{getChallengeRank().icon}</div>
                              <h3 className="text-2xl font-bold">Challenge Complete!</h3>
                              <div className="bg-white p-6 rounded-lg border-2 border-orange-200">
                                <div className="text-4xl font-bold mb-2 text-orange-600">{challengeScore} points</div>
                                <div className="text-lg mb-2">
                                  Rank:{" "}
                                  <span className={`font-bold ${getChallengeRank().color}`}>
                                    {getChallengeRank().rank}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                  <div>
                                    <span className="text-gray-600">Difficulty:</span>
                                    <div className="font-medium capitalize">{challengeDifficulty}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Questions:</span>
                                    <div className="font-medium">{challengeQuestions.length}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Best Streak:</span>
                                    <div className="font-medium">{challengeStreak}🔥</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Time Used:</span>
                                    <div className="font-medium">
                                      {challengeDifficulty === "advanced"
                                        ? 60 - challengeTimeLeft
                                        : challengeDifficulty === "intermediate"
                                          ? 75 - challengeTimeLeft
                                          : 90 - challengeTimeLeft}
                                      s
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 justify-center">
                                  <Button
                                    onClick={() =>
                                      startTimedChallenge(
                                        challengeDifficulty,
                                        challengeDifficulty === "advanced"
                                          ? 60
                                          : challengeDifficulty === "intermediate"
                                            ? 75
                                            : 90,
                                      )
                                    }
                                    variant="outline"
                                  >
                                    Retry Challenge
                                  </Button>
                                  <Button onClick={resetTimedChallenge}>Continue Learning</Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Specimen Selection (only show when not in quiz mode) */}
                    {!quizMode && (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(specimens).map(([key, specimen]) => (
                          <Card
                            key={key}
                            className={`cursor-pointer transition-all ${
                              currentSpecimen === key ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                            }`}
                            onClick={() => setCurrentSpecimen(key)}
                          >
                            <CardContent className="p-4">
                              <h4 className="font-medium flex items-center gap-2">
                                {key === "plant-parts" ? "🌱" : "🔴"} {specimen.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">{specimen.description}</p>

                              {/* Quick organelle preview */}
                              <div className="text-xs space-y-1">
                                {key === "plant-parts" ? (
                                  <div className="flex flex-wrap gap-1">
                                    <span className="bg-green-100 text-green-700 px-1 rounded">Cell Wall</span>
                                    <span className="bg-green-100 text-green-700 px-1 rounded">Chloroplasts</span>
                                    <span className="bg-cyan-100 text-cyan-700 px-1 rounded">Large Vacuole</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-wrap gap-1">
                                    <span className="bg-pink-100 text-pink-700 px-1 rounded">Cell Membrane</span>
                                    <span className="bg-red-100 text-red-700 px-1 rounded">Mitochondria</span>
                                    <span className="bg-yellow-100 text-yellow-700 px-1 rounded">Ribosomes</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Guidance and Scientific Notebook */}
          <div>
            <Tabs defaultValue="guidance" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="guidance">AI Guidance</TabsTrigger>
                <TabsTrigger value="notebook">Lab Notebook</TabsTrigger>
                <TabsTrigger value="quiz">Quiz Results</TabsTrigger>
              </TabsList>

              <TabsContent value="guidance">
                <AIGuidancePanel
                  experimentType="microscopy"
                  gradeLevel="Grade 4-6"
                  currentStep={1}
                  studentProgress={{
                    completedSteps: [],
                    currentObservations: [
                      `Examining ${specimens[currentSpecimen as keyof typeof specimens].name} at ${magnification}x magnification`,
                    ],
                    challenges: [],
                  }}
                />
              </TabsContent>

              <TabsContent value="notebook">
                <ScientificNotebook
                  currentSpecimen={currentSpecimen}
                  magnification={magnification}
                  experimentTime={timer}
                />
              </TabsContent>

              <TabsContent value="quiz">
                <Card>
                  <CardHeader>
                    <CardTitle>📊 Performance Dashboard</CardTitle>
                    <CardDescription>Track your quiz and challenge progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Regular Quiz Results */}
                      {quizCompleted && (
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
                          <h4 className="font-medium mb-3 flex items-center gap-2">🧠 Latest Quiz Results</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Cell Type:</span>
                              <div className="font-medium">
                                {specimens[currentSpecimen as keyof typeof specimens].name}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Score:</span>
                              <div className={`font-medium ${getQuizGrade().color}`}>
                                {quizScore}/{quizQuestions[currentSpecimen as keyof typeof quizQuestions].length} (
                                {Math.round(
                                  (quizScore / quizQuestions[currentSpecimen as keyof typeof quizQuestions].length) *
                                    100,
                                )}
                                %)
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Grade:</span>
                              <div className={`font-medium ${getQuizGrade().color}`}>{getQuizGrade().grade}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Status:</span>
                              <div className="font-medium">{getQuizGrade().message}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Timed Challenge Results */}
                      {challengeCompleted && (
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border">
                          <h4 className="font-medium mb-3 flex items-center gap-2">⚡ Latest Challenge Results</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Difficulty:</span>
                              <div className="font-medium capitalize">{challengeDifficulty}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Final Score:</span>
                              <div className="font-medium text-orange-600">{challengeScore} points</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Rank Achieved:</span>
                              <div className={`font-medium ${getChallengeRank().color}`}>
                                {getChallengeRank().icon} {getChallengeRank().rank}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Best Streak:</span>
                              <div className="font-medium">{challengeStreak} 🔥</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {!quizCompleted && !challengeCompleted && (
                          <div className="text-center py-8 w-full">
                            <div className="text-4xl mb-4">📈</div>
                            <h4 className="font-medium mb-2">No Results Yet</h4>
                            <p className="text-gray-600 mb-4">Take a quiz or challenge to see your performance!</p>
                          </div>
                        )}
                        <Button onClick={startQuiz} variant="outline" className="flex-1">
                          📝 Take Quiz
                        </Button>
                        <Button
                          onClick={() => startTimedChallenge("advanced", 60)}
                          variant="outline"
                          className="flex-1 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                        >
                          ⚡ Timed Challenge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(200px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-700 {
          animation-delay: 700ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  )
}
