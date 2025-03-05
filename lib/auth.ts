import { cookies } from "next/headers"

export async function getAuthStatus() {
  const cookieStore = await cookies(); // Await here
  const sessionCookie = await cookieStore.get("session"); // Await here too

  console.log("Session cookie:", sessionCookie); // Debugging log

  return !!sessionCookie; // Convert to boolean
}
