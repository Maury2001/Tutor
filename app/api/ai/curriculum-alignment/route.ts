import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { content, gradeLevel, subject, learningObjectives, assessmentType } = await request.json()

    if (!content || !gradeLevel || !subject) {
      return NextResponse.json(
        {
          error: "Content, grade level, and subject are required",
        },
        { status: 400 },
      )
    }

    const alignmentPrompt = `Analyze the following educational content for CBC curriculum alignment:

Content to Analyze: ${content}
Grade Level: ${gradeLevel}
Subject: ${subject}
Learning Objectives: ${learningObjectives || "Not specified"}
Assessment Type: ${assessmentType || "General"}

Provide detailed analysis on:
1. CBC Curriculum Alignment Score (1-10)
2. KICD Standards Compliance
3. Grade-Level Appropriateness
4. Cultural Relevance to Kenya
5. Competency-Based Learning Integration
6. Core Values Integration (Respect, Integrity, Responsibility, Patriotism)
7. Practical Application Opportunities
8. Assessment Alignment with CBC Standards
9. Recommendations for Improvement
10. Missing Elements

CBC Alignment Criteria:
- Competency-based approach
- Learner-centered methodology
- Practical application focus
- Cultural relevance
- Values integration
- Assessment for learning
- Inclusive education principles`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: alignmentPrompt,
      maxTokens: 1200,
      temperature: 0.4,
    })

    // Calculate alignment score based on content analysis
    const alignmentScore = calculateAlignmentScore(content, gradeLevel, subject)

    return NextResponse.json({
      success: true,
      curriculumAlignment: {
        aiAnalysis: text,
        alignmentScore,
        recommendations: generateAlignmentRecommendations(alignmentScore),
        complianceChecklist: generateComplianceChecklist(content),
      },
      metadata: {
        gradeLevel,
        subject,
        analyzedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Curriculum Alignment API Error:", error)
    return NextResponse.json({ error: "Failed to analyze curriculum alignment" }, { status: 500 })
  }
}

function calculateAlignmentScore(content: string, gradeLevel: string, subject: string): number {
  let score = 5 // Base score

  // Check for CBC keywords
  const cbcKeywords = ["competency", "practical", "application", "values", "learner-centered"]
  const keywordMatches = cbcKeywords.filter((keyword) => content.toLowerCase().includes(keyword)).length

  score += keywordMatches * 0.5

  // Check for Kenyan context
  const kenyanKeywords = ["kenya", "kenyan", "shilling", "nairobi", "kiswahili"]
  const kenyanMatches = kenyanKeywords.filter((keyword) => content.toLowerCase().includes(keyword)).length

  score += kenyanMatches * 0.3

  // Ensure score is between 1-10
  return Math.min(Math.max(Math.round(score * 10) / 10, 1), 10)
}

function generateAlignmentRecommendations(score: number): string[] {
  const recommendations = []

  if (score < 6) {
    recommendations.push("Increase focus on competency-based learning approaches")
    recommendations.push("Add more practical applications and real-world examples")
    recommendations.push("Integrate CBC core values more explicitly")
  }

  if (score < 7) {
    recommendations.push("Include more Kenyan cultural contexts and examples")
    recommendations.push("Enhance learner-centered activities")
  }

  if (score < 8) {
    recommendations.push("Strengthen assessment for learning strategies")
    recommendations.push("Add more collaborative learning opportunities")
  }

  recommendations.push("Ensure inclusive education principles are followed")

  return recommendations
}

function generateComplianceChecklist(content: string): any[] {
  const checklist = [
    {
      item: "Competency-based approach",
      compliant: content.toLowerCase().includes("competency") || content.toLowerCase().includes("skill"),
      importance: "high",
    },
    {
      item: "Kenyan cultural context",
      compliant: content.toLowerCase().includes("kenya") || content.toLowerCase().includes("kenyan"),
      importance: "high",
    },
    {
      item: "Practical applications",
      compliant: content.toLowerCase().includes("practical") || content.toLowerCase().includes("application"),
      importance: "medium",
    },
    {
      item: "Values integration",
      compliant: content.toLowerCase().includes("values") || content.toLowerCase().includes("respect"),
      importance: "medium",
    },
    {
      item: "Assessment criteria",
      compliant: content.toLowerCase().includes("assessment") || content.toLowerCase().includes("evaluate"),
      importance: "medium",
    },
  ]

  return checklist
}
