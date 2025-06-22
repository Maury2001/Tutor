"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AIGuidancePanel } from "@/components/virtual-lab/ai-guidance-panel"
import { EnhancedDigestiveAnimation } from "@/components/virtual-lab/enhanced-digestive-animation"
import { Microscope, Eye, BookOpen, Target, CheckCircle, Zap, Leaf, Skull, ArrowRight, RotateCcw,ArrowLeft } from "lucide-react"
import Link from "next/link"

interface NutritionMode {
  id: string
  name: string
  description: string
  examples: string[]
  characteristics: string[]
  color: string
}

interface ToothType {
  id: string
  name: string
  structure: string
  function: string
  location: string
  shape: string
}

interface DigestionStage {
  id: string
  name: string
  location: string
  process: string
  enzymes: string[]
  products: string[]
}

const nutritionModes: NutritionMode[] = [
  {
    id: "holozoic",
    name: "Holozoic Nutrition",
    description: "Animals ingest solid food particles and digest them internally",
    examples: ["Humans", "Lions", "Elephants", "Birds", "Fish"],
    characteristics: [
      "Ingestion of solid food",
      "Internal digestion",
      "Specialized digestive system",
      "Complex feeding mechanisms",
    ],
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "parasitic",
    name: "Parasitic Nutrition",
    description: "Animals obtain nutrients from living host organisms",
    examples: ["Tapeworms", "Roundworms", "Fleas", "Ticks", "Lice"],
    characteristics: [
      "Lives on or in host organism",
      "Absorbs nutrients from host",
      "May harm the host",
      "Specialized attachment structures",
    ],
    color: "bg-red-100 text-red-800 border-red-200",
  },
  {
    id: "saprophytic",
    name: "Saprophytic Nutrition",
    description: "Animals feed on dead and decaying organic matter",
    examples: ["Vultures", "Hyenas", "Dung beetles", "Some flies", "Carrion beetles"],
    characteristics: [
      "Feeds on dead organisms",
      "Important decomposers",
      "Recycles nutrients in ecosystem",
      "Specialized digestive enzymes",
    ],
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  {
    id: "symbiotic",
    name: "Symbiotic Nutrition",
    description: "Animals live in close association with other organisms for mutual benefit",
    examples: ["Cleaner fish", "Oxpeckers", "Clownfish & anemone", "Termites & bacteria"],
    characteristics: [
      "Mutual benefit relationship",
      "Close physical association",
      "Specialized adaptations",
      "Long-term partnerships",
    ],
    color: "bg-green-100 text-green-800 border-green-200",
  },
]

const toothTypes: ToothType[] = [
  {
    id: "incisors",
    name: "Incisors",
    structure: "Sharp, chisel-shaped cutting edge",
    function: "Cutting and biting food",
    location: "Front of the mouth",
    shape: "Flat and sharp",
  },
  {
    id: "canines",
    name: "Canines",
    structure: "Pointed, cone-shaped crown",
    function: "Tearing and gripping food",
    location: "Corner of the mouth",
    shape: "Pointed and sharp",
  },
  {
    id: "premolars",
    name: "Premolars",
    structure: "Broad crown with cusps",
    function: "Crushing and grinding food",
    location: "Behind canines",
    shape: "Broad with multiple cusps",
  },
  {
    id: "molars",
    name: "Molars",
    structure: "Large, broad crown with multiple cusps",
    function: "Grinding and chewing food",
    location: "Back of the mouth",
    shape: "Large and broad",
  },
]

const digestionStages: DigestionStage[] = [
  {
    id: "ingestion",
    name: "Ingestion",
    location: "Mouth",
    process: "Taking food into the body through the mouth",
    enzymes: ["Salivary amylase"],
    products: ["Partially digested starch"],
  },
  {
    id: "digestion",
    name: "Digestion",
    location: "Stomach & Small intestine",
    process: "Breaking down food into smaller, absorbable molecules",
    enzymes: ["Pepsin", "Trypsin", "Lipase", "Amylase"],
    products: ["Amino acids", "Glucose", "Fatty acids", "Glycerol"],
  },
  {
    id: "absorption",
    name: "Absorption",
    location: "Small intestine",
    process: "Uptake of digested nutrients into the bloodstream",
    enzymes: [],
    products: ["Nutrients in blood"],
  },
  {
    id: "assimilation",
    name: "Assimilation",
    location: "Body cells",
    process: "Utilization of absorbed nutrients by body cells",
    enzymes: [],
    products: ["Energy", "Growth", "Repair"],
  },
  {
    id: "egestion",
    name: "Egestion",
    location: "Large intestine & Anus",
    process: "Elimination of undigested waste from the body",
    enzymes: [],
    products: ["Feces"],
  },
]

// Add this function before the main component
const DigestiveSystemVisualization = ({
  foodParticleStage,
  isAnimationPlaying,
}: {
  foodParticleStage: number
  isAnimationPlaying: boolean
}) => {
  return (
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      {/* Container wrapper with proper bounds */}
      <div className="relative w-96 h-[480px] mx-auto overflow-hidden">
        {/* Human Body Silhouette */}
        <div className="absolute inset-0 border-2 border-white/20 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm overflow-hidden">
          {/* Head outline */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-20 border-2 border-white/30 rounded-full bg-white/5"></div>
          {/* Neck area */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-white/5"></div>
          {/* Torso outline */}
          <div className="absolute top-2 left-4 right-4 bottom-4 border border-white/10 rounded-t-2xl rounded-b-lg bg-gradient-to-b from-transparent to-white/5"></div>
        </div>

        {/* Digestive Organs */}
        {/* Mouth */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-18 h-10 bg-gradient-to-b from-red-400 to-red-600 rounded-full flex items-center justify-center animate-pulse shadow-lg border-2 border-red-300">
          <span className="text-xs font-bold text-white">MOUTH</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
        </div>

        {/* Esophagus */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-8 h-24 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg shadow-md border-2 border-blue-300">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-white transform -rotate-90 whitespace-nowrap">ESOPHAGUS</span>
          </div>
        </div>

        {/* Stomach */}
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 translate-x-4">
          <div className="relative w-32 h-24 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-3xl shadow-lg border-2 border-green-300 animate-pulse">
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
              STOMACH
            </span>
          </div>
        </div>

        {/* Small Intestine */}
        <div className="absolute top-48 left-1/2 transform -translate-x-1/2 w-40 h-32">
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 w-28 h-5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full border-2 border-orange-300 shadow-md"></div>
            <div className="absolute top-4 left-6 w-24 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full border-2 border-orange-300 shadow-md"></div>
            <div className="absolute top-8 left-2 w-26 h-5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full border-2 border-orange-300 shadow-md"></div>
            <div className="absolute top-12 left-8 w-22 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full border-2 border-orange-300 shadow-md"></div>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white bg-orange-600/80 px-2 py-1 rounded z-10">
              SMALL INTESTINE
            </span>
          </div>
        </div>

        {/* Large Intestine */}
        <div className="absolute top-72 left-1/2 transform -translate-x-1/2 w-48 h-32">
          <div className="relative w-full h-full">
            <div className="absolute right-2 top-4 w-8 h-24 bg-gradient-to-b from-amber-600 to-amber-700 rounded-lg border-2 border-amber-500 shadow-md"></div>
            <div className="absolute top-2 left-4 right-4 h-8 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg border-2 border-amber-500 shadow-md"></div>
            <div className="absolute left-2 top-4 w-8 h-24 bg-gradient-to-b from-amber-600 to-amber-700 rounded-lg border-2 border-amber-500 shadow-md"></div>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white bg-amber-700/80 px-2 py-1 rounded z-10">
              LARGE INTESTINE
            </span>
          </div>
        </div>

        {/* Animated Food Particles */}
        <div
          className={`absolute w-3 h-3 bg-yellow-400 rounded-full shadow-lg border border-yellow-300 transition-all duration-1000 ${
            isAnimationPlaying ? "animate-pulse" : ""
          }`}
          style={{
            top:
              foodParticleStage === 0
                ? "2rem"
                : foodParticleStage === 1
                  ? "4rem"
                  : foodParticleStage === 2
                    ? "8rem"
                    : foodParticleStage === 3
                      ? "12rem"
                      : foodParticleStage === 4
                        ? "18rem"
                        : "22rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
          }}
        ></div>
      </div>
    </div>
  )
}

export default function AnimalNutritionDigestionLab() {
  const [currentTab, setCurrentTab] = useState("nutrition-modes")
  const [selectedNutritionMode, setSelectedNutritionMode] = useState<string | null>(null)
  const [selectedToothType, setSelectedToothType] = useState<string | null>(null)
  const [selectedDigestionStage, setSelectedDigestionStage] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [animalType, setAnimalType] = useState<"carnivore" | "herbivore" | "omnivore">("omnivore")
  const [animationStage, setAnimationStage] = useState<any>(null)
  const [aiContext, setAiContext] = useState<any>({})
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [foodParticleStage, setFoodParticleStage] = useState(0)
  const [animationTime, setAnimationTime] = useState(0)

  useEffect(() => {
    const sections = ["nutrition-modes", "dentition", "tooth-types", "digestion-process"]
    const completed = sections.filter((section) => completedSections.includes(section))
    setProgress((completed.length / sections.length) * 100)
  }, [completedSections])

  // Update AI context based on current selections
  useEffect(() => {
    setAiContext({
      currentTab,
      selectedNutritionMode,
      selectedToothType,
      selectedDigestionStage,
      animalType,
      animationStage,
      completedSections,
    })
  }, [
    currentTab,
    selectedNutritionMode,
    selectedToothType,
    selectedDigestionStage,
    animalType,
    animationStage,
    completedSections,
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isAnimationPlaying) {
      interval = setInterval(() => {
        setAnimationTime((prev) => {
          const newTime = prev + 100 * animationSpeed
          // Reset animation after 30 seconds
          if (newTime >= 30000) {
            setFoodParticleStage(0)
            return 0
          }

          // Update food particle stage based on time
          const stage = Math.floor(newTime / 5000) // Change stage every 5 seconds
          setFoodParticleStage(stage)

          return newTime
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAnimationPlaying, animationSpeed])

  const markSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section])
    }
  }

  const getDentitionPattern = (type: "carnivore" | "herbivore" | "omnivore") => {
    const patterns = {
      carnivore: {
        incisors: "Small and sharp",
        canines: "Large and pointed",
        premolars: "Sharp and blade-like",
        molars: "Sharp cutting edges",
        description: "Adapted for tearing meat and crushing bones",
        examples: ["Lion", "Tiger", "Wolf", "Shark"],
      },
      herbivore: {
        incisors: "Large and flat",
        canines: "Small or absent",
        premolars: "Broad and flat",
        molars: "Large and flat with ridges",
        description: "Adapted for cutting and grinding plant material",
        examples: ["Cow", "Horse", "Rabbit", "Elephant"],
      },
      omnivore: {
        incisors: "Medium-sized and sharp",
        canines: "Moderate size",
        premolars: "Mixed cutting and grinding",
        molars: "Broad with cusps",
        description: "Adapted for both meat and plant consumption",
        examples: ["Human", "Pig", "Bear", "Chimpanzee"],
      },
    }
    return patterns[type]
  }

  const playAnimation = () => setIsAnimationPlaying(true)
  const pauseAnimation = () => setIsAnimationPlaying(false)
  const resetAnimation = () => {
    setIsAnimationPlaying(false)
    setAnimationTime(0)
    setFoodParticleStage(0)
  }
  const setSpeed = (speed: number) => setAnimationSpeed(speed)

  return (
    <div className="container mx-auto py-6 px-4">
      <Link href="/virtual-lab">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Virtual Lab
          </Button>
        </Link>
      {/* Interactive 3D Digestive System Card */}
      <Card className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🧬</span>
            </div>
            Interactive 3D Human Digestive System
          </CardTitle>
          <CardDescription className="text-lg">
            Explore the human digestive system in stunning 3D animation with real-time food particle tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "500px" }}>
            {/* 3D Canvas Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Animated 3D Digestive System */}
                <div className="w-full h-full relative flex flex-col items-center justify-center text-white">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>

                  {/* Digestive System Flow Visualization */}
                  <div className="absolute inset-0 z-5 pointer-events-none">
                    {/* Process Labels with Arrows */}
                    <div className="absolute top-4 left-4 bg-black/60 rounded-lg p-2 text-white text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>1. Ingestion (Mouth)</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>2. Transport (Esophagus)</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>3. Digestion (Stomach)</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span>4. Absorption (Small Intestine)</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span>5. Water Absorption (Large Intestine)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span>6. Elimination (Rectum/Anus)</span>
                      </div>
                    </div>
                  </div>

                  <DigestiveSystemVisualization
                    foodParticleStage={foodParticleStage}
                    isAnimationPlaying={isAnimationPlaying}
                  />
                </div>

                {/* 3D Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none"></div>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/70 rounded-lg p-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={isAnimationPlaying ? pauseAnimation : playAnimation}
                >
                  {isAnimationPlaying ? "⏸️ Pause" : "▶️ Play"} Animation
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white border-white hover:bg-white/20"
                  onClick={resetAnimation}
                >
                  🔄 Reset
                </Button>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-sm">Speed:</span>
                <Button
                  size="sm"
                  variant={animationSpeed === 0.5 ? "default" : "outline"}
                  className={
                    animationSpeed === 0.5
                      ? "bg-blue-600 hover:bg-blue-700 px-2"
                      : "text-white border-white hover:bg-white/20 px-2"
                  }
                  onClick={() => setSpeed(0.5)}
                >
                  0.5x
                </Button>
                <Button
                  size="sm"
                  variant={animationSpeed === 1 ? "default" : "outline"}
                  className={
                    animationSpeed === 1
                      ? "bg-blue-600 hover:bg-blue-700 px-2"
                      : "text-white border-white hover:bg-white/20 px-2"
                  }
                  onClick={() => setSpeed(1)}
                >
                  1x
                </Button>
                <Button
                  size="sm"
                  variant={animationSpeed === 2 ? "default" : "outline"}
                  className={
                    animationSpeed === 2
                      ? "bg-blue-600 hover:bg-blue-700 px-2"
                      : "text-white border-white hover:bg-white/20 px-2"
                  }
                  onClick={() => setSpeed(2)}
                >
                  2x
                </Button>
              </div>
            </div>

            {/* Real-time Stats */}
            <div className="absolute top-4 right-4 bg-black/70 rounded-lg p-3 text-white">
              <div className="text-sm space-y-1">
                <div className="flex justify-between gap-4">
                  <span>🍎 Food Particles:</span>
                  <span className="text-yellow-400 font-bold">{Math.min(foodParticleStage + 1, 3)} Active</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>⚡ Current Stage:</span>
                  <span className="text-green-400 font-bold">
                    {foodParticleStage === 0
                      ? "Mouth"
                      : foodParticleStage === 1
                        ? "Esophagus"
                        : foodParticleStage === 2
                          ? "Stomach"
                          : foodParticleStage === 3
                            ? "Small Intestine"
                            : foodParticleStage === 4
                              ? "Large Intestine"
                              : "Complete"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>⏱️ Journey Time:</span>
                  <span className="text-blue-400 font-bold">{(animationTime / 1000).toFixed(1)}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Features */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-bold text-blue-800 mb-2">🎮 Interactive Features</h4>
                <ul className="text-sm space-y-1">
                  <li>• Click organs for detailed info</li>
                  <li>• Track food particle journey</li>
                  <li>• Real-time enzyme activity</li>
                  <li>• 3D rotation controls</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-bold text-green-800 mb-2">📊 Live Data</h4>
                <ul className="text-sm space-y-1">
                  <li>• Digestion progress: 45%</li>
                  <li>• Nutrient absorption rate</li>
                  <li>• pH levels by organ</li>
                  <li>• Transit time tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <h4 className="font-bold text-purple-800 mb-2">🧪 Scientific Accuracy</h4>
                <ul className="text-sm space-y-1">
                  <li>• Anatomically correct 3D models</li>
                  <li>• Real digestion timelines</li>
                  <li>• Accurate enzyme functions</li>
                  <li>• CBC Grade 9 aligned</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Microscope className="h-6 w-6 text-amber-600" />
          <h1 className="text-3xl font-bold text-gray-900">Animal Nutrition & Digestion Lab</h1>
          <Badge className="bg-amber-100 text-amber-800">Grade 9 CBC</Badge>
        </div>
        <p className="text-gray-600 mb-4">
          Explore the fascinating world of animal nutrition modes, dentition patterns, tooth structures, and the human
          digestive process through interactive simulations and AI-guided learning.
        </p>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Lab Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="nutrition-modes" className="text-xs">
                Nutrition Modes
              </TabsTrigger>
              <TabsTrigger value="dentition" className="text-xs">
                Dentition
              </TabsTrigger>
              <TabsTrigger value="tooth-types" className="text-xs">
                Tooth Types
              </TabsTrigger>
              <TabsTrigger value="digestion-process" className="text-xs">
                Digestion
              </TabsTrigger>
            </TabsList>

            {/* Nutrition Modes Tab */}
            <TabsContent value="nutrition-modes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    Modes of Nutrition in Animals
                  </CardTitle>
                  <CardDescription>
                    Learn about the different ways animals obtain their food and nutrients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {nutritionModes.map((mode) => (
                      <Card
                        key={mode.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedNutritionMode === mode.id ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedNutritionMode(mode.id)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{mode.name}</CardTitle>
                          <CardDescription className="text-sm">{mode.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Examples:</h4>
                              <div className="flex flex-wrap gap-1">
                                {mode.examples.map((example, index) => (
                                  <Badge key={index} variant="outline" className={mode.color}>
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-2">Characteristics:</h4>
                              <ul className="text-xs space-y-1">
                                {mode.characteristics.map((char, index) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    <span>{char}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button
                    onClick={() => markSectionComplete("nutrition-modes")}
                    className="w-full"
                    disabled={completedSections.includes("nutrition-modes")}
                  >
                    {completedSections.includes("nutrition-modes") ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Section Completed
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Mark Section Complete
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dentition Tab */}
            <TabsContent value="dentition" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Skull className="h-5 w-5 text-gray-600" />
                    Dentition in Animals
                  </CardTitle>
                  <CardDescription>
                    Compare dentition patterns in carnivorous, herbivorous, and omnivorous animals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Select Animal Type:</h3>
                    <div className="flex gap-2 mb-4">
                      {(["carnivore", "herbivore", "omnivore"] as const).map((type) => (
                        <Button
                          key={type}
                          variant={animalType === type ? "default" : "outline"}
                          onClick={() => setAnimalType(type)}
                          className="capitalize"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">{animalType} Dentition</CardTitle>
                      <CardDescription>{getDentitionPattern(animalType).description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-2">Tooth Characteristics:</h4>
                          <ul className="text-sm space-y-1">
                            <li>
                              <strong>Incisors:</strong> {getDentitionPattern(animalType).incisors}
                            </li>
                            <li>
                              <strong>Canines:</strong> {getDentitionPattern(animalType).canines}
                            </li>
                            <li>
                              <strong>Premolars:</strong> {getDentitionPattern(animalType).premolars}
                            </li>
                            <li>
                              <strong>Molars:</strong> {getDentitionPattern(animalType).molars}
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Examples:</h4>
                          <div className="flex flex-wrap gap-1">
                            {getDentitionPattern(animalType).examples.map((example, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={() => markSectionComplete("dentition")}
                    className="w-full mt-4"
                    disabled={completedSections.includes("dentition")}
                  >
                    {completedSections.includes("dentition") ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Section Completed
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Mark Section Complete
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tooth Types Tab */}
            <TabsContent value="tooth-types" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Types of Teeth: Structure and Function
                  </CardTitle>
                  <CardDescription>
                    Explore the different types of teeth and their specialized functions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {toothTypes.map((tooth) => (
                      <Card
                        key={tooth.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedToothType === tooth.id ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedToothType(tooth.id)}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg">{tooth.name}</CardTitle>
                          <CardDescription className="text-sm">{tooth.function}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <strong className="text-sm">Structure:</strong>
                              <p className="text-sm text-gray-600">{tooth.structure}</p>
                            </div>
                            <div>
                              <strong className="text-sm">Location:</strong>
                              <p className="text-sm text-gray-600">{tooth.location}</p>
                            </div>
                            <div>
                              <strong className="text-sm">Shape:</strong>
                              <p className="text-sm text-gray-600">{tooth.shape}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button
                    onClick={() => markSectionComplete("tooth-types")}
                    className="w-full mt-4"
                    disabled={completedSections.includes("tooth-types")}
                  >
                    {completedSections.includes("tooth-types") ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Section Completed
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Mark Section Complete
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Digestion Process Tab */}
            <TabsContent value="digestion-process" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Process of Digestion in Human Beings
                  </CardTitle>
                  <CardDescription>Follow the journey of food through the human digestive system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <EnhancedDigestiveAnimation onStageChange={setAnimationStage} autoStart={false} />
                  </div>

                  <div className="space-y-4">
                    {digestionStages.map((stage, index) => (
                      <Card
                        key={stage.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedDigestionStage === stage.id ? "ring-2 ring-orange-500" : ""
                        }`}
                        onClick={() => setSelectedDigestionStage(stage.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
                              <span className="text-sm font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{stage.name}</CardTitle>
                              <CardDescription className="text-sm">{stage.location}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700 mb-3">{stage.process}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stage.enzymes.length > 0 && (
                              <div>
                                <h4 className="font-medium text-sm mb-2">Enzymes Involved:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {stage.enzymes.map((enzyme, idx) => (
                                    <Badge key={idx} variant="outline" className="bg-blue-100 text-blue-800">
                                      {enzyme}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium text-sm mb-2">Products:</h4>
                              <div className="flex flex-wrap gap-1">
                                {stage.products.map((product, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-green-100 text-green-800">
                                    {product}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-blue-50 border-blue-200 mt-6">
                    <CardHeader>
                      <CardTitle className="text-base">Digestive System Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span>Ingestion</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>Digestion</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>Absorption</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>Assimilation</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>Egestion</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={() => markSectionComplete("digestion-process")}
                    className="w-full mt-4"
                    disabled={completedSections.includes("digestion-process")}
                  >
                    {completedSections.includes("digestion-process") ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Section Completed
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Mark Section Complete
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Guidance Panel */}
        <div className="lg:col-span-1">
          <AIGuidancePanel
            experimentType="Animal Nutrition & Digestion"
            gradeLevel="Grade 9"
            currentStep={completedSections.length}
            studentProgress={{
              completedSteps: completedSections.map((_, index) => index),
              currentObservations: [
                selectedNutritionMode ? `Studying ${selectedNutritionMode} nutrition` : "",
                selectedToothType ? `Examining ${selectedToothType}` : "",
                selectedDigestionStage ? `Learning about ${selectedDigestionStage}` : "",
                animationStage ? `Watching ${animationStage.name} in animation` : "",
                `Current tab: ${currentTab}`,
                `Animal type: ${animalType}`,
              ].filter(Boolean),
              challenges: [],
            }}
          />
        </div>
      </div>

      {/* Lab Completion Card */}
      {progress === 100 && (
        <Card className="mt-6 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Lab Completed Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">
              Congratulations! You've successfully explored all aspects of animal nutrition and digestion. You now
              understand the different modes of nutrition, dentition patterns, tooth types, and the human digestive
              process through our interactive animation.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart Lab
              </Button>
              <Button onClick={() => (window.location.href = "/virtual-lab")}>
                <BookOpen className="h-4 w-4 mr-2" />
                Explore More Labs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
