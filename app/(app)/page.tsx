"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/state"
import { StatCard } from "@/components/StatCard"
import { EarthSticker } from "@/components/EarthSticker"
import { EmptyState } from "@/components/EmptyState"
import { gramsToKg } from "@/lib/format"
import { Flame, Leaf } from "lucide-react"

export default function Dashboard() {
  const initialize = useAppStore((state) => state.initialize)
  const displayName = useAppStore((state) => state.displayName)
  const streakDays = useAppStore((state) => state.streakDays)
  const lifetimeGrams = useAppStore((state) => state.lifetimeGrams)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <EarthSticker size={100} />
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Hi, {displayName} 🌱
          </h1>
          <p className="text-xl text-muted-foreground">
            You're making an impact.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <StatCard
          icon={<Flame className="h-7 w-7 text-warn" />}
          title="Streak"
          value={`${streakDays}-day streak`}
          caption="Log at least once a day to keep it going."
        />
        <StatCard
          icon={<Leaf className="h-7 w-7 text-success" />}
          title="Lifetime CO₂ Saved"
          value={gramsToKg(lifetimeGrams)}
          caption="All-time CO₂ saved."
        />
      </div>
    </div>
  )
}
