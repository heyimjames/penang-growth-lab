"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Icon } from "@/lib/icons"
import {
  Search01Icon,
  ArrowRight01Icon,
  BulbIcon,
  Airplane01Icon,
  CreditCardIcon,
  Home01Icon,
  ZapIcon,
  Car01Icon,
  Package01Icon,
  Shield02Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"
import { tools } from "@/lib/tools-data"

// Keywords that map to specific tools
const toolKeywords: Record<string, string[]> = {
  "/tools/flight-compensation": [
    "flight",
    "delayed",
    "cancelled",
    "airline",
    "plane",
    "airport",
    "ryanair",
    "easyjet",
    "british airways",
    "ba",
    "uk261",
    "eu261",
    "compensation",
    "flying",
  ],
  "/tools/section-75-checker": [
    "credit card",
    "section 75",
    "chargeback",
    "visa",
    "mastercard",
    "amex",
    "paid by card",
    "card payment",
    "credit",
  ],
  "/tools/cooling-off-checker": [
    "cancel",
    "cooling off",
    "14 days",
    "online purchase",
    "changed my mind",
    "return",
    "bought online",
  ],
  "/tools/refund-timeline": [
    "refund",
    "faulty",
    "broken",
    "not working",
    "defective",
    "stopped working",
    "30 days",
    "money back",
  ],
  "/tools/energy-bill-complaint": [
    "energy",
    "gas",
    "electricity",
    "energy bill",
    "british gas",
    "edf",
    "eon",
    "octopus",
    "utility",
    "overcharged",
    "meter",
  ],
  "/tools/broadband-complaint": [
    "broadband",
    "internet",
    "wifi",
    "slow internet",
    "bt",
    "virgin media",
    "sky",
    "talktalk",
    "fibre",
    "connection",
    "speed",
  ],
  "/tools/rental-deposit": [
    "deposit",
    "landlord",
    "rental",
    "tenant",
    "renting",
    "letting agent",
    "tenancy",
    "flat",
    "apartment",
    "house",
  ],
  "/tools/car-lemon-law": [
    "car",
    "vehicle",
    "dealer",
    "faulty car",
    "second hand car",
    "used car",
    "mechanic",
    "garage",
    "motor",
  ],
  "/tools/parking-fine-appeal": [
    "parking",
    "fine",
    "ticket",
    "pcn",
    "penalty",
    "clamped",
    "council",
    "private parking",
  ],
  "/tools/delivery-compensation": [
    "delivery",
    "package",
    "parcel",
    "not delivered",
    "late delivery",
    "lost package",
    "courier",
    "dpd",
    "hermes",
    "evri",
    "royal mail",
    "amazon",
  ],
  "/tools/holiday-compensation": [
    "holiday",
    "package holiday",
    "hotel",
    "tui",
    "jet2",
    "travel",
    "resort",
    "booking",
  ],
  "/tools/warranty-checker": [
    "warranty",
    "guarantee",
    "manufacturer",
    "out of warranty",
    "expired warranty",
  ],
  "/tools/gdpr-request": [
    "gdpr",
    "data",
    "personal data",
    "sar",
    "subject access",
    "delete my data",
    "privacy",
  ],
  "/tools/complaint-checker": [
    "rights",
    "consumer rights",
    "am i entitled",
    "can i",
    "legal",
    "law",
    "act",
  ],
  "/tools/ombudsman-finder": [
    "ombudsman",
    "escalate",
    "complaint ignored",
    "no response",
    "fos",
    "financial ombudsman",
  ],
  "/tools/bank-fees": [
    "bank",
    "charges",
    "fees",
    "overdraft",
    "unfair charges",
    "bank account",
  ],
  "/tools/cancel-subscription": [
    "subscription",
    "cancel subscription",
    "membership",
    "gym",
    "won't cancel",
    "recurring payment",
  ],
  "/tools/insurance-timeline": [
    "insurance",
    "claim",
    "insurance claim",
    "insurer",
    "policy",
  ],
  "/tools/small-claims-calculator": [
    "court",
    "small claims",
    "sue",
    "legal action",
    "take them to court",
  ],
  "/tools/contract-termination": [
    "contract",
    "terminate",
    "end contract",
    "notice",
    "agreement",
  ],
}

// Quick suggestion examples
const quickSuggestions = [
  {
    label: "Flight delayed or cancelled",
    icon: Airplane01Icon,
    href: "/tools/flight-compensation",
  },
  {
    label: "Paid by credit card",
    icon: CreditCardIcon,
    href: "/tools/section-75-checker",
  },
  {
    label: "Problem with delivery",
    icon: Package01Icon,
    href: "/tools/delivery-compensation",
  },
  {
    label: "Energy bill dispute",
    icon: ZapIcon,
    href: "/tools/energy-bill-complaint",
  },
  {
    label: "Faulty product",
    icon: Shield02Icon,
    href: "/tools/refund-timeline",
  },
  {
    label: "Landlord issue",
    icon: Home01Icon,
    href: "/tools/rental-deposit",
  },
]

export function ProblemRouter() {
  const [query, setQuery] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [suggestedTool, setSuggestedTool] = React.useState<typeof tools[0] | null>(null)
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Analyze the query and find the best matching tool
  React.useEffect(() => {
    if (query.length < 3) {
      setSuggestedTool(null)
      return
    }

    const lowerQuery = query.toLowerCase()
    let bestMatch: string | null = null
    let bestScore = 0

    Object.entries(toolKeywords).forEach(([toolHref, keywords]) => {
      let score = 0
      keywords.forEach((keyword) => {
        if (lowerQuery.includes(keyword.toLowerCase())) {
          // Longer keyword matches are more specific, so weight them higher
          score += keyword.length
        }
      })
      if (score > bestScore) {
        bestScore = score
        bestMatch = toolHref
      }
    })

    if (bestMatch) {
      const matchedTool = tools.find((t) => t.href === bestMatch)
      setSuggestedTool(matchedTool || null)
    } else {
      // Default to complaint checker if no match
      setSuggestedTool(tools.find((t) => t.href === "/tools/complaint-checker") || null)
    }
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (suggestedTool) {
      router.push(suggestedTool.href)
    } else {
      router.push("/tools/complaint-checker")
    }
  }

  const handleQuickSelect = (href: string) => {
    router.push(href)
  }

  return (
    <section className="py-16 md:py-24 border-b border-forest-100 dark:border-border bg-gradient-to-b from-lavender-50/30 to-background dark:from-lavender-950/10 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Header */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/30 text-lavender-700 dark:text-lavender-300 text-sm font-medium mb-6">
            <Icon icon={BulbIcon} size={14} />
            Find the Right Tool
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display mb-4">
            What&apos;s Your Problem?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Describe your issue and we&apos;ll point you to the right tool
          </p>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="relative mb-8">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setIsTyping(true)
                }}
                onBlur={() => setIsTyping(false)}
                placeholder="e.g. My flight was cancelled and the airline won't refund me..."
                className="w-full h-14 md:h-16 pl-5 pr-14 text-base md:text-lg rounded-full border-2 border-forest-200 dark:border-forest-700 bg-white dark:bg-card focus:border-lavender-400 dark:focus:border-lavender-500 focus:outline-none focus:ring-4 focus:ring-lavender-100 dark:focus:ring-lavender-900/30 transition-all placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-lavender-500 hover:bg-lavender-600 text-white transition-colors"
                aria-label="Find tool"
              >
                <Icon icon={ArrowRight01Icon} size={20} />
              </button>
            </div>

            {/* Suggestion Box */}
            {suggestedTool && query.length >= 3 && (
              <div className="absolute left-0 right-0 top-full mt-2 z-10">
                <button
                  type="submit"
                  className="w-full p-4 bg-white dark:bg-card border border-forest-200 dark:border-forest-700 rounded-xl shadow-lg text-left hover:border-lavender-300 dark:hover:border-lavender-600 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center shrink-0">
                      <Icon
                        icon={suggestedTool.icon}
                        size={20}
                        className="text-lavender-600 dark:text-lavender-400"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground font-display group-hover:text-lavender-600 dark:group-hover:text-lavender-400 transition-colors">
                        {suggestedTool.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {suggestedTool.shortDescription}
                      </p>
                    </div>
                    <Icon
                      icon={ArrowRight01Icon}
                      size={16}
                      className="text-muted-foreground group-hover:text-lavender-500 transition-colors mt-1"
                    />
                  </div>
                </button>
              </div>
            )}
          </form>

          {/* Quick Suggestions */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Or choose a common issue:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion.href}
                  onClick={() => handleQuickSelect(suggestion.href)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-forest-600 dark:text-forest-400 bg-white dark:bg-card border border-forest-200 dark:border-forest-700 rounded-full hover:border-forest-300 dark:hover:border-forest-600 hover:bg-forest-50 dark:hover:bg-forest-900/30 transition-colors"
                >
                  <Icon icon={suggestion.icon} size={16} />
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
