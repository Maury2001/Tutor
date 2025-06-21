"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  User,
  Settings,
  Shield,
  Bell,
  Save,
  Camera,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
} from "lucide-react"
import { useState, useEffect } from "react"

interface UserProfile {
  id: string
  name: string
  email: string
  gradeLevel: string
  county: string
  school: string
  dateOfBirth: string
  parentEmail: string
  preferences: {
    notifications: boolean
    emailUpdates: boolean
    theme: string
    language: string
  }
  stats: {
    totalLessons: number
    averageScore: number
    studyStreak: number
    achievements: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const kenyanCounties = [
    "Baringo",
    "Bomet",
    "Bungoma",
    "Busia",
    "Elgeyo-Marakwet",
    "Embu",
    "Garissa",
    "Homa Bay",
    "Isiolo",
    "Kajiado",
    "Kakamega",
    "Kericho",
    "Kiambu",
    "Kilifi",
    "Kirinyaga",
    "Kisii",
    "Kisumu",
    "Kitui",
    "Kwale",
    "Laikipia",
    "Lamu",
    "Machakos",
    "Makueni",
    "Mandera",
    "Marsabit",
    "Meru",
    "Migori",
    "Mombasa",
    "Murang'a",
    "Nairobi",
    "Nakuru",
    "Nandi",
    "Narok",
    "Nyamira",
    "Nyandarua",
    "Nyeri",
    "Samburu",
    "Siaya",
    "Taita-Taveta",
    "Tana River",
    "Tharaka-Nithi",
    "Trans Nzoia",
    "Turkana",
    "Uasin Gishu",
    "Vihiga",
    "Wajir",
    "West Pokot",
  ]

  const gradeLevels = [
    { value: "pp1", label: "Pre-Primary 1 (PP1)" },
    { value: "pp2", label: "Pre-Primary 2 (PP2)" },
    { value: "grade1", label: "Grade 1" },
    { value: "grade2", label: "Grade 2" },
    { value: "grade3", label: "Grade 3" },
    { value: "grade4", label: "Grade 4" },
    { value: "grade5", label: "Grade 5" },
    { value: "grade6", label: "Grade 6" },
    { value: "grade7", label: "Grade 7" },
    { value: "grade8", label: "Grade 8" },
    { value: "grade9", label: "Grade 9" },
  ]

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      setLoading(true)

      // Try to fetch from API
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else {
        // Fallback to user data with defaults
        setProfile({
          id: user?.id || "",
          name: user?.name || "",
          email: user?.email || "",
          gradeLevel: user?.gradeLevel || "",
          county: user?.county || "",
          school: user?.school || "",
          dateOfBirth: user?.dateOfBirth || "",
          parentEmail: user?.parentEmail || "",
          preferences: {
            notifications: true,
            emailUpdates: true,
            theme: "light",
            language: "en",
          },
          stats: {
            totalLessons: 42,
            averageScore: 87,
            studyStreak: 7,
            achievements: 12,
          },
        })
      }
    } catch (error) {
      console.error("Failed to load profile:", error)
      setMessage({ type: "error", text: "Failed to load profile data" })
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!profile) return

    try {
      setSaving(true)
      setMessage(null)

      // Save to API
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        // Update auth context
        await updateUser({
          ...user,
          name: profile.name,
          gradeLevel: profile.gradeLevel,
          county: profile.county,
          school: profile.school,
        })

        setMessage({ type: "success", text: "Profile updated successfully!" })
      } else {
        throw new Error("Failed to save profile")
      }
    } catch (error) {
      console.error("Failed to save profile:", error)
      setMessage({ type: "error", text: "Failed to save profile. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  const updateProfile = (field: string, value: any) => {
    if (!profile) return

    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setProfile({
        ...profile,
        [parent]: {
          ...profile[parent as keyof UserProfile],
          [child]: value,
        },
      })
    } else {
      setProfile({
        ...profile,
        [field]: value,
      })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Please log in to view your profile.</p>
          <Button onClick={() => router.push("/auth/signin")} className="mt-4">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            {profile?.gradeLevel?.toUpperCase().replace("GRADE", "Grade ") || "Student"}
          </Badge>
        </div>

        {/* Message */}
        {message && (
          <Card
            className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <CardContent className="p-4">
              <p className={message.type === "success" ? "text-green-800" : "text-red-800"}>{message.text}</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile?.name || ""}
                      onChange={(e) => updateProfile("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || ""}
                        onChange={(e) => updateProfile("email", e.target.value)}
                        className="pl-10"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profile?.dateOfBirth || ""}
                        onChange={(e) => updateProfile("dateOfBirth", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentEmail">Parent/Guardian Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="parentEmail"
                        type="email"
                        value={profile?.parentEmail || ""}
                        onChange={(e) => updateProfile("parentEmail", e.target.value)}
                        className="pl-10"
                        placeholder="Parent/guardian email"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Academic Information
                </CardTitle>
                <CardDescription>Update your school and grade information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Select
                      value={profile?.gradeLevel || ""}
                      onValueChange={(value) => updateProfile("gradeLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels.map((grade) => (
                          <SelectItem key={grade.value} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Select value={profile?.county || ""} onValueChange={(value) => updateProfile("county", value)}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select your county" />
                        </SelectTrigger>
                        <SelectContent>
                          {kenyanCounties.map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="school">School Name</Label>
                    <Input
                      id="school"
                      value={profile?.school || ""}
                      onChange={(e) => updateProfile("school", e.target.value)}
                      placeholder="Enter your school name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Preferences
                </CardTitle>
                <CardDescription>Customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications about your learning progress</p>
                    </div>
                    <Button
                      variant={profile?.preferences?.notifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateProfile("preferences.notifications", !profile?.preferences?.notifications)}
                    >
                      {profile?.preferences?.notifications ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Updates</h4>
                      <p className="text-sm text-gray-600">Receive weekly progress reports via email</p>
                    </div>
                    <Button
                      variant={profile?.preferences?.emailUpdates ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateProfile("preferences.emailUpdates", !profile?.preferences?.emailUpdates)}
                    >
                      {profile?.preferences?.emailUpdates ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={profile?.preferences?.theme || "light"}
                      onValueChange={(value) => updateProfile("preferences.theme", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={profile?.preferences?.language || "en"}
                      onValueChange={(value) => updateProfile("preferences.language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sw">Kiswahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Statistics</CardTitle>
                  <CardDescription>Your learning journey so far</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Lessons</span>
                      <Badge>{profile?.stats?.totalLessons || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Score</span>
                      <Badge className="bg-green-100 text-green-800">{profile?.stats?.averageScore || 0}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Study Streak</span>
                      <Badge className="bg-blue-100 text-blue-800">{profile?.stats?.studyStreak || 0} days</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Achievements</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{profile?.stats?.achievements || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Bell className="h-4 w-4 mr-2" />
                      Privacy Settings
                    </Button>
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button onClick={saveProfile} disabled={saving} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
