import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check for admin credentials
          if (credentials.email === "workerpeter@gmail.com" && credentials.password === "2020") {
            return {
              id: "admin-1",
              email: "workerpeter@gmail.com",
              name: "Admin User",
              role: "admin",
            }
          }

          // Check regular users in Supabase
          const { data: user, error } = await supabase.from("users").select("*").eq("email", credentials.email).single()

          if (error || !user) {
            return null
          }

          // In a real app, you'd verify the password hash here
          // For demo purposes, we'll accept any password for existing users
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "student",
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists in Supabase
          const { data: existingUser, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", user.email)
            .single()

          if (error && error.code !== "PGRST116") {
            console.error("Error checking user:", error)
            return false
          }

          // If user doesn't exist, create them
          if (!existingUser) {
            const { error: insertError } = await supabase.from("users").insert({
              email: user.email,
              name: user.name,
              avatar_url: user.image,
              role: "student", // Default role
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

            if (insertError) {
              console.error("Error creating user:", insertError)
              return false
            }
          }

          return true
        } catch (error) {
          console.error("Sign in error:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          // Get user data from Supabase
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", session.user.email)
            .single()

          if (!error && userData) {
            session.user.id = userData.id
            session.user.role = userData.role
          } else if (token.role) {
            // Fallback to token data for admin users
            session.user.role = token.role as string
          }
        } catch (error) {
          console.error("Session callback error:", error)
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
