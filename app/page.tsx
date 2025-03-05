import { PostFeed } from "@/components/post-feed"

async function getPosts() {
  try {
    // Replace with your actual API endpoint
    const res = await fetch("https://your-api.com/posts", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!res.ok) {
      throw new Error("Failed to fetch posts")
    }

    const data = await res.json()

    // Ensure each post has a valid createdAt field
    return data.map((post: any) => ({
      ...post,
      // If createdAt is missing or invalid, use current date
      createdAt: post.createdAt || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching posts:", error)
    return [] // Return empty array on error
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

