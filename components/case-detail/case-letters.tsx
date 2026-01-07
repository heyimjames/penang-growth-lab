"use client"

import { useState, useTransition, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icon } from "@/lib/icons"
import {
  Mail01Icon,
  Copy01Icon,
  Download01Icon,
  File01Icon,
  Edit02Icon,
  CheckmarkCircle01Icon,
  Edit01Icon,
  Briefcase01Icon,
  Comment01Icon,
  SentIcon,
  LinkSquare01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
  JusticeScale01Icon,
  CreditCardIcon,
  Clock01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { cn } from "@/lib/utils"
import { createLetter, updateLetter } from "@/lib/actions/letters"
import { getProfileForLetter } from "@/lib/actions/profile"
import { toast } from "sonner"
import { useEmailContext } from "./email-context"
import { LetterTypeSheet } from "./letter-type-sheet"
import type { Letter, LetterType, Evidence } from "@/lib/types"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Delete01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface LetterTypeOption {
  value: LetterType
  label: string
  description: string
  icon: typeof Mail01Icon
  badge?: string
  badgeColor?: string
  requiresExistingLetter?: boolean
  requiresCompanyResponse?: boolean
  requiresCardPayment?: boolean
}

const letterTypes: LetterTypeOption[] = [
  {
    value: "initial",
    label: "Initial Complaint",
    description: "First letter to the company",
    icon: Mail01Icon,
    badge: "Start Here",
    badgeColor: "bg-forest-100 text-forest-700 border-forest-200",
  },
  {
    value: "follow-up",
    label: "Follow-Up",
    description: "No response after 14 days",
    icon: Clock01Icon,
    requiresExistingLetter: true,
  },
  {
    value: "response-counter",
    label: "Counter Response",
    description: "Reply to inadequate offer",
    icon: Comment01Icon,
    requiresCompanyResponse: true,
  },
  {
    value: "escalation",
    label: "Escalation",
    description: "To ombudsman/regulator",
    icon: ArrowRight01Icon,
    requiresExistingLetter: true,
  },
  {
    value: "letter-before-action",
    label: "Letter Before Action",
    description: "Final legal warning",
    icon: JusticeScale01Icon,
    badge: "Legal",
    badgeColor: "bg-red-100 text-red-700 border-red-200",
    requiresExistingLetter: true,
  },
  {
    value: "chargeback",
    label: "Chargeback / Section 75",
    description: "Claim via card issuer",
    icon: CreditCardIcon,
    requiresCardPayment: true,
  },
]

interface CaseLettersProps {
  caseId: string
  letters: Letter[]
  evidence?: Evidence[]
  caseData: {
    companyName: string
    complaintText: string
    title: string
    purchaseAmount: number
    currency: string
    incidentDate: Date
    desiredOutcome: string
    issues: string[]
    legalBasis: { law: string; section: string; summary?: string; strength?: string }[]
    compensation: { recommended: number }
    contactEmails: string[]
    twitterHandle: string | null
    incidentCountry?: string
    userCountry?: string
    paymentMethod?: string
  }
}

const tones = [
  { 
    value: "formal", 
    label: "Formal", 
    description: "Professional & business-like",
    icon: Briefcase01Icon,
  },
  { 
    value: "assertive", 
    label: "Assertive", 
    description: "Firm & direct",
    icon: KnightShieldIcon,
  },
  { 
    value: "friendly", 
    label: "Empathetic", 
    description: "Understanding but clear",
    icon: Comment01Icon,
  },
]

// Helper function to extract subject and body from a letter string
function extractSubjectAndBody(letter: string | null): { subject: string; body: string } {
  if (!letter) {
    return { subject: "", body: "" }
  }
  
  // Check if letter starts with "Subject:"
  if (letter.startsWith("Subject:")) {
    const lines = letter.split("\n")
    const subject = lines[0].replace("Subject:", "").trim()
    // Remove subject line and any following empty lines
    const body = lines.slice(1).join("\n").replace(/^\n+/, "")
    return { subject, body }
  }
  
  return { subject: "", body: letter }
}

// Helper function to analyze complaint and suggest appropriate outcome when "ai-suggested" is selected
function analyzeAndSuggestOutcome(
  complaint: string,
  issues: string[],
  purchaseAmount: number,
  currency: string
): string {
  const combined = `${complaint.toLowerCase()} ${issues.map(i => i.toLowerCase()).join(" ")}`
  
  const hasFinancialLoss = purchaseAmount > 0 || combined.includes("paid") || combined.includes("cost")
  const hasServiceFailure = combined.includes("cancelled") || combined.includes("delayed") || combined.includes("didn't receive")
  const hasRudeness = combined.includes("rude") || combined.includes("disrespect") || combined.includes("horrible") || combined.includes("disgraceful") || combined.includes("shouting")
  const hasDistress = combined.includes("distress") || combined.includes("upset") || combined.includes("honeymoon") || combined.includes("special occasion") || combined.includes("humiliat")
  
  const outcomes: string[] = []
  const currencySymbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$"
  
  if (hasFinancialLoss && purchaseAmount > 0) {
    if (hasServiceFailure) {
      outcomes.push(`a full refund of ${currencySymbol}${purchaseAmount.toFixed(2)}`)
    } else {
      outcomes.push("a partial refund to reflect the substandard service received")
    }
  }
  
  if (hasRudeness || hasDistress) {
    outcomes.push("a formal written apology")
    if (hasDistress) {
      outcomes.push("compensation for the distress and inconvenience caused")
    }
  }
  
  if (outcomes.length === 0) {
    outcomes.push("an appropriate resolution to this matter")
  }
  
  return outcomes.join(", and ")
}

export function CaseLetters({ caseId, letters, evidence = [], caseData }: CaseLettersProps) {
  const router = useRouter()

  // Check if we have any existing letters
  const hasExistingLetters = letters.length > 0
  const mostRecentLetter = letters[0] || null

  // Currently viewing letter (from the list)
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(mostRecentLetter?.id || null)
  const selectedLetter = letters.find(l => l.id === selectedLetterId) || null

  // Letter type state for generating new letters
  const [selectedLetterType, setSelectedLetterType] = useState<LetterType>(
    hasExistingLetters ? "follow-up" : "initial"
  )
  // Always use assertive (firm & direct) tone
  const selectedTone = "assertive"
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLetterTypeOpen, setIsLetterTypeOpen] = useState(!hasExistingLetters)

  // Additional context for specific letter types
  const [previousLetterDate, setPreviousLetterDate] = useState("")
  const [companyResponse, setCompanyResponse] = useState("")
  const [companyOffer, setCompanyOffer] = useState("")
  const [ombudsmanName, setOmbudsmanName] = useState("")
  const [cardIssuer, setCardIssuer] = useState("")

  // Current letter being edited (either selected or newly generated)
  const [generatedLetter, setGeneratedLetter] = useState<string>(selectedLetter?.body || "")
  const [subjectLine, setSubjectLine] = useState<string>(
    selectedLetter?.subject || `Formal Complaint - ${caseData.companyName} - ${caseData.title}`
  )
  const [currentLetterId, setCurrentLetterId] = useState<string | null>(selectedLetter?.id || null)

  // Update editor when selected letter changes
  const handleSelectLetter = (letter: Letter) => {
    setSelectedLetterId(letter.id)
    setCurrentLetterId(letter.id)
    setGeneratedLetter(letter.body)
    setSubjectLine(letter.subject || `Formal Complaint - ${caseData.companyName}`)
  }

  const [copiedSubject, setCopiedSubject] = useState(false)
  const [copiedBody, setCopiedBody] = useState(false)
  const [isEditingSubject, setIsEditingSubject] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const [regenerateFeedback, setRegenerateFeedback] = useState("")
  
  // Get additional emails from context (e.g., from executive search)
  const { additionalEmails, additionalExecutives } = useEmailContext()
  
  // Combine prop emails with context emails (dedupe)
  const allContactEmails = useMemo(() => {
    const combined = [
      ...caseData.contactEmails,
      ...additionalEmails,
      ...additionalExecutives.filter(e => e.email).map(e => e.email!),
    ]
    return combined.filter((email, index) => combined.indexOf(email) === index)
  }, [caseData.contactEmails, additionalEmails, additionalExecutives])

  // Build mailto link with pre-filled data
  const mailtoLink = useMemo(() => {
    const emails = allContactEmails.length > 0 
      ? allContactEmails.slice(0, 5).join(",")
      : ""
    const subject = encodeURIComponent(subjectLine)
    const body = generatedLetter 
      ? encodeURIComponent(generatedLetter)
      : encodeURIComponent(`Dear ${caseData.companyName} Customer Relations,\n\nI am writing to formally complain about...\n\n[Please generate a letter first]`)
    return `mailto:${emails}?subject=${subject}&body=${body}`
  }, [allContactEmails, subjectLine, generatedLetter, caseData.companyName])

  // Clean Twitter handle
  const cleanTwitterHandle = useMemo(() => {
    if (!caseData.twitterHandle) return null
    return caseData.twitterHandle.replace("@", "").trim()
  }, [caseData.twitterHandle])

  // PDF download function
  const handleDownloadPDF = useCallback(() => {
    if (!generatedLetter) {
      toast.error("No letter to download. Please generate a letter first.")
      return
    }

    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const maxWidth = pageWidth - margin * 2
      
      // Add subject line as title
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      const subjectLines = doc.splitTextToSize(`Subject: ${subjectLine}`, maxWidth)
      doc.text(subjectLines, margin, margin + 10)
      
      // Add date
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const date = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
      doc.text(date, margin, margin + 25)
      
      // Add letter body
      doc.setFontSize(11)
      const letterLines = doc.splitTextToSize(generatedLetter, maxWidth)
      
      let yPosition = margin + 35
      const lineHeight = 5
      
      for (const line of letterLines) {
        if (yPosition > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }
        doc.text(line, margin, yPosition)
        yPosition += lineHeight
      }
      
      // Generate filename
      const sanitizedCompany = caseData.companyName.replace(/[^a-zA-Z0-9]/g, "_")
      const filename = `Complaint_Letter_${sanitizedCompany}_${new Date().toISOString().split("T")[0]}.pdf`
      
      doc.save(filename)
      trackEvent(AnalyticsEvents.LETTER.DOWNLOADED, {
        case_id: caseId,
        format: "pdf",
        letter_type: selectedLetterType,
      })
      toast.success("PDF downloaded successfully")
    } catch (error) {
      console.error("PDF generation error:", error)
      toast.error("Failed to generate PDF. Please try again.")
    }
  }, [generatedLetter, subjectLine, caseData.companyName, caseId, selectedLetterType])

  // Twitter DM link
  const twitterDMLink = useMemo(() => {
    if (!cleanTwitterHandle) return null
    return `https://twitter.com/messages/compose?recipient_id=${cleanTwitterHandle}`
  }, [cleanTwitterHandle])

  // Twitter public tweet link
  const twitterTweetLink = useMemo(() => {
    if (!cleanTwitterHandle) return null
    const tweetText = encodeURIComponent(
      `@${cleanTwitterHandle} I'm having issues with my recent experience and haven't received a satisfactory response to my complaint. Please help resolve this. #CustomerService`
    )
    return `https://twitter.com/intent/tweet?text=${tweetText}`
  }, [cleanTwitterHandle])

  // Save letter - either update existing or create new
  const saveLetter = async (
    subject: string,
    body: string,
    letterType: LetterType,
    tone: string,
    existingLetterId?: string | null
  ) => {
    startTransition(async () => {
      if (existingLetterId) {
        // Update existing letter
        const result = await updateLetter(existingLetterId, {
          subject,
          body,
          tone,
          updated_at: new Date().toISOString(),
        })
        if (!result) {
          toast.error("Failed to save letter")
        }
      } else {
        // Create new letter
        const result = await createLetter(caseId, {
          letter_type: letterType,
          subject,
          body,
          tone,
        })
        if (result) {
          setCurrentLetterId(result.id)
          router.refresh() // Refresh to get updated letters list
        } else {
          toast.error("Failed to save letter")
        }
      }
    })
  }

  const handleGenerate = async (feedback?: string) => {
    setIsGenerating(true)

    // Track letter generation started
    trackEvent(AnalyticsEvents.LETTER.GENERATION_STARTED, {
      case_id: caseId,
      letter_type: selectedLetterType,
      tone: selectedTone,
    })

    try {
      // Use letter-type API for all letter types
      const endpoint = "/api/generate/letter-type"
      
      // Fetch user profile for letter personalization
      const userProfile = await getProfileForLetter()
      
      // Build evidence context for the AI - only include analyzed evidence
      const evidenceForLetter = evidence
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

      const requestBody: Record<string, unknown> = {
        letterType: selectedLetterType,
        complaint: caseData.complaintText || caseData.title,
        companyName: caseData.companyName,
        incidentDate: caseData.incidentDate.toISOString().split("T")[0],
        purchaseAmount: caseData.purchaseAmount.toString(),
        currency: caseData.currency === "£" ? "GBP" : caseData.currency === "€" ? "EUR" : "USD",
        desiredOutcome: caseData.desiredOutcome || "full refund",
        tone: selectedTone as "formal" | "assertive" | "friendly",
        issues: caseData.issues,
        evidence: evidenceForLetter.length > 0 ? evidenceForLetter : undefined,
        legalBasis: caseData.legalBasis.map(l => ({
          law: l.law,
          section: l.section,
          summary: l.summary || l.section,
          strength: l.strength,
        })),
        incidentCountry: caseData.incidentCountry,
        userCountry: caseData.userCountry,
        paymentMethod: caseData.paymentMethod,
        caseReference: `COMP-${caseId.slice(0, 8).toUpperCase()}`,
        userProfile,
      }
      
      // Add type-specific fields
      if (selectedLetterType === "follow-up" || selectedLetterType === "letter-before-action" || selectedLetterType === "escalation") {
        requestBody.previousLetterDate = previousLetterDate || "14 days ago"
        requestBody.previousLetterSummary = "Initial formal complaint regarding service issues"
      }
      
      if (selectedLetterType === "response-counter" || selectedLetterType === "escalation") {
        requestBody.companyResponse = companyResponse || undefined
        requestBody.companyOffer = companyOffer || undefined
      }
      
      if (selectedLetterType === "escalation") {
        requestBody.ombudsmanName = ombudsmanName || undefined
      }
      
      if (selectedLetterType === "chargeback") {
        requestBody.cardIssuer = cardIssuer || undefined
        requestBody.cardType = caseData.paymentMethod?.toLowerCase().includes("credit") ? "credit" : "debit"
      }
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      
      if (data.letter) {
        // Extract subject and body in case the API returned them combined
        const { subject: apiSubject, body: apiBody } = extractSubjectAndBody(data.letter)
        
        // Use API subject if provided, otherwise use extracted one
        const finalSubject = data.subject || apiSubject || subjectLine
        const finalBody = apiBody || data.letter
        
        setGeneratedLetter(finalBody)
        setSubjectLine(finalSubject)

        // Save to database - always create a NEW letter for generation
        await saveLetter(finalSubject, finalBody, selectedLetterType, selectedTone, null)

        // Track letter generation completed
        trackEvent(AnalyticsEvents.LETTER.GENERATION_COMPLETED, {
          case_id: caseId,
          letter_type: selectedLetterType,
          tone: selectedTone,
          letter_length: finalBody.length,
        })

        toast.success(`${letterTypes.find(t => t.value === selectedLetterType)?.label || "Letter"} generated and saved!`)
      } else {
        throw new Error("No letter returned")
      }
    } catch (error) {
      console.error("Letter generation error:", error)
      // Fallback letter generation - professional format without section headers
      const currencySymbol = caseData.currency
      // Handle "ai-suggested" - use analyzed outcome instead of literal text
      const desiredOutcomeText = (!caseData.desiredOutcome || caseData.desiredOutcome === "ai-suggested")
        ? analyzeAndSuggestOutcome(
            caseData.complaintText || caseData.title,
            caseData.issues,
            caseData.purchaseAmount,
            caseData.currency
          )
        : caseData.desiredOutcome.replace(/-/g, " ")
      const dateStr = caseData.incidentDate 
        ? caseData.incidentDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : "recently"
      
      // Create clean subject line - extract first outcome for brevity
      const outcomeForSubject = desiredOutcomeText.split(",")[0].replace(/^a /, "").replace(/^an /, "")
      const fallbackSubject = `Formal Complaint - ${caseData.companyName} - ${outcomeForSubject.charAt(0).toUpperCase() + outcomeForSubject.slice(1)} Required`
      
      // Build legal rights as flowing text
      const legalRightsText = caseData.legalBasis.length > 0
        ? caseData.legalBasis.map(law => `Under the ${law.law}${law.section ? ` (${law.section})` : ""}, ${law.summary?.toLowerCase() || "I am entitled to services performed with reasonable care and skill"}.`).join(" ")
        : "Under the Consumer Rights Act 2015, I am entitled to services performed with reasonable care and skill."
      
      // Build issues as prose
      const issuesText = caseData.issues.length > 0
        ? `The key issues include: ${caseData.issues.map(i => i.toLowerCase()).join("; ")}.`
        : ""

      const letter = `Dear ${caseData.companyName} Customer Relations,

I am writing to formally complain about an unacceptable experience I had with your company on ${dateStr}. I am extremely disappointed with the level of service I received and believe this matter requires your immediate attention.

${caseData.complaintText || caseData.title}

${issuesText} ${legalRightsText} The treatment I received fell far below these standards and has caused me significant distress and inconvenience.

To resolve this matter, I am seeking ${desiredOutcomeText}${caseData.purchaseAmount > 0 ? ` totalling ${currencySymbol}${caseData.purchaseAmount.toFixed(2)}` : ""}. I believe this is a fair and reasonable request given the circumstances.

I expect to receive a written response within 14 days of the date of this letter. Should I not receive a satisfactory resolution within this timeframe, I will have no choice but to escalate this complaint to the relevant ombudsman service, report the matter to Trading Standards, and share my experience on consumer review platforms. I may also consider pursuing the matter through the small claims court if necessary.

I trust you will treat this complaint with the seriousness it deserves and look forward to hearing from you promptly.

Yours faithfully,

[Your Full Name]
[Your Address]
[Your Email]
[Your Phone Number]

Date: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
Reference: COMP-${Date.now().toString(36).toUpperCase()}`

      setGeneratedLetter(letter)
      setSubjectLine(fallbackSubject)
      await saveLetter(fallbackSubject, letter, selectedLetterType, selectedTone, null)
      toast.success("Letter generated and saved!")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleLetterChange = (newLetter: string) => {
    // Strip subject line if user accidentally pastes it
    const { body: cleanBody } = extractSubjectAndBody(newLetter)
    setGeneratedLetter(cleanBody)
    // Save on edit - update existing letter if we have one
    if (currentLetterId) {
      saveLetter(subjectLine, cleanBody, selectedLetterType, selectedTone, currentLetterId)
    }
  }

  const handleSubjectChange = (newSubject: string) => {
    setSubjectLine(newSubject)
    // Save on edit - update existing letter if we have one
    if (currentLetterId) {
      saveLetter(newSubject, generatedLetter, selectedLetterType, selectedTone, currentLetterId)
    }
  }

  const handleCopySubject = async () => {
    await navigator.clipboard.writeText(subjectLine)
    setCopiedSubject(true)
    trackEvent(AnalyticsEvents.LETTER.COPIED, {
      case_id: caseId,
      copy_type: "subject",
    })
    toast.success("Subject line copied!")
    setTimeout(() => setCopiedSubject(false), 2000)
  }

  const handleCopyBody = async () => {
    await navigator.clipboard.writeText(generatedLetter)
    setCopiedBody(true)
    trackEvent(AnalyticsEvents.LETTER.COPIED, {
      case_id: caseId,
      copy_type: "body",
      letter_type: selectedLetterType,
    })
    toast.success("Letter copied!")
    setTimeout(() => setCopiedBody(false), 2000)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-5 pb-8">
      {/* Main Column */}
      <div className="lg:col-span-2 space-y-5">
        {/* Letter Journey Guide - always visible but collapsible when letter exists */}
        {!generatedLetter && (
          <div className="rounded-xl border border-forest-200 dark:border-forest-800 bg-gradient-to-br from-forest-50 to-forest-100/50 dark:from-forest-950/30 dark:to-forest-900/20 p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-forest-500 text-white shrink-0">
                <Icon icon={File01Icon} size={18} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-forest-900 dark:text-forest-100 mb-1">Your Letter Journey</h3>
                <p className="text-xs text-forest-700 dark:text-forest-300 leading-relaxed">
                  Start with an <strong>Initial Complaint</strong>. If they don&apos;t respond within 14 days, send a <strong>Follow-Up</strong>.
                  If their offer is inadequate, use <strong>Counter Response</strong>. Still no resolution?
                  <strong> Escalate</strong> to an ombudsman or send a <strong>Letter Before Action</strong> before court.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Letter Type Selection - Collapsible */}
        <Collapsible open={isLetterTypeOpen} onOpenChange={setIsLetterTypeOpen}>
          <div className="rounded-xl border border-border bg-card p-5">
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full mb-4">
                <div className="flex items-center gap-2">
                  <Icon icon={File01Icon} size={18} className="text-lavender-500" />
                  <h3 className="font-semibold">{generatedLetter ? "Generate A Letter" : "Choose Letter Type"}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {selectedLetterType !== "initial" && (
                    <Badge variant="outline" className="text-xs">
                      Step {selectedLetterType === "follow-up" ? "2" : selectedLetterType === "response-counter" ? "3" : selectedLetterType === "escalation" ? "4" : selectedLetterType === "letter-before-action" ? "5" : "2"}
                    </Badge>
                  )}
                  <Icon 
                    icon={isLetterTypeOpen ? ArrowUp01Icon : ArrowDown01Icon} 
                    size={18} 
                    className="text-muted-foreground transition-transform"
                  />
                </div>
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {letterTypes.map((type) => {
                  const isSelected = selectedLetterType === type.value
                  const isDisabled = (type.requiresExistingLetter && !hasExistingLetters) ||
                    (type.requiresCardPayment && !caseData.paymentMethod?.toLowerCase().includes("card") && !caseData.paymentMethod?.toLowerCase().includes("credit") && !caseData.paymentMethod?.toLowerCase().includes("debit"))
                  
                  return (
                    <motion.button
                      key={type.value}
                      type="button"
                      onClick={() => !isDisabled && setSelectedLetterType(type.value)}
                      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
                      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
                      disabled={isDisabled}
                      className={cn(
                        "relative flex flex-col items-start gap-1.5 p-3 rounded-lg border cursor-pointer transition-all text-left",
                        isSelected
                          ? "border-lavender-400 bg-lavender-50 dark:bg-lavender-950/30 ring-1 ring-lavender-400"
                          : "border-border hover:border-muted-foreground/40 bg-card",
                        isDisabled && "opacity-40 cursor-not-allowed hover:border-border"
                      )}
                    >
                      {/* Badge */}
                      {type.badge && (
                        <Badge className={cn("absolute -top-2 right-2 text-[9px] px-1.5 py-0 h-4", type.badgeColor)}>
                          {type.badge}
                        </Badge>
                      )}
                      
                      {/* Checkmark for selected */}
                      {isSelected && (
                        <div className="absolute -top-1.5 -left-1.5 z-10 bg-lavender-500 rounded-full p-0.5">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Icon 
                          icon={type.icon} 
                          size={16} 
                          className={cn(
                            "transition-colors shrink-0",
                            isSelected ? "text-lavender-600" : "text-muted-foreground"
                          )} 
                        />
                        <span className={cn(
                          "text-xs font-semibold",
                          isSelected ? "text-lavender-700 dark:text-lavender-300" : "text-foreground"
                        )}>
                          {type.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-tight pl-6">
                        {type.description}
                      </p>
                      {isDisabled && (
                        <p className="text-[9px] text-amber-600 dark:text-amber-400 pl-6 mt-0.5">
                          {type.requiresExistingLetter && !hasExistingLetters && "Requires initial letter"}
                          {type.requiresCardPayment && !caseData.paymentMethod?.toLowerCase().includes("card") && !caseData.paymentMethod?.toLowerCase().includes("credit") && !caseData.paymentMethod?.toLowerCase().includes("debit") && "Requires card payment"}
                          {type.requiresCompanyResponse && !companyResponse && "Requires company response"}
                        </p>
                      )}
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Help text for selected type */}
              {selectedLetterType && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className="flex items-start gap-2">
                    <Icon icon={AlertCircleIcon} size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      <strong className="text-foreground">
                        {letterTypes.find(t => t.value === selectedLetterType)?.label}:
                      </strong>{" "}
                      {selectedLetterType === "initial" && "Send this first to formally start your complaint. Companies have 14 days to respond."}
                      {selectedLetterType === "follow-up" && "Use this if you haven't received a response after 14 days. Sets a new 7-day deadline."}
                      {selectedLetterType === "response-counter" && "Reply when the company's offer doesn't meet your legal rights. Explain why and counter with what you're actually entitled to."}
                      {selectedLetterType === "escalation" && "After 8 weeks with no resolution, escalate to the relevant ombudsman or regulatory body. They can investigate and make binding decisions."}
                      {selectedLetterType === "letter-before-action" && "Final legal warning before court. Must be sent before filing a claim. Gives them 14 days to pay or you'll proceed to court."}
                      {selectedLetterType === "chargeback" && "If you paid by card, you can claim via your card issuer. Section 75 (credit cards) gives you legal protection. Chargebacks (debit) are scheme rules."}
                    </div>
                  </div>
                </motion.div>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>

            {/* Additional Context Fields - based on selected letter type */}
            <AnimatePresence mode="wait">
              {(selectedLetterType === "follow-up" || selectedLetterType === "letter-before-action" || selectedLetterType === "escalation") && (
                <motion.div
                  key="previous-letter-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon={Clock01Icon} size={16} className="text-amber-600" />
                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Previous Correspondence</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-amber-700 dark:text-amber-400">When did you send your original complaint?</Label>
                      <Input
                        type="date"
                        value={previousLetterDate}
                        onChange={(e) => setPreviousLetterDate(e.target.value)}
                        className="mt-1 bg-white dark:bg-background"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {(selectedLetterType === "response-counter") && (
                <motion.div
                  key="counter-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon={Comment01Icon} size={16} className="text-amber-600" />
                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Company&apos;s Response</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-amber-700 dark:text-amber-400">What did the company say? (paste their response)</Label>
                      <Textarea
                        value={companyResponse}
                        onChange={(e) => setCompanyResponse(e.target.value)}
                        placeholder="Paste the company's response here..."
                        className="mt-1 min-h-[100px] bg-white dark:bg-background"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-amber-700 dark:text-amber-400">What did they offer? (if anything)</Label>
                      <Input
                        value={companyOffer}
                        onChange={(e) => setCompanyOffer(e.target.value)}
                        placeholder="e.g., £20 voucher, 10% refund..."
                        className="mt-1 bg-white dark:bg-background"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {selectedLetterType === "escalation" && (
                <motion.div
                  key="escalation-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon={ArrowRight01Icon} size={16} className="text-amber-600" />
                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Escalation Details</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-amber-700 dark:text-amber-400">Ombudsman/Regulator (optional)</Label>
                      <Input
                        value={ombudsmanName}
                        onChange={(e) => setOmbudsmanName(e.target.value)}
                        placeholder="e.g., Financial Ombudsman Service, CAA..."
                        className="mt-1 bg-white dark:bg-background"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-amber-700 dark:text-amber-400">What did the company offer? (if anything)</Label>
                      <Input
                        value={companyOffer}
                        onChange={(e) => setCompanyOffer(e.target.value)}
                        placeholder="e.g., £20 voucher, rejected claim..."
                        className="mt-1 bg-white dark:bg-background"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {selectedLetterType === "chargeback" && (
                <motion.div
                  key="chargeback-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon={CreditCardIcon} size={16} className="text-amber-600" />
                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Card Details</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-amber-700 dark:text-amber-400">Card issuer / Bank</Label>
                      <Input
                        value={cardIssuer}
                        onChange={(e) => setCardIssuer(e.target.value)}
                        placeholder="e.g., Barclays, HSBC, American Express..."
                        className="mt-1 bg-white dark:bg-background"
                      />
                    </div>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">
                      💡 Section 75 applies to credit card purchases over £100. Chargebacks apply to debit cards.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate Letter */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon={Edit02Icon} size={18} className="text-peach-500" />
                <h3 className="font-semibold">Generate {letterTypes.find(t => t.value === selectedLetterType)?.label}</h3>
              </div>

          <Button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            variant="coral"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Icon icon={Edit02Icon} size={16} className="mr-2" />
                {generatedLetter ? "Regenerate" : "Generate"} {letterTypes.find(t => t.value === selectedLetterType)?.label}
              </>
            )}
          </Button>
        </div>

        {/* Generated Letter - shown when exists */}
        {generatedLetter && (
          <>
            {/* Subject Line */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon icon={Mail01Icon} size={16} className="text-lavender-500" />
                  <h3 className="text-sm font-semibold">Subject Line</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopySubject}
                  className={cn(
                    "h-7 text-xs",
                    copiedSubject && "bg-forest-50 border-forest-200 text-forest-600"
                  )}
                >
                  <Icon icon={copiedSubject ? CheckmarkCircle01Icon : Copy01Icon} size={12} className="mr-1" />
                  {copiedSubject ? "Copied" : "Copy"}
                </Button>
              </div>
              {isEditingSubject ? (
                <input
                  type="text"
                  value={subjectLine}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  onBlur={() => setIsEditingSubject(false)}
                  autoFocus
                  className="w-full px-3 py-2 text-sm font-medium bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-peach-500"
                />
              ) : (
                <div 
                  onClick={() => setIsEditingSubject(true)}
                  className="px-3 py-2 text-sm font-medium bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors flex items-start justify-between gap-2 group"
                >
                  <span className="break-words">{subjectLine}</span>
                  <Icon icon={Edit01Icon} size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                </div>
              )}
            </div>

            {/* Letter Body */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Icon icon={File01Icon} size={18} className="text-muted-foreground" />
                  <h3 className="font-semibold">Letter Body</h3>
                  {isPending && (
                    <span className="text-xs text-muted-foreground">(saving...)</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadPDF}
                    disabled={!generatedLetter}
                  >
                    <Icon icon={Download01Icon} size={14} className="mr-1.5" />
                    PDF
                  </Button>
                </div>
              </div>
              
              {/* Letter content with sticky copy button inside */}
              <div className="p-4">
                <div className="relative">
                  <Textarea
                    value={generatedLetter}
                    onChange={(e) => handleLetterChange(e.target.value)}
                    className="min-h-[350px] text-sm border-border bg-muted/30 resize-y pr-16"
                  />
                  {/* Sticky copy button inside textarea area */}
                  <div className="absolute top-2 right-2 z-10">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopyBody}
                      className={cn(
                        "h-7 text-xs shadow-sm bg-background/90 backdrop-blur-sm",
                        copiedBody && "bg-forest-50 border-forest-200 text-forest-600"
                      )}
                    >
                      <Icon icon={copiedBody ? CheckmarkCircle01Icon : Copy01Icon} size={12} className="mr-1" />
                      {copiedBody ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border-t">
                <Button
                  size="sm"
                  onClick={() => setShowRegenerateDialog(true)}
                  variant="coral"
                >
                  <Icon icon={Edit02Icon} size={14} className="mr-1.5" />
                  Regenerate
                </Button>
                <a href={mailtoLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-forest-600 hover:bg-forest-700 text-white">
                    <Icon icon={Mail01Icon} size={14} className="mr-1.5" />
                    Open in Mail
                  </Button>
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        {/* Letter History - show when we have multiple letters */}
        {letters.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon icon={File01Icon} size={16} className="text-lavender-500" />
                <h4 className="text-sm font-semibold">Your Letters</h4>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {letters.length} {letters.length === 1 ? "letter" : "letters"}
              </Badge>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto overscroll-contain">
              {letters.map((letter) => {
                const isActive = selectedLetterId === letter.id
                const typeInfo = letterTypes.find(t => t.value === letter.letter_type)
                return (
                  <button
                    key={letter.id}
                    onClick={() => handleSelectLetter(letter)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all touch-manipulation",
                      "min-h-[56px]", // Ensure comfortable touch target
                      isActive
                        ? "border-lavender-400 bg-lavender-50 dark:bg-lavender-950/30"
                        : "border-border hover:border-muted-foreground/40 hover:bg-muted/30 active:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {typeInfo && (
                        <div className={cn(
                          "p-1.5 rounded-lg shrink-0",
                          isActive ? "bg-lavender-200 text-lavender-700" : "bg-muted text-muted-foreground"
                        )}>
                          <Icon icon={typeInfo.icon} size={14} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          isActive && "text-lavender-700 dark:text-lavender-300"
                        )}>
                          {typeInfo?.label || letter.letter_type}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {format(new Date(letter.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-lavender-500 shrink-0" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            <Button
              variant="outline"
              className="w-full mt-3 h-11 text-sm font-medium touch-manipulation"
              onClick={() => {
                setSelectedLetterId(null)
                setCurrentLetterId(null)
                setGeneratedLetter("")
                setSubjectLine(`Formal Complaint - ${caseData.companyName} - ${caseData.title}`)
                setIsLetterTypeOpen(true)
              }}
            >
              <Icon icon={Edit02Icon} size={16} className="mr-2" />
              Generate New Letter
            </Button>
          </div>
        )}

        {/* Letter Types Guide - only show when no letter generated */}
        {!generatedLetter && (
          <div className="rounded-xl border border-lavender-200 dark:border-lavender-900 bg-lavender-50 dark:bg-lavender-950/30 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon={File01Icon} size={16} className="text-lavender-600" />
              <h4 className="text-sm font-semibold text-lavender-800 dark:text-lavender-300">Letter Types</h4>
            </div>
            <div className="space-y-2.5 text-xs">
              <div>
                <p className="font-medium text-foreground mb-0.5">1. Initial Complaint</p>
                <p className="text-muted-foreground text-[11px]">Start here - your first formal letter</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-0.5">2. Follow-Up</p>
                <p className="text-muted-foreground text-[11px]">No response after 14 days</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-0.5">3. Counter Response</p>
                <p className="text-muted-foreground text-[11px]">Their offer is too low</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-0.5">4. Escalation</p>
                <p className="text-muted-foreground text-[11px]">To ombudsman after 8 weeks</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-0.5">5. Letter Before Action</p>
                <p className="text-muted-foreground text-[11px]">Final warning before court</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-0.5">6. Chargeback</p>
                <p className="text-muted-foreground text-[11px]">Claim via card issuer</p>
              </div>
            </div>
          </div>
        )}

        {/* Send Options - Hidden on mobile */}
        <div className="hidden md:block rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground mb-2">Send Your Complaint</p>
          <div className="space-y-2">
            {/* Email Option */}
            {allContactEmails.length > 0 ? (
              <a 
                href={mailtoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex flex-col gap-2 p-3 rounded-lg border border-lavender-200 dark:border-lavender-900 bg-lavender-50 dark:bg-lavender-950/30 hover:bg-lavender-100 dark:hover:bg-lavender-950/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-lavender-500 text-white shrink-0">
                    <Icon icon={Mail01Icon} size={14} />
                  </div>
                  <div className="flex items-center gap-1.5 flex-1">
                    <p className="font-semibold text-xs">Send via Email</p>
                    <Badge variant="outline" className="text-[9px] bg-green-50 text-green-700 border-green-200">Best</Badge>
                  </div>
                  <Icon icon={LinkSquare01Icon} size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">To: {allContactEmails.slice(0, 5).length} recipient{allContactEmails.slice(0, 5).length > 1 ? "s" : ""}</p>
                  <div className="space-y-1 bg-white/50 dark:bg-black/20 rounded-md p-2 -mx-1">
                    {allContactEmails.slice(0, 5).map((email, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          i === 0 ? "bg-green-500" : "bg-lavender-400"
                        )} />
                        <p className="text-xs text-foreground font-medium truncate">{email}</p>
                        {i === 0 && <Badge className="text-[8px] px-1.5 py-0 h-4 bg-green-100 text-green-700 border-green-200">Primary</Badge>}
                      </div>
                    ))}
                  </div>
                  {allContactEmails.length > 5 && (
                    <p className="text-[10px] text-lavender-600 dark:text-lavender-400">
                      +{allContactEmails.length - 5} more recipient{allContactEmails.length - 5 > 1 ? "s" : ""} will be CC'd
                    </p>
                  )}
                </div>
              </a>
            ) : (
              <div className="w-full flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/30 text-left opacity-60">
                <Icon icon={Mail01Icon} size={16} className="text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-xs">Email</p>
                  <p className="text-[10px] text-muted-foreground">No contact email found</p>
                </div>
              </div>
            )}

            {/* Twitter Options */}
            {cleanTwitterHandle ? (
              <div className="space-y-1.5">
                <a 
                  href={`https://twitter.com/${cleanTwitterHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left group"
                >
                  <svg className="w-4 h-4 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs">@{cleanTwitterHandle}</p>
                    <p className="text-[10px] text-muted-foreground">View their X/Twitter profile</p>
                  </div>
                  <Icon icon={LinkSquare01Icon} size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
                
                <div className="grid grid-cols-2 gap-1.5">
                  <a 
                    href={twitterTweetLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-center"
                  >
                    <Icon icon={SentIcon} size={14} className="text-muted-foreground" />
                    <span className="text-[10px] font-medium">Public Tweet</span>
                  </a>
                  <a 
                    href={`https://twitter.com/messages/compose?text=Hi%20@${cleanTwitterHandle},%20I%20need%20help%20with%20a%20complaint.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-center"
                  >
                    <Icon icon={Comment01Icon} size={14} className="text-muted-foreground" />
                    <span className="text-[10px] font-medium">Direct Message</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-muted/30 text-left opacity-60">
                <svg className="w-4 h-4 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <div className="min-w-0">
                  <p className="font-medium text-xs">X / Twitter</p>
                  <p className="text-[10px] text-muted-foreground">No Twitter handle found</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions after letter generated */}
        {generatedLetter && (
          <div className="rounded-xl border border-forest-200 dark:border-forest-800 bg-forest-50 dark:bg-forest-950/30 p-5">
            <p className="text-xs font-semibold text-forest-700 dark:text-forest-300 mb-2">Ready to Send!</p>
            <a
              href={mailtoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full bg-forest-600 hover:bg-forest-700 text-white mb-2">
                <Icon icon={Mail01Icon} size={16} className="mr-2" />
                Open in Mail App
              </Button>
            </a>
            <p className="text-[10px] text-forest-600 dark:text-forest-400 text-center">
              Your letter will be pre-filled in the email
            </p>
          </div>
        )}

        {/* What Happens Next - shown after letter generated */}
        {generatedLetter && (
          <div className="rounded-xl border border-lavender-200 dark:border-lavender-800 bg-lavender-50 dark:bg-lavender-950/30 p-5">
            <p className="text-xs font-semibold text-lavender-700 dark:text-lavender-300 mb-3 flex items-center gap-1.5">
              <Icon icon={ArrowRight01Icon} size={14} />
              What Happens Next
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-lavender-200 dark:bg-lavender-900/50 flex items-center justify-center shrink-0 text-[10px] font-bold text-lavender-700 dark:text-lavender-300">1</div>
                <div>
                  <p className="text-xs font-medium text-foreground">Send your letter</p>
                  <p className="text-[10px] text-muted-foreground">Email or post - keep a copy for your records</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-lavender-200 dark:bg-lavender-900/50 flex items-center justify-center shrink-0 text-[10px] font-bold text-lavender-700 dark:text-lavender-300">2</div>
                <div>
                  <p className="text-xs font-medium text-foreground">Wait 14 days</p>
                  <p className="text-[10px] text-muted-foreground">Companies must respond within 14 days</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-lavender-200 dark:bg-lavender-900/50 flex items-center justify-center shrink-0 text-[10px] font-bold text-lavender-700 dark:text-lavender-300">3</div>
                <div>
                  <p className="text-xs font-medium text-foreground">No response?</p>
                  <p className="text-[10px] text-muted-foreground">Generate a Follow-Up letter to escalate</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-lavender-200 dark:bg-lavender-900/50 flex items-center justify-center shrink-0 text-[10px] font-bold text-lavender-700 dark:text-lavender-300">4</div>
                <div>
                  <p className="text-xs font-medium text-foreground">Still unresolved?</p>
                  <p className="text-[10px] text-muted-foreground">Escalate to ombudsman or trading standards</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <span className="text-base">💡</span>
            Before Sending
          </p>
          <div className="space-y-1.5">
            {[
              "Review and personalize the letter",
              "Fill in your contact details",
              "Attach any evidence files",
              "Keep a copy for your records",
              "Set a 14-day follow-up reminder",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-forest-100 dark:bg-forest-900/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon={CheckmarkCircle01Icon} size={10} className="text-forest-600 dark:text-forest-400" />
                </div>
                <span className="text-[11px] text-muted-foreground leading-tight">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regenerate Dialog */}
      <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate Letter</DialogTitle>
            <DialogDescription>
              What changes would you like to make to the letter? Leave blank to regenerate with the same settings.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g., Make it more formal, emphasize the compensation amount, add more detail about the incident..."
            value={regenerateFeedback}
            onChange={(e) => setRegenerateFeedback(e.target.value)}
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRegenerateDialog(false)
                setRegenerateFeedback("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setShowRegenerateDialog(false)
                const feedback = regenerateFeedback.trim() || undefined
                setRegenerateFeedback("")
                await handleGenerate(feedback)
              }}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Regenerate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
