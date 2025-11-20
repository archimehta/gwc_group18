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

const POINT_GOAL = 250;
const POINTS_PER_GRAM = 1 / 10;

export default function Dashboard() {
  const initialize = useAppStore((state) => state.initialize);
  const displayName = useAppStore((state) => state.displayName);
  const streakDaysReal = useAppStore((state) => state.streakDays);
  const lifetimeGrams = useAppStore((state) => state.lifetimeGrams);
  const logs = useAppStore((state) => state.logs);


  const streakDays = 7;
  useEffect(() => {
    initialize();
  }, [initialize]);

  const { todaysActions, todaysHabitSummaries, todaysPoints } = useMemo(() => {
    const today = startOfDay(new Date());
    const todaysLogs = logs.filter((log) =>
      isSameDay(startOfDay(parseISO(log.dateISO)), today)
    );

    const actions = todaysLogs.length;
    const habitMap: Record<string, { name: string; quantity: number; icon?: ReactNode }> = {};
    let totalPoints = 0;

    todaysLogs.forEach((log) => {
      const habit = getHabitById(log.habitId);
      if (habit) {
        const gramsSaved = habit.gramsPerUnit * log.quantity;
        totalPoints += gramsSaved * POINTS_PER_GRAM;
      }

      const existing = habitMap[log.habitId];
      if (existing) {
        existing.quantity += log.quantity;
      } else {
        habitMap[log.habitId] = { name: habit?.name ?? "Action", quantity: log.quantity, icon: habit?.icon };
      }
    });

    return {
      todaysActions: actions,
      todaysHabitSummaries: Object.entries(habitMap).map(([id, data]) => ({ id, ...data })),
      todaysPoints: Math.round(totalPoints),
    };
  }, [logs]);

  const actionsValue =
    todaysActions === 0 ? "No actions" : todaysActions === 1 ? "1 action" : `${todaysActions} actions`;

  const badgeColors = ["bg-emerald-100 text-emerald-900", "bg-lime-100 text-lime-900", "bg-teal-100 text-teal-900", "bg-sky-100 text-sky-900"];

  // 🎯 MINI BADGE SYSTEM
  const badges: string[] = [];
  if (streakDays >= 5) badges.push("🔥 Streak Warrior");
  if (lifetimeGrams >= 5000) badges.push("🌍 Eco Hero");
  if (todaysPoints >= POINT_GOAL) badges.push("🏆 Daily Champion");

  const progressPercentage = Math.min((todaysPoints / POINT_GOAL) * 100, 100);

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <EarthSticker size={100} />
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Hi, {displayName} 🌱
          </h1>
          <p className="text-xl text-muted-foreground">You're making an impact.</p>
        </div>
      </div>

      {/* streak + lifetime + celebration */}
      <div
        className={`grid gap-6 max-w-4xl ${
          todaysPoints >= POINT_GOAL ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        <StatCard icon={<Flame className="h-7 w-7 text-warn" />} title="Streak" value={`${streakDays}-day streak`} caption="Log at least once a day to keep it going." />

        <StatCard icon={<Leaf className="h-7 w-7 text-success" />} title="Lifetime CO₂ Saved" value={gramsToKg(lifetimeGrams)} caption="All-time CO₂ saved." />

        {/* Celebration Card */}
        {todaysPoints >= POINT_GOAL && (
          <StatCard
            icon={<div className="text-4xl">🎊</div>}
            title="🎉 Goal Reached!"
            value={`${todaysPoints} pts`}
            caption="Amazing work! You hit your daily target 🌿"
          />
        )}
      </div>

      {/* TODAY'S ACTIONS + POINTS + BADGES */}
      <div className="max-w-4xl">
        <StatCard
          icon={<Sparkles className="h-7 w-7 text-primary" />}
          title="Today's Actions"
          value={actionsValue}
          caption={
            todaysActions === 0 ? (
              <span>No actions logged yet today.</span>
            ) : (
              <div className="space-y-4">
                {/* LIST OF HABITS */}
                <div>
                  <p className="text-sm text-muted-foreground">What you logged today:</p>
                  <div className="space-y-3 mt-2">
                    {todaysHabitSummaries.map((h, index) => (
                      <div
                        key={h.id}
                        className={`flex items-center gap-4 rounded-xl px-5 py-4 w-full ${
                          badgeColors[index % badgeColors.length]
                        }`}
                      >
                        {h.icon && <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/70 text-2xl">{h.icon}</div>}
                        <div className="flex-1 text-base font-semibold leading-snug text-black/80">
                          {h.quantity}× {h.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* POINT TRACKER */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-muted-foreground">🌟 Daily Point Progress</p>
                  <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>{todaysPoints} pts</span>
                    <span>Goal: {POINT_GOAL}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                </div>

                {/* 🏅 MINI BADGES */}
                {badges.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground">🏆 Badges Earned</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {badges.map((badge, idx) => (
                        <span key={idx} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          }
        />
      </div>
     {/* WEEKLY GOAL TRACKER */}
<div className="max-w-4xl">
  <StatCard
    icon={<Sparkles className="h-7 w-7 text-green-600" />}
    title="Weekly Goal Tracker"
    value=""
    caption={
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Goal Tracking (Demo)</p>

        {/* Weekly row */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
            const isWednesday = day === "Wed";

            // Default neutral styling
            let dayStyle = "bg-gray-200 text-gray-700";
            let daySymbol = "—";

            // 🎨 Explicit demo coloring
            if (day === "Sun") {
              dayStyle = "bg-green-200 text-green-800";
              daySymbol = "✔";
            }
            if (day === "Mon") {
              dayStyle = "bg-red-200 text-red-800";
              daySymbol = "✖";
            }
            if (day === "Tue") {
              dayStyle = "bg-red-200 text-red-800";
              daySymbol = "✖";
            }

            // 🌟 Wednesday turns green only when goal is reached
            if (isWednesday && todaysPoints >= POINT_GOAL) {
              dayStyle = "bg-green-200 text-green-800";
              daySymbol = "✔";
            }

            return (
              <div
                key={day}
                className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium ${dayStyle}`}
              >
                <span>{day}</span>
                <span>{daySymbol}</span>
              </div>
            );
          })}
        </div>
      </div>
    }
  />
</div>


    </div>
  );
}
