"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllUsers } from "@/lib/data"
import { fetchUsers, createUser, updateUser, deleteUser } from "@/lib/api"
import { User } from "@/lib/db-schema"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Extended type for user with password confirmation
interface UserWithPasswordConfirmation extends User {
  password_confirmation?: string;
}

type UserRole = "admin" | "user";

// Function to format date safely
function formatDate(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return 'N/A';
  
  try {
    // Handle MySQL/Laravel format (YYYY-MM-DD HH:MM:SS)
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      // Try parsing MySQL/Laravel format manually
      if (typeof dateStr === 'string') {
        const parts = dateStr.split(/[- :]/);
        if (parts.length >= 6) {
          // Format: YYYY-MM-DD HH:MM:SS
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Months are 0-based in JS
          const day = parseInt(parts[2]);
          const hour = parseInt(parts[3]);
          const minute = parseInt(parts[4]);
          const second = parseInt(parts[5]);
          
          const parsedDate = new Date(year, month, day, hour, minute, second);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate.toLocaleDateString();
          }
        }
      }
      return 'N/A';
    }
    
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'N/A';
  }
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<UserWithPasswordConfirmation | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user" as UserRole,
  })
  const [error, setError] = useState<string | null>(null)
  
  // State to control dialog visibility
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setIsLoading(true)
      const data = await fetchUsers()
      setUsers(data)
      setError(null)
    } catch (error) {
      console.error("Error loading users:", error)
      
      // Handle authentication errors
      if (error instanceof Error && error.message.includes('Authentication required') || 
          error instanceof Error && error.message.includes('Session expired')) {
        toast.error("Please login to access this page")
        router.push("/login")
        return
      }
      
      setError("Failed to load users. Please try again.")
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser({
      ...user,
      password: "", // Don't show the actual password
    })
    setEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return
    
    try {
      const payload: Partial<UserWithPasswordConfirmation> = {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role
      }
      
      if (editingUser.password) {
        payload.password = editingUser.password
        payload.password_confirmation = editingUser.password_confirmation || editingUser.password
      }
      
      const updatedUser = await updateUser(editingUser.id, payload)
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
      toast.success(`User ${updatedUser.name} updated successfully`)
      setEditingUser(null)
      setEditDialogOpen(false) // Close the dialog
    } catch (error) {
      console.error("Error updating user:", error)
      
      // Handle authentication errors
      if (error instanceof Error && error.message.includes('Authentication required') || 
          error instanceof Error && error.message.includes('Session expired')) {
        toast.error("Please login to access this page")
        router.push("/login")
        return
      }
      
      toast.error("Failed to update user")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      setUsers(users.filter((user) => user.id !== userId))
      toast.success("User deleted successfully")
      setDeleteDialogOpen(null) // Close the dialog
    } catch (error) {
      console.error("Error deleting user:", error)
      
      // Handle authentication errors
      if (error instanceof Error && error.message.includes('Authentication required') || 
          error instanceof Error && error.message.includes('Session expired')) {
        toast.error("Please login to access this page")
        router.push("/login")
        return
      }
      
      toast.error("Failed to delete user")
    }
  }

  const handleAddUser = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast.error("All fields are required")
        return
      }
      
      const userData = {
        ...newUser,
        password_confirmation: newUser.password_confirmation || newUser.password
      }
      
      const createdUser = await createUser(userData as any)
      setUsers([...users, createdUser])
      setNewUser({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "user" as UserRole,
      })
      toast.success("User added successfully")
      setAddDialogOpen(false) // Close the dialog
    } catch (error) {
      console.error("Error adding user:", error)
      
      // Handle authentication errors
      if (error instanceof Error && error.message.includes('Authentication required') || 
          error instanceof Error && error.message.includes('Session expired')) {
        toast.error("Please login to access this page")
        router.push("/login")
        return
      }
      
      toast.error("Failed to add user")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Loading user accounts...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-red-500">{error}</p>
          <Button onClick={() => loadUsers()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts</p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account. All fields are required.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={newUser.password_confirmation}
                  onChange={(e) => setNewUser({ ...newUser, password_confirmation: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email || !newUser.password || !newUser.password_confirmation}>
                Add User
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
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-3 text-sm">{user.id}</td>
                  <td className="px-4 py-3 text-sm">{user.name}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                              Make changes to the user account. Leave password blank to keep it unchanged.
                            </DialogDescription>
                          </DialogHeader>
                          {editingUser && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editingUser.name}
                                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={editingUser.email}
                                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-password">Password (leave blank to keep unchanged)</Label>
                                <Input
                                  id="edit-password"
                                  type="password"
                                  value={editingUser.password}
                                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-password-confirm">Confirm Password</Label>
                                <Input
                                  id="edit-password-confirm"
                                  type="password"
                                  placeholder="Confirm new password"
                                  onChange={(e) => setEditingUser({ ...editingUser, password_confirmation: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <Select
                                  value={editingUser.role}
                                  onValueChange={(value: UserRole) => setEditingUser({ ...editingUser, role: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button onClick={handleUpdateUser}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog open={deleteDialogOpen === user.id} onOpenChange={(open) => 
                        setDeleteDialogOpen(open ? user.id : null)
                      }>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive" 
                            onClick={() => setDeleteDialogOpen(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the user account for{" "}
                              {user.name} ({user.email}).
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteDialogOpen(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
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

