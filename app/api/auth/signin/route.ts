import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Simple user database for demo
const users = [
  {
    id: "admin-1",
    email: "workerpeter@gmail.com",
    password: "2020",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "student-1",
    email: "student@demo.com",
    password: "demo",
    name: "Demo Student",
    role: "student",
  },
  {
    id: "teacher-1",
    email: "teacher@demo.com",
    password: "demo",
    name: "Demo Teacher",
    role: "teacher",
  },
  {
    id: "parent-1",
    email: "parent@demo.com",
    password: "demo",
    name: "Demo Parent",
    role: "parent",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Create session data
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
