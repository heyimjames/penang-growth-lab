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
import Link from "next/link"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Calendar01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type Country = "uk" | "us" | "eu" | "au" | "ca"
type ProductCategory = "electronics" | "appliances" | "furniture" | "car" | "clothing" | "jewelry" | "other"

interface WarrantyResult {
  manufacturerWarrantyEnd: Date | null
  statutoryRightsEnd: Date | null
  extendedWarrantyEnd: Date | null
  protections: { name: string; expires: string; active: boolean }[]
  advice: string[]
  canStillClaim: boolean
  claimType: string
}

const warrantyPeriods: Record<ProductCategory, number> = {
  electronics: 12,
  appliances: 24,
  furniture: 12,
  car: 36,
  clothing: 12,
  jewelry: 24,
  other: 12,
}

const statutoryPeriods: Record<Country, { years: number; name: string }> = {
  uk: { years: 6, name: "Consumer Rights Act 2015" },
  us: { years: 4, name: "UCC Implied Warranty (varies by state)" },
  eu: { years: 2, name: "EU Consumer Sales Directive" },
  au: { years: 6, name: "Australian Consumer Law" },
  ca: { years: 6, name: "Provincial Consumer Protection" },
}

function calculateWarranty(
  purchaseDate: Date,
  country: Country,
  productCategory: ProductCategory,
  warrantyMonths: number,
  extendedMonths: number,
  productPrice: number
): WarrantyResult {
  const today = new Date()

  // Calculate manufacturer warranty end
  const manufacturerWarrantyEnd = new Date(purchaseDate)
  manufacturerWarrantyEnd.setMonth(manufacturerWarrantyEnd.getMonth() + warrantyMonths)

  // Calculate statutory rights end
  const statutoryInfo = statutoryPeriods[country]
  const statutoryRightsEnd = new Date(purchaseDate)
  statutoryRightsEnd.setFullYear(statutoryRightsEnd.getFullYear() + statutoryInfo.years)

  // Calculate extended warranty end (if applicable)
  let extendedWarrantyEnd: Date | null = null
  if (extendedMonths > 0) {
    extendedWarrantyEnd = new Date(manufacturerWarrantyEnd)
    extendedWarrantyEnd.setMonth(extendedWarrantyEnd.getMonth() + extendedMonths)
  }

  const protections: { name: string; expires: string; active: boolean }[] = []

  // Manufacturer warranty
  protections.push({
    name: "Manufacturer Warranty",
    expires: manufacturerWarrantyEnd.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    active: today < manufacturerWarrantyEnd,
  })

  // Extended warranty
  if (extendedWarrantyEnd) {
    protections.push({
      name: "Extended Warranty",
      expires: extendedWarrantyEnd.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      active: today < extendedWarrantyEnd,
    })
  }

  // Statutory rights
  protections.push({
    name: statutoryInfo.name,
    expires: statutoryRightsEnd.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    active: today < statutoryRightsEnd,
  })

  // Credit card protection (UK/US)
  if ((country === "uk" || country === "us") && productPrice >= 100) {
    const creditProtectionEnd = new Date(purchaseDate)
    creditProtectionEnd.setFullYear(creditProtectionEnd.getFullYear() + 6)
    protections.push({
      name: country === "uk" ? "Section 75 Protection" : "Credit Card Dispute",
      expires: creditProtectionEnd.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      active: today < creditProtectionEnd,
    })
  }

  // Determine if they can still claim
  const canStillClaim = protections.some(p => p.active)

  // Determine best claim type
  let claimType = "No active protection"
  if (today < manufacturerWarrantyEnd) {
    claimType = "Manufacturer Warranty"
  } else if (extendedWarrantyEnd && today < extendedWarrantyEnd) {
    claimType = "Extended Warranty"
  } else if (today < statutoryRightsEnd) {
    claimType = "Statutory Rights"
  }

  // Generate advice
  const advice: string[] = []

  if (today < manufacturerWarrantyEnd) {
    advice.push("Your manufacturer warranty is still active - contact the manufacturer or retailer first")
    advice.push("You don't need a receipt, but proof of purchase (bank statement, email confirmation) helps")
  } else if (today < statutoryRightsEnd) {
    advice.push("Your manufacturer warranty has expired, but you still have statutory rights")
    advice.push("Under statutory rights, products must be of satisfactory quality and last a reasonable time")
    advice.push("For expensive items, 'reasonable time' may be several years")

    if (country === "uk") {
      const sixMonths = new Date(purchaseDate)
      sixMonths.setMonth(sixMonths.getMonth() + 6)
      if (today < sixMonths) {
        advice.push("Within 6 months, the retailer must prove the fault wasn't present at purchase")
      } else {
        advice.push("After 6 months, you may need to prove the fault was inherent (not caused by misuse)")
      }
    }
  } else {
    advice.push("Your statutory rights period has expired")
    advice.push("However, if the product was expensive and failed prematurely, you may still have a claim")
  }

  if (productPrice >= 100 && (country === "uk" || country === "us")) {
    advice.push(`Paid by credit card? You may be able to claim under ${country === "uk" ? "Section 75" : "your credit card's dispute process"}`)
  }

  return {
    manufacturerWarrantyEnd,
    statutoryRightsEnd,
    extendedWarrantyEnd,
    protections,
    advice,
    canStillClaim,
    claimType,
  }
}

function ResultCard({ result, productName }: { result: WarrantyResult; productName: string }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary */}
      <div className={`p-6 border rounded-lg ${result.canStillClaim ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"}`}>
        <div className="flex items-start gap-3">
          <Icon
            icon={result.canStillClaim ? CheckmarkCircle01Icon : AlertCircleIcon}
            size={24}
            className={result.canStillClaim ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}
          />
          <div>
            <h3 className={`font-semibold ${result.canStillClaim ? "text-green-800 dark:text-green-200" : "text-amber-800 dark:text-amber-200"}`}>
              {result.canStillClaim ? "You Still Have Protection" : "Protection May Have Expired"}
            </h3>
            <p className={`text-sm mt-1 ${result.canStillClaim ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300"}`}>
              {result.canStillClaim
                ? `Best claim route: ${result.claimType}`
                : "Check the details below - you may still have options"}
            </p>
          </div>
        </div>
      </div>

      {/* Protection Timeline */}
      <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon icon={Calendar01Icon} size={20} className="text-forest-500" />
          Protection Timeline
        </h3>
        <div className="space-y-3">
          {result.protections.map((protection, i) => (
            <div
              key={i}
              className={`p-4 rounded-md flex justify-between items-center ${
                protection.active
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <div>
                <p className={`font-medium ${protection.active ? "text-green-800 dark:text-green-200" : "text-gray-500 dark:text-gray-400"}`}>
                  {protection.name}
                </p>
                <p className={`text-sm ${protection.active ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}>
                  Expires: {protection.expires}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                protection.active
                  ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}>
                {protection.active ? "Active" : "Expired"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Advice */}
      <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">What This Means</h3>
        <ul className="space-y-3">
          {result.advice.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      {result.canStillClaim && (
        <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg text-white">
          <h3 className="font-semibold text-lg mb-2">Need Help Making a Claim?</h3>
          <p className="text-forest-100 mb-4">
            NoReply can help you write a professional complaint letter citing your warranty rights and consumer protection laws.
          </p>
          <Button asChild variant="coral">
            <Link href={`/new?tool=warranty-claim&product=${encodeURIComponent(productName)}`} className="flex items-center">
              Start Your Claim
              <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export function WarrantyCheckerForm() {
  const [country, setCountry] = useState<Country | "">("")
  const [productCategory, setProductCategory] = useState<ProductCategory | "">("")
  const [productName, setProductName] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [warrantyMonths, setWarrantyMonths] = useState("")
  const [extendedMonths, setExtendedMonths] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [result, setResult] = useState<WarrantyResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!country) {
      setError("Please select your country")
      return
    }

    if (!productCategory) {
      setError("Please select a product category")
      return
    }

    if (!purchaseDate) {
      setError("Please enter the purchase date")
      return
    }

    const purchase = new Date(purchaseDate)
    if (purchase > new Date()) {
      setError("Purchase date cannot be in the future")
      return
    }

    const warranty = parseInt(warrantyMonths) || warrantyPeriods[productCategory]
    const extended = parseInt(extendedMonths) || 0
    const price = parseFloat(productPrice) || 0

    const warrantyResult = calculateWarranty(
      purchase,
      country,
      productCategory,
      warranty,
      extended,
      price
    )

    setResult(warrantyResult)
  }

  const handleReset = () => {
    setCountry("")
    setProductCategory("")
    setProductName("")
    setPurchaseDate("")
    setWarrantyMonths("")
    setExtendedMonths("")
    setProductPrice("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Where did you buy it?</Label>
            <Select value={country} onValueChange={(value) => setCountry(value as Country)}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="eu">European Union</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Category */}
          <div className="space-y-2">
            <Label htmlFor="product-category">Product type</Label>
            <Select value={productCategory} onValueChange={(value) => setProductCategory(value as ProductCategory)}>
              <SelectTrigger id="product-category">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics (phone, laptop, TV)</SelectItem>
                <SelectItem value="appliances">Home Appliances (washing machine, fridge)</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="car">Vehicle / Car Parts</SelectItem>
                <SelectItem value="clothing">Clothing / Shoes</SelectItem>
                <SelectItem value="jewelry">Jewelry / Watches</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="product-name">Product name (optional)</Label>
            <Input
              id="product-name"
              type="text"
              placeholder="e.g. iPhone 14 Pro, Samsung TV"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* Purchase Date */}
          <div className="space-y-2">
            <Label htmlFor="purchase-date">When did you buy it?</Label>
            <Input
              id="purchase-date"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>

          {/* Warranty Period */}
          <div className="space-y-2">
            <Label htmlFor="warranty-months">Manufacturer warranty (months)</Label>
            <Input
              id="warranty-months"
              type="number"
              placeholder={productCategory ? `Default: ${warrantyPeriods[productCategory]} months` : "e.g. 12, 24"}
              value={warrantyMonths}
              onChange={(e) => setWarrantyMonths(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use typical warranty for this product type
            </p>
          </div>

          {/* Extended Warranty */}
          <div className="space-y-2">
            <Label htmlFor="extended-months">Extended warranty purchased? (months)</Label>
            <Input
              id="extended-months"
              type="number"
              placeholder="e.g. 12, 24 (leave blank if none)"
              value={extendedMonths}
              onChange={(e) => setExtendedMonths(e.target.value)}
            />
          </div>

          {/* Product Price */}
          <div className="space-y-2">
            <Label htmlFor="product-price">Approximate price paid</Label>
            <Input
              id="product-price"
              type="text"
              placeholder="e.g. 500"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            />
            <p className="text-xs text-muted-foreground">
              Used to check credit card protection eligibility
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12">
            Check Warranty Status
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Warranty Status</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Check another product
            </Button>
          </div>
          <ResultCard result={result} productName={productName || "your product"} />
        </div>
      )}
    </div>
  )
}
