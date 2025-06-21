"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Eye, Lightbulb, MonitorIcon as Mirror, RotateCcw, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function MirrorOpticsPage() {
  const [mirrorType, setMirrorType] = useState<"concave" | "convex">("concave")
  const [objectDistance, setObjectDistance] = useState([30])
  const [focalLength] = useState(15) // Fixed focal length for demonstration
  const [showRays, setShowRays] = useState(true)

  // Calculate image properties using mirror equation
  const calculateImageProperties = () => {
    const u = objectDistance[0] // object distance
    const f = focalLength // focal length

    // Mirror equation: 1/f = 1/u + 1/v
    let v: number
    if (mirrorType === "concave") {
      v = (f * u) / (u - f)
    } else {
      v = -(f * u) / (u + f) // For convex mirror, image is always virtual
    }

    const magnification = -v / u
    const imageHeight = Math.abs(magnification)

    return {
      imageDistance: Math.abs(v),
      magnification: Math.abs(magnification),
      imageHeight,
      isReal: v > 0 && mirrorType === "concave",
      isVirtual: v < 0 || mirrorType === "convex",
      isUpright: magnification > 0,
      isInverted: magnification < 0,
      isEnlarged: Math.abs(magnification) > 1,
      isDiminished: Math.abs(magnification) < 1,
    }
  }

  const imageProps = calculateImageProperties()

  const mirrorExperiments = {
    concave: {
      title: "Concave Mirror Experiments",
      description: "Explore image formation with concave (converging) mirrors",
      applications: [
        "Shaving mirrors - magnified images",
        "Telescopes - collecting light",
        "Solar cookers - focusing sunlight",
        "Headlights - parallel beam formation",
      ],
      characteristics: [
        "Converges parallel rays to a focal point",
        "Can form real and virtual images",
        "Magnification depends on object position",
        "Used in optical instruments",
      ],
    },
    convex: {
      title: "Convex Mirror Experiments",
      description: "Study image formation with convex (diverging) mirrors",
      applications: [
        "Car side mirrors - wide field of view",
        "Security mirrors in stores",
        "Traffic mirrors at intersections",
        "Rear-view mirrors in vehicles",
      ],
      characteristics: [
        "Diverges parallel rays from focal point",
        "Always forms virtual, upright, diminished images",
        "Provides wide field of view",
        "Images appear smaller but cover larger area",
      ],
    },
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/virtual-lab">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Virtual Lab
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Mirror Optics Laboratory</h1>
        <p className="text-gray-600">Grade 9 CBC - Curved Mirrors and Image Formation</p>
        <Badge className="mt-2 bg-purple-100 text-purple-800">Interactive Physics Lab</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mirror className="h-5 w-5" />
                Mirror Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Mirror Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={mirrorType === "concave" ? "default" : "outline"}
                    onClick={() => setMirrorType("concave")}
                    className="text-xs"
                  >
                    Concave
                  </Button>
                  <Button
                    variant={mirrorType === "convex" ? "default" : "outline"}
                    onClick={() => setMirrorType("convex")}
                    className="text-xs"
                  >
                    Convex
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Object Distance: {objectDistance[0]} cm</label>
                <Slider
                  value={objectDistance}
                  onValueChange={setObjectDistance}
                  max={60}
                  min={5}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="text-sm space-y-1">
                <div>Focal Length: {focalLength} cm</div>
                <div>Mirror Type: {mirrorType === "concave" ? "Converging" : "Diverging"}</div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showRays"
                  checked={showRays}
                  onChange={(e) => setShowRays(e.target.checked)}
                />
                <label htmlFor="showRays" className="text-sm">
                  Show Light Rays
                </label>
              </div>

              <Button variant="outline" onClick={() => setObjectDistance([30])} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </CardContent>
          </Card>

          {/* Image Properties */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Image Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>Distance:</div>
                <div className="font-mono">{imageProps.imageDistance.toFixed(1)} cm</div>

                <div>Magnification:</div>
                <div className="font-mono">{imageProps.magnification.toFixed(2)}×</div>

                <div>Nature:</div>
                <div className={imageProps.isReal ? "text-blue-600" : "text-orange-600"}>
                  {imageProps.isReal ? "Real" : "Virtual"}
                </div>

                <div>Orientation:</div>
                <div className={imageProps.isUpright ? "text-green-600" : "text-red-600"}>
                  {imageProps.isUpright ? "Upright" : "Inverted"}
                </div>

                <div>Size:</div>
                <div className={imageProps.isEnlarged ? "text-purple-600" : "text-blue-600"}>
                  {imageProps.isEnlarged ? "Enlarged" : "Diminished"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Experiment Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{mirrorExperiments[mirrorType].title}</CardTitle>
              <CardDescription>{mirrorExperiments[mirrorType].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="simulation" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="simulation">Ray Diagram</TabsTrigger>
                  <TabsTrigger value="theory">Theory</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="experiments">Experiments</TabsTrigger>
                </TabsList>

                <TabsContent value="simulation" className="space-y-4">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border">
                    <div className="relative h-80 bg-white rounded border overflow-hidden">
                      {/* Animated grid background */}
                      <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full">
                          <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                            </pattern>
                            <pattern id="wavePattern" width="40" height="20" patternUnits="userSpaceOnUse">
                              <path
                                d="M 0 10 Q 10 0 20 10 T 40 10"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="1"
                                opacity="0.3"
                              />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                          <rect width="100%" height="100%" fill="url(#wavePattern)" className="animate-pulse" />
                        </svg>
                      </div>

                      {/* Principal axis with wave indication */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-600 transform -translate-y-0.5 z-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-red-400 opacity-30 animate-pulse"></div>
                      </div>

                      {/* Mirror representation with realistic reflection surface */}
                      <div className="absolute right-8 top-0 bottom-0 flex items-center">
                        {mirrorType === "concave" ? (
                          <svg width="16" height="200" viewBox="0 0 16 200" className="overflow-visible">
                            <defs>
                              <linearGradient id="mirrorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#e5e7eb" />
                                <stop offset="50%" stopColor="#f9fafb" />
                                <stop offset="100%" stopColor="#d1d5db" />
                              </linearGradient>
                              <filter id="mirrorGlow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                  <feMergeNode in="coloredBlur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                            </defs>
                            <path
                              d="M 0 0 Q 12 100 0 200"
                              fill="url(#mirrorGradient)"
                              stroke="#374151"
                              strokeWidth="2"
                              filter="url(#mirrorGlow)"
                              className="animate-pulse"
                            />
                            <path d="M 2 0 Q 10 100 2 200" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
                          </svg>
                        ) : (
                          <svg width="16" height="200" viewBox="0 0 16 200" className="overflow-visible">
                            <defs>
                              <linearGradient id="convexGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#d1d5db" />
                                <stop offset="50%" stopColor="#f9fafb" />
                                <stop offset="100%" stopColor="#e5e7eb" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M 16 0 Q 4 100 16 200"
                              fill="url(#convexGradient)"
                              stroke="#374151"
                              strokeWidth="2"
                              filter="url(#mirrorGlow)"
                              className="animate-pulse"
                            />
                            <path
                              d="M 14 0 Q 6 100 14 200"
                              fill="none"
                              stroke="#60a5fa"
                              strokeWidth="1"
                              opacity="0.6"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Center of curvature with pulsing animation */}
                      <div
                        className="absolute top-1/2 w-3 h-3 bg-blue-600 rounded-full transform -translate-y-1.5 -translate-x-1.5 z-20 shadow-lg animate-pulse"
                        style={{
                          right: `${32 + focalLength * 8}px`,
                        }}
                      >
                        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                        <span className="absolute -bottom-6 -left-2 text-xs font-semibold text-blue-700 bg-white px-1 rounded shadow-sm">
                          C
                        </span>
                      </div>

                      {/* Focal point with enhanced animation */}
                      <div
                        className="absolute top-1/2 w-3 h-3 bg-red-600 rounded-full transform -translate-y-1.5 -translate-x-1.5 z-20 shadow-lg animate-pulse"
                        style={{
                          right: `${32 + focalLength * 4}px`,
                        }}
                      >
                        <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
                        <span className="absolute -bottom-6 -left-2 text-xs font-semibold text-red-700 bg-white px-1 rounded shadow-sm">
                          F
                        </span>
                      </div>

                      {/* Animated object with wave emission */}
                      <div
                        className="absolute bottom-1/2 z-20"
                        style={{
                          right: `${32 + objectDistance[0] * 4}px`,
                        }}
                      >
                        <svg width="8" height="50" viewBox="0 0 8 50" className="overflow-visible">
                          <defs>
                            <filter id="objectGlow">
                              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                              <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>
                          <line
                            x1="4"
                            y1="0"
                            x2="4"
                            y2="40"
                            stroke="#059669"
                            strokeWidth="3"
                            filter="url(#objectGlow)"
                          />
                          <polygon points="4,0 0,8 8,8" fill="#059669" filter="url(#objectGlow)" />
                          {/* Wave emission circles */}
                          <circle
                            cx="4"
                            cy="20"
                            r="15"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1"
                            opacity="0.4"
                            className="animate-ping"
                          />
                          <circle
                            cx="4"
                            cy="20"
                            r="25"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1"
                            opacity="0.2"
                            className="animate-ping"
                            style={{ animationDelay: "0.5s" }}
                          />
                        </svg>
                        <span className="absolute -bottom-8 -left-6 text-xs font-semibold text-green-700 bg-white px-1 rounded shadow-sm">
                          Object
                        </span>
                      </div>

                      {/* Enhanced image representation with animation */}
                      {imageProps.isReal && (
                        <div
                          className="absolute z-20"
                          style={{
                            right: `${32 + imageProps.imageDistance * 4}px`,
                            [imageProps.isInverted ? "top" : "bottom"]: "50%",
                          }}
                        >
                          <svg
                            width="8"
                            height={`${Math.max(imageProps.imageHeight * 50, 10)}`}
                            viewBox={`0 0 8 ${Math.max(imageProps.imageHeight * 50, 10)}`}
                            className="overflow-visible"
                          >
                            <defs>
                              <filter id="imageGlow">
                                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                                <feMerge>
                                  <feMergeNode in="coloredBlur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                            </defs>
                            <line
                              x1="4"
                              y1={imageProps.isInverted ? 0 : Math.max(imageProps.imageHeight * 50, 10)}
                              x2="4"
                              y2={imageProps.isInverted ? Math.max(imageProps.imageHeight * 40, 8) : 10}
                              stroke="#ea580c"
                              strokeWidth="3"
                              filter="url(#imageGlow)"
                              className="animate-pulse"
                            />
                            <polygon
                              points={
                                imageProps.isInverted
                                  ? "4,0 0,8 8,8"
                                  : `4,${Math.max(imageProps.imageHeight * 50, 10)} 0,${Math.max(imageProps.imageHeight * 42, 2)} 8,${Math.max(imageProps.imageHeight * 42, 2)}`
                              }
                              fill="#ea580c"
                              filter="url(#imageGlow)"
                              className="animate-pulse"
                            />
                          </svg>
                          <span className="absolute -bottom-8 -left-6 text-xs font-semibold text-orange-700 bg-white px-1 rounded shadow-sm">
                            Image
                          </span>
                        </div>
                      )}

                      {/* Virtual image with enhanced animation */}
                      {imageProps.isVirtual && mirrorType === "convex" && (
                        <div
                          className="absolute bottom-1/2 z-20"
                          style={{
                            right: `${32 + imageProps.imageDistance * 4}px`,
                          }}
                        >
                          <svg
                            width="8"
                            height={`${imageProps.imageHeight * 30}`}
                            viewBox={`0 0 8 ${imageProps.imageHeight * 30}`}
                            className="overflow-visible"
                          >
                            <line
                              x1="4"
                              y1={imageProps.imageHeight * 30}
                              x2="4"
                              y2="5"
                              stroke="#ea580c"
                              strokeWidth="2"
                              strokeDasharray="3,3"
                              className="animate-pulse"
                            />
                            <polygon
                              points={`4,${imageProps.imageHeight * 30} 0,${imageProps.imageHeight * 22} 8,${imageProps.imageHeight * 22}`}
                              fill="#ea580c"
                              opacity="0.7"
                              className="animate-pulse"
                            />
                            {/* Virtual wave indication */}
                            <circle
                              cx="4"
                              cy="15"
                              r="10"
                              fill="none"
                              stroke="#ea580c"
                              strokeWidth="1"
                              opacity="0.3"
                              strokeDasharray="2,2"
                              className="animate-spin"
                            />
                          </svg>
                          <span className="absolute -bottom-8 -left-8 text-xs font-semibold text-orange-700 bg-white px-1 rounded shadow-sm">
                            Virtual Image
                          </span>
                        </div>
                      )}

                      {/* Animated light rays with wave properties */}
                      {showRays && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                          <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626" />
                            </marker>
                            <marker id="blueArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
                            </marker>
                            <marker id="greenArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#059669" />
                            </marker>

                            {/* Wave pattern for rays */}
                            <pattern id="waveRay" width="20" height="4" patternUnits="userSpaceOnUse">
                              <path
                                d="M 0 2 Q 5 0 10 2 T 20 2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                opacity="0.6"
                              />
                            </pattern>
                          </defs>

                          {/* Parallel ray with wave animation */}
                          <g className="animate-pulse">
                            <line
                              x1={400 - (objectDistance[0] * 4 + 32)}
                              y1={160 - 30}
                              x2={400 - 32}
                              y2={160 - 30}
                              stroke="#dc2626"
                              strokeWidth="3"
                              markerEnd="url(#arrowhead)"
                              className="animate-pulse"
                            />
                            <line
                              x1={400 - (objectDistance[0] * 4 + 32)}
                              y1={160 - 30}
                              x2={400 - 32}
                              y2={160 - 30}
                              stroke="url(#waveRay)"
                              strokeWidth="2"
                            />
                            {/* Wave fronts */}
                            {[...Array(5)].map((_, i) => (
                              <circle
                                key={i}
                                cx={400 - (objectDistance[0] * 4 + 32) + i * 30}
                                cy={160 - 30}
                                r="8"
                                fill="none"
                                stroke="#dc2626"
                                strokeWidth="1"
                                opacity="0.3"
                                className="animate-ping"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              />
                            ))}
                          </g>

                          {/* Reflected ray from parallel ray with animation */}
                          {mirrorType === "concave" ? (
                            <g className="animate-pulse">
                              <line
                                x1={400 - 32}
                                y1={160 - 30}
                                x2={400 - (focalLength * 4 + 32)}
                                y2={160}
                                stroke="#dc2626"
                                strokeWidth="3"
                                strokeDasharray="6,3"
                                className="animate-pulse"
                              />
                              <line
                                x1={400 - 32}
                                y1={160 - 30}
                                x2={400 - (focalLength * 4 + 32)}
                                y2={160}
                                stroke="url(#waveRay)"
                                strokeWidth="1"
                              />
                            </g>
                          ) : (
                            <g className="animate-pulse">
                              <line
                                x1={400 - 32}
                                y1={160 - 30}
                                x2={200}
                                y2={160 + 60}
                                stroke="#dc2626"
                                strokeWidth="3"
                                strokeDasharray="6,3"
                                className="animate-pulse"
                              />
                            </g>
                          )}

                          {/* Focal ray with wave animation */}
                          <g className="animate-pulse" style={{ animationDelay: "0.3s" }}>
                            <line
                              x1={400 - (objectDistance[0] * 4 + 32)}
                              y1={160 - 40}
                              x2={400 - (focalLength * 4 + 32)}
                              y2={160}
                              stroke="#2563eb"
                              strokeWidth="3"
                              markerEnd="url(#blueArrow)"
                            />
                            <line
                              x1={400 - (objectDistance[0] * 4 + 32)}
                              y1={160 - 40}
                              x2={400 - (focalLength * 4 + 32)}
                              y2={160}
                              stroke="url(#waveRay)"
                              strokeWidth="2"
                            />
                          </g>

                          {/* Reflected focal ray */}
                          <g className="animate-pulse" style={{ animationDelay: "0.3s" }}>
                            <line
                              x1={400 - (focalLength * 4 + 32)}
                              y1={160}
                              x2={400 - 32}
                              y2={160 - 40}
                              stroke="#2563eb"
                              strokeWidth="3"
                              strokeDasharray="6,3"
                            />
                          </g>

                          {/* Center of curvature ray with animation */}
                          <g className="animate-pulse" style={{ animationDelay: "0.6s" }}>
                            <line
                              x1={400 - (objectDistance[0] * 4 + 32)}
                              y1={160 - 50}
                              x2={400 - (focalLength * 8 + 32)}
                              y2={160}
                              stroke="#059669"
                              strokeWidth="3"
                              markerEnd="url(#greenArrow)"
                            />
                            <line
                              x1={400 - (objectDistance[0] * 4 + 32)}
                              y1={160 - 50}
                              x2={400 - (focalLength * 8 + 32)}
                              y2={160}
                              stroke="url(#waveRay)"
                              strokeWidth="2"
                            />
                          </g>

                          {/* Reflected center ray */}
                          <g className="animate-pulse" style={{ animationDelay: "0.6s" }}>
                            <line
                              x1={400 - (focalLength * 8 + 32)}
                              y1={160}
                              x2={400 - 32}
                              y2={160 - 50}
                              stroke="#059669"
                              strokeWidth="3"
                              strokeDasharray="6,3"
                            />
                          </g>

                          {/* Wave interference patterns at image location */}
                          {imageProps.isReal && (
                            <g className="animate-pulse">
                              {[...Array(3)].map((_, i) => (
                                <circle
                                  key={i}
                                  cx={400 - (imageProps.imageDistance * 4 + 32)}
                                  cy={160}
                                  r={10 + i * 8}
                                  fill="none"
                                  stroke="#ea580c"
                                  strokeWidth="1"
                                  opacity={0.4 - i * 0.1}
                                  className="animate-ping"
                                  style={{ animationDelay: `${i * 0.3}s` }}
                                />
                              ))}
                            </g>
                          )}
                        </svg>
                      )}

                      {/* Enhanced labels with animation */}
                      <div className="absolute bottom-2 left-2 text-xs bg-white bg-opacity-95 p-3 rounded-lg shadow-lg border">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-red-600 animate-pulse"></div>
                            <span>Parallel Ray + Waves</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-blue-600 animate-pulse"></div>
                            <span>Focal Ray + Waves</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-green-600 animate-pulse"></div>
                            <span>Center Ray + Waves</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">🌊 Wave fronts show light propagation</div>
                        </div>
                      </div>

                      {/* Real-time wave frequency indicator */}
                      <div className="absolute top-2 right-2 text-xs bg-blue-50 bg-opacity-95 p-2 rounded shadow-sm border">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                          <span>Light Waves: ~500nm</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <strong>Object Position:</strong> {objectDistance[0]} cm from mirror
                        </div>
                        <div>
                          <strong>Image Position:</strong> {imageProps.imageDistance.toFixed(1)} cm from mirror
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-blue-600">
                        ✨ Watch the animated wave fronts showing light propagation and interference!
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="theory" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Mirror Equation & Magnification</h3>
                    <div className="bg-blue-50 p-4 rounded border">
                      <div className="space-y-2 font-mono text-sm">
                        <div>Mirror Equation: 1/f = 1/u + 1/v</div>
                        <div>Magnification: m = -v/u = h'/h</div>
                        <div className="text-xs text-gray-600 mt-2">
                          Where: f = focal length, u = object distance, v = image distance
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold">Key Characteristics</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {mirrorExperiments[mirrorType].characteristics.map((char, index) => (
                        <li key={index}>{char}</li>
                      ))}
                    </ul>

                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        {mirrorType === "concave"
                          ? "Concave mirrors can form both real and virtual images depending on object position relative to the focal point."
                          : "Convex mirrors always form virtual, upright, and diminished images regardless of object position."}
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>

                <TabsContent value="applications" className="space-y-4">
                  <h3 className="font-semibold">Real-World Applications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mirrorExperiments[mirrorType].applications.map((app, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded border">
                        <div className="text-sm font-medium">{app.split(" - ")[0]}</div>
                        <div className="text-xs text-gray-600">{app.split(" - ")[1]}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Why These Applications Work:</h4>
                    <div className="text-sm space-y-2">
                      {mirrorType === "concave" ? (
                        <>
                          <p>
                            • <strong>Shaving mirrors:</strong> When face is closer than focal length, image is virtual,
                            upright, and magnified
                          </p>
                          <p>
                            • <strong>Telescopes:</strong> Large concave mirrors collect and focus light from distant
                            objects
                          </p>
                          <p>
                            • <strong>Solar cookers:</strong> Parallel sun rays converge at focal point, creating
                            intense heat
                          </p>
                          <p>
                            • <strong>Headlights:</strong> Light source at focus produces parallel beam for
                            long-distance illumination
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            • <strong>Side mirrors:</strong> Wide field of view helps see larger area behind vehicle
                          </p>
                          <p>
                            • <strong>Security mirrors:</strong> Monitor large areas with single mirror in stores
                          </p>
                          <p>
                            • <strong>Traffic mirrors:</strong> Help drivers see around blind corners safely
                          </p>
                          <p>
                            • <strong>Rear-view mirrors:</strong> Compact design fits in small space while showing wide
                            view
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experiments" className="space-y-4">
                  <h3 className="font-semibold">Hands-On Experiments</h3>

                  <div className="space-y-4">
                    <div className="border rounded p-4">
                      <h4 className="font-medium mb-2">Experiment 1: Image Formation Study</h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Materials</strong>: {mirrorType} mirror, candle, screen, ruler
                        </p>
                        <p>
                          <strong>Procedure:</strong>
                        </p>
                        <ol className="list-decimal list-inside ml-4 space-y-1">
                          <li>Place candle at different distances from mirror</li>
                          <li>Try to catch image on screen (for real images)</li>
                          <li>Measure object and image distances</li>
                          <li>Record image characteristics</li>
                          <li>Verify mirror equation</li>
                        </ol>
                      </div>
                    </div>

                    <div className="border rounded p-4">
                      <h4 className="font-medium mb-2">Experiment 2: Focal Length Determination</h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Materials</strong>: {mirrorType} mirror, distant object, screen
                        </p>
                        <p>
                          <strong>Method:</strong>{" "}
                          {mirrorType === "concave"
                            ? "Focus distant object (like window) on screen. Distance from mirror to screen equals focal length."
                            : "Use parallel light rays and measure where they appear to diverge from (virtual focus)."}
                        </p>
                      </div>
                    </div>

                    <div className="border rounded p-4">
                      <h4 className="font-medium mb-2">Experiment 3: Magnification Study</h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Objective:</strong> Investigate how magnification changes with object distance
                        </p>
                        <p>
                          <strong>Data to collect:</strong> Object height, image height, object distance, image distance
                        </p>
                        <p>
                          <strong>Analysis:</strong> Plot magnification vs object distance graph
                        </p>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      <strong>Safety Note:</strong> When using real mirrors and light sources, avoid looking directly at
                      bright reflections and ensure proper ventilation.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
