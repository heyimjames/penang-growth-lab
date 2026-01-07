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

type RequestType = "access" | "erasure" | "rectification" | "portability" | "object" | "withdraw"
type Country = "uk" | "us" | "eu" | "au" | "ca"

interface RequestResult {
  requestType: RequestType
  letterTemplate: string
  yourRights: string[]
  nextSteps: string[]
  deadline: string
  escalation: string
}

function generateRequestLetter(
  requestType: RequestType,
  organizationName: string,
  yourName: string,
  yourEmail: string,
  yourAddress: string,
  accountInfo: string,
  country: Country,
  specificData: string
): string {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

  const lawReference = country === "uk"
    ? "UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018"
    : country === "eu"
    ? "General Data Protection Regulation (EU) 2016/679"
    : country === "us"
    ? "applicable data protection laws including the California Consumer Privacy Act (CCPA) where applicable"
    : country === "au"
    ? "Australian Privacy Principles under the Privacy Act 1988"
    : "applicable Canadian privacy legislation including PIPEDA"

  const requestDescriptions: Record<RequestType, { title: string; body: string; articles: string }> = {
    access: {
      title: "Subject Access Request",
      body: `I am making a Subject Access Request under ${lawReference}.

I request that you provide me with:
1. Confirmation of whether you are processing my personal data
2. A copy of all personal data you hold about me
3. The purposes of the processing
4. The categories of personal data concerned
5. The recipients to whom my data has been disclosed
6. The retention period for my data
7. Information about the source of any data not collected from me directly
8. Whether my data is used for automated decision-making or profiling

${specificData ? `I am particularly interested in:\n${specificData}\n` : ""}`,
      articles: country === "uk" || country === "eu" ? "Article 15 of the GDPR" : "relevant data protection law",
    },
    erasure: {
      title: "Right to Erasure Request (Right to be Forgotten)",
      body: `I am requesting the erasure of my personal data under ${lawReference}.

I request that you delete all personal data you hold about me because:
- I withdraw my consent to processing (where consent was the basis)
- The data is no longer necessary for the purpose it was collected
- I object to the processing and there are no overriding legitimate grounds
- The data has been unlawfully processed

${specificData ? `Specifically, I request deletion of:\n${specificData}\n` : "Please delete all data associated with my account and records."}`,
      articles: country === "uk" || country === "eu" ? "Article 17 of the GDPR" : "relevant data protection law",
    },
    rectification: {
      title: "Right to Rectification Request",
      body: `I am requesting the rectification of inaccurate personal data under ${lawReference}.

The following personal data you hold about me is inaccurate and needs to be corrected:

${specificData || "[Please describe the inaccurate data and the correct information]"}

Please update your records accordingly and confirm once this has been done.`,
      articles: country === "uk" || country === "eu" ? "Article 16 of the GDPR" : "relevant data protection law",
    },
    portability: {
      title: "Right to Data Portability Request",
      body: `I am requesting a copy of my personal data in a portable format under ${lawReference}.

I request that you provide:
1. All personal data I have provided to you
2. In a structured, commonly used, and machine-readable format (such as JSON or CSV)
3. So that I can transmit this data to another controller

${specificData ? `Specifically, I request:\n${specificData}\n` : "Please include all data I have provided through my use of your service."}`,
      articles: country === "uk" || country === "eu" ? "Article 20 of the GDPR" : "relevant data protection law",
    },
    object: {
      title: "Right to Object Request",
      body: `I am exercising my right to object to the processing of my personal data under ${lawReference}.

I object to:
${specificData || "- Processing of my data for direct marketing purposes\n- Processing based on legitimate interests or public interest\n- Profiling related to the above"}

Please cease all processing that I have objected to and confirm this has been done.`,
      articles: country === "uk" || country === "eu" ? "Article 21 of the GDPR" : "relevant data protection law",
    },
    withdraw: {
      title: "Withdrawal of Consent",
      body: `I am withdrawing my consent to the processing of my personal data under ${lawReference}.

I previously provided consent for you to process my data. I now wish to withdraw that consent with immediate effect.

${specificData ? `Specifically, I withdraw consent for:\n${specificData}\n` : "This withdrawal applies to all purposes for which I previously gave consent."}

Please confirm that:
1. You have stopped processing my data based on consent
2. Any data processed solely on the basis of consent will be deleted (unless another lawful basis applies)`,
      articles: country === "uk" || country === "eu" ? "Article 7(3) of the GDPR" : "relevant data protection law",
    },
  }

  const request = requestDescriptions[requestType]

  return `${today}

Data Protection Officer / Privacy Team
${organizationName}
[Organization Address]

Dear Sir/Madam,

Re: ${request.title}

${request.body}

VERIFICATION INFORMATION

To help you locate my records:
- Full Name: ${yourName || "[Your Name]"}
- Email Address: ${yourEmail || "[Your Email]"}
${yourAddress ? `- Address: ${yourAddress}` : ""}
${accountInfo ? `- Account/Reference: ${accountInfo}` : ""}

LEGAL BASIS

This request is made pursuant to ${request.articles}. You are required to respond within one calendar month of receipt of this request.

RESPONSE REQUIRED

Please confirm:
1. Receipt of this request
2. The actions you will take
3. The timeline for completion

If you require additional information to verify my identity, please contact me promptly.

If you believe you are not required to comply with this request, please provide your legal reasoning in writing.

Yours faithfully,

${yourName || "[Your Name]"}
${yourEmail || "[Your Email]"}

---
Generated using NoReply (usenoreply.com)
Sent: ${today}
`.trim()
}

function ResultCard({ result, organizationName }: { result: RequestResult; organizationName: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.letterTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const requestTypeNames: Record<RequestType, string> = {
    access: "Subject Access Request",
    erasure: "Right to Erasure",
    rectification: "Right to Rectification",
    portability: "Data Portability",
    object: "Right to Object",
    withdraw: "Withdraw Consent",
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary */}
      <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Request Summary</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-forest-50 dark:bg-forest-900/20 rounded-md">
            <span className="text-xs text-muted-foreground block mb-1">Request Type</span>
            <span className="font-medium text-foreground">{requestTypeNames[result.requestType]}</span>
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
          <h3 className="font-semibold text-foreground">Your Request Letter</h3>
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
          Send this by email to their DPO or privacy contact. Keep a copy.
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

      {/* CTA */}
      <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg text-white">
        <h3 className="font-semibold text-lg mb-2">Request Ignored?</h3>
        <p className="text-forest-100 mb-4">{result.escalation}</p>
        <Button asChild variant="coral">
          <Link href={`/new?tool=gdpr-complaint&org=${encodeURIComponent(organizationName)}`} className="flex items-center">
            Get Help Escalating
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function GdprRequestForm() {
  const [requestType, setRequestType] = useState<RequestType | "">("")
  const [country, setCountry] = useState<Country | "">("")
  const [organizationName, setOrganizationName] = useState("")
  const [yourName, setYourName] = useState("")
  const [yourEmail, setYourEmail] = useState("")
  const [yourAddress, setYourAddress] = useState("")
  const [accountInfo, setAccountInfo] = useState("")
  const [specificData, setSpecificData] = useState("")
  const [result, setResult] = useState<RequestResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!requestType) {
      setError("Please select the type of request")
      return
    }

    if (!country) {
      setError("Please select your country")
      return
    }

    if (!organizationName) {
      setError("Please enter the organization name")
      return
    }

    const letterTemplate = generateRequestLetter(
      requestType,
      organizationName,
      yourName,
      yourEmail,
      yourAddress,
      accountInfo,
      country,
      specificData
    )

    const yourRights = [
      "Organizations must respond within one calendar month",
      "Requests are free (except for manifestly excessive requests)",
      "They can extend the deadline by two months for complex requests",
      "They must explain any extension within the first month",
      "You can complain to the data protection authority if they don't comply",
    ]

    if (requestType === "erasure") {
      yourRights.push("Some data may be exempt from erasure (legal obligations, public interest)")
    }

    const nextSteps = [
      "Find the organization's DPO or privacy contact email",
      "Send this request by email and keep a copy",
      "Note the date you sent it (deadline is 1 month from then)",
      "If no response after 30 days, send a follow-up",
      "If still no response, escalate to the data protection authority",
    ]

    const escalation = country === "uk"
      ? "You can complain to the ICO (Information Commissioner's Office) for free. They have the power to investigate and fine organizations."
      : country === "eu"
      ? "You can complain to your national Data Protection Authority. They can investigate and impose significant fines."
      : "You can file a complaint with the relevant data protection authority in your jurisdiction."

    setResult({
      requestType,
      letterTemplate,
      yourRights,
      nextSteps,
      deadline: "One calendar month from receipt",
      escalation,
    })
  }

  const handleReset = () => {
    setRequestType("")
    setCountry("")
    setOrganizationName("")
    setYourName("")
    setYourEmail("")
    setYourAddress("")
    setAccountInfo("")
    setSpecificData("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Type */}
          <div className="space-y-2">
            <Label htmlFor="request-type">What do you want to do?</Label>
            <Select value={requestType} onValueChange={(value) => setRequestType(value as RequestType)}>
              <SelectTrigger id="request-type">
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="access">Access my data (Subject Access Request)</SelectItem>
                <SelectItem value="erasure">Delete my data (Right to Erasure)</SelectItem>
                <SelectItem value="rectification">Correct my data (Right to Rectification)</SelectItem>
                <SelectItem value="portability">Get my data in portable format</SelectItem>
                <SelectItem value="object">Object to processing</SelectItem>
                <SelectItem value="withdraw">Withdraw consent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Your location</Label>
            <Select value={country} onValueChange={(value) => setCountry(value as Country)}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uk">United Kingdom (UK GDPR)</SelectItem>
                <SelectItem value="eu">European Union (EU GDPR)</SelectItem>
                <SelectItem value="us">United States (CCPA/State Laws)</SelectItem>
                <SelectItem value="au">Australia (Privacy Act)</SelectItem>
                <SelectItem value="ca">Canada (PIPEDA)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="organization-name">Organization name</Label>
            <Input
              id="organization-name"
              type="text"
              placeholder="e.g. Facebook, Amazon, your bank"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>

          {/* Your Details */}
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
            <Label htmlFor="your-email">Your email</Label>
            <Input
              id="your-email"
              type="email"
              placeholder="Email associated with your account"
              value={yourEmail}
              onChange={(e) => setYourEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="your-address">Your address (optional)</Label>
            <Input
              id="your-address"
              type="text"
              placeholder="Helps verify your identity"
              value={yourAddress}
              onChange={(e) => setYourAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-info">Account/Reference number (optional)</Label>
            <Input
              id="account-info"
              type="text"
              placeholder="Any account or customer number"
              value={accountInfo}
              onChange={(e) => setAccountInfo(e.target.value)}
            />
          </div>

          {/* Specific Data */}
          <div className="space-y-2">
            <Label htmlFor="specific-data">Specific details (optional)</Label>
            <Textarea
              id="specific-data"
              placeholder={
                requestType === "access"
                  ? "Any specific data you're looking for..."
                  : requestType === "erasure"
                  ? "Specific data you want deleted..."
                  : requestType === "rectification"
                  ? "What's wrong and what should it say..."
                  : "Additional details about your request..."
              }
              value={specificData}
              onChange={(e) => setSpecificData(e.target.value)}
              rows={4}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12">
            Generate Request Letter
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Request</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Start again
            </Button>
          </div>
          <ResultCard result={result} organizationName={organizationName} />
        </div>
      )}
    </div>
  )
}
