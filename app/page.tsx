import { PostFeed } from "@/components/post-feed"

async function getPosts() {
  try {
    // Replace with your actual API endpoint
    const res = await fetch("https://dummyjson.com/posts", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!res.ok) {
      throw new Error("Failed to fetch posts")
    }

    const data = await res.json()
      return data.posts
    } catch (error) {
      console.error(error)
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

