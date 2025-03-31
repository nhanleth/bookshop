"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type WishlistItem = {
  id: string
  title: string
  author: string
  price: number
  imageUrl: string
}

interface WishlistStore {
  items: WishlistItem[]
  addToWishlist: (book: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (book) => {
        const { items } = get()
        const exists = items.some((item) => item.id === book.id)

        if (!exists) {
          set({ items: [...items, book] })
        }
      },

      removeFromWishlist: (id) => {
        const { items } = get()
        set({ items: items.filter((item) => item.id !== id) })
      },

      isInWishlist: (id) => {
        const { items } = get()
        return items.some((item) => item.id === id)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
    },
  ),
)

