/*
 * Updated to fix params Promise issue:
 * - Added proper typing for params as Promise<ProductParams>
 * - Unwrapped params using React.use() before accessing properties
 * - Extracted id from unwrapped params
 */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react"
import React from "react"
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

// Define type for Category and Product
type Category = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

type Product = {
  id: string
  title: string
  author: string
  description: string
  price: number | string
  image: string
  category_id: string
  stock: number
  isbn: string
  publish_year: string
  created_at: string
  updated_at: string
}

// Define params type
type ProductParams = {
  id: string
}

export default function EditProductPage({ params }: { params: Promise<ProductParams> }) {
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""
  // Unwrap params using React.use() before accessing properties
  const unwrappedParams = React.use(params)
  const { id } = unwrappedParams
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    author: "",
    category_id: "",
    description: "",
    publish_year: "",
    isbn: "",
    price: "",
    stock: 0,
  })

  useEffect(() => {
    loadData()
  }, [id])
  
  const loadData = async () => {
    setIsLoading(true)
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

      // Fetch product
      const productResponse = await fetch(`${apiUrl}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Accept': 'application/json',
        }
      })

      if (!productResponse.ok) {
        if (productResponse.status === 401) {
          toast.error("Session expired. Please login again")
          router.push("/login")
          return
        } else if (productResponse.status === 404) {
          toast.error("Product not found")
          router.push("/admin/products")
          return
        }
        throw new Error(`Error: ${productResponse.status}`)
      }

      const productData = await productResponse.json()
      
      // Set form data with the fetched product
      setFormData({
        title: productData.title || "",
        author: productData.author || "",
        category_id: productData.category_id || "",
        description: productData.description || "",
        publish_year: productData.publish_year || "",
        isbn: productData.isbn || "",
        price: productData.price || "",
        stock: productData.stock || 0,
      })
      
      // Set image preview if available
      if (productData.image) {
        setCurrentImageUrl(`${siteUrl}/storage/${productData.image}`)
      }

      // Fetch categories
      const categoriesResponse = await fetch(`${apiUrl}/categories`, {
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Accept': 'application/json',
        }
      })

      if (!categoriesResponse.ok) {
        throw new Error(`Error: ${categoriesResponse.status}`)
      }

      const categoriesData = await categoriesResponse.json()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Failed to load product data")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Create image preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
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
      
      // Create form data for file upload
      const data = new FormData()
      
      // Add all form fields to the FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value.toString())
        }
      })
      
      // Add image if selected
      if (imageFile) {
        data.append('image', imageFile)
      }
      
      // Add _method field for Laravel to understand it's a PUT request
      data.append('_method', 'PUT')
      
      // Send request to update product
      const response = await fetch(`${apiUrl}/products/${id}`, {
        method: 'POST', // We use POST but with _method=PUT for FormData
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Accept': 'application/json',
          // Note: Don't set Content-Type when using FormData
        },
        body: data
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again")
          router.push("/login")
          return
        }
        
        if (response.status === 422) {
          // Validation errors
          const errorMessages = Object.values(responseData.errors || {}).flat().join(', ')
          toast.error(`Validation error: ${errorMessages}`)
        } else {
          throw new Error(`Error: ${response.status}`)
        }
      } else {
        toast.success("Product updated successfully")
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product")
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleDelete = async () => {
    setIsDeleting(true)
    
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
      
      // Send delete request
      const response = await fetch(`${apiUrl}/products/${id}`, {
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
      
      toast.success("Product deleted successfully")
      router.push("/admin/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    } finally {
      setIsDeleting(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">Update product information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this product from your inventory.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Book title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author <span className="text-red-500">*</span></Label>
                <Input 
                  id="author" 
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Author name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Book description"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Select 
                  name="category_id" 
                  value={formData.category_id}
                  defaultValue={formData.category_id}
                  onValueChange={(value) => handleSelectChange("category_id", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN <span className="text-red-500">*</span></Label>
                <Input 
                  id="isbn" 
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  placeholder="ISBN number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publish_year">Publish Year <span className="text-red-500">*</span></Label>
                <Input 
                  id="publish_year" 
                  name="publish_year"
                  value={formData.publish_year}
                  onChange={handleInputChange}
                  placeholder="Publication year (YYYY)"
                  maxLength={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
                  <Input 
                    id="price" 
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock <span className="text-red-500">*</span></Label>
                  <Input 
                    id="stock" 
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <Input 
                  id="image" 
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                
                {/* Show either new image preview or current image */}
                {imagePreview ? (
                  <div className="mt-2 relative w-full aspect-square max-w-[200px] rounded-md overflow-hidden border">
                    <img 
                      src={imagePreview} 
                      alt="New product preview" 
                      className="object-cover w-full h-full" 
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">New Image</span>
                    </div>
                  </div>
                ) : currentImageUrl ? (
                  <div className="mt-2 relative w-full aspect-square max-w-[200px] rounded-md overflow-hidden border">
                    <img 
                      src={currentImageUrl} 
                      alt="Current product image" 
                      className="object-cover w-full h-full" 
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">Current Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-muted-foreground">No image uploaded</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            size="lg"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 