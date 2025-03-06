"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("latest")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        // Fetch posts from DummyJSON API
        const limit = 10
        const skip = (currentPage - 1) * limit
        const url = `https://dummyjson.com/posts?limit=${limit}&skip=${skip}`

        const response = await fetch(url)
        const data = await response.json()

        // Fetch user details for each post
        const postsWithUsers = await Promise.all(
          data.posts.map(async (post: Post) => {
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

        // Sort posts based on selected option
        let sortedPosts = [...postsWithUsers]
        if (sortBy === "latest") {
          // No sorting needed as API returns latest first
        } else if (sortBy === "oldest") {
          sortedPosts.reverse()
        } else if (sortBy === "popular") {
          sortedPosts.sort((a, b) => b.reactions - a.reactions)
        }

        // Filter by tags if any are selected
        if (selectedTags.length > 0) {
          sortedPosts = sortedPosts.filter((post) => post.tags.some((tag) => selectedTags.includes(tag)))
        }

        setPosts(sortedPosts)
        setTotalPages(Math.ceil(data.total / limit))

        // Collect all unique tags
        const tags = new Set<string>()
        data.posts.forEach((post: Post) => {
          post.tags.forEach((tag) => tags.add(tag))
        })
        setAllTags(Array.from(tags))
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchPosts()
    }
  }, [currentPage, sortBy, selectedTags, user])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    setCurrentPage(1) // Reset to first page when filtering
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with filters */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Filter by Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl font-bold">Feed</h1>

            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
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
              <>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}

                {/* Pagination */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No posts found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or check back later</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

