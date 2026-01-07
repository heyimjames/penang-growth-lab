"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

interface DashboardTrackerProps {
  stats: {
    total: number
    active: number
    draft: number
    resolved: number
  }
}

export function DashboardTracker({ stats }: DashboardTrackerProps) {
  useEffect(() => {
    trackEvent("dashboard_viewed", {
      total_cases: stats.total,
      active_cases: stats.active,
      draft_cases: stats.draft,
      resolved_cases: stats.resolved,
    })
  }, [stats.total, stats.active, stats.draft, stats.resolved])

  return null
}
