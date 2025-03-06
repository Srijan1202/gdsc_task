"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Tag } from "lucide-react"

interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: number
  user?: {
    id: number
    username: string
    image?: string
  }
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const tag = decodeURIComponent(params.tag)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchPostsByTag = async () => {
      setIsLoading(true)
      try {
        // Fetch all posts from DummyJSON API
        const response = await fetch(`https://dummyjson.com/posts?limit=100`)
        const data = await response.json()

        // Filter posts by tag
        const filteredPosts = data.posts.filter((post: Post) => post.tags.includes(tag))

        // Fetch user details for each post
        const postsWithUsers = await Promise.all(
          filteredPosts.map(async (post: Post) => {
            try {
              const userResponse = await fetch(`https://dummyjson.com/users/${post.userId}`)
              const userData = await userResponse.json()
              return {
                ...post,
                user: {
                  id: userData.id,
                  username: userData.username,
                  image: userData.image,
                },
              }
            } catch (error) {
              console.error("Error fetching user:", error)
              return post
            }
          }),
        )

        setPosts(postsWithUsers)
      } catch (error) {
        console.error("Error fetching posts by tag:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchPostsByTag()
    }
  }, [tag, user])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="flex items-center gap-2 mb-6">
          <Tag className="h-6 w-6" />
          <h1 className="text-3xl font-bold">#{tag}</h1>
        </div>

        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-20 w-full mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No posts found</h3>
            <p className="text-muted-foreground">There are no posts with the tag #{tag}</p>
          </div>
        )}
      </main>
    </div>
  )
}

