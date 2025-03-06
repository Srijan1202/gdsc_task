"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Mail, MapPin, Calendar, LinkIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface User {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  image: string
  address?: {
    city: string
    state: string
  }
  birthDate?: string
  company?: {
    name: string
  }
  website?: string
}

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

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setIsLoading(true)
      try {
        // Fetch user
        const userResponse = await fetch(`https://dummyjson.com/users/${params.id}`)
        const userData = await userResponse.json()
        setProfileUser(userData)

        // Fetch user's posts
        const postsResponse = await fetch(`https://dummyjson.com/posts/user/${params.id}`)
        const postsData = await postsResponse.json()

        // Add user data to posts
        const postsWithUser = postsData.posts.map((post: Post) => ({
          ...post,
          user: {
            id: userData.id,
            username: userData.username,
            image: userData.image,
          },
        }))

        setUserPosts(postsWithUser)
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchUserAndPosts()
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
            <Card>
              <CardHeader className="flex flex-row items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        ) : profileUser ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profileUser.image || `/placeholder.svg?height=96&width=96`}
                    alt={profileUser.username}
                  />
                  <AvatarFallback>
                    {profileUser.firstName.charAt(0)}
                    {profileUser.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">
                    {profileUser.firstName} {profileUser.lastName}
                  </h1>
                  <p className="text-muted-foreground">@{profileUser.username}</p>
                  {profileUser.company && (
                    <p className="text-sm text-muted-foreground">Works at {profileUser.company.name}</p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profileUser.email}</span>
                  </div>
                  {profileUser.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {profileUser.address.city}, {profileUser.address.state}
                      </span>
                    </div>
                  )}
                  {profileUser.birthDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Born {formatDate(profileUser.birthDate)}</span>
                    </div>
                  )}
                  {profileUser.website && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={profileUser.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {profileUser.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Posts by {profileUser.firstName}</h2>
              {userPosts.length > 0 ? (
                userPosts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <p className="text-muted-foreground">This user hasn't posted anything yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">User not found</h3>
            <p className="text-muted-foreground">The user you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              Go back to home
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

