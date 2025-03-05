import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react"
import type { Post } from "@/lib/types"

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Link href={`/users/${post.userId}`} className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post.user?.image || `/placeholder.svg?height=40&width=40`}
              alt={post.user?.username || "User"}
            />
            <AvatarFallback>{post.user?.username?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.user?.username || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Link href={`/posts/${post.id}`} className="block">
          <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">{post.title}</h3>
          <p className="text-muted-foreground line-clamp-3">{post.body}</p>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-3">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsDown className="h-4 w-4" />
            <span>{post.dislikes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments?.length || 0}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

