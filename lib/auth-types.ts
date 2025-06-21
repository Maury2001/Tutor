// Authentication types for the application
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "teacher" | "student" | "school"
  gradeLevel?: string
  schoolName?: string
  county?: string
  mobile?: string
}

export interface AuthSession {
  user: User
  expires: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  initialized: boolean
}

// Mock session type for compatibility
export interface Session {
  user: User
  expires: string
}
