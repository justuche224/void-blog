import { notFound } from "next/navigation"
import { getPostsByCategory, getCategoryBySlug } from "@/lib/data"
import { PostCard } from "@/components/post-card"
import { MainNav } from "@/components/main-nav"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const posts = await getPostsByCategory(params.slug)

  return (
    <>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Category: {category.name}</h1>
          {category.description && <p className="text-muted-foreground">{category.description}</p>}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found in this category.</p>
          </div>
        )}
      </div>
    </>
  )
}

