"use server"

import { cookies } from "next/headers"
import { getUserByEmail } from "./data"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const response = await fetch("https://luzlitapi.techzone.edu.vn/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Return the specific error message from the API if available
      if (data.error) return { error: data.error };
      if (data.message) return { error: data.message };
      if (typeof data === 'string') return { error: data };
      
      // Handle validation errors if they exist
      if (data.errors) {
        const errorMessages = Object.values(data.errors).flat();
        return { error: errorMessages.join(', ') };
      }
      
      // Fallback error based on HTTP status
      return { error: `Authentication failed (${response.status}: ${response.statusText})` };
    }

    // Store token and user data in cookies
    const cookieStore = await cookies();
    cookieStore.set(
      "user_token",
      data.token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, 
        path: "/",
      },
    )
    
    // Store user role in a separate cookie for client-side access if needed
    if (data.role) {
      cookieStore.set(
        "user_role",
        data.role,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        },
      )
    }
    
    // Store user name directly from the Laravel response
    if (data.name) {
      cookieStore.set(
        "user_name",
        data.name,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        },
      )
    }

    // Determine redirect path based on user role
    const redirectPath = data.role === 'admin' ? '/admin' : '/'
    return { success: true, redirect: redirectPath }
  } catch (error) {
    console.error("Login error:", error);
    // Return the actual error message for debugging
    return { error: `Login failed: ${error instanceof Error ? error.message : String(error)}` }
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("user_token");
  cookieStore.delete("user_role");
  cookieStore.delete("user_name");
  
  // Redirect to homepage after logout
  return { success: true, redirect: "/" }
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

  try {
    const response = await fetch("https://luzlitapi.techzone.edu.vn/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: confirmPassword
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Return the specific error message from the API if available
      if (data.error) return { error: data.error };
      if (data.message) return { error: data.message };
      if (typeof data === 'string') return { error: data };
      
      // Handle validation errors if they exist
      if (data.errors) {
        const errorMessages = Object.values(data.errors).flat();
        return { error: errorMessages.join(', ') };
      }
      
      // Fallback error based on HTTP status
      return { error: `Registration failed (${response.status}: ${response.statusText})` };
    }

    // Store token in cookies
    const cookieStore = await cookies();
    cookieStore.set(
      "user_token",
      data.token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, 
        path: "/",
      },
    )
    
    // Store user name in cookies
    cookieStore.set(
      "user_name",
      name,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, 
        path: "/",
      },
    )
    
    // Store user role if available
    if (data.role) {
      cookieStore.set(
        "user_role",
        data.role,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        },
      )
    }

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error);
    // Return the actual error message for debugging
    return { error: `Registration failed: ${error instanceof Error ? error.message : String(error)}` }
  }
}

// Fix the getSession function to avoid redirects
export async function getSession() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("user_token")?.value
  const userRole = cookieStore.get("user_role")?.value
  const userName = cookieStore.get("user_name")?.value
  if (!userToken) return null

  try {
    // Return session with user data from cookies
    return { 
      isAuthenticated: true, 
      token: userToken,
      role: userRole || undefined,
      name: userName || "User" // Use cookie value or fallback to "User"
    }
  } catch (error) {
    return null
  }
}

// Modified to return a boolean instead of redirecting
export async function checkAuth() {
  const session = await getSession()
  return session !== null
}

// Modified to check admin role with the stored cookie
export async function checkAdmin() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get("user_role")?.value
  return userRole === "admin"
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
  if (!session) {
    return null
  }
  
  const cookieStore = await cookies()
  const userRole = cookieStore.get("user_role")?.value
  if (userRole !== "admin") {
    return null
  }
  
  return session
}
