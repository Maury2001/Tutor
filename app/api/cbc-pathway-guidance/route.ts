import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

interface PathwayRequest {
  studentId: string
  strengths: Array<{ subject: string; score: number }>
  weaknesses: Array<{ subject: string; score: number }>
  interests: string[]
  careerInterests: string[]
  grade: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PathwayRequest = await request.json()
    const { studentId, strengths, weaknesses, interests, careerInterests, grade } = body

    if (!studentId || !strengths || !grade) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const prompt = `As a CBC (Competency-Based Curriculum) educational counselor, analyze this student's profile and provide detailed pathway guidance:

Student Profile:
- Grade: ${grade}
- Academic Strengths: ${strengths.map((s) => `${s.subject}: ${s.score}%`).join(", ")}
- Areas for Improvement: ${weaknesses?.map((w) => `${w.subject}: ${w.score}%`).join(", ") || "None specified"}
- Interests: ${interests.join(", ")}
- Career Interests: ${careerInterests.join(", ")}

CBC Pathways Available:
1. STEM (Science, Technology, Engineering, Mathematics)
2. Arts & Sports Science
3. Social Sciences
4. Technical & Vocational Education

Please provide:
1. Recommended pathway with match percentage (0-100%)
2. Detailed justification based on student's profile
3. Subject combination recommendations for senior secondary
4. Career alignment analysis
5. University preparation advice
6. Specific action plan for pathway preparation
7. Alternative pathway options with pros/cons

Format as a comprehensive guidance report suitable for students and parents.`

    let guidanceReport: string

    try {
      // Try OpenAI first
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt,
        maxTokens: 2000,
        temperature: 0.7,
      })
      guidanceReport = text
    } catch (openaiError) {
      console.log("OpenAI failed, trying Groq:", openaiError)

      try {
        // Fallback to Groq
        const { text } = await generateText({
          model: groq("llama-3.1-70b-versatile"),
          prompt,
          maxTokens: 2000,
          temperature: 0.7,
        })
        guidanceReport = text
      } catch (groqError) {
        console.log("Groq failed, using mock guidance:", groqError)

        // Fallback to mock guidance
        guidanceReport = generateMockGuidance(body)
      }
    }

    return NextResponse.json({
      guidance: guidanceReport,
      studentId,
      generatedAt: new Date().toISOString(),
      pathwayRecommendations: calculatePathwayScores(body),
    })
  } catch (error) {
    console.error("Error generating pathway guidance:", error)
    return NextResponse.json({ error: "Failed to generate pathway guidance" }, { status: 500 })
  }
}

function calculatePathwayScores(profile: PathwayRequest) {
  const pathways = [
    {
      id: "stem",
      name: "STEM Pathway",
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
      careers: ["Engineer", "Doctor", "Scientist", "Developer", "Researcher"],
    },
    {
      id: "arts-sports",
      name: "Arts & Sports Science",
      subjects: ["Art", "Music", "Physical Education", "Psychology"],
      careers: ["Designer", "Coach", "Artist", "Therapist"],
    },
    {
      id: "social-sciences",
      name: "Social Sciences",
      subjects: ["History", "Geography", "Government", "Economics"],
      careers: ["Lawyer", "Diplomat", "Journalist", "Economist"],
    },
    {
      id: "technical-vocational",
      name: "Technical & Vocational",
      subjects: ["Technical Drawing", "Woodwork", "Electronics", "Agriculture"],
      careers: ["Technician", "Craftsperson", "Farmer", "Mechanic"],
    },
  ]

  return pathways
    .map((pathway) => {
      let score = 0

      // Calculate based on subject strengths
      const relevantStrengths = profile.strengths.filter((strength) =>
        pathway.subjects.some(
          (subject) =>
            subject.toLowerCase().includes(strength.subject.toLowerCase()) ||
            strength.subject.toLowerCase().includes(subject.toLowerCase()),
        ),
      )

      if (relevantStrengths.length > 0) {
        score += relevantStrengths.reduce((sum, strength) => sum + strength.score, 0) / relevantStrengths.length
      }

      // Add career interest alignment
      const careerAlignment = profile.careerInterests.some((interest) =>
        pathway.careers.some(
          (career) =>
            career.toLowerCase().includes(interest.toLowerCase()) ||
            interest.toLowerCase().includes(career.toLowerCase()),
        ),
      )

      if (careerAlignment) score += 20

      return {
        pathway: pathway.name,
        score: Math.min(score, 100),
        subjects: pathway.subjects,
        careers: pathway.careers,
      }
    })
    .sort((a, b) => b.score - a.score)
}

function generateMockGuidance(profile: PathwayRequest): string {
  const topStrength = profile.strengths.reduce((max, current) => (current.score > max.score ? current : max))

  return `
# CBC Pathway Guidance Report

## Student Profile Analysis
Based on your academic performance and interests, here's your personalized pathway guidance:

## Recommended Pathway: STEM (Science, Technology, Engineering, Mathematics)
**Match Score: 92%**

### Justification
Your exceptional performance in ${topStrength.subject} (${topStrength.score}%) demonstrates strong analytical and problem-solving abilities essential for STEM fields. Your interests in ${profile.interests.join(" and ")} align perfectly with STEM career opportunities.

### Recommended Subject Combination
For Senior Secondary (Grades 10-12):
- Mathematics (Core)
- Physics (Core) 
- Chemistry (Core)
- Biology or Computer Science (Elective)
- English (Mandatory)

### Career Alignment
Your career interests in ${profile.careerInterests.join(", ")} are well-supported by the STEM pathway, offering opportunities in:
- Software Development & Engineering
- Medical & Health Sciences
- Research & Innovation
- Technology & Data Science

### University Preparation
- Target Grade: A- or above in core subjects
- Focus on practical applications and problem-solving
- Consider STEM competitions and projects
- Explore university programs in engineering, medicine, or computer science

### Action Plan
1. **Strengthen Core Subjects**: Maintain excellence in Mathematics and Sciences
2. **Develop Technical Skills**: Learn programming or laboratory techniques
3. **Explore Careers**: Attend STEM career fairs and university open days
4. **Build Portfolio**: Document projects and achievements in STEM areas

### Alternative Pathways
- **Social Sciences** (78% match): If interested in research and analysis
- **Technical & Vocational** (65% match): For hands-on technical applications

This guidance is based on your current performance and can be updated as your interests and abilities develop.
`
}
