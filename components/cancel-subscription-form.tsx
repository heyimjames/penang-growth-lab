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
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  Mail01Icon,
  Globe02Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type Country = "uk" | "us" | "eu" | "au" | "ca" | "other"
type Industry = "gym" | "insurance" | "broadband" | "mobile" | "streaming" | "magazine" | "utilities" | "other"
type ContractType = "rolling" | "fixed" | "unsure"
type CancelReason = "moving" | "affordability" | "service" | "better-deal" | "not-using" | "other"

const countryConfig: Record<Country, { name: string; flag: string }> = {
  uk: { name: "United Kingdom", flag: "🇬🇧" },
  us: { name: "United States", flag: "🇺🇸" },
  eu: { name: "European Union", flag: "🇪🇺" },
  au: { name: "Australia", flag: "🇦🇺" },
  ca: { name: "Canada", flag: "🇨🇦" },
  other: { name: "Other Country", flag: "🌍" },
}

interface CancellationResult {
  noticePeriod: string
  possibleFees: string[]
  regulations: string[]
  letterTemplate: string
  tips: string[]
  warnings: string[]
  country: Country
}

interface IndustryInfo {
  noticePeriod: string
  regulations: string[]
  tips: string[]
}

const industryInfoByCountry: Record<Country, Record<Industry, IndustryInfo>> = {
  uk: {
    gym: {
      noticePeriod: "Usually 1 month (check contract)",
      regulations: [
        "Consumer Rights Act 2015 applies to service quality",
        "Unfair contract terms can be challenged",
        "Moving away may trigger early exit rights",
      ],
      tips: [
        "Check if moving 15+ miles away allows early exit",
        "Gyms must accept cancellation by email or letter",
        "Don't cancel direct debit until confirmed to avoid fees",
      ],
    },
    insurance: {
      noticePeriod: "14-day cooling-off, then annual renewal",
      regulations: [
        "FCA rules require fair treatment",
        "14-day cooling-off for new policies",
        "Pro-rata refunds must be offered",
      ],
      tips: [
        "Cancel before renewal to avoid auto-renewal",
        "You may owe premium for cover you've had",
        "Check for admin fees in policy documents",
      ],
    },
    broadband: {
      noticePeriod: "30 days for rolling, or end of fixed term",
      regulations: [
        "Ofcom rules protect consumers",
        "Right to exit if speeds significantly below promised",
        "Price increases may trigger exit rights",
      ],
      tips: [
        "Use One Touch Switching if moving to new provider",
        "Early termination fees are capped and must be reasonable",
        "Complain to Ofcom if treated unfairly",
      ],
    },
    mobile: {
      noticePeriod: "30 days for SIM-only rolling, or end of contract",
      regulations: [
        "Ofcom rules protect consumers",
        "Right to exit with price increases above RPI+3.9%",
        "PAC code must be provided within 2 hours",
      ],
      tips: [
        "Request a PAC code to keep your number",
        "Early termination fees reduce monthly",
        "Check if upgrade changed your contract terms",
      ],
    },
    streaming: {
      noticePeriod: "Usually immediate or end of billing period",
      regulations: [
        "Consumer Contracts Regulations apply",
        "14-day cooling-off for new subscriptions",
      ],
      tips: [
        "Most allow immediate cancellation",
        "Check for annual vs monthly billing",
        "Some offer pause options instead",
      ],
    },
    magazine: {
      noticePeriod: "Varies by publisher",
      regulations: [
        "Consumer Contracts Regulations apply",
        "14-day cooling-off from first issue",
      ],
      tips: [
        "Cancel before renewal date",
        "Some offer partial refunds for remaining issues",
        "Direct debit doesn't cancel automatically",
      ],
    },
    utilities: {
      noticePeriod: "Usually 28 days for switching",
      regulations: [
        "Ofgem rules for energy suppliers",
        "Switching must be free of exit fees in most cases",
      ],
      tips: [
        "Use switching service to compare deals",
        "Final bill will be sent after meter reading",
        "Check if you're on a fixed deal with exit fees",
      ],
    },
    other: {
      noticePeriod: "Check your contract terms",
      regulations: [
        "Consumer Rights Act 2015",
        "Unfair Contract Terms Act",
        "Consumer Contracts Regulations 2013",
      ],
      tips: [
        "Always cancel in writing",
        "Keep proof of cancellation",
        "Check for auto-renewal clauses",
      ],
    },
  },
  us: {
    gym: {
      noticePeriod: "Varies by state (30-60 days typical)",
      regulations: [
        "State health club laws (CA, NY, IL have strong protections)",
        "FTC unfair practices rules",
        "Some states require 3-day cancellation window",
      ],
      tips: [
        "Check your state's gym membership laws",
        "Send cancellation by certified mail",
        "Some states allow cancellation if you move 25+ miles",
      ],
    },
    insurance: {
      noticePeriod: "Usually immediate or end of term",
      regulations: [
        "State insurance commissioner regulations",
        "Pro-rata refunds required in most states",
        "Free-look period varies by state (10-30 days)",
      ],
      tips: [
        "Cancel before renewal to avoid auto-renewal",
        "Request cancellation in writing",
        "File complaint with state insurance dept if issues arise",
      ],
    },
    broadband: {
      noticePeriod: "Varies by provider (30 days typical)",
      regulations: [
        "FCC rules on service agreements",
        "State consumer protection laws apply",
        "Early termination fees must be disclosed",
      ],
      tips: [
        "Return all equipment to avoid fees",
        "Get cancellation confirmation in writing",
        "File FCC complaint if provider won't cancel",
      ],
    },
    mobile: {
      noticePeriod: "Varies by carrier",
      regulations: [
        "FCC wireless consumer rules",
        "Early termination fees must be prorated",
        "Number portability required",
      ],
      tips: [
        "Port your number before cancelling",
        "Check for device payment balance",
        "Carriers must unlock phones after payoff",
      ],
    },
    streaming: {
      noticePeriod: "Usually immediate",
      regulations: [
        "FTC Act prohibits unfair practices",
        "State consumer protection laws",
      ],
      tips: [
        "Check for annual billing cycles",
        "Most services allow immediate cancellation",
        "Set calendar reminder before renewal",
      ],
    },
    magazine: {
      noticePeriod: "Varies by publisher",
      regulations: [
        "FTC Mail Order Rule for subscriptions",
        "Automatic renewal laws (varies by state)",
      ],
      tips: [
        "California, New York have strong auto-renewal laws",
        "Cancel before renewal date",
        "Request refund for remaining issues",
      ],
    },
    utilities: {
      noticePeriod: "Usually 3-5 business days",
      regulations: [
        "State Public Utility Commission rules",
        "Final bill and deposit return required",
      ],
      tips: [
        "Provide final meter reading",
        "Get deposit return timeline",
        "Contact PUC if issues with final bill",
      ],
    },
    other: {
      noticePeriod: "Check your contract terms",
      regulations: [
        "FTC Act protections",
        "State consumer protection laws",
        "Automatic renewal disclosure laws",
      ],
      tips: [
        "Cancel in writing and keep copies",
        "Dispute charges with credit card if refused",
        "File complaint with FTC or state AG",
      ],
    },
  },
  eu: {
    gym: {
      noticePeriod: "Varies by country (1-3 months typical)",
      regulations: [
        "EU Consumer Rights Directive applies",
        "14-day withdrawal right for online sign-ups",
        "Unfair contract terms directive protections",
      ],
      tips: [
        "Check local consumer protection agency rules",
        "Online sign-ups have 14-day withdrawal right",
        "Keep proof of cancellation request",
      ],
    },
    insurance: {
      noticePeriod: "14-30 days depending on type",
      regulations: [
        "Insurance Distribution Directive",
        "14-day cooling-off for most insurance",
        "30-day cooling-off for life insurance",
      ],
      tips: [
        "Exercise cooling-off right promptly",
        "Pro-rata refunds typically available",
        "Contact national insurance authority if issues",
      ],
    },
    broadband: {
      noticePeriod: "Maximum 1 month after notice",
      regulations: [
        "European Electronic Communications Code",
        "Contract cannot exceed 24 months",
        "Right to switch with 1 working day porting",
      ],
      tips: [
        "Use easy switching procedures",
        "Keep your number when switching",
        "Contact national telecom regulator if issues",
      ],
    },
    mobile: {
      noticePeriod: "Maximum 1 month after notice",
      regulations: [
        "European Electronic Communications Code",
        "Number portability within 1 working day",
        "Contract max 24 months",
      ],
      tips: [
        "Request number porting to new provider",
        "Contracts must allow exit after 24 months",
        "Contact national regulator for disputes",
      ],
    },
    streaming: {
      noticePeriod: "Usually immediate",
      regulations: [
        "Consumer Rights Directive - 14 day withdrawal",
        "Digital Content Directive protections",
      ],
      tips: [
        "14-day withdrawal right if not fully used",
        "Check billing cycle before cancelling",
        "Most EU streaming allows immediate cancellation",
      ],
    },
    magazine: {
      noticePeriod: "Varies by publisher",
      regulations: [
        "Consumer Rights Directive",
        "14-day withdrawal from delivery",
      ],
      tips: [
        "Exercise 14-day right for online subscriptions",
        "Request refund for undelivered issues",
        "Contact European Consumer Centre for cross-border issues",
      ],
    },
    utilities: {
      noticePeriod: "Usually 2-4 weeks",
      regulations: [
        "National energy regulator rules",
        "Switching must be free in most cases",
      ],
      tips: [
        "Use national comparison/switching services",
        "Final meter reading required",
        "Check for exit fees on fixed deals",
      ],
    },
    other: {
      noticePeriod: "Check your contract terms",
      regulations: [
        "EU Consumer Rights Directive",
        "Unfair Contract Terms Directive",
        "14-day withdrawal for online purchases",
      ],
      tips: [
        "Cancel in writing and keep copies",
        "Use EU ODR platform for disputes",
        "Contact European Consumer Centre",
      ],
    },
  },
  au: {
    gym: {
      noticePeriod: "Usually 14-30 days (varies by state)",
      regulations: [
        "Australian Consumer Law applies",
        "Unfair contract term protections",
        "State-specific fitness industry codes",
      ],
      tips: [
        "Check your state's fair trading rules",
        "Cooling-off period applies to door-to-door sales",
        "Gyms cannot charge unfair exit fees",
      ],
    },
    insurance: {
      noticePeriod: "Usually 14-30 days cooling-off",
      regulations: [
        "Insurance Contracts Act protections",
        "AFCA for dispute resolution",
        "Cooling-off periods vary by product",
      ],
      tips: [
        "Exercise cooling-off right promptly",
        "Pro-rata refunds typically available",
        "Contact AFCA for unresolved disputes",
      ],
    },
    broadband: {
      noticePeriod: "Varies by provider",
      regulations: [
        "Telecommunications Consumer Protections Code",
        "TIO for disputes",
        "Critical Information Summary required",
      ],
      tips: [
        "Check Critical Information Summary for exit terms",
        "Contact TIO if provider won't cancel",
        "Return equipment to avoid charges",
      ],
    },
    mobile: {
      noticePeriod: "Varies by contract type",
      regulations: [
        "Telecommunications Consumer Protections Code",
        "Number portability rights",
        "TIO for dispute resolution",
      ],
      tips: [
        "Port your number to new provider",
        "Check device repayment balance",
        "Early exit fees must be reasonable",
      ],
    },
    streaming: {
      noticePeriod: "Usually immediate",
      regulations: [
        "Australian Consumer Law",
        "Consumer guarantees apply to services",
      ],
      tips: [
        "Most allow immediate cancellation",
        "Check for annual vs monthly billing",
        "Set reminder before renewal date",
      ],
    },
    magazine: {
      noticePeriod: "Varies by publisher",
      regulations: [
        "Australian Consumer Law",
        "Magazine subscription code of practice",
      ],
      tips: [
        "Cancel before renewal",
        "Request refund for undelivered issues",
        "Contact ACCC for unfair practices",
      ],
    },
    utilities: {
      noticePeriod: "Usually 3-5 business days",
      regulations: [
        "National Energy Customer Framework",
        "State energy ombudsman for disputes",
      ],
      tips: [
        "Use government comparison sites",
        "Provide final meter reading",
        "Contact energy ombudsman for issues",
      ],
    },
    other: {
      noticePeriod: "Check your contract terms",
      regulations: [
        "Australian Consumer Law",
        "Unfair contract term protections",
        "ACCC enforcement",
      ],
      tips: [
        "Cancel in writing and keep copies",
        "Contact fair trading for disputes",
        "Small claims tribunal for unresolved issues",
      ],
    },
  },
  ca: {
    gym: {
      noticePeriod: "Varies by province (10 days typical)",
      regulations: [
        "Provincial consumer protection acts",
        "10-day cooling-off in most provinces",
        "Prepaid service protections",
      ],
      tips: [
        "Check your province's fitness club rules",
        "Exercise 10-day cooling-off right",
        "Moving may allow early cancellation",
      ],
    },
    insurance: {
      noticePeriod: "10-day cooling-off typical",
      regulations: [
        "Provincial insurance regulations",
        "OBSI for banking/investment disputes",
        "Provincial insurance ombudsmen",
      ],
      tips: [
        "Use cooling-off period promptly",
        "Pro-rata refunds typically available",
        "Contact provincial insurance authority",
      ],
    },
    broadband: {
      noticePeriod: "Varies by provider",
      regulations: [
        "CRTC regulations",
        "CCTS for dispute resolution",
        "Wireless Code (for mobile)",
      ],
      tips: [
        "Contact CCTS for unresolved disputes",
        "Check contract for early exit terms",
        "Return equipment promptly",
      ],
    },
    mobile: {
      noticePeriod: "As per contract terms",
      regulations: [
        "CRTC Wireless Code",
        "Caps on early cancellation fees",
        "Device unlocking requirements",
      ],
      tips: [
        "Port number to new provider",
        "Carriers must unlock phones for free",
        "Early fees capped and prorated",
      ],
    },
    streaming: {
      noticePeriod: "Usually immediate",
      regulations: [
        "Provincial consumer protection",
        "Federal competition law",
      ],
      tips: [
        "Most allow immediate cancellation",
        "Check billing cycle",
        "Set reminder before renewal",
      ],
    },
    magazine: {
      noticePeriod: "Varies by publisher",
      regulations: [
        "Provincial consumer protection acts",
        "Direct sellers legislation",
      ],
      tips: [
        "Cancel before renewal",
        "Request refund for remaining issues",
        "Contact provincial consumer affairs",
      ],
    },
    utilities: {
      noticePeriod: "Usually 5 business days",
      regulations: [
        "Provincial energy regulators",
        "Consumer protection legislation",
      ],
      tips: [
        "Provide final meter reading",
        "Compare rates before switching",
        "Contact provincial ombudsman for disputes",
      ],
    },
    other: {
      noticePeriod: "Check your contract terms",
      regulations: [
        "Provincial consumer protection acts",
        "Competition Act (federal)",
        "Contract law principles",
      ],
      tips: [
        "Cancel in writing and keep copies",
        "Contact provincial consumer affairs",
        "Small claims court for disputes",
      ],
    },
  },
  other: {
    gym: {
      noticePeriod: "Check your contract terms",
      regulations: [
        "Local consumer protection laws apply",
        "Check for cooling-off periods",
      ],
      tips: [
        "Review your membership agreement",
        "Cancel in writing and keep copies",
        "Check local consumer protection office",
      ],
    },
    insurance: {
      noticePeriod: "Check your policy terms",
      regulations: [
        "Local insurance regulations apply",
        "Cooling-off periods may be available",
      ],
      tips: [
        "Review policy cancellation terms",
        "Contact local insurance regulator",
        "Keep copies of all correspondence",
      ],
    },
    broadband: {
      noticePeriod: "Check your contract terms",
      regulations: [
        "Local telecom regulations apply",
        "Consumer protection laws",
      ],
      tips: [
        "Review contract for exit terms",
        "Return equipment promptly",
        "Contact telecom regulator if issues",
      ],
    },
    mobile: {
      noticePeriod: "Check your contract terms",
      regulations: [
        "Local telecom regulations",
        "Number portability may be available",
      ],
      tips: [
        "Check if you can port your number",
        "Review contract exit terms",
        "Contact regulator for disputes",
      ],
    },
    streaming: {
      noticePeriod: "Usually immediate",
      regulations: [
        "Local consumer protection laws",
      ],
      tips: [
        "Most services allow immediate cancellation",
        "Check billing cycle",
        "Keep cancellation confirmation",
      ],
    },
    magazine: {
      noticePeriod: "Varies by publisher",
      regulations: [
        "Local consumer protection laws",
      ],
      tips: [
        "Cancel before renewal",
        "Keep proof of cancellation",
        "Request refund for remaining issues",
      ],
    },
    utilities: {
      noticePeriod: "Check with your provider",
      regulations: [
        "Local utility regulations",
      ],
      tips: [
        "Provide final meter reading",
        "Get final bill in writing",
        "Contact local regulator if issues",
      ],
    },
    other: {
      noticePeriod: "Check your contract terms",
      regulations: [
        "Local consumer protection laws",
        "Contract law principles",
      ],
      tips: [
        "Cancel in writing and keep copies",
        "Check local consumer protection office",
        "Keep all correspondence",
      ],
    },
  },
}

function generateLetter(
  country: Country,
  companyName: string,
  yourName: string,
  accountNumber: string,
  industry: Industry,
  contractType: ContractType,
  cancelReason: CancelReason,
  additionalDetails: string
): string {
  const dateLocale = country === "us" ? "en-US" : country === "au" ? "en-AU" : country === "ca" ? "en-CA" : "en-GB"
  const today = new Date().toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })

  const reasonText: Record<CancelReason, string> = {
    moving: "I am relocating to a new area and will no longer be able to use your services",
    affordability: "Due to changes in my financial circumstances, I am no longer able to continue with this subscription",
    service: "I have experienced ongoing service issues that have not been resolved",
    "better-deal": "I have decided to move to an alternative provider",
    "not-using": "I am no longer using this service and do not wish to continue paying for it",
    other: additionalDetails || "I have decided to cancel my subscription",
  }

  return `${today}

${companyName}
[Company Address]

Dear Sir/Madam,

Re: Cancellation of Subscription/Membership
${accountNumber ? `Account/Membership Number: ${accountNumber}` : ""}

I am writing to formally request the cancellation of my ${industry === "gym" ? "membership" : "subscription"} with immediate effect, or as soon as permitted under my contract terms.

${reasonText[cancelReason]}.

Please confirm the following in your response:
• The date my ${industry === "gym" ? "membership" : "subscription"} will end
• Any final payments required
• Confirmation that no further payments will be taken
${industry === "gym" || industry === "broadband" || industry === "mobile" ? "• Details of any early termination fees, if applicable" : ""}

I understand that I may be required to provide notice under the terms of my contract. Please process this cancellation request accordingly.

${cancelReason === "moving" ? "\nI am relocating more than 15 miles from my current address. If applicable, please confirm whether this qualifies me for early termination of any fixed-term contract without penalty.\n" : ""}

Please send written confirmation of this cancellation to my email address on file.

If I do not receive confirmation within 7 days, I will follow up and may escalate this matter.

Yours faithfully,

${yourName || "[Your Name]"}

---
This letter was generated using NoReply (usenoreply.com)
For your records: Sent on ${today}
`.trim()
}

function calculateResult(
  country: Country,
  companyName: string,
  yourName: string,
  accountNumber: string,
  industry: Industry,
  contractType: ContractType,
  cancelReason: CancelReason,
  additionalDetails: string
): CancellationResult {
  const info = industryInfoByCountry[country][industry]
  const possibleFees: string[] = []
  const warnings: string[] = []

  if (contractType === "fixed") {
    possibleFees.push("Early termination fee (check contract for amount)")
    warnings.push("Fixed-term contracts may have exit penalties")
  }

  if (industry === "gym") {
    possibleFees.push("Pro-rata payment for current month")
    if (contractType === "fixed") {
      warnings.push("Most gym contracts have a minimum term - check yours")
    }
  }

  if (industry === "broadband" || industry === "mobile") {
    if (contractType === "fixed") {
      possibleFees.push("Remaining contract value (reducing monthly)")
      warnings.push("Early exit fees should reduce over time")
    }
  }

  if (industry === "insurance") {
    possibleFees.push("Premium for cover already provided")
    possibleFees.push("Possible admin fee (check policy)")
  }

  const letterTemplate = generateLetter(
    country,
    companyName,
    yourName,
    accountNumber,
    industry,
    contractType,
    cancelReason,
    additionalDetails
  )

  return {
    noticePeriod: info.noticePeriod,
    possibleFees,
    regulations: info.regulations,
    letterTemplate,
    tips: info.tips,
    warnings,
    country,
  }
}

function ResultCard({ result, companyName }: { result: CancellationResult; companyName: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.letterTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Cancellation Summary</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-forest-50 rounded-md">
            <span className="text-xs text-muted-foreground block mb-1">Notice Period</span>
            <span className="font-medium text-foreground">{result.noticePeriod}</span>
          </div>
          <div className="p-4 bg-forest-50 rounded-md">
            <span className="text-xs text-muted-foreground block mb-1">Company</span>
            <span className="font-medium text-foreground">{companyName}</span>
          </div>
        </div>
      </div>

      {/* Possible Fees */}
      {result.possibleFees.length > 0 && (
        <div className="p-6 bg-background border border-forest-100 rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Possible Fees</h3>
          <ul className="space-y-2">
            {result.possibleFees.map((fee, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon icon={AlertCircleIcon} size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{fee}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Your Rights */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Your Rights</h3>
        <ul className="space-y-2">
          {result.regulations.map((reg, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{reg}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Generated Letter */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Your Cancellation Letter</h3>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Icon icon={copied ? CheckmarkCircle01Icon : Copy01Icon} size={14} className="mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <div className="bg-forest-50 rounded-md p-4 font-mono text-sm whitespace-pre-wrap text-muted-foreground max-h-96 overflow-y-auto">
          {result.letterTemplate}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          <Icon icon={Mail01Icon} size={12} className="inline mr-1" />
          Send this by email or post. Keep a copy for your records.
        </p>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon icon={AlertCircleIcon} size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              {result.warnings.map((warning, i) => (
                <p key={i} className="text-sm text-amber-700">{warning}</p>
              ))}
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
        <h3 className="font-semibold text-lg mb-2">Need help if they don&apos;t comply?</h3>
        <p className="text-forest-100 mb-4">
          If the company refuses to cancel or charges unfair fees, NoReply can help you escalate your complaint.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="coral">
            <Link href={`/new?tool=subscription-dispute&company=${encodeURIComponent(companyName)}&country=${result.country}`} className="flex items-center">
              Escalate with NoReply
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

export function CancelSubscriptionForm() {
  const [country, setCountry] = useState<Country | "">("")
  const [companyName, setCompanyName] = useState("")
  const [yourName, setYourName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [industry, setIndustry] = useState<Industry | "">("")
  const [contractType, setContractType] = useState<ContractType | "">("")
  const [cancelReason, setCancelReason] = useState<CancelReason | "">("")
  const [additionalDetails, setAdditionalDetails] = useState("")
  const [result, setResult] = useState<CancellationResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!country) {
      setError("Please select your country")
      return
    }

    if (!companyName.trim()) {
      setError("Please enter the company name")
      return
    }

    if (!industry) {
      setError("Please select the industry")
      return
    }

    if (!contractType) {
      setError("Please select your contract type")
      return
    }

    if (!cancelReason) {
      setError("Please select your reason for cancelling")
      return
    }

    const cancellationResult = calculateResult(
      country,
      companyName,
      yourName,
      accountNumber,
      industry,
      contractType,
      cancelReason,
      additionalDetails
    )
    setResult(cancellationResult)
  }

  const handleReset = () => {
    setCountry("")
    setCompanyName("")
    setYourName("")
    setAccountNumber("")
    setIndustry("")
    setContractType("")
    setCancelReason("")
    setAdditionalDetails("")
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
              Cancellation rules and regulations vary by country
            </p>
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company-name">Company name</Label>
            <Input
              id="company-name"
              type="text"
              placeholder="e.g. PureGym, Virgin Media, Netflix"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Your Name */}
          <div className="space-y-2">
            <Label htmlFor="your-name">Your name (for the letter)</Label>
            <Input
              id="your-name"
              type="text"
              placeholder="Your full name"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
            />
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="account-number">Account/membership number (optional)</Label>
            <Input
              id="account-number"
              type="text"
              placeholder="If you have one"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">What type of subscription?</Label>
            <Select
              value={industry}
              onValueChange={(value) => setIndustry(value as Industry)}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select subscription type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gym">Gym membership</SelectItem>
                <SelectItem value="broadband">Broadband/internet</SelectItem>
                <SelectItem value="mobile">Mobile phone</SelectItem>
                <SelectItem value="insurance">Insurance policy</SelectItem>
                <SelectItem value="streaming">Streaming service</SelectItem>
                <SelectItem value="magazine">Magazine/newspaper</SelectItem>
                <SelectItem value="utilities">Energy/utilities</SelectItem>
                <SelectItem value="other">Other subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contract Type */}
          <div className="space-y-2">
            <Label htmlFor="contract-type">Contract type</Label>
            <Select
              value={contractType}
              onValueChange={(value) => setContractType(value as ContractType)}
            >
              <SelectTrigger id="contract-type">
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rolling">Rolling monthly (no fixed term)</SelectItem>
                <SelectItem value="fixed">Fixed term contract</SelectItem>
                <SelectItem value="unsure">Not sure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cancel Reason */}
          <div className="space-y-2">
            <Label htmlFor="cancel-reason">Reason for cancelling</Label>
            <Select
              value={cancelReason}
              onValueChange={(value) => setCancelReason(value as CancelReason)}
            >
              <SelectTrigger id="cancel-reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-using">Not using it anymore</SelectItem>
                <SelectItem value="affordability">Can&apos;t afford it</SelectItem>
                <SelectItem value="service">Poor service/quality</SelectItem>
                <SelectItem value="better-deal">Found a better deal</SelectItem>
                <SelectItem value="moving">Moving home/area</SelectItem>
                <SelectItem value="other">Other reason</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Details */}
          {cancelReason === "other" && (
            <div className="space-y-2">
              <Label htmlFor="additional-details">Please specify your reason</Label>
              <Textarea
                id="additional-details"
                placeholder="Briefly explain your reason for cancelling"
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                rows={3}
              />
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
            Generate Cancellation Letter
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Cancellation</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Start again
            </Button>
          </div>
          <ResultCard result={result} companyName={companyName} />
        </div>
      )}
    </div>
  )
}
