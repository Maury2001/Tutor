"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Sun,
  Droplets,
  Wind,
  Thermometer,
  Activity,
  Leaf,
  Play,
  Pause,
  RotateCcw,
  Info,
  Beaker,
  Zap,
} from "lucide-react"

interface PhotosynthesisState {
  lightIntensity: number
  co2Level: number
  temperature: number
  waterLevel: number
  oxygenProduced: number
  glucoseProduced: number
  isRunning: boolean
  timeElapsed: number
}

interface ExperimentData {
  time: number
  oxygen: number
  glucose: number
  lightIntensity: number
  co2Level: number
  temperature: number
}

export function PhotosynthesisExperiment() {
  const [state, setState] = useState<PhotosynthesisState>({
    lightIntensity: 50,
    co2Level: 40,
    temperature: 25,
    waterLevel: 80,
    oxygenProduced: 0,
    glucoseProduced: 0,
    isRunning: false,
    timeElapsed: 0,
  })

  const [aiAssistant, setAiAssistant] = useState({
    isActive: false,
    currentExplanation: "",
    step: 0,
    isExplaining: false,
  })

  // AI Assistant explanations for each step
  const aiExplanations = [
    "Welcome! I'm your AI lab assistant. Let's explore photosynthesis together! Click 'Start' to begin the experiment.",
    "Step 1: The sun provides light energy. Notice how the sun rays are hitting the plant leaves - this is where photosynthesis begins!",
    "Step 2: The plant's roots absorb water (H₂O) from the soil, while leaves take in carbon dioxide (CO₂) from the air through tiny pores called stomata.",
    "Step 3: Inside the chloroplasts (green parts of leaves), light energy converts CO₂ and H₂O into glucose (C₆H₁₂O₆) - the plant's food!",
    "Step 4: As a bonus, oxygen (O₂) is released into the air - that's the oxygen we breathe! Watch the blue O₂ molecules floating up.",
    "Amazing! The plant is now making its own food and giving us oxygen. Try changing the light intensity or CO₂ levels to see how it affects the process!",
  ]

  // AI Assistant function
  const getAiExplanation = async (step: number, conditions: any) => {
    setAiAssistant((prev) => ({ ...prev, isExplaining: true }))

    // Simulate AI response with contextual explanations
    setTimeout(() => {
      let explanation = aiExplanations[step] || aiExplanations[0]

      // Add contextual advice based on current conditions
      if (conditions.efficiency < 30) {
        explanation += " 💡 Tip: Try increasing light intensity or CO₂ levels for better photosynthesis!"
      } else if (conditions.efficiency > 80) {
        explanation += " 🌟 Excellent! Your plant is photosynthesizing very efficiently!"
      }

      setAiAssistant((prev) => ({
        ...prev,
        currentExplanation: explanation,
        step: step,
        isExplaining: false,
        isActive: true,
      }))
    }, 1000)
  }

  const [experimentData, setExperimentData] = useState<ExperimentData[]>([])
  const [selectedTab, setSelectedTab] = useState("experiment")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate photosynthesis rate based on limiting factors
  const calculatePhotosynthesisRate = () => {
    const lightFactor = Math.min(state.lightIntensity / 100, 1)
    const co2Factor = Math.min(state.co2Level / 100, 1)
    const tempFactor =
      state.temperature >= 15 && state.temperature <= 35 ? Math.max(0, 1 - Math.abs(state.temperature - 25) / 25) : 0
    const waterFactor = Math.min(state.waterLevel / 100, 1)

    // Rate is limited by the most limiting factor
    return Math.min(lightFactor, co2Factor, tempFactor, waterFactor) * 10
  }

  // Start/stop experiment
  const toggleExperiment = () => {
    if (state.isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setState((prev) => ({ ...prev, isRunning: false }))
    } else {
      setState((prev) => ({ ...prev, isRunning: true }))
      // Trigger AI explanation when starting
      getAiExplanation(1, { efficiency })

      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const rate = calculatePhotosynthesisRate()
          const newOxygen = prev.oxygenProduced + rate * 0.1
          const newGlucose = prev.glucoseProduced + rate * 0.05
          const newTime = prev.timeElapsed + 1

          // Trigger AI explanations at specific intervals
          if (newTime === 10) getAiExplanation(2, { efficiency: (rate / 10) * 100 })
          if (newTime === 20) getAiExplanation(3, { efficiency: (rate / 10) * 100 })
          if (newTime === 30) getAiExplanation(4, { efficiency: (rate / 10) * 100 })

          // Add data point every 5 seconds
          if (newTime % 5 === 0) {
            setExperimentData((prevData) => [
              ...prevData,
              {
                time: newTime,
                oxygen: newOxygen,
                glucose: newGlucose,
                lightIntensity: prev.lightIntensity,
                co2Level: prev.co2Level,
                temperature: prev.temperature,
              },
            ])
          }

          return {
            ...prev,
            oxygenProduced: newOxygen,
            glucoseProduced: newGlucose,
            timeElapsed: newTime,
            waterLevel: Math.max(0, prev.waterLevel - 0.1), // Water consumption
          }
        })
      }, 1000)
    }
  }

  // Reset experiment
  const resetExperiment = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setState({
      lightIntensity: 50,
      co2Level: 40,
      temperature: 25,
      waterLevel: 80,
      oxygenProduced: 0,
      glucoseProduced: 0,
      isRunning: false,
      timeElapsed: 0,
    })
    setExperimentData([])
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const currentRate = calculatePhotosynthesisRate()
  const efficiency = (currentRate / 10) * 100

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* AI Assistant Panel */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            AI Lab Assistant
            <Button size="sm" variant="outline" onClick={() => getAiExplanation(0, { efficiency })} className="ml-auto">
              Get Help
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aiAssistant.isExplaining ? (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              AI is analyzing the experiment...
            </div>
          ) : aiAssistant.isActive ? (
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-gray-800">{aiAssistant.currentExplanation}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    getAiExplanation(Math.min(aiAssistant.step + 1, aiExplanations.length - 1), { efficiency })
                  }
                  disabled={aiAssistant.step >= aiExplanations.length - 1}
                >
                  Next Tip
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAiAssistant((prev) => ({ ...prev, isActive: false }))}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Click "Get Help" to receive AI-powered explanations about photosynthesis as you experiment!
            </p>
          )}
        </CardContent>
      </Card>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-green-800">Virtual Photosynthesis Lab</h1>
        <p className="text-gray-600">Explore how light, CO₂, temperature, and water affect photosynthesis in plants</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="experiment">Experiment</TabsTrigger>
          <TabsTrigger value="data">Data Analysis</TabsTrigger>
          <TabsTrigger value="equation">Chemical Equation</TabsTrigger>
          <TabsTrigger value="theory">Theory</TabsTrigger>
        </TabsList>

        <TabsContent value="experiment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Plant Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Plant Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-80 bg-gradient-to-b from-sky-200 via-blue-100 to-green-200 rounded-lg overflow-hidden border-2 border-green-300">
                  {/* Enhanced sky background with educational elements */}
                  <div className="absolute inset-0">
                    {/* Animated clouds with educational labels */}
                    <div className="absolute top-2 left-8 w-16 h-8 bg-white rounded-full opacity-70 shadow-sm">
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600 bg-white bg-opacity-90 rounded px-2 py-1 whitespace-nowrap">
                        Atmosphere
                      </div>
                    </div>
                    <div className="absolute top-6 left-20 w-12 h-6 bg-white rounded-full opacity-50"></div>
                    <div className="absolute top-3 right-16 w-14 h-7 bg-white rounded-full opacity-60"></div>

                    {/* Educational process indicators */}
                    {state.isRunning && (
                      <>
                        {/* Step 1: Light absorption */}
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 text-xs font-semibold text-yellow-800 animate-pulse">
                          <div className="flex items-center gap-1">
                            <Sun className="h-3 w-3" />
                            Step 1: Light Energy Absorbed
                          </div>
                        </div>

                        {/* Step 2: Water and CO2 uptake */}
                        {state.timeElapsed > 5 && (
                          <div className="absolute top-20 left-4 bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 text-xs font-semibold text-blue-800 animate-pulse">
                            <div className="flex items-center gap-1">
                              <Droplets className="h-3 w-3" />
                              Step 2: H₂O + CO₂ Uptake
                            </div>
                          </div>
                        )}

                        {/* Step 3: Glucose production */}
                        {state.timeElapsed > 10 && (
                          <div className="absolute top-32 right-4 bg-orange-100 border border-orange-300 rounded-lg px-3 py-2 text-xs font-semibold text-orange-800 animate-pulse">
                            <div className="flex items-center gap-1">
                              <Beaker className="h-3 w-3" />
                              Step 3: Glucose Made
                            </div>
                          </div>
                        )}

                        {/* Step 4: Oxygen release */}
                        {state.timeElapsed > 15 && (
                          <div className="absolute top-44 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 rounded-lg px-3 py-2 text-xs font-semibold text-green-800 animate-pulse">
                            <div className="flex items-center gap-1">
                              <Wind className="h-3 w-3" />
                              Step 4: O₂ Released
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Process explanation overlay */}
                    {!state.isRunning && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white bg-opacity-95 rounded-lg p-4 max-w-xs text-center shadow-lg border-2 border-green-300">
                          <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <h3 className="font-bold text-green-800 mb-2">Photosynthesis Process</h3>
                          <p className="text-xs text-gray-700 mb-3">
                            Plants use sunlight, water, and carbon dioxide to make food (glucose) and release oxygen.
                          </p>
                          <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                            6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂
                          </div>
                          <p className="text-xs text-green-600 mt-2 font-semibold">Click "Start" to see it happen!</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Sun with rays */}
                  <div className="absolute top-4 right-4">
                    <div
                      className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center transition-all duration-500 shadow-lg"
                      style={{
                        opacity: Math.max(0.3, state.lightIntensity / 100),
                        boxShadow: `0 0 ${state.lightIntensity / 3}px rgba(255, 193, 7, 0.8), 0 0 ${state.lightIntensity / 2}px rgba(255, 152, 0, 0.6)`,
                        transform: `scale(${0.8 + state.lightIntensity / 500})`,
                      }}
                    >
                      <Sun className="h-8 w-8 text-yellow-800" />

                      {/* Enhanced Sun rays with directional arrows */}
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute transition-all duration-300"
                          style={{
                            width: "2px",
                            height: `${15 + state.lightIntensity / 8}px`,
                            background: `linear-gradient(to bottom, rgba(255, 193, 7, ${state.lightIntensity / 100}), transparent)`,
                            transform: `rotate(${i * 30}deg)`,
                            transformOrigin: "bottom center",
                            bottom: "50%",
                            left: "50%",
                            marginLeft: "-1px",
                          }}
                        >
                          {/* Arrow tip for sun rays */}
                          <div
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0"
                            style={{
                              borderLeft: "3px solid transparent",
                              borderRight: "3px solid transparent",
                              borderTop: `4px solid rgba(255, 193, 7, ${state.lightIntensity / 100})`,
                            }}
                          />
                        </div>
                      ))}

                      {/* Animated light beams to plant with arrows */}
                      {state.lightIntensity > 20 && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="absolute">
                              <div
                                className="w-1 bg-gradient-to-b from-yellow-300 to-transparent animate-pulse"
                                style={{
                                  height: "100px",
                                  left: `${(i - 2) * 10}px`,
                                  opacity: (state.lightIntensity / 100) * 0.7,
                                  animationDelay: `${i * 0.2}s`,
                                }}
                              />
                              {/* Directional arrow for light */}
                              <div
                                className="absolute w-0 h-0 animate-pulse"
                                style={{
                                  left: `${(i - 2) * 10 - 2}px`,
                                  top: "80px",
                                  borderLeft: "3px solid transparent",
                                  borderRight: "3px solid transparent",
                                  borderTop: `5px solid rgba(255, 193, 7, ${state.lightIntensity / 100})`,
                                  animationDelay: `${i * 0.2}s`,
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced CO2 molecules with directional movement */}
                  <div className="absolute top-8 left-4 space-y-2">
                    {Array.from({ length: Math.floor(state.co2Level / 12) }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-1 text-gray-700 font-semibold"
                        style={{
                          animation: `float 3s ease-in-out infinite`,
                          animationDelay: `${i * 0.3}s`,
                        }}
                      >
                        <div className="relative">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
                        </div>
                        <span className="text-xs ml-1">CO₂</span>
                        {/* Animated arrow showing CO2 movement */}
                        <div className="flex items-center">
                          <div className="w-8 h-px bg-gray-400"></div>
                          <div className="w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <style jsx>{`
                    @keyframes float {
                      0%, 100% { transform: translateX(0px) translateY(0px); }
                      25% { transform: translateX(5px) translateY(-3px); }
                      50% { transform: translateX(10px) translateY(0px); }
                      75% { transform: translateX(15px) translateY(-2px); }
                    }
                  `}</style>

                  {/* Enhanced Oxygen molecules being released with upward movement */}
                  {state.isRunning && currentRate > 0 && (
                    <div className="absolute top-8 right-20 space-y-2">
                      {Array.from({ length: Math.floor(currentRate / 2) }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-1 text-blue-700 font-semibold"
                          style={{
                            animation: `rise 2.5s ease-out infinite`,
                            animationDelay: `${i * 0.4}s`,
                          }}
                        >
                          <div className="relative">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <div className="absolute -right-1 top-0 w-2 h-2 bg-blue-400 rounded-full"></div>
                          </div>
                          <span className="text-xs">O₂</span>
                          {/* Upward arrow for oxygen */}
                          <div className="flex flex-col items-center">
                            <div className="w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-b-4 border-b-blue-500"></div>
                            <div className="w-px h-6 bg-blue-500"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <style jsx>{`
                    @keyframes rise {
                      0% { transform: translateY(0px); opacity: 1; }
                      100% { transform: translateY(-40px); opacity: 0; }
                    }
                  `}</style>

                  {/* Enhanced Plant with detailed structure */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                    {/* Soil */}
                    <div className="w-32 h-8 bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-lg -mb-2"></div>

                    {/* Root system */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 bg-amber-700 rounded-full"
                          style={{
                            height: `${8 + i * 2}px`,
                            left: `${(i - 2) * 6}px`,
                            bottom: "-8px",
                            transform: `rotate(${(i - 2) * 15}deg)`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Main stem with gradient */}
                    <div className="w-3 h-36 bg-gradient-to-t from-green-700 to-green-500 mx-auto rounded-t-sm shadow-sm"></div>

                    {/* Enhanced leaves with chloroplasts visualization */}
                    <div className="relative">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute transition-all duration-500 group"
                          style={{
                            left: `${i % 2 === 0 ? -25 : 15}px`,
                            bottom: `${25 + i * 12}px`,
                          }}
                        >
                          {/* Leaf shape */}
                          <div
                            className="w-12 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-md border border-green-500 relative overflow-hidden"
                            style={{
                              opacity: Math.max(0.4, efficiency / 100),
                              filter: `brightness(${0.6 + efficiency / 150}) saturate(${0.8 + efficiency / 200})`,
                              transform: `rotate(${i % 2 === 0 ? -15 : 15}deg)`,
                            }}
                          >
                            {/* Leaf veins */}
                            <div className="absolute inset-0">
                              <div className="absolute top-1/2 left-0 right-0 h-px bg-green-700 opacity-50"></div>
                              <div className="absolute top-1/3 left-1/4 right-1/4 h-px bg-green-700 opacity-30 transform rotate-12"></div>
                              <div className="absolute bottom-1/3 left-1/4 right-1/4 h-px bg-green-700 opacity-30 transform -rotate-12"></div>
                            </div>

                            {/* Chloroplasts (tiny green dots) */}
                            {efficiency > 30 &&
                              Array.from({ length: 6 }).map((_, j) => (
                                <div
                                  key={j}
                                  className="absolute w-1 h-1 bg-green-300 rounded-full animate-pulse"
                                  style={{
                                    left: `${20 + (j % 3) * 20}%`,
                                    top: `${30 + Math.floor(j / 3) * 40}%`,
                                    animationDelay: `${j * 0.2}s`,
                                  }}
                                />
                              ))}
                          </div>

                          {/* Leaf stem */}
                          <div
                            className="absolute w-px h-3 bg-green-600"
                            style={{
                              right: i % 2 === 0 ? "-1px" : "auto",
                              left: i % 2 === 0 ? "auto" : "-1px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Water molecules being absorbed (animated) */}
                    {state.waterLevel > 20 && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute text-xs text-blue-600 animate-bounce font-semibold"
                            style={{
                              left: `${(i - 1) * 12}px`,
                              animationDelay: `${i * 0.4}s`,
                              animationDuration: "2s",
                            }}
                          >
                            H₂O ↑
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Glucose production indicator */}
                    {state.isRunning && currentRate > 2 && (
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                        <div className="bg-orange-100 border border-orange-300 rounded-full px-2 py-1 text-xs font-semibold text-orange-700 animate-pulse">
                          C₆H₁₂O₆
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Environmental indicators */}
                  <div className="absolute bottom-4 left-4 space-y-1">
                    <div className="flex items-center gap-1 text-xs bg-white bg-opacity-80 rounded px-2 py-1">
                      <Thermometer className="h-3 w-3" />
                      <span>{state.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-white bg-opacity-80 rounded px-2 py-1">
                      <Droplets className="h-3 w-3 text-blue-500" />
                      <span>{state.waterLevel.toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* Process arrows and labels */}
                  {state.isRunning && (
                    <>
                      {/* CO2 + H2O input arrow */}
                      <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                        <div className="text-xs font-semibold text-gray-700 bg-white bg-opacity-90 rounded px-2 py-1 shadow-sm">
                          CO₂ + H₂O
                        </div>
                        <div className="text-lg text-green-600 ml-4">→</div>
                      </div>

                      {/* O2 + Glucose output arrow */}
                      <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                        <div className="text-lg text-green-600 mr-4">→</div>
                        <div className="text-xs font-semibold text-gray-700 bg-white bg-opacity-90 rounded px-2 py-1 shadow-sm">
                          O₂ + C₆H₁₂O₆
                        </div>
                      </div>
                    </>
                  )}

                  {/* Photosynthesis efficiency indicator */}
                  <div className="absolute top-4 left-4">
                    <div
                      className="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300"
                      style={{
                        backgroundColor: efficiency > 70 ? "#dcfce7" : efficiency > 40 ? "#fef3c7" : "#fee2e2",
                        color: efficiency > 70 ? "#166534" : efficiency > 40 ? "#92400e" : "#991b1b",
                        border: `1px solid ${efficiency > 70 ? "#bbf7d0" : efficiency > 40 ? "#fde68a" : "#fecaca"}`,
                      }}
                    >
                      Efficiency: {efficiency.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Production Meters */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Wind className="h-4 w-4 text-blue-500" />
                      Oxygen Production
                    </span>
                    <Badge variant="secondary">{state.oxygenProduced.toFixed(1)} mL</Badge>
                  </div>
                  <Progress value={Math.min(100, state.oxygenProduced)} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Beaker className="h-4 w-4 text-orange-500" />
                      Glucose Production
                    </span>
                    <Badge variant="secondary">{state.glucoseProduced.toFixed(1)} mg</Badge>
                  </div>
                  <Progress value={Math.min(100, state.glucoseProduced * 2)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Experiment Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Light Intensity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      Light Intensity
                    </label>
                    <span className="text-sm text-gray-600">{state.lightIntensity}%</span>
                  </div>
                  <Slider
                    value={[state.lightIntensity]}
                    onValueChange={([value]) => setState((prev) => ({ ...prev, lightIntensity: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                    disabled={state.isRunning}
                  />
                </div>

                {/* CO2 Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Wind className="h-4 w-4 text-gray-500" />
                      CO₂ Concentration
                    </label>
                    <span className="text-sm text-gray-600">{state.co2Level}%</span>
                  </div>
                  <Slider
                    value={[state.co2Level]}
                    onValueChange={([value]) => setState((prev) => ({ ...prev, co2Level: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                    disabled={state.isRunning}
                  />
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      Temperature
                    </label>
                    <span className="text-sm text-gray-600">{state.temperature}°C</span>
                  </div>
                  <Slider
                    value={[state.temperature]}
                    onValueChange={([value]) => setState((prev) => ({ ...prev, temperature: value }))}
                    min={0}
                    max={50}
                    step={1}
                    className="w-full"
                    disabled={state.isRunning}
                  />
                </div>

                {/* Water Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      Water Level
                    </label>
                    <span className="text-sm text-gray-600">{state.waterLevel.toFixed(1)}%</span>
                  </div>
                  <Progress value={state.waterLevel} className="h-2" />
                </div>

                {/* Current Rate */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Photosynthesis Rate</span>
                    <Badge variant={efficiency > 70 ? "default" : efficiency > 40 ? "secondary" : "destructive"}>
                      {efficiency.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={efficiency} className="h-2" />
                  <p className="text-xs text-green-600 mt-1">Current rate: {currentRate.toFixed(2)} units/sec</p>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={toggleExperiment}
                    className="flex-1"
                    variant={state.isRunning ? "destructive" : "default"}
                  >
                    {state.isRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button onClick={resetExperiment} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Timer */}
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-gray-800">
                    {Math.floor(state.timeElapsed / 60)}:{(state.timeElapsed % 60).toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm text-gray-600">Experiment Time</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Experimental Data</CardTitle>
            </CardHeader>
            <CardContent>
              {experimentData.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {experimentData[experimentData.length - 1]?.oxygen.toFixed(1) || "0.0"}
                      </div>
                      <div className="text-sm text-blue-800">Total O₂ (mL)</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {experimentData[experimentData.length - 1]?.glucose.toFixed(1) || "0.0"}
                      </div>
                      <div className="text-sm text-orange-800">Total Glucose (mg)</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {experimentData.length > 1
                          ? (
                              (experimentData[experimentData.length - 1]?.oxygen -
                                experimentData[experimentData.length - 2]?.oxygen) /
                              5
                            ).toFixed(2)
                          : "0.00"}
                      </div>
                      <div className="text-sm text-yellow-800">O₂ Rate (mL/s)</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{efficiency.toFixed(1)}%</div>
                      <div className="text-sm text-green-800">Efficiency</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Time (s)</th>
                          <th className="text-left p-2">O₂ (mL)</th>
                          <th className="text-left p-2">Glucose (mg)</th>
                          <th className="text-left p-2">Light (%)</th>
                          <th className="text-left p-2">CO₂ (%)</th>
                          <th className="text-left p-2">Temp (°C)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {experimentData.slice(-10).map((data, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{data.time}</td>
                            <td className="p-2">{data.oxygen.toFixed(1)}</td>
                            <td className="p-2">{data.glucose.toFixed(1)}</td>
                            <td className="p-2">{data.lightIntensity}</td>
                            <td className="p-2">{data.co2Level}</td>
                            <td className="p-2">{data.temperature}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start the experiment to collect data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Photosynthesis Chemical Equation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-2xl font-mono bg-gray-50 p-4 rounded-lg">
                  6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-green-800 mb-3">Reactants (Inputs)</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <Wind className="h-4 w-4 text-blue-600" />
                      <span>
                        <strong>6CO₂</strong> - Carbon dioxide from air
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <span>
                        <strong>6H₂O</strong> - Water from soil
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                      <Sun className="h-4 w-4 text-yellow-600" />
                      <span>
                        <strong>Light Energy</strong> - From sunlight
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-green-800 mb-3">Products (Outputs)</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                      <Beaker className="h-4 w-4 text-orange-600" />
                      <span>
                        <strong>C₆H₁₂O₆</strong> - Glucose (sugar)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <Wind className="h-4 w-4 text-green-600" />
                      <span>
                        <strong>6O₂</strong> - Oxygen gas
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Key Points:</h3>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>• Photosynthesis occurs in chloroplasts of plant cells</li>
                  <li>• Chlorophyll captures light energy</li>
                  <li>• Process has two main stages: light reactions and Calvin cycle</li>
                  <li>• Glucose provides energy for plant growth</li>
                  <li>• Oxygen is released as a byproduct</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Photosynthesis Theory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-green-800 mb-3">What is Photosynthesis?</h3>
                <p className="text-gray-700">
                  Photosynthesis is the process by which plants, algae, and some bacteria convert light energy (usually
                  from sunlight) into chemical energy stored in glucose. This process is essential for life on Earth as
                  it produces oxygen and forms the base of most food chains.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-green-800 mb-3">Limiting Factors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center gap-1 mb-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      Light Intensity
                    </h4>
                    <p className="text-sm text-gray-600">
                      More light generally increases photosynthesis rate until saturation point.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center gap-1 mb-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      CO₂ Concentration
                    </h4>
                    <p className="text-sm text-gray-600">
                      Higher CO₂ levels increase photosynthesis rate up to a maximum.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center gap-1 mb-2">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      Temperature
                    </h4>
                    <p className="text-sm text-gray-600">
                      Optimal range is 20-30°C. Too hot or cold reduces enzyme activity.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center gap-1 mb-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      Water Availability
                    </h4>
                    <p className="text-sm text-gray-600">
                      Essential reactant. Water stress reduces photosynthesis rate.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-green-800 mb-3">Importance of Photosynthesis</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Produces oxygen that most life forms need to breathe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Creates glucose that serves as food for plants and animals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Removes carbon dioxide from the atmosphere</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Forms the foundation of most food webs on Earth</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
