import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"
import { fetchPostsByUserId } from "@/lib/api"

interface UserPostsProps {
  userId: string
}

export default async function UserPosts({ userId }: UserPostsProps) {
  const posts = await fetchPostsByUserId(userId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts</CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">This user hasn't posted anything yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

