import { type NextRequest, NextResponse } from "next/server"
import {
  generateSubjectPrompt,
  generateAssessmentPrompt,
  generateCrossCurricularPrompt,
  generateDifferentiatedPrompt,
  generateTechnologyPrompt,
  generateCommunityEngagementPrompt,
  type CurriculumContext,
  type GradeLevel,
} from "@/lib/ai/curriculum-prompts"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      promptType,
      grade,
      subject,
      subjectPromptType,
      concept,
      topic,
      problem,
      assessmentType,
      secondarySubjects,
      learnerNeeds,
      availableTech,
    } = body

    if (!promptType || !grade || !subject) {
      return NextResponse.json({ error: "Missing required parameters: promptType, grade, subject" }, { status: 400 })
    }

    const context: CurriculumContext = {
      grade: grade as GradeLevel,
      learningArea: {
        id: subject,
        name: subject,
        description: `${subject} learning area`,
      },
    }

    let prompt = ""

    switch (promptType) {
      case "subject":
        if (!subjectPromptType) {
          return NextResponse.json({ error: "subjectPromptType is required for subject prompts" }, { status: 400 })
        }
        prompt = generateSubjectPrompt(subject, subjectPromptType, {
          grade: grade as GradeLevel,
          concept,
          topic,
          problem,
        })
        break

      case "assessment":
        if (!assessmentType) {
          return NextResponse.json({ error: "assessmentType is required for assessment prompts" }, { status: 400 })
        }
        prompt = generateAssessmentPrompt(context, assessmentType as "formative" | "summative" | "diagnostic")
        break

      case "crossCurricular":
        if (!secondarySubjects || !Array.isArray(secondarySubjects)) {
          return NextResponse.json(
            { error: "secondarySubjects array is required for cross-curricular prompts" },
            { status: 400 },
          )
        }
        prompt = generateCrossCurricularPrompt(subject, secondarySubjects, context)
        break

      case "differentiated":
        if (!learnerNeeds) {
          return NextResponse.json(
            { error: "learnerNeeds object is required for differentiated prompts" },
            { status: 400 },
          )
        }
        prompt = generateDifferentiatedPrompt(context, learnerNeeds)
        break

      case "technology":
        if (!availableTech) {
          return NextResponse.json(
            { error: "availableTech object is required for technology prompts" },
            { status: 400 },
          )
        }
        prompt = generateTechnologyPrompt(context, availableTech)
        break

      case "community":
        prompt = generateCommunityEngagementPrompt(context)
        break

      default:
        return NextResponse.json(
          {
            error:
              "Invalid promptType. Must be one of: subject, assessment, crossCurricular, differentiated, technology, community",
          },
          { status: 400 },
        )
    }

    return NextResponse.json({
      prompt,
      metadata: {
        promptType,
        grade,
        subject,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating curriculum prompt:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "CBC Curriculum Prompt Generator API",
    endpoints: {
      POST: "/api/curriculum/prompts - Generate curriculum-specific prompts",
    },
    promptTypes: ["subject", "assessment", "crossCurricular", "differentiated", "technology", "community"],
    supportedSubjects: [
      "mathematics",
      "science",
      "languages",
      "socialStudies",
      "creativeArts",
      "agriculture",
      "homeScience",
    ],
  })
}
