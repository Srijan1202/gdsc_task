import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getAuthStatus } from "@/lib/auth"
import PostDetail from "@/components/post-detail"
import CommentSection from "@/components/comment-section"
import { Skeleton } from "@/components/ui/skeleton"

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const isAuthenticated = await getAuthStatus()
  console.log(isAuthenticated)

  if (!isAuthenticated) {
    redirect("/login")
  }

  const postId = Number.parseInt(params.id)

  if (isNaN(postId)) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PostSkeleton />}>
        <PostDetail postId={postId} />
      </Suspense>
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentSection postId={postId} />
      </Suspense>
    </div>
  )
}

function PostSkeleton() {
  return (
    <div className="space-y-4 mb-8">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-40 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  )
}

function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-40" />
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
    </div>
  )
}

