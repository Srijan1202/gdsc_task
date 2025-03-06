"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { useRouter } from "next/navigation"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEWeJpJJbd1oB776GrgLnZ9xH-O2hADvc",
  authDomain: "gdsctask-33f30.firebaseapp.com",
  projectId: "gdsctask-33f30",
  storageBucket: "gdsctask-33f30.firebasestorage.app",
  messagingSenderId: "14004674816",
  appId: "1:14004674816:web:da0fbbe190b795067e93e5",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push("/")
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

