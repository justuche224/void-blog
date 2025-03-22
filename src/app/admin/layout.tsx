import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Admin Dashboard | Markdown Blog",
  description: "Manage your blog posts, categories, and tags",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-bold">
              Admin Dashboard
            </Link>
          </div>
          <Button asChild>
            <Link href="/">View Site</Link>
          </Button>
        </div>
      </header>
      <div className="flex flex-col md:flex-row flex-1">
        <aside className="w-full md:w-64 border-r">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin">Posts</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/categories">Categories</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/new">New Post</Link>
            </Button>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

