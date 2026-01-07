"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CompanyLogo } from "@/components/company-logo"
import { Icon } from "@/lib/icons"
import {
  CheckmarkCircle01Icon,
  CreditCardIcon,
  WalletIcon,
  ArrowReloadHorizontalIcon,
  StarIcon,
  Invoice02Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import type { OnboardingFormData } from "@/app/onboarding/page"

// Popular companies for autocomplete
const popularCompanies = [
  { name: "EasyJet", domain: "easyjet.com", category: "Airlines" },
  { name: "British Airways", domain: "britishairways.com", category: "Airlines" },
  { name: "Ryanair", domain: "ryanair.com", category: "Airlines" },
  { name: "Booking.com", domain: "booking.com", category: "Travel" },
  { name: "Amazon UK", domain: "amazon.co.uk", category: "Retail" },
  { name: "Hilton Hotels", domain: "hilton.com", category: "Hotels" },
  { name: "Marriott Hotels", domain: "marriott.com", category: "Hotels" },
  { name: "Airbnb", domain: "airbnb.com", category: "Travel" },
  { name: "Vodafone", domain: "vodafone.co.uk", category: "Telecoms" },
  { name: "Sky", domain: "sky.com", category: "Telecoms" },
  { name: "British Gas", domain: "britishgas.co.uk", category: "Energy" },
  { name: "PayPal", domain: "paypal.com", category: "Finance" },
]

const currencies = [
  { value: "GBP", label: "£ GBP", symbol: "£" },
  { value: "USD", label: "$ USD", symbol: "$" },
  { value: "EUR", label: "€ EUR", symbol: "€" },
]

const outcomes = [
  { value: "ai-suggested", label: "AI suggests best", icon: StarIcon },
  { value: "full-refund", label: "Full refund", icon: CreditCardIcon },
  { value: "partial-refund", label: "Partial refund", icon: WalletIcon },
  { value: "replacement", label: "Replacement", icon: ArrowReloadHorizontalIcon },
  { value: "compensation", label: "Compensation", icon: Invoice02Icon },
]

interface OnboardingFormProps {
  formData: OnboardingFormData
  onDataChange: (updates: Partial<OnboardingFormData>) => void
}

export function OnboardingForm({ formData, onDataChange }: OnboardingFormProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof popularCompanies>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const selectedCurrency = currencies.find(c => c.value === formData.currency)

  // Filter suggestions based on input
  const filterSuggestions = useCallback((query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = popularCompanies.filter(company =>
      company.name.toLowerCase().includes(lowerQuery) ||
      company.domain.toLowerCase().includes(lowerQuery)
    ).slice(0, 6)

    setSuggestions(filtered)
    setHighlightedIndex(-1)
  }, [])

  // Handle company selection
  const selectCompany = useCallback((company: typeof popularCompanies[0]) => {
    onDataChange({
      companyName: company.name,
      companyDomain: company.domain
    })
    setShowSuggestions(false)
    setSuggestions([])
    inputRef.current?.blur()
  }, [onDataChange])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          selectCompany(suggestions[highlightedIndex])
        }
        break
      case "Escape":
        setShowSuggestions(false)
        break
    }
  }, [showSuggestions, suggestions, highlightedIndex, selectCompany])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="space-y-6">
      {/* Company Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <Label htmlFor="company" className="text-base font-medium">
          Who&apos;s the company?
        </Label>
        <div className="flex gap-3 items-center">
          <div className="shrink-0">
            <CompanyLogo
              companyName={formData.companyName}
              domain={formData.companyDomain}
              size={40}
              showFallback={true}
            />
          </div>
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              id="company"
              placeholder="e.g., British Airways, amazon.co.uk"
              value={formData.companyName}
              onChange={(e) => {
                onDataChange({
                  companyName: e.target.value,
                  companyDomain: undefined
                })
                filterSuggestions(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => {
                if (formData.companyName.length >= 2) {
                  filterSuggestions(formData.companyName)
                  setShowSuggestions(true)
                }
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
              >
                {suggestions.map((company, index) => (
                  <button
                    key={`${company.name}-${company.domain}`}
                    type="button"
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 text-left transition-colors touch-manipulation min-h-[44px]",
                      index === highlightedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/50 active:bg-muted"
                    )}
                    onClick={() => selectCompany(company)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <CompanyLogo
                      companyName={company.name}
                      domain={company.domain}
                      size={28}
                      showFallback={true}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{company.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{company.domain}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                      {company.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {formData.companyDomain && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Icon icon={CheckmarkCircle01Icon} size={14} />
            <span>Found: {formData.companyDomain}</span>
          </div>
        )}
      </motion.div>

      {/* Complaint Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <Label htmlFor="complaint" className="text-base font-medium">
          What happened?
        </Label>
        <Textarea
          id="complaint"
          placeholder="Describe your issue in a few sentences. What went wrong? When did it happen?"
          value={formData.complaint}
          onChange={(e) => onDataChange({ complaint: e.target.value })}
          className="min-h-[120px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {formData.complaint.length < 20
            ? `${20 - formData.complaint.length} more characters needed`
            : "Looking good! Add more details for a stronger case."
          }
        </p>
      </motion.div>

      {/* Amount */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <Label className="text-base font-medium">How much is at stake?</Label>
        <div className="flex gap-2">
          <Select
            value={formData.currency}
            onValueChange={(value) => onDataChange({ currency: value })}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {selectedCurrency?.symbol}
            </span>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="pl-7"
              value={formData.amount}
              onChange={(e) => onDataChange({ amount: e.target.value })}
            />
          </div>
        </div>
      </motion.div>

      {/* Desired Outcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <Label className="text-base font-medium">What do you want?</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {outcomes.map((outcome) => {
            const isSelected = formData.outcome === outcome.value

            return (
              <button
                key={outcome.value}
                type="button"
                onClick={() => onDataChange({ outcome: outcome.value })}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-center",
                  isSelected
                    ? "border-peach-400 bg-peach-50 dark:bg-peach-950/30 ring-2 ring-peach-400/50"
                    : "border-border hover:border-muted-foreground/40 bg-card hover:bg-muted/50"
                )}
              >
                <Icon
                  icon={outcome.icon}
                  size={20}
                  className={cn(
                    "transition-colors",
                    isSelected ? "text-peach-600" : "text-muted-foreground"
                  )}
                />
                <span className={cn(
                  "text-xs font-medium",
                  isSelected && "text-peach-700 dark:text-peach-300"
                )}>
                  {outcome.label}
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
