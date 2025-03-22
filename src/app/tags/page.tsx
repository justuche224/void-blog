import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { Badge } from "@/components/ui/badge";
import { getTags } from "@/lib/actions/tags";

export const metadata = {
  title: "Tags | Markdown Blog",
  description: "Browse all tags",
};

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Tags</h1>
          <p className="text-muted-foreground">Browse all tags</p>
        </header>

        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link key={tag.id} href={`/tag/${tag.slug}`}>
              <Badge variant="outline" className="text-base py-2 px-4">
                #{tag.name}
              </Badge>
            </Link>
          ))}
        </div>

        {tags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tags found.</p>
          </div>
        )}
      </div>
    </>
  );
}
