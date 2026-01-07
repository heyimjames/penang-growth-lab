"use client"

import { useState } from "react"
import Link from "next/link"
import { LineChart, ExternalLink, Info, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function MERCalculatorPage() {
  const [totalRevenue, setTotalRevenue] = useState<string>("")
  const [totalMarketingSpend, setTotalMarketingSpend] = useState<string>("")
  const [paidAds, setPaidAds] = useState<string>("")
  const [influencers, setInfluencers] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [other, setOther] = useState<string>("")

  const revenueNum = parseFloat(totalRevenue) || 0
  const marketingNum = parseFloat(totalMarketingSpend) || 0
  const paidNum = parseFloat(paidAds) || 0
  const influencerNum = parseFloat(influencers) || 0
  const emailNum = parseFloat(email) || 0
  const otherNum = parseFloat(other) || 0

  const calculatedMarketing = paidNum + influencerNum + emailNum + otherNum
  const finalMarketing = marketingNum > 0 ? marketingNum : calculatedMarketing

  const mer = finalMarketing > 0 ? revenueNum / finalMarketing : 0
  const marketingAsPercentOfRevenue = revenueNum > 0 ? (finalMarketing / revenueNum) * 100 : 0

  const getMERStatus = () => {
    if (mer === 0) return { label: "Enter values", color: "text-white/50", icon: Info }
    if (mer < 2) return { label: "Needs improvement", color: "text-red-400", icon: TrendingDown }
    if (mer < 3) return { label: "Acceptable", color: "text-yellow-400", icon: TrendingUp }
    if (mer < 5) return { label: "Healthy", color: "text-green-400", icon: TrendingUp }
    return { label: "Excellent", color: "text-[#cff128]", icon: TrendingUp }
  }

  const status = getMERStatus()

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
            <span className="text-white">MER Calculator</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#cff128]/10">
                <LineChart className="h-8 w-8 text-[#cff128]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">MER Calculator</h1>
            </div>
            <p className="text-lg text-white/60">
              Calculate your Marketing Efficiency Ratio for a holistic view of all marketing performance.
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
                    placeholder="250000"
                    value={totalRevenue}
                    onChange={(e) => setTotalRevenue(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">All revenue (attributed + unattributed)</p>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <Label className="text-white/70 mb-3 block">Marketing Spend Breakdown (optional)</Label>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="paid" className="text-white/50 text-sm">Paid Ads ($)</Label>
                      <Input
                        id="paid"
                        type="number"
                        placeholder="50000"
                        value={paidAds}
                        onChange={(e) => setPaidAds(e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="influencers" className="text-white/50 text-sm">Influencers/Affiliates ($)</Label>
                      <Input
                        id="influencers"
                        type="number"
                        placeholder="10000"
                        value={influencers}
                        onChange={(e) => setInfluencers(e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white/50 text-sm">Email/SMS Tools ($)</Label>
                      <Input
                        id="email"
                        type="number"
                        placeholder="2000"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="other" className="text-white/50 text-sm">Other Marketing ($)</Label>
                      <Input
                        id="other"
                        type="number"
                        placeholder="3000"
                        value={other}
                        onChange={(e) => setOther(e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <Label htmlFor="totalMarketing" className="text-white/70">Or Enter Total Marketing Spend ($)</Label>
                  <Input
                    id="totalMarketing"
                    type="number"
                    placeholder="65000"
                    value={totalMarketingSpend}
                    onChange={(e) => setTotalMarketingSpend(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20">
              <h2 className="text-lg font-semibold mb-6">Your Results</h2>

              <div className="space-y-4">
                {/* MER */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Marketing Efficiency Ratio (MER)</span>
                    <div className={`flex items-center gap-1 ${status.color}`}>
                      <status.icon className="h-4 w-4" />
                      <span className="text-sm">{status.label}</span>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-[#cff128]">
                    {mer.toFixed(2)}x
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    ${revenueNum.toLocaleString()} revenue ÷ ${finalMarketing.toLocaleString()} marketing
                  </div>
                </div>

                {/* Marketing % of Revenue */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-2">Marketing as % of Revenue</div>
                  <div className={`text-3xl font-bold ${marketingAsPercentOfRevenue <= 25 ? "text-green-400" : marketingAsPercentOfRevenue <= 35 ? "text-yellow-400" : "text-red-400"}`}>
                    {marketingAsPercentOfRevenue.toFixed(1)}%
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    Target: 15-30% for healthy DTC brands
                  </div>
                </div>

                {/* Spend Breakdown */}
                {calculatedMarketing > 0 && (
                  <div className="p-4 rounded-xl bg-black/30">
                    <div className="text-white/60 text-sm mb-3">Marketing Spend Breakdown</div>
                    <div className="space-y-2 text-sm">
                      {paidNum > 0 && (
                        <div className="flex justify-between">
                          <span className="text-white/50">Paid Ads</span>
                          <span className="text-white">${paidNum.toLocaleString()} ({((paidNum / calculatedMarketing) * 100).toFixed(0)}%)</span>
                        </div>
                      )}
                      {influencerNum > 0 && (
                        <div className="flex justify-between">
                          <span className="text-white/50">Influencers</span>
                          <span className="text-white">${influencerNum.toLocaleString()} ({((influencerNum / calculatedMarketing) * 100).toFixed(0)}%)</span>
                        </div>
                      )}
                      {emailNum > 0 && (
                        <div className="flex justify-between">
                          <span className="text-white/50">Email/SMS</span>
                          <span className="text-white">${emailNum.toLocaleString()} ({((emailNum / calculatedMarketing) * 100).toFixed(0)}%)</span>
                        </div>
                      )}
                      {otherNum > 0 && (
                        <div className="flex justify-between">
                          <span className="text-white/50">Other</span>
                          <span className="text-white">${otherNum.toLocaleString()} ({((otherNum / calculatedMarketing) * 100).toFixed(0)}%)</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Insight */}
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#cff128] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-white/60">
                      {mer === 0 && "Enter your revenue and marketing spend to calculate MER."}
                      {mer > 0 && mer < 2 && "Low MER indicates inefficient marketing. Review channel performance and creative strategy."}
                      {mer >= 2 && mer < 3 && "Acceptable MER but room for improvement. Focus on top-performing channels."}
                      {mer >= 3 && mer < 5 && "Healthy MER. Consider scaling marketing spend while maintaining efficiency."}
                      {mer >= 5 && "Excellent MER. You may be under-investing in marketing - test scaling up."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why MER */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Why MER Matters</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">MER vs ROAS</h3>
                <p className="text-white/60">
                  While ROAS measures individual channel performance, MER (also called "blended ROAS" or "efficiency ratio")
                  measures overall marketing efficiency including unattributed revenue. This gives a more accurate picture
                  of true marketing impact.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">When to Use MER</h3>
                <p className="text-white/60">
                  Use MER as your north star metric when attribution is unreliable (iOS 14.5+), when running
                  brand awareness campaigns, or when you want a holistic view of marketing performance across all channels.
                </p>
              </div>
            </div>
          </div>

          {/* MER Benchmarks */}
          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">MER Benchmarks by Growth Stage</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-white/50 font-medium">Growth Stage</th>
                    <th className="text-left py-2 text-white/50 font-medium">Target MER</th>
                    <th className="text-left py-2 text-white/50 font-medium">Marketing % of Revenue</th>
                    <th className="text-left py-2 text-white/50 font-medium">Focus</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="py-2">Launch (0-$1M)</td>
                    <td className="py-2 text-yellow-400">1.5-2.5x</td>
                    <td className="py-2">40-60%</td>
                    <td className="py-2">Growth over efficiency</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">Growth ($1M-$10M)</td>
                    <td className="py-2 text-green-400">2.5-4x</td>
                    <td className="py-2">25-40%</td>
                    <td className="py-2">Balanced growth</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">Scale ($10M-$50M)</td>
                    <td className="py-2 text-green-400">3-5x</td>
                    <td className="py-2">20-30%</td>
                    <td className="py-2">Efficiency at scale</td>
                  </tr>
                  <tr>
                    <td className="py-2">Mature ($50M+)</td>
                    <td className="py-2 text-[#cff128]">4-6x+</td>
                    <td className="py-2">15-25%</td>
                    <td className="py-2">Profitability focus</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Related tools */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/tools/roas-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">ROAS Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Calculate channel-level ROAS</p>
              </Link>
              <Link href="/tools/cac-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">CAC Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Calculate customer acquisition cost</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Want to Improve Your MER?</h2>
            <p className="text-black/70 mb-6">Our team helps DTC brands maximize marketing efficiency across all channels.</p>
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
