"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/lib/icons"
import { CoinsSwapIcon, ArrowRight01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { BuyCreditsDialog } from "@/components/buy-credits-dialog"

interface CreditsPromptProps {
  credits?: number
  variant?: "sidebar" | "mobile"
  className?: string
}

export function CreditsPrompt({ credits = 0, variant = "sidebar", className }: CreditsPromptProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const hasCredits = credits > 0
  const isLowCredits = credits > 0 && credits <= 1

  const getTriggerType = () => {
    if (!hasCredits) return "no_credits"
    if (isLowCredits) return "low_credits"
    return "buy_more"
  }

  if (variant === "mobile") {
    return (
      <>
        <div className={cn("px-4 py-3", className)}>
          <div className="rounded-2xl bg-gradient-to-br from-coral-50 to-peach-50 dark:from-coral-950/30 dark:to-peach-950/30 border border-coral-200/50 dark:border-coral-800/50 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-coral-500 text-white">
                <Icon icon={CoinsSwapIcon} size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {hasCredits ? `${credits} complaint${credits === 1 ? "" : "s"} remaining` : "No complaints remaining"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isLowCredits ? "Running low on credits" : hasCredits ? "Credits available" : "Purchase credits to continue"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDialogOpen(true)}
              className={cn(
                "flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full text-sm font-medium transition-colors",
                hasCredits && !isLowCredits
                  ? "bg-white dark:bg-background border border-coral-200 dark:border-coral-800 text-coral-600 dark:text-coral-400 hover:bg-coral-50 dark:hover:bg-coral-950/50"
                  : "bg-coral-500 hover:bg-coral-600 text-white"
              )}
            >
              <Icon icon={ArrowRight01Icon} size={16} />
              {hasCredits ? "Buy More Credits" : "Get Credits"}
            </button>
          </div>
        </div>

        <BuyCreditsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          currentCredits={credits}
          trigger={getTriggerType()}
        />
      </>
    )
  }

  // Sidebar variant (compact)
  return (
    <>
      <div className={cn("px-2 py-2", className)}>
        <div className="rounded-xl bg-gradient-to-br from-coral-50 to-peach-50 dark:from-coral-950/30 dark:to-peach-950/30 border border-coral-200/50 dark:border-coral-800/50 p-3">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-coral-500 text-white shrink-0">
              <Icon icon={CoinsSwapIcon} size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {hasCredits ? `${credits} complaint${credits === 1 ? "" : "s"} left` : "No credits"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {isLowCredits ? "Running low" : hasCredits ? "Available" : "Get credits"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className={cn(
              "flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-full text-xs font-medium transition-colors",
              hasCredits && !isLowCredits
                ? "bg-white dark:bg-background border border-coral-200 dark:border-coral-800 text-coral-600 dark:text-coral-400 hover:bg-coral-50 dark:hover:bg-coral-950/50"
                : "bg-coral-500 hover:bg-coral-600 text-white"
            )}
          >
            {!hasCredits && <Icon icon={ArrowRight01Icon} size={12} />}
            {hasCredits ? "Buy More" : "Get Credits"}
          </button>
        </div>
      </div>

      <BuyCreditsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentCredits={credits}
        trigger={getTriggerType()}
      />
    </>
  )
}
