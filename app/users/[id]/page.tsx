import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getAuthStatus } from "@/lib/auth"
import UserProfile from "@/components/user-profile"
import UserPosts from "@/components/user-posts"
import { Skeleton } from "@/components/ui/skeleton"

interface UserPageProps {
  params: {
    id: string
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const isAuthenticated = await getAuthStatus()

  if (!isAuthenticated) {
    redirect("/login")
  }

  const userId = Number.parseInt(params.id)

  if (isNaN(userId)) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile userId={userId} />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <UserPosts userId={userId} />
      </Suspense>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  )
}

function PostsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-40" />
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
    </div>
  )
}

