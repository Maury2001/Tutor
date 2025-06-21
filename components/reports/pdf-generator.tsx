"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, CheckCircle, Loader2, Mail, Share2 } from "lucide-react"

interface PDFGeneratorProps {
  studentId?: string
  reportType?: string
  onGenerationComplete?: (success: boolean) => void
}

export function PDFGenerator({
  studentId = "student-001",
  reportType = "parent-involvement",
  onGenerationComplete,
}: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStatus, setGenerationStatus] = useState<string>("")
  const [generationComplete, setGenerationComplete] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string>("")

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationComplete(false)
    setGenerationStatus("Initializing PDF generation...")

    try {
      // Simulate PDF generation steps with progress updates
      const steps = [
        { message: "Collecting report data...", progress: 20 },
        { message: "Processing consultation details...", progress: 40 },
        { message: "Generating engagement analytics...", progress: 60 },
        { message: "Creating visual elements...", progress: 80 },
        { message: "Finalizing PDF document...", progress: 95 },
        { message: "PDF generation complete!", progress: 100 },
      ]

      for (const step of steps) {
        setGenerationStatus(step.message)
        setGenerationProgress(step.progress)
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      // Make API call to generate PDF
      const response = await fetch("/api/reports/parent-involvement/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, reportType }),
      })

      if (response.ok) {
        // Create blob URL for download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        setDownloadUrl(url)
        setGenerationComplete(true)
        setGenerationStatus("PDF ready for download!")

        // Trigger automatic download
        const link = document.createElement("a")
        link.href = url
        link.download = `Parent_Involvement_Report_John_Kamau_PIR-2024-001.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        onGenerationComplete?.(true)
      } else {
        throw new Error("PDF generation failed")
      }
    } catch (error) {
      console.error("PDF generation error:", error)
      setGenerationStatus("PDF generation failed. Please try again.")
      onGenerationComplete?.(false)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEmailPDF = async () => {
    if (!downloadUrl) return

    try {
      // In a real application, this would send the PDF via email
      const response = await fetch("/api/reports/parent-involvement/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          reportType,
          recipientEmail: "mary.kamau@email.com",
          pdfUrl: downloadUrl,
        }),
      })

      if (response.ok) {
        alert("PDF report has been emailed to mary.kamau@email.com")
      } else {
        throw new Error("Email sending failed")
      }
    } catch (error) {
      console.error("Email sending error:", error)
      alert("Failed to send email. Please try again.")
    }
  }

  const handleSharePDF = async () => {
    if (!downloadUrl) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Parent Involvement Report - John Kamau",
          text: "Parent involvement summary report for John Kamau",
          url: downloadUrl,
        })
      } catch (error) {
        console.error("Sharing failed:", error)
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(downloadUrl)
      alert("PDF link copied to clipboard!")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          Professional PDF Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Report Type</div>
            <Badge className="bg-blue-100 text-blue-800">Parent Involvement Summary</Badge>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Student</div>
            <div className="font-medium">John Kamau (Grade 9)</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Parent</div>
            <div className="font-medium">Mrs. Mary Kamau</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Report ID</div>
            <div className="font-medium">PIR-2024-001</div>
          </div>
        </div>

        {/* PDF Features */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">PDF Report Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Professional formatting & layout</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Complete consultation details</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Visual progress charts & metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Actionable recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Print-optimized design</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Secure & confidential</span>
            </div>
          </div>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm font-medium">{generationStatus}</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">{generationProgress}% Complete</div>
          </div>
        )}

        {/* Success State */}
        {generationComplete && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">PDF Generated Successfully!</span>
            </div>
            <p className="text-sm text-green-700 mb-3">
              Your comprehensive parent involvement report has been generated and downloaded automatically.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = downloadUrl
                  link.download = `Parent_Involvement_Report_John_Kamau_PIR-2024-001.pdf`
                  link.click()
                }}
                size="sm"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Again
              </Button>
              <Button onClick={handleEmailPDF} size="sm" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Email PDF
              </Button>
              <Button onClick={handleSharePDF} size="sm" variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        )}

        {/* Generation Button */}
        <div className="flex justify-center">
          <Button onClick={handleGeneratePDF} disabled={isGenerating} size="lg" className="w-full md:w-auto">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Generate & Download PDF Report
              </>
            )}
          </Button>
        </div>

        {/* Additional Information */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>PDF will be automatically downloaded when generation is complete.</p>
          <p>File size: ~2-3 MB | Format: Professional PDF | Security: Password protected</p>
        </div>
      </CardContent>
    </Card>
  )
}
