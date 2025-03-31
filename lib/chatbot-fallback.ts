"use server"

import { getBooks } from "./data"

// Simple keyword-based recommendation system as fallback
export async function getFallbackResponse(message: string): Promise<string> {
  const allBooks = await getBooks()
  const lowerMessage = message.toLowerCase()

  // Check if it's a greeting or general question
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return "Hello! I'm currently operating in fallback mode due to high traffic. I can still help you find books based on categories or keywords. What kind of books are you interested in?"
  }

  // Check for help request
  if (lowerMessage.includes("help") || lowerMessage.includes("how do") || lowerMessage.includes("how can")) {
    return "I can help you find books by category or topic. Just mention what you're interested in, like 'fiction books' or 'books about history'."
  }

  // Check for category requests
  const categories = ["fiction", "non-fiction", "fantasy", "thriller", "education", "memoir"]
  let matchedCategory = null

  for (const category of categories) {
    if (lowerMessage.includes(category)) {
      matchedCategory = category
      break
    }
  }

  if (matchedCategory) {
    // Filter books by the matched category (case-insensitive)
    const categoryBooks = allBooks.filter((book) => book.category.toLowerCase() === matchedCategory).slice(0, 5)

    if (categoryBooks.length > 0) {
      let response = `Here are some ${matchedCategory} books you might enjoy:<br><br>`

      categoryBooks.forEach((book) => {
        response += `<div style="margin-bottom: 15px; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <strong><a href="/books/${book.id}" style="color: #3b82f6; text-decoration: none;">${book.title}</a></strong><br>
          by ${book.author}<br>
          $${book.price.toFixed(2)} | ${book.category} | ${book.stock > 0 ? "In Stock" : "Out of Stock"}<br>
          ${book.description.substring(0, 100)}...
        </div>`
      })

      return response
    }
  }

  // Default response with random book recommendations
  const randomBooks = [...allBooks].sort(() => 0.5 - Math.random()).slice(0, 5)

  let response =
    "I'm not sure what specific books you're looking for, but here are some recommendations you might enjoy:<br><br>"

  randomBooks.forEach((book) => {
    response += `<div style="margin-bottom: 15px; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <strong><a href="/books/${book.id}" style="color: #3b82f6; text-decoration: none;">${book.title}</a></strong><br>
      by ${book.author}<br>
      $${book.price.toFixed(2)} | ${book.category} | ${book.stock > 0 ? "In Stock" : "Out of Stock"}<br>
      ${book.description.substring(0, 100)}...
    </div>`
  })

  return response
}

