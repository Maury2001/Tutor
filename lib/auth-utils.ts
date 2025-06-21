import type { User } from "@/components/providers/auth-provider"

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin"
}

export function isTeacher(user: User | null): boolean {
  return user?.role === "teacher"
}

export function isStudent(user: User | null): boolean {
  return user?.role === "student"
}

export function isSchool(user: User | null): boolean {
  return user?.role === "school"
}

export function hasRole(user: User | null, role: string): boolean {
  return user?.role === role
}

export function requireAuth(user: User | null): User {
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export function requireAdmin(user: User | null): User {
  const authUser = requireAuth(user)
  if (!isAdmin(authUser)) {
    throw new Error("Admin access required")
  }
  return authUser
}
