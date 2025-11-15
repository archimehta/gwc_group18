"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/state"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/StatCard"
import { useToast } from "@/components/ui/use-toast"
import { gramsToKg } from "@/lib/format"
import { Edit2, Save, X } from "lucide-react"
import { Flame, Leaf } from "lucide-react"

export default function ProfilePage() {
  const initialize = useAppStore((state) => state.initialize)
  const displayName = useAppStore((state) => state.displayName)
  const updateDisplayName = useAppStore((state) => state.updateDisplayName)
  const streakDays = useAppStore((state) => state.streakDays)
  const lifetimeGrams = useAppStore((state) => state.lifetimeGrams)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(displayName)
  const { toast } = useToast()

  useEffect(() => {
    initialize()
    setNameInput(displayName)
  }, [initialize, displayName])

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateDisplayName(nameInput.trim())
      setIsEditingName(false)
      toast({
        title: "Name updated",
        description: "Your display name has been updated",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'EH'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Profile</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 max-w-xs"
                    placeholder="Enter your name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName()
                      if (e.key === 'Escape') {
                        setNameInput(displayName)
                        setIsEditingName(false)
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveName}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setNameInput(displayName)
                        setIsEditingName(false)
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{displayName}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingName(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit name
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
