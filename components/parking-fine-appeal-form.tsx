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
  Copy01Icon,
  Mail01Icon,
  AlertCircleIcon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type TicketType = "council" | "private" | "tfl"
type AppealGround = "signage" | "payment" | "grace" | "circumstances" | "incorrect" | "paid" | "other"

interface AppealResult {
  ticketType: TicketType
  appealGround: AppealGround
  letterTemplate: string
  nextSteps: string[]
  warnings: string[]
  escalationPath: string
  deadline: string
}

function generateAppealLetter(
  ticketType: TicketType,
  appealGround: AppealGround,
  ticketNumber: string,
  vehicleReg: string,
  ticketDate: string,
  location: string,
  yourName: string,
  details: string
): string {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

  const groundExplanations: Record<AppealGround, string> = {
    signage: `The signage at the location was inadequate, unclear, or contradictory. ${ticketType === "private" ? "Under the BPA Code of Practice, signage must be prominent, clear, and visible at the point of entry." : "Proper signage is a legal requirement for parking restrictions to be enforceable."}`,
    payment: "I attempted to pay for parking but was unable to do so. The payment machine was not working / the app failed to process my payment / there was no way to pay by the method advertised.",
    grace: "I was only marginally over the permitted time. Industry best practice, including the BPA Code of Practice, requires a reasonable grace period of at least 10 minutes to be given.",
    circumstances: `There were mitigating circumstances that prevented me from returning to my vehicle on time. ${details || "I experienced an emergency situation that was beyond my control."}`,
    incorrect: "The Penalty Charge Notice contains incorrect information. The details recorded do not accurately reflect the situation at the time.",
    paid: "I had a valid parking ticket displayed in my vehicle / I had paid for parking at the time the ticket was issued. I have evidence to support this.",
    other: details || "I am contesting this charge for the reasons outlined below.",
  }

  const recipientAddress = ticketType === "council"
    ? "[Council Name]\nParking Services\n[Address]"
    : ticketType === "tfl"
    ? "Transport for London\nParking Operations\nPO Box 123\nLondon"
    : "[Parking Company Name]\n[Company Address]"

  const reference = ticketType === "private" ? "Parking Charge Notice" : "Penalty Charge Notice"

  return `${today}

${recipientAddress}

Dear Sir/Madam,

Re: Formal Appeal Against ${reference}
PCN/Reference Number: ${ticketNumber || "[Insert Number]"}
Vehicle Registration: ${vehicleReg || "[Insert Registration]"}
Date of Alleged Contravention: ${ticketDate || "[Insert Date]"}
Location: ${location || "[Insert Location]"}

I am writing to formally appeal against the above ${reference.toLowerCase()} and request that it be cancelled.

GROUNDS FOR APPEAL

${groundExplanations[appealGround]}

${details ? `\nADDITIONAL DETAILS\n\n${details}\n` : ""}
${ticketType === "private" ? `
LEGAL POSITION

I note that this is an invoice for an alleged breach of contract, not a fine. Under the Protection of Freedoms Act 2012, you are required to prove:
1. That adequate signage was in place
2. That I agreed to your terms and conditions
3. That any charge represents a genuine pre-estimate of loss

I do not accept that these requirements have been met.
` : ""}
REQUEST

I respectfully request that this ${reference.toLowerCase()} be cancelled with immediate effect.

${ticketType === "council"
  ? "If you reject this appeal, please provide your full reasons in writing. I am aware of my right to appeal to the Traffic Penalty Tribunal if necessary."
  : ticketType === "private"
  ? "If you reject this appeal, I am aware of my right to appeal to POPLA (Parking on Private Land Appeals) and will exercise this right if necessary."
  : "If you reject this appeal, please provide your full reasons and information about further appeal rights."}

Please respond to this appeal within 28 days.

Yours faithfully,

${yourName || "[Your Name]"}

---
Generated using NoReply (usenoreply.com)
Sent: ${today}
`.trim()
}

function ResultCard({ result, ticketNumber }: { result: AppealResult; ticketNumber: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.letterTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary */}
      <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Appeal Summary</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-forest-50 dark:bg-forest-900/20 rounded-md">
            <span className="text-xs text-muted-foreground block mb-1">Ticket Type</span>
            <span className="font-medium text-foreground">
              {result.ticketType === "council" ? "Council PCN" : result.ticketType === "tfl" ? "TfL PCN" : "Private Parking"}
            </span>
          </div>
          <div className="p-4 bg-forest-50 dark:bg-forest-900/20 rounded-md">
            <span className="text-xs text-muted-foreground block mb-1">Appeal Deadline</span>
            <span className="font-medium text-foreground">{result.deadline}</span>
          </div>
        </div>
      </div>

      {/* Generated Letter */}
      <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Your Appeal Letter</h3>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Icon icon={copied ? CheckmarkCircle01Icon : Copy01Icon} size={14} className="mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <div className="bg-forest-50 dark:bg-forest-900/20 rounded-md p-4 font-mono text-sm whitespace-pre-wrap text-muted-foreground max-h-96 overflow-y-auto">
          {result.letterTemplate}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          <Icon icon={Mail01Icon} size={12} className="inline mr-1" />
          Send this by email or post. Keep proof of when you sent it.
        </p>
      </div>

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

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon icon={AlertCircleIcon} size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              {result.warnings.map((warning, i) => (
                <p key={i} className="text-sm text-amber-700 dark:text-amber-300">{warning}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Escalation */}
      <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg text-white">
        <h3 className="font-semibold text-lg mb-2">If Your Appeal Is Rejected</h3>
        <p className="text-forest-100 mb-4">{result.escalationPath}</p>
        <Button asChild variant="coral">
          <Link href={`/new?tool=parking-appeal&ref=${encodeURIComponent(ticketNumber)}`} className="flex items-center">
            Get Help Escalating
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function ParkingFineAppealForm() {
  const [ticketType, setTicketType] = useState<TicketType | "">("")
  const [appealGround, setAppealGround] = useState<AppealGround | "">("")
  const [ticketNumber, setTicketNumber] = useState("")
  const [vehicleReg, setVehicleReg] = useState("")
  const [ticketDate, setTicketDate] = useState("")
  const [location, setLocation] = useState("")
  const [yourName, setYourName] = useState("")
  const [details, setDetails] = useState("")
  const [result, setResult] = useState<AppealResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!ticketType) {
      setError("Please select the type of ticket")
      return
    }

    if (!appealGround) {
      setError("Please select your grounds for appeal")
      return
    }

    const letterTemplate = generateAppealLetter(
      ticketType,
      appealGround,
      ticketNumber,
      vehicleReg,
      ticketDate,
      location,
      yourName,
      details
    )

    const nextSteps = [
      "Send this letter by email or recorded delivery post",
      "Keep a copy and note the date you sent it",
      "Gather any supporting evidence (photos, receipts, etc.)",
      "Wait for their response (usually within 28 days)",
      ticketType === "private"
        ? "If rejected, appeal to POPLA within 28 days"
        : "If rejected, appeal to the Traffic Penalty Tribunal",
    ]

    const warnings = []
    if (ticketType === "council") {
      warnings.push("Pay within 14 days to get 50% discount if your appeal might fail")
    }
    if (appealGround === "grace") {
      warnings.push("Grace period arguments work better for private tickets than council ones")
    }

    const escalationPath = ticketType === "private"
      ? "You can appeal to POPLA (Parking on Private Land Appeals) for free. They are independent and their decision is binding on the parking company."
      : "You can appeal to the Traffic Penalty Tribunal for free. They are independent and can cancel the ticket if your appeal has merit."

    const deadline = ticketType === "council"
      ? "28 days from ticket (14 days for discount)"
      : "Usually 28 days from ticket"

    setResult({
      ticketType,
      appealGround,
      letterTemplate,
      nextSteps,
      warnings,
      escalationPath,
      deadline,
    })
  }

  const handleReset = () => {
    setTicketType("")
    setAppealGround("")
    setTicketNumber("")
    setVehicleReg("")
    setTicketDate("")
    setLocation("")
    setYourName("")
    setDetails("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ticket Type */}
          <div className="space-y-2">
            <Label htmlFor="ticket-type">Type of ticket</Label>
            <Select value={ticketType} onValueChange={(value) => setTicketType(value as TicketType)}>
              <SelectTrigger id="ticket-type">
                <SelectValue placeholder="Select ticket type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="council">Council Penalty Charge Notice (PCN)</SelectItem>
                <SelectItem value="private">Private Parking Charge</SelectItem>
                <SelectItem value="tfl">TfL / Congestion Charge</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Council tickets are from local authorities. Private tickets are from companies like ParkingEye, UKPC, etc.
            </p>
          </div>

          {/* Appeal Ground */}
          <div className="space-y-2">
            <Label htmlFor="appeal-ground">Grounds for appeal</Label>
            <Select value={appealGround} onValueChange={(value) => setAppealGround(value as AppealGround)}>
              <SelectTrigger id="appeal-ground">
                <SelectValue placeholder="Why are you appealing?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="signage">Signage was unclear or missing</SelectItem>
                <SelectItem value="payment">Payment machine/app didn&apos;t work</SelectItem>
                <SelectItem value="grace">Only slightly over time (grace period)</SelectItem>
                <SelectItem value="circumstances">Mitigating circumstances (emergency, etc.)</SelectItem>
                <SelectItem value="incorrect">Ticket details are wrong</SelectItem>
                <SelectItem value="paid">I had already paid/displayed ticket</SelectItem>
                <SelectItem value="other">Other reason</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ticket Details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-number">Ticket/Reference number</Label>
              <Input
                id="ticket-number"
                type="text"
                placeholder="e.g. PCN12345678"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-reg">Vehicle registration</Label>
              <Input
                id="vehicle-reg"
                type="text"
                placeholder="e.g. AB12 CDE"
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-date">Date of ticket</Label>
              <Input
                id="ticket-date"
                type="date"
                value={ticketDate}
                onChange={(e) => setTicketDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g. Tesco Car Park, High Street"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Your Name */}
          <div className="space-y-2">
            <Label htmlFor="your-name">Your name</Label>
            <Input
              id="your-name"
              type="text"
              placeholder="Your full name"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
            />
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea
              id="details"
              placeholder="Describe what happened in more detail..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Include any relevant details like broken machines, unclear signs, or emergency circumstances.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12">
            Generate Appeal Letter
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Appeal</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Start again
            </Button>
          </div>
          <ResultCard result={result} ticketNumber={ticketNumber} />
        </div>
      )}
    </div>
  )
}
