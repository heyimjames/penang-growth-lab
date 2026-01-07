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
  AlertCircleIcon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type Country = "uk" | "us" | "eu"
type SellerType = "dealer" | "private" | "auction"
type CarCondition = "new" | "used"

interface RightsResult {
  canReject: boolean
  rights: string[]
  remedies: string[]
  nextSteps: string[]
  warnings: string[]
  timeLimit: string
}

export function CarLemonLawForm() {
  const [country, setCountry] = useState<Country | "">("")
  const [sellerType, setSellerType] = useState<SellerType | "">("")
  const [carCondition, setCarCondition] = useState<CarCondition | "">("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [faultDate, setFaultDate] = useState("")
  const [dealerName, setDealerName] = useState("")
  const [faultDescription, setFaultDescription] = useState("")
  const [hadRepairs, setHadRepairs] = useState("")
  const [result, setResult] = useState<RightsResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!country) {
      setError("Please select your country")
      return
    }

    if (!sellerType) {
      setError("Please select where you bought the car")
      return
    }

    if (!purchaseDate) {
      setError("Please enter the purchase date")
      return
    }

    const purchase = new Date(purchaseDate)
    const fault = faultDate ? new Date(faultDate) : new Date()
    const today = new Date()
    const daysSincePurchase = Math.floor((fault.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24))
    const monthsSincePurchase = daysSincePurchase / 30

    let canReject = false
    let rights: string[] = []
    let remedies: string[] = []
    let warnings: string[] = []
    let timeLimit = ""

    if (country === "uk") {
      if (sellerType === "dealer") {
        if (daysSincePurchase <= 30) {
          canReject = true
          rights = [
            "Short-term right to reject - full refund available",
            "No need to allow repair attempts first",
            "Dealer must prove fault wasn't present at purchase",
          ]
          remedies = ["Full refund", "Keep the car and negotiate partial refund", "Replacement vehicle"]
          timeLimit = `${30 - daysSincePurchase} days left to reject for full refund`
        } else if (monthsSincePurchase <= 6) {
          canReject = hadRepairs === "yes"
          rights = [
            "Must allow one repair attempt before rejection",
            "Dealer must prove fault wasn't present at purchase (burden of proof on them)",
            "Right to repair, replacement, or price reduction",
          ]
          remedies = hadRepairs === "yes"
            ? ["Final right to reject (refund minus usage deduction)", "Price reduction", "Further repair"]
            : ["Request repair/replacement first", "If repair fails, can then reject"]
          timeLimit = "Within 6 months - dealer must prove fault wasn't present"
        } else {
          canReject = false
          rights = [
            "You must prove the fault was present at purchase",
            "Products must last a reasonable time (up to 6 years to claim)",
            "Right to repair, partial refund, or price reduction",
          ]
          remedies = ["Repair at dealer's cost", "Partial refund", "Price reduction"]
          warnings.push("After 6 months, you need to prove the fault was inherent - consider getting an independent inspection")
          timeLimit = "Up to 6 years to claim, but burden of proof is on you"
        }
      } else if (sellerType === "private") {
        canReject = false
        rights = [
          "Car must match description given by seller",
          "No 'satisfactory quality' protection from private sellers",
          "May have claim for misrepresentation if seller lied",
        ]
        remedies = ["Claim for misrepresentation if seller lied", "Small claims court for damages"]
        warnings.push("Private sales have much weaker protection than dealer sales")
        timeLimit = "6 years to claim for misrepresentation"
      } else {
        rights = ["Auction 'sold as seen' may limit rights", "Still protected against misrepresentation"]
        remedies = ["Check auction terms", "May have limited recourse"]
        warnings.push("Auction sales often have limited buyer protection - check the terms")
        timeLimit = "Varies - check auction terms"
      }
    } else if (country === "us") {
      if (carCondition === "new") {
        rights = [
          "State lemon law may apply (varies by state)",
          "Federal Magnuson-Moss Warranty Act protection",
          "Typically covers substantial defects not fixed in 3-4 attempts",
        ]
        remedies = ["Refund or replacement under lemon law", "Warranty repairs", "Legal action"]
        warnings.push("Lemon laws vary significantly by state - check your specific state's requirements")
        timeLimit = "Usually within first 12-24 months or 12,000-24,000 miles (varies by state)"
      } else {
        rights = [
          "Used car lemon laws exist in some states",
          "Implied warranty of merchantability may apply",
          "'As-is' sales may waive protections",
        ]
        remedies = ["Depends on state law and whether sold 'as-is'", "FTC Used Car Rule requires disclosure"]
        warnings.push("Used car protections vary widely by state")
        timeLimit = "Varies by state"
      }
    } else if (country === "eu") {
      if (monthsSincePurchase <= 24) {
        canReject = monthsSincePurchase <= 6
        rights = [
          "2-year legal guarantee on all consumer goods",
          "First 6 months: seller must prove fault wasn't present",
          "After 6 months: buyer must prove fault was inherent",
        ]
        remedies = ["Repair or replacement", "Price reduction", "Full refund if repair/replacement impossible"]
        timeLimit = "2-year legal guarantee"
      } else {
        rights = ["2-year guarantee has expired", "Check if manufacturer warranty still applies"]
        remedies = ["Manufacturer warranty if applicable", "Goodwill claim"]
        timeLimit = "Guarantee expired"
      }
    }

    const nextSteps = [
      "Document the fault with photos, videos, and written description",
      "Get an independent inspection report from a qualified mechanic",
      `Write to ${sellerType === "dealer" ? "the dealer" : "the seller"} formally in writing`,
      "State the fault, when it appeared, and what remedy you want",
      "Give them 14 days to respond",
      sellerType === "dealer" ? "If no response, escalate to Motor Ombudsman or court" : "If no response, consider small claims court",
    ]

    setResult({
      canReject,
      rights,
      remedies,
      nextSteps,
      warnings,
      timeLimit,
    })
  }

  const handleReset = () => {
    setCountry("")
    setSellerType("")
    setCarCondition("")
    setPurchaseDate("")
    setPurchasePrice("")
    setFaultDate("")
    setDealerName("")
    setFaultDescription("")
    setHadRepairs("")
    setResult(null)
    setError("")
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Your Rights</h2>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Start again
          </Button>
        </div>

        {/* Summary */}
        <div className={`p-6 border rounded-lg ${result.canReject ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"}`}>
          <div className="flex items-start gap-3">
            <Icon
              icon={result.canReject ? CheckmarkCircle01Icon : AlertCircleIcon}
              size={24}
              className={result.canReject ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}
            />
            <div>
              <h3 className={`font-semibold ${result.canReject ? "text-green-800 dark:text-green-200" : "text-amber-800 dark:text-amber-200"}`}>
                {result.canReject ? "You May Be Able to Reject the Car" : "Rejection May Be Difficult"}
              </h3>
              <p className={`text-sm mt-1 ${result.canReject ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300"}`}>
                {result.timeLimit}
              </p>
            </div>
          </div>
        </div>

        {/* Rights */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Your Legal Rights</h3>
          <ul className="space-y-3">
            {result.rights.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Remedies */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Available Remedies</h3>
          <ul className="space-y-2">
            {result.remedies.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-forest-500">•</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warnings */}
        {result.warnings.length > 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon icon={AlertCircleIcon} size={20} className="text-amber-500 flex-shrink-0" />
              <div className="space-y-1">
                {result.warnings.map((warning, i) => (
                  <p key={i} className="text-sm text-amber-700 dark:text-amber-300">{warning}</p>
                ))}
              </div>
            </div>
          </div>
        )}

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
          <h3 className="font-semibold text-lg mb-2">Need Help With Your Claim?</h3>
          <p className="text-forest-100 mb-4">
            NoReply can help you write a formal rejection letter or complaint citing the Consumer Rights Act.
          </p>
          <Button asChild variant="coral">
            <Link href={`/new?tool=faulty-car&dealer=${encodeURIComponent(dealerName)}`} className="flex items-center">
              Get Help With Your Claim
              <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country">Where did you buy the car?</Label>
        <Select value={country} onValueChange={(value) => setCountry(value as Country)}>
          <SelectTrigger id="country">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="eu">European Union</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Seller Type */}
      <div className="space-y-2">
        <Label htmlFor="seller-type">Where did you buy it from?</Label>
        <Select value={sellerType} onValueChange={(value) => setSellerType(value as SellerType)}>
          <SelectTrigger id="seller-type">
            <SelectValue placeholder="Select seller type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dealer">Car dealer (franchised or independent)</SelectItem>
            <SelectItem value="private">Private seller</SelectItem>
            <SelectItem value="auction">Auction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Car Condition */}
      {country === "us" && (
        <div className="space-y-2">
          <Label htmlFor="car-condition">Was the car new or used?</Label>
          <Select value={carCondition} onValueChange={(value) => setCarCondition(value as CarCondition)}>
            <SelectTrigger id="car-condition">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Dealer Name */}
      {sellerType === "dealer" && (
        <div className="space-y-2">
          <Label htmlFor="dealer-name">Dealer name</Label>
          <Input
            id="dealer-name"
            type="text"
            placeholder="e.g. Arnold Clark, Evans Halshaw"
            value={dealerName}
            onChange={(e) => setDealerName(e.target.value)}
          />
        </div>
      )}

      {/* Dates */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchase-date">Purchase date</Label>
          <Input
            id="purchase-date"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fault-date">When did fault appear?</Label>
          <Input
            id="fault-date"
            type="date"
            value={faultDate}
            onChange={(e) => setFaultDate(e.target.value)}
          />
        </div>
      </div>

      {/* Purchase Price */}
      <div className="space-y-2">
        <Label htmlFor="purchase-price">Purchase price (optional)</Label>
        <Input
          id="purchase-price"
          type="text"
          placeholder="e.g. 15000"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value.replace(/[^0-9.]/g, ""))}
        />
      </div>

      {/* Had Repairs */}
      {sellerType === "dealer" && (
        <div className="space-y-2">
          <Label htmlFor="had-repairs">Has the dealer already attempted repair?</Label>
          <Select value={hadRepairs} onValueChange={setHadRepairs}>
            <SelectTrigger id="had-repairs">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes - repair was attempted</SelectItem>
              <SelectItem value="no">No - not yet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Fault Description */}
      <div className="space-y-2">
        <Label htmlFor="fault-description">Describe the fault</Label>
        <Textarea
          id="fault-description"
          placeholder="What's wrong with the car?"
          value={faultDescription}
          onChange={(e) => setFaultDescription(e.target.value)}
          rows={4}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12">
        Check My Rights
        <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Free tool. No account required. For guidance only.
      </p>
    </form>
  )
}
