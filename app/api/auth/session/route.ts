import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log('Session API route called');
    const session = await getSession()
    
    console.log('API route /api/auth/session - session data:', session);
    
    if (!session) {
      console.log('No session found, returning 401');
      return new NextResponse(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: { "content-type": "application/json" } }
      )
    }
    
    // Ensure session has an ID property
    let responseSession = { ...session };
    
    // If session lacks id but has user with id, extract id to top level
    if (!responseSession.id && responseSession.user && responseSession.user.id) {
      responseSession.id = responseSession.user.id;
      console.log('Extracted user ID from nested user object:', responseSession.id);
    }
    
    console.log('Returning session with structure:', Object.keys(responseSession));
    // Return the full session object which includes id, name, email, role, token
    return NextResponse.json(responseSession)
  } catch (error) {
    console.error('Error in session API route:', error);
    return new NextResponse(
      JSON.stringify({ error: "Server error processing session" }),
      { status: 500, headers: { "content-type": "application/json" } }
    )
  }
} 