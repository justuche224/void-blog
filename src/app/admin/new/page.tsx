import { PostForm } from "@/app/admin/components/post-form";
import { getCategories } from "@/lib/actions/categories";
import { createPost } from "@/lib/actions/posts";

export const metadata = {
  title: "New Post | Admin Dashboard",
  description: "Create a new blog post",
};

export default async function NewPostPage() {
  const categories = await getCategories();

  async function handleCreatePost(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const coverImage = formData.get("coverImage") as string;
    const excerpt = formData.get("excerpt") as string;
    const categories = formData.getAll("categories") as string[];
    const tags = formData.get("tags") as string;
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;

    await createPost({
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
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <PostForm action={handleCreatePost} categories={categories} />
    </div>
  );
}
