"use client"

import { useState } from "react"
import Link from "next/link"
import { DollarSign, ExternalLink, Info, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CACCalculatorPage() {
  const [marketingSpend, setMarketingSpend] = useState<string>("")
  const [salesSpend, setSalesSpend] = useState<string>("")
  const [newCustomers, setNewCustomers] = useState<string>("")
  const [ltv, setLtv] = useState<string>("")

  const marketingNum = parseFloat(marketingSpend) || 0
  const salesNum = parseFloat(salesSpend) || 0
  const customersNum = parseInt(newCustomers) || 0
  const ltvNum = parseFloat(ltv) || 0

  const totalAcquisitionCost = marketingNum + salesNum
  const cac = customersNum > 0 ? totalAcquisitionCost / customersNum : 0
  const ltvCacRatio = cac > 0 && ltvNum > 0 ? ltvNum / cac : 0
  const paybackPeriod = cac > 0 && ltvNum > 0 ? (cac / ltvNum) * 12 : 0

  const getRatioStatus = () => {
    if (ltvCacRatio === 0) return { label: "Enter LTV", color: "text-white/50", icon: Info }
    if (ltvCacRatio < 1) return { label: "Losing money", color: "text-red-400", icon: AlertTriangle }
    if (ltvCacRatio < 2) return { label: "Unsustainable", color: "text-yellow-400", icon: AlertTriangle }
    if (ltvCacRatio < 3) return { label: "Acceptable", color: "text-green-400", icon: CheckCircle }
    if (ltvCacRatio < 5) return { label: "Healthy", color: "text-green-400", icon: CheckCircle }
    return { label: "Excellent", color: "text-[#cff128]", icon: CheckCircle }
  }

  const status = getRatioStatus()

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
            <span className="text-white">CAC Calculator</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#cff128]/10">
                <DollarSign className="h-8 w-8 text-[#cff128]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">CAC Calculator</h1>
            </div>
            <p className="text-lg text-white/60">
              Calculate your Customer Acquisition Cost and LTV:CAC ratio for sustainable growth.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-6">Enter Your Costs</h2>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="marketing" className="text-white/70">Marketing Spend ($)</Label>
                  <Input
                    id="marketing"
                    type="number"
                    placeholder="25000"
                    value={marketingSpend}
                    onChange={(e) => setMarketingSpend(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Paid ads, content, influencers, agency fees</p>
                </div>

                <div>
                  <Label htmlFor="sales" className="text-white/70">Sales & Overhead ($)</Label>
                  <Input
                    id="sales"
                    type="number"
                    placeholder="5000"
                    value={salesSpend}
                    onChange={(e) => setSalesSpend(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Sales team, tools, creative production (optional)</p>
                </div>

                <div>
                  <Label htmlFor="customers" className="text-white/70">New Customers Acquired</Label>
                  <Input
                    id="customers"
                    type="number"
                    placeholder="500"
                    value={newCustomers}
                    onChange={(e) => setNewCustomers(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Number of new customers in this period</p>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <Label htmlFor="ltv" className="text-white/70">Customer LTV ($) - Optional</Label>
                  <Input
                    id="ltv"
                    type="number"
                    placeholder="300"
                    value={ltv}
                    onChange={(e) => setLtv(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white text-lg h-12 placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Enter to calculate LTV:CAC ratio</p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20">
              <h2 className="text-lg font-semibold mb-6">Your Results</h2>

              <div className="space-y-4">
                {/* CAC */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-2">Customer Acquisition Cost (CAC)</div>
                  <div className="text-4xl font-bold text-[#cff128]">
                    ${cac.toFixed(2)}
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    Cost to acquire each customer
                  </div>
                </div>

                {/* LTV:CAC Ratio */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">LTV:CAC Ratio</span>
                    <div className={`flex items-center gap-1 ${status.color}`}>
                      <status.icon className="h-4 w-4" />
                      <span className="text-sm">{status.label}</span>
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${status.color}`}>
                    {ltvCacRatio > 0 ? `${ltvCacRatio.toFixed(2)}:1` : "—"}
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    {ltvCacRatio >= 3 ? "Strong unit economics" : ltvCacRatio > 0 ? "Enter LTV for ratio" : "Room to improve"}
                  </div>
                </div>

                {/* Payback Period */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-2">CAC Payback Period</div>
                  <div className="text-2xl font-bold text-white">
                    {paybackPeriod > 0 ? `${paybackPeriod.toFixed(1)} months` : "—"}
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    Time to recover acquisition cost
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-2">Acquisition Cost Breakdown</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">Marketing</span>
                      <span className="text-white">${marketingNum.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Sales & Overhead</span>
                      <span className="text-white">${salesNum.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-medium">
                      <span className="text-white/70">Total</span>
                      <span className="text-[#cff128]">${totalAcquisitionCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Insight */}
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#cff128] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-white/60">
                      {ltvCacRatio < 1 && "You're losing money on each customer. Reduce CAC or increase LTV."}
                      {ltvCacRatio >= 1 && ltvCacRatio < 2 && "Barely break-even. Focus on retention to increase LTV or optimize ad spend."}
                      {ltvCacRatio >= 2 && ltvCacRatio < 3 && "Acceptable ratio but limited room for growth. Aim for 3:1 or better."}
                      {ltvCacRatio >= 3 && ltvCacRatio < 5 && "Healthy ratio. You can scale profitably with these unit economics."}
                      {ltvCacRatio >= 5 && "Excellent unit economics. Consider investing more in acquisition to accelerate growth."}
                      {ltvCacRatio === 0 && "Enter your LTV to see your LTV:CAC ratio and get insights."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formula explanation */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">How CAC is Calculated</h2>
            <div className="p-4 rounded-xl bg-black/30 font-mono text-center text-lg mb-4">
              CAC = Total Acquisition Costs ÷ New Customers
            </div>
            <p className="text-white/60 text-sm">
              <strong className="text-white">Example:</strong> If you spend $25,000 on marketing and $5,000 on sales
              to acquire 500 customers, your CAC is $60 per customer ($30,000 ÷ 500 = $60).
            </p>
          </div>

          {/* LTV:CAC Guide */}
          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">LTV:CAC Ratio Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-white/50 font-medium">Ratio</th>
                    <th className="text-left py-2 text-white/50 font-medium">Assessment</th>
                    <th className="text-left py-2 text-white/50 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="py-2 text-red-400">&lt;1:1</td>
                    <td className="py-2">Losing money</td>
                    <td className="py-2">Stop and fix immediately</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 text-yellow-400">1:1 - 2:1</td>
                    <td className="py-2">Unsustainable</td>
                    <td className="py-2">Optimize before scaling</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 text-green-400">3:1</td>
                    <td className="py-2">Healthy</td>
                    <td className="py-2">Scale confidently</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 text-green-400">4:1 - 5:1</td>
                    <td className="py-2">Very good</td>
                    <td className="py-2">Room for aggressive growth</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-[#cff128]">&gt;5:1</td>
                    <td className="py-2">Excellent</td>
                    <td className="py-2">May be under-investing in growth</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Related tools */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/tools/ltv-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Customer LTV Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Calculate customer lifetime value</p>
              </Link>
              <Link href="/tools/roas-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">ROAS Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Calculate return on ad spend</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Want to Lower Your CAC?</h2>
            <p className="text-black/70 mb-6">Our team helps DTC brands reduce acquisition costs while scaling profitably.</p>
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
