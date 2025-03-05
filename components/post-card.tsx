import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare } from "lucide-react"
import type { Post } from "@/lib/types"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (dateValue: string | undefined): string => {
    try {
      if (!dateValue) return "Recently"
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return "Recently"
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Recently"
    }
  }

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={`https://robohash.org/${post.userId}`} alt={`User ${post.userId}`} />
            <AvatarFallback>{`U${post.userId}`}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              User {post.userId} • {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">{post.body}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <ThumbsUp className="h-4 w-4" />
            {/* <span>{post.reactions}</span> */}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>0</span>
          </Button>
        </div>
        <Link href={`/posts/${post.id}`}>
          <Button variant="outline" size="sm">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}