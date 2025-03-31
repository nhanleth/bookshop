export type User = {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  role: "admin" | "user"
  createdAt: Date
}

export type Book = {
  id: string
  title: string
  author: string
  description: string
  price: number
  imageUrl: string
  category: string
  stock: number
  isbn: string
  publishedDate: Date
  createdAt: Date
  updatedAt: Date
  categories?: string[] // Add this field for multiple categories
}

export type Order = {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: Address
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

export type OrderItem = {
  bookId: string
  title: string
  quantity: number
  price: number
}

export type Address = {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export type CartItem = {
  bookId: string
  title: string
  author: string
  price: number
  quantity: number
  imageUrl: string
}

export type Cart = {
  items: CartItem[]
  total: number
}

// Add new types for the new entities
export type Category = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type Payment = {
  id: string
  orderId: string
  amount: number
  status: "pending" | "paid" | "failed"
  createdAt: Date
  updatedAt: Date
}

export type ChatbotLog = {
  id: string
  userId: string | null
  message: string
  response: string
  createdAt: Date
  updatedAt: Date
}

export type WishlistItem = {
  id: string
  userId: string
  productId: string
  createdAt: Date
  updatedAt: Date
}

