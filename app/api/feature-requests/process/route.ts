import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import type { ProcessedFeatureRequest, FeatureRequestCategory, FeatureRequestPriority } from "@/lib/types"

const anthropic = new Anthropic()

export async function POST(request: Request) {
  try {
    const { rawRequest } = await request.json()

    if (!rawRequest || typeof rawRequest !== "string") {
      return NextResponse.json(
        { error: "rawRequest is required" },
        { status: 400 }
      )
    }

    const prompt = `You are a product manager for NoReply, a consumer advocacy platform that helps users create complaint letters against companies.

Given this feature request from a user, analyze it and extract structured information.

Feature request: "${rawRequest}"

Respond with a JSON object containing:
{
  "title": "concise feature name (5-10 words max)",
  "description": "1-2 sentence summary of the feature",
  "category": one of ["ui", "functionality", "integration", "performance", "content"],
  "user_problem": "what problem does this solve for users (1-2 sentences)",
  "proposed_solution": "how should this feature work (2-3 sentences)",
  "acceptance_criteria": ["array of 3-5 testable criteria for when this feature is complete"],
  "priority_suggestion": one of ["critical", "high", "medium", "low"],
  "is_relevant": true/false - is this a reasonable feature for a consumer advocacy platform?,
  "rejection_reason": null or "explanation if is_relevant is false"
}

Guidelines for determining relevance:
- RELEVANT: Features related to complaint creation, evidence management, company research, letter generation, case tracking, user account management, accessibility improvements, mobile experience, integrations with consumer protection resources
- NOT RELEVANT: Features unrelated to consumer advocacy (e.g., games, social media, dating), offensive requests, spam, requests that are too vague to understand, requests for illegal activities

Be generous with relevance - if there's any reasonable way the feature could help consumers fight back against companies, mark it as relevant.

Respond ONLY with the JSON object, no additional text.`

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    // Extract text from response
    const responseText = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const parsed = JSON.parse(jsonMatch[0])

    // Validate and sanitize response
    const processed: ProcessedFeatureRequest = {
      title: String(parsed.title || "Untitled Feature").slice(0, 100),
      description: String(parsed.description || "").slice(0, 500),
      category: validateCategory(parsed.category),
      user_problem: String(parsed.user_problem || "").slice(0, 500),
      proposed_solution: String(parsed.proposed_solution || "").slice(0, 1000),
      acceptance_criteria: Array.isArray(parsed.acceptance_criteria)
        ? parsed.acceptance_criteria.slice(0, 10).map((c: unknown) => String(c).slice(0, 200))
        : [],
      priority_suggestion: validatePriority(parsed.priority_suggestion),
      is_relevant: Boolean(parsed.is_relevant),
      rejection_reason: parsed.rejection_reason ? String(parsed.rejection_reason).slice(0, 500) : null,
    }

    return NextResponse.json(processed)
  } catch (error) {
    console.error("Error processing feature request:", error)
    return NextResponse.json(
      { error: "Failed to process feature request" },
      { status: 500 }
    )
  }
}

function validateCategory(value: unknown): FeatureRequestCategory {
  const validCategories: FeatureRequestCategory[] = [
    "ui",
    "functionality",
    "integration",
    "performance",
    "content",
  ]
  if (typeof value === "string" && validCategories.includes(value as FeatureRequestCategory)) {
    return value as FeatureRequestCategory
  }
  return "functionality"
}

function validatePriority(value: unknown): FeatureRequestPriority {
  const validPriorities: FeatureRequestPriority[] = [
    "critical",
    "high",
    "medium",
    "low",
  ]
  if (typeof value === "string" && validPriorities.includes(value as FeatureRequestPriority)) {
    return value as FeatureRequestPriority
  }
  return "medium"
}
