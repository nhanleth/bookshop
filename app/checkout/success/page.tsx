// Created: Checkout success page to display order confirmation
// Uses query parameter for order ID from the checkout process

"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getOrderById } from "@/lib/orders"
import { OrderResponse } from "@/lib/api-types"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const orderData = await getOrderById(Number(orderId))
        setOrder(orderData)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Could not load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <div className="text-center mb-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading order details...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : order ? (
        <div className="bg-muted/50 rounded-lg p-6">
          <div className="mb-4 pb-4 border-b">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Order #:</span>
              <span>{order.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Date:</span>
              <span>{new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="capitalize">{order.status}</span>
            </div>
          </div>

          {order.orderItems && order.orderItems.length > 0 ? (
            <div className="mb-4 pb-4 border-b">
              <h3 className="font-medium mb-3">Items:</h3>
              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <span>{item.product?.name || `Product #${item.product_id}`}</span>
                      <span className="text-muted-foreground"> × {item.quantity}</span>
                    </div>
                    <span>
                      ${item.product?.price ? (Number(item.product.price) * item.quantity).toFixed(2) : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${Number(order.total_price).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/account/orders">View All Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/books">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="mb-4">Your order has been confirmed, but no order details are available.</p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/account/orders">View All Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/books">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 