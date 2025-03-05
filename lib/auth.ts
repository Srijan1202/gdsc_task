"use server"

import { cookies } from "next/headers"

export async function getAuthStatus() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("session")

  return !!sessionCookie
}

export async function setSessionCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14, // 2 weeks
    path: "/",
  })
}

export async function clearSessionCookie() {
  const cookieStore = cookies()
  cookieStore.delete("session")
}