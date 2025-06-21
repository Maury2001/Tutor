import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check which providers are available
    const hasGoogleCredentials = !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_ID.length > 10 &&
      process.env.GOOGLE_CLIENT_SECRET.length > 10
    )

    const providers = {
      credentials: {
        id: "credentials",
        name: "Email and Password",
        type: "credentials",
        available: true,
        demo: true,
        accounts: [
          { email: "john.student@edugenius.com", role: "student" },
          { email: "mary.teacher@edugenius.com", role: "teacher" },
          { email: "admin.user@edugenius.com", role: "admin" },
        ],
      },
      ...(hasGoogleCredentials
        ? {
            google: {
              id: "google",
              name: "Google",
              type: "oauth",
              available: true,
              demo: false,
            },
          }
        : {}),
    }

    return NextResponse.json({
      providers,
      count: Object.keys(providers).length,
      timestamp: new Date().toISOString(),
      status: "ok",
    })
  } catch (error) {
    console.error("Providers API error:", error)
    return NextResponse.json(
      {
        error: "Failed to get providers",
        message: "Unable to retrieve authentication providers",
        timestamp: new Date().toISOString(),
        status: "error",
      },
      { status: 500 },
    )
  }
}
