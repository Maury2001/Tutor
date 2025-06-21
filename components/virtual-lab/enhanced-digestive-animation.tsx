"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"

interface DigestiveStage {
  id: string
  name: string
  description: string
  duration: number
  color: string
  position: { x: number; y: number }
}

interface EnhancedDigestiveAnimationProps {
  onStageChange?: (stage: DigestiveStage) => void
  autoStart?: boolean
}

const digestiveStages: DigestiveStage[] = [
  {
    id: "mouth",
    name: "Mouth",
    description: "Mechanical breakdown and salivary enzyme action",
    duration: 1000,
    color: "#3B82F6",
    position: { x: 50, y: 10 },
  },
  {
    id: "esophagus",
    name: "Esophagus",
    description: "Peristaltic movement to stomach",
    duration: 800,
    color: "#8B5CF6",
    position: { x: 50, y: 25 },
  },
  {
    id: "stomach",
    name: "Stomach",
    description: "Acid digestion and protein breakdown",
    duration: 2000,
    color: "#EF4444",
    position: { x: 45, y: 45 },
  },
  {
    id: "small-intestine",
    name: "Small Intestine",
    description: "Nutrient absorption through villi",
    duration: 3000,
    color: "#10B981",
    position: { x: 55, y: 65 },
  },
  {
    id: "large-intestine",
    name: "Large Intestine",
    description: "Water absorption and waste formation",
    duration: 1500,
    color: "#F59E0B",
    position: { x: 35, y: 80 },
  },
  {
    id: "anus",
    name: "Anus",
    description: "Waste elimination",
    duration: 500,
    color: "#6B7280",
    position: { x: 50, y: 95 },
  },
]

export function EnhancedDigestiveAnimation({ onStageChange, autoStart = false }: EnhancedDigestiveAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(autoStart)
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [speed, setSpeed] = useState([1])
  const [foodParticles, setFoodParticles] = useState<Array<{ id: number; stage: number; progress: number }>>([])
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)

  const currentStage = digestiveStages[currentStageIndex]

  useEffect(() => {
    if (onStageChange && currentStage) {
      onStageChange(currentStage)
    }
  }, [currentStage, onStageChange])

  useEffect(() => {
    if (isPlaying) {
      const animate = (timestamp: number) => {
        if (lastTimeRef.current === 0) {
          lastTimeRef.current = timestamp
        }

        const deltaTime = (timestamp - lastTimeRef.current) * speed[0]
        lastTimeRef.current = timestamp

        setProgress((prev) => {
          const newProgress = prev + deltaTime / currentStage.duration
          if (newProgress >= 1) {
            if (currentStageIndex < digestiveStages.length - 1) {
              setCurrentStageIndex((prev) => prev + 1)
              return 0
            } else {
              setIsPlaying(false)
              return 1
            }
          }
          return newProgress
        })

        // Update food particles
        setFoodParticles((prev) =>
          prev.map((particle) => ({
            ...particle,
            progress: Math.min(particle.progress + deltaTime / 2000, 1),
          })),
        )

        if (isPlaying) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, currentStageIndex, currentStage.duration, speed])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      lastTimeRef.current = 0
    }
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStageIndex(0)
    setProgress(0)
    setFoodParticles([])
    lastTimeRef.current = 0
  }

  const addFoodParticle = () => {
    const newParticle = {
      id: Date.now(),
      stage: 0,
      progress: 0,
    }
    setFoodParticles((prev) => [...prev, newParticle])
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Human Digestive System Animation</span>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {currentStage.name}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Animation Canvas */}
        <div className="relative bg-gradient-to-b from-blue-50 to-green-50 rounded-lg p-4 h-96 overflow-hidden">
          {/* Digestive System Outline */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Digestive tract path */}
            <path
              d="M 50 10 Q 50 15 50 20 Q 50 25 50 30 Q 45 35 45 45 Q 45 50 50 55 Q 55 60 55 65 Q 55 70 50 75 Q 45 80 35 80 Q 30 85 35 90 Q 40 95 50 95"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />

            {/* Stage indicators */}
            {digestiveStages.map((stage, index) => (
              <g key={stage.id}>
                <circle
                  cx={stage.position.x}
                  cy={stage.position.y}
                  r="3"
                  fill={index === currentStageIndex ? stage.color : "#D1D5DB"}
                  className={`transition-all duration-300 ${index === currentStageIndex ? "animate-pulse" : ""}`}
                />
                <text
                  x={stage.position.x + 5}
                  y={stage.position.y + 1}
                  fontSize="3"
                  fill="#374151"
                  className="font-medium"
                >
                  {stage.name}
                </text>
              </g>
            ))}

            {/* Food particles */}
            {foodParticles.map((particle) => {
              const stageData = digestiveStages[Math.min(particle.stage, digestiveStages.length - 1)]
              const nextStage = digestiveStages[Math.min(particle.stage + 1, digestiveStages.length - 1)]
              const x = stageData.position.x + (nextStage.position.x - stageData.position.x) * particle.progress
              const y = stageData.position.y + (nextStage.position.y - stageData.position.y) * particle.progress

              return <circle key={particle.id} cx={x} cy={y} r="1.5" fill="#F97316" className="animate-pulse" />
            })}

            {/* Current stage highlight */}
            <circle
              cx={currentStage.position.x}
              cy={currentStage.position.y}
              r="6"
              fill="none"
              stroke={currentStage.color}
              strokeWidth="2"
              className="animate-pulse"
              opacity="0.7"
            />
          </svg>

          {/* Progress indicator */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{currentStage.name}</span>
                <span className="text-xs text-gray-600">{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundColor: currentStage.color,
                  }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">{currentStage.description}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={togglePlayPause} size="sm">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={reset} size="sm" variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button onClick={addFoodParticle} size="sm" variant="outline">
              Add Food
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Speed:</span>
            <div className="w-20">
              <Slider value={speed} onValueChange={setSpeed} max={3} min={0.5} step={0.5} className="w-full" />
            </div>
            <span className="text-sm text-gray-600">{speed[0]}x</span>
          </div>
        </div>

        {/* Stage Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-1">Current Stage</h4>
            <p className="text-sm text-blue-700">{currentStage.name}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-800 mb-1">Process</h4>
            <p className="text-sm text-green-700">{currentStage.description}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-1">Progress</h4>
            <p className="text-sm text-orange-700">
              Stage {currentStageIndex + 1} of {digestiveStages.length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
