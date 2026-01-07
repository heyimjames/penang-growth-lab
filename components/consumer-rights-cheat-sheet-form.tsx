"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  generateCheatSheet,
  type CheatSheetLocation,
  type CheatSheetCategory,
} from "@/lib/actions/consumer-rights-cheat-sheet"
import type { CheatSheetResult } from "@/lib/types"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  Loading01Icon,
  PrinterIcon,
  Download01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  JusticeScale01Icon,
  Clock01Icon,
  Edit02Icon,
  InformationCircleIcon,
  ArrowUp01Icon,
  TextIcon,
  LinkSquare01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

const locations: { value: CheatSheetLocation; label: string; flag: string }[] = [
  { value: "uk", label: "United Kingdom", flag: "🇬🇧" },
  { value: "us", label: "United States", flag: "🇺🇸" },
  { value: "eu", label: "European Union", flag: "🇪🇺" },
  { value: "australia", label: "Australia", flag: "🇦🇺" },
  { value: "canada", label: "Canada", flag: "🇨🇦" },
]

const categories: { value: CheatSheetCategory; label: string }[] = [
  { value: "general", label: "General Consumer Rights Overview" },
  { value: "faulty-goods", label: "Faulty Goods & Products" },
  { value: "refunds", label: "Refunds & Returns" },
  { value: "online-purchases", label: "Online Purchases" },
  { value: "delivery", label: "Delivery Issues" },
  { value: "services", label: "Services Not As Described" },
  { value: "subscriptions", label: "Subscriptions & Memberships" },
  { value: "travel", label: "Travel & Flights" },
  { value: "financial", label: "Financial Services & Card Protection" },
]

function CheatSheetDisplay({ result }: { result: CheatSheetResult }) {
  const cheatSheetRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const formattedDate = new Date(result.generatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Action buttons - hidden in print */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="gap-2"
        >
          <Icon icon={PrinterIcon} size={16} />
          Print Cheat Sheet
        </Button>
      </div>

      {/* Cheat Sheet Content */}
      <div ref={cheatSheetRef} className="cheat-sheet-content space-y-6">
        {/* Header */}
        <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg print:bg-white print:border-2 print:border-forest-500">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl print:hidden">
                  {locations.find((l) => l.value === result.location)?.flag}
                </span>
                <span className="px-2 py-1 bg-white/20 text-white text-sm font-medium rounded print:bg-forest-100 print:text-forest-700">
                  {result.locationName}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white print:text-forest-700 font-display">
                {result.categoryName}
              </h2>
              <p className="text-forest-100 print:text-forest-600 mt-1">
                Consumer Rights Cheat Sheet
              </p>
            </div>
            <div className="text-forest-100 print:text-forest-600 text-sm">
              <p>Generated: {formattedDate}</p>
              <p className="print:block hidden">usenoreply.com</p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Icon icon={InformationCircleIcon} size={20} className="text-lavender-500" />
            <h3 className="font-semibold text-foreground">Quick Summary</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
        </div>

        {/* Key Rights */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg print:break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={JusticeScale01Icon} size={20} className="text-forest-500" />
            <h3 className="font-semibold text-foreground">Your Key Rights</h3>
          </div>
          <div className="grid gap-4">
            {result.keyRights.map((right, index) => (
              <div
                key={index}
                className="p-4 bg-forest-50/50 dark:bg-forest-900/20 rounded-lg print:border print:border-forest-200"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-foreground">{right.title}</h4>
                  {right.timeLimit && (
                    <span className="shrink-0 text-xs px-2 py-1 bg-peach-100 dark:bg-peach-900/30 text-peach-700 dark:text-peach-300 rounded-full">
                      {right.timeLimit}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{right.description}</p>
                <ul className="space-y-1.5">
                  {right.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={14}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Applicable Laws */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg print:break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={TextIcon} size={20} className="text-lavender-500" />
            <h3 className="font-semibold text-foreground">Applicable Laws</h3>
          </div>
          <div className="space-y-4">
            {result.applicableLaws.map((law, index) => (
              <div key={index} className="pb-4 border-b border-forest-100 dark:border-border last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">{law.name}</span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      law.relevance === "high" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                      law.relevance === "medium" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                      law.relevance === "low" && "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300"
                    )}
                  >
                    {law.relevance} relevance
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {law.jurisdiction} • {law.keyProvision}
                </p>
                <p className="text-sm text-muted-foreground">{law.whatItMeans}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg print:break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={Clock01Icon} size={20} className="text-peach-500" />
            <h3 className="font-semibold text-foreground">Timeline of Your Rights</h3>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-forest-200 dark:bg-forest-700 print:bg-forest-300" />
            <div className="space-y-4">
              {result.timeline.map((entry, index) => (
                <div key={index} className="relative pl-8">
                  <div
                    className={cn(
                      "absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium",
                      entry.isActive
                        ? "bg-forest-500 text-white"
                        : "bg-forest-100 dark:bg-forest-800 text-forest-600 dark:text-forest-300"
                    )}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{entry.title}</span>
                      <span className="text-xs text-muted-foreground">({entry.period})</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Do's and Don'ts */}
        <div className="grid md:grid-cols-2 gap-4 print:grid-cols-2">
          {/* Do's */}
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg print:break-inside-avoid">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon={CheckmarkCircle01Icon} size={20} className="text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-green-800 dark:text-green-300">Do</h3>
            </div>
            <ul className="space-y-2">
              {result.dos.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                  <span className="text-green-800 dark:text-green-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg print:break-inside-avoid">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon={Cancel01Icon} size={20} className="text-red-600 dark:text-red-400" />
              <h3 className="font-semibold text-red-800 dark:text-red-300">Don&apos;t</h3>
            </div>
            <ul className="space-y-2">
              {result.donts.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span className="text-red-800 dark:text-red-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Phrases */}
        <div className="p-6 bg-lavender-50 dark:bg-lavender-900/20 border border-lavender-200 dark:border-lavender-800 rounded-lg print:break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={Edit02Icon} size={20} className="text-lavender-600 dark:text-lavender-400" />
            <h3 className="font-semibold text-lavender-800 dark:text-lavender-300">Key Phrases to Use</h3>
          </div>
          <p className="text-sm text-lavender-700 dark:text-lavender-300 mb-4">
            Copy these phrases into your complaint letters for maximum impact:
          </p>
          <div className="space-y-3">
            {result.keyPhrases.map((phrase, index) => (
              <div
                key={index}
                className="p-3 bg-white dark:bg-lavender-900/30 rounded border border-lavender-200 dark:border-lavender-700"
              >
                <p className="text-sm text-lavender-900 dark:text-lavender-100 italic">
                  &ldquo;{phrase}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation Path */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg print:break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={ArrowUp01Icon} size={20} className="text-forest-500" />
            <h3 className="font-semibold text-foreground">Escalation Path</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            If your initial complaint doesn&apos;t work, follow these steps:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
            {result.escalationPath.map((step) => (
              <div
                key={step.step}
                className="p-4 bg-forest-50 dark:bg-forest-900/20 rounded-lg text-center print:border print:border-forest-200"
              >
                <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-forest-500 text-white flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <h4 className="font-medium text-foreground text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                <p className="text-xs text-forest-600 dark:text-forest-400 font-medium">
                  {step.when}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Official Resources - hidden in print for space */}
        <div className="p-6 bg-background border border-forest-100 dark:border-border rounded-lg print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={LinkSquare01Icon} size={20} className="text-forest-500" />
            <h3 className="font-semibold text-foreground">Official Resources</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.officialResources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-forest-50 dark:bg-forest-900/20 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-900/40 transition-colors"
              >
                <h4 className="font-medium text-foreground text-sm mb-1">
                  {resource.name}
                </h4>
                <p className="text-xs text-muted-foreground">{resource.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Related Tools - hidden in print */}
        <div className="p-6 bg-forest-50 dark:bg-forest-900/20 border border-forest-100 dark:border-border rounded-lg print:hidden">
          <h3 className="font-semibold text-foreground mb-4">Related Tools</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {result.relatedTools.map((tool, index) => (
              <Link
                key={index}
                href={tool.href}
                className="p-4 bg-white dark:bg-card rounded-lg border border-forest-100 dark:border-border hover:border-forest-300 dark:hover:border-forest-500 transition-colors"
              >
                <h4 className="font-medium text-foreground text-sm mb-1">{tool.name}</h4>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section - hidden in print */}
        <div className="p-6 bg-forest-500 dark:bg-forest-600 rounded-lg text-white print:hidden">
          <h3 className="font-semibold text-lg mb-2">Ready to Take Action?</h3>
          <p className="text-forest-100 mb-4">
            Create a free account to generate a professional complaint letter backed by these consumer laws.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="coral">
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

        {/* Print footer */}
        <div className="hidden print:block text-center text-sm text-muted-foreground pt-4 border-t">
          <p>Generated by NoReply (usenoreply.com) on {formattedDate}</p>
          <p className="text-xs mt-1">This is general information, not legal advice. Consult a professional for specific situations.</p>
        </div>
      </div>
    </div>
  )
}

export function ConsumerRightsCheatSheetForm() {
  const [location, setLocation] = useState<CheatSheetLocation | "">("")
  const [category, setCategory] = useState<CheatSheetCategory | "">("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CheatSheetResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!location) {
      setError("Please select your location")
      return
    }

    if (!category) {
      setError("Please select a category")
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      const cheatSheet = await generateCheatSheet({
        location,
        category,
      })
      setResult(cheatSheet)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setLocation("")
    setCategory("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Where are you located?</Label>
            <Select
              value={location}
              onValueChange={(value) => setLocation(value as CheatSheetLocation)}
            >
              <SelectTrigger id="location" className="w-full">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    <span className="flex items-center gap-2">
                      <span>{loc.flag}</span>
                      <span>{loc.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {location && location !== "uk" && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Note: Our most comprehensive coverage is for the UK. Other regions have basic information.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">What type of issue are you dealing with?</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as CheatSheetCategory)}
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

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12"
          >
            {isGenerating ? (
              <>
                <Icon icon={Loading01Icon} size={16} className="mr-2 h-4 w-4 animate-spin" />
                Generating your cheat sheet...
              </>
            ) : (
              <span className="flex items-center">
                Generate My Cheat Sheet
                <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
              </span>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your cheat sheet will be ready to view, print, or save. No account required.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between print:hidden">
            <h2 className="text-xl font-semibold text-foreground">Your Cheat Sheet</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Generate another
            </Button>
          </div>
          <CheatSheetDisplay result={result} />
        </div>
      )}
    </div>
  )
}
