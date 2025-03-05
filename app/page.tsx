import { PostFeed } from "@/components/post-feed"

async function getPosts() {
  try {
    const res = await fetch("https://dummyjson.com/posts?limit=100", {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error("Error fetching posts. Status:", res.status)
      return []
    }

    const data = await res.json()

    if (!data.posts) {
      console.error("Invalid response structure:", data)
      return []
    }

    return data.posts.map((post: any) => ({
      ...post,
      createdAt: post.createdAt || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
      <PostFeed posts={posts} />
    </main>
  )
}

