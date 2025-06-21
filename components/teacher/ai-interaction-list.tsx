"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { safeDateFormat } from "@/utils/date-helpers"

interface AIInteractionListProps {
  interactions: Array<{
    id: string
    content_summary: string
    created_at: string
    profiles: {
      full_name: string
      avatar_url: string
    }
    learning_areas?: {
      name: string
      code: string
    }
    strands?: {
      name: string
      code: string
    }
  }>
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
  onPageChange: (page: number) => void
}

export function AIInteractionList({ interactions = [], pagination, onPageChange }: AIInteractionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Interaction History</CardTitle>
        <CardDescription>Recent questions students have asked the AI tutor</CardDescription>
      </CardHeader>
      <CardContent>
        {interactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-muted-foreground">No interaction history available</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {interactions.map((interaction) => (
                <div key={interaction.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={interaction.profiles?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>
                          {interaction.profiles?.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{interaction.profiles?.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {safeDateFormat(new Date(interaction.created_at))}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {interaction.learning_areas && <Badge variant="outline">{interaction.learning_areas.name}</Badge>}
                      {interaction.strands && <Badge variant="outline">{interaction.strands.name}</Badge>}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm">{interaction.content_summary}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                  {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} interactions
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
