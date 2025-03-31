import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getSession()
  
  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: "Not authenticated" }),
      { status: 401, headers: { "content-type": "application/json" } }
    )
  }
  
  return NextResponse.json(session)
} 