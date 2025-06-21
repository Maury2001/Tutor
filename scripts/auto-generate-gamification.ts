// Auto-generate gamification data for CBC TutorBot platform
// This script focuses specifically on generating realistic gamification data:
// 1. Badges and achievements
// 2. User points and transactions
// 3. Leaderboard data
// 4. Streaks and progress

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "https://your-project.supabase.co"
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key"
const supabase = createClient(supabaseUrl, supabaseKey)

// Configuration
const DAYS_OF_ACTIVITY = 30

// Helper functions
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateDate(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

// Generate badges
async function generateBadges() {
  console.log("Generating badges...")

  const badges = [
    {
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      category: "milestone",
      rarity: "common",
      requirements: [{ type: "lessons_completed", value: 1 }],
      points: 10,
      is_active: true,
    },
    {
      name: "Quick Learner",
      description: "Complete 5 lessons in one day",
      icon: "⚡",
      category: "streak",
      rarity: "rare",
      requirements: [{ type: "daily_lessons", value: 5 }],
      points: 25,
      is_active: true,
    },
    {
      name: "Dedicated Student",
      description: "Study for 7 consecutive days",
      icon: "📚",
      category: "streak",
      rarity: "rare",
      requirements: [{ type: "streak_days", value: 7 }],
      points: 50,
      is_active: true,
    },
    {
      name: "Science Explorer",
      description: "Complete 10 science lessons",
      icon: "🔬",
      category: "subject",
      rarity: "rare",
      requirements: [{ type: "subject_lessons", subject: "science", value: 10 }],
      points: 30,
      is_active: true,
    },
    {
      name: "Math Wizard",
      description: "Score 90% or higher on 5 math assessments",
      icon: "🧮",
      category: "subject",
      rarity: "epic",
      requirements: [{ type: "subject_score", subject: "math", score: 90, count: 5 }],
      points: 75,
      is_active: true,
    },
    {
      name: "Assessment Ace",
      description: "Complete 25 assessments",
      icon: "🏆",
      category: "milestone",
      rarity: "epic",
      requirements: [{ type: "assessments_completed", value: 25 }],
      points: 100,
      is_active: true,
    },
    {
      name: "Tutor Chat Champion",
      description: "Have 50 tutor conversations",
      icon: "💬",
      category: "special",
      rarity: "epic",
      requirements: [{ type: "tutor_sessions", value: 50 }],
      points: 80,
      is_active: true,
    },
    {
      name: "Knowledge Seeker",
      description: "Earn 1000 total points",
      icon: "🎓",
      category: "milestone",
      rarity: "legendary",
      requirements: [{ type: "total_points", value: 1000 }],
      points: 150,
      is_active: true,
    },
    {
      name: "Consistency King",
      description: "Maintain a 30-day learning streak",
      icon: "👑",
      category: "streak",
      rarity: "legendary",
      requirements: [{ type: "streak_days", value: 30 }],
      points: 200,
      is_active: true,
    },
    {
      name: "Unstoppable",
      description: "Reach level 10",
      icon: "🚀",
      category: "special",
      rarity: "legendary",
      requirements: [{ type: "level", value: 10 }],
      points: 300,
      is_active: true,
    },
    {
      name: "Perfect Attendance",
      description: "Log in every day for 14 days",
      icon: "📅",
      category: "streak",
      rarity: "rare",
      requirements: [{ type: "login_streak", value: 14 }],
      points: 70,
      is_active: true,
    },
    {
      name: "Language Master",
      description: "Complete all language learning objectives",
      icon: "🗣️",
      category: "subject",
      rarity: "epic",
      requirements: [{ type: "subject_complete", subject: "language", value: 100 }],
      points: 120,
      is_active: true,
    },
    {
      name: "Creative Genius",
      description: "Submit 10 creative projects",
      icon: "🎨",
      category: "subject",
      rarity: "rare",
      requirements: [{ type: "projects_submitted", value: 10 }],
      points: 60,
      is_active: true,
    },
    {
      name: "Social Studies Star",
      description: "Score 100% on a social studies assessment",
      icon: "🌍",
      category: "subject",
      rarity: "rare",
      requirements: [{ type: "perfect_score", subject: "social_studies", value: 1 }],
      points: 40,
      is_active: true,
    },
    {
      name: "Helping Hand",
      description: "Help 5 classmates with questions",
      icon: "🤝",
      category: "social",
      rarity: "rare",
      requirements: [{ type: "peer_help", value: 5 }],
      points: 50,
      is_active: true,
    },
  ]

  for (const badge of badges) {
    try {
      await supabase.from("badges").upsert(badge, { onConflict: "name" })
    } catch (error) {
      console.error(`Error creating badge ${badge.name}:`, error)
    }
  }

  console.log(`Created ${badges.length} badges`)
}

// Generate achievements
async function generateAchievements() {
  console.log("Generating achievements...")

  const achievements = [
    {
      name: "Welcome Aboard",
      description: "Complete your profile setup",
      icon: "👋",
      category: "getting_started",
      points: 5,
      requirements: [{ type: "profile_complete", value: 1 }],
      is_secret: false,
    },
    {
      name: "First Victory",
      description: "Score 100% on any assessment",
      icon: "🎯",
      category: "assessment",
      points: 20,
      requirements: [{ type: "perfect_score", value: 1 }],
      is_secret: false,
    },
    {
      name: "Speed Demon",
      description: "Complete a lesson in under 5 minutes",
      icon: "💨",
      category: "special",
      points: 15,
      requirements: [{ type: "lesson_time", value: 5, operator: "less_than" }],
      is_secret: false,
    },
    {
      name: "Night Owl",
      description: "Study between 10 PM and 6 AM",
      icon: "🦉",
      category: "special",
      points: 10,
      requirements: [{ type: "study_time", start: "22:00", end: "06:00" }],
      is_secret: true,
    },
    {
      name: "Early Bird",
      description: "Study before 7 AM",
      icon: "🐦",
      category: "special",
      points: 10,
      requirements: [{ type: "study_time", start: "05:00", end: "07:00" }],
      is_secret: true,
    },
    {
      name: "Weekend Warrior",
      description: "Study on both Saturday and Sunday",
      icon: "⚔️",
      category: "streak",
      points: 25,
      requirements: [{ type: "weekend_study", value: 1 }],
      is_secret: false,
    },
    {
      name: "Perfectionist",
      description: "Score 100% on 10 assessments",
      icon: "💯",
      category: "assessment",
      points: 100,
      requirements: [{ type: "perfect_scores", value: 10 }],
      is_secret: false,
    },
  ]

  for (const achievement of achievements) {
    try {
      await supabase.from("achievements").upsert(achievement, { onConflict: "name" })
    } catch (error) {
      console.error(`Error creating achievement ${achievement.name}:`, error)
    }
  }

  console.log(`Created ${achievements.length} achievements`)
}
