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
  RefreshIcon,
  Settings01Icon,
  Globe02Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type Country = "uk" | "eu" | "us" | "au" | "ca" | "other"
type ProductCategory = "electronics" | "clothing" | "furniture" | "appliances" | "vehicle" | "other"

const countryConfig: Record<Country, { name: string; flag: string; legalBasis: string }> = {
  uk: { name: "United Kingdom", flag: "🇬🇧", legalBasis: "Consumer Rights Act 2015" },
  eu: { name: "European Union", flag: "🇪🇺", legalBasis: "EU Consumer Rights Directive" },
  us: { name: "United States", flag: "🇺🇸", legalBasis: "State Lemon Laws & UCC" },
  au: { name: "Australia", flag: "🇦🇺", legalBasis: "Australian Consumer Guarantees" },
  ca: { name: "Canada", flag: "🇨🇦", legalBasis: "Provincial Consumer Protection Acts" },
  other: { name: "Other Country", flag: "🌍", legalBasis: "Local consumer protection laws" },
}

interface TimelineStage {
  name: string
  days: string
  rights: string[]
  current: boolean
  passed: boolean
}

interface RefundResult {
  daysSincePurchase: number
  daysSinceFault: number
  currentStage: "short-term" | "medium-term" | "long-term"
  canGetFullRefund: boolean
  mustAcceptRepair: boolean
  burdenOfProof: "seller" | "buyer"
  stages: TimelineStage[]
  recommendation: string
  nextSteps: string[]
  warnings: string[]
  legalBasis: string
  country: Country
}

function calculateRefundRights(
  country: Country,
  purchaseDate: string,
  faultDate: string,
  productCategory: ProductCategory,
  significantUse: string
): RefundResult {
  const now = new Date()
  const purchase = new Date(purchaseDate)
  const fault = new Date(faultDate)
  const config = countryConfig[country]

  const daysSincePurchase = Math.floor((now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24))
  const daysSinceFault = Math.floor((now.getTime() - fault.getTime()) / (1000 * 60 * 60 * 24))

  // Generate country-specific stages
  let stages: TimelineStage[] = []
  let currentStage: "short-term" | "medium-term" | "long-term"
  let canGetFullRefund = false
  let mustAcceptRepair = false
  let burdenOfProof: "seller" | "buyer" = "seller"
  let recommendation = ""
  const nextSteps: string[] = []
  const warnings: string[] = []

  if (country === "uk") {
    stages = [
      {
        name: "Short-term right to reject",
        days: "0-30 days",
        rights: [
          "Full refund for any fault",
          "No repair attempts needed first",
          "Refund within 14 days of return",
        ],
        current: daysSincePurchase <= 30,
        passed: daysSincePurchase > 30,
      },
      {
        name: "Repair or replace first",
        days: "30 days - 6 months",
        rights: [
          "Request one repair or replacement",
          "If that fails, full refund available",
          "No deduction from refund",
          "Seller must prove item wasn't faulty",
        ],
        current: daysSincePurchase > 30 && daysSincePurchase <= 180,
        passed: daysSincePurchase > 180,
      },
      {
        name: "Long-term rights",
        days: "6 months - 6 years",
        rights: [
          "Repair or replacement still available",
          "Refund may have deduction for use",
          "You must prove fault was present at delivery",
        ],
        current: daysSincePurchase > 180,
        passed: false,
      },
    ]

    if (daysSincePurchase <= 30) {
      currentStage = "short-term"
      canGetFullRefund = true
      recommendation = "You're within the 30-day short-term right to reject. You can request a full refund immediately."
      nextSteps.push("Contact the retailer in writing requesting a full refund")
      nextSteps.push("Cite Section 22 of the Consumer Rights Act 2015")
      if (30 - daysSincePurchase <= 5) {
        warnings.push(`Act fast - only ${30 - daysSincePurchase} days left!`)
      }
    } else if (daysSincePurchase <= 180) {
      currentStage = "medium-term"
      mustAcceptRepair = true
      recommendation = "The retailer gets one chance to repair or replace. If that fails, you can demand a full refund."
      nextSteps.push("Request a repair or replacement from the retailer")
      nextSteps.push("If repair fails, demand a full refund")
    } else {
      currentStage = "long-term"
      mustAcceptRepair = true
      burdenOfProof = "buyer"
      recommendation = "You'll need to prove the fault existed at purchase. Any refund may have a deduction."
      nextSteps.push("Gather evidence the fault was inherent")
      nextSteps.push("Request a repair or replacement first")
      if (significantUse === "yes") {
        warnings.push("The retailer can deduct for the use you've had")
      }
    }
  } else if (country === "eu") {
    stages = [
      {
        name: "Full protection period",
        days: "0-12 months",
        rights: [
          "Seller must prove defect wasn't present",
          "Choice of repair or replacement",
          "Free of charge remedy",
        ],
        current: daysSincePurchase <= 365,
        passed: daysSincePurchase > 365,
      },
      {
        name: "Extended protection",
        days: "12 months - 2 years",
        rights: [
          "You may need to prove defect existed at delivery",
          "Still entitled to remedy",
          "Refund if repair/replace not possible",
        ],
        current: daysSincePurchase > 365 && daysSincePurchase <= 730,
        passed: daysSincePurchase > 730,
      },
    ]

    if (daysSincePurchase <= 365) {
      currentStage = "short-term"
      canGetFullRefund = false
      mustAcceptRepair = true
      recommendation = "Under EU law, defects appearing within 1 year are presumed to have existed at delivery."
      nextSteps.push("Contact the seller requesting repair or replacement")
      nextSteps.push("The seller bears the burden of proof")
    } else if (daysSincePurchase <= 730) {
      currentStage = "medium-term"
      mustAcceptRepair = true
      burdenOfProof = "buyer"
      recommendation = "You're in the second year of the 2-year guarantee. You may need to prove the defect was present at delivery."
      nextSteps.push("Gather evidence of the defect")
      nextSteps.push("Request repair or replacement")
    } else {
      currentStage = "long-term"
      burdenOfProof = "buyer"
      recommendation = "The 2-year EU guarantee period has ended. Check if your country offers extended protection."
      warnings.push("Some EU countries offer longer protection periods")
    }
  } else if (country === "us") {
    stages = [
      {
        name: "Implied warranty period",
        days: "Varies by state",
        rights: [
          "Products must work as expected",
          "Implied warranty of merchantability",
          "Right to refund, repair, or replacement",
        ],
        current: daysSincePurchase <= 365,
        passed: false,
      },
      {
        name: "Extended claims",
        days: "Up to 4 years (varies)",
        rights: [
          "State laws vary on time limits",
          "May require proof of defect",
          "Magnuson-Moss Warranty Act protections",
        ],
        current: daysSincePurchase > 365,
        passed: false,
      },
    ]

    if (daysSincePurchase <= 30) {
      currentStage = "short-term"
      canGetFullRefund = true
      recommendation = "You're within most stores' return windows. Check the store's return policy first."
      nextSteps.push("Check the retailer's return policy")
      nextSteps.push("Return with receipt for full refund")
    } else if (daysSincePurchase <= 365) {
      currentStage = "medium-term"
      mustAcceptRepair = true
      recommendation = "Under the implied warranty of merchantability, products must work as reasonably expected."
      nextSteps.push("Contact the seller about the defect")
      nextSteps.push("Check for manufacturer warranty")
      nextSteps.push("File a complaint with your state attorney general if denied")
    } else {
      currentStage = "long-term"
      burdenOfProof = "buyer"
      recommendation = "Time limits vary by state (typically 4 years). You may need to prove the defect existed at sale."
      warnings.push("Consult your state's consumer protection laws")
    }
  } else if (country === "au") {
    stages = [
      {
        name: "Consumer guarantee period",
        days: "Reasonable time",
        rights: [
          "Products must be of acceptable quality",
          "Right to repair, replacement, or refund",
          "No fixed time limit - based on product type",
        ],
        current: true,
        passed: false,
      },
    ]

    currentStage = daysSincePurchase <= 30 ? "short-term" : daysSincePurchase <= 180 ? "medium-term" : "long-term"

    if (daysSincePurchase <= 30) {
      canGetFullRefund = true
      recommendation = "For major failures, you can choose a refund or replacement. For minor failures, the business can choose the remedy."
      nextSteps.push("Determine if this is a major or minor failure")
      nextSteps.push("Contact the retailer about your consumer guarantee rights")
    } else {
      mustAcceptRepair = true
      recommendation = "Australian Consumer Guarantees have no fixed time limit - it depends on what's 'reasonable' for the product."
      nextSteps.push("Consider the nature of the product and reasonable expectations")
      nextSteps.push("Contact the ACCC if the retailer refuses to help")
    }

    warnings.push("Time limits depend on the type of product and reasonable expectations")
  } else if (country === "ca") {
    stages = [
      {
        name: "Implied warranty period",
        days: "Varies by province",
        rights: [
          "Products must be of merchantable quality",
          "Fit for intended purpose",
          "Provincial consumer protection applies",
        ],
        current: daysSincePurchase <= 365,
        passed: false,
      },
    ]

    currentStage = daysSincePurchase <= 30 ? "short-term" : daysSincePurchase <= 180 ? "medium-term" : "long-term"

    recommendation = "Provincial consumer protection laws vary. Check your province's specific rules."
    nextSteps.push("Check your retailer's return policy")
    nextSteps.push("Review your provincial consumer protection act")
    nextSteps.push("Contact your provincial consumer affairs office")
    warnings.push("Laws vary significantly by province")
  } else {
    stages = [
      {
        name: "Consumer protection period",
        days: "Varies by country",
        rights: [
          "Products should match description",
          "Right to remedy for defects",
          "Check local consumer laws",
        ],
        current: true,
        passed: false,
      },
    ]

    currentStage = daysSincePurchase <= 30 ? "short-term" : "long-term"
    recommendation = "Consumer protection laws vary by country. Check with your local consumer protection agency."
    nextSteps.push("Contact the retailer first")
    nextSteps.push("Check your country's consumer protection laws")
    nextSteps.push("Contact your local consumer protection agency")
  }

  // Product-specific advice
  if (productCategory === "electronics" && currentStage === "long-term") {
    nextSteps.push("Check if manufacturer warranty is still valid")
  }
  if (productCategory === "vehicle") {
    warnings.push("Vehicle claims can be complex - consider an independent inspection")
  }

  return {
    daysSincePurchase,
    daysSinceFault,
    currentStage,
    canGetFullRefund,
    mustAcceptRepair,
    burdenOfProof,
    stages,
    recommendation,
    nextSteps,
    warnings,
    legalBasis: config.legalBasis,
    country,
  }
}

function TimelineVisual({ stages }: { stages: TimelineStage[] }) {
  return (
    <div className="space-y-4">
      {stages.map((stage, i) => (
        <div
          key={i}
          className={cn(
            "relative pl-8 pb-6",
            i < stages.length - 1 && "border-l-2",
            stage.current ? "border-forest-500" : stage.passed ? "border-forest-200" : "border-forest-100"
          )}
        >
          {/* Timeline dot */}
          <div
            className={cn(
              "absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full border-2",
              stage.current
                ? "bg-forest-500 border-forest-500"
                : stage.passed
                  ? "bg-forest-200 border-forest-200"
                  : "bg-white border-forest-200"
            )}
          />

          <div className={cn(
            "p-4 rounded-lg border",
            stage.current
              ? "bg-forest-50 border-forest-200"
              : "bg-background border-forest-100"
          )}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={cn(
                "font-medium",
                stage.current ? "text-forest-700" : stage.passed ? "text-muted-foreground" : "text-foreground"
              )}>
                {stage.name}
              </h4>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                stage.current
                  ? "bg-forest-500 text-white"
                  : stage.passed
                    ? "bg-stone-200 text-stone-600"
                    : "bg-forest-100 text-forest-600"
              )}>
                {stage.current ? "You are here" : stage.days}
              </span>
            </div>
            <ul className="space-y-1">
              {stage.rights.map((right, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <Icon
                    icon={stage.passed ? CheckmarkCircle01Icon : ArrowRight01Icon}
                    size={14}
                    className={cn(
                      "flex-shrink-0 mt-0.5",
                      stage.current ? "text-forest-500" : "text-muted-foreground"
                    )}
                  />
                  <span className={stage.current ? "text-foreground" : "text-muted-foreground"}>
                    {right}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

function ResultCard({ result }: { result: RefundResult }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Legal Basis */}
      <div className="p-4 bg-lavender-50 border border-lavender-200 rounded-lg">
        <p className="text-sm text-lavender-700">
          <span className="font-medium">Legal basis:</span> {result.legalBasis}
        </p>
      </div>

      {/* Status Summary */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center",
              result.canGetFullRefund ? "bg-green-100" : "bg-amber-100"
            )}>
              <Icon
                icon={result.canGetFullRefund ? CheckmarkCircle01Icon : result.mustAcceptRepair ? Settings01Icon : RefreshIcon}
                size={24}
                className={result.canGetFullRefund ? "text-green-600" : "text-amber-600"}
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {result.canGetFullRefund ? "Full Refund Available" : "Repair/Replace First"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {result.daysSincePurchase} days since purchase
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Burden of proof:</span>
            <span className={cn(
              "font-medium px-2 py-1 rounded",
              result.burdenOfProof === "seller" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            )}>
              {result.burdenOfProof === "seller" ? "On seller" : "On you"}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground">{result.recommendation}</p>
      </div>

      {/* Visual Timeline */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Your Rights Timeline</h3>
        <TimelineVisual stages={result.stages} />
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
        <h3 className="font-semibold text-lg mb-2">Ready to claim your refund?</h3>
        <p className="text-forest-100 mb-4">
          Generate a professional complaint letter citing your rights under {result.legalBasis}.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="coral">
            <Link href={`/new?tool=refund&days=${result.daysSincePurchase}&stage=${result.currentStage}&country=${result.country}`} className="flex items-center">
              Generate Refund Request Letter
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

export function RefundTimelineForm() {
  const [country, setCountry] = useState<Country | "">("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [faultDate, setFaultDate] = useState("")
  const [productCategory, setProductCategory] = useState<ProductCategory | "">("")
  const [significantUse, setSignificantUse] = useState("")
  const [result, setResult] = useState<RefundResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!country) {
      setError("Please select your country")
      return
    }

    if (!purchaseDate) {
      setError("Please enter when you bought the item")
      return
    }

    if (!faultDate) {
      setError("Please enter when the fault appeared")
      return
    }

    if (!productCategory) {
      setError("Please select a product type")
      return
    }

    const refundResult = calculateRefundRights(
      country,
      purchaseDate,
      faultDate,
      productCategory,
      significantUse
    )
    setResult(refundResult)
  }

  const handleReset = () => {
    setCountry("")
    setPurchaseDate("")
    setFaultDate("")
    setProductCategory("")
    setSignificantUse("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country Selector */}
          <div className="space-y-2">
            <Label htmlFor="country">
              <span className="flex items-center gap-2">
                <Icon icon={Globe02Icon} size={16} className="text-muted-foreground" />
                Where are you located?
              </span>
            </Label>
            <Select value={country} onValueChange={(value) => setCountry(value as Country)}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.flag} {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {country && (
              <p className="text-xs text-muted-foreground">
                Rights based on: {countryConfig[country].legalBasis}
              </p>
            )}
          </div>

          {/* Purchase Date */}
          <div className="space-y-2">
            <Label htmlFor="purchase-date">When did you buy it?</Label>
            <Input
              id="purchase-date"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Fault Date */}
          <div className="space-y-2">
            <Label htmlFor="fault-date">When did the fault appear?</Label>
            <Input
              id="fault-date"
              type="date"
              value={faultDate}
              onChange={(e) => setFaultDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              min={purchaseDate}
            />
            <p className="text-xs text-muted-foreground">
              When you first noticed the problem
            </p>
          </div>

          {/* Product Category */}
          <div className="space-y-2">
            <Label htmlFor="product-category">What type of product?</Label>
            <Select
              value={productCategory}
              onValueChange={(value) => setProductCategory(value as ProductCategory)}
            >
              <SelectTrigger id="product-category">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics (phones, TVs, computers)</SelectItem>
                <SelectItem value="appliances">Appliances (washing machine, fridge)</SelectItem>
                <SelectItem value="clothing">Clothing & footwear</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="other">Other goods</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Significant Use */}
          <div className="space-y-2">
            <Label htmlFor="significant-use">Have you used the item significantly?</Label>
            <Select value={significantUse} onValueChange={setSignificantUse}>
              <SelectTrigger id="significant-use">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No, barely used or unopened</SelectItem>
                <SelectItem value="some">Some use, but the fault prevented normal use</SelectItem>
                <SelectItem value="yes">Yes, I've had significant use before the fault</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This affects whether a deduction can be made from your refund
            </p>
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
            Check My Refund Rights
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Refund Rights</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Check another item
            </Button>
          </div>
          <ResultCard result={result} />
        </div>
      )}
    </div>
  )
}
