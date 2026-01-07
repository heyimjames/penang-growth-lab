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
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type ContractType = "service" | "membership" | "lease" | "supply" | "retainer" | "other"
type TerminationReason = "notice" | "breach" | "convenience" | "end" | "other"

export function ContractTerminationForm() {
  const [contractType, setContractType] = useState<ContractType | "">("")
  const [terminationReason, setTerminationReason] = useState<TerminationReason | "">("")
  const [companyName, setCompanyName] = useState("")
  const [contractRef, setContractRef] = useState("")
  const [yourName, setYourName] = useState("")
  const [yourCompany, setYourCompany] = useState("")
  const [noticePeriod, setNoticePeriod] = useState("")
  const [terminationDate, setTerminationDate] = useState("")
  const [details, setDetails] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!contractType || !terminationReason || !companyName) {
      setError("Please fill in all required fields")
      return
    }

    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

    const reasonParagraphs: Record<TerminationReason, string> = {
      notice: `I am writing to give formal notice of termination of the above contract in accordance with the terms of our agreement.
${noticePeriod ? `\nAs per the contract, I am providing ${noticePeriod} days' notice. ` : ""}
The contract will therefore terminate on ${terminationDate || "[termination date]"}.`,
      breach: `I am writing to terminate the above contract with immediate effect due to material breach of contract on your part.

${details || "The specific breaches are outlined below:\n[Detail the breaches]"}

As you have failed to perform your obligations under the contract, I am entitled to terminate immediately without further notice.`,
      convenience: `I am writing to exercise my right to terminate the above contract for convenience.

${details || "I have decided to end this arrangement and no longer require your services."}

Please confirm the final termination date and any outstanding obligations on both sides.`,
      end: `I am writing to confirm that I do not wish to renew the above contract, which is due to expire on ${terminationDate || "[end date]"}.

Please treat this letter as formal notice that the contract will not be renewed and will terminate on its natural expiry date.`,
      other: details || "I am writing to terminate the above contract for the reasons discussed.",
    }

    const letter = `${today}

${companyName}
[Company Address]

Dear Sir/Madam,

Re: Formal Notice of Contract Termination
Contract Reference: ${contractRef || "[Contract Reference]"}
${yourCompany ? `Our Reference: ${yourCompany}\n` : ""}

${reasonParagraphs[terminationReason]}

REQUIRED ACTIONS

Please confirm in writing:
1. Receipt of this termination notice
2. The effective termination date
3. Any final payments due (in either direction)
4. Arrangements for return of any materials or property
5. Any post-termination obligations

FINAL MATTERS

Please ensure that:
- All invoices are brought up to date
- Any prepaid amounts are refunded appropriately
- All confidential information is returned or destroyed as required
- Any necessary handover arrangements are made

I trust you will process this termination in accordance with the terms of our agreement. Please respond within 14 days to confirm the above.

Yours faithfully,

${yourName || "[Your Name]"}
${yourCompany || ""}

---
Generated using NoReply (usenoreply.com)
Sent: ${today}`

    setResult(letter)
  }

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleReset = () => {
    setContractType("")
    setTerminationReason("")
    setCompanyName("")
    setContractRef("")
    setYourName("")
    setYourCompany("")
    setNoticePeriod("")
    setTerminationDate("")
    setDetails("")
    setResult(null)
    setError("")
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Your Termination Letter</h2>
          <Button variant="ghost" size="sm" onClick={handleReset}>Start again</Button>
        </div>

        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Termination Letter</h3>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Icon icon={copied ? CheckmarkCircle01Icon : Copy01Icon} size={14} className="mr-2" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="bg-forest-50 dark:bg-forest-900/20 rounded-md p-4 font-mono text-sm whitespace-pre-wrap text-muted-foreground max-h-96 overflow-y-auto">
            {result}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            <Icon icon={Mail01Icon} size={12} className="inline mr-1" />
            Send by recorded delivery or email with read receipt.
          </p>
        </div>

        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Important Reminders</h3>
          <ul className="space-y-3">
            {[
              "Keep a copy of this letter for your records",
              "Note the date and method of sending",
              "Follow up if no response within 14 days",
              "Check contract for any specific termination procedures",
              "Ensure any deposits or prepayments are refunded",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg text-white">
          <h3 className="font-semibold text-lg mb-2">Dispute Over Termination?</h3>
          <p className="text-forest-100 mb-4">
            If the other party disputes your termination or claims unfair penalties, NoReply can help.
          </p>
          <Button asChild variant="coral">
            <Link href={`/new?tool=contract-dispute&company=${encodeURIComponent(companyName)}`}>
              Get Help With Your Dispute
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
        <Label htmlFor="contract-type">Type of contract</Label>
        <Select value={contractType} onValueChange={(value) => setContractType(value as ContractType)}>
          <SelectTrigger id="contract-type"><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="service">Service Agreement</SelectItem>
            <SelectItem value="membership">Membership Contract</SelectItem>
            <SelectItem value="lease">Lease / Rental Agreement</SelectItem>
            <SelectItem value="supply">Supply Contract</SelectItem>
            <SelectItem value="retainer">Retainer Agreement</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="termination-reason">Reason for termination</Label>
        <Select value={terminationReason} onValueChange={(value) => setTerminationReason(value as TerminationReason)}>
          <SelectTrigger id="termination-reason"><SelectValue placeholder="Select reason" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="notice">Giving contractual notice period</SelectItem>
            <SelectItem value="breach">Other party breached the contract</SelectItem>
            <SelectItem value="convenience">Termination for convenience</SelectItem>
            <SelectItem value="end">Contract expiring - not renewing</SelectItem>
            <SelectItem value="other">Other reason</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-name">Company/Party name</Label>
        <Input id="company-name" type="text" placeholder="Name of the other party" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contract-ref">Contract reference (optional)</Label>
        <Input id="contract-ref" type="text" placeholder="Contract number or reference" value={contractRef} onChange={(e) => setContractRef(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="your-name">Your name</Label>
          <Input id="your-name" type="text" placeholder="Your full name" value={yourName} onChange={(e) => setYourName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="your-company">Your company (if applicable)</Label>
          <Input id="your-company" type="text" placeholder="Your company name" value={yourCompany} onChange={(e) => setYourCompany(e.target.value)} />
        </div>
      </div>

      {terminationReason === "notice" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="notice-period">Notice period (days)</Label>
            <Input id="notice-period" type="text" placeholder="e.g. 30" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="termination-date">Termination date</Label>
            <Input id="termination-date" type="date" value={terminationDate} onChange={(e) => setTerminationDate(e.target.value)} />
          </div>
        </div>
      )}

      {(terminationReason === "breach" || terminationReason === "convenience" || terminationReason === "other") && (
        <div className="space-y-2">
          <Label htmlFor="details">Details</Label>
          <Textarea id="details" placeholder={terminationReason === "breach" ? "Describe the breach..." : "Explain your reason..."} value={details} onChange={(e) => setDetails(e.target.value)} rows={4} />
        </div>
      )}

      {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">{error}</div>}

      <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12">
        Generate Termination Letter
        <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
      </Button>

      <p className="text-xs text-center text-muted-foreground">Free tool. No account required.</p>
    </form>
  )
}
