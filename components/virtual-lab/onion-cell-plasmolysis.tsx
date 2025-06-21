"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Microscope, ZoomIn, ZoomOut, RotateCcw, Eye, AlertCircle, Info } from "lucide-react"

interface OnionCell {
  id: number
  x: number
  y: number
  cellWallSize: number
  membraneSize: number
  nucleusSize: number
  vacuoleSize: number
  plasmolysisLevel: number
  isVisible: boolean
  opacity: number
}

interface OnionCellPlasmolysisProps {
  solutionConcentration: number
  isRunning: boolean
  magnification: number
  onMagnificationChange: (mag: number) => void
}

export function OnionCellPlasmolysis({
  solutionConcentration,
  isRunning,
  magnification,
  onMagnificationChange,
}: OnionCellPlasmolysisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [onionCells, setOnionCells] = useState<OnionCell[]>([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [focusedCell, setFocusedCell] = useState<number>(0)
  const [showCellDetails, setShowCellDetails] = useState(true)

  // Initialize onion cells
  useEffect(() => {
    initializeOnionCells()
  }, [])

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(updateCells)
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
  }, [isRunning, timeElapsed, solutionConcentration])

  // Draw cells
  useEffect(() => {
    drawOnionCells()
  }, [onionCells, magnification, focusedCell])

  const initializeOnionCells = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const cells: OnionCell[] = []
    const cellsPerRow = 4
    const cellsPerCol = 3
    const cellSpacing = 120

    for (let row = 0; row < cellsPerCol; row++) {
      for (let col = 0; col < cellsPerRow; col++) {
        const id = row * cellsPerRow + col
        cells.push({
          id,
          x: 80 + col * cellSpacing,
          y: 80 + row * cellSpacing,
          cellWallSize: 80,
          membraneSize: 75,
          nucleusSize: 15,
          vacuoleSize: 60,
          plasmolysisLevel: 0,
          isVisible: true,
          opacity: 0.9,
        })
      }
    }

    setOnionCells(cells)
  }

  const updateCells = () => {
    setTimeElapsed((prev) => prev + 1)

    setOnionCells((prevCells) => {
      return prevCells.map((cell) => {
        const newCell = { ...cell }

        // Calculate plasmolysis level based on solution concentration
        // Normal cell sap concentration is about 0.3M (roughly 1.8% sucrose equivalent)
        // Higher external concentration causes plasmolysis
        let targetPlasmolysis = 0

        if (solutionConcentration > 1.0) {
          // Hypertonic solution causes plasmolysis
          targetPlasmolysis = Math.min(0.8, (solutionConcentration - 1.0) * 0.4)
        } else if (solutionConcentration < 0.5) {
          // Hypotonic solution causes cell to become turgid
          targetPlasmolysis = Math.max(-0.2, (solutionConcentration - 0.5) * 0.1)
        }

        // Gradual transition to target plasmolysis level
        const transitionSpeed = 0.01
        if (newCell.plasmolysisLevel < targetPlasmolysis) {
          newCell.plasmolysisLevel = Math.min(targetPlasmolysis, newCell.plasmolysisLevel + transitionSpeed)
        } else if (newCell.plasmolysisLevel > targetPlasmolysis) {
          newCell.plasmolysisLevel = Math.max(targetPlasmolysis, newCell.plasmolysisLevel - transitionSpeed)
        }

        // Update cell components based on plasmolysis level
        if (newCell.plasmolysisLevel > 0) {
          // Plasmolysis - membrane pulls away from cell wall
          newCell.membraneSize = 75 - newCell.plasmolysisLevel * 25
          newCell.vacuoleSize = 60 - newCell.plasmolysisLevel * 35
          newCell.nucleusSize = 15 - newCell.plasmolysisLevel * 5
        } else {
          // Turgid state - cell components expand
          newCell.membraneSize = 75 + Math.abs(newCell.plasmolysisLevel) * 5
          newCell.vacuoleSize = 60 + Math.abs(newCell.plasmolysisLevel) * 10
          newCell.nucleusSize = 15 + Math.abs(newCell.plasmolysisLevel) * 2
        }

        return newCell
      })
    })

    if (isRunning) {
      animationRef.current = requestAnimationFrame(updateCells)
    }
  }

  const drawOnionCells = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw microscope field background
    drawMicroscopeField(ctx, canvas)

    // Draw grid lines for microscope view
    drawMicroscopeGrid(ctx, canvas)

    // Draw onion cells
    onionCells.forEach((cell, index) => {
      const isSelected = index === focusedCell
      drawOnionCell(ctx, cell, isSelected)
    })

    // Draw magnification info
    drawMagnificationInfo(ctx, canvas)

    // Draw solution concentration indicator
    drawSolutionIndicator(ctx, canvas)
  }

  const drawMicroscopeField = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Microscope field of view (circular)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) / 2 - 20

    // Field background
    ctx.fillStyle = "#F8F9FA"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Circular field of view
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.clip()

    // Light microscope background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, "#FFFFFF")
    gradient.addColorStop(0.7, "#F0F8FF")
    gradient.addColorStop(1, "#E6F3FF")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.restore()

    // Field of view border
    ctx.strokeStyle = "#333333"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.stroke()
  }

  const drawMicroscopeGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (magnification > 200) {
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
      ctx.lineWidth = 1

      const gridSize = 20
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }
  }

  const drawOnionCell = (ctx: CanvasRenderingContext2D, cell: OnionCell, isSelected: boolean) => {
    const scale = magnification / 100
    const scaledX = cell.x * scale
    const scaledY = cell.y * scale

    ctx.save()
    ctx.translate(scaledX, scaledY)
    ctx.globalAlpha = cell.opacity

    // Selection highlight
    if (isSelected) {
      ctx.strokeStyle = "#FFD700"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.rect(
        (-cell.cellWallSize / 2) * scale - 5,
        (-cell.cellWallSize / 2) * scale - 5,
        cell.cellWallSize * scale + 10,
        cell.cellWallSize * scale + 10,
      )
      ctx.stroke()
    }

    // Cell wall (rigid, doesn't change during plasmolysis)
    ctx.strokeStyle = "#8B4513" // Brown
    ctx.lineWidth = 3 * scale
    ctx.fillStyle = "rgba(139, 69, 19, 0.1)"
    ctx.beginPath()
    ctx.rect(
      (-cell.cellWallSize / 2) * scale,
      (-cell.cellWallSize / 2) * scale,
      cell.cellWallSize * scale,
      cell.cellWallSize * scale,
    )
    ctx.fill()
    ctx.stroke()

    // Cell membrane (changes position during plasmolysis)
    const membraneOffset = cell.plasmolysisLevel > 0 ? cell.plasmolysisLevel * 15 * scale : 0
    ctx.strokeStyle = "#4A90E2" // Blue
    ctx.lineWidth = 2 * scale
    ctx.fillStyle = "rgba(74, 144, 226, 0.1)"

    if (cell.plasmolysisLevel > 0) {
      // Plasmolyzed - membrane pulls away from corners
      const membraneSize = cell.membraneSize * scale
      ctx.beginPath()
      ctx.roundRect(-membraneSize / 2, -membraneSize / 2, membraneSize, membraneSize, 10 * scale)
      ctx.fill()
      ctx.stroke()
    } else {
      // Normal or turgid - membrane against cell wall
      ctx.beginPath()
      ctx.rect(
        (-cell.membraneSize / 2) * scale,
        (-cell.membraneSize / 2) * scale,
        cell.membraneSize * scale,
        cell.membraneSize * scale,
      )
      ctx.fill()
      ctx.stroke()
    }

    // Vacuole (large, changes size during plasmolysis)
    ctx.fillStyle =
      cell.plasmolysisLevel > 0
        ? `rgba(173, 216, 230, ${0.6 - cell.plasmolysisLevel * 0.3})`
        : "rgba(173, 216, 230, 0.6)"
    ctx.strokeStyle = "#87CEEB"
    ctx.lineWidth = 1 * scale

    const vacuoleSize = cell.vacuoleSize * scale
    ctx.beginPath()
    if (cell.plasmolysisLevel > 0) {
      // Shrunken vacuole
      ctx.arc(0, 0, vacuoleSize / 2, 0, 2 * Math.PI)
    } else {
      // Normal vacuole
      ctx.roundRect(-vacuoleSize / 2, -vacuoleSize / 2, vacuoleSize, vacuoleSize, 5 * scale)
    }
    ctx.fill()
    ctx.stroke()

    // Nucleus (small, moves with cytoplasm during plasmolysis)
    const nucleusOffset =
      cell.plasmolysisLevel > 0
        ? { x: Math.cos(timeElapsed * 0.01) * 10 * scale, y: Math.sin(timeElapsed * 0.01) * 10 * scale }
        : { x: 0, y: 0 }

    ctx.fillStyle = "#8B008B" // Dark magenta
    ctx.strokeStyle = "#4B0082" // Indigo
    ctx.lineWidth = 1 * scale

    const nucleusSize = cell.nucleusSize * scale
    ctx.beginPath()
    ctx.arc(nucleusOffset.x, nucleusOffset.y, nucleusSize / 2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Nucleolus
    ctx.fillStyle = "#2F0F2F"
    ctx.beginPath()
    ctx.arc(nucleusOffset.x, nucleusOffset.y, nucleusSize / 4, 0, 2 * Math.PI)
    ctx.fill()

    // Cytoplasm strands (visible during plasmolysis)
    if (cell.plasmolysisLevel > 0.3) {
      ctx.strokeStyle = "rgba(255, 182, 193, 0.8)" // Light pink
      ctx.lineWidth = 1 * scale

      // Draw cytoplasmic strands connecting membrane to cell wall
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8
        const wallX = Math.cos(angle) * (cell.cellWallSize / 2 - 5) * scale
        const wallY = Math.sin(angle) * (cell.cellWallSize / 2 - 5) * scale
        const membraneX = Math.cos(angle) * (cell.membraneSize / 2) * scale
        const membraneY = Math.sin(angle) * (cell.membraneSize / 2) * scale

        ctx.beginPath()
        ctx.moveTo(wallX, wallY)
        ctx.lineTo(membraneX, membraneY)
        ctx.stroke()
      }
    }

    // Cell labels (if magnification is high enough)
    if (magnification > 150 && showCellDetails) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.font = `${8 * scale}px Arial`
      ctx.textAlign = "center"

      if (cell.plasmolysisLevel > 0.2) {
        ctx.fillText("Plasmolyzed", 0, (-cell.cellWallSize / 2) * scale - 10)
      } else if (cell.plasmolysisLevel < -0.1) {
        ctx.fillText("Turgid", 0, (-cell.cellWallSize / 2) * scale - 10)
      } else {
        ctx.fillText("Normal", 0, (-cell.cellWallSize / 2) * scale - 10)
      }
    }

    ctx.restore()
  }

  const drawMagnificationInfo = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.fillRect(10, 10, 150, 60)

    ctx.fillStyle = "white"
    ctx.font = "12px Arial"
    ctx.fillText(`Magnification: ${magnification}x`, 15, 25)
    ctx.fillText(`Objective: ${getMagnificationObjective(magnification)}`, 15, 40)
    ctx.fillText(`Field: ${getFieldOfView(magnification)}μm`, 15, 55)
  }

  const drawSolutionIndicator = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.fillRect(canvas.width - 180, 10, 170, 80)

    ctx.fillStyle = "white"
    ctx.font = "12px Arial"
    ctx.fillText(`Solution: ${solutionConcentration.toFixed(1)}% Sucrose`, canvas.width - 175, 25)

    const solutionType = getSolutionType(solutionConcentration)
    ctx.fillText(`Type: ${solutionType}`, canvas.width - 175, 40)

    const effect = getExpectedEffect(solutionConcentration)
    ctx.fillText(`Effect: ${effect}`, canvas.width - 175, 55)

    // Plasmolysis level indicator
    const avgPlasmolysis = onionCells.reduce((sum, cell) => sum + cell.plasmolysisLevel, 0) / onionCells.length
    ctx.fillText(`Plasmolysis: ${(avgPlasmolysis * 100).toFixed(1)}%`, canvas.width - 175, 70)
  }

  const getMagnificationObjective = (mag: number) => {
    if (mag <= 40) return "4x"
    if (mag <= 100) return "10x"
    if (mag <= 400) return "40x"
    return "100x"
  }

  const getFieldOfView = (mag: number) => {
    // Approximate field of view in micrometers
    return Math.round(4000 / mag)
  }

  const getSolutionType = (concentration: number) => {
    if (concentration < 0.5) return "Hypotonic"
    if (concentration <= 1.5) return "Isotonic"
    return "Hypertonic"
  }

  const getExpectedEffect = (concentration: number) => {
    if (concentration < 0.5) return "Cell Turgid"
    if (concentration <= 1.5) return "Normal"
    if (concentration <= 3.0) return "Mild Plasmolysis"
    return "Severe Plasmolysis"
  }

  const resetExperiment = () => {
    setTimeElapsed(0)
    initializeOnionCells()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Microscope className="h-5 w-5 text-purple-600" />
          Onion Cell Plasmolysis - Microscope View
          <Badge variant="outline" className="ml-2">
            {getSolutionType(solutionConcentration)}
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => onMagnificationChange(Math.max(40, magnification - 50))} variant="outline" size="sm">
            <ZoomOut className="h-4 w-4 mr-1" />
            Zoom Out
          </Button>
          <Button onClick={() => onMagnificationChange(Math.min(1000, magnification + 50))} variant="outline" size="sm">
            <ZoomIn className="h-4 w-4 mr-1" />
            Zoom In
          </Button>
          <Button onClick={resetExperiment} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button onClick={() => setShowCellDetails(!showCellDetails)} variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            {showCellDetails ? "Hide" : "Show"} Labels
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Microscope Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border rounded-lg bg-white w-full cursor-crosshair"
            style={{ maxWidth: "100%", height: "auto" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const y = e.clientY - rect.top
              // Find closest cell to click position
              const scale = magnification / 100
              let closestCell = 0
              let minDistance = Number.POSITIVE_INFINITY

              onionCells.forEach((cell, index) => {
                const cellX = cell.x * scale
                const cellY = cell.y * scale
                const distance = Math.sqrt((x - cellX) ** 2 + (y - cellY) ** 2)
                if (distance < minDistance) {
                  minDistance = distance
                  closestCell = index
                }
              })

              setFocusedCell(closestCell)
            }}
          />

          {/* Microscope controls overlay */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white p-2 rounded text-xs">
            <div>Click cells to focus</div>
            <div>Cell {focusedCell + 1} selected</div>
          </div>
        </div>

        {/* Magnification Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Microscope Magnification</label>
          <Slider
            value={[magnification]}
            onValueChange={(value) => onMagnificationChange(value[0])}
            max={1000}
            min={40}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>40x (Low Power)</span>
            <span>400x (High Power)</span>
            <span>1000x (Oil Immersion)</span>
          </div>
        </div>

        {/* Cell Analysis */}
        <Tabs defaultValue="observations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="observations">Observations</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="theory">Theory</TabsTrigger>
          </TabsList>

          <TabsContent value="observations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Microscopic Observations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onionCells.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Cell {focusedCell + 1} Details:</h4>
                        <div className="text-sm space-y-1">
                          <div>Plasmolysis Level: {(onionCells[focusedCell]?.plasmolysisLevel * 100).toFixed(1)}%</div>
                          <div>Membrane Size: {onionCells[focusedCell]?.membraneSize.toFixed(1)}μm</div>
                          <div>Vacuole Size: {onionCells[focusedCell]?.vacuoleSize.toFixed(1)}μm</div>
                          <div>
                            State:{" "}
                            {onionCells[focusedCell]?.plasmolysisLevel > 0.2
                              ? "Plasmolyzed"
                              : onionCells[focusedCell]?.plasmolysisLevel < -0.1
                                ? "Turgid"
                                : "Normal"}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Overall Field:</h4>
                        <div className="text-sm space-y-1">
                          <div>Normal Cells: {onionCells.filter((c) => Math.abs(c.plasmolysisLevel) < 0.1).length}</div>
                          <div>Plasmolyzed: {onionCells.filter((c) => c.plasmolysisLevel > 0.2).length}</div>
                          <div>Turgid: {onionCells.filter((c) => c.plasmolysisLevel < -0.1).length}</div>
                          <div>
                            Time Elapsed: {Math.floor(timeElapsed / 60)}:
                            {(timeElapsed % 60).toString().padStart(2, "0")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="measurements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quantitative Measurements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2">Cell #</th>
                        <th className="border border-gray-300 p-2">Cell Wall (μm)</th>
                        <th className="border border-gray-300 p-2">Membrane (μm)</th>
                        <th className="border border-gray-300 p-2">Vacuole (μm)</th>
                        <th className="border border-gray-300 p-2">Plasmolysis %</th>
                        <th className="border border-gray-300 p-2">State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onionCells.slice(0, 6).map((cell, index) => (
                        <tr key={cell.id} className={index === focusedCell ? "bg-yellow-50" : ""}>
                          <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                          <td className="border border-gray-300 p-2 text-center">{cell.cellWallSize}</td>
                          <td className="border border-gray-300 p-2 text-center">{cell.membraneSize.toFixed(1)}</td>
                          <td className="border border-gray-300 p-2 text-center">{cell.vacuoleSize.toFixed(1)}</td>
                          <td className="border border-gray-300 p-2 text-center">
                            {(cell.plasmolysisLevel * 100).toFixed(1)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {cell.plasmolysisLevel > 0.2
                              ? "Plasmolyzed"
                              : cell.plasmolysisLevel < -0.1
                                ? "Turgid"
                                : "Normal"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plasmolysis Theory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-semibold text-blue-800 mb-1">What is Plasmolysis?</div>
                        <div className="text-blue-700">
                          Plasmolysis occurs when plant cells lose water in a hypertonic solution. The cell membrane
                          pulls away from the rigid cell wall as the cytoplasm shrinks, creating visible gaps.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-semibold text-amber-800 mb-1">Key Observations:</div>
                        <ul className="text-amber-700 list-disc list-inside space-y-1">
                          <li>Cell wall remains rigid and unchanged</li>
                          <li>Cell membrane shrinks and pulls away from corners</li>
                          <li>Vacuole becomes smaller and more spherical</li>
                          <li>Cytoplasmic strands may remain connected to cell wall</li>
                          <li>Nucleus moves with the shrinking cytoplasm</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm">
                      <div className="font-semibold text-green-800 mb-1">Deplasmolysis:</div>
                      <div className="text-green-700">
                        When plasmolyzed cells are placed back in hypotonic solution, they can recover through
                        deplasmolysis - the cell membrane returns to the cell wall as water re-enters the cell.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
