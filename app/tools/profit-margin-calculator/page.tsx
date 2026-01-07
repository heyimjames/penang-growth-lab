"use client"

import { useState } from "react"
import Link from "next/link"
import { Percent, ExternalLink, Info, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfitMarginCalculatorPage() {
  const [revenue, setRevenue] = useState<string>("")
  const [cogs, setCogs] = useState<string>("")
  const [operatingExpenses, setOperatingExpenses] = useState<string>("")
  const [adSpend, setAdSpend] = useState<string>("")

  const revenueNum = parseFloat(revenue) || 0
  const cogsNum = parseFloat(cogs) || 0
  const operatingNum = parseFloat(operatingExpenses) || 0
  const adSpendNum = parseFloat(adSpend) || 0

  const grossProfit = revenueNum - cogsNum
  const grossMargin = revenueNum > 0 ? (grossProfit / revenueNum) * 100 : 0

  const netProfit = grossProfit - operatingNum - adSpendNum
  const netMargin = revenueNum > 0 ? (netProfit / revenueNum) * 100 : 0

  const contributionMargin = revenueNum > 0 ? ((revenueNum - cogsNum - adSpendNum) / revenueNum) * 100 : 0

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
            <span className="text-white">Profit Margin Calculator</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#cff128]/10">
                <Percent className="h-8 w-8 text-[#cff128]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Profit Margin Calculator</h1>
            </div>
            <p className="text-lg text-white/60">
              Calculate gross and net profit margins for your e-commerce business.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-6">Enter Your Numbers</h2>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="revenue" className="text-white/70">Total Revenue ($)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    placeholder="50000"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Total sales revenue</p>
                </div>

                <div>
                  <Label htmlFor="cogs" className="text-white/70">Cost of Goods Sold ($)</Label>
                  <Input
                    id="cogs"
                    type="number"
                    placeholder="20000"
                    value={cogs}
                    onChange={(e) => setCogs(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Product costs, manufacturing, shipping to you</p>
                </div>

                <div>
                  <Label htmlFor="operating" className="text-white/70">Operating Expenses ($)</Label>
                  <Input
                    id="operating"
                    type="number"
                    placeholder="8000"
                    value={operatingExpenses}
                    onChange={(e) => setOperatingExpenses(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Rent, salaries, software, fulfillment fees</p>
                </div>

                <div>
                  <Label htmlFor="adSpend" className="text-white/70">Advertising Spend ($)</Label>
                  <Input
                    id="adSpend"
                    type="number"
                    placeholder="10000"
                    value={adSpend}
                    onChange={(e) => setAdSpend(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Total paid advertising spend</p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20">
              <h2 className="text-lg font-semibold mb-6">Your Margins</h2>

              <div className="space-y-4">
                {/* Gross Margin */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Gross Profit Margin</span>
                    {grossMargin >= 50 ? (
                      <TrendingUp className="h-4 w-4 text-[#cff128]" />
                    ) : grossMargin >= 30 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="text-3xl font-bold text-[#cff128]">
                    {grossMargin.toFixed(1)}%
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    ${grossProfit.toLocaleString()} gross profit
                  </div>
                </div>

                {/* Net Margin */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Net Profit Margin</span>
                    {netMargin >= 20 ? (
                      <TrendingUp className="h-4 w-4 text-[#cff128]" />
                    ) : netMargin >= 10 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : netMargin >= 0 ? (
                      <TrendingDown className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div className={`text-3xl font-bold ${netMargin >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {netMargin.toFixed(1)}%
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    ${netProfit.toLocaleString()} net profit
                  </div>
                </div>

                {/* Contribution Margin */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-2">Contribution Margin (after COGS + Ads)</div>
                  <div className={`text-2xl font-bold ${contributionMargin >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {contributionMargin.toFixed(1)}%
                  </div>
                </div>

                {/* Breakdown */}
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="text-sm text-white/60 mb-3">Cost Breakdown</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">COGS</span>
                      <span className="text-white">{revenueNum > 0 ? ((cogsNum / revenueNum) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Operating</span>
                      <span className="text-white">{revenueNum > 0 ? ((operatingNum / revenueNum) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Ad Spend</span>
                      <span className="text-white">{revenueNum > 0 ? ((adSpendNum / revenueNum) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-medium">
                      <span className="text-white/70">Net Margin</span>
                      <span className={netMargin >= 0 ? "text-green-400" : "text-red-400"}>{netMargin.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Insight */}
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#cff128] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-white/60">
                      {netMargin < 0 && "You're operating at a loss. Review your costs and pricing strategy."}
                      {netMargin >= 0 && netMargin < 10 && "Tight margins. Focus on reducing costs or increasing AOV."}
                      {netMargin >= 10 && netMargin < 20 && "Healthy margins for e-commerce. Room to invest in growth."}
                      {netMargin >= 20 && "Excellent margins. You have strong pricing power and efficient operations."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benchmarks */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">E-commerce Margin Benchmarks</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-white/50 font-medium">Metric</th>
                    <th className="text-left py-2 text-white/50 font-medium">Poor</th>
                    <th className="text-left py-2 text-white/50 font-medium">Average</th>
                    <th className="text-left py-2 text-white/50 font-medium">Good</th>
                    <th className="text-left py-2 text-white/50 font-medium">Excellent</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-medium text-white">Gross Margin</td>
                    <td className="py-2 text-red-400">&lt;30%</td>
                    <td className="py-2 text-yellow-400">30-40%</td>
                    <td className="py-2 text-green-400">40-60%</td>
                    <td className="py-2 text-[#cff128]">&gt;60%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-medium text-white">Net Margin</td>
                    <td className="py-2 text-red-400">&lt;5%</td>
                    <td className="py-2 text-yellow-400">5-10%</td>
                    <td className="py-2 text-green-400">10-20%</td>
                    <td className="py-2 text-[#cff128]">&gt;20%</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-white">Ad Spend % of Revenue</td>
                    <td className="py-2 text-red-400">&gt;30%</td>
                    <td className="py-2 text-yellow-400">20-30%</td>
                    <td className="py-2 text-green-400">15-20%</td>
                    <td className="py-2 text-[#cff128]">&lt;15%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Related tools */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/tools/break-even-roas" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Break-Even ROAS Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Find your minimum profitable ROAS</p>
              </Link>
              <Link href="/tools/contribution-margin" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Contribution Margin Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Calculate per-unit profitability</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Want to Improve Your Margins?</h2>
            <p className="text-black/70 mb-6">Our team helps DTC brands optimize ad spend while maintaining healthy margins.</p>
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
