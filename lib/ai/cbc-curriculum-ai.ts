import {
  CBC_CURRICULUM,
  type GradeLevel,
  type LearningArea,
  type Strand,
  type SubStrand,
  type LearningOutcome,
  type LearningObjective,
} from "@/lib/cbc-curriculum"

export interface CBCCurriculumContext {
  grade: GradeLevel
  learningArea: LearningArea
  strand?: Strand
  subStrand?: SubStrand
  outcome?: LearningOutcome
  objective?: LearningObjective
}

export interface CBCSimulationTemplate {
  id: string
  title: string
  description: string
  learningObjectives: string[]
  materials: string[]
  steps: string[]
  assessmentCriteria: string[]
  adaptations: {
    grade: GradeLevel
    modifications: string[]
  }[]
  digitalTools: string[]
  realWorldConnections: string[]
}

export class CBCCurriculumAI {
  private curriculumData = CBC_CURRICULUM

  generateCBCResponse(question: string, context: CBCCurriculumContext, mode: string): string {
    const { grade, learningArea, strand, subStrand, outcome } = context

    // Build curriculum-specific context
    let curriculumContext = `
🇰🇪 **CBC Kenya Curriculum Context**
- **Grade Level**: ${grade.toUpperCase()}
- **Learning Area**: ${learningArea.name}
- **Description**: ${learningArea.description}
`

    if (strand) {
      curriculumContext += `- **Strand**: ${strand.name} - ${strand.description}\n`
    }

    if (subStrand) {
      curriculumContext += `- **Sub-Strand**: ${subStrand.name} - ${subStrand.description}\n`
    }

    if (outcome) {
      curriculumContext += `- **Learning Outcome**: ${outcome.description}\n`
    }

    // Generate mode-specific responses with CBC alignment
    switch (mode) {
      case "guided":
        return this.generateGuidedLearningResponse(question, context, curriculumContext)
      case "revision":
        return this.generateRevisionResponse(question, context, curriculumContext)
      case "mastery":
        return this.generateMasteryResponse(question, context, curriculumContext)
      case "quiz-generation":
        return this.generateQuizResponse(question, context, curriculumContext)
      case "summary-notes":
        return this.generateNotesResponse(question, context, curriculumContext)
      default:
        return this.generateGuidedLearningResponse(question, context, curriculumContext)
    }
  }

  private generateGuidedLearningResponse(
    question: string,
    context: CBCCurriculumContext,
    curriculumContext: string,
  ): string {
    const { grade, learningArea, subStrand } = context

    return `${curriculumContext}

🎯 **CBC Guided Learning Session**

**Learning Objectives Alignment:**
${this.getRelevantObjectives(context)}

**Step-by-Step Learning Path:**

**Step 1: Foundation Building** 🏗️
Let's start with the core concepts from the CBC curriculum for ${grade.toUpperCase()} ${learningArea.name}.

**Step 2: Practical Application** 🔬
${this.generatePracticalActivities(context)}

**Step 3: Real-World Connections** 🌍
${this.generateRealWorldConnections(context)}

**CBC Core Values Integration:**
- **Respect**: Understanding diverse perspectives
- **Integrity**: Honest learning and assessment
- **Responsibility**: Taking ownership of learning
- **Patriotism**: Connecting to Kenyan context

**Assessment Criteria:**
${this.generateAssessmentCriteria(context)}

**Next Steps:**
Ready to explore practical simulations or move to the next learning objective?`
  }

  private generateRevisionResponse(question: string, context: CBCCurriculumContext, curriculumContext: string): string {
    return `${curriculumContext}

🔄 **CBC Revision Session**

**Key Concepts Review:**
${this.getKeyConceptsForRevision(context)}

**Competency Check:**
Let's review the specific competencies you should have developed:

${this.generateCompetencyChecklist(context)}

**Practice Activities:**
${this.generateRevisionActivities(context)}

**Self-Assessment Questions:**
1. Can you explain the main concepts in your own words?
2. How does this connect to previous learning?
3. What real-world applications can you identify?

**Practical Simulations for Review:**
${this.getAvailableSimulations(context)}

Ready for more practice or shall we move to assessment?`
  }

  private generateMasteryResponse(question: string, context: CBCCurriculumContext, curriculumContext: string): string {
    return `${curriculumContext}

🏆 **CBC Mastery Assessment**

**Competency-Based Evaluation:**

**Assessment Task:**
${this.generateMasteryTask(context)}

**Success Criteria:**
${this.generateSuccessCriteria(context)}

**Performance Indicators:**
- **Exceeding Expectations**: Demonstrates advanced understanding with creative applications
- **Meeting Expectations**: Shows solid grasp of concepts with practical applications
- **Approaching Expectations**: Basic understanding with guided support
- **Below Expectations**: Requires additional support and practice

**Practical Assessment:**
${this.generatePracticalAssessment(context)}

**Reflection Questions:**
- What strategies worked best for your learning?
- How can you apply this knowledge in daily life?
- What connections do you see with other subjects?

Ready to demonstrate your mastery?`
  }

  private generateQuizResponse(question: string, context: CBCCurriculumContext, curriculumContext: string): string {
    return `${curriculumContext}

📝 **CBC-Aligned Quiz Generated**

**Quiz Details:**
- **Subject**: ${context.learningArea.name}
- **Grade**: ${context.grade.toUpperCase()}
- **Focus**: ${context.subStrand?.name || context.strand?.name || "General concepts"}
- **Duration**: 20-30 minutes
- **Question Types**: Multiple choice, short answer, practical application

**Sample Questions:**

**1. Multiple Choice (Knowledge)**
${this.generateMCQuestion(context)}

**2. Short Answer (Understanding)**
${this.generateShortAnswerQuestion(context)}

**3. Practical Application (Application)**
${this.generatePracticalQuestion(context)}

**Assessment Rubric:**
- **Knowledge (30%)**: Factual understanding
- **Comprehension (30%)**: Explanation and interpretation
- **Application (40%)**: Practical use and problem-solving

**CBC Values Integration:**
Each question connects to real Kenyan contexts and promotes critical thinking.

Would you like to start the quiz or generate more questions?`
  }

  private generateNotesResponse(question: string, context: CBCCurriculumContext, curriculumContext: string): string {
    return `${curriculumContext}

📚 **CBC Study Notes Created**

# ${context.learningArea.name} - ${context.subStrand?.name || context.strand?.name}

## Key Learning Outcomes
${this.formatLearningOutcomes(context)}

## Core Concepts
${this.generateCoreConceptsNotes(context)}

## Practical Applications
${this.generatePracticalApplicationsNotes(context)}

## Assessment Strategies
${this.generateAssessmentStrategiesNotes(context)}

## Digital Resources & Simulations
${this.generateDigitalResourcesNotes(context)}

## Real-World Connections
${this.generateRealWorldConnectionsNotes(context)}

## Study Tips
- Use practical examples from your environment
- Connect concepts to daily life experiences
- Practice with simulations and hands-on activities
- Collaborate with peers for deeper understanding

## Quick Reference
${this.generateQuickReference(context)}

---
*These notes align with CBC curriculum standards and KICD guidelines.*

Would you like me to expand any section or create additional study materials?`
  }

  // Helper methods for generating curriculum-specific content

  private getRelevantObjectives(context: CBCCurriculumContext): string {
    if (!context.subStrand) return "General learning objectives for the selected area."

    return context.subStrand.outcomes
      .flatMap((outcome) => outcome.objectives)
      .map((obj) => `• ${obj.description}`)
      .join("\n")
  }

  private generatePracticalActivities(context: CBCCurriculumContext): string {
    if (!context.subStrand) return "Practical activities will be provided based on your specific selection."

    const activities = context.subStrand.outcomes
      .flatMap((outcome) => outcome.objectives)
      .flatMap((obj) => obj.activities)

    return activities
      .slice(0, 3)
      .map((activity) => `• ${activity}`)
      .join("\n")
  }

  private generateRealWorldConnections(context: CBCCurriculumContext): string {
    const connections = {
      mathematics: "Connect to everyday calculations, measurements, and problem-solving in Kenyan contexts.",
      english: "Practice communication skills relevant to Kenyan professional and social environments.",
      kiswahili: "Strengthen national language skills for cultural preservation and communication.",
      science: "Explore scientific concepts through local environmental and technological examples.",
      social: "Understand Kenyan history, geography, and civic responsibilities.",
    }

    const areaKey = context.learningArea.name.toLowerCase()
    for (const [key, connection] of Object.entries(connections)) {
      if (areaKey.includes(key)) {
        return connection
      }
    }

    return "Connect learning to real-world applications in the Kenyan context."
  }

  private generateAssessmentCriteria(context: CBCCurriculumContext): string {
    return `
• **Knowledge**: Demonstrates understanding of key concepts
• **Skills**: Applies learning to practical situations
• **Values**: Shows respect, integrity, and responsibility
• **Competencies**: Meets grade-level expectations for ${context.grade.toUpperCase()}`
  }

  private getKeyConceptsForRevision(context: CBCCurriculumContext): string {
    if (!context.subStrand) return "Key concepts will be identified based on your selection."

    return context.subStrand.outcomes.map((outcome) => `• ${outcome.description}`).join("\n")
  }

  private generateCompetencyChecklist(context: CBCCurriculumContext): string {
    return `
✓ I can explain the main concepts clearly
✓ I can apply knowledge to solve problems
✓ I can connect learning to real-world situations
✓ I can demonstrate practical skills
✓ I can work collaboratively with others`
  }

  private generateRevisionActivities(context: CBCCurriculumContext): string {
    return `
• Review key vocabulary and concepts
• Practice with interactive simulations
• Create concept maps or diagrams
• Discuss with peers or family members
• Apply knowledge to solve real problems`
  }

  private getAvailableSimulations(context: CBCCurriculumContext): string {
    if (!context.subStrand) return "Simulations will be available based on your selection."

    const simulations = context.subStrand.outcomes
      .flatMap((outcome) => outcome.objectives)
      .flatMap((obj) => obj.practicalSimulations || [])

    if (simulations.length === 0) {
      return "No specific simulations available for this topic."
    }

    return simulations
      .slice(0, 3)
      .map((sim) => `• ${sim}`)
      .join("\n")
  }

  private generateMasteryTask(context: CBCCurriculumContext): string {
    const tasks = {
      mathematics: "Solve a multi-step problem involving real-world calculations.",
      english: "Create and present a short story or presentation.",
      kiswahili: "Compose and share a dialogue or narrative.",
      science: "Design and conduct a simple investigation.",
      social: "Research and present on a local community issue.",
    }

    const areaKey = context.learningArea.name.toLowerCase()
    for (const [key, task] of Object.entries(tasks)) {
      if (areaKey.includes(key)) {
        return task
      }
    }

    return "Complete a comprehensive task demonstrating your understanding."
  }

  private generateSuccessCriteria(context: CBCCurriculumContext): string {
    return `
• Demonstrates clear understanding of concepts
• Applies knowledge effectively to new situations
• Shows creativity and critical thinking
• Communicates ideas clearly and confidently
• Connects learning to real-world contexts`
  }

  private generatePracticalAssessment(context: CBCCurriculumContext): string {
    return `
**Hands-on Task**: Apply your learning to a practical situation
**Collaboration**: Work with others to solve a problem
**Presentation**: Share your findings with the class
**Reflection**: Explain your learning process and outcomes`
  }

  private generateMCQuestion(context: CBCCurriculumContext): string {
    return `Which of the following best describes the main concept in ${context.subStrand?.name || "this topic"}?
A) Option related to basic understanding
B) Option related to practical application
C) Option related to real-world connection
D) Option related to advanced thinking`
  }

  private generateShortAnswerQuestion(context: CBCCurriculumContext): string {
    return `Explain how the concepts in ${context.subStrand?.name || "this topic"} can be applied in your daily life. Provide specific examples from your community or environment.`
  }

  private generatePracticalQuestion(context: CBCCurriculumContext): string {
    return `Design a simple project or activity that demonstrates your understanding of ${context.subStrand?.name || "this topic"}. Include materials needed and step-by-step instructions.`
  }

  private formatLearningOutcomes(context: CBCCurriculumContext): string {
    if (!context.subStrand) return "Learning outcomes will be displayed based on your selection."

    return context.subStrand.outcomes.map((outcome, index) => `${index + 1}. ${outcome.description}`).join("\n")
  }

  private generateCoreConceptsNotes(context: CBCCurriculumContext): string {
    return `
### Main Ideas
- Key concept 1: [Based on curriculum content]
- Key concept 2: [Based on curriculum content]
- Key concept 3: [Based on curriculum content]

### Important Terms
- Term 1: Definition and example
- Term 2: Definition and example
- Term 3: Definition and example`
  }

  private generatePracticalApplicationsNotes(context: CBCCurriculumContext): string {
    return `
### How to Use This Knowledge
- In school projects and assignments
- In daily life situations
- In future career preparation
- In community involvement

### Examples from Kenya
- Local examples relevant to the topic
- Cultural connections
- Environmental applications`
  }

  private generateAssessmentStrategiesNotes(context: CBCCurriculumContext): string {
    return `
### How You'll Be Assessed
- Practical demonstrations
- Written assignments
- Group projects
- Oral presentations
- Self-reflection activities`
  }

  private generateDigitalResourcesNotes(context: CBCCurriculumContext): string {
    if (!context.subStrand) return "Digital resources will be listed based on your selection."

    const simulations = context.subStrand.outcomes
      .flatMap((outcome) => outcome.objectives)
      .flatMap((obj) => obj.practicalSimulations || [])

    return simulations.length > 0
      ? simulations.map((sim) => `• ${sim}`).join("\n")
      : "• Interactive online activities\n• Educational videos\n• Virtual simulations"
  }

  private generateRealWorldConnectionsNotes(context: CBCCurriculumContext): string {
    return `
### Connections to Daily Life
- How this applies in your community
- Career connections
- Problem-solving applications
- Cultural relevance in Kenya`
  }

  private generateQuickReference(context: CBCCurriculumContext): string {
    return `
### Key Points to Remember
- Main concept summary
- Important formulas or rules
- Common mistakes to avoid
- Study tips for success`
  }

  // Simulation template generator
  generateSimulationTemplate(context: CBCCurriculumContext): CBCSimulationTemplate {
    const simulationId = `sim_${context.grade}_${context.learningArea.id}_${Date.now()}`

    return {
      id: simulationId,
      title: `${context.subStrand?.name || context.strand?.name} Practical Simulation`,
      description: `Interactive simulation for ${context.grade.toUpperCase()} ${context.learningArea.name}`,
      learningObjectives: this.getSimulationObjectives(context),
      materials: this.getSimulationMaterials(context),
      steps: this.getSimulationSteps(context),
      assessmentCriteria: this.getSimulationAssessment(context),
      adaptations: this.getSimulationAdaptations(context),
      digitalTools: this.getDigitalTools(context),
      realWorldConnections: this.getSimulationRealWorldConnections(context),
    }
  }

  private getSimulationObjectives(context: CBCCurriculumContext): string[] {
    if (!context.subStrand) return ["General learning objectives"]

    return context.subStrand.outcomes
      .flatMap((outcome) => outcome.objectives)
      .map((obj) => obj.description)
      .slice(0, 3)
  }

  private getSimulationMaterials(context: CBCCurriculumContext): string[] {
    const commonMaterials = ["Paper and pencils", "Calculator (if needed)", "Internet access"]

    const subjectMaterials = {
      mathematics: ["Measuring tools", "Geometric shapes", "Number cards"],
      science: ["Simple lab materials", "Observation sheets", "Safety equipment"],
      english: ["Reading materials", "Writing supplies", "Audio/video resources"],
      kiswahili: ["Kiswahili texts", "Cultural artifacts", "Audio recordings"],
      social: ["Maps", "Historical images", "Community resources"],
    }

    const areaKey = context.learningArea.name.toLowerCase()
    for (const [key, materials] of Object.entries(subjectMaterials)) {
      if (areaKey.includes(key)) {
        return [...commonMaterials, ...materials]
      }
    }

    return commonMaterials
  }

  private getSimulationSteps(context: CBCCurriculumContext): string[] {
    return [
      "1. Introduction and objective setting",
      "2. Material preparation and safety check",
      "3. Guided exploration and discovery",
      "4. Hands-on practice and application",
      "5. Reflection and discussion",
      "6. Assessment and feedback",
    ]
  }

  private getSimulationAssessment(context: CBCCurriculumContext): string[] {
    return [
      "Participation and engagement",
      "Understanding of key concepts",
      "Application of knowledge",
      "Collaboration and communication",
      "Problem-solving skills",
      "Reflection and self-assessment",
    ]
  }

  private getSimulationAdaptations(context: CBCCurriculumContext): { grade: GradeLevel; modifications: string[] }[] {
    return [
      {
        grade: context.grade,
        modifications: [
          "Age-appropriate language and examples",
          "Suitable complexity level",
          "Relevant cultural contexts",
          "Appropriate time allocation",
        ],
      },
    ]
  }

  private getDigitalTools(context: CBCCurriculumContext): string[] {
    return [
      "Interactive whiteboard or projector",
      "Educational apps and websites",
      "Virtual reality tools (if available)",
      "Online collaboration platforms",
      "Digital assessment tools",
    ]
  }

  private getSimulationRealWorldConnections(context: CBCCurriculumContext): string[] {
    return [
      "Local community applications",
      "Career pathway connections",
      "Environmental and social relevance",
      "Cultural and historical significance",
      "Future learning preparation",
    ]
  }
}

// Export singleton instance
export const cbcCurriculumAI = new CBCCurriculumAI()
