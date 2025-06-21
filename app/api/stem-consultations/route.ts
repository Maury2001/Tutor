import { type NextRequest, NextResponse } from "next/server"

interface ConsultationRequest {
  studentId: string
  consultationType: string
  consultantName: string
  consultantTitle: string
  consultantOrganization: string
  subject: string
  date: string
  time: string
  duration: number
  location: string
  meetingType: string
  objectives: string[]
  contactInfo: {
    email: string
    phone: string
  }
  notes: string
}

export async function POST(request: NextRequest) {
  try {
    const consultationData: ConsultationRequest = await request.json()

    // In a real application, this would:
    // 1. Save to database
    // 2. Send calendar invitations
    // 3. Send confirmation emails
    // 4. Create reminders

    console.log("Scheduling STEM consultation:", consultationData)

    // Mock response
    const response = {
      success: true,
      consultationId: `consult-${Date.now()}`,
      message: "STEM consultation scheduled successfully",
      details: {
        consultant: consultationData.consultantName,
        date: consultationData.date,
        time: consultationData.time,
        location: consultationData.location,
        confirmationSent: true,
        calendarInviteSent: true,
      },
      nextSteps: [
        "Confirmation email sent to all parties",
        "Calendar invitation created",
        "Reminder set for 24 hours before meeting",
        "Meeting agenda prepared and shared",
      ],
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error scheduling STEM consultation:", error)
    return NextResponse.json({ error: "Failed to schedule consultation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get("studentId")
  const status = searchParams.get("status")

  try {
    // Mock consultation data
    const mockConsultations = [
      {
        id: "consult-001",
        studentId: "student-001",
        consultantName: "Mr. David Mwangi",
        consultantTitle: "Senior Mathematics Teacher",
        consultantOrganization: "Nairobi High School",
        subject: "Advanced Mathematics",
        date: "2024-01-20",
        time: "10:00",
        status: "Scheduled",
        meetingType: "In-Person",
        location: "Mathematics Department Office",
      },
      {
        id: "consult-002",
        studentId: "student-001",
        consultantName: "Eng. Sarah Njeri",
        consultantTitle: "Senior Software Engineer",
        consultantOrganization: "Safaricom PLC",
        subject: "Software Engineering Career",
        date: "2024-01-25",
        time: "14:30",
        status: "Confirmed",
        meetingType: "In-Person",
        location: "Safaricom Headquarters",
      },
    ]

    let filteredConsultations = mockConsultations

    if (studentId) {
      filteredConsultations = filteredConsultations.filter((c) => c.studentId === studentId)
    }

    if (status) {
      filteredConsultations = filteredConsultations.filter((c) => c.status === status)
    }

    return NextResponse.json({
      consultations: filteredConsultations,
      total: filteredConsultations.length,
      summary: {
        scheduled: mockConsultations.filter((c) => c.status === "Scheduled").length,
        confirmed: mockConsultations.filter((c) => c.status === "Confirmed").length,
        completed: mockConsultations.filter((c) => c.status === "Completed").length,
      },
    })
  } catch (error) {
    console.error("Error fetching STEM consultations:", error)
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 })
  }
}
