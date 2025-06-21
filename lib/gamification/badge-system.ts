import { createClient } from "@/lib/supabase/client"
import type { Badge, UserBadge, BadgeRequirement } from "./types"
import { pointsSystem } from "./points-system"

export class BadgeSystem {
  private supabase = createClient()

  // Predefined badges
  private readonly SYSTEM_BADGES: Omit<Badge, "id" | "createdAt">[] = [
    {
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      category: "milestone",
      rarity: "common",
      requirements: [{ type: "lessons", value: 1 }],
      points: 50,
      isActive: true,
    },
    {
      name: "Quick Learner",
      description: "Complete 10 lessons",
      icon: "⚡",
      category: "milestone",
      rarity: "common",
      requirements: [{ type: "lessons", value: 10 }],
      points: 100,
      isActive: true,
    },
    {
      name: "Dedicated Student",
      description: "Maintain a 7-day learning streak",
      icon: "🔥",
      category: "streak",
      rarity: "rare",
      requirements: [{ type: "streak", value: 7 }],
      points: 200,
      isActive: true,
    },
    {
      name: "Math Master",
      description: "Score 90% or higher on 5 math assessments",
      icon: "🧮",
      category: "subject",
      rarity: "rare",
      requirements: [
        { type: "grade", value: 90, subject: "mathematics" },
        { type: "assessments", value: 5, subject: "mathematics" },
      ],
      points: 300,
      isActive: true,
    },
    {
      name: "Science Explorer",
      description: "Complete all science topics for your grade",
      icon: "🔬",
      category: "subject",
      rarity: "epic",
      requirements: [{ type: "subject", value: 100, subject: "science" }],
      points: 500,
      isActive: true,
    },
    {
      name: "Perfect Score",
      description: "Achieve 100% on any assessment",
      icon: "💯",
      category: "achievement",
      rarity: "rare",
      requirements: [{ type: "grade", value: 100 }],
      points: 250,
      isActive: true,
    },
    {
      name: "Night Owl",
      description: "Complete lessons after 8 PM",
      icon: "🦉",
      category: "special",
      rarity: "common",
      requirements: [{ type: "time", value: 20 }], // 8 PM in 24-hour format
      points: 75,
      isActive: true,
    },
    {
      name: "Early Bird",
      description: "Complete lessons before 7 AM",
      icon: "🐦",
      category: "special",
      rarity: "common",
      requirements: [{ type: "time", value: 7 }],
      points: 75,
      isActive: true,
    },
    {
      name: "Unstoppable",
      description: "Maintain a 30-day learning streak",
      icon: "🚀",
      category: "streak",
      rarity: "legendary",
      requirements: [{ type: "streak", value: 30 }],
      points: 1000,
      isActive: true,
    },
    {
      name: "Knowledge Seeker",
      description: "Earn 10,000 total points",
      icon: "📚",
      category: "milestone",
      rarity: "epic",
      requirements: [{ type: "points", value: 10000 }],
      points: 500,
      isActive: true,
    },
  ]

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await this.supabase
      .from("user_badges")
      .select(`
        *,
        badges (*)
      `)
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })

    if (error) {
      console.error("Error fetching user badges:", error)
      return []
    }

    return data.map((userBadge) => ({
      id: userBadge.id,
      userId: userBadge.user_id,
      badgeId: userBadge.badge_id,
      earnedAt: new Date(userBadge.earned_at),
      badge: userBadge.badges
        ? {
            id: userBadge.badges.id,
            name: userBadge.badges.name,
            description: userBadge.badges.description,
            icon: userBadge.badges.icon,
            category: userBadge.badges.category,
            rarity: userBadge.badges.rarity,
            requirements: userBadge.badges.requirements,
            points: userBadge.badges.points,
            isActive: userBadge.badges.is_active,
            createdAt: new Date(userBadge.badges.created_at),
          }
        : undefined,
    }))
  }

  async checkAndAwardBadges(
    userId: string,
    activityData: {
      lessonsCompleted?: number
      streakDays?: number
      assessmentScore?: number
      subject?: string
      totalPoints?: number
      timeOfDay?: number
    },
  ): Promise<UserBadge[]> {
    const availableBadges = await this.getAvailableBadges()
    const userBadges = await this.getUserBadges(userId)
    const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId))

    const newlyEarnedBadges: UserBadge[] = []

    for (const badge of availableBadges) {
      if (earnedBadgeIds.has(badge.id)) continue

      if (checkBadgeRequirements(badge, activityData)) {
        const userBadge = await this.awardBadge(userId, badge.id)
        if (userBadge) {
          newlyEarnedBadges.push(userBadge)

          // Award points for earning the badge
          await pointsSystem.awardPoints(userId, "badge", {
            badgeName: badge.name,
            badgePoints: badge.points,
          })
        }
      }
    }

    return newlyEarnedBadges
  }

  private async checkBadgeRequirements(badge: Badge, userId: string, activityData: any): Promise<boolean> {
    // for (const requirement of badge.requirements) {
    //   const isMet = await this.checkRequirement(requirement, userId, activityData)
    //   if (!isMet) return false
    // }
    // return true
    return false
  }

  private async checkRequirement(requirement: BadgeRequirement, userId: string, activityData: any): Promise<boolean> {
    switch (requirement.type) {
      case "lessons":
        return (activityData.lessonsCompleted || 0) >= requirement.value

      case "streak":
        return (activityData.streakDays || 0) >= requirement.value

      case "grade":
        if (requirement.subject && activityData.subject !== requirement.subject) {
          return false
        }
        return (activityData.assessmentScore || 0) >= requirement.value

      case "points":
        return (activityData.totalPoints || 0) >= requirement.value

      case "time":
        return (activityData.timeOfDay || 0) === requirement.value

      case "assessments":
        // This would require a more complex query to count assessments
        return await this.checkAssessmentCount(userId, requirement)

      case "subject":
        // This would require checking subject completion percentage
        return await this.checkSubjectCompletion(userId, requirement)

      default:
        return false
    }
  }

  private async checkAssessmentCount(userId: string, requirement: BadgeRequirement): Promise<boolean> {
    // Implementation would query assessment results
    // For now, return false as placeholder
    return false
  }

  private async checkSubjectCompletion(userId: string, requirement: BadgeRequirement): Promise<boolean> {
    // Implementation would check subject progress
    // For now, return false as placeholder
    return false
  }

  private async awardBadge(userId: string, badgeId: string): Promise<UserBadge | null> {
    const { data, error } = await this.supabase
      .from("user_badges")
      .insert({
        user_id: userId,
        badge_id: badgeId,
        earned_at: new Date().toISOString(),
      })
      .select(`
        *,
        badges (*)
      `)
      .single()

    if (error) {
      console.error("Error awarding badge:", error)
      return null
    }

    return {
      id: data.id,
      userId: data.user_id,
      badgeId: data.badge_id,
      earnedAt: new Date(data.earned_at),
      badge: data.badges
        ? {
            id: data.badges.id,
            name: data.badges.name,
            description: data.badges.description,
            icon: data.badges.icon,
            category: data.badges.category,
            rarity: data.badges.rarity,
            requirements: data.badges.requirements,
            points: data.badges.points,
            isActive: data.badges.is_active,
            createdAt: new Date(data.badges.created_at),
          }
        : undefined,
    }
  }

  private async getAvailableBadges(): Promise<Badge[]> {
    const { data, error } = await this.supabase.from("badges").select("*").eq("is_active", true)

    if (error) {
      console.error("Error fetching badges:", error)
      return []
    }

    return data.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      category: badge.category,
      rarity: badge.rarity,
      requirements: badge.requirements,
      points: badge.points,
      isActive: badge.is_active,
      createdAt: new Date(badge.created_at),
    }))
  }

  async initializeSystemBadges(): Promise<void> {
    for (const badgeData of this.SYSTEM_BADGES) {
      const { error } = await this.supabase.from("badges").upsert(
        {
          name: badgeData.name,
          description: badgeData.description,
          icon: badgeData.icon,
          category: badgeData.category,
          rarity: badgeData.rarity,
          requirements: badgeData.requirements,
          points: badgeData.points,
          is_active: badgeData.isActive,
        },
        {
          onConflict: "name",
        },
      )

      if (error) {
        console.error(`Error creating badge ${badgeData.name}:`, error)
      }
    }
  }
}

export const badgeSystem = new BadgeSystem()

export function checkBadgeRequirements(badge: Badge, userStats: Record<string, any>): boolean {
  return badge.requirements.every((requirement) => checkSingleRequirement(requirement, userStats))
}

function checkSingleRequirement(requirement: BadgeRequirement, userStats: Record<string, any>): boolean {
  const { type, value, operator = "greater_equal" } = requirement
  const userValue = userStats[type]

  if (userValue === undefined) return false

  switch (operator) {
    case "greater_than":
      return userValue > value
    case "less_than":
      return userValue < value
    case "equal":
      return userValue === value
    case "greater_equal":
      return userValue >= value
    case "less_equal":
      return userValue <= value
    default:
      return userValue >= value
  }
}

export function getBadgeRarityColor(rarity: string): string {
  switch (rarity) {
    case "common":
      return "text-gray-600 bg-gray-100"
    case "rare":
      return "text-blue-600 bg-blue-100"
    case "epic":
      return "text-purple-600 bg-purple-100"
    case "legendary":
      return "text-yellow-600 bg-yellow-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

export function getBadgeRarityBorder(rarity: string): string {
  switch (rarity) {
    case "common":
      return "border-gray-300"
    case "rare":
      return "border-blue-300"
    case "epic":
      return "border-purple-300"
    case "legendary":
      return "border-yellow-300"
    default:
      return "border-gray-300"
  }
}
