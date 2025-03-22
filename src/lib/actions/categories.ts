"use server";

import { db } from "@/db";
import { categories, type Category } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugifyString } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCategories(): Promise<Category[]> {
  return db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  return db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });
}

// Admin actions

export async function createCategory(name: string, description?: string) {
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
  // Delete category (cascade will handle relationships)
  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}
