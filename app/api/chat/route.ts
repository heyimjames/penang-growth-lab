import { type NextRequest } from "next/server"
import { streamText, convertToModelMessages, UIMessage } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createClient } from "@/lib/supabase/server"

// Exa.ai web search tool
async function searchWeb(query: string): Promise<string> {
  const EXA_API_KEY = process.env.EXA_API_KEY

  if (!EXA_API_KEY) {
    return "Web search is not available. Please provide information based on your knowledge."
  }

  try {
    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": EXA_API_KEY,
      },
      body: JSON.stringify({
        query,
        numResults: 5,
        useAutoprompt: true,
        type: "neural",
        contents: {
          text: {
            maxCharacters: 2000,
          },
        },
      }),
    })

    if (!response.ok) {
      console.error("Exa search error:", response.statusText)
      return "Web search failed. Please provide information based on your knowledge."
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      return "No relevant search results found."
    }

    // Format results for the AI
    const formattedResults = data.results
      .map(
        (result: { title: string; url: string; text?: string }, i: number) =>
          `[${i + 1}] ${result.title}\nURL: ${result.url}\n${result.text || ""}`
      )
      .join("\n\n---\n\n")

    return formattedResults
  } catch (error) {
    console.error("Exa search error:", error)
    return "Web search failed. Please provide information based on your knowledge."
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    
    // useChat sends messages separately, and body contains the additional data
    const messages = body.messages as UIMessage[]
    const caseId = body.caseId as string
    const caseContext = body.caseContext as {
      companyName: string
      complaintText: string
      generatedLetter: string
      identifiedIssues: string[]
      legalBasis: { law: string; summary: string }[]
      purchaseAmount: number | null
      currency: string
      incidentDate: string | null
      evidence?: {
        fileName: string
        type: string
        description: string
        relevantDetails: string[]
        suggestedUse: string
        strength: string
        userContext?: string
        indexedForLetter?: boolean
      }[]
    }

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages)
      return new Response("Invalid request: messages array required", { status: 400 })
    }

    if (!caseId || !caseContext) {
      console.error("Missing required fields:", { caseId, caseContext })
      return new Response("Invalid request: caseId and caseContext required", { status: 400 })
    }

    // Verify user owns this case
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("id, user_id")
      .eq("id", caseId)
      .single()

    if (caseError || !caseData || caseData.user_id !== user.id) {
      return new Response("Case not found", { status: 404 })
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

    if (!ANTHROPIC_API_KEY) {
      return new Response("AI service not configured", { status: 500 })
    }

    // Build evidence context for the system prompt
    const evidenceContext = caseContext.evidence && caseContext.evidence.length > 0
      ? `
SUPPORTING EVIDENCE ON FILE:
${caseContext.evidence.map((e, i) => `${i + 1}. ${e.fileName} (${e.type}, ${e.strength} evidence)
   - Analysis: ${e.description}
   - Key details: ${e.relevantDetails?.join("; ") || "None extracted"}
   - How to use: ${e.suggestedUse}${e.userContext ? `
   - User's notes: ${e.userContext}` : ""}${e.indexedForLetter ? " [Referenced in complaint letter]" : ""}`).join("\n")}

When drafting responses, reference this evidence to strengthen arguments. Cite specific documents when making claims.`
      : "No evidence files uploaded yet."

    // Build the system prompt with full case context
    const systemPrompt = `You are NoReply, an AI-powered UK consumer rights advocate. You help users navigate complaints and write professional responses to companies.

ABOUT YOU:
- Your name is NoReply
- You're friendly, supportive, and on the user's side
- You're knowledgeable about UK consumer law
- You write professional, assertive responses that get results

CASE CONTEXT:
- Company: ${caseContext.companyName}
- Original complaint: ${caseContext.complaintText}
- Incident date: ${caseContext.incidentDate || "Not specified"}
- Amount involved: ${caseContext.currency === "GBP" ? "£" : caseContext.currency === "EUR" ? "€" : "$"}${caseContext.purchaseAmount || "Not specified"}

ISSUES IDENTIFIED:
${caseContext.identifiedIssues?.map((issue, i) => `${i + 1}. ${issue}`).join("\n") || "None specified"}

RELEVANT CONSUMER RIGHTS:
${caseContext.legalBasis?.map((law) => `- ${law.law}: ${law.summary}`).join("\n") || "Consumer Rights Act 2015 applies"}

${evidenceContext}

ORIGINAL LETTER SENT:
${caseContext.generatedLetter || "No letter generated yet"}

YOUR APPROACH:
When the user pastes a company response, structure your reply like this:

1. **Quick Assessment** (1-2 sentences)
   - Summarize what the company is doing (accepting, deflecting, refusing, etc.)

2. **Key Points** (bullet points)
   - What they got wrong
   - What rights they're ignoring
   - Their weak arguments

3. **Your Draft Response** (MUST be clearly marked with this exact header)
   - Write a complete, ready-to-send email response
   - Start with "To: [Company Name] Customer Relations"
   - Include "Re: [Reference number if available]"
   - Write the full email body addressing each point professionally
   - Reference specific laws (Consumer Rights Act 2015, etc.)
   - Include appropriate escalation warnings if needed
   - End with proper sign-off (Yours sincerely, etc.)
   - NO placeholders - write as if it's ready to send

4. **Next Steps** (brief)
   - What to do after sending
   - Escalation options if they don't respond

IMPORTANT RULES:
- Always refer to yourself as "NoReply" or "I" - never "the AI" or "assistant"
- Write responses that are 100% ready to send - NO placeholders like [Your Name], [Your Address], etc.
- The draft response MUST start immediately after "Your Draft Response:" header
- Format the draft as plain text email (not markdown) - no markdown formatting in the draft
- Be assertive but professional
- Keep the user's leverage strong
- Reference specific laws and regulations
- Format clearly with headers and bullet points for easy reading
- Break your message into multiple short paragraphs/bubbles for readability`

    // Convert messages to model format
    let modelMessages
    try {
      modelMessages = convertToModelMessages(messages)
    } catch (convertError) {
      console.error("Error converting messages:", convertError)
      console.error("Messages received:", JSON.stringify(messages, null, 2))
      return new Response(
        JSON.stringify({ 
          error: "Invalid message format",
          details: convertError instanceof Error ? convertError.message : String(convertError)
        }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    const result = streamText({
      model: anthropic("claude-haiku-4-5-20251001"),
      system: systemPrompt,
      messages: modelMessages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error("Error details:", { errorMessage, errorStack })
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: errorMessage,
        ...(process.env.NODE_ENV === "development" && { stack: errorStack })
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
