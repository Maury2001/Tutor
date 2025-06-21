"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PointsDisplay } from "@/components/gamification/points-display"
import { BadgeShowcase } from "@/components/gamification/badge-showcase"
import { Leaderboard } from "@/components/gamification/leaderboard"
import { AchievementSystem } from "@/components/gamification/achievement-system"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Award, Target, Users } from "lucide-react"
import { checkSupabaseConfig } from "@/lib/supabase/client"

interface GamificationData {
  userPoints: any
  transactions: any[]
  allBadges: any[]
  userBadges: any[]
  allAchievements: any[]
  userAchievements: any[]
  globalLeaderboard: any[]
  weeklyLeaderboard: any[]
  userRank?: number
  userWeeklyRank?: number
}

export default function GamificationPage() {
  const [data, setData] = useState<GamificationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGamificationData()
  }, [])

  const fetchGamificationData = async () => {
    try {
      setLoading(true)

      // Check if Supabase is configured
      const { isConfigured } = checkSupabaseConfig()

      if (!isConfigured) {
        console.warn("Supabase not configured, using mock data")
        // Use mock data for development
        setData({
          userPoints: {
            total_points: 1250,
            weekly_points: 180,
            monthly_points: 750,
            streak_days: 7,
            level: 5,
            experience_points: 1250,
          },
          transactions: [],
          allBadges: [
            {
              id: "1",
              name: "First Steps",
              description: "Complete your first lesson",
              icon: "🎯",
              category: "getting_started",
            },
            {
              id: "2",
              name: "Quick Learner",
              description: "Complete 5 lessons in one day",
              icon: "⚡",
              category: "speed",
            },
          ],
          userBadges: [{ id: "1", user_id: "user1", badge_id: "1", earned_at: new Date().toISOString() }],
          allAchievements: [
            {
              id: "1",
              name: "Welcome Aboard",
              description: "Complete your profile setup",
              icon: "👋",
              category: "getting_started",
              points: 5,
              requirements: [{ type: "profile_complete", value: 1 }],
              is_secret: false,
            },
            {
              id: "2",
              name: "First Victory",
              description: "Score 100% on any assessment",
              icon: "🎯",
              category: "assessment",
              points: 20,
              requirements: [{ type: "perfect_score", value: 1 }],
              is_secret: false,
            },
          ],
          userAchievements: [
            {
              id: "1",
              user_id: "user1",
              achievement_id: "1",
              progress: 100,
              completed: true,
              completed_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          globalLeaderboard: [
            { rank: 1, user_id: "user1", name: "John Doe", points: 1250, avatar: null },
            { rank: 2, user_id: "user2", name: "Jane Smith", points: 1100, avatar: null },
          ],
          weeklyLeaderboard: [{ rank: 1, user_id: "user1", name: "John Doe", points: 180, avatar: null }],
          userRank: 1,
          userWeeklyRank: 1,
        })
        return
      }

      // Fetch all gamification data
      const [pointsRes, badgesRes, leaderboardRes] = await Promise.all([
        fetch("/api/gamification/points"),
        fetch("/api/gamification/badges"),
        fetch("/api/gamification/leaderboard"),
      ])

      const [pointsData, badgesData, leaderboardData] = await Promise.all([
        pointsRes.json(),
        badgesRes.json(),
        leaderboardRes.json(),
      ])

      // Mock achievements data (would come from API)
      const mockAchievements = [
        {
          id: "1",
          name: "Welcome Aboard",
          description: "Complete your profile setup",
          icon: "👋",
          category: "getting_started",
          points: 5,
          requirements: [{ type: "profile_complete", value: 1 }],
          is_secret: false,
        },
        {
          id: "2",
          name: "First Victory",
          description: "Score 100% on any assessment",
          icon: "🎯",
          category: "assessment",
          points: 20,
          requirements: [{ type: "perfect_score", value: 1 }],
          is_secret: false,
        },
      ]

      const mockUserAchievements = [
        {
          id: "1",
          user_id: "user1",
          achievement_id: "1",
          progress: 100,
          completed: true,
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      setData({
        userPoints: pointsData.userPoints,
        transactions: pointsData.transactions,
        allBadges: badgesData.allBadges,
        userBadges: badgesData.userBadges,
        allAchievements: mockAchievements,
        userAchievements: mockUserAchievements,
        globalLeaderboard: leaderboardData.leaderboard,
        weeklyLeaderboard: leaderboardData.leaderboard,
        userRank: leaderboardData.userRank,
        userWeeklyRank: leaderboardData.userRank,
      })
    } catch (error) {
      console.error("Error fetching gamification data:", error)
      // Fallback to mock data on error
      setData({
        userPoints: {
          total_points: 0,
          weekly_points: 0,
          monthly_points: 0,
          streak_days: 0,
          level: 1,
          experience_points: 0,
        },
        transactions: [],
        allBadges: [],
        userBadges: [],
        allAchievements: [],
        userAchievements: [],
        globalLeaderboard: [],
        weeklyLeaderboard: [],
        userRank: undefined,
        userWeeklyRank: undefined,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load gamification data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-8 w-8 text-yellow-600" />
        <h1 className="text-3xl font-bold">Gamification Hub</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{data?.userPoints?.total_points?.toLocaleString() || "0"}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{data?.userBadges?.length || 0}</p>
                <p className="text-sm text-gray-600">Badges Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {data?.userAchievements?.filter((ua) => ua?.completed)?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">#{data?.userRank || "N/A"}</p>
                <p className="text-sm text-gray-600">Global Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PointsDisplay
              userPoints={
                data?.userPoints || {
                  total_points: 0,
                  weekly_points: 0,
                  monthly_points: 0,
                  streak_days: 0,
                  level: 1,
                  experience_points: 0,
                }
              }
            />
            <BadgeShowcase userBadges={data?.userBadges || []} allBadges={data?.allBadges || []} compact />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AchievementSystem
              userAchievements={data?.userAchievements || []}
              allAchievements={data?.allAchievements || []}
              compact
            />
            <Leaderboard
              globalLeaderboard={data?.globalLeaderboard || []}
              weeklyLeaderboard={data?.weeklyLeaderboard || []}
              userRank={data?.userRank}
              userWeeklyRank={data?.userWeeklyRank}
              compact
            />
          </div>
        </TabsContent>

        <TabsContent value="points">
          <PointsDisplay
            userPoints={
              data?.userPoints || {
                total_points: 0,
                weekly_points: 0,
                monthly_points: 0,
                streak_days: 0,
                level: 1,
                experience_points: 0,
              }
            }
          />
        </TabsContent>

        <TabsContent value="badges">
          <BadgeShowcase userBadges={data?.userBadges || []} allBadges={data?.allBadges || []} />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementSystem
            userAchievements={data?.userAchievements || []}
            allAchievements={data?.allAchievements || []}
          />
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard
            globalLeaderboard={data?.globalLeaderboard || []}
            weeklyLeaderboard={data?.weeklyLeaderboard || []}
            userRank={data?.userRank}
            userWeeklyRank={data?.userWeeklyRank}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
