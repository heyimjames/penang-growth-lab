import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

interface TermsAnalysis {
  summary: string
  keyFindings: {
    category: string
    finding: string
    userImpact: "positive" | "negative" | "neutral"
    quote?: string
  }[]
  refundPolicy: {
    summary: string
    timeLimit?: string
    conditions?: string[]
    loopholes?: string[]
  } | null
  cancellationPolicy: {
    summary: string
    noticePeriod?: string
    fees?: string
    restrictions?: string[]
  } | null
  liabilityLimitations: {
    summary: string
    exclusions: string[]
    caps?: string
  } | null
  disputeResolution: {
    method: string
    arbitrationRequired: boolean
    jurisdiction?: string
    timeLimit?: string
  } | null
  unfairTerms: {
    term: string
    reason: string
    law: string
  }[]
  userRights: string[]
  companyObligations: string[]
  redFlags: string[]
  strengthsForConsumer: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { companyName, companyDomain, complaintType } = await request.json()

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({
        analysis: null,
        termsFound: false,
        mock: true,
        message: "API key not configured"
      })
    }

    // Determine domain to scrape
    let domain = companyDomain
    if (!domain) {
      domain = guessDomain(companyName)
    }

    // Common terms and conditions page paths
    const termsPaths = [
      "/terms",
      "/terms-and-conditions",
      "/terms-of-service",
      "/tos",
      "/legal/terms",
      "/legal",
      "/conditions",
      "/terms-conditions",
      "/user-agreement",
    ]

    let termsContent = ""
    let termsUrl = ""
    let privacyContent = ""

    if (FIRECRAWL_API_KEY) {
      // Try to find and scrape terms page
      for (const path of termsPaths) {
        try {
          const url = `https://${domain}${path}`
          const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url,
              formats: ["markdown"],
              waitFor: 2000,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.data?.markdown && data.data.markdown.length > 500) {
              termsContent = data.data.markdown
              termsUrl = url
              break
            }
          }
        } catch {
          continue
        }
      }

      // Also try to get refund/cancellation specific pages
      const refundPaths = ["/refund-policy", "/refunds", "/returns", "/cancellation-policy", "/cancellation"]
      for (const path of refundPaths) {
        try {
          const url = `https://${domain}${path}`
          const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url,
              formats: ["markdown"],
              waitFor: 2000,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.data?.markdown && data.data.markdown.length > 200) {
              termsContent += "\n\n--- REFUND/CANCELLATION POLICY ---\n\n" + data.data.markdown
              break
            }
          }
        } catch {
          continue
        }
      }
    }

    if (!termsContent) {
      return NextResponse.json({
        analysis: null,
        termsFound: false,
        termsUrl: null,
        mock: false,
        message: `Could not find terms and conditions for ${companyName}. You may want to search manually at https://${domain}`
      })
    }

    // Truncate if too long (keep first 50k characters for analysis)
    const truncatedTerms = termsContent.slice(0, 50000)

    // Analyze with Claude
    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    })

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are a UK consumer rights expert analyzing a company's terms and conditions to help a consumer with a complaint.

COMPANY: ${companyName}
${complaintType ? `COMPLAINT TYPE: ${complaintType}` : ""}

TERMS AND CONDITIONS:
"""
${truncatedTerms}
"""

Analyze these terms from a consumer's perspective. Focus on:
1. What the company might use against the consumer
2. What protections the consumer has
3. Any potentially unfair terms under UK Consumer Rights Act 2015
4. Refund and cancellation policies
5. Liability limitations
6. Dispute resolution requirements

Return your analysis as JSON in this exact format:
{
  "summary": "Brief 2-3 sentence summary of key findings",
  "keyFindings": [
    {
      "category": "category name",
      "finding": "what you found",
      "userImpact": "positive|negative|neutral",
      "quote": "relevant quote from terms if applicable"
    }
  ],
  "refundPolicy": {
    "summary": "summary of refund policy",
    "timeLimit": "time limit if specified",
    "conditions": ["condition 1", "condition 2"],
    "loopholes": ["potential loopholes consumer can use"]
  },
  "cancellationPolicy": {
    "summary": "summary",
    "noticePeriod": "notice period if any",
    "fees": "any cancellation fees",
    "restrictions": ["restrictions"]
  },
  "liabilityLimitations": {
    "summary": "how company limits liability",
    "exclusions": ["things they exclude"],
    "caps": "any monetary caps"
  },
  "disputeResolution": {
    "method": "how disputes are handled",
    "arbitrationRequired": true/false,
    "jurisdiction": "which courts/law applies",
    "timeLimit": "time limit to raise disputes"
  },
  "unfairTerms": [
    {
      "term": "the potentially unfair term",
      "reason": "why it may be unfair",
      "law": "relevant UK law that might invalidate it"
    }
  ],
  "userRights": ["rights the consumer has according to these terms"],
  "companyObligations": ["what the company must do"],
  "redFlags": ["things to watch out for"],
  "strengthsForConsumer": ["things that help the consumer's case"]
}

Return ONLY the JSON, no other text.`,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type")
    }

    // Parse JSON response
    let analysis: TermsAnalysis
    try {
      // Remove any markdown code blocks if present
      const jsonText = content.text.replace(/```json\n?|\n?```/g, "").trim()
      analysis = JSON.parse(jsonText)
    } catch {
      console.error("Failed to parse terms analysis JSON:", content.text)
      return NextResponse.json({
        analysis: null,
        termsFound: true,
        termsUrl,
        rawAnalysis: content.text,
        mock: false,
        message: "Analysis completed but could not parse structured response"
      })
    }

    return NextResponse.json({
      analysis,
      termsFound: true,
      termsUrl,
      termsLength: termsContent.length,
      mock: false,
    })
  } catch (error) {
    console.error("Terms analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze terms" }, { status: 500 })
  }
}

function guessDomain(companyName: string): string {
  const normalized = companyName.toLowerCase().trim()

  const knownDomains: Record<string, string> = {
    amazon: "amazon.co.uk",
    "amazon uk": "amazon.co.uk",
    "british airways": "britishairways.com",
    ba: "britishairways.com",
    ryanair: "ryanair.com",
    easyjet: "easyjet.com",
    "virgin atlantic": "virginatlantic.com",
    hilton: "hilton.com",
    marriott: "marriott.com",
    tesco: "tesco.com",
    sainsburys: "sainsburys.co.uk",
    "sainsbury's": "sainsburys.co.uk",
    asda: "asda.com",
    argos: "argos.co.uk",
    currys: "currys.co.uk",
    "john lewis": "johnlewis.com",
    vodafone: "vodafone.co.uk",
    ee: "ee.co.uk",
    three: "three.co.uk",
    o2: "o2.co.uk",
    sky: "sky.com",
    bt: "bt.com",
    "virgin media": "virginmedia.com",
    virgin: "virginmedia.com",
    "booking.com": "booking.com",
    booking: "booking.com",
    airbnb: "airbnb.co.uk",
    expedia: "expedia.co.uk",
    trainline: "thetrainline.com",
    "the trainline": "thetrainline.com",
    uber: "uber.com",
    deliveroo: "deliveroo.co.uk",
    "just eat": "just-eat.co.uk",
    justeat: "just-eat.co.uk",
    asos: "asos.com",
    boohoo: "boohoo.com",
    prettylittlething: "prettylittlething.com",
    shein: "shein.co.uk",
    apple: "apple.com",
    microsoft: "microsoft.com",
    google: "google.com",
    spotify: "spotify.com",
    netflix: "netflix.com",
    "disney+": "disneyplus.com",
    disney: "disneyplus.com",
  }

  if (knownDomains[normalized]) {
    return knownDomains[normalized]
  }

  // Try to create a domain from the name
  return normalized.replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") + ".com"
}
