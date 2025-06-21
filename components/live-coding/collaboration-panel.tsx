"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Share2, Copy, UserPlus, MessageSquare } from "lucide-react"

interface Participant {
  id: string
  name: string
  color: string
  isActive: boolean
  lastSeen: Date
}

interface CollaborationPanelProps {
  isActive: boolean
  onToggle: (active: boolean) => void
}

export function CollaborationPanel({ isActive, onToggle }: CollaborationPanelProps) {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "you",
      name: "You",
      color: "bg-blue-500",
      isActive: true,
      lastSeen: new Date(),
    },
  ])
  const [sessionId, setSessionId] = useState<string>("")
  const [messages, setMessages] = useState<
    Array<{
      id: string
      user: string
      message: string
      timestamp: Date
    }>
  >([])

  // Generate session ID when collaboration starts
  useEffect(() => {
    if (isActive && !sessionId) {
      setSessionId(Math.random().toString(36).substring(2, 8).toUpperCase())
    }
  }, [isActive, sessionId])

  // Simulate participants joining/leaving
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        const possibleParticipants = [
          { name: "Alice", color: "bg-green-500" },
          { name: "Bob", color: "bg-purple-500" },
          { name: "Charlie", color: "bg-orange-500" },
          { name: "Diana", color: "bg-pink-500" },
          { name: "Eve", color: "bg-indigo-500" },
        ]

        const activeCount = Math.floor(Math.random() * 3) + 1
        const selectedParticipants = possibleParticipants
          .sort(() => Math.random() - 0.5)
          .slice(0, activeCount)
          .map((p, index) => ({
            id: `user-${index}`,
            name: p.name,
            color: p.color,
            isActive: Math.random() > 0.3,
            lastSeen: new Date(Date.now() - Math.random() * 300000), // Random time in last 5 minutes
          }))

        setParticipants([
          {
            id: "you",
            name: "You",
            color: "bg-blue-500",
            isActive: true,
            lastSeen: new Date(),
          },
          ...selectedParticipants,
        ])
      }, 8000)

      return () => clearInterval(interval)
    }
  }, [isActive])

  // Simulate chat messages
  useEffect(() => {
    if (isActive && participants.length > 1) {
      const interval = setInterval(() => {
        const sampleMessages = [
          "Great code! 👍",
          "Can you explain this part?",
          "I think there's a bug on line 15",
          "Nice solution!",
          "Let me try a different approach",
          "This is working well",
          "Should we refactor this?",
          "Good catch!",
        ]

        const randomParticipant = participants.filter((p) => p.id !== "you")[
          Math.floor(Math.random() * (participants.length - 1))
        ]

        if (randomParticipant && Math.random() > 0.7) {
          const newMessage = {
            id: Date.now().toString(),
            user: randomParticipant.name,
            message: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
            timestamp: new Date(),
          }

          setMessages((prev) => [...prev.slice(-4), newMessage]) // Keep last 5 messages
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isActive, participants])

  const copySessionLink = () => {
    const link = `${window.location.origin}/live-coding?session=${sessionId}`
    navigator.clipboard.writeText(link)
    // You could show a toast notification here
  }

  const startCollaboration = () => {
    onToggle(true)
    setMessages([
      {
        id: "welcome",
        user: "System",
        message: "Live collaboration session started! Share the link to invite others.",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Live Collaboration
          {isActive && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse mr-1"></div>
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">Start a live session to code with others in real-time</p>
            <Button onClick={startCollaboration} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Start Live Session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Session Info */}
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Session ID</span>
                <Badge variant="outline">{sessionId}</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copySessionLink} className="flex-1">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Link
                </Button>
                <Button size="sm" variant="outline">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Invite
                </Button>
              </div>
            </div>

            {/* Participants */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participants ({participants.length})
              </h4>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={`${participant.color} text-white text-xs`}>
                        {participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm flex-1">{participant.name}</span>
                    <div
                      className={`w-2 h-2 rounded-full ${participant.isActive ? "bg-green-500" : "bg-gray-400"}`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Chat */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Live Chat
              </h4>
              <div className="bg-gray-50 rounded-lg p-3 h-32 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-xs text-gray-500">No messages yet</p>
                ) : (
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <div key={message.id} className="text-xs">
                        <span className="font-medium text-purple-600">{message.user}:</span>
                        <span className="ml-1 text-gray-700">{message.message}</span>
                        <div className="text-gray-400 text-xs">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* End Session */}
            <Button variant="outline" size="sm" onClick={() => onToggle(false)} className="w-full">
              End Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
