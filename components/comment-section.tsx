"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { fetchCommentsByPostId, addComment } from "@/lib/api"
import type { Comment } from "@/lib/types"

interface CommentSectionProps {
  postId: number
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { user } = useAuth()

  useState(() => {
    const loadComments = async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchCommentsByPostId(postId)
        setComments(data)
      } catch (error) {
        console.error("Failed to fetch comments:", error)
        setError("Failed to load comments. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadComments()
  })

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const comment = await addComment(postId, {
        body: newComment,
        userId: user.uid,
        username: user.displayName || "Anonymous",
      })

      setComments([comment, ...comments])
      setNewComment("")
      setSuccess("Your comment has been added successfully.")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (error) {
      setError("There was an error adding your comment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <form onSubmit={handleSubmitComment} className="space-y-4">
              {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}
              {success && <div className="p-3 text-sm bg-green-500/10 text-green-600 rounded-md">{success}</div>}
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          ) : (
            <p className="text-center py-4">
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>{" "}
              to add a comment
            </p>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/4 bg-muted rounded" />
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-3/4 bg-muted rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center py-6 text-muted-foreground">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Link href={`/users/${comment.userId}`}>
                    <Avatar>
                      <AvatarImage
                        src={comment.user?.image || `/placeholder.svg?height=40&width=40`}
                        alt={comment.user?.username || "User"}
                      />
                      <AvatarFallback>{comment.user?.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Link href={`/users/${comment.userId}`} className="font-medium hover:underline">
                        {comment.user?.username || "Anonymous"}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.body}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

