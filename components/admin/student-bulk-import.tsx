"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StudentImportProps {
  schoolId: string
  schoolCode: string
  onImportComplete: (students: StudentAccount[]) => void
}

interface StudentData {
  firstName: string
  lastName: string
  grade: string
  gender?: string
  dateOfBirth?: string
  parentName?: string
  parentContact?: string
}

interface StudentAccount extends StudentData {
  username: string
  password: string
  email: string
}

export function StudentBulkImport({ schoolId, schoolCode, onImportComplete }: StudentImportProps) {
  const [step, setStep] = useState<"upload" | "preview" | "processing" | "complete" | "error">("upload")
  const [file, setFile] = useState<File | null>(null)
  const [students, setStudents] = useState<StudentData[]>([])
  const [generatedAccounts, setGeneratedAccounts] = useState<StudentAccount[]>([])
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please upload a CSV file")
        return
      }

      setFile(selectedFile)
      parseCSV(selectedFile)
    }
  }

  const parseCSV = (file: File) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const rows = text.split("\n")
        const headers = rows[0].split(",").map((h) => h.trim())

        // Validate required headers
        const requiredHeaders = ["firstName", "lastName", "grade"]
        const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

        if (missingHeaders.length > 0) {
          setError(`Missing required headers: ${missingHeaders.join(", ")}`)
          return
        }

        const parsedStudents: StudentData[] = []

        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue

          const values = rows[i].split(",").map((v) => v.trim())
          const student: any = {}

          headers.forEach((header, index) => {
            student[header] = values[index] || ""
          })

          parsedStudents.push(student as StudentData)
        }

        setStudents(parsedStudents)
        setStep("preview")
        setError(null)
      } catch (err) {
        setError("Error parsing CSV file. Please check the format.")
      }
    }

    reader.onerror = () => {
      setError("Error reading file")
    }

    reader.readAsText(file)
  }

  const handleImport = async () => {
    setStep("processing")
    setProgress(0)

    try {
      // Simulate API call with progress
      const totalSteps = 100
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 2
        })
      }, 50)

      // Generate usernames and passwords
      const accounts: StudentAccount[] = students.map((student, index) => {
        const year = new Date().getFullYear()
        const sequentialNumber = (index + 1).toString().padStart(3, "0")
        const username = `${schoolCode}${year}${sequentialNumber}`
        const password = generatePassword()
        const email = `${username}@cbctutorbot.edu`

        return {
          ...student,
          username,
          password,
          email,
        }
      })

      // Simulate API call completion
      setTimeout(() => {
        clearInterval(interval)
        setProgress(100)
        setGeneratedAccounts(accounts)
        setStep("complete")
        onImportComplete(accounts)
      }, 2500)
    } catch (err) {
      setError("Error importing students")
      setStep("error")
    }
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let password = ""
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const downloadCSV = () => {
    if (generatedAccounts.length === 0) return

    const headers = ["firstName", "lastName", "grade", "username", "password", "email"]
    const csvContent = [
      headers.join(","),
      ...generatedAccounts.map((account) => headers.map((header) => account[header as keyof StudentAccount]).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${schoolCode}_student_accounts.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetImport = () => {
    setFile(null)
    setStudents([])
    setGeneratedAccounts([])
    setProgress(0)
    setError(null)
    setStep("upload")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case "upload":
        return (
          <>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Upload a CSV file with student information</p>
                <p className="text-xs text-gray-400 mb-4">Required columns: firstName, lastName, grade</p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <Label htmlFor="csv-upload" asChild>
                  <Button variant="outline" className="cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Select CSV File
                  </Button>
                </Label>
              </div>

              {file && (
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <Badge variant="outline">{(file.size / 1024).toFixed(1)} KB</Badge>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <h4 className="text-sm font-medium text-amber-800 mb-1">CSV Format Example</h4>
                <pre className="text-xs bg-white p-2 rounded border border-amber-100 overflow-x-auto">
                  firstName,lastName,grade,gender,dateOfBirth,parentName,parentContact
                  <br />
                  John,Kamau,Grade 4,Male,2014-05-12,Mary Kamau,0712345678
                  <br />
                  Jane,Wanjiku,Grade 3,Female,2015-08-23,Peter Wanjiku,0723456789
                </pre>
              </div>
            </CardContent>

            <CardFooter>
              <Button onClick={() => file && setStep("preview")} disabled={!file} className="ml-auto">
                Next
              </Button>
            </CardFooter>
          </>
        )

      case "preview":
        return (
          <>
            <CardContent className="space-y-4">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Gender</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.slice(0, 5).map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{student.firstName}</TableCell>
                        <TableCell>{student.lastName}</TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>{student.gender || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {students.length > 5 && (
                <p className="text-xs text-gray-500 text-center">Showing 5 of {students.length} students</p>
              )}

              <Alert>
                <AlertTitle>Ready to import {students.length} students</AlertTitle>
                <AlertDescription>
                  This will create accounts for all students with auto-generated usernames and passwords.
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetImport}>
                Back
              </Button>
              <Button onClick={handleImport}>Import Students</Button>
            </CardFooter>
          </>
        )

      case "processing":
        return (
          <CardContent className="space-y-4 py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-blue-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Processing Students</h3>
              <p className="text-sm text-gray-500 mb-4">Creating accounts for {students.length} students...</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        )

      case "complete":
        return (
          <>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                <h3 className="text-lg font-medium mb-1">Import Complete!</h3>
                <p className="text-sm text-gray-500">
                  Successfully created {generatedAccounts.length} student accounts
                </p>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedAccounts.slice(0, 5).map((account, index) => (
                      <TableRow key={index}>
                        <TableCell>{`${account.firstName} ${account.lastName}`}</TableCell>
                        <TableCell className="font-mono text-xs">{account.username}</TableCell>
                        <TableCell className="font-mono text-xs">{account.password}</TableCell>
                        <TableCell>{account.grade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {generatedAccounts.length > 5 && (
                <p className="text-xs text-gray-500 text-center">Showing 5 of {generatedAccounts.length} accounts</p>
              )}

              <Alert>
                <AlertTitle>Next Steps</AlertTitle>
                <AlertDescription>
                  Download the CSV file containing all student accounts and credentials for distribution.
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetImport}>
                Import More Students
              </Button>
              <Button onClick={downloadCSV}>
                <Download className="h-4 w-4 mr-2" />
                Download Accounts CSV
              </Button>
            </CardFooter>
          </>
        )

      case "error":
        return (
          <>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Import Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter>
              <Button variant="outline" onClick={resetImport} className="ml-auto">
                Try Again
              </Button>
            </CardFooter>
          </>
        )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bulk Student Import</CardTitle>
        <CardDescription>Import multiple students at once and automatically generate accounts</CardDescription>
      </CardHeader>

      {renderStepContent()}
    </Card>
  )
}
