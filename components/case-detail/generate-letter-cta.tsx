"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import { Edit02Icon } from "@hugeicons-pro/core-stroke-rounded"
import { useCaseTabs } from "./case-tabs-context"

export function GenerateLetterCTA() {
  const { goToLetters } = useCaseTabs()

  return (
    <div className="rounded-xl border border-peach-200 dark:border-peach-800 bg-gradient-to-br from-peach-50 to-lavender-50 dark:from-peach-950/30 dark:to-lavender-950/30 p-5">
      <h3 className="font-semibold mb-1">Ready to take action?</h3>
      <p className="text-sm text-muted-foreground mb-3">Generate a professional complaint letter</p>
      <Button
        onClick={goToLetters}
        variant="coral"
        className="w-full"
      >
        <Icon icon={Edit02Icon} size={16} className="mr-2" />
        Generate Letter
      </Button>
    </div>
  )
}
