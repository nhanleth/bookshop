"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  fullWidth?: boolean
}

export function LogoutButton({ 
  variant = "outline", 
  size = "sm", 
  className = "",
  fullWidth = false 
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        // Redirect to homepage after successful logout
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  )
} 