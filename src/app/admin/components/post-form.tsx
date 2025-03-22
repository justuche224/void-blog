"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { Category } from "@/db/schema";

interface PostFormProps {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  defaultValues?: {
    title: string;
    content: string;
    coverImage: string;
    excerpt: string;
    categories: string[];
    tags: string;
    metaTitle: string;
    metaDescription: string;
  };
}

export function PostForm({
  action,
  categories,
  defaultValues = {
    title: "",
    content: "",
    coverImage: "",
    excerpt: "",
    categories: [],
    tags: "",
    metaTitle: "",
    metaDescription: "",
  },
}: PostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(defaultValues.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await action(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={defaultValues.title}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            name="coverImage"
            type="url"
            placeholder="https://example.com/image.jpg"
            defaultValue={defaultValues.coverImage}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            placeholder="Brief summary of the post"
            defaultValue={defaultValues.excerpt}
          />
        </div>

        <div className="grid gap-2">
          <Label>Content</Label>
          <Tabs defaultValue="write">
            <TabsList className="mb-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <Textarea
                id="content"
                name="content"
                rows={15}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content in Markdown"
                className="font-mono"
                required
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="border rounded-md p-4 min-h-[300px]">
                {content ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <p className="text-muted-foreground">
                    Nothing to preview yet...
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid gap-2">
          <Label>Categories</Label>
          <div className="grid gap-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  name="categories"
                  value={category.id.toString()}
                  defaultChecked={defaultValues.categories.includes(
                    category.id.toString()
                  )}
                />
                <Label htmlFor={`category-${category.id}`}>
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            placeholder="tag1, tag2, tag3"
            defaultValue={defaultValues.tags}
          />
          <p className="text-sm text-muted-foreground">
            Separate tags with commas
          </p>
        </div>

        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                placeholder="SEO title (leave empty to use post title)"
                defaultValue={defaultValues.metaTitle}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                rows={3}
                placeholder="SEO description (leave empty to use excerpt)"
                defaultValue={defaultValues.metaDescription}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Post"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
