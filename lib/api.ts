// This file contains functions to interact with the backend API for user management
// Updated: Added functions for Order and Cart APIs including fetchCarts, fetchOrders, and related CRUD operations

import { User } from './db-schema';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { CartResponse, OrderResponse, OrderItemResponse } from './api-types';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to handle API errors consistently
export function handleApiError(error: any) {
  console.log('Handling API error:', error);
  
  // Check for Unauthenticated message in various error formats
  if (
    error?.message === "Unauthenticated." || 
    (typeof error === 'object' && error.message === "Unauthenticated.") ||
    (typeof error === 'string' && error.includes("Unauthenticated"))
  ) {
    console.log('Unauthenticated error detected, redirecting to login');
    toast.error('Session expired. Please login again');
    // Use window.location for client-side redirect that works more reliably than Next.js redirect
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
      return; // Prevent further execution
    } else {
      redirect('/login');
    }
  }
  
  // Only throw if not redirecting
  throw error;
}

// Get the auth token from session API
async function getAuthToken() {
  try {
    const sessionResponse = await fetch('/api/auth/session');
    if (!sessionResponse.ok) {
      if (sessionResponse.status === 401) {
        toast.error('Authentication required');
      }
      toast.error(`Session error: ${sessionResponse.status}`);
      throw new Error(`Session error: ${sessionResponse.status}`);
    }
    
    const session = await sessionResponse.json();
    console.log('Session data for auth token:', session);
    
    // Try to get token from all possible locations in the session object
    let token = null;
    
    if (session.token) {
      token = session.token;
    } else if (session.accessToken) {
      token = session.accessToken;
    } else if (session.access_token) {
      token = session.access_token;
    } else if (session.user && session.user.token) {
      token = session.user.token;
    }
    
    if (!token) {
      console.error('Authentication token is missing from session:', session);
      toast.error('Authentication token is missing');
      throw new Error('Authentication token is missing');
    }
    
    console.log('Successfully retrieved auth token');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
}

// Get all users
export async function fetchUsers(): Promise<User[]> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return []; // This will not execute due to redirect
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again');
        redirect('/login');
      }
      throw errorData;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    handleApiError(error);
    throw error;
  }
}

// Create a new user
export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return {} as User; // This will not execute due to redirect
      }
      throw errorData;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    handleApiError(error);
    throw error;
  }
}

// Get a user by ID
export async function fetchUserById(id: string): Promise<User> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return {} as User; // This will not execute due to redirect
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again');
        redirect('/login');
      }
      throw errorData;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    handleApiError(error);
    throw error;
  }
}

// Update a user
export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return {} as User; // This will not execute due to redirect
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again');
        redirect('/login');
      }
      throw errorData;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    handleApiError(error);
    throw error;
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<void> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return; // This will not execute due to redirect
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again');
        redirect('/login');
      }
      throw errorData;
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    handleApiError(error);
    throw error;
  }
}

// CART API FUNCTIONS

// Get all carts (requires authentication)
export async function fetchCarts(): Promise<CartResponse[]> {
  try {
    const response = await fetch(`${API_URL}/get/carts`);
    
    if (!response.ok) {
      throw await response.json();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching carts:', error);
    throw error;
  }
}

// Get a cart by ID
export async function fetchCartById(id: number): Promise<CartResponse> {
  try {
    const response = await fetch(`${API_URL}/get/carts/${id}`);
    
    if (!response.ok) {
      throw await response.json();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

// Create a new cart (requires authentication)
export async function createCart(cartData: { user_id: number | string, product_id: number, quantity: number }): Promise<CartResponse> {
  try {
    // Log the initial cart data
    console.log('Creating cart with data:', cartData);
    
    // Handle guest cart (user_id is "unknown" or not a valid number)
    if (cartData.user_id === "unknown" || 
        cartData.user_id === undefined || 
        cartData.user_id === null || 
        (typeof cartData.user_id === "string" && isNaN(Number(cartData.user_id)))) {
      console.log('Guest cart - storing locally only');
      // Try to get user ID from session directly if it's not provided
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          console.log('Checking session for user ID:', session);
          
          // Extract user ID from session
          let userId = null;
          if (session.id && !isNaN(Number(session.id))) {
            userId = Number(session.id);
          } else if (session.user && session.user.id && !isNaN(Number(session.user.id))) {
            userId = Number(session.user.id);
          } else if (session.userId && !isNaN(Number(session.userId))) {
            userId = Number(session.userId);
          }
          
          if (userId) {
            console.log('Found user ID in session:', userId);
            // Update the cart data with the found user ID
            cartData = {
              ...cartData,
              user_id: userId
            };
            // Continue with API call below
          } else {
            // Return a mock response for client-side only cart if no user ID found
            console.log('No valid user ID found in session, using guest cart');
            return {
              id: 0,
              user_id: -1, // Temporary ID for guest carts
              product_id: cartData.product_id,
              quantity: cartData.quantity,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
        }
      } catch (error) {
        console.error('Error checking session for user ID:', error);
        // Return a mock response for client-side only cart
        return {
          id: 0,
          user_id: -1, // Temporary ID for guest carts
          product_id: cartData.product_id,
          quantity: cartData.quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
    }
    
    // For authenticated users, proceed with API call
    console.log('Processing authenticated cart with user_id:', cartData.user_id);
    const token = await getAuthToken();
    
    // Make sure user_id is a number for the API
    const userData = {
      ...cartData,
      user_id: typeof cartData.user_id === 'string' ? parseInt(cartData.user_id) : cartData.user_id
    };
    
    console.log('Sending cart data to API:', userData);
    
    const response = await fetch(`${API_URL}/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cart creation API error:', errorData);
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return {} as CartResponse; // This will not execute due to redirect
      }
      throw errorData;
    }
    
    const result = await response.json();
    console.log('Cart created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating cart:', error);
    handleApiError(error);
    throw error;
  }
}

// Update a cart (requires authentication)
export async function updateCart(id: number, cartData: Partial<{ user_id: number | string, product_id: number, quantity: number }>): Promise<CartResponse> {
  try {
    // Handle guest cart (user_id is "unknown" or not a valid number)
    if (cartData.user_id === "unknown" || (typeof cartData.user_id === "string" && isNaN(Number(cartData.user_id)))) {
      console.log('Guest cart - storing locally only');
      // Return a mock response for client-side only cart
      return {
        id: id || 0,
        user_id: -1, // Temporary ID for guest carts
        product_id: cartData.product_id || 0,
        quantity: cartData.quantity || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    // For authenticated users, proceed with API call
    const token = await getAuthToken();
    
    // Make sure user_id is a number for the API if it exists in cartData
    const userData = { ...cartData };
    if (userData.user_id !== undefined) {
      userData.user_id = typeof userData.user_id === 'string' ? parseInt(userData.user_id as string) : userData.user_id;
    }
    
    const response = await fetch(`${API_URL}/carts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return {} as CartResponse; // This will not execute due to redirect
      }
      throw errorData;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating cart:', error);
    handleApiError(error);
    throw error;
  }
}

// Delete a cart (requires authentication)
export async function deleteCart(id: number): Promise<void> {
  try {
    // Try to get auth token first to check authentication
    let token;
    try {
      token = await getAuthToken();
    } catch (e) {
      // If unable to get token, user is likely not authenticated
      // Just return for guest carts instead of throwing an error
      console.log('Guest cart deletion - no server operation needed');
      return;
    }
    
    // For authenticated users with a valid token, proceed with API call
    const response = await fetch(`${API_URL}/carts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return; // This will not execute due to redirect
      }
      throw errorData;
    }
  } catch (error) {
    console.error('Error deleting cart:', error);
    handleApiError(error);
    throw error;
  }
}

// Increment cart item quantity (requires authentication)
export async function plusCart(id: number): Promise<CartResponse> {
  try {
    // Get auth token
    const token = await getAuthToken();
    
    // Call the plus cart API
    const response = await fetch(`${API_URL}/plus/cart/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return {} as CartResponse; // This will not execute due to redirect
      }
      throw errorData;
    }
    
    const result = await response.json();
    console.log('Cart item quantity increased:', result);
    return result;
  } catch (error) {
    console.error('Error increasing cart item quantity:', error);
    handleApiError(error);
    throw error;
  }
}

// Decrement cart item quantity (requires authentication)
export async function minusCart(id: number): Promise<CartResponse> {
  try {
    // Get auth token
    const token = await getAuthToken();
    
    // Call the minus cart API
    const response = await fetch(`${API_URL}/minus/cart/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return {} as CartResponse; // This will not execute due to redirect
      }
      throw errorData;
    }
    
    const result = await response.json();
    console.log('Cart item quantity decreased:', result);
    return result;
  } catch (error) {
    console.error('Error decreasing cart item quantity:', error);
    handleApiError(error);
    throw error;
  }
}

// ORDER API FUNCTIONS

// Get all orders
export async function fetchOrders(): Promise<OrderResponse[]> {
  try {
    const response = await fetch(`${API_URL}/get/orders`);
    
    if (!response.ok) {
      throw await response.json();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

// Get an order by ID
export async function fetchOrderById(id: number): Promise<OrderResponse> {
  try {
    const response = await fetch(`${API_URL}/get/orders/${id}`);
    
    if (!response.ok) {
      throw await response.json();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

// Create a new order (requires authentication)
export async function createOrder(orderData: { 
  user_id: number, 
  total_price: number, 
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'canceled',
  items: Array<{ product_id: number, quantity: number }>
}): Promise<OrderResponse> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return {} as OrderResponse; // This will not execute due to redirect
      }
      throw errorData;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    handleApiError(error);
    throw error;
  }
}

// Update an order (requires authentication)
export async function updateOrder(id: number, orderData: Partial<{ 
  user_id: number, 
  total_price: number, 
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'canceled'
}>): Promise<OrderResponse> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return {} as OrderResponse; // This will not execute due to redirect
      }
      throw errorData;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating order:', error);
    handleApiError(error);
    throw error;
  }
}

// Delete an order (requires authentication)
export async function deleteOrder(id: number): Promise<void> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Unauthenticated.") {
        handleApiError(errorData);
        return; // This will not execute due to redirect
      }
      throw errorData;
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    handleApiError(error);
    throw error;
  }
} 