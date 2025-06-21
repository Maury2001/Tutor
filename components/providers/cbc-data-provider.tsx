"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CBCLearningArea {
  id: string
  name: string
  grade: string
  strands: string[]
  outcomes: string[]
}

interface CBCDataContextType {
  learningAreas: CBCLearningArea[]
  currentGrade: string
  setCurrentGrade: (grade: string) => void
  getLearningAreasByGrade: (grade: string) => CBCLearningArea[]
  isLoading: boolean
}

const CBCDataContext = createContext<CBCDataContextType | undefined>(undefined)

export function CBCDataProvider({ children }: { children: React.ReactNode }) {
  const [learningAreas, setLearningAreas] = useState<CBCLearningArea[]>([])
  const [currentGrade, setCurrentGrade] = useState<string>("Grade 1")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load CBC curriculum data
    const loadCBCData = async () => {
      try {
        // This would typically fetch from your API
        const mockData: CBCLearningArea[] = [
          {
            id: "1",
            name: "Mathematics",
            grade: "Grade 1",
            strands: ["Numbers", "Measurement", "Geometry"],
            outcomes: ["Count objects up to 20", "Identify basic shapes"],
          },
          {
            id: "2",
            name: "English",
            grade: "Grade 1",
            strands: ["Listening and Speaking", "Reading", "Writing"],
            outcomes: ["Recognize letters", "Form simple words"],
          },
        ]
        setLearningAreas(mockData)
      } catch (error) {
        console.error("Failed to load CBC data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCBCData()
  }, [])

  const getLearningAreasByGrade = (grade: string) => {
    return learningAreas.filter((area) => area.grade === grade)
  }

  return (
    <CBCDataContext.Provider
      value={{
        learningAreas,
        currentGrade,
        setCurrentGrade,
        getLearningAreasByGrade,
        isLoading,
      }}
    >
      {children}
    </CBCDataContext.Provider>
  )
}

export function useCBCData() {
  const context = useContext(CBCDataContext)
  if (context === undefined) {
    throw new Error("useCBCData must be used within a CBCDataProvider")
  }
  return context
}
