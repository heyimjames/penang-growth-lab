"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page > 1) {
      params.set("page", page.toString())
    } else {
      params.delete("page")
    }
    router.push(`/blog?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  const pages: (number | "ellipsis")[] = []

  // Always show first page
  pages.push(1)

  // Show ellipsis if current page is far from start
  if (currentPage > 3) {
    pages.push("ellipsis")
  }

  // Show pages around current page
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }

  // Show ellipsis if current page is far from end
  if (currentPage < totalPages - 2) {
    pages.push("ellipsis")
  }

  // Always show last page
  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages)
  }

  return (
    <nav className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-full"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="icon"
              onClick={() => goToPage(page)}
              className={cn(
                "w-10 h-10 rounded-full",
                currentPage === page && "bg-forest-500 hover:bg-forest-600"
              )}
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-full"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </nav>
  )
}
