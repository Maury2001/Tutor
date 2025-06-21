/**
 * CBC Curriculum Data Structure - Complete Implementation
 *
 * Updated with comprehensive curriculum data for all grade levels
 * Based on Kenyan CBC framework from Pre-Primary to Senior Secondary
 *
 * Last updated: December 2024
 * Source: Kenya Institute of Curriculum Development (KICD)
 */
export interface LearningObjective {
  id: string
  description: string
  activities: string[]
  practicalSimulations?: string[]
}

export interface LearningOutcome {
  id: string
  description: string
  objectives: LearningObjective[]
}

export interface SubStrand {
  id: string
  name: string
  description: string
  outcomes: LearningOutcome[]
  practicalProjects?: string[]
}

export interface Strand {
  id: string
  name: string
  description: string
  subStrands: SubStrand[]
}

export interface LearningArea {
  id: string
  name: string
  description: string
  strands: Strand[]
  weeklyLessons?: number
}

export type GradeLevel =
  | "playgroup"
  | "pp1"
  | "pp2"
  | "grade1"
  | "grade2"
  | "grade3"
  | "grade4"
  | "grade5"
  | "grade6"
  | "grade7"
  | "grade8"
  | "grade9"
  | "grade10"
  | "grade11"
  | "grade12"

export const GRADE_LEVELS: GradeLevel[] = [
  "playgroup",
  "pp1",
  "pp2",
  "grade1",
  "grade2",
  "grade3",
  "grade4",
  "grade5",
  "grade6",
  "grade7",
  "grade8",
  "grade9",
  "grade10",
  "grade11",
  "grade12",
]

// Make formatGradeLabel function exportable by moving it outside the helper area
export function formatGradeLabel(grade: GradeLevel): string {
  const gradeLabels: Record<GradeLevel, string> = {
    playgroup: "Playgroup",
    pp1: "PP1",
    pp2: "PP2",
    grade1: "Grade 1",
    grade2: "Grade 2",
    grade3: "Grade 3",
    grade4: "Grade 4",
    grade5: "Grade 5",
    grade6: "Grade 6",
    grade7: "Grade 7",
    grade8: "Grade 8",
    grade9: "Grade 9",
    grade10: "Grade 10",
    grade11: "Grade 11",
    grade12: "Grade 12",
  }
  return gradeLabels[grade] || grade
}

// Helper function to create mathematics learning areas for primary grades
function createMathematicsLearningArea(grade: GradeLevel): LearningArea {
  const gradeNum = Number.parseInt(grade.replace("grade", "")) || 0

  return {
    id: `mathematics-${grade}`,
    name: "Mathematics",
    description: `Mathematics concepts and skills for ${formatGradeLabel(grade)}`,
    weeklyLessons: 5,
    strands: [
      {
        id: `numbers-${grade}`,
        name: "Numbers",
        description: "Number concepts and operations",
        subStrands: [
          {
            id: `whole-numbers-${grade}`,
            name: "Whole Numbers",
            description: `Whole number concepts for ${formatGradeLabel(grade)}`,
            outcomes: [
              {
                id: `counting-${grade}`,
                description: `Count and work with numbers up to ${gradeNum <= 3 ? 1000 : gradeNum <= 6 ? 1000000 : "millions"}`,
                objectives: [
                  {
                    id: `number-recognition-${grade}`,
                    description: "Recognize and write numbers",
                    activities: ["Number games", "Counting exercises", "Number formation"],
                    practicalSimulations: ["Digital number games", "Interactive counting", "Number recognition app"],
                  },
                ],
              },
            ],
          },
          ...(gradeNum >= 3
            ? [
                {
                  id: `fractions-${grade}`,
                  name: "Fractions",
                  description: "Understanding fractions",
                  outcomes: [
                    {
                      id: `fraction-concepts-${grade}`,
                      description: "Understand and work with fractions",
                      objectives: [
                        {
                          id: `fraction-basics-${grade}`,
                          description: "Identify and create fractions",
                          activities: ["Fraction circles", "Pizza fractions", "Fraction bars"],
                          practicalSimulations: [
                            "Virtual fraction manipulatives",
                            "Fraction games",
                            "Interactive fraction builder",
                          ],
                        },
                      ],
                    },
                  ],
                },
              ]
            : []),
        ],
      },
      {
        id: `measurement-${grade}`,
        name: "Measurement",
        description: "Measurement concepts and applications",
        subStrands: [
          {
            id: `length-mass-${grade}`,
            name: "Length and Mass",
            description: "Measuring length, mass, and capacity",
            outcomes: [
              {
                id: `measurement-skills-${grade}`,
                description: "Measure using appropriate units",
                objectives: [
                  {
                    id: `measuring-objects-${grade}`,
                    description: "Measure objects using standard units",
                    activities: ["Measuring classroom objects", "Cooking measurements", "Sports measurements"],
                    practicalSimulations: ["Virtual ruler", "Measurement games", "Unit conversion app"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
}

// Helper function to create English learning areas
function createEnglishLearningArea(grade: GradeLevel): LearningArea {
  return {
    id: `english-${grade}`,
    name: "English",
    description: `English language development for ${formatGradeLabel(grade)}`,
    weeklyLessons: 5,
    strands: [
      {
        id: `listening-speaking-${grade}`,
        name: "Listening and Speaking",
        description: "Oral communication skills",
        subStrands: [
          {
            id: `oral-communication-${grade}`,
            name: "Oral Communication",
            description: "Speaking and listening skills",
            outcomes: [
              {
                id: `communication-skills-${grade}`,
                description: "Communicate effectively in English",
                objectives: [
                  {
                    id: `speaking-skills-${grade}`,
                    description: "Express ideas clearly in English",
                    activities: ["Show and tell", "Storytelling", "Conversations"],
                    practicalSimulations: ["Speech practice app", "Pronunciation trainer", "Conversation simulator"],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: `reading-${grade}`,
        name: "Reading",
        description: "Reading comprehension and fluency",
        subStrands: [
          {
            id: `reading-comprehension-${grade}`,
            name: "Reading Comprehension",
            description: "Understanding written texts",
            outcomes: [
              {
                id: `comprehension-skills-${grade}`,
                description: "Read and understand various texts",
                objectives: [
                  {
                    id: `text-understanding-${grade}`,
                    description: "Comprehend age-appropriate texts",
                    activities: ["Reading stories", "Answering questions", "Summarizing texts"],
                    practicalSimulations: ["Interactive reading app", "Comprehension games", "Digital library"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
}

// Helper function to create Science learning areas
function createScienceLearningArea(grade: GradeLevel): LearningArea {
  return {
    id: `science-${grade}`,
    name: "Science and Technology",
    description: `Science and technology concepts for ${formatGradeLabel(grade)}`,
    weeklyLessons: 4,
    strands: [
      {
        id: `living-things-${grade}`,
        name: "Living Things and Their Environment",
        description: "Biology and environmental science",
        subStrands: [
          {
            id: `plants-animals-${grade}`,
            name: "Plants and Animals",
            description: "Study of living organisms",
            outcomes: [
              {
                id: `organism-study-${grade}`,
                description: "Understand characteristics of living things",
                objectives: [
                  {
                    id: `life-processes-${grade}`,
                    description: "Identify life processes in organisms",
                    activities: ["Nature walks", "Plant growing", "Animal observation"],
                    practicalSimulations: ["Virtual lab", "Life cycle simulator", "Ecosystem game"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
}

// Helper function to create Social Studies learning areas
function createSocialStudiesLearningArea(grade: GradeLevel): LearningArea {
  return {
    id: `social-studies-${grade}`,
    name: "Social Studies",
    description: `Social studies concepts for ${formatGradeLabel(grade)}`,
    weeklyLessons: 3,
    strands: [
      {
        id: `history-government-${grade}`,
        name: "History and Government",
        description: "Understanding society and governance",
        subStrands: [
          {
            id: `kenyan-history-${grade}`,
            name: "Kenyan History",
            description: "History of Kenya",
            outcomes: [
              {
                id: `historical-knowledge-${grade}`,
                description: "Understand key events in Kenyan history",
                objectives: [
                  {
                    id: `historical-events-${grade}`,
                    description: "Identify important historical events",
                    activities: ["History projects", "Timeline creation", "Historical role-play"],
                    practicalSimulations: ["Virtual museum", "Historical timeline app", "Interactive maps"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
}

export const CBC_CURRICULUM: Record<GradeLevel, LearningArea[]> = {
  playgroup: [
    {
      id: "music-movement-playgroup",
      name: "Music and Movement Activities",
      description: "Simple rhythm exercises and movement activities for 3-4 year olds",
      strands: [
        {
          id: "rhythm-playgroup",
          name: "Rhythm and Movement",
          description: "Basic rhythm and movement coordination",
          subStrands: [
            {
              id: "simple-rhythm-playgroup",
              name: "Simple Rhythm",
              description: "Basic rhythm exercises with short attention spans",
              outcomes: [
                {
                  id: "rhythm-coordination-playgroup",
                  description: "Develop basic rhythm coordination through simple exercises",
                  objectives: [
                    {
                      id: "action-songs-playgroup",
                      description: "Participate in action songs and movement",
                      activities: ["Action songs", "Simple dance moves", "Clapping games"],
                      practicalSimulations: ["Virtual rhythm games", "Interactive music sessions", "Movement tracking"],
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
      id: "art-craft-playgroup",
      name: "Art and Craft Activities",
      description: "Creative expression through art and craft",
      strands: [
        {
          id: "creative-expression-playgroup",
          name: "Creative Expression",
          description: "Basic art and craft activities",
          subStrands: [
            {
              id: "finger-painting-playgroup",
              name: "Finger Painting",
              description: "Sensory art experiences",
              outcomes: [
                {
                  id: "color-recognition-playgroup",
                  description: "Recognize and use basic colors in art",
                  objectives: [
                    {
                      id: "primary-colors-playgroup",
                      description: "Identify and use primary colors",
                      activities: ["Finger painting", "Color mixing", "Free drawing"],
                      practicalSimulations: ["Digital painting app", "Color mixing simulator", "Virtual art studio"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  pp1: [
    {
      id: "language-activities-pp1",
      name: "Language Activities",
      description: "Development of listening, speaking, pre-reading and pre-writing skills",
      strands: [
        {
          id: "listening-speaking-pp1",
          name: "Listening and Speaking",
          description: "Developing oral communication skills",
          subStrands: [
            {
              id: "sounds-pp1",
              name: "Sounds",
              description: "Sound identification and recognition",
              outcomes: [
                {
                  id: "sound-identification-pp1",
                  description: "Identify and distinguish different sounds in the environment",
                  objectives: [
                    {
                      id: "environmental-sounds-pp1",
                      description: "Recognize environmental sounds",
                      activities: ["Sound identification games", "Musical instruments sounds", "Environmental sounds"],
                      practicalSimulations: [
                        "Sound matching game",
                        "Audio recognition app",
                        "Environmental sound library",
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
      id: "mathematical-activities-pp1",
      name: "Mathematical Activities",
      description: "Foundation mathematical concepts and skills",
      strands: [
        {
          id: "numbers-pp1",
          name: "Numbers",
          description: "Number recognition and counting",
          subStrands: [
            {
              id: "number-concept-pp1",
              name: "Number Concept 1-10",
              description: "Basic number understanding",
              outcomes: [
                {
                  id: "counting-objects-pp1",
                  description: "Count objects from 1 to 10 using one-to-one correspondence",
                  objectives: [
                    {
                      id: "object-counting-pp1",
                      description: "Count objects in the environment",
                      activities: [
                        "Counting objects in environment",
                        "Number recognition activities",
                        "Counting games",
                      ],
                      practicalSimulations: [
                        "Interactive counting game",
                        "Number recognition app",
                        "Virtual manipulatives",
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
  ],

  pp2: [
    {
      id: "literacy-activities-pp2",
      name: "Literacy Activities",
      description: "Advanced pre-literacy skills development",
      strands: [
        {
          id: "listening-speaking-pp2",
          name: "Listening and Speaking",
          description: "Enhanced oral communication skills",
          subStrands: [
            {
              id: "oral-communication-pp2",
              name: "Oral Communication",
              description: "Advanced communication skills",
              outcomes: [
                {
                  id: "conversation-skills-pp2",
                  description: "Develop conversation skills and follow instructions",
                  objectives: [
                    {
                      id: "communication-pp2",
                      description: "Express ideas clearly and follow instructions",
                      activities: ["Conversation skills", "Following instructions", "Storytelling"],
                      practicalSimulations: [
                        "Conversation practice app",
                        "Instruction following game",
                        "Story builder",
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
  ],

  grade1: [
    createMathematicsLearningArea("grade1"),
    createEnglishLearningArea("grade1"),
    {
      id: "kiswahili-grade1",
      name: "Kiswahili",
      description: "Kiswahili language skills development",
      weeklyLessons: 4,
      strands: [
        {
          id: "kusikiliza-kuzungumza-grade1",
          name: "Kusikiliza na Kuzungumza",
          description: "Listening and speaking in Kiswahili",
          subStrands: [
            {
              id: "mazungumzo-grade1",
              name: "Mazungumzo",
              description: "Conversations in Kiswahili",
              outcomes: [
                {
                  id: "kiswahili-communication-grade1",
                  description: "Communicate effectively in Kiswahili",
                  objectives: [
                    {
                      id: "kiswahili-speaking-grade1",
                      description: "Speak confidently in Kiswahili",
                      activities: ["Mazungumzo ya kila siku", "Hadithi", "Nyimbo za Kiswahili"],
                      practicalSimulations: ["Kiswahili conversation app", "Story telling simulator", "Language games"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  grade2: [
    createMathematicsLearningArea("grade2"),
    createEnglishLearningArea("grade2"),
    {
      id: "kiswahili-grade2",
      name: "Kiswahili",
      description: "Advanced Kiswahili language skills",
      weeklyLessons: 4,
      strands: [
        {
          id: "kusoma-grade2",
          name: "Kusoma",
          description: "Reading skills in Kiswahili",
          subStrands: [
            {
              id: "usomaji-grade2",
              name: "Usomaji wa Maneno",
              description: "Word reading skills",
              outcomes: [
                {
                  id: "kiswahili-reading-grade2",
                  description: "Read simple Kiswahili texts fluently",
                  objectives: [
                    {
                      id: "word-reading-grade2",
                      description: "Read and understand simple words and sentences",
                      activities: ["Kusoma vitabu vya picha", "Utambuzi wa maneno", "Hadithi fupi"],
                      practicalSimulations: ["Kiswahili reading app", "Word recognition games", "Interactive stories"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    createScienceLearningArea("grade2"),
  ],

  grade3: [
    createMathematicsLearningArea("grade3"),
    createEnglishLearningArea("grade3"),
    {
      id: "kiswahili-grade3",
      name: "Kiswahili",
      description: "Intermediate Kiswahili language skills",
      weeklyLessons: 4,
      strands: [
        {
          id: "kuandika-grade3",
          name: "Kuandika",
          description: "Writing skills in Kiswahili",
          subStrands: [
            {
              id: "uandishi-grade3",
              name: "Uandishi wa Insha",
              description: "Essay writing skills",
              outcomes: [
                {
                  id: "kiswahili-writing-grade3",
                  description: "Write simple compositions in Kiswahili",
                  objectives: [
                    {
                      id: "composition-writing-grade3",
                      description: "Write short stories and descriptions",
                      activities: ["Kuandika hadithi fupi", "Maelezo ya picha", "Barua za kirafiki"],
                      practicalSimulations: ["Writing practice app", "Story creator", "Letter writing simulator"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    createScienceLearningArea("grade3"),
    createSocialStudiesLearningArea("grade3"),
  ],

  grade4: [
    createMathematicsLearningArea("grade4"),
    createEnglishLearningArea("grade4"),
    {
      id: "kiswahili-grade4",
      name: "Kiswahili",
      description: "Advanced Kiswahili language skills",
      weeklyLessons: 4,
      strands: [
        {
          id: "lugha-grade4",
          name: "Lugha",
          description: "Grammar and language structure",
          subStrands: [
            {
              id: "sarufi-grade4",
              name: "Sarufi",
              description: "Kiswahili grammar",
              outcomes: [
                {
                  id: "grammar-skills-grade4",
                  description: "Apply correct grammar in Kiswahili",
                  objectives: [
                    {
                      id: "grammar-application-grade4",
                      description: "Use proper grammar structures",
                      activities: ["Zoezi la sarufi", "Kutengeneza sentensi", "Mchezo wa maneno"],
                      practicalSimulations: ["Grammar checker app", "Sentence builder", "Language structure games"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    createScienceLearningArea("grade4"),
    createSocialStudiesLearningArea("grade4"),
  ],

  grade5: [
    createMathematicsLearningArea("grade5"),
    createEnglishLearningArea("grade5"),
    {
      id: "kiswahili-grade5",
      name: "Kiswahili",
      description: "Proficient Kiswahili language skills",
      weeklyLessons: 4,
      strands: [
        {
          id: "fasihi-grade5",
          name: "Fasihi",
          description: "Literature appreciation",
          subStrands: [
            {
              id: "mashairi-grade5",
              name: "Mashairi na Hadithi",
              description: "Poetry and stories",
              outcomes: [
                {
                  id: "literature-appreciation-grade5",
                  description: "Appreciate Kiswahili literature",
                  objectives: [
                    {
                      id: "poetry-analysis-grade5",
                      description: "Analyze and recite poems",
                      activities: ["Kusoma mashairi", "Uchambuzi wa hadithi", "Uigizaji"],
                      practicalSimulations: ["Poetry recitation app", "Story analysis tool", "Drama simulator"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    createScienceLearningArea("grade5"),
    createSocialStudiesLearningArea("grade5"),
  ],

  grade6: [
    createMathematicsLearningArea("grade6"),
    createEnglishLearningArea("grade6"),
    {
      id: "kiswahili-grade6",
      name: "Kiswahili",
      description: "Advanced Kiswahili proficiency",
      weeklyLessons: 4,
      strands: [
        {
          id: "utafiti-grade6",
          name: "Utafiti",
          description: "Research and inquiry skills",
          subStrands: [
            {
              id: "mradi-grade6",
              name: "Miradi ya Utafiti",
              description: "Research projects",
              outcomes: [
                {
                  id: "research-skills-grade6",
                  description: "Conduct simple research in Kiswahili",
                  objectives: [
                    {
                      id: "project-research-grade6",
                      description: "Complete research projects",
                      activities: ["Utafiti wa mada", "Ukusanyaji wa taarifa", "Uwasilishaji wa matokeo"],
                      practicalSimulations: ["Research planner app", "Data collection tool", "Presentation maker"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    createScienceLearningArea("grade6"),
    createSocialStudiesLearningArea("grade6"),
  ],

  // Junior Secondary (Grades 7-9)
  grade7: [
    {
      id: "mathematics-grade7",
      name: "Mathematics",
      description: "Advanced mathematical concepts for junior secondary",
      weeklyLessons: 5,
      strands: [
        {
          id: "algebra-grade7",
          name: "Algebra",
          description: "Introduction to algebraic concepts",
          subStrands: [
            {
              id: "algebraic-expressions-grade7",
              name: "Algebraic Expressions",
              description: "Working with variables and expressions",
              outcomes: [
                {
                  id: "expression-manipulation-grade7",
                  description: "Manipulate algebraic expressions",
                  objectives: [
                    {
                      id: "variable-operations-grade7",
                      description: "Perform operations with variables",
                      activities: ["Solving equations", "Simplifying expressions", "Word problems"],
                      practicalSimulations: ["Algebra solver app", "Expression builder", "Equation visualizer"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    createEnglishLearningArea("grade7"),
    {
      id: "kiswahili-grade7",
      name: "Kiswahili",
      description: "Junior secondary Kiswahili",
      weeklyLessons: 4,
      strands: [
        {
          id: "uchanganuzi-grade7",
          name: "Uchanganuzi wa Maandishi",
          description: "Text analysis skills",
          subStrands: [
            {
              id: "uchambuzi-grade7",
              name: "Uchambuzi wa Kina",
              description: "Deep textual analysis",
              outcomes: [
                {
                  id: "analytical-skills-grade7",
                  description: "Analyze texts critically",
                  objectives: [
                    {
                      id: "critical-analysis-grade7",
                      description: "Perform critical analysis of texts",
                      activities: ["Uchambuzi wa riwaya", "Tathmini ya mashairi", "Mjadala wa maandishi"],
                      practicalSimulations: ["Text analysis tool", "Literary criticism app", "Discussion forum"],
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
      id: "integrated-science-grade7",
      name: "Integrated Science",
      description: "Comprehensive science education",
      weeklyLessons: 5,
      strands: [
        {
          id: "physics-concepts-grade7",
          name: "Physics Concepts",
          description: "Basic physics principles",
          subStrands: [
            {
              id: "motion-forces-grade7",
              name: "Motion and Forces",
              description: "Understanding motion and forces",
              outcomes: [
                {
                  id: "physics-understanding-grade7",
                  description: "Understand basic physics concepts",
                  objectives: [
                    {
                      id: "force-motion-grade7",
                      description: "Explain motion and forces",
                      activities: ["Physics experiments", "Motion calculations", "Force demonstrations"],
                      practicalSimulations: ["Physics lab simulator", "Motion tracker", "Force calculator"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  grade8: [
    {
      id: "mathematics-grade8",
      name: "Mathematics",
      description: "Intermediate mathematics for grade 8",
      weeklyLessons: 5,
      strands: [
        {
          id: "geometry-grade8",
          name: "Geometry",
          description: "Advanced geometric concepts",
          subStrands: [
            {
              id: "coordinate-geometry-grade8",
              name: "Coordinate Geometry",
              description: "Working with coordinates",
              outcomes: [
                {
                  id: "coordinate-skills-grade8",
                  description: "Master coordinate geometry",
                  objectives: [
                    {
                      id: "plotting-points-grade8",
                      description: "Plot and analyze points on coordinate plane",
                      activities: ["Graphing exercises", "Distance calculations", "Slope analysis"],
                      practicalSimulations: ["Graphing calculator", "Coordinate plotter", "Geometry visualizer"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    createEnglishLearningArea("grade8"),
    {
      id: "chemistry-grade8",
      name: "Chemistry",
      description: "Introduction to chemistry",
      weeklyLessons: 4,
      strands: [
        {
          id: "matter-properties-grade8",
          name: "Matter and Properties",
          description: "Understanding matter and its properties",
          subStrands: [
            {
              id: "atomic-structure-grade8",
              name: "Atomic Structure",
              description: "Basic atomic concepts",
              outcomes: [
                {
                  id: "atomic-understanding-grade8",
                  description: "Understand atomic structure",
                  objectives: [
                    {
                      id: "atom-components-grade8",
                      description: "Identify components of atoms",
                      activities: ["Atomic models", "Element identification", "Chemical reactions"],
                      practicalSimulations: ["Atom builder app", "Periodic table explorer", "Reaction simulator"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  grade9: [
    {
      id: "mathematics-grade9",
      name: "Mathematics",
      description: "Pre-secondary mathematics",
      weeklyLessons: 5,
      strands: [
        {
          id: "statistics-grade9",
          name: "Statistics and Probability",
          description: "Data analysis and probability",
          subStrands: [
            {
              id: "data-analysis-grade9",
              name: "Data Analysis",
              description: "Analyzing and interpreting data",
              outcomes: [
                {
                  id: "statistical-skills-grade9",
                  description: "Analyze data statistically",
                  objectives: [
                    {
                      id: "data-interpretation-grade9",
                      description: "Interpret statistical data",
                      activities: ["Data collection", "Graph creation", "Statistical calculations"],
                      practicalSimulations: ["Statistics calculator", "Graph maker", "Data analyzer"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    createEnglishLearningArea("grade9"),
    {
      id: "biology-grade9",
      name: "Biology",
      description: "Life sciences",
      weeklyLessons: 4,
      strands: [
        {
          id: "human-biology-grade9",
          name: "Human Biology",
          description: "Human body systems",
          subStrands: [
            {
              id: "body-systems-grade9",
              name: "Body Systems",
              description: "Understanding human body systems",
              outcomes: [
                {
                  id: "biology-knowledge-grade9",
                  description: "Understand human biology",
                  objectives: [
                    {
                      id: "system-functions-grade9",
                      description: "Explain body system functions",
                      activities: ["System diagrams", "Health projects", "Biology experiments"],
                      practicalSimulations: ["Human body explorer", "System simulator", "Health tracker"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  // Senior Secondary (Grades 10-12)
  grade10: [
    {
      id: "mathematics-grade10",
      name: "Mathematics",
      description: "Advanced secondary mathematics",
      weeklyLessons: 6,
      strands: [
        {
          id: "calculus-intro-grade10",
          name: "Introduction to Calculus",
          description: "Basic calculus concepts",
          subStrands: [
            {
              id: "limits-grade10",
              name: "Limits and Continuity",
              description: "Understanding limits",
              outcomes: [
                {
                  id: "calculus-foundation-grade10",
                  description: "Master basic calculus concepts",
                  objectives: [
                    {
                      id: "limit-calculations-grade10",
                      description: "Calculate limits of functions",
                      activities: ["Limit problems", "Continuity analysis", "Function behavior"],
                      practicalSimulations: ["Calculus visualizer", "Limit calculator", "Function grapher"],
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
      id: "physics-grade10",
      name: "Physics",
      description: "Advanced physics concepts",
      weeklyLessons: 5,
      strands: [
        {
          id: "mechanics-grade10",
          name: "Mechanics",
          description: "Classical mechanics",
          subStrands: [
            {
              id: "kinematics-grade10",
              name: "Kinematics",
              description: "Motion analysis",
              outcomes: [
                {
                  id: "mechanics-mastery-grade10",
                  description: "Master mechanical concepts",
                  objectives: [
                    {
                      id: "motion-analysis-grade10",
                      description: "Analyze complex motion",
                      activities: ["Motion experiments", "Projectile analysis", "Force calculations"],
                      practicalSimulations: ["Physics lab", "Motion simulator", "Force analyzer"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    createEnglishLearningArea("grade10"),
  ],

  grade11: [
    {
      id: "advanced-mathematics-grade11",
      name: "Advanced Mathematics",
      description: "Pre-university mathematics",
      weeklyLessons: 6,
      strands: [
        {
          id: "differential-calculus-grade11",
          name: "Differential Calculus",
          description: "Derivatives and applications",
          subStrands: [
            {
              id: "derivatives-grade11",
              name: "Derivatives",
              description: "Differentiation techniques",
              outcomes: [
                {
                  id: "calculus-proficiency-grade11",
                  description: "Master differential calculus",
                  objectives: [
                    {
                      id: "differentiation-grade11",
                      description: "Apply differentiation techniques",
                      activities: ["Derivative calculations", "Optimization problems", "Rate of change analysis"],
                      practicalSimulations: ["Derivative calculator", "Optimization solver", "Rate analyzer"],
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
      id: "chemistry-grade11",
      name: "Chemistry",
      description: "Advanced chemistry",
      weeklyLessons: 5,
      strands: [
        {
          id: "organic-chemistry-grade11",
          name: "Organic Chemistry",
          description: "Carbon compounds",
          subStrands: [
            {
              id: "hydrocarbons-grade11",
              name: "Hydrocarbons",
              description: "Organic compound families",
              outcomes: [
                {
                  id: "organic-mastery-grade11",
                  description: "Understand organic chemistry",
                  objectives: [
                    {
                      id: "compound-analysis-grade11",
                      description: "Analyze organic compounds",
                      activities: ["Spectroscopy", "Reaction mechanisms", "Synthesis"],
                      practicalSimulations: ["Molecular modeler", "Reaction simulator", "Spectrometer"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  grade12: [
    {
      id: "applied-mathematics-grade12",
      name: "Applied Mathematics",
      description: "Real-world applications of mathematics",
      weeklyLessons: 6,
      strands: [
        {
          id: "modeling-grade12",
          name: "Mathematical Modeling",
          description: "Creating mathematical models",
          subStrands: [
            {
              id: "simulation-grade12",
              name: "Simulation",
              description: "Using simulations",
              outcomes: [
                {
                  id: "modeling-expertise-grade12",
                  description: "Become proficient in mathematical modeling",
                  objectives: [
                    {
                      id: "model-creation-grade12",
                      description: "Create and analyze models",
                      activities: ["Model building", "Simulation runs", "Data analysis"],
                      practicalSimulations: ["Model builder", "Simulation software", "Data analyzer"],
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
      id: "advanced-physics-grade12",
      name: "Advanced Physics",
      description: "Modern physics concepts",
      weeklyLessons: 5,
      strands: [
        {
          id: "quantum-mechanics-grade12",
          name: "Quantum Mechanics",
          description: "Quantum physics principles",
          subStrands: [
            {
              id: "wave-particle-grade12",
              name: "Wave-Particle Duality",
              description: "Understanding wave-particle duality",
              outcomes: [
                {
                  id: "quantum-understanding-grade12",
                  description: "Understand quantum mechanics",
                  objectives: [
                    {
                      id: "quantum-analysis-grade12",
                      description: "Analyze quantum phenomena",
                      activities: ["Quantum experiments", "Wave calculations", "Particle analysis"],
                      practicalSimulations: ["Quantum simulator", "Wave visualizer", "Particle analyzer"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

// Export all helper functions that were missing
export function getStrands(grade: GradeLevel, learningAreaId: string): Strand[] {
  const learningAreas = CBC_CURRICULUM[grade] || []
  const learningArea = learningAreas.find((la) => la.id === learningAreaId)
  return learningArea?.strands || []
}

export function getSubStrands(grade: GradeLevel, learningAreaId: string, strandId: string): SubStrand[] {
  const strands = getStrands(grade, learningAreaId)
  const strand = strands.find((s) => s.id === strandId)
  return strand?.subStrands || []
}

export function getLearningOutcomes(
  grade: GradeLevel,
  learningAreaId: string,
  strandId: string,
  subStrandId: string,
): LearningOutcome[] {
  const subStrands = getSubStrands(grade, learningAreaId, strandId)
  const subStrand = subStrands.find((ss) => ss.id === subStrandId)
  return subStrand?.outcomes || []
}

export function getLearningObjectives(
  grade: GradeLevel,
  learningAreaId: string,
  strandId: string,
  subStrandId: string,
  outcomeId: string,
): LearningObjective[] {
  const outcomes = getLearningOutcomes(grade, learningAreaId, strandId, subStrandId)
  const outcome = outcomes.find((o) => o.id === outcomeId)
  return outcome?.objectives || []
}

export interface LearningPathOptions {
  studentGrade: GradeLevel
  learningAreas?: string[]
  targetOutcomes?: string[]
  difficulty?: "easy" | "medium" | "hard"
  focus?: "breadth" | "depth"
}

export function generateLearningPath(options: LearningPathOptions): Array<{
  step: number
  learningArea: LearningArea
  strand: Strand
  subStrand: SubStrand
  outcome: LearningOutcome
  objectives: LearningObjective[]
  estimatedDuration: string
  prerequisites: string[]
}> {
  const path: Array<{
    step: number
    learningArea: LearningArea
    strand: Strand
    subStrand: SubStrand
    outcome: LearningOutcome
    objectives: LearningObjective[]
    estimatedDuration: string
    prerequisites: string[]
  }> = []

  const learningAreas = CBC_CURRICULUM[options.studentGrade] || []
  let step = 1

  for (const learningArea of learningAreas) {
    if (options.learningAreas && !options.learningAreas.includes(learningArea.id)) continue

    for (const strand of learningArea.strands) {
      for (const subStrand of strand.subStrands) {
        for (const outcome of subStrand.outcomes) {
          if (options.targetOutcomes && !options.targetOutcomes.includes(outcome.id)) continue

          path.push({
            step: step++,
            learningArea,
            strand,
            subStrand,
            outcome,
            objectives: outcome.objectives,
            estimatedDuration: `${outcome.objectives.length * 30} minutes`,
            prerequisites: [],
          })

          if (options.focus === "breadth" && step > 10) break
        }
        if (options.focus === "breadth" && step > 10) break
      }
      if (options.focus === "breadth" && step > 10) break
    }
  }

  return path.slice(0, options.focus === "depth" ? 20 : 10)
}

export interface SearchOptions {
  grades?: GradeLevel[]
  learningAreas?: string[]
  includeActivities?: boolean
  includeSimulations?: boolean
}

export function searchCurriculum(
  query: string,
  options: SearchOptions = {},
): Array<{
  type: "learningArea" | "strand" | "subStrand" | "outcome" | "objective"
  item: any
  context: {
    grade: GradeLevel
    learningArea: LearningArea
    strand?: Strand
    subStrand?: SubStrand
    outcome?: LearningOutcome
  }
  relevance: number
}> {
  const results: Array<{
    type: "learningArea" | "strand" | "subStrand" | "outcome" | "objective"
    item: any
    context: any
    relevance: number
  }> = []

  const searchTerms = query.toLowerCase().split(" ")

  function calculateRelevance(text: string): number {
    const lowerText = text.toLowerCase()
    let relevance = 0

    for (const term of searchTerms) {
      if (lowerText.includes(term)) {
        relevance += term.length / text.length
      }
    }

    return relevance
  }

  for (const [grade, learningAreas] of Object.entries(CBC_CURRICULUM) as [GradeLevel, LearningArea[]][]) {
    if (options.grades && !options.grades.includes(grade)) continue

    for (const learningArea of learningAreas) {
      if (options.learningAreas && !options.learningAreas.includes(learningArea.id)) continue

      const laRelevance = calculateRelevance(`${learningArea.name} ${learningArea.description}`)
      if (laRelevance > 0) {
        results.push({
          type: "learningArea",
          item: learningArea,
          context: { grade, learningArea },
          relevance: laRelevance,
        })
      }

      for (const strand of learningArea.strands) {
        const strandRelevance = calculateRelevance(`${strand.name} ${strand.description}`)
        if (strandRelevance > 0) {
          results.push({
            type: "strand",
            item: strand,
            context: { grade, learningArea, strand },
            relevance: strandRelevance,
          })
        }

        for (const subStrand of strand.subStrands) {
          const subStrandRelevance = calculateRelevance(`${subStrand.name} ${subStrand.description}`)
          if (subStrandRelevance > 0) {
            results.push({
              type: "subStrand",
              item: subStrand,
              context: { grade, learningArea, strand, subStrand },
              relevance: subStrandRelevance,
            })
          }

          for (const outcome of subStrand.outcomes) {
            const outcomeRelevance = calculateRelevance(outcome.description)
            if (outcomeRelevance > 0) {
              results.push({
                type: "outcome",
                item: outcome,
                context: { grade, learningArea, strand, subStrand, outcome },
                relevance: outcomeRelevance,
              })
            }

            for (const objective of outcome.objectives) {
              let objectiveText = `${objective.description}`
              if (options.includeActivities) {
                objectiveText += ` ${objective.activities.join(" ")}`
              }
              if (options.includeSimulations && objective.practicalSimulations) {
                objectiveText += ` ${objective.practicalSimulations.join(" ")}`
              }

              const objectiveRelevance = calculateRelevance(objectiveText)
              if (objectiveRelevance > 0) {
                results.push({
                  type: "objective",
                  item: objective,
                  context: { grade, learningArea, strand, subStrand, outcome },
                  relevance: objectiveRelevance,
                })
              }
            }
          }
        }
      }
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance)
}

// Export the main curriculum access functions
export function getLearningAreas(grade: GradeLevel): LearningArea[] {
  return CBC_CURRICULUM[grade] || []
}

export function findLearningArea(grade: GradeLevel, learningAreaId: string): LearningArea | null {
  const learningAreas = getLearningAreas(grade)
  return learningAreas.find((la) => la.id === learningAreaId) || null
}

export function findStrand(grade: GradeLevel, learningAreaId: string, strandId: string): Strand | null {
  const learningArea = findLearningArea(grade, learningAreaId)
  if (!learningArea) return null
  return learningArea.strands.find((s) => s.id === strandId) || null
}

export function findSubStrand(
  grade: GradeLevel,
  learningAreaId: string,
  strandId: string,
  subStrandId: string,
): SubStrand | null {
  const strand = findStrand(grade, learningAreaId, strandId)
  if (!strand) return null
  return strand.subStrands.find((ss) => ss.id === subStrandId) || null
}

export function findLearningOutcome(
  grade: GradeLevel,
  learningAreaId: string,
  strandId: string,
  subStrandId: string,
  outcomeId: string,
): LearningOutcome | null {
  const subStrand = findSubStrand(grade, learningAreaId, strandId, subStrandId)
  if (!subStrand) return null
  return subStrand.outcomes.find((o) => o.id === outcomeId) || null
}
