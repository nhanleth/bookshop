import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Chatbot } from "@/components/chatbot"
import ErrorBoundary from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"

// Font configuration with display swap for better performance
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "LuzLit Bookshop",
    template: "%s | LuzLit Bookshop",
  },
  description: "Illuminating minds through literature",
  keywords: ["books", "bookstore", "reading", "literature", "fiction", "non-fiction", "education"],
  authors: [{ name: "LuzLit Bookshop" }],
  creator: "LuzLit Bookshop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luzlit-bookshop.com",
    title: "LuzLit Bookshop",
    description: "Illuminating minds through literature",
    siteName: "LuzLit Bookshop",
  },
  twitter: {
    card: "summary_large_image",
    title: "LuzLit Bookshop",
    description: "Illuminating minds through literature",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Add meta tags for better performance */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <ErrorBoundary>
              <main className="flex-1">{children}</main>
            </ErrorBoundary>
            <SiteFooter />
            <Chatbot />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'