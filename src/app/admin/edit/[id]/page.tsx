import { notFound } from "next/navigation";
import { PostForm } from "@/app/admin/components/post-form";
import { getPosts, updatePost } from "@/lib/actions/posts";
import { getCategories } from "@/lib/actions/categories";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "Edit Post | Admin Dashboard",
  description: "Edit an existing blog post",
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const postId = Number.parseInt(id);
  const posts = await getPosts();
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    notFound();
  }

  const categories = await getCategories();

  async function handleUpdatePost(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const coverImage = formData.get("coverImage") as string;
    const excerpt = formData.get("excerpt") as string;
    const categories = formData.getAll("categories") as string[];
    const tags = formData.get("tags") as string;
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;

    await updatePost(postId, {
      title,
      content,
      coverImage: coverImage || undefined,
      excerpt: excerpt || undefined,
      categories,
      tags,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Post: {post.title}</h1>
      <PostForm
        action={handleUpdatePost}
        categories={categories}
        defaultValues={{
          title: post.title,
          content: post.content,
          coverImage: post.coverImage || "",
          excerpt: post.excerpt || "",
          categories: post.categories.map((c) => c.id.toString()),
          tags: post.tags.map((t) => t.name).join(", "),
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
        }}
      />
    </div>
  );
}
