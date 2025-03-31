"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Check if it's a timeout error
      const isTimeoutError = this.state.error?.message.includes("timeout") || this.state.error?.message.includes("504")

      return (
        <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
          <AlertTriangle className="h-16 w-16 text-amber-500 mb-6" />
          <h1 className="text-4xl font-bold mb-2">{isTimeoutError ? "Request Timeout" : "Something went wrong"}</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            {isTimeoutError
              ? "Our server is taking longer than expected to respond. This might be due to high traffic or temporary network issues."
              : "We encountered an unexpected error while processing your request."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => window.location.reload()}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

