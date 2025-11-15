"use client"

import { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatPillProps {
  icon: ReactNode
  value: string | number
  label: string
  className?: string
}

export function StatPill({ icon, value, label, className }: StatPillProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </Card>
  )
}

