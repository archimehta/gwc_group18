"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import { useAppStore } from "@/lib/state"
import { HabitRow } from "@/components/HabitRow"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { formatGrams } from "@/lib/format"
import { Search } from "lucide-react"

function LogPageContent() {
  const initialize = useAppStore((state) => state.initialize)
  const habits = useAppStore((state) => state.habits)
  const addLog = useAppStore((state) => state.addLog)
  const [searchQuery, setSearchQuery] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const { toast } = useToast()

  useEffect(() => {
    initialize()
  }, [initialize])

  const filteredHabits = useMemo(() => {
    if (!searchQuery) return habits
    const query = searchQuery.toLowerCase()
    return habits.filter(habit => 
      habit.name.toLowerCase().includes(query)
    )
  }, [habits, searchQuery])

  const getQuantity = (habitId: string): number => {
    if (quantities[habitId] !== undefined) return quantities[habitId]
    // Prefill cold shower with 15
    if (habitId === 'cold-shower') return 15
    return 1
  }

  const handleQuantityChange = (habitId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [habitId]: quantity }))
  }

  const handleLog = (habitId: string) => {
    const quantity = getQuantity(habitId)
    const result = addLog(habitId, quantity)
    
    if (result) {
      toast({
        title: "Logged!",
        description: `${result.habitName} • ${formatGrams(result.gramsSaved)} saved`,
      })
      
      // Reset quantity to default after logging
      setQuantities(prev => {
        const newQuantities = { ...prev }
        if (habitId === 'cold-shower') {
          newQuantities[habitId] = 15
        } else {
          delete newQuantities[habitId]
        }
        return newQuantities
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Log Action</h1>
        <p className="text-muted-foreground text-lg">Track your eco-friendly actions</p>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search habits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredHabits.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="py-12 text-center text-muted-foreground">
              No habits found matching "{searchQuery}"
            </CardContent>
          </Card>
        ) : (
          filteredHabits.map((habit) => (
            <Card key={habit.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <HabitRow
                  habit={habit}
                  quantity={getQuantity(habit.id)}
                  onQuantityChange={(qty) => handleQuantityChange(habit.id, qty)}
                  onLog={() => handleLog(habit.id)}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
      <LogPageContent />
    </Suspense>
  )
}
