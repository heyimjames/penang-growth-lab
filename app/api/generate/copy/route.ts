import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

interface CopyRequest {
  copyType: string
  productName: string
  productDescription: string
  targetAudience: string
  tone: string
  keyBenefits: string
  additionalContext?: string
}

interface CopyVariation {
  headline: string
  body: string
  cta?: string
  angle: string
}

interface CopyResponse {
  variations: CopyVariation[]
  tips: string[]
}

const copyTypePrompts: Record<string, string> = {
  "product-description": `Write compelling product descriptions that sell. Focus on benefits over features, use sensory language, and create desire. Each variation should take a different angle (problem-solution, lifestyle, transformation).`,
  "email-subject": `Write email subject lines that get opened. Use curiosity, urgency, personalization, or benefit-driven hooks. Each variation should use a different psychological trigger.`,
  "email-body": `Write email body copy that converts. Use the AIDA framework (Attention, Interest, Desire, Action). Each variation should have a different hook and approach.`,
  "facebook-ad": `Write Facebook ad copy optimized for the feed. Lead with a strong hook, address pain points, present the solution, and include a clear CTA. Keep primary text under 125 characters when possible for the main hook.`,
  "google-ad": `Write Google Search ad copy with compelling headlines (30 chars max each) and descriptions (90 chars max). Focus on keywords, benefits, and urgency. Include numbers and CTAs.`,
  "landing-page-hero": `Write landing page hero sections that convert. Create compelling headlines, supporting subheadlines, and CTAs. Focus on the main transformation or benefit.`,
  "social-post": `Write engaging social media posts that drive engagement and clicks. Use hooks, storytelling, and clear CTAs. Optimize for each platform's style.`,
  "sms-marketing": `Write SMS marketing messages that convert. Keep it under 160 characters, include urgency, and have a clear CTA with link placeholder.`,
}

export async function POST(request: NextRequest) {
  try {
    const data: CopyRequest = await request.json()
    const { copyType, productName, productDescription, targetAudience, tone, keyBenefits, additionalContext } = data

    if (!productName || !copyType) {
      return NextResponse.json(
        { error: "Product name and copy type are required" },
        { status: 400 }
      )
    }

    if (!ANTHROPIC_API_KEY) {
      // Return mock response
      const mockResponse: CopyResponse = {
        variations: [
          {
            headline: `Transform Your ${productName} Results Today`,
            body: `Tired of the same old routine? ${productName} is here to change everything. Our customers report amazing results within just weeks of trying it. Join thousands who've already made the switch.`,
            cta: "Get Started Now",
            angle: "Transformation"
          },
          {
            headline: `Why ${productName} Is Taking Over`,
            body: `Everyone's talking about ${productName} - and for good reason. It delivers exactly what it promises, no gimmicks. See what the hype is about.`,
            cta: "See Why",
            angle: "Social Proof"
          },
          {
            headline: `The ${productName} Difference`,
            body: `Most products overpromise and underdeliver. ${productName} is different. We focus on real results that you can actually see and feel. No fluff, just what works.`,
            cta: "Try It Today",
            angle: "Differentiation"
          }
        ],
        tips: [
          "Test multiple variations to find what resonates with your audience",
          "Always include a clear call-to-action",
          "Use specific numbers and results when possible",
          "Address objections directly in your copy"
        ]
      }

      return NextResponse.json(mockResponse)
    }

    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    })

    const copyTypeInstruction = copyTypePrompts[copyType] || copyTypePrompts["product-description"]

    const systemPrompt = `You are an expert direct response copywriter with 15+ years of experience writing high-converting copy for e-commerce and DTC brands. You've written copy that has generated millions in revenue.

${copyTypeInstruction}

Your copy should:
- Lead with benefits, not features
- Use power words that create emotion and urgency
- Be specific and concrete (use numbers when possible)
- Address the target audience directly
- Create desire before asking for the sale
- Include social proof elements where appropriate

Tone: ${tone || "professional but conversational"}`

    const userPrompt = `Write 3 variations of ${copyType.replace("-", " ")} for this product:

Product Name: ${productName}
Product Description: ${productDescription || "Not provided"}
Target Audience: ${targetAudience || "General consumers"}
Key Benefits: ${keyBenefits || "Not specified"}
${additionalContext ? `Additional Context: ${additionalContext}` : ""}

Return your response in this exact JSON format:
{
  "variations": [
    {
      "headline": "compelling headline",
      "body": "body copy",
      "cta": "call to action text",
      "angle": "the angle/approach used (e.g., 'Problem-Solution', 'Social Proof', 'Urgency')"
    }
  ],
  "tips": ["tip 1 for improving this copy", "tip 2", "tip 3"]
}

Return ONLY valid JSON, no other text.`

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    })

    const textContent = response.content.find((c) => c.type === "text")
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from API")
    }

    const copyResponse: CopyResponse = JSON.parse(textContent.text)

    return NextResponse.json(copyResponse)
  } catch (error) {
    console.error("Copy generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate copy. Please try again." },
      { status: 500 }
    )
  }
}
