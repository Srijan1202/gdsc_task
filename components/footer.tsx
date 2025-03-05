"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function Footer() {
  const { setTheme } = useTheme()
  const [showThemes, setShowThemes] = useState(false)

  const themes = [
    { name: "Light", value: "light" },
    { name: "Dark", value: "dark" },
    { name: "Serika", value: "theme-serika" },
    { name: "Dracula", value: "theme-dracula" },
    { name: "Coral", value: "theme-coral" },
  ]

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SocialApp. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => setShowThemes(!showThemes)}>
              Themes
            </Button>
            {showThemes && (
              <div className="absolute right-0 bottom-10 bg-background border rounded-md shadow-md p-2 w-32">
                {themes.map((theme) => (
                  <Button
                    key={theme.value}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setTheme(theme.value)
                      setShowThemes(false)
                    }}
                  >
                    {theme.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

