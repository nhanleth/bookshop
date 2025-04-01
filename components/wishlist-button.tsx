"use client"

import { useState, useEffect } from "react"
import type { Book } from "@/lib/db-schema"
import { useWishlistStore } from "@/lib/wishlist"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface WishlistButtonProps {
  book: Book
}

export function WishlistButton({ book }: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const [inWishlist, setInWishlist] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
    setInWishlist(isInWishlist(String(book.id)))
  }, [book.id, isInWishlist])

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(String(book.id))
      setInWishlist(false)
    } else {
      addToWishlist({
        id: String(book.id),
        title: book.title || book.name || "Untitled Book",
        author: book.author || "Unknown Author",
        price: typeof book.price === 'number' ? book.price : 0,
        imageUrl: book.imageUrl || book.image || book.thumbnail || "",
      })
      setInWishlist(true)
    }
  }

  if (!mounted) {
    return <Button variant="outline">Add to Wishlist</Button>
  }

  return (
    <Button
      variant="outline"
      onClick={handleToggleWishlist}
      className={inWishlist ? "text-red-500 hover:text-red-600" : ""}
    >
      <Heart className="mr-2 h-4 w-4" />
      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  )
}

