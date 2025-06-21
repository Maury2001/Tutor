import { NextResponse } from "next/server"

export async function GET() {
  // In a real application, this would fetch from a database
  const schools = [
    {
      id: "1",
      name: "Nairobi Primary School",
      code: "NPS",
      location: "Nairobi",
      county: "Nairobi",
      principalName: "John Mwangi",
      contactPhone: "0712345678",
      contactEmail: "principal@nairobiprimary.edu",
      studentCount: 450,
      status: "active",
      createdAt: "2023-01-15",
    },
    {
      id: "2",
      name: "Mombasa Secondary School",
      code: "MSS",
      location: "Mombasa",
      county: "Mombasa",
      principalName: "Sarah Odhiambo",
      contactPhone: "0723456789",
      contactEmail: "principal@mombasasecondary.edu",
      studentCount: 320,
      status: "active",
      createdAt: "2023-02-20",
    },
  ]

  return NextResponse.json({ schools })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "location", "county", "principalName", "contactPhone", "contactEmail"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate school code from name
    const code = body.name
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()

    // In a real application, this would save to a database
    const newSchool = {
      id: Date.now().toString(),
      name: body.name,
      code,
      location: body.location,
      county: body.county,
      principalName: body.principalName,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      studentCount: 0,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({ school: newSchool }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
