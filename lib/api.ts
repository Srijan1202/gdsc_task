import type { Post, Comment, User } from "@/lib/types"

const API_URL = "https://dummyjson.com"

export async function fetchPosts(): Promise<{ posts: Post[] }> {
  const response = await fetch(`${API_URL}/posts?limit=100`)
  if (!response.ok) {
    throw new Error("Failed to fetch posts")
  }
  return response.json()
}

export async function fetchPostById(id: number): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch post")
  }
  return response.json()
}

export async function fetchCommentsByPostId(postId: number): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`)
  if (!response.ok) {
    throw new Error("Failed to fetch comments")
  }
  const data = await response.json()
  return data.comments
}

export async function fetchUserById(id: number): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }
  return response.json()
}

export async function fetchPostsByUserId(userId: number): Promise<Post[]> {
  const response = await fetch(`${API_URL}/users/${userId}/posts`)
  if (!response.ok) {
    throw new Error("Failed to fetch user posts")
  }
  const data = await response.json()
  return data.posts
}

export async function addComment(postId: number, commentData: Partial<Comment>): Promise<Comment> {
  // In a real app, this would be a POST request to your API
  // For this demo, we'll simulate adding a comment
  const newComment: Comment = {
    id: Math.floor(Math.random() * 1000),
    postId,
    body: commentData.body || "",
    userId: commentData.userId || "",
    user: {
      id: commentData.userId || "",
      username: commentData.username || "Anonymous",
    },
    createdAt: new Date().toISOString(),
  }

  return newComment
}

