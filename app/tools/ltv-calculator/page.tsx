"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, ExternalLink, Info, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LTVCalculatorPage() {
  const [aov, setAov] = useState<string>("")
  const [purchaseFrequency, setPurchaseFrequency] = useState<string>("")
  const [customerLifespan, setCustomerLifespan] = useState<string>("")
  const [profitMargin, setProfitMargin] = useState<string>("")

  const aovNum = parseFloat(aov) || 0
  const frequencyNum = parseFloat(purchaseFrequency) || 0
  const lifespanNum = parseFloat(customerLifespan) || 0
  const marginNum = (parseFloat(profitMargin) || 0) / 100

  const ltv = aovNum * frequencyNum * lifespanNum
  const ltvProfit = ltv * marginNum
  const annualValue = aovNum * frequencyNum

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
              <Link href="/tools" className="text-sm text-white transition-colors">Tools</Link>
              <Link href="/guides" className="text-sm text-white/70 hover:text-white transition-colors">Guides</Link>
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
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-white">Customer LTV Calculator</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#cff128]/10">
                <Users className="h-8 w-8 text-[#cff128]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Customer LTV Calculator</h1>
            </div>
            <p className="text-lg text-white/60">
              Calculate Customer Lifetime Value to understand how much you can spend to acquire customers.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-6">Enter Your Metrics</h2>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="aov" className="text-white/70">Average Order Value ($)</Label>
                  <Input
                    id="aov"
                    type="number"
                    placeholder="75"
                    value={aov}
                    onChange={(e) => setAov(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Average revenue per order</p>
                </div>

                <div>
                  <Label htmlFor="frequency" className="text-white/70">Purchase Frequency (per year)</Label>
                  <Input
                    id="frequency"
                    type="number"
                    placeholder="2.5"
                    value={purchaseFrequency}
                    onChange={(e) => setPurchaseFrequency(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">How many times a customer buys per year</p>
                </div>

                <div>
                  <Label htmlFor="lifespan" className="text-white/70">Customer Lifespan (years)</Label>
                  <Input
                    id="lifespan"
                    type="number"
                    placeholder="3"
                    value={customerLifespan}
                    onChange={(e) => setCustomerLifespan(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">How long a customer stays active</p>
                </div>

                <div>
                  <Label htmlFor="margin" className="text-white/70">Gross Profit Margin (%)</Label>
                  <Input
                    id="margin"
                    type="number"
                    placeholder="40"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Your gross margin percentage</p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20">
              <h2 className="text-lg font-semibold mb-6">Customer Value</h2>

              <div className="space-y-4">
                {/* LTV Revenue */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Customer Lifetime Value (Revenue)</span>
                    <TrendingUp className="h-4 w-4 text-[#cff128]" />
                  </div>
                  <div className="text-4xl font-bold text-[#cff128]">
                    ${ltv.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    Total revenue per customer
                  </div>
                </div>

                {/* LTV Profit */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-2">Customer Lifetime Value (Profit)</div>
                  <div className="text-3xl font-bold text-green-400">
                    ${ltvProfit.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    Gross profit per customer
                  </div>
                </div>

                {/* Annual Value */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-2">Annual Customer Value</div>
                  <div className="text-2xl font-bold text-white">
                    ${annualValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    Revenue per customer per year
                  </div>
                </div>

                {/* Max CAC recommendation */}
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#cff128] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-white/60">
                      <p className="font-medium text-white mb-1">Maximum CAC Recommendation</p>
                      {ltvProfit > 0 ? (
                        <>
                          <p>Conservative (3:1 LTV:CAC): <span className="text-[#cff128] font-medium">${(ltvProfit / 3).toFixed(0)}</span></p>
                          <p>Moderate (2:1 LTV:CAC): <span className="text-green-400 font-medium">${(ltvProfit / 2).toFixed(0)}</span></p>
                          <p>Aggressive (1.5:1 LTV:CAC): <span className="text-yellow-400 font-medium">${(ltvProfit / 1.5).toFixed(0)}</span></p>
                        </>
                      ) : (
                        <p>Enter your metrics to see CAC recommendations</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formula explanation */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">How LTV is Calculated</h2>
            <div className="p-4 rounded-xl bg-black/30 font-mono text-center text-lg mb-4">
              LTV = AOV × Purchase Frequency × Customer Lifespan
            </div>
            <p className="text-white/60 text-sm">
              <strong className="text-white">Example:</strong> If your average order is $75, customers buy 2.5 times per year,
              and stay active for 3 years, your LTV is $75 × 2.5 × 3 = $562.50. With a 40% margin, your LTV profit is $225.
            </p>
          </div>

          {/* Why LTV Matters */}
          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Why LTV Matters for Paid Ads</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">CAC Budgeting</h3>
                <p className="text-white/60">
                  Knowing your LTV lets you calculate the maximum you can spend to acquire a customer profitably.
                  A 3:1 LTV:CAC ratio is considered healthy for sustainable growth.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">Channel Evaluation</h3>
                <p className="text-white/60">
                  Compare LTV by acquisition channel to identify which sources bring your most valuable customers,
                  not just the cheapest ones.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">Scale Decisions</h3>
                <p className="text-white/60">
                  Higher LTV means you can afford higher CPAs, giving you access to more inventory and
                  the ability to outbid competitors.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">Retention Focus</h3>
                <p className="text-white/60">
                  Small improvements in purchase frequency or lifespan can dramatically increase LTV,
                  often more efficiently than acquiring new customers.
                </p>
              </div>
            </div>
          </div>

          {/* LTV Benchmarks */}
          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">E-commerce LTV Benchmarks</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-white/50 font-medium">Category</th>
                    <th className="text-left py-2 text-white/50 font-medium">Avg LTV</th>
                    <th className="text-left py-2 text-white/50 font-medium">Avg Purchase Frequency</th>
                    <th className="text-left py-2 text-white/50 font-medium">Avg Lifespan</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="py-2">Fashion & Apparel</td>
                    <td className="py-2">$150-$400</td>
                    <td className="py-2">2-4x/year</td>
                    <td className="py-2">2-3 years</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">Beauty & Skincare</td>
                    <td className="py-2">$200-$600</td>
                    <td className="py-2">4-8x/year</td>
                    <td className="py-2">2-4 years</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">Supplements & Health</td>
                    <td className="py-2">$300-$800</td>
                    <td className="py-2">6-12x/year</td>
                    <td className="py-2">1-3 years</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">Home & Kitchen</td>
                    <td className="py-2">$100-$300</td>
                    <td className="py-2">1-2x/year</td>
                    <td className="py-2">3-5 years</td>
                  </tr>
                  <tr>
                    <td className="py-2">Food & Beverage (DTC)</td>
                    <td className="py-2">$400-$1,200</td>
                    <td className="py-2">12-24x/year</td>
                    <td className="py-2">1-2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Related tools */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/tools/cac-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">CAC Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Calculate customer acquisition cost</p>
              </Link>
              <Link href="/tools/break-even-roas" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Break-Even ROAS Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Find your minimum profitable ROAS</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Want to Increase Your Customer LTV?</h2>
            <p className="text-black/70 mb-6">Our team helps DTC brands build retention strategies that maximize lifetime value.</p>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button className="bg-black text-white hover:bg-black/90 font-semibold">
                Get in Touch <ExternalLink className="ml-2 h-4 w-4" />
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
