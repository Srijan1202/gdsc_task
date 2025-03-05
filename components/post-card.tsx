import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare } from "lucide-react"

interface PostCardProps {
  post: {
    id: number
    title: string
    content: string
    createdAt: string | number | Date // Could be various formats
    author: {
      name: string
      avatar?: string
    }
    likes: number
    comments: number
  }
}

export function PostCard({ post }: PostCardProps) {
  // Safely format the date
  const formatDate = (dateValue: string | number | Date): string => {
    try {
      // If it's a string that looks like a timestamp, convert it to a number
      if (typeof dateValue === "string" && !isNaN(Number(dateValue))) {
        dateValue = Number(dateValue)
      }

      const date = new Date(dateValue)

      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
        return "Invalid date"
      }

      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Unknown date"
    }
  }

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {post.author.name} • {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments}</span>
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

