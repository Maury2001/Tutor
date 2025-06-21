import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()
    const cookieStore = await cookies()

    // Load existing users from cookie
    const existingUsers = JSON.parse(cookieStore.get("user-db")?.value || "[]")

    // Check for duplicate email
    if (existingUsers.some((u: any) => u.email === email)) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 })
    }

    // Create new user object
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      password, // ⚠️ Ideally hash it
      role: role || "student",
    }

    // Add to mock database
    const updatedUsers = [...existingUsers, newUser]
    cookieStore.set("user-db", JSON.stringify(updatedUsers), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    })

    // Set session
    const sessionData = { id: newUser.id, email, name, role: newUser.role }
    cookieStore.set("auth-session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ success: true, user: sessionData })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
