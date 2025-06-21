"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  TestTube,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Target,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Award,
  Eye,
  MessageCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

interface Substance {
  name: string
  formula: string
  ph: number
  color: string
  type: "acid" | "base" | "neutral"
  strength: "strong" | "weak" | "neutral"
  commonUse: string
}

interface Indicator {
  name: string
  acidColor: string
  baseColor: string
  neutralColor: string
  phRange: string
}

export default function AcidsBasesPage() {
  const [selectedSubstance, setSelectedSubstance] = useState<string>("")
  const [selectedIndicator, setSelectedIndicator] = useState<string>("")
  const [currentPH, setCurrentPH] = useState<number>(7)
  const [indicatorColor, setIndicatorColor] = useState<string>("#E5E7EB")
  const [isTestingActive, setIsTestingActive] = useState(false)
  const [testedSubstances, setTestedSubstances] = useState<string[]>([])
  const [experimentProgress, setExperimentProgress] = useState(0)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content:
        "Welcome to the Acids & Bases Laboratory! I'm your AI chemistry assistant. I'll guide you through pH testing and help you understand acid-base chemistry. Ready to start? 🧪⚗️",
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isAIThinking, setIsAIThinking] = useState(false)

  const substances: Substance[] = [
    {
      name: "Lemon Juice",
      formula: "C₆H₈O₇",
      ph: 2.0,
      color: "#FFFF99",
      type: "acid",
      strength: "weak",
      commonUse: "Food flavoring, cleaning",
    },
    {
      name: "Vinegar",
      formula: "CH₃COOH",
      ph: 2.4,
      color: "#F5F5DC",
      type: "acid",
      strength: "weak",
      commonUse: "Cooking, preservation",
    },
    {
      name: "Coffee",
      formula: "Various",
      ph: 5.0,
      color: "#8B4513",
      type: "acid",
      strength: "weak",
      commonUse: "Beverage",
    },
    {
      name: "Pure Water",
      formula: "H₂O",
      ph: 7.0,
      color: "#E0F6FF",
      type: "neutral",
      strength: "neutral",
      commonUse: "Drinking, cleaning",
    },
    {
      name: "Baking Soda",
      formula: "NaHCO₃",
      ph: 9.0,
      color: "#FFFFFF",
      type: "base",
      strength: "weak",
      commonUse: "Baking, cleaning",
    },
    {
      name: "Soap Solution",
      formula: "Various",
      ph: 10.0,
      color: "#F0F8FF",
      type: "base",
      strength: "weak",
      commonUse: "Cleaning",
    },
    {
      name: "Ammonia",
      formula: "NH₃",
      ph: 11.0,
      color: "#E6F3FF",
      type: "base",
      strength: "weak",
      commonUse: "Cleaning agent",
    },
    {
      name: "Hydrochloric Acid",
      formula: "HCl",
      ph: 1.0,
      color: "#FFE4E1",
      type: "acid",
      strength: "strong",
      commonUse: "Industrial processes, lab reagent",
    },
    {
      name: "Sodium Hydroxide",
      formula: "NaOH",
      ph: 13.0,
      color: "#F8F8FF",
      type: "base",
      strength: "strong",
      commonUse: "Soap making, drain cleaner",
    },
  ]

  const indicators: Indicator[] = [
    {
      name: "Litmus Paper",
      acidColor: "#FF6B6B",
      baseColor: "#4ECDC4",
      neutralColor: "#95A5A6",
      phRange: "4.5-8.3",
    },
    {
      name: "Universal Indicator",
      acidColor: "#FF4757",
      baseColor: "#5352ED",
      neutralColor: "#2ED573",
      phRange: "0-14",
    },
    {
      name: "Phenolphthalein",
      acidColor: "#FFFFFF",
      baseColor: "#FF69B4",
      neutralColor: "#FFFFFF",
      phRange: "8.2-10.0",
    },
    {
      name: "Methyl Orange",
      acidColor: "#FF6347",
      baseColor: "#FFD700",
      neutralColor: "#FFA500",
      phRange: "3.1-4.4",
    },
    {
      name: "Red Cabbage",
      acidColor: "#DC143C",
      baseColor: "#32CD32",
      neutralColor: "#9370DB",
      phRange: "2-12",
    },
  ]

  useEffect(() => {
    if (selectedSubstance && selectedIndicator) {
      const substance = substances.find((s) => s.name === selectedSubstance)
      const indicator = indicators.find((i) => i.name === selectedIndicator)

      if (substance && indicator) {
        setCurrentPH(substance.ph)

        // Determine indicator color based on pH
        let color = indicator.neutralColor
        if (substance.ph < 7) {
          color = indicator.acidColor
        } else if (substance.ph > 7) {
          color = indicator.baseColor
        }

        setIndicatorColor(color)
      }
    }
  }, [selectedSubstance, selectedIndicator])

  const addChatMessage = (role: string, content: string) => {
    setChatMessages((prev) => [...prev, { role, content }])
  }

  const sendChatMessage = async () => {
    if (currentMessage.trim()) {
      addChatMessage("user", currentMessage)
      setIsAIThinking(true)

      // Simulate AI response based on current experiment context
      setTimeout(() => {
        const responses = getContextualAIResponse(currentMessage, selectedSubstance, selectedIndicator, currentPH)
        addChatMessage("assistant", responses)
        setIsAIThinking(false)
      }, 1500)

      setCurrentMessage("")
    }
  }

  const getContextualAIResponse = (question: string, substance: string, indicator: string, ph: number) => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("ph") || lowerQuestion.includes("acid") || lowerQuestion.includes("base")) {
      if (ph < 7) {
        return `Great question! With pH ${ph}, ${substance} is acidic. Acids have pH less than 7, taste sour, and can react with metals. In Kenya, we see acids in citrus fruits and vinegar used in cooking!`
      } else if (ph > 7) {
        return `Excellent observation! ${substance} has pH ${ph}, making it basic/alkaline. Bases have pH greater than 7, feel slippery, and taste bitter. Soap and baking soda are common basic substances in Kenyan households!`
      } else {
        return `Perfect! ${substance} is neutral with pH 7, just like pure water. This is the balance point between acids and bases.`
      }
    }

    if (lowerQuestion.includes("indicator") || lowerQuestion.includes("color")) {
      return `${indicator} is an excellent choice! Indicators change color based on pH levels. This helps us visually identify whether a substance is acidic, neutral, or basic. Each indicator has a specific pH range where it changes color.`
    }

    if (lowerQuestion.includes("safety") || lowerQuestion.includes("danger")) {
      return `Safety is crucial in chemistry! Always wear protective equipment, never taste unknown substances, and wash hands after experiments. Strong acids and bases can be dangerous, but we're using safe concentrations in our virtual lab.`
    }

    if (lowerQuestion.includes("real") || lowerQuestion.includes("life") || lowerQuestion.includes("kenya")) {
      return `Great connection! In Kenya, we use acid-base chemistry in many ways: soap making (using bases), food preservation with vinegar (acid), and water treatment. Understanding pH helps in agriculture for soil testing too!`
    }

    // Default responses
    const defaultResponses = [
      "That's a thoughtful question! pH testing helps us understand the chemical nature of substances around us.",
      "Excellent curiosity! Remember, acids have pH < 7, bases have pH > 7, and neutral substances have pH = 7.",
      "Great observation! The color changes you see are chemical indicators responding to different pH levels.",
      "Perfect question for a young scientist! Keep observing the patterns in your experiments.",
      "Wonderful inquiry! Chemistry is all about understanding how substances interact and change.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const testSubstance = () => {
    if (!selectedSubstance || !selectedIndicator) {
      alert("Please select both a substance and an indicator before testing.")
      addChatMessage(
        "assistant",
        "Remember to select both a substance and an indicator before testing. This ensures accurate pH measurement! 🧪",
      )
      return
    }

    setIsTestingActive(true)
    addChatMessage(
      "assistant",
      `Great choice! Testing ${selectedSubstance} with ${selectedIndicator}. Watch the color change carefully - it tells us about the pH level!`,
    )

    // Simulate testing process with visual feedback
    setTimeout(() => {
      setIsTestingActive(false)

      // Add to tested substances if not already tested
      if (!testedSubstances.includes(selectedSubstance)) {
        setTestedSubstances((prev) => [...prev, selectedSubstance])
        setExperimentProgress((prev) => Math.min(prev + 100 / substances.length, 100))

        // AI provides detailed analysis
        const substance = substances.find((s) => s.name === selectedSubstance)
        if (substance) {
          const analysis = `Excellent work! ${substance.name} has pH ${substance.ph}, making it ${substance.type}. ${
            substance.type === "acid"
              ? "Notice how acids can be found in many foods and cleaning products."
              : substance.type === "base"
                ? "Bases like this are often used in cleaning and manufacturing."
                : "Neutral substances like pure water are neither acidic nor basic."
          } Keep experimenting! 🎉`

          addChatMessage("assistant", analysis)
        }
      } else {
        addChatMessage(
          "assistant",
          `You've already tested ${selectedSubstance}! Try testing a different substance to expand your knowledge. 🔬`,
        )
      }
    }, 2000)
  }

  const resetExperiment = () => {
    setSelectedSubstance("")
    setSelectedIndicator("")
    setCurrentPH(7)
    setIndicatorColor("#E5E7EB")
    setIsTestingActive(false)
    setTestedSubstances([])
    setExperimentProgress(0)
  }

  const getPHColor = (ph: number) => {
    if (ph < 3) return "text-red-600"
    if (ph < 6) return "text-orange-600"
    if (ph < 8) return "text-green-600"
    if (ph < 11) return "text-blue-600"
    return "text-purple-600"
  }

  const getPHDescription = (ph: number) => {
    if (ph < 3) return "Strongly Acidic"
    if (ph < 6) return "Weakly Acidic"
    if (ph < 8) return "Neutral"
    if (ph < 11) return "Weakly Basic"
    return "Strongly Basic"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <TestTube className="h-6 w-6 text-green-500" />
                Acids & Bases Laboratory
              </h1>
              <p className="text-gray-600">Grade 7-9 • CBC Aligned • pH Testing & Indicators</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Testing Progress</span>
              <span className="text-sm text-gray-600">{Math.round(experimentProgress)}% Complete</span>
            </div>
            <Progress value={experimentProgress} className="w-full" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{testedSubstances.length} substances tested</span>
              <span>{substances.length} total substances</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Testing Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Substance and Indicator Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  pH Testing Setup
                </CardTitle>
                <CardDescription>Select a substance and indicator to test pH levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label>Test Substance</Label>
                    <Select value={selectedSubstance} onValueChange={setSelectedSubstance}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select substance to test" />
                      </SelectTrigger>
                      <SelectContent>
                        {substances.map((substance) => (
                          <SelectItem key={substance.name} value={substance.name}>
                            {substance.name} ({substance.formula})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>pH Indicator</Label>
                    <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select indicator" />
                      </SelectTrigger>
                      <SelectContent>
                        {indicators.map((indicator) => (
                          <SelectItem key={indicator.name} value={indicator.name}>
                            {indicator.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={testSubstance}
                    disabled={!selectedSubstance || !selectedIndicator || isTestingActive}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isTestingActive ? (
                      <>
                        <Eye className="h-4 w-4 mr-2 animate-pulse" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Test pH Level
                      </>
                    )}
                  </Button>
                  <Button onClick={resetExperiment} variant="outline" size="lg" className="hover:bg-gray-50">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Lab
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Testing Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>pH Testing Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  {selectedSubstance && selectedIndicator ? (
                    <div className="text-center space-y-6">
                      {/* Test Tube Visualization */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="w-16 h-32 border-4 border-gray-300 rounded-b-full bg-white">
                            <div
                              className={`w-full h-24 rounded-b-full transition-all duration-1000 ${
                                isTestingActive ? "animate-pulse" : ""
                              }`}
                              style={{ backgroundColor: indicatorColor }}
                            />
                          </div>
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gray-300 rounded-t"></div>
                        </div>
                      </div>

                      {/* pH Reading */}
                      <div className="space-y-2">
                        <div className="text-4xl font-bold">
                          <span className={getPHColor(currentPH)}>pH {currentPH.toFixed(1)}</span>
                        </div>
                        <div className="text-lg font-medium text-gray-700">{getPHDescription(currentPH)}</div>
                        <Badge
                          className={`${
                            substances.find((s) => s.name === selectedSubstance)?.type === "acid"
                              ? "bg-red-100 text-red-800"
                              : substances.find((s) => s.name === selectedSubstance)?.type === "base"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {substances.find((s) => s.name === selectedSubstance)?.type?.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Substance Info */}
                      {selectedSubstance && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">{selectedSubstance}</h4>
                          <p className="text-sm text-gray-600 mb-1">
                            Formula: {substances.find((s) => s.name === selectedSubstance)?.formula}
                          </p>
                          <p className="text-sm text-gray-600">
                            Common Use: {substances.find((s) => s.name === selectedSubstance)?.commonUse}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <TestTube className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p>Select a substance and indicator to begin pH testing</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* pH Scale Reference */}
            <Card>
              <CardHeader>
                <CardTitle>pH Scale Reference</CardTitle>
                <CardDescription>Understanding the pH scale from 0-14</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Acidic</span>
                    <span className="text-sm font-medium">Neutral</span>
                    <span className="text-sm font-medium">Basic</span>
                  </div>
                  <div className="relative h-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-lg">
                    <div className="absolute inset-0 flex items-center justify-between px-2 text-white text-xs font-bold">
                      <span>0</span>
                      <span>7</span>
                      <span>14</span>
                    </div>
                    {currentPH > 0 && (
                      <div
                        className="absolute top-0 w-2 h-8 bg-black opacity-50 rounded"
                        style={{ left: `${(currentPH / 14) * 100}%` }}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-red-600">Acids (pH &lt; 7)</div>
                      <div className="text-gray-600">Sour taste, react with metals</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-600">Neutral (pH = 7)</div>
                      <div className="text-gray-600">Pure water</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-blue-600">Bases (pH &gt; 7)</div>
                      <div className="text-gray-600">Bitter taste, slippery feel</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Indicators Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  pH Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {indicators.map((indicator) => (
                    <div key={indicator.name} className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-2">{indicator.name}</h4>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: indicator.acidColor }} />
                        <span className="text-xs">Acid</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: indicator.neutralColor }} />
                        <span className="text-xs">Neutral</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded border bg-blue-500" />
                        <span className="text-xs">Base</span>
                      </div>
                      <div className="text-xs text-gray-600">Range: {indicator.phRange}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Chemistry Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Chemistry Assistant
                </CardTitle>
                <CardDescription>Ask questions about acids, bases, and pH testing</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 mb-4">
                  <div className="space-y-3">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] p-3 rounded-lg text-sm ${
                            message.role === "user"
                              ? "bg-green-500 text-white rounded-br-none"
                              : "bg-gray-100 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isAIThinking && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none text-sm">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-3 w-3 border-2 border-green-500 border-t-transparent rounded-full"></div>
                            AI is thinking...
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about pH, acids, bases..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                    className="flex-1"
                    disabled={isAIThinking}
                  />
                  <Button onClick={sendChatMessage} size="sm" disabled={isAIThinking || !currentMessage.trim()}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Help Buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage("What is pH?")
                      setTimeout(() => sendChatMessage(), 100)
                    }}
                    className="text-xs"
                  >
                    What is pH?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage("How do indicators work?")
                      setTimeout(() => sendChatMessage(), 100)
                    }}
                    className="text-xs"
                  >
                    How do indicators work?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage("Safety tips?")
                      setTimeout(() => sendChatMessage(), 100)
                    }}
                    className="text-xs"
                  >
                    Safety tips?
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Testing Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Testing Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {substances.map((substance) => (
                    <div key={substance.name} className="flex items-center gap-2 text-sm">
                      {testedSubstances.includes(substance.name) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded" />
                      )}
                      <span className={testedSubstances.includes(substance.name) ? "text-green-700" : "text-gray-600"}>
                        {substance.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Learning Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Understand the pH scale and its significance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Identify acids, bases, and neutral substances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use different pH indicators effectively</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Connect pH to everyday substances</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Safety Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Safety Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Never taste unknown substances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Wear safety goggles when handling acids/bases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Wash hands after handling chemicals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Report spills immediately</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievement Badge */}
        {experimentProgress === 100 && (
          <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 pH Testing Expert!</h3>
                <p className="text-green-700 mb-4">
                  Outstanding! You've successfully tested all substances and mastered pH indicators. You now understand
                  how to identify acids, bases, and neutral substances using various testing methods!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{testedSubstances.length}</div>
                    <div className="text-sm text-gray-600">Substances Tested</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{indicators.length}</div>
                    <div className="text-sm text-gray-600">Indicators Mastered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">A+</div>
                    <div className="text-sm text-gray-600">Chemistry Grade</div>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" onClick={resetExperiment}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Test Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
