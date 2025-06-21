"use client"

import { useState } from "react"
import { Search, Filter, GraduationCap } from "lucide-react"
import { CurriculumCard } from "./curriculum-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CurriculumExplorer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search learning areas, strands or sub-strands..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 items-center">
          <GraduationCap className="text-gray-500 h-5 w-5" />
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="pp1">PP1</SelectItem>
              <SelectItem value="pp2">PP2</SelectItem>
              <SelectItem value="grade1">Grade 1</SelectItem>
              <SelectItem value="grade2">Grade 2</SelectItem>
              <SelectItem value="grade3">Grade 3</SelectItem>
              <SelectItem value="grade4">Grade 4</SelectItem>
              <SelectItem value="grade5">Grade 5</SelectItem>
              <SelectItem value="grade6">Grade 6</SelectItem>
              <SelectItem value="grade7">Grade 7</SelectItem>
              <SelectItem value="grade8">Grade 8</SelectItem>
              <SelectItem value="grade9">Grade 9</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CurriculumCard />

      <div className="text-center text-sm text-gray-500">
        <p>Displaying curriculum content aligned with the Kenya Competency-Based Curriculum (CBC)</p>
        <p className="text-xs mt-1">Source: Kenya Institute of Curriculum Development (KICD)</p>
      </div>
    </div>
  )
}
