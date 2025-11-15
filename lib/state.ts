'use client'

import { create } from 'zustand'
import { startOfDay, parseISO, isSameDay, differenceInDays, subDays } from 'date-fns'
import { loadState, saveState, clearAllData as clearStorage, type LogEntry, type AppState } from './storage'
import { HABITS, getHabitById } from '@/data/habits'

function calculateStreak(logs: LogEntry[]): number {
  if (logs.length === 0) return 0
  
  const today = startOfDay(new Date())
  const logDates = logs
    .map(log => startOfDay(parseISO(log.dateISO)))
    .filter((date, index, self) => 
      self.findIndex(d => isSameDay(d, date)) === index
    )
    .sort((a, b) => b.getTime() - a.getTime())
  
  if (logDates.length === 0) return 0
  
  // Check if today has at least one log
  const hasToday = logDates.some(date => isSameDay(date, today))
  if (!hasToday) return 0 // No streak if no log today
  
  let streak = 1
  let currentDate = startOfDay(subDays(today, 1))
  let logIndex = 0
  
  // Skip today in logDates for counting backwards
  const datesWithoutToday = logDates.filter(date => !isSameDay(date, today))
  
  // Count consecutive days backwards starting from yesterday
  while (logIndex < datesWithoutToday.length) {
    if (isSameDay(datesWithoutToday[logIndex], currentDate)) {
      streak++
      logIndex++
      currentDate = startOfDay(subDays(currentDate, 1))
    } else {
      // Check if there's a gap
      const daysDiff = differenceInDays(currentDate, datesWithoutToday[logIndex])
      if (daysDiff > 1) {
        // Gap found - streak broken
        break
      }
      currentDate = startOfDay(subDays(currentDate, 1))
    }
  }
  
  return streak
}

interface StoreState extends AppState {
  habits: typeof HABITS
  initialize: () => void
  addLog: (habitId: string, quantity: number) => { gramsSaved: number; habitName: string } | null
  updateDisplayName: (name: string) => void
  clearAllData: () => void
}

export const useAppStore = create<StoreState>((set, get) => {
  const initialState: AppState = {
    logs: [],
    streakDays: 0,
    lifetimeGrams: 0,
    displayName: 'Eco Hero',
  }
  
  return {
    habits: HABITS,
    ...initialState,
    
    initialize: () => {
      const saved = loadState()
      const logs = saved.logs || []
      const streakDays = calculateStreak(logs)
      const lifetimeGrams = logs.reduce((sum, log) => sum + log.gramsSaved, 0)
      
      set({
        logs,
        streakDays,
        lifetimeGrams,
        displayName: saved.displayName || 'Eco Hero',
      })
    },
    
    addLog: (habitId: string, quantity: number) => {
      const habit = getHabitById(habitId)
      if (!habit) return null
      
      const gramsSaved = habit.gramsPerUnit * quantity
      const newLog: LogEntry = {
        id: `${Date.now()}-${Math.random()}`,
        habitId,
        quantity,
        gramsSaved,
        dateISO: new Date().toISOString(),
      }
      
      const logs = [...get().logs, newLog]
      const streakDays = calculateStreak(logs)
      const lifetimeGrams = logs.reduce((sum, log) => sum + log.gramsSaved, 0)
      
      const state: AppState = {
        logs,
        streakDays,
        lifetimeGrams,
        displayName: get().displayName,
      }
      
      set(state)
      saveState(state)
      
      return { gramsSaved, habitName: habit.name }
    },
    
    updateDisplayName: (name: string) => {
      const state: AppState = {
        logs: get().logs,
        streakDays: get().streakDays,
        lifetimeGrams: get().lifetimeGrams,
        displayName: name,
      }
      set({ displayName: name })
      saveState(state)
    },
    
    clearAllData: () => {
      clearStorage()
      set(initialState)
    },
  }
})
