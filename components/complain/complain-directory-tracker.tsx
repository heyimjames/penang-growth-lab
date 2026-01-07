"use client"

import { useEffect } from "react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface ComplainDirectoryTrackerProps {
  companyCount: number
  industryCount: number
}

export function ComplainDirectoryTracker({
  companyCount,
  industryCount,
}: ComplainDirectoryTrackerProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvents.COMPLAIN.DIRECTORY_VIEWED, {
      company_count: companyCount,
      industry_count: industryCount,
    })
  }, [companyCount, industryCount])

  return null
}
