"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Calculator01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type IssueType = "cancelled" | "changed" | "accommodation" | "flight" | "service" | "illness" | "other"

interface CompensationResult {
  estimatedCompensation: string
  entitlements: string[]
  nextSteps: string[]
  warnings: string[]
  escalation: string
}

export function HolidayCompensationForm() {
  const [issueType, setIssueType] = useState<IssueType | "">("")
  const [tourOperator, setTourOperator] = useState("")
  const [holidayCost, setHolidayCost] = useState("")
  const [holidayDuration, setHolidayDuration] = useState("")
  const [daysAffected, setDaysAffected] = useState("")
  const [wasPackage, setWasPackage] = useState("")
  const [details, setDetails] = useState("")
  const [result, setResult] = useState<CompensationResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!issueType) {
      setError("Please select the type of issue")
      return
    }

    const cost = parseFloat(holidayCost) || 0
    const duration = parseInt(holidayDuration) || 7
    const affected = parseInt(daysAffected) || 1
    const dailyRate = cost / duration

    let entitlements: string[] = []
    let estimatedCompensation = ""
    let warnings: string[] = []

    switch (issueType) {
      case "cancelled":
        entitlements = [
          "Full refund of all money paid",
          "Refund within 14 days of cancellation",
          "Alternative holiday of equivalent value (if you prefer)",
          "ATOL protection if company fails",
        ]
        estimatedCompensation = `Full refund: £${cost.toFixed(2)}`
        break

      case "changed":
        entitlements = [
          "Right to cancel for free if changes are significant",
          "Accept changes with price reduction if appropriate",
          "Full refund if you don't accept the changes",
        ]
        estimatedCompensation = "Depends on significance of changes - potentially full refund"
        warnings.push("'Significant changes' include: flight time changes of 12+ hours, resort change, significant itinerary changes")
        break

      case "accommodation":
        const accomCompensation = dailyRate * affected * 0.5 // Rough estimate
        entitlements = [
          "Refund/reduction for substandard accommodation",
          "Alternative accommodation of equal or higher standard",
          "Compensation for loss of enjoyment",
        ]
        estimatedCompensation = `Estimated: £${accomCompensation.toFixed(0)} - £${(accomCompensation * 2).toFixed(0)}`
        break

      case "flight":
        entitlements = [
          "UK261/EU261 flight delay compensation (if applicable)",
          "Package holiday compensation on top of flight compensation",
          "Repatriation if stranded",
        ]
        estimatedCompensation = "Up to £520 flight compensation + holiday disruption compensation"
        break

      case "service":
        const serviceCompensation = dailyRate * affected * 0.3
        entitlements = [
          "Refund for services not provided",
          "Compensation for loss of enjoyment",
          "Difference in value between promised and delivered",
        ]
        estimatedCompensation = `Estimated: £${serviceCompensation.toFixed(0)} - £${(serviceCompensation * 3).toFixed(0)}`
        break

      case "illness":
        entitlements = [
          "Refund if illness caused by hotel/resort negligence",
          "Compensation for medical costs abroad",
          "Compensation for loss of enjoyment",
          "Claim on travel insurance for other illness",
        ]
        estimatedCompensation = "Depends on cause and impact - could be full holiday cost + medical expenses"
        warnings.push("Keep all medical receipts and documentation")
        warnings.push("Report illness to hotel/rep at the time")
        break

      case "other":
        entitlements = [
          "Package Travel Regulations protect you for package holidays",
          "Tour operator responsible for all elements of package",
          "Right to claim for loss of enjoyment",
        ]
        estimatedCompensation = "Varies depending on specific circumstances"
        break
    }

    if (wasPackage === "no") {
      warnings.push("If this wasn't a package holiday, your rights may be more limited. You'd need to claim against each provider separately.")
    }

    const nextSteps = [
      "Gather all evidence - photos, receipts, confirmation emails",
      "Write to the tour operator with your complaint",
      "Itemize your losses and the compensation you're seeking",
      "Give them 28 days to respond",
      "If no resolution, escalate to ABTA or take to court",
    ]

    const escalation = wasPackage === "yes"
      ? "You can escalate to ABTA (if they're a member) or the Package Travel Dispute Resolution scheme."
      : "Without package protection, you may need to pursue each provider separately or use small claims court."

    setResult({
      estimatedCompensation,
      entitlements,
      nextSteps,
      warnings,
      escalation,
    })
  }

  const handleReset = () => {
    setIssueType("")
    setTourOperator("")
    setHolidayCost("")
    setHolidayDuration("")
    setDaysAffected("")
    setWasPackage("")
    setDetails("")
    setResult(null)
    setError("")
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Compensation Estimate</h2>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Start again
          </Button>
        </div>

        {/* Estimate */}
        <div className="p-6 bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon icon={Calculator01Icon} size={24} className="text-forest-600 dark:text-forest-400" />
            <div>
              <h3 className="font-semibold text-forest-800 dark:text-forest-200">Potential Compensation</h3>
              <p className="text-lg font-bold mt-1 text-forest-700 dark:text-forest-300">{result.estimatedCompensation}</p>
            </div>
          </div>
        </div>

        {/* Entitlements */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">What You May Be Entitled To</h3>
          <ul className="space-y-3">
            {result.entitlements.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warnings */}
        {result.warnings.length > 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon icon={AlertCircleIcon} size={20} className="text-amber-500 flex-shrink-0" />
              <div className="space-y-1">
                {result.warnings.map((warning, i) => (
                  <p key={i} className="text-sm text-amber-700 dark:text-amber-300">{warning}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Next Steps</h3>
          <ul className="space-y-2">
            {result.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="font-medium text-forest-500 mt-0.5">{i + 1}.</span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg text-white">
          <h3 className="font-semibold text-lg mb-2">Need Help With Your Claim?</h3>
          <p className="text-forest-100 mb-4">{result.escalation}</p>
          <Button asChild variant="coral">
            <Link href={`/new?tool=holiday&operator=${encodeURIComponent(tourOperator)}`} className="flex items-center">
              Get Help With Your Claim
              <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Issue Type */}
      <div className="space-y-2">
        <Label htmlFor="issue-type">What went wrong?</Label>
        <Select value={issueType} onValueChange={(value) => setIssueType(value as IssueType)}>
          <SelectTrigger id="issue-type">
            <SelectValue placeholder="Select the issue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cancelled">Holiday was cancelled</SelectItem>
            <SelectItem value="changed">Significant changes to booking</SelectItem>
            <SelectItem value="accommodation">Accommodation problems</SelectItem>
            <SelectItem value="flight">Flight delays/cancellations</SelectItem>
            <SelectItem value="service">Services not as described</SelectItem>
            <SelectItem value="illness">Illness during holiday</SelectItem>
            <SelectItem value="other">Other issue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tour Operator */}
      <div className="space-y-2">
        <Label htmlFor="tour-operator">Tour operator / Travel company</Label>
        <Input
          id="tour-operator"
          type="text"
          placeholder="e.g. TUI, Jet2, On the Beach"
          value={tourOperator}
          onChange={(e) => setTourOperator(e.target.value)}
        />
      </div>

      {/* Package Holiday */}
      <div className="space-y-2">
        <Label htmlFor="was-package">Was this a package holiday?</Label>
        <Select value={wasPackage} onValueChange={setWasPackage}>
          <SelectTrigger id="was-package">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes - booked flights + hotel together</SelectItem>
            <SelectItem value="no">No - booked separately</SelectItem>
            <SelectItem value="unsure">Not sure</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Package holidays have stronger legal protection under PTR 2018
        </p>
      </div>

      {/* Holiday Cost */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="holiday-cost">Total holiday cost (£)</Label>
          <Input
            id="holiday-cost"
            type="text"
            placeholder="e.g. 2000"
            value={holidayCost}
            onChange={(e) => setHolidayCost(e.target.value.replace(/[^0-9.]/g, ""))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="holiday-duration">Holiday duration (nights)</Label>
          <Input
            id="holiday-duration"
            type="number"
            placeholder="e.g. 7"
            value={holidayDuration}
            onChange={(e) => setHolidayDuration(e.target.value)}
          />
        </div>
      </div>

      {/* Days Affected */}
      {(issueType === "accommodation" || issueType === "service" || issueType === "illness") && (
        <div className="space-y-2">
          <Label htmlFor="days-affected">Days affected by the issue</Label>
          <Input
            id="days-affected"
            type="number"
            placeholder="e.g. 3"
            value={daysAffected}
            onChange={(e) => setDaysAffected(e.target.value)}
          />
        </div>
      )}

      {/* Details */}
      <div className="space-y-2">
        <Label htmlFor="details">Describe what happened</Label>
        <Textarea
          id="details"
          placeholder="Include specific details about the problems..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12">
        Calculate Compensation
        <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Free tool. No account required. Estimates are for guidance only.
      </p>
    </form>
  )
}
