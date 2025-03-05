import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Share } from "lucide-react"
import { fetchPostById } from "@/lib/api"

interface PostDetailProps {
  postId: number
}

export default async function PostDetail({ postId }: PostDetailProps) {
  const post = await fetchPostById(postId)

  if (!post) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Post not found</p>
      </div>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center gap-4 p-6">
        <Link href={`/users/${post.userId}`} className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={`https://robohash.org/${post.userId}`}
              alt={`User ${post.userId}`}
            />
            <AvatarFallback>{`U${post.userId}`}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">User {post.userId}</p>
            <p className="text-xs text-muted-foreground">
              {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "Recently"}
            </p>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <p className="whitespace-pre-line mb-6">{post.body}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-wrap items-center justify-between gap-4 border-t">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.reactions}</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ThumbsDown className="h-4 w-4" />
            <span>0</span>
          </Button>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share className="h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}