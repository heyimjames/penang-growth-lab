"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { BlogCategory, blogCategories } from "@/lib/blog"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  currentCategory?: BlogCategory | null
}

export function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (category: BlogCategory | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }
    params.delete("page")
    router.push(`/blog?${params.toString()}`)
  }

  const categories = Object.values(blogCategories)

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
      <button
        onClick={() => handleCategoryChange(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
          !currentCategory
            ? "bg-forest-500 text-white"
            : "bg-stone-100 dark:bg-stone-800 text-foreground hover:bg-stone-200 dark:hover:bg-stone-700"
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            currentCategory === category.id
              ? "bg-forest-500 text-white"
              : "bg-stone-100 dark:bg-stone-800 text-foreground hover:bg-stone-200 dark:hover:bg-stone-700"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
