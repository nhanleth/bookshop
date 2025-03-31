"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getBooks, getAllCategories } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2, Eye, Search } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminProductsPage() {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBook, setSelectedBook] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("table") // "table" or "grid"
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBooks()
        const categoriesData = await getAllCategories()
        setBooks(data)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Loading book inventory...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your book inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="table" className="w-full sm:w-auto" onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "table" ? (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Author</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="h-10 w-8 relative bg-muted rounded overflow-hidden">
                        <Image
                          src={book.imageUrl || "/placeholder.svg"}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{book.title}</td>
                    <td className="px-4 py-3 text-sm">{book.author}</td>
                    <td className="px-4 py-3 text-sm">{book.category}</td>
                    <td className="px-4 py-3 text-sm">${book.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={book.stock > 10 ? "success" : book.stock > 0 ? "warning" : "destructive"}>
                        {book.stock > 0 ? book.stock : "Out of stock"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedBook(book)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Book Details</DialogTitle>
                              <DialogDescription>Detailed information about this book.</DialogDescription>
                            </DialogHeader>
                            {selectedBook && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="aspect-[3/4] relative bg-muted rounded-lg overflow-hidden">
                                  <Image
                                    src={selectedBook.imageUrl || "/placeholder.svg"}
                                    alt={selectedBook.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-xl font-bold">{selectedBook.title}</h3>
                                    <p className="text-muted-foreground">by {selectedBook.author}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                                      <p>{selectedBook.category}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                                      <p>${selectedBook.price.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Stock</h4>
                                      <p>{selectedBook.stock}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">ISBN</h4>
                                      <p>{selectedBook.isbn}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Published</h4>
                                      <p>{new Date(selectedBook.publishedDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Added</h4>
                                      <p>{new Date(selectedBook.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                    <p className="text-sm">{selectedBook.description}</p>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Categories</h4>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {selectedBook.categories?.map((categoryId) => {
                                        const category = categories.find((c) => c.id === categoryId)
                                        return (
                                          <span key={categoryId} className="px-2 py-1 text-xs bg-muted rounded-full">
                                            {category?.name || categoryId}
                                          </span>
                                        )
                                      }) || (
                                        <span className="px-2 py-1 text-xs bg-muted rounded-full">
                                          {selectedBook.category}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-4">
                                    <Button asChild variant="outline">
                                      <Link href={`/admin/products/${selectedBook.id}/edit`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                      </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                      <Link href={`/books/${selectedBook.id}`} target="_blank">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View on Site
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/products/${book.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
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
                                This action cannot be undone. This will permanently delete the book "{book.title}" from
                                your inventory.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              <div className="aspect-[3/4] relative">
                <Image src={book.imageUrl || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={`/admin/products/${book.id}/edit`}>
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary" onClick={() => setSelectedBook(book)}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Book Details</DialogTitle>
                          <DialogDescription>Detailed information about this book.</DialogDescription>
                        </DialogHeader>
                        {selectedBook && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="aspect-[3/4] relative bg-muted rounded-lg overflow-hidden">
                              <Image
                                src={selectedBook.imageUrl || "/placeholder.svg"}
                                alt={selectedBook.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-xl font-bold">{selectedBook.title}</h3>
                                <p className="text-muted-foreground">by {selectedBook.author}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                                  <p>{selectedBook.category}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                                  <p>${selectedBook.price.toFixed(2)}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Stock</h4>
                                  <p>{selectedBook.stock}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">ISBN</h4>
                                  <p>{selectedBook.isbn}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Published</h4>
                                  <p>{new Date(selectedBook.publishedDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Added</h4>
                                  <p>{new Date(selectedBook.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                <p className="text-sm">{selectedBook.description}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Categories</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedBook.categories?.map((categoryId) => {
                                    const category = categories.find((c) => c.id === categoryId)
                                    return (
                                      <span key={categoryId} className="px-2 py-1 text-xs bg-muted rounded-full">
                                        {category?.name || categoryId}
                                      </span>
                                    )
                                  }) || (
                                    <span className="px-2 py-1 text-xs bg-muted rounded-full">
                                      {selectedBook.category}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button asChild variant="outline">
                                  <Link href={`/admin/products/${selectedBook.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </Button>
                                <Button asChild variant="outline">
                                  <Link href={`/books/${selectedBook.id}`} target="_blank">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View on Site
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-medium">${book.price.toFixed(2)}</p>
                  <Badge variant={book.stock > 10 ? "success" : book.stock > 0 ? "warning" : "destructive"}>
                    {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Badge variant="outline">{book.category}</Badge>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the book "{book.title}" from your
                        inventory.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

