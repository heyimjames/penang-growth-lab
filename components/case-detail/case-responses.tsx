"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/lib/icons"
import {
  SentIcon,
  MessageQuestionIcon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Search01Icon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { motion, AnimatePresence } from "motion/react"
import { Case, Evidence } from "@/lib/types"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputSpeechButton,
  PromptInputHeader,
  PromptInputBody,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input"
import { toast } from "sonner"

interface CaseResponsesProps {
  caseData: Case
  evidence?: Evidence[]
}

export function CaseResponses({ caseData, evidence = [] }: CaseResponsesProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [inputText, setInputText] = useState("")

  // File constraint error handler
  const handleFileError = (err: { code: "max_files" | "max_file_size" | "accept"; message: string }) => {
    const errorMessages = {
      max_files: "You can only attach up to 5 files at a time.",
      max_file_size: "Files must be smaller than 10MB.",
      accept: "Only images, PDFs, Word docs, and text files are supported.",
    }
    toast.error(errorMessages[err.code] || err.message)
  }

  const { messages, sendMessage, status, error, setMessages } = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error("Chat error:", error)
      if (error instanceof Error) {
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
      }
      toast.error("Failed to send message. Please try again.")
    },
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, status])

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text?.trim())
    const hasAttachments = Boolean(message.files?.length)

    if (!(hasText || hasAttachments)) {
      return
    }

    // Build message content with text and optional file attachments
    const content = message.text || ""
    const messageText = hasAttachments && !hasText
      ? `[Attached ${message.files.length} file(s)]`
      : hasAttachments
        ? `${content}\n\n[Attached ${message.files.length} file(s)]`
        : content

    // Build evidence context for the AI - only include analyzed evidence with details
    const evidenceForAI = evidence
      .filter(e => e.analyzed && e.analysis_details)
      .map(e => ({
        fileName: e.file_name,
        type: e.analysis_details?.type || "other",
        description: e.analysis_details?.description || e.analysis_summary || "",
        relevantDetails: e.analysis_details?.relevantDetails || [],
        suggestedUse: e.analysis_details?.suggestedUse || "",
        strength: e.analysis_details?.strength || "moderate",
        userContext: e.user_context || undefined,
        indexedForLetter: e.indexed_for_letter,
      }))

    // Use AI SDK v6 sendMessage - pass object with text property, and body for additional context
    sendMessage(
      { text: messageText },
      {
        body: {
          caseId: caseData.id,
          caseContext: {
            companyName: caseData.company_name,
            complaintText: caseData.complaint_text,
            generatedLetter: caseData.generated_letter || "",
            identifiedIssues: caseData.identified_issues || [],
            legalBasis: caseData.legal_basis || [],
            purchaseAmount: caseData.purchase_amount,
            currency: caseData.currency,
            incidentDate: caseData.purchase_date,
            evidence: evidenceForAI,
          },
        },
      }
    )
    
    // Clear the input after submission
    setInputText("")
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Get text parts from message (AI SDK v6 uses parts array)
  const getMessageParts = (message: Record<string, unknown>): Array<{ type: string; text?: string }> => {
    // AI SDK v6 uses parts array
    if (Array.isArray(message.parts)) {
      return message.parts as Array<{ type: string; text?: string }>
    }
    
    // Fallback: convert string content to parts format
    if (typeof message.content === "string") {
      return [{ type: "text", text: message.content }]
    }
    
    // Array of content parts
    if (Array.isArray(message.content)) {
      return message.content
    }
    
    return []
  }
  
  // Get full text content from message
  const getMessageText = (message: Record<string, unknown>): string => {
    const parts = getMessageParts(message)
    return parts
      .filter((part) => part.type === "text" && typeof part.text === "string")
      .map((part) => part.text || "")
      .join("")
  }

  // Strip markdown formatting from text
  const stripMarkdown = (text: string): string => {
    if (!text) return ""
    return text
      // Remove horizontal rules first (including standalone lines with ---)
      .replace(/^---+$/gm, "")
      .replace(/^---+\s*$/gm, "")
      .replace(/^---+.*$/gm, "")
      // Remove markdown headers
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold/italic
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      // Remove links
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      // Clean up extra whitespace and empty lines
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^\s+$/gm, "") // Remove lines that are only whitespace
      .trim()
  }

  // Split content into readable chunks for multiple bubbles
  const splitIntoBubbles = (content: string): string[] => {
    if (!content) return []
    
    // First, clean the content - remove horizontal rules and excessive markdown
    let cleaned = content
      // Remove standalone horizontal rule lines
      .replace(/^---+$/gm, "")
      .replace(/^---+\s*$/gm, "")
      // Remove horizontal rules with surrounding content
      .replace(/\n---+(\n|$)/g, "\n")
      .replace(/(\n|^)---+(\n|$)/g, "\n")
      .trim()
    
    // Split by double newlines (paragraphs) first
    const paragraphs = cleaned.split(/\n\n+/).filter(p => {
      const trimmed = p.trim()
      // Filter out horizontal rules and empty content
      return trimmed.length > 0 && !/^---+$/.test(trimmed)
    })
    
    if (paragraphs.length === 0) return [cleaned]
    
    // Group paragraphs into logical sections
    const bubbles: string[] = []
    let currentBubble = ""
    
    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i]
      const trimmed = para.trim()
      
      // Skip if it's just a horizontal rule or too short
      if (/^---+$/.test(trimmed) || trimmed.length < 3) {
        continue
      }
      
      // Check if this paragraph is a heading/section marker
      const isHeading = /^(#{1,6}|[\*\-\+])\s+[A-Z]/.test(trimmed) || 
                       /^(Quick Assessment|Key Points|Draft Response|Next Steps|Analysis|Summary|Recommendation|Assessment|Response|Draft|Your Response|Suggested Response):?\s*/i.test(trimmed)
      
      // Check if current bubble is getting long
      const isLong = currentBubble.length > 400
      
      // If we hit a heading or current bubble is long AND this paragraph is substantial, start new bubble
      if (isHeading || (isLong && trimmed.length > 50)) {
        if (currentBubble.trim().length > 0) {
          bubbles.push(currentBubble.trim())
        }
        currentBubble = trimmed.replace(/^#{1,6}\s+/gm, "").trim()
      } else {
        // Merge with current bubble
        currentBubble += (currentBubble ? "\n\n" : "") + trimmed
      }
    }
    
    // Add remaining content
    if (currentBubble.trim().length > 0) {
      bubbles.push(currentBubble.trim())
    }
    
    // Post-process: merge very short bubbles (< 30 chars, especially single words) with adjacent bubbles
    const mergedBubbles: string[] = []
    for (let i = 0; i < bubbles.length; i++) {
      const bubble = bubbles[i]
      const trimmed = bubble.trim()
      
      // Check if it's a single word or very short phrase
      const isSingleWord = /^[A-Z][a-z]*$/.test(trimmed) || trimmed.length < 15
      
      // If bubble is very short or single word, merge it
      if (isSingleWord && mergedBubbles.length > 0) {
        // Merge with previous bubble
        mergedBubbles[mergedBubbles.length - 1] += " " + trimmed
      } else if (isSingleWord && i < bubbles.length - 1) {
        // Merge with next bubble
        if (i + 1 < bubbles.length) {
          mergedBubbles.push(trimmed + " " + bubbles[i + 1].trim())
          i++ // Skip next bubble as we merged it
        } else {
          // Last bubble, merge with previous if exists
          if (mergedBubbles.length > 0) {
            mergedBubbles[mergedBubbles.length - 1] += " " + trimmed
          } else {
            mergedBubbles.push(trimmed)
          }
        }
      } else if (trimmed.length < 20 && mergedBubbles.length > 0) {
        // Very short but not single word - merge with previous
        mergedBubbles[mergedBubbles.length - 1] += "\n\n" + trimmed
      } else {
        mergedBubbles.push(trimmed)
      }
    }
    
    // If we only have one bubble but it's very long, split it further by sentences
    if (mergedBubbles.length === 1 && mergedBubbles[0].length > 500) {
      const sentences = mergedBubbles[0].split(/(?<=[.!?])\s+(?=[A-Z])/)
      const chunks: string[] = []
      let currentChunk = ""
      
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > 400 && currentChunk.length > 50) {
          chunks.push(currentChunk.trim())
          currentChunk = sentence
        } else {
          currentChunk += (currentChunk ? " " : "") + sentence
        }
      }
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim())
      }
      return chunks.length > 1 ? chunks : mergedBubbles
    }
    
    return mergedBubbles.length > 0 ? mergedBubbles : [cleaned]
  }

  // Extract the draft response from AI message if present
  const extractDraftResponse = (content: string): { analysis: string; draft: string | null } => {
    if (!content) return { analysis: "", draft: null }

    // Look for explicit draft markers first (improved patterns)
    const draftPatterns = [
      // "Your Draft Response" or similar headers followed by content
      /(?:^|\n\n)(?:##\s*)?(?:DRAFT RESPONSE|Draft Response|Suggested Response|Your Response|Response Draft|Email Draft|Draft Email|Here is your draft|Here's your draft|Your email response|Your Draft Response|Draft Email Response):?\s*\n+([\s\S]+?)(?=\n\n(?:---|Next Steps|Key Points|Quick Assessment|Let me know|Feel free|I hope|$))/i,
      // "Here's a draft" or similar phrases
      /(?:^|\n\n)(?:Here'?s? (?:a |your |the )?(?:draft|suggested|sample) (?:response|email|reply):?\s*\n+)([\s\S]+?)(?=\n\n(?:---|Next Steps|Key Points|Quick Assessment|Let me know|Feel free|$))/i,
      // "You can send" or similar
      /(?:^|\n\n)(?:You (?:can|could|might|should) (?:send|use|reply with)(?: something like)?:?\s*\n+)([\s\S]+?)(?=\n\n(?:---|Next Steps|Key Points|Quick Assessment|Let me know|Feel free|$))/i,
      // Code blocks with draft/response/email markers
      /```(?:draft|response|email|text)?\n([\s\S]+?)```/i,
      // Email starting with "To:" or "Dear" that's substantial
      /(?:^|\n\n)((?:To:|Dear|Subject:)[\s\S]{100,}?(?:Yours (?:sincerely|faithfully)|Kind regards|Best regards|Regards|Sincerely)[\s\S]*?)(?=\n\n(?:---|Next Steps|Key Points|Quick Assessment|$))/im,
    ]

    for (const pattern of draftPatterns) {
      const match = content.match(pattern)
      if (match && match[1]) {
        let draft = stripMarkdown(match[1].trim())
        
        // Clean up common issues
        draft = draft
          .replace(/^#{1,6}\s+/gm, "") // Remove markdown headers
          .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
          .replace(/\*([^*]+)\*/g, "$1") // Remove italic
          .replace(/^---+\s*$/gm, "") // Remove horizontal rules
          .replace(/\n{3,}/g, "\n\n") // Normalize line breaks
          .trim()
        
        // Only return if draft is substantial (more than 50 chars)
        if (draft.length > 50) {
          const analysis = content.replace(match[0], "").trim()
          return { analysis, draft }
        }
      }
    }

    // Look for email-style content (Subject: or Dear X, followed by substantial content)
    const emailPatterns = [
      // Subject line followed by content
      /(?:^|\n\n)(Subject:[\s\S]*?(?:Yours (?:sincerely|faithfully)|Kind regards|Best regards|Regards|Sincerely)[\s\S]*?(?:\n\[Your.*?\]|\n\n|$))/im,
      // Dear [Company/Name] followed by substantial content ending with sign-off
      /(?:^|\n\n)(Dear [\s\S]*?(?:Yours (?:sincerely|faithfully)|Kind regards|Best regards|Regards|Sincerely)[\s\S]*?(?:\n\[Your.*?\]|\n\n|$))/im,
    ]

    for (const pattern of emailPatterns) {
      const match = content.match(pattern)
      if (match && match[1] && match[1].length > 100) { // Only if substantial content
        let draft = stripMarkdown(match[1].trim())
        
        // Clean up
        draft = draft
          .replace(/^#{1,6}\s+/gm, "")
          .replace(/\*\*([^*]+)\*\*/g, "$1")
          .replace(/\*([^*]+)\*/g, "$1")
          .replace(/^---+\s*$/gm, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim()
        
        const analysis = content.replace(match[0], "").trim()
        if (analysis.length > 50 && draft.length > 50) { // Only split if there's meaningful analysis too
          return { analysis, draft }
        }
      }
    }

    return { analysis: content, draft: null }
  }

  const hasLetter = caseData.generated_letter && caseData.generated_letter.length > 0

  if (!hasLetter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-4 mb-4 mx-auto w-fit">
            <Icon icon={AlertCircleIcon} size={32} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Generate Your Letter First</h3>
          <p className="text-muted-foreground max-w-md">
            Before you can manage responses, you need to generate and send your initial complaint letter.
            Go to the Letters tab to create your letter.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] lg:h-[calc(100vh-160px)] -mx-4 sm:-mx-6 lg:-mx-8 relative">
      {/* Messages - scrollable area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain pb-[calc(200px+3.5rem)] lg:pb-[180px]"
        style={{ scrollPaddingTop: '2rem' }}
      >
        <div className="max-w-3xl mx-auto pt-12 pb-4 px-4 sm:px-6 space-y-4">
          {messages.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center min-h-[50vh] text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-md space-y-6">
                <div className="space-y-2">
                  <motion.h3
                    className="font-semibold text-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    Response Assistant
                  </motion.h3>
                  <motion.p
                    className="text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    When {caseData.company_name} replies, paste their response below.
                    I&apos;ll analyze it and draft your follow-up.
                  </motion.p>
                </div>
                <div className="grid gap-3 text-left">
                  {[
                    { icon: "1", text: "Paste the company's email response" },
                    { icon: "2", text: "I'll find weak points in their arguments" },
                    { icon: "3", text: "Get a professional response to send" },
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-peach-100 dark:bg-peach-900/50 text-peach-600 dark:text-peach-400 text-sm font-semibold">
                        {step.icon}
                      </span>
                      <span className="text-sm">{step.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => {
              const isUser = message.role === "user"
              const parts = getMessageParts(message as Record<string, unknown>)
              const content = getMessageText(message as Record<string, unknown>)
              
              // Get text parts for rendering
              const textParts = parts.filter((part) => part.type === "text" && part.text)
              
              // Debug: log message structure in development
              if (process.env.NODE_ENV === "development" && index === messages.length - 1) {
                console.log("Message structure:", JSON.stringify(message, null, 2))
                console.log("Parts:", textParts)
                console.log("Content:", content)
              }
              
              const { analysis, draft } = isUser
                ? { analysis: content, draft: null }
                : extractDraftResponse(content)

              // Check for tool invocations (web search)
              const toolInvocations = message.toolInvocations || []
              const hasToolCalls = toolInvocations.length > 0

              // Show content if we have text parts or content
              const hasContent = textParts.length > 0 || content

              return (
                <motion.div
                  key={message.id}
                  className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index === messages.length - 1 ? 0 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "flex-none w-8 h-8 flex items-center justify-center shrink-0 mt-1",
                      isUser
                        ? "rounded-full bg-forest-500 dark:bg-forest-600"
                        : "rounded-xl bg-gradient-to-br from-peach-100 to-peach-200 dark:from-peach-900 dark:to-peach-950"
                    )}
                  >
                    {isUser ? (
                      <span className="text-xs font-semibold text-white">You</span>
                    ) : (
                      <Icon
                        icon={MessageQuestionIcon}
                        size={16}
                        className="text-peach-600 dark:text-peach-400"
                      />
                    )}
                  </div>

                  <div className={cn("flex flex-col gap-2 max-w-[85%]", isUser ? "items-end" : "items-start")}>
                    {/* Tool invocation indicators */}
                    {hasToolCalls && (
                      <div className="space-y-1.5">
                        {toolInvocations.map((tool) => (
                          <motion.div
                            key={tool.toolCallId}
                            className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/70 rounded-lg px-3 py-2 border border-border/50"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            {tool.state === "result" ? (
                              <>
                                <Icon icon={Tick01Icon} size={14} className="text-forest-500" />
                                <span>Searched: &quot;{(tool.args as { query: string }).query}&quot;</span>
                              </>
                            ) : (
                              <>
                                <Icon icon={Search01Icon} size={14} className="animate-pulse" />
                                <span>Searching: &quot;{(tool.args as { query: string }).query}&quot;</span>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* User message */}
                    {isUser && (() => {
                      const messageText = content || "Sending..."
                      const isSingleLine = !messageText.includes('\n') && messageText.length < 50
                      return (
                        <div className={cn(
                          "px-4 py-2 shadow-sm bg-peach-500 text-white dark:bg-peach-600",
                          isSingleLine ? "rounded-full" : "rounded-2xl"
                        )}>
                          <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap text-white">
                            {messageText}
                          </div>
                        </div>
                      )
                    })()}

                    {/* AI message - render parts, split into multiple bubbles */}
                    {!isUser && hasContent && (() => {
                      const messageContent = analysis || content
                      // Remove horizontal rules before splitting (but keep other markdown for rendering)
                      const cleanedForSplitting = messageContent
                        .replace(/^---+$/gm, "")
                        .replace(/^---+\s*$/gm, "")
                        .replace(/\n---+(\n|$)/g, "\n")
                        .replace(/(\n|^)---+(\n|$)/g, "\n")
                        .trim()
                      
                      const messageBubbles = splitIntoBubbles(cleanedForSplitting)
                      
                      // Clean bubbles (horizontal rules should already be removed by splitIntoBubbles)
                      const validBubbles = messageBubbles
                        .map(bubble => {
                          // Final cleanup of any remaining horizontal rules
                          return bubble
                            .replace(/^---+$/gm, "")
                            .replace(/^---+\s*$/gm, "")
                            .replace(/\n---+(\n|$)/g, "\n")
                            .trim()
                        })
                        .filter(b => {
                          // Filter out empty bubbles only (merging should have handled short ones)
                          return b.length > 0 && !/^---+$/.test(b)
                        })
                      
                      if (validBubbles.length === 0) {
                        // Fallback: if all bubbles were filtered, show original content cleaned
                        const fallback = cleanedForSplitting
                        return (
                          <div className="rounded-2xl px-4 py-3 shadow-sm bg-white dark:bg-muted border border-border/50 rounded-tl-md group/ai-message relative">
                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-2 prose-headings:font-semibold">
                              <ReactMarkdown>{fallback}</ReactMarkdown>
                            </div>
                          </div>
                        )
                      }
                      
                      return (
                        <div className="flex flex-col gap-3">
                          {validBubbles.map((bubble, bubbleIndex) => (
                            <motion.div
                              key={bubbleIndex}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: bubbleIndex * 0.1 }}
                              className="rounded-2xl px-4 py-3 shadow-sm bg-white dark:bg-muted border border-border/50 rounded-tl-md group/ai-message relative"
                            >
                              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-2 prose-headings:font-semibold">
                                <ReactMarkdown>{bubble}</ReactMarkdown>
                              </div>
                              {/* Copy button for each bubble */}
                              <button
                                onClick={() => copyToClipboard(bubble, `${message.id}-bubble-${bubbleIndex}`)}
                                className="absolute top-2 right-2 opacity-0 group-hover/ai-message:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                                title="Copy to clipboard"
                              >
                                <AnimatePresence mode="wait">
                                  {copiedId === `${message.id}-bubble-${bubbleIndex}` ? (
                                    <motion.span
                                      key="copied"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      <Icon icon={CheckmarkCircle01Icon} size={14} className="text-forest-500" />
                                    </motion.span>
                                  ) : (
                                    <motion.span
                                      key="copy"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      <Icon icon={Copy01Icon} size={14} />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )
                    })()}

                    {/* Draft response card */}
                    {draft && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="w-full"
                      >
                        <Card className="border-peach-200 dark:border-peach-800 bg-gradient-to-br from-peach-50/50 to-white dark:from-peach-950/20 dark:to-muted overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-peach-100 dark:bg-peach-900/50">
                                  <Icon icon={SentIcon} size={14} className="text-peach-600 dark:text-peach-400" />
                                </div>
                                Draft Response
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setInputText(draft)
                                    // Focus the textarea
                                    setTimeout(() => {
                                      textareaRef.current?.focus()
                                      // Scroll to bottom of textarea
                                      if (textareaRef.current) {
                                        textareaRef.current.scrollTop = textareaRef.current.scrollHeight
                                      }
                                    }, 100)
                                  }}
                                  className="h-8 px-3 hover:bg-peach-100 dark:hover:bg-peach-900/30 border-peach-300 dark:border-peach-700"
                                >
                                  <Icon icon={SentIcon} size={14} className="mr-1.5" />
                                  Insert into reply
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(draft, message.id)}
                                  className="h-8 px-3 hover:bg-peach-100 dark:hover:bg-peach-900/30"
                                >
                                  <AnimatePresence mode="wait">
                                    {copiedId === message.id ? (
                                      <motion.span
                                        key="copied"
                                        className="flex items-center text-forest-600 dark:text-forest-400"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.15 }}
                                      >
                                        <Icon icon={CheckmarkCircle01Icon} size={14} className="mr-1.5" />
                                        Copied!
                                      </motion.span>
                                    ) : (
                                      <motion.span
                                        key="copy"
                                        className="flex items-center"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.15 }}
                                      >
                                        <Icon icon={Copy01Icon} size={14} className="mr-1.5" />
                                        Copy
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-white dark:bg-background rounded-lg p-4 text-sm whitespace-pre-wrap border border-border/50 font-mono leading-relaxed">
                              {stripMarkdown(draft)}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}

          {/* Loading/Streaming indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="flex-none w-8 h-8 rounded-xl bg-gradient-to-br from-peach-100 to-peach-200 dark:from-peach-900 dark:to-peach-950 flex items-center justify-center mt-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon icon={MessageQuestionIcon} size={16} className="text-peach-600 dark:text-peach-400" />
                </motion.div>
                <div className="bg-white dark:bg-muted rounded-2xl rounded-tl-md px-4 py-3 border border-border/50 shadow-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 bg-peach-400 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">Analyzing response...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex-none w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mt-1">
                  <Icon icon={AlertCircleIcon} size={16} className="text-red-600 dark:text-red-400" />
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl rounded-tl-md px-4 py-3 border border-red-200 dark:border-red-900 shadow-sm">
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    {error instanceof Error ? error.message : "Something went wrong. Please try again."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Clear error by removing the last message if it's an error
                      setMessages((prev) => prev.slice(0, -1))
                    }}
                    className="border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    Try Again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
      
      {/* Fixed input area at bottom */}
      <div className="fixed bottom-14 lg:bottom-0 left-0 right-0 md:left-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:md:left-[var(--sidebar-width-icon)] z-40 border-t border-border bg-gradient-to-t from-background via-background to-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] transition-[left] duration-200 ease-linear">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-4">
          <div className="max-w-3xl mx-auto">
            <PromptInput
              accept="image/*,.pdf,.doc,.docx,.txt"
              multiple
              globalDrop
              maxFiles={5}
              maxFileSize={10 * 1024 * 1024}
              onError={handleFileError}
              onSubmit={handleSubmit}
              className="rounded-lg border border-border shadow-sm bg-white dark:bg-muted overflow-hidden transition-all duration-200 [&_[data-slot=input-group]]:border-0 [&_[data-slot=input-group]]:ring-0 [&_[data-slot=input-group]]:shadow-none"
            >
              {/* Attachments preview in header */}
              <PromptInputHeader className="border-b border-border/50 bg-muted/30 empty:hidden empty:border-0">
                <PromptInputAttachments>
                  {(attachment) => (
                    <PromptInputAttachment data={attachment} />
                  )}
                </PromptInputAttachments>
              </PromptInputHeader>

              {/* Textarea wrapped in body */}
              <PromptInputBody>
                <PromptInputTextarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    messages.length === 0
                      ? `Paste ${caseData.company_name}'s response here or drag & drop their email...`
                      : `Reply to ${caseData.company_name}...`
                  }
                  disabled={isLoading}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-[80px] max-h-[80px] py-4 px-4 resize-none text-base placeholder:text-muted-foreground/60"
                />
              </PromptInputBody>

              {/* Footer with tools and submit */}
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger className="text-muted-foreground hover:text-forest-600 hover:bg-forest-50 dark:hover:bg-forest-900/30 dark:hover:text-forest-400" />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments label="Attach screenshot or document" />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                  <PromptInputSpeechButton
                    textareaRef={textareaRef}
                    onTranscriptionChange={setInputText}
                    className="text-muted-foreground hover:text-forest-600 hover:bg-forest-50 dark:hover:bg-forest-900/30 dark:hover:text-forest-400"
                  />
                </PromptInputTools>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {isLoading ? "Analyzing..." : "⏎ Send · ⇧⏎ New line"}
                  </span>
                  <PromptInputSubmit
                    status={status}
                    disabled={!inputText.trim() && !isLoading}
                    className={cn(
                      "rounded-full transition-colors",
                      inputText.trim() || isLoading
                        ? "bg-peach-400 hover:bg-peach-500 active:bg-peach-600 text-white shadow-[inset_0_1px_0_0_theme(colors.peach.600/0.12)] [&_svg]:opacity-[0.64]"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  />
                </div>
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  )
}
