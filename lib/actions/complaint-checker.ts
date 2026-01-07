"use server"

export interface ComplaintCheckResult {
  strength: "weak" | "moderate" | "strong"
  score: number // 1-100
  summary: string
  applicableLaws: {
    name: string
    description: string
    relevance: "high" | "medium" | "low"
  }[]
  recommendations: string[]
  nextSteps: string[]
}

const categories = [
  "refund",
  "faulty-product",
  "delivery",
  "cancellation",
  "billing",
  "service-quality",
  "contract",
  "other",
] as const

export type ComplaintCategory = (typeof categories)[number]

// Simulated AI analysis - in production, this would call an LLM
export async function analyzeComplaint(
  description: string,
  category: ComplaintCategory
): Promise<ComplaintCheckResult> {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Basic scoring based on description length and keywords
  const keywords = [
    "receipt",
    "proof",
    "email",
    "screenshot",
    "refused",
    "ignored",
    "contract",
    "terms",
    "warranty",
    "guarantee",
    "faulty",
    "broken",
    "damaged",
    "wrong",
    "late",
    "never arrived",
    "charged",
    "overcharged",
    "promised",
  ]

  const descLower = description.toLowerCase()
  const keywordMatches = keywords.filter((kw) => descLower.includes(kw)).length
  const hasEvidence = descLower.includes("proof") || descLower.includes("receipt") || descLower.includes("email") || descLower.includes("screenshot")
  const hasTimeline = /\d+\s*(day|week|month)/i.test(description)

  // Calculate base score
  let score = 30 // Base score
  score += Math.min(keywordMatches * 5, 25) // Up to 25 points for keywords
  score += hasEvidence ? 20 : 0 // 20 points for mentioning evidence
  score += hasTimeline ? 10 : 0 // 10 points for timeline
  score += Math.min(description.length / 50, 15) // Up to 15 points for detail

  score = Math.min(Math.max(Math.round(score), 15), 95) // Clamp between 15-95

  const strength: ComplaintCheckResult["strength"] =
    score >= 70 ? "strong" : score >= 45 ? "moderate" : "weak"

  // Get applicable laws based on category
  const lawsByCategory: Record<ComplaintCategory, ComplaintCheckResult["applicableLaws"]> = {
    refund: [
      {
        name: "Consumer Rights Act 2015",
        description: "Goods must be of satisfactory quality, fit for purpose, and as described. You have 30 days for a full refund if goods don't meet these standards.",
        relevance: "high",
      },
      {
        name: "Consumer Contracts Regulations 2013",
        description: "For online purchases, you have 14 days to cancel and receive a full refund, no reason needed.",
        relevance: "high",
      },
    ],
    "faulty-product": [
      {
        name: "Consumer Rights Act 2015",
        description: "Products must be of satisfactory quality. If faulty within 6 months, the retailer must prove it wasn't faulty when sold.",
        relevance: "high",
      },
      {
        name: "Sale of Goods Act 1979",
        description: "Goods must match their description and be fit for purpose. May apply for purchases before Oct 2015.",
        relevance: "medium",
      },
    ],
    delivery: [
      {
        name: "Consumer Rights Act 2015",
        description: "Goods must be delivered within 30 days unless otherwise agreed. You can cancel if delivery is late.",
        relevance: "high",
      },
      {
        name: "Consumer Contracts Regulations 2013",
        description: "Risk passes to you when goods are in your possession. The seller bears delivery risk.",
        relevance: "medium",
      },
    ],
    cancellation: [
      {
        name: "Consumer Contracts Regulations 2013",
        description: "14-day cooling-off period for most online and phone purchases. Refund due within 14 days of cancellation.",
        relevance: "high",
      },
      {
        name: "Consumer Rights Act 2015",
        description: "Right to cancel digital content within 14 days if you haven't started using it.",
        relevance: "medium",
      },
    ],
    billing: [
      {
        name: "Consumer Rights Act 2015",
        description: "You must not be charged more than the agreed price. Unfair terms are not binding.",
        relevance: "high",
      },
      {
        name: "Payment Services Regulations 2017",
        description: "Banks must refund unauthorized transactions. Chargeback rights may apply.",
        relevance: "medium",
      },
    ],
    "service-quality": [
      {
        name: "Consumer Rights Act 2015",
        description: "Services must be performed with reasonable care and skill, within a reasonable time, and for a reasonable price.",
        relevance: "high",
      },
      {
        name: "Supply of Goods and Services Act 1982",
        description: "Service providers must carry out work with reasonable skill and care.",
        relevance: "medium",
      },
    ],
    contract: [
      {
        name: "Consumer Rights Act 2015 (Unfair Terms)",
        description: "Contract terms must be fair. Unfair terms are not legally binding on consumers.",
        relevance: "high",
      },
      {
        name: "Misrepresentation Act 1967",
        description: "You may rescind a contract if you were induced by false statements.",
        relevance: "medium",
      },
    ],
    other: [
      {
        name: "Consumer Rights Act 2015",
        description: "General consumer protection covering goods, services, and digital content.",
        relevance: "high",
      },
      {
        name: "Consumer Protection from Unfair Trading Regulations 2008",
        description: "Protects against misleading actions, aggressive practices, and unfair trading.",
        relevance: "medium",
      },
    ],
  }

  // Generate recommendations based on strength
  const baseRecommendations = [
    "Keep all correspondence with the company",
    "Note down dates and times of any calls",
    "Take screenshots of online chats",
  ]

  const strengthRecommendations: Record<ComplaintCheckResult["strength"], string[]> = {
    weak: [
      "Gather more evidence to support your claim",
      "Check if you have receipts or order confirmations",
      "Document the timeline of events clearly",
    ],
    moderate: [
      "Your case has potential - organize your evidence",
      "Consider sending a formal complaint letter",
      "Reference the specific laws that apply",
    ],
    strong: [
      "You have a strong case - proceed with confidence",
      "Include all evidence in your complaint",
      "Set a clear deadline for the company to respond",
    ],
  }

  const summaries: Record<ComplaintCheckResult["strength"], string> = {
    weak: "Your complaint needs more supporting evidence to be effective. Companies are more likely to respond when you can demonstrate clear facts and relevant consumer rights.",
    moderate: "Your complaint has reasonable grounds. With proper documentation and legal references, you have a good chance of resolution.",
    strong: "Your complaint is well-founded with clear consumer rights violations. A formal complaint letter citing relevant laws should be effective.",
  }

  const nextSteps: Record<ComplaintCheckResult["strength"], string[]> = {
    weak: [
      "Collect receipts, emails, and screenshots",
      "Write down the timeline of events",
      "Use NoReply to structure your complaint properly",
    ],
    moderate: [
      "Create a formal complaint with NoReply",
      "Include your evidence and cite relevant laws",
      "Send to the company's complaints department",
    ],
    strong: [
      "Generate your professional complaint letter now",
      "Set a 14-day deadline for response",
      "Escalate to ombudsman if no resolution",
    ],
  }

  return {
    strength,
    score,
    summary: summaries[strength],
    applicableLaws: lawsByCategory[category],
    recommendations: [...strengthRecommendations[strength], ...baseRecommendations],
    nextSteps: nextSteps[strength],
  }
}
