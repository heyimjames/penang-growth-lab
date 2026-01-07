"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Cancel01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type DeductionType = "cleaning" | "damage" | "rent" | "bills" | "inventory" | "other"

interface DeductionItem {
  type: DeductionType
  amount: string
  description: string
}

interface DisputeResult {
  fairDeductions: number
  unfairDeductions: number
  recommendations: string[]
  nextSteps: string[]
  warnings: string[]
}

const deductionLabels: Record<DeductionType, string> = {
  cleaning: "Professional cleaning",
  damage: "Damage repairs",
  rent: "Unpaid rent",
  bills: "Unpaid bills",
  inventory: "Missing items",
  other: "Other",
}

export function RentalDepositForm() {
  const [depositAmount, setDepositAmount] = useState("")
  const [tenancyLength, setTenancyLength] = useState("")
  const [wasProtected, setWasProtected] = useState("")
  const [deductions, setDeductions] = useState<DeductionItem[]>([])
  const [currentDeduction, setCurrentDeduction] = useState<DeductionItem>({ type: "cleaning", amount: "", description: "" })
  const [hadInventory, setHadInventory] = useState(false)
  const [tookPhotos, setTookPhotos] = useState(false)
  const [result, setResult] = useState<DisputeResult | null>(null)
  const [error, setError] = useState("")

  const addDeduction = () => {
    if (currentDeduction.amount && parseFloat(currentDeduction.amount) > 0) {
      setDeductions([...deductions, currentDeduction])
      setCurrentDeduction({ type: "cleaning", amount: "", description: "" })
    }
  }

  const removeDeduction = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!depositAmount) {
      setError("Please enter your deposit amount")
      return
    }

    if (deductions.length === 0) {
      setError("Please add at least one deduction")
      return
    }

    const deposit = parseFloat(depositAmount)
    const years = parseFloat(tenancyLength) || 1
    let fairTotal = 0
    let unfairTotal = 0
    const recommendations: string[] = []
    const warnings: string[] = []

    // Analyze each deduction
    deductions.forEach((d) => {
      const amount = parseFloat(d.amount) || 0

      switch (d.type) {
        case "cleaning":
          // Cleaning should be proportional and reasonable
          if (amount > 300) {
            unfairTotal += amount - 150
            fairTotal += 150
            recommendations.push(`Cleaning charge of £${amount} seems excessive. Typical professional cleaning is £100-200.`)
          } else {
            fairTotal += amount * 0.5 // Often disputable
            unfairTotal += amount * 0.5
            recommendations.push("Professional cleaning can be disputed if you left the property in reasonable condition.")
          }
          break

        case "damage":
          // Damage must account for fair wear and tear
          const wearReduction = Math.min(years * 0.1, 0.5) // 10% per year, max 50%
          const fairDamageCharge = amount * (1 - wearReduction)
          fairTotal += fairDamageCharge
          unfairTotal += amount - fairDamageCharge
          if (years >= 3) {
            recommendations.push(`After ${years} years, significant wear and tear is expected. Damage charges should be reduced accordingly.`)
          }
          break

        case "rent":
          fairTotal += amount
          recommendations.push("Unpaid rent is generally a fair deduction if documented.")
          break

        case "bills":
          fairTotal += amount
          recommendations.push("Unpaid bills are generally a fair deduction if documented.")
          break

        case "inventory":
          if (!hadInventory) {
            unfairTotal += amount
            recommendations.push("Without a signed inventory, landlords struggle to prove items are missing.")
          } else {
            fairTotal += amount * 0.7
            unfairTotal += amount * 0.3
          }
          break

        case "other":
          unfairTotal += amount * 0.5
          fairTotal += amount * 0.5
          recommendations.push(`'Other' deductions should be clearly itemized and evidenced. Challenge vague charges.`)
          break
      }
    })

    // Check deposit protection
    if (wasProtected === "no") {
      warnings.push("IMPORTANT: If your deposit wasn't protected in a scheme within 30 days, you could claim 1-3x the deposit amount in compensation!")
      recommendations.push(`Unprotected deposit could entitle you to £${deposit} - £${deposit * 3} in compensation, plus the return of your deposit.`)
    }

    // Evidence tips
    if (!tookPhotos) {
      warnings.push("Without move-out photos, it may be harder to dispute condition claims. However, landlords must still prove damage.")
    }

    const nextSteps = [
      "Request itemized breakdown of all deductions with evidence",
      wasProtected === "yes" ? "Raise a dispute with the deposit protection scheme (free)" : "Consider claiming compensation for unprotected deposit",
      "Gather your evidence: photos, inventory, emails, receipts",
      "Respond in writing disputing unfair deductions",
      "The scheme's adjudicator will make a binding decision",
    ]

    setResult({
      fairDeductions: Math.round(fairTotal),
      unfairDeductions: Math.round(unfairTotal),
      recommendations,
      nextSteps,
      warnings,
    })
  }

  const handleReset = () => {
    setDepositAmount("")
    setTenancyLength("")
    setWasProtected("")
    setDeductions([])
    setCurrentDeduction({ type: "cleaning", amount: "", description: "" })
    setHadInventory(false)
    setTookPhotos(false)
    setResult(null)
    setError("")
  }

  if (result) {
    const totalDeductions = result.fairDeductions + result.unfairDeductions
    const potentialRefund = result.unfairDeductions

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Assessment</h2>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Start again
          </Button>
        </div>

        {/* Summary */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-xs text-green-600 dark:text-green-400 mb-1">Potentially Disputable</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">£{potentialRefund}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Likely Fair Deductions</p>
            <p className="text-2xl font-bold text-foreground">£{result.fairDeductions}</p>
          </div>
        </div>

        {/* Warnings */}
        {result.warnings.length > 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon icon={AlertCircleIcon} size={20} className="text-amber-500 flex-shrink-0" />
              <div className="space-y-2">
                {result.warnings.map((warning, i) => (
                  <p key={i} className="text-sm text-amber-700 dark:text-amber-300">{warning}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Analysis</h3>
          <ul className="space-y-3">
            {result.recommendations.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

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
          <h3 className="font-semibold text-lg mb-2">Need Help Disputing?</h3>
          <p className="text-forest-100 mb-4">
            NoReply can help you prepare your case for the deposit protection scheme&apos;s dispute resolution.
          </p>
          <Button asChild variant="coral">
            <Link href="/new?tool=deposit-dispute" className="flex items-center">
              Prepare My Case
              <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Deposit Amount */}
      <div className="space-y-2">
        <Label htmlFor="deposit-amount">Total deposit paid (£)</Label>
        <Input
          id="deposit-amount"
          type="text"
          placeholder="e.g. 1200"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value.replace(/[^0-9.]/g, ""))}
        />
      </div>

      {/* Tenancy Length */}
      <div className="space-y-2">
        <Label htmlFor="tenancy-length">How long did you live there? (years)</Label>
        <Input
          id="tenancy-length"
          type="text"
          placeholder="e.g. 2"
          value={tenancyLength}
          onChange={(e) => setTenancyLength(e.target.value.replace(/[^0-9.]/g, ""))}
        />
        <p className="text-xs text-muted-foreground">
          Longer tenancies = more expected wear and tear
        </p>
      </div>

      {/* Was Protected */}
      <div className="space-y-2">
        <Label htmlFor="was-protected">Was your deposit protected in a scheme?</Label>
        <Select value={wasProtected} onValueChange={setWasProtected}>
          <SelectTrigger id="was-protected">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes - I have the certificate</SelectItem>
            <SelectItem value="no">No - or I never received details</SelectItem>
            <SelectItem value="unsure">Not sure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Evidence */}
      <div className="space-y-4">
        <Label>Evidence you have</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="had-inventory"
              checked={hadInventory}
              onCheckedChange={(checked) => setHadInventory(checked as boolean)}
            />
            <label htmlFor="had-inventory" className="text-sm text-muted-foreground">
              Signed check-in inventory
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="took-photos"
              checked={tookPhotos}
              onCheckedChange={(checked) => setTookPhotos(checked as boolean)}
            />
            <label htmlFor="took-photos" className="text-sm text-muted-foreground">
              Move-out photos of the property
            </label>
          </div>
        </div>
      </div>

      {/* Deductions */}
      <div className="space-y-4">
        <Label>Landlord&apos;s proposed deductions</Label>

        {deductions.length > 0 && (
          <div className="space-y-2">
            {deductions.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-forest-50 dark:bg-forest-900/20 rounded-md">
                <div>
                  <span className="text-sm font-medium text-foreground">{deductionLabels[d.type]}</span>
                  <span className="text-sm text-muted-foreground ml-2">£{d.amount}</span>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeDeduction(i)}>
                  <Icon icon={Cancel01Icon} size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-2">
          <Select
            value={currentDeduction.type}
            onValueChange={(value) => setCurrentDeduction({ ...currentDeduction, type: value as DeductionType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(deductionLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Amount (£)"
            value={currentDeduction.amount}
            onChange={(e) => setCurrentDeduction({ ...currentDeduction, amount: e.target.value.replace(/[^0-9.]/g, "") })}
          />
          <Button type="button" variant="outline" onClick={addDeduction}>
            Add
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12">
        Assess Deductions
        <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Free tool. No account required. Assessment is for guidance only.
      </p>
    </form>
  )
}
