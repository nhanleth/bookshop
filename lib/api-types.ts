// Created to define API response types
// This file contains types that match the structure of the API response
// Updated: Added OrderResponse, OrderItemResponse, and CartResponse types for the new APIs

export type ProductResponse = {
  id: number
  name: string
  detail?: string
  description?: string
  price: string | number
  image?: string
  thumbnail?: string
  category?: string
  category_id?: number
  stock?: number
  quantity?: number
  created_at?: string
  updated_at?: string
}

export type CategoryResponse = {
  id: number
  name: string
  description?: string
  image?: string
  created_at?: string
  updated_at?: string
}

export type OrderItemResponse = {
  id?: number
  order_id?: number
  product_id: number
  quantity: number
  created_at?: string
  updated_at?: string
  product?: ProductResponse
}

export type OrderResponse = {
  id: number
  user_id: number
  total_price: number
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'canceled'
  created_at?: string
  updated_at?: string
  orderItems?: OrderItemResponse[]
  user?: any
}

export type CartResponse = {
  id: number
  user_id: number
  product_id: number
  quantity: number
  created_at?: string
  updated_at?: string
  product?: ProductResponse
  user?: any
} 