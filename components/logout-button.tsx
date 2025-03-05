"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { clearSessionCookie } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      // Sign out from Firebase
      await signOut(auth)

      // Clear the session cookie
      await clearSessionCookie()

      // Refresh the router to update authentication state
      router.refresh()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} variant="outline" disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </Button>
  )
}

