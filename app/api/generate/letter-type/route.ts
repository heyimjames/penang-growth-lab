import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

type LetterType =
  | "initial"           // First complaint letter
  | "follow-up"         // Follow-up when no response
  | "letter-before-action" // Final warning before legal action
  | "escalation"        // To ombudsman/regulatory body
  | "chargeback"        // Section 75 or chargeback claim to card issuer
  | "response-counter"  // Counter to company's response/offer

interface LegalBasis {
  law: string
  section?: string
  summary?: string
  strength?: string
}

interface EvidenceAnalysis {
  fileName: string
  type: string
  description: string
  relevantDetails: string[]
  suggestedUse: string
  strength: string
  userContext?: string
  indexedForLetter?: boolean
}

interface UserProfile {
  fullName: string | null
  email: string | null
  phone: string | null
  address: string | null
}

interface GenerateLetterTypeRequest {
  letterType: LetterType
  complaint: string
  companyName: string
  incidentDate: string | null
  purchaseAmount: string
  currency: string
  desiredOutcome: string
  tone: "formal" | "assertive" | "friendly"
  issues: string[]
  legalBasis: LegalBasis[]
  // Evidence analysis
  evidence?: EvidenceAnalysis[]
  // Additional context
  previousLetterDate?: string
  previousLetterSummary?: string
  companyResponse?: string
  companyOffer?: string
  ombudsmanName?: string
  regulatoryBody?: string
  cardIssuer?: string
  cardType?: string // visa, mastercard, amex
  paymentMethod?: string
  smallClaimsDeadline?: string
  incidentCountry?: string
  userCountry?: string
  caseReference?: string
  userProfile?: UserProfile
}

const currencySymbols: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
}

export async function POST(request: NextRequest) {
  try {
    const data: GenerateLetterTypeRequest = await request.json()

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({
        letter: generateFallbackLetter(data),
        subject: generateSubjectLine(data),
        mock: true,
      })
    }

    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    })

    const prompt = buildPromptForLetterType(data)

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type")
    }

    // Clean up the letter
    let letterBody = content.text.replace(/^Subject:.*\n+/i, "").trim()

    return NextResponse.json({
      letter: letterBody,
      subject: generateSubjectLine(data),
      letterType: data.letterType,
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

function buildPromptForLetterType(data: GenerateLetterTypeRequest): string {
  const currencySymbol = currencySymbols[data.currency] || data.currency
  const amount = parseFloat(data.purchaseAmount) || 0
  const amountStr = amount > 0 ? `${currencySymbol}${amount.toFixed(2)}` : ""

  const legalContext = data.legalBasis
    .map((law) => `- ${law.law}${law.section ? ` (${law.section})` : ""}: ${law.summary || ""}`)
    .join("\n")

  // Build evidence context - prioritize indexed evidence, include analysis details
  const indexedEvidence = data.evidence?.filter(e => e.indexedForLetter) || []
  const otherEvidence = data.evidence?.filter(e => !e.indexedForLetter) || []

  const evidenceContext = indexedEvidence.length > 0 || otherEvidence.length > 0
    ? `
SUPPORTING EVIDENCE:
${indexedEvidence.length > 0 ? `
Key Evidence (reference in letter):
${indexedEvidence.map((e, i) => `${i + 1}. ${e.fileName} (${e.type}, ${e.strength} evidence)
   - What it shows: ${e.description}
   - Key details: ${e.relevantDetails.join("; ")}
   - Suggested use: ${e.suggestedUse}${e.userContext ? `
   - User notes: ${e.userContext}` : ""}`).join("\n")}
` : ""}
${otherEvidence.length > 0 ? `
Additional Evidence Available:
${otherEvidence.map((e, i) => `${i + 1}. ${e.fileName} (${e.type}): ${e.description}`).join("\n")}
` : ""}
IMPORTANT: When writing the letter, naturally reference the key evidence to strengthen your case. Mention specific documents, receipts, or communications that support your claims.
`
    : ""

  // Build sender information from user profile
  const senderInfo = data.userProfile ? `
SENDER INFORMATION:
${data.userProfile.fullName ? `- Name: ${data.userProfile.fullName}` : "- Name: [Not provided - use placeholder]"}
${data.userProfile.email ? `- Email: ${data.userProfile.email}` : ""}
${data.userProfile.phone ? `- Phone: ${data.userProfile.phone}` : ""}
${data.userProfile.address ? `- Address:\n${data.userProfile.address}` : ""}
` : ""

  const baseContext = `${senderInfo}
CASE DETAILS:
- Company: ${data.companyName}
- Incident Date: ${data.incidentDate || "Not specified"}
- Amount: ${amountStr}
- Desired Outcome: ${data.desiredOutcome}
${data.caseReference ? `- Reference: ${data.caseReference}` : ""}
${data.incidentCountry ? `- Location: ${data.incidentCountry}` : ""}

COMPLAINT SUMMARY:
${data.complaint}

IDENTIFIED ISSUES:
${data.issues.map((i, idx) => `${idx + 1}. ${i}`).join("\n")}

RELEVANT CONSUMER RIGHTS:
${legalContext || "Consumer Rights Act 2015"}
${evidenceContext}`

  switch (data.letterType) {
    case "follow-up":
      return `You are a UK consumer rights expert writing a follow-up complaint letter.

${baseContext}

PREVIOUS CORRESPONDENCE:
- Original complaint sent: ${data.previousLetterDate || "14+ days ago"}
- Summary: ${data.previousLetterSummary || "Initial formal complaint"}
- Company response: None received

INSTRUCTIONS:
Write a firm but professional follow-up letter. This is the second attempt to resolve the matter.

Structure:
1. Reference the original complaint and date sent
2. Express disappointment at lack of response
3. Reiterate the key issues briefly
4. Restate the desired resolution
5. Set a NEW 7-day deadline
6. Warn that failure to respond will result in escalation to:
   - The relevant ombudsman service
   - Trading Standards
   - Small claims court if necessary
7. Mention you will also share your experience publicly on review platforms

Tone: More assertive than the original letter, but still professional.

Format:
- Open: "Dear ${data.companyName} Customer Relations,"
- Close: "Yours faithfully,"
- Include signature block placeholders
- Reference previous complaint reference if provided

Generate the follow-up letter now:`

    case "letter-before-action":
      return `You are a UK consumer rights expert writing a formal Letter Before Action (LBA).

${baseContext}

PREVIOUS CORRESPONDENCE:
- Original complaint sent: ${data.previousLetterDate || "Over 14 days ago"}
- Follow-up attempts made: At least one
- Company response: ${data.companyResponse || "Inadequate or none"}
${data.companyOffer ? `- Company's offer (rejected): ${data.companyOffer}` : ""}

CRITICAL: This is a LEGAL document - the final step before court proceedings.

STRUCTURE (must include ALL elements):
1. TITLE: "LETTER BEFORE ACTION" at the top (this IS a heading exception)
2. State this is a formal Letter Before Action under the Pre-Action Protocol for Debt Claims
3. Reference all previous correspondence
4. State the legal basis for your claim (cite specific laws)
5. State the EXACT amount claimed: ${amountStr}
6. Include any additional costs/interest you're entitled to
7. Give a FINAL 14-day deadline
8. State that if payment/resolution is not received, you WILL issue a claim through the County Court (Money Claims Online)
9. Mention the defendant will be liable for court fees and any additional costs
10. Request they provide their full legal name and address for service of proceedings

LEGAL REQUIREMENTS TO INCLUDE:
- Under Civil Procedure Rules, this letter serves as formal notice of intended legal action
- The claim will be for: [original amount] + [interest under s.69 County Courts Act 1984] + [court fees]
- Reference Pre-Action Protocol compliance

Tone: Extremely formal and legally precise. This is a legal document.

Format:
- Title: "LETTER BEFORE ACTION" (centered, bold implied)
- Open: "Dear Sir/Madam," or "To: ${data.companyName} Legal Department"
- Close: "Yours faithfully,"
- Date prominently displayed
- "WITHOUT PREJUDICE SAVE AS TO COSTS" header
- Signature block with full address

Generate the Letter Before Action now:`

    case "escalation":
      return `You are a UK consumer rights expert writing an escalation letter to a regulatory body or ombudsman.

${baseContext}

ESCALATION TARGET: ${data.ombudsmanName || data.regulatoryBody || "Relevant Ombudsman Service"}

PREVIOUS CORRESPONDENCE:
- Original complaint to company: ${data.previousLetterDate || "Over 8 weeks ago"}
- Company response: ${data.companyResponse || "Unsatisfactory"}
${data.companyOffer ? `- Company's final offer: ${data.companyOffer}` : ""}

STRUCTURE:
1. Introduce yourself and state you're making a formal complaint
2. Identify the company you're complaining about
3. Explain you've exhausted the company's complaint process (8-week rule)
4. Provide a clear, chronological summary of events
5. List the issues and how the company failed to resolve them
6. State what resolution you're seeking
7. Attach/reference all previous correspondence
8. Request the ombudsman's intervention

Important: Ombudsmen expect:
- Clear, factual presentation
- Evidence of attempting to resolve directly first
- Specific desired outcome
- All relevant dates and references

Tone: Factual, measured, and professional. Ombudsmen respond better to calm, clear complaints.

Format:
- Open: "Dear ${data.ombudsmanName || "Sir/Madam"},"
- Close: "Yours faithfully,"
- Include list of attached documents at the end
- Reference: "Complaint against ${data.companyName}"

Generate the escalation letter now:`

    case "chargeback":
      return `You are a UK consumer rights expert writing a Section 75 claim or chargeback request letter.

${baseContext}

PAYMENT DETAILS:
- Card issuer: ${data.cardIssuer || "Credit card provider"}
- Card type: ${data.cardType || "Credit card"}
- Payment method: ${data.paymentMethod || "Credit card"}
- Amount paid: ${amountStr}

${data.cardType?.toLowerCase().includes("credit") || data.paymentMethod?.toLowerCase().includes("credit") ? `
SECTION 75 CLAIM:
Under Section 75 of the Consumer Credit Act 1974, the card issuer is jointly and severally liable with the merchant for any breach of contract or misrepresentation, provided:
- The item/service cost over £100 and under £30,000
- Payment was made by credit card (not debit)
` : `
CHARGEBACK REQUEST:
This is a request for chargeback under the card scheme rules (Visa/Mastercard dispute resolution).
`}

STRUCTURE:
1. State this is a ${data.cardType?.toLowerCase().includes("credit") ? "Section 75 claim" : "chargeback request"}
2. Provide your card details (last 4 digits only)
3. Identify the transaction: merchant, date, amount
4. Explain what you purchased and what went wrong
5. Explain attempts to resolve with the merchant
6. State the legal basis (Section 75 or chargeback scheme rules)
7. Request a full refund of ${amountStr}
8. Offer to provide any additional documentation

LEGAL POINTS TO INCLUDE:
${data.cardType?.toLowerCase().includes("credit") ? `
- Section 75 Consumer Credit Act 1974 creates joint liability
- The card issuer has 8 weeks to respond
- If rejected, you can escalate to the Financial Ombudsman Service
` : `
- Chargeback is a card scheme rule, not a legal right
- Time limits apply (usually 120 days from transaction or discovery)
- Request the bank processes under "goods/services not as described" or "non-delivery"
`}

Tone: Professional and factual. Banks respond to clear documentation.

Format:
- Open: "Dear ${data.cardIssuer || "Card Services Team"},"
- Close: "Yours faithfully,"
- Subject: "${data.cardType?.toLowerCase().includes("credit") ? "Section 75" : "Chargeback"} Claim - Transaction on [date] - ${data.companyName}"
- Include card number (last 4 digits only: XXXX XXXX XXXX 1234)

Generate the ${data.cardType?.toLowerCase().includes("credit") ? "Section 75" : "chargeback"} letter now:`

    case "response-counter":
      return `You are a UK consumer rights expert writing a response to a company's inadequate offer.

${baseContext}

COMPANY'S RESPONSE/OFFER:
${data.companyResponse || "The company has responded but their offer is inadequate."}

Their offer: ${data.companyOffer || "Partial resolution/goodwill gesture"}

STRUCTURE:
1. Acknowledge receipt of their response
2. Explain why their offer is inadequate
3. Reference your legal rights (the offer doesn't meet legal requirements)
4. Counter with what you actually require
5. Give reasons why your counter is fair and reasonable
6. Set a deadline (7 days)
7. State next steps if not resolved (escalation, legal action)

IMPORTANT POINTS:
- Don't accept "goodwill gestures" if you're legally entitled to more
- Point out if their offer doesn't meet Consumer Rights Act standards
- Be specific about the gap between their offer and your entitlement
- Make clear this is your final attempt before escalation

Tone: Firm and assertive - make clear you know your rights. Write in an assertive, firm tone that clearly communicates dissatisfaction while remaining professional. Emphasize consumer rights and consequences of non-compliance.

Format:
- Open: "Dear ${data.companyName} Customer Relations,"
- Close: "Yours faithfully,"
- Reference their response date and any reference numbers

Generate the counter-response letter now:`

    default: // "initial" or fallback
      return `You are a UK consumer rights expert writing a formal complaint letter.

${baseContext}

Write a professional complaint letter that:
1. Clearly states this is a formal complaint
2. Explains what happened (rewrite professionally, don't copy verbatim)
3. References relevant consumer rights naturally
4. States the desired resolution: ${data.desiredOutcome}
5. Sets a 14-day deadline
6. Warns of escalation if not resolved

Tone: Write in an assertive, firm tone that clearly communicates dissatisfaction while remaining professional. Emphasize consumer rights and consequences of non-compliance.
Format: Proper business letter, no section headers, flowing paragraphs.
- Open: "Dear ${data.companyName} Customer Relations,"
- Close: "Yours faithfully,"

Generate the letter now:`
  }
}

function generateSubjectLine(data: GenerateLetterTypeRequest): string {
  const typeLabels: Record<LetterType, string> = {
    initial: "Formal Complaint",
    "follow-up": "Follow-Up - Formal Complaint",
    "letter-before-action": "LETTER BEFORE ACTION",
    escalation: "Formal Complaint",
    chargeback: data.cardType?.toLowerCase().includes("credit") ? "Section 75 Claim" : "Chargeback Request",
    "response-counter": "Response to Your Offer",
  }

  const prefix = typeLabels[data.letterType] || "Formal Complaint"
  const ref = data.caseReference ? ` - Ref: ${data.caseReference}` : ""

  return `${prefix} - ${data.companyName}${ref}`
}

function generateFallbackLetter(data: GenerateLetterTypeRequest): string {
  const currencySymbol = currencySymbols[data.currency] || data.currency
  const amount = parseFloat(data.purchaseAmount) || 0
  const dateStr = data.incidentDate
    ? new Date(data.incidentDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "recently"

  if (data.letterType === "letter-before-action") {
    return `LETTER BEFORE ACTION
WITHOUT PREJUDICE SAVE AS TO COSTS

Date: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

To: ${data.companyName}
Legal Department / Registered Office

Dear Sir/Madam,

RE: LETTER BEFORE ACTION - PRE-ACTION PROTOCOL FOR DEBT CLAIMS
${data.caseReference ? `Reference: ${data.caseReference}` : ""}

I am writing to notify you that I intend to issue legal proceedings against you in the County Court unless the matter detailed below is resolved within 14 days of the date of this letter.

THE CLAIM

On ${dateStr}, I purchased goods/services from your company. ${data.complaint}

Despite my previous correspondence dated ${data.previousLetterDate || "[date of original complaint]"}, this matter remains unresolved.

AMOUNT CLAIMED

Principal sum: ${currencySymbol}${amount.toFixed(2)}
Interest (s.69 County Courts Act 1984): To be calculated
Court fees: To be added if proceedings issued

Total claim: ${currencySymbol}${amount.toFixed(2)} plus interest and costs

LEGAL BASIS

${data.legalBasis.map(l => `- ${l.law}${l.section ? ` (${l.section})` : ""}`).join("\n")}

YOUR RESPONSE

You have 14 days from the date of this letter to:

1. Pay the sum of ${currencySymbol}${amount.toFixed(2)} in full; OR
2. Provide a written proposal for settlement

If I do not receive a satisfactory response within this timeframe, I will issue a claim through Money Claims Online (MCOL) without further notice. You will then be liable for:
- The principal sum claimed
- Interest continuing to accrue
- Court issue fee
- Any other costs incurred

Please also provide your full legal name and registered address for service of proceedings.

This letter is sent in compliance with the Pre-Action Protocol for Debt Claims and may be shown to the court.

Yours faithfully,

[Your Full Name]
[Your Address]
[Your Email]
[Your Phone Number]`
  }

  // Default fallback for other types
  return `Dear ${data.companyName} Customer Relations,

I am writing to formally complain about an issue that occurred on ${dateStr}.

${data.complaint}

Under consumer protection law, I am entitled to ${data.desiredOutcome}.

I expect a response within 14 days. If this matter is not resolved satisfactorily, I will escalate to the relevant ombudsman service and consider legal action.

Yours faithfully,

[Your Full Name]
[Your Address]
[Your Email]`
}
