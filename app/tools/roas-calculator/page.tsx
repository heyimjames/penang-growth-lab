"use client"

import { useState } from "react"
import Link from "next/link"
import { Calculator, ArrowRight, ExternalLink, Info, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ROASCalculatorPage() {
  const [revenue, setRevenue] = useState<string>("")
  const [adSpend, setAdSpend] = useState<string>("")

  const revenueNum = parseFloat(revenue) || 0
  const adSpendNum = parseFloat(adSpend) || 0

  const roas = adSpendNum > 0 ? revenueNum / adSpendNum : 0
  const roasPercentage = roas * 100
  const profit = revenueNum - adSpendNum
  const profitMargin = revenueNum > 0 ? (profit / revenueNum) * 100 : 0

  const getRoasRating = () => {
    if (roas === 0) return { label: "Enter values", color: "text-white/50", icon: Minus }
    if (roas < 1) return { label: "Losing money", color: "text-red-400", icon: TrendingDown }
    if (roas < 2) return { label: "Break-even", color: "text-yellow-400", icon: Minus }
    if (roas < 3) return { label: "Profitable", color: "text-green-400", icon: TrendingUp }
    if (roas < 5) return { label: "Very good", color: "text-green-400", icon: TrendingUp }
    return { label: "Excellent", color: "text-[#cff128]", icon: TrendingUp }
  }

  const rating = getRoasRating()

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
              <Link href="/tools" className="text-sm text-white transition-colors">
                Tools
              </Link>
              <Link href="/guides" className="text-sm text-white/70 hover:text-white transition-colors">
                Guides
              </Link>
              <Link href="/blog" className="text-sm text-white/70 hover:text-white transition-colors">
                Blog
              </Link>
            </div>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button className="bg-[#cff128] text-black hover:bg-[#e5f875] font-semibold">
                Work With Us
              </Button>
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
            <span className="text-white">ROAS Calculator</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#cff128]/10">
                <Calculator className="h-8 w-8 text-[#cff128]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">ROAS Calculator</h1>
            </div>
            <p className="text-lg text-white/60">
              Calculate your Return on Ad Spend to understand campaign profitability.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-6">Enter Your Numbers</h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="revenue" className="text-white/70">
                    Total Revenue ($)
                  </Label>
                  <Input
                    id="revenue"
                    type="number"
                    placeholder="10000"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Revenue generated from your ads</p>
                </div>

                <div>
                  <Label htmlFor="adSpend" className="text-white/70">
                    Total Ad Spend ($)
                  </Label>
                  <Input
                    id="adSpend"
                    type="number"
                    placeholder="2500"
                    value={adSpend}
                    onChange={(e) => setAdSpend(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Amount spent on advertising</p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20">
              <h2 className="text-lg font-semibold mb-6">Your Results</h2>

              <div className="space-y-6">
                {/* ROAS */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60">ROAS</span>
                    <div className={`flex items-center gap-1 ${rating.color}`}>
                      <rating.icon className="h-4 w-4" />
                      <span className="text-sm">{rating.label}</span>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-[#cff128]">
                    {roas.toFixed(2)}x
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    {roasPercentage.toFixed(0)}% return
                  </div>
                </div>

                {/* Additional metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/30">
                    <div className="text-white/60 text-sm mb-1">Gross Profit</div>
                    <div className={`text-2xl font-bold ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      ${profit.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-black/30">
                    <div className="text-white/60 text-sm mb-1">Profit Margin</div>
                    <div className={`text-2xl font-bold ${profitMargin >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {profitMargin.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#cff128] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-white/60">
                      {roas === 0 && "Enter your revenue and ad spend to calculate ROAS."}
                      {roas > 0 && roas < 1 && "Your ads are costing more than they're generating. Consider optimizing your campaigns or improving your conversion rate."}
                      {roas >= 1 && roas < 2 && "You're close to break-even. Factor in your product costs to ensure you're actually profitable."}
                      {roas >= 2 && roas < 3 && "Solid performance. Most e-commerce brands target 2-3x ROAS for sustainable growth."}
                      {roas >= 3 && roas < 5 && "Great performance! You have room to scale your ad spend while maintaining profitability."}
                      {roas >= 5 && "Excellent ROAS! Consider increasing ad spend to capture more market share."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formula explanation */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">How ROAS is Calculated</h2>
            <div className="p-4 rounded-xl bg-black/30 font-mono text-center text-lg mb-4">
              ROAS = Revenue ÷ Ad Spend
            </div>
            <p className="text-white/60 text-sm">
              <strong className="text-white">Example:</strong> If you spend $2,500 on ads and generate $10,000 in revenue,
              your ROAS is 4x ($10,000 ÷ $2,500 = 4). This means for every $1 spent on ads, you're generating $4 in revenue.
            </p>
          </div>

          {/* What's a good ROAS */}
          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">What's a Good ROAS?</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-white">Below 1x:</span>
                  <span className="text-white/60"> You're losing money on every dollar spent.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-white">1-2x:</span>
                  <span className="text-white/60"> Break-even territory. May be profitable depending on margins.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-white">2-4x:</span>
                  <span className="text-white/60"> Healthy range for most e-commerce brands. Sustainable growth.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#cff128] mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-white">4x+:</span>
                  <span className="text-white/60"> Excellent performance. Good opportunity to scale.</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-white/40">
              Note: The "right" ROAS depends on your profit margins. Use our Break-Even ROAS Calculator to find your target.
            </p>
          </div>

          {/* Related tools */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/tools/break-even-roas"
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors"
              >
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Break-Even ROAS Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Find the minimum ROAS you need to be profitable</p>
              </Link>
              <Link
                href="/tools/profit-margin-calculator"
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors"
              >
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Profit Margin Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Calculate gross and net profit margins</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Need Help Improving Your ROAS?</h2>
            <p className="text-black/70 mb-6">Our team at Penang Media consistently delivers 4-5x ROAS for DTC brands.</p>
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
