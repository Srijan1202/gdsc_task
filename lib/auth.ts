import { cookies } from "next/headers"

export async function getAuthStatus() {
  const cookieStore = await cookies(); // Await the cookies() call
  const sessionCookie = cookieStore.get("session");

  // This is a simplified check - in a real app, you would verify the session token
  // with Firebase Admin SDK on the server
  return !!sessionCookie
}

