"use client"

import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  caption: string
  icon?: ReactNode
}

export function StatCard({ title, value, caption, icon }: StatCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="shrink-0 p-3 rounded-lg bg-primary/10">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-3xl font-bold mb-2 text-foreground">{value}</div>
            <div className="text-base font-semibold text-foreground mb-1">{title}</div>
            <div className="text-sm text-muted-foreground">{caption}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
