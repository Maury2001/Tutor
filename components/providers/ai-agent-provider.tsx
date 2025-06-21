"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface SessionSummary {
  id: string
  timestamp: Date
  topic: string
  grade: string
  learningArea: string
  interactions: number
  keyPoints: string[]
  studentProgress: "excellent" | "good" | "needs_improvement"
}

interface AIAgentContextType {
  sessionSummaries: SessionSummary[]
  currentSession: SessionSummary | null
  startNewSession: (topic: string, grade: string, learningArea: string) => void
  updateSession: (interactions: number, keyPoints: string[]) => void
  endSession: (progress: "excellent" | "good" | "needs_improvement") => void
  getSessionsByGrade: (grade: string) => SessionSummary[]
  isAgentActive: boolean
  setAgentActive: (active: boolean) => void
}

const AIAgentContext = createContext<AIAgentContextType | undefined>(undefined)

export function AIAgentProvider({ children }: { children: React.ReactNode }) {
  const [sessionSummaries, setSessionSummaries] = useState<SessionSummary[]>([])
  const [currentSession, setCurrentSession] = useState<SessionSummary | null>(null)
  const [isAgentActive, setAgentActive] = useState(true)

  const startNewSession = (topic: string, grade: string, learningArea: string) => {
    const newSession: SessionSummary = {
      id: Date.now().toString(),
      timestamp: new Date(),
      topic,
      grade,
      learningArea,
      interactions: 0,
      keyPoints: [],
      studentProgress: "good",
    }
    setCurrentSession(newSession)
  }

  const updateSession = (interactions: number, keyPoints: string[]) => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        interactions,
        keyPoints,
      })
    }
  }

  const endSession = (progress: "excellent" | "good" | "needs_improvement") => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        studentProgress: progress,
      }
      setSessionSummaries((prev) => [...prev, completedSession])
      setCurrentSession(null)
    }
  }

  const getSessionsByGrade = (grade: string) => {
    return sessionSummaries.filter((session) => session.grade === grade)
  }

  return (
    <AIAgentContext.Provider
      value={{
        sessionSummaries,
        currentSession,
        startNewSession,
        updateSession,
        endSession,
        getSessionsByGrade,
        isAgentActive,
        setAgentActive,
      }}
    >
      {children}
    </AIAgentContext.Provider>
  )
}

export function useAIAgent() {
  const context = useContext(AIAgentContext)
  if (context === undefined) {
    throw new Error("useAIAgent must be used within an AIAgentProvider")
  }
  return context
}
