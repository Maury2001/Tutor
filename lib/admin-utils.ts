import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"

export async function getAdminSession() {
  try {
    const session = await getServerSession(authOptions)
    return session?.user?.role === "admin" ? session : null
  } catch (error) {
    console.error("Failed to get admin session:", error)
    return null
  }
}

export function isAdminUser(userRole?: string) {
  return userRole === "admin"
}

export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) {
    throw new Error("Admin access required")
  }
  return session
}
