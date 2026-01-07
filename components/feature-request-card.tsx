"use client"

import { Badge } from "@/components/ui/badge"
import { VoteButton } from "@/components/vote-button"
import { cn } from "@/lib/utils"
import type { FeatureRequest, FeatureRequestCategory, FeatureRequestStatus } from "@/lib/types"

interface FeatureRequestCardProps {
  request: FeatureRequest
  hasVoted: boolean
  isAuthenticated: boolean
  highlighted?: boolean
}

const categoryLabels: Record<FeatureRequestCategory, string> = {
  ui: "UI/UX",
  functionality: "Functionality",
  integration: "Integration",
  performance: "Performance",
  content: "Content",
}

const categoryColors: Record<FeatureRequestCategory, string> = {
  ui: "bg-lavender-100 text-lavender-700 dark:bg-lavender-900/30 dark:text-lavender-400",
  functionality: "bg-forest-100 text-forest-700 dark:bg-forest-900/30 dark:text-forest-400",
  integration: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  performance: "bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400",
  content: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-400",
}

const statusLabels: Record<FeatureRequestStatus, string> = {
  pending_review: "Under Review",
  approved: "Approved",
  planned: "Planned",
  in_progress: "In Progress",
  shipped: "Shipped",
  rejected: "Declined",
}

const statusColors: Record<FeatureRequestStatus, string> = {
  pending_review: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  planned: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  shipped: "bg-forest-100 text-forest-700 dark:bg-forest-900/30 dark:text-forest-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export function FeatureRequestCard({
  request,
  hasVoted,
  isAuthenticated,
  highlighted = false,
}: FeatureRequestCardProps) {
  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-lg border bg-white dark:bg-stone-900 transition-all",
        highlighted
          ? "border-peach-500 ring-2 ring-peach-200 dark:ring-peach-800"
          : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
      )}
    >
      {/* Vote button */}
      <div className="flex-shrink-0">
        <VoteButton
          featureRequestId={request.id}
          initialVoteCount={request.vote_count}
          initialHasVoted={hasVoted}
          disabled={!isAuthenticated}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2">
            {request.title || "Untitled Request"}
          </h3>
          <Badge
            variant="secondary"
            className={cn("flex-shrink-0 text-xs", statusColors[request.status])}
          >
            {statusLabels[request.status]}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {request.description || request.raw_request}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {request.category && (
            <Badge
              variant="secondary"
              className={cn("text-xs", categoryColors[request.category])}
            >
              {categoryLabels[request.category]}
            </Badge>
          )}

          {request.github_pr_url && (
            <a
              href={request.github_pr_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-forest-600 hover:text-forest-700 dark:text-forest-400 hover:underline"
            >
              View PR
            </a>
          )}

          <span className="text-xs text-muted-foreground ml-auto">
            {new Date(request.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  )
}
