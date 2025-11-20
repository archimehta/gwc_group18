"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/state";
import { StatCard } from "@/components/StatCard";
import { EarthSticker } from "@/components/EarthSticker";
import { gramsToKg } from "@/lib/format";
import { Flame, Leaf, Sparkles } from "lucide-react";
import { startOfDay, parseISO, isSameDay } from "date-fns";
import { getHabitById } from "@/data/habits";

interface TodayHabitSummary {
  id: string;
  name: string;
  quantity: number;
  icon?: ReactNode;
}

export default function Dashboard() {
  const initialize = useAppStore((state) => state.initialize);
  const displayName = useAppStore((state) => state.displayName);
  const streakDays = useAppStore((state) => state.streakDays);
  const lifetimeGrams = useAppStore((state) => state.lifetimeGrams);
  const logs = useAppStore((state) => state.logs);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const { todaysActions, todaysHabitSummaries } = useMemo(() => {
    const today = startOfDay(new Date());

    const todaysLogs = logs.filter((log) =>
      isSameDay(startOfDay(parseISO(log.dateISO)), today)
    );

    const actions = todaysLogs.length;

    // Group today's logs by habit and sum their quantities + carry the icon
    const habitMap: Record<
      string,
      { name: string; quantity: number; icon?: ReactNode }
    > = {};

    todaysLogs.forEach((log) => {
      const habit = getHabitById(log.habitId);
      const name = habit?.name ?? "Action";
      const icon = habit?.icon as ReactNode | undefined;

      const existing = habitMap[log.habitId];
      if (existing) {
        existing.quantity += log.quantity;
      } else {
        habitMap[log.habitId] = { name, quantity: log.quantity, icon };
      }
    });

    const summaries: TodayHabitSummary[] = Object.entries(habitMap).map(
      ([id, data]) => ({
        id,
        name: data.name,
        quantity: data.quantity,
        icon: data.icon,
      })
    );

    return {
      todaysActions: actions,
      todaysHabitSummaries: summaries,
    };
  }, [logs]);

  const actionsValue =
    todaysActions === 0
      ? "No actions"
      : todaysActions === 1
      ? "1 action"
      : `${todaysActions} actions`;

  const badgeColors = [
    "bg-emerald-100 text-emerald-900",
    "bg-lime-100 text-lime-900",
    "bg-teal-100 text-teal-900",
    "bg-sky-100 text-sky-900",
  ];

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

      {/* Top stats row: streak + lifetime CO₂ (these stay small) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Streak */}
        <StatCard
          icon={<Flame className="h-7 w-7 text-warn" />}
          title="Streak"
          value={`${streakDays}-day streak`}
          caption="Log at least once a day to keep it going."
        />

        {/* Lifetime CO₂ */}
        <StatCard
          icon={<Leaf className="h-7 w-7 text-success" />}
          title="Lifetime CO₂ Saved"
          value={gramsToKg(lifetimeGrams)}
          caption="All-time CO₂ saved."
        />
      </div>

      {/* Today's Actions row: this card can grow tall without stretching the others */}
      <div className="max-w-4xl">
        <StatCard
          icon={<Sparkles className="h-7 w-7 text-primary" />}
          title="Today's Actions"
          value={actionsValue}
          caption={
            todaysActions === 0 ? (
              <span>No actions logged yet today.</span>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  What you logged today:
                </p>

                <div className="space-y-3">
                  {todaysHabitSummaries.map((h, index) => {
                    const colorClass = badgeColors[index % badgeColors.length];

                    return (
                      <div
                        key={h.id}
                        className={`flex items-center gap-4 rounded-xl px-5 py-4 w-full ${colorClass}`}
                      >
                        {/* Icon on the LEFT, bigger */}
                        {h.icon && (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/70 text-2xl">
                            {h.icon}
                          </div>
                        )}

                        {/* Action text */}
                        <div className="flex-1 text-base font-semibold leading-snug text-black/80">
                          {h.quantity}× {h.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          }
        />
      </div>
    </div>
  );
}
