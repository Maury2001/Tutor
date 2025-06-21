"use client"

import { useState } from "react"
import { Beaker, Brain, Users, Building, GraduationCap, Settings, Plus, Edit, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TokenDistributionModal } from "./token-distribution-modal"

const SchoolManagement = () => {
  const [schools, setSchools] = useState([
    {
      id: "1",
      name: "Hilltop High School",
      initials: "HHS",
      location: "Nairobi",
      students: 520,
      teachers: 35,
      contactNumber: "+254-712-345-678",
      subscription: "Premium",
      subscriptionExpiry: "2024-12-31",
      aiTokensAllocated: 10000,
      aiTokensUsed: 3450,
      status: "active",
      founded: "1995",
    },
    {
      id: "2",
      name: "Brookside Academy",
      initials: "BA",
      location: "Mombasa",
      students: 480,
      teachers: 30,
      contactNumber: "+254-723-456-789",
      subscription: "Standard",
      subscriptionExpiry: "2024-08-15",
      aiTokensAllocated: 5000,
      aiTokensUsed: 4200,
      status: "active",
      founded: "2001",
    },
  ])

  const [students, setStudents] = useState([
    {
      id: "1",
      name: "Alice Johnson",
      grade: "Grade 10",
      class: "A",
      attendance: "95%",
      status: "active",
    },
    {
      id: "2",
      name: "Bob Williams",
      grade: "Grade 11",
      class: "B",
      attendance: "88%",
      status: "active",
    },
  ])

  const [virtualLabs, setVirtualLabs] = useState([
    {
      id: "1",
      name: "Chemistry Virtual Lab",
      subject: "Science",
      grade: "Grade 8",
      students: 45,
      experiments: 12,
      status: "active",
      lastUsed: "2024-01-15",
    },
    {
      id: "2",
      name: "Physics Simulation Lab",
      subject: "Science",
      grade: "Grade 9",
      students: 38,
      experiments: 8,
      status: "active",
      lastUsed: "2024-01-14",
    },
  ])

  const [aiModels, setAiModels] = useState([
    {
      id: "1",
      name: "CBC Math Tutor",
      subject: "Mathematics",
      accuracy: 94.2,
      trainingData: 15600,
      agentsActive: 12,
      tokensAvailable: 25000,
      tokensDistributed: 18500,
      activeUsers: 145,
      status: "active",
      lastTrained: "2024-01-10",
    },
    {
      id: "2",
      name: "Science Experiment Guide",
      subject: "Science",
      accuracy: 91.8,
      trainingData: 8900,
      agentsActive: 8,
      tokensAvailable: 15000,
      tokensDistributed: 12300,
      activeUsers: 89,
      status: "training",
      lastTrained: "2024-01-12",
    },
  ])

  const [tokenModalOpen, setTokenModalOpen] = useState(false)
  const [selectedAiModel, setSelectedAiModel] = useState(null)

  const handleTokenDistribution = (model) => {
    setSelectedAiModel(model)
    setTokenModalOpen(true)
  }

  return (
    <Tabs defaultValue="schools" className="w-[100%]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="schools">Schools</TabsTrigger>
        <TabsTrigger value="students">Students</TabsTrigger>
        <TabsTrigger value="labs">Virtual Labs</TabsTrigger>
        <TabsTrigger value="ai-models">AI Models</TabsTrigger>
      </TabsList>
      <TabsContent value="schools" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>School Management Interface</span>
                </CardTitle>
                <CardDescription>Comprehensive school administration and subscription management</CardDescription>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add School
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schools.map((school) => (
                <Card key={school.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">{school.initials}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{school.name}</CardTitle>
                          <CardDescription>{school.location}</CardDescription>
                        </div>
                      </div>
                      <Badge
                        className={
                          school.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {school.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-yellow-600" />
                        <span>{school.students} learners</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>{school.teachers} teachers</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact:</span>
                        <span className="font-mono">{school.contactNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subscription:</span>
                        <Badge variant={school.subscription === "Premium" ? "default" : "secondary"}>
                          {school.subscription}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expires:</span>
                        <span>{school.subscriptionExpiry}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">AI Token Usage:</span>
                        <span>
                          {school.aiTokensUsed}/{school.aiTokensAllocated}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(school.aiTokensUsed / school.aiTokensAllocated) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Tokens
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="students" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Student Management</span>
                </CardTitle>
                <CardDescription>Manage student records and attendance</CardDescription>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <Card key={student.id} className="border-2">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription>
                          {student.grade} - Class {student.class}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          student.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {student.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span>Attendance:</span>
                        <span>{student.attendance}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="labs" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Beaker className="h-5 w-5" />
                  <span>Virtual Laboratory Management</span>
                </CardTitle>
                <CardDescription>Manage virtual science labs and experiments</CardDescription>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Virtual Lab
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {virtualLabs.map((lab) => (
                <Card key={lab.id} className="border-2">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{lab.name}</CardTitle>
                        <CardDescription>
                          {lab.subject} • {lab.grade}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          lab.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {lab.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>{lab.students} students</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Beaker className="h-4 w-4 text-purple-600" />
                        <span>{lab.experiments} experiments</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Last used: {lab.lastUsed}</div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ai-models" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Model & Token Distribution Interface</span>
                </CardTitle>
                <CardDescription>
                  Monitor AI agents, manage tokens, and distribute resources to subscribers
                </CardDescription>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Deploy New Agent
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiModels.map((model) => (
                <Card key={model.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription>{model.subject}</CardDescription>
                      </div>
                      <Badge
                        className={
                          model.status === "active"
                            ? "bg-green-100 text-green-800"
                            : model.status === "training"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {model.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Accuracy:</span>
                        <div className="font-semibold text-green-600">{model.accuracy}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Active Agents:</span>
                        <div className="font-semibold text-blue-600">{model.agentsActive}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Active Users:</span>
                        <div className="font-semibold">{model.activeUsers}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Training Data:</span>
                        <div className="font-semibold">{model.trainingData.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Token Distribution:</span>
                        <span>
                          {model.tokensDistributed}/{model.tokensAvailable}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(model.tokensDistributed / model.tokensAvailable) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">Last trained: {model.lastTrained}</div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleTokenDistribution(model)}>
                        <Brain className="h-4 w-4 mr-1" />
                        Distribute
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="h-4 w-4 mr-1" />
                        Users
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      {selectedAiModel && (
        <TokenDistributionModal
          isOpen={tokenModalOpen}
          onClose={() => setTokenModalOpen(false)}
          aiModel={selectedAiModel}
        />
      )}
    </Tabs>
  )
}

export { SchoolManagement }
