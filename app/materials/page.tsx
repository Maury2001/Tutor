"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { MainLayout } from "@/components/layout/main-layout"
import { useRouter } from "next/navigation"
import { Search, Download, Eye, BookOpen, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Material {
  id: string
  title: string
  description: string
  subject: string
  gradeLevel: string
  materialType: string
  uploadDate: Date
  downloads: number
  fileSize: string
  tags: string[]
}

const mockMaterials: Material[] = [
  {
    id: "1",
    title: "Introduction to Fractions",
    description: "Basic concepts of fractions for Grade 4 students",
    subject: "Mathematics",
    gradeLevel: "Grade 4",
    materialType: "Lesson Notes",
    uploadDate: new Date("2024-01-15"),
    downloads: 45,
    fileSize: "2.3 MB",
    tags: ["fractions", "basic-math", "grade4"],
  },
  {
    id: "2",
    title: "Photosynthesis Worksheet",
    description: "Interactive worksheet on plant photosynthesis process",
    subject: "Science",
    gradeLevel: "Grade 6",
    materialType: "Worksheets",
    uploadDate: new Date("2024-01-20"),
    downloads: 32,
    fileSize: "1.8 MB",
    tags: ["photosynthesis", "plants", "biology"],
  },
  {
    id: "3",
    title: "Kiswahili Grammar Guide",
    description: "Comprehensive guide to Kiswahili grammar rules",
    subject: "Kiswahili",
    gradeLevel: "Grade 5",
    materialType: "Reference Materials",
    uploadDate: new Date("2024-01-25"),
    downloads: 28,
    fileSize: "3.1 MB",
    tags: ["grammar", "kiswahili", "language"],
  },
]

export default function MaterialsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [materials, setMaterials] = useState<Material[]>(mockMaterials)
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(mockMaterials)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedGrade, setSelectedGrade] = useState("all")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    let filtered = materials

    if (searchTerm) {
      filtered = filtered.filter(
        (material) =>
          material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter((material) => material.subject === selectedSubject)
    }

    if (selectedGrade !== "all") {
      filtered = filtered.filter((material) => material.gradeLevel === selectedGrade)
    }

    setFilteredMaterials(filtered)
  }, [searchTerm, selectedSubject, selectedGrade, materials])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  const subjects = ["Mathematics", "English", "Kiswahili", "Science", "Social Studies"]
  const grades = ["PP1", "PP2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Learning Materials</h1>
            <p className="text-gray-600">Browse CBC-aligned educational resources</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <CardDescription className="mt-2">{material.description}</CardDescription>
                  </div>
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{material.subject}</Badge>
                  <Badge variant="outline">{material.gradeLevel}</Badge>
                  <Badge variant="outline">{material.materialType}</Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{material.downloads} downloads</span>
                  <span>{material.fileSize}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {material.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
