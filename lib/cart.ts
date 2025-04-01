"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Cart } from "./db-schema"
import { createCart, updateCart, deleteCart, fetchCartById, plusCart, minusCart, fetchCarts } from "./api"
import { toast } from "sonner"
import { ensureAuth, checkAuthentication } from "./auth-client"
import { CartResponse } from "./api-types"

interface CartStore {
  cart: Cart
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>
  removeFromCart: (bookId: string) => Promise<void>
  updateQuantity: (bookId: string, quantity: number) => Promise<void>
  plusCartItem: (bookId: string) => Promise<void>
  minusCartItem: (bookId: string) => Promise<void>
  clearCart: () => void
  syncWithServer: () => Promise<void>
  debugSession: () => Promise<void>
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: { items: [], total: 0 },

      addToCart: async (item) => {
        // First update local state regardless of authentication
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
        });
        
        // Try to update database if user is authenticated
        try {
          // Check if user is logged in, but don't redirect
          const authResult = await checkAuthentication();
          
          // If not authenticated, store in local storage only
          if (!authResult.authenticated) {
            console.log('User not authenticated, saving cart to local storage only');
            toast.success('Đã thêm sản phẩm vào giỏ hàng');
            return;
          }
          
          console.log('User authenticated with ID:', authResult.userId);
          
          // Convert item ID to number for API
          const productId = typeof item.bookId === 'string' 
            ? parseInt(item.bookId) 
            : item.bookId;
          
          if (isNaN(productId)) {
            console.error('Invalid product ID:', item.bookId);
            return;
          }
          
          // Get current quantity if item exists
          const existingItem = get().cart.items.find(cartItem => cartItem.bookId === item.bookId);
          const quantity = existingItem ? existingItem.quantity : 1;
          
          // Create cart item on server with user ID from session
          const result = await createCart({
            user_id: authResult.userId!,
            product_id: productId,
            quantity: quantity
          });
          
          console.log('Cart item created on server:', result);
          toast.success('Đã thêm sản phẩm vào giỏ hàng');
        } catch (error) {
          console.error('Error adding item to cart:', error);
          toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        }
      },

      removeFromCart: async (bookId) => {
        // First update local state regardless of authentication
        set((state) => {
          const newItems = state.cart.items.filter((item) => item.bookId !== bookId)
          const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          return { cart: { items: newItems, total } }
        });
        
        // Try to update database if user is authenticated
        try {
          // Check if user is logged in, but don't redirect
          const authResult = await checkAuthentication();
          
          // If not authenticated, just update local storage
          if (!authResult.authenticated) {
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
            return;
          }
          
          const productId = typeof bookId === 'string' 
            ? parseInt(bookId) 
            : bookId;
          
          if (isNaN(productId)) {
            console.error('Invalid product ID:', bookId);
            return;
          }
          
          // Fetch all carts to find the correct cart item
          const carts = await fetchCarts();
          
          // Find user's cart items
          const userCartItems = carts.filter(cart => 
            cart.user_id === authResult.userId && 
            cart.product_id === productId
          );
          
          if (!userCartItems || userCartItems.length === 0) {
            console.error('Cart item not found for product:', productId);
            toast.error('Không thể xóa sản phẩm khỏi giỏ hàng');
            return;
          }
          
          // Delete cart item on server using the cart item ID
          await deleteCart(userCartItems[0].id);
          toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (error) {
          console.error('Error removing item from cart:', error);
          toast.error('Không thể xóa sản phẩm khỏi giỏ hàng');
        }
      },

      updateQuantity: async (bookId, quantity) => {
        if (quantity <= 0) {
          return;
        }
        
        // First update local state regardless of authentication
        set((state) => {
          const newItems = state.cart.items.map((item) => (item.bookId === bookId ? { ...item, quantity } : item))
          const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          return { cart: { items: newItems, total } }
        });
        
        // Try to update database if user is authenticated
        try {
          // Check if user is logged in, but don't redirect
          const authResult = await checkAuthentication();
          
          // If not authenticated, just update local storage
          if (!authResult.authenticated) {
            toast.success('Đã cập nhật giỏ hàng');
            return;
          }
          
          const productId = typeof bookId === 'string' 
            ? parseInt(bookId) 
            : bookId;
          
          if (isNaN(productId)) {
            console.error('Invalid product ID:', bookId);
            return;
          }
          
          // Update cart item on server
          await createCart({
            user_id: authResult.userId!,
            product_id: productId,
            quantity: quantity
          });
          
          toast.success('Đã cập nhật giỏ hàng');
        } catch (error) {
          console.error('Error updating cart:', error);
          toast.error('Không thể cập nhật giỏ hàng');
        }
      },

      plusCartItem: async (bookId) => {
        // First update local state regardless of authentication
        set((state) => {
          const newItems = state.cart.items.map((item) => 
            (item.bookId === bookId ? { ...item, quantity: item.quantity + 1 } : item)
          )
          const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          return { cart: { items: newItems, total } }
        });
        
        // Try to update using the API
        try {
          // First check if user is authenticated
          const authResult = await checkAuthentication();
          
          // If not authenticated, just update local storage
          if (!authResult.authenticated) {
            toast.success('Đã cập nhật giỏ hàng');
            return;
          }
          
          const productId = typeof bookId === 'string' 
            ? parseInt(bookId) 
            : bookId;
          
          if (isNaN(productId)) {
            console.error('Invalid product ID:', bookId);
            return;
          }
          
          // Fetch all carts to find the correct cart item
          const carts = await fetchCarts();
          
          // Find user's cart items
          const userCartItems = carts.filter(cart => 
            cart.user_id === authResult.userId && 
            cart.product_id === productId
          );
          
          if (!userCartItems || userCartItems.length === 0) {
            console.error('Cart item not found for product:', productId);
            toast.error('Không thể cập nhật giỏ hàng');
            return;
          }
          
          // Use the first matching cart item's ID
          await plusCart(userCartItems[0].id);
          toast.success('Đã cập nhật giỏ hàng');
        } catch (error) {
          console.error('Error increasing cart quantity:', error);
          toast.error('Không thể cập nhật giỏ hàng');
        }
      },
      
      minusCartItem: async (bookId) => {
        // Get current quantity
        const { cart } = get();
        const item = cart.items.find(item => item.bookId === bookId);
        
        // Don't decrement below 1
        if (!item || item.quantity <= 1) return;
        
        // First update local state regardless of authentication
        set((state) => {
          const newItems = state.cart.items.map((item) => 
            (item.bookId === bookId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item)
          )
          const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          return { cart: { items: newItems, total } }
        });
        
        // Try to update using the API
        try {
          // First check if user is authenticated
          const authResult = await checkAuthentication();
          
          // If not authenticated, just update local storage
          if (!authResult.authenticated) {
            toast.success('Đã cập nhật giỏ hàng');
            return;
          }
          
          const productId = typeof bookId === 'string' 
            ? parseInt(bookId) 
            : bookId;
          
          if (isNaN(productId)) {
            console.error('Invalid product ID:', bookId);
            return;
          }
          
          // Fetch all carts to find the correct cart item
          const carts = await fetchCarts();
          
          // Find user's cart items
          const userCartItems = carts.filter(cart => 
            cart.user_id === authResult.userId && 
            cart.product_id === productId
          );
          
          if (!userCartItems || userCartItems.length === 0) {
            console.error('Cart item not found for product:', productId);
            toast.error('Không thể cập nhật giỏ hàng');
            return;
          }
          
          // Use the first matching cart item's ID
          await minusCart(userCartItems[0].id);
          toast.success('Đã cập nhật giỏ hàng');
        } catch (error) {
          console.error('Error decreasing cart quantity:', error);
          toast.error('Không thể cập nhật giỏ hàng');
        }
      },

      clearCart: () => set({ cart: { items: [], total: 0 } }),
      
      // Sync the local cart with the server
      syncWithServer: async () => {
        try {
          // Try direct session API call first for most reliable result
          const sessionResponse = await fetch('/api/auth/session');
          if (!sessionResponse.ok) {
            console.log('Session API error, falling back to checkAuthentication()');
            // Fall back to standard check
            const authResult = await checkAuthentication();
            if (!authResult.authenticated) {
              console.log('User not authenticated, cart remains in local storage only');
              return;
            }
          }
          
          let userId;
          
          try {
            // Try to extract userId directly from session API response
            const session = await sessionResponse.json();
            
            // Try multiple possible locations for userId
            if (session.id && !isNaN(Number(session.id))) {
              userId = Number(session.id);
            } else if (session.user && session.user.id && !isNaN(Number(session.user.id))) {
              userId = Number(session.user.id);
            } else if (session.userId && !isNaN(Number(session.userId))) {
              userId = Number(session.userId);
            } else {
              // Fall back to checkAuthentication
              const authResult = await checkAuthentication();
              if (!authResult.authenticated) {
                console.log('User not authenticated, cart remains in local storage only');
                return;
              }
              userId = authResult.userId;
            }
          } catch (error) {
            console.error('Error parsing session data, falling back to checkAuthentication()', error);
            // Fall back to standard check
            const authResult = await checkAuthentication();
            if (!authResult.authenticated) {
              console.log('User not authenticated, cart remains in local storage only');
              return;
            }
            userId = authResult.userId;
          }
          
          if (!userId) {
            console.log('No valid user ID found, cart remains in local storage only');
            return;
          }
          
          console.log('Syncing cart with server for user:', userId);
          const { cart } = get();
          
          // Create/update cart items on the server for each local cart item
          const promises = cart.items.map(async (item) => {
            try {
              // Convert string IDs to number for API
              const productId = typeof item.bookId === 'string' 
                ? parseInt(item.bookId) 
                : item.bookId;
              
              if (isNaN(productId)) {
                console.error('Invalid product ID:', item.bookId);
                return;
              }
              
              console.log('Syncing cart item:', { 
                user_id: userId, 
                product_id: productId, 
                quantity: item.quantity 
              });
              
              // Create cart item on server
              const result = await createCart({
                user_id: userId!,
                product_id: productId,
                quantity: item.quantity
              });
              
              console.log('Cart item synced successfully:', result);
            } catch (error) {
              console.error('Error syncing cart item:', error);
            }
          });
          
          await Promise.all(promises);
          toast.success('Đã đồng bộ giỏ hàng với server');
        } catch (error) {
          console.error('Error syncing with server:', error);
          toast.error('Không thể đồng bộ giỏ hàng với server');
        }
      },

      // Debug function to check session status
      debugSession: async () => {
        try {
          console.log('Starting session debugging...');
          
          // Check via session API
          const sessionResponse = await fetch('/api/auth/session');
          console.log('Session API response status:', sessionResponse.status);
          
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            console.log('Session API data:', sessionData);
            
            // Check for userId in various locations
            if (sessionData.id) {
              console.log('Found id in session root:', sessionData.id);
            } else if (sessionData.user?.id) {
              console.log('Found id in session.user:', sessionData.user.id);
            } else if (sessionData.userId) {
              console.log('Found userId in session:', sessionData.userId);
            } else {
              console.log('No user ID found in any expected location in session');
            }
          } else {
            console.log('Session API error. Status:', sessionResponse.status);
          }
          
          // Check via auth helper
          const authResult = await checkAuthentication();
          console.log('Auth check result:', authResult);
          
          // Show cart data
          const { cart } = get();
          console.log('Current cart data:', cart);
          
          toast.info('Session debugged - check console');
        } catch (error) {
          console.error('Error debugging session:', error);
          toast.error('Error debugging session');
        }
      }
    }),
    {
      name: "cart-storage",
    },
  ),
)

