"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { MainLayout } from "@/components/layout/main-layout"
import { TutorChat } from "@/components/tutor/tutor-chat"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TutorPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <MainLayout>
      <TutorChat />
    </MainLayout>
  )
}
