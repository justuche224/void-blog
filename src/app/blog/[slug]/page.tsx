import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { MainNav } from "@/components/main-nav";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/actions/posts";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: post.coverImage
      ? {
          images: [
            {
              url: post.coverImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
        }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <MainNav />
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <time dateTime={post.createdAt.toISOString()}>
              {formatDate(post.createdAt)}
            </time>
          </div>
          {post.coverImage && (
            <div className="relative h-[400px] w-full mb-8">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.categories.map((category) => (
              <Badge key={category.id} variant="secondary">
                <Link href={`/category/${category.slug}`}>{category.name}</Link>
              </Badge>
            ))}
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                <Link href={`/tag/${tag.slug}`}>#{tag.name}</Link>
              </Badge>
            ))}
          </div>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </>
  );
}
