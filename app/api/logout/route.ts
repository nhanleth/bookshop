import { logout } from "@/lib/auth"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  await logout()
  
  // Return a simple success response that the client-side component can process
  return new Response(JSON.stringify({ 
    success: true,
    message: "Logged out successfully" 
  }), {
    headers: { "Content-Type": "application/json" },
  })
}

