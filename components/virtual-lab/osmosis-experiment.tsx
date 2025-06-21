"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Beaker, ArrowRight, ArrowLeft } from "lucide-react"

interface OsmosisExperimentProps {
  onDataCollected?: (data: any) => void
}

export function OsmosisExperiment({ onDataCollected }: OsmosisExperimentProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [leftConcentration, setLeftConcentration] = useState([5])
  const [rightConcentration, setRightConcentration] = useState([15])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [waterLevel, setWaterLevel] = useState(50) // Percentage of water on left side
  const [flowDirection, setFlowDirection] = useState<"left" | "right" | "equilibrium">("right")

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)

        // Calculate water movement based on concentration difference
        const concentrationDiff = rightConcentration[0] - leftConcentration[0]

        if (Math.abs(concentrationDiff) < 1) {
          setFlowDirection("equilibrium")
        } else if (concentrationDiff > 0) {
          setFlowDirection("right")
          setWaterLevel((prev) => Math.max(20, prev - 0.5))
        } else {
          setFlowDirection("left")
          setWaterLevel((prev) => Math.min(80, prev + 0.5))
        }

        // Collect data for analysis
        if (onDataCollected) {
          onDataCollected({
            time: timeElapsed,
            leftConcentration: leftConcentration[0],
            rightConcentration: rightConcentration[0],
            waterLevel,
            flowDirection,
          })
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, leftConcentration, rightConcentration, timeElapsed, waterLevel, onDataCollected])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setTimeElapsed(0)
    setWaterLevel(50)
    setFlowDirection("right")
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="h-6 w-6 text-blue-500" />
          Osmosis Experiment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            onClick={isRunning ? handlePause : handleStart}
            variant={isRunning ? "secondary" : "default"}
            className="flex items-center gap-2"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Badge variant="secondary">Time: {timeElapsed}s</Badge>
        </div>

        {/* Concentration Controls */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Left Side Concentration: {leftConcentration[0]}%</label>
            <Slider
              value={leftConcentration}
              onValueChange={setLeftConcentration}
              max={25}
              min={0}
              step={1}
              className="w-full"
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Right Side Concentration: {rightConcentration[0]}%</label>
            <Slider
              value={rightConcentration}
              onValueChange={setRightConcentration}
              max={25}
              min={0}
              step={1}
              className="w-full"
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Osmosis Visualization */}
        <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-8 min-h-[300px]">
          <div className="flex items-center justify-center h-full">
            {/* Left Container */}
            <div className="relative w-32 h-48 border-4 border-gray-400 rounded-b-lg overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
                style={{
                  height: `${waterLevel}%`,
                  backgroundColor: `rgba(59, 130, 246, ${0.3 + leftConcentration[0] / 50})`,
                }}
              />
              <div className="absolute top-2 left-2 right-2 text-xs text-center font-medium">
                {leftConcentration[0]}%
              </div>
            </div>

            {/* Membrane */}
            <div className="relative mx-4">
              <div className="w-2 h-48 bg-yellow-400 rounded-full relative">
                {/* Pores */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full left-1/2 transform -translate-x-1/2"
                    style={{ top: `${10 + i * 10}%` }}
                  />
                ))}
              </div>

              {/* Flow Indicators */}
              {flowDirection !== "equilibrium" && (
                <div className="absolute top-1/2 transform -translate-y-1/2">
                  {flowDirection === "right" ? (
                    <ArrowRight className="h-6 w-6 text-blue-500 animate-pulse -ml-2" />
                  ) : (
                    <ArrowLeft className="h-6 w-6 text-blue-500 animate-pulse -ml-4" />
                  )}
                </div>
              )}
            </div>

            {/* Right Container */}
            <div className="relative w-32 h-48 border-4 border-gray-400 rounded-b-lg overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
                style={{
                  height: `${100 - waterLevel}%`,
                  backgroundColor: `rgba(59, 130, 246, ${0.3 + rightConcentration[0] / 50})`,
                }}
              />
              <div className="absolute top-2 left-2 right-2 text-xs text-center font-medium">
                {rightConcentration[0]}%
              </div>
            </div>
          </div>

          {/* Status Display */}
          <div className="absolute top-4 right-4 space-y-2">
            <Badge variant={flowDirection === "equilibrium" ? "default" : "secondary"}>
              {flowDirection === "equilibrium" ? "Equilibrium" : `Flow: ${flowDirection}`}
            </Badge>
            <Badge variant="outline">Water Level: {waterLevel.toFixed(1)}%</Badge>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold">Understanding Osmosis</h4>
          <p className="text-sm text-gray-600">
            Water moves through the semipermeable membrane from areas of low solute concentration to high solute
            concentration, attempting to equalize the concentrations on both sides.
          </p>
          <p className="text-sm text-gray-600">
            Current status:{" "}
            {flowDirection === "equilibrium"
              ? "The system has reached equilibrium."
              : `Water is moving ${flowDirection === "right" ? "from left to right" : "from right to left"}.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
