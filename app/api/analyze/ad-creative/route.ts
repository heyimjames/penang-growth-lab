import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

interface AdCreativeAnalysis {
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  hookAnalysis: {
    score: number
    feedback: string
  }
  visualAnalysis: {
    score: number
    feedback: string
  }
  copyAnalysis: {
    score: number
    feedback: string
  }
  ctaAnalysis: {
    score: number
    feedback: string
  }
  platformFit: {
    meta: number
    tiktok: number
    google: number
  }
  predictedPerformance: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File | null
    const imageUrl = formData.get("imageUrl") as string | null
    const platform = formData.get("platform") as string || "meta"
    const adType = formData.get("adType") as string || "image"
    const industry = formData.get("industry") as string || "ecommerce"
    const adCopy = formData.get("adCopy") as string || ""

    if (!imageFile && !imageUrl) {
      return NextResponse.json(
        { error: "Please provide an image file or URL" },
        { status: 400 }
      )
    }

    let imageData: { type: "base64"; media_type: string; data: string } | { type: "url"; url: string } | null = null

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer()
      const base64 = Buffer.from(bytes).toString("base64")
      const mediaType = imageFile.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp"
      imageData = {
        type: "base64",
        media_type: mediaType,
        data: base64,
      }
    } else if (imageUrl) {
      imageData = {
        type: "url",
        url: imageUrl,
      }
    }

    if (!ANTHROPIC_API_KEY) {
      // Return mock analysis if no API key
      const mockAnalysis: AdCreativeAnalysis = {
        overallScore: 72,
        strengths: [
          "Clear product visibility in the creative",
          "Brand colors are consistent and recognizable",
          "Good use of whitespace for readability"
        ],
        weaknesses: [
          "Hook could be stronger to stop the scroll",
          "CTA button lacks contrast and urgency",
          "Missing social proof elements"
        ],
        improvements: [
          "Add a bold, benefit-driven headline at the top",
          "Include customer testimonial or review snippet",
          "Make CTA button more prominent with contrasting color",
          "Consider adding urgency element (limited time, stock, etc.)"
        ],
        hookAnalysis: {
          score: 65,
          feedback: "The opening visual doesn't immediately grab attention. Consider leading with a bold statement, surprising visual, or relatable problem to stop the scroll."
        },
        visualAnalysis: {
          score: 78,
          feedback: "Product photography is decent but could be more dynamic. Consider lifestyle shots showing the product in use or before/after comparisons."
        },
        copyAnalysis: {
          score: 70,
          feedback: "Copy is clear but lacks emotional triggers. Focus more on the transformation or outcome rather than features."
        },
        ctaAnalysis: {
          score: 68,
          feedback: "CTA is present but could be stronger. Use action-oriented language like 'Get Yours Now' instead of generic 'Shop Now'."
        },
        platformFit: {
          meta: 75,
          tiktok: 60,
          google: 70
        },
        predictedPerformance: "This creative has moderate potential. With the suggested improvements, particularly strengthening the hook and CTA, you could see 20-30% better engagement."
      }

      return NextResponse.json(mockAnalysis)
    }

    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    })

    const systemPrompt = `You are an expert paid advertising creative analyst with 10+ years of experience optimizing ad creatives for e-commerce brands. You've managed millions in ad spend across Meta, TikTok, and Google.

Your task is to analyze ad creatives and provide actionable feedback that will improve performance metrics like CTR, CVR, and ROAS.

Always provide specific, actionable advice based on proven direct response advertising principles. Reference specific elements you see in the creative.

Analyze for:
1. Hook/Attention (first 0.5s) - Does it stop the scroll?
2. Visual Impact - Is the product clear? Is it visually appealing?
3. Copy/Messaging - Is the value proposition clear? Does it address pain points?
4. Call-to-Action - Is it clear, compelling, and urgent?
5. Platform Fit - Is this creative optimized for the target platform?

Rate each category 0-100 and provide specific feedback.`

    const userPrompt = `Analyze this ${adType} ad creative for a ${industry} brand, targeting ${platform} platform.

${adCopy ? `Ad Copy/Text: "${adCopy}"` : ""}

Provide your analysis in this exact JSON format:
{
  "overallScore": <0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3", "improvement 4"],
  "hookAnalysis": {
    "score": <0-100>,
    "feedback": "specific feedback about the hook"
  },
  "visualAnalysis": {
    "score": <0-100>,
    "feedback": "specific feedback about visuals"
  },
  "copyAnalysis": {
    "score": <0-100>,
    "feedback": "specific feedback about copy"
  },
  "ctaAnalysis": {
    "score": <0-100>,
    "feedback": "specific feedback about the CTA"
  },
  "platformFit": {
    "meta": <0-100>,
    "tiktok": <0-100>,
    "google": <0-100>
  },
  "predictedPerformance": "brief prediction of how this creative will perform"
}

Return ONLY valid JSON, no other text.`

    const messageContent: Anthropic.MessageParam["content"] = imageData?.type === "base64"
      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: imageData.media_type as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: imageData.data,
            },
          },
          {
            type: "text",
            text: userPrompt,
          },
        ]
      : imageData?.type === "url"
      ? [
          {
            type: "image",
            source: {
              type: "url",
              url: imageData.url,
            },
          },
          {
            type: "text",
            text: userPrompt,
          },
        ]
      : [{ type: "text", text: userPrompt }]

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: messageContent,
        },
      ],
    })

    const textContent = response.content.find((c) => c.type === "text")
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from API")
    }

    const analysis: AdCreativeAnalysis = JSON.parse(textContent.text)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Ad creative analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze ad creative. Please try again." },
      { status: 500 }
    )
  }
}
