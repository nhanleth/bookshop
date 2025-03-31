"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAllWishlists, getAllUsers, getBooks } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Search, Eye, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function AdminWishlistsPage() {
  const [wishlists, setWishlists] = useState([])
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWishlist, setSelectedWishlist] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const wishlistsData = await getAllWishlists()
        const usersData = await getAllUsers()
        const booksData = await getBooks()
        setWishlists(wishlistsData)
        setUsers(usersData)
        setBooks(booksData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Get user details for a wishlist
  const getUserDetails = (userId) => {
    return users.find((user) => user.id === userId)
  }

  // Get book details for a wishlist
  const getBookDetails = (bookId) => {
    return books.find((book) => book.id === bookId)
  }

  const handleDeleteWishlist = (wishlistId) => {
    // In a real app, this would call an API endpoint
    setWishlists(wishlists.filter((wishlist) => wishlist.id !== wishlistId))
    toast.success("Wishlist item deleted successfully")
  }

  // Group wishlists by user
  const wishlistsByUser = wishlists.reduce((acc, wishlist) => {
    const userId = wishlist.userId
    if (!acc[userId]) {
      acc[userId] = []
    }
    acc[userId].push(wishlist)
    return acc
  }, {})

  // Filter wishlists by search query
  const filteredWishlistsByUser = Object.entries(wishlistsByUser).filter(([userId, _]) => {
    const user = getUserDetails(userId)
    return (
      user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wishlists</h1>
          <p className="text-muted-foreground">Loading wishlist data...</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Wishlists</h1>
        <p className="text-muted-foreground">View and manage user wishlists</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredWishlistsByUser.map(([userId, userWishlists]) => {
          const user = getUserDetails(userId)
          return (
            <div key={userId} className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-3">
                <h3 className="font-medium">
                  {user?.name || `User #${userId}`} ({userWishlists.length} items)
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/20">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Added On</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userWishlists.map((wishlist) => {
                      const book = getBookDetails(wishlist.productId)
                      return (
                        <tr key={wishlist.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-8 relative bg-muted rounded overflow-hidden">
                                <Image
                                  src={book?.imageUrl || "/placeholder.svg"}
                                  alt={book?.title || "Book"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <Link
                                  href={`/admin/products/${wishlist.productId}`}
                                  className="font-medium hover:underline"
                                >
                                  {book?.title || `Product #${wishlist.productId}`}
                                </Link>
                                <p className="text-sm text-muted-foreground">{book?.author}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{new Date(wishlist.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/books/${wishlist.productId}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Link>
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this wishlist item.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteWishlist(wishlist.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}

        {filteredWishlistsByUser.length === 0 && (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No wishlist items found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

