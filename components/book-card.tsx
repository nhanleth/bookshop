import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/lib/db-schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  // Handle the title, may come from either name or title property
  const title = book.title || book.name || "Untitled Book";
  // Handle author
  const author = book.author || "Unknown Author";
  // Handle price
  const price = typeof book.price === "number" ? book.price : 0;

  // Handle image URL with NEXT_PUBLIC_SITE_URL/storage format for API images
  let imageUrl = book.imageUrl || book.image || book.thumbnail || "";

  // If the image URL is a relative path (not starting with http), prepend the SITE_URL/storage
  // if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {

  // }
  // const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  // imageUrl = `${siteUrl}/storage/${imageUrl}`;
  imageUrl = imageUrl.replaceAll("/products/", "/storage/products/");
  // Default placeholder if no image
  imageUrl = imageUrl || "/placeholder.svg?height=400&width=300";

  return (
    <Card className="overflow-hidden h-full flex flex-col group card-hover">
      <div className="aspect-[3/4] relative bg-muted overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill={true}
          className="object-cover transition-all duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Button variant="secondary" size="sm" className="w-full" asChild>
            <Link
              href={`/books/${book.id}`}
              className="flex items-center justify-center gap-1"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
        </div>
      </div>
      <CardContent className="p-4 flex-1">
        <div className="space-y-1">
          <Link href={`/books/${book.id}`} className="hover:underline">
            <h3 className="font-semibold leading-tight line-clamp-1">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{author}</p>
          <p className="font-medium">${price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/books/${book.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
