"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartCardProps {
  title: string
  type: "line" | "pie"
  data: any[]
  isLoading?: boolean
  lineDataKey?: string
  pieDataKey?: string
  pieNameKey?: string
}

const COLORS = ['#7cb518', '#0fa3b1', '#fbb02d', '#5c8001', '#fb6107', '#f3de2c', '#b5e2fa']

export function ChartCard({ title, type, data, isLoading = false, lineDataKey = "value", pieDataKey = "value", pieNameKey = "name" }: ChartCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === "line" ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={lineDataKey} stroke="#7cb518" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={pieDataKey}
                nameKey={pieNameKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

