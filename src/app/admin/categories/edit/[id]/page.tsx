import { notFound } from "next/navigation"
import { getCategories, updateCategory } from "@/lib/data"
import { CategoryForm } from "@/app/admin/components/category-form"

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export const metadata = {
  title: "Edit Category | Admin Dashboard",
  description: "Edit an existing category",
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const categoryId = Number.parseInt(params.id)
  const categories = await getCategories()
  const category = categories.find((c) => c.id === categoryId)

  if (!category) {
    notFound()
  }

  async function handleUpdateCategory(formData: FormData) {
    "use server"

    const name = formData.get("name") as string
    const description = formData.get("description") as string

    await updateCategory(categoryId, name, description)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Category: {category.name}</h1>
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
  )
}

