"use client"

import { STEMConsultationScheduler } from "@/components/counseling/stem-consultation-scheduler"

export default function STEMConsultationsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">STEM Professional Consultations</h1>
        <p className="text-muted-foreground mt-2">
          Connect John Kamau with STEM teachers, industry professionals, and university representatives to guide his
          pathway preparation.
        </p>
      </div>

      <STEMConsultationScheduler studentId="student-001" />
    </div>
  )
}
