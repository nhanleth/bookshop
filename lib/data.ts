/**
 * Data access layer for BookStore application
 * 
 * Recent changes:
 * - Fixed product data handling to correctly process nested API response structures
 * - Improved image URL path handling to ensure correct URL format
 * - Enhanced category and product data adaptors to handle varied API formats
 * - Added better error handling and fallbacks for missing data
 */

import type { Book, User, Order, Category, Payment, ChatbotLog, WishlistItem } from "./db-schema"

// Mock data for development
const books: Book[] = []

export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@bookstore.com",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "user",
    createdAt: new Date(),
  },
]

export const orders: Order[] = [
  {
    id: "1",
    userId: "2",
    items: [
      {
        bookId: "1",
        title: "The Great Gatsby",
        quantity: 1,
        price: 12.99,
      },
      {
        bookId: "3",
        title: "Sapiens: A Brief History of Humankind",
        quantity: 1,
        price: 19.99,
      },
    ],
    total: 32.98,
    status: "delivered",
    shippingAddress: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-18"),
  },
  {
    id: "2",
    userId: "2",
    items: [
      {
        bookId: "4",
        title: "The Hobbit",
        quantity: 1,
        price: 15.99,
      },
    ],
    total: 15.99,
    status: "shipped",
    shippingAddress: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
    paymentMethod: "PayPal",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-21"),
  },
]

// Add mock data for the new entities
const categories: Category[] = [
  {
    id: "1",
    name: "Fiction",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "Non-Fiction",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "3",
    name: "Fantasy",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "4",
    name: "Thriller",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "5",
    name: "Education",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "6",
    name: "Memoir",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
]

const payments: Payment[] = [
  {
    id: "1",
    orderId: "1",
    amount: 32.98,
    status: "paid",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    orderId: "2",
    amount: 15.99,
    status: "paid",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-20"),
  },
]

const chatbotLogs: ChatbotLog[] = [
  {
    id: "1",
    userId: "2",
    message: "Do you have any book recommendations for fantasy novels?",
    response: "I'd recommend checking out 'The Hobbit' by J.R.R. Tolkien, which is a classic fantasy novel.",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-03-10"),
  },
  {
    id: "2",
    userId: "2",
    message: "What are some good educational books?",
    response:
      "We have several educational books. 'Mindset: The New Psychology of Success' by Carol S. Dweck is highly recommended.",
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
]

const wishlists: WishlistItem[] = [
  {
    id: "1",
    userId: "2",
    productId: "5",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "2",
    userId: "2",
    productId: "7",
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-02-15"),
  },
]

// UPDATED: Fixed adaptProductToBook to handle missing data better and provide appropriate default values
// Updated: Fix to handle nested product data structure from API response
function adaptProductToBook(product: any): Book {
  // Handle null/undefined product
  if (!product) {
    console.error("adaptProductToBook received null/undefined input");
    return {
      id: "0",
      title: "Untitled Book",
      author: "Unknown Author",
      description: "",
      price: 0,
      imageUrl: "https://via.placeholder.com/300x400",
      category: "Uncategorized",
      stock: 0,
      isbn: "",
      publish_year: 0,
    };
  }
  
  // Log the raw product data for debugging
  console.log("Raw product data:", JSON.stringify(product));

  // Check if the data is nested inside a 'product' property
  const productData = product.product || product;
  
  // Get base site URL for image paths
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  
  // Determine image URL with fallbacks
  let imageUrl = productData.image || productData.thumbnail || productData.imageUrl;
  
  // Adjust image URL if needed (when it's a relative path)
  if (imageUrl) {
    // If the path already starts with 'http' or '//' it's likely a full URL, leave it as is
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('//')) {
      // Remove any double slashes that might occur when concatenating
      if (imageUrl.startsWith('/') && siteUrl.endsWith('/')) {
        imageUrl = `${siteUrl}${imageUrl.slice(1)}`;
      } else if (!imageUrl.startsWith('/') && !siteUrl.endsWith('/')) {
        imageUrl = `${siteUrl}/${imageUrl}`;
      } else {
        imageUrl = `${siteUrl}${imageUrl}`;
      }
    }
  } else {
    // Default placeholder image if no image is available
    imageUrl = "https://via.placeholder.com/300x400?text=No+Image";
  }
  
  // Parse price safely
  let price = 0;
  try {
    if (productData.price) {
      price = parseFloat(productData.price);
      if (isNaN(price)) price = 0;
    }
  } catch (error) {
    console.error("Error parsing price:", error);
    price = 0;
  }
  
  // Parse stock/quantity safely
  let stock = 0;
  try {
    if (productData.stock !== undefined && productData.stock !== null) {
      stock = parseInt(productData.stock);
      if (isNaN(stock)) stock = 0;
    } else if (productData.quantity !== undefined && productData.quantity !== null) {
      stock = parseInt(productData.quantity);
      if (isNaN(stock)) stock = 0;
    }
  } catch (error) {
    console.error("Error parsing stock/quantity:", error);
    stock = 0;
  }
  
  // Get category info - first try nested category, then category_name, then fallback
  let categoryInfo = productData.category?.name || product.category_name || productData.category || "Uncategorized";
  
  return {
    id: productData.id || "0",
    title: productData.name || productData.title || "Untitled Book",
    author: productData.author || "Unknown Author",
    description: productData.description || productData.detail || "",
    price: price,
    imageUrl: imageUrl || "https://via.placeholder.com/300x400",
    category: categoryInfo,
    category_id: productData.category_id || productData.category?.id || null,
    stock: stock,
    isbn: productData.isbn || "",
    publish_year: productData.publish_year || 0,
    createdAt: productData.createdAt || (productData.created_at ? new Date(productData.created_at) : new Date()),
    updatedAt: productData.updatedAt || (productData.updated_at ? new Date(productData.updated_at) : new Date()),
  };
}

// UPDATED: Enhanced adaptCategoryToCategory function to handle different API response structures and missing data
function adaptCategoryToCategory(category: any): Category {
  // Handle null/undefined input
  if (!category) {
    console.error("adaptCategoryToCategory received null/undefined input");
    return {
      id: "0",
      name: "Unknown Category",
      description: "No category data received"
    };
  }

  // Get base site URL for image paths
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  
  // Log the received category structure for debugging
  console.log("Adapting category structure:", JSON.stringify(category));
  
  // Determine image URL
  let imageUrl = category.image;
  
  // Adjust image URL if needed (when it's a relative path)
  if (imageUrl) {
    // If the path already starts with 'http' or '//' it's likely a full URL, leave it as is
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('//')) {
      // Remove any double slashes that might occur when concatenating
      if (imageUrl.startsWith('/') && siteUrl.endsWith('/')) {
        imageUrl = `${siteUrl}${imageUrl.slice(1)}`;
      } else if (!imageUrl.startsWith('/') && !siteUrl.endsWith('/')) {
        imageUrl = `${siteUrl}/${imageUrl}`;
      } else {
        imageUrl = `${siteUrl}${imageUrl}`;
      }
    }
  }
  
  // Ensure we have a valid name property
  const name = category.name || category.category_name || "Unknown Category";
  
  return {
    id: category.id || "0",
    name: name,
    description: category.description || "",
    image: imageUrl || "",
    createdAt: category.createdAt || (category.created_at ? new Date(category.created_at) : new Date()),
    updatedAt: category.updatedAt || (category.updated_at ? new Date(category.updated_at) : new Date()),
  };
}

export async function getBooks(): Promise<Book[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/get/products`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Handle different possible API response structures
    let products;
    if (Array.isArray(result)) {
      // If the response is already an array
      products = result;
    } else if (result.products && Array.isArray(result.products)) {
      // If products are nested inside 'products' property
      products = result.products;
    } else if (typeof result === 'object' && result !== null) {
      // If it's some other object structure, try to convert it to an array
      // This handles cases where the API returns {0: product1, 1: product2, ...}
      products = Object.values(result);
    } else {
      // Fallback to empty array if we can't determine the structure
      products = [];
    }
    
    return products.map(adaptProductToBook);
  } catch (error) {
    console.error("Error fetching books:", error);
    // Fallback to mock data in case of API failure
    return books;
  }
}

export async function getBookById(id: string): Promise<Book | undefined> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/get/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`Raw API response for book ID ${id}:`, JSON.stringify(result));
    
    return adaptProductToBook(result);
  } catch (error) {
    console.error(`Error fetching book with id ${id}:`, error);
    // Fallback to mock data in case of API failure
    return books.find((book) => book.id === id);
  }
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
  return books.filter((book) => book.category === category)
}

export async function searchBooks(query: string): Promise<Book[]> {
  const lowerQuery = query.toLowerCase()
  return books.filter(
    (book) =>
      (book.title?.toLowerCase()?.includes(lowerQuery) || false) ||
      (book.author?.toLowerCase()?.includes(lowerQuery) || false) ||
      (book.description?.toLowerCase()?.includes(lowerQuery) || false),
  )
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return users.find((user) => user.email === email)
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  return orders.filter((order) => order.userId === userId)
}

export async function getAllOrders(): Promise<Order[]> {
  return orders
}

export async function getAllUsers(): Promise<User[]> {
  return users
}

// Add new helper functions to fetch data for the new entities

// Categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/get/categories`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const categories = await response.json();
    return Array.isArray(categories) ? categories.map(adaptCategoryToCategory) : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return empty array or mock data as fallback
    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  // Return early if id is empty
  if (!id || id === "") {
    console.log("getCategoryById called with empty ID");
    return {
      id: "0",
      name: "Uncategorized",
      description: "Default category when no category ID is provided"
    };
  }

  // Try up to 3 times to fetch the category
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    attempts++;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log(`Fetching category from: ${apiUrl}/get/categories/${id} (attempt ${attempts})`);
      
      const response = await fetch(`${apiUrl}/get/categories/${id}`, {
        // Add cache: 'no-store' to prevent caching issues
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error(`API error fetching category ${id}: Status ${response.status}`);
        if (attempts < maxAttempts) {
          console.log(`Retrying... (${attempts}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          continue;
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const category = await response.json();
      console.log(`Raw category data for ID ${id}:`, JSON.stringify(category));
      
      if (!category) {
        console.log(`No category data returned for ID ${id}`);
        return {
          id: id,
          name: "Unknown Category",
          description: "Category data could not be loaded"
        };
      }
      
      if (!category.name) {
        console.log(`Category name missing for ID ${id}`);
        return {
          id: id,
          name: "Unknown Category",
          description: "Category name is missing"
        };
      }
      
      return adaptCategoryToCategory(category);
    } catch (error) {
      console.error(`Error fetching category with id ${id} (attempt ${attempts}/${maxAttempts}):`, error);
      if (attempts >= maxAttempts) {
        // Return a default category after all retries failed
        return {
          id: id,
          name: "Unknown Category",
          description: "Error loading category"
        };
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
    }
  }
  
  // This should not be reached, but just in case
  return {
    id: id,
    name: "Unknown Category",
    description: "Failed to load after multiple attempts"
  };
}

// Payments
export async function getAllPayments(): Promise<Payment[]> {
  return payments
}

export async function getPaymentById(id: string): Promise<Payment | undefined> {
  return payments.find((payment) => payment.id === id)
}

export async function getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
  return payments.filter((payment) => payment.orderId === orderId)
}

// Chatbot Logs
export async function getAllChatbotLogs(): Promise<ChatbotLog[]> {
  return chatbotLogs
}

export async function getChatbotLogsByUserId(userId: string): Promise<ChatbotLog[]> {
  return chatbotLogs.filter((log) => log.userId === userId)
}

// Wishlists
export async function getAllWishlists(): Promise<WishlistItem[]> {
  return wishlists
}

export async function getWishlistsByUserId(userId: string): Promise<WishlistItem[]> {
  return wishlists.filter((item) => item.userId === userId)
}

// In a real app, these would modify a database
export async function addBook(book: Omit<Book, "id" | "createdAt" | "updatedAt">): Promise<Book> {
  const newBook: Book = {
    ...book,
    id: (books.length + 1).toString(),
    title: book.title || "Untitled Book",
    author: book.author || "Unknown Author",
    description: book.description || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  books.push(newBook)
  return newBook
}

export async function updateBook(id: string, bookData: Partial<Book>): Promise<Book | undefined> {
  const index = books.findIndex((book) => book.id === id)
  if (index === -1) return undefined

  books[index] = {
    ...books[index],
    ...bookData,
    updatedAt: new Date(),
  }

  return books[index]
}

export async function deleteBook(id: string): Promise<boolean> {
  const index = books.findIndex((book) => book.id === id)
  if (index === -1) return false

  books.splice(index, 1)
  return true
}

export async function createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
  const newOrder: Order = {
    ...order,
    id: (orders.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  orders.push(newOrder)
  return newOrder
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined> {
  const index = orders.findIndex((order) => order.id === id)
  if (index === -1) return undefined

  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date(),
  }

  return orders[index]
}

