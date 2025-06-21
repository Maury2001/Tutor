// Simple authentication configuration
export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  session: {
    strategy: "localStorage" as const,
  },
  callbacks: {
    authorized: ({ token, req }: any) => {
      // Simple authorization logic
      return !!token
    },
  },
}

// Mock authOptions for any remaining imports
export const authOptions = {
  providers: [],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.email = user.email
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.role = token.role
        session.user.email = token.email
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}

export default authConfig
