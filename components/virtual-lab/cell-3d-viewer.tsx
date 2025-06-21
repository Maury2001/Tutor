"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw, Play, Pause, Move3D, Eye, MousePointer } from "lucide-react"

interface Point3D {
  x: number
  y: number
  z: number
}

interface Point2D {
  x: number
  y: number
}

interface CellComponent3D {
  type: "cellWall" | "membrane" | "vacuole" | "nucleus" | "cytoplasm" | "strand"
  points: Point3D[]
  color: string
  opacity: number
  wireframe?: boolean
}

interface Cell3DViewerProps {
  solutionConcentration: number
  isRunning: boolean
  plasmolysisLevel: number
}

export function Cell3DViewer({ solutionConcentration, isRunning, plasmolysisLevel }: Cell3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0, isDown: false })

  const [rotation, setRotation] = useState({ x: 0.3, y: 0.3, z: 0 })
  const [autoRotate, setAutoRotate] = useState(true)
  const [viewMode, setViewMode] = useState<"solid" | "wireframe" | "cross-section">("solid")
  const [zoom, setZoom] = useState(300)
  const [showComponents, setShowComponents] = useState({
    cellWall: true,
    membrane: true,
    vacuole: true,
    nucleus: true,
    cytoplasm: true,
    strands: true,
  })
  const [crossSectionDepth, setCrossSectionDepth] = useState(0)
  const [lightingAngle, setLightingAngle] = useState(45)

  // 3D to 2D projection
  const project3D = useCallback(
    (point: Point3D, canvasWidth: number, canvasHeight: number): Point2D => {
      const distance = 800
      const centerX = canvasWidth / 2
      const centerY = canvasHeight / 2

      // Apply rotation transformations
      const cosX = Math.cos(rotation.x)
      const sinX = Math.sin(rotation.x)
      const cosY = Math.cos(rotation.y)
      const sinY = Math.sin(rotation.y)
      const cosZ = Math.cos(rotation.z)
      const sinZ = Math.sin(rotation.z)

      // Rotate around X axis
      const y1 = point.y * cosX - point.z * sinX
      const z1 = point.y * sinX + point.z * cosX

      // Rotate around Y axis
      const x2 = point.x * cosY + z1 * sinY
      const z2 = -point.x * sinY + z1 * cosY

      // Rotate around Z axis
      const x3 = x2 * cosZ - y1 * sinZ
      const y3 = x2 * sinZ + y1 * cosZ

      // Perspective projection
      const scale = distance / (distance + z2)

      return {
        x: centerX + x3 * scale * (zoom / 300),
        y: centerY + y3 * scale * (zoom / 300),
      }
    },
    [rotation, zoom],
  )

  // Generate 3D cell components
  const generateCellComponents = useCallback((): CellComponent3D[] => {
    const components: CellComponent3D[] = []
    const size = 80

    // Calculate plasmolysis effects
    const membraneOffset = plasmolysisLevel * 20
    const vacuoleReduction = plasmolysisLevel * 30
    const nucleusOffset = plasmolysisLevel * 15

    // Cell Wall (cube - doesn't change during plasmolysis)
    if (showComponents.cellWall) {
      const cellWallPoints: Point3D[] = []
      const s = size / 2

      // Generate cube vertices
      for (let x = -1; x <= 1; x += 2) {
        for (let y = -1; y <= 1; y += 2) {
          for (let z = -1; z <= 1; z += 2) {
            cellWallPoints.push({ x: x * s, y: y * s, z: z * s })
          }
        }
      }

      components.push({
        type: "cellWall",
        points: cellWallPoints,
        color: "#8B4513",
        opacity: 0.3,
        wireframe: viewMode === "wireframe",
      })
    }

    // Cell Membrane (shrinks during plasmolysis)
    if (showComponents.membrane) {
      const membranePoints: Point3D[] = []
      const ms = size / 2 - membraneOffset

      if (plasmolysisLevel > 0.1) {
        // Plasmolyzed - rounded membrane
        const segments = 16
        for (let i = 0; i <= segments; i++) {
          for (let j = 0; j <= segments; j++) {
            const theta = (i / segments) * Math.PI * 2
            const phi = (j / segments) * Math.PI
            const x = ms * Math.sin(phi) * Math.cos(theta) * 0.8
            const y = ms * Math.sin(phi) * Math.sin(theta) * 0.8
            const z = ms * Math.cos(phi) * 0.8
            membranePoints.push({ x, y, z })
          }
        }
      } else {
        // Normal - cubic membrane
        for (let x = -1; x <= 1; x += 2) {
          for (let y = -1; y <= 1; y += 2) {
            for (let z = -1; z <= 1; z += 2) {
              membranePoints.push({ x: x * ms, y: y * ms, z: z * ms })
            }
          }
        }
      }

      components.push({
        type: "membrane",
        points: membranePoints,
        color: "#4A90E2",
        opacity: 0.6,
        wireframe: viewMode === "wireframe",
      })
    }

    // Vacuole (large, shrinks significantly during plasmolysis)
    if (showComponents.vacuole) {
      const vacuolePoints: Point3D[] = []
      const vs = size / 2 - 10 - vacuoleReduction
      const segments = 12

      for (let i = 0; i <= segments; i++) {
        for (let j = 0; j <= segments; j++) {
          const theta = (i / segments) * Math.PI * 2
          const phi = (j / segments) * Math.PI
          const x = vs * Math.sin(phi) * Math.cos(theta)
          const y = vs * Math.sin(phi) * Math.sin(theta)
          const z = vs * Math.cos(phi)
          vacuolePoints.push({ x, y, z })
        }
      }

      components.push({
        type: "vacuole",
        points: vacuolePoints,
        color: "#87CEEB",
        opacity: 0.4,
        wireframe: viewMode === "wireframe",
      })
    }

    // Nucleus (small sphere, moves during plasmolysis)
    if (showComponents.nucleus) {
      const nucleusPoints: Point3D[] = []
      const ns = 8
      const segments = 8
      const offsetX = plasmolysisLevel > 0.1 ? Math.sin(Date.now() * 0.001) * nucleusOffset : 0
      const offsetY = plasmolysisLevel > 0.1 ? Math.cos(Date.now() * 0.001) * nucleusOffset : 0

      for (let i = 0; i <= segments; i++) {
        for (let j = 0; j <= segments; j++) {
          const theta = (i / segments) * Math.PI * 2
          const phi = (j / segments) * Math.PI
          const x = ns * Math.sin(phi) * Math.cos(theta) + offsetX
          const y = ns * Math.sin(phi) * Math.sin(theta) + offsetY
          const z = ns * Math.cos(phi)
          nucleusPoints.push({ x, y, z })
        }
      }

      components.push({
        type: "nucleus",
        points: nucleusPoints,
        color: "#8B008B",
        opacity: 0.8,
        wireframe: viewMode === "wireframe",
      })
    }

    // Cytoplasmic strands (visible during plasmolysis)
    if (showComponents.strands && plasmolysisLevel > 0.2) {
      const strandPoints: Point3D[] = []
      const wallSize = size / 2
      const membraneSize = wallSize - membraneOffset

      // Create strands connecting membrane to cell wall
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const elevation = (i % 2) * 0.5 - 0.25

        // Wall connection point
        const wallX = Math.cos(angle) * wallSize * 0.9
        const wallY = Math.sin(angle) * wallSize * 0.9
        const wallZ = elevation * wallSize

        // Membrane connection point
        const membraneX = Math.cos(angle) * membraneSize
        const membraneY = Math.sin(angle) * membraneSize
        const membraneZ = elevation * membraneSize

        // Create strand points
        for (let t = 0; t <= 1; t += 0.1) {
          const x = wallX + (membraneX - wallX) * t
          const y = wallY + (membraneY - wallY) * t
          const z = wallZ + (membraneZ - wallZ) * t
          strandPoints.push({ x, y, z })
        }
      }

      components.push({
        type: "strand",
        points: strandPoints,
        color: "#FFB6C1",
        opacity: 0.7,
        wireframe: true,
      })
    }

    return components
  }, [plasmolysisLevel, showComponents, viewMode])

  // Calculate lighting
  const calculateLighting = useCallback(
    (point: Point3D, normal: Point3D): number => {
      const lightDir = {
        x: Math.cos((lightingAngle * Math.PI) / 180),
        y: Math.sin((lightingAngle * Math.PI) / 180),
        z: 0.5,
      }

      // Normalize light direction
      const lightMag = Math.sqrt(lightDir.x ** 2 + lightDir.y ** 2 + lightDir.z ** 2)
      lightDir.x /= lightMag
      lightDir.y /= lightMag
      lightDir.z /= lightMag

      // Calculate dot product for lighting intensity
      const intensity = Math.max(0.2, normal.x * lightDir.x + normal.y * lightDir.y + normal.z * lightDir.z)
      return intensity
    },
    [lightingAngle],
  )

  // Draw 3D components
  const draw3DComponents = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background gradient
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height) / 2,
    )
    gradient.addColorStop(0, "#f8f9fa")
    gradient.addColorStop(1, "#e9ecef")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const components = generateCellComponents()

    // Sort components by average Z depth for proper rendering
    const sortedComponents = components.sort((a, b) => {
      const avgZA = a.points.reduce((sum, p) => sum + p.z, 0) / a.points.length
      const avgZB = b.points.reduce((sum, p) => sum + p.z, 0) / b.points.length
      return avgZB - avgZA // Render back to front
    })

    sortedComponents.forEach((component) => {
      const projectedPoints = component.points.map((p) => project3D(p, canvas.width, canvas.height))

      ctx.globalAlpha = component.opacity

      if (component.wireframe || viewMode === "wireframe") {
        // Draw wireframe
        ctx.strokeStyle = component.color
        ctx.lineWidth = 1
        ctx.beginPath()

        if (component.type === "strand") {
          // Draw strands as connected lines
          for (let i = 0; i < projectedPoints.length - 1; i++) {
            if (i % 11 === 0) ctx.moveTo(projectedPoints[i].x, projectedPoints[i].y)
            else ctx.lineTo(projectedPoints[i].x, projectedPoints[i].y)
          }
        } else {
          // Draw component outline
          projectedPoints.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point.x, point.y)
            else ctx.lineTo(point.x, point.y)
          })
          ctx.closePath()
        }

        ctx.stroke()
      } else {
        // Draw solid with lighting
        if (component.type !== "strand" && projectedPoints.length > 3) {
          // Calculate surface normal for lighting
          const normal = { x: 0, y: 0, z: 1 } // Simplified normal
          const lightIntensity = calculateLighting(component.points[0], normal)

          // Adjust color based on lighting
          const baseColor = component.color
          const r = Number.parseInt(baseColor.slice(1, 3), 16)
          const g = Number.parseInt(baseColor.slice(3, 5), 16)
          const b = Number.parseInt(baseColor.slice(5, 7), 16)

          const litR = Math.floor(r * lightIntensity)
          const litG = Math.floor(g * lightIntensity)
          const litB = Math.floor(b * lightIntensity)

          ctx.fillStyle = `rgb(${litR}, ${litG}, ${litB})`

          // Draw filled shape
          ctx.beginPath()
          projectedPoints.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point.x, point.y)
            else ctx.lineTo(point.x, point.y)
          })
          ctx.closePath()
          ctx.fill()

          // Add outline
          ctx.strokeStyle = component.color
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    })

    // Cross-section view
    if (viewMode === "cross-section") {
      drawCrossSection(ctx, canvas)
    }

    // Draw axes for reference
    drawAxes(ctx, canvas)

    ctx.globalAlpha = 1
  }, [generateCellComponents, project3D, calculateLighting, viewMode, crossSectionDepth])

  // Draw cross-section
  const drawCrossSection = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const y = canvas.height / 2 + crossSectionDepth

    // Cross-section line
    ctx.strokeStyle = "#ff0000"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
    ctx.setLineDash([])

    // Cross-section label
    ctx.fillStyle = "#ff0000"
    ctx.font = "12px Arial"
    ctx.fillText("Cross-section", 10, y - 10)
  }

  // Draw coordinate axes
  const drawAxes = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const origin = { x: 0, y: 0, z: 0 }
    const axisLength = 60

    const axes = [
      { end: { x: axisLength, y: 0, z: 0 }, color: "#ff0000", label: "X" },
      { end: { x: 0, y: axisLength, z: 0 }, color: "#00ff00", label: "Y" },
      { end: { x: 0, y: 0, z: axisLength }, color: "#0000ff", label: "Z" },
    ]

    const originProj = project3D(origin, canvas.width, canvas.height)

    axes.forEach((axis) => {
      const endProj = project3D(axis.end, canvas.width, canvas.height)

      ctx.strokeStyle = axis.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(originProj.x, originProj.y)
      ctx.lineTo(endProj.x, endProj.y)
      ctx.stroke()

      // Axis label
      ctx.fillStyle = axis.color
      ctx.font = "bold 14px Arial"
      ctx.fillText(axis.label, endProj.x + 5, endProj.y - 5)
    })
  }

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isDown: true,
    }
    setAutoRotate(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseRef.current.isDown) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    const deltaX = currentX - mouseRef.current.x
    const deltaY = currentY - mouseRef.current.y

    setRotation((prev) => ({
      x: prev.x + deltaY * 0.01,
      y: prev.y + deltaX * 0.01,
      z: prev.z,
    }))

    mouseRef.current.x = currentX
    mouseRef.current.y = currentY
  }

  const handleMouseUp = () => {
    mouseRef.current.isDown = false
  }

  // Auto-rotation animation
  useEffect(() => {
    if (autoRotate) {
      const animate = () => {
        setRotation((prev) => ({
          ...prev,
          y: prev.y + 0.01,
        }))
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
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
  }, [autoRotate])

  // Redraw when parameters change
  useEffect(() => {
    draw3DComponents()
  }, [draw3DComponents])

  const resetView = () => {
    setRotation({ x: 0.3, y: 0.3, z: 0 })
    setZoom(300)
    setCrossSectionDepth(0)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Move3D className="h-5 w-5 text-purple-600" />
          3D Cell Structure Viewer
          <Badge variant="outline" className="ml-2">
            Plasmolysis: {(plasmolysisLevel * 100).toFixed(1)}%
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => setAutoRotate(!autoRotate)} variant={autoRotate ? "default" : "outline"} size="sm">
            {autoRotate ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {autoRotate ? "Pause" : "Auto Rotate"}
          </Button>
          <Button onClick={resetView} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset View
          </Button>
          <Button
            onClick={() =>
              setViewMode(viewMode === "solid" ? "wireframe" : viewMode === "wireframe" ? "cross-section" : "solid")
            }
            variant="outline"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-1" />
            {viewMode === "solid" ? "Solid" : viewMode === "wireframe" ? "Wireframe" : "Cross-section"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3D Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border rounded-lg bg-white w-full cursor-grab active:cursor-grabbing"
            style={{ maxWidth: "100%", height: "auto" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* Controls overlay */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white p-2 rounded text-xs space-y-1">
            <div className="flex items-center gap-1">
              <MousePointer className="h-3 w-3" />
              Drag to rotate
            </div>
            <div>Zoom: {zoom}%</div>
            <div>View: {viewMode}</div>
          </div>

          {/* Plasmolysis indicator */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded text-xs">
            <div>Solution: {solutionConcentration.toFixed(1)}%</div>
            <div
              className={`font-semibold ${plasmolysisLevel > 0.3 ? "text-red-400" : plasmolysisLevel > 0.1 ? "text-yellow-400" : "text-green-400"}`}
            >
              {plasmolysisLevel > 0.3
                ? "Severe Plasmolysis"
                : plasmolysisLevel > 0.1
                  ? "Mild Plasmolysis"
                  : "Normal Cell"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="view">View Controls</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="lighting">Lighting</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Zoom Level</label>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  max={800}
                  min={100}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>100%</span>
                  <span>400%</span>
                  <span>800%</span>
                </div>
              </div>

              {viewMode === "cross-section" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cross-section Depth</label>
                  <Slider
                    value={[crossSectionDepth]}
                    onValueChange={(value) => setCrossSectionDepth(value[0])}
                    max={100}
                    min={-100}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => setRotation((prev) => ({ ...prev, x: prev.x - 0.1 }))} variant="outline" size="sm">
                ↑ Pitch
              </Button>
              <Button onClick={() => setRotation((prev) => ({ ...prev, y: prev.y - 0.1 }))} variant="outline" size="sm">
                ← Yaw
              </Button>
              <Button onClick={() => setRotation((prev) => ({ ...prev, z: prev.z - 0.1 }))} variant="outline" size="sm">
                ↻ Roll
              </Button>
              <Button onClick={() => setRotation((prev) => ({ ...prev, x: prev.x + 0.1 }))} variant="outline" size="sm">
                ↓ Pitch
              </Button>
              <Button onClick={() => setRotation((prev) => ({ ...prev, y: prev.y + 0.1 }))} variant="outline" size="sm">
                → Yaw
              </Button>
              <Button onClick={() => setRotation((prev) => ({ ...prev, z: prev.z + 0.1 }))} variant="outline" size="sm">
                ↺ Roll
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(showComponents).map(([component, visible]) => (
                <div key={component} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={component}
                    checked={visible}
                    onChange={(e) => setShowComponents((prev) => ({ ...prev, [component]: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor={component} className="text-sm font-medium capitalize">
                    {component.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Component Legend:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-600 rounded"></div>
                  <span>Cell Wall (rigid)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Cell Membrane</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-sky-300 rounded"></div>
                  <span>Vacuole</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                  <span>Nucleus</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-pink-300 rounded"></div>
                  <span>Cytoplasm</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-pink-200 rounded"></div>
                  <span>Cytoplasmic Strands</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lighting" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Light Angle</label>
              <Slider
                value={[lightingAngle]}
                onValueChange={(value) => setLightingAngle(value[0])}
                max={360}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>0°</span>
                <span>180°</span>
                <span>360°</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">3D Visualization Features:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Real-time 3D rotation with mouse interaction</li>
                <li>• Dynamic lighting effects for depth perception</li>
                <li>• Cross-sectional view to see internal structure</li>
                <li>• Component visibility controls</li>
                <li>• Accurate plasmolysis representation in 3D space</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
