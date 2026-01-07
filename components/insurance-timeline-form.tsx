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
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Clock01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type ClaimType = "car" | "home" | "travel" | "health" | "life" | "other"
type ClaimStatus = "submitted" | "acknowledged" | "investigating" | "complained" | "rejected"

interface TimelineResult {
  daysSinceSubmission: number
  canEscalate: boolean
  nextMilestone: string
  daysUntilMilestone: number
  recommendations: string[]
  escalationDeadline: string
}

export function InsuranceTimelineForm() {
  const [claimType, setClaimType] = useState<ClaimType | "">("")
  const [insurer, setInsurer] = useState("")
  const [submissionDate, setSubmissionDate] = useState("")
  const [claimStatus, setClaimStatus] = useState<ClaimStatus | "">("")
  const [complainedDate, setComplainedDate] = useState("")
  const [result, setResult] = useState<TimelineResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!claimType || !submissionDate || !claimStatus) {
      setError("Please fill in all required fields")
      return
    }

    const submitted = new Date(submissionDate)
    const today = new Date()
    const daysSinceSubmission = Math.floor((today.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24))

    let canEscalate = false
    let nextMilestone = ""
    let daysUntilMilestone = 0
    let recommendations: string[] = []
    let escalationDeadline = ""

    if (claimStatus === "complained" && complainedDate) {
      const complained = new Date(complainedDate)
      const daysSinceComplaint = Math.floor((today.getTime() - complained.getTime()) / (1000 * 60 * 60 * 24))

      if (daysSinceComplaint >= 56) {
        canEscalate = true
        nextMilestone = "Can escalate to Financial Ombudsman NOW"
        daysUntilMilestone = 0
        recommendations = [
          "You can now escalate to the Financial Ombudsman Service",
          "The FOS is free to use and their decision is binding on the insurer",
          "You have 6 months from the insurer's final response to escalate",
        ]
      } else {
        nextMilestone = "8 weeks for insurer to resolve complaint"
        daysUntilMilestone = 56 - daysSinceComplaint
        recommendations = [
          `Wait ${daysUntilMilestone} more days for the 8-week deadline`,
          "Keep records of all communication",
          "If they send a 'final response', you can escalate immediately",
        ]
      }
      escalationDeadline = `${56 - daysSinceComplaint} days until you can escalate`
    } else if (claimStatus === "rejected") {
      canEscalate = true
      recommendations = [
        "You can complain to the insurer about the rejection",
        "They have 8 weeks to resolve your complaint",
        "After 8 weeks (or final response), escalate to FOS",
        "FOS can overturn rejections if they find them unfair",
      ]
      nextMilestone = "Submit formal complaint to start 8-week clock"
      escalationDeadline = "8 weeks after formal complaint"
    } else {
      if (daysSinceSubmission < 14) {
        nextMilestone = "Initial assessment expected"
        daysUntilMilestone = 14 - daysSinceSubmission
        recommendations = [
          "Claims are typically assessed within 1-2 weeks",
          "Contact them if you don't hear back by 2 weeks",
          "Check you've provided all required documentation",
        ]
      } else if (daysSinceSubmission < 30) {
        nextMilestone = "Follow up recommended"
        daysUntilMilestone = 0
        recommendations = [
          "It's been over 2 weeks - follow up is reasonable",
          "Ask for a status update and expected timeline",
          "Keep notes of who you spoke to and when",
        ]
      } else {
        nextMilestone = "Consider formal complaint"
        daysUntilMilestone = 0
        recommendations = [
          "After 30 days, a formal complaint may be appropriate",
          "Put your complaint in writing",
          "This starts the 8-week complaint handling period",
        ]
      }
      escalationDeadline = "8 weeks from formal complaint"
    }

    setResult({
      daysSinceSubmission,
      canEscalate,
      nextMilestone,
      daysUntilMilestone,
      recommendations,
      escalationDeadline,
    })
  }

  const handleReset = () => {
    setClaimType("")
    setInsurer("")
    setSubmissionDate("")
    setClaimStatus("")
    setComplainedDate("")
    setResult(null)
    setError("")
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Timeline Status</h2>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Start again
          </Button>
        </div>

        <div className={`p-6 border rounded-lg ${result.canEscalate ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-forest-50 dark:bg-forest-900/20 border-forest-200 dark:border-forest-800"}`}>
          <div className="flex items-start gap-3">
            <Icon icon={result.canEscalate ? CheckmarkCircle01Icon : Clock01Icon} size={24} className={result.canEscalate ? "text-green-600" : "text-forest-600"} />
            <div>
              <h3 className={`font-semibold ${result.canEscalate ? "text-green-800 dark:text-green-200" : "text-forest-800 dark:text-forest-200"}`}>
                {result.canEscalate ? "Ready to Escalate" : result.nextMilestone}
              </h3>
              <p className="text-sm mt-1 text-muted-foreground">
                {result.daysSinceSubmission} days since claim submitted
              </p>
              {result.daysUntilMilestone > 0 && (
                <p className="text-sm text-muted-foreground">
                  {result.daysUntilMilestone} days until next milestone
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Recommendations</h3>
          <ul className="space-y-3">
            {result.recommendations.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg text-white">
          <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
          <p className="text-forest-100 mb-4">
            NoReply can help you write a formal complaint or prepare your case for the Financial Ombudsman.
          </p>
          <Button asChild variant="coral">
            <Link href={`/new?tool=insurance&insurer=${encodeURIComponent(insurer)}`}>
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
      <div className="space-y-2">
        <Label htmlFor="claim-type">Type of insurance</Label>
        <Select value={claimType} onValueChange={(value) => setClaimType(value as ClaimType)}>
          <SelectTrigger id="claim-type"><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="car">Car insurance</SelectItem>
            <SelectItem value="home">Home insurance</SelectItem>
            <SelectItem value="travel">Travel insurance</SelectItem>
            <SelectItem value="health">Health/Medical insurance</SelectItem>
            <SelectItem value="life">Life insurance</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="insurer">Insurance company</Label>
        <Input id="insurer" type="text" placeholder="e.g. Aviva, Direct Line" value={insurer} onChange={(e) => setInsurer(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="submission-date">When did you submit the claim?</Label>
        <Input id="submission-date" type="date" value={submissionDate} onChange={(e) => setSubmissionDate(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="claim-status">Current claim status</Label>
        <Select value={claimStatus} onValueChange={(value) => setClaimStatus(value as ClaimStatus)}>
          <SelectTrigger id="claim-status"><SelectValue placeholder="Select status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="submitted">Just submitted, waiting for response</SelectItem>
            <SelectItem value="acknowledged">Acknowledged, being assessed</SelectItem>
            <SelectItem value="investigating">Under investigation</SelectItem>
            <SelectItem value="complained">I've made a formal complaint</SelectItem>
            <SelectItem value="rejected">Claim was rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {claimStatus === "complained" && (
        <div className="space-y-2">
          <Label htmlFor="complained-date">When did you complain?</Label>
          <Input id="complained-date" type="date" value={complainedDate} onChange={(e) => setComplainedDate(e.target.value)} />
        </div>
      )}

      {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">{error}</div>}

      <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12">
        Track My Claim
        <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
      </Button>

      <p className="text-xs text-center text-muted-foreground">Free tool. No account required.</p>
    </form>
  )
}
