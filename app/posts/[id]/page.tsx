"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

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

interface Comment {
  id: number
  body: string
  postId: number
  user: {
    id: number
    username: string
    image?: string
  }
}

export default function PostPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setIsLoading(true)
      try {
        // Fetch post
        const postResponse = await fetch(`https://dummyjson.com/posts/${params.id}`)
        const postData = await postResponse.json()

        // Fetch user details for the post
        const userResponse = await fetch(`https://dummyjson.com/users/${postData.userId}`)
        const userData = await userResponse.json()

        setPost({
          ...postData,
          user: {
            id: userData.id,
            username: userData.username,
            image: userData.image,
          },
        })

        // Fetch comments
        const commentsResponse = await fetch(`https://dummyjson.com/comments/post/${params.id}`)
        const commentsData = await commentsResponse.json()

        // Fetch user details for each comment
        const commentsWithUsers = await Promise.all(
          commentsData.comments.map(async (comment: any) => {
            // DummyJSON API doesn't provide user details for comments,
            // so we'll use a random user for demonstration
            const randomUserId = Math.floor(Math.random() * 10) + 1
            const commentUserResponse = await fetch(`https://dummyjson.com/users/${randomUserId}`)
            const commentUserData = await commentUserResponse.json()

            return {
              ...comment,
              user: {
                id: commentUserData.id,
                username: commentUserData.username,
                image: commentUserData.image,
              },
            }
          }),
        )

        setComments(commentsWithUsers)
      } catch (error) {
        console.error("Error fetching post:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchPostAndComments()
    }
  }, [params.id, user])

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

        {isLoading ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : post ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 p-6">
                <Link href={`/users/${post.userId}`}>
                  <Avatar>
                    <AvatarImage
                      src={post.user?.image || `/placeholder.svg?height=40&width=40`}
                      alt={post.user?.username || "User"}
                    />
                    <AvatarFallback>{post.user?.username?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col">
                  <Link href={`/users/${post.userId}`} className="font-semibold hover:underline">
                    {post.user?.username || "User"}
                  </Link>
                  <time className="text-xs text-muted-foreground">{formatDate(new Date().toISOString())}</time>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                <p className="text-muted-foreground mb-6 whitespace-pre-line">{post.body}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Link href={`/tags/${tag}`} key={tag}>
                      <Badge variant="secondary" className="hover:bg-secondary/80">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between border-b">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.reactions}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{comments.length}</span>
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </CardFooter>
            </Card>

            {/* Comments section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardHeader className="flex flex-row items-center gap-4 p-4">
                        <Link href={`/users/${comment.user.id}`}>
                          <Avatar>
                            <AvatarImage
                              src={comment.user?.image || `/placeholder.svg?height=40&width=40`}
                              alt={comment.user?.username || "User"}
                            />
                            <AvatarFallback>{comment.user?.username?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex flex-col">
                          <Link href={`/users/${comment.user.id}`} className="font-semibold hover:underline">
                            {comment.user?.username || "User"}
                          </Link>
                          <time className="text-xs text-muted-foreground">{formatDate(new Date().toISOString())}</time>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-muted-foreground">{comment.body}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No comments yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Post not found</h3>
            <p className="text-muted-foreground">The post you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              Go back to home
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

