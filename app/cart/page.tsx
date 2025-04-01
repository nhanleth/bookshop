"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, ShoppingCart, ArrowRight, RefreshCw, Bug } from "lucide-react"
import { placeOrder } from "@/lib/orders"
import { toast } from "sonner"

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, clearCart, syncWithServer, debugSession, plusCartItem, minusCartItem } = useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isDebugging, setIsDebugging] = useState(false)
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState<string | null>(null)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      // Place order using the session-based auth
      const orderResult = await placeOrder()
      
      // If order was successful, redirect to success page
      if (orderResult) {
        router.push(`/checkout/success?orderId=${orderResult.id}`)
      } else {
        // If no result but no error thrown, it was likely an auth issue handled by placeOrder
        setIsCheckingOut(false)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("There was a problem processing your order")
      setIsCheckingOut(false)
    }
  }

  const handleSyncCart = async () => {
    setIsSyncing(true)
    try {
      await syncWithServer()
      toast.success("Cart synchronized with server")
    } catch (error) {
      console.error("Cart sync error:", error)
      toast.error("There was a problem synchronizing your cart")
    } finally {
      setIsSyncing(false)
    }
  }

  const handleDebugSession = async () => {
    setIsDebugging(true)
    try {
      await debugSession()
    } catch (error) {
      console.error("Debug error:", error)
    } finally {
      setIsDebugging(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any books to your cart yet.</p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/books">Browse Books</Link>
            </Button>
            <Button variant="outline" onClick={handleDebugSession} disabled={isDebugging}>
              {isDebugging ? "Debugging..." : "Debug Session"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSyncCart} 
                disabled={isSyncing}
                className="flex items-center gap-1"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Sync Cart
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDebugSession}
                disabled={isDebugging}
                className="flex items-center gap-1"
              >
                {isDebugging ? (
                  <>
                    <Bug className="h-4 w-4 animate-pulse" />
                    Debugging...
                  </>
                ) : (
                  <>
                    <Bug className="h-4 w-4" />
                    Debug
                  </>
                )}
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => clearCart()}
              className="text-muted-foreground"
            >
              Clear Cart
            </Button>
          </div>

          {cart.items.map((item) => (
            <div key={item.bookId} className="flex gap-4 p-4 border rounded-lg">
              <div className="w-20 h-28 relative bg-muted rounded overflow-hidden flex-shrink-0">
                <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              </div>

              <div className="flex-1 flex flex-col">
                <div>
                  <h3 className="font-semibold">
                    <Link href={`/books/${item.bookId}`} className="hover:underline">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.author}</p>
                  <p className="font-medium mt-1">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center mt-auto">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => {
                        setIsUpdatingQuantity(item.bookId);
                        minusCartItem(item.bookId).finally(() => setIsUpdatingQuantity(null));
                      }}
                      disabled={item.quantity <= 1 || isUpdatingQuantity === item.bookId}
                    >
                      {isUpdatingQuantity === item.bookId ? "..." : "-"}
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.bookId, Number.parseInt(e.target.value) || 1)}
                      className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => {
                        setIsUpdatingQuantity(item.bookId);
                        plusCartItem(item.bookId).finally(() => setIsUpdatingQuantity(null));
                      }}
                      disabled={isUpdatingQuantity === item.bookId}
                    >
                      {isUpdatingQuantity === item.bookId ? "..." : "+"}
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.bookId)}
                    className="text-muted-foreground hover:text-destructive ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/50 p-6 rounded-lg h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${(cart.total * 0.1).toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${(cart.total + cart.total * 0.1).toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
            {isCheckingOut ? "Processing..." : "Checkout"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="mt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/books">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

