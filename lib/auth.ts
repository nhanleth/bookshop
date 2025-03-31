"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
// Updated auth.ts - Changed to use API for authentication instead of local authentication
// Improved error handling to show detailed error messages
// Added additional debugging for API connections
// Added redirect to homepage after successful logout

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    // Log the API URL for debugging
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`;
    console.log("Attempting to connect to API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Explicitly request JSON response
      },
      body: JSON.stringify({ email, password }),
    });

    // Check response type before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // If not JSON, get the text content for debugging
      const textResponse = await response.text();
      console.error("API returned non-JSON response:", textResponse.substring(0, 500)); // Log first 500 chars
      return { 
        error: `API returned non-JSON response (${contentType || 'unknown content type'}). Please check the API URL and server configuration.` 
      };
    }

    const data = await response.json();

    if (!response.ok) {
      // Return the specific error message from the API
      if (data.error) {
        return { error: data.error };
      }
      
      // If there are validation errors, format them
      if (data.errors) {
        const errorMessages = Object.values(data.errors).flat();
        return { error: errorMessages.join('. ') };
      }
      
      return { error: 'Login failed: ' + (response.statusText || 'Unknown error') };
    }

    // Store user data in cookie
    const cookieStore = await cookies();
    cookieStore.set(
      "user",
      JSON.stringify({
        id: data.id || 'unknown',
        name: data.name,
        email: email,
        role: data.role,
        token: data.token
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )

    return { success: true, role: data.role }
  } catch (error) {
    console.error("Login error:", error);
    // Return more specific error message
    return { error: `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("user")
  
  // Redirect to homepage after successful logout
  redirect("/")
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
    // Log the API URL for debugging
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/register`;
    console.log("Attempting to connect to API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Explicitly request JSON response
      },
      body: JSON.stringify({ 
        name, 
        email, 
        password,
        password_confirmation: confirmPassword 
      }),
    });

    // Check response type before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // If not JSON, get the text content for debugging
      const textResponse = await response.text();
      console.error("API returned non-JSON response:", textResponse.substring(0, 500)); // Log first 500 chars
      return { 
        error: `API returned non-JSON response (${contentType || 'unknown content type'}). Please check the API URL and server configuration.` 
      };
    }

    const data = await response.json();

    if (!response.ok) {
      // Return the specific error message from the API
      if (data.error) {
        return { error: data.error };
      }
      
      // If there are validation errors, format them
      if (data.errors) {
        const errorMessages = Object.values(data.errors).flat();
        return { error: errorMessages.join('. ') };
      }
      
      return { error: 'Registration failed: ' + (response.statusText || 'Unknown error') };
    }

    // Upon successful registration, we can either log the user in automatically or redirect to login
    return { success: true }
  } catch (error) {
    console.error("Registration error:", error);
    // Return more specific error message
    return { error: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}

// Fix the getSession function to avoid redirects
export async function getSession() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value
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

