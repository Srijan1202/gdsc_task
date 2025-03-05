import { redirect } from "next/navigation"
import PostFeed from "@/components/post-feed"
import { getAuthStatus } from "@/lib/auth"

export default async function Home() {
  const isAuthenticated = await getAuthStatus()

  if (!isAuthenticated) {
    redirect("/login")
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Feed</h1>
      <PostFeed />
    </main>
  )
}

