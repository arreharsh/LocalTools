"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <>
      {/* DESKTOP */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="hidden md:flex h-9 w-9 rounded-lg items-center justify-center hover:bg-primary/15 transition"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>

      {/* MOBILE (toggle switch style) */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="md:hidden relative w-13 h-7 rounded-full bg-foreground/10 transition flex items-center dark:bg-green-500"
        aria-label="Toggle theme"
      >
        <span
          className={`
            absolute left-1 right-1 top-1 h-5 w-5 rounded-full bg-background shadow
            transition-transform duration-200
            ${isDark ? "translate-x-6 bg-white/98" : "translate-x-0"}
          `}  
        />
        <span className="absolute right-1 text-muted-foreground/60">
          <Moon className={`h-4 w-4 ${isDark ? "hidden" : ""}`} />
        </span>
      </button>
    </>
  )
}
