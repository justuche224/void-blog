import { notFound } from "next/navigation";
import { CategoryForm } from "@/app/admin/components/category-form";
import { getCategories, updateCategory } from "@/lib/actions/categories";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "Edit Category | Admin Dashboard",
  description: "Edit an existing category",
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const categoryId = Number.parseInt(id);
  const categories = await getCategories();
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  async function handleUpdateCategory(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    await updateCategory(categoryId, name, description);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Edit Category: {category.name}
      </h1>
      <div className="border rounded-md p-4">
        <CategoryForm
          action={handleUpdateCategory}
          defaultValues={{
            name: category.name,
            description: category.description || "",
          }}
        />
      </div>
    </div>
  );
}
