"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getAllPayments, getAllOrders } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([])
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPayment, setSelectedPayment] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const paymentsData = await getAllPayments()
        const ordersData = await getAllOrders()
        setPayments(paymentsData)
        setOrders(ordersData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Get order details for a payment
  const getOrderDetails = (orderId) => {
    return orders.find((order) => order.id === orderId)
  }

  const filteredPayments = payments.filter(
    (payment) =>
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Loading payment data...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">View and manage payment transactions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Payment ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-t">
                  <td className="px-4 py-3 text-sm">#{payment.id}</td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/admin/orders/${payment.orderId}`} className="text-primary hover:underline">
                      #{payment.orderId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">${payment.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge
                      variant={
                        payment.status === "paid" ? "success" : payment.status === "pending" ? "outline" : "destructive"
                      }
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedPayment(payment)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Payment Details</DialogTitle>
                          <DialogDescription>Detailed information about this payment.</DialogDescription>
                        </DialogHeader>
                        {selectedPayment && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Payment ID</h4>
                                <p>#{selectedPayment.id}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Order ID</h4>
                                <p>#{selectedPayment.orderId}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Amount</h4>
                                <p>${selectedPayment.amount.toFixed(2)}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                <Badge
                                  variant={
                                    selectedPayment.status === "paid"
                                      ? "success"
                                      : selectedPayment.status === "pending"
                                        ? "outline"
                                        : "destructive"
                                  }
                                >
                                  {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                                <p>{new Date(selectedPayment.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Time</h4>
                                <p>{new Date(selectedPayment.createdAt).toLocaleTimeString()}</p>
                              </div>
                            </div>

                            {/* Order details */}
                            {getOrderDetails(selectedPayment.orderId) && (
                              <div className="mt-4 pt-4 border-t">
                                <h4 className="font-medium mb-2">Order Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                                    <p>User #{getOrderDetails(selectedPayment.orderId).userId}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Order Status</h4>
                                    <Badge
                                      variant={
                                        getOrderDetails(selectedPayment.orderId).status === "delivered"
                                          ? "success"
                                          : getOrderDetails(selectedPayment.orderId).status === "shipped"
                                            ? "default"
                                            : getOrderDetails(selectedPayment.orderId).status === "processing"
                                              ? "outline"
                                              : getOrderDetails(selectedPayment.orderId).status === "cancelled"
                                                ? "destructive"
                                                : "secondary"
                                      }
                                    >
                                      {getOrderDetails(selectedPayment.orderId).status.charAt(0).toUpperCase() +
                                        getOrderDetails(selectedPayment.orderId).status.slice(1)}
                                    </Badge>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Order Total</h4>
                                    <p>${getOrderDetails(selectedPayment.orderId).total.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Order Date</h4>
                                    <p>
                                      {new Date(
                                        getOrderDetails(selectedPayment.orderId).createdAt,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end mt-4">
                              <Button variant="outline" asChild>
                                <Link href={`/admin/orders/${selectedPayment.orderId}`}>View Order Details</Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

