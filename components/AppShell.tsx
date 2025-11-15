"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { EarthSticker } from "@/components/EarthSticker"

interface AppShellProps {
  children: ReactNode
}

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/log", icon: PlusCircle, label: "Log" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#fffaf0]">
      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="w-64 border-r bg-white shadow-sm flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-2">
              <EarthSticker size={48} animate={false} />
              <div>
                <h1 className="text-xl font-bold text-primary">EcoTrack</h1>
                <p className="text-xs text-muted-foreground">Small actions, visible impact.</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Desktop Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-8 py-10">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col min-h-screen pb-16">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <EarthSticker size={32} animate={false} />
              <span className="text-lg font-bold text-primary">EcoTrack</span>
            </div>
          </div>
        </header>

        {/* Mobile Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="px-4 py-6">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg md:hidden">
          <div className="grid grid-cols-3 h-16">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
