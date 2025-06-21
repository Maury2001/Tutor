"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, BookOpen, Layers, FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

// Learning area colors
const areaColors: Record<string, string> = {
  Mathematics: "from-blue-500 to-cyan-400",
  English: "from-purple-500 to-pink-400",
  Kiswahili: "from-green-500 to-emerald-400",
  "Science and Technology": "from-orange-500 to-amber-400",
  "Social Studies": "from-indigo-500 to-blue-400",
  "Creative Arts": "from-pink-500 to-rose-400",
  "Physical and Health Education": "from-emerald-500 to-green-400",
  "Religious Education": "from-violet-500 to-purple-400",
  Agriculture: "from-lime-500 to-green-400",
  "Home Science": "from-amber-500 to-yellow-400",
  "Pre-Primary Activities": "from-cyan-500 to-sky-400",
}

// Types for our curriculum data
interface SubStrand {
  id: string
  name: string
  description?: string
}

interface Strand {
  id: string
  name: string
  subStrands: SubStrand[]
  expanded?: boolean
}

interface LearningArea {
  id: string
  name: string
  description?: string
  strands: Strand[]
  expanded?: boolean
}

export function CurriculumCard() {
  // Sample CBC curriculum data - this would typically come from an API
  const [learningAreas, setLearningAreas] = useState<LearningArea[]>([
    {
      id: "math",
      name: "Mathematics",
      description: "Develop mathematical thinking and problem-solving skills",
      expanded: false,
      strands: [
        {
          id: "math-1",
          name: "Numbers",
          expanded: false,
          subStrands: [
            { id: "math-1-1", name: "Whole Numbers" },
            { id: "math-1-2", name: "Fractions" },
            { id: "math-1-3", name: "Decimals" },
          ],
        },
        {
          id: "math-2",
          name: "Measurement",
          expanded: false,
          subStrands: [
            { id: "math-2-1", name: "Length" },
            { id: "math-2-2", name: "Mass" },
            { id: "math-2-3", name: "Capacity" },
          ],
        },
        {
          id: "math-3",
          name: "Geometry",
          expanded: false,
          subStrands: [
            { id: "math-3-1", name: "2D Shapes" },
            { id: "math-3-2", name: "3D Shapes" },
            { id: "math-3-3", name: "Position and Direction" },
          ],
        },
      ],
    },
    {
      id: "eng",
      name: "English",
      description: "Develop language skills in listening, speaking, reading and writing",
      expanded: false,
      strands: [
        {
          id: "eng-1",
          name: "Listening and Speaking",
          expanded: false,
          subStrands: [
            { id: "eng-1-1", name: "Pronunciation" },
            { id: "eng-1-2", name: "Vocabulary" },
            { id: "eng-1-3", name: "Comprehension" },
          ],
        },
        {
          id: "eng-2",
          name: "Reading",
          expanded: false,
          subStrands: [
            { id: "eng-2-1", name: "Phonics" },
            { id: "eng-2-2", name: "Fluency" },
            { id: "eng-2-3", name: "Comprehension" },
          ],
        },
        {
          id: "eng-3",
          name: "Writing",
          expanded: false,
          subStrands: [
            { id: "eng-3-1", name: "Handwriting" },
            { id: "eng-3-2", name: "Grammar" },
            { id: "eng-3-3", name: "Creative Writing" },
          ],
        },
      ],
    },
    {
      id: "kis",
      name: "Kiswahili",
      description: "Kukuza stadi za lugha katika kusikiliza, kuzungumza, kusoma na kuandika",
      expanded: false,
      strands: [
        {
          id: "kis-1",
          name: "Kusikiliza na Kuzungumza",
          expanded: false,
          subStrands: [
            { id: "kis-1-1", name: "Matamshi" },
            { id: "kis-1-2", name: "Msamiati" },
            { id: "kis-1-3", name: "Ufahamu" },
          ],
        },
        {
          id: "kis-2",
          name: "Kusoma",
          expanded: false,
          subStrands: [
            { id: "kis-2-1", name: "Silabi" },
            { id: "kis-2-2", name: "Ufasaha" },
            { id: "kis-2-3", name: "Ufahamu" },
          ],
        },
        {
          id: "kis-3",
          name: "Kuandika",
          expanded: false,
          subStrands: [
            { id: "kis-3-1", name: "Mwandiko" },
            { id: "kis-3-2", name: "Sarufi" },
            { id: "kis-3-3", name: "Insha" },
          ],
        },
      ],
    },
    {
      id: "sci",
      name: "Science and Technology",
      description: "Develop scientific thinking and technological skills",
      expanded: false,
      strands: [
        {
          id: "sci-1",
          name: "Living Things",
          expanded: false,
          subStrands: [
            { id: "sci-1-1", name: "Human Body" },
            { id: "sci-1-2", name: "Plants" },
            { id: "sci-1-3", name: "Animals" },
          ],
        },
        {
          id: "sci-2",
          name: "Environment",
          expanded: false,
          subStrands: [
            { id: "sci-2-1", name: "Weather" },
            { id: "sci-2-2", name: "Conservation" },
            { id: "sci-2-3", name: "Pollution" },
          ],
        },
        {
          id: "sci-3",
          name: "Digital Technology",
          expanded: false,
          subStrands: [
            { id: "sci-3-1", name: "Digital Devices" },
            { id: "sci-3-2", name: "Coding Basics" },
            { id: "sci-3-3", name: "Digital Citizenship" },
          ],
        },
      ],
    },
    {
      id: "soc",
      name: "Social Studies",
      description: "Develop understanding of society, history and geography",
      expanded: false,
      strands: [
        {
          id: "soc-1",
          name: "The Family",
          expanded: false,
          subStrands: [
            { id: "soc-1-1", name: "Family Members" },
            { id: "soc-1-2", name: "Family Values" },
            { id: "soc-1-3", name: "Family History" },
          ],
        },
        {
          id: "soc-2",
          name: "Our Country Kenya",
          expanded: false,
          subStrands: [
            { id: "soc-2-1", name: "Symbols of National Unity" },
            { id: "soc-2-2", name: "Counties of Kenya" },
            { id: "soc-2-3", name: "Cultural Diversity" },
          ],
        },
        {
          id: "soc-3",
          name: "Citizenship",
          expanded: false,
          subStrands: [
            { id: "soc-3-1", name: "Rights and Responsibilities" },
            { id: "soc-3-2", name: "Leadership" },
            { id: "soc-3-3", name: "National Values" },
          ],
        },
      ],
    },
  ])

  // Toggle expansion of learning areas
  const toggleLearningArea = (areaId: string) => {
    setLearningAreas((areas) =>
      areas.map((area) => (area.id === areaId ? { ...area, expanded: !area.expanded } : area)),
    )
  }

  // Toggle expansion of strands
  const toggleStrand = (areaId: string, strandId: string) => {
    setLearningAreas((areas) =>
      areas.map((area) =>
        area.id === areaId
          ? {
              ...area,
              strands: area.strands.map((strand) =>
                strand.id === strandId ? { ...strand, expanded: !strand.expanded } : strand,
              ),
            }
          : area,
      ),
    )
  }

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-emerald-500">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-emerald-800">Kenya CBC Curriculum</CardTitle>
            <CardDescription className="text-emerald-700">All Learning Areas • PP1-PP2 • Grades 1-9</CardDescription>
          </div>
          <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <span className="mr-1">🇰🇪</span> KICD Aligned
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-[500px] overflow-y-auto p-4">
        <div className="space-y-4">
          {learningAreas.map((area) => (
            <div key={area.id} className="border rounded-lg overflow-hidden">
              <div
                className={`flex items-center justify-between p-3 cursor-pointer bg-gradient-to-r ${areaColors[area.name] || "from-gray-500 to-gray-400"}`}
                onClick={() => toggleLearningArea(area.id)}
              >
                <div className="flex items-center text-white">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span className="font-medium">{area.name}</span>
                </div>
                <div className="text-white">
                  {area.expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </div>
              </div>

              {area.expanded && (
                <div className="p-3 bg-white">
                  <div className="text-sm text-gray-600 mb-3">{area.description}</div>
                  <div className="space-y-2">
                    {area.strands.map((strand) => (
                      <div key={strand.id} className="border rounded">
                        <div
                          className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleStrand(area.id, strand.id)}
                        >
                          <div className="flex items-center">
                            <Layers className="h-4 w-4 mr-2 text-gray-600" />
                            <span className="font-medium text-gray-800">{strand.name}</span>
                          </div>
                          <div>
                            {strand.expanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </div>

                        {strand.expanded && (
                          <div className="p-2 pl-8 bg-gray-50 border-t">
                            <ul className="space-y-1">
                              {strand.subStrands.map((subStrand) => (
                                <li key={subStrand.id} className="flex items-center">
                                  <FileText className="h-3 w-3 mr-2 text-gray-500" />
                                  <span className="text-sm text-gray-700">{subStrand.name}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 text-xs text-gray-500 justify-between">
        <div>Kenya Competency-Based Curriculum (CBC) • 2024</div>
        <div>Aligned with KICD Standards</div>
      </CardFooter>
    </Card>
  )
}
