"use client"

import { useState, useTransition } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toggleVote } from "@/lib/actions/feature-requests"

interface VoteButtonProps {
  featureRequestId: string
  initialVoteCount: number
  initialHasVoted: boolean
  disabled?: boolean
}

export function VoteButton({
  featureRequestId,
  initialVoteCount,
  initialHasVoted,
  disabled = false,
}: VoteButtonProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [hasVoted, setHasVoted] = useState(initialHasVoted)
  const [isPending, startTransition] = useTransition()

  const handleVote = () => {
    if (disabled) return

    // Optimistic update
    const newHasVoted = !hasVoted
    setHasVoted(newHasVoted)
    setVoteCount((prev) => prev + (newHasVoted ? 1 : -1))

    startTransition(async () => {
      const result = await toggleVote(featureRequestId)
      if (!result.success) {
        // Revert on error
        setHasVoted(!newHasVoted)
        setVoteCount((prev) => prev + (newHasVoted ? -1 : 1))
      } else {
        // Use server value
        setVoteCount(result.newCount)
        setHasVoted(result.voted)
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleVote}
      disabled={disabled || isPending}
      className={cn(
        "flex flex-col items-center gap-0.5 h-auto py-2 px-3 min-w-[48px]",
        hasVoted && "border-forest-500 bg-forest-50 text-forest-600 dark:bg-forest-900/30 dark:border-forest-600"
      )}
    >
      <ChevronUp
        className={cn(
          "w-4 h-4 transition-transform",
          hasVoted && "text-forest-600 dark:text-forest-400",
          isPending && "animate-pulse"
        )}
      />
      <span className={cn("text-sm font-semibold", hasVoted && "text-forest-600 dark:text-forest-400")}>
        {voteCount}
      </span>
    </Button>
  )
}
