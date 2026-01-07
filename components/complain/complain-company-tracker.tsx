"use client"

import { useEffect } from "react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface ComplainCompanyTrackerProps {
  companyName: string
  companySlug: string
  industry: string | null
  hasStats: boolean
}

export function ComplainCompanyTracker({
  companyName,
  companySlug,
  industry,
  hasStats,
}: ComplainCompanyTrackerProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvents.COMPLAIN.COMPANY_PAGE_VIEWED, {
      company_name: companyName,
      company_slug: companySlug,
      industry,
      has_stats: hasStats,
    })
  }, [companyName, companySlug, industry, hasStats])

  return null
}
