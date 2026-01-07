"use client"

import { useState } from "react"
import { FeatureRequestCard } from "@/components/feature-request-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { FeatureRequest, FeatureRequestStatus } from "@/lib/types"

interface FeatureRequestListProps {
  requests: FeatureRequest[]
  userVotes: string[]
  isAuthenticated: boolean
  highlightedId?: string
}

type FilterOption = "all" | FeatureRequestStatus
type SortOption = "votes" | "newest"

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "shipped", label: "Shipped" },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "votes", label: "Most Voted" },
  { value: "newest", label: "Newest" },
]

export function FeatureRequestList({
  requests,
  userVotes,
  isAuthenticated,
  highlightedId,
}: FeatureRequestListProps) {
  const [filter, setFilter] = useState<FilterOption>("all")
  const [sort, setSort] = useState<SortOption>("votes")

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    if (filter === "all") return true
    return request.status === filter
  })

  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sort === "votes") {
      return b.vote_count - a.vote_count
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  // Move highlighted to top if present
  if (highlightedId) {
    const highlightedIndex = sortedRequests.findIndex((r) => r.id === highlightedId)
    if (highlightedIndex > 0) {
      const [highlighted] = sortedRequests.splice(highlightedIndex, 1)
      sortedRequests.unshift(highlighted)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(option.value)}
              className={cn(
                filter === option.value && "bg-forest-500 hover:bg-forest-600"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex gap-1">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sort === option.value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSort(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Request count */}
      <p className="text-sm text-muted-foreground">
        {sortedRequests.length} feature request{sortedRequests.length !== 1 && "s"}
        {filter !== "all" && ` (filtered)`}
      </p>

      {/* Request list */}
      {sortedRequests.length > 0 ? (
        <div className="space-y-3">
          {sortedRequests.map((request) => (
            <FeatureRequestCard
              key={request.id}
              request={request}
              hasVoted={userVotes.includes(request.id)}
              isAuthenticated={isAuthenticated}
              highlighted={request.id === highlightedId}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <p>No feature requests found</p>
          {filter !== "all" && (
            <Button
              variant="link"
              onClick={() => setFilter("all")}
              className="mt-2"
            >
              View all requests
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
