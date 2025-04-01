"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Define Category type
type Category = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
  })
  const router = useRouter()
  
  // Dialog open/close states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      // First, get the session data from server
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
      
      // Now fetch categories with the token
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

  const handleEditCategory = (category: Category) => {
    setEditingCategory({
      ...category,
    })
    setEditDialogOpen(true)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return

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

      const response = await fetch(`${apiUrl}/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${session.token}`,
        },
        body: JSON.stringify({ name: editingCategory.name }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again")
          router.push("/login")
          return
        }
        throw new Error(`Error: ${response.status}`)
      }

      const updatedCategory = await response.json()
      setCategories(categories.map((category) => 
        category.id === updatedCategory.id ? updatedCategory : category
      ))
      
      toast.success(`Category ${updatedCategory.name} updated successfully`)
      setEditingCategory(null)
      setEditDialogOpen(false) // Close the dialog
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category")
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
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
      
      const response = await fetch(`${apiUrl}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${session.token}`,
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

      setCategories(categories.filter((category) => category.id !== categoryId))
      toast.success("Category deleted successfully")
      setDeleteDialogOpen(null) // Close the delete dialog
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Failed to delete category")
    }
  }

  const handleAddCategory = async () => {
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
      
      const response = await fetch(`${apiUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${session.token}`,
        },
        body: JSON.stringify(newCategory),
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again")
          router.push("/login")
          return
        }
        throw new Error(`Error: ${response.status}`)
      }

      const createdCategory = await response.json()
      setCategories([...categories, createdCategory])
      
      setNewCategory({
        name: "",
      })
      toast.success("Category added successfully")
      setAddDialogOpen(false) // Close the add dialog
    } catch (error) {
      console.error("Error adding category:", error)
      toast.error("Failed to add category")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Loading categories...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new product category. All fields are required.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCategory} disabled={!newCategory.name}>
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t">
                  <td className="px-4 py-3 text-sm">{category.id}</td>
                  <td className="px-4 py-3 text-sm">{category.name}</td>
                  <td className="px-4 py-3 text-sm">{new Date(category.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Dialog open={editDialogOpen && editingCategory?.id === category.id} onOpenChange={setEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>Make changes to the category.</DialogDescription>
                          </DialogHeader>
                          {editingCategory && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editingCategory.name}
                                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button onClick={handleUpdateCategory}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog open={deleteDialogOpen === category.id} onOpenChange={(open) => setDeleteDialogOpen(open ? category.id : null)}>
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
                              This action cannot be undone. This will permanently delete the category "{category.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category.id)}
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
    </div>
  )
}

