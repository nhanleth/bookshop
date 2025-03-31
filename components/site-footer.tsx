import Link from "next/link"
import { BookOpen, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest book releases, special offers, and reading recommendations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end lg:items-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 border rounded-md w-full sm:w-auto flex-1 lg:max-w-xs"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">LuzLit Bookshop</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Illuminating minds through literature since 2020. We offer a curated selection of books across all genres.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" asChild>
                <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" asChild>
                <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" asChild>
                <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/books?category=Fiction"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=Non-Fiction"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Non-Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=Fantasy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fantasy
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=Thriller"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Thriller
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=Education"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Education
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Book Street, Literary Lane
                  <br />
                  Reading, RG1 2LT
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">info@luzlit.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 py-6">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} LuzLit Bookshop. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

