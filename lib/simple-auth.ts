// Simple authentication system without NextAuth dependency
interface User {
  id: string
  email: string
  name: string
  role: string
  schoolName?: string
  gradeLevel?: string
}

interface Session {
  user: User
  expires: string
}

const ADMIN_USER: User = {
  id: "admin-1",
  email: "workerpeter@gmail.com",
  name: "Peter Worker",
  role: "admin",
  schoolName: "System Administration",
}

export class SimpleAuth {
  private static SESSION_KEY = "auth_session"

  static async signIn(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Admin authentication
      if (email === "workerpeter@gmail.com" && password === "2020") {
        const session: Session = {
          user: ADMIN_USER,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }

        // Store session in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
        }

        return { success: true, user: ADMIN_USER }
      }

      return { success: false, error: "Invalid credentials" }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, error: "Authentication failed" }
    }
  }

  static getSession(): Session | null {
    try {
      if (typeof window === "undefined") return null

      const sessionData = localStorage.getItem(this.SESSION_KEY)
      if (!sessionData) return null

      const session: Session = JSON.parse(sessionData)

      // Check if session is expired
      if (new Date(session.expires) < new Date()) {
        this.signOut()
        return null
      }

      return session
    } catch (error) {
      console.error("Get session error:", error)
      return null
    }
  }

  static signOut(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.SESSION_KEY)
    }
  }

  static isAuthenticated(): boolean {
    return this.getSession() !== null
  }

  static isAdmin(): boolean {
    const session = this.getSession()
    return session?.user?.role === "admin"
  }

  static getUser(): User | null {
    const session = this.getSession()
    return session?.user || null
  }
}
