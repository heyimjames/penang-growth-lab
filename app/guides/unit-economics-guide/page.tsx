"use client"

import Link from "next/link"
import { ArrowLeft, Clock, DollarSign, CheckCircle, Calculator, TrendingUp, Target } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnitEconomicsGuide() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">PENANG</span>
              <span className="text-xl font-bold text-[#cff128]">GROWTH LAB</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/tools" className="text-sm text-white/70 hover:text-white transition-colors">Tools</Link>
              <Link href="/guides" className="text-sm text-white transition-colors">Guides</Link>
              <Link href="/blog" className="text-sm text-white/70 hover:text-white transition-colors">Blog</Link>
            </div>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button className="bg-[#cff128] text-black hover:bg-[#e5f875] font-semibold">Work With Us</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Guides
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-medium bg-[#cff128]/10 text-[#cff128] rounded-full">
                Fundamentals
              </span>
              <span className="text-sm text-white/40 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                22 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Understanding E-commerce Unit Economics
            </h1>
            <p className="text-xl text-white/60">
              Master the metrics that matter: CAC, LTV, contribution margin, and how they affect your advertising strategy.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-12">
            <h2 className="font-semibold mb-4">In This Guide</h2>
            <ul className="space-y-2 text-white/60">
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">1.</span> What Are Unit Economics?
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">2.</span> Contribution Margin Explained
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">3.</span> Customer Acquisition Cost (CAC)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">4.</span> Lifetime Value (LTV)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">5.</span> The LTV:CAC Ratio
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">6.</span> How This Affects Your Ad Strategy
              </li>
            </ul>
          </div>

          {/* Content */}
          <article className="prose prose-invert max-w-none">
            {/* Section 1 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <Calculator className="h-5 w-5 text-[#cff128]" />
                </span>
                What Are Unit Economics?
              </h2>
              <p className="text-white/70 mb-4">
                Unit economics is the revenue and costs associated with a single "unit" of your business - typically
                one customer or one order. Understanding these numbers is essential for making profitable advertising decisions.
              </p>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 my-6">
                <p className="text-white/70 text-sm mb-4">
                  <strong className="text-white">The core question:</strong> How much money do you make (or lose) every
                  time you acquire a new customer?
                </p>
                <p className="text-white/50 text-sm">
                  If you don't know this number with confidence, you're essentially flying blind with your advertising.
                  You might be scaling a money-losing acquisition machine.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <DollarSign className="h-5 w-5 text-[#cff128]" />
                </span>
                Contribution Margin Explained
              </h2>
              <p className="text-white/70 mb-4">
                Contribution margin is what's left after subtracting all variable costs from your revenue. This is the
                money available to cover fixed costs and generate profit.
              </p>
              <div className="p-6 rounded-xl bg-[#cff128]/10 border border-[#cff128]/20 my-6">
                <h4 className="font-semibold text-[#cff128] mb-4">Contribution Margin Formula</h4>
                <div className="font-mono text-center text-lg mb-4">
                  CM = Revenue - COGS - Shipping - Payment Fees - Packaging
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/60">Revenue (AOV)</span>
                    <span className="text-white">$80.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/60">- Product Cost (COGS)</span>
                    <span className="text-red-400">-$24.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/60">- Shipping</span>
                    <span className="text-red-400">-$8.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/60">- Payment Processing (3%)</span>
                    <span className="text-red-400">-$2.40</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/60">- Packaging</span>
                    <span className="text-red-400">-$1.60</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold">
                    <span className="text-[#cff128]">= Contribution Margin</span>
                    <span className="text-[#cff128]">$44.00 (55%)</span>
                  </div>
                </div>
              </div>
              <p className="text-white/70">
                In this example, for every $80 order, you have $44 to spend on marketing and still break even.
                This is your <strong className="text-white">maximum allowable CAC</strong> for break-even on first order.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <Target className="h-5 w-5 text-[#cff128]" />
                </span>
                Customer Acquisition Cost (CAC)
              </h2>
              <p className="text-white/70 mb-4">
                CAC is the total cost to acquire one new customer, including all marketing expenses.
              </p>
              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-3">Blended CAC</h4>
                  <p className="text-sm text-white/60 mb-3">
                    Total marketing spend ÷ Total new customers
                  </p>
                  <p className="text-xs text-white/40">
                    Includes all channels (paid, organic, referral). Best for overall business health.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-3">Paid CAC</h4>
                  <p className="text-sm text-white/60 mb-3">
                    Paid ad spend ÷ Customers from paid ads
                  </p>
                  <p className="text-xs text-white/40">
                    Channel-specific. Best for optimizing individual channels.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-white/70">
                  <strong className="text-yellow-400">Important:</strong> Your CAC should always be lower than your
                  contribution margin if you want to be profitable on first order. If CAC {">"} CM, you're relying
                  on repeat purchases for profitability.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <TrendingUp className="h-5 w-5 text-[#cff128]" />
                </span>
                Lifetime Value (LTV)
              </h2>
              <p className="text-white/70 mb-4">
                LTV is the total revenue (or profit) you expect to earn from a customer over their entire relationship with your brand.
              </p>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 my-6">
                <h4 className="font-semibold mb-4">Simple LTV Calculation</h4>
                <div className="font-mono text-center text-lg mb-4">
                  LTV = AOV × Purchase Frequency × Customer Lifespan
                </div>
                <div className="text-sm text-white/60 space-y-2">
                  <p><strong className="text-white">AOV:</strong> Average Order Value ($80)</p>
                  <p><strong className="text-white">Purchase Frequency:</strong> Orders per year (2.5)</p>
                  <p><strong className="text-white">Customer Lifespan:</strong> Years as customer (2 years)</p>
                  <p className="pt-3 border-t border-white/10 text-[#cff128] font-semibold">
                    LTV = $80 × 2.5 × 2 = $400
                  </p>
                </div>
              </div>
              <p className="text-white/70 mb-4">
                For a more accurate view, calculate <strong className="text-white">LTV based on contribution margin</strong>, not revenue:
              </p>
              <div className="font-mono text-center p-4 rounded-xl bg-black/30">
                Profit LTV = $44 (CM) × 2.5 × 2 = $220
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">The LTV:CAC Ratio</h2>
              <p className="text-white/70 mb-4">
                The LTV:CAC ratio tells you how profitable your customer acquisition is over time.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm my-6">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-white/50 font-medium">LTV:CAC Ratio</th>
                      <th className="text-left py-3 text-white/50 font-medium">What It Means</th>
                      <th className="text-left py-3 text-white/50 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    <tr className="border-b border-white/5">
                      <td className="py-3 text-red-400">{"<"}1:1</td>
                      <td className="py-3">Losing money on each customer</td>
                      <td className="py-3">Fix immediately - reduce CAC or increase LTV</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 text-yellow-400">1:1 - 2:1</td>
                      <td className="py-3">Breaking even or thin margins</td>
                      <td className="py-3">Optimize - not sustainable long-term</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 text-green-400">3:1</td>
                      <td className="py-3">Healthy - industry benchmark</td>
                      <td className="py-3">Good position - scale carefully</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 text-[#cff128]">4:1+</td>
                      <td className="py-3">Excellent - strong unit economics</td>
                      <td className="py-3">Scale aggressively</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-blue-400">5:1+</td>
                      <td className="py-3">May be under-investing in growth</td>
                      <td className="py-3">Consider increasing ad spend</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">How This Affects Your Ad Strategy</h2>
              <p className="text-white/70 mb-4">
                Your unit economics determine how aggressively you can advertise:
              </p>
              <div className="grid gap-4 my-6">
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">High Margins ({">"} 60%)</h4>
                  <p className="text-sm text-white/60">
                    You can be aggressive with acquisition. Even at 2x ROAS, you're likely profitable.
                    Focus on volume and market share.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">Medium Margins (40-60%)</h4>
                  <p className="text-sm text-white/60">
                    Need 2.5-3x ROAS for profitability. Focus on efficiency and creative testing.
                    Balance growth with profitability.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">Low Margins ({"<"} 40%)</h4>
                  <p className="text-sm text-white/60">
                    Need 3-4x+ ROAS. Must focus on LTV - email, subscriptions, bundles.
                    Hard to scale profitably on paid alone.
                  </p>
                </div>
              </div>
            </section>

            {/* Key Takeaways */}
            <section className="p-6 rounded-2xl bg-[#cff128]/10 border border-[#cff128]/20 mb-12">
              <h3 className="font-bold text-lg mb-4">Key Takeaways</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Know your contribution margin - this is your maximum break-even CAC</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Calculate LTV based on profit, not revenue, for accurate planning</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Aim for at least 3:1 LTV:CAC ratio for sustainable growth</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Your margins determine how aggressive you can be with ads</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Low-margin businesses must focus on increasing LTV through retention</span>
                </li>
              </ul>
            </section>

            {/* Related Tools */}
            <section className="mb-12">
              <h3 className="font-bold text-lg mb-4">Calculate Your Unit Economics</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/tools/ltv-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                  <h4 className="font-medium group-hover:text-[#cff128] transition-colors">LTV Calculator</h4>
                  <p className="text-sm text-white/50 mt-1">Calculate customer lifetime value</p>
                </Link>
                <Link href="/tools/cac-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                  <h4 className="font-medium group-hover:text-[#cff128] transition-colors">CAC Calculator</h4>
                  <p className="text-sm text-white/50 mt-1">Calculate acquisition cost</p>
                </Link>
                <Link href="/tools/contribution-margin" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                  <h4 className="font-medium group-hover:text-[#cff128] transition-colors">Contribution Margin Calculator</h4>
                  <p className="text-sm text-white/50 mt-1">Calculate your margins</p>
                </Link>
                <Link href="/tools/break-even-roas" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                  <h4 className="font-medium group-hover:text-[#cff128] transition-colors">Break-Even ROAS Calculator</h4>
                  <p className="text-sm text-white/50 mt-1">Find your minimum profitable ROAS</p>
                </Link>
              </div>
            </section>
          </article>

          {/* CTA */}
          <div className="p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Need Help With Your Numbers?</h2>
            <p className="text-black/70 mb-6">
              We help DTC brands optimize their unit economics and build profitable ad strategies.
            </p>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button className="bg-black text-white hover:bg-black/90 font-semibold">
                Book a Strategy Call
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold">PENANG</span>
              <span className="font-bold text-[#cff128]">GROWTH LAB</span>
            </Link>
            <p className="text-sm text-white/40">© {new Date().getFullYear()} Penang Media</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
