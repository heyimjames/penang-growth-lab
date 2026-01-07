"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Calculator01Icon,
  JusticeScale01Icon,
  Globe02Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type Country = "uk" | "us" | "au" | "ca" | "eu" | "other"

interface SmallClaimsResult {
  claimAmount: number
  courtFee: number
  interestAmount: number
  totalPotentialClaim: number
  timelineWeeks: string
  readyToClaim: boolean
  missingSteps: string[]
  checklist: { item: string; completed: boolean }[]
  tips: string[]
  currency: string
  legalBasis: string
  country: Country
  maxLimit: number
  courtName: string
}

const countryConfig: Record<Country, {
  name: string
  flag: string
  currency: string
  currencySymbol: string
  maxLimit: number
  courtName: string
  legalBasis: string
  interestRate: number
  timelineWeeks: string
}> = {
  uk: {
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "£",
    maxLimit: 10000,
    courtName: "County Court (Small Claims Track)",
    legalBasis: "Civil Procedure Rules Part 27",
    interestRate: 0.08,
    timelineWeeks: "6-12"
  },
  us: {
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
    maxLimit: 10000, // Varies by state, using median
    courtName: "Small Claims Court",
    legalBasis: "State Small Claims Procedures",
    interestRate: 0.10, // Varies by state
    timelineWeeks: "4-10"
  },
  au: {
    name: "Australia",
    flag: "🇦🇺",
    currency: "AUD",
    currencySymbol: "A$",
    maxLimit: 25000, // NSW limit
    courtName: "Local Court / VCAT / QCAT",
    legalBasis: "State Civil Claims Acts",
    interestRate: 0.08,
    timelineWeeks: "8-16"
  },
  ca: {
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    currencySymbol: "C$",
    maxLimit: 35000, // Ontario limit
    courtName: "Small Claims Court",
    legalBasis: "Provincial Small Claims Court Acts",
    interestRate: 0.05, // Bank of Canada rate + 2%
    timelineWeeks: "8-14"
  },
  eu: {
    name: "European Union",
    flag: "🇪🇺",
    currency: "EUR",
    currencySymbol: "€",
    maxLimit: 5000, // European Small Claims Procedure
    courtName: "National Courts (ESCP for cross-border)",
    legalBasis: "Regulation (EC) No 861/2007",
    interestRate: 0.08,
    timelineWeeks: "8-16"
  },
  other: {
    name: "Other Country",
    flag: "🌍",
    currency: "USD",
    currencySymbol: "$",
    maxLimit: 10000,
    courtName: "Local Court",
    legalBasis: "Local civil procedure rules",
    interestRate: 0.05,
    timelineWeeks: "8-20"
  },
}

function calculateCourtFee(country: Country, amount: number): number {
  if (country === "uk") {
    // UK court fees (2024)
    if (amount <= 300) return 35
    if (amount <= 500) return 50
    if (amount <= 1000) return 70
    if (amount <= 1500) return 80
    if (amount <= 3000) return 115
    if (amount <= 5000) return 205
    if (amount <= 10000) return 455
    return 455
  } else if (country === "us") {
    // US fees vary by state - using typical range
    if (amount <= 1500) return 30
    if (amount <= 5000) return 75
    if (amount <= 10000) return 100
    return 150
  } else if (country === "au") {
    // Australia varies by state - using NSW Local Court fees
    if (amount <= 2000) return 51
    if (amount <= 10000) return 118
    if (amount <= 25000) return 389
    return 389
  } else if (country === "ca") {
    // Canada varies by province - using Ontario
    if (amount <= 500) return 102
    if (amount <= 2500) return 187
    if (amount <= 10000) return 333
    if (amount <= 35000) return 476
    return 476
  } else if (country === "eu") {
    // European Small Claims Procedure - varies by member state
    if (amount <= 2000) return 35
    if (amount <= 5000) return 50
    return 50
  } else {
    // Generic estimate
    if (amount <= 1000) return 50
    if (amount <= 5000) return 100
    return 150
  }
}

function calculateInterest(country: Country, amount: number, daysSinceIncident: number): number {
  const config = countryConfig[country]
  const dailyRate = config.interestRate / 365
  return amount * dailyRate * daysSinceIncident
}

function calculateSmallClaims(
  country: Country,
  claimAmount: number,
  incidentDate: string,
  sentLBA: string,
  companyResponded: string
): SmallClaimsResult {
  const config = countryConfig[country]
  const now = new Date()
  const incident = new Date(incidentDate)
  const daysSinceIncident = Math.floor((now.getTime() - incident.getTime()) / (1000 * 60 * 60 * 24))

  const courtFee = calculateCourtFee(country, claimAmount)
  const interestAmount = Math.round(calculateInterest(country, claimAmount, daysSinceIncident) * 100) / 100
  const totalPotentialClaim = claimAmount + interestAmount + courtFee

  // Country-specific checklists
  let checklist: { item: string; completed: boolean }[] = []
  const missingSteps: string[] = []
  const tips: string[] = []

  if (country === "uk") {
    checklist = [
      { item: "Tried to resolve directly with the company", completed: true },
      { item: "Sent a Letter Before Action (LBA)", completed: sentLBA === "yes" },
      { item: "Waited 14 days after LBA", completed: sentLBA === "yes" },
      { item: "Gathered evidence (receipts, emails, photos)", completed: true },
      { item: "Identified full legal name and address of defendant", completed: true },
    ]
    if (sentLBA !== "yes") {
      missingSteps.push("Send a Letter Before Action giving 14 days to respond")
    }
    tips.push("Use Money Claims Online (MCOL) to file your claim")
    tips.push("Consider mediation - courts prefer parties who've tried to settle")
    tips.push("Keep copies of all correspondence")
    if (claimAmount > 10000) {
      tips.push("Claims over £10,000 go to fast track, not small claims track")
    }
  } else if (country === "us") {
    checklist = [
      { item: "Tried to resolve directly with the company", completed: true },
      { item: "Sent a demand letter", completed: sentLBA === "yes" },
      { item: "Gathered evidence (receipts, contracts, photos)", completed: true },
      { item: "Know the defendant's correct legal name", completed: true },
      { item: "Filing in the correct court (where defendant lives or incident occurred)", completed: true },
    ]
    if (sentLBA !== "yes") {
      missingSteps.push("Send a formal demand letter (not legally required but strongly recommended)")
    }
    tips.push("Small claims limits vary by state ($2,500 to $25,000)")
    tips.push("You usually cannot have a lawyer represent you in small claims court")
    tips.push("Bring all original documents and multiple copies to court")
    tips.push("Consider mediation before the hearing")
  } else if (country === "au") {
    checklist = [
      { item: "Attempted to resolve the dispute directly", completed: true },
      { item: "Sent a letter of demand", completed: sentLBA === "yes" },
      { item: "Allowed reasonable time to respond (14-28 days)", completed: sentLBA === "yes" },
      { item: "Gathered supporting evidence", completed: true },
      { item: "Know the correct legal name of the other party", completed: true },
    ]
    if (sentLBA !== "yes") {
      missingSteps.push("Send a letter of demand allowing 14-28 days to respond")
    }
    tips.push("Limits vary by state: NSW $40,000, VIC $15,000, QLD $25,000")
    tips.push("Consider using your state's tribunal (NCAT, VCAT, QCAT)")
    tips.push("Tribunals are less formal than courts")
    tips.push("Legal representation usually not allowed")
  } else if (country === "ca") {
    checklist = [
      { item: "Tried to resolve directly with the other party", completed: true },
      { item: "Sent a demand letter", completed: sentLBA === "yes" },
      { item: "Gathered all supporting documents", completed: true },
      { item: "Know defendant's correct legal name and address", completed: true },
    ]
    if (sentLBA !== "yes") {
      missingSteps.push("Send a formal demand letter (recommended but not required)")
    }
    tips.push("Limits vary by province: Ontario $35,000, BC $35,000, Alberta $50,000")
    tips.push("File at the courthouse closest to where defendant lives or business operates")
    tips.push("You can represent yourself or hire a paralegal")
    tips.push("Settlements are encouraged - most cases settle before trial")
  } else if (country === "eu") {
    checklist = [
      { item: "Tried to resolve directly with the company", completed: true },
      { item: "Claim is cross-border (different EU country)", completed: true },
      { item: "Claim is under €5,000", completed: claimAmount <= 5000 },
      { item: "Gathered evidence in relevant languages", completed: true },
    ]
    if (claimAmount > 5000) {
      missingSteps.push("European Small Claims Procedure only covers claims up to €5,000")
    }
    tips.push("ESCP works for cross-border disputes within the EU")
    tips.push("For domestic claims, use your national small claims procedure")
    tips.push("Judgments are automatically enforceable across EU member states")
    tips.push("Standard forms are available in all EU languages")
  } else {
    checklist = [
      { item: "Tried to resolve directly with the company", completed: true },
      { item: "Sent a formal demand letter", completed: sentLBA === "yes" },
      { item: "Gathered evidence", completed: true },
      { item: "Identified correct legal name of defendant", completed: true },
    ]
    if (sentLBA !== "yes") {
      missingSteps.push("Send a formal demand letter before filing a claim")
    }
    tips.push("Check your local court's small claims limit")
    tips.push("Research your country's specific civil procedure rules")
    tips.push("Consider consulting a local legal aid service")
  }

  tips.push("Get witness statements if applicable")
  tips.push("Keep copies of all correspondence")
  tips.push("Take screenshots of relevant web pages")

  const readyToClaim = sentLBA === "yes" && (country !== "eu" || claimAmount <= 5000)

  return {
    claimAmount,
    courtFee,
    interestAmount,
    totalPotentialClaim,
    timelineWeeks: config.timelineWeeks,
    readyToClaim,
    missingSteps,
    checklist,
    tips,
    currency: config.currencySymbol,
    legalBasis: config.legalBasis,
    country,
    maxLimit: config.maxLimit,
    courtName: config.courtName,
  }
}

function ResultCard({ result }: { result: SmallClaimsResult }) {
  const config = countryConfig[result.country]
  const interestRate = Math.round(config.interestRate * 100)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Court Info */}
      <div className="p-4 bg-lavender-50 border border-lavender-200 rounded-lg">
        <div className="flex items-center gap-2 text-lavender-700">
          <Icon icon={JusticeScale01Icon} size={18} />
          <span className="text-sm font-medium">{result.courtName}</span>
        </div>
        <p className="text-xs text-lavender-600 mt-1">{result.legalBasis}</p>
      </div>

      {/* Summary */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={Calculator01Icon} size={20} className="text-forest-500" />
          <h3 className="font-semibold text-foreground">Your Claim Breakdown</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-forest-50 rounded-md">
            <span className="text-sm text-muted-foreground">Original amount</span>
            <span className="font-semibold text-foreground">{result.currency}{result.claimAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-forest-50 rounded-md">
            <span className="text-sm text-muted-foreground">Interest ({interestRate}% p.a.)</span>
            <span className="font-semibold text-foreground">{result.currency}{result.interestAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-forest-50 rounded-md">
            <span className="text-sm text-muted-foreground">Court fee (estimated)</span>
            <span className="font-semibold text-foreground">{result.currency}{result.courtFee}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
            <span className="text-sm font-medium text-green-700">Total you could claim</span>
            <span className="font-bold text-green-700 text-lg">{result.currency}{result.totalPotentialClaim.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          If you win, you can typically claim back the court fee from the defendant.
        </p>
      </div>

      {/* Timeline */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-2">Expected Timeline</h3>
        <p className="text-2xl font-bold text-foreground mb-2">{result.timelineWeeks} weeks</p>
        <p className="text-sm text-muted-foreground">
          Small claims are usually resolved within this timeframe. Most cases are decided on papers alone, without a hearing.
        </p>
      </div>

      {/* Checklist */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Before You Claim</h3>
        <ul className="space-y-3">
          {result.checklist.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <Icon
                icon={item.completed ? CheckmarkCircle01Icon : AlertCircleIcon}
                size={18}
                className={item.completed ? "text-green-500" : "text-amber-500"}
              />
              <span className={`text-sm ${item.completed ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                {item.item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Steps */}
      {result.missingSteps.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon icon={AlertCircleIcon} size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-700 mb-2">Before you can claim:</p>
              <ul className="space-y-1">
                {result.missingSteps.map((step, i) => (
                  <li key={i} className="text-sm text-amber-700">• {step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Tips for Success</h3>
        <ul className="space-y-2">
          {result.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-forest-500 mt-1">•</span>
              <span className="text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="p-6 bg-forest-500 rounded-lg text-white">
        <h3 className="font-semibold text-lg mb-2">
          {result.readyToClaim ? "Ready to take them to court?" : "Need to send a Letter Before Action?"}
        </h3>
        <p className="text-forest-100 mb-4">
          {result.readyToClaim
            ? "Start by generating a professional Letter Before Action - courts expect you to have tried to settle first."
            : "Generate a formal Letter Before Action that meets the court's pre-action protocol requirements."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="coral">
            <Link href={`/new?tool=small-claims&amount=${result.claimAmount}`} className="flex items-center">
              Generate Letter Before Action
              <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="bg-white/10 text-white hover:bg-white hover:text-forest-700"
          >
            <Link href="/auth/sign-up">Create Free Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SmallClaimsForm() {
  const [country, setCountry] = useState<Country | "">("")
  const [claimAmount, setClaimAmount] = useState("")
  const [incidentDate, setIncidentDate] = useState("")
  const [sentLBA, setSentLBA] = useState("")
  const [companyResponded, setCompanyResponded] = useState("")
  const [result, setResult] = useState<SmallClaimsResult | null>(null)
  const [error, setError] = useState("")

  const selectedConfig = country ? countryConfig[country] : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!country) {
      setError("Please select your country/region")
      return
    }

    const config = countryConfig[country]
    const amount = parseFloat(claimAmount)
    if (!claimAmount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid claim amount")
      return
    }

    if (amount > config.maxLimit) {
      setError(`Small claims in ${config.name} typically cover claims up to ${config.currencySymbol}${config.maxLimit.toLocaleString()}. For larger amounts, consider legal advice.`)
      return
    }

    if (!incidentDate) {
      setError("Please enter when the issue occurred")
      return
    }

    if (!sentLBA) {
      setError("Please indicate if you've sent a demand letter")
      return
    }

    const smallClaims = calculateSmallClaims(country, amount, incidentDate, sentLBA, companyResponded)
    setResult(smallClaims)
  }

  const handleReset = () => {
    setCountry("")
    setClaimAmount("")
    setIncidentDate("")
    setSentLBA("")
    setCompanyResponded("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country/Region */}
          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-2">
              <Icon icon={Globe02Icon} size={16} className="text-muted-foreground" />
              Where are you filing your claim?
            </Label>
            <Select
              value={country}
              onValueChange={(value) => setCountry(value as Country)}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country/region" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.flag} {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Court fees and limits vary by country
            </p>
          </div>

          {/* Claim Amount */}
          <div className="space-y-2">
            <Label htmlFor="claim-amount">
              How much are you claiming? ({selectedConfig?.currencySymbol || "$"})
            </Label>
            <Input
              id="claim-amount"
              type="number"
              step="0.01"
              min="0"
              max={selectedConfig?.maxLimit || 10000}
              placeholder="e.g. 500"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
            />
            {selectedConfig && (
              <p className="text-xs text-muted-foreground">
                Small claims limit: {selectedConfig.currencySymbol}{selectedConfig.maxLimit.toLocaleString()}
              </p>
            )}
          </div>

          {/* Incident Date */}
          <div className="space-y-2">
            <Label htmlFor="incident-date">When did the issue occur?</Label>
            <Input
              id="incident-date"
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
            {selectedConfig && (
              <p className="text-xs text-muted-foreground">
                This affects interest you can claim ({Math.round(selectedConfig.interestRate * 100)}% per year)
              </p>
            )}
          </div>

          {/* Sent Demand Letter */}
          <div className="space-y-2">
            <Label htmlFor="sent-lba">Have you sent a formal demand letter?</Label>
            <Select value={sentLBA} onValueChange={setSentLBA}>
              <SelectTrigger id="sent-lba">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes, and waited for a response</SelectItem>
                <SelectItem value="no">No, not yet</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Most courts expect you to try to resolve the issue first
            </p>
          </div>

          {/* Company Responded */}
          {sentLBA === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="company-responded">Did the company respond to your LBA?</Label>
              <Select value={companyResponded} onValueChange={setCompanyResponded}>
                <SelectTrigger id="company-responded">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-response">No response</SelectItem>
                  <SelectItem value="rejected">They rejected my claim</SelectItem>
                  <SelectItem value="partial">They offered a partial settlement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12"
          >
            Calculate Court Fees
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Court Claim Summary</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Calculate again
            </Button>
          </div>
          <ResultCard result={result} />
        </div>
      )}
    </div>
  )
}
