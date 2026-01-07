export type ResolutionType =
  | "full_refund"
  | "partial_refund"
  | "compensation"
  | "apology"
  | "replacement"
  | "service_credit"
  | "rejected"
  | "no_response"
  | "pending"

export interface Case {
  id: string
  user_id: string
  title: string | null
  complaint_text: string
  company_name: string
  company_domain: string | null
  purchase_date: string | null
  purchase_amount: number | null
  currency: string
  desired_outcome: string | null
  desired_outcomes: string[] | null
  confidence_score: number | null
  identified_issues: string[] | null
  legal_basis: LegalBasis[] | null
  company_intel: CompanyIntel | null
  generated_letter: string | null
  letter_tone: string
  status: "draft" | "analyzing" | "analyzed" | "ready" | "sent" | "resolved"
  resolution_outcome: string | null
  resolved_at: string | null
  // Additional case details
  incident_country: string | null
  user_country: string | null
  payment_method: string | null
  card_type: string | null
  booking_platform: string | null
  // Resolution tracking (social proof engine)
  resolution_type: ResolutionType | null
  resolution_amount: number | null
  resolution_days: number | null
  company_response_count: number | null
  escalation_used: boolean | null
  letter_sent_at: string | null
  // Testimonial fields
  testimonial_text: string | null
  testimonial_approved: boolean | null
  testimonial_shared: boolean | null
  testimonial_submitted_at: string | null
  // Timestamps
  created_at: string
  updated_at: string
}

export interface CompanyStats {
  company_name: string
  company_domain: string | null
  total_cases: number
  resolved_cases: number
  successful_cases: number
  avg_resolution_days: number | null
  avg_resolution_amount: number | null
  success_rate: number
  last_case_date: string | null
}

export interface LegalBasis {
  law: string
  section?: string
  description?: string
  summary?: string
  relevance?: string
  strength?: string
}

export interface CompanyIntel {
  responseRate: string
  avgResolutionTime: string
  complaintsProfile: string
  tips: string[]
  customerServiceEmail?: string
  contactEmails?: string[]
  executiveContacts?: {
    name: string
    title: string
    email?: string
    linkedIn?: string
  }[]
  socialHandles?: {
    twitter?: string
    facebook?: string
    linkedin?: string
  }
  // Company profile data
  companyProfile?: {
    description?: string
    industry?: string
    headquarters?: string
    founded?: string
    employees?: string
  }
  // Review ratings fetched at case creation
  ratings?: {
    trustpilot?: {
      score: number
      reviewCount: number
      url: string
      fetchedAt: string
    }
    google?: {
      score: number
      reviewCount: number
      url: string
      fetchedAt: string
    }
    tripadvisor?: {
      score: number
      reviewCount: number
      url: string
      fetchedAt: string
    }
  }
  // Official social media links
  socialLinks?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }
  // Similar complaints found during research
  similarComplaints?: {
    title: string
    url: string
    summary: string
  }[]
  // Additional analysis data
  complaintPatterns?: string[]
  riskLevel?: string
  notes?: string
  recommendedAction?: string
  estimatedCompensation?: {
    min: number
    max: number
    basis: string
  }
}

export interface EvidenceAnalysisDetails {
  type: "receipt" | "communication" | "damage" | "contract" | "screenshot" | "photo" | "other"
  description: string
  relevantDetails: string[]
  extractedText?: string
  suggestedUse: string
  strength: "strong" | "moderate" | "weak"
}

export interface Evidence {
  id: string
  case_id: string
  user_id: string
  file_name: string
  file_type: string
  file_size: number | null
  storage_path: string
  created_at: string
  // Analysis fields
  analyzed: boolean
  analysis_summary: string | null
  analysis_details: EvidenceAnalysisDetails | null
  user_context: string | null
  indexed_for_letter: boolean
  analyzed_at: string | null
}

export type EvidenceUpdate = Partial<Pick<Evidence,
  | "analysis_summary"
  | "analysis_details"
  | "user_context"
  | "analyzed"
  | "indexed_for_letter"
  | "analyzed_at"
>>

// For creating a new case (omit auto-generated fields)
export type CaseInsert = Omit<Case, "id" | "created_at" | "updated_at">

// For updating an existing case (all fields optional except what's needed)
export type CaseUpdate = Partial<Omit<Case, "id" | "user_id" | "created_at" | "updated_at">>

// Chat messages for case responses
export interface CaseMessage {
  id: string
  case_id: string
  user_id: string
  role: "user" | "assistant" | "system"
  content: string
  tool_invocations?: ToolInvocation[] | null
  metadata?: Record<string, unknown> | null
  created_at: string
}

export interface ToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  state: "partial-call" | "call" | "result"
  result?: unknown
}

export type CaseMessageInsert = Omit<CaseMessage, "id" | "created_at">

// Letter types for multi-letter support
export type LetterType =
  | "initial"
  | "follow-up"
  | "letter-before-action"
  | "escalation"
  | "chargeback"
  | "response-counter"

export interface Letter {
  id: string
  case_id: string
  user_id: string
  letter_type: LetterType
  subject: string | null
  body: string
  tone: string
  created_at: string
  updated_at: string
}

export type LetterInsert = Omit<Letter, "id" | "created_at" | "updated_at">
export type LetterUpdate = Partial<Omit<Letter, "id" | "case_id" | "user_id" | "created_at">>

// Consumer Rights Cheat Sheet Types
export type CheatSheetLocation =
  | "uk"
  | "us"
  | "eu"
  | "australia"
  | "canada"

export type CheatSheetCategory =
  | "faulty-goods"
  | "refunds"
  | "online-purchases"
  | "delivery"
  | "services"
  | "subscriptions"
  | "travel"
  | "financial"
  | "general"

export type PaymentMethod =
  | "credit-card"
  | "debit-card"
  | "paypal"
  | "bank-transfer"
  | "cash"
  | "other"

export interface CheatSheetInput {
  location: CheatSheetLocation
  category: CheatSheetCategory
  purchaseAmount?: number
  paymentMethod?: PaymentMethod
  purchaseDate?: string
}

export interface ConsumerRight {
  title: string
  description: string
  keyPoints: string[]
  timeLimit?: string
}

export interface LegalReference {
  name: string
  jurisdiction: string
  relevance: "high" | "medium" | "low"
  keyProvision: string
  whatItMeans: string
}

export interface TimelineEntry {
  period: string
  title: string
  description: string
  isActive?: boolean
}

export interface EscalationStep {
  step: number
  title: string
  description: string
  when: string
}

export interface CheatSheetResult {
  location: CheatSheetLocation
  locationName: string
  category: CheatSheetCategory
  categoryName: string
  generatedAt: string

  // Quick reference
  summary: string
  keyRights: ConsumerRight[]

  // Legal basis
  applicableLaws: LegalReference[]

  // Timeline
  timeline: TimelineEntry[]

  // Guidance
  dos: string[]
  donts: string[]
  keyPhrases: string[]

  // Escalation
  escalationPath: EscalationStep[]

  // Resources
  officialResources: {
    name: string
    url: string
    description: string
  }[]

  // Related tools
  relatedTools: {
    name: string
    href: string
    description: string
  }[]
}

// Feature Request Types
export type FeatureRequestStatus =
  | "pending_review"
  | "approved"
  | "planned"
  | "in_progress"
  | "shipped"
  | "rejected"

export type FeatureRequestCategory =
  | "ui"
  | "functionality"
  | "integration"
  | "performance"
  | "content"

export type FeatureRequestPriority =
  | "critical"
  | "high"
  | "medium"
  | "low"

export interface FeatureRequest {
  id: string
  user_id: string

  // User submission
  raw_request: string

  // AI-processed fields
  title: string | null
  description: string | null
  category: FeatureRequestCategory | null
  user_problem: string | null
  proposed_solution: string | null
  acceptance_criteria: string[] | null
  priority_suggestion: FeatureRequestPriority | null

  // Moderation
  is_relevant: boolean
  rejection_reason: string | null

  // Status
  status: FeatureRequestStatus

  // Engagement
  vote_count: number

  // Slack integration
  slack_message_ts: string | null
  slack_channel_id: string | null

  // GitHub integration
  github_issue_url: string | null
  github_pr_url: string | null

  // Timestamps
  created_at: string
  updated_at: string
}

export type FeatureRequestInsert = Omit<
  FeatureRequest,
  "id" | "vote_count" | "created_at" | "updated_at"
>

export type FeatureRequestUpdate = Partial<
  Omit<FeatureRequest, "id" | "user_id" | "raw_request" | "created_at">
>

export interface FeatureRequestVote {
  id: string
  feature_request_id: string
  user_id: string
  created_at: string
}

// AI-processed feature request from the API
export interface ProcessedFeatureRequest {
  title: string
  description: string
  category: FeatureRequestCategory
  user_problem: string
  proposed_solution: string
  acceptance_criteria: string[]
  priority_suggestion: FeatureRequestPriority
  is_relevant: boolean
  rejection_reason: string | null
}
