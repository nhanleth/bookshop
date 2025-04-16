"use server";

import OpenAI from "openai";
import { getBooks } from "./data";
import { getFallbackResponse } from "./chatbot-fallback";
import type { Book } from "./db-schema";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,
});

async function findRelevantBooks(customerDescription: string): Promise<Book[]> {
  const allBooks = await getBooks();

  const keyTerms = customerDescription
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
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
        ].includes(term)
    );

  const scoredBooks = allBooks.map((book) => {
    let score = 0;
    const fields =
      `${book.title} ${book.author} ${book.genre} ${book.description}`.toLowerCase();

    keyTerms.forEach((term) => {
      if (fields.includes(term)) score += 5;
    });

    if (book.stock > 0) score += 2;

    return { book, score };
  });

  const topBooks = scoredBooks
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.book);

  return topBooks;
}

export async function getChatbotResponse(message: string) {
  try {
    const relevantBooks = await findRelevantBooks(message);

    const topRecommendations = relevantBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      price: book.price,
      description: book.description,
      stock: book.stock > 0 ? "In Stock" : "Out of Stock",
    }));

    const bookstoreContext = `
You are a helpful AI book consultant for "LuzLit Bookshop", an online bookstore. 
Your name is LuzLit Assistant.

YOUR ROLE:
- Help customers find books based on their interests
- Recommend books when asked or based on a vague idea
- Format your reply in friendly tone with enthusiasm

RECOMMENDATION FORMAT:
Use this format for each book:

<div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
  <h3 style="margin: 0 0 8px 0; font-weight: 600;">
    <a href="/books/BOOK_ID" style="color: #3b82f6; text-decoration: none;">BOOK_TITLE</a>
  </h3>
  <p style="margin: 0 0 5px 0; font-size: 0.9rem; color: #4b5563;">by BOOK_AUTHOR</p>
  <p style="margin: 0 0 8px 0; font-size: 0.9rem; color: #4b5563;">BOOK_PRICE VNĐ | BOOK_GENRE | BOOK_STOCK</p>
  <p style="margin: 0; font-size: 0.9rem; color: #4b5563;">BOOK_DESCRIPTION</p>
</div>

RECOMMENDED BOOKS:
${JSON.stringify(topRecommendations)}

IMPORTANT:
- Always respond in a friendly, enthusiastic tone
- Use HTML-like format above
- Do NOT say "here are 5 books" – just show the list
- Mention that users can click the book titles for more info
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: bookstoreContext },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return { response: completion.choices[0].message.content || "" };
  } catch (err) {
    console.error("AI Error:", err);
    try {
      const fallbackResponse = await getFallbackResponse(message);
      return { response: fallbackResponse, fallback: true };
    } catch {
      return {
        error:
          "Xin lỗi, hiện chatbot đang gặp sự cố. Vui lòng thử lại sau hoặc duyệt danh sách sách trực tiếp.",
      };
    }
  }
}
