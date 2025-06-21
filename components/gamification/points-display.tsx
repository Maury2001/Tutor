"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { UserPoints } from "@/lib/gamification/types"
import { getPointsForNextLevel, getProgressToNextLevel } from "@/lib/gamification/points-system"
import { Trophy, Zap, Target, TrendingUp } from "lucide-react"

interface PointsDisplayProps {
  userPoints: UserPoints
  compact?: boolean
}

export function PointsDisplay({ userPoints, compact = false }: PointsDisplayProps) {
  const nextLevelPoints = getPointsForNextLevel(userPoints.level)
  const progressPercent = getProgressToNextLevel(userPoints.total_points, userPoints.level)
  const pointsToNext = nextLevelPoints - userPoints.total_points

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <span className="font-semibold text-lg">{userPoints.total_points}</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Level {userPoints.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-orange-600" />
          <span className="text-sm">{userPoints.streak_days} day streak</span>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Main Points Display */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <span className="text-4xl font-bold text-gray-900">{userPoints.total_points.toLocaleString()}</span>
            </div>
            <p className="text-gray-600">Total Points</p>
          </div>

          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Level {userPoints.level}</span>
              {nextLevelPoints > 0 && <span className="text-sm text-gray-500">{pointsToNext} to next level</span>}
            </div>
            {nextLevelPoints > 0 && <Progress value={progressPercent} className="h-2" />}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-blue-900">{userPoints.streak_days}</div>
              <div className="text-xs text-blue-600">Day Streak</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-green-900">{userPoints.weekly_points}</div>
              <div className="text-xs text-green-600">This Week</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Target className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-purple-900">{userPoints.monthly_points}</div>
              <div className="text-xs text-purple-600">This Month</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
