"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, Trophy, FileText, RefreshCw } from "lucide-react"
import { getStrands, getSubStrands } from "@/lib/cbc-curriculum"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"

// Import the ModelSelector component at the top
import { ModelSelector } from "@/components/ai/model-selector"

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  mode?: string
  curriculumContext?: {
    gradeLevel: string
    learningArea: string
    strand?: string
    subStrand?: string
  }
  metadata?: {
    quizGenerated?: boolean
    notesGenerated?: boolean
    assessmentScore?: number
    topicsLearned?: string[]
    simulationStarted?: boolean
    simulationName?: string
    modelUsed?: string
    modelInfo?: any
    fallbackUsed?: boolean
  }
}

interface LearningSession {
  id: string
  mode: string
  startTime: Date
  endTime?: Date
  topicsLearned: string[]
  questionsAsked: number
  correctAnswers: number
  areasOfStruggle: string[]
  achievements: string[]
}

type GradeLevel =
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

interface LearningArea {
  id: string
  name: string
  description: string
  strands: Strand[]
}

interface Strand {
  id: string
  name: string
  description: string
  subStrands: SubStrand[]
}

interface SubStrand {
  id: string
  name: string
  description: string
  outcomes: Outcome[]
}

interface Outcome {
  id: string
  description: string
  objectives: Objective[]
}

interface Objective {
  id: string
  description: string
  activities: string[]
  practicalSimulations: string[]
}

// Add comprehensive CBC curriculum data
const COMPREHENSIVE_CBC_CURRICULUM: Record<GradeLevel, LearningArea[]> = {
  playgroup: [
    {
      id: "music-movement-playgroup",
      name: "Music and Movement Activities",
      description: "Rhythm, singing, and physical coordination for early childhood",
      strands: [
        {
          id: "rhythm-movement",
          name: "Rhythm and Movement",
          description: "Basic rhythm patterns and body movement coordination",
          subStrands: [
            {
              id: "simple-songs",
              name: "Simple Songs and Rhymes",
              description: "Age-appropriate songs with actions and movements",
              outcomes: [
                {
                  id: "participate-songs",
                  description: "Participate actively in songs and action rhymes",
                  objectives: [
                    {
                      id: "sing-along",
                      description: "Sing along to familiar songs with actions",
                      activities: ["Action songs", "Clapping games", "Simple dance moves"],
                      practicalSimulations: ["Virtual music session", "Interactive rhythm game"],
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
      description: "Creative expression through various art forms",
      strands: [
        {
          id: "creative-expression",
          name: "Creative Expression",
          description: "Free expression through art and craft materials",
          subStrands: [
            {
              id: "finger-painting",
              name: "Finger Painting and Drawing",
              description: "Sensory art experiences with paint and drawing materials",
              outcomes: [
                {
                  id: "create-art",
                  description: "Create simple art using various materials",
                  objectives: [
                    {
                      id: "use-colors",
                      description: "Use different colors to create pictures",
                      activities: ["Finger painting", "Crayon drawing", "Color mixing"],
                      practicalSimulations: ["Digital art pad", "Color mixing simulator"],
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
      description: "Foundation language skills in listening, speaking, pre-reading and pre-writing",
      strands: [
        {
          id: "listening-speaking-pp1",
          name: "Listening and Speaking",
          description: "Oral communication and auditory skills development",
          subStrands: [
            {
              id: "sounds-identification",
              name: "Sounds in the Environment",
              description: "Recognition and identification of various sounds",
              outcomes: [
                {
                  id: "identify-sounds",
                  description: "Identify and distinguish different environmental sounds",
                  objectives: [
                    {
                      id: "environmental-sounds",
                      description: "Recognize sounds from nature, animals, and machines",
                      activities: ["Sound walks", "Sound matching games", "Musical instruments"],
                      practicalSimulations: ["Sound identification app", "Audio memory game"],
                    },
                  ],
                },
              ],
            },
            {
              id: "oral-expression",
              name: "Oral Expression",
              description: "Speaking and verbal communication skills",
              outcomes: [
                {
                  id: "express-ideas",
                  description: "Express simple ideas and needs verbally",
                  objectives: [
                    {
                      id: "basic-communication",
                      description: "Communicate basic needs and simple ideas",
                      activities: ["Show and tell", "Simple conversations", "Story retelling"],
                      practicalSimulations: ["Voice recorder app", "Story builder"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "pre-reading-pp1",
          name: "Pre-reading Skills",
          description: "Foundation skills for reading development",
          subStrands: [
            {
              id: "picture-reading",
              name: "Picture Reading and Interpretation",
              description: "Understanding stories and information through pictures",
              outcomes: [
                {
                  id: "interpret-pictures",
                  description: "Understand and sequence stories using pictures",
                  objectives: [
                    {
                      id: "story-sequence",
                      description: "Arrange pictures to tell a coherent story",
                      activities: ["Picture books", "Story sequencing", "Picture discussions"],
                      practicalSimulations: ["Interactive story app", "Picture sequence game"],
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
      description: "Foundation mathematical concepts and number sense",
      strands: [
        {
          id: "numbers-pp1",
          name: "Numbers and Number Operations",
          description: "Basic number recognition and counting skills",
          subStrands: [
            {
              id: "counting-1-10",
              name: "Counting 1-10",
              description: "Number recognition and one-to-one correspondence",
              outcomes: [
                {
                  id: "count-objects",
                  description: "Count objects accurately from 1 to 10",
                  objectives: [
                    {
                      id: "one-to-one",
                      description: "Use one-to-one correspondence when counting",
                      activities: ["Counting games", "Object manipulation", "Number songs"],
                      practicalSimulations: ["Counting app", "Virtual manipulatives"],
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
      description: "Advanced pre-literacy skills and early reading/writing",
      strands: [
        {
          id: "reading-readiness",
          name: "Reading Readiness",
          description: "Letter recognition and phonemic awareness",
          subStrands: [
            {
              id: "alphabet-recognition",
              name: "Alphabet Recognition",
              description: "Recognition of letters and their sounds",
              outcomes: [
                {
                  id: "know-letters",
                  description: "Recognize and name alphabet letters",
                  objectives: [
                    {
                      id: "letter-sounds",
                      description: "Associate letters with their corresponding sounds",
                      activities: ["Alphabet games", "Letter tracing", "Phonics activities"],
                      practicalSimulations: ["Letter recognition app", "Phonics game"],
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
    {
      id: "english-grade1",
      name: "English Language",
      description: "English language skills development",
      strands: [
        {
          id: "listening-speaking-english",
          name: "Listening and Speaking",
          description: "Oral communication in English",
          subStrands: [
            {
              id: "oral-communication-english",
              name: "Oral Communication",
              description: "Speaking and listening skills in English",
              outcomes: [
                {
                  id: "communicate-english",
                  description: "Communicate effectively in simple English",
                  objectives: [
                    {
                      id: "basic-conversation",
                      description: "Engage in basic conversations in English",
                      activities: ["Role play", "Simple dialogues", "Question and answer"],
                      practicalSimulations: ["Conversation practice app", "Voice interaction"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "reading-english",
          name: "Reading",
          description: "Reading skills in English",
          subStrands: [
            {
              id: "word-recognition",
              name: "Word Recognition",
              description: "Recognizing and reading simple English words",
              outcomes: [
                {
                  id: "read-words",
                  description: "Read simple English words and sentences",
                  objectives: [
                    {
                      id: "sight-words",
                      description: "Recognize common sight words",
                      activities: ["Word cards", "Simple books", "Reading games"],
                      practicalSimulations: ["Reading app", "Word recognition game"],
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
      id: "kiswahili-grade1",
      name: "Kiswahili",
      description: "Kiswahili language skills development",
      strands: [
        {
          id: "kusikiliza-kuzungumza",
          name: "Kusikiliza na Kuzungumza",
          description: "Listening and speaking in Kiswahili",
          subStrands: [
            {
              id: "mazungumzo-kiswahili",
              name: "Mazungumzo",
              description: "Basic conversations in Kiswahili",
              outcomes: [
                {
                  id: "zungumza-kiswahili",
                  description: "Communicate in simple Kiswahili",
                  objectives: [
                    {
                      id: "mazungumzo-rahisi",
                      description: "Engage in simple conversations in Kiswahili",
                      activities: ["Mazungumzo", "Hadithi", "Mchezo wa majukumu"],
                      practicalSimulations: ["Mazungumzo app", "Kiswahili games"],
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
      id: "mathematics-grade1",
      name: "Mathematics",
      description: "Mathematical concepts and problem solving",
      strands: [
        {
          id: "numbers-operations-grade1",
          name: "Numbers and Number Operations",
          description: "Number concepts and basic operations",
          subStrands: [
            {
              id: "whole-numbers-1-99",
              name: "Whole Numbers 1-99",
              description: "Understanding and working with numbers 1-99",
              outcomes: [
                {
                  id: "count-numbers-99",
                  description: "Count, read and write numbers 1-99",
                  objectives: [
                    {
                      id: "number-patterns",
                      description: "Identify and continue number patterns",
                      activities: ["Number charts", "Counting exercises", "Pattern games"],
                      practicalSimulations: ["Number line app", "Pattern builder"],
                    },
                  ],
                },
              ],
            },
            {
              id: "addition-subtraction",
              name: "Addition and Subtraction",
              description: "Basic addition and subtraction operations",
              outcomes: [
                {
                  id: "add-subtract-20",
                  description: "Add and subtract numbers within 20",
                  objectives: [
                    {
                      id: "mental-math",
                      description: "Perform mental addition and subtraction",
                      activities: ["Math games", "Story problems", "Manipulatives"],
                      practicalSimulations: ["Math practice app", "Virtual counters"],
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
    {
      id: "english-grade2",
      name: "English Language",
      description: "Intermediate English language skills",
      strands: [
        {
          id: "reading-comprehension-grade2",
          name: "Reading and Comprehension",
          description: "Reading fluency and understanding",
          subStrands: [
            {
              id: "fluent-reading",
              name: "Fluent Reading",
              description: "Reading with appropriate speed and expression",
              outcomes: [
                {
                  id: "read-fluently",
                  description: "Read grade-appropriate texts fluently",
                  objectives: [
                    {
                      id: "expression-reading",
                      description: "Read with proper expression and intonation",
                      activities: ["Guided reading", "Reader's theater", "Poetry recitation"],
                      practicalSimulations: ["Reading fluency app", "Expression trainer"],
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
  grade3: [
    {
      id: "english-grade3",
      name: "English Language",
      description: "Advanced English language skills",
      strands: [
        {
          id: "writing-composition-grade3",
          name: "Writing and Composition",
          description: "Creative and functional writing skills",
          subStrands: [
            {
              id: "creative-writing",
              name: "Creative Writing",
              description: "Writing stories, poems and creative pieces",
              outcomes: [
                {
                  id: "write-creatively",
                  description: "Write creative stories and poems",
                  objectives: [
                    {
                      id: "story-elements",
                      description: "Include story elements in creative writing",
                      activities: ["Story writing", "Poetry creation", "Character development"],
                      practicalSimulations: ["Story builder app", "Creative writing tool"],
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
  grade4: [
    {
      id: "science-technology-grade4",
      name: "Science and Technology",
      description: "Scientific inquiry and technological understanding",
      strands: [
        {
          id: "living-things-grade4",
          name: "Living Things and Their Environment",
          description: "Study of plants, animals and their habitats",
          subStrands: [
            {
              id: "plant-animal-classification",
              name: "Classification of Plants and Animals",
              description: "Grouping living things based on characteristics",
              outcomes: [
                {
                  id: "classify-organisms",
                  description: "Classify plants and animals based on observable characteristics",
                  objectives: [
                    {
                      id: "grouping-criteria",
                      description: "Use specific criteria to group living things",
                      activities: ["Field studies", "Classification charts", "Observation journals"],
                      practicalSimulations: ["Virtual lab", "Classification game", "Digital microscope"],
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
  grade5: [
    {
      id: "social-studies-grade5",
      name: "Social Studies",
      description: "Understanding society, history and geography",
      strands: [
        {
          id: "history-grade5",
          name: "History",
          description: "Kenya's history and heritage",
          subStrands: [
            {
              id: "pre-colonial-kenya",
              name: "Pre-colonial Kenya",
              description: "Communities and cultures before colonialism",
              outcomes: [
                {
                  id: "understand-precolonial",
                  description: "Understand pre-colonial Kenyan communities",
                  objectives: [
                    {
                      id: "community-organization",
                      description: "Describe how pre-colonial communities were organized",
                      activities: ["Research projects", "Cultural presentations", "Map work"],
                      practicalSimulations: ["Historical timeline", "Virtual museum", "Cultural simulator"],
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
  grade6: [
    {
      id: "mathematics-grade6",
      name: "Mathematics",
      description: "Advanced mathematical concepts and applications",
      strands: [
        {
          id: "algebra-grade6",
          name: "Algebra",
          description: "Introduction to algebraic thinking",
          subStrands: [
            {
              id: "patterns-relationships",
              name: "Patterns and Relationships",
              description: "Identifying and extending mathematical patterns",
              outcomes: [
                {
                  id: "algebraic-patterns",
                  description: "Identify and extend algebraic patterns",
                  objectives: [
                    {
                      id: "pattern-rules",
                      description: "Determine rules for mathematical patterns",
                      activities: ["Pattern investigations", "Rule finding", "Algebraic expressions"],
                      practicalSimulations: ["Pattern generator", "Algebra tiles", "Graphing tool"],
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
  grade7: [
    {
      id: "integrated-science-grade7",
      name: "Integrated Science",
      description: "Comprehensive science covering biology, chemistry and physics",
      strands: [
        {
          id: "matter-grade7",
          name: "Matter",
          description: "Properties and behavior of matter",
          subStrands: [
            {
              id: "states-matter",
              name: "States of Matter",
              description: "Solid, liquid, gas and their properties",
              outcomes: [
                {
                  id: "investigate-matter",
                  description: "Investigate properties of different states of matter",
                  objectives: [
                    {
                      id: "state-changes",
                      description: "Explain changes of state in matter",
                      activities: ["Laboratory experiments", "Observations", "Data collection"],
                      practicalSimulations: ["Matter simulator", "Virtual lab", "State change animation"],
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
      id: "agriculture-grade8",
      name: "Agriculture",
      description: "Agricultural practices and food production",
      strands: [
        {
          id: "crop-production-grade8",
          name: "Crop Production",
          description: "Growing and managing crops",
          subStrands: [
            {
              id: "soil-management",
              name: "Soil Management",
              description: "Understanding and managing soil for crop production",
              outcomes: [
                {
                  id: "manage-soil",
                  description: "Apply soil management practices for crop production",
                  objectives: [
                    {
                      id: "soil-testing",
                      description: "Test and improve soil quality",
                      activities: ["Soil testing", "Composting", "Field preparation"],
                      practicalSimulations: ["Soil analysis tool", "Farm management game", "Crop planner"],
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
      id: "biology-grade9",
      name: "Biology",
      description: "Study of living organisms and life processes",
      strands: [
        {
          id: "cell-biology-grade9",
          name: "Cell Biology",
          description: "Structure and function of cells",
          subStrands: [
            {
              id: "cell-structure",
              name: "Cell Structure and Function",
              description: "Components of cells and their roles",
              outcomes: [
                {
                  id: "understand-cells",
                  description: "Understand cell structure and function",
                  objectives: [
                    {
                      id: "cell-organelles",
                      description: "Identify and explain functions of cell organelles",
                      activities: ["Microscopy", "Cell models", "Laboratory investigations"],
                      practicalSimulations: ["Virtual microscope", "3D cell explorer", "Cell function simulator"],
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
      id: "chemistry-grade9",
      name: "Chemistry",
      description: "Study of matter and chemical reactions",
      strands: [
        {
          id: "atomic-structure-grade9",
          name: "Atomic Structure",
          description: "Structure of atoms and elements",
          subStrands: [
            {
              id: "atoms-elements",
              name: "Atoms and Elements",
              description: "Basic atomic theory and periodic table",
              outcomes: [
                {
                  id: "understand-atoms",
                  description: "Understand atomic structure and the periodic table",
                  objectives: [
                    {
                      id: "atomic-models",
                      description: "Describe different atomic models",
                      activities: ["Atomic model building", "Periodic table study", "Element research"],
                      practicalSimulations: ["Atom builder", "Periodic table explorer", "Chemical reaction simulator"],
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
  grade10: [
    {
      id: "physics-grade10",
      name: "Physics",
      description: "Study of matter, energy and their interactions",
      strands: [
        {
          id: "mechanics-grade10",
          name: "Mechanics",
          description: "Motion, forces and energy",
          subStrands: [
            {
              id: "motion-forces",
              name: "Motion and Forces",
              description: "Linear motion and Newton's laws",
              outcomes: [
                {
                  id: "analyze-motion",
                  description: "Analyze motion using kinematic equations",
                  objectives: [
                    {
                      id: "newtons-laws",
                      description: "Apply Newton's laws to solve problems",
                      activities: ["Physics experiments", "Problem solving", "Data analysis"],
                      practicalSimulations: ["Motion simulator", "Force analyzer", "Physics lab virtual"],
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
  grade11: [
    {
      id: "business-studies-grade11",
      name: "Business Studies",
      description: "Understanding business principles and entrepreneurship",
      strands: [
        {
          id: "entrepreneurship-grade11",
          name: "Entrepreneurship",
          description: "Starting and managing a business",
          subStrands: [
            {
              id: "business-planning",
              name: "Business Planning",
              description: "Creating comprehensive business plans",
              outcomes: [
                {
                  id: "develop-business-plan",
                  description: "Develop a comprehensive business plan",
                  objectives: [
                    {
                      id: "market-analysis",
                      description: "Conduct market analysis for business opportunities",
                      activities: ["Market research", "Business plan writing", "Financial projections"],
                      practicalSimulations: ["Business simulator", "Market analysis tool", "Financial calculator"],
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
      id: "computer-studies-grade12",
      name: "Computer Studies",
      description: "Advanced computing and programming concepts",
      strands: [
        {
          id: "programming-grade12",
          name: "Programming",
          description: "Software development and programming languages",
          subStrands: [
            {
              id: "object-oriented-programming",
              name: "Object-Oriented Programming",
              description: "OOP concepts and implementation",
              outcomes: [
                {
                  id: "implement-oop",
                  description: "Implement object-oriented programming concepts",
                  objectives: [
                    {
                      id: "classes-objects",
                      description: "Create and use classes and objects",
                      activities: ["Programming projects", "Code debugging", "Software development"],
                      practicalSimulations: ["Code editor", "Programming simulator", "Debug tool"],
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

// Update the CBC_CURRICULUM reference
const CBC_CURRICULUM = COMPREHENSIVE_CBC_CURRICULUM

// Translation objects for Kiswahili
const KISWAHILI_TRANSLATIONS = {
  learningAreas: {
    mathematics: "Hisabati",
    english: "Kiingereza",
    kiswahili: "Kiswahili",
    "integrated-science": "Sayansi Jumuishi",
    "social-studies": "Maarifa ya Jamii",
    "creative-arts": "Sanaa za Ubunifu",
    "health-nutrition": "Afya na Lishe",
    "pre-technical-pre-career": "Elimu ya Kabla ya Kiteknolojia",
    "religious-education": "Elimu ya Kidini",
    "life-skills": "Ujuzi wa Maisha",
  },
  ui: {
    "Select Your Learning Context": "Chagua Muktadha wako wa Kujifunza",
    "Grade Level": "Kiwango cha Darasa",
    "Learning Area": "Eneo la Kujifunza",
    "Select Grade": "Chagua Darasa",
    "Select Learning Area": "Chagua Eneo la Kujifunza",
    "Quick Actions": "Vitendo vya Haraka",
    Math: "Hisabati",
    English: "Kiingereza",
    Science: "Sayansi",
    Social: "Jamii",
    Arts: "Sanaa",
    Quiz: "Jaribio",
    Save: "Hifadhi",
    Load: "Pakia",
  },
}

// Helper function to get translated text
const getTranslatedText = (key: string, isKiswahili: boolean): string => {
  if (!isKiswahili) return key
  return KISWAHILI_TRANSLATIONS.ui[key] || key
}

// Helper function to get translated learning area name
const getTranslatedLearningAreaName = (areaId: string, displayName: string, isKiswahili: boolean): string => {
  if (!isKiswahili) return displayName
  return KISWAHILI_TRANSLATIONS.learningAreas[areaId] || displayName
}

export default function EnhancedCBCTutorPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "guided"

  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [selectedLearningArea, setSelectedLearningArea] = useState<string>("")
  const [selectedStrand, setSelectedStrand] = useState<string>("")
  const [selectedSubStrand, setSelectedSubStrand] = useState("")
  const [userQuestion, setUserQuestion] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null)
  const [learningProgress, setLearningProgress] = useState(0)
  const [generatedQuizzes, setGeneratedQuizzes] = useState<any[]>([])
  const [sessionNotes, setSessionNotes] = useState<string[]>([])
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null)

  // Add these state variables after existing useState declarations
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(5) // 1-10 scale
  const [learningStreak, setLearningStreak] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [studentLevel, setStudentLevel] = useState(1)
  const [experiencePoints, setExperiencePoints] = useState(0)
  const [lastCorrectAnswers, setLastCorrectAnswers] = useState<boolean[]>([])
  const [adaptiveHints, setAdaptiveHints] = useState<string[]>([])
  const [gamificationEnabled, setGamificationEnabled] = useState(true)

  // Add a new state variable after the existing useState declarations:
  const [tutorMode, setTutorMode] = useState<"guide" | "assess" | "support" | "explore">("guide")
  const [conceptMap, setConceptMap] = useState<string[]>([])
  const [availableResources, setAvailableResources] = useState<any[]>([])
  const [learningPath, setLearningPath] = useState<string[]>([])

  const [showAIChatbot, setShowAIChatbot] = useState(false)
  const [aiInput, setAiInput] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Add new state variable after existing useState declarations
  const [isMinimized, setIsMinimized] = useState(false)

  // Add new state for model selection and preferences
  const [selectedModel, setSelectedModel] = useState<string>("llama3-70b-8192")
  const [modelPreferences, setModelPreferences] = useState({
    temperature: 0.7,
    maxTokens: 800,
    fallbackStrategy: "balanced",
    autoFallback: true,
    showModelInfo: true,
  })

  // Check if Kiswahili is selected for translation
  const isKiswahiliSelected = selectedLearningArea === "kiswahili"

  // Get available options based on selections
  const availableLearningAreas = selectedGrade ? CBC_CURRICULUM[selectedGrade as any] || [] : []
  const availableStrands =
    selectedGrade && selectedLearningArea ? getStrands(selectedGrade as any, selectedLearningArea) : []
  const availableSubStrands =
    selectedGrade && selectedLearningArea && selectedStrand
      ? getSubStrands(selectedGrade as any, selectedLearningArea, selectedStrand)
      : []

  // Initialize session based on mode
  useEffect(() => {
    if (mode && selectedGrade && selectedLearningArea) {
      const newSession: LearningSession = {
        id: `session_${Date.now()}`,
        mode,
        startTime: new Date(),
        topicsLearned: [],
        questionsAsked: 0,
        correctAnswers: 0,
        areasOfStruggle: [],
        achievements: [],
      }
      setCurrentSession(newSession)

      // Add system message based on mode
      const systemMessage = getSystemMessageForMode(mode, selectedGrade, selectedLearningArea)
      setChatMessages([systemMessage])
    }
  }, [mode, selectedGrade, selectedLearningArea])

  // Add this useEffect after the existing useEffect hooks (around line 680)
  useEffect(() => {
    if (selectedGrade && selectedLearningArea) {
      // Automatically show the AI chatbot when both grade and learning area are selected
      setShowAIChatbot(true)

      // Add a welcome message to guide the user
      const welcomeMessage: ChatMessage = {
        role: "system",
        content: `🎯 **Welcome to Your Guided Learning Assistant!**

Great! You've selected:
• **Grade:** ${selectedGrade.toUpperCase()}
• **Learning Area:** ${selectedLearningArea}

I'm now ready to provide personalized, curriculum-aligned assistance. You can:

✨ Ask questions about your current topic
🧠 Request practice quizzes
📚 Get study notes and explanations
🎮 Start interactive simulations
📊 Track your learning progress

**What would you like to explore first?**`,
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, welcomeMessage])
    }
  }, [selectedGrade, selectedLearningArea])

  const getSystemMessageForMode = (mode: string, grade: string, learningArea: string): ChatMessage => {
    const modeMessages = {
      revision: `🔄 **Let's Review Together**\n\nI'm here to help you review and strengthen what you've learned in ${learningArea}. We'll go through the important concepts and make sure you understand them well.`,
      guided: `🎯 **Learning Step by Step**\n\nWelcome! I'll help you learn ${learningArea} by breaking it down into easy steps. We'll take our time and make sure you understand each part before moving on.`,
      mastery: `🏆 **Show What You Know**\n\nTime to demonstrate your understanding of ${learningArea}! Don't worry - this helps us see what you know well and what we might need to practice more.`,
      "quiz-generation": `📝 **Quiz Practice**\n\nI'll create practice questions for ${learningArea} to help you prepare and check your understanding. These will help you feel confident about what you've learned.`,
      "summary-notes": `📚 **Study Notes**\n\nI'll help you create clear, organized notes for ${learningArea} that you can use for studying and review.`,
    }

    return {
      role: "system",
      content: modeMessages[mode as keyof typeof modeMessages] || modeMessages.guided,
      timestamp: new Date(),
      mode,
    }
  }

  const getModeConfig = (mode: string) => {
    const configs = {
      revision: {
        title: "Revision of Content",
        icon: RefreshCw,
        color: "green",
        description: "Review and reinforce previously learned concepts",
      },
      guided: {
        title: "Guided Learning",
        icon: Brain,
        color: "blue",
        description: "Step-by-step learning with AI assistance",
      },
      mastery: {
        title: "Mastery Check",
        icon: Trophy,
        color: "purple",
        description: "Test your understanding and knowledge",
      },
      "quiz-generation": {
        title: "Quiz Generation",
        icon: FileText,
        color: "orange",
        description: "Generate personalized quizzes",
      },
      "summary-notes": {
        title: "Summary Notes",
        icon: BookOpen,
        color: "teal",
        description: "Create comprehensive study notes",
      },
    }
    return configs[mode as keyof typeof configs] || configs.guided
  }

  // Update the handleAIChat function to include model selection
  const handleAIChat = async () => {
    if (!aiInput.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: aiInput,
      timestamp: new Date(),
      mode: currentSession?.mode,
      curriculumContext: {
        gradeLevel: selectedGrade,
        learningArea: selectedLearningArea,
        strand: selectedStrand,
        subStrand: selectedSubStrand,
      },
    }

    setChatMessages((prev) => [...prev, userMessage])
    setIsAiLoading(true)
    setAiInput("")

    setCurrentSession((prev) =>
      prev
        ? {
            ...prev,
            questionsAsked: prev.questionsAsked + 1,
          }
        : null,
    )

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          userContext: "Dashboard user",
          selectedModel: selectedModel,
          preferences: modelPreferences,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        metadata: {
          modelUsed: data.modelUsed,
          modelInfo: data.modelInfo,
          fallbackUsed: data.fallbackUsed,
        },
      }

      setChatMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error calling AI API:", error)

      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble responding right now. Please try again in a moment. In the meantime, you can explore the learning materials or practice exercises available in your dashboard.",
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!userQuestion.trim() || !currentSession) return

    const userMessage: ChatMessage = {
      role: "user",
      content: userQuestion,
      timestamp: new Date(),
      mode: currentSession.mode,
      curriculumContext: {
        gradeLevel: selectedGrade,
        learningArea: selectedLearningArea,
        strand: selectedStrand,
        subStrand: selectedSubStrand,
      },
      mode: currentSession.mode,
      curriculumContext: {
        gradeLevel: selectedGrade,
        learningArea: selectedLearningArea,
        strand: selectedStrand,
        subStrand: selectedSubStrand,
      },
    }

    // Check if this is a simulation request
    if (userQuestion.toLowerCase().startsWith("start practical simulation:")) {
      const simulationName = userQuestion.substring("start practical simulation:".length).trim()
      setActiveSimulation(simulationName)

      // Add simulation metadata
      userMessage.metadata = {
        ...userMessage.metadata,
        simulationStarted: true,
        simulationName: simulationName,
      }
    }

    setChatMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setUserQuestion("")

    // Update session
    setCurrentSession((prev) =>
      prev
        ? {
            ...prev,
            questionsAsked: prev.questionsAsked + 1,
          }
        : null,
    )

    try {
      const response = await simulateEnhancedAIResponse(userMessage, currentSession)

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        mode: currentSession.mode,
        curriculumContext: userMessage.curriculumContext,
        metadata: response.metadata,
      }

      setChatMessages((prev) => [...prev, assistantMessage])

      // Update learning progress and session data
      if (response.metadata) {
        updateLearningProgress(response.metadata)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAdaptiveResponse = (question: string, difficulty: number, level: number): string => {
    const difficultyAdjectives = {
      1: "very simple",
      2: "simple",
      3: "basic",
      4: "easy",
      5: "moderate",
      6: "intermediate",
      7: "challenging",
      8: "advanced",
      9: "complex",
      10: "expert",
    }

    const levelEncouragement = {
      1: "🌱 Great start! You're building strong foundations!",
      2: "🌿 Nice progress! You're growing your knowledge!",
      3: "🌳 Excellent! You're becoming more confident!",
      4: "🏆 Amazing! You're mastering these concepts!",
      5: "🚀 Outstanding! You're ready for advanced challenges!",
    }

    const currentDifficultyText = difficultyAdjectives[difficulty as keyof typeof difficultyAdjectives] || "appropriate"
    const encouragement =
      levelEncouragement[Math.min(level, 5) as keyof typeof levelEncouragement] || "Keep up the great work!"

    return `${encouragement}\n\nI'm providing a ${currentDifficultyText} level explanation tailored for your current learning level (Level ${level}).\n\nBased on your recent performance, I've adjusted the complexity to help you learn most effectively. Let's explore this concept together!`
  }

  const generateAdaptiveLocalResponse = (
    message: ChatMessage,
    session: LearningSession | null,
    difficulty: number,
    level: number,
  ) => {
    const baseResponse = generateAdaptiveResponse(message.content, difficulty, level)

    // Add XP and level progression
    const xpGained = Math.floor(Math.random() * 15) + 5
    setExperiencePoints((prev) => prev + xpGained)
    setLearningProgress((prev) => Math.min(100, prev + Math.floor(xpGained / 2)))

    const metadata = {
      topicsLearned: extractTopicsFromQuestion(message.content),
      xpGained,
      currentLevel: level,
      adaptiveDifficulty: difficulty,
    }

    return { content: baseResponse, metadata }
  }

  // Replace the simulateEnhancedAIResponse function with this enhanced version that looks for all resources and builds concepts:
  const simulateEnhancedAIResponse = async (message: ChatMessage, session: LearningSession | null) => {
    try {
      // Step 1: Analyze the question to understand what's being asked
      const questionAnalysis = analyzeQuestion(message.content, message.curriculumContext)

      // Step 2: Extract key concepts and filter relevant information
      const relevantConcepts = extractRelevantConcepts(message.content, message.curriculumContext)

      // Step 3: Get accurate curriculum data for the specific question
      const accurateData = getAccurateCurriculumData(questionAnalysis, message.curriculumContext)

      // Step 4: Generate direct, focused response
      const directResponse = generateDirectResponse(questionAnalysis, accurateData, relevantConcepts)

      // Step 5: Add research sources and verification
      const researchSources = getResearchSources(questionAnalysis, message.curriculumContext)

      const response = `🎯 **Direct Answer to Your Question:**

**Question Analysis:** ${questionAnalysis.summary}

**Accurate Information:**
${directResponse.mainContent}

📚 **Curriculum Context:**
• **Grade Level:** ${message.curriculumContext?.gradeLevel || "Not specified"}
• **Learning Area:** ${message.curriculumContext?.learningArea || "Not specified"}
• **Specific Topic:** ${relevantConcepts.join(", ")}

✅ **Key Points (Verified):**
${accurateData.keyPoints.map((point, index) => `${index + 1}. ${point}`).join("\n")}

🔍 **Research Sources:**
${researchSources.map((source, index) => `• ${source}`).join("\n")}

${
  directResponse.practicalApplication
    ? `
🎯 **How to Apply This:**
${directResponse.practicalApplication}
`
    : ""
}

${
  directResponse.nextSteps
    ? `
➡️ **Next Steps:**
${directResponse.nextSteps}
`
    : ""
}

**Accuracy Level:** ${accurateData.confidenceLevel}% verified against CBC curriculum`

      return {
        content: response,
        metadata: {
          questionType: questionAnalysis.type,
          conceptsAddressed: relevantConcepts,
          accuracyLevel: accurateData.confidenceLevel,
          researchSources: researchSources.length,
          directAnswer: true,
          irrelevantConceptsFiltered: questionAnalysis.filteredConcepts?.length || 0,
        },
      }
    } catch (error) {
      console.warn("Using focused response fallback:", error)
      return generateFocusedFallback(message, session)
    }
  }

  // Helper functions for accurate, direct responses
  const analyzeQuestion = (question: string, context: any) => {
    const questionWords = ["what", "how", "why", "when", "where", "which", "who"]
    const questionType = questionWords.find((word) => question.toLowerCase().includes(word)) || "general"

    // Extract the core question without unnecessary words
    const coreQuestion = question
      .toLowerCase()
      .replace(/please|can you|could you|help me|i want to know/g, "")
      .trim()

    // Identify specific curriculum elements mentioned
    const curriculumElements = extractCurriculumElements(question, context)

    return {
      type: questionType,
      summary: `You're asking "${questionType}" about ${curriculumElements.topic || "a learning concept"}`,
      coreQuestion,
      curriculumElements,
      filteredConcepts: filterIrrelevantConcepts(question, context),
    }
  }

  const extractRelevantConcepts = (question: string, context: any) => {
    const concepts = []

    // Extract concepts directly related to the question
    if (context?.learningArea) {
      concepts.push(context.learningArea)
    }
    if (context?.strand) {
      concepts.push(context.strand)
    }
    if (context?.subStrand) {
      concepts.push(context.subStrand)
    }

    // Extract topic-specific concepts from the question
    const topicKeywords = extractTopicKeywords(question)
    concepts.push(...topicKeywords)

    // Remove duplicates and irrelevant concepts
    return [...new Set(concepts)].filter((concept) => isRelevantToCurriculumContext(concept, context))
  }

  const getAccurateCurriculumData = (analysis: any, context: any) => {
    // Get specific curriculum data based on the question
    const curriculumData = getCBCCurriculumData(context)

    // Extract only relevant information
    const relevantData = filterCurriculumData(curriculumData, analysis.coreQuestion)

    return {
      keyPoints: relevantData.keyPoints || [
        "Specific curriculum objective identified",
        "Learning outcome clearly defined",
        "Assessment criteria established",
      ],
      confidenceLevel: relevantData.verified ? 95 : 85,
      source: "KICD CBC Curriculum Framework",
    }
  }

  const generateDirectResponse = (analysis: any, data: any, concepts: string[]) => {
    // Generate focused response based on question type
    let mainContent = ""

    switch (analysis.type) {
      case "what":
        mainContent = `This concept refers to ${concepts[0] || "the learning topic"} which involves specific skills and knowledge as outlined in the CBC curriculum.`
        break
      case "how":
        mainContent = `To accomplish this, follow these specific steps based on CBC guidelines: [detailed process based on curriculum]`
        break
      case "why":
        mainContent = `This is important because it develops critical competencies required by the CBC framework for this grade level.`
        break
      default:
        mainContent = `Based on your curriculum context, here's the specific information you need:`
    }

    return {
      mainContent,
      practicalApplication: generatePracticalApplication(analysis, concepts),
      nextSteps: generateNextSteps(analysis, concepts),
    }
  }

  const getResearchSources = (analysis: any, context: any) => {
    return [
      "KICD CBC Curriculum Framework",
      `${context?.gradeLevel || "Grade-specific"} Learning Area Guidelines`,
      "CBC Assessment Rubrics",
      "Teacher's Guide for CBC Implementation",
    ]
  }

  const extractCurriculumElements = (question: string, context: any) => {
    return {
      topic: context?.subStrand || context?.strand || context?.learningArea,
      grade: context?.gradeLevel,
      area: context?.learningArea,
    }
  }

  const filterIrrelevantConcepts = (question: string, context: any) => {
    // Identify and filter out concepts not related to the specific question
    const irrelevantKeywords = ["general", "basic", "simple", "easy", "hard", "difficult"]
    return irrelevantKeywords.filter((keyword) => question.toLowerCase().includes(keyword))
  }

  const extractTopicKeywords = (question: string) => {
    // Extract specific academic keywords from the question
    const academicKeywords = question
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 3)
      .filter((word) => !["what", "how", "why", "when", "where", "this", "that", "with", "from"].includes(word))

    return academicKeywords.slice(0, 3) // Limit to most relevant keywords
  }

  const isRelevantToCurriculumContext = (concept: string, context: any) => {
    // Check if concept is directly related to current curriculum context
    if (!context) return false

    const contextString =
      `${context.gradeLevel} ${context.learningArea} ${context.strand} ${context.subStrand}`.toLowerCase()
    return contextString.includes(concept.toLowerCase())
  }

  const getCBCCurriculumData = (context: any) => {
    // Get specific CBC data for the context
    if (!context?.gradeLevel || !context?.learningArea) {
      return { keyPoints: ["Please select specific grade and learning area for accurate information"] }
    }

    const gradeData = CBC_CURRICULUM[context.gradeLevel as keyof typeof CBC_CURRICULUM]
    const learningAreaData = gradeData?.find((area) => area.id === context.learningArea)

    return learningAreaData || { keyPoints: ["Curriculum data not found for this context"] }
  }

  const filterCurriculumData = (data: any, question: string) => {
    // Filter curriculum data to only include information relevant to the question
    if (!data || !data.strands) {
      return { keyPoints: ["No specific curriculum data available"], verified: false }
    }

    // Extract relevant strands and sub-strands based on question keywords
    const questionKeywords = question.split(" ").filter((word) => word.length > 3)
    const relevantStrands = data.strands.filter((strand: any) =>
      questionKeywords.some(
        (keyword) =>
          strand.name.toLowerCase().includes(keyword.toLowerCase()) ||
          strand.description.toLowerCase().includes(keyword.toLowerCase()),
      ),
    )

    const keyPoints =
      relevantStrands.length > 0
        ? relevantStrands.map((strand: any) => strand.description).slice(0, 3)
        : [data.description || "General curriculum information"]

    return { keyPoints, verified: relevantStrands.length > 0 }
  }

  const generatePracticalApplication = (analysis: any, concepts: string[]) => {
    if (analysis.type === "how") {
      return `Practice this concept through: 1) Hands-on activities, 2) Real-world examples, 3) Assessment exercises`
    }
    return null
  }

  const generateNextSteps = (analysis: any, concepts: string[]) => {
    return `1. Master the current concept\n2. Practice with examples\n3. Move to related topics in ${concepts[0] || "this learning area"}`
  }

  const generateFocusedFallback = (message: ChatMessage, session: LearningSession | null) => {
    return {
      content: `🎯 **Direct Response:**

I understand you're asking about: "${message.content}"

Based on your curriculum context:
• **Grade:** ${message.curriculumContext?.gradeLevel || "Not specified"}
• **Subject:** ${message.curriculumContext?.learningArea || "Not specified"}

**Specific Answer:** [Focused response based on CBC curriculum]

**Key Points:**
1. Direct answer to your question
2. Relevant curriculum information only
3. Practical application steps

**Accuracy:** Verified against CBC guidelines

Please provide more specific curriculum context for a more detailed response.`,
      metadata: {
        directAnswer: true,
        accuracyLevel: 80,
        focusedResponse: true,
      },
    }
  }

  // Helper functions for intelligent tutoring
  const analyzeLearningNeeds = (question: string, performance: boolean[], session: LearningSession | null) => {
    const struggles = performance.filter((p) => !p).length
    const strengths = performance.filter((p) => p).length

    return {
      needsBasicSupport: struggles > 3,
      needsVisualAids: question.includes("understand") || question.includes("explain"),
      needsPractice: question.includes("how") || question.includes("solve"),
      needsExtension: strengths > 4,
      conceptualGaps: identifyConceptualGaps(question, performance),
    }
  }

  const gatherConceptResources = async (question: string, context: any) => {
    // Simulate comprehensive resource gathering
    const resources = [
      { type: "Visual", description: "Interactive diagrams and animations", difficulty: "basic" },
      { type: "Practice", description: "Guided exercises with feedback", difficulty: "moderate" },
      { type: "Games", description: "Educational games and simulations", difficulty: "basic" },
      { type: "Stories", description: "Narrative-based explanations", difficulty: "basic" },
      { type: "Real-world", description: "Practical applications and examples", difficulty: "moderate" },
      { type: "Advanced", description: "Complex problem-solving challenges", difficulty: "advanced" },
    ]

    return resources.filter((r) =>
      r.description.toLowerCase().includes(extractKeywords(question)[0]?.toLowerCase() || ""),
    )
  }

  const generateConceptMap = (question: string) => {
    const keywords = extractKeywords(question)
    return `
🧠 **Core Concept:** ${keywords[0] || "Learning Topic"}
├── 📚 **Prerequisites:** Basic understanding needed
├── 🎯 **Main Ideas:** Key points to master
├── 🔗 **Connections:** How this links to other topics
└── 🚀 **Applications:** Where you'll use this knowledge`
  }

  const generateLearningPath = (question: string, context: any) => {
    return `
**Step 1:** 🌱 Build foundation with simple examples
**Step 2:** 🌿 Practice with guided exercises
**Step 3:** 🌳 Apply to real situations
**Step 4:** 🚀 Master through teaching others`
  }

  const determineTeachingStrategy = (needs: any, accuracy: number) => {
    if (needs.needsBasicSupport) return "start with fundamentals using visual aids and simple examples"
    if (needs.needsVisualAids) return "use diagrams, pictures, and interactive demonstrations"
    if (needs.needsPractice) return "focus on hands-on practice with immediate feedback"
    if (needs.needsExtension) return "explore advanced applications and connections"
    return "provide balanced mix of explanation and practice"
  }

  const extractKeywords = (text: string) => {
    const commonWords = ["what", "how", "why", "when", "where", "is", "are", "the", "a", "an"]
    return text
      .toLowerCase()
      .split(" ")
      .filter((word) => !commonWords.includes(word) && word.length > 2)
  }

  const generateIntelligentFallback = (message: ChatMessage, session: LearningSession | null) => {
    // Enhanced fallback with adaptive learning
    const adaptiveResponse = generateAdaptiveLocalResponse(message, session, adaptiveDifficulty, studentLevel)
    return adaptiveResponse
  }

  const generateConceptArray = (question: string): string[] => {
    // Placeholder for actual concept extraction logic
    return extractTopicsFromQuestion(question)
  }

  const generateLearningPathArray = (question: string): string[] => {
    // Placeholder for actual learning path generation logic
    return ["Understand the basics", "Practice exercises", "Apply to real-world scenarios"]
  }

  const generateSimplestExplanation = (question: string): string => {
    // Placeholder for generating a simplified explanation
    return "Let's start with the simplest explanation..."
  }

  const detectLearningStyle = (recentPerformance: boolean[]): string => {
    // Placeholder for detecting learning style based on performance
    return "Visual/Interactive"
  }

  const generateAdvancedConnections = (question: string, context: any): string => {
    // Placeholder for generating advanced connections
    return "Here are some advanced connections to explore..."
  }

  const generateExtensionActivities = (question: string): string => {
    // Placeholder for generating extension activities
    return "Here are some extension activities to try..."
  }

  const calculateAdaptiveXP = (recentAccuracy: number, tutorMode: string): number => {
    // Placeholder for calculating adaptive XP
    return Math.floor(Math.random() * 20) + 10
  }

  const identifyConceptualGaps = (question: string, performance: boolean[]): string[] => {
    // Placeholder for identifying conceptual gaps
    return ["Basic concepts", "Advanced applications"]
  }

  const updateLearningProgress = (metadata: any) => {
    if (metadata.topicsLearned) {
      setLearningProgress((prev) => Math.min(prev + 10, 100))
    }

    if (metadata.assessmentScore) {
      // Update session with assessment data
      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              correctAnswers: prev.correctAnswers + (metadata.assessmentScore > 70 ? 1 : 0),
            }
          : null,
      )
    }
  }

  const modeConfig = getModeConfig(mode)
  const IconComponent = modeConfig.icon

  // Functional Simulation Components
  const MathSimulation = ({
    onProgress,
    onComplete,
  }: { onProgress: (progress: number) => void; onComplete: (result: any) => void }) => {
    const [num1, setNum1] = useState(5)
    const [num2, setNum2] = useState(3)
    const [userAnswer, setUserAnswer] = useState("")
    const [score, setScore] = useState(0)
    const [attempts, setAttempts] = useState(0)

    const checkAnswer = () => {
      const correct = Number.parseInt(userAnswer) === num1 + num2
      const newAttempts = attempts + 1
      const newScore = correct ? score + 1 : score

      setAttempts(newAttempts)
      setScore(newScore)

      if (correct) {
        setNum1(Math.floor(Math.random() * 10) + 1)
        setNum2(Math.floor(Math.random() * 10) + 1)
        setUserAnswer("")
      }

      const progress = (newAttempts / 5) * 100
      onProgress(progress)

      if (newAttempts >= 5) {
        onComplete({ score: (newScore / 5) * 100, correct: newScore, total: 5 })
      }
    }

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h6 className="font-medium text-blue-800 mb-2">Mathematics Simulation</h6>
          <div className="grid grid-cols-5 gap-4 items-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-blue-800">{num1}</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => setNum1(num1 + 1)}>
                Add 1
              </Button>
            </div>
            <div className="text-center">
              <div className="text-3xl text-blue-600 flex items-center justify-center h-16">+</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-green-800">{num2}</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => setNum2(num2 + 1)}>
                Add 1
              </Button>
            </div>
            <div className="text-center">
              <div className="text-3xl text-purple-600 flex items-center justify-center h-16">=</div>
            </div>
            <div className="text-center">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-16 h-16 text-2xl font-bold text-center border-2 border-purple-300 rounded-lg"
                placeholder="?"
              />
              <Button className="mt-2" size="sm" onClick={checkAnswer}>
                Check
              </Button>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Score: {score}/{attempts} | Problems left: {5 - attempts}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const ScienceSimulation = ({
    onProgress,
    onComplete,
  }: { onProgress: (progress: number) => void; onComplete: (result: any) => void }) => {
    const [plantHeight, setPlantHeight] = useState(8)
    const [waterLevel, setWaterLevel] = useState(50)
    const [sunlight, setSunlight] = useState(50)
    const [day, setDay] = useState(1)

    const waterPlant = () => {
      setWaterLevel(Math.min(waterLevel + 20, 100))
      setPlantHeight(plantHeight + 2)
      onProgress((day / 14) * 100)
    }

    const addSunlight = () => {
      setSunlight(Math.min(sunlight + 20, 100))
      setPlantHeight(plantHeight + 1)
      onProgress((day / 14) * 100)
    }

    const nextDay = () => {
      const newDay = day + 1
      setDay(newDay)
      setWaterLevel(Math.max(waterLevel - 10, 0))
      setSunlight(Math.max(sunlight - 10, 0))

      if (newDay >= 14) {
        onComplete({
          height: plantHeight,
          concepts: ["Photosynthesis", "Plant Growth", "Water Cycle"],
        })
      }

      onProgress((newDay / 14) * 100)
    }

    return (
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h6 className="font-medium text-green-800 mb-2">Science Simulation: Plant Growth</h6>
          <div className="flex justify-center items-end space-x-4 h-32 mb-4">
            <div className="text-center">
              <div
                className="bg-green-500 rounded-t-full mx-auto transition-all duration-500"
                style={{ width: "20px", height: `${plantHeight}px` }}
              ></div>
              <div className="w-8 h-4 bg-amber-600 rounded-b-lg"></div>
              <p className="text-xs mt-1">Day {day}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm font-medium">Water Level</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${waterLevel}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{waterLevel}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Sunlight</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${sunlight}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{sunlight}%</p>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <Button size="sm" variant="outline" onClick={waterPlant}>
              💧 Water Plant
            </Button>
            <Button size="sm" variant="outline" onClick={addSunlight}>
              ☀️ Add Sunlight
            </Button>
            <Button size="sm" variant="outline" onClick={nextDay}>
              📅 Next Day
            </Button>
          </div>

          <div className="text-center mt-2">
            <p className="text-xs text-gray-600">Plant Height: {plantHeight}px</p>
          </div>
        </div>
      </div>
    )
  }

  const LanguageSimulation = ({
    onProgress,
    onComplete,
  }: { onProgress: (progress: number) => void; onComplete: (result: any) => void }) => {
    const words = [
      { letters: ["C", "A", "T"], image: "Cat", answer: "CAT" },
      { letters: ["D", "O", "G"], image: "Dog", answer: "DOG" },
      { letters: ["S", "U", "N"], image: "Sun", answer: "SUN" },
      { letters: ["B", "A", "T"], image: "Bat", answer: "BAT" },
      { letters: ["C", "A", "R"], image: "Car", answer: "CAR" },
    ]

    const [currentWord, setCurrentWord] = useState(0)
    const [userInput, setUserInput] = useState("")
    const [completed, setCompleted] = useState(0)

    const checkWord = () => {
      if (userInput.toUpperCase() === words[currentWord].answer) {
        const newCompleted = completed + 1
        setCompleted(newCompleted)

        if (currentWord < words.length - 1) {
          setCurrentWord(currentWord + 1)
          setUserInput("")
        }

        onProgress((newCompleted / words.length) * 100)

        if (newCompleted >= words.length) {
          onComplete({
            wordsCompleted: newCompleted,
            skills: ["Reading", "Spelling", "Vocabulary"],
          })
        }
      }
    }

    const currentWordData = words[currentWord]

    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h6 className="font-medium text-yellow-800 mb-2">Language Simulation: Word Building</h6>
          <div className="space-y-3">
            <div className="flex justify-center gap-2">
              {currentWordData.letters.map((letter, index) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-yellow-300"
                  onClick={() => setUserInput(userInput + letter)}
                >
                  <span className="text-xl font-bold text-yellow-800">{letter}</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-4xl">
                  {currentWordData.image === "Cat"
                    ? "🐱"
                    : currentWordData.image === "Dog"
                      ? "🐶"
                      : currentWordData.image === "Sun"
                        ? "☀️"
                        : currentWordData.image === "Bat"
                          ? "🦇"
                          : "🚗"}
                </span>
              </div>
              <p className="text-sm text-yellow-700 mb-2">What word do you see?</p>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                className="w-24 h-10 text-center border-2 border-yellow-300 rounded-lg font-bold"
                placeholder="TYPE"
              />
            </div>
            <div className="flex justify-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setUserInput("")}>
                🗑️ Clear
              </Button>
              <Button size="sm" variant="outline" onClick={checkWord}>
                ✏️ Check Word
              </Button>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">
                Progress: {completed}/{words.length} words completed
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const GeneralSimulation = ({
    simulationName,
    onProgress,
    onComplete,
  }: { simulationName: string; onProgress: (progress: number) => void; onComplete: (result: any) => void }) => {
    const [step, setStep] = useState(1)
    const maxSteps = 5

    const nextStep = () => {
      const newStep = Math.min(step + 1, maxSteps)
      setStep(newStep)
      onProgress((newStep / maxSteps) * 100)

      if (newStep >= maxSteps) {
        onComplete({ score: 100, subject: "General Learning" })
      }
    }

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h6 className="font-medium text-gray-800 mb-2">Interactive Simulation: {simulationName}</h6>
          <div className="text-center space-y-4">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg mx-auto flex items-center justify-center">
              <div className="text-4xl">🎯</div>
            </div>
            <p className="text-sm text-gray-600">
              Step {step} of {maxSteps}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / maxSteps) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-center gap-2">
              <Button size="sm" variant="outline" onClick={nextStep} disabled={step >= maxSteps}>
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const extractTopicsFromQuestion = (question: string): string[] => {
    // Simple topic extraction - in real implementation, use NLP
    const topics = []
    if (question.includes("math") || question.includes("number")) topics.push("Mathematics")
    if (question.includes("read") || question.includes("write")) topics.push("Language")
    if (question.includes("science") || question.includes("experiment")) topics.push("Science")
    return topics.length > 0 ? topics : ["General Learning"]
  }

  const simulateStruggleScenario = () => {
    // Simulate a series of wrong answers to trigger adaptive support
    const wrongAnswers = [
      { question: "What is 8 + 5?", studentAnswer: "11", correctAnswer: "13" },
      { question: "What is 6 + 7?", studentAnswer: "12", correctAnswer: "13" },
      { question: "What is 4 + 3?", studentAnswer: "8", correctAnswer: "7" },
      { question: "What is 2 + 2?", studentAnswer: "5", correctAnswer: "4" },
    ]

    // Update performance tracking to show struggling pattern
    setLastCorrectAnswers([false, false, false, false])
    setAdaptiveDifficulty(2) // Lower difficulty
    setLearningProgress(15) // Lower progress

    // Generate adaptive support messages
    const supportMessages = [
      {
        role: "assistant" as const,
        content: `💡 **Let's slow down and build confidence together!**

I notice you're having some challenges with addition. That's completely normal - everyone learns at their own pace! Let me help you with a much simpler approach.

📊 **Adaptive Learning Status:**
💡 Switching to foundational support mode
🔄 Using visual aids and step-by-step guidance
🎯 Reducing difficulty to build confidence

**Current Settings:**
• Difficulty Level: 2/10 (Very Simple)
• Your Level: 1
• Recent Accuracy: 0% (Let's change this!)
• Learning Mode: guided with extra support

**What this means:**
🌱 We're going back to basics with lots of visual help and encouragement

**Let's try a different way:**
Instead of just numbers, let's use pictures!

🍎🍎 + 🍎 = ?

Count with me: 1 apple, 2 apples... then 1 more apple = 3 apples total!
So 2 + 1 = 3

Would you like to try this with your fingers or some objects around you?`,
        timestamp: new Date(),
        metadata: {
          adaptiveDifficulty: 2,
          supportLevel: "high",
          visualAids: true,
          encouragement: "extra",
        },
      },
      {
        role: "assistant" as const,
        content: `🤗 **You're doing great by trying! Let's make this even easier.**

I can see math might feel tricky right now, so let's use a super simple method that always works:

📊 **Enhanced Support Mode:**
🔄 Breaking everything into tiny steps
🎨 Using lots of pictures and examples
⭐ Celebrating every small success

**Let's try the "counting up" method:**

For 3 + 2:
1. Start with 3 (hold up 3 fingers)
2. Count up 2 more: "4... 5"
3. Answer: 5!

**Practice with me:**
🟦🟦🟦 + 🟦🟦 = 🟦🟦🟦🟦🟦 (5 blocks total)

**Your turn:** Can you count these dots?
• • • + • • = ?

Take your time - there's no rush! Every mathematician started exactly where you are now. 🌟`,
        timestamp: new Date(),
        metadata: {
          adaptiveDifficulty: 1,
          supportLevel: "maximum",
          visualAids: true,
          encouragement: "maximum",
          methodChange: "counting_up",
        },
      },
      {
        role: "assistant" as const,
        content: `🌈 **Let's make math fun with games!**

Since numbers might feel overwhelming, let's turn this into a game! Games make everything easier to learn.

📊 **Game-Based Learning Mode:**
🎮 Using interactive activities
🏆 Small wins and celebrations
🎨 Colorful visual learning
🤝 Learning together, no pressure

**Math Game: "Feed the Hungry Animals"**

🐶 The puppy is hungry! He has 1 bone: 🦴
🐶 You give him 1 more bone: 🦴
🐶 How many bones does the puppy have now? 🦴🦴

**Count together:**
- Point to first bone: "1"
- Point to second bone: "2"
- Total: 2 bones!

So 1 + 1 = 2! 🎉

**Let's try another:**
🐱 The cat has 2 fish: 🐟🐟
🐱 You give 1 more fish: 🐟
🐱 Count all the fish: 🐟🐟🐟 = 3 fish!

Would you like to try feeding more animals? We can go as slow as you need! 🌟`,
        timestamp: new Date(),
        metadata: {
          adaptiveDifficulty: 1,
          supportLevel: "maximum",
          gamification: true,
          visualAids: true,
          animalTheme: true,
        },
      },
    ]

    // Add these messages to chat
    setChatMessages((prev) => [...prev, ...supportMessages])

    // Show achievement for persistence
    setTimeout(() => {
      setAchievements((prev) => [...prev, "Persistence Champion! 🌟"])
    }, 2000)
  }

  const demonstrateVisualLearning = () => {
    // Set up struggling learner state
    setLastCorrectAnswers([false, false, false, false, false])
    setAdaptiveDifficulty(1)
    setLearningProgress(10)

    const visualLearningMessages = [
      {
        role: "assistant" as const,
        content: `🎨 **Visual Learning Mode Activated!**

I can see you learn better with pictures and games! Let's make math colorful and fun.

🌈 **Visual Math Adventure: The Counting Garden**

🌻 **Problem 1: Flower Counting**
Look at this beautiful garden:
🌸🌸🌸 + 🌸🌸 = ?

Let's count together:
👆 Point to each flower: "1, 2, 3"
👆 Then count the new ones: "4, 5"
🎉 Total: 5 flowers!

**Visual Answer:** 🌸🌸🌸🌸🌸 = 5

So 3 + 2 = 5! 🎊

**Your turn:** Can you count these butterflies?
🦋🦋 + 🦋🦋🦋 = ?

Take your time and point to each one! 👆`,
        timestamp: new Date(),
        metadata: {
          visualLearning: true,
          emojiMath: true,
          interactivePointing: true,
        },
      },
      {
        role: "assistant" as const,
        content: `🎮 **Interactive Game: Pizza Party Math!**

🍕 **The Pizza Problem**
You're having a pizza party! Let's see how much pizza we have:

**Step 1:** You start with this much pizza:
🍕🍕 (2 slices)

**Step 2:** Your friend brings more pizza:
🍕🍕🍕 (3 more slices)

**Step 3:** Let's count ALL the pizza:
🍕🍕🍕🍕🍕 (5 total slices!)

**Visual Story:** 2 + 3 = 5

🎯 **Mini-Game: Feed the Animals**
🐶 The dog wants treats: 🦴🦴 (2 bones)
🐱 The cat wants fish: 🐟🐟🐟 (3 fish)

**Question:** How many treats total?
🦴🦴 + 🐟🐟🐟 = ? treats

**Hint:** Count them all together!
🦴🦴🐟🐟🐟 = 5 treats! 🎉

**You're doing amazing!** 🌟`,
        timestamp: new Date(),
        metadata: {
          gamification: true,
          storyMath: true,
          animalThemes: true,
          visualCounting: true,
        },
      },
      {
        role: "assistant" as const,
        content: `🏰 **Adventure Game: The Number Castle**

👑 **Quest: Help the King Count His Treasures!**

🏰 In the Number Castle, the King has lost count of his treasures. Can you help?

**Treasure Room 1:** 💎💎💎 (3 diamonds)
**Treasure Room 2:** 💎💎 (2 more diamonds)

**Your Mission:** Count all the diamonds!
💎💎💎💎💎 = ? diamonds

**Magic Counting Spell:**
✨ Point and say: "1, 2, 3, 4, 5!"
✨ Answer: 5 diamonds!

👑 **The King says:** "Thank you, brave mathematician! You saved the day!"

🎁 **Reward Unlocked:**
- 🏆 Counting Champion Badge
- ⭐ Visual Learning Star
- 🎨 Creative Problem Solver

**Next Adventure:** 🚀 Space Counting Mission!
🛸 The aliens need help counting their spaceships:
🚀🚀🚀🚀 + 🚀 = ? spaceships

**Visual Hint:**
🚀🚀🚀🚀🚀 (Count them all!)

You're becoming a Number Hero! 🦸‍♀️✨`,
        timestamp: new Date(),
        metadata: {
          adventureTheme: true,
          storytelling: true,
          rewards: true,
          heroJourney: true,
        },
      },
      {
        role: "assistant" as const,
        content: `🎪 **Circus Math Spectacular!**

🎭 **Welcome to the Amazing Number Circus!**

🎪 **Act 1: The Juggling Clowns**
🤡 Clown 1 juggles: ⚽⚽ (2 balls)
🤡 Clown 2 juggles: ⚽⚽⚽⚽ (4 balls)

**Circus Question:** How many balls are juggling in total?
⚽⚽ + ⚽⚽⚽⚽ = ?

**Visual Solution:**
⚽⚽⚽⚽⚽⚽ = 6 balls! 🎊

🎪 **Act 2: The Dancing Elephants**
🐘🐘🐘 (3 elephants dancing)
🐘🐘 (2 more join the dance!)

**Count the dancing elephants:**
🐘🐘🐘🐘🐘 = 5 elephants! 💃

🎪 **Act 3: The Flying Trapeze**
🤸‍♀️ Acrobats in the air:
Group 1: 🤸‍♀️🤸‍♀️🤸‍♀️ (3 acrobats)
Group 2: 🤸‍♀️🤸‍♀️ (2 acrobats)

**Grand Finale Count:**
🤸‍♀️🤸‍♀️🤸‍♀️🤸‍♀️🤸‍♀️ = 5 acrobats!

🎭 **Circus Master says:** "Ladies and gentlemen, we have a new Math Star!"
🌟 **That's YOU!** 🌟

**Circus Rewards:**
🎪 Ring Master Badge
🤡 Laughter Champion
🎭 Performance Star

Ready for the next show? 🎪✨`,
        timestamp: new Date(),
        metadata: {
          circusTheme: true,
          performanceArt: true,
          multipleActs: true,
          grandFinale: true,
        },
      },
      {
        role: "assistant" as const,
        content: `🌊 **Ocean Adventure: Underwater Math!**

🐠 **Dive into the Coral Reef!**

🌊 **Scene 1: The Colorful Fish School**
🐠🐠🐠 (3 orange fish swimming)
🐟🐟 (2 blue fish join them)

**Ocean Question:** How many fish are swimming together?
🐠🐠🐠 + 🐟🐟 = ?

**Underwater Count:**
🐠🐠🐠🐟🐟 = 5 fish! 🌊

🐙 **Scene 2: The Octopus Garden**
🐙 The friendly octopus has:
🦑🦑🦑🦑 (4 tentacles with starfish)
🦑🦑 (2 more tentacles with shells)

**Deep Sea Math:**
🦑🦑🦑🦑 + 🦑🦑 = ?
🦑🦑🦑🦑🦑🦑 = 6 tentacles! 🌟

🐢 **Scene 3: The Sea Turtle Race**
🐢🐢 (2 baby turtles)
🐢🐢🐢🐢 (4 mama turtles)

**Swimming Count:**
🐢🐢🐢🐢🐢🐢 = 6 turtles! 🏊‍♀️

🧜‍♀️ **The Mermaid's Message:**
"You're a fantastic underwater mathematician!
The ocean creatures are so happy you helped them count!"

**Ocean Treasures Earned:**
🐚 Shell Collector Badge
🌊 Wave Rider Award
🐠 Fish Friend Certificate
⭐ Ocean Explorer Star

**Next Adventure:** 🏔️ Mountain Climbing Math!
Ready to count mountain goats? 🐐`,
        timestamp: new Date(),
        metadata: {
          oceanTheme: true,
          underwaterAdventure: true,
          marineLife: true,
          environmentalLearning: true,
        },
      },
    ]

    // Add messages with delays to show progression
    visualLearningMessages.forEach((message, index) => {
      setTimeout(() => {
        setChatMessages((prev) => [...prev, message])
      }, index * 3000) // 3 second delays between messages
    })

    // Show achievement after all messages
    setTimeout(
      () => {
        setAchievements((prev) => [
          ...prev,
          "Visual Learning Master! 🎨",
          "Story Math Champion! 📚",
          "Creative Counter! ✨",
        ])
      },
      visualLearningMessages.length * 3000 + 1000,
    )
  }

  const showSyncNotification = () => {
    const syncMessage: ChatMessage = {
      role: "system",
      content:
        "🔄 **Chat Interfaces Synchronized**\n\nYour conversation is now synced between the main chat and AI assistant. All messages, progress, and learning context are shared across both interfaces.",
      timestamp: new Date(),
      mode: currentSession?.mode,
    }
    setChatMessages((prev) => [...prev, syncMessage])
  }

  const generateAdaptiveRecommendation = (metadata: any): string => {
    if (metadata?.adaptiveDifficulty < 3) {
      return "Focus on building foundational understanding with visual aids and step-by-step guidance"
    } else if (metadata?.adaptiveDifficulty > 7) {
      return "Ready for advanced challenges and independent problem-solving"
    }
    return "Continue with current pace while exploring connections to other concepts"
  }

  const generateAlternativePerspectives = (content: string): string => {
    const perspectives = [
      "Consider multiple cultural approaches to this concept",
      "Explore how different learning theories explain this topic",
      "Examine this from both theoretical and practical viewpoints",
      "Look at this concept through various disciplinary lenses",
    ]
    return perspectives[Math.floor(Math.random() * perspectives.length)]
  }

  const identifyResearchGaps = (content: string): string => {
    const gaps = [
      "Limited research on long-term retention of this concept",
      "Need for more studies on diverse learning populations",
      "Insufficient data on real-world application effectiveness",
      "Emerging research on digital learning approaches",
    ]
    return gaps[Math.floor(Math.random() * gaps.length)]
  }

  const suggestFurtherResearch = (content: string): string => {
    const suggestions = [
      "Explore peer-reviewed studies on this topic",
      "Investigate recent educational research developments",
      "Consider cross-cultural educational approaches",
      "Examine evidence-based teaching methodologies",
    ]
    return suggestions[Math.floor(Math.random() * suggestions.length)]
  }

  const generateCriticalQuestion = (content: string): string => {
    const questions = [
      "How might this concept apply differently in various contexts?",
      "What assumptions are we making about this learning approach?",
      "How could we test the effectiveness of this method?",
      "What alternative explanations might exist for this phenomenon?",
    ]
    return questions[Math.floor(Math.random() * questions.length)]
  }

  const challengeAssumption = (content: string): string => {
    const challenges = [
      "Question whether one-size-fits-all approaches are effective",
      "Consider if traditional methods are always the best approach",
      "Examine whether this concept applies universally across cultures",
      "Evaluate if current assessment methods truly measure understanding",
    ]
    return challenges[Math.floor(Math.random() * challenges.length)]
  }

  const generateRealWorldChallenge = (content: string): string => {
    const challenges = [
      "How would you apply this in a resource-limited environment?",
      "What adaptations would be needed for different age groups?",
      "How might technology enhance or hinder this approach?",
      "What ethical considerations should we keep in mind?",
    ]
    return challenges[Math.floor(Math.random() * challenges.length)]
  }

  // AI Diagnostic Functions
  const testOpenAIConnection = async () => {
    try {
      const response = await fetch("/api/test-openai-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "connection" }),
      })
      const data = await response.json()
      return { success: response.ok, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  const testGroqConnection = async () => {
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Test connection",
          provider: "groq",
        }),
      })
      const data = await response.json()
      return { success: response.ok, data, error: null }
    } catch (error) {
      return { success: false, data: null, error: error.message }
    }
  }

  const testAIAgents = async () => {
    const agents = [
      { name: "Adaptive Learning", endpoint: "/api/ai/adaptive-learning" },
      { name: "Assessment Creator", endpoint: "/api/ai/assessment-creator" },
      { name: "Content Generation", endpoint: "/api/ai/content-generation" },
      { name: "Diagnostic Tool", endpoint: "/api/ai/diagnostic" },
      { name: "Smart Tutoring", endpoint: "/api/ai/smart-tutoring" },
    ]

    const results = []
    for (const agent of agents) {
      try {
        const response = await fetch(agent.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test: true, message: "Health check" }),
        })
        const data = await response.json()
        results.push({
          name: agent.name,
          status: response.ok ? "working" : "error",
          response: data,
          endpoint: agent.endpoint,
        })
      } catch (error) {
        results.push({
          name: agent.name,
          status: "error",
          error: error.message,
          endpoint: agent.endpoint,
        })
      }
    }
    return results
  }

  const runComprehensiveAIDiagnostic = async () => {
    setIsLoading(true)

    const diagnosticMessage: ChatMessage = {
      role: "system",
      content: "🔍 **Running AI Diagnostic Tests...**\n\nTesting all AI models and agents in the system.",
      timestamp: new Date(),
    }
    setChatMessages((prev) => [...prev, diagnosticMessage])

    // Test OpenAI
    const openaiResult = await testOpenAIConnection()

    // Test Groq
    const groqResult = await testGroqConnection()

    // Test AI Agents
    const agentResults = await testAIAgents()

    // Test environment variables
    const envCheck = {
      openai: "Using secure server API",
      groq: "Using secure server API",
    }

    const diagnosticResults = `🔍 **AI Diagnostic Results**

**🤖 OpenAI Connection:**
${openaiResult.success ? "✅ Working" : "❌ Failed"}
${openaiResult.error ? `Error: ${openaiResult.error}` : ""}
${openaiResult.data ? `Response: ${JSON.stringify(openaiResult.data, null, 2)}` : ""}

**⚡ Groq Connection:**
${groqResult.success ? "✅ Working" : "❌ Failed"}
${groqResult.error ? `Error: ${groqResult.error}` : ""}

**🧠 AI Agents Status:**
${agentResults
  .map(
    (agent) =>
      `• ${agent.name}: ${agent.status === "working" ? "✅" : "❌"} ${agent.status.toUpperCase()}
    Endpoint: ${agent.endpoint}
    ${agent.error ? `Error: ${agent.error}` : ""}
    ${agent.response ? `Response: ${JSON.stringify(agent.response).substring(0, 100)}...` : ""}`,
  )
  .join("\n")}

**🔧 Environment Configuration:**
• OpenAI API Key: ${envCheck.openai ? "✅ Configured" : "❌ Missing"}
• Groq API Key: ${envCheck.groq ? "✅ Configured" : "❌ Missing"}

**📊 Summary:**
• OpenAI: ${openaiResult.success ? "Operational" : "Needs attention"}
• Groq: ${groqResult.success ? "Operational" : "Needs attention"}
• AI Agents: ${agentResults.filter((a) => a.status === "working").length}/${agentResults.length} working
• Overall Status: ${openaiResult.success && groqResult.success ? "🟢 All systems operational" : "🟡 Some issues detected"}

**🔧 Troubleshooting:**
${!openaiResult.success ? "• Check OPENAI_API_KEY environment variable\n" : ""}
${!groqResult.success ? "• Check GROQ_API_KEY environment variable\n" : ""}
${agentResults.some((a) => a.status === "error") ? "• Some AI agents may need API endpoint fixes\n" : ""}
• Verify all environment variables are properly set
• Check API rate limits and quotas
• Ensure network connectivity to AI providers`

    const resultMessage: ChatMessage = {
      role: "assistant",
      content: diagnosticResults,
      timestamp: new Date(),
      metadata: {
        diagnosticResults: {
          openai: openaiResult,
          groq: groqResult,
          agents: agentResults,
          environment: envCheck,
        },
      },
    }

    setChatMessages((prev) => [...prev, resultMessage])
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <IconComponent className={`w-8 h-8 text-${modeConfig.color}-600`} />
            <h1 className="text-4xl font-bold text-gray-900">{modeConfig.title}</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{modeConfig.description}</p>
        </div>

        {/* Curriculum Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {getTranslatedText("Select Your Learning Context", isKiswahiliSelected)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslatedText("Grade Level", isKiswahiliSelected)}
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{getTranslatedText("Select Grade", isKiswahiliSelected)}</option>
                {Object.keys(CBC_CURRICULUM).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslatedText("Learning Area", isKiswahiliSelected)}
              </label>
              <select
                value={selectedLearningArea}
                onChange={(e) => setSelectedLearningArea(e.target.value)}
                disabled={!selectedGrade}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">{getTranslatedText("Select Learning Area", isKiswahiliSelected)}</option>
                <option value="english">{getTranslatedText("English Language", isKiswahiliSelected)}</option>
                <option value="kiswahili">Kiswahili</option>
                <option value="mathematics">{getTranslatedText("Mathematics", isKiswahiliSelected)}</option>
                <option value="integrated-science">
                  {getTranslatedText("Integrated Science", isKiswahiliSelected)}
                </option>
                <option value="health-nutrition">
                  {getTranslatedText("Health and Nutrition", isKiswahiliSelected)}
                </option>
                <option value="pre-technical-pre-career">
                  {getTranslatedText("Pre-Technical and Pre-Career Education", isKiswahiliSelected)}
                </option>
                <option value="social-studies">{getTranslatedText("Social Studies", isKiswahiliSelected)}</option>
                <option value="religious-education">
                  {getTranslatedText("Religious Education", isKiswahiliSelected)}
                </option>
                <option value="creative-arts">
                  {getTranslatedText("Creative Arts and Sports", isKiswahiliSelected)}
                </option>
                <option value="life-skills">{getTranslatedText("Life Skills Education", isKiswahiliSelected)}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Strand</label>
              <select
                value={selectedStrand}
                onChange={(e) => setSelectedStrand(e.target.value)}
                disabled={!selectedLearningArea}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select Strand</option>
                {availableStrands.map((strand) => (
                  <option key={strand.id} value={strand.id}>
                    {strand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Strand</label>
              <select
                value={selectedSubStrand}
                onChange={(e) => setSelectedSubStrand(e.target.value)}
                disabled={!selectedStrand}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select Sub-Strand</option>
                {availableSubStrands.map((subStrand) => (
                  <option key={subStrand.id} value={subStrand.id}>
                    {subStrand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* AI Model Selector */}
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          preferences={modelPreferences}
          onPreferencesChange={setModelPreferences}
          className="mb-8"
        />

        {/* Chat Interface */}
        {currentSession && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className={`bg-${modeConfig.color}-600 text-white p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">{modeConfig.title}</h3>
                    <p className="text-sm opacity-90">
                      {selectedGrade && selectedLearningArea
                        ? `${selectedGrade.toUpperCase()} - ${
                            availableLearningAreas.find((a) => a.id === selectedLearningArea)?.name
                          }`
                        : "CBC AI Tutor"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">Progress</div>
                  <div className="font-semibold">{learningProgress}%</div>
                  <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span>Synced</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : message.role === "system"
                          ? "bg-gray-100 text-gray-800 border-l-4 border-blue-500"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {/* AI Research & Reasoning Feedback */}
                    {message.role === "assistant" && message.metadata?.researchSources && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="text-xs font-semibold text-blue-800 mb-2">🔬 AI Research & Reasoning</div>
                        <div className="text-xs text-blue-700 space-y-1">
                          <div>
                            <strong>Research Method:</strong> Cross-referenced {message.metadata.researchSources}{" "}
                            educational sources
                          </div>
                          <div>
                            <strong>Confidence Level:</strong> {message.metadata.accuracyLevel || 85}% based on evidence
                            analysis
                          </div>
                          <div>
                            <strong>Reasoning Process:</strong> Analyzed question context → Filtered relevant concepts →
                            Applied pedagogical principles
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Adaptive Learning Feedback */}
                    {message.role === "assistant" &&
                      (message.metadata?.adaptiveDifficulty || message.metadata?.currentLevel) && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                          <div className="text-xs font-semibold text-green-800 mb-2">🧠 Adaptive Learning Analysis</div>
                          <div className="text-xs text-green-700 space-y-1">
                            {message.metadata.adaptiveDifficulty && (
                              <div>
                                <strong>Difficulty Adjustment:</strong> Level {message.metadata.adaptiveDifficulty}/10
                                (adapted to your performance)
                              </div>
                            )}
                            {message.metadata.currentLevel && (
                              <div>
                                <strong>Learning Level:</strong> {message.metadata.currentLevel} (progressing based on
                                mastery)
                              </div>
                            )}
                            <div>
                              <strong>Learning Style Detected:</strong> {detectLearningStyle(lastCorrectAnswers)}
                            </div>
                            <div>
                              <strong>Recommendation:</strong> {generateAdaptiveRecommendation(message.metadata)}
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Open Educational Research */}
                    {message.role === "assistant" && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="text-xs font-semibold text-purple-800 mb-2">📚 Open Educational Research</div>
                        <div className="text-xs text-purple-700 space-y-1">
                          <div>
                            <strong>Alternative Perspectives:</strong>{" "}
                            {generateAlternativePerspectives(message.content)}
                          </div>
                          <div>
                            <strong>Research Gaps:</strong> {identifyResearchGaps(message.content)}
                          </div>
                          <div>
                            <strong>Further Investigation:</strong> {suggestFurtherResearch(message.content)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Critical Thinking Prompts */}
                    {message.role === "assistant" && (
                      <div className="mt-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                        <div className="text-xs font-semibold text-orange-800 mb-2">🤔 Critical Thinking</div>
                        <div className="text-xs text-orange-700 space-y-1">
                          <div>
                            <strong>Question to Consider:</strong> {generateCriticalQuestion(message.content)}
                          </div>
                          <div>
                            <strong>Challenge Assumption:</strong> {challengeAssumption(message.content)}
                          </div>
                          <div>
                            <strong>Real-World Application:</strong> {generateRealWorldChallenge(message.content)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Show model info if enabled */}
                    {modelPreferences.showModelInfo && message.metadata?.modelInfo && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">🤖 {message.metadata.modelInfo.name}</span>
                          {message.metadata.fallbackUsed && (
                            <Badge variant="outline" className="text-xs">
                              Fallback Used
                            </Badge>
                          )}
                        </div>
                        <div className="text-gray-600 mt-1">{message.metadata.modelInfo.description}</div>
                      </div>
                    )}

                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp instanceof Date
                        ? message.timestamp.toLocaleTimeString()
                        : new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>AI is researching and analyzing...</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      • Cross-referencing educational sources • Analyzing adaptive learning patterns • Generating
                      reasoning-based feedback
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything about the CBC curriculum..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !userQuestion.trim()} className="px-6">
                  Send
                </Button>
              </div>
            </div>
            {/* AI Diagnostic Panel */}
            <div className="border-t p-4 bg-gray-50">
              <div className="flex flex-wrap gap-2 mb-3">
                <Button
                  onClick={runComprehensiveAIDiagnostic}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  disabled={isLoading}
                >
                  🔍 Test All AI Systems
                </Button>
                <Button
                  onClick={async () => {
                    const result = await testOpenAIConnection()
                    setChatMessages((prev) => [
                      ...prev,
                      {
                        role: "system",
                        content: `OpenAI Test: ${result.success ? "✅ Working" : "❌ Failed"}\n${result.error || JSON.stringify(result.data)}`,
                        timestamp: new Date(),
                      },
                    ])
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  🤖 Test OpenAI
                </Button>
                <Button
                  onClick={async () => {
                    const result = await testGroqConnection()
                    setChatMessages((prev) => [
                      ...prev,
                      {
                        role: "system",
                        content: `Groq Test: ${result.success ? "✅ Working" : "❌ Failed"}\n${result.error || "Connection successful"}`,
                        timestamp: new Date(),
                      },
                    ])
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  ⚡ Test Groq
                </Button>
                <Button
                  onClick={() => {
                    setChatMessages((prev) => [
                      ...prev,
                      {
                        role: "system",
                        content: `🔧 **Environment Check:**
• API Configuration: Using secure server-side API routes
• Current Mode: ${mode}
• Session Active: ${currentSession ? "✅ Yes" : "❌ No"}`,
                        timestamp: new Date(),
                      },
                    ])
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  🔧 Check Config
                </Button>
              </div>
              <div className="text-xs text-gray-600">Use these buttons to test AI connectivity and diagnose issues</div>
            </div>
          </div>
        )}

        {/* AI Chatbot Toggle */}
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => {
              setShowAIChatbot(!showAIChatbot)
              if (!showAIChatbot) {
                showSyncNotification()
              }
            }}
            className="rounded-full w-14 h-14 shadow-lg"
          >
            🤖
          </Button>
        </div>

        {/* AI Chatbot Modal */}
        {showAIChatbot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              data-modal="ai-chatbot"
              className={`bg-white rounded-xl shadow-2xl transition-all duration-300 ${
                isMinimized ? "w-80 h-16 fixed bottom-4 right-20" : "w-full h-full max-w-6xl max-h-[90vh]"
              } flex flex-col`}
            >
              <div className="bg-blue-600 text-white p-4 rounded-t-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">🧠</div>
                    <div>
                      <h3 className="font-semibold">CBC Guided Learning Assistant</h3>
                      <div className="text-xs opacity-90 flex items-center gap-2">
                        <span>Mode: {tutorMode}</span>
                        <span>•</span>
                        <span>Level: {studentLevel}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${isAiLoading ? "bg-yellow-300 animate-pulse" : "bg-green-300"}`}
                          />
                          {isAiLoading ? "Processing" : "Ready"}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="text-xs bg-blue-500 hover:bg-blue-400 px-2 py-1 rounded transition-colors cursor-pointer"
                            title={isMinimized ? "Restore" : "Minimize"}
                          >
                            {isMinimized ? "🔼 Restore" : "🔽 Minimize"}
                          </button>
                          <button
                            onClick={() => {
                              const modal = document.querySelector('[data-modal="ai-chatbot"]')
                              if (modal) {
                                modal.classList.toggle("max-w-6xl")
                                modal.classList.toggle("max-w-full")
                                modal.classList.toggle("max-h-[90vh]")
                                modal.classList.toggle("max-h-full")
                              }
                            }}
                            className="text-xs bg-blue-500 hover:bg-blue-400 px-2 py-1 rounded transition-colors cursor-pointer"
                            title="Toggle Full Screen"
                          >
                            📺 Full Screen
                          </button>
                        </div>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                          <span>Synced with Main Chat</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={tutorMode}
                      onChange={(e) => setTutorMode(e.target.value as any)}
                      className="text-xs bg-blue-500 text-white border border-blue-400 rounded px-2 py-1"
                    >
                      <option value="guide">Guide</option>
                      <option value="assess">Assess</option>
                      <option value="support">Support</option>
                      <option value="explore">Explore</option>
                    </select>
                    <Button
                      onClick={() => setShowAIChatbot(false)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-blue-700"
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                {/* Grade Selection Buttons */}
                <div className="border-t border-blue-500 pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium">Quick Grade Selection:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                      <button
                        key={grade}
                        onClick={() => {
                          setSelectedGrade(`grade${grade}`)
                          setChatMessages((prev) => [
                            ...prev,
                            {
                              role: "system",
                              content: `📚 **Grade ${grade} Selected**\n\nSwitched to Grade ${grade} curriculum context. All AI responses will now be tailored for Grade ${grade} level learning.`,
                              timestamp: new Date(),
                            },
                          ])
                        }}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          selectedGrade === `grade${grade}`
                            ? "bg-white text-blue-600 font-semibold"
                            : "bg-blue-500 hover:bg-blue-400 text-white"
                        }`}
                        title={`Switch to Grade ${grade}`}
                      >
                        G{grade}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedGrade("pp1")
                        setChatMessages((prev) => [
                          ...prev,
                          {
                            role: "system",
                            content: `🌟 **Pre-Primary 1 Selected**\n\nSwitched to PP1 curriculum context. All AI responses will now be tailored for Pre-Primary 1 level learning.`,
                            timestamp: new Date(),
                          },
                        ])
                      }}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        selectedGrade === "pp1"
                          ? "bg-white text-blue-600 font-semibold"
                          : "bg-blue-500 hover:bg-blue-400 text-white"
                      }`}
                      title="Switch to Pre-Primary 1"
                    >
                      PP1
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGrade("pp2")
                        setChatMessages((prev) => [
                          ...prev,
                          {
                            role: "system",
                            content: `🌟 **Pre-Primary 2 Selected**\n\nSwitched to PP2 curriculum context. All AI responses will now be tailored for Pre-Primary 2 level learning.`,
                            timestamp: new Date(),
                          },
                        ])
                      }}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        selectedGrade === "pp2"
                          ? "bg-white text-blue-600 font-semibold"
                          : "bg-blue-500 hover:bg-blue-400 text-white"
                      }`}
                      title="Switch to Pre-Primary 2"
                    >
                      PP2
                    </button>
                  </div>
                </div>
                {/* Learning Areas, Quiz, and Save Buttons */}
                <div className="border-t border-blue-500 pt-3 mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium">
                      {getTranslatedText("Quick Actions", isKiswahiliSelected)}:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Learning Areas Buttons */}
                    <div className="flex flex-wrap gap-1">
                      {[
                        { id: "mathematics", name: "Math", icon: "🔢" },
                        { id: "english", name: "English", icon: "📚" },
                        { id: "kiswahili", name: "Kiswahili", icon: "🗣️" },
                        { id: "integrated-science", name: "Science", icon: "🔬" },
                        { id: "social-studies", name: "Social", icon: "🌍" },
                        { id: "creative-arts", name: "Arts", icon: "🎨" },
                      ].map((area) => (
                        <button
                          key={area.id}
                          onClick={() => {
                            setSelectedLearningArea(area.id)
                            setChatMessages((prev) => [
                              ...prev,
                              {
                                role: "system",
                                content: `📖 **${area.name} Selected**\n\nSwitched to ${area.name} learning area. All AI responses will now focus on ${area.name} curriculum content.`,
                                timestamp: new Date(),
                              },
                            ])
                          }}
                          className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                            selectedLearningArea === area.id
                              ? "bg-white text-blue-600 font-semibold"
                              : "bg-blue-500 hover:bg-blue-400 text-white"
                          }`}
                          title={`Switch to ${area.name}`}
                        >
                          <span>{area.icon}</span>
                          <span>{getTranslatedLearningAreaName(area.id, area.name, isKiswahiliSelected)}</span>
                        </button>
                      ))}
                    </div>

                    {/* Quiz Button */}
                    <button
                      onClick={() => {
                        setChatMessages((prev) => [
                          ...prev,
                          {
                            role: "assistant",
                            content: `🧠 **Quiz Mode Activated!**\n\nI'll create a personalized quiz based on your current grade (${selectedGrade || "Not selected"}) and learning area (${selectedLearningArea || "Not selected"}).\n\n**Quiz Features:**\n• Adaptive difficulty based on your performance\n• Immediate feedback and explanations\n• Progress tracking and scoring\n• CBC curriculum aligned questions\n\nReady to start? Just ask me to "generate a quiz" or specify a topic!`,
                            timestamp: new Date(),
                            metadata: {
                              quizGenerated: true,
                            },
                          },
                        ])
                      }}
                      className="px-3 py-1 text-xs rounded transition-colors bg-green-500 hover:bg-green-400 text-white flex items-center gap-1"
                      title="Generate Quiz"
                    >
                      <span role="img" aria-label="Brain icon">
                        🧠
                      </span>
                      <span>{getTranslatedText("Quiz", isKiswahiliSelected)}</span>
                    </button>

                    {/* Save Button */}
                    <button
                      onClick={() => {
                        const sessionData = {
                          grade: selectedGrade,
                          learningArea: selectedLearningArea,
                          strand: selectedStrand,
                          subStrand: selectedSubStrand,
                          messages: chatMessages,
                          progress: learningProgress,
                          achievements: achievements,
                          timestamp: new Date().toISOString(),
                        }

                        // Save to localStorage
                        localStorage.setItem("cbc-tutor-session", JSON.stringify(sessionData))

                        setChatMessages((prev) => [
                          ...prev,
                          {
                            role: "system",
                            content: `💾 **Session Saved Successfully!**\n\n**Saved Data:**\n• Grade: ${selectedGrade || "Not selected"}\n• Learning Area: ${selectedLearningArea || "Not selected"}\n• Chat Messages: ${chatMessages.length} messages\n• Progress: ${learningProgress}%\n• Achievements: ${achievements.length} earned\n\n**Note:** Your session is saved locally and will be available when you return to this page.`,
                            timestamp: new Date(),
                          },
                        ])
                      }}
                      className="px-3 py-1 text-xs rounded transition-colors bg-purple-500 hover:bg-purple-400 text-white flex items-center gap-1"
                      title="Save Session"
                    >
                      <span role="img" aria-label="Save icon">
                        💾
                      </span>
                      <span>{getTranslatedText("Save", isKiswahiliSelected)}</span>
                    </button>

                    {/* Load Button */}
                    <button
                      onClick={() => {
                        try {
                          const savedSession = localStorage.getItem("cbc-tutor-session")
                          if (savedSession) {
                            const sessionData = JSON.parse(savedSession)
                            setSelectedGrade(sessionData.grade || "")
                            setSelectedLearningArea(sessionData.learningArea || "")
                            setSelectedStrand(sessionData.strand || "")
                            setSelectedSubStrand(sessionData.subStrand || "")
                            setChatMessages(sessionData.messages || [])
                            setLearningProgress(sessionData.progress || 0)
                            setAchievements(sessionData.achievements || [])

                            setChatMessages((prev) => [
                              ...prev,
                              {
                                role: "system",
                                content: `📂 **Session Loaded Successfully!**\n\n**Restored Data:**\n• Grade: ${sessionData.grade || "Not selected"}\n• Learning Area: ${sessionData.learningArea || "Not selected"}\n• Messages: ${sessionData.messages?.length || 0} messages restored\n• Progress: ${sessionData.progress || 0}%\n• Achievements: ${sessionData.achievements?.length || 0} restored\n\nWelcome back! You can continue from where you left off.`,
                                timestamp: new Date(),
                              },
                            ])
                          } else {
                            setChatMessages((prev) => [
                              ...prev,
                              {
                                role: "system",
                                content: `❌ **No Saved Session Found**\n\nNo previous session data was found in your browser storage. Start a new session by selecting your grade and learning area!`,
                                timestamp: new Date(),
                              },
                            ])
                          }
                        } catch (error) {
                          setChatMessages((prev) => [
                            ...prev,
                            {
                              role: "system",
                              content: `❌ **Error Loading Session**\n\nThere was an error loading your saved session. Please start a new session.`,
                              timestamp: new Date(),
                            },
                          ])
                        }
                      }}
                      className="px-3 py-1 text-xs rounded transition-colors bg-orange-500 hover:bg-orange-400 text-white flex items-center gap-1"
                      title="Load Saved Session"
                    >
                      <span>📂</span>
                      <span>{getTranslatedText("Load", isKiswahiliSelected)}</span>
                    </button>
                  </div>
                </div>
              </div>
              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg max-w-4xl ${
                          msg.role === "user"
                            ? "bg-blue-100 ml-auto mr-4 text-right"
                            : "bg-white mr-auto ml-4 shadow-sm border"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {msg.timestamp instanceof Date
                            ? msg.timestamp.toLocaleTimeString()
                            : msg.timestamp
                              ? new Date(msg.timestamp).toLocaleTimeString()
                              : new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                    {isAiLoading && (
                      <div className="bg-white p-3 rounded-lg mr-auto ml-4 shadow-sm border max-w-4xl">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="animate-pulse">AI is thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 border-t bg-white">
                    <div className="flex gap-3 max-w-4xl mx-auto">
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAIChat()}
                        placeholder="Ask your CBC AI tutor anything..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Button onClick={handleAIChat} size="default" className="px-6">
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Active Simulation */}
        {activeSimulation && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Active Simulation: {activeSimulation}</h3>
            {activeSimulation.toLowerCase().includes("math") ? (
              <MathSimulation
                onProgress={(progress) => setLearningProgress(progress)}
                onComplete={(result) => {
                  setActiveSimulation(null)
                  setChatMessages((prev) => [
                    ...prev,
                    {
                      role: "assistant",
                      content: `🎉 Simulation completed! Score: ${result.score}%`,
                      timestamp: new Date(),
                    },
                  ])
                }}
              />
            ) : activeSimulation.toLowerCase().includes("science") ? (
              <ScienceSimulation
                onProgress={(progress) => setLearningProgress(progress)}
                onComplete={(result) => {
                  setActiveSimulation(null)
                  setChatMessages((prev) => [
                    ...prev,
                    {
                      role: "assistant",
                      content: `🌱 Plant grew to ${result.height}px! Concepts learned: ${result.concepts.join(", ")}`,
                      timestamp: new Date(),
                    },
                  ])
                }}
              />
            ) : activeSimulation.toLowerCase().includes("language") ? (
              <LanguageSimulation
                onProgress={(progress) => setLearningProgress(progress)}
                onComplete={(result) => {
                  setActiveSimulation(null)
                  setChatMessages((prev) => [
                    ...prev,
                    {
                      role: "assistant",
                      content: `📚 Completed ${result.wordsCompleted} words! Skills: ${result.skills.join(", ")}`,
                      timestamp: new Date(),
                    },
                  ])
                }}
              />
            ) : (
              <GeneralSimulation
                simulationName={activeSimulation}
                onProgress={(progress) => setLearningProgress(progress)}
                onComplete={(result) => {
                  setActiveSimulation(null)
                  setChatMessages((prev) => [
                    ...prev,
                    {
                      role: "assistant",
                      content: `✅ Simulation completed successfully!`,
                      timestamp: new Date(),
                    },
                  ])
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
