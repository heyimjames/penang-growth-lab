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

type IssueType = "overcharge" | "estimate" | "backbill" | "switching" | "smartmeter" | "directdebit" | "other"
type EnergyType = "gas" | "electricity" | "both"

const suppliers = [
  "British Gas",
  "EDF Energy",
  "E.ON",
  "Scottish Power",
  "SSE",
  "Octopus Energy",
  "Bulb",
  "OVO Energy",
  "Shell Energy",
  "Utility Warehouse",
  "Other",
]

interface ComplaintResult {
  issueType: IssueType
  letterTemplate: string
  yourRights: string[]
  nextSteps: string[]
  warnings: string[]
  deadline: string
}

function generateComplaintLetter(
  supplier: string,
  issueType: IssueType,
  energyType: EnergyType,
  accountNumber: string,
  yourName: string,
  yourAddress: string,
  amountDisputed: string,
  details: string
): string {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

  const issueDescriptions: Record<IssueType, string> = {
    overcharge: `I have been overcharged on my ${energyType === "both" ? "gas and electricity" : energyType} bill. ${amountDisputed ? `The amount in dispute is approximately £${amountDisputed}.` : ""} The charges do not reflect my actual usage and appear to be significantly higher than expected.`,
    estimate: `My bill is based on estimated readings that do not accurately reflect my actual usage. I have provided/am providing actual meter readings which show that the estimated consumption is incorrect. I request that my bill be recalculated based on actual meter readings.`,
    backbill: `I have received a bill for energy usage from more than 12 months ago. Under Ofgem's back-billing rules, suppliers cannot charge for unbilled energy that is more than 12 months old where the customer is not at fault. I did not prevent you from obtaining accurate readings, therefore I dispute any charges relating to periods more than 12 months ago.`,
    switching: `I experienced problems when switching ${energyType === "both" ? "suppliers" : `my ${energyType} supplier`}. ${details || "The switch was not completed correctly, resulting in billing errors and inconvenience."}`,
    smartmeter: `I am experiencing issues with my smart meter which is providing incorrect readings. ${details || "The meter appears to be faulty and is recording usage that does not match my actual consumption."}`,
    directdebit: `There are problems with my direct debit payments. ${details || "The amount being taken does not match what was agreed, or refunds owed have not been processed."}`,
    other: details || "I am writing to make a formal complaint about my account.",
  }

  const energyTypeText = energyType === "both" ? "gas and electricity" : energyType

  return `${today}

${supplier}
Customer Services
[Supplier Address]

Dear Sir/Madam,

Re: Formal Complaint - ${energyTypeText.charAt(0).toUpperCase() + energyTypeText.slice(1)} Account
Account Number: ${accountNumber || "[Your Account Number]"}
Property Address: ${yourAddress || "[Your Address]"}

I am writing to make a formal complaint regarding my ${energyTypeText} account.

THE ISSUE

${issueDescriptions[issueType]}

${details && issueType !== "other" ? `\nADDITIONAL DETAILS\n\n${details}\n` : ""}

MY RIGHTS

I am aware of my rights under:
- The Gas and Electricity (Consumer Complaints Handling Standards) Regulations
- Ofgem's Standards of Conduct requiring fair treatment
- The Energy Supply Licence Conditions
${issueType === "backbill" ? "- Ofgem's back-billing rules limiting charges to 12 months\n" : ""}
WHAT I WANT

I request that you:
1. Investigate this complaint fully
2. ${issueType === "overcharge" || issueType === "estimate" ? "Recalculate my bill based on accurate information" : issueType === "backbill" ? "Remove all charges relating to periods more than 12 months ago" : "Resolve this issue promptly"}
3. ${amountDisputed ? `Refund the amount I have been overcharged (approximately £${amountDisputed})` : "Correct any billing errors and process appropriate refunds"}
4. Provide a written response to this complaint

NEXT STEPS

I expect a response within 14 days. If I do not receive a satisfactory response, or if the matter is not resolved within 8 weeks, I will escalate this complaint to the Energy Ombudsman.

Please confirm receipt of this complaint.

Yours faithfully,

${yourName || "[Your Name]"}

---
Generated using NoReply (usenoreply.com)
Sent: ${today}
`.trim()
}

function ResultCard({ result, supplier }: { result: ComplaintResult; supplier: string }) {
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
        <h3 className="font-semibold text-foreground mb-4">Complaint Summary</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-forest-50 dark:bg-forest-900/20 rounded-md">
            <span className="text-xs text-muted-foreground block mb-1">Supplier</span>
            <span className="font-medium text-foreground">{supplier}</span>
          </div>
          <div className="p-4 bg-forest-50 dark:bg-forest-900/20 rounded-md">
            <span className="text-xs text-muted-foreground block mb-1">Response Deadline</span>
            <span className="font-medium text-foreground">{result.deadline}</span>
          </div>
        </div>
      </div>

      {/* Your Rights */}
      <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Your Rights</h3>
        <ul className="space-y-2">
          {result.yourRights.map((right, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{right}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Generated Letter */}
      <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Your Complaint Letter</h3>
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

      {/* CTA */}
      <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg text-white">
        <h3 className="font-semibold text-lg mb-2">Not Getting Anywhere?</h3>
        <p className="text-forest-100 mb-4">
          If your supplier doesn&apos;t resolve your complaint within 8 weeks, you can escalate to the Energy Ombudsman for free.
        </p>
        <Button asChild variant="coral">
          <Link href={`/new?tool=energy-complaint&supplier=${encodeURIComponent(supplier)}`} className="flex items-center">
            Get Help Escalating
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function EnergyBillComplaintForm() {
  const [supplier, setSupplier] = useState("")
  const [issueType, setIssueType] = useState<IssueType | "">("")
  const [energyType, setEnergyType] = useState<EnergyType | "">("")
  const [accountNumber, setAccountNumber] = useState("")
  const [yourName, setYourName] = useState("")
  const [yourAddress, setYourAddress] = useState("")
  const [amountDisputed, setAmountDisputed] = useState("")
  const [details, setDetails] = useState("")
  const [result, setResult] = useState<ComplaintResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!supplier) {
      setError("Please select your energy supplier")
      return
    }

    if (!issueType) {
      setError("Please select the type of issue")
      return
    }

    if (!energyType) {
      setError("Please select gas, electricity, or both")
      return
    }

    const letterTemplate = generateComplaintLetter(
      supplier,
      issueType,
      energyType,
      accountNumber,
      yourName,
      yourAddress,
      amountDisputed,
      details
    )

    const yourRights = [
      "Suppliers must resolve complaints within 8 weeks",
      "You cannot be disconnected while a complaint is being investigated",
      "Back-billing is limited to 12 months for accurate bills",
      "You have the right to actual meter readings, not estimates",
      "After 8 weeks, you can escalate to the Energy Ombudsman for free",
    ]

    if (issueType === "backbill") {
      yourRights.unshift("Ofgem's back-billing rules prevent charging for energy used over 12 months ago")
    }

    const nextSteps = [
      "Send this complaint letter by email or post",
      "Keep a copy and note the date you sent it",
      "Allow 8 weeks for them to resolve the issue",
      "If unresolved, escalate to the Energy Ombudsman",
      "Continue paying undisputed amounts to protect your supply",
    ]

    const warnings = []
    if (issueType === "directdebit") {
      warnings.push("Don't cancel your direct debit without agreement - this could affect your credit and tariff")
    }

    setResult({
      issueType,
      letterTemplate,
      yourRights,
      nextSteps,
      warnings,
      deadline: "8 weeks for resolution, or you can escalate to the Ombudsman",
    })
  }

  const handleReset = () => {
    setSupplier("")
    setIssueType("")
    setEnergyType("")
    setAccountNumber("")
    setYourName("")
    setYourAddress("")
    setAmountDisputed("")
    setDetails("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Supplier */}
          <div className="space-y-2">
            <Label htmlFor="supplier">Energy supplier</Label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger id="supplier">
                <SelectValue placeholder="Select your supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Energy Type */}
          <div className="space-y-2">
            <Label htmlFor="energy-type">Which service?</Label>
            <Select value={energyType} onValueChange={(value) => setEnergyType(value as EnergyType)}>
              <SelectTrigger id="energy-type">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gas">Gas only</SelectItem>
                <SelectItem value="electricity">Electricity only</SelectItem>
                <SelectItem value="both">Both gas and electricity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Issue Type */}
          <div className="space-y-2">
            <Label htmlFor="issue-type">What&apos;s the problem?</Label>
            <Select value={issueType} onValueChange={(value) => setIssueType(value as IssueType)}>
              <SelectTrigger id="issue-type">
                <SelectValue placeholder="Select the issue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overcharge">Overcharged / bill too high</SelectItem>
                <SelectItem value="estimate">Incorrect estimated bill</SelectItem>
                <SelectItem value="backbill">Back-billing (charged for old usage)</SelectItem>
                <SelectItem value="switching">Problems switching supplier</SelectItem>
                <SelectItem value="smartmeter">Smart meter issues</SelectItem>
                <SelectItem value="directdebit">Direct debit problems</SelectItem>
                <SelectItem value="other">Other issue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Details */}
          <div className="space-y-2">
            <Label htmlFor="account-number">Account number (optional)</Label>
            <Input
              id="account-number"
              type="text"
              placeholder="Your account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="your-address">Your address</Label>
            <Input
              id="your-address"
              type="text"
              placeholder="Address where energy is supplied"
              value={yourAddress}
              onChange={(e) => setYourAddress(e.target.value)}
            />
          </div>

          {/* Amount Disputed */}
          {(issueType === "overcharge" || issueType === "estimate" || issueType === "backbill") && (
            <div className="space-y-2">
              <Label htmlFor="amount-disputed">Approximate amount in dispute (£)</Label>
              <Input
                id="amount-disputed"
                type="text"
                placeholder="e.g. 250"
                value={amountDisputed}
                onChange={(e) => setAmountDisputed(e.target.value.replace(/[^0-9.]/g, ""))}
              />
            </div>
          )}

          {/* Additional Details */}
          <div className="space-y-2">
            <Label htmlFor="details">Additional details</Label>
            <Textarea
              id="details"
              placeholder="Describe the issue in more detail..."
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
            Generate Complaint Letter
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Complaint</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Start again
            </Button>
          </div>
          <ResultCard result={result} supplier={supplier} />
        </div>
      )}
    </div>
  )
}
