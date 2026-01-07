import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  AirplaneTakeOff01Icon,
  Clock01Icon,
  MoneyBag01Icon,
  AlertCircleIcon,
  Sun01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

export const metadata: Metadata = {
  title: "Summer Flight Delays & Cancellations 2025 | Claim Up to £520 | NoReply",
  description:
    "Flight delayed or cancelled this summer? You could be owed up to £520 in compensation under UK261. Check your eligibility and claim in minutes.",
  openGraph: {
    title: "Summer Flight Compensation | Claim Up to £520 | NoReply",
    description:
      "Flight delayed more than 3 hours? Cancelled flight? Claim your compensation now.",
  },
}

const compensationAmounts = [
  { distance: "Under 1,500km", delay: "3+ hours", amount: "£220", example: "London to Paris" },
  { distance: "1,500-3,500km", delay: "3+ hours", amount: "£350", example: "London to Athens" },
  { distance: "Over 3,500km", delay: "4+ hours", amount: "£520", example: "London to New York" },
]

const commonExcuses = [
  {
    excuse: "\"It was due to extraordinary circumstances\"",
    truth: "Crew shortages, technical faults, and airport congestion are NOT extraordinary circumstances",
    icon: AlertCircleIcon,
  },
  {
    excuse: "\"You're not eligible because of bad weather\"",
    truth: "Weather must be severe AND unpredictable. Airlines often misuse this excuse",
    icon: Sun01Icon,
  },
  {
    excuse: "\"You can only claim within 6 weeks\"",
    truth: "UK law allows claims up to 6 YEARS after your flight",
    icon: Clock01Icon,
  },
]

const yourRights = [
  {
    title: "Delays Over 3 Hours",
    description: "Automatic compensation of £220-£520 based on flight distance",
  },
  {
    title: "Flight Cancellations",
    description: "Full refund plus compensation unless given 14+ days notice",
  },
  {
    title: "Denied Boarding",
    description: "Compensation plus alternative flight at no extra cost",
  },
  {
    title: "Downgraded Seat",
    description: "Refund of 30-75% of ticket price depending on distance",
  },
]

export default function SummerFlightsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-forest-100 bg-gradient-to-b from-sky-50 via-background to-background">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-sky-100 text-sky-700 hover:bg-sky-100">
              <Icon icon={Sun01Icon} size={12} className="mr-1" />
              Summer 2025
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display mb-6">
              Flight Delayed?<br />
              <span className="text-sky-500">Claim Up to £520</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Summer travel chaos? Under UK261, you could be owed hundreds in compensation for delays over 3 hours.
              Check your eligibility in 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="coral" asChild className="px-8">
                <Link href="/tools/flight-compensation">
                  Check My Compensation
                  <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/new?context=flight-delay">
                  Start My Claim
                </Link>
              </Button>
            </div>

            {/* Compensation Table */}
            <div className="bg-white rounded-xl border border-sky-200 p-6 text-left">
              <h3 className="font-semibold mb-4 text-center">How Much Could You Get?</h3>
              <div className="space-y-3">
                {compensationAmounts.map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-sky-50">
                    <div>
                      <p className="font-medium">{row.distance}</p>
                      <p className="text-xs text-muted-foreground">{row.example} • {row.delay} delay</p>
                    </div>
                    <span className="text-2xl font-bold text-sky-600">{row.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Don't Fall for Excuses */}
      <section className="py-16 md:py-20 border-b border-forest-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-display mb-4">
                Don&apos;t Fall for These Airline Excuses
              </h2>
              <p className="text-muted-foreground">
                Airlines often try to avoid paying. Here&apos;s the truth:
              </p>
            </div>

            <div className="space-y-4">
              {commonExcuses.map((item, i) => (
                <div key={i} className="p-6 rounded-xl border border-red-100 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <Icon icon={item.icon} size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-700 mb-2">{item.excuse}</p>
                      <div className="flex items-start gap-2">
                        <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-forest-700">{item.truth}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 md:py-20 bg-sky-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Icon icon={AirplaneTakeOff01Icon} size={24} className="text-sky-600" />
                <h2 className="text-3xl font-bold font-display">Your Rights Under UK261</h2>
              </div>
              <p className="text-muted-foreground">
                The UK261 regulation protects passengers on flights departing from UK airports
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {yourRights.map((right, i) => (
                <div key={i} className="p-6 rounded-xl border border-sky-200 bg-white">
                  <h3 className="font-semibold text-lg mb-2">{right.title}</h3>
                  <p className="text-muted-foreground">{right.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Rights */}
      <section className="py-16 md:py-20 border-b border-forest-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold font-display mb-8">While You Wait at the Airport</h2>

            <div className="bg-forest-50 rounded-xl p-6 border border-forest-200">
              <p className="font-medium mb-4">Airlines must provide (free of charge):</p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { time: "2+ hours delay", items: "Meals and refreshments" },
                  { time: "3+ hours delay", items: "Phone calls, emails, fax" },
                  { time: "Overnight delay", items: "Hotel + transport" },
                  { time: "Any delay", items: "Assistance for reduced mobility" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Icon icon={CheckmarkCircle01Icon} size={18} className="text-forest-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{item.time}</p>
                      <p className="text-sm text-muted-foreground">{item.items}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-2">
                <Icon icon={AlertCircleIcon} size={18} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">
                  <strong>Keep your receipts!</strong> If the airline doesn&apos;t provide food or hotel, you can claim
                  reasonable expenses back.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-sky-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            Your Summer Holiday Shouldn&apos;t Be Ruined
          </h2>
          <p className="text-sky-100 mb-8 max-w-lg mx-auto">
            Create a professional complaint letter in minutes and claim the compensation you&apos;re owed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-sky-600 hover:bg-sky-50" asChild>
              <Link href="/tools/flight-compensation">
                Check Compensation Amount
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-sky-600" asChild>
              <Link href="/new?context=flight-delay">
                Start My Claim
                <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
