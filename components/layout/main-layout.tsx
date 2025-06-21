"use client"

import { useState } from "react"
import {
  BarChart3,
  Building2,
  Calendar,
  Home,
  ListChecks,
  Settings,
  User2,
  Brain,
  GraduationCap,
  X,
} from "lucide-react"

import type { MainNavItem } from "@/types"
import type { ReactNode } from "react"
import { CurriculumSelector } from "@/components/curriculum/curriculum-selector"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardConfig {
  mainNav: MainNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Overview",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: User2,
      roles: ["admin"],
    },
    {
      name: "Companies",
      href: "/dashboard/companies",
      icon: Building2,
      roles: ["admin"],
    },
    {
      name: "Tasks",
      href: "/dashboard/tasks",
      icon: ListChecks,
      roles: ["admin", "teacher"],
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
      roles: ["admin", "teacher"],
    },
    {
      name: "Training",
      href: "/training",
      icon: Brain,
      roles: ["teacher", "admin"],
      description: "AI Model Training",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["admin"],
    },
  ],
}

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export function MainLayout({ children, className = "" }: MainLayoutProps) {
  const [showCurriculumSelector, setShowCurriculumSelector] = useState(false)
  const [curriculumSelection, setCurriculumSelection] = useState<any>(null)

  const handleCurriculumChange = (selection: any) => {
    setCurriculumSelection(selection)
  }

  const toggleCurriculumSelector = () => {
    setShowCurriculumSelector(!showCurriculumSelector)
  }

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Curriculum Selection Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="font-semibold text-gray-900">CBC Learning Platform</h2>
                {curriculumSelection?.grade && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {curriculumSelection.grade}
                    </Badge>
                    {curriculumSelection.learningArea && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                        <Brain className="h-3 w-3 mr-1" />
                        {curriculumSelection.learningArea}
                      </Badge>
                    )}
                    {curriculumSelection.strand && (
                      <Badge variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                        <ListChecks className="h-3 w-3 mr-1" />
                        {curriculumSelection.strand}
                      </Badge>
                    )}
                    {curriculumSelection.subStrand && (
                      <Badge variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                        <Settings className="h-3 w-3 mr-1" />
                        {curriculumSelection.subStrand}
                      </Badge>
                    )}
                    {curriculumSelection.learningOutcome && (
                      <Badge
                        variant="outline"
                        className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 max-w-xs truncate"
                      >
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {curriculumSelection.learningOutcome}
                      </Badge>
                    )}
                  </div>
                )}
                {curriculumSelection?.grade && (
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Grade Selected</span>
                    </div>
                    {curriculumSelection.learningArea && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Subject Selected</span>
                      </div>
                    )}
                    {curriculumSelection.strand && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Topic Selected</span>
                      </div>
                    )}
                    {curriculumSelection.subStrand && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>Subtopic Selected</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {curriculumSelection?.grade && (
                <Button
                  onClick={() => setCurriculumSelection(null)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
              <Button
                onClick={toggleCurriculumSelector}
                variant={showCurriculumSelector ? "secondary" : "outline"}
                size="sm"
              >
                {showCurriculumSelector ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Close Selector
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Choose Learning Area
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900 text-sm">CBC Learning</h2>
              </div>
              <div className="flex items-center gap-2">
                {curriculumSelection?.grade && (
                  <Button
                    onClick={() => setCurriculumSelection(null)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  onClick={toggleCurriculumSelector}
                  variant={showCurriculumSelector ? "secondary" : "outline"}
                  size="sm"
                  className="h-8 px-3 text-xs"
                >
                  {showCurriculumSelector ? (
                    <>
                      <X className="h-3 w-3 mr-1" />
                      Close
                    </>
                  ) : (
                    <>
                      <GraduationCap className="h-3 w-3 mr-1" />
                      Select
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Selection Display */}
            {curriculumSelection?.grade && (
              <div className="space-y-2">
                {/* Current Selection Card */}
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs font-medium text-gray-600 mb-2">Current Selection:</div>
                  <div className="space-y-2">
                    {/* Grade */}
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                      <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {curriculumSelection.grade}
                      </Badge>
                    </div>

                    {/* Learning Area */}
                    {curriculumSelection.learningArea && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs px-2 py-1">
                          <Brain className="h-3 w-3 mr-1" />
                          {curriculumSelection.learningArea}
                        </Badge>
                      </div>
                    )}

                    {/* Strand */}
                    {curriculumSelection.strand && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0"></div>
                        <Badge variant="outline" className="border-purple-200 text-purple-700 text-xs px-2 py-1">
                          <ListChecks className="h-3 w-3 mr-1" />
                          {curriculumSelection.strand}
                        </Badge>
                      </div>
                    )}

                    {/* Sub-Strand */}
                    {curriculumSelection.subStrand && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
                        <Badge variant="outline" className="border-orange-200 text-orange-700 text-xs px-2 py-1">
                          <Settings className="h-3 w-3 mr-1" />
                          {curriculumSelection.subStrand}
                        </Badge>
                      </div>
                    )}

                    {/* Learning Outcome */}
                    {curriculumSelection.learningOutcome && (
                      <div className="flex items-start gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0 mt-0.5"></div>
                        <Badge
                          variant="outline"
                          className="border-indigo-200 text-indigo-700 text-xs px-2 py-1 leading-relaxed"
                        >
                          <BarChart3 className="h-3 w-3 mr-1" />
                          <span className="break-words">{curriculumSelection.learningOutcome}</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Progress Summary */}
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Grade</span>
                  </div>
                  {curriculumSelection.learningArea && (
                    <>
                      <span className="mx-1">→</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Subject</span>
                      </div>
                    </>
                  )}
                  {curriculumSelection.strand && (
                    <>
                      <span className="mx-1">→</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Topic</span>
                      </div>
                    </>
                  )}
                  {curriculumSelection.subStrand && (
                    <>
                      <span className="mx-1">→</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>Subtopic</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Empty State */}
            {!curriculumSelection?.grade && (
              <div className="text-center py-4 text-gray-500">
                <GraduationCap className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Tap "Select" to choose your learning area</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Selector Panel */}
      {showCurriculumSelector && (
        <div className="border-b bg-gray-50">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Learning Path</h3>
                  <p className="text-sm text-gray-600">
                    Choose from PP1 to Grade 12 curriculum with comprehensive learning areas, strands, and objectives
                  </p>
                </div>
                <CurriculumSelector
                  onSelectionChange={handleCurriculumChange}
                  initialSelection={curriculumSelection}
                  showObjectives={true}
                />
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> Curriculum data includes PP1-Grade 12 with comprehensive learning areas,
                    strands, sub-strands, learning outcomes, and objectives aligned with CBC framework.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
