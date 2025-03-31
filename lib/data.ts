import type { Book, User, Order, Category, Payment, ChatbotLog, WishlistItem } from "./db-schema"

// Mock data for development
export const books: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic novel about the American Dream set in the Jazz Age.",
    price: 12.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.jpg-os5PzbaggPK4crsMnGJ6SOwghYxEE5.jpeg",
    category: "Fiction",
    stock: 25,
    isbn: "9780743273565",
    publishedDate: new Date("1925-04-10"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A powerful story of growing up in a town steeped in prejudice.",
    price: 14.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.jpg-YhCjqbIOFinkBmx0R860ePK1giZBMb.jpeg",
    category: "Fiction",
    stock: 18,
    isbn: "9780061120084",
    publishedDate: new Date("1960-07-11"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description: "A groundbreaking narrative of humanity's creation and evolution.",
    price: 19.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3.jpg-Jf27Xub7xLBaZzc2LUXk2nxivKMuxm.jpeg",
    category: "Non-Fiction",
    stock: 30,
    isbn: "9780062316097",
    publishedDate: new Date("2014-02-10"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about the adventures of hobbit Bilbo Baggins.",
    price: 15.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4.jpg-CI0lZULnTkd3cFeEVAYwCBD9HjZnUL.jpeg",
    category: "Fantasy",
    stock: 22,
    isbn: "9780547928227",
    publishedDate: new Date("1937-09-21"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "Educated",
    author: "Tara Westover",
    description: "A memoir about a woman who leaves her survivalist family and goes on to earn a PhD.",
    price: 16.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5.jpg-UvTujkavSjSRhhWCNE0lzppLTRE75h.jpeg",
    category: "Memoir",
    stock: 15,
    isbn: "9780399590504",
    publishedDate: new Date("2018-02-20"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A psychological thriller about a woman who shoots her husband and then stops speaking.",
    price: 13.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6.jpg-k8QQmuByi1zckcebQk9x0dlf9AVBSC.jpeg",
    category: "Thriller",
    stock: 20,
    isbn: "9781250301697",
    publishedDate: new Date("2019-02-05"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // New Fiction Books
  {
    id: "7",
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    description:
      "A landmark novel that tells the multi-generational story of the Buendía family in the fictional town of Macondo.",
    price: 14.95,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7.jpg-CNgxB4Q9HMX5pCUzX1vdjJ6TYfk5IX.jpeg",
    category: "Fiction",
    stock: 18,
    isbn: "9780060883287",
    publishedDate: new Date("1967-05-30"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    title: "The Alchemist",
    author: "Paulo Coelho",
    description:
      "A philosophical novel about a young Andalusian shepherd who dreams of finding a worldly treasure and embarks on a journey of self-discovery.",
    price: 11.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8.jpg-oVjnYDRMOq0F24fI5x9Cesgy7J3Nfp.jpeg",
    category: "Fiction",
    stock: 32,
    isbn: "9780062315007",
    publishedDate: new Date("1988-06-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description:
      "A romantic novel of manners that follows the character development of Elizabeth Bennet as she learns about the repercussions of hasty judgments.",
    price: 9.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9.jpg-hqDv7ENJyvR3m1jT5yCYr6CAdYdWfr.jpeg",
    category: "Fiction",
    stock: 24,
    isbn: "9780141439518",
    publishedDate: new Date("1813-01-28"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    description:
      "A moving story of an unlikely friendship between a wealthy boy and the son of his father's servant, set against the backdrop of tumultuous events in Afghanistan.",
    price: 13.5,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10.jpg-d5itQkcyvLKiMY6AhMEzpD93GZ6eP0.jpeg",
    category: "Fiction",
    stock: 19,
    isbn: "9781594631931",
    publishedDate: new Date("2003-05-29"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "11",
    title: "The Night Circus",
    author: "Erin Morgenstern",
    description:
      "A competition between two young magicians becomes a game of hearts and minds in this enchanting and imaginative novel set in a mysterious circus that only appears at night.",
    price: 15.5,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11.jpg-eH16eRLEjBhsuVJRfgsdc7bhCJ8YDG.jpeg",
    category: "Fiction",
    stock: 16,
    isbn: "9780307744432",
    publishedDate: new Date("2011-09-13"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "12",
    title: "The Shadow of the Wind",
    author: "Carlos Ruiz Zafón",
    description:
      "A literary thriller set in post-war Barcelona about a young boy who discovers a mysterious book that leads him into a labyrinth of secrets and buried mysteries.",
    price: 16.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/12.jpg-81iW40ieCitGiq7zCWQfNiNqD0r3LC.jpeg",
    category: "Fiction",
    stock: 14,
    isbn: "9780143034902",
    publishedDate: new Date("2001-04-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "13",
    title: "Normal People",
    author: "Sally Rooney",
    description:
      "A complex coming-of-age story that follows the relationship between two teenagers as they navigate the complexities of social class, intimacy, and young adulthood.",
    price: 12.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/13.jpg-5ONILa8jJQXRu1lwAB0KupEcin7w1J.jpeg",
    category: "Fiction",
    stock: 22,
    isbn: "9781984822178",
    publishedDate: new Date("2018-08-28"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Education Books
  {
    id: "14",
    title: "Mindset: The New Psychology of Success",
    author: "Carol S. Dweck",
    description:
      "A groundbreaking book that shows how success in school, work, sports, the arts, and almost every area of human endeavor can be dramatically influenced by how we think about our talents and abilities.",
    price: 17.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/14.jpg-8Ylo9mypYphNdL39Vrso63zLXvgN1f.jpeg",
    category: "Education",
    stock: 28,
    isbn: "9780345472328",
    publishedDate: new Date("2006-02-28"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "15",
    title: "Make It Stick: The Science of Successful Learning",
    author: "Peter C. Brown, Henry L. Roediger III, Mark A. McDaniel",
    description:
      "Drawing on cognitive psychology and other fields, this book offers techniques for becoming more productive learners and cautions against study habits and practice routines that turn out to be counterproductive.",
    price: 19.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/15.jpg-BlLq7IrL3sL0WN1ucTsf9FiqROGw3O.jpeg",
    category: "Education",
    stock: 15,
    isbn: "9780674729018",
    publishedDate: new Date("2014-04-14"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "16",
    title: "Pedagogy of the Oppressed",
    author: "Paulo Freire",
    description:
      "A foundational text in critical pedagogy that examines the relationship between the colonizer and the colonized, and proposes a new, more equitable relationship between teacher and student.",
    price: 14.95,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/16.jpg-yCTaFHzFD8Vh6VlzFmbUuYGlrlhLZi.jpeg",
    category: "Education",
    stock: 12,
    isbn: "9780826412768",
    publishedDate: new Date("1968-01-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "17",
    title: "How Children Succeed",
    author: "Paul Tough",
    description:
      "An examination of how character qualities like perseverance, curiosity, and self-control are more crucial to success than pure academic abilities.",
    price: 15.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/17.jpg-EEydlZ5P9alfvvFad1ZVo710QAC08D.jpeg",
    category: "Education",
    stock: 20,
    isbn: "9780544104402",
    publishedDate: new Date("2012-09-04"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "18",
    title: "Why Don't Students Like School?",
    author: "Daniel T. Willingham",
    description:
      "A cognitive scientist answers questions about how the mind works and what it means for the classroom, offering practical advice on how teachers can apply cognitive science principles to their day-to-day teaching.",
    price: 18.5,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/18.jpg-bwnDFreMPFVzukqOloIzj7YmFOczib.jpeg",
    category: "Education",
    stock: 17,
    isbn: "9780470591963",
    publishedDate: new Date("2009-03-16"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "19",
    title: "Visible Learning",
    author: "John Hattie",
    description:
      "A synthesis of more than 800 meta-analyses relating to achievement, this book presents the largest collection of evidence-based research into what actually works in schools to improve learning.",
    price: 24.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/19.jpg-egW9GF0WtbEGCINMNoTJrbpawXUNDJ.jpeg",
    category: "Education",
    stock: 10,
    isbn: "9780415476188",
    publishedDate: new Date("2008-11-19"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "20",
    title: "Teaching to Transgress",
    author: "bell hooks",
    description:
      "A series of essays that discusses how teachers can build learning communities that nurture the intellectual and spiritual growth of students while also challenging systems of domination.",
    price: 16.95,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20.jpg-kwTw3jiIvCQN9qi75xtIwGmBxdr7pL.jpeg",
    category: "Education",
    stock: 14,
    isbn: "9780415908085",
    publishedDate: new Date("1994-09-14"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "21",
    title: "The Element: How Finding Your Passion Changes Everything",
    author: "Ken Robinson",
    description:
      "A look at the importance of finding your passion and how education systems often fail to nurture individual talents, with stories of high achievers who didn't fit into traditional education.",
    price: 15.99,
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/21.jpg-uogUyPbIZaxWL5nJ1qkacvFXUNwPrY.jpeg",
    category: "Education",
    stock: 19,
    isbn: "9780143116738",
    publishedDate: new Date("2009-01-08"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

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

// Helper functions to simulate database operations
export async function getBooks(): Promise<Book[]> {
  return books
}

export async function getBookById(id: string): Promise<Book | undefined> {
  return books.find((book) => book.id === id)
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
  return books.filter((book) => book.category === category)
}

export async function searchBooks(query: string): Promise<Book[]> {
  const lowerQuery = query.toLowerCase()
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.description.toLowerCase().includes(lowerQuery),
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
  return categories
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  return categories.find((category) => category.id === id)
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

