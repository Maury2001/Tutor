"use client"

import { ParentInvolvementReport } from "@/components/reports/parent-involvement-report"

export default function ParentInvolvementReportPage() {
  return (
    <div className="container mx-auto py-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Parent Involvement Summary Report</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive analysis of parent engagement in John Kamau's career counseling and pathway preparation process.
        </p>
      </div>

      <ParentInvolvementReport studentId="student-001" />
    </div>
  )
}
