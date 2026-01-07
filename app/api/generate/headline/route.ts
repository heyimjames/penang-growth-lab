import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

interface HeadlineRequest {
  topic: string
  context?: string
  type: "ad" | "email" | "landing" | "social"
  tone: "professional" | "casual" | "urgent" | "curious" | "emotional"
}

interface Headline {
  headline: string
  angle: string
}

const TYPE_SPECS = {
  ad: {
    name: "Ad Headlines",
    maxLength: 40,
    context: "paid advertising on Meta/Google",
  },
  email: {
    name: "Email Subject Lines",
    maxLength: 60,
    context: "email marketing campaigns",
  },
  landing: {
    name: "Landing Page Headlines",
    maxLength: 80,
    context: "landing page hero sections",
  },
  social: {
    name: "Social Media Hooks",
    maxLength: 100,
    context: "organic social media posts",
  },
}

const TONE_INSTRUCTIONS = {
  professional: "authoritative, trustworthy, and credible",
  casual: "friendly, conversational, and approachable",
  urgent: "time-sensitive, creating FOMO and urgency",
  curious: "intriguing, asking questions, sparking curiosity",
  emotional: "emotionally resonant, touching on desires and pain points",
}

export async function POST(request: NextRequest) {
  try {
    const data: HeadlineRequest = await request.json()

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({
        headlines: generateFallbackHeadlines(data),
        mock: true,
      })
    }

    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    })

    const typeSpec = TYPE_SPECS[data.type]
    const toneInstruction = TONE_INSTRUCTIONS[data.tone]

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `You are an expert copywriter who has written headlines generating millions in engagement and conversions. Generate 6 unique ${typeSpec.name} for ${typeSpec.context}.

TOPIC: ${data.topic}
${data.context ? `ADDITIONAL CONTEXT: ${data.context}` : ""}

REQUIREMENTS:
- Maximum ${typeSpec.maxLength} characters per headline
- Tone: ${toneInstruction}
- Each headline should use a different angle/approach

COPYWRITING ANGLES TO USE (one per headline):
1. Benefit-focused: Lead with the transformation or outcome
2. Problem-agitate: Address a pain point directly
3. Social proof: Imply popularity or success of others
4. Curiosity gap: Create intrigue without giving everything away
5. Question-based: Engage by asking a compelling question
6. Numbers/specificity: Use specific numbers or data points

Return ONLY valid JSON in this exact format (no other text):
{
  "headlines": [
    {
      "headline": "string",
      "angle": "string (one of: benefit, problem, social-proof, curiosity, question, numbers)"
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

    let parsed
    try {
      let jsonText = content.text.trim()
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```json?\n?/g, "").replace(/```$/g, "").trim()
      }
      parsed = JSON.parse(jsonText)
    } catch {
      return NextResponse.json({
        headlines: generateFallbackHeadlines(data),
        mock: true,
        parseError: true,
      })
    }

    return NextResponse.json({
      headlines: parsed.headlines || [],
      mock: false,
    })
  } catch (error) {
    console.error("Headline generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate headlines",
        headlines: [],
        mock: true,
      },
      { status: 500 }
    )
  }
}

function generateFallbackHeadlines(data: HeadlineRequest): Headline[] {
  const topic = data.topic.slice(0, 30)
  return [
    { headline: `Discover the Secret to ${topic}`, angle: "curiosity" },
    { headline: `Why 10,000+ Choose ${topic}`, angle: "social-proof" },
    { headline: `Transform Your Results with ${topic}`, angle: "benefit" },
    { headline: `Struggling with ${topic}? Here's the Fix`, angle: "problem" },
    { headline: `What If ${topic} Was Easier?`, angle: "question" },
    { headline: `3 Ways ${topic} Changes Everything`, angle: "numbers" },
  ]
}
