import { format, parseISO, startOfDay, differenceInDays, isSameDay } from 'date-fns'

export function gramsToKg(grams: number): string {
  const kg = Math.round(grams / 10) / 100 // Round to 1 decimal
  return `${kg.toFixed(1)} kg`
}

export function formatGrams(grams: number): string {
  if (grams >= 1000) {
    return gramsToKg(grams)
  }
  return `${Math.round(grams)} g`
}

export function pluralize(word: string, count: number): string {
  return count === 1 ? word : `${word}s`
}

export function formatDate(dateISO: string): string {
  return format(parseISO(dateISO), 'MMM d, yyyy')
}

export function isToday(dateISO: string): boolean {
  return isSameDay(parseISO(dateISO), new Date())
}

export function isYesterday(dateISO: string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(parseISO(dateISO), yesterday)
}
