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
  CreditCardIcon,
  Calendar01Icon,
  InformationCircleIcon,
  Globe02Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"

type Country = "uk" | "eu" | "us" | "au" | "ca" | "other"
type PaymentMethod = "credit-card" | "debit-card" | "paypal" | "bank-transfer" | "buy-now-pay-later"
type IssueType = "non-delivery" | "faulty" | "misrepresentation" | "company-bust" | "service-not-provided"

interface ProtectionResult {
  primaryProtection: string | null
  chargebackEligible: boolean
  protection: "strong" | "chargeback" | "limited"
  amount: number
  currency: string
  timeLimit: number | null
  explanation: string
  steps: string[]
  warnings: string[]
  legalBasis: string | null
}

const countryConfig: Record<Country, { currency: string; symbol: string; name: string }> = {
  uk: { currency: "GBP", symbol: "£", name: "United Kingdom" },
  eu: { currency: "EUR", symbol: "€", name: "European Union" },
  us: { currency: "USD", symbol: "$", name: "United States" },
  au: { currency: "AUD", symbol: "A$", name: "Australia" },
  ca: { currency: "CAD", symbol: "C$", name: "Canada" },
  other: { currency: "USD", symbol: "$", name: "Other" },
}

function calculateProtection(
  country: Country,
  paymentMethod: PaymentMethod,
  amount: number,
  purchaseDate: string,
  issueType: IssueType
): ProtectionResult {
  const now = new Date()
  const purchase = new Date(purchaseDate)
  const daysSincePurchase = Math.floor((now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24))
  const config = countryConfig[country]

  // Chargeback time limits (120 days is standard internationally)
  const chargebackDaysRemaining = Math.max(0, 120 - daysSincePurchase)
  const chargebackStillValid = chargebackDaysRemaining > 0
  const chargebackEligible = (paymentMethod === "credit-card" || paymentMethod === "debit-card") && chargebackStillValid

  let primaryProtection: string | null = null
  let protection: "strong" | "chargeback" | "limited"
  let explanation: string
  let legalBasis: string | null = null
  const steps: string[] = []
  const warnings: string[] = []

  // Country-specific logic
  if (country === "uk") {
    // UK: Section 75 of Consumer Credit Act 1974
    const isCreditCard = paymentMethod === "credit-card"
    const section75Eligible = isCreditCard && amount >= 100.01 && amount <= 30000

    if (section75Eligible) {
      primaryProtection = "Section 75"
      protection = "strong"
      legalBasis = "Section 75 of the Consumer Credit Act 1974"
      explanation = `You're protected under Section 75, which makes your credit card provider jointly liable with the seller. This is one of the strongest consumer protections in the world.${chargebackEligible ? " You can also request a chargeback as a backup option." : ""}`
      steps.push("Contact your credit card provider and request a Section 75 claim")
      steps.push("Explain the breach of contract or misrepresentation")
      steps.push("Provide evidence: receipts, correspondence, photos")
      steps.push("If rejected, escalate to the Financial Ombudsman Service")
    } else if (chargebackEligible) {
      protection = "chargeback"
      explanation = isCreditCard && amount < 100.01
        ? `Your purchase is under £100.01, so Section 75 doesn't apply. However, you can request a chargeback. You have ${chargebackDaysRemaining} days remaining.`
        : `You can request a chargeback from your card provider. You have ${chargebackDaysRemaining} days remaining.`
      steps.push("Contact your bank or card provider immediately")
      steps.push("Request a chargeback (dispute the transaction)")
      steps.push("Provide evidence of the problem")
      warnings.push(`Act quickly - only ${chargebackDaysRemaining} days remaining`)
    } else {
      protection = "limited"
    }
  } else if (country === "us") {
    // US: Fair Credit Billing Act
    const isCreditCard = paymentMethod === "credit-card"

    if (isCreditCard && amount > 50) {
      primaryProtection = "Fair Credit Billing Act"
      protection = "strong"
      legalBasis = "Fair Credit Billing Act (FCBA)"
      explanation = `Under the Fair Credit Billing Act, you can dispute charges for goods not delivered, not as described, or for billing errors. You must dispute within 60 days of the statement date.${chargebackEligible ? " Chargeback is also available." : ""}`
      steps.push("Send a written dispute to your credit card issuer")
      steps.push("Dispute within 60 days of the statement showing the charge")
      steps.push("Include your name, account number, and description of the error")
      steps.push("The issuer must investigate within 30 days")
      if (daysSincePurchase > 45) {
        warnings.push("You may be approaching the 60-day dispute window - act fast")
      }
    } else if (chargebackEligible) {
      protection = "chargeback"
      explanation = `You can request a chargeback from your card provider. You have ${chargebackDaysRemaining} days remaining.`
      steps.push("Contact your bank or card issuer")
      steps.push("Request a chargeback or dispute")
      steps.push("Provide documentation of the issue")
      warnings.push(`Act quickly - only ${chargebackDaysRemaining} days remaining`)
    } else {
      protection = "limited"
    }
  } else if (country === "eu") {
    // EU: Chargeback + some country-specific protections
    if (chargebackEligible) {
      protection = "chargeback"
      legalBasis = "Visa/Mastercard chargeback rules + EU Consumer Rights Directive"
      explanation = `EU law provides strong consumer protections, and you can request a chargeback through your card provider. You have ${chargebackDaysRemaining} days remaining. The EU Consumer Rights Directive also gives you 14 days to cancel online purchases.`
      steps.push("Contact your bank or card provider")
      steps.push("Request a chargeback citing non-delivery or defective goods")
      steps.push("Reference EU Consumer Rights Directive if applicable")
      steps.push("Contact your national consumer protection agency if needed")
      warnings.push(`Act quickly - only ${chargebackDaysRemaining} days remaining`)
    } else {
      protection = "limited"
      explanation = "The chargeback window has closed, but you may still have rights under EU consumer law. Contact your national consumer protection agency."
    }
  } else if (country === "au") {
    // Australia: Australian Consumer Law + Chargeback
    if (chargebackEligible) {
      protection = paymentMethod === "credit-card" ? "strong" : "chargeback"
      legalBasis = "Australian Consumer Law (ACL)"
      explanation = `Australian Consumer Law provides strong protections. Goods must be of acceptable quality, match descriptions, and be fit for purpose. You can also request a chargeback. You have ${chargebackDaysRemaining} days remaining.`
      steps.push("Request a refund directly from the business first")
      steps.push("If refused, contact your bank for a chargeback")
      steps.push("Lodge a complaint with the ACCC or state fair trading body")
      steps.push("Consider the small claims tribunal for disputes")
      warnings.push(`Chargeback window: ${chargebackDaysRemaining} days remaining`)
    } else {
      protection = "limited"
      explanation = "The chargeback window has closed, but Australian Consumer Law still protects you. Contact the ACCC or your state's fair trading office."
    }
  } else if (country === "ca") {
    // Canada: Provincial laws + Chargeback
    if (chargebackEligible) {
      protection = "chargeback"
      legalBasis = "Provincial consumer protection laws + Card network rules"
      explanation = `Canadian provincial laws provide consumer protections, and you can request a chargeback. Ontario, Quebec, BC, and Alberta have specific credit card chargeback rights. You have ${chargebackDaysRemaining} days remaining.`
      steps.push("Contact your credit card issuer for a chargeback")
      steps.push("Check your province's consumer protection laws")
      steps.push("File a complaint with your provincial consumer protection office")
      steps.push("Consider small claims court for unresolved disputes")
      warnings.push(`Act quickly - only ${chargebackDaysRemaining} days remaining`)
    } else {
      protection = "limited"
      explanation = "The chargeback window has closed, but provincial consumer protection laws may still help. Contact your provincial consumer affairs office."
    }
  } else {
    // Other countries: Chargeback is universal for card payments
    if (chargebackEligible) {
      protection = "chargeback"
      explanation = `Chargeback protection is available through Visa, Mastercard, and other card networks worldwide. You have ${chargebackDaysRemaining} days remaining to dispute the transaction.`
      steps.push("Contact your bank or card issuer")
      steps.push("Request a chargeback or transaction dispute")
      steps.push("Provide evidence of the issue")
      steps.push("Check your local consumer protection laws for additional rights")
      warnings.push(`Act quickly - only ${chargebackDaysRemaining} days remaining`)
    } else {
      protection = "limited"
      explanation = "The chargeback window has closed. Check your local consumer protection laws for other options."
    }
  }

  // Handle limited protection cases
  if (protection === "limited") {
    if (paymentMethod === "paypal") {
      explanation = `PayPal has its own Buyer Protection programme available in most countries. You can open a dispute through PayPal within 180 days of payment.`
      steps.push("Log into PayPal and go to the Resolution Centre")
      steps.push("Open a dispute within 180 days of payment")
      steps.push("If unresolved after 20 days, escalate to a claim")
    } else if (paymentMethod === "bank-transfer") {
      explanation = `Bank transfers have very limited protection worldwide. Contact your bank immediately to attempt a recall.`
      steps.push("Contact your bank immediately to attempt a recall")
      steps.push("Report to your local fraud/scam reporting agency if applicable")
      steps.push("Consider small claims court if the seller is a legitimate business")
      warnings.push("Bank transfers are very difficult to recover")
    } else if (paymentMethod === "buy-now-pay-later") {
      explanation = `Buy Now Pay Later services like Klarna, Afterpay, and Affirm have their own dispute processes. Contact them directly.`
      steps.push("Contact the BNPL provider's customer service")
      steps.push("Explain the issue with your purchase")
      steps.push("They may pause payments while investigating")
    } else if (steps.length === 0) {
      steps.push("Contact the seller directly to request a refund")
      steps.push("Keep records of all communications")
      steps.push("Check your local consumer protection laws")
      steps.push("Consider small claims court as a last resort")
    }
  }

  // Add issue-specific advice
  if (issueType === "company-bust") {
    warnings.push("If the company has gone into administration/bankruptcy, register as a creditor")
    if (protection === "strong") {
      steps.push("Your card protection is particularly valuable when companies go bust")
    }
  }

  return {
    primaryProtection,
    chargebackEligible,
    protection,
    amount,
    currency: config.symbol,
    timeLimit: chargebackEligible ? chargebackDaysRemaining : null,
    explanation,
    steps,
    warnings,
    legalBasis,
  }
}

function ProtectionBadge({ protection, primaryProtection }: { protection: ProtectionResult["protection"]; primaryProtection: string | null }) {
  const config = {
    strong: {
      label: primaryProtection || "Strong Protection",
      color: "bg-green-100 text-green-700 border-green-200",
      icon: CheckmarkCircle01Icon,
    },
    chargeback: {
      label: "Chargeback Available",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: CreditCardIcon,
    },
    limited: {
      label: "Limited Protection",
      color: "bg-red-100 text-red-700 border-red-200",
      icon: AlertCircleIcon,
    },
  }

  const { label, color, icon: BadgeIcon } = config[protection]

  return (
    <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium", color)}>
      <Icon icon={BadgeIcon} size={18} />
      {label}
    </div>
  )
}

function ResultCard({ result }: { result: ProtectionResult }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Protection Status */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <ProtectionBadge protection={result.protection} primaryProtection={result.primaryProtection} />
          {result.timeLimit !== null && result.timeLimit > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Icon icon={Calendar01Icon} size={16} className="text-amber-500" />
              <span className="font-medium text-amber-600">
                {result.timeLimit} days left for chargeback
              </span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
        {result.legalBasis && (
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <Icon icon={KnightShieldIcon} size={12} />
            Legal basis: {result.legalBasis}
          </p>
        )}
      </div>

      {/* What You Can Claim */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-3">What You Can Claim</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{result.currency}{result.amount.toLocaleString()}</span>
          <span className="text-muted-foreground">full purchase amount</span>
        </div>
      </div>

      {/* Steps to Take */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Steps to Take</h3>
        <ol className="space-y-3">
          {result.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-forest-100 text-forest-600 text-sm font-medium flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
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

      {/* CTA */}
      <div className="p-6 bg-forest-500 rounded-lg text-white">
        <h3 className="font-semibold text-lg mb-2">Need help with your claim?</h3>
        <p className="text-forest-100 mb-4">
          Generate a professional claim letter with all the right legal references for your jurisdiction.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="coral">
            <Link href={`/new?tool=card-dispute&amount=${result.amount}&protection=${result.protection}`} className="flex items-center">
              Generate Claim Letter
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

export function Section75Form() {
  const [country, setCountry] = useState<Country | "">("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("")
  const [amount, setAmount] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [issueType, setIssueType] = useState<IssueType | "">("")
  const [result, setResult] = useState<ProtectionResult | null>(null)
  const [error, setError] = useState("")

  const currencySymbol = country ? countryConfig[country].symbol : "£"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!country) {
      setError("Please select your country")
      return
    }

    if (!paymentMethod) {
      setError("Please select your payment method")
      return
    }

    const amountNum = parseFloat(amount)
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid purchase amount")
      return
    }

    if (!purchaseDate) {
      setError("Please enter the purchase date")
      return
    }

    if (!issueType) {
      setError("Please select what went wrong")
      return
    }

    const protection = calculateProtection(country, paymentMethod, amountNum, purchaseDate, issueType)
    setResult(protection)
  }

  const handleReset = () => {
    setCountry("")
    setPaymentMethod("")
    setAmount("")
    setPurchaseDate("")
    setIssueType("")
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
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder="Select your country/region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uk">
                  <span className="flex items-center gap-2">
                    <span>🇬🇧</span> United Kingdom
                  </span>
                </SelectItem>
                <SelectItem value="us">
                  <span className="flex items-center gap-2">
                    <span>🇺🇸</span> United States
                  </span>
                </SelectItem>
                <SelectItem value="eu">
                  <span className="flex items-center gap-2">
                    <span>🇪🇺</span> European Union
                  </span>
                </SelectItem>
                <SelectItem value="au">
                  <span className="flex items-center gap-2">
                    <span>🇦🇺</span> Australia
                  </span>
                </SelectItem>
                <SelectItem value="ca">
                  <span className="flex items-center gap-2">
                    <span>🇨🇦</span> Canada
                  </span>
                </SelectItem>
                <SelectItem value="other">
                  <span className="flex items-center gap-2">
                    <Icon icon={Globe02Icon} size={16} /> Other Country
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">How did you pay?</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
            >
              <SelectTrigger id="payment-method" className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="debit-card">Debit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="buy-now-pay-later">Buy Now Pay Later (Klarna, Afterpay, etc.)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Purchase amount ({currencySymbol})</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 450.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {country === "uk" && paymentMethod === "credit-card" && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon icon={InformationCircleIcon} size={12} />
                Section 75 applies to purchases between £100.01 and £30,000
              </p>
            )}
          </div>

          {/* Purchase Date */}
          <div className="space-y-2">
            <Label htmlFor="purchase-date">When did you make the purchase?</Label>
            <Input
              id="purchase-date"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Issue Type */}
          <div className="space-y-2">
            <Label htmlFor="issue-type">What went wrong?</Label>
            <Select
              value={issueType}
              onValueChange={(value) => setIssueType(value as IssueType)}
            >
              <SelectTrigger id="issue-type" className="w-full">
                <SelectValue placeholder="Select the issue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="non-delivery">Item never arrived</SelectItem>
                <SelectItem value="faulty">Item is faulty or not as described</SelectItem>
                <SelectItem value="misrepresentation">Seller misrepresented the product/service</SelectItem>
                <SelectItem value="company-bust">Company has gone bust/bankrupt</SelectItem>
                <SelectItem value="service-not-provided">Service was not provided</SelectItem>
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
            Check My Protection
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Protection Options</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Check another payment
            </Button>
          </div>
          <ResultCard result={result} />
        </div>
      )}
    </div>
  )
}
