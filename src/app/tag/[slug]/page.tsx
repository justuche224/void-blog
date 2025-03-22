import { notFound } from "next/navigation"
import { getPostsByTag, getTagBySlug } from "@/lib/data"
import { PostCard } from "@/components/post-card"
import { MainNav } from "@/components/main-nav"

interface TagPageProps {
  params: {
    slug: string
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = await getTagBySlug(params.slug)

  if (!tag) {
    notFound()
  }

  const posts = await getPostsByTag(params.slug)

  return (
    <>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Tag: #{tag.name}</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found with this tag.</p>
          </div>
        )}
      </div>
    </>
  )
}

