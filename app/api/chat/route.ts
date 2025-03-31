import { NextResponse } from "next/server"
import { getChatbotResponse } from "@/lib/chatbot"
import { getFallbackResponse } from "@/lib/chatbot-fallback"

export async function POST(request: Request) {
  try {
    // Set a timeout for the entire request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid request. Message is required." }, { status: 400 })
    }

    try {
      // Try to get the AI response with the abort signal
      const response = await getChatbotResponse(message)
      clearTimeout(timeoutId)

      return NextResponse.json(response)
    } catch (error) {
      console.error("Error in chat API:", error)

      // If the request was aborted due to timeout, use fallback
      if (error instanceof Error && error.name === "AbortError") {
        const fallbackResponse = await getFallbackResponse(message)
        return NextResponse.json({
          response: fallbackResponse,
          fallback: true,
        })
      }

      // For other errors, also use fallback
      const fallbackResponse = await getFallbackResponse(message)
      return NextResponse.json({
        response: fallbackResponse,
        fallback: true,
      })
    }
  } catch (error) {
    console.error("Unhandled error in chat API:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    )
  }
}

