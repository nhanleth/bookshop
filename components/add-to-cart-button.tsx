"use client"

import { useState } from "react"
import type { Book } from "@/lib/db-schema"
import { useCartStore } from "@/lib/cart"
import { Button } from "@/components/ui/button"

interface AddToCartButtonProps {
  book: Book
}

export function AddToCartButton({ book }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)
  const addToCart = useCartStore((state) => state.addToCart)

  const handleAddToCart = async () => {
    try {
      setLoading(true)
      
      await addToCart({
        bookId: String(book.id),
        title: book.title || book.name || "",
        author: book.author || "Unknown Author",
        price: typeof book.price === 'number' ? book.price : 0,
        imageUrl: book.imageUrl || book.image || book.thumbnail || "",
      })
      
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  // Check if book is in stock using either stock or quantity field
  const isInStock = () => {
    if (book.stock !== undefined && book.stock > 0) {
      return true;
    }
    if (book.quantity !== undefined && book.quantity > 0) {
      return true;
    }
    return false;
  }

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={added || loading || !isInStock()} 
      className="min-w-[150px]" 
      size="lg"
    >
      {loading ? "Adding..." : added ? "Added to cart" : "Add to cart"}
    </Button>
  )
}

