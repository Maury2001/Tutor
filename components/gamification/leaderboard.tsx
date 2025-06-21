"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { LeaderboardEntry } from "@/lib/gamification/types"
import { getRankIcon, getRankColor } from "@/lib/gamification/leaderboard-system"
import { Trophy, Medal, Award, Users } from "lucide-react"

interface LeaderboardProps {
  globalLeaderboard: LeaderboardEntry[]
  weeklyLeaderboard: LeaderboardEntry[]
  userRank?: number
  userWeeklyRank?: number
  compact?: boolean
}

export function Leaderboard({
  globalLeaderboard,
  weeklyLeaderboard,
  userRank,
  userWeeklyRank,
  compact = false,
}: LeaderboardProps) {
  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {globalLeaderboard.slice(0, 5).map((entry, index) => (
              <div key={entry.user_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(index + 1)}`}
                >
                  {getRankIcon(index + 1)}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{entry.user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{entry.user_name}</p>
                  <p className="text-xs text-gray-500">{entry.total_points} points</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-600" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Time
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Medal className="h-4 w-4" />
              This Week
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4">
            {userRank && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Your rank: <span className="font-bold">#{userRank}</span>
                </p>
              </div>
            )}

            {/* Top 3 Podium */}
            {globalLeaderboard.length >= 3 && (
              <div className="flex justify-center items-end gap-4 mb-6">
                {/* 2nd Place */}
                <div className="text-center">
                  <Avatar className="h-12 w-12 mx-auto mb-2">
                    <AvatarImage src={globalLeaderboard[1]?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{globalLeaderboard[1]?.user_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-200 p-4 rounded-t-lg">
                    <div className="text-2xl mb-1">🥈</div>
                    <p className="font-semibold text-sm">{globalLeaderboard[1]?.user_name}</p>
                    <p className="text-xs text-gray-600">{globalLeaderboard[1]?.total_points} pts</p>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-2">
                    <AvatarImage src={globalLeaderboard[0]?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{globalLeaderboard[0]?.user_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="bg-yellow-200 p-4 rounded-t-lg">
                    <div className="text-3xl mb-1">👑</div>
                    <p className="font-bold">{globalLeaderboard[0]?.user_name}</p>
                    <p className="text-sm text-gray-700">{globalLeaderboard[0]?.total_points} pts</p>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <Avatar className="h-12 w-12 mx-auto mb-2">
                    <AvatarImage src={globalLeaderboard[2]?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{globalLeaderboard[2]?.user_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="bg-amber-200 p-4 rounded-t-lg">
                    <div className="text-2xl mb-1">🥉</div>
                    <p className="font-semibold text-sm">{globalLeaderboard[2]?.user_name}</p>
                    <p className="text-xs text-gray-600">{globalLeaderboard[2]?.total_points} pts</p>
                  </div>
                </div>
              </div>
            )}

            {/* Full Leaderboard */}
            <div className="space-y-2">
              {globalLeaderboard.map((entry, index) => (
                <LeaderboardRow key={entry.user_id} entry={entry} rank={index + 1} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            {userWeeklyRank && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Your weekly rank: <span className="font-bold">#{userWeeklyRank}</span>
                </p>
              </div>
            )}

            <div className="space-y-2">
              {weeklyLeaderboard.map((entry, index) => (
                <LeaderboardRow
                  key={entry.user_id}
                  entry={{ ...entry, total_points: entry.total_points }}
                  rank={index + 1}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function LeaderboardRow({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg ${rank <= 3 ? getRankColor(rank) : "hover:bg-gray-50"}`}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold">{getRankIcon(rank)}</div>

      <Avatar className="h-10 w-10">
        <AvatarImage src={entry.avatar_url || "/placeholder.svg"} />
        <AvatarFallback>{entry.user_name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{entry.user_name}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {entry.grade_level && <span>Grade {entry.grade_level}</span>}
          {entry.school_name && <span>• {entry.school_name}</span>}
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg">{entry.total_points.toLocaleString()}</p>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Award className="h-3 w-3" />
          <span>{entry.badge_count}</span>
        </div>
      </div>
    </div>
  )
}
