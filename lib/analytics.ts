/**
 * Analytics utility for Seline event tracking
 * @see https://seline.so/docs/custom-events
 * @see https://seline.so/docs/profiles
 */

// Extend Window interface to include Seline
declare global {
  interface Window {
    seline?: {
      track: (eventName: string, properties?: Record<string, unknown>) => void
      setUser: (data: {
        userId?: string
        email?: string
        name?: string
        [key: string]: unknown
      }) => void
    }
  }
}

/**
 * Track a custom event with Seline
 * Safe to call on server or before Seline loads
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

/**
 * Identify a user with Seline
 * Safe to call on server or before Seline loads
 */
export function identifyUser(data: {
  userId: string
  email?: string | null
  name?: string | null
  credits?: number
  plan?: string
  [key: string]: unknown
}): void {
  if (typeof window === "undefined") return

  const identify = () => {
    if (window.seline?.setUser) {
      window.seline.setUser({
        userId: data.userId,
        email: data.email || undefined,
        name: data.name || undefined,
        credits: data.credits,
        plan: data.plan,
      })
    }
  }

  // Try immediately
  identify()

  // Also try after a short delay in case script is still loading
  if (!window.seline?.setUser) {
    setTimeout(identify, 1000)
  }
}

// ============================================================================
// Event Constants - Organized by category
// ============================================================================

export const AnalyticsEvents = {
  // Authentication Events
  AUTH: {
    SIGNUP_STARTED: "signup_started",
    SIGNUP_COMPLETED: "signup_completed",
    SIGNUP_METHOD: "signup_method",
    LOGIN_STARTED: "login_started",
    LOGIN_COMPLETED: "login_completed",
    LOGIN_METHOD: "login_method",
    LOGOUT: "logout",
    PASSWORD_RESET_REQUESTED: "password_reset_requested",
    PASSWORD_RESET_COMPLETED: "password_reset_completed",
  },

  // Case Creation Events
  CASE: {
    CREATION_STARTED: "case_creation_started",
    STEP_VIEWED: "case_step_viewed",
    STEP_COMPLETED: "case_step_completed",
    VOICE_RECORDING_STARTED: "voice_recording_started",
    VOICE_RECORDING_COMPLETED: "voice_recording_completed",
    EVIDENCE_UPLOADED: "evidence_uploaded",
    EVIDENCE_REMOVED: "evidence_removed",
    COMPANY_SEARCHED: "company_searched",
    COMPANY_SELECTED: "company_selected",
    CREATION_COMPLETED: "case_creation_completed",
    CREATION_ABANDONED: "case_creation_abandoned",
    VIEWED: "case_viewed",
    DELETED: "case_deleted",
    TAB_CHANGED: "case_tab_changed",
  },

  // Letter Events
  LETTER: {
    GENERATION_STARTED: "letter_generation_started",
    GENERATION_COMPLETED: "letter_generation_completed",
    VIEWED: "letter_viewed",
    COPIED: "letter_copied",
    DOWNLOADED: "letter_downloaded",
    EMAILED: "letter_emailed",
    CUSTOMIZED: "letter_customized",
  },

  // Evidence Events
  EVIDENCE: {
    UPLOAD_STARTED: "evidence_upload_started",
    UPLOAD_COMPLETED: "evidence_upload_completed",
    ANALYSIS_STARTED: "evidence_analysis_started",
    ANALYSIS_COMPLETED: "evidence_analysis_completed",
    DELETED: "evidence_deleted",
  },

  // Pricing & Payments
  PRICING: {
    PAGE_VIEWED: "pricing_page_viewed",
    PLAN_VIEWED: "plan_viewed",
    PURCHASE_STARTED: "purchase_started",
    PURCHASE_COMPLETED: "purchase_completed",
    PURCHASE_FAILED: "purchase_failed",
  },

  // Navigation & Engagement
  NAVIGATION: {
    CTA_CLICKED: "cta_clicked",
    LINK_CLICKED: "link_clicked",
    FAQ_EXPANDED: "faq_expanded",
    TESTIMONIAL_VIEWED: "testimonial_viewed",
  },

  // Tools Events
  TOOLS: {
    PAGE_VIEWED: "tool_page_viewed",
    FORM_STARTED: "tool_form_started",
    FORM_SUBMITTED: "tool_form_submitted",
    RESULT_VIEWED: "tool_result_viewed",
    RESULT_SHARED: "tool_result_shared",
  },

  // Account Events
  ACCOUNT: {
    PAGE_VIEWED: "account_page_viewed",
    PROFILE_UPDATED: "profile_updated",
    PASSWORD_CHANGED: "password_changed",
    DATA_EXPORTED: "data_exported",
    ACCOUNT_DELETED: "account_deleted",
  },

  // Feature Requests
  FEATURES: {
    REQUEST_SUBMITTED: "feature_request_submitted",
    REQUEST_VOTED: "feature_request_voted",
  },

  // Onboarding
  ONBOARDING: {
    WELCOME_MODAL_VIEWED: "welcome_modal_viewed",
    WELCOME_MODAL_DISMISSED: "welcome_modal_dismissed",
    ONBOARDING_STEP_COMPLETED: "onboarding_step_completed",
  },

  // Company Complain Pages
  COMPLAIN: {
    DIRECTORY_VIEWED: "complain_directory_viewed",
    COMPANY_PAGE_VIEWED: "complain_company_page_viewed",
    COMPANY_CLICKED: "complain_company_clicked",
    ISSUE_CLICKED: "complain_issue_clicked",
    START_COMPLAINT_CLICKED: "complain_start_clicked",
    CONTACT_VIEWED: "complain_contact_viewed",
  },
} as const

// ============================================================================
// Helper functions for common tracking patterns
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
 * Track a page view with additional context
 */
export function trackPageView(
  pageName: string,
  properties?: Record<string, unknown>
): void {
  trackEvent(`${pageName}_viewed`, {
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    referrer: typeof document !== "undefined" ? document.referrer : undefined,
    ...properties,
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

/**
 * Track case creation step
 */
export function trackCaseStep(
  step: number,
  action: "viewed" | "completed",
  properties?: Record<string, unknown>
): void {
  const eventName = action === "viewed"
    ? AnalyticsEvents.CASE.STEP_VIEWED
    : AnalyticsEvents.CASE.STEP_COMPLETED

  trackEvent(eventName, {
    step,
    ...properties,
  })
}

/**
 * Track authentication events
 */
export function trackAuth(
  action: "signup" | "login",
  method: "email" | "google",
  stage: "started" | "completed"
): void {
  const baseEvent = action === "signup" ? "signup" : "login"
  const eventName = `${baseEvent}_${stage}`

  trackEvent(eventName, {
    method,
  })
}

/**
 * Track letter generation
 */
export function trackLetterGeneration(
  action: "started" | "completed",
  letterType: string,
  caseId?: string,
  properties?: Record<string, unknown>
): void {
  const eventName = action === "started"
    ? AnalyticsEvents.LETTER.GENERATION_STARTED
    : AnalyticsEvents.LETTER.GENERATION_COMPLETED

  trackEvent(eventName, {
    letter_type: letterType,
    case_id: caseId,
    ...properties,
  })
}

/**
 * Track pricing interactions
 */
export function trackPricing(
  action: "page_viewed" | "plan_viewed" | "purchase_started" | "purchase_completed" | "purchase_failed",
  plan?: string,
  properties?: Record<string, unknown>
): void {
  trackEvent(`pricing_${action.replace("_", "_")}` as string, {
    plan,
    ...properties,
  })
}
