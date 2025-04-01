import { notFound } from "next/navigation"
import Image from "next/image"
import { getBookById, getBooks, getAllCategories, getCategoryById } from "@/lib/data"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { WishlistButton } from "@/components/wishlist-button"
import Link from "next/link"
import type { Book } from "@/lib/db-schema"

export default async function BookPage({ params }: { params: { id: string } }) {
  try {
    console.log(`Rendering book page for ID: ${params.id}`);
    const book = await getBookById(params.id)

    if (!book) {
      console.error(`Book with ID ${params.id} not found`)
      notFound()
    }

    console.log(`Successfully loaded book: ${book.title || book.name}`);

    // Get category name with improved error handling
    let categoryName = book.category || "Uncategorized";
    
    if (book.category_id) {
      try {
        console.log(`Fetching category with ID: ${book.category_id}`);
        const categoryData = await getCategoryById(book.category_id?.toString() || "");
        console.log("Category data:", categoryData);
        
        if (categoryData && categoryData.name) {
          categoryName = categoryData.name;
        } else {
          console.log(`Category data missing or invalid: ${JSON.stringify(categoryData)}`);
        }
      } catch (error) {
        console.error(`Error fetching category for book ${book.id}:`, error);
      }
    } else {
      console.log(`No category_id found for book ${book.id}, using fallback category: ${categoryName}`);
    }

    // Get related books from the same category
    let relatedBooks: Book[] = [];
    try {
      console.log(`Fetching related books for category: ${categoryName}`);
      const allBooks = await getBooks();
      
      if (book.category_id) {
        relatedBooks = allBooks
          .filter((relatedBook) => 
            relatedBook.category_id === book.category_id && 
            String(relatedBook.id) !== String(params.id))
          .slice(0, 4);
      } else if (book.category) {
        relatedBooks = allBooks
          .filter((relatedBook) => 
            relatedBook.category === book.category && 
            String(relatedBook.id) !== String(params.id))
          .slice(0, 4);
      }
      
      console.log(`Found ${relatedBooks.length} related books`);
    } catch (error) {
      console.error("Error fetching related books:", error);
      relatedBooks = [];
    }

    // Helper function to determine if a book is in stock
    const isInStock = (book: any) => {
      return (book.stock !== undefined && book.stock > 0) || 
             (book.quantity !== undefined && book.quantity > 0);
    }

    // Helper function to get stock quantity text
    const getStockText = (book: any) => {
      if (book.stock !== undefined && book.stock > 0) {
        return `In Stock (${book.stock})`;
      } 
      if (book.quantity !== undefined && book.quantity > 0) {
        return `In Stock (${book.quantity})`;
      }
      return "Out of Stock";
    }

    // Helper function to get available quantity
    const getAvailableQuantity = (book: any) => {
      if (book.stock !== undefined && book.stock > 0) {
        return book.stock;
      }
      if (book.quantity !== undefined && book.quantity > 0) {
        return book.quantity;
      }
      return 0;
    }

    // Get book title with fallback
    const bookTitle = book.title || book.name || "Untitled Book";
    const bookAuthor = book.author || "Unknown Author";
    const bookDescription = book.description || book.detail || "No description available.";
    const bookImage = book.imageUrl || book.image || book.thumbnail || "/placeholder.svg?height=600&width=450";
    const bookPrice = typeof book.price === 'number' ? book.price.toFixed(2) : "0.00";
    const bookPublishYear = book.publish_year || "Unknown";
    const bookIsbn = book.isbn || "N/A";

    return (
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          <div className="flex flex-col gap-6">
            <div className="aspect-[3/4] relative bg-muted rounded-xl overflow-hidden shadow-lg group">
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/5 dark:to-primary/10"></div>

              <Image
                src={bookImage}
                alt={bookTitle}
                width={450}
                height={600}
                className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />

              {/* Overlay with book info on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h2 className="text-white text-xl font-bold">{bookTitle}</h2>
                <p className="text-white/80 text-sm">{bookAuthor}</p>
              </div>
            </div>

            {/* Book details cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{categoryName}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="font-medium">{bookPublishYear}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">ISBN</p>
                <p className="font-medium">{bookIsbn}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{getStockText(book)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs bg-muted rounded-full">{categoryName}</span>
                <span className="px-2 py-1 text-xs bg-muted rounded-full">
                  {isInStock(book) ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{bookTitle}</h1>
              <p className="text-xl text-muted-foreground mt-1">{bookAuthor}</p>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold">${bookPrice}</p>
              <div
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  isInStock(book)
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {isInStock(book)
                  ? `${getAvailableQuantity(book)} available` 
                  : "Out of Stock"}
              </div>
            </div>

            <div className="flex gap-4 mt-2">
              <AddToCartButton book={book} />
              <WishlistButton book={book} />
            </div>

            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-muted-foreground">{bookDescription}</p>
            </div>

            {relatedBooks.length > 0 && (
              <div className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold">You might also like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedBooks.map((relatedBook) => (
                    <Link key={relatedBook.id} href={`/books/${relatedBook.id}`} className="group">
                      <div className="aspect-[3/4] relative bg-muted rounded-lg overflow-hidden mb-2">
                        <Image
                          src={relatedBook.imageUrl || relatedBook.image || relatedBook.thumbnail || "/placeholder.svg?height=300&width=225"}
                          alt={relatedBook.title || relatedBook.name || "Book Cover"}
                          width={225}
                          height={300}
                          className="object-cover h-full w-full group-hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {relatedBook.title || relatedBook.name || "Untitled Book"}
                      </h3>
                      <p className="text-xs text-muted-foreground">{relatedBook.author || "Unknown Author"}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error(`Error rendering book page for ID ${params.id}:`, error);
    notFound();
  }
}

