import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"

interface LegalBasis {
  law: string
  section: string
  summary: string
  strength?: string
}

interface EvidenceAnalysis {
  analyses: {
    fileName: string
    type: string
    description: string
    relevantDetails: string[]
    suggestedUse: string
    strength: string
  }[]
  summary: string
}

interface UserProfile {
  fullName: string | null
  email: string | null
  phone: string | null
  address: string | null
}

interface GenerateLetterRequest {
  complaint: string
  companyName: string
  incidentDate: string | null
  purchaseAmount: string
  currency: string
  desiredOutcome: string
  tone: "formal" | "assertive" | "friendly"
  issues: string[]
  legalBasis: LegalBasis[]
  evidenceAnalysis?: EvidenceAnalysis
  evidenceFiles: string[]
  companyEmail?: string
  paymentProtections?: string
  regulatoryBodies?: { name: string; website: string; jurisdiction: string }[]
  incidentCountry?: string
  userCountry?: string
  paymentMethod?: string
  feedback?: string
  userProfile?: UserProfile
}

// Helper to determine the appropriate outcome based on the case
function analyzeAndSuggestOutcome(data: GenerateLetterRequest): string {
  const amount = parseFloat(data.purchaseAmount) || 0
  const complaint = data.complaint.toLowerCase()
  const issues = data.issues.map(i => i.toLowerCase()).join(" ")
  const combined = `${complaint} ${issues}`

  // If they already specified an outcome that's not "ai-suggested", use it
  if (data.desiredOutcome && data.desiredOutcome !== "ai-suggested") {
    return data.desiredOutcome.replace(/-/g, " ")
  }

  // Analyze the complaint to suggest appropriate outcome
  const hasFinancialLoss = amount > 0 || combined.includes("paid") || combined.includes("cost") || combined.includes("charge")
  const hasServiceFailure = combined.includes("cancelled") || combined.includes("delayed") || combined.includes("didn't receive") || combined.includes("not delivered")
  const hasRudeness = combined.includes("rude") || combined.includes("disrespect") || combined.includes("horrible") || combined.includes("disgraceful") || combined.includes("shouting")
  const hasDistress = combined.includes("distress") || combined.includes("upset") || combined.includes("honeymoon") || combined.includes("special occasion") || combined.includes("humiliat")
  const isTravel = combined.includes("flight") || combined.includes("hotel") || combined.includes("booking") || combined.includes("travel")

  // Build appropriate outcome
  const outcomes: string[] = []

  if (hasFinancialLoss && amount > 0) {
    if (hasServiceFailure) {
      outcomes.push(`a full refund of ${data.currency === "GBP" ? "£" : data.currency === "EUR" ? "€" : "$"}${amount.toFixed(2)}`)
    } else {
      outcomes.push(`a partial refund to reflect the substandard service received`)
    }
  }

  if (hasRudeness || hasDistress) {
    outcomes.push("a formal written apology")
    if (hasDistress) {
      outcomes.push("compensation for the distress and inconvenience caused")
    }
  }

  if (isTravel && hasServiceFailure) {
    outcomes.push("assurance that steps will be taken to prevent this happening to other customers")
  }

  // Default if nothing detected
  if (outcomes.length === 0) {
    outcomes.push("an appropriate resolution to this matter")
  }

  return outcomes.join(", and ")
}

export async function POST(request: NextRequest) {
  try {
    const data: GenerateLetterRequest = await request.json()

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

    // Determine the actual desired outcome (handle ai-suggested)
    const suggestedOutcome = analyzeAndSuggestOutcome(data)

    if (!ANTHROPIC_API_KEY) {
      // Return a basic template if no API key
      const fallback = generateFallbackLetter({ ...data, desiredOutcome: suggestedOutcome })
      return NextResponse.json({
        letter: fallback.letter,
        subject: fallback.subject,
        mock: true,
      })
    }

    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    })

    const currencySymbol = data.currency === "GBP" ? "£" : data.currency === "EUR" ? "€" : "$"

    // Build context for the AI
    const legalContext = data.legalBasis
      .map((law) => `- ${law.law} (${law.section}): ${law.summary}${law.strength ? ` [${law.strength} relevance]` : ""}`)
      .join("\n")

    const issuesContext = data.issues.map((issue, i) => `${i + 1}. ${issue}`).join("\n")

    const evidenceContext = data.evidenceAnalysis
      ? data.evidenceAnalysis.analyses
          .map(
            (e) =>
              `- ${e.fileName}: ${e.type} - ${e.description}${e.relevantDetails.length > 0 ? `. Key details: ${e.relevantDetails.join(", ")}` : ""}`
          )
          .join("\n")
      : data.evidenceFiles.map((f) => `- ${f}`).join("\n")

    // Always use assertive (firm & direct) tone
    const toneInstruction = "Write in an assertive, firm tone that clearly communicates dissatisfaction while remaining professional. Emphasize consumer rights and consequences of non-compliance."

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are an expert UK consumer rights advocate writing a formal complaint letter. Write a polished, professional letter that is READY TO SEND - no placeholders or template language.

TONE: ${toneInstruction}

SENDER INFORMATION:
${data.userProfile?.fullName ? `- Name: ${data.userProfile.fullName}` : "- Name: [Not provided - use placeholder]"}
${data.userProfile?.email ? `- Email: ${data.userProfile.email}` : ""}
${data.userProfile?.phone ? `- Phone: ${data.userProfile.phone}` : ""}
${data.userProfile?.address ? `- Address:\n${data.userProfile.address}` : ""}

CASE INFORMATION:
- Company: ${data.companyName}
- Incident Date: ${data.incidentDate || "Not specified"}
- Amount Involved: ${currencySymbol}${data.purchaseAmount}
- Resolution Being Sought: ${suggestedOutcome}
${data.incidentCountry ? `- Location: ${data.incidentCountry}` : ""}
${data.paymentMethod ? `- Payment Method: ${data.paymentMethod}` : ""}

CUSTOMER'S RAW ACCOUNT (you MUST completely rewrite this - NEVER copy verbatim):
"""
${data.complaint}
"""

IDENTIFIED ISSUES:
${issuesContext || "Poor customer service and failure to meet reasonable expectations"}

RELEVANT CONSUMER RIGHTS:
${legalContext || "Consumer Rights Act 2015 - services must be performed with reasonable care and skill"}

${data.feedback ? `SPECIFIC USER REQUESTS FOR THIS LETTER:\n${data.feedback}\n\n` : ""}

=== CRITICAL WRITING INSTRUCTIONS ===

You are writing a REAL complaint letter that will be sent to the company. This is NOT a template.

1. COMPLETELY REWRITE the customer's account:
   - Extract the facts: dates, times, locations, what happened, who was involved
   - Transform emotional/informal language into measured, professional prose
   - Expand on key points with professional phrasing
   - Structure the narrative chronologically and clearly
   - DO NOT copy ANY phrases verbatim from the customer's text
   - If they wrote "your horrid staff" → write "the unprofessional conduct of your employees"
   - If they wrote "we got treated extremely badly" → write "we were subjected to unacceptable treatment"

2. STRUCTURE:
   - Opening: State this is a formal complaint and briefly what it's about
   - Body (2-4 paragraphs): Tell the story professionally, weave in relevant consumer rights naturally
   - Resolution: Clearly state what you expect (use the suggested outcome above)
   - Deadline: Give 14 days
   - Escalation warning: Mention ombudsman, Trading Standards, social media, small claims if needed
   - Professional close

3. FORMAT RULES:
   - NO section headers like "SUMMARY:", "ISSUES:", "RESOLUTION:", etc.
   - Write flowing paragraphs like a proper letter
   - Open with "Dear ${data.companyName} Customer Relations,"
   - Close with "Yours faithfully,"
   - End with signature block using the SENDER INFORMATION provided above${data.userProfile?.fullName ? ` (use "${data.userProfile.fullName}" as the name)` : " (use [Your Full Name] as placeholder)"}
   - Include email${data.userProfile?.email ? ` (${data.userProfile.email})` : ""} and phone${data.userProfile?.phone ? ` (${data.userProfile.phone})` : ""} in signature if provided

4. QUALITY REQUIREMENTS:
   - 400-600 words
   - Professional but firm tone
   - Specific details (dates, amounts, locations)
   - Consumer rights mentioned naturally within narrative
   - Clear, actionable resolution request
   - Reference number at the end

Generate the letter now:`,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type")
    }

    let letterBody = content.text

    // Remove any "Subject:" line if the AI included one anyway
    letterBody = letterBody.replace(/^Subject:.*\n+/i, "").trim()

    // Generate a professional subject line based on the suggested outcome
    const outcomeForSubject = suggestedOutcome.split(",")[0].replace(/^a /, "").replace(/^an /, "")
    const subjectLine = `Formal Complaint - ${data.companyName} - ${outcomeForSubject.charAt(0).toUpperCase() + outcomeForSubject.slice(1)} Required${data.incidentDate ? ` (${data.incidentDate})` : ""}`

    return NextResponse.json({
      letter: letterBody,
      subject: subjectLine,
      mock: false,
    })
  } catch (error) {
    console.error("Letter generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate letter",
        letter: "",
        subject: "",
        mock: true,
      },
      { status: 500 }
    )
  }
}

function generateFallbackLetter(data: GenerateLetterRequest): { letter: string; subject: string } {
  const currencySymbol = data.currency === "GBP" ? "£" : data.currency === "EUR" ? "€" : "$"
  // Handle "ai-suggested" - use analyzed outcome instead of literal text
  const desiredOutcomeText = (!data.desiredOutcome || data.desiredOutcome === "ai-suggested")
    ? analyzeAndSuggestOutcome(data)
    : data.desiredOutcome.replace(/-/g, " ")
  const dateStr = data.incidentDate ? new Date(data.incidentDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "recently"

  // Clean up outcome text for subject line
  const outcomeForSubject = desiredOutcomeText.split(",")[0].replace(/^a /, "").replace(/^an /, "")
  const subject = `Formal Complaint - ${data.companyName} - ${outcomeForSubject.charAt(0).toUpperCase() + outcomeForSubject.slice(1)} Required`

  // Build legal rights paragraph
  const legalRightsSentences = data.legalBasis.length > 0
    ? data.legalBasis.map((law) => `Under the ${law.law}${law.section ? ` (${law.section})` : ""}, ${law.summary?.toLowerCase() || "I am entitled to services performed with reasonable care and skill"}.`).join(" ")
    : "Under the Consumer Rights Act 2015, I am entitled to services performed with reasonable care and skill."

  // Build issues list as prose
  const issuesText = data.issues.length > 0
    ? `The key issues include: ${data.issues.map(i => i.toLowerCase()).join("; ")}.`
    : ""

  // Attempt to clean up the complaint text slightly (basic improvements)
  let cleanedComplaint = data.complaint
    // Capitalize first letter of sentences
    .replace(/(^|[.!?]\s+)([a-z])/g, (_, sep, char) => sep + char.toUpperCase())
    // Add period at end if missing
    .replace(/([^.!?])\s*$/, "$1.")

  const letter = `Dear ${data.companyName} Customer Relations,

I am writing to formally complain about an unacceptable experience I had with your company on ${dateStr}. I am extremely disappointed with the level of service I received and believe this matter requires your immediate attention.

${cleanedComplaint}

${issuesText} ${legalRightsSentences} The treatment I received fell far below these standards and has caused me significant distress and inconvenience.

To resolve this matter, I am seeking ${desiredOutcomeText}${data.purchaseAmount && parseFloat(data.purchaseAmount) > 0 ? ` totalling ${currencySymbol}${parseFloat(data.purchaseAmount).toFixed(2)}` : ""}. I believe this is a fair and reasonable request given the circumstances.

I expect to receive a written response within 14 days of the date of this letter. Should I not receive a satisfactory resolution within this timeframe, I will have no choice but to escalate this complaint to the relevant ombudsman service, report the matter to Trading Standards, and share my experience on consumer review platforms. I may also consider pursuing the matter through the small claims court if necessary.

I trust you will treat this complaint with the seriousness it deserves and look forward to hearing from you promptly.

Yours faithfully,

${data.userProfile?.fullName || "[Your Full Name]"}
${data.userProfile?.address || "[Your Address]"}
${data.userProfile?.email || "[Your Email]"}
${data.userProfile?.phone || "[Your Phone Number]"}

Date: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
Reference: COMP-${Date.now().toString(36).toUpperCase()}`

  return { letter, subject }
}
