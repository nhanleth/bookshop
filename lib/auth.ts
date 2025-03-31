"use server"

import { cookies } from "next/headers"
import { getUserByEmail } from "./data"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const user = await getUserByEmail(email)

  if (!user || user.password !== password) {
    return { error: "Invalid email or password" }
  }

  // In a real app, you would use a proper authentication system
  // This is a simplified version for demonstration purposes
  cookies().set(
    "user",
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    },
  )

  return { success: true, role: user.role }
}

export async function logout() {
  cookies().delete("user")
  return { success: true }
}

export async function signup(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return { error: "Email already in use" }
  }

  // In a real app, you would create a new user in the database
  // For this demo, we'll just return success
  return { success: true }
}

// Fix the getSession function to avoid redirects
export async function getSession() {
  const userCookie = cookies().get("user")?.value
  if (!userCookie) return null

  try {
    return JSON.parse(userCookie)
  } catch (error) {
    return null
  }
}

// Modified to return a boolean instead of redirecting
export async function checkAuth() {
  const session = await getSession()
  return session !== null
}

// Modified to return a boolean instead of redirecting
export async function checkAdmin() {
  const session = await getSession()
  return session !== null && session.role === "admin"
}

// These functions are kept for compatibility but should be used carefully
export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    return null
  }
  return session
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== "admin") {
    return null
  }
  return session
}

