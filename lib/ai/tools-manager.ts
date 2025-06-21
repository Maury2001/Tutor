export interface AIToolConfig {
  name: string
  description: string
  endpoint: string
  requiredFields: string[]
  category: "content" | "assessment" | "analysis" | "tutoring"
}

export const AI_TOOLS: Record<string, AIToolConfig> = {
  "lesson-generator": {
    name: "Lesson Generator",
    description: "Generate comprehensive CBC-aligned lesson plans",
    endpoint: "/api/ai/tools/lesson-generator",
    requiredFields: ["subject", "grade", "topic"],
    category: "content",
  },
  "assessment-generator": {
    name: "Assessment Creator",
    description: "Create tests, quizzes, and assessments with rubrics",
    endpoint: "/api/ai/tools/assessment-generator",
    requiredFields: ["subject", "grade", "topic"],
    category: "assessment",
  },
  "content-creator": {
    name: "Content Creator",
    description: "Generate educational materials and resources",
    endpoint: "/api/ai/tools/content-creator",
    requiredFields: ["type", "subject", "grade", "topic"],
    category: "content",
  },
  "quiz-maker": {
    name: "Quiz Maker",
    description: "Create interactive quizzes and knowledge checks",
    endpoint: "/api/ai/tools/quiz-maker",
    requiredFields: ["subject", "grade", "topic"],
    category: "assessment",
  },
  "rubric-creator": {
    name: "Rubric Creator",
    description: "Build assessment rubrics and scoring guides",
    endpoint: "/api/ai/tools/rubric-creator",
    requiredFields: ["subject", "grade", "assignment"],
    category: "assessment",
  },
  "feedback-generator": {
    name: "Feedback Generator",
    description: "Generate personalized student feedback",
    endpoint: "/api/ai/tools/feedback-generator",
    requiredFields: ["studentWork", "grade", "subject"],
    category: "analysis",
  },
  "worksheet-generator": {
    name: "Worksheet Generator",
    description: "Create practice worksheets and activities",
    endpoint: "/api/ai/tools/worksheet-generator",
    requiredFields: ["subject", "grade", "topic"],
    category: "content",
  },
  "curriculum-analyzer": {
    name: "Curriculum Analyzer",
    description: "Analyze content for CBC curriculum alignment",
    endpoint: "/api/ai/tools/curriculum-analyzer",
    requiredFields: ["content", "subject", "grade"],
    category: "analysis",
  },
  "student-progress": {
    name: "Progress Analyzer",
    description: "Analyze and track student learning progress",
    endpoint: "/api/ai/tools/student-progress",
    requiredFields: ["studentData", "subject", "grade"],
    category: "analysis",
  },
  "adaptive-tutor": {
    name: "Adaptive Tutor",
    description: "Provide personalized tutoring and support",
    endpoint: "/api/ai/tools/adaptive-tutor",
    requiredFields: ["studentQuery", "subject", "grade"],
    category: "tutoring",
  },
}

export class AIToolsManager {
  static async callTool(toolId: string, data: any) {
    const tool = AI_TOOLS[toolId]
    if (!tool) {
      throw new Error(`Tool ${toolId} not found`)
    }

    // Validate required fields
    for (const field of tool.requiredFields) {
      if (!data[field]) {
        throw new Error(`Required field ${field} is missing`)
      }
    }

    try {
      const response = await fetch(tool.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Tool ${toolId} failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error calling tool ${toolId}:`, error)
      throw error
    }
  }

  static getToolsByCategory(category: AIToolConfig["category"]) {
    return Object.entries(AI_TOOLS)
      .filter(([_, tool]) => tool.category === category)
      .map(([id, tool]) => ({ id, ...tool }))
  }

  static getAllTools() {
    return Object.entries(AI_TOOLS).map(([id, tool]) => ({ id, ...tool }))
  }
}
