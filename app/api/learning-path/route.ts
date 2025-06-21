import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// CBC Learning Areas with AI Integration
const CBC_LEARNING_AREAS = {
  mathematics: {
    name: "Mathematics",
    nameKiswahili: "Hisabati",
    skills: ["logical_thinking", "problem_solving", "analytical_reasoning", "pattern_recognition"],
    careerPaths: ["Engineer", "Data Scientist", "Accountant", "Architect", "Statistician"],
    personalityTraits: ["analytical", "methodical", "logical", "detail_oriented"],
  },
  english: {
    name: "English Language",
    nameKiswahili: "Lugha ya Kiingereza",
    skills: ["communication", "critical_thinking", "creativity", "language_mastery"],
    careerPaths: ["Journalist", "Teacher", "Writer", "Lawyer", "Diplomat"],
    personalityTraits: ["communicative", "expressive", "creative", "social"],
  },
  kiswahili: {
    name: "Kiswahili",
    nameKiswahili: "Kiswahili",
    skills: ["cultural_awareness", "communication", "heritage_preservation", "linguistic_skills"],
    careerPaths: ["Cultural Officer", "Translator", "Media Presenter", "Tourism Guide", "Teacher"],
    personalityTraits: ["culturally_aware", "communicative", "traditional", "social"],
  },
  science: {
    name: "Integrated Science",
    nameKiswahili: "Sayansi Jumuishi",
    skills: ["scientific_inquiry", "experimentation", "observation", "hypothesis_testing"],
    careerPaths: ["Doctor", "Researcher", "Lab Technician", "Environmental Scientist", "Pharmacist"],
    personalityTraits: ["curious", "methodical", "investigative", "analytical"],
  },
  social_studies: {
    name: "Social Studies",
    nameKiswahili: "Maarifa ya Jamii",
    skills: ["critical_thinking", "research", "cultural_understanding", "civic_awareness"],
    careerPaths: ["Historian", "Social Worker", "Political Scientist", "Community Leader", "NGO Worker"],
    personalityTraits: ["empathetic", "social", "justice_oriented", "community_minded"],
  },
  creative_arts: {
    name: "Creative Arts and Sports",
    nameKiswahili: "Sanaa za Ubunifu na Michezo",
    skills: ["creativity", "artistic_expression", "physical_coordination", "aesthetic_sense"],
    careerPaths: ["Artist", "Designer", "Coach", "Performer", "Art Therapist"],
    personalityTraits: ["creative", "expressive", "artistic", "energetic"],
  },
  life_skills: {
    name: "Life Skills Education",
    nameKiswahili: "Elimu ya Ujuzi wa Maisha",
    skills: ["emotional_intelligence", "decision_making", "interpersonal_skills", "self_awareness"],
    careerPaths: ["Counselor", "Life Coach", "Human Resources", "Social Worker", "Therapist"],
    personalityTraits: ["empathetic", "supportive", "understanding", "people_oriented"],
  },
  agriculture: {
    name: "Agriculture",
    nameKiswahili: "Kilimo",
    skills: ["practical_application", "environmental_awareness", "sustainability", "innovation"],
    careerPaths: ["Agricultural Officer", "Farmer", "Food Scientist", "Environmental Consultant", "Agribusiness"],
    personalityTraits: ["practical", "nature_loving", "sustainable", "innovative"],
  },
}

// Personality Assessment Framework
const PERSONALITY_DIMENSIONS = {
  learning_style: {
    visual: "Learns best through images, diagrams, and visual representations",
    auditory: "Learns best through listening, discussions, and verbal explanations",
    kinesthetic: "Learns best through hands-on activities and physical engagement",
    reading_writing: "Learns best through reading texts and writing exercises",
  },
  thinking_style: {
    analytical: "Prefers logical, step-by-step problem solving",
    creative: "Prefers innovative, imaginative approaches",
    practical: "Prefers real-world, applicable solutions",
    theoretical: "Prefers abstract concepts and ideas",
  },
  social_preference: {
    collaborative: "Works well in groups and team settings",
    independent: "Prefers working alone and self-directed learning",
    competitive: "Motivated by competition and comparison with others",
    supportive: "Enjoys helping others and cooperative learning",
  },
  motivation_type: {
    intrinsic: "Motivated by personal satisfaction and interest",
    extrinsic: "Motivated by external rewards and recognition",
    achievement: "Motivated by accomplishing goals and mastery",
    social: "Motivated by social connection and belonging",
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId") || "demo-student"
    const includePersonality = searchParams.get("personality") === "true"
    const learningArea = searchParams.get("learningArea")

    // Generate AI-powered learning path with personality assessment
    const learningPath = await generateAILearningPath(studentId, includePersonality, learningArea)

    return NextResponse.json({
      success: true,
      data: learningPath,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Learning path generation error:", error)

    // Fallback to comprehensive mock data
    const fallbackData = generateComprehensiveFallbackData()

    return NextResponse.json({
      success: true,
      data: fallbackData,
      fallback: true,
      error: "Using fallback data due to AI service unavailability",
    })
  }
}

async function generateAILearningPath(studentId: string, includePersonality: boolean, learningArea?: string) {
  // Mock student performance data (in real app, fetch from database)
  const studentPerformance = {
    mathematics: { score: 85, engagement: 90, time_spent: 120, struggles: ["algebra", "geometry"] },
    english: { score: 78, engagement: 75, time_spent: 90, struggles: ["grammar", "essay_writing"] },
    kiswahili: { score: 92, engagement: 95, time_spent: 100, struggles: ["advanced_grammar"] },
    science: { score: 88, engagement: 85, time_spent: 110, struggles: ["chemistry", "physics"] },
    social_studies: { score: 82, engagement: 80, time_spent: 95, struggles: ["history_dates", "geography"] },
    creative_arts: { score: 95, engagement: 98, time_spent: 150, struggles: [] },
    life_skills: { score: 90, engagement: 88, time_spent: 80, struggles: ["time_management"] },
    agriculture: { score: 87, engagement: 92, time_spent: 105, struggles: ["soil_science"] },
  }

  let aiAnalysis = ""
  let personalityAssessment = null

  try {
    // Generate AI analysis using Groq (faster) or OpenAI as fallback
    const analysisPrompt = `
    Analyze this Kenyan CBC student's performance across all learning areas and provide comprehensive feedback:

    Student Performance Data:
    ${Object.entries(studentPerformance)
      .map(
        ([area, data]) =>
          `${area}: Score ${data.score}%, Engagement ${data.engagement}%, Time ${data.time_spent}min, Struggles: ${data.struggles.join(", ")}`,
      )
      .join("\n")}

    Provide analysis in this format:
    1. Overall Learning Profile
    2. Strengths and Weaknesses
    3. Learning Style Identification
    4. Personality Traits Assessment
    5. CBC Pathway Recommendations
    6. Career Guidance
    7. Personalized Learning Strategies
    8. Next Steps and Goals

    Focus on CBC curriculum alignment and Kenyan career opportunities.
    `

    try {
      const { text } = await generateText({
        model: groq("llama-3.1-70b-versatile"),
        prompt: analysisPrompt,
        maxTokens: 2000,
        temperature: 0.7,
      })
      aiAnalysis = text
    } catch (groqError) {
      console.log("Groq failed, trying OpenAI:", groqError)
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: analysisPrompt,
        maxTokens: 2000,
        temperature: 0.7,
      })
      aiAnalysis = text
    }

    // Generate personality assessment if requested
    if (includePersonality) {
      personalityAssessment = await generatePersonalityAssessment(studentPerformance)
    }
  } catch (aiError) {
    console.log("AI analysis failed, using rule-based analysis:", aiError)
    aiAnalysis = generateRuleBasedAnalysis(studentPerformance)
    if (includePersonality) {
      personalityAssessment = generateRuleBasedPersonality(studentPerformance)
    }
  }

  // Generate comprehensive learning path
  const learningPath = {
    studentId,
    overallAnalysis: aiAnalysis,
    personalityAssessment,
    learningAreas: generateLearningAreaAnalysis(studentPerformance),
    cbcPathways: generateCBCPathwayRecommendations(studentPerformance, personalityAssessment),
    careerGuidance: generateCareerGuidance(studentPerformance, personalityAssessment),
    personalizedStrategies: generatePersonalizedStrategies(studentPerformance, personalityAssessment),
    nextSteps: generateNextSteps(studentPerformance),
    aiRecommendations: generateAIRecommendations(studentPerformance, personalityAssessment),
  }

  return learningPath
}

async function generatePersonalityAssessment(performance: any) {
  const personalityPrompt = `
  Based on this student's learning patterns, assess their personality for CBC pathway guidance:

  Performance Data: ${JSON.stringify(performance, null, 2)}

  Assess the student on these dimensions:
  1. Learning Style (Visual, Auditory, Kinesthetic, Reading/Writing)
  2. Thinking Style (Analytical, Creative, Practical, Theoretical)
  3. Social Preference (Collaborative, Independent, Competitive, Supportive)
  4. Motivation Type (Intrinsic, Extrinsic, Achievement, Social)

  Provide scores (1-10) and explanations for each dimension.
  `

  try {
    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: personalityPrompt,
      maxTokens: 1500,
      temperature: 0.6,
    })

    return {
      aiAssessment: text,
      dimensions: extractPersonalityScores(text),
      summary: generatePersonalitySummary(performance),
    }
  } catch (error) {
    return generateRuleBasedPersonality(performance)
  }
}

function generateLearningAreaAnalysis(performance: any) {
  return Object.entries(CBC_LEARNING_AREAS).map(([key, area]) => {
    const perf = performance[key] || { score: 70, engagement: 70, time_spent: 60, struggles: [] }

    return {
      area: area.name,
      areaKiswahili: area.nameKiswahili,
      currentScore: perf.score,
      engagement: perf.engagement,
      timeSpent: perf.time_spent,
      struggles: perf.struggles,
      strengths: identifyStrengths(perf, area.skills),
      aiRecommendations: generateAreaSpecificRecommendations(perf, area),
      nextTopics: generateNextTopics(key, perf),
      personalityAlignment: calculatePersonalityAlignment(perf, area.personalityTraits),
    }
  })
}

function generateCBCPathwayRecommendations(performance: any, personality: any) {
  const pathways = [
    {
      id: "stem",
      name: "STEM Pathway",
      nameKiswahili: "Njia ya STEM",
      description: "Science, Technology, Engineering, and Mathematics",
      matchScore: calculateSTEMMatch(performance),
      requiredAreas: ["mathematics", "science"],
      supportingAreas: ["english", "life_skills"],
      careerOpportunities: ["Engineer", "Doctor", "Data Scientist", "Researcher", "Technician"],
      personalityFit: personality ? calculatePersonalityFit(personality, ["analytical", "methodical", "curious"]) : 75,
    },
    {
      id: "arts_sports",
      name: "Arts & Sports Science",
      nameKiswahili: "Sanaa na Sayansi ya Michezo",
      description: "Creative and physical development pathway",
      matchScore: calculateArtsMatch(performance),
      requiredAreas: ["creative_arts", "life_skills"],
      supportingAreas: ["english", "kiswahili"],
      careerOpportunities: ["Artist", "Designer", "Coach", "Therapist", "Media Professional"],
      personalityFit: personality ? calculatePersonalityFit(personality, ["creative", "expressive", "energetic"]) : 80,
    },
    {
      id: "social_sciences",
      name: "Social Sciences",
      nameKiswahili: "Sayansi za Kijamii",
      description: "Humanities and social studies pathway",
      matchScore: calculateSocialMatch(performance),
      requiredAreas: ["social_studies", "english"],
      supportingAreas: ["kiswahili", "life_skills"],
      careerOpportunities: ["Lawyer", "Social Worker", "Journalist", "Diplomat", "Teacher"],
      personalityFit: personality
        ? calculatePersonalityFit(personality, ["empathetic", "social", "communicative"])
        : 70,
    },
    {
      id: "technical_vocational",
      name: "Technical & Vocational",
      nameKiswahili: "Kiteknolojia na Ufundi",
      description: "Practical skills and vocational training",
      matchScore: calculateTechnicalMatch(performance),
      requiredAreas: ["mathematics", "science"],
      supportingAreas: ["agriculture", "life_skills"],
      careerOpportunities: ["Technician", "Craftsperson", "Agricultural Officer", "Mechanic", "Builder"],
      personalityFit: personality ? calculatePersonalityFit(personality, ["practical", "hands_on", "innovative"]) : 85,
    },
  ]

  return pathways.sort((a, b) => b.matchScore + b.personalityFit - (a.matchScore + a.personalityFit))
}

function generateCareerGuidance(performance: any, personality: any) {
  const topCareers = []

  // Analyze each learning area for career alignment
  Object.entries(CBC_LEARNING_AREAS).forEach(([key, area]) => {
    const perf = performance[key] || { score: 70, engagement: 70 }
    if (perf.score >= 75 && perf.engagement >= 75) {
      area.careerPaths.forEach((career) => {
        topCareers.push({
          career,
          area: area.name,
          areaKiswahili: area.nameKiswahili,
          matchScore: (perf.score + perf.engagement) / 2,
          requiredSkills: area.skills,
          personalityAlignment: personality ? calculateCareerPersonalityMatch(career, personality) : 75,
        })
      })
    }
  })

  return {
    topRecommendations: topCareers
      .sort((a, b) => b.matchScore + b.personalityAlignment - (a.matchScore + a.personalityAlignment))
      .slice(0, 10),
    careerExploration: generateCareerExplorationPlan(topCareers),
    skillDevelopment: generateSkillDevelopmentPlan(performance),
    industryInsights: generateIndustryInsights(),
  }
}

function generatePersonalizedStrategies(performance: any, personality: any) {
  const strategies = []

  // Learning style strategies
  if (personality?.dimensions?.learning_style === "visual") {
    strategies.push({
      type: "Learning Style",
      strategy: "Use visual aids, diagrams, and mind maps",
      implementation: "Create visual study materials for all subjects",
    })
  }

  // Subject-specific strategies
  Object.entries(performance).forEach(([area, perf]) => {
    if (perf.score < 75) {
      strategies.push({
        type: "Subject Improvement",
        area: CBC_LEARNING_AREAS[area]?.name || area,
        strategy: generateImprovementStrategy(area, perf),
        implementation: generateImplementationPlan(area, perf),
      })
    }
  })

  return strategies
}

function generateNextSteps(performance: any) {
  const steps = []

  // Immediate improvements needed
  Object.entries(performance).forEach(([area, perf]) => {
    if (perf.score < 70) {
      steps.push({
        priority: "High",
        area: CBC_LEARNING_AREAS[area]?.name || area,
        action: `Focus on improving ${area} fundamentals`,
        timeline: "Next 2 weeks",
        resources: generateResourceRecommendations(area),
      })
    }
  })

  // Medium-term goals
  steps.push({
    priority: "Medium",
    area: "Overall Development",
    action: "Complete personality-based learning activities",
    timeline: "Next month",
    resources: ["Personality assessment tools", "Learning style activities"],
  })

  return steps
}

function generateAIRecommendations(performance: any, personality: any) {
  return {
    adaptiveLearning: "AI will adjust difficulty based on your performance patterns",
    personalizedContent: "Content will be customized to your learning style and interests",
    progressTracking: "AI will monitor your progress and suggest optimizations",
    careerGuidance: "Regular career assessments based on evolving interests and skills",
    mentorship: "AI-matched mentorship opportunities in your areas of interest",
  }
}

// Helper functions for calculations and analysis
function calculateSTEMMatch(performance: any) {
  const mathScore = performance.mathematics?.score || 0
  const scienceScore = performance.science?.score || 0
  return (mathScore + scienceScore) / 2
}

function calculateArtsMatch(performance: any) {
  const artsScore = performance.creative_arts?.score || 0
  const engagementBonus = performance.creative_arts?.engagement > 90 ? 10 : 0
  return Math.min(artsScore + engagementBonus, 100)
}

function calculateSocialMatch(performance: any) {
  const socialScore = performance.social_studies?.score || 0
  const englishScore = performance.english?.score || 0
  const kiswahiliScore = performance.kiswahili?.score || 0
  return (socialScore + englishScore + kiswahiliScore) / 3
}

function calculateTechnicalMatch(performance: any) {
  const mathScore = performance.mathematics?.score || 0
  const agriScore = performance.agriculture?.score || 0
  const practicalBonus = agriScore > 80 ? 15 : 0
  return Math.min((mathScore + agriScore) / 2 + practicalBonus, 100)
}

function generateRuleBasedAnalysis(performance: any) {
  const strengths = []
  const weaknesses = []

  Object.entries(performance).forEach(([area, perf]) => {
    if (perf.score >= 85) {
      strengths.push(CBC_LEARNING_AREAS[area]?.name || area)
    } else if (perf.score < 70) {
      weaknesses.push(CBC_LEARNING_AREAS[area]?.name || area)
    }
  })

  return `
**Learning Profile Analysis**

**Strengths:** ${strengths.join(", ") || "Developing across all areas"}

**Areas for Improvement:** ${weaknesses.join(", ") || "Maintaining good performance"}

**Learning Style:** Based on engagement patterns, you show strong visual and kinesthetic learning preferences.

**Personality Traits:** Your performance suggests analytical thinking with creative expression capabilities.

**CBC Pathway Recommendation:** Consider STEM or Arts pathways based on your balanced skill development.

**Career Guidance:** Explore careers that combine your technical skills with creative abilities.

**Next Steps:** Focus on strengthening weaker areas while building on your natural strengths.
  `
}

function generateRuleBasedPersonality(performance: any) {
  // Simple rule-based personality assessment
  const highEngagementAreas = Object.entries(performance)
    .filter(([_, perf]) => perf.engagement > 85)
    .map(([area, _]) => area)

  const learningStyle = highEngagementAreas.includes("creative_arts") ? "kinesthetic" : "visual"
  const thinkingStyle = performance.mathematics?.score > 80 ? "analytical" : "creative"

  return {
    dimensions: {
      learning_style: learningStyle,
      thinking_style: thinkingStyle,
      social_preference: "collaborative",
      motivation_type: "achievement",
    },
    summary: `Based on your learning patterns, you are a ${learningStyle} learner with ${thinkingStyle} thinking preferences.`,
  }
}

function generateComprehensiveFallbackData() {
  return {
    studentId: "demo-student",
    overallAnalysis: `
**Comprehensive CBC Learning Analysis**

Based on your learning patterns across all CBC learning areas, here's your personalized analysis:

**Overall Learning Profile:**
You demonstrate strong analytical and creative capabilities with excellent engagement in practical subjects. Your performance suggests a well-rounded learner with particular strengths in creative and technical areas.

**Strengths and Weaknesses:**
- **Strengths:** Creative Arts (95%), Kiswahili (92%), Life Skills (90%)
- **Areas for Growth:** English (78%), Social Studies (82%)

**Learning Style Identification:**
You appear to be a kinesthetic-visual learner who benefits from hands-on activities and visual representations.

**Personality Traits Assessment:**
- Creative and expressive
- Practical problem-solver
- Culturally aware and communicative
- Achievement-oriented

**CBC Pathway Recommendations:**
1. **Arts & Sports Science** (92% match) - Aligns with your creative strengths
2. **Technical & Vocational** (87% match) - Matches your practical skills
3. **STEM** (86% match) - Supports your analytical abilities

**Career Guidance:**
Top career recommendations include Creative Designer, Agricultural Innovation Specialist, Cultural Heritage Officer, and Technical Training Instructor.

**Personalized Learning Strategies:**
- Use visual aids and hands-on activities
- Incorporate cultural contexts in learning
- Balance creative expression with analytical thinking
- Focus on practical applications of concepts

**Next Steps:**
1. Strengthen English communication skills
2. Explore advanced creative arts techniques
3. Develop leadership skills through group projects
4. Consider mentorship in your areas of interest
    `,
    personalityAssessment: {
      dimensions: {
        learning_style: "kinesthetic",
        thinking_style: "creative",
        social_preference: "collaborative",
        motivation_type: "achievement",
      },
      summary: "Creative, practical learner with strong cultural awareness and collaborative spirit",
    },
    learningAreas: Object.entries(CBC_LEARNING_AREAS).map(([key, area]) => ({
      area: area.name,
      areaKiswahili: area.nameKiswahili,
      currentScore: Math.floor(Math.random() * 30) + 70,
      engagement: Math.floor(Math.random() * 30) + 70,
      timeSpent: Math.floor(Math.random() * 60) + 60,
      struggles: [],
      strengths: area.skills.slice(0, 2),
      aiRecommendations: `Focus on ${area.skills[0]} development through practical activities`,
      nextTopics: [`Advanced ${area.name} concepts`, `Real-world applications`],
      personalityAlignment: Math.floor(Math.random() * 30) + 70,
    })),
    cbcPathways: [
      {
        id: "arts_sports",
        name: "Arts & Sports Science",
        nameKiswahili: "Sanaa na Sayansi ya Michezo",
        description: "Creative and physical development pathway",
        matchScore: 92,
        personalityFit: 95,
        careerOpportunities: ["Artist", "Designer", "Coach", "Therapist", "Media Professional"],
      },
      {
        id: "technical_vocational",
        name: "Technical & Vocational",
        nameKiswahili: "Kiteknolojia na Ufundi",
        description: "Practical skills and vocational training",
        matchScore: 87,
        personalityFit: 85,
        careerOpportunities: ["Technician", "Agricultural Officer", "Craftsperson"],
      },
    ],
    careerGuidance: {
      topRecommendations: [
        {
          career: "Creative Designer",
          area: "Creative Arts",
          matchScore: 95,
          personalityAlignment: 90,
        },
        {
          career: "Agricultural Innovation Specialist",
          area: "Agriculture",
          matchScore: 87,
          personalityAlignment: 85,
        },
      ],
    },
  }
}

// Additional helper functions
function identifyStrengths(performance: any, skills: string[]) {
  return skills.filter(() => Math.random() > 0.5).slice(0, 2)
}

function generateAreaSpecificRecommendations(performance: any, area: any) {
  return `Focus on developing ${area.skills[0]} through practical exercises and real-world applications.`
}

function generateNextTopics(area: string, performance: any) {
  return [`Advanced ${area} concepts`, `Practical applications`, `Career connections`]
}

function calculatePersonalityAlignment(performance: any, traits: string[]) {
  return Math.floor(Math.random() * 30) + 70
}

function calculatePersonalityFit(personality: any, requiredTraits: string[]) {
  return Math.floor(Math.random() * 30) + 70
}

function calculateCareerPersonalityMatch(career: string, personality: any) {
  return Math.floor(Math.random() * 30) + 70
}

function generateCareerExplorationPlan(careers: any[]) {
  return [
    "Shadow professionals in your areas of interest",
    "Attend career fairs and industry events",
    "Complete online career assessments",
    "Join relevant clubs and organizations",
  ]
}

function generateSkillDevelopmentPlan(performance: any) {
  return [
    "Develop communication skills through presentations",
    "Build technical skills through hands-on projects",
    "Enhance critical thinking through problem-solving activities",
    "Strengthen collaboration through group work",
  ]
}

function generateIndustryInsights() {
  return {
    growingFields: ["Technology", "Healthcare", "Renewable Energy", "Creative Industries"],
    skillsInDemand: ["Digital Literacy", "Critical Thinking", "Communication", "Adaptability"],
    futureOpportunities: ["AI and Machine Learning", "Sustainable Agriculture", "Digital Arts", "Social Innovation"],
  }
}

function generateImprovementStrategy(area: string, performance: any) {
  const strategies = {
    mathematics: "Use visual aids and real-world problem solving",
    english: "Practice reading comprehension and writing exercises",
    science: "Conduct hands-on experiments and observations",
    default: "Focus on interactive learning and practical applications",
  }
  return strategies[area] || strategies.default
}

function generateImplementationPlan(area: string, performance: any) {
  return `Dedicate 30 minutes daily to ${area} practice with focus on ${performance.struggles?.join(", ") || "core concepts"}`
}

function generateResourceRecommendations(area: string) {
  return [
    `${area} textbooks and workbooks`,
    `Online ${area} tutorials and videos`,
    `${area} practice apps and games`,
    `Study groups and peer support`,
  ]
}

function extractPersonalityScores(text: string) {
  // Simple extraction - in real implementation, use more sophisticated parsing
  return {
    learning_style: "visual",
    thinking_style: "analytical",
    social_preference: "collaborative",
    motivation_type: "achievement",
  }
}

function generatePersonalitySummary(performance: any) {
  return "Well-rounded learner with strong creative and analytical capabilities"
}
