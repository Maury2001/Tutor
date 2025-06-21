"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Particle {
  id: string
  type: "proton" | "neutron" | "electron"
  x: number
  y: number
  shell?: number
}

interface AtomState {
  protons: Particle[]
  neutrons: Particle[]
  electrons: Particle[]
  currentStep: number
  isComplete: boolean
  feedback: string
}

export default function CarbonBuilderPage() {
  const [atomState, setAtomState] = useState<AtomState>({
    protons: [],
    neutrons: [],
    electrons: [],
    currentStep: 1,
    isComplete: false,
    feedback: "Welcome! Let's build a Carbon atom step by step. Carbon has 6 protons, 6 neutrons, and 6 electrons.",
  })

  const [draggedParticle, setDraggedParticle] = useState<string | null>(null)
  const [showHints, setShowHints] = useState(true)
  const [progress, setProgress] = useState(0)

  // Carbon atom specifications
  const carbonSpecs = {
    atomicNumber: 6,
    massNumber: 12,
    protons: 6,
    neutrons: 6,
    electrons: 6,
    electronConfig: [2, 4], // First shell: 2, Second shell: 4
  }

  const steps = [
    {
      step: 1,
      title: "Build the Nucleus - Add Protons",
      description: "Drag 6 red protons to the nucleus. Protons determine what element this is!",
      target: "protons",
      required: 6,
    },
    {
      step: 2,
      title: "Complete the Nucleus - Add Neutrons",
      description: "Add 6 gray neutrons to the nucleus. Neutrons add mass but don't change the element.",
      target: "neutrons",
      required: 6,
    },
    {
      step: 3,
      title: "First Electron Shell",
      description: "Add 2 blue electrons to the first shell (closest to nucleus). Maximum capacity: 2 electrons.",
      target: "electrons-shell1",
      required: 2,
    },
    {
      step: 4,
      title: "Second Electron Shell",
      description: "Add 4 electrons to the second shell. This gives carbon its unique bonding properties!",
      target: "electrons-shell2",
      required: 4,
    },
  ]

  const handleDragStart = (particleType: string) => {
    setDraggedParticle(particleType)
  }

  const handleDrop = (zone: string) => {
    if (!draggedParticle) return

    const newParticle: Particle = {
      id: `${draggedParticle}-${Date.now()}`,
      type: draggedParticle as "proton" | "neutron" | "electron",
      x: Math.random() * 100,
      y: Math.random() * 100,
      shell: zone.includes("shell") ? Number.parseInt(zone.slice(-1)) : undefined,
    }

    setAtomState((prev) => {
      const updated = { ...prev }

      if (draggedParticle === "proton") {
        updated.protons = [...prev.protons, newParticle]
      } else if (draggedParticle === "neutron") {
        updated.neutrons = [...prev.neutrons, newParticle]
      } else if (draggedParticle === "electron") {
        updated.electrons = [...prev.electrons, newParticle]
      }

      // Check step completion and provide feedback
      const currentStepData = steps[prev.currentStep - 1]
      let stepComplete = false
      let feedback = ""

      switch (currentStepData.target) {
        case "protons":
          stepComplete = updated.protons.length === currentStepData.required
          feedback = stepComplete
            ? "🎉 Excellent! You've added all 6 protons. The nucleus now has a +6 charge. Ready for neutrons?"
            : `Good! ${updated.protons.length}/6 protons added. Keep going!`
          break
        case "neutrons":
          stepComplete = updated.neutrons.length === currentStepData.required
          feedback = stepComplete
            ? "🎉 Perfect! Nucleus complete with 6 protons and 6 neutrons. Mass number = 12. Now for electrons!"
            : `Great! ${updated.neutrons.length}/6 neutrons added. The nucleus is getting heavier!`
          break
        case "electrons-shell1":
          const shell1Electrons = updated.electrons.filter((e) => e.shell === 1).length
          stepComplete = shell1Electrons === currentStepData.required
          feedback = stepComplete
            ? "🎉 First shell complete! 2 electrons maximum reached. Notice how they orbit close to the nucleus."
            : `Good! ${shell1Electrons}/2 electrons in first shell. Remember: maximum 2 electrons in first shell!`
          break
        case "electrons-shell2":
          const shell2Electrons = updated.electrons.filter((e) => e.shell === 2).length
          stepComplete = shell2Electrons === currentStepData.required
          feedback = stepComplete
            ? "🎉 CARBON ATOM COMPLETE! 4 outer electrons make carbon perfect for forming 4 bonds. This is why carbon is the basis of all life!"
            : `Excellent! ${shell2Electrons}/4 electrons in second shell. Carbon's 4 outer electrons are key to its bonding!`
          break
      }

      if (stepComplete && prev.currentStep < steps.length) {
        updated.currentStep = prev.currentStep + 1
      }

      if (prev.currentStep === steps.length && stepComplete) {
        updated.isComplete = true
      }

      updated.feedback = feedback
      return updated
    })

    setDraggedParticle(null)
  }

  useEffect(() => {
    const totalParticles = atomState.protons.length + atomState.neutrons.length + atomState.electrons.length
    const maxParticles = carbonSpecs.protons + carbonSpecs.neutrons + carbonSpecs.electrons
    setProgress((totalParticles / maxParticles) * 100)
  }, [atomState])

  const resetAtom = () => {
    setAtomState({
      protons: [],
      neutrons: [],
      electrons: [],
      currentStep: 1,
      isComplete: false,
      feedback: "Let's start over! Building a Carbon atom step by step.",
    })
    setProgress(0)
  }

  const currentStep = steps[atomState.currentStep - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚛️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Carbon Atom Builder</h1>
              <p className="text-gray-600">Build a Carbon atom with multiple electron shells</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Badge variant="outline" className="bg-blue-50">
              Grade 9 • Integrated Science
            </Badge>
            <Badge variant="outline" className="bg-green-50">
              Atomic Structure
            </Badge>
            <Badge variant="outline" className="bg-purple-50">
              Interactive Lab
            </Badge>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Particle Palette */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-lg">🧪</span>
                  Particle Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Protons */}
                <div className="space-y-2">
                  <h4 className="font-medium text-red-700">Protons (Positive +)</h4>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={`proton-${i}`}
                        draggable
                        onDragStart={() => handleDragStart("proton")}
                        className="w-8 h-8 bg-red-500 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center text-white text-xs font-bold hover:bg-red-600 transition-colors"
                      >
                        P
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">Drag to nucleus • Determines element identity</p>
                </div>

                {/* Neutrons */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Neutrons (Neutral)</h4>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={`neutron-${i}`}
                        draggable
                        onDragStart={() => handleDragStart("neutron")}
                        className="w-8 h-8 bg-gray-500 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center text-white text-xs font-bold hover:bg-gray-600 transition-colors"
                      >
                        N
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">Drag to nucleus • Adds mass to atom</p>
                </div>

                {/* Electrons */}
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-700">Electrons (Negative -)</h4>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={`electron-${i}`}
                        draggable
                        onDragStart={() => handleDragStart("electron")}
                        className="w-8 h-8 bg-blue-500 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center text-white text-xs font-bold hover:bg-blue-600 transition-colors"
                      >
                        e
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">Drag to electron shells • Create electron arrangement</p>
                </div>
              </CardContent>
            </Card>

            {/* Current Step Instructions */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  Step {atomState.currentStep} of {steps.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium mb-2">{currentStep?.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{currentStep?.description}</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">{atomState.feedback}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Atom Visualization */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">⚛️</span>
                    Carbon Atom (C)
                  </span>
                  <Button onClick={resetAtom} variant="outline" size="sm">
                    Reset Atom
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                  {/* Nucleus Drop Zone */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-100 border-2 border-yellow-400 rounded-full flex items-center justify-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop("nucleus")}
                  >
                    <div className="text-center">
                      <div className="text-xs font-bold text-yellow-700">NUCLEUS</div>
                      <div className="text-xs text-yellow-600">
                        P: {atomState.protons.length}/6
                        <br />
                        N: {atomState.neutrons.length}/6
                      </div>
                    </div>

                    {/* Render protons and neutrons in nucleus */}
                    {atomState.protons.map((proton) => (
                      <div
                        key={proton.id}
                        className="absolute w-4 h-4 bg-red-500 rounded-full"
                        style={{
                          left: `${20 + (proton.x % 60)}%`,
                          top: `${20 + (proton.y % 60)}%`,
                        }}
                      />
                    ))}
                    {atomState.neutrons.map((neutron) => (
                      <div
                        key={neutron.id}
                        className="absolute w-4 h-4 bg-gray-500 rounded-full"
                        style={{
                          left: `${20 + (neutron.x % 60)}%`,
                          top: `${20 + (neutron.y % 60)}%`,
                        }}
                      />
                    ))}
                  </div>

                  {/* First Electron Shell */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-blue-300 rounded-full flex items-center justify-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop("shell1")}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Shell 1 (Max: 2e⁻) • {atomState.electrons.filter((e) => e.shell === 1).length}/2
                    </div>

                    {/* Render first shell electrons */}
                    {atomState.electrons
                      .filter((e) => e.shell === 1)
                      .map((electron, index) => (
                        <div
                          key={electron.id}
                          className="absolute w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                          style={{
                            left: `${50 + 30 * Math.cos(index * Math.PI)}%`,
                            top: `${50 + 30 * Math.sin(index * Math.PI)}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      ))}
                  </div>

                  {/* Second Electron Shell */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-green-300 rounded-full flex items-center justify-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop("shell2")}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                      Shell 2 (Max: 8e⁻) • {atomState.electrons.filter((e) => e.shell === 2).length}/4
                    </div>

                    {/* Render second shell electrons */}
                    {atomState.electrons
                      .filter((e) => e.shell === 2)
                      .map((electron, index) => (
                        <div
                          key={electron.id}
                          className="absolute w-3 h-3 bg-green-500 rounded-full animate-pulse"
                          style={{
                            left: `${50 + 40 * Math.cos((index * Math.PI) / 2)}%`,
                            top: `${50 + 40 * Math.sin((index * Math.PI) / 2)}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      ))}
                  </div>
                </div>

                {/* Atom Information */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{atomState.protons.length}</div>
                    <div className="text-xs text-red-700">Protons</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-600">{atomState.neutrons.length}</div>
                    <div className="text-xs text-gray-700">Neutrons</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{atomState.electrons.length}</div>
                    <div className="text-xs text-blue-700">Electrons</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {atomState.protons.length + atomState.neutrons.length}
                    </div>
                    <div className="text-xs text-purple-700">Mass Number</div>
                  </div>
                </div>

                {/* Completion Message */}
                {atomState.isComplete && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎉</span>
                      <h3 className="font-bold text-green-800">Carbon Atom Complete!</h3>
                    </div>
                    <p className="text-green-700 text-sm mb-3">
                      You've successfully built a Carbon atom! Notice how the 4 outer electrons make carbon perfect for
                      forming bonds with other atoms. This is why carbon is the foundation of all organic molecules and
                      life itself!
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => (window.location.href = "/virtual-lab/atomic-structure")}>
                        Build Another Atom
                      </Button>
                      <Button size="sm" variant="outline">
                        Learn About Carbon Compounds
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Learning Insights */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              Carbon Atom Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="structure" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="bonding">Bonding</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="quiz">Quick Quiz</TabsTrigger>
              </TabsList>

              <TabsContent value="structure" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Why 6 Protons?</h4>
                    <p className="text-sm text-blue-700">
                      The number of protons (6) defines carbon as element #6 on the periodic table. This never changes -
                      if you add or remove protons, you get a different element!
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Electron Shells</h4>
                    <p className="text-sm text-green-700">
                      Electrons fill shells in order: first shell holds maximum 2, second shell holds maximum 8.
                      Carbon's arrangement (2,4) gives it unique properties.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bonding" className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">The Magic of 4 Outer Electrons</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Carbon's 4 outer electrons allow it to form 4 bonds with other atoms. This makes carbon incredibly
                    versatile - it can bond with other carbons to form chains, rings, and complex 3D structures.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded">
                      <strong>Single Bonds:</strong> C-H (methane)
                    </div>
                    <div className="bg-white p-2 rounded">
                      <strong>Double Bonds:</strong> C=C (ethene)
                    </div>
                    <div className="bg-white p-2 rounded">
                      <strong>Triple Bonds:</strong> C≡C (ethyne)
                    </div>
                    <div className="bg-white p-2 rounded">
                      <strong>Ring Structures:</strong> Benzene
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="applications" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">🧬 Life Sciences</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• DNA and RNA structure</li>
                      <li>• Proteins and enzymes</li>
                      <li>• Carbohydrates and fats</li>
                      <li>• All organic molecules</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">🏭 Industry</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Plastics and polymers</li>
                      <li>• Fuels and energy</li>
                      <li>• Pharmaceuticals</li>
                      <li>• Carbon fiber materials</li>
                    </ul>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-800 mb-2">💎 Materials</h4>
                    <ul className="text-sm text-teal-700 space-y-1">
                      <li>• Diamond (hardest material)</li>
                      <li>• Graphite (conducts electricity)</li>
                      <li>• Carbon nanotubes</li>
                      <li>• Graphene (super material)</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="quiz" className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-3">Test Your Understanding!</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm font-medium mb-2">1. Why does carbon have 6 protons?</p>
                      <p className="text-xs text-gray-600">
                        Because it's element #6 on the periodic table - the atomic number defines the element!
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm font-medium mb-2">2. How many electrons can the first shell hold?</p>
                      <p className="text-xs text-gray-600">
                        Maximum 2 electrons in the first shell (closest to nucleus).
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm font-medium mb-2">3. Why is carbon so important for life?</p>
                      <p className="text-xs text-gray-600">
                        Its 4 outer electrons allow it to form complex molecules essential for life!
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
