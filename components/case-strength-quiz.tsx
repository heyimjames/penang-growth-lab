"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion, AnimatePresence } from "motion/react"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  AirplaneTakeOff01Icon,
  ShoppingBag01Icon,
  Building01Icon,
  Home01Icon,
  Idea01Icon,
  Wifi01Icon,
  TicketStarIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  AlertCircleIcon,
  ZapIcon,
} from "@hugeicons-pro/core-stroke-rounded"
import Link from "next/link"

type CompanyType =
  | "airline"
  | "retailer"
  | "bank"
  | "landlord"
  | "utility"
  | "telecom"
  | "subscription"
  | "other"

type IssueType =
  | "not_received"
  | "faulty"
  | "overcharged"
  | "cancelled"
  | "refused_refund"
  | "poor_service"
  | "contract_dispute"
  | "other"

type TimeFrame = "under_14_days" | "14_to_30_days" | "1_to_6_months" | "over_6_months"

interface QuizState {
  companyType: CompanyType | null
  issueType: IssueType | null
  timeFrame: TimeFrame | null
  amount: string
  alreadyComplained: boolean | null
}

interface QuizResult {
  strength: "strong" | "moderate" | "weak"
  score: number
  laws: {
    name: string
    description: string
    relevance: "high" | "medium"
  }[]
  recommendations: string[]
  timeWarning?: string
}

const companyTypes: { value: CompanyType; label: string; icon: typeof Building01Icon }[] = [
  { value: "airline", label: "Airline", icon: AirplaneTakeOff01Icon },
  { value: "retailer", label: "Retailer", icon: ShoppingBag01Icon },
  { value: "bank", label: "Bank/Finance", icon: Building01Icon },
  { value: "landlord", label: "Landlord", icon: Home01Icon },
  { value: "utility", label: "Utility", icon: Idea01Icon },
  { value: "telecom", label: "Telecom/Broadband", icon: Wifi01Icon },
  { value: "subscription", label: "Subscription Service", icon: TicketStarIcon },
  { value: "other", label: "Other", icon: Building01Icon },
]

const issueTypes: { value: IssueType; label: string; description: string }[] = [
  { value: "not_received", label: "Never Received", description: "Item or service was never delivered" },
  { value: "faulty", label: "Faulty/Defective", description: "Product doesn't work as expected" },
  { value: "overcharged", label: "Overcharged", description: "Charged more than agreed or unexpected fees" },
  { value: "cancelled", label: "Cancelled by Company", description: "Service/booking cancelled without consent" },
  { value: "refused_refund", label: "Refused Refund", description: "Company won't give money back" },
  { value: "poor_service", label: "Poor Service", description: "Service not as described or promised" },
  { value: "contract_dispute", label: "Contract Issue", description: "Disagreement over terms or cancellation" },
  { value: "other", label: "Other Issue", description: "Something else entirely" },
]

const timeFrames: { value: TimeFrame; label: string; days: string }[] = [
  { value: "under_14_days", label: "Less than 14 days", days: "Within cooling-off period" },
  { value: "14_to_30_days", label: "14-30 days", days: "Still within short-term rights" },
  { value: "1_to_6_months", label: "1-6 months", days: "Standard complaint window" },
  { value: "over_6_months", label: "Over 6 months", days: "May need escalation" },
]

function analyzeCase(state: QuizState): QuizResult {
  const laws: QuizResult["laws"] = []
  const recommendations: string[] = []
  let score = 50 // Base score

  // Company-specific laws
  if (state.companyType === "airline") {
    laws.push({
      name: "UK261 Flight Compensation",
      description: "Up to £520 for delays over 3 hours or cancellations",
      relevance: "high",
    })
    score += 15
    recommendations.push("Check if your flight qualifies for automatic compensation")
  }

  if (state.companyType === "retailer" || state.companyType === "subscription") {
    laws.push({
      name: "Consumer Rights Act 2015",
      description: "Products must be of satisfactory quality, fit for purpose, and as described",
      relevance: "high",
    })
    score += 10
  }

  if (state.companyType === "landlord") {
    laws.push({
      name: "Tenant Fees Act 2019",
      description: "Limits charges landlords can make to tenants",
      relevance: "high",
    })
    laws.push({
      name: "Deregulation Act 2015",
      description: "Deposit protection requirements",
      relevance: "medium",
    })
    score += 10
  }

  // Issue-specific scoring
  if (state.issueType === "not_received") {
    score += 20
    recommendations.push("Document any delivery tracking or correspondence")
  } else if (state.issueType === "faulty") {
    score += 15
    recommendations.push("Keep the faulty item as evidence")
    if (state.timeFrame === "under_14_days" || state.timeFrame === "14_to_30_days") {
      laws.push({
        name: "Short-Term Right to Reject",
        description: "Full refund within 30 days for faulty goods",
        relevance: "high",
      })
      score += 15
    }
  } else if (state.issueType === "overcharged") {
    score += 10
    recommendations.push("Gather all billing statements and receipts")
  }

  // Time-based adjustments
  if (state.timeFrame === "under_14_days") {
    laws.push({
      name: "Consumer Contracts Regulations",
      description: "14-day cooling-off period for online/phone purchases",
      relevance: "high",
    })
    score += 20
  } else if (state.timeFrame === "14_to_30_days") {
    score += 10
  } else if (state.timeFrame === "1_to_6_months") {
    score += 5
  } else if (state.timeFrame === "over_6_months") {
    score -= 10
  }

  // Amount-based adjustments
  const amount = parseFloat(state.amount) || 0
  if (amount >= 100 && amount <= 30000) {
    laws.push({
      name: "Section 75 Protection",
      description: "Credit card purchases £100-£30,000 have extra protection",
      relevance: "medium",
    })
    recommendations.push("If paid by credit card, you may have Section 75 protection")
    score += 10
  }

  if (amount > 500) {
    score += 5
    recommendations.push("Consider escalating to an ombudsman if initial complaint fails")
  }

  // Already complained adjustment
  if (state.alreadyComplained) {
    recommendations.push("Reference your previous complaint in the new letter")
    recommendations.push("Consider escalating to a supervisor or executive")
  } else {
    recommendations.push("Start with a formal written complaint before escalating")
  }

  // Clamp score
  score = Math.min(95, Math.max(15, score))

  // Determine strength
  let strength: QuizResult["strength"] = "moderate"
  if (score >= 70) strength = "strong"
  else if (score < 40) strength = "weak"

  // Add time warning if needed
  let timeWarning: string | undefined
  if (state.timeFrame === "over_6_months") {
    timeWarning =
      "Your case may be outside the standard complaint window. You may need to escalate to an ombudsman or consider legal action."
  }

  return {
    strength,
    score,
    laws,
    recommendations,
    timeWarning,
  }
}

export function CaseStrengthQuiz() {
  const [step, setStep] = useState(0)
  const [state, setState] = useState<QuizState>({
    companyType: null,
    issueType: null,
    timeFrame: null,
    amount: "",
    alreadyComplained: null,
  })
  const [result, setResult] = useState<QuizResult | null>(null)

  const totalSteps = 5

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      // Calculate result
      setResult(analyzeCase(state))
      setStep(totalSteps)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return state.companyType !== null
      case 1:
        return state.issueType !== null
      case 2:
        return state.timeFrame !== null
      case 3:
        return state.amount.length > 0
      case 4:
        return state.alreadyComplained !== null
      default:
        return false
    }
  }

  const getStrengthColor = (strength: QuizResult["strength"]) => {
    switch (strength) {
      case "strong":
        return "text-forest-600 bg-forest-100"
      case "moderate":
        return "text-amber-600 bg-amber-100"
      case "weak":
        return "text-red-600 bg-red-100"
    }
  }

  const getStrengthIcon = (strength: QuizResult["strength"]) => {
    switch (strength) {
      case "strong":
        return CheckmarkCircle01Icon
      case "moderate":
        return AlertCircleIcon
      case "weak":
        return Cancel01Icon
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress */}
      {step < totalSteps && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {step + 1} of {totalSteps}</span>
            <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-peach-500"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Company Type */}
        {step === 0 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">What type of company is this about?</h3>
              <p className="text-muted-foreground text-sm">This helps us identify which laws apply</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {companyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setState({ ...state, companyType: type.value })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    state.companyType === type.value
                      ? "border-peach-500 bg-peach-50 ring-2 ring-peach-500/20"
                      : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  <Icon icon={type.icon} size={20} className="text-forest-500 mb-2" />
                  <p className="font-medium text-sm">{type.label}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Issue Type */}
        {step === 1 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">What went wrong?</h3>
              <p className="text-muted-foreground text-sm">Select the main issue with your purchase or service</p>
            </div>
            <div className="space-y-2">
              {issueTypes.map((issue) => (
                <button
                  key={issue.value}
                  onClick={() => setState({ ...state, issueType: issue.value })}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    state.issueType === issue.value
                      ? "border-peach-500 bg-peach-50 ring-2 ring-peach-500/20"
                      : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  <p className="font-medium text-sm">{issue.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{issue.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Time Frame */}
        {step === 2 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">When did this happen?</h3>
              <p className="text-muted-foreground text-sm">Time limits affect your legal options</p>
            </div>
            <div className="space-y-2">
              {timeFrames.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setState({ ...state, timeFrame: tf.value })}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    state.timeFrame === tf.value
                      ? "border-peach-500 bg-peach-50 ring-2 ring-peach-500/20"
                      : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  <p className="font-medium text-sm">{tf.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tf.days}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 4: Amount */}
        {step === 3 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">How much are you owed?</h3>
              <p className="text-muted-foreground text-sm">This affects which protections apply</p>
            </div>
            <div>
              <Label htmlFor="amount" className="sr-only">Amount</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="amount"
                  type="number"
                  value={state.amount}
                  onChange={(e) => setState({ ...state, amount: e.target.value })}
                  placeholder="0"
                  className="pl-8 text-2xl h-14 font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Enter your best estimate. This can include the purchase price, compensation, or damages.
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 5: Already Complained */}
        {step === 4 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">Have you already complained?</h3>
              <p className="text-muted-foreground text-sm">This helps us recommend the right approach</p>
            </div>
            <RadioGroup
              value={state.alreadyComplained === null ? "" : state.alreadyComplained ? "yes" : "no"}
              onValueChange={(value) => setState({ ...state, alreadyComplained: value === "yes" })}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50 cursor-pointer">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="cursor-pointer flex-1">
                  <span className="font-medium">Yes, I've already complained</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    But I didn't get a satisfactory response
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50 cursor-pointer">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="cursor-pointer flex-1">
                  <span className="font-medium">No, this is my first attempt</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    I haven't formally complained yet
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </motion.div>
        )}

        {/* Results */}
        {step === totalSteps && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Strength Badge */}
            <div className="text-center">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${getStrengthColor(
                  result.strength
                )}`}
              >
                <Icon icon={getStrengthIcon(result.strength)} size={20} />
                <span className="capitalize">{result.strength} Case</span>
              </div>
              <div className="mt-4">
                <div className="text-5xl font-bold font-display text-foreground">{result.score}%</div>
                <p className="text-muted-foreground mt-1">Case Strength Score</p>
              </div>
            </div>

            {/* Time Warning */}
            {result.timeWarning && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-800">{result.timeWarning}</p>
              </div>
            )}

            {/* Applicable Laws */}
            {result.laws.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Laws That May Apply</h4>
                <div className="space-y-2">
                  {result.laws.map((law, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-lavender-50 border border-lavender-200"
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-lavender-800">{law.name}</p>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            law.relevance === "high"
                              ? "bg-forest-100 text-forest-700"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {law.relevance}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{law.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold mb-3">Recommended Next Steps</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-4 border-t">
              <Button asChild variant="coral" size="lg" className="w-full">
                <Link href="/new">
                  Create My Professional Complaint
                  <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
                </Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Get a legally-grounded complaint letter in minutes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {step < totalSteps && (
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <Icon icon={ArrowLeft01Icon} size={16} className="mr-2" />
              Back
            </Button>
          )}
          <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
            {step === totalSteps - 1 ? "See My Results" : "Next"}
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}

// Compact version for homepage
export function CaseStrengthQuizCompact() {
  return (
    <div className="rounded-xl border-2 border-peach-200 bg-gradient-to-br from-peach-50 to-white p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-peach-100 flex items-center justify-center">
          <Icon icon={ZapIcon} size={20} className="text-peach-600" />
        </div>
        <div>
          <h3 className="font-semibold">Check Your Case in 30 Seconds</h3>
          <p className="text-sm text-muted-foreground">Find out if you have a valid complaint</p>
        </div>
      </div>
      <Button asChild variant="coral" className="w-full">
        <Link href="/tools/case-quiz">
          Start Free Assessment
          <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
        </Link>
      </Button>
    </div>
  )
}
