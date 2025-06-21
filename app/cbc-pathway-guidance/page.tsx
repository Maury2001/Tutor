"use client"

import { CBCPathwayGuidance } from "@/components/curriculum/cbc-pathway-guidance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Target, TrendingUp } from "lucide-react"

export default function CBCPathwayGuidancePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">CBC Pathway Guidance</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover your ideal CBC senior secondary pathway based on your strengths, interests, and career aspirations.
          Get personalized recommendations for grades 10-12 subject selection.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Personalized Analysis</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              AI-powered analysis of your academic performance, learning style, and interests to recommend the best
              pathway.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Career Alignment</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Connect your pathway choice with real career opportunities, salary expectations, and market demand.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-purple-100 rounded-full w-fit">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">University Preparation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Get guidance on university requirements, subject combinations, and preparation strategies for your chosen
              path.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Guidance Component */}
      <CBCPathwayGuidance />
    </div>
  )
}
