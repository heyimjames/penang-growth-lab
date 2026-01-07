"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon } from "@/lib/icons"
import {
  Calendar01Icon,
  Loading01Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Mail01Icon,
  Link01Icon,
  UserMultiple02Icon,
  StarIcon,
  CreditCardIcon,
  WalletIcon,
  ArrowReloadHorizontalIcon,
  Invoice02Icon,
  AirplaneTakeOff01Icon,
  Airplane01Icon,
  Coupon01Icon,
  Cancel01Icon,
  Settings01Icon,
  Message01Icon,
  MoreHorizontalCircle01Icon
} from "@hugeicons-pro/core-stroke-rounded"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"
import { CheckmarkCircle02Icon } from "@hugeicons-pro/core-solid-rounded"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CompanyLogo } from "@/components/company-logo"
import { motion, AnimatePresence } from "motion/react"
import type { CaseFormData } from "@/app/(dashboard)/new/page"
import type { DateRange } from "react-day-picker"

// Popular companies for autocomplete suggestions
const popularCompanies = [
  // Airlines
  { name: "EasyJet", domain: "easyjet.com", category: "Airlines" },
  { name: "EasyJet Holidays", domain: "easyjet.com/holidays", category: "Airlines" },
  { name: "British Airways", domain: "britishairways.com", category: "Airlines" },
  { name: "Ryanair", domain: "ryanair.com", category: "Airlines" },
  { name: "Jet2", domain: "jet2.com", category: "Airlines" },
  { name: "TUI Airways", domain: "tui.co.uk", category: "Airlines" },
  { name: "Virgin Atlantic", domain: "virginatlantic.com", category: "Airlines" },
  { name: "Wizz Air", domain: "wizzair.com", category: "Airlines" },
  { name: "Lufthansa", domain: "lufthansa.com", category: "Airlines" },
  { name: "Air France", domain: "airfrance.com", category: "Airlines" },
  { name: "KLM", domain: "klm.com", category: "Airlines" },
  { name: "Emirates", domain: "emirates.com", category: "Airlines" },
  { name: "Qatar Airways", domain: "qatarairways.com", category: "Airlines" },
  { name: "American Airlines", domain: "aa.com", category: "Airlines" },
  { name: "Delta Airlines", domain: "delta.com", category: "Airlines" },
  { name: "United Airlines", domain: "united.com", category: "Airlines" },
  { name: "Southwest Airlines", domain: "southwest.com", category: "Airlines" },
  
  // Hotels
  { name: "Hilton Hotels", domain: "hilton.com", category: "Hotels" },
  { name: "Marriott Hotels", domain: "marriott.com", category: "Hotels" },
  { name: "Premier Inn", domain: "premierinn.com", category: "Hotels" },
  { name: "Travelodge", domain: "travelodge.co.uk", category: "Hotels" },
  { name: "Holiday Inn", domain: "ihg.com", category: "Hotels" },
  { name: "Best Western", domain: "bestwestern.com", category: "Hotels" },
  { name: "Radisson Hotels", domain: "radissonhotels.com", category: "Hotels" },
  { name: "Accor Hotels", domain: "accor.com", category: "Hotels" },
  { name: "Hyatt Hotels", domain: "hyatt.com", category: "Hotels" },
  
  // Booking Platforms
  { name: "Booking.com", domain: "booking.com", category: "Travel" },
  { name: "Expedia", domain: "expedia.com", category: "Travel" },
  { name: "Hotels.com", domain: "hotels.com", category: "Travel" },
  { name: "Airbnb", domain: "airbnb.com", category: "Travel" },
  { name: "VRBO", domain: "vrbo.com", category: "Travel" },
  { name: "TripAdvisor", domain: "tripadvisor.com", category: "Travel" },
  { name: "Skyscanner", domain: "skyscanner.com", category: "Travel" },
  { name: "Kayak", domain: "kayak.com", category: "Travel" },
  { name: "Lastminute.com", domain: "lastminute.com", category: "Travel" },
  { name: "On the Beach", domain: "onthebeach.co.uk", category: "Travel" },
  { name: "Trainline", domain: "trainline.com", category: "Travel" },
  
  // Retail
  { name: "Amazon UK", domain: "amazon.co.uk", category: "Retail" },
  { name: "Amazon US", domain: "amazon.com", category: "Retail" },
  { name: "eBay", domain: "ebay.com", category: "Retail" },
  { name: "John Lewis", domain: "johnlewis.com", category: "Retail" },
  { name: "Argos", domain: "argos.co.uk", category: "Retail" },
  { name: "Currys", domain: "currys.co.uk", category: "Retail" },
  { name: "ASOS", domain: "asos.com", category: "Retail" },
  { name: "Next", domain: "next.co.uk", category: "Retail" },
  { name: "Marks & Spencer", domain: "marksandspencer.com", category: "Retail" },
  { name: "Boots", domain: "boots.com", category: "Retail" },
  { name: "Tesco", domain: "tesco.com", category: "Retail" },
  { name: "Sainsbury's", domain: "sainsburys.co.uk", category: "Retail" },
  { name: "IKEA", domain: "ikea.com", category: "Retail" },
  { name: "Wayfair", domain: "wayfair.co.uk", category: "Retail" },
  { name: "Apple Store", domain: "apple.com", category: "Retail" },
  
  // Telecoms
  { name: "Vodafone", domain: "vodafone.co.uk", category: "Telecoms" },
  { name: "EE", domain: "ee.co.uk", category: "Telecoms" },
  { name: "Three", domain: "three.co.uk", category: "Telecoms" },
  { name: "O2", domain: "o2.co.uk", category: "Telecoms" },
  { name: "BT", domain: "bt.com", category: "Telecoms" },
  { name: "Sky", domain: "sky.com", category: "Telecoms" },
  { name: "Virgin Media", domain: "virginmedia.com", category: "Telecoms" },
  { name: "TalkTalk", domain: "talktalk.co.uk", category: "Telecoms" },
  { name: "Plusnet", domain: "plusnet.com", category: "Telecoms" },
  
  // Energy
  { name: "British Gas", domain: "britishgas.co.uk", category: "Energy" },
  { name: "EDF Energy", domain: "edfenergy.com", category: "Energy" },
  { name: "E.ON", domain: "eonenergy.com", category: "Energy" },
  { name: "Scottish Power", domain: "scottishpower.co.uk", category: "Energy" },
  { name: "Octopus Energy", domain: "octopus.energy", category: "Energy" },
  { name: "OVO Energy", domain: "ovoenergy.com", category: "Energy" },
  { name: "Bulb Energy", domain: "bulb.co.uk", category: "Energy" },
  
  // Delivery & Food
  { name: "Deliveroo", domain: "deliveroo.co.uk", category: "Food & Delivery" },
  { name: "Uber Eats", domain: "ubereats.com", category: "Food & Delivery" },
  { name: "Just Eat", domain: "just-eat.co.uk", category: "Food & Delivery" },
  { name: "DPD", domain: "dpd.co.uk", category: "Food & Delivery" },
  { name: "Hermes/Evri", domain: "evri.com", category: "Food & Delivery" },
  { name: "Royal Mail", domain: "royalmail.com", category: "Food & Delivery" },
  { name: "DHL", domain: "dhl.co.uk", category: "Food & Delivery" },
  { name: "FedEx", domain: "fedex.com", category: "Food & Delivery" },
  { name: "UPS", domain: "ups.com", category: "Food & Delivery" },
  
  // Finance & Insurance
  { name: "PayPal", domain: "paypal.com", category: "Finance" },
  { name: "Klarna", domain: "klarna.com", category: "Finance" },
  { name: "Barclays", domain: "barclays.co.uk", category: "Finance" },
  { name: "HSBC", domain: "hsbc.co.uk", category: "Finance" },
  { name: "Lloyds Bank", domain: "lloydsbank.com", category: "Finance" },
  { name: "NatWest", domain: "natwest.com", category: "Finance" },
  { name: "Santander", domain: "santander.co.uk", category: "Finance" },
  { name: "Monzo", domain: "monzo.com", category: "Finance" },
  { name: "Revolut", domain: "revolut.com", category: "Finance" },
  { name: "Admiral Insurance", domain: "admiral.com", category: "Finance" },
  { name: "Direct Line", domain: "directline.com", category: "Finance" },
  { name: "Aviva", domain: "aviva.co.uk", category: "Finance" },
  
  // Transport
  { name: "Uber", domain: "uber.com", category: "Transport" },
  { name: "Bolt", domain: "bolt.eu", category: "Transport" },
  { name: "National Rail", domain: "nationalrail.co.uk", category: "Transport" },
  { name: "Eurostar", domain: "eurostar.com", category: "Transport" },
  { name: "Enterprise Rent-A-Car", domain: "enterprise.co.uk", category: "Transport" },
  { name: "Hertz", domain: "hertz.com", category: "Transport" },
  { name: "Avis", domain: "avis.co.uk", category: "Transport" },
  
  // Subscriptions & Entertainment
  { name: "Netflix", domain: "netflix.com", category: "Entertainment" },
  { name: "Spotify", domain: "spotify.com", category: "Entertainment" },
  { name: "Disney+", domain: "disneyplus.com", category: "Entertainment" },
  { name: "Amazon Prime", domain: "amazon.co.uk/prime", category: "Entertainment" },
  { name: "Apple Music", domain: "apple.com/apple-music", category: "Entertainment" },
  { name: "Now TV", domain: "nowtv.com", category: "Entertainment" },
  { name: "PureGym", domain: "puregym.com", category: "Entertainment" },
  { name: "The Gym Group", domain: "thegymgroup.com", category: "Entertainment" },
  { name: "David Lloyd", domain: "davidlloyd.co.uk", category: "Entertainment" },
]

interface StepTwoProps {
  formData: CaseFormData
  updateFormData: (updates: Partial<CaseFormData>) => void
}

interface CompanyResearch {
  company: {
    name: string
    domain: string
    description: string | null
    ogImage?: string | null
    favicon?: string | null
  }
  complaints: {
    title: string
    url: string
    summary: string
  }[]
  contacts: {
    emails: string[]
    executiveContacts?: {
      name: string
      title: string
      email?: string
      linkedIn?: string
    }[]
    source: string
  } | null
  mock: boolean
}

const currencies = [
  { value: "GBP", label: "£ GBP", symbol: "£" },
  { value: "USD", label: "$ USD", symbol: "$" },
  { value: "EUR", label: "€ EUR", symbol: "€" },
  { value: "AUD", label: "$ AUD", symbol: "A$" },
  { value: "CAD", label: "$ CAD", symbol: "C$" },
]

const outcomes = [
  { value: "ai-suggested", label: "AI suggests", description: "Based on your case", icon: StarIcon, recommended: true },
  { value: "full-refund", label: "Full refund", description: "All money back", icon: CreditCardIcon },
  { value: "partial-refund", label: "Partial refund", description: "Some money back", icon: WalletIcon },
  { value: "replacement", label: "Replacement", description: "New product/service", icon: ArrowReloadHorizontalIcon },
  { value: "compensation", label: "Compensation", description: "For damages", icon: Invoice02Icon },
  { value: "refund-and-compensation", label: "Refund + extra", description: "Full refund plus more", icon: CreditCardIcon },
  { value: "flight-rebooking", label: "Flight change", description: "Rebooking or upgrade", icon: AirplaneTakeOff01Icon },
  { value: "eu261-compensation", label: "EU261 claim", description: "Up to €600", icon: Airplane01Icon },
  { value: "goodwill-gesture", label: "Goodwill gesture", description: "Voucher, credit, or gesture", icon: Coupon01Icon },
  { value: "contract-cancellation", label: "Cancel contract", description: "Exit without penalty", icon: Cancel01Icon },
  { value: "service-fix", label: "Fix the issue", description: "Problem corrected", icon: Settings01Icon },
  { value: "apology", label: "Formal apology", description: "Acknowledgment", icon: Message01Icon },
  { value: "other", label: "Other", description: "Specify below", icon: MoreHorizontalCircle01Icon },
]

const countries = [
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "IT", label: "Italy" },
  { value: "NL", label: "Netherlands" },
  { value: "PT", label: "Portugal" },
  { value: "GR", label: "Greece" },
  { value: "IE", label: "Ireland" },
  { value: "AT", label: "Austria" },
  { value: "BE", label: "Belgium" },
  { value: "CH", label: "Switzerland" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
  { value: "PL", label: "Poland" },
  { value: "CZ", label: "Czech Republic" },
  { value: "HU", label: "Hungary" },
  { value: "TH", label: "Thailand" },
  { value: "JP", label: "Japan" },
  { value: "SG", label: "Singapore" },
  { value: "HK", label: "Hong Kong" },
  { value: "MY", label: "Malaysia" },
  { value: "ID", label: "Indonesia" },
  { value: "PH", label: "Philippines" },
  { value: "VN", label: "Vietnam" },
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "TR", label: "Turkey" },
  { value: "EG", label: "Egypt" },
  { value: "ZA", label: "South Africa" },
  { value: "MX", label: "Mexico" },
  { value: "BR", label: "Brazil" },
  { value: "CA", label: "Canada" },
  { value: "OTHER", label: "Other" },
]

const paymentMethods = [
  { value: "credit-card", label: "Credit Card" },
  { value: "debit-card", label: "Debit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "other", label: "Other" },
]

const cardTypes = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
  { value: "discover", label: "Discover" },
  { value: "other", label: "Other" },
]

const bookingPlatforms = [
  { value: "none", label: "None / Direct booking" },
  { value: "booking.com", label: "Booking.com" },
  { value: "expedia", label: "Expedia" },
  { value: "airbnb", label: "Airbnb" },
  { value: "hotels.com", label: "Hotels.com" },
  { value: "agoda", label: "Agoda" },
  { value: "tripadvisor", label: "TripAdvisor" },
  { value: "skyscanner", label: "Skyscanner" },
  { value: "kayak", label: "Kayak" },
  { value: "opodo", label: "Opodo" },
  { value: "lastminute", label: "Lastminute.com" },
  { value: "trainline", label: "Trainline" },
  { value: "uber", label: "Uber" },
  { value: "deliveroo", label: "Deliveroo" },
  { value: "amazon", label: "Amazon" },
  { value: "ebay", label: "eBay" },
  { value: "other", label: "Other platform" },
]

export function StepTwo({ formData, updateFormData }: StepTwoProps) {
  const selectedCurrency = currencies.find((c) => c.value === formData.currency)
  const [isResearching, setIsResearching] = useState(false)
  // Initialize from formData if available (e.g., from loaded draft)
  const [companyResearch, setCompanyResearch] = useState<CompanyResearch | null>(formData.companyResearch || null)
  const [researchError, setResearchError] = useState<string | null>(null)
  const [dateMode, setDateMode] = useState<"single" | "range">("single")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const lastSearchedRef = useRef<string>("")
  
  // Sync companyResearch state with formData when it changes (e.g., from draft load)
  // Extract stable primitive values for dependency tracking using useMemo
  const formDataResearchName = useMemo(() => formData.companyResearch?.company.name || "", [formData.companyResearch?.company.name])
  const formDataResearchDomain = useMemo(() => formData.companyResearch?.company.domain || "", [formData.companyResearch?.company.domain])
  const formDataResearchRef = useRef(formData.companyResearch)
  
  // Update ref whenever companyResearch changes
  useEffect(() => {
    formDataResearchRef.current = formData.companyResearch
  }, [formDataResearchName, formDataResearchDomain]) // Depend on primitives, but update ref
  
  // Sync companyResearch state when formData.companyResearch changes
  // We depend only on primitive values to avoid object reference issues
  useEffect(() => {
    // If we have valid research data, sync it to state
    if (formDataResearchName && formDataResearchDomain && formDataResearchRef.current) {
      setCompanyResearch(formDataResearchRef.current)
      // Mark this as already searched to prevent re-researching
      lastSearchedRef.current = formDataResearchName
    }
  }, [formDataResearchName, formDataResearchDomain]) // Only depend on primitives - use ref for object access
  
  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof popularCompanies>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  
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
    ).slice(0, 8) // Limit to 8 suggestions
    
    setSuggestions(filtered)
    setHighlightedIndex(-1)
  }, [])
  
  // Handle company selection from suggestions
  const selectCompany = useCallback((company: typeof popularCompanies[0]) => {
    trackEvent(AnalyticsEvents.CASE.COMPANY_SELECTED, {
      company_name: company.name,
      company_domain: company.domain,
      company_category: company.category,
      selection_type: "autocomplete",
    })
    updateFormData({ companyName: company.name })
    setShowSuggestions(false)
    setSuggestions([])
    inputRef.current?.blur()
  }, [updateFormData])
  
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

  // Extract stable values for dependency checking
  const formDataCompanyName = formData.companyName.trim()
  const currentResearchName = companyResearch?.company.name || ""
  const currentResearchDomain = companyResearch?.company.domain || ""

  useEffect(() => {
    const companyName = formDataCompanyName

    if (companyName.length < 2) {
      setCompanyResearch(null)
      lastSearchedRef.current = ""
      return
    }

    // If we already have valid companyResearch for this company name, don't re-research
    if (currentResearchName === companyName && currentResearchDomain) {
      lastSearchedRef.current = companyName
      return
    }

    // If formData has matching companyResearch, use it
    if (formDataResearchName === companyName && formDataResearchDomain && formDataResearchRef.current) {
      setCompanyResearch(formDataResearchRef.current)
      lastSearchedRef.current = companyName
      return
    }

    // Prevent duplicate searches for the same company name
    if (companyName === lastSearchedRef.current) {
      return
    }

    const timeoutId = setTimeout(async () => {
      // Double-check we haven't already searched this or have valid research
      if (companyName === lastSearchedRef.current) {
        return
      }
      
      // Final check: if formData now has companyResearch that matches, use it
      if (formDataResearchRef.current?.company.name === companyName && formDataResearchRef.current.company.domain) {
        setCompanyResearch(formDataResearchRef.current)
        lastSearchedRef.current = companyName
        return
      }

      lastSearchedRef.current = companyName
      setIsResearching(true)
      setResearchError(null)

      trackEvent(AnalyticsEvents.CASE.COMPANY_SEARCHED, {
        company_name: companyName,
        search_type: "api_lookup",
      })

      try {
        const response = await fetch("/api/research/company", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyName }),
        })

        if (!response.ok) throw new Error("Research failed")

        const data = await response.json()
        setCompanyResearch(data)
        updateFormData({ companyResearch: data })
      } catch (error) {
        console.error("Company research error:", error)
        setResearchError("Could not fetch company information")
      } finally {
        setIsResearching(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formDataCompanyName, formDataResearchName, formDataResearchDomain, currentResearchName, currentResearchDomain, updateFormData])

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    updateFormData({ incidentDate: range?.from })
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Company */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="h-7 w-1.5 bg-peach-500 rounded-full" />
          <h3 className="text-base font-bold text-foreground uppercase tracking-wide">Company</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-base font-medium">
            Company Name or Website
          </Label>
        <div className="flex gap-3 items-center">
          <div className="shrink-0">
            <CompanyLogo
              companyName={formData.companyName}
              domain={companyResearch?.company.domain}
              size={40}
              showFallback={true}
            />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="relative">
              <Input
                ref={inputRef}
                id="companyName"
                placeholder="e.g., Hilton Hotels, amazon.com, britishairways.com"
                value={formData.companyName}
                onChange={(e) => {
                  updateFormData({ companyName: e.target.value })
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
              
              {/* Autocomplete suggestions dropdown */}
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
                        "w-full flex items-center gap-3 px-3 py-3 text-left transition-colors touch-manipulation",
                        "min-h-[44px]", // Ensure minimum touch target height
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
            {isResearching && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon icon={Loading01Icon} size={12} className="animate-spin" />
                Researching company...
              </div>
            )}
            {companyResearch && !isResearching && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Icon icon={CheckmarkCircle01Icon} size={14} />
                <span className="font-medium">{companyResearch.company.name}</span>
                {companyResearch.company.domain && (
                  <span className="text-muted-foreground text-xs">({companyResearch.company.domain})</span>
                )}
              </div>
            )}
            {researchError && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <Icon icon={AlertCircleIcon} size={12} />
                {researchError}
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter the company name or paste their website URL. We&apos;ll research them to strengthen your case.
        </p>

        {companyResearch?.contacts?.emails && companyResearch.contacts.emails.length > 0 && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
            <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-1">
              <Icon icon={Mail01Icon} size={12} />
              Contact emails found (sorted by usefulness):
            </p>
            <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
              {companyResearch.contacts.emails.map((email, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="font-mono">{email}</span>
                  {i === 0 && <span className="text-[10px] bg-green-200 dark:bg-green-800 px-1.5 py-0.5 rounded">Best</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {companyResearch?.contacts?.executiveContacts && companyResearch.contacts.executiveContacts.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-1">
              <Icon icon={UserMultiple02Icon} size={12} />
              Key executives found (for escalation):
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1.5">
              {companyResearch.contacts.executiveContacts.map((exec, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="font-medium">{exec.name}</span>
                  <span className="text-blue-500 dark:text-blue-400">- {exec.title}</span>
                  {exec.linkedIn && (
                    <a
                      href={exec.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-300 hover:underline flex items-center gap-0.5"
                    >
                      <Icon icon={Link01Icon} size={10} />
                      LinkedIn
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {companyResearch?.complaints && companyResearch.complaints.length > 0 && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium mb-2">Similar complaints found:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {companyResearch.complaints.slice(0, 3).map((complaint, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="shrink-0">•</span>
                  <a
                    href={complaint.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1 truncate"
                  >
                    {complaint.title}
                    <Icon icon={Link01Icon} size={10} className="shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </motion.section>

      {/* Section 2: Incident Details */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="h-7 w-1.5 bg-lavender-500 rounded-full" />
          <h3 className="text-base font-bold text-foreground uppercase tracking-wide">Incident Details</h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">When did this happen?</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={dateMode === "single" ? "coral" : "outline"}
                size="sm"
                onClick={() => setDateMode("single")}
              >
                Single day
              </Button>
              <Button
                type="button"
                variant={dateMode === "range" ? "coral" : "outline"}
                size="sm"
                onClick={() => setDateMode("range")}
              >
                Date range
              </Button>
            </div>
          </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.incidentDate && !dateRange?.from && "text-muted-foreground",
              )}
            >
              <Icon icon={Calendar01Icon} size={16} className="mr-2" />
              {dateMode === "single" ? (
                formData.incidentDate ? (
                  format(formData.incidentDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )
              ) : dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {dateMode === "single" ? (
              <Calendar
                mode="single"
                selected={formData.incidentDate}
                onSelect={(date) => updateFormData({ incidentDate: date })}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            ) : (
              <>
                {/* Mobile: Single month calendar */}
                <div className="sm:hidden">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    disabled={(date) => date > new Date()}
                    numberOfMonths={1}
                    initialFocus
                  />
                </div>
                {/* Desktop: Two month calendar */}
                <div className="hidden sm:block">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    disabled={(date) => date > new Date()}
                    numberOfMonths={2}
                    initialFocus
                  />
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground">
          {dateMode === "range"
            ? "Select the start and end dates if the issue occurred over multiple days."
            : "Select the date when the issue occurred."}
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">How much did you pay?</Label>
        <div className="flex gap-2">
          <Select value={formData.currency} onValueChange={(value) => updateFormData({ currency: value })}>
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
              value={formData.purchaseAmount}
              onChange={(e) => updateFormData({ purchaseAmount: e.target.value })}
            />
          </div>
        </div>
      </div>
      </motion.section>

      {/* Section 3: Jurisdiction & Payment */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="h-7 w-1.5 bg-forest-500 rounded-full" />
          <h3 className="text-base font-bold text-foreground uppercase tracking-wide">Location & Payment</h3>
        </div>
        
        <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">
            These details help us identify which consumer laws and payment protections apply.
          </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="incidentCountry" className="text-sm">Where did this happen?</Label>
            <Select value={formData.incidentCountry} onValueChange={(value) => updateFormData({ incidentCountry: value })}>
              <SelectTrigger id="incidentCountry">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userCountry" className="text-sm">Where do you live?</Label>
            <Select value={formData.userCountry} onValueChange={(value) => updateFormData({ userCountry: value })}>
              <SelectTrigger id="userCountry">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className="text-sm">How did you pay?</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => updateFormData({ paymentMethod: value, cardType: value === "credit-card" || value === "debit-card" ? formData.cardType : "" })}>
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(formData.paymentMethod === "credit-card" || formData.paymentMethod === "debit-card") && (
            <div className="space-y-2">
              <Label htmlFor="cardType" className="text-sm">Card Type</Label>
              <Select value={formData.cardType || ""} onValueChange={(value) => updateFormData({ cardType: value })}>
                <SelectTrigger id="cardType">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  {cardTypes.map((card) => (
                    <SelectItem key={card.value} value={card.value}>
                      {card.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookingPlatform" className="text-sm">Booked through a platform?</Label>
          <Select value={formData.bookingPlatform || "none"} onValueChange={(value) => updateFormData({ bookingPlatform: value === "none" ? "" : value })}>
            <SelectTrigger id="bookingPlatform">
              <SelectValue placeholder="Select platform (if any)" />
            </SelectTrigger>
            <SelectContent>
              {bookingPlatforms.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Platforms often have their own resolution processes and guarantees we can leverage.
          </p>
        </div>
        </div>
      </motion.section>

      {/* Section 4: Desired Outcome */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="h-7 w-1.5 bg-cream-500 rounded-full" />
          <h3 className="text-base font-bold text-foreground uppercase tracking-wide">What Do You Want?</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Select your desired outcomes</Label>
            <span className="text-xs text-muted-foreground">Select all that apply</span>
          </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {outcomes.map((outcome) => {
            const isSelected = formData.desiredOutcomes?.includes(outcome.value) || 
              (!formData.desiredOutcomes?.length && formData.desiredOutcome === outcome.value)
            
            const handleToggle = () => {
              const currentOutcomes = formData.desiredOutcomes || 
                (formData.desiredOutcome ? [formData.desiredOutcome] : [])
              
              let newOutcomes: string[]
              if (isSelected) {
                newOutcomes = currentOutcomes.filter((o: string) => o !== outcome.value)
              } else {
                // If selecting AI-suggested, it should be exclusive
                if (outcome.value === "ai-suggested") {
                  newOutcomes = ["ai-suggested"]
                } else {
                  // Remove ai-suggested if selecting something else
                  newOutcomes = [...currentOutcomes.filter((o: string) => o !== "ai-suggested"), outcome.value]
                }
              }
              
              updateFormData({ 
                desiredOutcomes: newOutcomes,
                desiredOutcome: newOutcomes[0] || "" 
              })
            }
            
            return (
              <motion.button
                key={outcome.value}
                type="button"
                onClick={handleToggle}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors text-center",
                  isSelected
                    ? "border-peach-400 bg-peach-50 dark:bg-peach-950/30"
                    : "border-border hover:border-muted-foreground/40 bg-card",
                  outcome.recommended && !isSelected && "border-lavender-300 dark:border-lavender-700 bg-gradient-to-br from-lavender-50/50 to-peach-50/50 dark:from-lavender-950/20 dark:to-peach-950/20"
                )}
              >
                {outcome.recommended && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 rounded-full bg-lavender-500 text-white font-medium whitespace-nowrap">
                    RECOMMENDED
                  </span>
                )}
                <Icon 
                  icon={outcome.icon} 
                  size={24} 
                  className={cn(
                    "transition-colors",
                    isSelected ? "text-peach-600" : "text-muted-foreground",
                    outcome.recommended && !isSelected && "text-lavender-500"
                  )} 
                />
                <div className="space-y-0.5">
                  <p className={cn(
                    "text-xs font-medium leading-tight",
                    isSelected && "text-peach-700 dark:text-peach-300",
                    outcome.recommended && !isSelected && "text-lavender-700 dark:text-lavender-300"
                  )}>
                    {outcome.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {outcome.description}
                  </p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute top-1.5 right-1.5 z-10"
                  >
                    <div className="bg-peach-500 rounded-full p-1 shadow-md flex items-center justify-center">
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 12 12" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                      >
                        <path 
                          d="M2 6L4.5 8.5L10 3" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {(formData.desiredOutcomes?.includes("other") || formData.desiredOutcome === "other") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Input
                placeholder="Describe your desired outcome..."
                value={formData.customOutcome || ""}
                onChange={(e) => updateFormData({ customOutcome: e.target.value })}
                className="mt-2"
              />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.section>
    </div>
  )
}
