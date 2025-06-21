"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Settings, Beaker } from "lucide-react"

interface SimulationState {
  isRunning: boolean
  timeElapsed: number
  waterMolecules: WaterMolecule[]
  cellSize: number
  membranePermeability: number
  internalConcentration: number
  externalConcentration: number
  osmosisRate: number
  equilibriumReached: boolean
}

interface WaterMolecule {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  isInside: boolean
  size: number
}

interface OsmosisSimulatorProps {
  experimentType: "potato" | "egg" | "plant-cell" | "dialysis"
  onDataUpdate?: (data: any) => void
}

export function OsmosisSimulator({ experimentType, onDataUpdate }: OsmosisSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    timeElapsed: 0,
    waterMolecules: [],
    cellSize: 150,
    membranePermeability: 0.5,
    internalConcentration: 20,
    externalConcentration: 10,
    osmosisRate: 0,
    equilibriumReached: false,
  })

  const [showSettings, setShowSettings] = useState(false)

  // Initialize water molecules
  useEffect(() => {
    initializeWaterMolecules()
  }, [])

  // Animation loop
  useEffect(() => {
    if (simulationState.isRunning) {
      animationRef.current = requestAnimationFrame(updateSimulation)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [simulationState.isRunning])

  // Draw simulation
  useEffect(() => {
    drawSimulation()
  }, [simulationState])

  const initializeWaterMolecules = () => {
    const molecules: WaterMolecule[] = []
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const cellRadius = simulationState.cellSize / 2

    // Create molecules inside the cell
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * 2 * Math.PI
      const radius = Math.random() * (cellRadius - 10)
      molecules.push({
        id: i,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        isInside: true,
        size: 3,
      })
    }

    // Create molecules outside the cell
    for (let i = 30; i < 80; i++) {
      let x, y
      do {
        x = Math.random() * canvas.width
        y = Math.random() * canvas.height
        const dx = x - centerX
        const dy = y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance > cellRadius + 20) break
      } while (true)

      molecules.push({
        id: i,
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        isInside: false,
        size: 3,
      })
    }

    setSimulationState((prev) => ({ ...prev, waterMolecules: molecules }))
  }

  const updateSimulation = () => {
    setSimulationState((prev) => {
      const canvas = canvasRef.current
      if (!canvas) return prev

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const cellRadius = prev.cellSize / 2

      // Update molecule positions
      const updatedMolecules = prev.waterMolecules.map((molecule) => {
        let newX = molecule.x + molecule.vx
        let newY = molecule.y + molecule.vy
        let newVx = molecule.vx
        let newVy = molecule.vy
        let newIsInside = molecule.isInside

        // Bounce off canvas edges
        if (newX <= 0 || newX >= canvas.width) newVx = -newVx
        if (newY <= 0 || newY >= canvas.height) newVy = -newVy

        // Check membrane crossing
        const dx = newX - centerX
        const dy = newY - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const wasInside = molecule.isInside
        const isNowInside = distance < cellRadius

        // Handle membrane permeability
        if (wasInside !== isNowInside) {
          const crossingProbability = prev.membranePermeability * 0.1
          if (Math.random() < crossingProbability) {
            newIsInside = isNowInside
          } else {
            // Bounce off membrane
            const normal = { x: dx / distance, y: dy / distance }
            newVx = molecule.vx - 2 * (molecule.vx * normal.x) * normal.x
            newVy = molecule.vy - 2 * (molecule.vy * normal.y) * normal.y
            newX = molecule.x
            newY = molecule.y
          }
        }

        // Add random motion
        newVx += (Math.random() - 0.5) * 0.1
        newVy += (Math.random() - 0.5) * 0.1

        // Limit velocity
        const speed = Math.sqrt(newVx * newVx + newVy * newVy)
        if (speed > 3) {
          newVx = (newVx / speed) * 3
          newVy = (newVy / speed) * 3
        }

        return {
          ...molecule,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          isInside: newIsInside,
        }
      })

      // Calculate osmosis rate
      const insideMolecules = updatedMolecules.filter((m) => m.isInside).length
      const outsideMolecules = updatedMolecules.filter((m) => !m.isInside).length
      const concentrationGradient = prev.externalConcentration - prev.internalConcentration
      const newOsmosisRate = concentrationGradient * prev.membranePermeability * 0.1

      // Update cell size based on water movement
      const targetSize = 150 + (insideMolecules - 30) * 2
      const newCellSize = prev.cellSize + (targetSize - prev.cellSize) * 0.05

      // Check equilibrium
      const equilibrium = Math.abs(concentrationGradient) < 1

      const newState = {
        ...prev,
        timeElapsed: prev.timeElapsed + 1,
        waterMolecules: updatedMolecules,
        cellSize: Math.max(100, Math.min(200, newCellSize)),
        osmosisRate: newOsmosisRate,
        equilibriumReached: equilibrium,
      }

      // Update parent component
      if (onDataUpdate) {
        onDataUpdate({
          timeElapsed: newState.timeElapsed,
          cellSize: newState.cellSize,
          osmosisRate: newState.osmosisRate,
          equilibriumReached: newState.equilibriumReached,
          moleculeCount: {
            inside: insideMolecules,
            outside: outsideMolecules,
          },
        })
      }

      return newState
    })

    if (simulationState.isRunning) {
      animationRef.current = requestAnimationFrame(updateSimulation)
    }
  }

  const drawSimulation = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const cellRadius = simulationState.cellSize / 2

    // Draw external solution background
    ctx.fillStyle = "rgba(173, 216, 230, 0.3)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw cell membrane
    ctx.strokeStyle = "#2d5a27"
    ctx.lineWidth = 4
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    ctx.arc(centerX, centerY, cellRadius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw cell interior
    ctx.fillStyle = "rgba(144, 238, 144, 0.2)"
    ctx.beginPath()
    ctx.arc(centerX, centerY, cellRadius, 0, 2 * Math.PI)
    ctx.fill()

    // Draw water molecules
    simulationState.waterMolecules.forEach((molecule) => {
      ctx.fillStyle = molecule.isInside ? "#4169E1" : "#1E90FF"
      ctx.beginPath()
      ctx.arc(molecule.x, molecule.y, molecule.size, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw concentration labels
    ctx.fillStyle = "#000"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"

    // Internal concentration
    ctx.fillText(`Internal: ${simulationState.internalConcentration}%`, centerX, centerY - 10)

    // External concentration
    ctx.fillText(`External: ${simulationState.externalConcentration}%`, centerX, 30)

    // Draw osmosis direction arrow
    if (Math.abs(simulationState.osmosisRate) > 0.1) {
      const arrowDirection = simulationState.osmosisRate > 0 ? 1 : -1
      const arrowX = centerX + (cellRadius + 30) * arrowDirection
      const arrowY = centerY

      ctx.strokeStyle = "#FF6347"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX + cellRadius * arrowDirection * 0.7, centerY)
      ctx.lineTo(arrowX, arrowY)
      ctx.stroke()

      // Arrow head
      ctx.beginPath()
      ctx.moveTo(arrowX, arrowY)
      ctx.lineTo(arrowX - 10 * arrowDirection, arrowY - 5)
      ctx.lineTo(arrowX - 10 * arrowDirection, arrowY + 5)
      ctx.closePath()
      ctx.fillStyle = "#FF6347"
      ctx.fill()
    }

    // Draw equilibrium indicator
    if (simulationState.equilibriumReached) {
      ctx.fillStyle = "rgba(0, 255, 0, 0.8)"
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("EQUILIBRIUM REACHED", centerX, canvas.height - 20)
    }
  }

  const startSimulation = () => {
    setSimulationState((prev) => ({ ...prev, isRunning: true }))
  }

  const pauseSimulation = () => {
    setSimulationState((prev) => ({ ...prev, isRunning: false }))
  }

  const resetSimulation = () => {
    setSimulationState((prev) => ({
      ...prev,
      isRunning: false,
      timeElapsed: 0,
      cellSize: 150,
      osmosisRate: 0,
      equilibriumReached: false,
    }))
    initializeWaterMolecules()
  }

  const updateConcentration = (type: "internal" | "external", value: number[]) => {
    setSimulationState((prev) => ({
      ...prev,
      [type === "internal" ? "internalConcentration" : "externalConcentration"]: value[0],
    }))
  }

  const updatePermeability = (value: number[]) => {
    setSimulationState((prev) => ({ ...prev, membranePermeability: value[0] }))
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Beaker className="h-5 w-5" />
              Osmosis Molecular Simulator
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={simulationState.isRunning ? pauseSimulation : startSimulation}
                variant={simulationState.isRunning ? "secondary" : "default"}
                size="sm"
              >
                {simulationState.isRunning ? (
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
              <Button onClick={resetSimulation} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => setShowSettings(!showSettings)} variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Simulation Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="border rounded-lg bg-white w-full"
              style={{ maxWidth: "100%", height: "auto" }}
            />

            {/* Status Overlay */}
            <div className="absolute top-2 left-2 space-y-1">
              <Badge variant={simulationState.isRunning ? "default" : "secondary"}>
                {simulationState.isRunning ? "Running" : "Paused"}
              </Badge>
              <Badge variant="outline">
                Time: {Math.floor(simulationState.timeElapsed / 60)}:
                {(simulationState.timeElapsed % 60).toString().padStart(2, "0")}
              </Badge>
              {simulationState.equilibriumReached && (
                <Badge variant="default" className="bg-green-600">
                  Equilibrium
                </Badge>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-4">
              <h4 className="font-semibold">Simulation Parameters</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Internal Concentration (%)</label>
                  <Slider
                    value={[simulationState.internalConcentration]}
                    onValueChange={(value) => updateConcentration("internal", value)}
                    max={50}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-xs text-gray-600">{simulationState.internalConcentration}%</span>
                </div>

                <div>
                  <label className="text-sm font-medium">External Concentration (%)</label>
                  <Slider
                    value={[simulationState.externalConcentration]}
                    onValueChange={(value) => updateConcentration("external", value)}
                    max={50}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-xs text-gray-600">{simulationState.externalConcentration}%</span>
                </div>

                <div>
                  <label className="text-sm font-medium">Membrane Permeability</label>
                  <Slider
                    value={[simulationState.membranePermeability]}
                    onValueChange={updatePermeability}
                    max={1}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                  <span className="text-xs text-gray-600">{simulationState.membranePermeability.toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Data */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{simulationState.cellSize.toFixed(0)}%</div>
                <div className="text-xs text-gray-600">Cell Size</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-green-600">{simulationState.osmosisRate.toFixed(2)}</div>
                <div className="text-xs text-gray-600">Osmosis Rate</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-purple-600">
                  {simulationState.waterMolecules.filter((m) => m.isInside).length}
                </div>
                <div className="text-xs text-gray-600">Inside Molecules</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-orange-600">
                  {simulationState.waterMolecules.filter((m) => !m.isInside).length}
                </div>
                <div className="text-xs text-gray-600">Outside Molecules</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
