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

const providers = [
  "BT", "Sky", "Virgin Media", "TalkTalk", "Plusnet", "EE", "Vodafone", "NOW Broadband", "Hyperoptic", "Other"
]

type IssueType = "speed" | "outage" | "installation" | "billing" | "service" | "other"

export function BroadbandComplaintForm() {
  const [provider, setProvider] = useState("")
  const [issueType, setIssueType] = useState<IssueType | "">("")
  const [promisedSpeed, setPromisedSpeed] = useState("")
  const [actualSpeed, setActualSpeed] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [yourName, setYourName] = useState("")
  const [details, setDetails] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!provider || !issueType) {
      setError("Please fill in all required fields")
      return
    }

    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

    const issueDescriptions: Record<IssueType, string> = {
      speed: `My broadband speed is significantly below what was promised. I was told to expect speeds of ${promisedSpeed || "[promised speed]"} Mbps, but I am consistently receiving only ${actualSpeed || "[actual speed]"} Mbps.

I have conducted multiple speed tests at different times of day, and the results are consistently far below the minimum guaranteed speed in my contract.

Under the Ofcom Broadband Speeds Code of Practice, which you have signed up to, you are required to:
1. Provide me with a minimum guaranteed speed
2. Give me the right to exit my contract penalty-free if speeds fall below this minimum and cannot be improved within 30 days`,
      outage: `I have experienced significant broadband outages that have left me without service. ${details || "[Details of outages]"}

Under Ofcom's automatic compensation scheme, I believe I am entitled to:
- £8.40 for each day of total service loss
- £26.24 for missed engineer appointments
- £5.25 for each day of delayed new service start`,
      installation: `My broadband installation has not been completed as promised. ${details || "[Installation issues]"}

Under Ofcom's automatic compensation scheme, I am entitled to £5.25 for each day my service start is delayed beyond the agreed date.`,
      billing: `I have identified billing errors on my account. ${details || "[Billing issues]"}

I request that you review my account and refund any overcharges.`,
      service: `I am experiencing poor customer service. ${details || "[Service issues]"}

I expect a formal response to this complaint within 14 days.`,
      other: details || "I am writing to make a formal complaint about my broadband service.",
    }

    const letter = `${today}

${provider}
Customer Complaints
[Provider Address]

Dear Sir/Madam,

Re: Formal Complaint - Broadband Service
Account Number: ${accountNumber || "[Your Account Number]"}

I am writing to make a formal complaint about my broadband service.

THE ISSUE

${issueDescriptions[issueType]}

WHAT I WANT

I request that you:
1. Investigate this complaint fully
2. ${issueType === "speed" ? "Either fix the speed issue within 30 days or allow me to exit my contract penalty-free" : "Resolve this issue promptly"}
3. Provide compensation for the service failures I have experienced
4. Respond to this complaint within 14 days

NEXT STEPS

If I do not receive a satisfactory response within 8 weeks, I will escalate this complaint to the Communications Ombudsman (CISAS or Ombudsman Services).

Please confirm receipt of this complaint.

Yours faithfully,

${yourName || "[Your Name]"}

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
    setProvider("")
    setIssueType("")
    setPromisedSpeed("")
    setActualSpeed("")
    setAccountNumber("")
    setYourName("")
    setDetails("")
    setResult(null)
    setError("")
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Your Complaint Letter</h2>
          <Button variant="ghost" size="sm" onClick={handleReset}>Start again</Button>
        </div>

        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Complaint Letter</h3>
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
            Send this to your provider's complaints department.
          </p>
        </div>

        <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg text-white">
          <h3 className="font-semibold text-lg mb-2">Provider Not Helping?</h3>
          <p className="text-forest-100 mb-4">
            After 8 weeks, you can escalate to the Communications Ombudsman for free.
          </p>
          <Button asChild variant="coral">
            <Link href={`/new?tool=broadband&provider=${encodeURIComponent(provider)}`}>
              Get Help Escalating
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
        <Label htmlFor="provider">Broadband provider</Label>
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger id="provider"><SelectValue placeholder="Select provider" /></SelectTrigger>
          <SelectContent>
            {providers.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="issue-type">What's the problem?</Label>
        <Select value={issueType} onValueChange={(value) => setIssueType(value as IssueType)}>
          <SelectTrigger id="issue-type"><SelectValue placeholder="Select issue" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="speed">Speed is too slow</SelectItem>
            <SelectItem value="outage">Service outages</SelectItem>
            <SelectItem value="installation">Installation problems</SelectItem>
            <SelectItem value="billing">Billing errors</SelectItem>
            <SelectItem value="service">Poor customer service</SelectItem>
            <SelectItem value="other">Other issue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {issueType === "speed" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="promised-speed">Promised speed (Mbps)</Label>
            <Input id="promised-speed" type="text" placeholder="e.g. 100" value={promisedSpeed} onChange={(e) => setPromisedSpeed(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actual-speed">Actual speed (Mbps)</Label>
            <Input id="actual-speed" type="text" placeholder="e.g. 20" value={actualSpeed} onChange={(e) => setActualSpeed(e.target.value)} />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="account-number">Account number</Label>
        <Input id="account-number" type="text" placeholder="Your account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="your-name">Your name</Label>
        <Input id="your-name" type="text" placeholder="Your full name" value={yourName} onChange={(e) => setYourName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Additional details</Label>
        <Textarea id="details" placeholder="Describe the issue in more detail..." value={details} onChange={(e) => setDetails(e.target.value)} rows={4} />
      </div>

      {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">{error}</div>}

      <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12">
        Generate Complaint Letter
        <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
      </Button>

      <p className="text-xs text-center text-muted-foreground">Free tool. No account required.</p>
    </form>
  )
}
