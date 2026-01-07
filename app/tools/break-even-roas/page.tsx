"use client"

import { useState } from "react"
import Link from "next/link"
import { Target, ExternalLink, Info, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BreakEvenROASPage() {
  const [productCost, setProductCost] = useState<string>("")
  const [sellingPrice, setSellingPrice] = useState<string>("")
  const [otherCosts, setOtherCosts] = useState<string>("")

  const productCostNum = parseFloat(productCost) || 0
  const sellingPriceNum = parseFloat(sellingPrice) || 0
  const otherCostsNum = parseFloat(otherCosts) || 0

  const totalCosts = productCostNum + otherCostsNum
  const grossProfit = sellingPriceNum - totalCosts
  const grossMargin = sellingPriceNum > 0 ? (grossProfit / sellingPriceNum) * 100 : 0
  const breakEvenROAS = grossMargin > 0 ? 100 / grossMargin : 0
  const targetROAS = breakEvenROAS * 1.2 // 20% buffer for profit

  const getMarginStatus = () => {
    if (grossMargin <= 0) return { label: "No margin", color: "text-red-400", icon: AlertTriangle }
    if (grossMargin < 30) return { label: "Low margin", color: "text-yellow-400", icon: AlertTriangle }
    if (grossMargin < 50) return { label: "Moderate margin", color: "text-green-400", icon: CheckCircle }
    return { label: "Strong margin", color: "text-[#cff128]", icon: CheckCircle }
  }

  const status = getMarginStatus()

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
            <span className="text-white">Break-Even ROAS Calculator</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#cff128]/10">
                <Target className="h-8 w-8 text-[#cff128]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Break-Even ROAS Calculator</h1>
            </div>
            <p className="text-lg text-white/60">
              Find the minimum ROAS you need to break even based on your profit margins.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-6">Enter Your Costs</h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="sellingPrice" className="text-white/70">
                    Average Selling Price ($)
                  </Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    placeholder="100"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Average order value or product price</p>
                </div>

                <div>
                  <Label htmlFor="productCost" className="text-white/70">
                    Product Cost (COGS) ($)
                  </Label>
                  <Input
                    id="productCost"
                    type="number"
                    placeholder="30"
                    value={productCost}
                    onChange={(e) => setProductCost(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Cost of goods sold per unit</p>
                </div>

                <div>
                  <Label htmlFor="otherCosts" className="text-white/70">
                    Other Variable Costs ($)
                  </Label>
                  <Input
                    id="otherCosts"
                    type="number"
                    placeholder="10"
                    value={otherCosts}
                    onChange={(e) => setOtherCosts(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Shipping, packaging, payment fees per order</p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20">
              <h2 className="text-lg font-semibold mb-6">Your Results</h2>

              <div className="space-y-6">
                {/* Break-Even ROAS */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-2">Break-Even ROAS</div>
                  <div className="text-4xl font-bold text-[#cff128]">
                    {breakEvenROAS > 0 ? `${breakEvenROAS.toFixed(2)}x` : "—"}
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    Minimum ROAS to cover costs
                  </div>
                </div>

                {/* Target ROAS */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-2">Recommended Target ROAS</div>
                  <div className="text-3xl font-bold text-green-400">
                    {targetROAS > 0 ? `${targetROAS.toFixed(2)}x` : "—"}
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    With 20% profit buffer
                  </div>
                </div>

                {/* Gross Margin */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/30">
                    <div className="text-white/60 text-sm mb-1">Gross Profit</div>
                    <div className={`text-2xl font-bold ${grossProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      ${grossProfit.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-black/30">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/60 text-sm">Gross Margin</span>
                      <status.icon className={`h-3 w-3 ${status.color}`} />
                    </div>
                    <div className={`text-2xl font-bold ${status.color}`}>
                      {grossMargin.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#cff128] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-white/60">
                      {grossMargin <= 0 && "Your costs exceed your selling price. You need to increase prices or reduce costs."}
                      {grossMargin > 0 && grossMargin < 30 && `With ${grossMargin.toFixed(0)}% margin, you need ${breakEvenROAS.toFixed(2)}x ROAS just to break even. Consider improving margins before scaling ads.`}
                      {grossMargin >= 30 && grossMargin < 50 && `Your ${grossMargin.toFixed(0)}% margin gives you decent room for advertising. Target ${targetROAS.toFixed(2)}x ROAS for healthy profits.`}
                      {grossMargin >= 50 && `Strong ${grossMargin.toFixed(0)}% margins give you flexibility. You can be more aggressive with ad spend.`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formula explanation */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">How Break-Even ROAS Works</h2>
            <div className="p-4 rounded-xl bg-black/30 font-mono text-center text-lg mb-4">
              Break-Even ROAS = 1 ÷ Gross Margin %
            </div>
            <p className="text-white/60 text-sm">
              <strong className="text-white">Example:</strong> If your gross margin is 40% (0.40), your break-even ROAS
              is 1 ÷ 0.40 = 2.5x. This means you need to generate $2.50 in revenue for every $1 spent on ads just to
              cover your product costs. Anything above this is profit.
            </p>
          </div>

          {/* Margin guide */}
          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Margin & Break-Even ROAS Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-white/50 font-medium">Gross Margin</th>
                    <th className="text-left py-2 text-white/50 font-medium">Break-Even ROAS</th>
                    <th className="text-left py-2 text-white/50 font-medium">Target ROAS (20% profit)</th>
                    <th className="text-left py-2 text-white/50 font-medium">Assessment</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="py-2">20%</td>
                    <td className="py-2">5.00x</td>
                    <td className="py-2">6.00x</td>
                    <td className="py-2 text-red-400">Very challenging</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">30%</td>
                    <td className="py-2">3.33x</td>
                    <td className="py-2">4.00x</td>
                    <td className="py-2 text-yellow-400">Challenging</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">40%</td>
                    <td className="py-2">2.50x</td>
                    <td className="py-2">3.00x</td>
                    <td className="py-2 text-green-400">Achievable</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">50%</td>
                    <td className="py-2">2.00x</td>
                    <td className="py-2">2.40x</td>
                    <td className="py-2 text-green-400">Good</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">60%</td>
                    <td className="py-2">1.67x</td>
                    <td className="py-2">2.00x</td>
                    <td className="py-2 text-[#cff128]">Excellent</td>
                  </tr>
                  <tr>
                    <td className="py-2">70%</td>
                    <td className="py-2">1.43x</td>
                    <td className="py-2">1.71x</td>
                    <td className="py-2 text-[#cff128]">Premium</td>
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
                <p className="text-sm text-white/50 mt-1">Calculate your actual campaign ROAS</p>
              </Link>
              <Link href="/tools/profit-margin-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Profit Margin Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Calculate gross and net profit margins</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Struggling to Hit Your ROAS Targets?</h2>
            <p className="text-black/70 mb-6">Our team at Penang Media helps DTC brands optimize for profitable growth.</p>
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
