"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCategory } from "@/lib/actions/categories";

interface CategoryFormProps {
  action?: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name: string;
    description: string;
  };
}

export function CategoryForm({
  action = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    await createCategory(name, description);
  },
  defaultValues = {
    name: "",
    description: "",
  },
}: CategoryFormProps) {
  // const router = useRouter();
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
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues.name}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues.description}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Category"}
      </Button>
    </form>
  );
}
