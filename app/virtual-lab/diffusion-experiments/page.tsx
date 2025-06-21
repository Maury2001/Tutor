"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Play, RotateCcw, Thermometer, Timer, Beaker, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function DiffusionExperimentsPage() {
  const [currentExperiment, setCurrentExperiment] = useState<string>("perfume")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [temperature, setTemperature] = useState(25)
  const [observations, setObservations] = useState<string[]>([])

  const experiments = {
    perfume: {
      title: "Perfume Diffusion in Air",
      description: "Observe how perfume molecules spread through air at different temperatures",
      materials: ["Perfume bottle", "Room thermometer", "Timer", "Observation sheet"],
      procedure: [
        "Set up the room at normal temperature (25°C)",
        "Spray perfume at one corner of the room",
        "Start timer and record when scent reaches different distances",
        "Repeat at different temperatures",
        "Record observations",
      ],
      cbcAlignment: "Grade 8 - Particle Theory of Matter",
    },
    tea: {
      title: "Tea Bag Diffusion",
      description: "Study diffusion of tea particles in hot and cold water",
      materials: ["Tea bags", "Hot water (80°C)", "Cold water (20°C)", "Transparent containers", "Timer"],
      procedure: [
        "Fill two identical containers with hot and cold water",
        "Simultaneously place tea bags in both containers",
        "Observe and time the color change",
        "Record the rate of diffusion",
        "Compare results",
      ],
      cbcAlignment: "Grade 8 - Effects of Temperature on Particle Movement",
    },
    ink: {
      title: "Ink Drop Diffusion",
      description: "Visualize diffusion patterns of ink in water",
      materials: ["Food coloring/ink", "Water", "Petri dishes", "Dropper", "Ruler"],
      procedure: [
        "Fill petri dish with still water",
        "Add one drop of ink at the center",
        "Observe spreading pattern",
        "Measure diffusion radius over time",
        "Repeat with different temperatures",
      ],
      cbcAlignment: "Grade 8 - Molecular Movement and Concentration Gradients",
    },
  }

  const startExperiment = () => {
    setIsRunning(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          addObservation("Experiment completed successfully!")
          return 100
        }
        return prev + 2
      })
    }, 200)
  }

  const addObservation = (observation: string) => {
    setObservations((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${observation}`])
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
        <h1 className="text-3xl font-bold mb-2">Diffusion Experiments</h1>
        <p className="text-gray-600">Grade 8 CBC - Particle Theory and Molecular Movement</p>
        <Badge className="mt-2 bg-blue-100 text-blue-800">Interactive Virtual Lab</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Experiment Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Select Experiment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(experiments).map(([key, exp]) => (
                <Button
                  key={key}
                  variant={currentExperiment === key ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setCurrentExperiment(key)}
                >
                  <div>
                    <div className="font-medium">{exp.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{exp.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Experiment Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                <span className="text-sm">Temperature: {temperature}°C</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Adjust Temperature</label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={startExperiment} disabled={isRunning} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setProgress(0)
                    setObservations([])
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Experiment Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{experiments[currentExperiment as keyof typeof experiments].title}</CardTitle>
              <CardDescription>
                {experiments[currentExperiment as keyof typeof experiments].description}
              </CardDescription>
              <Badge variant="outline" className="w-fit">
                {experiments[currentExperiment as keyof typeof experiments].cbcAlignment}
              </Badge>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="setup" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="setup">Setup</TabsTrigger>
                  <TabsTrigger value="procedure">Procedure</TabsTrigger>
                  <TabsTrigger value="simulation">Simulation</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>

                <TabsContent value="setup" className="space-y-4">
                  <h3 className="font-semibold">Materials Required:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {experiments[currentExperiment as keyof typeof experiments].materials.map((material, index) => (
                      <li key={index} className="text-sm">
                        {material}
                      </li>
                    ))}
                  </ul>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Ensure proper ventilation when working with perfumes or strong odors.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="procedure" className="space-y-4">
                  <h3 className="font-semibold">Step-by-Step Procedure:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {experiments[currentExperiment as keyof typeof experiments].procedure.map((step, index) => (
                      <li key={index} className="text-sm">
                        {step}
                      </li>
                    ))}
                  </ol>
                </TabsContent>

                <TabsContent value="simulation" className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-dashed border-blue-200">
                    <div className="text-center">
                      <h3 className="font-semibold mb-4">Virtual Diffusion Simulation</h3>

                      {currentExperiment === "perfume" && (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded border">
                            <div className="text-sm text-gray-600 mb-2">Room Temperature: {temperature}°C</div>
                            <div className="relative h-32 bg-gray-100 rounded">
                              <div className="absolute left-2 top-2 w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                              {progress > 20 && (
                                <div className="absolute left-8 top-4 w-3 h-3 bg-purple-300 rounded-full opacity-70"></div>
                              )}
                              {progress > 40 && (
                                <div className="absolute left-16 top-8 w-2 h-2 bg-purple-200 rounded-full opacity-50"></div>
                              )}
                              {progress > 60 && (
                                <div className="absolute left-24 top-12 w-2 h-2 bg-purple-200 rounded-full opacity-30"></div>
                              )}
                              {progress > 80 && (
                                <div className="absolute left-32 top-16 w-1 h-1 bg-purple-100 rounded-full opacity-20"></div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">Perfume molecules spreading through air</div>
                          </div>
                        </div>
                      )}

                      {currentExperiment === "tea" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded border">
                            <div className="text-sm font-medium mb-2">Hot Water (80°C)</div>
                            <div className="h-24 bg-gradient-to-t from-amber-800 via-amber-400 to-blue-100 rounded"></div>
                            <div className="text-xs text-gray-500 mt-2">Fast diffusion</div>
                          </div>
                          <div className="bg-white p-4 rounded border">
                            <div className="text-sm font-medium mb-2">Cold Water (20°C)</div>
                            <div className="h-24 bg-gradient-to-t from-amber-200 via-blue-50 to-blue-100 rounded"></div>
                            <div className="text-xs text-gray-500 mt-2">Slow diffusion</div>
                          </div>
                        </div>
                      )}

                      {currentExperiment === "ink" && (
                        <div className="bg-white p-4 rounded border">
                          <div className="text-sm font-medium mb-2">Ink Diffusion Pattern</div>
                          <div className="relative h-32 bg-blue-50 rounded-full mx-auto w-32">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-900 rounded-full"></div>
                            {progress > 25 && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-700 rounded-full opacity-60"></div>
                            )}
                            {progress > 50 && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-500 rounded-full opacity-40"></div>
                            )}
                            {progress > 75 && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-300 rounded-full opacity-20"></div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">Radial diffusion pattern</div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="results" className="space-y-4">
                  <h3 className="font-semibold">Observations & Results:</h3>
                  <div className="bg-gray-50 p-4 rounded border max-h-40 overflow-y-auto">
                    {observations.length === 0 ? (
                      <p className="text-gray-500 text-sm">Start an experiment to see observations...</p>
                    ) : (
                      <ul className="space-y-1">
                        {observations.map((obs, index) => (
                          <li key={index} className="text-sm">
                            {obs}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Key Learning Points:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Diffusion rate increases with temperature</li>
                      <li>Particles move from high to low concentration</li>
                      <li>Molecular size affects diffusion speed</li>
                      <li>Diffusion occurs in all states of matter</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
