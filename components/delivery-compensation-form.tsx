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

type IssueType = "late" | "missing" | "damaged" | "wrong" | "partial"

interface CompensationResult {
  issueType: IssueType
  entitlements: string[]
  compensation: string
  nextSteps: string[]
  warnings: string[]
}

export function DeliveryCompensationForm() {
  const [issueType, setIssueType] = useState<IssueType | "">("")
  const [retailer, setRetailer] = useState("")
  const [orderValue, setOrderValue] = useState("")
  const [deliveryCost, setDeliveryCost] = useState("")
  const [promisedDate, setPromisedDate] = useState("")
  const [actualDate, setActualDate] = useState("")
  const [wasEssential, setWasEssential] = useState("")
  const [details, setDetails] = useState("")
  const [result, setResult] = useState<CompensationResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!issueType) {
      setError("Please select the delivery issue")
      return
    }

    const orderVal = parseFloat(orderValue) || 0
    const deliveryVal = parseFloat(deliveryCost) || 0

    let entitlements: string[] = []
    let compensation = ""
    let warnings: string[] = []

    switch (issueType) {
      case "late":
        entitlements = [
          "Refund of delivery charges paid",
          "Cancel order if delivery date was essential",
          "Full refund if goods not received within 30 days",
        ]
        compensation = deliveryVal > 0 ? `At minimum: £${deliveryVal.toFixed(2)} delivery refund` : "Delivery charges refunded"
        if (wasEssential === "yes") {
          entitlements.unshift("Full refund as delivery date was essential")
          compensation = `Up to £${(orderVal + deliveryVal).toFixed(2)} full refund`
        }
        break

      case "missing":
        entitlements = [
          "Full refund OR replacement - your choice",
          "Seller is responsible until delivery is made",
          "They cannot blame the courier - your contract is with the seller",
        ]
        compensation = `Full refund: £${(orderVal + deliveryVal).toFixed(2)}`
        break

      case "damaged":
        entitlements = [
          "Full refund OR replacement for damaged goods",
          "You don't need to return damaged goods at your cost",
          "Seller is responsible for goods until delivered safely",
        ]
        compensation = `Refund value: £${orderVal.toFixed(2)} (plus delivery if returning)`
        warnings.push("Take photos of damage before disposing of packaging")
        break

      case "wrong":
        entitlements = [
          "Return wrong item at seller's expense",
          "Receive correct item OR full refund",
          "No restocking fees can be charged",
        ]
        compensation = `Correct item or refund: £${orderVal.toFixed(2)}`
        break

      case "partial":
        entitlements = [
          "Receive missing items OR partial refund",
          "Can reject whole order if partial delivery is unacceptable",
          "Full refund if remaining items never arrive",
        ]
        compensation = "Partial refund for missing items"
        break
    }

    const nextSteps = [
      "Contact the seller (not courier) with your complaint",
      "Quote your order number and explain the issue",
      "Request specific remedy (refund, replacement, etc.)",
      "Give them 14 days to respond",
      "If no response, escalate with credit card chargeback or NoReply",
    ]

    setResult({
      issueType,
      entitlements,
      compensation,
      nextSteps,
      warnings,
    })
  }

  const handleReset = () => {
    setIssueType("")
    setRetailer("")
    setOrderValue("")
    setDeliveryCost("")
    setPromisedDate("")
    setActualDate("")
    setWasEssential("")
    setDetails("")
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
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon icon={CheckmarkCircle01Icon} size={24} className="text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">You Have Rights</h3>
              <p className="text-sm mt-1 text-green-700 dark:text-green-300">{result.compensation}</p>
            </div>
          </div>
        </div>

        {/* Entitlements */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">What You&apos;re Entitled To</h3>
          <ul className="space-y-3">
            {result.entitlements.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
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
          <h3 className="font-semibold text-lg mb-2">Need Help Getting Your Refund?</h3>
          <p className="text-forest-100 mb-4">
            NoReply can generate a formal complaint letter citing the Consumer Contracts Regulations.
          </p>
          <Button asChild variant="coral">
            <Link href={`/new?tool=delivery&retailer=${encodeURIComponent(retailer)}`} className="flex items-center">
              Start Your Claim
              <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Issue Type */}
      <div className="space-y-2">
        <Label htmlFor="issue-type">What&apos;s the problem?</Label>
        <Select value={issueType} onValueChange={(value) => setIssueType(value as IssueType)}>
          <SelectTrigger id="issue-type">
            <SelectValue placeholder="Select the issue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="late">Delivery arrived late</SelectItem>
            <SelectItem value="missing">Package never arrived</SelectItem>
            <SelectItem value="damaged">Item arrived damaged</SelectItem>
            <SelectItem value="wrong">Wrong item delivered</SelectItem>
            <SelectItem value="partial">Only part of order arrived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Retailer */}
      <div className="space-y-2">
        <Label htmlFor="retailer">Retailer name</Label>
        <Input
          id="retailer"
          type="text"
          placeholder="e.g. Amazon, ASOS, Argos"
          value={retailer}
          onChange={(e) => setRetailer(e.target.value)}
        />
      </div>

      {/* Order Value */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="order-value">Order value (£)</Label>
          <Input
            id="order-value"
            type="text"
            placeholder="e.g. 50.00"
            value={orderValue}
            onChange={(e) => setOrderValue(e.target.value.replace(/[^0-9.]/g, ""))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="delivery-cost">Delivery cost (£)</Label>
          <Input
            id="delivery-cost"
            type="text"
            placeholder="e.g. 4.99"
            value={deliveryCost}
            onChange={(e) => setDeliveryCost(e.target.value.replace(/[^0-9.]/g, ""))}
          />
        </div>
      </div>

      {/* Dates */}
      {issueType === "late" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promised-date">Promised delivery date</Label>
              <Input
                id="promised-date"
                type="date"
                value={promisedDate}
                onChange={(e) => setPromisedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actual-date">Actual delivery date</Label>
              <Input
                id="actual-date"
                type="date"
                value={actualDate}
                onChange={(e) => setActualDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="was-essential">Was the delivery date essential?</Label>
            <Select value={wasEssential} onValueChange={setWasEssential}>
              <SelectTrigger id="was-essential">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes - I told them it was essential (e.g. birthday gift)</SelectItem>
                <SelectItem value="no">No - just a standard delivery</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              If you made clear the date was essential, you may be entitled to a full refund
            </p>
          </div>
        </>
      )}

      {/* Details */}
      <div className="space-y-2">
        <Label htmlFor="details">Additional details (optional)</Label>
        <Textarea
          id="details"
          placeholder="Any other relevant information..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
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
        Free tool. No account required. Your data is not stored.
      </p>
    </form>
  )
}
