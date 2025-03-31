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

  return NextResponse.next()
}

// Configure which paths should use this middleware
export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}

