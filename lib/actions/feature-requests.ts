"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type {
  FeatureRequest,
  FeatureRequestUpdate,
  ProcessedFeatureRequest,
  FeatureRequestStatus,
} from "@/lib/types"

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER || "heyimjames"
const GITHUB_REPO = process.env.GITHUB_REPO || "fightback"

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get all visible feature requests (public + user's own)
 */
export async function getFeatureRequests(filter?: {
  status?: FeatureRequestStatus | FeatureRequestStatus[]
  sortBy?: "votes" | "newest" | "oldest"
}): Promise<FeatureRequest[]> {
  const supabase = await createClient()

  let query = supabase
    .from("feature_requests")
    .select("*")

  // Filter by status if provided
  if (filter?.status) {
    if (Array.isArray(filter.status)) {
      query = query.in("status", filter.status)
    } else {
      query = query.eq("status", filter.status)
    }
  }

  // Sort
  switch (filter?.sortBy) {
    case "votes":
      query = query.order("vote_count", { ascending: false })
      break
    case "oldest":
      query = query.order("created_at", { ascending: true })
      break
    case "newest":
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching feature requests:", error)
    return []
  }

  return data || []
}

/**
 * Get a single feature request by ID
 */
export async function getFeatureRequest(id: string): Promise<FeatureRequest | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("feature_requests")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching feature request:", error)
    return null
  }

  return data
}

/**
 * Get the IDs of feature requests the current user has voted for
 */
export async function getUserVotes(): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("feature_request_votes")
    .select("feature_request_id")
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching user votes:", error)
    return []
  }

  return data?.map((v) => v.feature_request_id) || []
}

/**
 * Check if current user has voted for a specific request
 */
export async function hasUserVoted(featureRequestId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data, error } = await supabase
    .from("feature_request_votes")
    .select("id")
    .eq("feature_request_id", featureRequestId)
    .eq("user_id", user.id)
    .single()

  return !error && !!data
}

// ============================================
// USER ACTIONS
// ============================================

/**
 * Submit a new feature request
 * - Calls AI to process into mini-PRD
 * - Saves to database
 * - Sends to Slack for review
 */
export async function submitFeatureRequest(rawRequest: string): Promise<{
  success: boolean
  request?: FeatureRequest
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "You must be logged in to submit a feature request" }
  }

  if (!rawRequest.trim() || rawRequest.trim().length < 10) {
    return { success: false, error: "Please provide a more detailed description of your feature request" }
  }

  try {
    // Process with AI
    const processedResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/feature-requests/process`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawRequest }),
      }
    )

    if (!processedResponse.ok) {
      throw new Error("Failed to process feature request")
    }

    const processed: ProcessedFeatureRequest = await processedResponse.json()

    // Check if relevant
    if (!processed.is_relevant) {
      return {
        success: false,
        error: processed.rejection_reason || "This request doesn't appear to be relevant to our platform",
      }
    }

    // Save to database
    const { data, error } = await supabase
      .from("feature_requests")
      .insert({
        user_id: user.id,
        raw_request: rawRequest,
        title: processed.title,
        description: processed.description,
        category: processed.category,
        user_problem: processed.user_problem,
        proposed_solution: processed.proposed_solution,
        acceptance_criteria: processed.acceptance_criteria,
        priority_suggestion: processed.priority_suggestion,
        is_relevant: processed.is_relevant,
        status: "pending_review",
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving feature request:", error)
      return { success: false, error: "Failed to save feature request" }
    }

    // Auto-vote for own request
    await supabase.from("feature_request_votes").insert({
      feature_request_id: data.id,
      user_id: user.id,
    })

    // Send to Slack (non-blocking)
    sendToSlack(data).catch((err) => console.error("Slack notification failed:", err))

    revalidatePath("/roadmap")

    return { success: true, request: data }
  } catch (error) {
    console.error("Error submitting feature request:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Toggle vote on a feature request
 */
export async function toggleVote(featureRequestId: string): Promise<{
  success: boolean
  voted: boolean
  newCount: number
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, voted: false, newCount: 0, error: "You must be logged in to vote" }
  }

  // Check if already voted
  const { data: existingVote } = await supabase
    .from("feature_request_votes")
    .select("id")
    .eq("feature_request_id", featureRequestId)
    .eq("user_id", user.id)
    .single()

  if (existingVote) {
    // Remove vote
    const { error } = await supabase
      .from("feature_request_votes")
      .delete()
      .eq("id", existingVote.id)

    if (error) {
      return { success: false, voted: true, newCount: 0, error: "Failed to remove vote" }
    }

    // Get updated count
    const { data: request } = await supabase
      .from("feature_requests")
      .select("vote_count")
      .eq("id", featureRequestId)
      .single()

    revalidatePath("/roadmap")
    return { success: true, voted: false, newCount: request?.vote_count || 0 }
  } else {
    // Add vote
    const { error } = await supabase
      .from("feature_request_votes")
      .insert({
        feature_request_id: featureRequestId,
        user_id: user.id,
      })

    if (error) {
      return { success: false, voted: false, newCount: 0, error: "Failed to add vote" }
    }

    // Get updated count
    const { data: request } = await supabase
      .from("feature_requests")
      .select("vote_count")
      .eq("id", featureRequestId)
      .single()

    revalidatePath("/roadmap")
    return { success: true, voted: true, newCount: request?.vote_count || 0 }
  }
}

// ============================================
// ADMIN ACTIONS (called via webhooks)
// ============================================

/**
 * Approve a feature request (called from Slack webhook)
 */
export async function approveFeatureRequest(
  id: string,
  slackMessageTs?: string
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("feature_requests")
    .update({
      status: "approved",
      slack_message_ts: slackMessageTs,
    })
    .eq("id", id)

  if (error) {
    console.error("Error approving feature request:", error)
    return false
  }

  // Trigger GitHub build
  const request = await getFeatureRequest(id)
  if (request) {
    triggerGitHubBuild(request).catch((err) =>
      console.error("GitHub trigger failed:", err)
    )
  }

  revalidatePath("/roadmap")
  return true
}

/**
 * Reject a feature request (called from Slack webhook)
 */
export async function rejectFeatureRequest(
  id: string,
  reason: string
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("feature_requests")
    .update({
      status: "rejected",
      rejection_reason: reason,
    })
    .eq("id", id)

  if (error) {
    console.error("Error rejecting feature request:", error)
    return false
  }

  revalidatePath("/roadmap")
  return true
}

/**
 * Update feature request status
 */
export async function updateFeatureRequestStatus(
  id: string,
  status: FeatureRequestStatus
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("feature_requests")
    .update({ status })
    .eq("id", id)

  if (error) {
    console.error("Error updating feature request status:", error)
    return false
  }

  revalidatePath("/roadmap")
  return true
}

/**
 * Link a GitHub PR to a feature request
 */
export async function linkGitHubPR(id: string, prUrl: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("feature_requests")
    .update({
      github_pr_url: prUrl,
      status: "in_progress",
    })
    .eq("id", id)

  if (error) {
    console.error("Error linking GitHub PR:", error)
    return false
  }

  revalidatePath("/roadmap")
  return true
}

// ============================================
// INTEGRATIONS
// ============================================

/**
 * Send feature request to Slack for review
 */
async function sendToSlack(request: FeatureRequest): Promise<void> {
  if (!SLACK_WEBHOOK_URL) {
    console.warn("Slack webhook URL not configured")
    return
  }

  const categoryEmoji: Record<string, string> = {
    ui: "🎨",
    functionality: "⚙️",
    integration: "🔗",
    performance: "⚡",
    content: "📝",
  }

  const priorityEmoji: Record<string, string> = {
    critical: "🔴",
    high: "🟠",
    medium: "🟡",
    low: "🟢",
  }

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🆕 New Feature Request",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${request.title}*\n${request.description}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Category:* ${categoryEmoji[request.category || "functionality"]} ${request.category}`,
        },
        {
          type: "mrkdwn",
          text: `*Priority:* ${priorityEmoji[request.priority_suggestion || "medium"]} ${request.priority_suggestion}`,
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*User Problem:*\n${request.user_problem}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Proposed Solution:*\n${request.proposed_solution}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Acceptance Criteria:*\n${
          request.acceptance_criteria
            ?.map((c, i) => `${i + 1}. ${c}`)
            .join("\n") || "None specified"
        }`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "✅ Approve & Build",
            emoji: true,
          },
          style: "primary",
          action_id: "approve_feature",
          value: request.id,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "❌ Reject",
            emoji: true,
          },
          style: "danger",
          action_id: "reject_feature",
          value: request.id,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "👀 View in App",
            emoji: true,
          },
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/roadmap?highlight=${request.id}`,
        },
      ],
    },
  ]

  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  })
}

/**
 * Trigger GitHub Action to build the feature
 */
async function triggerGitHubBuild(request: FeatureRequest): Promise<void> {
  if (!GITHUB_TOKEN) {
    console.warn("GitHub token not configured")
    return
  }

  const acceptanceCriteria = request.acceptance_criteria || []

  const prompt = `
Implement this feature for the NoReply consumer advocacy platform:

## Feature: ${request.title}

## Description
${request.description}

## User Problem
${request.user_problem}

## Proposed Solution
${request.proposed_solution}

## Acceptance Criteria
${acceptanceCriteria.map((c) => `- ${c}`).join("\n")}

## Technical Notes
- This is a Next.js 16 app with TypeScript, Tailwind CSS, and shadcn/ui
- Use existing patterns from the codebase
- Follow the design system in CLAUDE.md
- Add appropriate error handling
- Make it mobile responsive
`.trim()

  const body = `
## Automated PR for Feature Request

**Feature ID:** ${request.id}

### User Problem
${request.user_problem}

### Proposed Solution
${request.proposed_solution}

### Acceptance Criteria
${acceptanceCriteria.map((c) => `- [ ] ${c}`).join("\n")}

---
🤖 Generated by NoReply Feature Request System
`.trim()

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          event_type: "build-feature",
          client_payload: {
            feature_id: request.id,
            title: request.title,
            prompt,
            body,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`GitHub API error: ${error}`)
    }
  } catch (error) {
    console.error("Failed to trigger GitHub build:", error)
    throw error
  }
}
