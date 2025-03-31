"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, ShoppingCart, User, Heart } from "lucide-react"
import { useCartStore } from "@/lib/cart"
import { useWishlistStore } from "@/lib/wishlist"
import { useEffect, useState } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function MainNav() {
  const pathname = usePathname()
  const cartItems = useCartStore((state) => state.cart.items)
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Handle wishlist items count with hydration
  const [mounted, setMounted] = useState(false)
  const wishlistItems = useWishlistStore((state) => state.items)
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    setMounted(true)
    setWishlistCount(wishlistItems.length)
  }, [wishlistItems.length])

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} active={pathname === "/"}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Books</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    href="/books"
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary/5 p-6 no-underline outline-none focus:shadow-md"
                  >
                    <Book className="h-6 w-6 text-primary" />
                    <div className="mb-2 mt-4 text-lg font-medium">All Books</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Browse our complete collection of books across all genres
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/books?category=Fiction"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Fiction</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Novels, short stories, and literary works
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/books?category=Non-Fiction"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Non-Fiction</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Biographies, history, science, and more
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/books?category=Education"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Education</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Textbooks, learning resources, and academic materials
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/books?category=Fantasy"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Fantasy</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Magical worlds and epic adventures
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/cart" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} active={pathname === "/cart"}>
              <span className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/wishlist" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} active={pathname === "/wishlist"}>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>Wishlist</span>
                {mounted && wishlistCount > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {wishlistCount}
                  </span>
                )}
              </span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/account" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              active={pathname === "/account" || pathname.startsWith("/account/")}
            >
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Account</span>
              </span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

