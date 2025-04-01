import { getBooks, getAllCategories } from "@/lib/data"
import { BookGrid } from "@/components/book-grid"

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  // Convert searchParams to regular variables first
  const category = searchParams.category
  const searchQuery = searchParams.search

  const books = await getBooks()
  
  // Get categories for name lookup
  const categories = await getAllCategories()

  // Filter books by category if provided
  const filteredBooks = category 
    ? books.filter((book) => {
        // Check if category parameter is a category ID
        if (!isNaN(Number(category)) && book.category_id) {
          return book.category_id.toString() === category
        }
        // Otherwise filter by category name
        return book.category === category
      }) 
    : books

  // Filter books by search query if provided
  const searchedBooks = searchQuery
    ? filteredBooks.filter(
        (book) =>
          (book.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (book.author?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
      )
    : filteredBooks

  // Get category name for display (if we're filtering by category)
  let displayCategory = category
  if (category && !isNaN(Number(category))) {
    const categoryObj = categories.find(cat => cat.id.toString() === category)
    if (categoryObj) {
      displayCategory = categoryObj.name
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {category 
              ? `${displayCategory} Books` 
              : searchQuery 
                ? `Search Results: "${searchQuery}"` 
                : "All Books"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {searchedBooks.length} {searchedBooks.length === 1 ? "book" : "books"} found
          </p>
        </div>

        {searchedBooks.length > 0 ? (
          <BookGrid books={searchedBooks} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

