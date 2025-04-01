"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useWishlistStore } from "@/lib/wishlist"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart"
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { CartItem } from "@/lib/db-schema"

// Define the wishlist item type
interface WishlistItem {
  id: string
  title: string
  author: string
  price: number
  imageUrl: string
}

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false)
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({})
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore()
  const { addToCart } = useCartStore()

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      setLoadingItems(prev => ({ ...prev, [item.id]: true }))
      
      await addToCart({
        bookId: item.id,
        title: item.title,
        author: item.author,
        price: item.price,
        imageUrl: item.imageUrl,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id]: false }))
    }
  }

  if (!mounted) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-6">Save items you love to your wishlist and revisit them anytime.</p>
          <Button asChild>
            <Link href="/books">Browse Books</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={() => clearWishlist()}>
          Clear Wishlist
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
            <div className="w-20 h-28 relative bg-muted rounded overflow-hidden flex-shrink-0">
              <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
            </div>

            <div className="flex-1 flex flex-col">
              <div>
                <h3 className="font-semibold">
                  <Link href={`/books/${item.id}`} className="hover:underline">
                    {item.title}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">{item.author}</p>
                <p className="font-medium mt-1">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <Button 
                  size="sm" 
                  onClick={() => handleAddToCart(item)} 
                  disabled={loadingItems[item.id]}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {loadingItems[item.id] ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => removeFromWishlist(item.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link href="/books" className="flex items-center">
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  )
}

