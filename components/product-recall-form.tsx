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
  Link01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type ProductCategory = "vehicle" | "food" | "electronics" | "toys" | "appliances" | "medicine" | "other"

interface RecallResource {
  name: string
  url: string
  description: string
}

interface RecallResult {
  category: ProductCategory
  resources: RecallResource[]
  whatToDo: string[]
  rights: string[]
}

const recallResources: Record<ProductCategory, RecallResource[]> = {
  vehicle: [
    { name: "DVSA Recalls", url: "https://www.check-vehicle-recalls.service.gov.uk", description: "Check vehicle recalls by registration number" },
    { name: "MOT History", url: "https://www.check-mot.service.gov.uk", description: "Check MOT history and outstanding recalls" },
  ],
  food: [
    { name: "FSA Alerts", url: "https://www.food.gov.uk/news-alerts/search/alerts", description: "Food Standards Agency recall alerts" },
    { name: "FSA Allergy Alerts", url: "https://www.food.gov.uk/news-alerts/search/allergen", description: "Allergy-specific food alerts" },
  ],
  electronics: [
    { name: "OPSS Product Recalls", url: "https://www.gov.uk/guidance/product-recalls-and-alerts", description: "Office for Product Safety and Standards" },
    { name: "Electrical Safety First", url: "https://www.electricalsafetyfirst.org.uk/product-recalls", description: "Electrical product recalls" },
  ],
  toys: [
    { name: "OPSS Product Recalls", url: "https://www.gov.uk/guidance/product-recalls-and-alerts", description: "Office for Product Safety and Standards" },
  ],
  appliances: [
    { name: "OPSS Product Recalls", url: "https://www.gov.uk/guidance/product-recalls-and-alerts", description: "Office for Product Safety and Standards" },
    { name: "Register My Appliance", url: "https://www.registermyappliance.org.uk", description: "Register appliances for recall alerts" },
  ],
  medicine: [
    { name: "MHRA Alerts", url: "https://www.gov.uk/drug-device-alerts", description: "Medicines and Healthcare products Regulatory Agency" },
  ],
  other: [
    { name: "OPSS Product Recalls", url: "https://www.gov.uk/guidance/product-recalls-and-alerts", description: "Office for Product Safety and Standards" },
  ],
}

export function ProductRecallForm() {
  const [category, setCategory] = useState<ProductCategory | "">("")
  const [productName, setProductName] = useState("")
  const [brandModel, setBrandModel] = useState("")
  const [result, setResult] = useState<RecallResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!category) {
      setError("Please select a product category")
      return
    }

    const resources = recallResources[category]

    const whatToDo = [
      "Visit the recall database links below to check for recalls",
      "Search using your product name, brand, or model number",
      "If recalled, stop using the product immediately",
      "Contact the manufacturer for repair, replacement, or refund",
      "Keep the product (don't throw it away) until instructed",
    ]

    if (category === "vehicle") {
      whatToDo.unshift("Enter your vehicle registration number on the DVSA website")
    }

    const rights = [
      "You're entitled to a free remedy (repair, replacement, or refund)",
      "You don't need a receipt to claim on a safety recall",
      "The manufacturer/retailer pays all costs",
      "If injured by a recalled product, you may have a compensation claim",
      "Report unsafe products to Trading Standards",
    ]

    setResult({
      category,
      resources,
      whatToDo,
      rights,
    })
  }

  const handleReset = () => {
    setCategory("")
    setProductName("")
    setBrandModel("")
    setResult(null)
    setError("")
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Check Resources</h2>
          <Button variant="ghost" size="sm" onClick={handleReset}>Start again</Button>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon icon={AlertCircleIcon} size={20} className="text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              We provide links to official recall databases. Always check the official sources for the most up-to-date information.
            </p>
          </div>
        </div>

        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Official Recall Databases</h3>
          <div className="space-y-3">
            {result.resources.map((resource, i) => (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-forest-50 dark:bg-forest-900/20 rounded-md hover:bg-forest-100 dark:hover:bg-forest-900/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{resource.name}</p>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
                <Icon icon={Link01Icon} size={16} className="text-forest-500" />
              </a>
            ))}
          </div>
        </div>

        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">What To Do</h3>
          <ul className="space-y-2">
            {result.whatToDo.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="font-medium text-forest-500 mt-0.5">{i + 1}.</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Your Rights</h3>
          <ul className="space-y-3">
            {result.rights.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg text-white">
          <h3 className="font-semibold text-lg mb-2">Injured by a Faulty Product?</h3>
          <p className="text-forest-100 mb-4">
            If you've been harmed by a defective product, you may be entitled to compensation.
          </p>
          <Button asChild variant="coral">
            <Link href="/new?tool=product-injury">
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
      <div className="space-y-2">
        <Label htmlFor="category">Product category</Label>
        <Select value={category} onValueChange={(value) => setCategory(value as ProductCategory)}>
          <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="vehicle">Vehicle (car, motorcycle, etc.)</SelectItem>
            <SelectItem value="food">Food & Drink</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="toys">Toys & Children's Products</SelectItem>
            <SelectItem value="appliances">Home Appliances</SelectItem>
            <SelectItem value="medicine">Medicines & Medical Devices</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-name">Product name (optional)</Label>
        <Input id="product-name" type="text" placeholder="e.g. Washing machine, Baby monitor" value={productName} onChange={(e) => setProductName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand-model">Brand / Model (optional)</Label>
        <Input id="brand-model" type="text" placeholder="e.g. Samsung, Model XYZ-123" value={brandModel} onChange={(e) => setBrandModel(e.target.value)} />
        <p className="text-xs text-muted-foreground">Having the exact model number helps when searching recall databases</p>
      </div>

      {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">{error}</div>}

      <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12">
        Find Recall Resources
        <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
      </Button>

      <p className="text-xs text-center text-muted-foreground">Free tool. No account required.</p>
    </form>
  )
}
