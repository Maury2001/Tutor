// lib/gamification/points-system.ts

interface PointsActivity {
  type: string
  description?: string
  pointsAwarded: number
  userId: string
  timestamp: Date
}

interface PointsRule {
  activityType: string
  points: number
  description: string
}

interface PointsTransaction {
  userId: string
  points: number
  activityType: string
  timestamp: Date
}

class PointsCalculator {
  private rules: PointsRule[]

  constructor(rules: PointsRule[]) {
    this.rules = rules
  }

  calculatePoints(activityType: string): number | null {
    const rule = this.rules.find((r) => r.activityType === activityType)
    return rule ? rule.points : null
  }
}

function calculatePoints(activityType: string, rules: PointsRule[]): number | null {
  const rule = rules.find((r) => r.activityType === activityType)
  return rule ? rule.points : null
}

async function awardPoints(
  userId: string,
  activityType: string,
  points: number,
  description?: string,
): Promise<PointsActivity> {
  const timestamp = new Date()
  const pointsActivity: PointsActivity = {
    type: activityType,
    description: description,
    pointsAwarded: points,
    userId: userId,
    timestamp: timestamp,
  }

  // In a real application, you would save this to a database.
  console.log(`Awarded ${points} points to user ${userId} for activity ${activityType}`)

  return pointsActivity
}

async function getPointsBalance(userId: string): Promise<number> {
  // In a real application, you would fetch this from a database.
  // This is just a placeholder.
  console.log(`Fetching points balance for user ${userId}`)
  return 100
}

// Additional gamification functions
function getPointsForNextLevel(currentLevel: number): number {
  // Points required for next level (exponential growth)
  return Math.floor(100 * Math.pow(1.5, currentLevel))
}

function getProgressToNextLevel(currentPoints: number, currentLevel: number): number {
  const pointsForCurrentLevel = currentLevel > 0 ? getPointsForNextLevel(currentLevel - 1) : 0
  const pointsForNextLevel = getPointsForNextLevel(currentLevel)
  const pointsInCurrentLevel = currentPoints - pointsForCurrentLevel
  const pointsNeededForLevel = pointsForNextLevel - pointsForCurrentLevel

  return Math.min(100, Math.max(0, (pointsInCurrentLevel / pointsNeededForLevel) * 100))
}

// Points system configuration
const pointsSystem = {
  activities: {
    lesson_completion: 10,
    quiz_completion: 15,
    perfect_quiz: 25,
    daily_login: 5,
    streak_bonus: 20,
    help_peer: 30,
    create_content: 50,
  },
  levels: {
    beginner: { min: 0, max: 100 },
    intermediate: { min: 100, max: 500 },
    advanced: { min: 500, max: 1500 },
    expert: { min: 1500, max: 5000 },
    master: { min: 5000, max: Number.POSITIVE_INFINITY },
  },
}

export {
  calculatePoints,
  awardPoints,
  getPointsBalance,
  getPointsForNextLevel,
  getProgressToNextLevel,
  pointsSystem,
  PointsCalculator,
  type PointsActivity,
  type PointsRule,
  type PointsTransaction,
}
