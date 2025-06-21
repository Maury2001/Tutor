"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as BadgeComponent } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Badge, UserBadge } from "@/lib/gamification/types"
import { getBadgeRarityColor, getBadgeRarityBorder } from "@/lib/gamification/badge-system"
import { Lock } from "lucide-react"

interface BadgeShowcaseProps {
  userBadges: UserBadge[]
  allBadges: Badge[]
  compact?: boolean
}

export function BadgeShowcase({ userBadges, allBadges, compact = false }: BadgeShowcaseProps) {
  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badge_id))

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {userBadges.slice(0, 6).map((userBadge) => {
          const badge = allBadges.find((b) => b.id === userBadge.badge_id)
          if (!badge) return null

          return (
            <div
              key={userBadge.id}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getBadgeRarityColor(badge.rarity)}`}
            >
              <span>{badge.icon}</span>
              <span className="font-medium">{badge.name}</span>
            </div>
          )
        })}
        {userBadges.length > 6 && (
          <div className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">+{userBadges.length - 6} more</div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Badge Collection
          <BadgeComponent variant="secondary">
            {userBadges.length}/{allBadges.length}
          </BadgeComponent>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allBadges.map((badge) => {
            const isEarned = earnedBadgeIds.has(badge.id)
            const userBadge = userBadges.find((ub) => ub.badge_id === badge.id)

            return (
              <Dialog key={badge.id}>
                <DialogTrigger asChild>
                  <div
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                      isEarned ? `${getBadgeRarityBorder(badge.rarity)} bg-white` : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-3xl mb-2 ${isEarned ? "" : "grayscale opacity-50"}`}>
                        {isEarned ? badge.icon : <Lock className="h-8 w-8 mx-auto text-gray-400" />}
                      </div>
                      <h3 className={`font-semibold text-sm ${isEarned ? "text-gray-900" : "text-gray-500"}`}>
                        {badge.name}
                      </h3>
                      <BadgeComponent variant="outline" className={`text-xs mt-1 ${getBadgeRarityColor(badge.rarity)}`}>
                        {badge.rarity}
                      </BadgeComponent>
                    </div>

                    {isEarned && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">✓</div>
                    )}
                  </div>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <span className="text-3xl">{badge.icon}</span>
                      <div>
                        <div>{badge.name}</div>
                        <BadgeComponent className={getBadgeRarityColor(badge.rarity)}>{badge.rarity}</BadgeComponent>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <p className="text-gray-600">{badge.description}</p>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Points:</span>
                      <span className="text-blue-600">{badge.points}</span>
                    </div>

                    {isEarned && userBadge && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-green-800 font-medium">✅ Earned!</p>
                        <p className="text-green-600 text-sm">{new Date(userBadge.earned_at).toLocaleDateString()}</p>
                      </div>
                    )}

                    {!isEarned && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 font-medium">Requirements:</p>
                        <ul className="text-sm text-gray-500 mt-1">
                          {badge.requirements.map((req, index) => (
                            <li key={index}>• {formatRequirement(req)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function formatRequirement(requirement: any): string {
  const { type, value } = requirement

  switch (type) {
    case "lessons_completed":
      return `Complete ${value} lesson${value > 1 ? "s" : ""}`
    case "daily_lessons":
      return `Complete ${value} lessons in one day`
    case "streak_days":
      return `Maintain a ${value}-day learning streak`
    case "subject_lessons":
      return `Complete ${value} ${requirement.subject} lessons`
    case "subject_score":
      return `Score ${requirement.score}% or higher on ${value} ${requirement.subject} assessments`
    case "assessments_completed":
      return `Complete ${value} assessments`
    case "tutor_sessions":
      return `Have ${value} tutor conversations`
    case "total_points":
      return `Earn ${value} total points`
    case "level":
      return `Reach level ${value}`
    default:
      return `${type}: ${value}`
  }
}
