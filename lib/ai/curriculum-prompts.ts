// lib/ai/curriculum-prompts.ts

type PromptContext = {
  gradeLevel: string
  subjectArea: SubjectArea
  topic: string
}

type SubjectArea =
  | "Math"
  | "Science"
  | "English Language Arts"
  | "Social Studies"
  | "Art"
  | "Music"
  | "Physical Education"
  | "Technology"

type AssessmentType = "Quiz" | "Test" | "Project" | "Presentation" | "Essay" | "Class Participation"

const generateLearningPrompt = (context: PromptContext): string => {
  return `Generate a detailed lesson plan for a ${context.gradeLevel} ${context.subjectArea} class on the topic of ${context.topic}. Include learning objectives, activities, and assessment methods.`
}

const generateQuestionSuggestions = (context: PromptContext): string => {
  return `Suggest 5 engaging and thought-provoking questions to ask ${context.gradeLevel} students during a ${context.subjectArea} lesson about ${context.topic}.`
}

const extractTopicsFromQuestion = (question: string): string => {
  return `Extract the main topics covered in the following question: "${question}". Provide a comma-separated list of keywords.`
}

const generateSubjectPrompt = (context: PromptContext, promptType: string): string => {
  return `Generate a ${promptType} prompt for a ${context.gradeLevel} ${context.subjectArea} class on the topic of ${context.topic}.`
}

const generateAssessmentPrompt = (context: PromptContext, assessmentType: AssessmentType): string => {
  return `Create an assessment for ${context.gradeLevel} grade students in ${context.subjectArea} on the topic of ${context.topic}. The assessment type is a ${assessmentType}. Include clear instructions and a rubric if applicable.`
}

const generateCrossCurricularPrompt = (context: PromptContext, otherSubject: SubjectArea): string => {
  return `Develop a cross-curricular activity that integrates ${context.subjectArea} and ${otherSubject} for ${context.gradeLevel} grade students, focusing on the topic of ${context.topic}.`
}

const generateDifferentiatedPrompt = (context: PromptContext, differentiationStrategy: string): string => {
  return `Design a differentiated learning activity for ${context.gradeLevel} grade students in ${context.subjectArea} on the topic of ${context.topic}, using the following differentiation strategy: ${differentiationStrategy}.`
}

const generateTechnologyIntegrationPrompt = (context: PromptContext, technologyTool: string): string => {
  return `Create a lesson plan that integrates ${technologyTool} into a ${context.gradeLevel} ${context.subjectArea} lesson on ${context.topic}.`
}

const generateCommunityEngagementPrompt = (context: PromptContext): string => {
  return `Develop a community engagement project for ${context.gradeLevel} grade students in ${context.subjectArea} related to the topic of ${context.topic}.`
}

const generateTechnologyPrompt = (context: PromptContext, technologyType: string): string => {
  return `Create a technology-enhanced lesson plan for ${context.gradeLevel} grade students in ${context.subjectArea} on the topic of ${context.topic}, incorporating ${technologyType} technology.`
}

const SUBJECT_PROMPT_TEMPLATES = {
  Math: {
    problemSolving: "Create a step-by-step problem-solving activity for {grade} students on {topic}",
    conceptExplanation: "Explain the concept of {topic} to {grade} students using simple language and examples",
    practiceProblems: "Generate 5 practice problems for {grade} students on {topic} with varying difficulty levels",
  },
  Science: {
    experiment: "Design a safe hands-on experiment for {grade} students to explore {topic}",
    observation: "Create an observation activity for {grade} students to learn about {topic}",
    hypothesis: "Help {grade} students form hypotheses about {topic} through guided questions",
  },
  "English Language Arts": {
    reading: "Create a reading comprehension activity for {grade} students on {topic}",
    writing: "Design a creative writing prompt for {grade} students related to {topic}",
    vocabulary: "Develop vocabulary exercises for {grade} students focusing on {topic}",
  },
  "Social Studies": {
    research: "Create a research project for {grade} students on {topic}",
    discussion: "Design discussion questions for {grade} students about {topic}",
    timeline: "Help {grade} students create a timeline related to {topic}",
  },
}

export {
  generateLearningPrompt,
  generateQuestionSuggestions,
  extractTopicsFromQuestion,
  generateSubjectPrompt,
  generateAssessmentPrompt,
  generateCrossCurricularPrompt,
  generateDifferentiatedPrompt,
  generateTechnologyIntegrationPrompt,
  generateCommunityEngagementPrompt,
  generateTechnologyPrompt,
  SUBJECT_PROMPT_TEMPLATES,
  type PromptContext,
  type AssessmentType,
  type SubjectArea,
}
