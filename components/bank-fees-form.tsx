"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  Calculator01Icon,
  Cancel01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type ChargeType = "overdraft" | "returned" | "paiditem" | "account" | "letter" | "other"

interface ChargeItem {
  type: ChargeType
  amount: string
  count: string
}

const chargeLabels: Record<ChargeType, string> = {
  overdraft: "Unauthorized overdraft fees",
  returned: "Returned/bounced payment fees",
  paiditem: "Paid item fees (paid despite no funds)",
  account: "Monthly account fees",
  letter: "Letter/call charges",
  other: "Other charges",
}

const banks = [
  "Barclays", "HSBC", "Lloyds", "NatWest", "Santander", "Halifax", "Nationwide", "TSB", "Metro Bank", "Other"
]

export function BankFeesForm() {
  const [bank, setBank] = useState("")
  const [charges, setCharges] = useState<ChargeItem[]>([])
  const [currentCharge, setCurrentCharge] = useState<ChargeItem>({ type: "overdraft", amount: "", count: "1" })
  const [wasInHardship, setWasInHardship] = useState(false)
  const [wasNotWarned, setWasNotWarned] = useState(false)
  const [result, setResult] = useState<{ total: number; claimable: number; recommendations: string[] } | null>(null)
  const [error, setError] = useState("")

  const addCharge = () => {
    if (currentCharge.amount && parseFloat(currentCharge.amount) > 0) {
      setCharges([...charges, currentCharge])
      setCurrentCharge({ type: "overdraft", amount: "", count: "1" })
    }
  }

  const removeCharge = (index: number) => {
    setCharges(charges.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!bank) {
      setError("Please select your bank")
      return
    }

    if (charges.length === 0) {
      setError("Please add at least one charge")
      return
    }

    let total = 0
    let claimable = 0
    const recommendations: string[] = []

    charges.forEach((c) => {
      const amount = parseFloat(c.amount) * (parseInt(c.count) || 1)
      total += amount

      // Estimate claimable amount based on circumstances
      if (wasInHardship) {
        claimable += amount // Full amount if in hardship
      } else if (wasNotWarned) {
        claimable += amount * 0.7 // 70% if not properly warned
      } else if (c.type === "overdraft") {
        claimable += amount * 0.5 // 50% for excessive overdraft fees
      } else if (c.type === "letter") {
        claimable += amount * 0.8 // 80% for letter charges (often excessive)
      } else {
        claimable += amount * 0.3 // 30% base for other charges
      }
    })

    if (wasInHardship) {
      recommendations.push("Banks must treat customers in financial difficulty with forbearance")
      recommendations.push("Charges applied when you were in hardship may be fully refundable")
    }

    if (wasNotWarned) {
      recommendations.push("Banks must give you a chance to avoid fees (e.g., text alerts)")
      recommendations.push("If you weren't warned, fees may be unfair")
    }

    recommendations.push("Request a full breakdown of charges for the past 6 years")
    recommendations.push("Compare charges against the bank's published tariff")
    recommendations.push("If refused, escalate to the Financial Ombudsman for free")

    setResult({
      total: Math.round(total),
      claimable: Math.round(claimable),
      recommendations,
    })
  }

  const handleReset = () => {
    setBank("")
    setCharges([])
    setCurrentCharge({ type: "overdraft", amount: "", count: "1" })
    setWasInHardship(false)
    setWasNotWarned(false)
    setResult(null)
    setError("")
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Estimate</h2>
          <Button variant="ghost" size="sm" onClick={handleReset}>Start again</Button>
        </div>

        <div className="p-6 bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon icon={Calculator01Icon} size={24} className="text-forest-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total charges entered</p>
              <p className="text-2xl font-bold text-foreground">£{result.total}</p>
              <p className="text-sm text-muted-foreground mt-2">Estimated claimable</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">£{result.claimable}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon icon={AlertCircleIcon} size={20} className="text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This is an estimate only. Actual refunds depend on individual circumstances and the bank's assessment.
            </p>
          </div>
        </div>

        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Recommendations</h3>
          <ul className="space-y-3">
            {result.recommendations.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg text-white">
          <h3 className="font-semibold text-lg mb-2">Ready to Claim?</h3>
          <p className="text-forest-100 mb-4">
            NoReply can help you write a formal complaint to your bank requesting a refund.
          </p>
          <Button asChild variant="coral">
            <Link href={`/new?tool=bank-fees&bank=${encodeURIComponent(bank)}`}>
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
      <div className="space-y-2">
        <Label htmlFor="bank">Your bank</Label>
        <Select value={bank} onValueChange={setBank}>
          <SelectTrigger id="bank"><SelectValue placeholder="Select bank" /></SelectTrigger>
          <SelectContent>
            {banks.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Charges you've paid</Label>

        {charges.length > 0 && (
          <div className="space-y-2">
            {charges.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-forest-50 dark:bg-forest-900/20 rounded-md">
                <div>
                  <span className="text-sm font-medium text-foreground">{chargeLabels[c.type]}</span>
                  <span className="text-sm text-muted-foreground ml-2">£{c.amount} x {c.count}</span>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCharge(i)}>
                  <Icon icon={Cancel01Icon} size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <Select value={currentCharge.type} onValueChange={(value) => setCurrentCharge({ ...currentCharge, type: value as ChargeType })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(chargeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="text" placeholder="Amount (£)" value={currentCharge.amount} onChange={(e) => setCurrentCharge({ ...currentCharge, amount: e.target.value.replace(/[^0-9.]/g, "") })} />
          <Input type="number" placeholder="How many?" value={currentCharge.count} onChange={(e) => setCurrentCharge({ ...currentCharge, count: e.target.value })} min="1" />
        </div>
        <Button type="button" variant="outline" onClick={addCharge} className="w-full">Add Charge</Button>
      </div>

      <div className="space-y-4">
        <Label>Circumstances (strengthens your claim)</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="hardship" checked={wasInHardship} onCheckedChange={(checked) => setWasInHardship(checked as boolean)} />
            <label htmlFor="hardship" className="text-sm text-muted-foreground">I was in financial hardship when charged</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="warned" checked={wasNotWarned} onCheckedChange={(checked) => setWasNotWarned(checked as boolean)} />
            <label htmlFor="warned" className="text-sm text-muted-foreground">I wasn't warned before fees were applied</label>
          </div>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">{error}</div>}

      <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12">
        Calculate Claimable Amount
        <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
      </Button>

      <p className="text-xs text-center text-muted-foreground">Free tool. Estimates for guidance only.</p>
    </form>
  )
}
