import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { groupMembers, learningObjective, subject, gradeLevel, activityType, duration } = await request.json()

    if (!groupMembers || !learningObjective) {
      return NextResponse.json(
        {
          error: "Group members and learning objective are required",
        },
        { status: 400 },
      )
    }

    const collaborativePrompt = `Design collaborative learning activity for CBC students in Kenya:

Group Members: ${JSON.stringify(groupMembers)}
Learning Objective: ${learningObjective}
Subject: ${subject || "General"}
Grade Level: ${gradeLevel || "Mixed"}
Activity Type: ${activityType || "Group project"}
Duration: ${duration || "45 minutes"}

Create collaborative learning experience that:
1. Promotes teamwork and cooperation
2. Assigns appropriate roles to each member
3. Includes peer learning opportunities
4. Integrates CBC core values
5. Provides clear instructions and guidelines
6. Includes assessment criteria for collaboration
7. Encourages cultural exchange and diversity
8. Builds communication skills
9. Promotes problem-solving together
10. Includes reflection and feedback components

Collaborative Learning Principles:
- Positive interdependence
- Individual accountability
- Face-to-face interaction
- Social skills development
- Group processing and reflection`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: collaborativePrompt,
      maxTokens: 1200,
      temperature: 0.8,
    })

    // Generate specific collaborative elements
    const roleAssignments = generateRoleAssignments(groupMembers)
    const collaborationTools = generateCollaborationTools(activityType)
    const assessmentRubric = generateCollaborationRubric()

    return NextResponse.json({
      success: true,
      collaborativeLearning: {
        activityPlan: text,
        roleAssignments,
        collaborationTools,
        assessmentRubric,
        timelineBreakdown: generateTimelineBreakdown(duration),
        reflectionQuestions: generateReflectionQuestions(),
      },
      metadata: {
        groupSize: groupMembers.length,
        subject,
        gradeLevel,
        activityType,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Collaborative Learning API Error:", error)
    return NextResponse.json({ error: "Failed to generate collaborative learning activity" }, { status: 500 })
  }
}

function generateRoleAssignments(members: any[]) {
  const roles = [
    "Team Leader - Coordinates group activities and ensures everyone participates",
    "Researcher - Gathers information and resources for the group",
    "Presenter - Prepares and delivers group presentations",
    "Recorder - Takes notes and documents group decisions",
    "Timekeeper - Manages time and keeps group on schedule",
    "Quality Controller - Reviews work and ensures standards are met",
  ]

  return members.map((member, index) => ({
    studentId: member.id || `student_${index + 1}`,
    name: member.name || `Student ${index + 1}`,
    role: roles[index % roles.length],
    responsibilities: getRoleResponsibilities(roles[index % roles.length]),
  }))
}

function getRoleResponsibilities(role: string): string[] {
  const responsibilities = {
    "Team Leader": [
      "Facilitate group discussions",
      "Ensure equal participation",
      "Resolve conflicts diplomatically",
      "Coordinate with teacher when needed",
    ],
    Researcher: [
      "Find reliable information sources",
      "Organize research materials",
      "Share findings with the group",
      "Verify accuracy of information",
    ],
    Presenter: [
      "Prepare presentation materials",
      "Practice delivery techniques",
      "Represent group in presentations",
      "Handle questions from audience",
    ],
    Recorder: [
      "Take detailed meeting notes",
      "Track group decisions",
      "Maintain group documentation",
      "Share notes with all members",
    ],
    Timekeeper: [
      "Monitor activity timelines",
      "Give time warnings to group",
      "Help group stay focused",
      "Manage break schedules",
    ],
    "Quality Controller": [
      "Review all group work",
      "Ensure CBC standards are met",
      "Provide constructive feedback",
      "Coordinate final quality checks",
    ],
  }

  const roleKey = role.split(" - ")[0]
  return responsibilities[roleKey] || ["Support group activities", "Participate actively"]
}

function generateCollaborationTools(activityType: string) {
  const tools = [
    {
      name: "Group Discussion Board",
      purpose: "Share ideas and communicate between meetings",
      usage: "Post questions, share resources, discuss progress",
    },
    {
      name: "Shared Document",
      purpose: "Collaborate on written work in real-time",
      usage: "Write reports, create presentations, take notes together",
    },
    {
      name: "Task Management Board",
      purpose: "Track individual and group tasks",
      usage: "Assign tasks, monitor progress, set deadlines",
    },
    {
      name: "Video Conferencing",
      purpose: "Meet virtually when needed",
      usage: "Group meetings, presentations, peer tutoring",
    },
  ]

  return tools
}

function generateCollaborationRubric() {
  return {
    criteria: [
      {
        aspect: "Participation",
        excellent: "Actively contributes ideas and listens to others",
        good: "Usually contributes and listens well",
        satisfactory: "Sometimes contributes, needs encouragement",
        needsImprovement: "Rarely participates or listens",
      },
      {
        aspect: "Cooperation",
        excellent: "Works very well with all group members",
        good: "Usually cooperates and helps others",
        satisfactory: "Sometimes cooperates, occasional conflicts",
        needsImprovement: "Difficulty working with others",
      },
      {
        aspect: "Responsibility",
        excellent: "Always completes tasks on time and well",
        good: "Usually completes tasks satisfactorily",
        satisfactory: "Sometimes needs reminders about tasks",
        needsImprovement: "Often fails to complete assigned tasks",
      },
      {
        aspect: "Communication",
        excellent: "Communicates clearly and respectfully",
        good: "Usually communicates well",
        satisfactory: "Communication is adequate",
        needsImprovement: "Communication needs significant improvement",
      },
    ],
    scoringGuide: {
      excellent: 4,
      good: 3,
      satisfactory: 2,
      needsImprovement: 1,
    },
  }
}

function generateTimelineBreakdown(duration: string) {
  const totalMinutes = Number.parseInt(duration) || 45

  return [
    {
      phase: "Introduction & Role Assignment",
      duration: `${Math.round(totalMinutes * 0.1)} minutes`,
      activities: ["Greet team members", "Review roles", "Set ground rules"],
    },
    {
      phase: "Planning & Strategy",
      duration: `${Math.round(totalMinutes * 0.2)} minutes`,
      activities: ["Discuss objectives", "Plan approach", "Assign initial tasks"],
    },
    {
      phase: "Active Collaboration",
      duration: `${Math.round(totalMinutes * 0.5)} minutes`,
      activities: ["Work on main activity", "Share ideas", "Create together"],
    },
    {
      phase: "Review & Refinement",
      duration: `${Math.round(totalMinutes * 0.15)} minutes`,
      activities: ["Review work quality", "Make improvements", "Prepare presentation"],
    },
    {
      phase: "Reflection & Feedback",
      duration: `${Math.round(totalMinutes * 0.05)} minutes`,
      activities: ["Reflect on collaboration", "Give peer feedback", "Plan next steps"],
    },
  ]
}

function generateReflectionQuestions() {
  return [
    "What did you learn from working with your group members?",
    "How did your role contribute to the group's success?",
    "What collaboration skills did you develop or improve?",
    "What challenges did your group face and how did you overcome them?",
    "How did working together help you understand the topic better?",
    "What would you do differently in your next group activity?",
    "How did you show respect and support for your teammates?",
    "What CBC values did you practice during this collaboration?",
  ]
}
