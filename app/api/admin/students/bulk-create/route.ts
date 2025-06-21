import { NextResponse } from "next/server"
import { generateUsername, generatePassword, generateEmail } from "@/lib/utils/user-generator"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.schoolId || !body.schoolCode || !Array.isArray(body.students) || body.students.length === 0) {
      return NextResponse.json({ error: "Missing required fields: schoolId, schoolCode, or students" }, { status: 400 })
    }

    const { schoolId, schoolCode, students } = body

    // Generate accounts for each student
    const accounts = students.map((student: any, index: number) => {
      const username = generateUsername(schoolCode, index + 1)
      const password = generatePassword()
      const email = generateEmail(username)

      return {
        ...student,
        username,
        password,
        email,
        schoolId,
      }
    })

    // In a real application, this would save to a database

    return NextResponse.json({
      success: true,
      message: `Created ${accounts.length} student accounts`,
      accounts,
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
