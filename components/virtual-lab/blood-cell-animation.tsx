"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Droplets, AlertTriangle, Info, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WaterMoleculeVisualization } from "./water-molecule-visualization"

interface BloodCell {
  id: number
  x: number
  y: number
  size: number
  state: "normal" | "swelling" | "crenating" | "hemolyzed" | "crenated"
  opacity: number
  rotation: number
  animationPhase: number
}

interface BloodCellAnimationProps {
  solutionConcentration: number
  isRunning: boolean
  onStateChange?: (cellStates: { normal: number; crenated: number; hemolyzed: number }) => void
}

export function BloodCellAnimation({ solutionConcentration, isRunning, onStateChange }: BloodCellAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [bloodCells, setBloodCells] = useState<BloodCell[]>([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showMolecularView, setShowMolecularView] = useState(false)

  // Initialize blood cells
  useEffect(() => {
    initializeBloodCells()
  }, [])

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(updateAnimation)
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
  }, [isRunning, timeElapsed])

  // Draw cells
  useEffect(() => {
    drawBloodCells()
  }, [bloodCells])

  const initializeBloodCells = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const cells: BloodCell[] = []
    const cellCount = 25

    for (let i = 0; i < cellCount; i++) {
      cells.push({
        id: i,
        x: Math.random() * (canvas.width - 40) + 20,
        y: Math.random() * (canvas.height - 40) + 20,
        size: 12 + Math.random() * 4, // 12-16px diameter
        state: "normal",
        opacity: 0.9,
        rotation: Math.random() * 360,
        animationPhase: Math.random() * Math.PI * 2,
      })
    }

    setBloodCells(cells)
  }

  const updateAnimation = () => {
    setTimeElapsed((prev) => prev + 1)

    setBloodCells((prevCells) => {
      const updatedCells = prevCells.map((cell) => {
        const newCell = { ...cell }

        // Determine target state based on solution concentration
        // Normal saline is ~0.9% (isotonic)
        // < 0.9% = hypotonic (causes hemolysis)
        // > 0.9% = hypertonic (causes crenation)

        let targetState: BloodCell["state"] = "normal"

        if (solutionConcentration < 0.5) {
          targetState = "hemolyzed"
        } else if (solutionConcentration < 0.8) {
          targetState = "swelling"
        } else if (solutionConcentration > 1.5) {
          targetState = "crenated"
        } else if (solutionConcentration > 1.0) {
          targetState = "crenating"
        }

        // Gradual state transition
        if (newCell.state !== targetState) {
          const transitionSpeed = 0.02

          if (targetState === "swelling" && newCell.state === "normal") {
            newCell.state = "swelling"
            newCell.size = Math.min(newCell.size + 0.3, 24)
          } else if (targetState === "hemolyzed" && (newCell.state === "swelling" || newCell.state === "normal")) {
            if (newCell.size > 20) {
              newCell.state = "hemolyzed"
              newCell.opacity = Math.max(0.1, newCell.opacity - 0.05)
              newCell.size = Math.max(8, newCell.size - 0.5)
            } else {
              newCell.size = Math.min(newCell.size + 0.4, 26)
            }
          } else if (targetState === "crenating" && newCell.state === "normal") {
            newCell.state = "crenating"
            newCell.size = Math.max(newCell.size - 0.2, 8)
          } else if (targetState === "crenated" && (newCell.state === "crenating" || newCell.state === "normal")) {
            newCell.state = "crenated"
            newCell.size = Math.max(newCell.size - 0.1, 6)
          } else if (targetState === "normal") {
            // Return to normal state
            if (newCell.size > 16) {
              newCell.size = Math.max(newCell.size - 0.2, 14)
            } else if (newCell.size < 12) {
              newCell.size = Math.min(newCell.size + 0.2, 14)
            }

            if (Math.abs(newCell.size - 14) < 1) {
              newCell.state = "normal"
              newCell.opacity = Math.min(0.9, newCell.opacity + 0.02)
            }
          }
        }

        // Update animation phase for floating effect
        newCell.animationPhase += 0.05
        newCell.rotation += 0.5

        // Gentle floating movement
        newCell.x += Math.sin(newCell.animationPhase) * 0.3
        newCell.y += Math.cos(newCell.animationPhase * 0.7) * 0.2

        // Keep cells within bounds
        const canvas = canvasRef.current
        if (canvas) {
          newCell.x = Math.max(20, Math.min(canvas.width - 20, newCell.x))
          newCell.y = Math.max(20, Math.min(canvas.height - 20, newCell.y))
        }

        return newCell
      })

      // Report cell states
      if (onStateChange) {
        const states = {
          normal: updatedCells.filter((c) => c.state === "normal").length,
          crenated: updatedCells.filter((c) => c.state === "crenated" || c.state === "crenating").length,
          hemolyzed: updatedCells.filter((c) => c.state === "hemolyzed").length,
        }
        onStateChange(states)
      }

      return updatedCells
    })

    if (isRunning) {
      animationRef.current = requestAnimationFrame(updateAnimation)
    }
  }

  const drawBloodCells = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background solution
    const solutionColor = getSolutionColor(solutionConcentration)
    ctx.fillStyle = solutionColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw solution concentration gradient
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height) / 2,
    )
    gradient.addColorStop(0, `rgba(${getSolutionRGB(solutionConcentration)}, 0.1)`)
    gradient.addColorStop(1, `rgba(${getSolutionRGB(solutionConcentration)}, 0.3)`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw blood cells
    bloodCells.forEach((cell) => {
      ctx.save()
      ctx.translate(cell.x, cell.y)
      ctx.rotate((cell.rotation * Math.PI) / 180)
      ctx.globalAlpha = cell.opacity

      drawBloodCell(ctx, cell)

      ctx.restore()
    })

    // Draw solution info
    drawSolutionInfo(ctx, canvas)
  }

  const drawBloodCell = (ctx: CanvasRenderingContext2D, cell: BloodCell) => {
    const radius = cell.size / 2

    switch (cell.state) {
      case "normal":
        drawNormalBloodCell(ctx, radius)
        break
      case "swelling":
        drawSwellingBloodCell(ctx, radius)
        break
      case "hemolyzed":
        drawHemolyzedBloodCell(ctx, radius)
        break
      case "crenating":
        drawCrenatingBloodCell(ctx, radius)
        break
      case "crenated":
        drawCrenatedBloodCell(ctx, radius)
        break
    }
  }

  const drawNormalBloodCell = (ctx: CanvasRenderingContext2D, radius: number) => {
    // Normal red blood cell - biconcave disc
    ctx.fillStyle = "#DC2626" // Red
    ctx.strokeStyle = "#B91C1C" // Darker red
    ctx.lineWidth = 1

    // Main cell body
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Biconcave center (lighter area)
    ctx.fillStyle = "#EF4444" // Lighter red
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.4, 0, 2 * Math.PI)
    ctx.fill()
  }

  const drawSwellingBloodCell = (ctx: CanvasRenderingContext2D, radius: number) => {
    // Swelling cell - more spherical, less biconcave
    ctx.fillStyle = "#DC2626"
    ctx.strokeStyle = "#B91C1C"
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Reduced biconcave effect
    ctx.fillStyle = "#F87171" // Even lighter red
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.2, 0, 2 * Math.PI)
    ctx.fill()

    // Add slight glow effect
    ctx.shadowColor = "#DC2626"
    ctx.shadowBlur = 3
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  const drawHemolyzedBloodCell = (ctx: CanvasRenderingContext2D, radius: number) => {
    // Hemolyzed cell - burst, fragmented
    ctx.fillStyle = "#FCA5A5" // Very light red
    ctx.strokeStyle = "#F87171" // Light red
    ctx.lineWidth = 1

    // Draw fragmented pieces
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6
      const fragmentRadius = radius * (0.3 + Math.random() * 0.3)
      const distance = radius * 0.8

      ctx.beginPath()
      ctx.arc(Math.cos(angle) * distance, Math.sin(angle) * distance, fragmentRadius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    }

    // Central remnant
    ctx.fillStyle = "#FECACA"
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.3, 0, 2 * Math.PI)
    ctx.fill()
  }

  const drawCrenatingBloodCell = (ctx: CanvasRenderingContext2D, radius: number) => {
    // Crenating cell - starting to develop spikes
    ctx.fillStyle = "#7C2D12" // Darker red
    ctx.strokeStyle = "#92400E"
    ctx.lineWidth = 1

    // Main body with slight irregularity
    ctx.beginPath()
    for (let i = 0; i <= 16; i++) {
      const angle = (i * Math.PI * 2) / 16
      const variation = 1 + Math.sin(angle * 4) * 0.1 // Slight spikes
      const currentRadius = radius * variation

      if (i === 0) {
        ctx.moveTo(currentRadius, 0)
      } else {
        ctx.lineTo(Math.cos(angle) * currentRadius, Math.sin(angle) * currentRadius)
      }
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Reduced center
    ctx.fillStyle = "#A16207"
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.3, 0, 2 * Math.PI)
    ctx.fill()
  }

  const drawCrenatedBloodCell = (ctx: CanvasRenderingContext2D, radius: number) => {
    // Fully crenated cell - spiky, shrunken
    ctx.fillStyle = "#451A03" // Very dark red
    ctx.strokeStyle = "#78350F"
    ctx.lineWidth = 1

    // Spiky outline
    ctx.beginPath()
    for (let i = 0; i <= 12; i++) {
      const angle = (i * Math.PI * 2) / 12
      const isSpike = i % 2 === 0
      const currentRadius = radius * (isSpike ? 1.2 : 0.7) // Alternating spikes

      if (i === 0) {
        ctx.moveTo(currentRadius, 0)
      } else {
        ctx.lineTo(Math.cos(angle) * currentRadius, Math.sin(angle) * currentRadius)
      }
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Very small center
    ctx.fillStyle = "#92400E"
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.2, 0, 2 * Math.PI)
    ctx.fill()
  }

  const getSolutionColor = (concentration: number) => {
    if (concentration < 0.5) return "rgba(173, 216, 230, 0.3)" // Light blue (hypotonic)
    if (concentration < 0.9) return "rgba(144, 238, 144, 0.3)" // Light green (slightly hypotonic)
    if (concentration <= 1.1) return "rgba(255, 255, 255, 0.1)" // Clear (isotonic)
    if (concentration <= 2.0) return "rgba(255, 255, 0, 0.2)" // Light yellow (hypertonic)
    return "rgba(255, 165, 0, 0.3)" // Orange (very hypertonic)
  }

  const getSolutionRGB = (concentration: number) => {
    if (concentration < 0.5) return "173, 216, 230"
    if (concentration < 0.9) return "144, 238, 144"
    if (concentration <= 1.1) return "255, 255, 255"
    if (concentration <= 2.0) return "255, 255, 0"
    return "255, 165, 0"
  }

  const drawSolutionInfo = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.fillRect(10, 10, 200, 80)

    ctx.fillStyle = "white"
    ctx.font = "12px Arial"
    ctx.fillText(`Solution: ${solutionConcentration.toFixed(1)}% NaCl`, 15, 25)

    const solutionType = getSolutionType(solutionConcentration)
    ctx.fillText(`Type: ${solutionType}`, 15, 40)

    const effect = getCellEffect(solutionConcentration)
    ctx.fillText(`Effect: ${effect}`, 15, 55)

    // Normal saline reference line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(15, 70)
    ctx.lineTo(195, 70)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "10px Arial"
    ctx.fillText("0.9% = Normal Saline (Isotonic)", 15, 85)
  }

  const getSolutionType = (concentration: number) => {
    if (concentration < 0.8) return "Hypotonic"
    if (concentration <= 1.1) return "Isotonic"
    return "Hypertonic"
  }

  const getCellEffect = (concentration: number) => {
    if (concentration < 0.5) return "Hemolysis (Bursting)"
    if (concentration < 0.8) return "Swelling"
    if (concentration <= 1.1) return "Normal Shape"
    if (concentration <= 1.5) return "Shrinking"
    return "Crenation (Spiky)"
  }

  const getCurrentCellState = () => {
    if (solutionConcentration < 0.5) return "hemolyzed"
    if (solutionConcentration < 0.8) return "swelling"
    if (solutionConcentration <= 1.1) return "normal"
    if (solutionConcentration <= 1.5) return "crenating"
    return "crenated"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-red-600" />
          Blood Cell Osmosis Animation
          <Badge variant="outline" className="ml-2">
            {getSolutionType(solutionConcentration)}
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowMolecularView(!showMolecularView)} variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            {showMolecularView ? "Hide" : "Show"} Molecular View
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border rounded-lg bg-white w-full"
            style={{ maxWidth: "100%", height: "auto" }}
          />

          {/* Status overlay */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded text-xs">
            <div>
              Time: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span>Red Blood Cells</span>
            </div>
          </div>
        </div>

        {/* Water Molecule Visualization */}
        {showMolecularView && (
          <WaterMoleculeVisualization
            solutionConcentration={solutionConcentration}
            cellState={getCurrentCellState()}
            isRunning={isRunning}
            showMolecularView={showMolecularView}
          />
        )}

        {/* Solution Concentration Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Solution Concentration (% NaCl)</label>
          <Slider
            value={[solutionConcentration]}
            onValueChange={(value) => {
              // This would be controlled by parent component
            }}
            max={3.0}
            min={0.1}
            step={0.1}
            className="w-full"
            disabled
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>0.1% (Hypotonic)</span>
            <span>0.9% (Isotonic)</span>
            <span>3.0% (Hypertonic)</span>
          </div>
        </div>

        {/* Cell State Information */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border">
            <div className="text-lg font-bold text-green-600">
              {bloodCells.filter((c) => c.state === "normal").length}
            </div>
            <div className="text-xs text-green-700">Normal Cells</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg border">
            <div className="text-lg font-bold text-yellow-600">
              {bloodCells.filter((c) => c.state === "crenated" || c.state === "crenating").length}
            </div>
            <div className="text-xs text-yellow-700">Crenated Cells</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border">
            <div className="text-lg font-bold text-red-600">
              {bloodCells.filter((c) => c.state === "hemolyzed").length}
            </div>
            <div className="text-xs text-red-700">Hemolyzed Cells</div>
          </div>
        </div>

        {/* Educational Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-semibold text-blue-800 mb-1">What You're Observing:</div>
              <div className="text-blue-700">
                {solutionConcentration < 0.5 && (
                  <>
                    <strong>Hemolysis:</strong> Blood cells are bursting due to water influx in the hypotonic solution.
                    This is dangerous and can occur if patients receive pure water instead of saline.
                  </>
                )}
                {solutionConcentration >= 0.5 && solutionConcentration < 0.8 && (
                  <>
                    <strong>Cell Swelling:</strong> Blood cells are taking in water and swelling. If this continues,
                    they may burst (hemolysis).
                  </>
                )}
                {solutionConcentration >= 0.8 && solutionConcentration <= 1.1 && (
                  <>
                    <strong>Normal State:</strong> Blood cells maintain their biconcave disc shape. This is the ideal
                    condition for oxygen transport.
                  </>
                )}
                {solutionConcentration > 1.1 && solutionConcentration <= 1.5 && (
                  <>
                    <strong>Cell Shrinking:</strong> Blood cells are losing water and beginning to shrink. This affects
                    their ability to carry oxygen efficiently.
                  </>
                )}
                {solutionConcentration > 1.5 && (
                  <>
                    <strong>Crenation:</strong> Blood cells have shrunken and developed spiky projections. This severely
                    impairs their function and can block small blood vessels.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Medical Relevance */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-semibold text-amber-800 mb-1">Medical Importance:</div>
              <div className="text-amber-700">
                Understanding blood cell osmosis is crucial for:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Preparing IV fluids (must be isotonic ~0.9% NaCl)</li>
                  <li>Blood storage and transfusion procedures</li>
                  <li>Treating dehydration and electrolyte imbalances</li>
                  <li>Understanding diseases affecting cell membrane integrity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
