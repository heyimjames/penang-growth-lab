"use client"

import { useState, useEffect } from "react"
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
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Calendar01Icon,
  InformationCircleIcon,
  Clock01Icon,
  Globe02Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type Region = "uk" | "eu" | "us" | "ca" | "au" | "other"
type FlightType = "domestic" | "international"
type DelayReason = "technical" | "weather" | "strike" | "unknown" | "overbooking" | "cancellation"
type FlightDistance = "short" | "medium" | "long"

interface FlightCompensationResult {
  eligible: boolean
  eligibilityReason: string
  compensation: number | null
  currency: string
  regulation: string | null
  additionalRights: string[]
  steps: string[]
  warnings: string[]
  claimDeadline: string | null
}

const regionConfig: Record<Region, { currency: string; symbol: string; name: string }> = {
  uk: { currency: "GBP", symbol: "£", name: "United Kingdom" },
  eu: { currency: "EUR", symbol: "€", name: "European Union" },
  us: { currency: "USD", symbol: "$", name: "United States" },
  ca: { currency: "CAD", symbol: "C$", name: "Canada" },
  au: { currency: "AUD", symbol: "A$", name: "Australia" },
  other: { currency: "USD", symbol: "$", name: "Other" },
}

function calculateCompensation(
  region: Region,
  flightType: FlightType,
  departureRegion: Region,
  arrivalRegion: Region,
  delayHours: number,
  delayReason: DelayReason,
  flightDistance: FlightDistance,
  flightDate: string
): FlightCompensationResult {
  const config = regionConfig[region]
  const additionalRights: string[] = []
  const steps: string[] = []
  const warnings: string[] = []

  // Calculate claim deadline based on region
  const flightDateObj = new Date(flightDate)
  const now = new Date()

  // UK/EU: UK261/EU261 regulations
  if (region === "uk" || region === "eu" || departureRegion === "uk" || departureRegion === "eu") {
    const deadlineYears = region === "uk" ? 6 : 3 // UK = 6 years, EU varies (usually 2-3)
    const deadlineDate = new Date(flightDateObj)
    deadlineDate.setFullYear(deadlineDate.getFullYear() + deadlineYears)
    const claimDeadline = deadlineDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    if (deadlineDate < now) {
      return {
        eligible: false,
        eligibilityReason: `The ${deadlineYears}-year claim deadline has passed for this flight.`,
        compensation: null,
        currency: config.symbol,
        regulation: region === "uk" ? "UK261" : "EU261",
        additionalRights: [],
        steps: [],
        warnings: [`The limitation period is ${deadlineYears} years in ${region === "uk" ? "the UK" : "most EU countries"}.`],
        claimDeadline,
      }
    }

    // Check delay duration for EU261/UK261
    if (delayHours < 3 && delayReason !== "cancellation") {
      return {
        eligible: false,
        eligibilityReason: "Compensation requires a delay of 3+ hours at your final destination. However, you may have rights to care (meals, refreshments).",
        compensation: null,
        currency: config.symbol,
        regulation: region === "uk" ? "UK261" : "EU261",
        additionalRights: delayHours >= 2 ? ["Right to meals and refreshments", "Right to communication"] : [],
        steps: ["Keep receipts for any expenses"],
        warnings: [],
        claimDeadline,
      }
    }

    // Check for extraordinary circumstances
    if (delayReason === "weather") {
      return {
        eligible: false,
        eligibilityReason: "Severe weather is an 'extraordinary circumstance' - compensation isn't available, but you have other rights.",
        compensation: null,
        currency: config.symbol,
        regulation: region === "uk" ? "UK261" : "EU261",
        additionalRights: [
          "Right to meals and refreshments",
          "Right to hotel if overnight delay",
          "Right to rebook or full refund",
        ],
        steps: ["Claim expenses from the airline", "Request rebooking or refund"],
        warnings: ["Airlines sometimes wrongly blame weather - verify if possible"],
        claimDeadline,
      }
    }

    // Calculate compensation (EU261/UK261)
    let compensation: number
    if (region === "uk") {
      compensation = flightDistance === "short" ? 220 : flightDistance === "medium" ? 350 : 520
    } else {
      compensation = flightDistance === "short" ? 250 : flightDistance === "medium" ? 400 : 600
    }

    additionalRights.push("Right to meals and refreshments during delay")
    if (delayHours >= 5 || delayReason === "cancellation") {
      additionalRights.push("Right to choose between rebooking or full refund")
    }

    steps.push(`Contact the airline citing ${region === "uk" ? "UK261" : "EU261"} regulations`)
    steps.push(`Claim ${config.symbol}${compensation} compensation per passenger`)
    steps.push("Include booking reference and evidence of delay")
    steps.push(region === "uk" ? "Escalate to CAA if rejected" : "Escalate to national enforcement body if rejected")

    return {
      eligible: true,
      eligibilityReason: `Your flight is covered by ${region === "uk" ? "UK261" : "EU261"} regulations. You're entitled to compensation for the ${delayHours}+ hour delay.`,
      compensation,
      currency: config.symbol,
      regulation: region === "uk" ? "UK261" : "EU261",
      additionalRights,
      steps,
      warnings: delayReason === "technical" ? ["Airlines may claim 'hidden defect' - this rarely holds up"] : [],
      claimDeadline,
    }
  }

  // US: DOT regulations
  if (region === "us") {
    // US has different rules - primarily for cancellations and denied boarding
    if (delayReason === "overbooking") {
      const compensation = delayHours <= 1 ? 0 : delayHours <= 2 ? 775 : 1550

      return {
        eligible: compensation > 0,
        eligibilityReason: compensation > 0
          ? `Under DOT rules, you're entitled to compensation for denied boarding (involuntary bumping).`
          : "If you arrived within 1 hour of scheduled time, no compensation is due.",
        compensation,
        currency: "$",
        regulation: "DOT Denied Boarding Rules",
        additionalRights: [
          "Payment must be made immediately at the airport",
          "Must be paid by check or cash (not vouchers, unless you agree)",
        ],
        steps: [
          "Request compensation at the gate",
          "File a complaint with DOT if refused",
        ],
        warnings: compensation > 0 ? [] : ["Voluntary bumping (accepting an offer) has different rules"],
        claimDeadline: null,
      }
    }

    if (delayReason === "cancellation") {
      return {
        eligible: false,
        eligibilityReason: "US law doesn't require compensation for cancelled or delayed flights, but you have other options.",
        compensation: null,
        currency: "$",
        regulation: "DOT Consumer Protection",
        additionalRights: [
          "Right to refund for cancelled flights",
          "Right to refund if significant delay and you choose not to travel",
          "Check airline's Contract of Carriage for their policies",
        ],
        steps: [
          "Request a refund for cancelled flights",
          "Check if your credit card offers travel protection",
          "File DOT complaint for refund issues",
        ],
        warnings: ["US airlines are not required to compensate for delays"],
        claimDeadline: null,
      }
    }

    return {
      eligible: false,
      eligibilityReason: "US law doesn't require compensation for flight delays (unlike EU law). However, you may have other options.",
      compensation: null,
      currency: "$",
      regulation: null,
      additionalRights: [
        "Check your airline's Contract of Carriage",
        "Travel insurance may cover delays",
        "Credit card travel protection may apply",
      ],
      steps: [
        "Contact the airline for goodwill compensation",
        "Check your travel insurance policy",
        "File a DOT complaint if treated unfairly",
      ],
      warnings: ["Consider booking with EU airlines for better delay protection on transatlantic flights"],
      claimDeadline: null,
    }
  }

  // Canada: APPR (Air Passenger Protection Regulations)
  if (region === "ca") {
    if (delayReason === "weather") {
      return {
        eligible: false,
        eligibilityReason: "Weather is outside airline control under APPR. Compensation isn't available, but you have rights to care.",
        compensation: null,
        currency: "C$",
        regulation: "APPR",
        additionalRights: [
          "Food and drink after 2 hours",
          "Accommodation if overnight",
          "Rebooking on next available flight",
        ],
        steps: ["Request meals and accommodation from the airline"],
        warnings: [],
        claimDeadline: null,
      }
    }

    // APPR compensation for large carriers (within airline control)
    let compensation: number | null = null
    if (delayHours >= 3 && delayHours < 6) compensation = 400
    else if (delayHours >= 6 && delayHours < 9) compensation = 700
    else if (delayHours >= 9) compensation = 1000

    if (compensation) {
      return {
        eligible: true,
        eligibilityReason: `Under APPR, large carriers must pay compensation for delays within their control.`,
        compensation,
        currency: "C$",
        regulation: "Air Passenger Protection Regulations (APPR)",
        additionalRights: [
          "Food and drink after 2 hours",
          "Accommodation if overnight delay",
          "Rebooking on next available flight",
        ],
        steps: [
          "File a claim with the airline within 1 year",
          "Cite APPR regulations",
          "Escalate to CTA (Canadian Transportation Agency) if rejected",
        ],
        warnings: ["Small carriers have lower compensation amounts"],
        claimDeadline: "1 year from flight date",
      }
    }

    return {
      eligible: false,
      eligibilityReason: "Delays under 3 hours don't qualify for APPR compensation, but you have other rights.",
      compensation: null,
      currency: "C$",
      regulation: "APPR",
      additionalRights: ["Right to information about delay", "Right to rebooking"],
      steps: ["Request updates from the airline"],
      warnings: [],
      claimDeadline: null,
    }
  }

  // Australia: No specific compensation law
  if (region === "au") {
    return {
      eligible: false,
      eligibilityReason: "Australia doesn't have specific flight delay compensation laws like the EU. However, you have consumer protection rights.",
      compensation: null,
      currency: "A$",
      regulation: "Australian Consumer Law",
      additionalRights: [
        "Services must be provided with due care and skill",
        "Right to remedy if service not provided as promised",
        "Check airline's conditions of carriage",
      ],
      steps: [
        "Contact the airline for compensation/vouchers",
        "Lodge complaint with Airline Customer Advocate",
        "Consider ACCC if treated unfairly",
        "Check travel insurance coverage",
      ],
      warnings: ["Airlines set their own delay policies - check the fine print"],
      claimDeadline: null,
    }
  }

  // Other countries
  return {
    eligible: false,
    eligibilityReason: "Flight delay compensation varies by country. Check if your flight was to/from the EU (EU261 may apply) or your local consumer protection laws.",
    compensation: null,
    currency: "$",
    regulation: null,
    additionalRights: [
      "Check if EU261 applies (flights from EU airports)",
      "Review airline's conditions of carriage",
      "Travel insurance may provide coverage",
    ],
    steps: [
      "Contact the airline directly",
      "Check your travel insurance policy",
      "Research your country's consumer protection laws",
    ],
    warnings: [],
    claimDeadline: null,
  }
}

function CompensationBadge({ compensation, currency }: { compensation: number | null; currency: string }) {
  if (compensation === null) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-stone-100 text-stone-600 border-stone-200 text-sm font-medium">
        <Icon icon={AlertCircleIcon} size={18} />
        No Fixed Compensation
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-green-100 text-green-700 border-green-200 text-sm font-medium">
      <Icon icon={CheckmarkCircle01Icon} size={18} />
      {currency}{compensation} Compensation
    </div>
  )
}

function ResultCard({ result }: { result: FlightCompensationResult }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Eligibility Status */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <CompensationBadge compensation={result.compensation} currency={result.currency} />
          {result.regulation && (
            <span className="text-xs px-3 py-1 rounded-full bg-lavender-100 text-lavender-700">
              {result.regulation}
            </span>
          )}
        </div>
        <p className="text-muted-foreground leading-relaxed">{result.eligibilityReason}</p>
        {result.claimDeadline && (
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
            <Icon icon={Calendar01Icon} size={14} />
            Claim deadline: {result.claimDeadline}
          </p>
        )}
      </div>

      {/* Compensation Amount */}
      {result.compensation && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Your Compensation</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-green-700">{result.currency}{result.compensation}</span>
            <span className="text-muted-foreground">per passenger</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Claims companies typically take 25-35% - with NoReply, you keep 100%.
          </p>
        </div>
      )}

      {/* Additional Rights */}
      {result.additionalRights.length > 0 && (
        <div className="p-6 bg-background border border-forest-100 rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Your Rights</h3>
          <ul className="space-y-2">
            {result.additionalRights.map((right, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{right}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps to Take */}
      {result.steps.length > 0 && (
        <div className="p-6 bg-background border border-forest-100 rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">What to Do</h3>
          <ol className="space-y-3">
            {result.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-forest-100 text-forest-600 text-sm font-medium flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon icon={AlertCircleIcon} size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              {result.warnings.map((warning, i) => (
                <p key={i} className="text-sm text-amber-700">{warning}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="p-6 bg-forest-500 rounded-lg text-white">
        <h3 className="font-semibold text-lg mb-2">
          {result.compensation ? `Ready to claim your ${result.currency}${result.compensation}?` : "Need help with your claim?"}
        </h3>
        <p className="text-forest-100 mb-4">
          Generate a professional compensation letter with the right legal references for your jurisdiction.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="coral">
            <Link href={`/new?tool=flight&compensation=${result.compensation || 0}`} className="flex items-center">
              Generate Claim Letter
              <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="bg-white/10 text-white hover:bg-white hover:text-forest-700"
          >
            <Link href="/auth/sign-up">Create Free Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function FlightCompensationForm() {
  const { trackFormSubmit, trackResultViewed } = useToolTracking("flight-compensation")
  const [region, setRegion] = useState<Region | "">("")
  const [flightType, setFlightType] = useState<FlightType | "">("")
  const [departureRegion, setDepartureRegion] = useState<Region | "">("")
  const [arrivalRegion, setArrivalRegion] = useState<Region | "">("")
  const [delayHours, setDelayHours] = useState("")
  const [delayReason, setDelayReason] = useState<DelayReason | "">("")
  const [flightDistance, setFlightDistance] = useState<FlightDistance | "">("")
  const [flightDate, setFlightDate] = useState("")
  const [result, setResult] = useState<FlightCompensationResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!region || !departureRegion || !arrivalRegion || !delayHours || !delayReason || !flightDistance || !flightDate) {
      setError("Please fill in all fields")
      return
    }

    const hours = parseFloat(delayHours)
    if (isNaN(hours) || hours < 0) {
      setError("Please enter a valid delay duration")
      return
    }

    const compensation = calculateCompensation(
      region,
      flightType || "international",
      departureRegion,
      arrivalRegion,
      hours,
      delayReason,
      flightDistance,
      flightDate
    )
    setResult(compensation)

    // Track form submission
    trackFormSubmit(true, {
      eligible: compensation.eligible,
      compensation: compensation.compensation,
      region,
      delay_hours: hours,
    })

    // Track result viewed
    trackResultViewed(compensation.eligible ? "eligible" : "not_eligible")
  }

  const handleReset = () => {
    setRegion("")
    setFlightType("")
    setDepartureRegion("")
    setArrivalRegion("")
    setDelayHours("")
    setDelayReason("")
    setFlightDistance("")
    setFlightDate("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Your Location */}
          <div className="space-y-2">
            <Label htmlFor="region">Where are you based?</Label>
            <Select
              value={region}
              onValueChange={(value) => setRegion(value as Region)}
            >
              <SelectTrigger id="region">
                <SelectValue placeholder="Select your country/region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="eu">🇪🇺 European Union</SelectItem>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                <SelectItem value="au">🇦🇺 Australia</SelectItem>
                <SelectItem value="other">🌍 Other Country</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Flight Date */}
          <div className="space-y-2">
            <Label htmlFor="flight-date">Flight date</Label>
            <Input
              id="flight-date"
              type="date"
              value={flightDate}
              onChange={(e) => setFlightDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Departure Region */}
          <div className="space-y-2">
            <Label htmlFor="departure">Where did the flight depart from?</Label>
            <Select
              value={departureRegion}
              onValueChange={(value) => setDepartureRegion(value as Region)}
            >
              <SelectTrigger id="departure">
                <SelectValue placeholder="Select departure region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uk">🇬🇧 UK airport</SelectItem>
                <SelectItem value="eu">🇪🇺 EU airport</SelectItem>
                <SelectItem value="us">🇺🇸 US airport</SelectItem>
                <SelectItem value="ca">🇨🇦 Canadian airport</SelectItem>
                <SelectItem value="au">🇦🇺 Australian airport</SelectItem>
                <SelectItem value="other">🌍 Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Icon icon={InformationCircleIcon} size={12} />
              EU261/UK261 applies to all flights departing from UK/EU
            </p>
          </div>

          {/* Arrival Region */}
          <div className="space-y-2">
            <Label htmlFor="arrival">Where was the destination?</Label>
            <Select
              value={arrivalRegion}
              onValueChange={(value) => setArrivalRegion(value as Region)}
            >
              <SelectTrigger id="arrival">
                <SelectValue placeholder="Select arrival region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uk">🇬🇧 UK airport</SelectItem>
                <SelectItem value="eu">🇪🇺 EU airport</SelectItem>
                <SelectItem value="us">🇺🇸 US airport</SelectItem>
                <SelectItem value="ca">🇨🇦 Canadian airport</SelectItem>
                <SelectItem value="au">🇦🇺 Australian airport</SelectItem>
                <SelectItem value="other">🌍 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Flight Distance */}
          <div className="space-y-2">
            <Label htmlFor="distance">Flight distance</Label>
            <Select
              value={flightDistance}
              onValueChange={(value) => setFlightDistance(value as FlightDistance)}
            >
              <SelectTrigger id="distance">
                <SelectValue placeholder="Select approximate distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Under 1,500 km (short-haul)</SelectItem>
                <SelectItem value="medium">1,500-3,500 km (medium-haul)</SelectItem>
                <SelectItem value="long">Over 3,500 km (long-haul)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Delay Duration */}
          <div className="space-y-2">
            <Label htmlFor="delay">How long was the delay? (hours)</Label>
            <Input
              id="delay"
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g. 4"
              value={delayHours}
              onChange={(e) => setDelayHours(e.target.value)}
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Icon icon={Clock01Icon} size={12} />
              Delay at your final destination
            </p>
          </div>

          {/* Delay Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">What happened?</Label>
            <Select
              value={delayReason}
              onValueChange={(value) => setDelayReason(value as DelayReason)}
            >
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select what happened" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical/mechanical issue</SelectItem>
                <SelectItem value="cancellation">Flight was cancelled</SelectItem>
                <SelectItem value="overbooking">Denied boarding (overbooked)</SelectItem>
                <SelectItem value="weather">Severe weather</SelectItem>
                <SelectItem value="strike">Strike action</SelectItem>
                <SelectItem value="unknown">Other / Don&apos;t know</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12"
          >
            Check My Compensation
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Results</h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Check another flight
            </Button>
          </div>
          <ResultCard result={result} />
        </div>
      )}
    </div>
  )
}
