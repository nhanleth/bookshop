export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">About LuzLit Bookshop</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          Welcome to LuzLit Bookshop, where we believe in the transformative power of literature. Our mission is to
          connect readers with books that inspire, educate, and entertain.
        </p>
        <p>
          Founded in 2020, LuzLit Bookshop has grown from a small corner store to a beloved community hub for book
          lovers of all ages. Our carefully curated collection spans across genres, from timeless classics to
          contemporary bestsellers.
        </p>
        <p>
          At LuzLit, we're more than just a bookstore. We're a gathering place for ideas, a sanctuary for imagination,
          and a catalyst for meaningful conversations.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Promoting literacy and a love for reading</li>
          <li>Supporting diverse voices and perspectives</li>
          <li>Building community through shared stories</li>
          <li>Providing exceptional customer service</li>
          <li>Creating a welcoming space for all book enthusiasts</li>
        </ul>
      </div>
    </div>
  )
}

