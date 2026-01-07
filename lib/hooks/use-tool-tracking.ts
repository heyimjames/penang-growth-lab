"use client"

import { useEffect, useCallback } from "react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

/**
 * Hook for tracking tool page views and interactions
 * @param toolId - The unique identifier for the tool (e.g., "flight-compensation")
 */
export function useToolTracking(toolId: string) {
  // Track page view on mount
  useEffect(() => {
    trackEvent(AnalyticsEvents.TOOLS.PAGE_VIEWED, {
      tool_id: toolId,
      page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    })
  }, [toolId])

  // Track form start (first interaction)
  const trackFormStart = useCallback(() => {
    trackEvent(AnalyticsEvents.TOOLS.FORM_STARTED, {
      tool_id: toolId,
    })
  }, [toolId])

  // Track form submission
  const trackFormSubmit = useCallback((success: boolean, resultValue?: unknown) => {
    trackEvent(AnalyticsEvents.TOOLS.FORM_SUBMITTED, {
      tool_id: toolId,
      success,
      result_value: resultValue,
    })
  }, [toolId])

  // Track result viewed
  const trackResultViewed = useCallback((resultType?: string) => {
    trackEvent(AnalyticsEvents.TOOLS.RESULT_VIEWED, {
      tool_id: toolId,
      result_type: resultType,
    })
  }, [toolId])

  // Track result shared
  const trackResultShared = useCallback((shareMethod: "copy" | "email" | "social") => {
    trackEvent(AnalyticsEvents.TOOLS.RESULT_SHARED, {
      tool_id: toolId,
      share_method: shareMethod,
    })
  }, [toolId])

  return {
    trackFormStart,
    trackFormSubmit,
    trackResultViewed,
    trackResultShared,
  }
}
