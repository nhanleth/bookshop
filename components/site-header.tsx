import Link from "next/link"
import { getSession } from "@/lib/auth"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { BookOpen, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export async function SiteHeader() {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10 flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold font-heading">LuzLit Bookshop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <MainNav />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Hi, {session.name}</span>
                {session.role === "admin" && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                <form action="/api/logout" method="POST">
                  <Button variant="outline" size="sm" type="submit">
                    Logout
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 h-full">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="font-bold">LuzLit Bookshop</span>
                  </Link>
                </div>

                <nav className="flex flex-col gap-4">
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                    Home
                  </Link>
                  <Link href="/books" className="text-lg font-medium hover:text-primary transition-colors">
                    Books
                  </Link>
                  <Link href="/cart" className="text-lg font-medium hover:text-primary transition-colors">
                    Cart
                  </Link>
                  <Link href="/account" className="text-lg font-medium hover:text-primary transition-colors">
                    Account
                  </Link>
                </nav>

                <div className="mt-auto">
                  {session ? (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground">Signed in as {session.name}</p>
                      {session.role === "admin" && (
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/admin">Admin Dashboard</Link>
                        </Button>
                      )}
                      <form action="/api/logout" method="POST">
                        <Button variant="outline" type="submit" className="w-full">
                          Logout
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

