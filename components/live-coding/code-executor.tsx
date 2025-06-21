"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Square, Zap, CheckCircle, XCircle } from "lucide-react"

interface CodeExecutorProps {
  code: string
  language: string
  onOutput: (output: string, error?: string) => void
}

export function CodeExecutor({ code, language, onOutput }: CodeExecutorProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [lastExecution, setLastExecution] = useState<{
    success: boolean
    time: number
    output: string
  } | null>(null)

  const executeCode = async () => {
    setIsExecuting(true)
    const startTime = Date.now()

    try {
      let result = ""

      switch (language) {
        case "javascript":
          result = await executeJavaScript(code)
          break
        case "python":
          result = await executePython(code)
          break
        case "html":
          result = "HTML rendered successfully"
          break
        case "css":
          result = "CSS styles applied"
          break
        default:
          result = "Language not supported"
      }

      const executionTime = Date.now() - startTime
      setLastExecution({
        success: true,
        time: executionTime,
        output: result,
      })

      onOutput(result)
    } catch (error: any) {
      const executionTime = Date.now() - startTime
      setLastExecution({
        success: false,
        time: executionTime,
        output: error.message,
      })

      onOutput("", error.message)
    } finally {
      setIsExecuting(false)
    }
  }

  const executeJavaScript = async (code: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const logs: string[] = []
        const originalLog = console.log

        console.log = (...args) => {
          logs.push(args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" "))
        }

        const result = eval(code)
        console.log = originalLog

        const output = logs.join("\n")
        resolve(output || (result !== undefined ? String(result) : "Code executed successfully"))
      } catch (error: any) {
        console.log = console.log
        reject(error)
      }
    })
  }

  const executePython = async (code: string): Promise<string> => {
    // Simulate Python execution
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code.includes("print")) {
          const printMatches = code.match(/print$$[^)]+$$/g) || []
          const output = printMatches
            .map((stmt) => {
              const content = stmt.match(/print$$["']([^"']+)["']$$/)?.[1] || stmt.match(/print$$([^)]+)$$/)?.[1] || ""
              return content.replace(/["']/g, "")
            })
            .join("\n")
          resolve(output || "Python code executed")
        } else {
          resolve("Python code executed successfully")
        }
      }, 500)
    })
  }

  return (
    <Card className="border-2 border-green-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600" />
            Code Executor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{language}</Badge>
            {lastExecution && (
              <Badge variant={lastExecution.success ? "default" : "destructive"}>
                {lastExecution.success ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {lastExecution.time}ms
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Button onClick={executeCode} disabled={isExecuting} className="bg-green-600 hover:bg-green-700">
            {isExecuting ? (
              <>
                <Square className="h-4 w-4 mr-2 animate-pulse" />
                Executing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Execute Code
              </>
            )}
          </Button>

          {isExecuting && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
              Running {language} code...
            </div>
          )}
        </div>

        {lastExecution && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              {lastExecution.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={lastExecution.success ? "text-green-700" : "text-red-700"}>
                Last execution: {lastExecution.success ? "Success" : "Error"}({lastExecution.time}ms)
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
