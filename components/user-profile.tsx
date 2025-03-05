import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchUserById } from "@/lib/api"

interface UserProfileProps {
  userId: number
}

export default async function UserProfile({ userId }: UserProfileProps) {
  const user = await fetchUserById(userId)

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">User not found</p>
      </div>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center gap-6 p-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.image || `/placeholder.svg?height=80&width=80`} alt={user.username || "User"} />
          <AvatarFallback className="text-2xl">{user.username?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.username || "Anonymous"}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {user.company && (
            <p className="text-sm mt-1">
              Works at <span className="font-medium">{user.company.name}</span>
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {user.bio && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p>{user.bio}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.address && (
            <div>
              <h2 className="text-sm font-semibold mb-1">Location</h2>
              <p className="text-sm text-muted-foreground">
                {user.address.city}, {user.address.state}
              </p>
            </div>
          )}
          {user.website && (
            <div>
              <h2 className="text-sm font-semibold mb-1">Website</h2>
              <a
                href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {user.website}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

