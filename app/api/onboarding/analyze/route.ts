import { NextResponse } from "next/server"

// Issue patterns for quick analysis (keyword-based, no AI needed)
const issuePatterns = [
  {
    keywords: ["refund", "money back", "reimburse", "reimbursement"],
    issue: "Potential refund entitlement under consumer protection laws",
  },
  {
    keywords: ["cancel", "cancelled", "cancellation"],
    issue: "Possible breach of contract due to cancellation",
  },
  {
    keywords: ["delay", "delayed", "late", "waiting"],
    issue: "Service delivery failure or unreasonable delay",
  },
  {
    keywords: ["broken", "damaged", "defective", "faulty", "not working", "doesn't work"],
    issue: "Product quality issue under consumer rights",
  },
  {
    keywords: ["flight", "airline", "airport", "boarding"],
    issue: "Potential EU261 or aviation consumer rights claim",
  },
  {
    keywords: ["hotel", "room", "accommodation", "booking"],
    issue: "Accommodation service standards not met",
  },
  {
    keywords: ["charged", "overcharged", "extra charge", "hidden fee", "unexpected fee"],
    issue: "Unauthorized or hidden charges",
  },
  {
    keywords: ["subscription", "recurring", "auto-renew", "renewed"],
    issue: "Potential unfair subscription practices",
  },
  {
    keywords: ["scam", "fraud", "misleading", "false advertising", "fake"],
    issue: "Possible fraudulent or deceptive practices",
  },
  {
    keywords: ["warranty", "guarantee", "covered"],
    issue: "Warranty or guarantee claim",
  },
  {
    keywords: ["delivery", "shipping", "never arrived", "lost package", "didn't receive"],
    issue: "Non-delivery or lost goods claim",
  },
  {
    keywords: ["customer service", "ignored", "no response", "won't help", "refused"],
    issue: "Inadequate customer service response",
  },
  {
    keywords: ["contract", "terms", "agreement", "signed"],
    issue: "Potential breach of contract terms",
  },
  {
    keywords: ["safety", "dangerous", "hazard", "injury", "hurt"],
    issue: "Product safety concern",
  },
]

function findIssues(complaint: string): string[] {
  const lowerComplaint = complaint.toLowerCase()
  const foundIssues: string[] = []

  for (const pattern of issuePatterns) {
    if (pattern.keywords.some((keyword) => lowerComplaint.includes(keyword))) {
      foundIssues.push(pattern.issue)
    }
  }

  // Add a generic issue if none found
  if (foundIssues.length === 0) {
    foundIssues.push("Consumer rights may apply to your situation")
  }

  // Limit to 3 most relevant issues
  return foundIssues.slice(0, 3)
}

function calculateConfidence(
  complaint: string,
  amount: string,
  companyName: string,
  outcome: string
): number {
  let confidence = 40 // Base confidence

  // Length of complaint (more detail = higher confidence)
  if (complaint.length > 50) confidence += 10
  if (complaint.length > 100) confidence += 10
  if (complaint.length > 200) confidence += 5

  // Amount specified
  if (amount && parseFloat(amount) > 0) {
    confidence += 10
    if (parseFloat(amount) > 100) confidence += 5
  }

  // Company specified
  if (companyName && companyName.length > 2) {
    confidence += 5
  }

  // Outcome specified
  if (outcome) {
    confidence += 5
  }

  // Number of issues detected
  const issues = findIssues(complaint)
  confidence += issues.length * 5

  // Cap at 95
  return Math.min(95, confidence)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { complaint, amount, companyName, outcome } = body

    if (!complaint || complaint.length < 10) {
      return NextResponse.json(
        { error: "Please provide more details about your complaint" },
        { status: 400 }
      )
    }

    // Simulate a brief processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    const issues = findIssues(complaint)
    const confidence = calculateConfidence(complaint, amount, companyName, outcome)

    return NextResponse.json({
      issues,
      confidence,
      suggestedOutcome:
        confidence >= 70
          ? "Based on your case details, you have a good chance of success"
          : "Adding more details could strengthen your case",
    })
  } catch (error) {
    console.error("Onboarding analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
