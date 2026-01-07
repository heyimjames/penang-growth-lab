"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Icon } from "@/lib/icons"
import { CoinsSwapIcon, ArrowRight01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { Button } from "@/components/ui/button"

interface NoCreditsModalProps {
  onClose?: () => void
}

export function NoCreditsModal({ onClose }: NoCreditsModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-md bg-background border border-border rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-coral-50 to-peach-50 dark:from-coral-950/30 dark:to-peach-950/30 p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-coral-500 text-white mb-4">
            <Icon icon={CoinsSwapIcon} size={32} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            You're Out of Credits
          </h2>
          <p className="text-muted-foreground text-sm">
            Purchase credits to create new cases and fight back against unfair treatment.
          </p>
        </div>

        {/* Pricing options */}
        <div className="p-6 space-y-3">
          {/* Pay As You Go */}
          <Link
            href="/#pricing"
            className="flex items-center justify-between p-4 rounded-xl border border-coral-200 dark:border-coral-800 bg-coral-50/50 dark:bg-coral-950/20 hover:bg-coral-100 dark:hover:bg-coral-950/40 transition-colors group"
          >
            <div>
              <p className="font-semibold text-foreground">Pay As You Go</p>
              <p className="text-sm text-muted-foreground">£2.99 per case</p>
            </div>
            <div className="flex items-center gap-2 text-coral-600 dark:text-coral-400">
              <span className="text-sm font-medium">Get Started</span>
              <Icon icon={ArrowRight01Icon} size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Bundle */}
          <Link
            href="/#pricing"
            className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-coral-200 dark:hover:border-coral-800 hover:bg-muted/50 transition-colors group"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">Case Bundle</p>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  Save 33%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">5 cases for £9.99</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
              <span className="text-sm font-medium">Best Value</span>
              <Icon icon={ArrowRight01Icon} size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
          <Button asChild variant="coral" className="w-full">
            <Link href="/#pricing">
              <Icon icon={ArrowRight01Icon} size={16} className="mr-2" />
              View All Options
            </Link>
          </Button>

          {onClose && (
            <Button variant="ghost" onClick={onClose} className="w-full text-muted-foreground">
              Go Back to Dashboard
            </Button>
          )}

          {!onClose && (
            <Button asChild variant="ghost" className="w-full text-muted-foreground">
              <Link href="/dashboard">
                Go Back to Dashboard
              </Link>
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
