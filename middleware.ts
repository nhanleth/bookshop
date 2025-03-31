import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Set a longer timeout for API requests
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next()

    // Add headers to help with timeout handling
    response.headers.set("Connection-Timeout", "30000") // 30 seconds
    response.headers.set("Keep-Alive", "timeout=30") // 30 seconds
    response.headers.set("X-Accel-Buffering", "no") // Disable buffering for streaming responses

    return response
  }

  // Get the token from the cookies
  const token = request.cookies.get("user_token")?.value
  const userRole = request.cookies.get("user_role")?.value

  // Handle admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // If no token or not admin role, redirect to login
    if (!token || userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Handle authentication for protected routes
  // Add any other routes that require authentication here
  // const protectedRoutes = ['/profile', '/account']
  // if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && !token) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  return NextResponse.next()
}

// Configure which paths should use this middleware
export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}

