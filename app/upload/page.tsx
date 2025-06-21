"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { MainLayout } from "@/components/layout/main-layout"
import { MaterialUpload } from "@/components/upload/material-upload"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function UploadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === "student") {
      router.push("/")
    }
  }, [user, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || user.role === "student") {
    return null
  }

  return (
    <MainLayout>
      <MaterialUpload />
    </MainLayout>
  )
}
