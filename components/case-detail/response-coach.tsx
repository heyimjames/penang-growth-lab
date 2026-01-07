"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import {
  LightBulb01Icon,
  AlertCircleIcon,
  Target01Icon,
  ArrowRight01Icon,
  SparkleIcon,
  ShieldCheckIcon,
  Cancel01Icon,
  MoneyBag01Icon,
  Clock01Icon,
  Loading01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { motion, AnimatePresence } from "motion/react"
import { Case } from "@/lib/types"
import { toast } from "sonner"

interface ResponseCoachProps {
  caseData: Case
  onGenerateCounter?: (points: string[]) => void
}

type TacticType =
  | "deflection"
  | "lowball_offer"
  | "delay_tactic"
  | "blame_shifting"
  | "policy_excuse"
  | "request_more_info"
  | "goodwill_gesture"
  | "partial_admission"
  | "full_rejection"
  | "legal_threat"
  | "escalation_needed"

interface Tactic {
  type: TacticType
  description: string
  quote?: string
}

interface OfferAnalysis {
  hasOffer: boolean
  offerAmount?: number
  offerType?: string
  fairnessAssessment?: "fair" | "lowball" | "inadequate" | "generous"
  expectedAmount?: number
  expectedBasis?: string
}

interface StrengthWeaknesses {
  theirWeakPoints: string[]
  theirStrongPoints: string[]
  yourOpportunities: string[]
}

interface AnalysisResult {
  tactics: Tactic[]
  offerAnalysis?: OfferAnalysis
  strengthWeaknesses: StrengthWeaknesses
  recommendedApproach: string
  recommendedActions: string[]
  urgencyLevel: "low" | "medium" | "high"
  deadlineWarning?: string
  draftResponsePoints: string[]
}

const tacticLabels: Record<TacticType, { label: string; color: string; icon: typeof AlertCircleIcon }> = {
  deflection: { label: "Deflection", color: "bg-amber-100 text-amber-700", icon: Cancel01Icon },
  lowball_offer: { label: "Lowball Offer", color: "bg-red-100 text-red-700", icon: MoneyBag01Icon },
  delay_tactic: { label: "Delay Tactic", color: "bg-orange-100 text-orange-700", icon: Clock01Icon },
  blame_shifting: { label: "Blame Shifting", color: "bg-purple-100 text-purple-700", icon: AlertCircleIcon },
  policy_excuse: { label: "Policy Excuse", color: "bg-stone-100 text-stone-700", icon: AlertCircleIcon },
  request_more_info: { label: "Info Request", color: "bg-blue-100 text-blue-700", icon: AlertCircleIcon },
  goodwill_gesture: { label: "Goodwill Gesture", color: "bg-teal-100 text-teal-700", icon: SparkleIcon },
  partial_admission: { label: "Partial Admission", color: "bg-forest-100 text-forest-700", icon: ShieldCheckIcon },
  full_rejection: { label: "Full Rejection", color: "bg-red-100 text-red-700", icon: Cancel01Icon },
  legal_threat: { label: "Legal Threat", color: "bg-red-100 text-red-700", icon: AlertCircleIcon },
  escalation_needed: { label: "Escalation Needed", color: "bg-peach-100 text-peach-700", icon: ArrowRight01Icon },
}

const approachLabels: Record<string, { label: string; description: string }> = {
  accept_offer: { label: "Accept Offer", description: "The offer is fair - consider accepting" },
  negotiate_higher: { label: "Negotiate Higher", description: "Push back for a better settlement" },
  reject_firmly: { label: "Reject Firmly", description: "Their position is untenable - stand firm" },
  escalate_supervisor: { label: "Escalate to Supervisor", description: "Request supervisor review" },
  escalate_executive: { label: "Executive Escalation", description: "Contact executive team directly" },
  escalate_ombudsman: { label: "Ombudsman Complaint", description: "Formal escalation to relevant ombudsman" },
  threaten_legal: { label: "Legal Action Warning", description: "Issue formal notice of legal intent" },
  social_media: { label: "Social Media Pressure", description: "Public pressure via social channels" },
  request_clarification: { label: "Seek Clarification", description: "Ask for specific details first" },
}

export function ResponseCoach({ caseData, onGenerateCounter }: ResponseCoachProps) {
  const [companyResponse, setCompanyResponse] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

  const handleAnalyze = async () => {
    if (!companyResponse.trim()) {
      toast.error("Please paste the company's response first")
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyResponse,
          caseContext: {
            companyName: caseData.company_name,
            complaintText: caseData.complaint_text,
            purchaseAmount: caseData.purchase_amount,
            legalBasis: caseData.legal_basis,
            identifiedIssues: caseData.identified_issues,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const result = await response.json()
      setAnalysis(result)
    } catch {
      toast.error("Failed to analyze response. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateCounter = () => {
    if (analysis?.draftResponsePoints && onGenerateCounter) {
      onGenerateCounter(analysis.draftResponsePoints)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="rounded-xl border border-peach-200 bg-gradient-to-br from-peach-50/50 to-white p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-peach-100 flex items-center justify-center">
            <Icon icon={LightBulb01Icon} size={20} className="text-peach-600" />
          </div>
          <div>
            <h3 className="font-semibold">Response Coach</h3>
            <p className="text-sm text-muted-foreground">
              Paste {caseData.company_name}&apos;s response for strategic analysis
            </p>
          </div>
        </div>

        <Textarea
          value={companyResponse}
          onChange={(e) => setCompanyResponse(e.target.value)}
          placeholder={`Paste ${caseData.company_name}'s email response here...`}
          className="min-h-[120px] mb-4"
        />

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !companyResponse.trim()}
          className="w-full"
          variant="coral"
        >
          {isAnalyzing ? (
            <>
              <Icon icon={Loading01Icon} size={16} className="mr-2 animate-spin" />
              Analyzing Response...
            </>
          ) : (
            <>
              <Icon icon={Target01Icon} size={16} className="mr-2" />
              Analyze Their Response
            </>
          )}
        </Button>
      </div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Urgency Banner */}
            {analysis.urgencyLevel === "high" && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 text-red-700">
                  <Icon icon={AlertCircleIcon} size={18} />
                  <span className="font-medium">High Priority Response Needed</span>
                </div>
                {analysis.deadlineWarning && (
                  <p className="text-sm text-red-600 mt-1">{analysis.deadlineWarning}</p>
                )}
              </div>
            )}

            {/* Tactics Identified */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon icon={Target01Icon} size={18} className="text-amber-500" />
                Tactics Identified
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis.tactics.map((tactic, i) => {
                  const tacticInfo = tacticLabels[tactic.type]
                  return (
                    <Badge key={i} className={tacticInfo.color}>
                      <Icon icon={tacticInfo.icon} size={12} className="mr-1" />
                      {tacticInfo.label}
                    </Badge>
                  )
                })}
              </div>
              <div className="space-y-2">
                {analysis.tactics.map((tactic, i) => (
                  <div key={i} className="text-sm p-3 rounded-lg bg-muted/50">
                    <p className="font-medium">{tacticLabels[tactic.type].label}</p>
                    <p className="text-muted-foreground mt-1">{tactic.description}</p>
                    {tactic.quote && (
                      <p className="text-xs italic text-stone-500 mt-2 border-l-2 border-stone-300 pl-2">
                        &quot;{tactic.quote}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Offer Analysis */}
            {analysis.offerAnalysis?.hasOffer && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon icon={MoneyBag01Icon} size={18} className="text-forest-500" />
                  Offer Analysis
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Their Offer</p>
                    <p className="text-2xl font-bold">
                      £{analysis.offerAnalysis.offerAmount || 0}
                    </p>
                    {analysis.offerAnalysis.offerType && (
                      <p className="text-xs text-muted-foreground">{analysis.offerAnalysis.offerType}</p>
                    )}
                  </div>
                  {analysis.offerAnalysis.expectedAmount && (
                    <div>
                      <p className="text-sm text-muted-foreground">You Should Get</p>
                      <p className="text-2xl font-bold text-forest-600">
                        £{analysis.offerAnalysis.expectedAmount}
                      </p>
                      {analysis.offerAnalysis.expectedBasis && (
                        <p className="text-xs text-muted-foreground">{analysis.offerAnalysis.expectedBasis}</p>
                      )}
                    </div>
                  )}
                </div>
                {analysis.offerAnalysis.fairnessAssessment && (
                  <div className="mt-3">
                    <Badge
                      className={
                        analysis.offerAnalysis.fairnessAssessment === "fair" ||
                        analysis.offerAnalysis.fairnessAssessment === "generous"
                          ? "bg-forest-100 text-forest-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {analysis.offerAnalysis.fairnessAssessment === "fair" && "✓ Fair Offer"}
                      {analysis.offerAnalysis.fairnessAssessment === "generous" && "✓ Generous Offer"}
                      {analysis.offerAnalysis.fairnessAssessment === "lowball" && "⚠ Lowball Offer"}
                      {analysis.offerAnalysis.fairnessAssessment === "inadequate" && "✗ Inadequate Offer"}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Strategic Analysis */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon icon={LightBulb01Icon} size={18} className="text-lavender-500" />
                Strategic Analysis
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Their Weak Points */}
                <div className="p-3 rounded-lg bg-forest-50 border border-forest-200">
                  <p className="font-medium text-forest-700 text-sm mb-2">Their Weak Points</p>
                  <ul className="space-y-1">
                    {analysis.strengthWeaknesses.theirWeakPoints.map((point, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-forest-500 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Your Opportunities */}
                <div className="p-3 rounded-lg bg-peach-50 border border-peach-200">
                  <p className="font-medium text-peach-700 text-sm mb-2">Your Opportunities</p>
                  <ul className="space-y-1">
                    {analysis.strengthWeaknesses.yourOpportunities.map((point, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-peach-500 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommended Approach */}
            <div className="rounded-xl border-2 border-peach-300 bg-gradient-to-br from-peach-50 to-white p-5">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon icon={ArrowRight01Icon} size={18} className="text-peach-600" />
                Recommended Approach
              </h4>
              <div className="mb-4">
                <Badge className="bg-peach-500 text-white text-sm px-3 py-1">
                  {approachLabels[analysis.recommendedApproach]?.label || analysis.recommendedApproach}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {approachLabels[analysis.recommendedApproach]?.description}
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-sm">Action Steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  {analysis.recommendedActions.map((action, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{action}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Generate Counter Response */}
            <div className="rounded-xl border border-forest-200 bg-gradient-to-br from-forest-50 to-white p-5">
              <h4 className="font-semibold mb-3">Key Points for Your Response</h4>
              <ul className="space-y-2 mb-4">
                {analysis.draftResponsePoints.map((point, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-forest-500 text-white text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleGenerateCounter}
                className="w-full bg-forest-500 hover:bg-forest-600 text-white"
              >
                <Icon icon={SparkleIcon} size={16} className="mr-2" />
                Generate Counter-Response
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
