"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, ExternalLink, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CPMCPCCalculatorPage() {
  const [adSpend, setAdSpend] = useState<string>("")
  const [impressions, setImpressions] = useState<string>("")
  const [clicks, setClicks] = useState<string>("")
  const [conversions, setConversions] = useState<string>("")

  const spendNum = parseFloat(adSpend) || 0
  const impressionsNum = parseInt(impressions) || 0
  const clicksNum = parseInt(clicks) || 0
  const conversionsNum = parseInt(conversions) || 0

  const cpm = impressionsNum > 0 ? (spendNum / impressionsNum) * 1000 : 0
  const cpc = clicksNum > 0 ? spendNum / clicksNum : 0
  const ctr = impressionsNum > 0 ? (clicksNum / impressionsNum) * 100 : 0
  const conversionRate = clicksNum > 0 ? (conversionsNum / clicksNum) * 100 : 0
  const cpa = conversionsNum > 0 ? spendNum / conversionsNum : 0

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
            <span className="text-white">CPM/CPC/CTR Calculator</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#cff128]/10">
                <BarChart3 className="h-8 w-8 text-[#cff128]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">CPM/CPC/CTR Calculator</h1>
            </div>
            <p className="text-lg text-white/60">
              Calculate all your key advertising metrics from campaign data.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-6">Enter Campaign Data</h2>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="spend" className="text-white/70">Ad Spend ($)</Label>
                  <Input
                    id="spend"
                    type="number"
                    placeholder="5000"
                    value={adSpend}
                    onChange={(e) => setAdSpend(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                </div>

                <div>
                  <Label htmlFor="impressions" className="text-white/70">Impressions</Label>
                  <Input
                    id="impressions"
                    type="number"
                    placeholder="500000"
                    value={impressions}
                    onChange={(e) => setImpressions(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                </div>

                <div>
                  <Label htmlFor="clicks" className="text-white/70">Clicks</Label>
                  <Input
                    id="clicks"
                    type="number"
                    placeholder="7500"
                    value={clicks}
                    onChange={(e) => setClicks(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                </div>

                <div>
                  <Label htmlFor="conversions" className="text-white/70">Conversions (optional)</Label>
                  <Input
                    id="conversions"
                    type="number"
                    placeholder="150"
                    value={conversions}
                    onChange={(e) => setConversions(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20">
              <h2 className="text-lg font-semibold mb-6">Your Metrics</h2>

              <div className="grid grid-cols-2 gap-4">
                {/* CPM */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-1">CPM</div>
                  <div className="text-2xl font-bold text-[#cff128]">
                    ${cpm.toFixed(2)}
                  </div>
                  <div className="text-xs text-white/40 mt-1">Cost per 1,000 impressions</div>
                </div>

                {/* CPC */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-1">CPC</div>
                  <div className="text-2xl font-bold text-[#cff128]">
                    ${cpc.toFixed(2)}
                  </div>
                  <div className="text-xs text-white/40 mt-1">Cost per click</div>
                </div>

                {/* CTR */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-1">CTR</div>
                  <div className={`text-2xl font-bold ${ctr >= 1.5 ? "text-green-400" : ctr >= 0.8 ? "text-yellow-400" : "text-red-400"}`}>
                    {ctr.toFixed(2)}%
                  </div>
                  <div className="text-xs text-white/40 mt-1">Click-through rate</div>
                </div>

                {/* Conversion Rate */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-1">CVR</div>
                  <div className={`text-2xl font-bold ${conversionRate >= 3 ? "text-green-400" : conversionRate >= 1.5 ? "text-yellow-400" : conversionsNum > 0 ? "text-red-400" : "text-white/30"}`}>
                    {conversionsNum > 0 ? `${conversionRate.toFixed(2)}%` : "—"}
                  </div>
                  <div className="text-xs text-white/40 mt-1">Conversion rate</div>
                </div>

                {/* CPA */}
                <div className="col-span-2 p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-1">CPA (Cost Per Acquisition)</div>
                  <div className="text-3xl font-bold text-green-400">
                    {conversionsNum > 0 ? `$${cpa.toFixed(2)}` : "—"}
                  </div>
                  <div className="text-xs text-white/40 mt-1">Cost per conversion</div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="mt-4 p-4 rounded-xl bg-black/20 border border-white/5">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-[#cff128] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-white/60">
                    {ctr === 0 && "Enter your data to see performance insights."}
                    {ctr > 0 && ctr < 0.8 && "Low CTR. Your creative or targeting may need improvement."}
                    {ctr >= 0.8 && ctr < 1.5 && "Average CTR. Test new creatives and audiences to improve."}
                    {ctr >= 1.5 && ctr < 3 && "Good CTR. Your ads are resonating with your audience."}
                    {ctr >= 3 && "Excellent CTR. Consider scaling this campaign."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulas */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">How These Metrics Are Calculated</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/30">
                <div className="font-mono text-sm text-white/80 mb-2">CPM = (Spend ÷ Impressions) × 1000</div>
                <p className="text-xs text-white/50">Cost per 1,000 impressions. Lower is generally better.</p>
              </div>
              <div className="p-4 rounded-xl bg-black/30">
                <div className="font-mono text-sm text-white/80 mb-2">CPC = Spend ÷ Clicks</div>
                <p className="text-xs text-white/50">Cost per click. Varies widely by industry and platform.</p>
              </div>
              <div className="p-4 rounded-xl bg-black/30">
                <div className="font-mono text-sm text-white/80 mb-2">CTR = (Clicks ÷ Impressions) × 100</div>
                <p className="text-xs text-white/50">Click-through rate. Higher indicates better ad relevance.</p>
              </div>
              <div className="p-4 rounded-xl bg-black/30">
                <div className="font-mono text-sm text-white/80 mb-2">CVR = (Conversions ÷ Clicks) × 100</div>
                <p className="text-xs text-white/50">Conversion rate. Measures landing page effectiveness.</p>
              </div>
            </div>
          </div>

          {/* Benchmarks */}
          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Industry Benchmarks (Meta Ads)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-white/50 font-medium">Industry</th>
                    <th className="text-left py-2 text-white/50 font-medium">Avg CPM</th>
                    <th className="text-left py-2 text-white/50 font-medium">Avg CPC</th>
                    <th className="text-left py-2 text-white/50 font-medium">Avg CTR</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="py-2">Fashion & Apparel</td>
                    <td className="py-2">$8-15</td>
                    <td className="py-2">$0.50-1.50</td>
                    <td className="py-2">1.0-2.0%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">Beauty & Skincare</td>
                    <td className="py-2">$10-20</td>
                    <td className="py-2">$0.80-2.00</td>
                    <td className="py-2">1.2-2.5%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">Health & Wellness</td>
                    <td className="py-2">$12-25</td>
                    <td className="py-2">$1.00-3.00</td>
                    <td className="py-2">0.8-1.8%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">Home & Garden</td>
                    <td className="py-2">$7-15</td>
                    <td className="py-2">$0.60-1.50</td>
                    <td className="py-2">1.0-2.2%</td>
                  </tr>
                  <tr>
                    <td className="py-2">Food & Beverage</td>
                    <td className="py-2">$6-12</td>
                    <td className="py-2">$0.40-1.00</td>
                    <td className="py-2">1.5-3.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-white/40">
              Note: Benchmarks vary significantly based on targeting, creative quality, seasonality, and competition.
            </p>
          </div>

          {/* Related tools */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/tools/roas-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">ROAS Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Calculate return on ad spend</p>
              </Link>
              <Link href="/tools/ad-budget-planner" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Ad Budget Planner</h3>
                <p className="text-sm text-white/50 mt-1">Plan your advertising budget</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Want Better Campaign Performance?</h2>
            <p className="text-black/70 mb-6">Our team optimizes Meta and Google campaigns for DTC brands daily.</p>
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
