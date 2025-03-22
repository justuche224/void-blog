import Link from "next/link"
import { getPosts } from "@/lib/data"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Markdown Blog</h1>
        <p className="text-muted-foreground mb-6">A beautiful blog built with Next.js, Drizzle, and Tailwind</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/blog">All Posts</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 6).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {posts.length > 6 && (
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}

