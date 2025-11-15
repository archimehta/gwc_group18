"use client"

import { Habit } from "@/data/habits"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { pluralize } from "@/lib/format"
import Image from "next/image"
import { Plus } from "lucide-react"

interface ActionCardProps {
  habit: Habit
  onLog?: (habitId: string) => void
}

export function ActionCard({ habit, onLog }: ActionCardProps) {
  const isImageIcon = habit.icon.startsWith('/')

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="text-3xl shrink-0">
          {isImageIcon ? (
            <Image
              src={habit.icon}
              alt={habit.name}
              width={40}
              height={40}
              className="object-contain"
            />
          ) : (
            <span>{habit.icon}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1">{habit.name}</h3>
          <Badge variant="secondary" className="text-xs mb-2">
            {habit.gramsPerUnit}g per {habit.unit}
          </Badge>
          {onLog && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLog(habit.id)}
              className="mt-2 w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Log
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

