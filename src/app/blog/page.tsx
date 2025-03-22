import { PostCard } from "@/components/post-card";
import { MainNav } from "@/components/main-nav";
import { getPosts } from "@/lib/actions/posts";

export const metadata = {
  title: "Blog | Markdown Blog",
  description: "Read all our blog posts",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground">
            Read all our latest posts and articles
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found.</p>
          </div>
        )}
      </div>
    </>
  );
}
