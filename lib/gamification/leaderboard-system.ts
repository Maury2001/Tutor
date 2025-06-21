import type { LeaderboardEntry } from "./types"

export function addRankToLeaderboard(entries: Omit<LeaderboardEntry, "rank">[]): LeaderboardEntry[] {
  return entries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }))
}

export function getRankIcon(rank: number): string {
  switch (rank) {
    case 1:
      return "👑"
    case 2:
      return "🥈"
    case 3:
      return "🥉"
    default:
      return `#${rank}`
  }
}

export function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return "text-yellow-600 bg-yellow-50"
    case 2:
      return "text-gray-600 bg-gray-50"
    case 3:
      return "text-amber-600 bg-amber-50"
    default:
      return "text-gray-500 bg-gray-50"
  }
}

export function filterLeaderboardByGrade(entries: LeaderboardEntry[], gradeLevel?: string): LeaderboardEntry[] {
  if (!gradeLevel) return entries
  return entries.filter((entry) => entry.grade_level === gradeLevel)
}

export function filterLeaderboardBySchool(entries: LeaderboardEntry[], schoolName?: string): LeaderboardEntry[] {
  if (!schoolName) return entries
  return entries.filter((entry) => entry.school_name === schoolName)
}
