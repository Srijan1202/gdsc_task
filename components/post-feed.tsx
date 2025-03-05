import { PostCard } from "./post-card"
import type { Post } from "@/lib/types"

interface PostFeedProps {
  posts: Post[]
}

export function PostFeed({ posts }: PostFeedProps) {
  if (!posts || posts.length === 0) {
    return <div className="text-center py-10">No posts found</div>
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}