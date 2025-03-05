export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  likes: number
  dislikes?: number
  comments?: Comment[]
  createdAt: string
  user?: User
}

export interface Comment {
  id: number
  postId: number
  body: string
  userId: string
  user?: {
    id: string
    username: string
    image?: string
  }
  createdAt: string
}

export interface User {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  image?: string
  bio?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipcode?: string
  }
  company?: {
    name: string
    position?: string
  }
  website?: string
}

