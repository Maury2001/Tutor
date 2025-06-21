"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, ArrowRight, ArrowLeft, Zap, Eye } from "lucide-react"

interface WaterMolecule {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  isMovingIn: boolean
  speed: number
  trail: { x: number; y: number }[]
}

interface WaterMoleculeVisualizationProps {
  solutionConcentration: number
  cellState: "normal" | "swelling" | "crenating" | "hemolyzed" | "crenated"
  isRunning: boolean
  showMolecularView?: boolean
}

export function WaterMoleculeVisualization({
  solutionConcentration,
  cellState,
  isRunning,
  showMolecularView = true,
}: WaterMoleculeVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [waterMolecules, setWaterMolecules] = useState<WaterMolecule[]>([])
  const [flowRate, setFlowRate] = useState({ inward: 0, outward: 0 })
  const [totalMoleculesInside, setTotalMoleculesInside] = useState(0)

  // Cell membrane properties
  const cellCenter = { x: 300, y: 200 }
  const cellRadius = 80
  const membraneThickness = 8

  // Initialize water molecules
  useEffect(() => {
    initializeWaterMolecules()
  }, [])

  // Animation loop
  useEffect(() => {
    if (isRunning && showMolecularView) {
      animationRef.current = requestAnimationFrame(updateMolecules)
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
  }, [isRunning, showMolecularView, solutionConcentration, cellState])

  // Draw molecules
  useEffect(() => {
    if (showMolecularView) {
      drawVisualization()
    }
  }, [waterMolecules, showMolecularView])

  const initializeWaterMolecules = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const molecules: WaterMolecule[] = []
    const totalMolecules = 150

    // Calculate water concentration based on solution concentration
    // Lower salt concentration = higher water concentration
    const waterConcentrationOutside = Math.max(0.1, 1 - solutionConcentration / 3)
    const waterConcentrationInside = 0.7 // Typical intracellular water concentration

    // Distribute molecules inside and outside the cell
    const moleculesOutside = Math.floor(totalMolecules * waterConcentrationOutside)
    const moleculesInside = Math.floor(totalMolecules * waterConcentrationInside * 0.3) // Smaller area inside

    // Create molecules outside the cell
    for (let i = 0; i < moleculesOutside; i++) {
      let x, y
      do {
        x = Math.random() * canvas.width
        y = Math.random() * canvas.height
      } while (getDistanceFromCenter(x, y) < cellRadius + membraneThickness)

      molecules.push(createWaterMolecule(i, x, y, false))
    }

    // Create molecules inside the cell
    for (let i = moleculesOutside; i < moleculesOutside + moleculesInside; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * (cellRadius - membraneThickness - 10)
      const x = cellCenter.x + Math.cos(angle) * distance
      const y = cellCenter.y + Math.sin(angle) * distance

      molecules.push(createWaterMolecule(i, x, y, true))
    }

    setWaterMolecules(molecules)
  }

  const createWaterMolecule = (id: number, x: number, y: number, isInside: boolean): WaterMolecule => {
    return {
      id,
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 3 + Math.random() * 2,
      opacity: 0.7 + Math.random() * 0.3,
      isMovingIn: false,
      speed: 0.5 + Math.random() * 1.5,
      trail: [],
    }
  }

  const getDistanceFromCenter = (x: number, y: number) => {
    return Math.sqrt((x - cellCenter.x) ** 2 + (y - cellCenter.y) ** 2)
  }

  const isInsideCell = (x: number, y: number) => {
    return getDistanceFromCenter(x, y) < cellRadius - membraneThickness / 2
  }

  const isInMembrane = (x: number, y: number) => {
    const distance = getDistanceFromCenter(x, y)
    return distance >= cellRadius - membraneThickness && distance <= cellRadius + membraneThickness
  }

  const updateMolecules = () => {
    setWaterMolecules((prevMolecules) => {
      const canvas = canvasRef.current
      if (!canvas) return prevMolecules

      // Calculate osmotic pressure difference
      const waterConcentrationOutside = Math.max(0.1, 1 - solutionConcentration / 3)
      const waterConcentrationInside = 0.7

      // Net flow direction (positive = inward, negative = outward)
      const netFlow = waterConcentrationOutside - waterConcentrationInside
      const flowStrength = Math.abs(netFlow) * 2

      let inwardCount = 0
      let outwardCount = 0
      let insideCount = 0

      const updatedMolecules = prevMolecules.map((molecule) => {
        const newMolecule = { ...molecule }
        const distanceFromCenter = getDistanceFromCenter(newMolecule.x, newMolecule.y)
        const wasInside = isInsideCell(newMolecule.x, newMolecule.y)

        // Update trail
        newMolecule.trail.push({ x: newMolecule.x, y: newMolecule.y })
        if (newMolecule.trail.length > 8) {
          newMolecule.trail.shift()
        }

        // Apply osmotic force when near membrane
        if (isInMembrane(newMolecule.x, newMolecule.y)) {
          const angleToCenter = Math.atan2(cellCenter.y - newMolecule.y, cellCenter.x - newMolecule.x)

          if (netFlow > 0) {
            // Net inward flow (hypotonic solution)
            newMolecule.vx += Math.cos(angleToCenter) * flowStrength * 0.1
            newMolecule.vy += Math.sin(angleToCenter) * flowStrength * 0.1
            newMolecule.isMovingIn = true
            inwardCount++
          } else if (netFlow < 0) {
            // Net outward flow (hypertonic solution)
            newMolecule.vx -= Math.cos(angleToCenter) * flowStrength * 0.1
            newMolecule.vy -= Math.sin(angleToCenter) * flowStrength * 0.1
            newMolecule.isMovingIn = false
            outwardCount++
          }

          // Add some randomness to simulate membrane permeability
          if (Math.random() < 0.1) {
            newMolecule.vx += (Math.random() - 0.5) * 0.5
            newMolecule.vy += (Math.random() - 0.5) * 0.5
          }
        } else {
          // Normal Brownian motion
          newMolecule.vx += (Math.random() - 0.5) * 0.2
          newMolecule.vy += (Math.random() - 0.5) * 0.2
        }

        // Apply velocity damping
        newMolecule.vx *= 0.95
        newMolecule.vy *= 0.95

        // Limit maximum velocity
        const maxVelocity = 3
        const currentVelocity = Math.sqrt(newMolecule.vx ** 2 + newMolecule.vy ** 2)
        if (currentVelocity > maxVelocity) {
          newMolecule.vx = (newMolecule.vx / currentVelocity) * maxVelocity
          newMolecule.vy = (newMolecule.vy / currentVelocity) * maxVelocity
        }

        // Update position
        newMolecule.x += newMolecule.vx
        newMolecule.y += newMolecule.vy

        // Handle membrane crossing
        const newDistanceFromCenter = getDistanceFromCenter(newMolecule.x, newMolecule.y)
        const isNowInside = isInsideCell(newMolecule.x, newMolecule.y)

        // Membrane permeability - allow crossing but with some resistance
        if (isInMembrane(newMolecule.x, newMolecule.y)) {
          // Slow down molecules in membrane
          newMolecule.vx *= 0.7
          newMolecule.vy *= 0.7

          // Chance to pass through membrane pores
          if (Math.random() < 0.3) {
            // Allow passage
            newMolecule.opacity = 0.9
          } else {
            // Reflect off membrane
            const angleToCenter = Math.atan2(cellCenter.y - newMolecule.y, cellCenter.x - newMolecule.x)
            const normalX = Math.cos(angleToCenter)
            const normalY = Math.sin(angleToCenter)

            // Reflect velocity
            const dotProduct = newMolecule.vx * normalX + newMolecule.vy * normalY
            newMolecule.vx -= 2 * dotProduct * normalX * 0.8
            newMolecule.vy -= 2 * dotProduct * normalY * 0.8

            newMolecule.opacity = 0.5
          }
        } else {
          newMolecule.opacity = 0.7 + Math.random() * 0.3
        }

        // Keep molecules within canvas bounds
        if (newMolecule.x < 0 || newMolecule.x > canvas.width) {
          newMolecule.vx *= -0.8
          newMolecule.x = Math.max(0, Math.min(canvas.width, newMolecule.x))
        }
        if (newMolecule.y < 0 || newMolecule.y > canvas.height) {
          newMolecule.vy *= -0.8
          newMolecule.y = Math.max(0, Math.min(canvas.height, newMolecule.y))
        }

        // Count molecules inside
        if (isNowInside) {
          insideCount++
        }

        return newMolecule
      })

      // Update flow rates
      setFlowRate({ inward: inwardCount, outward: outwardCount })
      setTotalMoleculesInside(insideCount)

      return updatedMolecules
    })

    if (isRunning && showMolecularView) {
      animationRef.current = requestAnimationFrame(updateMolecules)
    }
  }

  const drawVisualization = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw solution background with concentration gradient
    drawSolutionBackground(ctx, canvas)

    // Draw concentration field
    drawConcentrationField(ctx, canvas)

    // Draw water molecule trails
    drawMoleculeTrails(ctx)

    // Draw water molecules
    drawWaterMolecules(ctx)

    // Draw cell membrane
    drawCellMembrane(ctx)

    // Draw membrane pores
    drawMembranePores(ctx)

    // Draw flow indicators
    drawFlowIndicators(ctx)

    // Draw molecular information
    drawMolecularInfo(ctx, canvas)
  }

  const drawSolutionBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Outside solution color based on concentration
    const outsideColor = getSolutionColor(solutionConcentration)
    ctx.fillStyle = outsideColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Inside cell color (cytoplasm)
    ctx.fillStyle = "rgba(255, 240, 240, 0.3)" // Light pink for cytoplasm
    ctx.beginPath()
    ctx.arc(cellCenter.x, cellCenter.y, cellRadius - membraneThickness, 0, 2 * Math.PI)
    ctx.fill()
  }

  const drawConcentrationField = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Draw concentration gradient visualization
    const gradient = ctx.createRadialGradient(
      cellCenter.x,
      cellCenter.y,
      cellRadius - membraneThickness,
      cellCenter.x,
      cellCenter.y,
      cellRadius + 100,
    )

    const waterConcentrationOutside = Math.max(0.1, 1 - solutionConcentration / 3)
    const alpha = waterConcentrationOutside * 0.3

    gradient.addColorStop(0, `rgba(173, 216, 230, 0.1)`) // Inside
    gradient.addColorStop(1, `rgba(173, 216, 230, ${alpha})`) // Outside

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const drawMoleculeTrails = (ctx: CanvasRenderingContext2D) => {
    waterMolecules.forEach((molecule) => {
      if (molecule.trail.length > 1) {
        ctx.strokeStyle = `rgba(100, 150, 255, 0.3)`
        ctx.lineWidth = 1
        ctx.beginPath()

        molecule.trail.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })

        ctx.stroke()
      }
    })
  }

  const drawWaterMolecules = (ctx: CanvasRenderingContext2D) => {
    waterMolecules.forEach((molecule) => {
      ctx.save()
      ctx.globalAlpha = molecule.opacity

      // Different colors based on location and movement
      if (isInsideCell(molecule.x, molecule.y)) {
        ctx.fillStyle = "#4FC3F7" // Light blue inside
      } else if (isInMembrane(molecule.x, molecule.y)) {
        ctx.fillStyle = molecule.isMovingIn ? "#2196F3" : "#FF9800" // Blue for inward, orange for outward
      } else {
        ctx.fillStyle = "#81C784" // Green outside
      }

      // Draw water molecule (H2O representation)
      ctx.beginPath()
      ctx.arc(molecule.x, molecule.y, molecule.size, 0, 2 * Math.PI)
      ctx.fill()

      // Add a subtle border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Draw H2O label on some molecules
      if (molecule.id % 20 === 0 && molecule.size > 4) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.font = "8px Arial"
        ctx.textAlign = "center"
        ctx.fillText("H₂O", molecule.x, molecule.y + 2)
      }

      ctx.restore()
    })
  }

  const drawCellMembrane = (ctx: CanvasRenderingContext2D) => {
    // Draw cell membrane with phospholipid bilayer representation
    ctx.strokeStyle = "#8D6E63" // Brown for membrane
    ctx.lineWidth = membraneThickness

    // Outer membrane
    ctx.beginPath()
    ctx.arc(cellCenter.x, cellCenter.y, cellRadius, 0, 2 * Math.PI)
    ctx.stroke()

    // Inner membrane
    ctx.lineWidth = membraneThickness - 2
    ctx.strokeStyle = "#A1887F" // Lighter brown
    ctx.beginPath()
    ctx.arc(cellCenter.x, cellCenter.y, cellRadius - 2, 0, 2 * Math.PI)
    ctx.stroke()

    // Membrane proteins (simplified)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8
      const x = cellCenter.x + Math.cos(angle) * cellRadius
      const y = cellCenter.y + Math.sin(angle) * cellRadius

      ctx.fillStyle = "#5D4037" // Dark brown for proteins
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  const drawMembranePores = (ctx: CanvasRenderingContext2D) => {
    // Draw aquaporins (water channels)
    const poreCount = 12
    for (let i = 0; i < poreCount; i++) {
      const angle = (i * Math.PI * 2) / poreCount + Math.PI / 12
      const x = cellCenter.x + Math.cos(angle) * cellRadius
      const y = cellCenter.y + Math.sin(angle) * cellRadius

      // Pore opening
      ctx.fillStyle = "rgba(173, 216, 230, 0.8)" // Light blue
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, 2 * Math.PI)
      ctx.fill()

      // Pore border
      ctx.strokeStyle = "#1976D2"
      ctx.lineWidth = 1
      ctx.stroke()

      // Label some pores
      if (i % 4 === 0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.font = "8px Arial"
        ctx.textAlign = "center"
        ctx.fillText("AQP", x, y - 8) // Aquaporin
      }
    }
  }

  const drawFlowIndicators = (ctx: CanvasRenderingContext2D) => {
    // Draw flow direction arrows
    const waterConcentrationOutside = Math.max(0.1, 1 - solutionConcentration / 3)
    const waterConcentrationInside = 0.7
    const netFlow = waterConcentrationOutside - waterConcentrationInside

    if (Math.abs(netFlow) > 0.1) {
      const arrowCount = 6
      for (let i = 0; i < arrowCount; i++) {
        const angle = (i * Math.PI * 2) / arrowCount
        const startRadius = netFlow > 0 ? cellRadius + 20 : cellRadius - 20
        const endRadius = netFlow > 0 ? cellRadius - 10 : cellRadius + 20

        const startX = cellCenter.x + Math.cos(angle) * startRadius
        const startY = cellCenter.y + Math.sin(angle) * startRadius
        const endX = cellCenter.x + Math.cos(angle) * endRadius
        const endY = cellCenter.y + Math.sin(angle) * endRadius

        // Arrow color based on flow direction
        ctx.strokeStyle = netFlow > 0 ? "#2196F3" : "#FF5722" // Blue for inward, red for outward
        ctx.lineWidth = 2
        ctx.globalAlpha = Math.abs(netFlow) * 2

        // Draw arrow line
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        // Draw arrowhead
        const arrowLength = 8
        const arrowAngle = Math.PI / 6
        const lineAngle = Math.atan2(endY - startY, endX - startX)

        ctx.beginPath()
        ctx.moveTo(endX, endY)
        ctx.lineTo(
          endX - arrowLength * Math.cos(lineAngle - arrowAngle),
          endY - arrowLength * Math.sin(lineAngle - arrowAngle),
        )
        ctx.moveTo(endX, endY)
        ctx.lineTo(
          endX - arrowLength * Math.cos(lineAngle + arrowAngle),
          endY - arrowLength * Math.sin(lineAngle + arrowAngle),
        )
        ctx.stroke()

        ctx.globalAlpha = 1
      }
    }
  }

  const drawMolecularInfo = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Information panel
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.fillRect(10, 10, 280, 120)

    ctx.fillStyle = "white"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"

    const waterConcentrationOutside = Math.max(0.1, 1 - solutionConcentration / 3)
    const waterConcentrationInside = 0.7

    ctx.fillText(`Solution: ${solutionConcentration.toFixed(1)}% NaCl`, 15, 25)
    ctx.fillText(`Water concentration outside: ${(waterConcentrationOutside * 100).toFixed(1)}%`, 15, 40)
    ctx.fillText(`Water concentration inside: ${(waterConcentrationInside * 100).toFixed(1)}%`, 15, 55)
    ctx.fillText(`Molecules inside cell: ${totalMoleculesInside}`, 15, 70)
    ctx.fillText(`Net flow: ${flowRate.inward - flowRate.outward > 0 ? "Inward" : "Outward"}`, 15, 85)

    // Flow rate indicators
    ctx.fillStyle = "#2196F3"
    ctx.fillText(`→ Inward: ${flowRate.inward}`, 15, 100)
    ctx.fillStyle = "#FF5722"
    ctx.fillText(`← Outward: ${flowRate.outward}`, 15, 115)

    // Legend
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.font = "10px Arial"
    ctx.fillText("Legend:", 200, 25)

    // Color legend
    const legendItems = [
      { color: "#81C784", label: "Outside H₂O" },
      { color: "#4FC3F7", label: "Inside H₂O" },
      { color: "#2196F3", label: "Moving In" },
      { color: "#FF9800", label: "Moving Out" },
    ]

    legendItems.forEach((item, index) => {
      const y = 35 + index * 15
      ctx.fillStyle = item.color
      ctx.beginPath()
      ctx.arc(205, y, 4, 0, 2 * Math.PI)
      ctx.fill()

      ctx.fillStyle = "white"
      ctx.fillText(item.label, 215, y + 3)
    })
  }

  const getSolutionColor = (concentration: number) => {
    if (concentration < 0.5) return "rgba(173, 216, 230, 0.2)" // Light blue (hypotonic)
    if (concentration < 0.9) return "rgba(144, 238, 144, 0.2)" // Light green (slightly hypotonic)
    if (concentration <= 1.1) return "rgba(255, 255, 255, 0.1)" // Clear (isotonic)
    if (concentration <= 2.0) return "rgba(255, 255, 0, 0.1)" // Light yellow (hypertonic)
    return "rgba(255, 165, 0, 0.2)" // Orange (very hypertonic)
  }

  const getFlowDescription = () => {
    const waterConcentrationOutside = Math.max(0.1, 1 - solutionConcentration / 3)
    const waterConcentrationInside = 0.7
    const netFlow = waterConcentrationOutside - waterConcentrationInside

    if (netFlow > 0.2) return "Strong inward flow - Cell swelling"
    if (netFlow > 0.05) return "Moderate inward flow"
    if (netFlow > -0.05) return "Equilibrium - No net flow"
    if (netFlow > -0.2) return "Moderate outward flow"
    return "Strong outward flow - Cell shrinking"
  }

  if (!showMolecularView) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-600" />
          Water Molecule Movement Visualization
          <Badge variant="outline" className="ml-2">
            Molecular Level
          </Badge>
        </CardTitle>
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
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>Molecular View</span>
            </div>
            <div className="mt-1">{getFlowDescription()}</div>
          </div>
        </div>

        {/* Molecular Flow Analysis */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border">
            <div className="text-lg font-bold text-blue-600">{flowRate.inward}</div>
            <div className="text-xs text-blue-700">Molecules Moving In</div>
            <ArrowRight className="h-4 w-4 text-blue-600 mx-auto mt-1" />
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border">
            <div className="text-lg font-bold text-orange-600">{flowRate.outward}</div>
            <div className="text-xs text-orange-700">Molecules Moving Out</div>
            <ArrowLeft className="h-4 w-4 text-orange-600 mx-auto mt-1" />
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border">
            <div className="text-lg font-bold text-green-600">{totalMoleculesInside}</div>
            <div className="text-xs text-green-700">Inside Cell</div>
            <Droplets className="h-4 w-4 text-green-600 mx-auto mt-1" />
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border">
            <div className="text-lg font-bold text-purple-600">{flowRate.inward - flowRate.outward}</div>
            <div className="text-xs text-purple-700">Net Flow Rate</div>
            <Zap className="h-4 w-4 text-purple-600 mx-auto mt-1" />
          </div>
        </div>

        {/* Educational Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">What You're Observing:</h4>
          <div className="text-sm text-blue-700 space-y-2">
            <p>
              <strong>Water Molecules (H₂O):</strong> Small blue circles representing individual water molecules moving
              through the cell membrane.
            </p>
            <p>
              <strong>Aquaporins (AQP):</strong> Special protein channels in the membrane that allow water to pass
              through while blocking other substances.
            </p>
            <p>
              <strong>Concentration Gradient:</strong> Water moves from areas of high water concentration to low water
              concentration.
            </p>
            <p>
              <strong>Osmotic Pressure:</strong> The driving force that pushes water molecules through the membrane
              based on concentration differences.
            </p>
          </div>
        </div>

        {/* Membrane Structure Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">Cell Membrane Structure:</h4>
          <div className="text-sm text-amber-700 space-y-1">
            <p>
              • <strong>Phospholipid Bilayer:</strong> The brown membrane structure that forms the cell boundary
            </p>
            <p>
              • <strong>Aquaporins:</strong> Water-specific channels that facilitate rapid water transport
            </p>
            <p>
              • <strong>Selective Permeability:</strong> Membrane allows water through but blocks salt and other solutes
            </p>
            <p>
              • <strong>Membrane Proteins:</strong> Dark spots that help regulate what enters and exits the cell
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
