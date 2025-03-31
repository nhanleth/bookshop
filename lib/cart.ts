"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Cart } from "./db-schema"

interface CartStore {
  cart: Cart
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: { items: [], total: 0 },

      addToCart: (item) =>
        set((state) => {
          const existingItemIndex = state.cart.items.findIndex((cartItem) => cartItem.bookId === item.bookId)

          let newItems

          if (existingItemIndex >= 0) {
            newItems = [...state.cart.items]
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + 1,
            }
          } else {
            newItems = [...state.cart.items, { ...item, quantity: 1 }]
          }

          const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

          return { cart: { items: newItems, total } }
        }),

      removeFromCart: (bookId) =>
        set((state) => {
          const newItems = state.cart.items.filter((item) => item.bookId !== bookId)

          const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

          return { cart: { items: newItems, total } }
        }),

      updateQuantity: (bookId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return state
          }

          const newItems = state.cart.items.map((item) => (item.bookId === bookId ? { ...item, quantity } : item))

          const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

          return { cart: { items: newItems, total } }
        }),

      clearCart: () => set({ cart: { items: [], total: 0 } }),
    }),
    {
      name: "cart-storage",
    },
  ),
)

