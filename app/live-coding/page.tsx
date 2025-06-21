"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Play,
  Square,
  Save,
  Download,
  Upload,
  Code,
  Terminal,
  FileText,
  Zap,
  Brain,
  Rocket,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Share2,
} from "lucide-react"

interface CodeExecution {
  id: string
  code: string
  language: string
  output: string
  error?: string
  timestamp: Date
  executionTime: number
  status: "success" | "error" | "running"
}

interface LiveSession {
  id: string
  participants: string[]
  code: string
  language: string
  isActive: boolean
  lastUpdate: Date
}

export default function LiveCodingPage() {
  const [code, setCode] = useState(`// Welcome to Live Coding Environment!
// Write your code here and execute it instantly

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

// Try some array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);

// Object manipulation
const student = {
  name: "Alice",
  grade: 10,
  subjects: ["Math", "Science", "English"]
};

console.log("Student info:", student);
console.log("Subjects:", student.subjects.join(", "));`)

  const [language, setLanguage] = useState("javascript")
  const [output, setOutput] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [executions, setExecutions] = useState<CodeExecution[]>([])
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null)
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [participants, setParticipants] = useState<string[]>(["You"])

  const codeEditorRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Language templates
  const languageTemplates = {
    javascript: `// JavaScript Live Coding
console.log("Hello, World!");

// Variables and functions
const greeting = (name) => {
  return \`Hello, \${name}!\`;
};

console.log(greeting("Coder"));

// Array methods
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);`,

    python: `# Python Live Coding
print("Hello, World!")

# Functions and loops
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for i in range(1, 6):
    print(f"Factorial of {i} is {factorial(i)}")

# List comprehension
squares = [x**2 for x in range(1, 11)]
print("Squares:", squares)`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live HTML</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .highlight { background: yellow; padding: 10px; }
        .button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Live HTML Preview</h1>
    <p class="highlight">This HTML updates in real-time!</p>
    <button class="button" onclick="alert('Hello from live HTML!')">Click Me</button>
    
    <div id="dynamic-content">
        <h2>Dynamic Content</h2>
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
    </div>
    
    <script>
        console.log("HTML is live and interactive!");
        document.addEventListener('DOMContentLoaded', function() {
            console.log("DOM loaded successfully");
        });
    </script>
</body>
</html>`,

    css: `/* Live CSS Styling */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 20px;
    color: white;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.1);
    padding: 30px;
    border-radius: 15px;
    backdrop-filter: blur(10px);
}

.title {
    font-size: 2.5em;
    text-align: center;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.card {
    background: rgba(255, 255, 255, 0.2);
    padding: 20px;
    margin: 15px 0;
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.button {
    background: #ff6b6b;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.button:hover {
    background: #ff5252;
    transform: scale(1.05);
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}

.pulse {
    animation: pulse 2s infinite;
}`,
  }

  // Execute code function
  const executeCode = async () => {
    setIsExecuting(true)
    setOutput("Executing...")

    const startTime = Date.now()

    try {
      let result = ""

      if (language === "javascript") {
        result = await executeJavaScript(code)
      } else if (language === "python") {
        result = await executePython(code)
      } else if (language === "html") {
        result = "HTML rendered in preview panel"
      } else if (language === "css") {
        result = "CSS applied to preview panel"
      }

      const executionTime = Date.now() - startTime

      const execution: CodeExecution = {
        id: Date.now().toString(),
        code,
        language,
        output: result,
        timestamp: new Date(),
        executionTime,
        status: "success",
      }

      setExecutions((prev) => [execution, ...prev.slice(0, 9)]) // Keep last 10 executions
      setOutput(result)
    } catch (error: any) {
      const executionTime = Date.now() - startTime

      const execution: CodeExecution = {
        id: Date.now().toString(),
        code,
        language,
        output: "",
        error: error.message,
        timestamp: new Date(),
        executionTime,
        status: "error",
      }

      setExecutions((prev) => [execution, ...prev.slice(0, 9)])
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsExecuting(false)
    }
  }

  // JavaScript execution simulation
  const executeJavaScript = async (code: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // Capture console.log output
        const logs: string[] = []
        const originalLog = console.log

        console.log = (...args) => {
          logs.push(args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" "))
        }

        // Execute the code
        const result = eval(code)

        // Restore console.log
        console.log = originalLog

        // Return captured output
        let output = logs.join("\n")
        if (result !== undefined && logs.length === 0) {
          output = String(result)
        }

        resolve(output || "Code executed successfully (no output)")
      } catch (error: any) {
        console.log = console.log // Restore console.log
        reject(error)
      }
    })
  }

  // Python execution simulation
  const executePython = async (code: string): Promise<string> => {
    // Simulate Python execution (in a real app, you'd use a Python interpreter)
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code.includes("print")) {
          const printStatements = code.match(/print$$[^)]+$$/g) || []
          const output = printStatements
            .map((stmt) => {
              const content = stmt.match(/print$$["']([^"']+)["']$$/)?.[1] || stmt.match(/print$$([^)]+)$$/)?.[1] || ""
              return content.replace(/["']/g, "")
            })
            .join("\n")
          resolve(output || "Python code executed")
        } else {
          resolve("Python code executed successfully")
        }
      }, 1000)
    })
  }

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      localStorage.setItem("liveCodingCode", code)
      localStorage.setItem("liveCodingLanguage", language)
    }, 2000)

    return () => clearTimeout(autoSave)
  }, [code, language])

  // Load saved code on mount
  useEffect(() => {
    const savedCode = localStorage.getItem("liveCodingCode")
    const savedLanguage = localStorage.getItem("liveCodingLanguage")

    if (savedCode) setCode(savedCode)
    if (savedLanguage) setLanguage(savedLanguage)
  }, [])

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    setCode(languageTemplates[newLanguage as keyof typeof languageTemplates] || "")
    setOutput("")
  }

  // Start collaborative session
  const startCollaboration = () => {
    setIsCollaborating(true)
    const sessionId = Date.now().toString()
    const session: LiveSession = {
      id: sessionId,
      participants: ["You", "Collaborator 1"],
      code,
      language,
      isActive: true,
      lastUpdate: new Date(),
    }
    setLiveSession(session)
    setParticipants(session.participants)
  }

  // Simulate real-time collaboration
  useEffect(() => {
    if (isCollaborating && liveSession) {
      const interval = setInterval(() => {
        // Simulate other participants joining/leaving
        const possibleParticipants = ["Alice", "Bob", "Charlie", "Diana", "Eve"]
        const randomParticipants = possibleParticipants
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * 3) + 1)

        setParticipants(["You", ...randomParticipants])
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [isCollaborating, liveSession])

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                Live Coding Environment
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-time
                </Badge>
              </h1>
              <p className="text-purple-100 text-lg">Write, execute, and collaborate on code in real-time</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Brain className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Users className="h-3 w-3 mr-1" />
                  Collaborative
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Rocket className="h-3 w-3 mr-1" />
                  Instant Execution
                </Badge>
              </div>
            </div>
          </div>

          {/* Collaboration Status */}
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${isCollaborating ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
              ></div>
              <span className="text-sm">{isCollaborating ? "Live Session Active" : "Solo Coding"}</span>
            </div>
            <div className="text-xs text-purple-200">
              {participants.length} participant{participants.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Code Editor Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Language Selection and Controls */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Code Editor
                </CardTitle>
                <div className="flex items-center gap-2">
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                  </select>
                  <Button onClick={executeCode} disabled={isExecuting} className="bg-green-600 hover:bg-green-700">
                    {isExecuting ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Execute
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <textarea
                  ref={codeEditorRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="Write your code here..."
                  spellCheck={false}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => setCode("")}>
                    Clear
                  </Button>
                  <Button size="sm" variant="outline">
                    <Save className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Output
                {isExecuting && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    Executing...
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm min-h-32 max-h-64 overflow-y-auto">
                {language === "html" ? (
                  <div className="bg-white text-black p-4 rounded border">
                    <div dangerouslySetInnerHTML={{ __html: code }} />
                  </div>
                ) : language === "css" ? (
                  <div>
                    <style>{code}</style>
                    <div className="container">
                      <h1 className="title">CSS Preview</h1>
                      <div className="card">
                        <p>This is a preview of your CSS styles</p>
                        <button className="button">Styled Button</button>
                      </div>
                      <div className="card pulse">
                        <p>Another styled element with animation</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap">
                    {output || "No output yet. Click 'Execute' to run your code."}
                  </pre>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Collaboration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!isCollaborating ? (
                <Button onClick={startCollaboration} className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Start Live Session
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                    Live session active
                  </div>
                  <div className="space-y-1">
                    {participants.map((participant, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${index === 0 ? "bg-blue-500" : "bg-green-500"}`}></div>
                        {participant}
                        {index === 0 && <span className="text-xs text-gray-500">(You)</span>}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsCollaborating(false)} className="w-full">
                    End Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Execution History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Execution History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {executions.length === 0 ? (
                  <p className="text-sm text-gray-500">No executions yet</p>
                ) : (
                  executions.map((execution) => (
                    <div key={execution.id} className="border rounded-lg p-3 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant={execution.status === "success" ? "default" : "destructive"}>
                          {execution.status === "success" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {execution.language}
                        </Badge>
                        <span className="text-gray-500">{execution.executionTime}ms</span>
                      </div>
                      <div className="text-gray-600">{execution.timestamp.toLocaleTimeString()}</div>
                      {execution.error && <div className="text-red-600 mt-1 text-xs">{execution.error}</div>}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Code
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Import File
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Share2 className="h-4 w-4 mr-2" />
                Share Snippet
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Docs
              </Button>
            </CardContent>
          </Card>

          {/* Code Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Code Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setCode(languageTemplates.javascript)}
              >
                JavaScript Basics
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setCode(languageTemplates.python)}
              >
                Python Examples
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setCode(languageTemplates.html)}
              >
                HTML Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setCode(languageTemplates.css)}
              >
                CSS Styles
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Coding Tips */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>Live Coding Tips:</strong> Use Ctrl+Enter to execute code quickly. Your code is auto-saved every 2
          seconds. Try the collaboration feature to code with others in real-time!
        </AlertDescription>
      </Alert>
    </div>
  )
}
