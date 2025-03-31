"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

// Mock data for client-side rendering
const mockOrders = [
  {
    id: "1",
    status: "delivered",
    createdAt: new Date("2023-01-15"),
    items: [
      {
        bookId: "1",
        title: "The Great Gatsby",
        quantity: 1,
        price: 12.99,
      },
      {
        bookId: "3",
        title: "Sapiens: A Brief History of Humankind",
        quantity: 1,
        price: 19.99,
      },
    ],
    total: 32.98,
  },
  {
    id: "2",
    status: "shipped",
    createdAt: new Date("2023-02-20"),
    items: [
      {
        bookId: "4",
        title: "The Hobbit",
        quantity: 1,
        price: 15.99,
      },
    ],
    total: 15.99,
  },
]

export default function AccountPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [session, setSession] = useState(null)
  const [orders, setOrders] = useState(mockOrders)

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to check auth status
        // For demo purposes, we'll simulate a successful auth after a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, let's assume the user is authenticated
        setIsAuthenticated(true)
        setSession({
          id: "2",
          name: "John Doe",
          email: "john@example.com",
        })

        // In a real app, we would fetch the user's orders here
        setOrders(mockOrders)
      } catch (error) {
        console.error("Authentication error:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to view your account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              You need to be logged in to access your account information and order history.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground">Manage your account settings and view orders</p>
        </div>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Order History</h2>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "success"
                              : order.status === "shipped"
                                ? "default"
                                : order.status === "processing"
                                  ? "outline"
                                  : order.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                          }
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.bookId} className="flex justify-between">
                              <div>
                                <span className="font-medium">{item.title}</span>
                                <span className="text-muted-foreground"> × {item.quantity}</span>
                              </div>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/account/orders/${order.id}`}>View Order Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Button asChild>
                  <Link href="/books">Browse Books</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{session?.name}</p>
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{session?.email}</p>
                  </div>
                </div>

                <Button variant="outline">Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Addresses</CardTitle>
                <CardDescription>Manage your shipping addresses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't added any addresses yet.</p>
                  <Button>Add Address</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

