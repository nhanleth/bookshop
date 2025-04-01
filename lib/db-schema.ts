export type User = {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  role: "admin" | "user"
  createdAt: Date
}

export type Book = {
  id: string | number
  name?: string // API might use 'name' instead of 'title'
  title?: string
  author?: string
  description?: string
  detail?: string // API might use 'detail' instead of 'description'
  price?: number
  imageUrl?: string
  image?: string // API might use 'image' instead of 'imageUrl'
  thumbnail?: string // API might use 'thumbnail'
  category?: string
  category_name?: string // Name of the category
  category_id?: number // API might use 'category_id'
  stock?: number
  quantity?: number // API might use 'quantity' instead of 'stock'
  isbn?: string
  publish_year?: number | string // Year published from API
  publishedDate?: Date
  created_at?: string // API timestamp format
  updated_at?: string // API timestamp format
  createdAt?: Date
  updatedAt?: Date
  categories?: string[] // For multiple categories
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

// Updated Category type to include image field
export type Category = {
  id: string | number
  name: string
  description?: string
  image?: string
  created_at?: string // API timestamp format
  updated_at?: string // API timestamp format
  createdAt?: Date
  updatedAt?: Date
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

