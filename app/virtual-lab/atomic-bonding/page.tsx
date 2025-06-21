"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Atom,
  Play,
  RotateCcw,
  CheckCircle,
  Target,
  ArrowLeft,
  Zap,
  Sparkles,
  BookOpen,
  Award,
  MessageCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

interface AtomData {
  symbol: string
  name: string
  atomicNumber: number
  valenceElectrons: number
  electronegativity: number
  color: string
}

interface Bond {
  type: "ionic" | "covalent" | "metallic"
  strength: number
  description: string
  example: string
}

export default function AtomicBondingPage() {
  const [selectedAtom1, setSelectedAtom1] = useState<string>("")
  const [selectedAtom2, setSelectedAtom2] = useState<string>("")
  const [bondType, setBondType] = useState<string>("")
  const [bondStrength, setBondStrength] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [completedBonds, setCompletedBonds] = useState<string[]>([])
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content:
        "Welcome to the Atomic Bonding Laboratory! I'm your AI chemistry assistant. I'll help you understand how atoms bond together to form molecules and compounds. Let's explore the fascinating world of chemical bonding! ⚛️🔬",
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isAIThinking, setIsAIThinking] = useState(false)

  const atoms: AtomData[] = [
    { symbol: "H", name: "Hydrogen", atomicNumber: 1, valenceElectrons: 1, electronegativity: 2.1, color: "#FFFFFF" },
    { symbol: "Li", name: "Lithium", atomicNumber: 3, valenceElectrons: 1, electronegativity: 1.0, color: "#CC80FF" },
    { symbol: "C", name: "Carbon", atomicNumber: 6, valenceElectrons: 4, electronegativity: 2.5, color: "#909090" },
    { symbol: "N", name: "Nitrogen", atomicNumber: 7, valenceElectrons: 5, electronegativity: 3.0, color: "#3050F8" },
    { symbol: "O", name: "Oxygen", atomicNumber: 8, valenceElectrons: 6, electronegativity: 3.5, color: "#FF0D0D" },
    { symbol: "F", name: "Fluorine", atomicNumber: 9, valenceElectrons: 7, electronegativity: 4.0, color: "#90E050" },
    { symbol: "Na", name: "Sodium", atomicNumber: 11, valenceElectrons: 1, electronegativity: 0.9, color: "#AB5CF2" },
    {
      symbol: "Mg",
      name: "Magnesium",
      atomicNumber: 12,
      valenceElectrons: 2,
      electronegativity: 1.2,
      color: "#8AFF00",
    },
    { symbol: "Cl", name: "Chlorine", atomicNumber: 17, valenceElectrons: 7, electronegativity: 3.0, color: "#1FF01F" },
    { symbol: "Ca", name: "Calcium", atomicNumber: 20, valenceElectrons: 2, electronegativity: 1.0, color: "#3DFF00" },
  ]

  const determineBondType = (atom1: AtomData, atom2: AtomData): Bond => {
    const electronegativityDiff = Math.abs(atom1.electronegativity - atom2.electronegativity)

    if (electronegativityDiff > 1.7) {
      return {
        type: "ionic",
        strength: 8,
        description: "Electrons are transferred from one atom to another, creating charged ions.",
        example: `${atom1.symbol}⁺ + ${atom2.symbol}⁻ → ${atom1.symbol}${atom2.symbol}`,
      }
    } else if (electronegativityDiff > 0.4) {
      return {
        type: "covalent",
        strength: 6,
        description: "Electrons are shared unequally between atoms (polar covalent).",
        example: `${atom1.symbol}-${atom2.symbol} (polar)`,
      }
    } else {
      return {
        type: "covalent",
        strength: 5,
        description: "Electrons are shared equally between atoms (nonpolar covalent).",
        example: `${atom1.symbol}-${atom2.symbol} (nonpolar)`,
      }
    }
  }

  const addChatMessage = (role: string, content: string) => {
    setChatMessages((prev) => [...prev, { role, content }])
  }

  const sendChatMessage = async () => {
    if (currentMessage.trim()) {
      addChatMessage("user", currentMessage)
      setIsAIThinking(true)

      setTimeout(() => {
        const response = getContextualAIResponse(currentMessage, selectedAtom1, selectedAtom2, bondType)
        addChatMessage("assistant", response)
        setIsAIThinking(false)
      }, 1500)

      setCurrentMessage("")
    }
  }

  const getContextualAIResponse = (question: string, atom1: any, atom2: any, currentBondType: string) => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("bond") || lowerQuestion.includes("electron")) {
      if (currentBondType === "ionic") {
        return `Great question about ionic bonds! In ionic bonding, electrons are transferred from one atom to another, creating charged ions. Metals lose electrons (become positive) and non-metals gain electrons (become negative). The opposite charges attract!`
      } else if (currentBondType === "covalent") {
        return `Excellent inquiry about covalent bonds! In covalent bonding, atoms share electrons to achieve stable electron configurations. This sharing creates strong bonds between non-metal atoms.`
      } else {
        return `Chemical bonds form when atoms interact to achieve stable electron configurations. There are three main types: ionic (electron transfer), covalent (electron sharing), and metallic (electron sea).`
      }
    }

    if (lowerQuestion.includes("electronegativity") || lowerQuestion.includes("polar")) {
      return `Electronegativity is an atom's ability to attract electrons! When atoms with different electronegativities bond, the more electronegative atom pulls electrons closer, creating polar bonds. Large differences (>1.7) create ionic bonds!`
    }

    if (lowerQuestion.includes("metal") || lowerQuestion.includes("nonmetal")) {
      return `Great observation! Metals tend to lose electrons easily (low electronegativity) while non-metals tend to gain electrons (high electronegativity). This difference drives ionic bond formation between metals and non-metals!`
    }

    if (lowerQuestion.includes("kenya") || lowerQuestion.includes("real") || lowerQuestion.includes("life")) {
      return `Fantastic connection! Chemical bonding is everywhere in Kenya: salt (NaCl) in our food uses ionic bonds, water (H₂O) uses covalent bonds, and metals in construction use metallic bonds. Understanding bonding helps in materials science and industry!`
    }

    if (lowerQuestion.includes("strength") || lowerQuestion.includes("strong")) {
      return `Bond strength depends on several factors: the atoms involved, bond length, and bond type. Generally, shorter bonds are stronger, and triple bonds are stronger than double bonds, which are stronger than single bonds!`
    }

    const defaultResponses = [
      "Excellent question! Chemical bonding is how atoms achieve stable electron configurations by interacting with other atoms.",
      "Great curiosity! Understanding bonding helps explain why substances have different properties and behaviors.",
      "Perfect observation! Atoms bond to become more stable, following the octet rule (8 electrons in outer shell).",
      "Wonderful inquiry! The type of bond formed depends on the electronegativity difference between atoms.",
      "Great thinking! Chemical bonds determine the properties of all materials around us!",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const createBond = () => {
    if (!selectedAtom1 || !selectedAtom2) {
      addChatMessage(
        "assistant",
        "Please select two atoms to create a bond! Choose atoms from the periodic table below. 🔬",
      )
      return
    }

    const atom1 = atoms.find((a) => a.symbol === selectedAtom1)
    const atom2 = atoms.find((a) => a.symbol === selectedAtom2)

    if (!atom1 || !atom2) return

    setIsAnimating(true)
    const bond = determineBondType(atom1, atom2)
    setBondType(bond.type)
    setBondStrength(bond.strength)

    addChatMessage(
      "assistant",
      `Excellent choice! ${atom1.name} and ${atom2.name} form a ${bond.type} bond. ${bond.description} Watch the animation! ⚛️`,
    )

    setTimeout(() => {
      setIsAnimating(false)
      const bondKey = `${selectedAtom1}-${selectedAtom2}`
      if (!completedBonds.includes(bondKey)) {
        setCompletedBonds((prev) => [...prev, bondKey])
        addChatMessage(
          "assistant",
          `Great work! You've successfully created a ${bond.type} bond between ${atom1.name} and ${atom2.name}. Bond strength: ${bond.strength}/10. Try different combinations to explore other bond types! 🎉`,
        )
      }
    }, 2000)
  }

  const resetBonding = () => {
    setSelectedAtom1("")
    setSelectedAtom2("")
    setBondType("")
    setBondStrength(0)
    setIsAnimating(false)
  }

  const getBondColor = (type: string) => {
    switch (type) {
      case "ionic":
        return "bg-red-100 text-red-800 border-red-200"
      case "covalent":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "metallic":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const AtomVisual = ({ atom, position }: { atom: AtomData; position: "left" | "right" }) => (
    <div className="flex flex-col items-center">
      <div
        className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-white font-bold text-lg transition-all duration-500 ${
          isAnimating ? "animate-pulse scale-110" : ""
        }`}
        style={{ backgroundColor: atom.color, borderColor: atom.color }}
      >
        {atom.symbol}
      </div>
      <div className="mt-2 text-center">
        <div className="font-medium">{atom.name}</div>
        <div className="text-xs text-gray-600">
          Valence: {atom.valenceElectrons} | EN: {atom.electronegativity}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
                <Atom className="h-6 w-6 text-indigo-500" />
                Atomic Bonding Laboratory
              </h1>
              <p className="text-gray-600">Grade 8-9 • CBC Aligned • Interactive Chemistry</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Bonding Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Atom Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Select Atoms to Bond
                </CardTitle>
                <CardDescription>Choose two atoms to explore their bonding behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label>First Atom</Label>
                    <Select value={selectedAtom1} onValueChange={setSelectedAtom1}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select first atom" />
                      </SelectTrigger>
                      <SelectContent>
                        {atoms.map((atom) => (
                          <SelectItem key={atom.symbol} value={atom.symbol}>
                            {atom.symbol} - {atom.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Second Atom</Label>
                    <Select value={selectedAtom2} onValueChange={setSelectedAtom2}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select second atom" />
                      </SelectTrigger>
                      <SelectContent>
                        {atoms.map((atom) => (
                          <SelectItem key={atom.symbol} value={atom.symbol}>
                            {atom.symbol} - {atom.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                  <Button
                    onClick={createBond}
                    disabled={!selectedAtom1 || !selectedAtom2 || isAnimating}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isAnimating ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Bonding...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Create Bond
                      </>
                    )}
                  </Button>
                  <Button onClick={resetBonding} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bonding Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Bonding Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  {selectedAtom1 && selectedAtom2 ? (
                    <div className="flex items-center gap-8">
                      <AtomVisual atom={atoms.find((a) => a.symbol === selectedAtom1)!} position="left" />
                      <div className="flex flex-col items-center">
                        {bondType && (
                          <div className="mb-2">
                            <Badge className={`${getBondColor(bondType)} border`}>
                              {bondType.charAt(0).toUpperCase() + bondType.slice(1)} Bond
                            </Badge>
                          </div>
                        )}
                        <div
                          className={`w-16 h-2 rounded transition-all duration-500 ${
                            isAnimating ? "animate-pulse" : ""
                          }`}
                          style={{
                            backgroundColor:
                              bondType === "ionic" ? "#EF4444" : bondType === "covalent" ? "#3B82F6" : "#6B7280",
                            opacity: bondStrength / 10,
                          }}
                        />
                        {bondStrength > 0 && (
                          <div className="mt-2 text-xs text-gray-600">Strength: {bondStrength}/10</div>
                        )}
                      </div>
                      <AtomVisual atom={atoms.find((a) => a.symbol === selectedAtom2)!} position="right" />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Atom className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p>Select two atoms to see their bonding behavior</p>
                    </div>
                  )}
                </div>

                {bondType && selectedAtom1 && selectedAtom2 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Bond Analysis</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      {
                        determineBondType(
                          atoms.find((a) => a.symbol === selectedAtom1)!,
                          atoms.find((a) => a.symbol === selectedAtom2)!,
                        ).description
                      }
                    </p>
                    <p className="text-sm font-mono text-gray-600">
                      {
                        determineBondType(
                          atoms.find((a) => a.symbol === selectedAtom1)!,
                          atoms.find((a) => a.symbol === selectedAtom2)!,
                        ).example
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Periodic Table Reference */}
            <Card>
              <CardHeader>
                <CardTitle>Available Atoms</CardTitle>
                <CardDescription>Click on atoms to learn about their properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {atoms.map((atom) => (
                    <div
                      key={atom.symbol}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                        selectedAtom1 === atom.symbol || selectedAtom2 === atom.symbol
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        if (!selectedAtom1) {
                          setSelectedAtom1(atom.symbol)
                        } else if (!selectedAtom2 && selectedAtom1 !== atom.symbol) {
                          setSelectedAtom2(atom.symbol)
                        }
                      }}
                    >
                      <div className="text-center">
                        <div
                          className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: atom.color }}
                        >
                          {atom.symbol}
                        </div>
                        <div className="text-xs font-medium">{atom.name}</div>
                        <div className="text-xs text-gray-500">#{atom.atomicNumber}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bond Types Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Bond Types Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-1">Ionic Bonds</h4>
                    <p className="text-xs text-red-700">
                      Form between metals and non-metals. Electrons are transferred. High electronegativity difference
                      (&gt;1.7).
                    </p>
                    <p className="text-xs text-red-600 mt-1">Example: Na + Cl → NaCl</p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-1">Covalent Bonds</h4>
                    <p className="text-xs text-blue-700">
                      Form between non-metals. Electrons are shared. Lower electronegativity difference (&lt;1.7).
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Example: H + H → H₂</p>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-1">Metallic Bonds</h4>
                    <p className="text-xs text-yellow-700">
                      Form between metals. Electrons form a "sea" around metal cations.
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">Example: Metal lattices</p>
                  </div>
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
                <CardDescription>Ask questions about atomic bonding and electron behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 mb-4">
                  <div className="space-y-3">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] p-3 rounded-lg text-sm ${
                            message.role === "user"
                              ? "bg-indigo-500 text-white rounded-br-none"
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
                            <div className="animate-spin h-3 w-3 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                            AI is thinking...
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about bonds, electrons, atoms..."
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
                      setCurrentMessage("What are chemical bonds?")
                      setTimeout(() => sendChatMessage(), 100)
                    }}
                    className="text-xs"
                  >
                    What are bonds?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage("How do electrons behave in bonds?")
                      setTimeout(() => sendChatMessage(), 100)
                    }}
                    className="text-xs"
                  >
                    Electron behavior?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage("What is electronegativity?")
                      setTimeout(() => sendChatMessage(), 100)
                    }}
                    className="text-xs"
                  >
                    Electronegativity?
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Bonding Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bonds Created:</span>
                    <span>{completedBonds.length}</span>
                  </div>
                  <div className="space-y-1">
                    {completedBonds.map((bond, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{bond}</span>
                      </div>
                    ))}
                  </div>
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
                    <span>Understand different types of chemical bonds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Predict bonding based on electronegativity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Visualize electron behavior in bonds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Connect atomic properties to bonding</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Real-World Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Real-World Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800">Ionic Bonds</h4>
                    <p className="text-gray-600">Table salt, ceramics, cement production in Kenya</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Covalent Bonds</h4>
                    <p className="text-gray-600">Water, plastics, pharmaceuticals, organic compounds</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Metallic Bonds</h4>
                    <p className="text-gray-600">Copper wiring, steel construction, aluminum cookware</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievement Badge */}
        {completedBonds.length >= 5 && (
          <Card className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-indigo-800 mb-2">🎉 Bonding Expert!</h3>
                <p className="text-indigo-700">
                  Congratulations! You've successfully created {completedBonds.length} different chemical bonds and
                  understand the principles of atomic bonding!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
