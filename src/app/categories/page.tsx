import Link from "next/link"
import { getCategories } from "@/lib/data"
import { MainNav } from "@/components/main-nav"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Categories | Markdown Blog",
  description: "Browse all categories",
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Categories</h1>
          <p className="text-muted-foreground">Browse all categories</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                {category.description && (
                  <CardContent>
                    <p className="text-muted-foreground">{category.description}</p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories found.</p>
          </div>
        )}
      </div>
    </>
  )
}

