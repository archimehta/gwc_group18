export type Habit = {
  id: string
  name: string
  unit: 'mile' | 'trip' | 'meal' | 'day' | 'item' | 'load' | 'minute'
  gramsPerUnit: number
  icon: string
  color?: string
}

export const HABITS: Habit[] = [
  {
    id: 'walk-mile',
    name: 'Walked instead of driving',
    unit: 'mile',
    gramsPerUnit: 404,
    icon: '🚶',
  },
  {
    id: 'bike-mile',
    name: 'Biked instead of driving',
    unit: 'mile',
    gramsPerUnit: 404,
    icon: '🚲',
  },
  {
    id: 'transit-trip',
    name: 'Took public transit',
    unit: 'trip',
    gramsPerUnit: 200,
    icon: '🚌',
  },
  {
    id: 'carpool-trip',
    name: 'Carpooled',
    unit: 'trip',
    gramsPerUnit: 150,
    icon: '🚗',
  },
  {
    id: 'vegetarian-meal',
    name: 'Ate a vegetarian meal',
    unit: 'meal',
    gramsPerUnit: 500,
    icon: '🥗',
  },
  {
    id: 'reusable-bottle',
    name: 'Used a reusable bottle',
    unit: 'day',
    gramsPerUnit: 82,
    icon: '🍼',
  },
  {
    id: 'air-dry-laundry',
    name: 'Air-dried laundry',
    unit: 'load',
    gramsPerUnit: 700,
    icon: '👕',
  },
  {
    id: 'unplug-electronics',
    name: 'Unplugged idle electronics',
    unit: 'item',
    gramsPerUnit: 50,
    icon: '🔌',
  },
  {
    id: 'cold-shower',
    name: '15-min cold shower',
    unit: 'minute',
    gramsPerUnit: 200,
    icon: '🚿',
  },
  {
    id: 'recycle',
    name: 'Recycled items',
    unit: 'item',
    gramsPerUnit: 150,
    icon: '♻️',
  },
]

export function getHabitById(id: string): Habit | undefined {
  return HABITS.find(h => h.id === id)
}
