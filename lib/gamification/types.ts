export type PointSource =
  | "lesson_completed"
  | "assessment_passed"
  | "perfect_score"
  | "daily_streak"
  | "tutor_session"
  | "material_upload"
  | "badge_earned"
  | "achievement_unlocked"
  | "login_bonus"
  | "referral_bonus"

export type BadgeRarity = "common" | "rare" | "epic" | "legendary"

export type BadgeCategory = "milestone" | "streak" | "subject" | "special"

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  rarity: BadgeRarity
  requirements: BadgeRequirement[]
  points: number
  is_active: boolean
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  points: number
  requirements: AchievementRequirement[]
  is_secret: boolean
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  progress: number
  completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
  achievement?: Achievement
}

export interface UserPoints {
  id: string
  user_id: string
  total_points: number
  weekly_points: number
  monthly_points: number
  streak_days: number
  level: number
  experience_points: number
  created_at: string
  updated_at: string
}

export interface PointTransaction {
  id: string
  user_id: string
  points: number
  type: "earned" | "spent" | "bonus"
  source: PointSource
  description: string
  metadata: Record<string, any>
  created_at: string
}

export interface LeaderboardEntry {
  user_id: string
  user_name: string
  avatar_url?: string
  grade_level?: string
  school_name?: string
  total_points: number
  level: number
  badge_count: number
  rank?: number
}

export interface BadgeRequirement {
  type: string
  value: number | string
  operator?: "greater_than" | "less_than" | "equal" | "greater_equal" | "less_equal"
  subject?: string
  score?: number
  count?: number
}

export interface AchievementRequirement {
  type: string
  value: number | string
  operator?: "greater_than" | "less_than" | "equal" | "greater_equal" | "less_equal"
  start?: string
  end?: string
}

export interface GamificationStats {
  total_points: number
  level: number
  badges_earned: number
  achievements_completed: number
  current_streak: number
  weekly_rank?: number
  overall_rank?: number
}
