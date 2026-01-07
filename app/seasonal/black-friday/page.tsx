import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  ShoppingBag01Icon,
  AlertCircleIcon,
  MoneyBag01Icon,
  Clock01Icon,
  Cancel01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

export const metadata: Metadata = {
  title: "Black Friday Rights 2025 | Sale Item Returns & Complaints | NoReply",
  description:
    "Black Friday purchase gone wrong? Know your rights on sale items, fake discounts, and non-delivery. Create a complaint in minutes.",
  openGraph: {
    title: "Black Friday Consumer Rights 2025 | NoReply",
    description:
      "Sale items have the SAME rights as full-price items. Don't let retailers tell you otherwise.",
  },
}

const commonProblems = [
  {
    icon: Cancel01Icon,
    title: "Order Cancelled After Purchase",
    description: "Retailer cancelled your bargain deal claiming 'pricing error'",
    solution: "Retailers can't cancel confirmed orders without good reason. You may be entitled to compensation.",
  },
  {
    icon: Clock01Icon,
    title: "Item Never Arrived",
    description: "Paid but still waiting weeks later with no tracking",
    solution: "Full refund due if not delivered within 30 days (or agreed date). No excuses.",
  },
  {
    icon: MoneyBag01Icon,
    title: "Fake 'Was' Prices",
    description: "The 'discount' was from an inflated price never actually charged",
    solution: "This is illegal under Consumer Protection from Unfair Trading Regulations.",
  },
  {
    icon: AlertCircleIcon,
    title: "Item Faulty/Different",
    description: "What arrived isn't what was advertised or doesn't work",
    solution: "Full refund within 30 days. Same rights as full-price items.",
  },
]

const keyRights = [
  {
    myth: "Sale items can't be returned",
    fact: "FALSE - Faulty sale items have identical rights to full-price items",
  },
  {
    myth: "No refunds, only exchanges",
    fact: "FALSE - If faulty, you're entitled to a full refund",
  },
  {
    myth: "You only have 14 days",
    fact: "PARTLY TRUE - 14 days for change of mind (online), but 30 days for faulty goods",
  },
  {
    myth: "They can cancel orders for 'pricing errors'",
    fact: "DEBATABLE - Once confirmed, cancellation requires genuine error AND reasonable action",
  },
]

export default function BlackFridayPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-forest-100 bg-gradient-to-b from-charcoal via-charcoal/95 to-background text-white">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-peach-500 text-white hover:bg-peach-500">
              🏷️ Black Friday 2025
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display mb-6">
              Black Friday<br />
              <span className="text-peach-400">Gone Wrong?</span>
            </h1>

            <p className="text-xl text-stone-300 mb-8 max-w-2xl mx-auto">
              Don&apos;t let retailers get away with cancelled orders, fake discounts, or non-delivery.
              Your rights don&apos;t disappear just because it was on sale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="coral" asChild className="px-8">
                <Link href="/new?context=black-friday">
                  Start My Complaint
                  <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="#your-rights">
                  Know Your Rights
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Common Problems */}
      <section className="py-16 md:py-20 border-b border-forest-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-display mb-4">
                Common Black Friday Problems
              </h2>
              <p className="text-muted-foreground">
                These are the issues we see every Black Friday season
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {commonProblems.map((problem, i) => (
                <div key={i} className="p-6 rounded-xl border border-charcoal/10 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-charcoal/10 flex items-center justify-center shrink-0">
                      <Icon icon={problem.icon} size={20} className="text-charcoal" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{problem.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{problem.description}</p>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-forest-50">
                        <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-forest-700">{problem.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Myth Busting */}
      <section id="your-rights" className="py-16 md:py-20 bg-charcoal text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-display mb-4">
                Myth vs Fact: Your Sale Rights
              </h2>
              <p className="text-stone-400">
                Don&apos;t believe everything retailers tell you about sale items
              </p>
            </div>

            <div className="space-y-4">
              {keyRights.map((item, i) => (
                <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <Badge variant="outline" className="border-red-500/50 text-red-400">MYTH</Badge>
                    </div>
                    <div>
                      <p className="text-stone-300 line-through mb-2">&quot;{item.myth}&quot;</p>
                      <div className="flex items-start gap-2">
                        <Badge className="bg-forest-500 text-white shrink-0">FACT</Badge>
                        <p className="text-white font-medium">{item.fact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-20 border-b border-forest-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold font-display mb-8 text-center">
              Key Deadlines to Know
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-forest-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-peach-100 flex items-center justify-center font-bold text-peach-600">
                    14
                  </div>
                  <div>
                    <p className="font-medium">Days for Change of Mind</p>
                    <p className="text-sm text-muted-foreground">Online purchases only</p>
                  </div>
                </div>
                <Badge variant="outline">Consumer Contracts Regs</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-forest-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-forest-100 flex items-center justify-center font-bold text-forest-600">
                    30
                  </div>
                  <div>
                    <p className="font-medium">Days for Full Refund (Faulty)</p>
                    <p className="text-sm text-muted-foreground">Right to reject faulty goods</p>
                  </div>
                </div>
                <Badge className="bg-forest-100 text-forest-700">Consumer Rights Act</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-forest-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-lavender-100 flex items-center justify-center font-bold text-lavender-600">
                    6
                  </div>
                  <div>
                    <p className="font-medium">Months for Repair/Replace</p>
                    <p className="text-sm text-muted-foreground">Fault presumed to exist at purchase</p>
                  </div>
                </div>
                <Badge variant="outline">Consumer Rights Act</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-peach-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            A Deal Isn&apos;t a Deal If You Get Scammed
          </h2>
          <p className="text-peach-100 mb-8 max-w-lg mx-auto">
            Create a professional complaint letter in minutes. Get the refund or delivery you paid for.
          </p>
          <Button size="lg" className="bg-white text-peach-600 hover:bg-peach-50" asChild>
            <Link href="/new?context=black-friday">
              <Icon icon={ShoppingBag01Icon} size={16} className="mr-2" />
              Start My Black Friday Complaint
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
