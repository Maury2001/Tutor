import { type NextRequest, NextResponse } from "next/server"

interface SessionData {
  sessionId: string
  studentId: string
  counselorId: string
  sessionType: string
  date: string
  time: string
  attendees: string[]
  pathwayDiscussions: Array<{
    pathway: string
    studentInterest: string
    parentSupport: string
    notes: string
  }>
  actionItems: Array<{
    task: string
    assignedTo: string
    dueDate: string
    priority: string
  }>
  sessionNotes: string
  nextSteps: string[]
  followUpDate?: string
}

export async function POST(request: NextRequest) {
  try {
    const sessionData: SessionData = await request.json()

    // In a real application, save to database
    console.log("Saving counseling session:", sessionData)

    // Generate session summary
    const summary = generateSessionSummary(sessionData)

    return NextResponse.json({
      success: true,
      sessionId: sessionData.sessionId,
      summary,
      savedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error saving counseling session:", error)
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")
  const studentId = searchParams.get("studentId")

  try {
    // Mock session data - in real app, fetch from database
    const mockSessions = [
      {
        id: "session-001",
        studentId: "student-001",
        studentName: "John Kamau",
        counselorName: "Ms. Sarah Wanjiku",
        sessionDate: "2024-01-15",
        sessionTime: "14:00",
        sessionType: "Initial",
        status: "In Progress",
        pathwayRecommendations: [
          { pathway: "STEM Pathway", matchScore: 92, discussed: true },
          { pathway: "Social Sciences", matchScore: 78, discussed: true },
        ],
        actionItems: [
          {
            id: "action-001",
            task: "Research STEM career opportunities",
            assignedTo: "John Kamau",
            dueDate: "2024-01-22",
            status: "Pending",
            priority: "High",
          },
        ],
        nextSteps: [
          "Schedule follow-up session in 2 weeks",
          "Arrange meeting with STEM teachers",
          "Provide university admission requirements document",
        ],
      },
    ]

    if (sessionId) {
      const session = mockSessions.find((s) => s.id === sessionId)
      return NextResponse.json(session || { error: "Session not found" })
    }

    if (studentId) {
      const studentSessions = mockSessions.filter((s) => s.studentId === studentId)
      return NextResponse.json(studentSessions)
    }

    return NextResponse.json(mockSessions)
  } catch (error) {
    console.error("Error fetching counseling sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

function generateSessionSummary(sessionData: SessionData): string {
  return `
# Counseling Session Summary

**Date:** ${new Date(sessionData.date).toLocaleDateString()}
**Time:** ${sessionData.time}
**Type:** ${sessionData.sessionType}
**Attendees:** ${sessionData.attendees.join(", ")}

## Pathway Discussions
${sessionData.pathwayDiscussions
  .map(
    (discussion) => `
- **${discussion.pathway}**
  - Student Interest: ${discussion.studentInterest}
  - Parent Support: ${discussion.parentSupport}
  - Notes: ${discussion.notes}
`,
  )
  .join("")}

## Action Items
${sessionData.actionItems
  .map(
    (item) => `
- ${item.task} (Assigned to: ${item.assignedTo}, Due: ${item.dueDate}, Priority: ${item.priority})
`,
  )
  .join("")}

## Next Steps
${sessionData.nextSteps.map((step) => `- ${step}`).join("\n")}

${sessionData.followUpDate ? `\n**Follow-up Scheduled:** ${sessionData.followUpDate}` : ""}

## Session Notes
${sessionData.sessionNotes}
`
}
