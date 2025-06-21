import { Suspense } from "react"
import type { Metadata } from "next"
import { AuthGuard } from "@/components/auth/auth-guard"
import { LearningAreaIntegration } from "@/components/learning/learning-area-integration"

export const metadata: Metadata = {
  title: "Learning",
  description: "Explore learning areas and track your progress",
}

const LearningPage = () => {
  return (
    <AuthGuard>
      <Suspense fallback={<div>Loading...</div>}>
        <LearningAreaIntegration />
      </Suspense>
    </AuthGuard>
  )
}

export default LearningPage
