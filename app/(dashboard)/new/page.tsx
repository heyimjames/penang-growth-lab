"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StepOne } from "@/components/new-case/step-one"
import { StepTwo } from "@/components/new-case/step-two"
import { StepThree } from "@/components/new-case/step-three"
import { StepFour } from "@/components/new-case/step-four"
import { Icon } from "@/lib/icons"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Loading03Icon,
  FloppyDiskIcon,
  Building06Icon,
  MessageEdit01Icon,
  AiSearchIcon,
  CheckmarkBadge02Icon,
  CheckmarkCircle02Icon,
  CheckmarkCircle01Icon
} from "@hugeicons-pro/core-stroke-rounded"
import { CheckmarkCircle02Icon as CheckmarkCircle02SolidIcon } from "@hugeicons-pro/core-solid-rounded"
import { cn } from "@/lib/utils"
import { createCase, updateCase, getCase } from "@/lib/actions/cases"
import { getUserCredits } from "@/lib/actions/credits"
import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react"
import { NoCreditsModal } from "@/components/no-credits-modal"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

export interface CaseFormData {
  // Step 1: What Happened
  complaint: string
  voiceTranscript?: string
  evidence: File[]

  // Step 2: Details
  companyName: string
  incidentDate: Date | undefined
  purchaseAmount: string
  currency: string
  desiredOutcome: string
  desiredOutcomes?: string[]
  customOutcome?: string

  // Jurisdiction & Payment (for international cases)
  incidentCountry: string
  userCountry: string
  paymentMethod: string
  cardType?: string
  bookingPlatform?: string

  // Research data (populated automatically)
  companyResearch?: {
    company: { name: string; domain: string; description: string | null }
    complaints: { title: string; url: string; summary: string }[]
    contacts: {
      emails: string[]
      executiveEmails?: string[]
      customerServiceEmails?: string[]
      executiveContacts?: {
        name: string
        title: string
        email?: string
        linkedIn?: string
      }[]
      sources?: { url: string; title: string }[]
    } | null
    profile?: {
      description?: string
      industry?: string
      ratings?: {
        trustpilot?: { score: number; reviewCount: number; url: string; fetchedAt: string }
        google?: { score: number; reviewCount: number; url: string; fetchedAt: string }
        tripadvisor?: { score: number; reviewCount: number; url: string; fetchedAt: string }
      }
      socialLinks?: {
        twitter?: string
        facebook?: string
        instagram?: string
        linkedin?: string
        youtube?: string
        tiktok?: string
      }
    }
    mock: boolean
  }

  // Evidence analysis (populated automatically)
  evidenceAnalysis?: {
    analyses: {
      fileName: string
      type: string
      description: string
      relevantDetails: string[]
      extractedText?: string
      suggestedUse: string
      strength: string
    }[]
    summary: string
    evidenceStrength: string
  }
}

export interface AnalysisResult {
  confidenceScore: number
  issues: string[]
  legalBasis: {
    law: string
    section: string
    summary: string
    strength?: string
  }[]
  companyIntelligence?: {
    complaintPatterns: string[]
    riskLevel: string
    notes: string
  }
  recommendedAction?: string
  estimatedCompensation?: {
    min: number
    max: number
    basis: string
  }
  reasoning?: string
  evidenceAnalysis?: {
    analyses: {
      fileName: string
      type: string
      description: string
      relevantDetails: string[]
      suggestedUse: string
      strength: string
    }[]
    summary: string
    evidenceStrength: string
  }
}

const steps = [
  { title: "Details", shortTitle: "Details", description: "Company & incident", icon: Building06Icon },
  { title: "Story", shortTitle: "Story", description: "What happened", icon: MessageEdit01Icon },
  { title: "Analysis", shortTitle: "Analysis", description: "AI review", icon: AiSearchIcon },
  { title: "Summary", shortTitle: "Summary", description: "Your case", icon: CheckmarkBadge02Icon },
]

export default function NewCasePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const draftId = searchParams.get("draft")

  const [currentStep, setCurrentStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingDraft, setIsLoadingDraft] = useState(!!draftId)
  const [savedCaseId, setSavedCaseId] = useState<string | null>(draftId)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "unsaved">("idle")
  const lastSavedFormRef = useRef<string | null>(null)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [isCheckingCredits, setIsCheckingCredits] = useState(true)
  // Check for prefill params from onboarding
  const prefillCompany = searchParams.get("company")
  const prefillComplaint = searchParams.get("complaint")
  const prefillAmount = searchParams.get("amount")
  const prefillCurrency = searchParams.get("currency")
  const prefillOutcome = searchParams.get("outcome")

  const [formData, setFormData] = useState<CaseFormData>({
    complaint: prefillComplaint || "",
    evidence: [],
    companyName: prefillCompany || "",
    incidentDate: undefined,
    purchaseAmount: prefillAmount || "",
    currency: prefillCurrency || "GBP",
    desiredOutcome: prefillOutcome || "",
    incidentCountry: "",
    userCountry: "GB",
    paymentMethod: "",
    cardType: "",
    bookingPlatform: "",
  })

  // Check credits on mount (skip if editing existing draft)
  useEffect(() => {
    async function checkCredits() {
      // If editing an existing draft, skip credit check
      if (draftId) {
        setIsCheckingCredits(false)
        return
      }

      try {
        const credits = await getUserCredits()
        setUserCredits(credits?.credits ?? 0)

        // Track case creation started (only for new cases with credits)
        if (credits?.credits && credits.credits > 0) {
          trackEvent(AnalyticsEvents.CASE.CREATION_STARTED, {
            has_credits: true,
            credits_available: credits.credits,
          })
        }
      } catch (error) {
        console.error("Error checking credits:", error)
        setUserCredits(0)
      } finally {
        setIsCheckingCredits(false)
      }
    }

    checkCredits()
  }, [draftId])

  // Load draft data if draftId is present
  useEffect(() => {
    async function loadDraft() {
      if (!draftId) return
      
      setIsLoadingDraft(true)
      try {
        const draftCase = await getCase(draftId)
        if (draftCase) {
          // Reconstruct companyResearch from saved data to prevent re-researching
          let companyResearch: CaseFormData["companyResearch"] = null
          if (draftCase.company_domain || draftCase.company_intel) {
            companyResearch = {
              company: {
                name: draftCase.company_name,
                domain: draftCase.company_domain || "",
                description: draftCase.company_intel?.responseRate || null,
              },
              // Restore similar complaints from saved data
              complaints: draftCase.company_intel?.similarComplaints || [],
              contacts: draftCase.company_intel?.contactEmails
                ? {
                    emails: draftCase.company_intel.contactEmails,
                    customerServiceEmails: draftCase.company_intel.customerServiceEmail
                      ? [draftCase.company_intel.customerServiceEmail]
                      : undefined,
                    executiveEmails: draftCase.company_intel.executiveContacts
                      ?.map((c) => c.email)
                      .filter((e): e is string => !!e),
                    executiveContacts: draftCase.company_intel.executiveContacts,
                    sources: [],
                  }
                : null,
              mock: false,
            }
          }

          setFormData({
            complaint: draftCase.complaint_text === "Draft - no description yet" ? "" : draftCase.complaint_text,
            evidence: [],
            companyName: draftCase.company_name,
            incidentDate: draftCase.purchase_date ? new Date(draftCase.purchase_date) : undefined,
            purchaseAmount: draftCase.purchase_amount?.toString() || "",
            currency: draftCase.currency || "GBP",
            desiredOutcome: draftCase.desired_outcome || "",
            desiredOutcomes: draftCase.desired_outcomes || undefined,
            companyResearch,
            // Restore additional case details
            incidentCountry: draftCase.incident_country || "",
            userCountry: draftCase.user_country || "GB",
            paymentMethod: draftCase.payment_method || "",
            cardType: draftCase.card_type || "",
            bookingPlatform: draftCase.booking_platform || "",
          })
          setSavedCaseId(draftCase.id)

          // Restore analysis results if case has been analyzed
          if (draftCase.confidence_score !== null || (draftCase.identified_issues && draftCase.identified_issues.length > 0)) {
            const restoredAnalysis: AnalysisResult = {
              confidenceScore: draftCase.confidence_score || 0,
              issues: draftCase.identified_issues || [],
              legalBasis: draftCase.legal_basis?.map(lb => ({
                law: lb.law,
                section: lb.section || "",
                summary: lb.summary || lb.description || "",
                strength: lb.strength || lb.relevance || "moderate",
              })) || [],
              companyIntelligence: draftCase.company_intel ? {
                complaintPatterns: draftCase.company_intel.complaintPatterns || [],
                riskLevel: draftCase.company_intel.riskLevel || "unknown",
                notes: draftCase.company_intel.notes || "",
              } : undefined,
              recommendedAction: draftCase.company_intel?.recommendedAction,
              estimatedCompensation: draftCase.company_intel?.estimatedCompensation,
            }
            setAnalysisResult(restoredAnalysis)
            
            // If analysis exists, go to summary step (step 3)
            setCurrentStep(3)
            toast.success("Draft loaded with analysis! Review your case summary.")
          } else {
            toast.success("Draft loaded! Continue where you left off.")
          }
        } else {
          toast.error("Could not load draft")
          router.push("/new")
        }
      } catch (error) {
        console.error("Error loading draft:", error)
        toast.error("Failed to load draft")
      } finally {
        setIsLoadingDraft(false)
      }
    }
    
    loadDraft()
  }, [draftId, router])

  const updateFormData = useCallback((updates: Partial<CaseFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  // Track unsaved changes
  useEffect(() => {
    // Only track changes if we have a saved draft
    if (!savedCaseId && saveStatus === "idle") return
    
    // Create a simplified version of form data for comparison (exclude non-saveable fields)
    const currentFormString = JSON.stringify({
      companyName: formData.companyName,
      complaint: formData.complaint,
      incidentDate: formData.incidentDate?.toISOString(),
      purchaseAmount: formData.purchaseAmount,
      currency: formData.currency,
      desiredOutcome: formData.desiredOutcome,
      desiredOutcomes: formData.desiredOutcomes,
    })
    
    // If this is different from last saved, mark as unsaved
    if (lastSavedFormRef.current && currentFormString !== lastSavedFormRef.current) {
      if (saveStatus === "saved") {
        setSaveStatus("unsaved")
      }
    }
  }, [formData, savedCaseId, saveStatus])

  const handleNext = async () => {
    // Track step completion
    trackEvent(AnalyticsEvents.CASE.STEP_COMPLETED, {
      step: currentStep,
      step_name: steps[currentStep].title,
      company_name: formData.companyName || undefined,
      has_evidence: formData.evidence.length > 0,
    })

    if (currentStep === 1) {
      setCurrentStep(2)
      setIsAnalyzing(true)

      trackEvent("case_analysis_started", {
        company_name: formData.companyName,
        complaint_length: formData.complaint.length,
        evidence_count: formData.evidence.length,
      })

      toast.loading("Analyzing your case...", { id: "analyzing" })

      // Extract contact emails and profile from company research if available
      const companyIntel = formData.companyResearch
        ? {
            responseRate: formData.companyResearch.company.description || "Unknown",
            avgResolutionTime: "Unknown",
            complaintsProfile: "Unknown",
            tips: [],
            customerServiceEmail: formData.companyResearch.contacts?.emails?.[0] || undefined,
            contactEmails: formData.companyResearch.contacts?.emails || [],
            executiveContacts: formData.companyResearch.contacts?.executiveContacts || undefined,
            // Include profile data (ratings, social links)
            companyProfile: formData.companyResearch.profile?.description ? {
              description: formData.companyResearch.profile.description,
              industry: formData.companyResearch.profile.industry,
            } : undefined,
            ratings: formData.companyResearch.profile?.ratings || undefined,
            socialLinks: formData.companyResearch.profile?.socialLinks || undefined,
          }
        : null

      let caseId = savedCaseId
      
      // If continuing from a draft, update it. Otherwise create new case.
      if (savedCaseId) {
        // Update existing draft
        const updatedCase = await updateCase(savedCaseId, {
          company_name: formData.companyName,
          complaint_text: formData.complaint,
          company_domain: formData.companyResearch?.company.domain || null,
          purchase_date: formData.incidentDate?.toISOString().split("T")[0] || null,
          purchase_amount: formData.purchaseAmount ? Number.parseFloat(formData.purchaseAmount) : null,
          currency: formData.currency,
          desired_outcome:
            formData.desiredOutcome === "other"
              ? formData.customOutcome || formData.desiredOutcome
              : formData.desiredOutcome,
          desired_outcomes: formData.desiredOutcomes || null,
          company_intel: companyIntel,
          status: "analyzing",
          // Additional case details
          incident_country: formData.incidentCountry || null,
          user_country: formData.userCountry || null,
          payment_method: formData.paymentMethod || null,
          card_type: formData.cardType || null,
          booking_platform: formData.bookingPlatform || null,
        })
        
        if (!updatedCase) {
          toast.error("Failed to update case. Please ensure you're signed in.", { id: "analyzing" })
          setIsAnalyzing(false)
          setCurrentStep(1)
          return
        }
      } else {
        // Create new case
        const newCase = await createCase({
          company_name: formData.companyName,
          complaint_text: formData.complaint,
          company_domain: formData.companyResearch?.company.domain || null,
          title: null,
          purchase_date: formData.incidentDate?.toISOString().split("T")[0] || null,
          purchase_amount: formData.purchaseAmount ? Number.parseFloat(formData.purchaseAmount) : null,
          currency: formData.currency,
          desired_outcome:
            formData.desiredOutcome === "other"
              ? formData.customOutcome || formData.desiredOutcome
              : formData.desiredOutcome,
          desired_outcomes: formData.desiredOutcomes || null,
          confidence_score: null,
          identified_issues: null,
          legal_basis: null,
          company_intel: companyIntel,
          generated_letter: null,
          letter_tone: "assertive",
          status: "analyzing",
          // Additional case details
          incident_country: formData.incidentCountry || null,
          user_country: formData.userCountry || null,
          payment_method: formData.paymentMethod || null,
          card_type: formData.cardType || null,
          booking_platform: formData.bookingPlatform || null,
        })

        if (newCase) {
          caseId = newCase.id
          setSavedCaseId(newCase.id)
        } else {
          toast.error("Failed to save case. Please ensure you're signed in and try again.", { id: "analyzing" })
          console.error("Case creation failed - user may not be authenticated or database error occurred")
          setIsAnalyzing(false)
          setCurrentStep(1)
          return
        }
      }

      try {
        // Convert evidence files to base64 for analysis
        const evidenceFiles = await Promise.all(
          formData.evidence.map(async (file) => {
            const buffer = await file.arrayBuffer()
            // Convert ArrayBuffer to base64 (browser-compatible)
            const bytes = new Uint8Array(buffer)
            let binary = ""
            for (let i = 0; i < bytes.length; i++) {
              binary += String.fromCharCode(bytes[i])
            }
            const base64 = btoa(binary)
            return {
              name: file.name,
              type: file.type,
              base64,
            }
          })
        )

        // Run all analyses in parallel
        const apiCalls: Promise<Response>[] = [
          // Perplexity legal research with jurisdiction data
          fetch("/api/research/legal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              complaint: formData.complaint,
              companyName: formData.companyName,
              category: formData.desiredOutcome,
              incidentCountry: formData.incidentCountry,
              userCountry: formData.userCountry,
              paymentMethod: formData.paymentMethod,
              cardType: formData.cardType,
              bookingPlatform: formData.bookingPlatform,
            }),
          }),
          // Main AI analysis with company research context
          fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              complaint: formData.complaint,
              companyName: formData.companyName,
              purchaseAmount: formData.purchaseAmount,
              currency: formData.currency,
              desiredOutcome: formData.desiredOutcome === "other" ? formData.customOutcome : formData.desiredOutcome,
              companyResearch: formData.companyResearch,
            }),
          }),
        ]

        // Add evidence analysis if there are files
        if (evidenceFiles.length > 0) {
          apiCalls.push(
            fetch("/api/analyze/evidence", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                files: evidenceFiles,
                complaint: formData.complaint,
                companyName: formData.companyName,
              }),
            })
          )
        }

        const responses = await Promise.all(apiCalls)
        const legalResearch = await responses[0].json()
        const analysis = await responses[1].json()
        const evidenceAnalysis = evidenceFiles.length > 0 ? await responses[2].json() : null

        // Merge legal research into analysis result
        const mergedLegalBasis = [
          ...(analysis.legalBasis || []),
          ...(legalResearch.laws || [])
            .filter((law: { name: string }) => !analysis.legalBasis?.some((a: { law: string }) => a.law === law.name))
            .map((law: { name: string; section: string; summary: string; relevance: string }) => ({
              law: law.name,
              section: law.section,
              summary: law.summary,
              strength: law.relevance === "high" ? "strong" : law.relevance === "medium" ? "moderate" : "supportive",
            })),
        ]

        setAnalysisResult({
          confidenceScore: analysis.confidenceScore || 75,
          issues: analysis.issues || [],
          legalBasis: mergedLegalBasis,
          companyIntelligence: analysis.companyIntelligence,
          recommendedAction: analysis.recommendedAction,
          estimatedCompensation: analysis.estimatedCompensation,
          reasoning: analysis.reasoning,
          evidenceAnalysis: evidenceAnalysis || undefined,
        })

        if (caseId) {
          // Preserve/update company intel with contact emails
          const updatedCompanyIntel = formData.companyResearch?.contacts?.emails && formData.companyResearch.contacts.emails.length > 0
            ? {
                responseRate: formData.companyResearch.company.description || "Unknown",
                avgResolutionTime: "Unknown",
                complaintsProfile: "Unknown",
                tips: [],
                customerServiceEmail: formData.companyResearch.contacts.emails[0] || undefined,
                contactEmails: formData.companyResearch.contacts.emails || [],
                executiveContacts: formData.companyResearch.contacts.executiveContacts || undefined,
              }
            : undefined

          await updateCase(caseId, {
            confidence_score: analysis.confidenceScore,
            identified_issues: analysis.issues,
            legal_basis: mergedLegalBasis,
            company_intel: updatedCompanyIntel,
            status: "analyzed",
          })
        }

        trackEvent("case_analysis_completed", {
          case_id: caseId,
          confidence_score: analysis.confidenceScore,
          issues_count: analysis.issues?.length || 0,
          legal_basis_count: mergedLegalBasis.length,
          has_evidence_analysis: !!evidenceAnalysis,
        })

        toast.success("Analysis complete!", { id: "analyzing" })
      } catch (error) {
        console.error("Analysis error:", error)
        setAnalysisResult({
          confidenceScore: 75,
          issues: ["Potential breach of contract", "Service not as described"],
          legalBasis: [
            {
              law: "Consumer Rights Act 2015",
              section: "Section 49",
              summary: "Services must be performed with reasonable care and skill.",
            },
          ],
        })
        trackEvent("case_analysis_completed", {
          case_id: caseId,
          confidence_score: 75,
          fallback: true,
        })
        toast.success("Analysis complete!", { id: "analyzing" })
      }

      setIsAnalyzing(false)
      setCurrentStep(3)
    } else if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleViewCase = () => {
    // Track case creation completed
    trackEvent(AnalyticsEvents.CASE.CREATION_COMPLETED, {
      case_id: savedCaseId,
      company_name: formData.companyName,
      has_evidence: formData.evidence.length > 0,
      evidence_count: formData.evidence.length,
      complaint_length: formData.complaint.length,
      confidence_score: analysisResult?.confidenceScore,
    })

    if (savedCaseId) {
      router.push(`/cases/${savedCaseId}`)
    } else {
      router.push("/cases")
    }
  }

  const handleSaveDraft = async () => {
    // Need at least a company name to save a draft
    if (!formData.companyName.trim()) {
      toast.error("Please enter a company name before saving")
      return
    }

    setIsSaving(true)
    setSaveStatus("saving")

    try {
      // Build company intel from research if available, including analysis data
      const companyIntel = {
        responseRate: formData.companyResearch?.company.description || "Unknown",
        avgResolutionTime: "Unknown",
        complaintsProfile: "Unknown",
        tips: [],
        customerServiceEmail: formData.companyResearch?.contacts?.emails?.[0] || undefined,
        contactEmails: formData.companyResearch?.contacts?.emails || [],
        executiveContacts: formData.companyResearch?.contacts?.executiveContacts || undefined,
        // Save similar complaints from research
        similarComplaints: formData.companyResearch?.complaints || [],
        // Save analysis intelligence data
        complaintPatterns: analysisResult?.companyIntelligence?.complaintPatterns || undefined,
        riskLevel: analysisResult?.companyIntelligence?.riskLevel || undefined,
        notes: analysisResult?.companyIntelligence?.notes || undefined,
        recommendedAction: analysisResult?.recommendedAction || undefined,
        estimatedCompensation: analysisResult?.estimatedCompensation || undefined,
        // Include profile data (ratings, social links)
        companyProfile: formData.companyResearch?.profile?.description ? {
          description: formData.companyResearch.profile.description,
          industry: formData.companyResearch.profile.industry,
        } : undefined,
        ratings: formData.companyResearch?.profile?.ratings || undefined,
        socialLinks: formData.companyResearch?.profile?.socialLinks || undefined,
      }

      // Convert legal basis to database format
      const legalBasisForDb = analysisResult?.legalBasis?.map(lb => ({
        law: lb.law,
        section: lb.section,
        summary: lb.summary,
        strength: lb.strength,
      })) || null

      // Determine status based on whether analysis has been done
      const draftStatus = analysisResult ? "analyzed" : "draft"

      let success = false
      
      if (savedCaseId) {
        // Update existing draft
        const updatedDraft = await updateCase(savedCaseId, {
          company_name: formData.companyName,
          complaint_text: formData.complaint || "Draft - no description yet",
          company_domain: formData.companyResearch?.company.domain || null,
          purchase_date: formData.incidentDate?.toISOString().split("T")[0] || null,
          purchase_amount: formData.purchaseAmount ? Number.parseFloat(formData.purchaseAmount) : null,
          currency: formData.currency,
          desired_outcome:
            formData.desiredOutcome === "other"
              ? formData.customOutcome || formData.desiredOutcome
              : formData.desiredOutcome || null,
          desired_outcomes: formData.desiredOutcomes || null,
          company_intel: companyIntel,
          // Save analysis results if available
          confidence_score: analysisResult?.confidenceScore || null,
          identified_issues: analysisResult?.issues || null,
          legal_basis: legalBasisForDb,
          status: draftStatus,
          // Save additional case details
          incident_country: formData.incidentCountry || null,
          user_country: formData.userCountry || null,
          payment_method: formData.paymentMethod || null,
          card_type: formData.cardType || null,
          booking_platform: formData.bookingPlatform || null,
        })
        success = !!updatedDraft
      } else {
        // Create new draft
        const draftCase = await createCase({
          company_name: formData.companyName,
          complaint_text: formData.complaint || "Draft - no description yet",
          company_domain: formData.companyResearch?.company.domain || null,
          title: null,
          purchase_date: formData.incidentDate?.toISOString().split("T")[0] || null,
          purchase_amount: formData.purchaseAmount ? Number.parseFloat(formData.purchaseAmount) : null,
          currency: formData.currency,
          desired_outcome:
            formData.desiredOutcome === "other"
              ? formData.customOutcome || formData.desiredOutcome
              : formData.desiredOutcome || null,
          desired_outcomes: formData.desiredOutcomes || null,
          confidence_score: analysisResult?.confidenceScore || null,
          identified_issues: analysisResult?.issues || null,
          legal_basis: legalBasisForDb,
          company_intel: companyIntel,
          generated_letter: null,
          letter_tone: "assertive",
          status: draftStatus,
          // Save additional case details
          incident_country: formData.incidentCountry || null,
          user_country: formData.userCountry || null,
          payment_method: formData.paymentMethod || null,
          card_type: formData.cardType || null,
          booking_platform: formData.bookingPlatform || null,
        })
        
        if (draftCase) {
          setSavedCaseId(draftCase.id)
          // Update URL to include draft ID so breadcrumbs and sidebar can reflect the case
          router.replace(`/new?draft=${draftCase.id}`, { scroll: false })
          success = true
        }
      }

      if (success) {
        // Update the last saved form reference
        lastSavedFormRef.current = JSON.stringify({
          companyName: formData.companyName,
          complaint: formData.complaint,
          incidentDate: formData.incidentDate?.toISOString(),
          purchaseAmount: formData.purchaseAmount,
          currency: formData.currency,
          desiredOutcome: formData.desiredOutcome,
          desiredOutcomes: formData.desiredOutcomes,
        })

        // Track draft saved
        trackEvent("case_draft_saved", {
          case_id: savedCaseId,
          step: currentStep,
          company_name: formData.companyName,
          has_analysis: !!analysisResult,
        })

        setSaveStatus("saved")
        toast.success("Draft saved!", {
          id: "saving-draft",
          description: "Continue editing or come back later from your dashboard."
        })
        
        // Reset to idle after 3 seconds so user can save again
        setTimeout(() => {
          setSaveStatus((prev) => prev === "saved" ? "idle" : prev)
        }, 3000)
      } else {
        setSaveStatus("idle")
        toast.error("Failed to save draft. Please ensure you're signed in.", { id: "saving-draft" })
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      setSaveStatus("idle")
      toast.error("Failed to save draft", { id: "saving-draft" })
    } finally {
      setIsSaving(false)
    }
  }

  const canSaveDraft = () => {
    return formData.companyName.trim().length > 0 && !isSaving && !isAnalyzing
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        // Step 0 is now company info
        const hasOutcome = (formData.desiredOutcomes && formData.desiredOutcomes.length > 0) || formData.desiredOutcome.length > 0
        return (
          formData.companyName.trim().length > 0 &&
          formData.purchaseAmount.trim().length > 0 &&
          hasOutcome
        )
      case 1:
        // Step 1 is now the complaint (minimum 50 characters for quality)
        return formData.complaint.trim().length >= 50
      case 2:
        return !isAnalyzing
      case 3:
        return true
      default:
        return false
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  // Show loading state when checking credits or loading draft
  if (isCheckingCredits || isLoadingDraft) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="text-center">
          <Icon icon={Loading03Icon} size={32} className="animate-spin text-peach-400 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {isLoadingDraft ? "Loading your draft..." : "Checking your account..."}
          </p>
        </div>
      </div>
    )
  }

  // Show no credits modal if user has no credits and isn't editing a draft
  if (userCredits === 0 && !draftId) {
    return <NoCreditsModal />
  }

  return (
    <div className="min-h-full flex flex-col">
      {/* Mobile: Minimal header with progress */}
      <div className="sm:hidden px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
          <Link 
            href="/legal/disclaimer" 
            className="text-[10px] text-muted-foreground hover:text-foreground underline"
          >
            Disclaimer
          </Link>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Desktop: Full header */}
      <div className="hidden sm:block p-6 lg:p-8 pb-0 max-w-3xl mx-auto w-full">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {formData.companyName && (draftId || savedCaseId) 
                ? `vs. ${formData.companyName}` 
                : draftId 
                  ? "Continue Case" 
                  : "New Complaint"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {formData.companyName && (draftId || savedCaseId)
                ? "Continue editing your case"
                : draftId 
                  ? "Pick up where you left off." 
                  : "Tell us what happened and we'll help you fight back."}
            </p>
          </div>
          <Link 
            href="/legal/disclaimer" 
            className="text-xs text-muted-foreground hover:text-foreground underline shrink-0"
          >
            Legal disclaimer
          </Link>
        </div>
        {/* Step Progress Indicator */}
        <div className="mb-2">
          {/* Step indicators - evenly spaced without connector lines */}
          <div className="flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep
                const isActive = index === currentStep
                const StepIcon = step.icon
                
                return (
                  <motion.div
                    key={step.title}
                    className="flex flex-col items-center"
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : 0.95,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <motion.div
                      className={cn(
                        "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 bg-background",
                        isCompleted && "!bg-peach-500 border-peach-500",
                        isActive && "bg-peach-500/10 border-peach-500",
                        !isCompleted && !isActive && "bg-muted/50 border-border"
                      )}
                      initial={false}
                      animate={{
                        boxShadow: isActive 
                          ? "0 0 0 4px rgba(236, 132, 105, 0.15)" 
                          : "0 0 0 0px rgba(236, 132, 105, 0)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <AnimatePresence mode="wait">
                        {isCompleted ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          >
                            <Icon 
                              icon={CheckmarkCircle01Icon} 
                              size={20} 
                              strokeWidth={2.5}
                              className="text-white" 
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Icon 
                              icon={StepIcon} 
                              size={18} 
                              className={cn(
                                isActive ? "text-peach-500" : "text-muted-foreground"
                              )} 
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    
                    {/* Step label - hidden on mobile, shown on sm+ */}
                    <motion.div
                      className="hidden sm:flex flex-col items-center mt-2"
                      initial={false}
                      animate={{ opacity: isActive || isCompleted ? 1 : 0.6 }}
                    >
                      <span className={cn(
                        "text-sm font-medium",
                        isActive && "text-peach-500",
                        isCompleted && "text-foreground",
                        !isActive && !isCompleted && "text-muted-foreground"
                      )}>
                        {step.shortTitle}
                      </span>
                      <span className="text-xs text-muted-foreground hidden lg:block">
                        {step.description}
                      </span>
                    </motion.div>
                  </motion.div>
                )
              })}
          </div>
          
          {/* Mobile step label */}
          <motion.div 
            className="sm:hidden text-center mt-3"
            key={currentStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-sm font-medium text-peach-500">
              {steps[currentStep].title}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              {steps[currentStep].description}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 sm:max-w-3xl sm:mx-auto sm:w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {currentStep === 0 && <StepTwo formData={formData} updateFormData={updateFormData} />}
            {currentStep === 1 && <StepOne formData={formData} updateFormData={updateFormData} />}
            {currentStep === 2 && <StepThree isAnalyzing={isAnalyzing} />}
            {currentStep === 3 && <StepFour formData={formData} analysisResult={analysisResult} caseId={savedCaseId} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed bottom navigation - respects sidebar on large screens */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border safe-area-bottom">
        <div className="p-3 sm:p-4 max-w-3xl mx-auto">
          <div className="flex gap-2 sm:gap-3 justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 0 || currentStep === 2}
            >
              <Icon icon={ArrowLeft01Icon} size={16} className="sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            {/* Save Draft button - only on steps 0 and 1 */}
            {currentStep < 2 && (
              <Button
                variant={saveStatus === "saved" ? "outline" : saveStatus === "unsaved" ? "outline" : "outline"}
                size="sm"
                onClick={handleSaveDraft}
                disabled={!canSaveDraft() || saveStatus === "saving"}
                className={cn(
                  "transition-all duration-200",
                  saveStatus === "saved" && "border-green-500/50 text-green-600 dark:text-green-400",
                  saveStatus === "unsaved" && "border-amber-500/50"
                )}
              >
                <AnimatePresence mode="wait">
                  {saveStatus === "saving" ? (
                    <motion.div
                      key="saving"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center"
                    >
                      <Icon icon={Loading03Icon} size={16} className="sm:mr-2 animate-spin" />
                      <span className="hidden sm:inline">Saving...</span>
                    </motion.div>
                  ) : saveStatus === "saved" ? (
                    <motion.div
                      key="saved"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center"
                    >
                      <Icon icon={CheckmarkCircle02SolidIcon} size={16} className="sm:mr-2 text-green-500" />
                      <span className="hidden sm:inline">Saved</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center"
                    >
                      <Icon icon={FloppyDiskIcon} size={16} className="sm:mr-2" />
                      <span className="hidden sm:inline">
                        {saveStatus === "unsaved" ? "Save Changes" : "Save Draft"}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                size="sm"
                onClick={handleNext}
                disabled={!canProceed()}
                variant="coral"
                className="flex-1 sm:flex-none"
              >
                {currentStep === 1 ? (
                  <span className="flex items-center justify-center">
                    Analyze
                    <Icon icon={Loading03Icon} size={16} className={cn("ml-2", isAnalyzing ? "animate-spin" : "hidden")} />
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Continue
                    <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
                  </span>
                )}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleViewCase}
                variant="coral"
                className="flex-1 sm:flex-none"
              >
                View My Case
                <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div className="h-20 sm:h-16" />
    </div>
  )
}
