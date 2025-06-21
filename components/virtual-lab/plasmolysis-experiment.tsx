"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Droplets, Zap } from "lucide-react"

interface PlasmolysisExperimentProps {
  onDataCollected?: (data: any) => void
}

export function PlasmolysisExperiment({ onDataCollected }: PlasmolysisExperimentProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [saltConcentration, setSaltConcentration] = useState([10])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [cellState, setCellState] = useState("normal")
  const [waterMovement, setWaterMovement] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)

        // Simulate plasmolysis based on salt concentration
        const concentration = saltConcentration[0]
        if (concentration > 15) {
          setCellState("plasmolyzed")
          setWaterMovement(-concentration / 2)
        } else if (concentration > 8) {
          setCellState("shrinking")
          setWaterMovement(-concentration / 4)
        } else {
          setCellState("normal")
          setWaterMovement(0)
        }

        // Collect data for analysis
        if (onDataCollected) {
          onDataCollected({
            time: timeElapsed,
            concentration,
            cellState,
            waterMovement,
          })
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, saltConcentration, timeElapsed, onDataCollected])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setTimeElapsed(0)
    setCellState("normal")
    setWaterMovement(0)
  }

  const getCellColor = () => {
    switch (cellState) {
      case "plasmolyzed":
        return "#ef4444"
      case "shrinking":
        return "#f97316"
      default:
        return "#22c55e"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-blue-500" />
          Plasmolysis Experiment
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

        {/* Salt Concentration Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Salt Concentration: {saltConcentration[0]}%</label>
          <Slider
            value={saltConcentration}
            onValueChange={setSaltConcentration}
            max={30}
            min={0}
            step={1}
            className="w-full"
            disabled={isRunning}
          />
        </div>

        {/* Cell Visualization */}
        <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
          <div className="relative">
            {/* Cell Wall */}
            <div
              className="w-48 h-32 border-4 border-green-600 rounded-lg relative transition-all duration-1000"
              style={{
                borderColor: getCellColor(),
                transform:
                  cellState === "plasmolyzed" ? "scale(0.8)" : cellState === "shrinking" ? "scale(0.9)" : "scale(1)",
              }}
            >
              {/* Cell Membrane */}
              <div
                className="absolute inset-2 rounded border-2 transition-all duration-1000"
                style={{
                  backgroundColor: getCellColor() + "20",
                  borderColor: getCellColor(),
                  transform:
                    cellState === "plasmolyzed" ? "scale(0.7)" : cellState === "shrinking" ? "scale(0.85)" : "scale(1)",
                }}
              >
                {/* Nucleus */}
                <div
                  className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full border-2 transition-all duration-1000"
                  style={{
                    backgroundColor: getCellColor(),
                    borderColor: getCellColor(),
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            </div>

            {/* Water Movement Indicators */}
            {waterMovement !== 0 && (
              <div className="absolute -top-4 -bottom-4 -left-4 -right-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                    style={{
                      top: `${20 + i * 10}%`,
                      left: waterMovement < 0 ? "10%" : "90%",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Status Display */}
          <div className="absolute top-4 right-4 space-y-2">
            <Badge variant={cellState === "normal" ? "default" : "destructive"}>
              {cellState.charAt(0).toUpperCase() + cellState.slice(1)}
            </Badge>
            {waterMovement !== 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Water: {waterMovement > 0 ? "In" : "Out"}
              </Badge>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold">What's happening?</h4>
          <p className="text-sm text-gray-600">
            {cellState === "normal" && "The cell is in a balanced state with equal water movement in and out."}
            {cellState === "shrinking" && "Water is moving out of the cell due to higher salt concentration outside."}
            {cellState === "plasmolyzed" &&
              "The cell membrane has pulled away from the cell wall due to severe water loss."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
