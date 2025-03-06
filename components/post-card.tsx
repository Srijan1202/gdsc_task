import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { formatDate, truncateText } from "@/lib/utils"

interface PostCardProps {
  post: {
    id: number
    title: string
    body: string
    userId: number
    tags: string[]
    reactions: object
    user?: {
      id: number
      username: string
      image?: string
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
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
      <CardContent className="p-4 pt-0">
        <Link href={`/posts/${post.id}`}>
          <h3 className="text-xl font-bold mb-2 hover:underline">{post.title}</h3>
        </Link>
        <p className="text-muted-foreground mb-4">{truncateText(post.body, 150)}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags.map((tag) => (
            <Link href={`/tags/${tag}`} key={tag}>
              <Badge variant="secondary" className="hover:bg-secondary/80">
                #{tag}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{post.reactions.likes}</span>
          </Button>
          <Link href={`/posts/${post.id}`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>Comments</span>
            </Button>
          </Link>
        </div>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

