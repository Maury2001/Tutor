"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight, BookOpen, Calculator, Globe, Palette, Users, Lightbulb } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LearningObjective {
  id: string
  description: string
  activities: string[]
  practicalSimulations?: string[]
}

interface LearningOutcome {
  id: string
  description: string
  objectives: LearningObjective[]
}

interface SubStrand {
  id: string
  name: string
  description: string
  outcomes: LearningOutcome[]
}

interface Strand {
  id: string
  name: string
  description: string
  subStrands: SubStrand[]
  expanded?: boolean
}

interface LearningArea {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  strands: Strand[]
  expanded?: boolean
}

export function Grade3Curriculum() {
  const [learningAreas, setLearningAreas] = useState<LearningArea[]>([
    {
      id: "mathematics-grade3",
      name: "Mathematics",
      description: "Develop mathematical thinking and problem-solving skills for Grade 3",
      icon: <Calculator className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-400",
      expanded: false,
      strands: [
        {
          id: "numbers-grade3",
          name: "Numbers",
          description: "Understanding numbers up to 1000",
          expanded: false,
          subStrands: [
            {
              id: "whole-numbers-grade3",
              name: "Whole Numbers (1-1000)",
              description: "Reading, writing, and working with numbers up to 1000",
              outcomes: [
                {
                  id: "number-recognition-grade3",
                  description: "Read and write numbers from 1 to 1000 in numerals and words",
                  objectives: [
                    {
                      id: "count-objects-grade3",
                      description: "Count objects up to 1000 using grouping strategies",
                      activities: [
                        "Counting beans in groups of 10s and 100s",
                        "Number line activities",
                        "Place value charts",
                        "Abacus counting",
                      ],
                      practicalSimulations: [
                        "Virtual counting manipulatives",
                        "Interactive number line",
                        "Digital place value blocks",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "addition-subtraction-grade3",
              name: "Addition and Subtraction",
              description: "Adding and subtracting numbers within 1000",
              outcomes: [
                {
                  id: "basic-operations-grade3",
                  description: "Perform addition and subtraction with regrouping",
                  objectives: [
                    {
                      id: "mental-math-grade3",
                      description: "Use mental math strategies for addition and subtraction",
                      activities: [
                        "Mental math games",
                        "Story problems",
                        "Number bonds practice",
                        "Estimation activities",
                      ],
                      practicalSimulations: [
                        "Math fact fluency games",
                        "Virtual manipulative calculator",
                        "Story problem simulator",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "measurement-grade3",
          name: "Measurement",
          description: "Understanding length, mass, capacity, and time",
          expanded: false,
          subStrands: [
            {
              id: "length-grade3",
              name: "Length",
              description: "Measuring length using standard units",
              outcomes: [
                {
                  id: "length-measurement-grade3",
                  description: "Measure length using metres, centimetres, and millimetres",
                  objectives: [
                    {
                      id: "use-rulers-grade3",
                      description: "Use rulers and measuring tapes accurately",
                      activities: [
                        "Measuring classroom objects",
                        "Creating measurement charts",
                        "Comparing lengths",
                        "Estimation games",
                      ],
                      practicalSimulations: [
                        "Virtual ruler tool",
                        "Measurement comparison app",
                        "Length estimation game",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "english-grade3",
      name: "English",
      description: "Develop language skills in listening, speaking, reading and writing",
      icon: <BookOpen className="h-5 w-5" />,
      color: "from-purple-500 to-pink-400",
      expanded: false,
      strands: [
        {
          id: "reading-grade3",
          name: "Reading",
          description: "Developing fluent reading skills",
          expanded: false,
          subStrands: [
            {
              id: "phonics-grade3",
              name: "Phonics and Word Recognition",
              description: "Advanced phonics patterns and sight words",
              outcomes: [
                {
                  id: "decode-words-grade3",
                  description: "Decode multisyllabic words using phonics knowledge",
                  objectives: [
                    {
                      id: "syllable-patterns-grade3",
                      description: "Identify and use syllable patterns in reading",
                      activities: [
                        "Syllable clapping games",
                        "Word building activities",
                        "Phonics worksheets",
                        "Reading fluency practice",
                      ],
                      practicalSimulations: [
                        "Interactive phonics games",
                        "Word building simulator",
                        "Reading fluency tracker",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "comprehension-grade3",
              name: "Reading Comprehension",
              description: "Understanding and analyzing texts",
              outcomes: [
                {
                  id: "text-analysis-grade3",
                  description: "Analyze characters, setting, and plot in stories",
                  objectives: [
                    {
                      id: "story-elements-grade3",
                      description: "Identify main story elements and themes",
                      activities: [
                        "Story mapping",
                        "Character analysis charts",
                        "Plot sequence activities",
                        "Reading journals",
                      ],
                      practicalSimulations: [
                        "Interactive story builder",
                        "Character trait analyzer",
                        "Plot diagram tool",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "kiswahili-grade3",
      name: "Kiswahili",
      description: "Kukuza stadi za lugha ya Kiswahili",
      icon: <Globe className="h-5 w-5" />,
      color: "from-green-500 to-emerald-400",
      expanded: false,
      strands: [
        {
          id: "kusoma-grade3",
          name: "Kusoma",
          description: "Kukuza stadi za kusoma kwa ufasaha",
          expanded: false,
          subStrands: [
            {
              id: "silabi-grade3",
              name: "Silabi na Maneno",
              description: "Kutambua silabi na kusoma maneno",
              outcomes: [
                {
                  id: "kusoma-maneno-grade3",
                  description: "Kusoma maneno yenye silabi nyingi kwa ufasaha",
                  objectives: [
                    {
                      id: "silabi-patterns-grade3",
                      description: "Kutambua mifumo ya silabi katika maneno",
                      activities: ["Mchezo wa silabi", "Kujenga maneno", "Kusoma kwa sauti", "Zoezi la msamiati"],
                      practicalSimulations: [
                        "Mchezo wa silabi wa kidijitali",
                        "Mjenzi wa maneno",
                        "Kipima cha ufasaha wa kusoma",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "science-grade3",
      name: "Science and Technology",
      description: "Explore the natural world and basic technology concepts",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "from-orange-500 to-amber-400",
      expanded: false,
      strands: [
        {
          id: "living-things-grade3",
          name: "Living Things",
          description: "Study plants, animals, and human body",
          expanded: false,
          subStrands: [
            {
              id: "plants-grade3",
              name: "Plants",
              description: "Understanding plant parts and functions",
              outcomes: [
                {
                  id: "plant-parts-grade3",
                  description: "Identify parts of a plant and their functions",
                  objectives: [
                    {
                      id: "plant-observation-grade3",
                      description: "Observe and record plant growth and changes",
                      activities: [
                        "Plant growing experiment",
                        "Plant parts labeling",
                        "Garden observation",
                        "Plant life cycle study",
                      ],
                      practicalSimulations: [
                        "Virtual plant growth simulator",
                        "Plant parts identification game",
                        "Digital garden planner",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "social-studies-grade3",
      name: "Social Studies",
      description: "Understanding community, culture, and citizenship",
      icon: <Users className="h-5 w-5" />,
      color: "from-indigo-500 to-blue-400",
      expanded: false,
      strands: [
        {
          id: "community-grade3",
          name: "Our Community",
          description: "Understanding local community and its features",
          expanded: false,
          subStrands: [
            {
              id: "community-helpers-grade3",
              name: "Community Helpers",
              description: "People who help in our community",
              outcomes: [
                {
                  id: "helper-roles-grade3",
                  description: "Identify community helpers and their roles",
                  objectives: [
                    {
                      id: "helper-appreciation-grade3",
                      description: "Appreciate the work of community helpers",
                      activities: [
                        "Community helper interviews",
                        "Role-playing activities",
                        "Thank you cards creation",
                        "Community walk",
                      ],
                      practicalSimulations: [
                        "Virtual community tour",
                        "Community helper matching game",
                        "Role-play simulator",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "creative-arts-grade3",
      name: "Creative Arts",
      description: "Express creativity through art, music, and drama",
      icon: <Palette className="h-5 w-5" />,
      color: "from-pink-500 to-rose-400",
      expanded: false,
      strands: [
        {
          id: "visual-arts-grade3",
          name: "Visual Arts",
          description: "Drawing, painting, and craft activities",
          expanded: false,
          subStrands: [
            {
              id: "drawing-grade3",
              name: "Drawing and Painting",
              description: "Developing artistic skills and creativity",
              outcomes: [
                {
                  id: "artistic-expression-grade3",
                  description: "Express ideas and feelings through art",
                  objectives: [
                    {
                      id: "color-mixing-grade3",
                      description: "Mix colors to create new shades and tints",
                      activities: [
                        "Color wheel creation",
                        "Landscape painting",
                        "Still life drawing",
                        "Abstract art exploration",
                      ],
                      practicalSimulations: ["Digital art studio", "Color mixing simulator", "Virtual painting canvas"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ])

  const toggleLearningArea = (areaId: string) => {
    setLearningAreas((areas) =>
      areas.map((area) => (area.id === areaId ? { ...area, expanded: !area.expanded } : area)),
    )
  }

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
    <div className="space-y-6">
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-800 flex items-center">
                <span className="mr-2">🇰🇪</span>
                Grade 3 - CBC Curriculum
              </CardTitle>
              <CardDescription className="text-blue-700">
                Complete learning areas, strands, and sub-strands for Grade 3 students
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {learningAreas.length} Learning Areas
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            {learningAreas.map((area) => (
              <Card key={area.id} className="overflow-hidden">
                <div
                  className={`flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r ${area.color} text-white`}
                  onClick={() => toggleLearningArea(area.id)}
                >
                  <div className="flex items-center">
                    {area.icon}
                    <div className="ml-3">
                      <h3 className="font-semibold">{area.name}</h3>
                      <p className="text-sm opacity-90">{area.description}</p>
                    </div>
                  </div>
                  <div>
                    {area.expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </div>

                {area.expanded && (
                  <div className="p-4 space-y-3">
                    {area.strands.map((strand) => (
                      <div key={strand.id} className="border rounded-lg">
                        <div
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleStrand(area.id, strand.id)}
                        >
                          <div>
                            <h4 className="font-medium text-gray-800">{strand.name}</h4>
                            <p className="text-sm text-gray-600">{strand.description}</p>
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
                          <div className="p-3 bg-gray-50 border-t space-y-3">
                            {strand.subStrands.map((subStrand) => (
                              <div key={subStrand.id} className="bg-white p-3 rounded border">
                                <h5 className="font-medium text-gray-800 mb-2">{subStrand.name}</h5>
                                <p className="text-sm text-gray-600 mb-3">{subStrand.description}</p>

                                {subStrand.outcomes.map((outcome) => (
                                  <div key={outcome.id} className="mb-3">
                                    <div className="bg-blue-50 p-2 rounded mb-2">
                                      <p className="text-sm font-medium text-blue-800">Learning Outcome:</p>
                                      <p className="text-sm text-blue-700">{outcome.description}</p>
                                    </div>

                                    {outcome.objectives.map((objective) => (
                                      <div key={objective.id} className="ml-4 mb-2">
                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                          {objective.description}
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-3 text-xs">
                                          <div>
                                            <p className="font-medium text-green-700 mb-1">Activities:</p>
                                            <ul className="list-disc list-inside text-green-600 space-y-1">
                                              {objective.activities.map((activity, idx) => (
                                                <li key={idx}>{activity}</li>
                                              ))}
                                            </ul>
                                          </div>

                                          {objective.practicalSimulations && (
                                            <div>
                                              <p className="font-medium text-purple-700 mb-1">Digital Simulations:</p>
                                              <ul className="list-disc list-inside text-purple-600 space-y-1">
                                                {objective.practicalSimulations.map((simulation, idx) => (
                                                  <li key={idx}>{simulation}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
        <p>Grade 3 curriculum aligned with Kenya Competency-Based Curriculum (CBC)</p>
        <p className="text-xs mt-1">Source: Kenya Institute of Curriculum Development (KICD)</p>
      </div>
    </div>
  )
}
