"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

export default function SodiumBuilderPage() {
  const [atomState, setAtomState] = useState<AtomState>({
    protons: [],
    neutrons: [],
    electrons: [],
    currentStep: 1,
    isComplete: false,
    feedback:
      "Welcome to the Sodium Lab! Sodium is a highly reactive metal. Let's discover why by building its atomic structure.",
  })

  const [draggedParticle, setDraggedParticle] = useState<string | null>(null)
  const [showReactivityDemo, setShowReactivityDemo] = useState(false)
  const [progress, setProgress] = useState(0)

  // Sodium atom specifications
  const sodiumSpecs = {
    atomicNumber: 11,
    massNumber: 23,
    protons: 11,
    neutrons: 12,
    electrons: 11,
    electronConfig: [2, 8, 1], // Shell 1: 2, Shell 2: 8, Shell 3: 1
  }

  const steps = [
    {
      step: 1,
      title: "Build the Nucleus - Add Protons",
      description: "Drag 11 red protons to the nucleus. Sodium is element #11 on the periodic table!",
      target: "protons",
      required: 11,
    },
    {
      step: 2,
      title: "Complete the Nucleus - Add Neutrons",
      description: "Add 12 gray neutrons to the nucleus. This gives sodium a mass number of 23.",
      target: "neutrons",
      required: 12,
    },
    {
      step: 3,
      title: "First Electron Shell (K Shell)",
      description: "Add 2 electrons to the innermost shell. This shell is now full!",
      target: "electrons-shell1",
      required: 2,
    },
    {
      step: 4,
      title: "Second Electron Shell (L Shell)",
      description: "Add 8 electrons to the second shell. This shell is also full!",
      target: "electrons-shell2",
      required: 8,
    },
    {
      step: 5,
      title: "Third Electron Shell (M Shell) - The Key to Reactivity!",
      description: "Add just 1 electron to the outermost shell. This single electron makes sodium EXTREMELY reactive!",
      target: "electrons-shell3",
      required: 1,
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
            ? "🎉 Perfect! 11 protons make this sodium (Na). The nucleus has a +11 charge now!"
            : `Great! ${updated.protons.length}/11 protons added. Sodium is element #11!`
          break
        case "neutrons":
          stepComplete = updated.neutrons.length === currentStepData.required
          feedback = stepComplete
            ? "🎉 Nucleus complete! 11 protons + 12 neutrons = mass number 23. Now for the electrons!"
            : `Excellent! ${updated.neutrons.length}/12 neutrons added. Building mass in the nucleus!`
          break
        case "electrons-shell1":
          const shell1Electrons = updated.electrons.filter((e) => e.shell === 1).length
          stepComplete = shell1Electrons === currentStepData.required
          feedback = stepComplete
            ? "🎉 First shell complete! 2 electrons maximum reached. This shell is now stable and full."
            : `Good! ${shell1Electrons}/2 electrons in first shell. Fill it up!`
          break
        case "electrons-shell2":
          const shell2Electrons = updated.electrons.filter((e) => e.shell === 2).length
          stepComplete = shell2Electrons === currentStepData.required
          feedback = stepComplete
            ? "🎉 Second shell complete! 8 electrons maximum reached. Now comes the interesting part..."
            : `Excellent! ${shell2Electrons}/8 electrons in second shell. Keep going!`
          break
        case "electrons-shell3":
          const shell3Electrons = updated.electrons.filter((e) => e.shell === 3).length
          stepComplete = shell3Electrons === currentStepData.required
          feedback = stepComplete
            ? "🎉 SODIUM ATOM COMPLETE! That single outer electron is the key to sodium's explosive reactivity! It desperately wants to lose this electron to become stable."
            : `Almost there! ${shell3Electrons}/1 electron in third shell. This lonely electron makes sodium reactive!`
          break
      }

      if (stepComplete && prev.currentStep < steps.length) {
        updated.currentStep = prev.currentStep + 1
      }

      if (prev.currentStep === steps.length && stepComplete) {
        updated.isComplete = true
        setShowReactivityDemo(true)
      }

      updated.feedback = feedback
      return updated
    })

    setDraggedParticle(null)
  }

  useEffect(() => {
    const totalParticles = atomState.protons.length + atomState.neutrons.length + atomState.electrons.length
    const maxParticles = sodiumSpecs.protons + sodiumSpecs.neutrons + sodiumSpecs.electrons
    setProgress((totalParticles / maxParticles) * 100)
  }, [atomState])

  const resetAtom = () => {
    setAtomState({
      protons: [],
      neutrons: [],
      electrons: [],
      currentStep: 1,
      isComplete: false,
      feedback: "Let's build sodium again! Remember, it's that single outer electron that makes it so reactive.",
    })
    setProgress(0)
    setShowReactivityDemo(false)
  }

  const currentStep = steps[atomState.currentStep - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sodium Atom Builder</h1>
              <p className="text-gray-600">Discover why sodium is so reactive with just 1 outer electron</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Badge variant="outline" className="bg-orange-50">
              Grade 9 • Integrated Science
            </Badge>
            <Badge variant="outline" className="bg-red-50">
              Reactive Metal
            </Badge>
            <Badge variant="outline" className="bg-yellow-50">
              Alkali Metal Group
            </Badge>
          </div>

          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Reactivity Alert */}
        {showReactivityDemo && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <span className="text-xl">⚠️</span>
            <AlertDescription className="text-red-800">
              <strong>DANGER!</strong> Sodium is so reactive it explodes when it touches water! That single outer
              electron is desperate to escape, making sodium one of the most reactive metals on Earth.
            </AlertDescription>
          </Alert>
        )}

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
                    {Array.from({ length: 11 }).map((_, i) => (
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
                  <p className="text-xs text-gray-600">11 protons make this sodium (element #11)</p>
                </div>

                {/* Neutrons */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Neutrons (Neutral)</h4>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 12 }).map((_, i) => (
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
                  <p className="text-xs text-gray-600">12 neutrons give mass number 23</p>
                </div>

                {/* Electrons */}
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-700">Electrons (Negative -)</h4>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 11 }).map((_, i) => (
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
                  <p className="text-xs text-gray-600">11 electrons (2,8,1 arrangement)</p>
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
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">{atomState.feedback}</p>
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
                    <span className="text-lg">⚡</span>
                    Sodium Atom (Na) - Highly Reactive!
                  </span>
                  <Button onClick={resetAtom} variant="outline" size="sm">
                    Reset Atom
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-dashed border-orange-300 overflow-hidden">
                  {/* Nucleus Drop Zone */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-100 border-2 border-yellow-400 rounded-full flex items-center justify-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop("nucleus")}
                  >
                    <div className="text-center">
                      <div className="text-xs font-bold text-yellow-700">NUCLEUS</div>
                      <div className="text-xs text-yellow-600">
                        P: {atomState.protons.length}/11
                        <br />
                        N: {atomState.neutrons.length}/12
                      </div>
                    </div>

                    {/* Render protons and neutrons in nucleus */}
                    {atomState.protons.map((proton) => (
                      <div
                        key={proton.id}
                        className="absolute w-3 h-3 bg-red-500 rounded-full"
                        style={{
                          left: `${20 + (proton.x % 60)}%`,
                          top: `${20 + (proton.y % 60)}%`,
                        }}
                      />
                    ))}
                    {atomState.neutrons.map((neutron) => (
                      <div
                        key={neutron.id}
                        className="absolute w-3 h-3 bg-gray-500 rounded-full"
                        style={{
                          left: `${20 + (neutron.x % 60)}%`,
                          top: `${20 + (neutron.y % 60)}%`,
                        }}
                      />
                    ))}
                  </div>

                  {/* First Electron Shell (K Shell) */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-blue-300 rounded-full"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop("shell1")}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      K Shell (Max: 2e⁻) • {atomState.electrons.filter((e) => e.shell === 1).length}/2
                    </div>

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

                  {/* Second Electron Shell (L Shell) */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-green-300 rounded-full"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop("shell2")}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                      L Shell (Max: 8e⁻) • {atomState.electrons.filter((e) => e.shell === 2).length}/8
                    </div>

                    {atomState.electrons
                      .filter((e) => e.shell === 2)
                      .map((electron, index) => (
                        <div
                          key={electron.id}
                          className="absolute w-3 h-3 bg-green-500 rounded-full animate-pulse"
                          style={{
                            left: `${50 + 40 * Math.cos((index * Math.PI) / 4)}%`,
                            top: `${50 + 40 * Math.sin((index * Math.PI) / 4)}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      ))}
                  </div>

                  {/* Third Electron Shell (M Shell) - The Reactive Shell! */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-red-400 rounded-full"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop("shell3")}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                      M Shell (Valence) • {atomState.electrons.filter((e) => e.shell === 3).length}/1 - REACTIVE!
                    </div>

                    {atomState.electrons
                      .filter((e) => e.shell === 3)
                      .map((electron) => (
                        <div
                          key={electron.id}
                          className="absolute w-4 h-4 bg-red-500 rounded-full animate-bounce border-2 border-red-300"
                          style={{
                            left: "50%",
                            top: "10%",
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
                  <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {atomState.electrons.filter((e) => e.shell === 3).length}
                    </div>
                    <div className="text-xs text-orange-700">Valence e⁻</div>
                  </div>
                </div>

                {/* Completion Message */}
                {atomState.isComplete && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">⚡</span>
                      <h3 className="font-bold text-red-800">Sodium Atom Complete - Extremely Reactive!</h3>
                    </div>
                    <p className="text-red-700 text-sm mb-3">
                      That single electron in the outer shell makes sodium desperately want to lose it! When sodium
                      touches water, it violently gives up this electron, causing an explosive reaction. This is why
                      sodium is stored under oil to prevent contact with moisture in the air!
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setShowReactivityDemo(!showReactivityDemo)}>
                        {showReactivityDemo ? "Hide" : "Show"} Reactivity Demo
                      </Button>
                      <Button size="sm" variant="outline">
                        Compare with Chlorine
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reactivity Explanation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              Why Sodium is So Reactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="reactivity" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="reactivity">Reactivity</TabsTrigger>
                <TabsTrigger value="electron-config">Electron Config</TabsTrigger>
                <TabsTrigger value="reactions">Reactions</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
              </TabsList>

              <TabsContent value="reactivity" className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">The Lonely Electron Problem</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Sodium has just 1 electron in its outermost shell. This electron is far from the nucleus and weakly
                    held. Sodium "wants" to lose this electron to achieve a stable, full outer shell like neon.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-medium text-red-800">Before Reaction:</h5>
                      <p className="text-xs text-red-600">Na: 2,8,1 (unstable - 1 outer electron)</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-medium text-green-800">After Reaction:</h5>
                      <p className="text-xs text-green-600">Na⁺: 2,8 (stable - like neon!)</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="electron-config" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Shell 1 (K Shell)</h4>
                    <p className="text-sm text-blue-700 mb-2">2 electrons - FULL and stable</p>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Shell 2 (L Shell)</h4>
                    <p className="text-sm text-green-700 mb-2">8 electrons - FULL and stable</p>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Shell 3 (M Shell)</h4>
                    <p className="text-sm text-red-700 mb-2">1 electron - UNSTABLE!</p>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "12.5%" }}></div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reactions" className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">🌊 Sodium + Water = EXPLOSION!</h4>
                    <p className="text-sm text-orange-700 mb-2">
                      2Na + 2H₂O → 2NaOH + H₂ + ENERGY (heat, light, sound)
                    </p>
                    <p className="text-xs text-orange-600">
                      The reaction is so violent that the hydrogen gas produced often ignites!
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">🧂 Sodium + Chlorine = Table Salt</h4>
                    <p className="text-sm text-purple-700 mb-2">Na + Cl → NaCl (sodium chloride)</p>
                    <p className="text-xs text-purple-600">
                      Sodium gives its electron to chlorine, both become stable ions!
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">💨 Sodium + Air = Tarnishing</h4>
                    <p className="text-sm text-yellow-700 mb-2">4Na + O₂ → 2Na₂O (sodium oxide)</p>
                    <p className="text-xs text-yellow-600">Sodium reacts with oxygen in air, forming a dull coating.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="safety" className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-3">⚠️ EXTREME DANGER - Never Handle Pure Sodium!</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600">🔥</span>
                      <p className="text-sm text-red-700">
                        <strong>Fire Hazard:</strong> Ignites spontaneously in air and water
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600">💧</span>
                      <p className="text-sm text-red-700">
                        <strong>Water Reaction:</strong> Explosive reaction with any moisture
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600">🧪</span>
                      <p className="text-sm text-red-700">
                        <strong>Storage:</strong> Must be stored under oil to prevent air/water contact
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600">👨‍🔬</span>
                      <p className="text-sm text-red-700">
                        <strong>Handling:</strong> Only trained chemists with proper equipment
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Safe Sodium Compounds</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Table salt (NaCl) - completely safe to eat</li>
                    <li>• Baking soda (NaHCO₃) - safe for cooking</li>
                    <li>• Soap (sodium stearate) - safe for washing</li>
                    <li>• These compounds have sodium ions (Na⁺), not pure sodium metal</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
