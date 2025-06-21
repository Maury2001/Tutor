"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Achievement, UserAchievement } from "@/lib/gamification/types"
import { Lock, CheckCircle, Clock } from "lucide-react"

interface AchievementSystemProps {
  userAchievements: UserAchievement[]
  allAchievements: Achievement[]
  compact?: boolean
}

export function AchievementSystem({ userAchievements, allAchievements, compact = false }: AchievementSystemProps) {
  const completedAchievements = userAchievements.filter((ua) => ua.completed)
  const inProgressAchievements = userAchievements.filter((ua) => !ua.completed && ua.progress > 0)

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recent Achievements</h3>
          <Badge variant="secondary">
            {completedAchievements.length}/{allAchievements.length}
          </Badge>
        </div>

        <div className="space-y-2">
          {completedAchievements.slice(0, 3).map((userAchievement) => {
            const achievement = allAchievements.find((a) => a.id === userAchievement.achievement_id)
            if (!achievement) return null

            return (
              <div key={userAchievement.id} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                <span className="text-lg">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-green-600">+{achievement.points} points</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 Achievements
          <Badge variant="secondary">
            {completedAchievements.length}/{allAchievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round((completedAchievements.length / allAchievements.length) * 100)}%</span>
            </div>
            <Progress value={(completedAchievements.length / allAchievements.length) * 100} />
          </div>

          {/* In Progress Achievements */}
          {inProgressAchievements.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                In Progress
              </h4>
              <div className="space-y-2">
                {inProgressAchievements.map((userAchievement) => {
                  const achievement = allAchievements.find((a) => a.id === userAchievement.achievement_id)
                  if (!achievement) return null

                  return (
                    <AchievementCard
                      key={userAchievement.id}
                      achievement={achievement}
                      userAchievement={userAchievement}
                      status="in_progress"
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Completed Achievements */}
          {completedAchievements.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Completed
              </h4>
              <div className="space-y-2">
                {completedAchievements.map((userAchievement) => {
                  const achievement = allAchievements.find((a) => a.id === userAchievement.achievement_id)
                  if (!achievement) return null

                  return (
                    <AchievementCard
                      key={userAchievement.id}
                      achievement={achievement}
                      userAchievement={userAchievement}
                      status="completed"
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Locked
            </h4>
            <div className="space-y-2">
              {allAchievements
                .filter(
                  (achievement) =>
                    !achievement.is_secret && !userAchievements.some((ua) => ua.achievement_id === achievement.id),
                )
                .slice(0, 5)
                .map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} status="locked" />
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AchievementCardProps {
  achievement: Achievement
  userAchievement?: UserAchievement
  status: "completed" | "in_progress" | "locked"
}

function AchievementCard({ achievement, userAchievement, status }: AchievementCardProps) {
  const progressPercent = userAchievement ? (userAchievement.progress / 100) * 100 : 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
            status === "completed"
              ? "bg-green-50 border-green-200"
              : status === "in_progress"
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${status === "locked" ? "grayscale opacity-50" : ""}`}>
              {status === "locked" ? <Lock className="h-6 w-6 text-gray-400" /> : achievement.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={`font-semibold ${status === "locked" ? "text-gray-500" : "text-gray-900"}`}>
                  {achievement.name}
                </h4>
                {status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
              </div>

              <p className={`text-sm ${status === "locked" ? "text-gray-400" : "text-gray-600"}`}>
                {achievement.description}
              </p>

              {status === "in_progress" && userAchievement && (
                <div className="mt-2">
                  <Progress value={progressPercent} className="h-1" />
                  <p className="text-xs text-gray-500 mt-1">{userAchievement.progress}% complete</p>
                </div>
              )}
            </div>

            <div className="text-right">
              <Badge variant={status === "completed" ? "default" : "secondary"}>+{achievement.points}</Badge>
              {status === "completed" && userAchievement?.completed_at && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(userAchievement.completed_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{achievement.icon}</span>
            <div>
              <div>{achievement.name}</div>
              <Badge className="mt-1">+{achievement.points} points</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">{achievement.description}</p>

          {status === "completed" && userAchievement && (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">🎉 Achievement Unlocked!</p>
              <p className="text-green-600 text-sm">
                Completed on {new Date(userAchievement.completed_at!).toLocaleDateString()}
              </p>
            </div>
          )}

          {status === "in_progress" && userAchievement && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">📈 In Progress</p>
              <Progress value={progressPercent} className="mt-2" />
              <p className="text-blue-600 text-sm mt-1">{userAchievement.progress}% complete</p>
            </div>
          )}

          {status === "locked" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 font-medium">🔒 Requirements</p>
              <ul className="text-sm text-gray-500 mt-2">
                {achievement.requirements.map((req, index) => (
                  <li key={index}>• {formatAchievementRequirement(req)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function formatAchievementRequirement(requirement: any): string {
  const { type, value } = requirement

  switch (type) {
    case "profile_complete":
      return "Complete your profile setup"
    case "perfect_score":
      return "Score 100% on any assessment"
    case "lesson_time":
      return `Complete a lesson in under ${value} minutes`
    case "study_time":
      return `Study between ${requirement.start} and ${requirement.end}`
    case "weekend_study":
      return "Study on both Saturday and Sunday"
    case "perfect_scores":
      return `Score 100% on ${value} assessments`
    case "tutor_questions":
      return `Ask ${value} questions to the tutor`
    case "subject_complete":
      return "Complete all lessons in any subject"
    case "grade_progress":
      return `Complete ${value}% of your grade curriculum`
    case "achievements_shared":
      return `Share ${value} achievements`
    case "peer_help":
      return `Help ${value} classmates with questions`
    case "session_duration":
      return `Study for exactly ${value} minutes in one session`
    case "score_improvement":
      return `Improve assessment score by ${value}% after retaking`
    case "areas_explored":
      return "Try all learning areas available for your grade"
    default:
      return `${type}: ${value}`
  }
}
