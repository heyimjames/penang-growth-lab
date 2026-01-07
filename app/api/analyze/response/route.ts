import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const ResponseAnalysisSchema = z.object({
  tactics: z.array(
    z.object({
      type: z.enum([
        "deflection",
        "lowball_offer",
        "delay_tactic",
        "blame_shifting",
        "policy_excuse",
        "request_more_info",
        "goodwill_gesture",
        "partial_admission",
        "full_rejection",
        "legal_threat",
        "escalation_needed",
      ]),
      description: z.string(),
      quote: z.string().optional(),
    })
  ),
  offerAnalysis: z
    .object({
      hasOffer: z.boolean(),
      offerAmount: z.number().optional(),
      offerType: z.string().optional(),
      fairnessAssessment: z.enum(["fair", "lowball", "inadequate", "generous"]).optional(),
      expectedAmount: z.number().optional(),
      expectedBasis: z.string().optional(),
    })
    .optional(),
  strengthWeaknesses: z.object({
    theirWeakPoints: z.array(z.string()),
    theirStrongPoints: z.array(z.string()),
    yourOpportunities: z.array(z.string()),
  }),
  recommendedApproach: z.enum([
    "accept_offer",
    "negotiate_higher",
    "reject_firmly",
    "escalate_supervisor",
    "escalate_executive",
    "escalate_ombudsman",
    "threaten_legal",
    "social_media",
    "request_clarification",
  ]),
  recommendedActions: z.array(z.string()),
  urgencyLevel: z.enum(["low", "medium", "high"]),
  deadlineWarning: z.string().optional(),
  draftResponsePoints: z.array(z.string()),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { companyResponse, caseContext } = body

    if (!companyResponse) {
      return Response.json({ error: "Company response is required" }, { status: 400 })
    }

    const systemPrompt = `You are an expert consumer rights advocate and negotiation coach. Your role is to analyze company responses to consumer complaints and identify tactics, weak points, and strategic opportunities.

You understand UK consumer law deeply including:
- Consumer Rights Act 2015
- Consumer Contracts Regulations
- Section 75 credit card protection
- UK261/EU261 flight compensation
- Various ombudsman schemes

When analyzing a company response, you must:
1. Identify the tactics being used (deflection, lowball offers, delay tactics, etc.)
2. Find weak points in their arguments that can be exploited
3. Assess any offers made and whether they're fair
4. Recommend the best strategic approach
5. Provide specific action points for the counter-response

Be direct and strategic. The user wants to know exactly how to push back effectively.`

    const userPrompt = `Analyze this company response to a consumer complaint:

**Company Response:**
${companyResponse}

**Case Context:**
- Company: ${caseContext?.companyName || "Unknown"}
- Original complaint: ${caseContext?.complaintText?.slice(0, 500) || "Not provided"}
- Amount claimed: ${caseContext?.purchaseAmount ? `£${caseContext.purchaseAmount}` : "Not specified"}
- Legal basis identified: ${caseContext?.legalBasis?.map((l: { law: string }) => l.law).join(", ") || "None identified"}
- Issues identified: ${caseContext?.identifiedIssues?.join(", ") || "None identified"}

Analyze the company's response, identify their tactics, assess any offers, find weak points, and recommend the best strategic approach for the consumer.`

    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: ResponseAnalysisSchema,
      system: systemPrompt,
      prompt: userPrompt,
    })

    return Response.json(object)
  } catch (error) {
    console.error("Response analysis error:", error)
    return Response.json(
      { error: "Failed to analyze response" },
      { status: 500 }
    )
  }
}
