"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
import { toast } from "sonner"

// Define Product and Category types
type Product = {
  id: string
  title: string
  author: string
  description: string
  price: number | string // Allow price to be a string to prevent TypeError
  image: string
  category_id: string
  stock: number
  isbn: string
  publish_year: string
  created_at: string
  updated_at: string
}

type Category = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("table") // "table" or "grid"
  const [categories, setCategories] = useState<Category[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Get current session first
      const sessionResponse = await fetch('/api/auth/session')
      if (!sessionResponse.ok) {
        if (sessionResponse.status === 401) {
          toast.error("You must be logged in to access this page")
          router.push("/login")
          return
        }
        throw new Error(`Session error: ${sessionResponse.status}`)
      }
      
      const session = await sessionResponse.json()
      if (!session || !session.token) {
        toast.error("Authentication token is missing")
        router.push("/login")
        return
      }

      // Fetch products
      const productsResponse = await fetch(`${apiUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Accept': 'application/json',
        }
      })

      if (!productsResponse.ok) {
        if (productsResponse.status === 401) {
          toast.error("Session expired. Please login again")
          router.push("/login")
          return
        }
        throw new Error(`Error: ${productsResponse.status}`)
      }

      const productsData = await productsResponse.json()
      setProducts(productsData)

      // Fetch categories
      const categoriesResponse = await fetch(`${apiUrl}/categories`, {
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Accept': 'application/json',
        }
      })

      if (!categoriesResponse.ok) {
        if (categoriesResponse.status === 401) {
          toast.error("Session expired. Please login again")
          router.push("/login")
          return
        }
        throw new Error(`Error: ${categoriesResponse.status}`)
      }

      const categoriesData = await categoriesResponse.json()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      // Get current session first
      const sessionResponse = await fetch('/api/auth/session')
      if (!sessionResponse.ok) {
        toast.error("Authentication error")
        router.push("/login")
        return
      }
      
      const session = await sessionResponse.json()
      if (!session || !session.token) {
        toast.error("Authentication token is missing")
        router.push("/login")
        return
      }

      const response = await fetch(`${apiUrl}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again")
          router.push("/login")
          return
        }
        throw new Error(`Error: ${response.status}`)
      }

      setProducts(products.filter(product => product.id !== productId))
      toast.success("Product deleted successfully")
      setDeleteDialogOpen(null)
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : "Unknown"
  }

  const showProductDetails = (product: Product) => {
    setSelectedProduct(product)
    setDetailsDialogOpen(true)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCategoryName(product.category_id).toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Loading product inventory...</p>
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
          <p className="text-muted-foreground">Manage your product inventory</p>
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="h-10 w-8 relative bg-muted rounded overflow-hidden">
                        <Image
                          src={product.image ? `${siteUrl}/storage/${product.image}` : "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{product.title}</td>
                    <td className="px-4 py-3 text-sm">{product.author}</td>
                    <td className="px-4 py-3 text-sm">{getCategoryName(product.category_id)}</td>
                    <td className="px-4 py-3 text-sm">${Number(product.price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "destructive"}>
                        {product.stock > 0 ? product.stock : "Out of stock"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Dialog open={detailsDialogOpen && selectedProduct?.id === product.id} onOpenChange={setDetailsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => showProductDetails(product)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Product Details</DialogTitle>
                              <DialogDescription>Detailed information about this product.</DialogDescription>
                            </DialogHeader>
                            {selectedProduct && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="aspect-[3/4] relative bg-muted rounded-lg overflow-hidden">
                                  <Image
                                    src={selectedProduct.image ? `${siteUrl}/storage/${selectedProduct.image}` : "/placeholder.svg"}
                                    alt={selectedProduct.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-xl font-bold">{selectedProduct.title}</h3>
                                    <p className="text-muted-foreground">by {selectedProduct.author}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                                      <p>{getCategoryName(selectedProduct.category_id)}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                                      <p>${Number(selectedProduct.price).toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Stock</h4>
                                      <p>{selectedProduct.stock}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">ISBN</h4>
                                      <p>{selectedProduct.isbn}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Published</h4>
                                      <p>{selectedProduct.publish_year}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Added</h4>
                                      <p>{new Date(selectedProduct.created_at).toLocaleDateString()}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                    <p className="text-sm">{selectedProduct.description}</p>
                                  </div>

                                  <div className="flex gap-2 pt-4">
                                    <Button asChild variant="outline">
                                      <Link href={`/admin/products/${selectedProduct.id}/edit`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                      </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                      <Link href={`/books/${selectedProduct.id}`} target="_blank">
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
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>

                        <AlertDialog open={deleteDialogOpen === product.id} onOpenChange={(open) => setDeleteDialogOpen(open ? product.id : null)}>
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
                                This action cannot be undone. This will permanently delete the product "{product.title}" from
                                your inventory.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteProduct(product.id)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-[3/4] relative">
                <Image 
                  src={product.image ? `${siteUrl}/storage/${product.image}` : "/placeholder.svg"} 
                  alt={product.title} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Dialog open={detailsDialogOpen && selectedProduct?.id === product.id} onOpenChange={setDetailsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary" onClick={() => showProductDetails(product)}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Product Details</DialogTitle>
                          <DialogDescription>Detailed information about this product.</DialogDescription>
                        </DialogHeader>
                        {selectedProduct && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="aspect-[3/4] relative bg-muted rounded-lg overflow-hidden">
                              <Image
                                src={selectedProduct.image ? `${siteUrl}/storage/${selectedProduct.image}` : "/placeholder.svg"}
                                alt={selectedProduct.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-xl font-bold">{selectedProduct.title}</h3>
                                <p className="text-muted-foreground">by {selectedProduct.author}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                                  <p>{getCategoryName(selectedProduct.category_id)}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                                  <p>${Number(selectedProduct.price).toFixed(2)}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Stock</h4>
                                  <p>{selectedProduct.stock}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">ISBN</h4>
                                  <p>{selectedProduct.isbn}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Published</h4>
                                  <p>{selectedProduct.publish_year}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Added</h4>
                                  <p>{new Date(selectedProduct.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                <p className="text-sm">{selectedProduct.description}</p>
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button asChild variant="outline">
                                  <Link href={`/admin/products/${selectedProduct.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </Button>
                                <Button asChild variant="outline">
                                  <Link href={`/books/${selectedProduct.id}`} target="_blank">
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
                <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{product.author}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-medium">${Number(product.price).toFixed(2)}</p>
                  <Badge variant={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "destructive"}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Badge variant="outline">{getCategoryName(product.category_id)}</Badge>
                <AlertDialog open={deleteDialogOpen === product.id} onOpenChange={(open) => setDeleteDialogOpen(open ? product.id : null)}>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product "{product.title}" from your
                        inventory.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
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
