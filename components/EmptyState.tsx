"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  )
}

