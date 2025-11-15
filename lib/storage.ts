const STORAGE_KEY = 'ecotrack:v1'

export type LogEntry = {
  id: string
  habitId: string
  quantity: number
  gramsSaved: number
  dateISO: string
}

export type AppState = {
  logs: LogEntry[]
  streakDays: number
  lifetimeGrams: number
  displayName: string
}

export function loadState(): Partial<AppState> {
  if (typeof window === 'undefined') return {}
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Failed to load state:', error)
    return {}
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save state:', error)
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear data:', error)
  }
}
