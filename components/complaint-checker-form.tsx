"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  analyzeComplaint,
  type ComplaintCheckResult,
  type ComplaintCategory,
} from "@/lib/actions/complaint-checker"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  Loading01Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  JusticeScale01Icon,
  BulbIcon,
} from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

const categories: { value: ComplaintCategory; label: string }[] = [
  { value: "refund", label: "Refund Issue" },
  { value: "faulty-product", label: "Faulty Product" },
  { value: "delivery", label: "Delivery Problem" },
  { value: "cancellation", label: "Cancellation Issue" },
  { value: "billing", label: "Billing/Overcharge" },
  { value: "service-quality", label: "Poor Service" },
  { value: "contract", label: "Contract Dispute" },
  { value: "other", label: "Other" },
]

function StrengthMeter({ score, strength }: { score: number; strength: ComplaintCheckResult["strength"] }) {
  const colors = {
    weak: "bg-red-500",
    moderate: "bg-amber-500",
    strong: "bg-green-500",
  }

  const labels = {
    weak: "Needs Work",
    moderate: "Good Foundation",
    strong: "Strong Case",
  }

  const icons = {
    weak: AlertCircleIcon,
    moderate: KnightShieldIcon,
    strong: CheckmarkCircle01Icon,
  }

  const StrengthIcon = icons[strength]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon={StrengthIcon} size={20} color="currentColor" className={cn(
            "h-5 w-5",
            strength === "weak" && "text-red-500",
            strength === "moderate" && "text-amber-500",
            strength === "strong" && "text-green-500"
          )} />
          <span className="font-semibold text-foreground">{labels[strength]}</span>
        </div>
        <span className="text-2xl font-bold text-foreground">{score}%</span>
      </div>
      <div className="h-3 bg-forest-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500 rounded-full", colors[strength])}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

function ResultCard({ result }: { result: ComplaintCheckResult }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Strength Score */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <StrengthMeter score={result.score} strength={result.strength} />
        <p className="mt-4 text-muted-foreground">{result.summary}</p>
      </div>

      {/* Applicable Laws */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={JusticeScale01Icon} size={20} color="currentColor" className="text-lavender-500" />
          <h3 className="font-semibold text-foreground">Applicable Laws</h3>
        </div>
        <div className="space-y-4">
          {result.applicableLaws.map((law) => (
            <div key={law.name} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{law.name}</span>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    law.relevance === "high" && "bg-green-100 text-green-700",
                    law.relevance === "medium" && "bg-amber-100 text-amber-700",
                    law.relevance === "low" && "bg-stone-100 text-stone-600"
                  )}
                >
                  {law.relevance} relevance
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{law.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={BulbIcon} size={20} color="currentColor" className="text-peach-500" />
          <h3 className="font-semibold text-foreground">Recommendations</h3>
        </div>
        <ul className="space-y-2">
          {result.recommendations.slice(0, 5).map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-forest-500 mt-1">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Next Steps CTA */}
      <div className="p-6 bg-forest-500 rounded-lg text-white">
        <h3 className="font-semibold text-lg mb-2">Ready to take action?</h3>
        <p className="text-forest-100 mb-4">
          Create a free account to generate a professional complaint letter backed by these consumer laws.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            variant="coral"
          >
            <Link href="/new" className="flex items-center">
              Start Your Free Complaint
              <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="bg-white/10 text-white hover:bg-white hover:text-forest-700"
          >
            <Link href="/auth/sign-up">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ComplaintCheckerForm() {
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<ComplaintCategory | "">("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ComplaintCheckResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!description.trim()) {
      setError("Please describe your complaint")
      return
    }

    if (!category) {
      setError("Please select a category")
      return
    }

    if (description.length < 50) {
      setError("Please provide more detail about your complaint (at least 50 characters)")
      return
    }

    setIsAnalyzing(true)
    setResult(null)

    try {
      const analysisResult = await analyzeComplaint(description, category)
      setResult(analysisResult)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setDescription("")
    setCategory("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">What type of issue is this?</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ComplaintCategory)}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Describe your complaint</Label>
            <Textarea
              id="description"
              placeholder="Tell us what happened. Include details like what you bought, when, what went wrong, and what you've already tried to resolve it..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[180px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {description.length} characters
              {description.length < 50 && " (minimum 50)"}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isAnalyzing}
            className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12"
          >
            {isAnalyzing ? (
              <>
                <Icon icon={Loading01Icon} size={16} className="mr-2 h-4 w-4 animate-spin" />
                Analyzing your rights...
              </>
            ) : (
              <span className="flex items-center">
                Check My Consumer Rights
                <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
              </span>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your complaint details are not stored. This is a free tool.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Results</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Check another complaint
            </Button>
          </div>
          <ResultCard result={result} />
        </div>
      )}
    </div>
  )
}
