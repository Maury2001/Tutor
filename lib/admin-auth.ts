// Simple admin authentication without NextAuth
export async function requireAdmin() {
  // In a real app, you'd check server-side session/cookies
  // For now, we'll handle this client-side in components
  return null
}

export function isAdmin(user: any) {
  return user?.role === "admin" || user?.email === "workerpeter@gmail.com"
}

export function hasAdminAccess(userRole: string, userEmail?: string) {
  return userRole === "admin" || userEmail === "workerpeter@gmail.com"
}

// Client-side admin check
export function checkAdminAccess() {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user")
    if (!userData) {
      return false
    }

    try {
      const user = JSON.parse(userData)
      return isAdmin(user)
    } catch {
      return false
    }
  }
  return false
}

// Get current user from localStorage
export function getCurrentUser() {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch {
        return null
      }
    }
  }
  return null
}

// Mock authOptions for compatibility (not used)
export const authOptions = {
  providers: [],
  callbacks: {},
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}
