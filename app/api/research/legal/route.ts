import { type NextRequest, NextResponse } from "next/server"

// Country code to name mapping
const countries: Record<string, string> = {
  GB: "United Kingdom",
  US: "United States",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  PT: "Portugal",
  GR: "Greece",
  IE: "Ireland",
  AT: "Austria",
  BE: "Belgium",
  SE: "Sweden",
  DK: "Denmark",
  PL: "Poland",
  CZ: "Czech Republic",
  HU: "Hungary",
  FI: "Finland",
  RO: "Romania",
  BG: "Bulgaria",
  HR: "Croatia",
  SK: "Slovakia",
  SI: "Slovenia",
  LT: "Lithuania",
  LV: "Latvia",
  EE: "Estonia",
  CY: "Cyprus",
  MT: "Malta",
  LU: "Luxembourg",
  TH: "Thailand",
  JP: "Japan",
  SG: "Singapore",
  HK: "Hong Kong",
  MY: "Malaysia",
  ID: "Indonesia",
  PH: "Philippines",
  VN: "Vietnam",
  AU: "Australia",
  NZ: "New Zealand",
  CA: "Canada",
  MX: "Mexico",
  BR: "Brazil",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  ZA: "South Africa",
  IN: "India",
  CN: "China",
  KR: "South Korea",
  TW: "Taiwan",
}

// Map country codes to regions for legal research
function getRegionFromCountry(countryCode: string): string {
  const euCountries = ["DE", "FR", "ES", "IT", "NL", "PT", "GR", "IE", "AT", "BE", "SE", "DK", "PL", "CZ", "HU", "FI", "RO", "BG", "HR", "SK", "SI", "LT", "LV", "EE", "CY", "MT", "LU"]
  if (countryCode === "GB") return "UK"
  if (euCountries.includes(countryCode)) return "EU"
  if (countryCode === "US") return "US"
  if (["AU", "NZ"].includes(countryCode)) return "ANZ"
  if (["TH", "JP", "SG", "HK", "MY", "ID", "PH", "VN"].includes(countryCode)) return "ASIA"
  return "INTERNATIONAL"
}

function getPaymentProtections(paymentMethod: string, cardType: string, userCountry: string): string {
  const protections: string[] = []

  if (paymentMethod === "credit-card") {
    if (userCountry === "GB") {
      protections.push("Section 75 of the Consumer Credit Act 1974 - joint liability for purchases £100-£30,000")
    }
    if (cardType === "amex") {
      protections.push("American Express Purchase Protection and Dispute Resolution")
    }
    if (cardType === "visa" || cardType === "mastercard") {
      protections.push("Chargeback rights - dispute transaction within 120 days")
    }
  }

  if (paymentMethod === "debit-card") {
    protections.push("Chargeback scheme - can dispute transactions through your bank")
  }

  if (paymentMethod === "paypal") {
    protections.push("PayPal Buyer Protection - covers eligible purchases")
  }

  return protections.length > 0 ? protections.join("\n") : "Standard consumer protections apply"
}

function getPlatformPolicies(platform: string): string {
  const policies: Record<string, string> = {
    "booking.com": "Booking.com Customer Service Promise, free cancellation policies, Partner misconduct reporting",
    "expedia": "Expedia Price Guarantee, Customer Support resolution process",
    "airbnb": "Airbnb AirCover for Guests - rebooking assistance, refund policy, 24-hour safety line",
    "hotels.com": "Hotels.com Best Price Guarantee, Rewards program protections",
    "agoda": "Agoda Best Price Guarantee, Customer Support escalation",
    "amazon": "Amazon A-to-z Guarantee - covers purchases from third-party sellers",
    "ebay": "eBay Money Back Guarantee - item not received or not as described",
    "uber": "Uber price protection, fare review process, safety incident reporting",
    "deliveroo": "Deliveroo refund policy for missing/incorrect items",
  }
  return policies[platform] || ""
}

export async function POST(request: NextRequest) {
  try {
    const {
      complaint,
      companyName,
      category,
      incidentCountry,
      userCountry,
      paymentMethod,
      cardType,
      bookingPlatform
    } = await request.json()

    if (!complaint) {
      return NextResponse.json({ error: "Complaint is required" }, { status: 400 })
    }

    const incidentRegion = getRegionFromCountry(incidentCountry || "GB")
    const userRegion = getRegionFromCountry(userCountry || "GB")
    const paymentProtections = getPaymentProtections(paymentMethod || "", cardType || "", userCountry || "GB")
    const platformPolicy = getPlatformPolicies(bookingPlatform || "")

    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY

    if (!PERPLEXITY_API_KEY) {
      // Return fallback legal info if no API key
      return NextResponse.json({
        laws: [
          {
            name: "Consumer Rights Act 2015",
            section: "Section 49",
            summary: "Services must be performed with reasonable care and skill.",
            relevance: "high",
          },
          {
            name: "Consumer Rights Act 2015",
            section: "Section 54",
            summary: "Right to price reduction or repeat performance if service is not satisfactory.",
            relevance: "medium",
          },
        ],
        precedents: [],
        recommendations: [
          "Document all communications with the company",
          "Keep receipts and evidence of the transaction",
          "Consider escalating to a regulatory body if the company doesn't respond",
        ],
        paymentProtections,
        platformPolicy,
        mock: true,
      })
    }

    // Build jurisdiction-aware system prompt
    let jurisdictionGuidance = ""

    if (incidentRegion === "UK" || userRegion === "UK") {
      jurisdictionGuidance += `
UK Consumer Laws:
- Consumer Rights Act 2015 (goods, services, digital content)
- Consumer Contracts Regulations 2013 (online/distance selling, 14-day cooling off)
- Package Travel Regulations 2018 (package holidays)
- EC 261/2004 (UK retained law for flight delays/cancellations)
- Section 75 Consumer Credit Act (credit card purchases £100-£30,000)
`
    }

    if (incidentRegion === "EU" || userRegion === "EU") {
      jurisdictionGuidance += `
EU Consumer Laws:
- EU Consumer Rights Directive 2011/83/EU (14-day withdrawal right)
- EU Package Travel Directive 2015/2302
- EC 261/2004 (flight compensation regulation)
- Consumer Sales Directive (conformity guarantees)
- ADR Directive (Alternative Dispute Resolution)
`
    }

    if (incidentRegion === "US" || userRegion === "US") {
      jurisdictionGuidance += `
US Consumer Laws:
- Fair Credit Billing Act (credit card disputes)
- Magnuson-Moss Warranty Act
- FTC Act Section 5 (unfair/deceptive practices)
- State consumer protection laws vary
`
    }

    if (incidentRegion === "ASIA") {
      jurisdictionGuidance += `
Note: Consumer protections vary significantly in Asian countries. Focus on:
- International booking platform policies and guarantees
- Credit card chargeback rights (international)
- Travel insurance coverage
- Embassy/consulate assistance for serious issues
`
    }

    // Use Perplexity to research relevant consumer laws
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: `You are an international consumer rights expert. Research and cite specific consumer protection laws, regulations, and precedents relevant to the complaint based on where it happened and where the consumer lives.

${jurisdictionGuidance}

${paymentMethod ? `Payment Method Protections:\n${paymentProtections}` : ""}

${platformPolicy ? `Platform-Specific Policies:\n${platformPolicy}` : ""}

Consider:
1. Laws in the country where the incident occurred
2. Laws in the consumer's home country (may have extraterritorial application)
3. Credit card/payment protections that apply regardless of location
4. Platform guarantees and dispute resolution processes
5. International treaties and conventions if applicable

Provide your response in JSON format:
{
  "laws": [{ "name": string, "section": string, "summary": string, "relevance": "high" | "medium" | "low", "jurisdiction": string }],
  "precedents": [{ "case": string, "summary": string, "relevance": string }],
  "recommendations": string[],
  "regulatoryBodies": [{ "name": string, "website": string, "when": string, "jurisdiction": string }],
  "paymentOptions": [{ "method": string, "action": string, "deadline": string }],
  "platformResolution": { "platform": string, "process": string, "contact": string } | null
}`,
          },
          {
            role: "user",
            content: `Research relevant consumer protection laws for this complaint:

Company: ${companyName}
Category: ${category || "General consumer complaint"}
Incident Location: ${incidentCountry ? countries[incidentCountry] || incidentCountry : "Not specified"}
Consumer Location: ${userCountry ? countries[userCountry] || userCountry : "Not specified"}
Payment Method: ${paymentMethod || "Not specified"}${cardType ? ` (${cardType})` : ""}
Booking Platform: ${bookingPlatform || "Direct booking"}

Complaint:
${complaint}

What laws and protections apply to this consumer? Consider both the incident location and consumer's home country.`,
          },
        ],
        temperature: 0.1,
        max_tokens: 3000,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error("Perplexity API error:", response.status, errorBody)
      throw new Error(`Perplexity API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ""

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse Perplexity response")
    }

    const legalResearch = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      ...legalResearch,
      citations: data.citations || [],
      mock: false,
    })
  } catch (error) {
    console.error("Legal research error:", error)

    // Return fallback
    return NextResponse.json({
      laws: [
        {
          name: "Consumer Rights Act 2015",
          section: "Section 49",
          summary: "Services must be performed with reasonable care and skill.",
          relevance: "high",
        },
      ],
      precedents: [],
      recommendations: [
        "Document all communications with the company",
        "Consider escalating to a regulatory body if needed",
      ],
      mock: true,
      error: "Legal research temporarily unavailable",
    })
  }
}
