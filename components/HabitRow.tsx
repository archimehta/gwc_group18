"use client"

import { Habit } from "@/data/habits"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus } from "lucide-react"
import { pluralize, formatGrams } from "@/lib/format"
import Image from "next/image"

interface HabitRowProps {
  habit: Habit
  quantity: number
  onQuantityChange: (quantity: number) => void
  onLog: () => void
}

export function HabitRow({ habit, quantity, onQuantityChange, onLog }: HabitRowProps) {
  const isImageIcon = habit.icon.startsWith('/')
  const gramsSaved = habit.gramsPerUnit * quantity

  return (
    <div className="p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-4xl shrink-0 w-14 h-14 flex items-center justify-center">
          {isImageIcon ? (
            <Image
              src={habit.icon}
              alt={habit.name}
              width={56}
              height={56}
              className="object-contain"
              unoptimized
            />
          ) : (
            <span>{habit.icon}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base mb-2">{habit.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {habit.gramsPerUnit}g per {habit.unit}
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 h-9 text-center text-sm font-medium"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[60px] text-center">
              {pluralize(habit.unit, quantity)}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="text-sm font-semibold text-primary">= {formatGrams(gramsSaved)} saved</div>
            <Button onClick={onLog} className="w-full sm:w-auto">
              Log Action
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
