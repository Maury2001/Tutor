"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, FastForward } from "lucide-react"

interface AnimationStage {
  id: string
  name: string
  organ: string
  description: string
  duration: number
  processes: string[]
  products: string[]
}

const animationStages: AnimationStage[] = [
  {
    id: "mouth",
    name: "Ingestion",
    organ: "Mouth",
    description: "Food enters the mouth and is mechanically broken down by teeth. Saliva begins chemical digestion.",
    duration: 3000,
    processes: ["Mechanical breakdown", "Salivary amylase action", "Formation of bolus"],
    products: ["Partially digested starch", "Moistened food bolus"],
  },
  {
    id: "esophagus",
    name: "Transport",
    organ: "Esophagus",
    description: "Muscular contractions (peristalsis) push the food bolus down to the stomach.",
    duration: 2000,
    processes: ["Peristaltic waves", "Muscular contractions"],
    products: ["Food bolus moved to stomach"],
  },
  {
    id: "stomach",
    name: "Digestion",
    organ: "Stomach",
    description: "Gastric juices break down proteins. Food is churned and mixed with digestive enzymes.",
    duration: 4000,
    processes: ["Protein digestion", "Acid production", "Mechanical churning"],
    products: ["Chyme", "Partially digested proteins"],
  },
  {
    id: "small-intestine",
    name: "Absorption",
    organ: "Small Intestine",
    description: "Most nutrients are absorbed through villi. Pancreatic enzymes complete digestion.",
    duration: 5000,
    processes: ["Nutrient absorption", "Enzyme action", "Villi absorption"],
    products: ["Glucose", "Amino acids", "Fatty acids", "Vitamins"],
  },
  {
    id: "large-intestine",
    name: "Water Absorption",
    organ: "Large Intestine",
    description: "Water is absorbed and waste is formed into feces for elimination.",
    duration: 3000,
    processes: ["Water absorption", "Waste formation", "Bacterial action"],
    products: ["Formed feces", "Absorbed water"],
  },
  {
    id: "elimination",
    name: "Egestion",
    organ: "Rectum & Anus",
    description: "Waste products are eliminated from the body through the anus.",
    duration: 2000,
    processes: ["Waste elimination", "Sphincter control"],
    products: ["Eliminated waste"],
  },
]

interface DigestiveSystemAnimationProps {
  onStageChange?: (stage: AnimationStage) => void
}

export function DigestiveSystemAnimation({ onStageChange }: DigestiveSystemAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [stageProgress, setStageProgress] = useState(0)
  const [speed, setSpeed] = useState(1)

  const currentStage = animationStages[currentStageIndex]
  const totalDuration = animationStages.reduce((sum, stage) => sum + stage.duration, 0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && currentStageIndex < animationStages.length) {
      interval = setInterval(() => {
        setStageProgress((prev) => {
          const increment = (100 / (currentStage.duration / speed)) * 50 // Update every 50ms
          const newProgress = prev + increment

          if (newProgress >= 100) {
            // Move to next stage
            if (currentStageIndex < animationStages.length - 1) {
              setCurrentStageIndex((prev) => prev + 1)
              setStageProgress(0)
            } else {
              // Animation complete
              setIsPlaying(false)
              setStageProgress(100)
            }
            return 100
          }
          return newProgress
        })
      }, 50)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, currentStageIndex, currentStage.duration, speed])

  useEffect(() => {
    // Calculate overall progress
    const completedStages = currentStageIndex
    const currentStageWeight = (currentStage.duration / totalDuration) * 100
    const currentStageProgress = (stageProgress / 100) * currentStageWeight
    const completedProgress = animationStages
      .slice(0, completedStages)
      .reduce((sum, stage) => sum + (stage.duration / totalDuration) * 100, 0)

    setProgress(completedProgress + currentStageProgress)
  }, [currentStageIndex, stageProgress, currentStage.duration, totalDuration])

  useEffect(() => {
    if (onStageChange) {
      onStageChange(currentStage)
    }
  }, [currentStage, onStageChange])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStageIndex(0)
    setProgress(0)
    setStageProgress(0)
  }

  const handleSpeedChange = () => {
    setSpeed((prev) => (prev >= 3 ? 0.5 : prev + 0.5))
  }

  const getOrganPosition = (organId: string) => {
    const positions = {
      mouth: { top: "5%", left: "45%" },
      esophagus: { top: "20%", left: "47%" },
      stomach: { top: "35%", left: "35%" },
      "small-intestine": { top: "50%", left: "45%" },
      "large-intestine": { top: "65%", left: "55%" },
      elimination: { top: "85%", left: "47%" },
    }
    return positions[organId as keyof typeof positions] || { top: "50%", left: "50%" }
  }

  const getFoodPosition = () => {
    if (currentStageIndex >= animationStages.length) {
      return { top: "90%", left: "47%" }
    }
    const position = getOrganPosition(currentStage.id)
    return position
  }

  return (
    <div className="space-y-4">
      {/* Animation Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Digestive Journey Animation</CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={isPlaying ? handlePause : handlePlay} size="sm" disabled={progress >= 100}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button onClick={handleReset} size="sm" variant="outline">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSpeedChange} size="sm" variant="outline">
              <FastForward className="h-4 w-4" />
              {speed}x
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Animation Display */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="relative w-full h-96 bg-gradient-to-b from-blue-50 to-green-50 rounded-lg border-2 border-gray-200">
            {/* Digestive System Outline */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" style={{ zIndex: 1 }}>
              {/* Mouth */}
              <ellipse cx="180" cy="30" rx="25" ry="15" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />
              <text x="180" y="35" textAnchor="middle" className="text-xs font-medium fill-gray-700">
                Mouth
              </text>

              {/* Esophagus */}
              <rect x="175" y="45" width="10" height="60" fill="#DDA0DD" stroke="#9370DB" strokeWidth="2" />
              <text x="200" y="80" className="text-xs font-medium fill-gray-700">
                Esophagus
              </text>

              {/* Stomach */}
              <ellipse cx="140" cy="130" rx="40" ry="30" fill="#F0E68C" stroke="#DAA520" strokeWidth="2" />
              <text x="140" y="135" textAnchor="middle" className="text-xs font-medium fill-gray-700">
                Stomach
              </text>

              {/* Small Intestine */}
              <path
                d="M 160 160 Q 200 180 180 220 Q 160 240 200 260 Q 240 280 200 300"
                fill="none"
                stroke="#98FB98"
                strokeWidth="15"
                opacity="0.8"
              />
              <text x="180" y="200" textAnchor="middle" className="text-xs font-medium fill-gray-700">
                Small Intestine
              </text>

              {/* Large Intestine */}
              <path
                d="M 200 300 Q 260 320 240 360 Q 220 380 180 360"
                fill="none"
                stroke="#F4A460"
                strokeWidth="20"
                opacity="0.8"
              />
              <text x="220" y="280" textAnchor="middle" className="text-xs font-medium fill-gray-700">
                Large Intestine
              </text>

              {/* Rectum */}
              <rect x="175" y="360" width="10" height="25" fill="#CD853F" stroke="#8B4513" strokeWidth="2" />
              <text x="200" y="375" className="text-xs font-medium fill-gray-700">
                Rectum
              </text>
            </svg>

            {/* Animated Food Particle */}
            <div
              className="absolute w-4 h-4 bg-orange-500 rounded-full shadow-lg transition-all duration-1000 ease-in-out z-10"
              style={{
                ...getFoodPosition(),
                transform: "translate(-50%, -50%)",
                opacity: progress < 100 ? 1 : 0,
                animation: isPlaying ? "pulse 1s infinite" : "none",
              }}
            >
              <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-75"></div>
            </div>

            {/* Stage Highlight */}
            {currentStage && (
              <div
                className="absolute w-16 h-16 border-4 border-blue-500 rounded-full animate-pulse z-5"
                style={{
                  ...getOrganPosition(currentStage.id),
                  transform: "translate(-50%, -50%)",
                  opacity: 0.6,
                }}
              ></div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Stage Information */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Stage {currentStageIndex + 1}: {currentStage.name}
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-800">{currentStage.organ}</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Stage Progress</span>
              <span>{Math.round(stageProgress)}%</span>
            </div>
            <Progress value={stageProgress} className="h-1" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-4">{currentStage.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Processes:</h4>
              <ul className="text-xs space-y-1">
                {currentStage.processes.map((process, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{process}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Products:</h4>
              <div className="flex flex-wrap gap-1">
                {currentStage.products.map((product, index) => (
                  <Badge key={index} variant="outline" className="bg-green-100 text-green-800 text-xs">
                    {product}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animation Complete */}
      {progress >= 100 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">🎉 Digestive Journey Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 text-sm mb-3">
              The food has successfully traveled through the entire digestive system! From ingestion in the mouth to
              egestion at the anus, you've witnessed the amazing 6-8 hour journey that happens every time you eat.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleReset} size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Watch Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}
