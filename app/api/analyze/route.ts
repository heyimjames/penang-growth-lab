import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(request: NextRequest) {
  try {
    const { complaint, companyName, purchaseAmount, currency, desiredOutcome, companyResearch, legalResearch } =
      await request.json()

    if (!complaint || !companyName) {
      return NextResponse.json({ error: "Complaint and company name are required" }, { status: 400 })
    }

    const contextSection = companyResearch
      ? `
Company Research:
- Domain: ${companyResearch.company?.domain || "Unknown"}
- Similar complaints found: ${companyResearch.complaints?.length || 0}
${
  companyResearch.complaints
    ?.slice(0, 3)
    .map((c: { title: string }) => `  • ${c.title}`)
    .join("\n") || ""
}
${companyResearch.contacts?.emails ? `- Contact emails found: ${companyResearch.contacts.emails.join(", ")}` : ""}
`
      : ""

    const legalSection =
      legalResearch && !legalResearch.mock
        ? `
Legal Research:
${legalResearch.laws?.map((l: { name: string; section: string; summary: string }) => `- ${l.name} ${l.section}: ${l.summary}`).join("\n") || ""}
`
        : ""

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: `You are a UK consumer rights expert and advocate. Analyze consumer complaints and build strong cases. 

Your analysis should:
1. Assess the strength of the case (0-100 confidence score)
2. Identify specific issues and violations
3. Cite applicable UK consumer protection laws with specific sections
4. Consider the company's complaint history if provided
5. Recommend a clear course of action

Be assertive but accurate. Only cite laws that genuinely apply.

Respond in JSON format:
{
  "confidenceScore": number,
  "issues": string[],
  "legalBasis": [{ "law": string, "section": string, "summary": string, "strength": "strong" | "moderate" | "supportive" }],
  "companyIntelligence": { "complaintPatterns": string[], "riskLevel": "low" | "medium" | "high", "notes": string },
  "recommendedAction": string,
  "estimatedCompensation": { "min": number, "max": number, "basis": string },
  "reasoning": string
}`,
      prompt: `Analyze this consumer complaint and build a case:

Company: ${companyName}
Amount Paid: ${currency} ${purchaseAmount || "Not specified"}
Desired Outcome: ${desiredOutcome || "Full refund"}
${contextSection}
${legalSection}
Complaint:
${complaint}

Provide your comprehensive analysis in the JSON format specified.`,
    })

    // Parse the AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const analysis = JSON.parse(jsonMatch[0])

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Analysis error:", error)

    // Return fallback analysis
    return NextResponse.json({
      confidenceScore: 70,
      issues: ["Potential breach of contract", "Service not as described"],
      legalBasis: [
        {
          law: "Consumer Rights Act 2015",
          section: "Section 49",
          summary: "Services must be performed with reasonable care and skill.",
          strength: "strong",
        },
      ],
      companyIntelligence: {
        complaintPatterns: [],
        riskLevel: "medium",
        notes: "Unable to gather company intelligence at this time.",
      },
      recommendedAction: "Send a formal complaint letter citing your consumer rights.",
      estimatedCompensation: { min: 0, max: 0, basis: "Unable to estimate" },
      reasoning: "Analysis based on general consumer protection principles.",
    })
  }
}
