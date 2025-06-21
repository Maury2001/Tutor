import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface AILearningAreaBreakdownProps {
  distribution: Record<string, number>
}

export function AILearningAreaBreakdown({ distribution = {} }: AILearningAreaBreakdownProps) {
  // Convert the distribution object to an array for the chart
  const data = Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
  }))

  // Sort by value descending
  data.sort((a, b) => b.value - a.value)

  const COLORS = [
    "#3B82F6", // blue-500
    "#10B981", // green-500
    "#F59E0B", // amber-500
    "#EF4444", // red-500
    "#8B5CF6", // violet-500
    "#EC4899", // pink-500
    "#06B6D4", // cyan-500
    "#F97316", // orange-500
    "#6366F1", // indigo-500
    "#14B8A6", // teal-500
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Learning Area Distribution</CardTitle>
        <CardDescription>AI tutor usage across learning areas</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-muted-foreground">No learning area data available</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} interactions`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
