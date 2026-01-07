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
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Calendar01Icon,
  Globe02Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type Country = "uk" | "us" | "eu" | "au" | "ca" | "other"
type Industry = "finance" | "energy" | "telecoms" | "retail" | "travel" | "insurance" | "other"
type ComplaintMethod = "email" | "letter" | "phone" | "social" | "online-form"

const countryConfig: Record<Country, { name: string; flag: string }> = {
  uk: { name: "United Kingdom", flag: "🇬🇧" },
  us: { name: "United States", flag: "🇺🇸" },
  eu: { name: "European Union", flag: "🇪🇺" },
  au: { name: "Australia", flag: "🇦🇺" },
  ca: { name: "Canada", flag: "🇨🇦" },
  other: { name: "Other Country", flag: "🌍" },
}

interface DeadlineResult {
  daysElapsed: number
  regulatoryDeadline: number | null
  bestPracticeDeadline: number
  isOverdue: boolean
  daysRemaining: number | null
  daysOverdue: number | null
  deadlineDate: string | null
  acknowledgmentExpected: boolean
  acknowledgmentDays: number
  regulation: string | null
  escalationOptions: string[]
  nextSteps: string[]
  warnings: string[]
  country: Country
}

interface IndustryDeadline {
  regulatory: number | null
  regulation: string | null
  bestPractice: number
}

const industryDeadlinesByCountry: Record<Country, Record<Industry, IndustryDeadline>> = {
  uk: {
    finance: { regulatory: 56, regulation: "FCA DISP rules", bestPractice: 14 },
    energy: { regulatory: 56, regulation: "Ofgem complaint handling standards", bestPractice: 14 },
    telecoms: { regulatory: 56, regulation: "Ofcom General Conditions", bestPractice: 14 },
    insurance: { regulatory: 56, regulation: "FCA DISP rules", bestPractice: 14 },
    retail: { regulatory: null, regulation: null, bestPractice: 14 },
    travel: { regulatory: null, regulation: null, bestPractice: 28 },
    other: { regulatory: null, regulation: null, bestPractice: 14 },
  },
  us: {
    finance: { regulatory: 15, regulation: "CFPB complaint handling", bestPractice: 14 },
    energy: { regulatory: null, regulation: null, bestPractice: 30 },
    telecoms: { regulatory: 30, regulation: "FCC complaint requirements", bestPractice: 14 },
    insurance: { regulatory: 30, regulation: "State insurance commissioner rules", bestPractice: 14 },
    retail: { regulatory: null, regulation: null, bestPractice: 14 },
    travel: { regulatory: null, regulation: null, bestPractice: 30 },
    other: { regulatory: null, regulation: null, bestPractice: 14 },
  },
  eu: {
    finance: { regulatory: 35, regulation: "EU Payment Services Directive", bestPractice: 14 },
    energy: { regulatory: null, regulation: null, bestPractice: 28 },
    telecoms: { regulatory: 30, regulation: "EECC (EU Electronic Communications Code)", bestPractice: 14 },
    insurance: { regulatory: 56, regulation: "National insurance regulations", bestPractice: 14 },
    retail: { regulatory: null, regulation: null, bestPractice: 14 },
    travel: { regulatory: 42, regulation: "EU Package Travel Directive", bestPractice: 28 },
    other: { regulatory: null, regulation: null, bestPractice: 14 },
  },
  au: {
    finance: { regulatory: 45, regulation: "AFCA rules", bestPractice: 21 },
    energy: { regulatory: 20, regulation: "Energy Ombudsman standards", bestPractice: 14 },
    telecoms: { regulatory: 15, regulation: "TIO complaint handling", bestPractice: 10 },
    insurance: { regulatory: 45, regulation: "AFCA rules", bestPractice: 21 },
    retail: { regulatory: null, regulation: null, bestPractice: 14 },
    travel: { regulatory: null, regulation: null, bestPractice: 28 },
    other: { regulatory: null, regulation: null, bestPractice: 14 },
  },
  ca: {
    finance: { regulatory: 90, regulation: "OBSI complaint handling", bestPractice: 14 },
    energy: { regulatory: null, regulation: null, bestPractice: 30 },
    telecoms: { regulatory: 30, regulation: "CCTS complaint requirements", bestPractice: 14 },
    insurance: { regulatory: 90, regulation: "Provincial insurance rules", bestPractice: 14 },
    retail: { regulatory: null, regulation: null, bestPractice: 14 },
    travel: { regulatory: null, regulation: null, bestPractice: 30 },
    other: { regulatory: null, regulation: null, bestPractice: 14 },
  },
  other: {
    finance: { regulatory: null, regulation: null, bestPractice: 30 },
    energy: { regulatory: null, regulation: null, bestPractice: 30 },
    telecoms: { regulatory: null, regulation: null, bestPractice: 30 },
    insurance: { regulatory: null, regulation: null, bestPractice: 30 },
    retail: { regulatory: null, regulation: null, bestPractice: 14 },
    travel: { regulatory: null, regulation: null, bestPractice: 30 },
    other: { regulatory: null, regulation: null, bestPractice: 14 },
  },
}

const escalationOptionsByCountry: Record<Country, Record<Industry, string[]>> = {
  uk: {
    finance: ["Financial Ombudsman Service (after 8 weeks)", "FCA complaint handling review"],
    insurance: ["Financial Ombudsman Service (after 8 weeks)", "FCA complaint handling review"],
    energy: ["Energy Ombudsman (after 8 weeks)", "Contact Ofgem for serious issues"],
    telecoms: ["Ombudsman Services: Communications or CISAS", "Report to Ofcom for regulatory breaches"],
    travel: ["ABTA if they're a member", "Small claims court for refunds"],
    retail: ["Small claims court for amounts up to £10,000", "Trading Standards for advice"],
    other: ["Small claims court for amounts up to £10,000", "Citizens Advice for guidance"],
  },
  us: {
    finance: ["File complaint with CFPB", "Contact your state Attorney General"],
    insurance: ["File with State Insurance Commissioner", "Contact your state Attorney General"],
    energy: ["Contact state utility regulator", "File with state Attorney General"],
    telecoms: ["File complaint with FCC", "Contact state consumer protection office"],
    travel: ["File with DOT for airlines", "State consumer protection for other travel"],
    retail: ["File with FTC", "Contact your state Attorney General", "Small claims court"],
    other: ["File with FTC", "Contact your state consumer protection office"],
  },
  eu: {
    finance: ["National financial ombudsman/ADR body", "European Consumer Centre (ECC)"],
    insurance: ["National insurance ombudsman", "European Consumer Centre (ECC)"],
    energy: ["National energy regulator", "European Consumer Centre (ECC)"],
    telecoms: ["National telecoms regulator", "Use EU ODR platform for cross-border"],
    travel: ["National consumer body", "European Consumer Centre for cross-border"],
    retail: ["Use EU ODR platform", "National consumer protection authority"],
    other: ["EU ODR platform for online disputes", "National consumer protection authority"],
  },
  au: {
    finance: ["AFCA (Australian Financial Complaints Authority)", "ASIC for regulatory breaches"],
    insurance: ["AFCA (Australian Financial Complaints Authority)", "ASIC for regulatory breaches"],
    energy: ["State Energy Ombudsman", "State consumer affairs office"],
    telecoms: ["TIO (Telecommunications Industry Ombudsman)", "ACMA for regulatory issues"],
    travel: ["State consumer affairs", "Small claims tribunal (NCAT/VCAT/QCAT)"],
    retail: ["State consumer affairs office", "Small claims tribunal"],
    other: ["State consumer affairs office", "Small claims tribunal"],
  },
  ca: {
    finance: ["OBSI (Ombudsman for Banking Services)", "Provincial securities regulator"],
    insurance: ["Provincial insurance ombudsman", "Provincial consumer protection"],
    energy: ["Provincial energy regulator", "Provincial consumer protection"],
    telecoms: ["CCTS (telecom) or CRTC", "Provincial consumer protection"],
    travel: ["Provincial consumer protection", "Small claims court"],
    retail: ["Provincial consumer protection office", "Small claims court"],
    other: ["Provincial consumer protection", "Small claims court"],
  },
  other: {
    finance: ["National financial regulator", "Local consumer protection authority"],
    insurance: ["National insurance regulator", "Local consumer protection authority"],
    energy: ["National energy regulator", "Local consumer protection authority"],
    telecoms: ["National telecoms regulator", "Local consumer protection authority"],
    travel: ["Tourism or transport authority", "Local consumer protection"],
    retail: ["Local consumer protection authority", "Small claims or equivalent court"],
    other: ["Local consumer protection authority", "Legal advice service"],
  },
}

function calculateDeadline(
  country: Country,
  complaintDate: string,
  industry: Industry,
  complaintMethod: ComplaintMethod
): DeadlineResult {
  const now = new Date()
  const complaint = new Date(complaintDate)
  const daysElapsed = Math.floor((now.getTime() - complaint.getTime()) / (1000 * 60 * 60 * 24))

  const { regulatory: regulatoryDeadline, regulation, bestPractice: bestPracticeDeadline } = industryDeadlinesByCountry[country][industry]

  const mainDeadline = regulatoryDeadline || bestPracticeDeadline
  const daysRemaining = Math.max(0, mainDeadline - daysElapsed)
  const isOverdue = daysElapsed > mainDeadline
  const daysOverdue = isOverdue ? daysElapsed - mainDeadline : null

  const deadlineDate = new Date(complaint)
  deadlineDate.setDate(deadlineDate.getDate() + mainDeadline)

  // Acknowledgment expectations
  const acknowledgmentDays = complaintMethod === "letter" ? 5 : 3
  const acknowledgmentExpected = daysElapsed >= acknowledgmentDays

  const escalationOptions: string[] = [...escalationOptionsByCountry[country][industry]]
  const nextSteps: string[] = []
  const warnings: string[] = []

  // Build next steps based on status
  if (daysElapsed < acknowledgmentDays) {
    nextSteps.push(`Wait for acknowledgment (expected within ${acknowledgmentDays} working days)`)
    nextSteps.push("Keep a record of when you complained")
  } else if (!isOverdue) {
    if (daysElapsed < 14) {
      nextSteps.push("Allow reasonable time for a full response")
      nextSteps.push("Prepare any additional evidence you have")
    } else {
      nextSteps.push("Send a follow-up asking for a status update")
      nextSteps.push("Reference your original complaint date")
      nextSteps.push("Set a deadline for their response (7-14 days)")
    }
  } else {
    nextSteps.push("Send a final follow-up letter with a 7-day deadline")
    nextSteps.push("Mention you'll escalate if they don't respond")
    if (regulatoryDeadline) {
      nextSteps.push("Prepare your escalation to the relevant ombudsman")
      nextSteps.push("Request a 'deadlock letter' if they won't resolve it")
    } else {
      nextSteps.push("Consider sending a Letter Before Action for court")
    }
  }

  // Add warnings
  if (isOverdue && regulatoryDeadline) {
    warnings.push("The company has exceeded the regulatory deadline")
    warnings.push("You can now escalate to the ombudsman without waiting further")
  } else if (isOverdue) {
    warnings.push("The company hasn't responded within a reasonable timeframe")
  }

  if (daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0) {
    warnings.push(`Only ${daysRemaining} days until the deadline`)
  }

  if (complaintMethod === "phone") {
    warnings.push("Phone complaints are harder to prove - follow up in writing")
  }

  return {
    daysElapsed,
    regulatoryDeadline,
    bestPracticeDeadline,
    isOverdue,
    daysRemaining: isOverdue ? null : daysRemaining,
    daysOverdue,
    deadlineDate: deadlineDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    acknowledgmentExpected,
    acknowledgmentDays,
    regulation,
    escalationOptions,
    nextSteps,
    warnings,
    country,
  }
}

function StatusBadge({ result }: { result: DeadlineResult }) {
  if (result.isOverdue) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 border border-red-200 text-sm font-medium">
        <Icon icon={AlertCircleIcon} size={18} />
        {result.daysOverdue} Days Overdue
      </div>
    )
  }

  const isUrgent = result.daysRemaining !== null && result.daysRemaining <= 7

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium",
      isUrgent
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-green-100 text-green-700 border-green-200"
    )}>
      <Icon icon={Clock01Icon} size={18} />
      {result.daysRemaining} Days Remaining
    </div>
  )
}

function ProgressBar({ result }: { result: DeadlineResult }) {
  const deadline = result.regulatoryDeadline || result.bestPracticeDeadline
  const progress = Math.min(100, (result.daysElapsed / deadline) * 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Day {result.daysElapsed}</span>
        <span>Deadline: Day {deadline}</span>
      </div>
      <div className="h-3 bg-forest-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            result.isOverdue
              ? "bg-red-500"
              : progress > 75
                ? "bg-amber-500"
                : "bg-forest-500"
          )}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  )
}

function ResultCard({ result }: { result: DeadlineResult }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Status Summary */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <StatusBadge result={result} />
          {result.regulation && (
            <span className="text-xs px-3 py-1 rounded-full bg-lavender-100 text-lavender-700">
              {result.regulation}
            </span>
          )}
        </div>

        <ProgressBar result={result} />

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-forest-50 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Icon icon={Calendar01Icon} size={16} className="text-forest-500" />
              <span className="text-xs text-muted-foreground">Deadline Date</span>
            </div>
            <span className="font-semibold text-foreground">{result.deadlineDate}</span>
          </div>
          <div className="p-4 bg-forest-50 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Icon icon={Clock01Icon} size={16} className="text-forest-500" />
              <span className="text-xs text-muted-foreground">Days Elapsed</span>
            </div>
            <span className="font-semibold text-foreground">{result.daysElapsed} days</span>
          </div>
        </div>

        {!result.acknowledgmentExpected && (
          <p className="text-sm text-muted-foreground mt-4">
            Acknowledgment expected within {result.acknowledgmentDays} working days of your complaint.
          </p>
        )}
      </div>

      {/* Next Steps */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">What to Do Next</h3>
        <ol className="space-y-3">
          {result.nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-forest-100 text-forest-600 text-sm font-medium flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Escalation Options */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Escalation Options</h3>
        <ul className="space-y-2">
          {result.escalationOptions.map((option, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Icon icon={ArrowRight01Icon} size={14} className="text-forest-500 flex-shrink-0 mt-1" />
              <span className="text-muted-foreground">{option}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className={cn(
          "p-4 border rounded-lg",
          result.isOverdue
            ? "bg-red-50 border-red-200"
            : "bg-amber-50 border-amber-200"
        )}>
          <div className="flex items-start gap-3">
            <Icon
              icon={AlertCircleIcon}
              size={20}
              className={result.isOverdue ? "text-red-500" : "text-amber-500"}
            />
            <div className="space-y-1">
              {result.warnings.map((warning, i) => (
                <p key={i} className={cn(
                  "text-sm",
                  result.isOverdue ? "text-red-700" : "text-amber-700"
                )}>
                  {warning}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="p-6 bg-forest-500 rounded-lg text-white">
        <h3 className="font-semibold text-lg mb-2">
          {result.isOverdue ? "Ready to Escalate?" : "Need to Send a Follow-Up?"}
        </h3>
        <p className="text-forest-100 mb-4">
          {result.isOverdue
            ? "Generate a professional escalation letter or prepare your complaint to the relevant authority."
            : "Generate a follow-up letter to chase the company for a response."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="coral">
            <Link href={`/new?tool=follow-up&days=${result.daysElapsed}&country=${result.country}`} className="flex items-center">
              Generate Follow-Up Letter
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

export function ResponseDeadlineForm() {
  const [country, setCountry] = useState<Country | "">("")
  const [complaintDate, setComplaintDate] = useState("")
  const [industry, setIndustry] = useState<Industry | "">("")
  const [complaintMethod, setComplaintMethod] = useState<ComplaintMethod | "">("")
  const [result, setResult] = useState<DeadlineResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!country) {
      setError("Please select your country")
      return
    }

    if (!complaintDate) {
      setError("Please enter when you complained")
      return
    }

    if (!industry) {
      setError("Please select the industry")
      return
    }

    if (!complaintMethod) {
      setError("Please select how you complained")
      return
    }

    const deadlineResult = calculateDeadline(country, complaintDate, industry, complaintMethod)
    setResult(deadlineResult)
  }

  const handleReset = () => {
    setCountry("")
    setComplaintDate("")
    setIndustry("")
    setComplaintMethod("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Where are you located?</Label>
            <Select
              value={country}
              onValueChange={(value) => setCountry(value as Country)}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countryConfig).map(([code, { name, flag }]) => (
                  <SelectItem key={code} value={code}>
                    {flag} {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Response deadlines vary by country and industry
            </p>
          </div>

          {/* Complaint Date */}
          <div className="space-y-2">
            <Label htmlFor="complaint-date">When did you complain?</Label>
            <Input
              id="complaint-date"
              type="date"
              value={complaintDate}
              onChange={(e) => setComplaintDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
            <p className="text-xs text-muted-foreground">
              The date you first raised your complaint
            </p>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">What industry is the company in?</Label>
            <Select
              value={industry}
              onValueChange={(value) => setIndustry(value as Industry)}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finance">Financial services (bank, credit)</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="energy">Energy (gas, electricity)</SelectItem>
                <SelectItem value="telecoms">Telecoms (phone, broadband)</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="travel">Travel & holidays</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Some industries have regulatory response deadlines
            </p>
          </div>

          {/* Complaint Method */}
          <div className="space-y-2">
            <Label htmlFor="complaint-method">How did you complain?</Label>
            <Select
              value={complaintMethod}
              onValueChange={(value) => setComplaintMethod(value as ComplaintMethod)}
            >
              <SelectTrigger id="complaint-method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="online-form">Online form</SelectItem>
                <SelectItem value="letter">Letter (post)</SelectItem>
                <SelectItem value="phone">Phone call</SelectItem>
                <SelectItem value="social">Social media</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12"
          >
            Track Response Deadline
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Response Deadline Status</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Track another
            </Button>
          </div>
          <ResultCard result={result} />
        </div>
      )}
    </div>
  )
}
