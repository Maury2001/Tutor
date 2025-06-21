"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Globe, Play, Pause, RotateCcw, ArrowLeft, Star, Orbit } from "lucide-react"
import Link from "next/link"
import { AILabAssistant } from "@/components/virtual-lab/ai-lab-assistant"

interface Planet {
  id: string
  name: string
  distanceFromSun: number // AU
  diameter: number // km
  mass: number // Earth masses
  temperature: number // Celsius
  dayLength: number // Earth hours
  yearLength: number // Earth days
  moons: number
  color: string
  description: string
  facts: string[]
  composition: string
}

const planets: Planet[] = [
  {
    id: "mercury",
    name: "Mercury",
    distanceFromSun: 0.39,
    diameter: 4879,
    mass: 0.055,
    temperature: 167,
    dayLength: 1408,
    yearLength: 88,
    moons: 0,
    color: "#8C7853",
    description: "The smallest planet and closest to the Sun",
    facts: [
      "Mercury has extreme temperature variations",
      "It has no atmosphere to retain heat",
      "One day on Mercury is longer than its year",
    ],
    composition: "Rocky with large iron core",
  },
  {
    id: "venus",
    name: "Venus",
    distanceFromSun: 0.72,
    diameter: 12104,
    mass: 0.815,
    temperature: 464,
    dayLength: 5832,
    yearLength: 225,
    moons: 0,
    color: "#FFC649",
    description: "The hottest planet with thick, toxic atmosphere",
    facts: [
      "Venus rotates backwards compared to most planets",
      "Its atmosphere is 96% carbon dioxide",
      "Surface pressure is 90 times that of Earth",
    ],
    composition: "Rocky with thick atmosphere",
  },
  {
    id: "earth",
    name: "Earth",
    distanceFromSun: 1.0,
    diameter: 12756,
    mass: 1.0,
    temperature: 15,
    dayLength: 24,
    yearLength: 365,
    moons: 1,
    color: "#6B93D6",
    description: "Our home planet, the only known planet with life",
    facts: [
      "71% of Earth's surface is covered by water",
      "Earth has a protective magnetic field",
      "It's the only planet known to support life",
    ],
    composition: "Rocky with water and atmosphere",
  },
  {
    id: "mars",
    name: "Mars",
    distanceFromSun: 1.52,
    diameter: 6792,
    mass: 0.107,
    temperature: -65,
    dayLength: 25,
    yearLength: 687,
    moons: 2,
    color: "#CD5C5C",
    description: "The Red Planet with polar ice caps and largest volcano",
    facts: [
      "Mars has the largest volcano in the solar system",
      "It has seasons similar to Earth",
      "Evidence suggests water once flowed on Mars",
    ],
    composition: "Rocky with thin atmosphere",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    distanceFromSun: 5.2,
    diameter: 142984,
    mass: 317.8,
    temperature: -110,
    dayLength: 10,
    yearLength: 4333,
    moons: 79,
    color: "#D8CA9D",
    description: "The largest planet, a gas giant with Great Red Spot",
    facts: [
      "Jupiter is larger than all other planets combined",
      "The Great Red Spot is a storm larger than Earth",
      "Jupiter acts as a 'cosmic vacuum cleaner'",
    ],
    composition: "Gas giant (hydrogen and helium)",
  },
  {
    id: "saturn",
    name: "Saturn",
    distanceFromSun: 9.5,
    diameter: 120536,
    mass: 95.2,
    temperature: -140,
    dayLength: 11,
    yearLength: 10759,
    moons: 82,
    color: "#FAD5A5",
    description: "Famous for its spectacular ring system",
    facts: [
      "Saturn's rings are made of ice and rock particles",
      "Saturn is less dense than water",
      "It has the most moons of any planet",
    ],
    composition: "Gas giant with prominent rings",
  },
  {
    id: "uranus",
    name: "Uranus",
    distanceFromSun: 19.2,
    diameter: 51118,
    mass: 14.5,
    temperature: -195,
    dayLength: 17,
    yearLength: 30687,
    moons: 27,
    color: "#4FD0E7",
    description: "An ice giant that rotates on its side",
    facts: [
      "Uranus rotates on its side at 98 degrees",
      "It has faint rings discovered in 1977",
      "Seasons last 21 Earth years each",
    ],
    composition: "Ice giant with methane atmosphere",
  },
  {
    id: "neptune",
    name: "Neptune",
    distanceFromSun: 30.1,
    diameter: 49528,
    mass: 17.1,
    temperature: -200,
    dayLength: 16,
    yearLength: 60190,
    moons: 14,
    color: "#4B70DD",
    description: "The windiest planet with supersonic winds",
    facts: [
      "Neptune has the fastest winds in the solar system",
      "It was discovered through mathematical predictions",
      "One year on Neptune equals 165 Earth years",
    ],
    composition: "Ice giant with dynamic atmosphere",
  },
]

export default function SolarSystemExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(planets[2]) // Start with Earth
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState([50])
  const [viewMode, setViewMode] = useState<"overview" | "planet">("overview")
  const [discoveredFacts, setDiscoveredFacts] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAnimating) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + animationSpeed[0] / 10)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isAnimating, animationSpeed])

  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(planet)
    setViewMode("planet")
  }

  const handleFactDiscovery = (fact: string) => {
    if (!discoveredFacts.includes(fact)) {
      setDiscoveredFacts([...discoveredFacts, fact])
    }
  }

  const resetAnimation = () => {
    setCurrentTime(0)
    setIsAnimating(false)
  }

  const progress = (discoveredFacts.length / planets.reduce((sum, p) => sum + p.facts.length, 0)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/virtual-lab">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-black">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lab
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Globe className="h-8 w-8 text-blue-400" />
                Solar System Explorer
              </h1>
              <p className="text-gray-300">Journey through our cosmic neighborhood</p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800">Grade 4-12</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main View */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Controls */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Orbit className="h-5 w-5" />
                    Solar System View
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "overview" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("overview")}
                      className="text-white"
                    >
                      Overview
                    </Button>
                    <Button
                      variant={viewMode === "planet" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("planet")}
                      className="text-white"
                    >
                      Planet Focus
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Animation Controls */}
                  <div className="flex items-center gap-4">
                    <Button onClick={() => setIsAnimating(!isAnimating)} className="flex items-center gap-2">
                      {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isAnimating ? "Pause" : "Start"} Animation
                    </Button>
                    <Button onClick={resetAnimation} variant="outline" className="text-white border-white">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm">Speed:</span>
                      <Slider
                        value={animationSpeed}
                        onValueChange={setAnimationSpeed}
                        min={10}
                        max={100}
                        step={10}
                        className="flex-1 max-w-32"
                      />
                    </div>
                  </div>

                  {/* Solar System Visualization */}
                  <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
                    {viewMode === "overview" ? (
                      // Overview Mode - All Planets
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* Sun */}
                        <div className="absolute w-8 h-8 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />

                        {/* Planet Orbits */}
                        {planets.map((planet, index) => {
                          const orbitRadius = 30 + index * 25
                          const angle = (currentTime * (1 / planet.yearLength) * 360) % 360
                          const x = Math.cos((angle * Math.PI) / 180) * orbitRadius
                          const y = Math.sin((angle * Math.PI) / 180) * orbitRadius

                          return (
                            <div key={planet.id}>
                              {/* Orbit Path */}
                              <div
                                className="absolute border border-gray-600 rounded-full opacity-30"
                                style={{
                                  width: orbitRadius * 2,
                                  height: orbitRadius * 2,
                                  left: "50%",
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                }}
                              />

                              {/* Planet */}
                              <div
                                className="absolute w-4 h-4 rounded-full cursor-pointer hover:scale-125 transition-transform"
                                style={{
                                  backgroundColor: planet.color,
                                  left: "50%",
                                  top: "50%",
                                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                }}
                                onClick={() => handlePlanetClick(planet)}
                                title={planet.name}
                              />
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      // Planet Focus Mode
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div
                          className="w-32 h-32 rounded-full shadow-2xl cursor-pointer"
                          style={{ backgroundColor: selectedPlanet.color }}
                          onClick={() => handleFactDiscovery(selectedPlanet.facts[0])}
                        >
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                        </div>

                        {/* Planet Info Overlay */}
                        <div className="absolute top-4 left-4 bg-black/70 p-3 rounded">
                          <h3 className="font-bold text-lg">{selectedPlanet.name}</h3>
                          <p className="text-sm text-gray-300">{selectedPlanet.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Planet Selection */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Select Planet</CardTitle>
                <CardDescription className="text-gray-300">Click on a planet to learn more about it</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {planets.map((planet) => (
                    <Button
                      key={planet.id}
                      variant={selectedPlanet.id === planet.id ? "default" : "outline"}
                      className="h-auto p-3 flex flex-col items-center gap-2 text-white border-gray-600"
                      onClick={() => handlePlanetClick(planet)}
                    >
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: planet.color }} />
                      <span className="text-xs">{planet.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Discovery Progress */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Star className="h-5 w-5" />
                  Discovery Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2 text-gray-300">
                      <span>Facts Discovered</span>
                      <span>
                        {discoveredFacts.length}/{planets.reduce((sum, p) => sum + p.facts.length, 0)}
                      </span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Planet Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="h-5 w-5" />
                  {selectedPlanet.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-300">{selectedPlanet.description}</p>

                  {/* Planet Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-700 p-2 rounded">
                      <div className="text-gray-400">Distance from Sun</div>
                      <div className="font-medium text-white">{selectedPlanet.distanceFromSun} AU</div>
                    </div>
                    <div className="bg-gray-700 p-2 rounded">
                      <div className="text-gray-400">Diameter</div>
                      <div className="font-medium text-white">{selectedPlanet.diameter.toLocaleString()} km</div>
                    </div>
                    <div className="bg-gray-700 p-2 rounded">
                      <div className="text-gray-400">Temperature</div>
                      <div className="font-medium text-white">{selectedPlanet.temperature}°C</div>
                    </div>
                    <div className="bg-gray-700 p-2 rounded">
                      <div className="text-gray-400">Moons</div>
                      <div className="font-medium text-white">{selectedPlanet.moons}</div>
                    </div>
                  </div>

                  {/* Interesting Facts */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-white">Interesting Facts:</h4>
                    <div className="space-y-2">
                      {selectedPlanet.facts.map((fact, index) => (
                        <div
                          key={index}
                          className={`text-sm p-2 rounded cursor-pointer transition-colors ${
                            discoveredFacts.includes(fact)
                              ? "bg-green-800 text-green-100"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                          onClick={() => handleFactDiscovery(fact)}
                        >
                          {fact}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <AILabAssistant
              experimentType="solar-system"
              context={{
                selectedPlanet: selectedPlanet.name,
                viewMode,
                discoveredFacts: discoveredFacts.length,
                isAnimating,
                currentPlanetData: {
                  distance: selectedPlanet.distanceFromSun,
                  temperature: selectedPlanet.temperature,
                  moons: selectedPlanet.moons,
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
