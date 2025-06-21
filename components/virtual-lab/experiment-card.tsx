import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, Star, GraduationCap, Target } from "lucide-react"
import Link from "next/link"

interface ExperimentCardProps {
  id?: string
  title?: string
  description?: string
  category?: string
  difficulty?: "Beginner" | "Intermediate" | "Advanced"
  duration?: string
  gradeLevel?: string
  imageUrl?: string
  isNew?: boolean
  isPopular?: boolean
  href?: string
  cbcStrand?: string
  cbcSubStrand?: string
  learningOutcomes?: string[]
}

export function ExperimentCard({
  id,
  title,
  description,
  category,
  difficulty,
  duration,
  gradeLevel,
  imageUrl,
  isNew = false,
  isPopular = false,
  href,
  cbcStrand,
  cbcSubStrand,
  learningOutcomes = [],
}: ExperimentCardProps) {
  // Add error handling and validation
  const safeTitle = title || "Untitled Experiment"
  const safeDescription = description || "No description available"
  const safeCategory = category || "General"
  const safeDifficulty = difficulty || "Beginner"
  const safeDuration = duration || "Unknown"
  const safeGradeLevel = gradeLevel || "All Grades"
  const safeHref = href || "#"
  const safeId = id || `experiment-${Date.now()}`

  const getDifficultyColor = (difficulty: string) => {
    try {
      if (!difficulty || typeof difficulty !== "string") {
        return "bg-gray-100 text-gray-800"
      }

      switch (difficulty.toLowerCase()) {
        case "beginner":
          return "bg-green-100 text-green-800"
        case "intermediate":
          return "bg-yellow-100 text-yellow-800"
        case "advanced":
          return "bg-red-100 text-red-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    } catch (error) {
      console.warn("Error in getDifficultyColor:", error)
      return "bg-gray-100 text-gray-800"
    }
  }

  const getGradeColor = (gradeLevel: string) => {
    try {
      if (gradeLevel.includes("4-6")) return "bg-green-50 text-green-700 border-green-200"
      if (gradeLevel.includes("7-9")) return "bg-blue-50 text-blue-700 border-blue-200"
      if (gradeLevel.includes("10-12")) return "bg-purple-50 text-purple-700 border-purple-200"
      return "bg-gray-50 text-gray-700 border-gray-200"
    } catch (error) {
      return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Validate required props
  if (!safeTitle && !safeDescription) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <p className="text-red-600 text-sm">Error: Invalid experiment data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                {safeTitle}
              </CardTitle>
              {isNew && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
              {isPopular && <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />}
            </div>
            <CardDescription className="text-sm text-gray-600 line-clamp-3 mb-3">{safeDescription}</CardDescription>
          </div>
        </div>

        {/* CBC Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs border ${getGradeColor(safeGradeLevel)}`}>
              <GraduationCap className="h-3 w-3 mr-1" />
              {safeGradeLevel}
            </Badge>
            <Badge className={`text-xs ${getDifficultyColor(safeDifficulty)}`}>{safeDifficulty}</Badge>
          </div>

          <div className="text-xs text-gray-600">
            <div className="font-medium">{safeCategory}</div>
            {cbcStrand && (
              <div className="text-xs text-blue-600 mt-1">
                <Target className="h-3 w-3 inline mr-1" />
                CBC: {cbcStrand}
                {cbcSubStrand && ` • ${cbcSubStrand}`}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-grow flex flex-col">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{safeDuration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>CBC Aligned</span>
            </div>
          </div>
        </div>

        {/* Learning Outcomes Preview */}
        {learningOutcomes.length > 0 && (
          <div className="mb-4 flex-grow">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Key Learning Outcomes:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {learningOutcomes.slice(0, 2).map((outcome, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span className="line-clamp-1">{outcome}</span>
                </li>
              ))}
              {learningOutcomes.length > 2 && (
                <li className="text-xs text-gray-400">+{learningOutcomes.length - 2} more outcomes</li>
              )}
            </ul>
          </div>
        )}

        <div className="mt-auto">
          <Link href={safeHref}>
            <Button className="w-full group-hover:bg-blue-600 transition-colors">
              Start CBC Experiment
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
