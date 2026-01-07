import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

interface AdCopyRequest {
  productName: string
  productDescription: string
  targetAudience?: string
  tone: "professional" | "casual" | "urgent" | "luxurious" | "playful"
  platform: "meta" | "google" | "tiktok"
}

interface AdCopy {
  headline: string
  primaryText: string
  description?: string
}

const PLATFORM_SPECS = {
  meta: {
    name: "Meta (Facebook/Instagram)",
    headlineLimit: 40,
    primaryTextLimit: 125,
    descriptionLimit: 30,
  },
  google: {
    name: "Google Ads",
    headlineLimit: 30,
    primaryTextLimit: 90,
    descriptionLimit: 90,
  },
  tiktok: {
    name: "TikTok",
    headlineLimit: 50,
    primaryTextLimit: 100,
    descriptionLimit: 0,
  },
}

const TONE_INSTRUCTIONS = {
  professional: "professional, trustworthy, and authoritative. Focus on credibility and expertise.",
  casual: "friendly, conversational, and approachable. Use natural language that feels like talking to a friend.",
  urgent: "urgent and action-oriented. Create FOMO and emphasize limited time/availability. Use strong CTAs.",
  luxurious: "premium, sophisticated, and exclusive. Emphasize quality, craftsmanship, and status.",
  playful: "fun, energetic, and engaging. Use wit, humor, and personality.",
}

export async function POST(request: NextRequest) {
  try {
    const data: AdCopyRequest = await request.json()

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

    if (!ANTHROPIC_API_KEY) {
      // Return fallback variations if no API key
      return NextResponse.json({
        variations: generateFallbackCopy(data),
        mock: true,
      })
    }

    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    })

    const platformSpec = PLATFORM_SPECS[data.platform]
    const toneInstruction = TONE_INSTRUCTIONS[data.tone]

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are an expert e-commerce copywriter who has written ads generating millions in revenue. Generate 3 unique ad copy variations for ${platformSpec.name}.

PRODUCT INFORMATION:
- Name: ${data.productName}
- Description: ${data.productDescription}
${data.targetAudience ? `- Target Audience: ${data.targetAudience}` : ""}

TONE: Write in a ${toneInstruction}

PLATFORM REQUIREMENTS:
- Headline: Maximum ${platformSpec.headlineLimit} characters
- Primary Text: Maximum ${platformSpec.primaryTextLimit} characters
${platformSpec.descriptionLimit > 0 ? `- Description: Maximum ${platformSpec.descriptionLimit} characters` : ""}

COPYWRITING BEST PRACTICES:
1. Lead with the benefit, not the feature
2. Use power words that trigger emotion
3. Include a clear call-to-action
4. Create curiosity or urgency where appropriate
5. Speak directly to the target audience's pain points or desires
6. Make every word count - be concise but impactful

Generate exactly 3 variations. Each should take a different angle:
- Variation 1: Focus on the primary benefit/transformation
- Variation 2: Focus on social proof/trust angle
- Variation 3: Focus on urgency/scarcity or unique differentiator

Return ONLY valid JSON in this exact format (no other text):
{
  "variations": [
    {
      "headline": "string",
      "primaryText": "string"${platformSpec.descriptionLimit > 0 ? ',\n      "description": "string"' : ""}
    }
  ]
}`,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type")
    }

    // Parse the JSON response
    let parsed
    try {
      // Extract JSON from the response (handle potential markdown code blocks)
      let jsonText = content.text.trim()
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```json?\n?/g, "").replace(/```$/g, "").trim()
      }
      parsed = JSON.parse(jsonText)
    } catch {
      // If parsing fails, return fallback
      return NextResponse.json({
        variations: generateFallbackCopy(data),
        mock: true,
        parseError: true,
      })
    }

    return NextResponse.json({
      variations: parsed.variations || [],
      mock: false,
    })
  } catch (error) {
    console.error("Ad copy generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate ad copy",
        variations: [],
        mock: true,
      },
      { status: 500 }
    )
  }
}

function generateFallbackCopy(data: AdCopyRequest): AdCopy[] {
  const platformSpec = PLATFORM_SPECS[data.platform]
  const hasDescription = platformSpec.descriptionLimit > 0

  const variations: AdCopy[] = [
    {
      headline: `Discover ${data.productName}`,
      primaryText: `${data.productDescription.slice(0, 80)}... Shop now!`,
      ...(hasDescription && { description: "Free shipping on orders $50+" }),
    },
    {
      headline: `Why Customers Love ${data.productName}`,
      primaryText: `Join thousands of happy customers. ${data.productDescription.slice(0, 50)}...`,
      ...(hasDescription && { description: "5-star rated" }),
    },
    {
      headline: `Limited Time: ${data.productName}`,
      primaryText: `Don't miss out! ${data.productDescription.slice(0, 60)}... Order today.`,
      ...(hasDescription && { description: "While supplies last" }),
    },
  ]

  return variations
}
