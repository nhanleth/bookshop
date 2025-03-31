"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Loader2, Trash, AlertTriangle } from "lucide-react"
import { getChatbotResponse } from "@/lib/chatbot"

type ChatMessage = {
  role: "user" | "assistant" | "system"
  content: string
  fallback?: boolean
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory")
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        setMessages(parsedMessages)
      } catch (error) {
        console.error("Error parsing saved chat history:", error)
        // Initialize with welcome message if there's an error
        setMessages([
          {
            role: "assistant",
            content:
              "Hello! I'm your LuzLit Bookshop consultant. I can recommend books based on your interests, answer questions about our catalog, or help you find your next great read. How can I help you today?",
          },
        ])
      }
    } else {
      // Initialize with welcome message if no saved history
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm your LuzLit Bookshop consultant. I can recommend books based on your interests, answer questions about our catalog, or help you find your next great read. How can I help you today?",
        },
      ])
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    // Client-side timeout to prevent UI from hanging
    const timeoutPromise = new Promise<{ error: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          error: "The request is taking longer than expected. I'll switch to a simpler mode to help you faster.",
        })
      }, 10000) // 10 seconds client-side timeout
    })

    try {
      // Race the actual request against the timeout
      const response = await Promise.race([getChatbotResponse(userMessage), timeoutPromise])

      if ("error" in response) {
        setMessages((prev) => [...prev, { role: "assistant", content: response.error }])
        setErrorCount((prev) => prev + 1)

        // If we've had multiple errors, add a system message suggesting simpler queries
        if (errorCount >= 2) {
          setMessages((prev) => [
            ...prev,
            {
              role: "system",
              content:
                "It seems we're experiencing some technical difficulties. Try asking simpler questions or browsing our collection directly.",
            },
          ])
        }
      } else {
        // Check if this was a fallback response
        if (response.fallback) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: response.response,
              fallback: true,
            },
          ])

          // Add a system message explaining the fallback mode
          if (errorCount === 0) {
            setMessages((prev) => [
              ...prev,
              {
                role: "system",
                content:
                  "I've switched to a simplified mode to provide faster responses. Some advanced features may be limited.",
              },
            ])
          }

          setErrorCount((prev) => prev + 1)
        } else {
          // Normal response
          setMessages((prev) => [...prev, { role: "assistant", content: response.response }])
          // Reset error count if we got a successful response
          setErrorCount(0)
        }
      }
    } catch (error) {
      console.error("Chatbot error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize for the technical difficulties. Let me try a simpler approach to help you find books.",
        },
      ])
      setErrorCount((prev) => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const clearChatHistory = () => {
    const welcomeMessage = {
      role: "assistant" as const,
      content:
        "Hello! I'm here to help you discover your next favorite book. What kind of books are you interested in today?",
    }
    setMessages([welcomeMessage])
    localStorage.setItem("chatHistory", JSON.stringify([welcomeMessage]))
    setErrorCount(0)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 shadow-lg"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 sm:w-96 md:w-[450px] h-[600px] shadow-lg flex flex-col z-50">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">LuzLit Assistant</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChatHistory}
                aria-label="Clear chat history"
                title="Clear chat history"
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <ScrollArea className="flex-1 p-4">
            <CardContent className="p-0 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : message.role === "system"
                        ? "justify-center"
                        : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.role === "system"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 flex items-center gap-2"
                          : message.fallback
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-muted"
                    }`}
                  >
                    {message.role === "system" && <AlertTriangle className="h-4 w-4" />}
                    {message.role === "assistant" || message.role === "system" ? (
                      <div dangerouslySetInnerHTML={{ __html: message.content }} />
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
          </ScrollArea>
          <CardFooter className="p-4 pt-2">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

