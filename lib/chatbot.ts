"use server"

import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { getBooks } from "./data"
import { getFallbackResponse } from "./chatbot-fallback"
import type { Book } from "./db-schema"

// Function to find the most relevant books based on customer description
async function findRelevantBooks(customerDescription: string): Promise<Book[]> {
  // Get all books
  const allBooks = await getBooks()

  // Extract key terms from the customer description
  const keyTerms = customerDescription
    .toLowerCase()
    .replace(/[^\w\s]/gi, "") // Remove punctuation
    .split(" ")
    .filter(
      (term) =>
        term.length > 3 &&
        ![
          "what",
          "when",
          "where",
          "which",
          "who",
          "how",
          "that",
          "this",
          "with",
          "your",
          "have",
          "about",
          "recommend",
          "looking",
          "book",
          "books",
          "read",
          "like",
        ].includes(term),
    )

  // Score each book based on relevance to the description
  const scoredBooks = allBooks.map((book) => {
    let score = 0

    // Check title match (highest weight)
    const titleLower = book.title.toLowerCase()
    keyTerms.forEach((term) => {
      if (titleLower.includes(term)) score += 10
    })

    // Check author match (high weight)
    const authorLower = book.author.toLowerCase()
    keyTerms.forEach((term) => {
      if (authorLower.includes(term)) score += 8
    })

    // Check category match (medium weight)
    const categoryLower = book.category.toLowerCase()
    keyTerms.forEach((term) => {
      if (categoryLower.includes(term)) score += 6
      // Special case for fiction/non-fiction categories
      if (
        (term === "fiction" && categoryLower.includes("fiction")) ||
        (term === "non" && categoryLower.includes("non-fiction"))
      ) {
        score += 6
      }
    })

    // Check description match (lower weight)
    const descriptionLower = book.description.toLowerCase()
    keyTerms.forEach((term) => {
      if (descriptionLower.includes(term)) score += 3
    })

    // Bonus for in-stock items
    if (book.stock > 0) score += 2

    // Bonus for newer books (published in last 5 years)
    const fiveYearsAgo = new Date()
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5)
    if (book.publishedDate > fiveYearsAgo) score += 1

    return { book, score }
  })

  // Sort by score (descending) and take top 5
  const topBooks = scoredBooks
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.book)

  // If we don't have 5 books, add more from the collection to reach 5
  if (topBooks.length < 5) {
    const remainingBooks = allBooks
      .filter((book) => !topBooks.some((topBook) => topBook.id === book.id))
      .slice(0, 5 - topBooks.length)

    topBooks.push(...remainingBooks)
  }

  return topBooks
}

export async function getChatbotResponse(message: string) {
  try {
    // Use a shorter timeout for the AI response
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    // Find the 5 most relevant books based on the customer's message
    const relevantBooks = await findRelevantBooks(message)

    // Format the top 5 relevant books with full details
    const topRecommendations = relevantBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price,
      description: book.description,
      stock: book.stock > 0 ? "In Stock" : "Out of Stock",
      imageUrl: book.imageUrl,
      link: `/books/${book.id}`,
    }))

    const bookstoreContext = `
    You are a helpful AI book consultant for "LuzLit Bookshop", an online bookstore. 
    Your name is LuzLit Assistant.
    
    YOUR ROLE:
      - Help customers find books they'll love based on their interests, preferences, and reading history
      - Recommend books when a customer asks for recommendations or describes what they're looking for
      - Format your recommendations in a specific way (see below)
      - NEVER mention the specific number of books in your response
      
      RECOMMENDATION FORMAT:
      When recommending books, ALWAYS use this exact format:
      
      "I'd be happy to suggest some [category/genre] books for you. Based on [their request], here are some excellent recommendations I think you'll enjoy:
      
      [BOOK_LIST]
      
      Let me know if you'd like any additional details on these books or if you have a more specific genre or topic in mind. I'm happy to provide personalized recommendations to help you find your next great read!"
      
      For the [BOOK_LIST] section, use this exact HTML-like format for EACH book:
      
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="margin: 0 0 8px 0; font-weight: 600;">
          <a href="/books/BOOK_ID" style="color: #3b82f6; text-decoration: none; hover: underline;">BOOK_TITLE</a>
        </h3>
        <p style="margin: 0 0 5px 0; font-size: 0.9rem; color: #4b5563;">by BOOK_AUTHOR</p>
        <p style="margin: 0 0 8px 0; font-size: 0.9rem; color: #4b5563;">BOOK_PRICE | BOOK_CATEGORY | BOOK_STOCK</p>
        <p style="margin: 0; font-size: 0.9rem; color: #4b5563;">BOOK_DESCRIPTION</p>
      </div>
      
      STORE POLICIES:
      - Returns are accepted within 30 days with receipt
      - Free shipping on orders over $35
      - 10% discount for members
      - Special orders take 1-2 weeks
      
      RECOMMENDED BOOKS FOR THIS QUERY:
      ${JSON.stringify(topRecommendations)}
      
      IMPORTANT INSTRUCTIONS:
      1. ALWAYS format your book recommendations exactly as shown in the RECOMMENDATION FORMAT section
      2. NEVER mention the specific number of books in your response
      3. If the customer's query isn't about finding books (e.g., store hours, return policy), don't include the recommendations
      4. Be conversational, friendly, and show enthusiasm for books
      5. Keep descriptions brief but informative
      6. If the customer asks a follow-up question about a specific book, provide more details about that book
      7. Make sure each book title is clickable and links to its details page
      8. Make sure all book titles are in blue color (#3b82f6) to indicate they are clickable links
    `

    try {
      const { text } = await generateText({
        model: anthropic("claude-3-haiku-20240307"),
        system: bookstoreContext,
        prompt: message,
        temperature: 0.7,
        maxTokens: 1000, // Reduced token limit for faster response
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return { response: text }
    } catch (aiError) {
      console.error("AI service error:", aiError)
      // If AI service fails, use the fallback response
      const fallbackResponse = await getFallbackResponse(message)
      return { response: fallbackResponse, fallback: true }
    }
  } catch (error) {
    console.error("Chatbot error:", error)

    try {
      // Always try to use fallback in case of any error
      const fallbackResponse = await getFallbackResponse(message)
      return { response: fallbackResponse, fallback: true }
    } catch (fallbackError) {
      // If even fallback fails, return a simple message
      return {
        error:
          "I'm currently experiencing technical difficulties. Please try again later or browse our collection directly.",
      }
    }
  }
}

