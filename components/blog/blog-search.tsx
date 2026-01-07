"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BlogSearchProps {
  className?: string
}

export function BlogSearch({ className }: BlogSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")

  useEffect(() => {
    setQuery(searchParams.get("q") || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set("q", query.trim())
    } else {
      params.delete("q")
    }
    params.delete("page")
    router.push(`/blog?${params.toString()}`)
  }

  const clearSearch = () => {
    setQuery("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    params.delete("page")
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className={cn("relative", className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="w-full h-12 pl-12 pr-12 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </form>
  )
}
