"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

// Define Category type
type Category = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export default function NewProductPage() {
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category_id: "",
    description: "",
    publish_year: "",
    isbn: "",
    price: "",
    stock: "0",
  })
  
  useEffect(() => {
    loadCategories()
  }, [])
  
  const loadCategories = async () => {
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

      // Fetch categories
      const response = await fetch(`${apiUrl}/categories`, {
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

      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
      toast.error("Failed to load categories")
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
        data.append(key, value.toString())
      })
      
      // Add image if selected
      if (imageFile) {
        data.append('image', imageFile)
      }
      
      // Send request to create product
      const response = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Accept': 'application/json',
          // Note: Don't set Content-Type when using FormData,
          // browser will set it automatically with the correct boundary
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
        toast.success("Product created successfully")
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Failed to create product")
    } finally {
      setIsSaving(false)
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
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product in your inventory</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
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
                {imagePreview && (
                  <div className="mt-2 relative w-full aspect-square max-w-[200px] rounded-md overflow-hidden border">
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="object-cover w-full h-full" 
                    />
                  </div>
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
                Save Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 