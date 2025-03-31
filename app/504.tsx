"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export default function TimeoutErrorPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <Clock className="h-16 w-16 text-amber-500 mb-6" />
      <h1 className="text-4xl font-bold mb-2">Request Timeout</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Our server is taking longer than expected to respond. This might be due to high traffic or temporary network
        issues.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => window.location.reload()}>Try Again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}

