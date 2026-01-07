"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
  variant?: "mobile" | "desktop" | "both"
}

export function TableOfContents({ content, variant = "both" }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const items: TocItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      items.push({ id, text, level })
    }

    setHeadings(items)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0px -80% 0px" }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      })
      setIsExpanded(false)
    }
  }

  if (headings.length === 0) return null

  const showMobile = variant === "mobile" || variant === "both"
  const showDesktop = variant === "desktop" || variant === "both"

  return (
    <>
      {/* Mobile collapsible */}
      {showMobile && (
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-lg text-sm font-medium"
          >
            <span>Jump to section</span>
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")}
            />
          </button>
          {isExpanded && (
            <nav className="mt-2 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
              <ul className="space-y-2">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={cn(
                        "text-sm text-left w-full hover:text-forest-600 dark:hover:text-forest-400 transition-colors",
                        heading.level === 3 && "pl-4",
                        activeId === heading.id
                          ? "text-forest-600 dark:text-forest-400 font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}

      {/* Desktop sticky sidebar */}
      {showDesktop && (
        <nav>
          <ul className="space-y-2 border-l border-stone-200 dark:border-stone-700">
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    "block text-sm text-left w-full py-1 border-l-2 -ml-[2px] transition-colors",
                    heading.level === 3 && "pl-8",
                    heading.level === 2 && "pl-4",
                    activeId === heading.id
                      ? "border-forest-500 text-forest-600 dark:text-forest-400 font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-stone-300"
                  )}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  )
}
