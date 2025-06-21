"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Atom, ArrowLeft, Play, Pause, RotateCcw, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { AIGuidancePanel } from "@/components/virtual-lab/ai-guidance-panel"

export default function AtomicStructureExperiment() {
  const [isRunning, setIsRunning] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selectedElement, setSelectedElement] = useState("carbon")
  const [protons, setProtons] = useState(6)
  const [neutrons, setNeutrons] = useState(6)
  const [electrons, setElectrons] = useState(6)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const elements = {
    hydrogen: { name: "Hydrogen", symbol: "H", protons: 1, neutrons: 0, electrons: 1 },
    carbon: { name: "Carbon", symbol: "C", protons: 6, neutrons: 6, electrons: 6 },
    oxygen: { name: "Oxygen", symbol: "O", protons: 8, neutrons: 8, electrons: 8 },
    sodium: { name: "Sodium", symbol: "Na", protons: 11, neutrons: 12, electrons: 11 },
  }

  const selectElement = (elementKey: string) => {
    const element = elements[elementKey as keyof typeof elements]
    setSelectedElement(elementKey)
    setProtons(element.protons)
    setNeutrons(element.neutrons)
    setElectrons(element.electrons)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/virtual-lab">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Virtual Lab
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Atom className="h-6 w-6 text-red-500" />
                Atomic Structure Builder
              </h1>
              <p className="text-gray-600">Grade 7-9 • CBC Aligned • Interactive Chemistry</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Experiment Time</div>
              <div className="text-lg font-mono font-semibold">{formatTime(timer)}</div>
            </div>
            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={() => setIsRunning(true)} className="bg-red-600 hover:bg-red-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              ) : (
                <Button onClick={() => setIsRunning(false)} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button
                onClick={() => {
                  setIsRunning(false)
                  setTimer(0)
                }}
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Atom Builder Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="h-5 w-5" />
                  Atom Builder - {elements[selectedElement as keyof typeof elements].name}
                </CardTitle>
                <CardDescription>Build atoms by adjusting protons, neutrons, and electrons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Atom Visualization */}
                  <div className="relative bg-gray-900 rounded-lg p-8 aspect-square max-w-md mx-auto">
                    {/* Nucleus */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">{protons + neutrons}</span>
                    </div>

                    {/* Electron Shells */}
                    <div className="absolute inset-4 border-2 border-blue-400 rounded-full opacity-50"></div>
                    <div className="absolute inset-8 border-2 border-green-400 rounded-full opacity-50"></div>

                    {/* Electrons */}
                    {Array.from({ length: Math.min(electrons, 8) }).map((_, i) => {
                      const angle = (i * 360) / Math.min(electrons, 8)
                      const radius = electrons <= 2 ? 60 : i < 2 ? 60 : 100
                      const x = Math.cos((angle * Math.PI) / 180) * radius
                      const y = Math.sin((angle * Math.PI) / 180) * radius
                      return (
                        <div
                          key={i}
                          className="absolute w-3 h-3 bg-blue-500 rounded-full"
                          style={{
                            left: `calc(50% + ${x}px - 6px)`,
                            top: `calc(50% + ${y}px - 6px)`,
                          }}
                        />
                      )
                    })}
                  </div>

                  {/* Controls */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <h4 className="font-medium mb-2">Protons</h4>
                      <div className="flex items-center justify-center gap-2">
                        <Button onClick={() => setProtons(Math.max(1, protons - 1))} variant="outline" size="sm">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Badge variant="secondary" className="px-3 py-1">
                          {protons}
                        </Badge>
                        <Button onClick={() => setProtons(Math.min(20, protons + 1))} variant="outline" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-center">
                      <h4 className="font-medium mb-2">Neutrons</h4>
                      <div className="flex items-center justify-center gap-2">
                        <Button onClick={() => setNeutrons(Math.max(0, neutrons - 1))} variant="outline" size="sm">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Badge variant="secondary" className="px-3 py-1">
                          {neutrons}
                        </Badge>
                        <Button onClick={() => setNeutrons(Math.min(20, neutrons + 1))} variant="outline" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-center">
                      <h4 className="font-medium mb-2">Electrons</h4>
                      <div className="flex items-center justify-center gap-2">
                        <Button onClick={() => setElectrons(Math.max(0, electrons - 1))} variant="outline" size="sm">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Badge variant="secondary" className="px-3 py-1">
                          {electrons}
                        </Badge>
                        <Button onClick={() => setElectrons(Math.min(20, electrons + 1))} variant="outline" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Element Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(elements).map(([key, element]) => (
                      <Button
                        key={key}
                        onClick={() => selectElement(key)}
                        variant={selectedElement === key ? "default" : "outline"}
                        size="sm"
                      >
                        {element.symbol}
                      </Button>
                    ))}
                  </div>

                  {/* Atom Properties */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Atom Properties</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Mass Number:</span> {protons + neutrons}
                      </div>
                      <div>
                        <span className="font-medium">Atomic Number:</span> {protons}
                      </div>
                      <div>
                        <span className="font-medium">Charge:</span>{" "}
                        {protons - electrons > 0
                          ? `+${protons - electrons}`
                          : protons - electrons < 0
                            ? `${protons - electrons}`
                            : "0"}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {protons - electrons === 0 ? "Neutral Atom" : "Ion"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Guidance Panel */}
          <div>
            <AIGuidancePanel
              experimentType="atomic-structure"
              gradeLevel="Grade 7-9"
              currentStep={1}
              studentProgress={{
                completedSteps: [],
                currentObservations: [
                  `Building ${elements[selectedElement as keyof typeof elements].name} atom with ${protons} protons, ${neutrons} neutrons, ${electrons} electrons`,
                ],
                challenges: [],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
