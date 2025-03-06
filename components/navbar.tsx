"use client"

import type React from "react"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Home, User, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"

export function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Don't show navbar on login/signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center font-bold text-xl mr-4">
          SocialApp
        </Link>
        <form onSubmit={handleSearch} className="flex-1 flex items-center max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <nav className="flex items-center space-x-2 ml-auto">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Button>
          </Link>
          {user && (
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
          )}
          <ThemeToggle />
          {user ? (
            <Button variant="ghost" size="icon" onClick={() => signOut()}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          ) : (
            <Button size="sm" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

