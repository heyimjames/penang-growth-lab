"use client"

import * as React from "react"
import Link from "next/link"
import { Icon } from "@/lib/icons"
import { ArrowRight01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"
import { tools, toolCategories, type ToolCategoryId } from "@/lib/tools-data"

function ToolCard({ tool }: { tool: typeof tools[number] }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col w-72 shrink-0 p-5 mx-3 bg-white dark:bg-card border border-forest-100 dark:border-border rounded-lg hover:border-forest-200 dark:hover:border-forest-400 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-lg bg-forest-50 dark:bg-forest-900/30 border border-forest-100 dark:border-forest-800 flex items-center justify-center">
          <Icon icon={tool.icon} size={20} className="text-forest-500 dark:text-forest-400" />
        </div>
        <span className="text-xs font-medium text-forest-400 dark:text-forest-500 uppercase tracking-wide">
          {toolCategories.find((c) => c.id === tool.category)?.name.split(" ")[0] || tool.category}
        </span>
      </div>
      <h3 className="text-base font-semibold text-foreground font-display mb-1 group-hover:text-forest-600 dark:group-hover:text-forest-300 transition-colors">
        {tool.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {tool.shortDescription}
      </p>
    </Link>
  )
}

function CategoryPill({
  category,
  isSelected,
  onClick,
}: {
  category: { id: ToolCategoryId | "all"; name: string; icon?: typeof tools[0]["icon"] }
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border transition-all",
        isSelected
          ? "bg-forest-500 dark:bg-forest-600 text-white border-forest-500 dark:border-forest-600"
          : "bg-white dark:bg-card text-muted-foreground border-forest-200 dark:border-forest-700 hover:border-forest-300 dark:hover:border-forest-600 hover:text-foreground"
      )}
    >
      {category.icon && (
        <Icon
          icon={category.icon}
          size={16}
          className={isSelected ? "text-white" : "text-forest-400 dark:text-forest-500"}
        />
      )}
      {category.name}
    </button>
  )
}

export function ToolsShowcase() {
  const [selectedCategories, setSelectedCategories] = React.useState<Set<ToolCategoryId | "all">>(
    new Set(["all"])
  )

  const toggleCategory = (categoryId: ToolCategoryId | "all") => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev)
      if (categoryId === "all") {
        return new Set(["all"])
      }
      newSet.delete("all")
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
        if (newSet.size === 0) {
          return new Set(["all"])
        }
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  // Filter tools based on selected categories
  const filteredTools = React.useMemo(() => {
    if (selectedCategories.has("all")) {
      return tools
    }
    return tools.filter((tool) => selectedCategories.has(tool.category))
  }, [selectedCategories])

  // Split tools into two rows for dual ticker
  const midpoint = Math.ceil(filteredTools.length / 2)
  const topRowTools = filteredTools.slice(0, midpoint)
  const bottomRowTools = filteredTools.slice(midpoint)

  // Duplicate tools for seamless loop
  const duplicatedTopRow = [...topRowTools, ...topRowTools, ...topRowTools]
  const duplicatedBottomRow = [...bottomRowTools, ...bottomRowTools, ...bottomRowTools]

  return (
    <section className="py-16 md:py-24 border-b border-forest-100 dark:border-border overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs text-forest-400 font-mono tracking-widest mb-3">
              FREE TOOLS — NO SIGN-UP REQUIRED
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display">
              Your Rights, Decoded
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Not sure where to start? Our free tools help you understand UK consumer law, check your eligibility, and calculate what you&apos;re owed — all before you lift a finger.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-400" />
                Instant answers
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-400" />
                No account needed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-400" />
                Built on UK law
              </span>
            </div>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors shrink-0"
          >
            View all {tools.length} tools
            <Icon icon={ArrowRight01Icon} size={16} />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <CategoryPill
            category={{ id: "all", name: "All Tools" }}
            isSelected={selectedCategories.has("all")}
            onClick={() => toggleCategory("all")}
          />
          {toolCategories.map((category) => (
            <CategoryPill
              key={category.id}
              category={category}
              isSelected={selectedCategories.has(category.id)}
              onClick={() => toggleCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {/* Dual Ticker Container */}
      <div className="relative space-y-6">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Top Row - Scrolling Left (slower) */}
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-tools-ticker-slow">
            {duplicatedTopRow.map((tool, index) => (
              <ToolCard key={`top-a-${tool.href}-${index}`} tool={tool} />
            ))}
          </div>
          <div className="flex shrink-0 animate-tools-ticker-slow">
            {duplicatedTopRow.map((tool, index) => (
              <ToolCard key={`top-b-${tool.href}-${index}`} tool={tool} />
            ))}
          </div>
        </div>

        {/* Bottom Row - Scrolling Right (slower) */}
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-tools-ticker-slow-reverse">
            {duplicatedBottomRow.map((tool, index) => (
              <ToolCard key={`bottom-a-${tool.href}-${index}`} tool={tool} />
            ))}
          </div>
          <div className="flex shrink-0 animate-tools-ticker-slow-reverse">
            {duplicatedBottomRow.map((tool, index) => (
              <ToolCard key={`bottom-b-${tool.href}-${index}`} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
