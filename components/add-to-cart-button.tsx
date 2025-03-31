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
  const addToCart = useCartStore((state) => state.addToCart)

  const handleAddToCart = () => {
    addToCart({
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      imageUrl: book.imageUrl,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button onClick={handleAddToCart} disabled={added || book.stock <= 0} className="min-w-[150px]" size="lg">
      {added ? "Added to Cart" : "Add to Cart"}
    </Button>
  )
}

