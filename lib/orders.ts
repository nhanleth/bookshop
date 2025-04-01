// Created to manage orders functionality
// This file includes functions to create and manage orders, including converting cart items to an order
// Updated: Modified to handle guest carts and require authentication only at checkout time

"use client"

import { fetchOrders, fetchOrderById, createOrder, updateOrder, deleteOrder } from './api'
import { OrderResponse } from './api-types'
import { useCartStore } from './cart'
import { toast } from 'sonner'
import { ensureAuth } from './auth-client'

// Converts the local cart to an order structure for the API
export async function convertCartToOrder() {
  // Get authenticated user ID from session
  const authResult = await ensureAuth();
  if (!authResult) return null; // User not authenticated, handled by ensureAuth with redirect
  
  const userId = authResult.userId;
  const { cart } = useCartStore.getState();
  
  // Check if cart is empty
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }
  
  // Map cart items to order items format
  const items = cart.items.map(item => {
    // Convert string IDs to number for API
    let productId: number;
    
    try {
      if (typeof item.bookId === 'string') {
        productId = parseInt(item.bookId);
      } else if (typeof item.bookId === 'number') {
        productId = item.bookId;
      } else {
        console.error(`Invalid product ID type: ${typeof item.bookId}`);
        throw new Error(`Invalid product ID: ${item.bookId}`);
      }
      
      if (isNaN(productId)) {
        console.error(`Product ID is NaN: ${item.bookId}`);
        throw new Error(`Invalid product ID: ${item.bookId}`);
      }
    } catch (error) {
      console.error(`Error parsing product ID from ${item.bookId}:`, error);
      throw new Error(`Invalid product ID: ${item.bookId}`);
    }
    
    return {
      product_id: productId,
      quantity: item.quantity
    };
  });
  
  // Create order data
  return {
    user_id: userId,
    total_price: cart.total,
    status: 'pending' as const,
    items
  };
}

// Place an order using the current cart
export async function placeOrder(): Promise<OrderResponse | null> {
  try {
    // Check authentication and get user ID from session
    // This will redirect to login if not authenticated
    const authResult = await ensureAuth();
    if (!authResult) return null; // User not authenticated, handled by ensureAuth with redirect
    
    // Get order data from cart
    const orderData = await convertCartToOrder();
    if (!orderData) return null;
    
    // Create the order
    const order = await createOrder(orderData);
    
    // Clear the cart after successful order
    useCartStore.getState().clearCart();
    
    toast.success('Order placed successfully');
    return order;
  } catch (error: any) {
    console.error('Error placing order:', error);
    toast.error(error.message || 'Failed to place order');
    throw error;
  }
}

// Get all orders for display
export async function getOrders(): Promise<OrderResponse[]> {
  try {
    // Authentication is checked by the API
    return await fetchOrders();
  } catch (error) {
    console.error('Error fetching orders:', error);
    toast.error('Failed to fetch orders');
    throw error;
  }
}

// Get a single order by ID
export async function getOrderById(id: number): Promise<OrderResponse> {
  try {
    // Authentication is checked by the API
    return await fetchOrderById(id);
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    toast.error('Failed to fetch order details');
    throw error;
  }
}

// Update an order's status
export async function updateOrderStatus(id: number, status: 'pending' | 'paid' | 'shipped' | 'completed' | 'canceled'): Promise<OrderResponse> {
  try {
    // Authentication is checked by the API
    return await updateOrder(id, { status });
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    toast.error('Failed to update order');
    throw error;
  }
}

// Cancel an order
export async function cancelOrder(id: number): Promise<OrderResponse> {
  try {
    // Authentication is checked by the API
    return await updateOrder(id, { status: 'canceled' });
  } catch (error) {
    console.error(`Error canceling order ${id}:`, error);
    toast.error('Failed to cancel order');
    throw error;
  }
} 