import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

// Simple in-memory user store for demo purposes
const users = [
  {
    id: "admin-1",
    email: "workerpeter@gmail.com",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "student-1",
    email: "student@example.com",
    name: "Student User",
    role: "student",
  },
  {
    id: "teacher-1",
    email: "teacher@example.com",
    name: "Teacher User",
    role: "teacher",
  },
]

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-client-secret",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Check for admin credentials
          if (credentials.email === "workerpeter@gmail.com" && credentials.password === "2020") {
            return {
              id: "admin-1",
              email: "workerpeter@gmail.com",
              name: "Admin User",
              role: "admin",
            }
          }

          // Check other demo users (accept any password for demo)
          const user = users.find((u) => u.email === credentials.email)
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          }

          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // For Google OAuth, create a demo user
        if (account?.provider === "google") {
          return true
        }
        return true
      } catch (error) {
        console.error("Sign in error:", error)
        return false
      }
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = token.sub || ""
          session.user.role = (token.role as string) || "student"
        }
        return session
      } catch (error) {
        console.error("Session callback error:", error)
        return session
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = user.role || "student"
        }
        return token
      } catch (error) {
        console.error("JWT callback error:", error)
        return token
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
