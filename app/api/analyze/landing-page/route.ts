import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

interface LandingPageAnalysis {
  overallScore: number
  conversionPotential: "low" | "medium" | "high"
  sections: {
    headline: {
      score: number
      feedback: string
      suggestions: string[]
    }
    valueProposition: {
      score: number
      feedback: string
      suggestions: string[]
    }
    socialProof: {
      score: number
      feedback: string
      suggestions: string[]
    }
    cta: {
      score: number
      feedback: string
      suggestions: string[]
    }
    visualDesign: {
      score: number
      feedback: string
      suggestions: string[]
    }
    copywriting: {
      score: number
      feedback: string
      suggestions: string[]
    }
    trustSignals: {
      score: number
      feedback: string
      suggestions: string[]
    }
    mobileOptimization: {
      score: number
      feedback: string
      suggestions: string[]
    }
  }
  prioritizedActions: string[]
  competitiveInsights: string
}

export async function POST(request: NextRequest) {
  try {
    const { url, pageType, industry, targetAudience } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: "Please provide a URL to analyze" },
        { status: 400 }
      )
    }

    // Fetch the page content
    let pageContent = ""
    let pageTitle = ""
    let metaDescription = ""

    try {
      const pageResponse = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; PenangGrowthLab/1.0; +https://penangmedia.com)",
        },
      })

      if (!pageResponse.ok) {
        throw new Error("Failed to fetch page")
      }

      const html = await pageResponse.text()

      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      pageTitle = titleMatch ? titleMatch[1].trim() : ""

      // Extract meta description
      const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      metaDescription = metaMatch ? metaMatch[1].trim() : ""

      // Extract visible text content (simplified)
      pageContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 8000) // Limit content length
    } catch {
      // If we can't fetch, we'll analyze based on URL structure
      pageContent = `Unable to fetch full page content. URL: ${url}`
    }

    if (!ANTHROPIC_API_KEY) {
      // Return mock analysis
      const mockAnalysis: LandingPageAnalysis = {
        overallScore: 68,
        conversionPotential: "medium",
        sections: {
          headline: {
            score: 72,
            feedback: "The headline communicates the core offer but could be more benefit-focused and emotionally compelling.",
            suggestions: [
              "Lead with the primary benefit rather than the product name",
              "Add a power word to increase emotional impact",
              "Consider adding a specific result or timeframe"
            ]
          },
          valueProposition: {
            score: 65,
            feedback: "The value proposition is present but doesn't clearly differentiate from competitors or quantify the benefit.",
            suggestions: [
              "Add specific numbers or percentages to quantify results",
              "Highlight what makes you unique vs alternatives",
              "Use the 'before and after' framework to show transformation"
            ]
          },
          socialProof: {
            score: 58,
            feedback: "Limited social proof visible. This is a major conversion killer for e-commerce pages.",
            suggestions: [
              "Add customer testimonials with photos and full names",
              "Display review count and average rating prominently",
              "Include logos of press mentions or notable customers",
              "Add real-time social proof (X people bought this today)"
            ]
          },
          cta: {
            score: 70,
            feedback: "CTA is visible but could be more compelling and urgent.",
            suggestions: [
              "Use action-oriented copy (Get, Start, Claim) vs passive (Submit, Buy)",
              "Add urgency element (limited time, stock, etc.)",
              "Consider using a contrasting color for the button",
              "Add micro-copy under CTA to reduce friction (No credit card required, Free shipping)"
            ]
          },
          visualDesign: {
            score: 75,
            feedback: "Clean design but could better guide the eye to key conversion elements.",
            suggestions: [
              "Increase visual hierarchy - make CTA more prominent",
              "Use directional cues (arrows, eye gaze) pointing to CTA",
              "Ensure adequate white space around key elements"
            ]
          },
          copywriting: {
            score: 62,
            feedback: "Copy is feature-heavy. Benefits and emotional triggers need more emphasis.",
            suggestions: [
              "Convert features to benefits (What's in it for the customer?)",
              "Use 'you' more than 'we' - make it about the customer",
              "Add sensory and emotional language",
              "Break up long paragraphs with bullet points"
            ]
          },
          trustSignals: {
            score: 60,
            feedback: "Some trust elements missing that could reduce purchase anxiety.",
            suggestions: [
              "Add money-back guarantee badge",
              "Display security badges near payment section",
              "Include contact information and physical address",
              "Add FAQ section to address common objections"
            ]
          },
          mobileOptimization: {
            score: 70,
            feedback: "Page appears mobile-friendly but some elements may need optimization.",
            suggestions: [
              "Ensure CTA is thumb-friendly and always visible",
              "Optimize image sizes for faster mobile loading",
              "Make phone number click-to-call",
              "Test form fields are easy to complete on mobile"
            ]
          }
        },
        prioritizedActions: [
          "Add customer testimonials with photos - this alone can increase conversions 20-30%",
          "Rewrite headline to lead with the #1 benefit your customers care about",
          "Add urgency element to CTA (limited stock, time-sensitive offer)",
          "Include a money-back guarantee badge near the purchase button",
          "Add real numbers to your value proposition (e.g., 'Join 10,000+ happy customers')"
        ],
        competitiveInsights: "Based on the page structure, this appears to be a standard e-commerce/product page. Top performers in this category typically have: above-the-fold testimonials, sticky CTAs on mobile, and clear comparison tables showing value vs. alternatives. Consider adding these elements to match or exceed competitor conversion rates."
      }

      return NextResponse.json(mockAnalysis)
    }

    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    })

    const systemPrompt = `You are an expert conversion rate optimization (CRO) specialist with 10+ years of experience optimizing landing pages for e-commerce and DTC brands. You've helped hundreds of brands improve their conversion rates.

Your task is to analyze landing pages and provide specific, actionable feedback that will increase conversions. You focus on:

1. Headline - Is it clear, benefit-focused, and compelling?
2. Value Proposition - Is it unique and quantified?
3. Social Proof - Are testimonials, reviews, and trust signals present?
4. CTA - Is it visible, compelling, and friction-free?
5. Visual Design - Does it guide attention to conversion elements?
6. Copywriting - Is it benefit-focused and emotionally compelling?
7. Trust Signals - Are guarantees, security badges, and contact info present?
8. Mobile Optimization - Is the experience optimized for mobile users?

Always provide specific, actionable suggestions based on proven CRO principles. Reference specific elements you observe.`

    const userPrompt = `Analyze this landing page for conversion optimization:

URL: ${url}
Page Type: ${pageType || "product/sales page"}
Industry: ${industry || "e-commerce"}
Target Audience: ${targetAudience || "general consumers"}

Page Title: ${pageTitle}
Meta Description: ${metaDescription}

Page Content (extracted text):
${pageContent}

Provide your analysis in this exact JSON format:
{
  "overallScore": <0-100>,
  "conversionPotential": "low" | "medium" | "high",
  "sections": {
    "headline": {
      "score": <0-100>,
      "feedback": "specific feedback",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
    },
    "valueProposition": {
      "score": <0-100>,
      "feedback": "specific feedback",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
    },
    "socialProof": {
      "score": <0-100>,
      "feedback": "specific feedback",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
    },
    "cta": {
      "score": <0-100>,
      "feedback": "specific feedback",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
    },
    "visualDesign": {
      "score": <0-100>,
      "feedback": "specific feedback",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
    },
    "copywriting": {
      "score": <0-100>,
      "feedback": "specific feedback",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
    },
    "trustSignals": {
      "score": <0-100>,
      "feedback": "specific feedback",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
    },
    "mobileOptimization": {
      "score": <0-100>,
      "feedback": "specific feedback",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
    }
  },
  "prioritizedActions": ["top 5 actions in order of impact"],
  "competitiveInsights": "brief competitive analysis and industry insights"
}

Return ONLY valid JSON, no other text.`

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
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

    const analysis: LandingPageAnalysis = JSON.parse(textContent.text)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Landing page analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze landing page. Please try again." },
      { status: 500 }
    )
  }
}
