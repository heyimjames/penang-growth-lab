import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Calendar01Icon,
  MoneyBag01Icon,
  GiftIcon,
  Clock01Icon,
  JusticeScale01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

export const metadata: Metadata = {
  title: "Christmas Return Rights 2025 | Holiday Refund Guide | NoReply",
  description:
    "Struggling with Christmas returns? Know your rights for holiday gifts and purchases. Get a full refund even after the return window with our free guide.",
  openGraph: {
    title: "Christmas Returns & Refund Rights 2025 | NoReply",
    description:
      "Got a dud gift? Retailer refusing your return? Know your rights this holiday season.",
  },
}

const stats = [
  { label: "Extended return policies", value: "Most retailers" },
  { label: "Avg refund secured", value: "£127" },
  { label: "Success rate", value: "89%" },
]

const commonIssues = [
  {
    icon: GiftIcon,
    title: "Unwanted Gift Returns",
    description: "Many retailers extend return windows to January 31st for Christmas purchases",
    tip: "Check the gift receipt - you usually have extended rights",
  },
  {
    icon: Clock01Icon,
    title: "Missed Return Deadline",
    description: "Standard 30-day consumer rights apply even after store policy expires",
    tip: "Faulty items have longer protection under Consumer Rights Act",
  },
  {
    icon: MoneyBag01Icon,
    title: "Gift Card Refusal",
    description: "Retailers often try to force store credit instead of cash refunds",
    tip: "If item is faulty, you're entitled to cash refund regardless",
  },
]

const yourRights = [
  {
    title: "30-Day Right to Reject",
    description: "Full refund for any faulty item within 30 days of purchase",
    law: "Consumer Rights Act 2015, Section 22",
  },
  {
    title: "6-Month Repair/Replace",
    description: "If fault appears within 6 months, it's presumed to have existed at purchase",
    law: "Consumer Rights Act 2015, Section 19",
  },
  {
    title: "Online Cooling-Off",
    description: "14 days to return online purchases, no questions asked",
    law: "Consumer Contracts Regulations 2013",
  },
  {
    title: "Gift Receipt Rights",
    description: "Gift recipients have the same rights as original purchaser",
    law: "Consumer Rights Act 2015",
  },
]

export default function ChristmasReturnsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-forest-100 bg-gradient-to-b from-red-50/50 via-background to-background">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">
              🎄 Holiday Season 2025
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display mb-6">
              Christmas Returns<br />
              <span className="text-red-500">Made Easy</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Got a dud gift? Retailer refusing your return? You have more rights than you think.
              Create a professional complaint letter in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="coral" asChild className="px-8">
                <Link href="/new?context=christmas-return">
                  Start My Return Complaint
                  <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#your-rights">
                  Know Your Rights
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-forest-600">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-16 md:py-20 border-b border-forest-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-display mb-4">
                Common Holiday Return Problems
              </h2>
              <p className="text-muted-foreground">
                These are the issues we see most during the holiday season
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {commonIssues.map((issue, i) => (
                <div key={i} className="p-6 rounded-xl border border-red-100 bg-white">
                  <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <Icon icon={issue.icon} size={24} className="text-red-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{issue.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-forest-50">
                    <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-forest-700">{issue.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section id="your-rights" className="py-16 md:py-20 bg-forest-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Icon icon={JusticeScale01Icon} size={24} className="text-forest-600" />
                <h2 className="text-3xl font-bold font-display">Your Rights This Christmas</h2>
              </div>
              <p className="text-muted-foreground">
                UK consumer law protects you - even during the holidays
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {yourRights.map((right, i) => (
                <div key={i} className="p-6 rounded-xl border border-forest-200 bg-white">
                  <h3 className="font-semibold text-lg mb-2">{right.title}</h3>
                  <p className="text-muted-foreground mb-3">{right.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {right.law}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Dates */}
      <section className="py-16 md:py-20 border-b border-forest-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Icon icon={Calendar01Icon} size={24} className="text-peach-500" />
              <h2 className="text-2xl font-bold font-display">Key Return Dates</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-forest-100">
                <div>
                  <p className="font-medium">Standard Online Returns</p>
                  <p className="text-sm text-muted-foreground">14 days from delivery</p>
                </div>
                <Badge>Consumer Contracts Regs</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-forest-100">
                <div>
                  <p className="font-medium">Faulty Goods (Full Refund)</p>
                  <p className="text-sm text-muted-foreground">30 days from purchase</p>
                </div>
                <Badge className="bg-forest-100 text-forest-700">Consumer Rights Act</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-forest-100">
                <div>
                  <p className="font-medium">Extended Holiday Returns</p>
                  <p className="text-sm text-muted-foreground">Usually until January 31st</p>
                </div>
                <Badge variant="outline">Store Policy</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-red-100 bg-red-50">
                <div>
                  <p className="font-medium">Boxing Day Sales Returns</p>
                  <p className="text-sm text-muted-foreground">Same rights as full price items</p>
                </div>
                <Badge className="bg-red-100 text-red-700">Important!</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-red-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            Don&apos;t Let Retailers Ruin Your Christmas
          </h2>
          <p className="text-red-100 mb-8 max-w-lg mx-auto">
            Create a professional, legally-backed complaint letter in minutes and get the refund you deserve.
          </p>
          <Button size="lg" className="bg-white text-red-600 hover:bg-red-50" asChild>
            <Link href="/new?context=christmas-return">
              Start My Return Complaint
              <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
