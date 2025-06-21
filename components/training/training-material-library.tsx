"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, Trash2, FileText, Globe, Calendar, User, Tag, BookOpen } from "lucide-react"

interface TrainingMaterial {
  id: string
  title: string
  description: string
  category: string
  contentType: string
  type: "file" | "url"
  source: string
  size?: string
  uploadedBy: string
  uploadedAt: string
  status: "processing" | "ready" | "training" | "error"
  tags: string[]
  priority: "low" | "medium" | "high" | "critical"
}

const mockMaterials: TrainingMaterial[] = [
  {
    id: "1",
    title: "Grade 4 Mathematics Curriculum Guide",
    description: "Comprehensive curriculum guide for Grade 4 mathematics covering all CBC competencies",
    category: "Mathematics",
    contentType: "Curriculum Guidelines",
    type: "file",
    source: "grade4-math-curriculum.pdf",
    size: "2.3 MB",
    uploadedBy: "Mary Teacher",
    uploadedAt: "2024-01-15",
    status: "ready",
    tags: ["grade4", "mathematics", "curriculum", "cbc"],
    priority: "high",
  },
  {
    id: "2",
    title: "Science Experiment Templates",
    description: "Collection of science experiment templates for primary grades",
    category: "Science",
    contentType: "Teacher Guides",
    type: "file",
    source: "science-experiments.docx",
    size: "1.8 MB",
    uploadedBy: "John Science",
    uploadedAt: "2024-01-14",
    status: "training",
    tags: ["science", "experiments", "primary", "templates"],
    priority: "medium",
  },
  {
    id: "3",
    title: "CBC Assessment Rubrics",
    description: "Official CBC assessment rubrics from KICD",
    category: "General Knowledge",
    contentType: "Assessment Rubrics",
    type: "url",
    source: "https://kicd.ac.ke/cbc-assessment-rubrics",
    uploadedBy: "Admin User",
    uploadedAt: "2024-01-13",
    status: "ready",
    tags: ["assessment", "rubrics", "cbc", "kicd"],
    priority: "critical",
  },
  {
    id: "4",
    title: "English Language Learning Objectives",
    description: "Detailed learning objectives for English language across all grades",
    category: "English Language",
    contentType: "Learning Objectives",
    type: "file",
    source: "english-objectives.pdf",
    size: "1.2 MB",
    uploadedBy: "Sarah English",
    uploadedAt: "2024-01-12",
    status: "processing",
    tags: ["english", "objectives", "language", "all-grades"],
    priority: "high",
  },
]

export function TrainingMaterialLibrary() {
  const [materials, setMaterials] = useState<TrainingMaterial[]>(mockMaterials)
  const [filteredMaterials, setFilteredMaterials] = useState<TrainingMaterial[]>(mockMaterials)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    let filtered = materials

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (material) =>
          material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((material) => material.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((material) => material.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((material) => material.type === typeFilter)
    }

    setFilteredMaterials(filtered)
  }, [materials, searchTerm, categoryFilter, statusFilter, typeFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "training":
        return "bg-blue-100 text-blue-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this training material?")) {
      setMaterials((prev) => prev.filter((material) => material.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center text-blue-900">
            <BookOpen className="h-5 w-5 mr-2" />
            Training Material Library
          </CardTitle>
          <CardDescription className="text-blue-700">
            Manage and organize all training materials for AI model development
          </CardDescription>
        </CardHeader>
        <CardContent className="library-content-enhanced">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search materials, tags, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="English Language">English</SelectItem>
                  <SelectItem value="General Knowledge">General</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="file">Files</SelectItem>
                  <SelectItem value="url">URLs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material) => (
              <Card
                key={material.id}
                className="hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500 upload-material-card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {material.type === "file" ? (
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                      ) : (
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Globe className="h-5 w-5 text-green-600" />
                        </div>
                      )}
                      <Badge className={getPriorityColor(material.priority)}>{material.priority}</Badge>
                    </div>
                    <Badge className={getStatusColor(material.status)}>{material.status}</Badge>
                  </div>
                  <CardTitle className="text-lg">{material.title}</CardTitle>
                  <CardDescription className="text-sm">{material.description}</CardDescription>
                </CardHeader>
                <CardContent className="training-material-content space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {material.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{material.uploadedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{material.uploadedAt}</span>
                    </div>
                    {material.size && (
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>{material.size}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-2">
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(material.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No training materials found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
