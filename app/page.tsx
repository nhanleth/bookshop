"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getBooks } from "@/lib/data"
import { BookGrid } from "@/components/book-grid"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Sparkles, TrendingUp, Award, Users } from "lucide-react"
import type { Book } from "@/lib/db-schema"

// Static data for categories and features
const features = [
  {
    title: "Curated Selection",
    description: "Handpicked books across all genres to ensure quality reading experiences",
    icon: <Award className="h-10 w-10 text-primary" />,
  },
  {
    title: "Expert Recommendations",
    description: "Personalized book suggestions from our team of avid readers",
    icon: <TrendingUp className="h-10 w-10 text-primary" />,
  },
  {
    title: "Community Events",
    description: "Book clubs, author signings, and reading groups to connect with fellow book lovers",
    icon: <Users className="h-10 w-10 text-primary" />,
  },
]

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const allBooks = await getBooks()
        setBooks(allBooks)

        // Set featured books
        setFeaturedBooks(allBooks.slice(0, 4))

        // Filter books by category
        const fictionBooks = allBooks.filter((book) => book.category === "Fiction")
        const fantasyBooks = allBooks.filter((book) => book.category === "Fantasy")
        const educationBooks = allBooks.filter((book) => book.category === "Education")
        const thrillerBooks = allBooks.filter((book) => book.category === "Thriller")

        // Set categories
        setCategories([
          {
            name: "Fiction",
            description: "Immerse yourself in captivating stories and rich narratives",
            count: fictionBooks.length,
            icon: <BookOpen className="h-6 w-6 text-primary" />,
            color: "bg-blue-50 dark:bg-blue-900/20",
            borderColor: "border-blue-200 dark:border-blue-800",
          },
          {
            name: "Fantasy",
            description: "Explore magical worlds and extraordinary adventures",
            count: fantasyBooks.length,
            icon: <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
            color: "bg-emerald-50 dark:bg-emerald-900/20",
            borderColor: "border-emerald-200 dark:border-emerald-800",
          },
          {
            name: "Education",
            description: "Expand your knowledge and develop new skills",
            count: educationBooks.length,
            icon: <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
            color: "bg-amber-50 dark:bg-amber-900/20",
            borderColor: "border-amber-200 dark:border-amber-800",
          },
          {
            name: "Thriller",
            description: "Experience suspense and excitement with every page",
            count: thrillerBooks.length,
            icon: <BookOpen className="h-6 w-6 text-red-600 dark:text-red-400" />,
            color: "bg-red-50 dark:bg-red-900/20",
            borderColor: "border-red-200 dark:border-red-800",
          },
        ])

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 relative overflow-hidden">
        {/* Background gradient with light/dark mode support */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950 dark:to-blue-950 opacity-90"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-200 dark:bg-primary-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 dark:opacity-20 animate-blob"></div>
          <div className="absolute top-80 -right-24 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4 animate-slide-up">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-sm font-medium text-primary dark:text-primary-foreground mb-2 w-fit">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                New arrivals every week
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900 dark:text-white font-heading">
                  Illuminate Your Mind with Books
                </h1>
                <p className="max-w-[600px] text-gray-700 dark:text-gray-200 md:text-xl">
                  LuzLit Bookshop offers a curated collection of books across all genres. From bestsellers to rare
                  finds, we have something to light up every reader's imagination.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button size="lg" asChild className="rounded-full">
                  <Link href="/books">Browse Books</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full"
                >
                  <Link href="/signup">Join Now</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[500px] aspect-[4/3] relative animate-slide-up animation-delay-2000">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-blue-500/30 dark:from-primary/20 dark:to-blue-500/20 blur-xl transform -rotate-6 scale-105"></div>
              <Image
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2940&auto=format&fit=crop"
                alt="Books on shelves in a cozy library with warm lighting"
                width={800}
                height={600}
                className="object-cover rounded-xl shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Why Choose LuzLit?</h2>
            <p className="text-muted-foreground">
              We're more than just a bookstore. We're a community of book lovers dedicated to sharing the joy of
              reading.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-background border shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-3 rounded-full bg-primary/10 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="section">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="section-title">Featured Books</h2>
              <p className="text-muted-foreground">Discover our handpicked selection of must-read books</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-px flex-1 bg-border"></div>
              <Button variant="link" asChild className="flex items-center gap-1">
                <Link href="/books">
                  View All Books
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <BookGrid books={featuredBooks} />
          </div>
        </div>
      </section>

      {/* Enhanced Popular Categories Section */}
      <section className="section bg-muted/50">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="section-title">Popular Categories</h2>
              <p className="text-muted-foreground">Explore our extensive collection by category</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/books?category=${category.name}`}
                  className={`group relative overflow-hidden rounded-xl border ${category.borderColor} ${category.color} shadow-sm hover:shadow-md transition-all duration-300 p-6`}
                >
                  <div className="flex flex-col h-full min-h-[180px] justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90">{category.icon}</div>
                        <h3 className="text-xl font-bold">{category.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm">
                        {category.count} books
                      </span>
                      <span className="inline-flex items-center text-sm font-medium text-primary">
                        Browse
                        <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">What Our Readers Say</h2>
            <p className="text-muted-foreground">
              Don't just take our word for it. Here's what our community has to say about LuzLit Bookshop.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "LuzLit has completely transformed my reading experience. Their recommendations are always spot-on!",
                author: "Sarah J., Book Lover",
              },
              {
                quote:
                  "The curated selection is amazing. I've discovered so many new authors I wouldn't have found otherwise.",
                author: "Michael T., Avid Reader",
              },
              {
                quote:
                  "Their book club meetings are the highlight of my month. Great books, great discussions, great people.",
                author: "Emma R., Community Member",
              },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 rounded-lg bg-background border shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col h-full">
                  <div className="mb-4 text-primary">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className="text-lg">
                          ★
                        </span>
                      ))}
                  </div>
                  <blockquote className="flex-1 mb-4 italic text-muted-foreground">"{testimonial.quote}"</blockquote>
                  <p className="font-medium">{testimonial.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Reading Journey?</h2>
              <p className="text-primary-foreground/80 mb-6">
                Join our community of book lovers today and discover your next favorite read.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/books">Browse Collection</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
            <div className="w-full max-w-md">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2574&auto=format&fit=crop"
                  alt="Person reading a book in a cozy environment"
                  width={800}
                  height={600}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

