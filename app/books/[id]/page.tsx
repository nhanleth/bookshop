import { notFound } from "next/navigation"
import Image from "next/image"
import { getBookById, getBooks } from "@/lib/data"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { WishlistButton } from "@/components/wishlist-button"
import Link from "next/link"

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id)

  if (!book) {
    notFound()
  }

  // Get related books from the same category
  const allBooks = await getBooks()
  const relatedBooks = allBooks
    .filter((relatedBook) => relatedBook.category === book.category && relatedBook.id !== book.id)
    .slice(0, 4)

  return (
    <div className="container py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
        <div className="flex flex-col gap-6">
          <div className="aspect-[3/4] relative bg-muted rounded-xl overflow-hidden shadow-lg group">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/5 dark:to-primary/10"></div>

            <Image
              src={book.imageUrl || "/placeholder.svg?height=600&width=450"}
              alt={book.title}
              width={450}
              height={600}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />

            {/* Overlay with book info on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h2 className="text-white text-xl font-bold">{book.title}</h2>
              <p className="text-white/80 text-sm">{book.author}</p>
            </div>
          </div>

          {/* Book details cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{book.category}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="font-medium">{new Date(book.publishedDate).getFullYear()}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">ISBN</p>
              <p className="font-medium">{book.isbn}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{book.stock > 0 ? `In Stock (${book.stock})` : "Out of Stock"}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs bg-muted rounded-full">{book.category}</span>
              <span className="px-2 py-1 text-xs bg-muted rounded-full">
                {book.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{book.title}</h1>
            <p className="text-xl text-muted-foreground mt-1">{book.author}</p>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold">${book.price.toFixed(2)}</p>
            <div
              className={`px-2 py-1 rounded-full text-sm font-medium ${
                book.stock > 0
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {book.stock > 0 ? `${book.stock} available` : "Out of Stock"}
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <AddToCartButton book={book} />
            <WishlistButton book={book} />
          </div>

          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{book.description}</p>
          </div>

          {relatedBooks.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">You might also like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedBooks.map((relatedBook) => (
                  <Link key={relatedBook.id} href={`/books/${relatedBook.id}`} className="group">
                    <div className="aspect-[3/4] relative bg-muted rounded-lg overflow-hidden mb-2">
                      <Image
                        src={relatedBook.imageUrl || "/placeholder.svg?height=300&width=225"}
                        alt={relatedBook.title}
                        width={225}
                        height={300}
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {relatedBook.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{relatedBook.author}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

