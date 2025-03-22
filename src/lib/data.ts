import "server-only";
import { db } from "@/db";
import {
  posts,
  categories,
  tags,
  postCategories,
  postTags,
  type Post,
  type Category,
  type Tag,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugifyString } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type PostWithRelations = Post & {
  categories: Category[];
  tags: Tag[];
};

// Posts
export async function getPosts(): Promise<PostWithRelations[]> {
  "use server";
  const allPosts = await db.query.posts.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });

  const postsWithRelations: PostWithRelations[] = [];

  for (const post of allPosts) {
    const postCategoriesResult = await db
      .select()
      .from(postCategories)
      .where(eq(postCategories.postId, post.id))
      .leftJoin(categories, eq(postCategories.categoryId, categories.id));

    const postTagsResult = await db
      .select()
      .from(postTags)
      .where(eq(postTags.postId, post.id))
      .leftJoin(tags, eq(postTags.tagId, tags.id));

    const postCategoriesData = postCategoriesResult.map(
      (pc) => pc.categories as Category
    );
    const postTagsData = postTagsResult.map((pt) => pt.tags as Tag);

    postsWithRelations.push({
      ...post,
      categories: postCategoriesData,
      tags: postTagsData,
    });
  }

  return postsWithRelations;
}

export async function getPostBySlug(
  slug: string
): Promise<PostWithRelations | null> {
  "use server";
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  });

  if (!post) return null;

  const postCategoriesResult = await db
    .select()
    .from(postCategories)
    .where(eq(postCategories.postId, post.id))
    .leftJoin(categories, eq(postCategories.categoryId, categories.id));

  const postTagsResult = await db
    .select()
    .from(postTags)
    .where(eq(postTags.postId, post.id))
    .leftJoin(tags, eq(postTags.tagId, tags.id));

  const postCategoriesList = postCategoriesResult.map(
    (pc) => pc.categories as Category
  );
  const postTagsList = postTagsResult.map((pt) => pt.tags as Tag);

  return {
    ...post,
    categories: postCategoriesList,
    tags: postTagsList,
  };
}

export async function getPostsByCategory(
  categorySlug: string
): Promise<PostWithRelations[]> {
  "use server";
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, categorySlug),
  });

  if (!category) return [];

  const postCategoriesResult = await db
    .select()
    .from(postCategories)
    .where(eq(postCategories.categoryId, category.id))
    .leftJoin(posts, eq(postCategories.postId, posts.id));

  const postIds = postCategoriesResult
    .map((pc) => pc.posts?.id)
    .filter(Boolean) as number[];

  if (postIds.length === 0) return [];

  return getPosts().then((posts) =>
    posts.filter((post) => postIds.includes(post.id))
  );
}

export async function getPostsByTag(
  tagSlug: string
): Promise<PostWithRelations[]> {
  "use server";
  const tag = await db.query.tags.findFirst({
    where: eq(tags.slug, tagSlug),
  });

  if (!tag) return [];

  const postTagsResult = await db
    .select()
    .from(postTags)
    .where(eq(postTags.tagId, tag.id))
    .leftJoin(posts, eq(postTags.postId, posts.id));

  const postIds = postTagsResult
    .map((pt) => pt.posts?.id)
    .filter(Boolean) as number[];

  if (postIds.length === 0) return [];

  return getPosts().then((posts) =>
    posts.filter((post) => postIds.includes(post.id))
  );
}

// Categories
export async function getCategories(): Promise<Category[]> {
  "use server";
  return db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  "use server";
  return db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });
}

// Tags
export async function getTags(): Promise<Tag[]> {
  "use server";
  return db.query.tags.findMany({
    orderBy: (tags, { asc }) => [asc(tags.name)],
  });
}

export async function getTagBySlug(slug: string): Promise<Tag | undefined> {
  "use server";
  return db.query.tags.findFirst({
    where: eq(tags.slug, slug),
  });
}

// Admin actions
export type PostFormData = {
  title: string;
  content: string;
  coverImage?: string;
  excerpt?: string;
  categories: string[];
  tags: string;
  metaTitle?: string;
  metaDescription?: string;
};

export async function createPost(data: PostFormData) {
  "use server";
  const slug = slugifyString(data.title);

  // Insert post
  const [post] = await db
    .insert(posts)
    .values({
      title: data.title,
      slug,
      content: data.content,
      coverImage: data.coverImage || null,
      excerpt: data.excerpt || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    })
    .returning();

  // Process categories
  if (data.categories.length > 0) {
    const categoryIds = await Promise.all(
      data.categories.map(async (categoryId) => {
        return Number.parseInt(categoryId);
      })
    );

    await Promise.all(
      categoryIds.map((categoryId) =>
        db.insert(postCategories).values({
          postId: post.id,
          categoryId,
        })
      )
    );
  }

  // Process tags
  if (data.tags) {
    const tagNames = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    for (const tagName of tagNames) {
      // Check if tag exists
      let tag = await db.query.tags.findFirst({
        where: eq(tags.name, tagName),
      });

      // Create tag if it doesn't exist
      if (!tag) {
        const [newTag] = await db
          .insert(tags)
          .values({
            name: tagName,
            slug: slugifyString(tagName),
          })
          .returning();
        tag = newTag;
      }

      // Associate tag with post
      await db.insert(postTags).values({
        postId: post.id,
        tagId: tag.id,
      });
    }
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePost(id: number, data: PostFormData) {
  "use server";
  // Update post
  await db
    .update(posts)
    .set({
      title: data.title,
      content: data.content,
      coverImage: data.coverImage || null,
      excerpt: data.excerpt || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id));

  // Delete existing category relationships
  await db.delete(postCategories).where(eq(postCategories.postId, id));

  // Process categories
  if (data.categories.length > 0) {
    const categoryIds = data.categories.map((categoryId) =>
      Number.parseInt(categoryId)
    );

    await Promise.all(
      categoryIds.map((categoryId) =>
        db.insert(postCategories).values({
          postId: id,
          categoryId,
        })
      )
    );
  }

  // Delete existing tag relationships
  await db.delete(postTags).where(eq(postTags.postId, id));

  // Process tags
  if (data.tags) {
    const tagNames = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    for (const tagName of tagNames) {
      // Check if tag exists
      let tag = await db.query.tags.findFirst({
        where: eq(tags.name, tagName),
      });

      // Create tag if it doesn't exist
      if (!tag) {
        const [newTag] = await db
          .insert(tags)
          .values({
            name: tagName,
            slug: slugifyString(tagName),
          })
          .returning();
        tag = newTag;
      }

      // Associate tag with post
      await db.insert(postTags).values({
        postId: id,
        tagId: tag.id,
      });
    }
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slugifyString(data.title)}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePost(id: number) {
  "use server";
  // Delete post (cascade will handle relationships)
  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createCategory(name: string, description?: string) {
  "use server";
  const slug = slugifyString(name);

  await db.insert(categories).values({
    name,
    slug,
    description: description || null,
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(
  id: number,
  name: string,
  description?: string
) {
  "use server";
  await db
    .update(categories)
    .set({
      name,
      description: description || null,
    })
    .where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: number) {
  "use server";
  // Delete category (cascade will handle relationships)
  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}
