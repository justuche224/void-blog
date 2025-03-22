"use server";

import { db } from "@/db";
import { tags, type Tag } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTags(): Promise<Tag[]> {
  return db.query.tags.findMany({
    orderBy: (tags, { asc }) => [asc(tags.name)],
  });
}

export async function getTagBySlug(slug: string): Promise<Tag | undefined> {
  return db.query.tags.findFirst({
    where: eq(tags.slug, slug),
  });
}
