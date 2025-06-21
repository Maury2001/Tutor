import type { CurriculumContext } from "./curriculum-prompts"
import {
  generateSubjectPrompt,
  generateAssessmentPrompt,
  generateCrossCurricularPrompt,
  generateDifferentiatedPrompt,
  generateTechnologyPrompt,
  generateCommunityEngagementPrompt,
} from "./curriculum-prompts"

export type PromptType = "subject" | "assessment" | "crossCurricular" | "differentiated" | "technology" | "community"

export type SubjectPromptType =
  | "conceptExplanation"
  | "problemSolving"
  | "assessment"
  | "experiment"
  | "inquiry"
  | "readingComprehension"
  | "writing"
  | "oralCommunication"
  | "historicalInquiry"
  | "geography"
  | "citizenship"
  | "visualArts"
  | "music"
  | "drama"
  | "practicalSkills"
  | "animalHusbandry"
  | "cropProduction"
  | "nutrition"
  | "textiles"

export interface PromptOptions {
  context: CurriculumContext
  promptType: PromptType
  subjectPromptType?: SubjectPromptType
  concept?: string
  topic?: string
  problem?: string
  question?: string
  crop?: string
  assessmentType?: "formative" | "summative" | "diagnostic"
  secondarySubjects?: string[]
  learnerNeeds?: {
    advancedLearners?: boolean
    strugglingLearners?: boolean
    englishLanguageLearners?: boolean
    specialNeeds?: boolean
  }
  availableTech?: {
    computers?: boolean
    tablets?: boolean
    smartphones?: boolean
    internet?: boolean
    projector?: boolean
    basicTools?: boolean
  }
}

/**
 * Selects and generates the appropriate prompt based on the provided options
 */
export function selectPrompt(options: PromptOptions): string {
  const {
    context,
    promptType,
    subjectPromptType = "conceptExplanation",
    concept,
    topic,
    problem,
    question,
    crop,
    assessmentType = "formative",
    secondarySubjects = [],
    learnerNeeds = {},
    availableTech = {},
  } = options

  switch (promptType) {
    case "subject":
      return generateSubjectPrompt(context.learningArea?.id || "general", subjectPromptType, {
        grade: context.grade,
        concept,
        topic,
        problem,
        question,
        crop,
      })

    case "assessment":
      return generateAssessmentPrompt(context, assessmentType)

    case "crossCurricular":
      return generateCrossCurricularPrompt(context.learningArea?.id || "general", secondarySubjects, context)

    case "differentiated":
      return generateDifferentiatedPrompt(context, learnerNeeds)

    case "technology":
      return generateTechnologyPrompt(context, availableTech)

    case "community":
      return generateCommunityEngagementPrompt(context)

    default:
      return generateSubjectPrompt(context.learningArea?.id || "general", "conceptExplanation", {
        grade: context.grade,
      })
  }
}

/**
 * Automatically detects the appropriate prompt type based on the user's question
 */
export function detectPromptType(question: string): {
  promptType: PromptType
  subjectPromptType?: SubjectPromptType
} {
  const q = question.toLowerCase()

  // Check for assessment-related queries
  if (q.includes("test") || q.includes("exam") || q.includes("assess") || q.includes("quiz")) {
    return { promptType: "assessment" }
  }

  // Check for technology integration
  if (q.includes("computer") || q.includes("online") || q.includes("digital") || q.includes("technology")) {
    return { promptType: "technology" }
  }

  // Check for community/parent engagement
  if (q.includes("parent") || q.includes("community") || q.includes("home") || q.includes("family")) {
    return { promptType: "community" }
  }

  // Check for cross-curricular connections
  if (q.includes("connect") || q.includes("integrate") || q.includes("across") || q.includes("subjects")) {
    return { promptType: "crossCurricular" }
  }

  // Check for differentiation needs
  if (q.includes("struggling") || q.includes("advanced") || q.includes("special needs") || q.includes("different")) {
    return { promptType: "differentiated" }
  }

  // Default to subject-specific prompts with appropriate subtype
  if (q.includes("solve") || q.includes("problem") || q.includes("calculate")) {
    return { promptType: "subject", subjectPromptType: "problemSolving" }
  }

  if (q.includes("experiment") || q.includes("investigate") || q.includes("observe")) {
    return { promptType: "subject", subjectPromptType: "experiment" }
  }

  if (q.includes("read") || q.includes("comprehension") || q.includes("story")) {
    return { promptType: "subject", subjectPromptType: "readingComprehension" }
  }

  if (q.includes("write") || q.includes("essay") || q.includes("composition")) {
    return { promptType: "subject", subjectPromptType: "writing" }
  }

  // Default
  return { promptType: "subject", subjectPromptType: "conceptExplanation" }
}
