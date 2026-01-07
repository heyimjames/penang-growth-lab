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
  Calendar01Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Globe02Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type Country = "uk" | "eu" | "us" | "au" | "ca" | "other"
type PurchaseLocation = "online" | "in-store" | "phone" | "doorstep" | "trade-fair"
type ProductType = "physical-goods" | "services" | "digital-content"

interface CoolingOffResult {
  hasCoolingOff: boolean
  periodDays: number | null
  daysRemaining: number | null
  explanation: string
  exceptions: string[]
  howToCancel: string[]
  warnings: string[]
  legalBasis: string
  country: Country
}

const countryConfig: Record<Country, { name: string; flag: string }> = {
  uk: { name: "United Kingdom", flag: "🇬🇧" },
  eu: { name: "European Union", flag: "🇪🇺" },
  us: { name: "United States", flag: "🇺🇸" },
  au: { name: "Australia", flag: "🇦🇺" },
  ca: { name: "Canada", flag: "🇨🇦" },
  other: { name: "Other Country", flag: "🌍" },
}

function calculateCoolingOff(
  country: Country,
  purchaseLocation: PurchaseLocation,
  productType: ProductType,
  receiveDate: string,
  requestedImmediateStart: boolean
): CoolingOffResult {
  const now = new Date()
  const received = new Date(receiveDate)
  const daysSinceReceived = Math.floor((now.getTime() - received.getTime()) / (1000 * 60 * 60 * 24))

  const exceptions: string[] = []
  const howToCancel: string[] = []
  const warnings: string[] = []

  // Country-specific cooling-off periods and laws
  if (country === "uk" || country === "eu") {
    return calculateUKEUCoolingOff(country, purchaseLocation, productType, daysSinceReceived, requestedImmediateStart)
  } else if (country === "us") {
    return calculateUSCoolingOff(purchaseLocation, productType, daysSinceReceived)
  } else if (country === "au") {
    return calculateAUCoolingOff(purchaseLocation, productType, daysSinceReceived)
  } else if (country === "ca") {
    return calculateCACoolingOff(purchaseLocation, productType, daysSinceReceived)
  } else {
    return calculateOtherCoolingOff(purchaseLocation, productType, daysSinceReceived)
  }
}

function calculateUKEUCoolingOff(
  country: "uk" | "eu",
  purchaseLocation: PurchaseLocation,
  productType: ProductType,
  daysSinceReceived: number,
  requestedImmediateStart: boolean
): CoolingOffResult {
  const isUK = country === "uk"
  const legalBasis = isUK
    ? "Consumer Contracts Regulations 2013"
    : "EU Consumer Rights Directive 2011/83/EU"
  const consumerRightsAct = isUK
    ? "Consumer Rights Act 2015"
    : "EU consumer protection laws"

  // In-store purchases have no automatic cooling-off
  if (purchaseLocation === "in-store") {
    return {
      hasCoolingOff: false,
      periodDays: null,
      daysRemaining: null,
      explanation: `In-store purchases don't have an automatic cooling-off period under ${isUK ? "UK" : "EU"} law. However, many retailers offer their own returns policy.`,
      exceptions: [
        "Check the retailer's own returns policy",
        `If the item is faulty, you have rights under the ${consumerRightsAct}`,
        "If you were misled, you may have grounds to return",
      ],
      howToCancel: [
        "Check the retailer's returns policy on their website or receipt",
        "Many stores offer 14-30 day returns for unopened items",
        "Keep your receipt as proof of purchase",
      ],
      warnings: ["Store policies are voluntary - they can set their own conditions"],
      legalBasis,
      country,
    }
  }

  const periodDays = 14

  // For digital content started immediately with consent
  if (productType === "digital-content" && requestedImmediateStart) {
    return {
      hasCoolingOff: false,
      periodDays: null,
      daysRemaining: null,
      explanation: "You agreed to immediate access to digital content and acknowledged losing your cooling-off right.",
      exceptions: [
        `If the digital content is faulty, you have rights under the ${consumerRightsAct}`,
        "If the service doesn't match what was described, you can complain",
      ],
      howToCancel: [],
      warnings: ["Once you consent to immediate digital delivery, the cooling-off period is waived"],
      legalBasis,
      country,
    }
  }

  // Services started immediately
  if (productType === "services" && requestedImmediateStart) {
    const daysRemaining = Math.max(0, periodDays - daysSinceReceived)
    return {
      hasCoolingOff: daysRemaining > 0,
      periodDays,
      daysRemaining,
      explanation: daysRemaining > 0
        ? `You have ${daysRemaining} days remaining to cancel, but you may have to pay for services already provided.`
        : "Your 14-day cooling-off period has ended.",
      exceptions: [
        "You must pay a proportionate amount for services already provided",
        "If the service was completed within 14 days, no refund is due",
      ],
      howToCancel: [
        "Contact the company in writing (email is fine)",
        `State you're cancelling under the ${legalBasis}`,
        "Accept you may need to pay for services already received",
      ],
      warnings: ["The company can charge for services already provided"],
      legalBasis,
      country,
    }
  }

  const daysRemaining = Math.max(0, periodDays - daysSinceReceived)
  const exceptions: string[] = []
  const howToCancel: string[] = []
  const warnings: string[] = []

  if (productType === "physical-goods") {
    exceptions.push("Perishable goods (food, flowers)")
    exceptions.push("Personalised or custom-made items")
    exceptions.push("Sealed hygiene products opened after delivery")
    exceptions.push("Sealed audio/video recordings opened after delivery")
    exceptions.push("Newspapers, magazines, periodicals")
  }

  howToCancel.push("Notify the seller clearly that you're cancelling - email is fine")
  howToCancel.push("You don't need to give a reason")
  if (productType === "physical-goods") {
    howToCancel.push("Return the goods within 14 days of notifying them")
    howToCancel.push("You pay return shipping unless the seller offers free returns")
  }

  if (daysRemaining <= 3 && daysRemaining > 0) {
    warnings.push(`Act quickly - only ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining!`)
  }
  if (purchaseLocation === "doorstep") {
    warnings.push("If the seller didn't provide proper cancellation info, your period extends to 12 months")
  }

  return {
    hasCoolingOff: daysRemaining > 0,
    periodDays,
    daysRemaining,
    explanation: daysRemaining > 0
      ? `Good news! You have ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining to cancel under the ${legalBasis}.`
      : `Your 14-day cooling-off period has ended. If the item is faulty, you still have rights under the ${consumerRightsAct}.`,
    exceptions,
    howToCancel,
    warnings,
    legalBasis,
    country,
  }
}

function calculateUSCoolingOff(
  purchaseLocation: PurchaseLocation,
  productType: ProductType,
  daysSinceReceived: number
): CoolingOffResult {
  // US FTC Cooling-Off Rule only applies to doorstep sales over $25
  if (purchaseLocation === "doorstep") {
    const periodDays = 3 // 3 business days
    const daysRemaining = Math.max(0, periodDays - daysSinceReceived)

    return {
      hasCoolingOff: daysRemaining > 0,
      periodDays,
      daysRemaining,
      explanation: daysRemaining > 0
        ? `Under the FTC Cooling-Off Rule, you have ${daysRemaining} business day${daysRemaining === 1 ? "" : "s"} remaining to cancel door-to-door sales over $25.`
        : "The 3-business-day cooling-off period for door-to-door sales has ended.",
      exceptions: [
        "Only applies to sales at your home or workplace",
        "Sale must be over $25",
        "Doesn't apply if you initiated contact at seller's permanent place of business",
        "Cars sold at temporary locations are excluded",
      ],
      howToCancel: [
        "The seller must provide you with a cancellation form",
        "Sign and date the cancellation form",
        "Mail or deliver it before midnight of the 3rd business day",
        "Keep a copy for your records",
      ],
      warnings: [
        "Business days = Mon-Sat, excluding federal holidays",
        "Send cancellation by certified mail for proof",
      ],
      legalBasis: "FTC Cooling-Off Rule (16 CFR 429)",
      country: "us",
    }
  }

  // Online purchases - check state laws and individual company policies
  if (purchaseLocation === "online" || purchaseLocation === "phone") {
    return {
      hasCoolingOff: false,
      periodDays: null,
      daysRemaining: null,
      explanation: "The US has no federal cooling-off period for online or phone purchases. However, many retailers offer voluntary return policies, and some states have specific protections.",
      exceptions: [
        "Check the retailer's return policy (many offer 30-day returns)",
        "California has a 7-day 'cooling-off' for health club memberships",
        "Some states have laws for specific products (timeshares, gym memberships)",
        "Credit card chargebacks may be available for disputes",
      ],
      howToCancel: [
        "Review the seller's return policy on their website",
        "Contact customer service to initiate a return",
        "Keep all packaging if you might return the item",
        "Check your credit card's purchase protection benefits",
      ],
      warnings: [
        "Restocking fees may apply",
        "Some items (opened software, underwear) are often non-returnable",
      ],
      legalBasis: "No federal protection (state laws may apply)",
      country: "us",
    }
  }

  return {
    hasCoolingOff: false,
    periodDays: null,
    daysRemaining: null,
    explanation: "In-store purchases in the US have no federal cooling-off protection. Return policies are set by individual retailers.",
    exceptions: [
      "Check the store's return policy",
      "Keep your receipt",
      "Some purchases (cars, appliances) may have state-specific rules",
    ],
    howToCancel: [
      "Review the retailer's return policy",
      "Return within their specified timeframe",
      "Bring your receipt and original payment method",
    ],
    warnings: ["Store policies vary widely - always ask before purchasing"],
    legalBasis: "Store policy (no federal protection)",
    country: "us",
  }
}

function calculateAUCoolingOff(
  purchaseLocation: PurchaseLocation,
  productType: ProductType,
  daysSinceReceived: number
): CoolingOffResult {
  // Australia has 10 business days for unsolicited door-to-door and phone sales over $100
  if (purchaseLocation === "doorstep" || (purchaseLocation === "phone")) {
    const periodDays = 10 // 10 business days
    const daysRemaining = Math.max(0, periodDays - daysSinceReceived)

    return {
      hasCoolingOff: daysRemaining > 0,
      periodDays,
      daysRemaining,
      explanation: daysRemaining > 0
        ? `Under Australian Consumer Law, you have ${daysRemaining} business day${daysRemaining === 1 ? "" : "s"} remaining to cancel unsolicited sales agreements over $100.`
        : "The 10-business-day cooling-off period has ended.",
      exceptions: [
        "Only applies to unsolicited sales (they contacted you first)",
        "Sale must be over $100",
        "Doesn't apply if you requested the salesperson to contact you",
        "Some services may be excluded",
      ],
      howToCancel: [
        "Give notice in writing (email, letter, or fax)",
        "You don't need to give a reason",
        "Return any goods you've received",
        "You're entitled to a full refund within 15 business days",
      ],
      warnings: [
        "If you've used services during cooling-off, you may owe a reasonable amount",
        "Keep proof of when you sent your cancellation",
      ],
      legalBasis: "Australian Consumer Law (Competition and Consumer Act 2010)",
      country: "au",
    }
  }

  // Online purchases in Australia
  if (purchaseLocation === "online") {
    return {
      hasCoolingOff: false,
      periodDays: null,
      daysRemaining: null,
      explanation: "Australia has no automatic cooling-off period for online purchases. However, you have strong consumer guarantees if goods are faulty or not as described.",
      exceptions: [
        "Goods must match their description",
        "Goods must be of acceptable quality",
        "Goods must be fit for purpose",
        "If these guarantees fail, you're entitled to a remedy",
      ],
      howToCancel: [
        "Check the retailer's return/refund policy",
        "Many Australian retailers offer voluntary returns",
        "For faulty goods, you can demand a refund, repair, or replacement",
        "Contact the ACCC if the retailer won't comply",
      ],
      warnings: [
        "Change of mind returns are at the retailer's discretion",
        "Major failures entitle you to your choice of refund or replacement",
      ],
      legalBasis: "Australian Consumer Guarantees (no cooling-off for online)",
      country: "au",
    }
  }

  return {
    hasCoolingOff: false,
    periodDays: null,
    daysRemaining: null,
    explanation: "In-store purchases in Australia don't have a cooling-off period, but Australian Consumer Guarantees protect you for faulty goods.",
    exceptions: [
      "Faulty goods must be repaired, replaced, or refunded",
      "Goods must match their description and be fit for purpose",
      "Change of mind returns are at the store's discretion",
    ],
    howToCancel: [
      "Check the store's returns policy",
      "For faulty items, assert your consumer guarantee rights",
      "Keep your receipt",
    ],
    warnings: ["Stores can refuse change-of-mind returns unless they have a policy allowing them"],
    legalBasis: "Australian Consumer Guarantees",
    country: "au",
  }
}

function calculateCACoolingOff(
  purchaseLocation: PurchaseLocation,
  productType: ProductType,
  daysSinceReceived: number
): CoolingOffResult {
  // Canada has provincial laws - most have 10 days for door-to-door
  if (purchaseLocation === "doorstep") {
    const periodDays = 10
    const daysRemaining = Math.max(0, periodDays - daysSinceReceived)

    return {
      hasCoolingOff: daysRemaining > 0,
      periodDays,
      daysRemaining,
      explanation: daysRemaining > 0
        ? `Most Canadian provinces provide ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining to cancel door-to-door sales. Check your provincial consumer protection office for exact rules.`
        : "The cooling-off period for door-to-door sales has typically ended, but check your provincial rules.",
      exceptions: [
        "Ontario: 10 days for direct agreements over $50",
        "British Columbia: 10 days for direct sales",
        "Quebec: 10 days for itinerant merchants",
        "Alberta: 10 days for direct sales",
      ],
      howToCancel: [
        "Send written notice to the seller",
        "Use registered mail for proof of delivery",
        "Include your name, address, and contract details",
        "Keep a copy of your cancellation",
      ],
      warnings: [
        "Rules vary by province - verify with your local consumer protection office",
        "Some contracts may have extended cancellation periods if required info wasn't provided",
      ],
      legalBasis: "Provincial Consumer Protection Acts (varies by province)",
      country: "ca",
    }
  }

  if (purchaseLocation === "online") {
    return {
      hasCoolingOff: false,
      periodDays: null,
      daysRemaining: null,
      explanation: "Canada has no universal cooling-off period for online purchases, but some provinces have specific protections and many retailers offer voluntary return policies.",
      exceptions: [
        "Ontario: Right to cancel if goods not delivered within 30 days",
        "Goods must match their description",
        "Defective goods must be refunded or replaced",
        "Check provincial consumer protection laws",
      ],
      howToCancel: [
        "Review the seller's return policy",
        "Contact customer service to request a return",
        "For delayed deliveries, send written cancellation notice",
        "Consider credit card chargeback for disputes",
      ],
      warnings: [
        "Provincial rules vary significantly",
        "Keep records of your purchase and all communications",
      ],
      legalBasis: "Provincial laws (varies by province)",
      country: "ca",
    }
  }

  return {
    hasCoolingOff: false,
    periodDays: null,
    daysRemaining: null,
    explanation: "In-store purchases in Canada generally don't have a cooling-off period unless the retailer has a return policy.",
    exceptions: [
      "Store return policies vary",
      "Defective goods have warranty protections",
      "Some products (timeshares, gym memberships) may have specific rules",
    ],
    howToCancel: [
      "Check the store's returns policy before purchase",
      "Keep your receipt",
      "Return within the store's specified timeframe",
    ],
    warnings: ["Store policies are voluntary - confirm before purchasing"],
    legalBasis: "Store policy (provincial laws for specific products)",
    country: "ca",
  }
}

function calculateOtherCoolingOff(
  purchaseLocation: PurchaseLocation,
  productType: ProductType,
  daysSinceReceived: number
): CoolingOffResult {
  return {
    hasCoolingOff: false,
    periodDays: null,
    daysRemaining: null,
    explanation: "Cooling-off periods vary significantly by country. We recommend checking your local consumer protection agency for specific rules in your jurisdiction.",
    exceptions: [
      "Many countries follow EU-style 14-day rules for online purchases",
      "Door-to-door sales often have cooling-off protections",
      "Faulty goods typically have remedy rights regardless of cooling-off",
    ],
    howToCancel: [
      "Check the seller's return policy",
      "Contact your local consumer protection agency",
      "Send any cancellation notice in writing",
      "Keep proof of your purchase and cancellation",
    ],
    warnings: [
      "Rules vary significantly by country and product type",
      "Credit card chargebacks may be available for disputes",
    ],
    legalBasis: "Varies by jurisdiction",
    country: "other",
  }
}

function StatusBadge({ hasCoolingOff, daysRemaining }: { hasCoolingOff: boolean; daysRemaining: number | null }) {
  if (!hasCoolingOff) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-stone-100 text-stone-600 border-stone-200 text-sm font-medium">
        <Icon icon={AlertCircleIcon} size={18} />
        No Cooling-Off
      </div>
    )
  }

  const isUrgent = daysRemaining !== null && daysRemaining <= 3

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium",
      isUrgent
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-green-100 text-green-700 border-green-200"
    )}>
      <Icon icon={isUrgent ? Clock01Icon : CheckmarkCircle01Icon} size={18} />
      {daysRemaining} Day{daysRemaining === 1 ? "" : "s"} Remaining
    </div>
  )
}

function ResultCard({ result }: { result: CoolingOffResult }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Status */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <StatusBadge hasCoolingOff={result.hasCoolingOff} daysRemaining={result.daysRemaining} />
          {result.periodDays && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon icon={Calendar01Icon} size={16} />
              <span>{result.periodDays}-day cooling-off period</span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
        {result.legalBasis && (
          <div className="mt-3 pt-3 border-t border-forest-100">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Legal basis:</span> {result.legalBasis}
            </p>
          </div>
        )}
      </div>

      {/* How to Cancel */}
      {result.howToCancel.length > 0 && (
        <div className="p-6 bg-background border border-forest-100 rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">How to Cancel</h3>
          <ol className="space-y-3">
            {result.howToCancel.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-forest-100 text-forest-600 text-sm font-medium flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Exceptions */}
      {result.exceptions.length > 0 && (
        <div className="p-6 bg-background border border-forest-100 rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Exceptions to Note</h3>
          <ul className="space-y-2">
            {result.exceptions.map((exception, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-amber-500 mt-1">•</span>
                <span className="text-muted-foreground">{exception}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

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
      {result.hasCoolingOff && (
        <div className="p-6 bg-forest-500 rounded-lg text-white">
          <h3 className="font-semibold text-lg mb-2">Need help cancelling?</h3>
          <p className="text-forest-100 mb-4">
            Generate a professional cancellation notice that cites your legal rights under the Consumer Contracts Regulations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="coral">
              <Link href="/new?tool=cooling-off" className="flex items-center">
                Generate Cancellation Notice
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
      )}
    </div>
  )
}

export function CoolingOffForm() {
  const [country, setCountry] = useState<Country | "">("")
  const [purchaseLocation, setPurchaseLocation] = useState<PurchaseLocation | "">("")
  const [productType, setProductType] = useState<ProductType | "">("")
  const [receiveDate, setReceiveDate] = useState("")
  const [requestedImmediateStart, setRequestedImmediateStart] = useState<string>("")
  const [result, setResult] = useState<CoolingOffResult | null>(null)
  const [error, setError] = useState("")

  // Only show immediate start question for UK/EU (where it matters)
  const showImmediateStartQuestion =
    (country === "uk" || country === "eu") &&
    purchaseLocation &&
    purchaseLocation !== "in-store" &&
    (productType === "services" || productType === "digital-content")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!country) {
      setError("Please select your country/region")
      return
    }

    if (!purchaseLocation) {
      setError("Please select where you made the purchase")
      return
    }

    if (!productType) {
      setError("Please select what you bought")
      return
    }

    if (!receiveDate) {
      setError("Please enter when you received the item or service")
      return
    }

    if (showImmediateStartQuestion && !requestedImmediateStart) {
      setError("Please answer whether you requested immediate start")
      return
    }

    const coolingOff = calculateCoolingOff(
      country,
      purchaseLocation,
      productType,
      receiveDate,
      requestedImmediateStart === "yes"
    )
    setResult(coolingOff)
  }

  const handleReset = () => {
    setCountry("")
    setPurchaseLocation("")
    setProductType("")
    setReceiveDate("")
    setRequestedImmediateStart("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country/Region */}
          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-2">
              <Icon icon={Globe02Icon} size={16} className="text-muted-foreground" />
              Where are you located?
            </Label>
            <Select
              value={country}
              onValueChange={(value) => setCountry(value as Country)}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country/region" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.flag} {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Cooling-off rights vary by country
            </p>
          </div>

          {/* Purchase Location */}
          <div className="space-y-2">
            <Label htmlFor="purchase-location">Where did you buy it?</Label>
            <Select
              value={purchaseLocation}
              onValueChange={(value) => setPurchaseLocation(value as PurchaseLocation)}
            >
              <SelectTrigger id="purchase-location">
                <SelectValue placeholder="Select purchase location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online (website or app)</SelectItem>
                <SelectItem value="phone">Over the phone</SelectItem>
                <SelectItem value="doorstep">Doorstep sale (trader came to your home)</SelectItem>
                <SelectItem value="trade-fair">Trade fair or exhibition</SelectItem>
                <SelectItem value="in-store">In a physical store</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Type */}
          <div className="space-y-2">
            <Label htmlFor="product-type">What did you buy?</Label>
            <Select
              value={productType}
              onValueChange={(value) => setProductType(value as ProductType)}
            >
              <SelectTrigger id="product-type">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physical-goods">Physical goods (delivered to you)</SelectItem>
                <SelectItem value="services">Services (e.g., gym, insurance, subscription)</SelectItem>
                <SelectItem value="digital-content">Digital content (downloads, streaming, games)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Receive Date */}
          <div className="space-y-2">
            <Label htmlFor="receive-date">
              {productType === "physical-goods"
                ? "When did you receive the goods?"
                : productType === "services"
                  ? "When did you sign the contract?"
                  : "When did you purchase it?"}
            </Label>
            <Input
              id="receive-date"
              type="date"
              value={receiveDate}
              onChange={(e) => setReceiveDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Immediate Start Question */}
          {showImmediateStartQuestion && (
            <div className="space-y-2">
              <Label htmlFor="immediate-start">
                {productType === "digital-content"
                  ? "Did you agree to start downloading/streaming immediately?"
                  : "Did you request the service to start within the 14-day period?"}
              </Label>
              <Select
                value={requestedImmediateStart}
                onValueChange={setRequestedImmediateStart}
              >
                <SelectTrigger id="immediate-start">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="unsure">Not sure</SelectItem>
                </SelectContent>
              </Select>
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
            Check My Cooling-Off Period
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Cooling-Off Rights</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Check another purchase
            </Button>
          </div>
          <ResultCard result={result} />
        </div>
      )}
    </div>
  )
}
