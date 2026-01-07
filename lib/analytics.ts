/**
 * Analytics utility for Penang Growth Lab
 * Simple event tracking for tool usage
 */

// Extend Window interface to include analytics
declare global {
  interface Window {
    seline?: {
      track: (eventName: string, properties?: Record<string, unknown>) => void
    }
  }
}

/**
 * Track a custom event
 * Safe to call on server or before analytics loads
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return

  const track = () => {
    if (window.seline?.track) {
      window.seline.track(eventName, properties)
    }
  }

  // Try immediately
  track()

  // Also try after a short delay in case script is still loading
  if (!window.seline?.track) {
    setTimeout(track, 1000)
  }
}

// ============================================================================
// Event Constants
// ============================================================================

export const AnalyticsEvents = {
  // Tools Events
  TOOLS: {
    PAGE_VIEWED: "tool_page_viewed",
    FORM_STARTED: "tool_form_started",
    FORM_SUBMITTED: "tool_form_submitted",
    RESULT_VIEWED: "tool_result_viewed",
    RESULT_SHARED: "tool_result_shared",
    RESULT_COPIED: "tool_result_copied",
  },

  // Navigation & Engagement
  NAVIGATION: {
    CTA_CLICKED: "cta_clicked",
    LINK_CLICKED: "link_clicked",
    FAQ_EXPANDED: "faq_expanded",
  },

  // Blog Events
  BLOG: {
    POST_VIEWED: "blog_post_viewed",
    POST_SHARED: "blog_post_shared",
  },

  // Guide Events  
  GUIDES: {
    GUIDE_VIEWED: "guide_viewed",
  },
} as const

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Track a CTA button click
 */
export function trackCTAClick(
  buttonText: string,
  location: string,
  destination?: string
): void {
  trackEvent(AnalyticsEvents.NAVIGATION.CTA_CLICKED, {
    button_text: buttonText,
    location,
    destination,
  })
}

/**
 * Track a tool form submission
 */
export function trackToolSubmission(
  toolId: string,
  success: boolean,
  properties?: Record<string, unknown>
): void {
  trackEvent(AnalyticsEvents.TOOLS.FORM_SUBMITTED, {
    tool_id: toolId,
    success,
    ...properties,
  })
}
