"use client"

import { useState } from "react"
import Link from "next/link"
import { FlaskConical, ExternalLink, Info, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ABTestCalculatorPage() {
  const [visitorsA, setVisitorsA] = useState<string>("")
  const [conversionsA, setConversionsA] = useState<string>("")
  const [visitorsB, setVisitorsB] = useState<string>("")
  const [conversionsB, setConversionsB] = useState<string>("")

  const visitorsANum = parseInt(visitorsA) || 0
  const conversionsANum = parseInt(conversionsA) || 0
  const visitorsBNum = parseInt(visitorsB) || 0
  const conversionsBNum = parseInt(conversionsB) || 0

  const rateA = visitorsANum > 0 ? (conversionsANum / visitorsANum) : 0
  const rateB = visitorsBNum > 0 ? (conversionsBNum / visitorsBNum) : 0

  const relativeUplift = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0

  // Simple z-test for statistical significance
  const calculateSignificance = () => {
    if (visitorsANum < 1 || visitorsBNum < 1) return { zScore: 0, pValue: 1, significant: false }

    const p1 = rateA
    const p2 = rateB
    const n1 = visitorsANum
    const n2 = visitorsBNum

    const pPooled = (conversionsANum + conversionsBNum) / (n1 + n2)
    const se = Math.sqrt(pPooled * (1 - pPooled) * (1/n1 + 1/n2))

    if (se === 0) return { zScore: 0, pValue: 1, significant: false }

    const zScore = (p2 - p1) / se

    // Approximate p-value using z-score (two-tailed)
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)))

    return {
      zScore,
      pValue,
      significant: pValue < 0.05
    }
  }

  // Standard normal CDF approximation
  function normalCDF(x: number): number {
    const a1 =  0.254829592
    const a2 = -0.284496736
    const a3 =  1.421413741
    const a4 = -1.453152027
    const a5 =  1.061405429
    const p  =  0.3275911

    const sign = x < 0 ? -1 : 1
    x = Math.abs(x) / Math.sqrt(2)

    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return 0.5 * (1.0 + sign * y)
  }

  const { pValue, significant } = calculateSignificance()
  const confidenceLevel = (1 - pValue) * 100

  const getWinner = () => {
    if (!significant) return null
    return rateB > rateA ? "B" : "A"
  }

  const winner = getWinner()

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
            <span className="text-white">A/B Test Calculator</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#cff128]/10">
                <FlaskConical className="h-8 w-8 text-[#cff128]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">A/B Test Calculator</h1>
            </div>
            <p className="text-lg text-white/60">
              Calculate statistical significance for your A/B tests to make data-driven decisions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-6">Enter Test Data</h2>

              <div className="space-y-6">
                {/* Variant A */}
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <h3 className="font-medium text-white/80 mb-4">Control (Variant A)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="visitorsA" className="text-white/60 text-sm">Visitors</Label>
                      <Input
                        id="visitorsA"
                        type="number"
                        placeholder="10000"
                        value={visitorsA}
                        onChange={(e) => setVisitorsA(e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="conversionsA" className="text-white/60 text-sm">Conversions</Label>
                      <Input
                        id="conversionsA"
                        type="number"
                        placeholder="250"
                        value={conversionsA}
                        onChange={(e) => setConversionsA(e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-white/50">
                    Conversion Rate: <span className="text-white font-medium">{(rateA * 100).toFixed(2)}%</span>
                  </div>
                </div>

                {/* Variant B */}
                <div className="p-4 rounded-xl bg-black/20 border border-[#cff128]/20">
                  <h3 className="font-medium text-[#cff128] mb-4">Variant B (Test)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="visitorsB" className="text-white/60 text-sm">Visitors</Label>
                      <Input
                        id="visitorsB"
                        type="number"
                        placeholder="10000"
                        value={visitorsB}
                        onChange={(e) => setVisitorsB(e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="conversionsB" className="text-white/60 text-sm">Conversions</Label>
                      <Input
                        id="conversionsB"
                        type="number"
                        placeholder="300"
                        value={conversionsB}
                        onChange={(e) => setConversionsB(e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-white/50">
                    Conversion Rate: <span className="text-[#cff128] font-medium">{(rateB * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20">
              <h2 className="text-lg font-semibold mb-6">Results</h2>

              <div className="space-y-4">
                {/* Winner */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Statistical Significance</span>
                    {significant ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    )}
                  </div>
                  <div className={`text-3xl font-bold ${significant ? "text-green-400" : "text-yellow-400"}`}>
                    {confidenceLevel > 0 ? `${confidenceLevel.toFixed(1)}%` : "—"}
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    {significant ? "Statistically significant (p < 0.05)" : "Not yet significant (need more data)"}
                  </div>
                </div>

                {/* Relative Uplift */}
                <div className="p-4 rounded-xl bg-black/30">
                  <div className="text-white/60 text-sm mb-2">Relative Uplift</div>
                  <div className={`text-2xl font-bold ${relativeUplift > 0 ? "text-green-400" : relativeUplift < 0 ? "text-red-400" : "text-white/50"}`}>
                    {rateA > 0 ? `${relativeUplift >= 0 ? "+" : ""}${relativeUplift.toFixed(2)}%` : "—"}
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    Variant B vs Control
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#cff128] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-white/60">
                      {visitorsANum === 0 && visitorsBNum === 0 && "Enter your test data to see results."}
                      {(visitorsANum > 0 || visitorsBNum > 0) && !significant && confidenceLevel < 90 && "Keep running the test. You don't have enough data to make a decision yet."}
                      {(visitorsANum > 0 || visitorsBNum > 0) && !significant && confidenceLevel >= 90 && "Getting close! Consider running a bit longer to reach 95% confidence."}
                      {significant && winner === "B" && `Variant B is the winner with ${relativeUplift.toFixed(1)}% uplift. Safe to implement.`}
                      {significant && winner === "A" && "Control (A) performs better. Don't implement Variant B."}
                    </div>
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="p-4 rounded-xl bg-black/20">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 text-white/50 font-medium">Metric</th>
                        <th className="text-right py-2 text-white/50 font-medium">Control A</th>
                        <th className="text-right py-2 text-[#cff128]/70 font-medium">Variant B</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-2 text-white/70">Visitors</td>
                        <td className="py-2 text-right text-white">{visitorsANum.toLocaleString() || "—"}</td>
                        <td className="py-2 text-right text-[#cff128]">{visitorsBNum.toLocaleString() || "—"}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2 text-white/70">Conversions</td>
                        <td className="py-2 text-right text-white">{conversionsANum.toLocaleString() || "—"}</td>
                        <td className="py-2 text-right text-[#cff128]">{conversionsBNum.toLocaleString() || "—"}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-white/70">Conv. Rate</td>
                        <td className="py-2 text-right text-white">{(rateA * 100).toFixed(2)}%</td>
                        <td className="py-2 text-right text-[#cff128]">{(rateB * 100).toFixed(2)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Size Guide */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">How Much Traffic Do You Need?</h2>
            <p className="text-white/60 text-sm mb-4">
              The sample size needed depends on your baseline conversion rate and the minimum effect you want to detect.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-white/50 font-medium">Baseline CVR</th>
                    <th className="text-left py-2 text-white/50 font-medium">5% Uplift</th>
                    <th className="text-left py-2 text-white/50 font-medium">10% Uplift</th>
                    <th className="text-left py-2 text-white/50 font-medium">20% Uplift</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="py-2">1%</td>
                    <td className="py-2">~310K / variant</td>
                    <td className="py-2">~78K / variant</td>
                    <td className="py-2">~20K / variant</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">2%</td>
                    <td className="py-2">~155K / variant</td>
                    <td className="py-2">~39K / variant</td>
                    <td className="py-2">~10K / variant</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">5%</td>
                    <td className="py-2">~62K / variant</td>
                    <td className="py-2">~16K / variant</td>
                    <td className="py-2">~4K / variant</td>
                  </tr>
                  <tr>
                    <td className="py-2">10%</td>
                    <td className="py-2">~31K / variant</td>
                    <td className="py-2">~8K / variant</td>
                    <td className="py-2">~2K / variant</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-white/40">
              Based on 95% confidence level and 80% statistical power. Actual requirements may vary.
            </p>
          </div>

          {/* A/B Testing Tips */}
          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">A/B Testing Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">Do:</h3>
                <ul className="space-y-2 text-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Test one variable at a time
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Wait for statistical significance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Run tests for full business cycles
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Document all tests and learnings
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-400 mb-2">Don't:</h3>
                <ul className="space-y-2 text-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Stop tests early when you see a winner
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Change test parameters mid-experiment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Ignore external factors (seasons, sales)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Run multiple tests on same audience
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related tools */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/tools/utm-builder" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">UTM Builder</h3>
                <p className="text-sm text-white/50 mt-1">Build tracking URLs for campaigns</p>
              </Link>
              <Link href="/tools/cpm-cpc-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">CPM/CPC Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Calculate ad performance metrics</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Need Help With Testing Strategy?</h2>
            <p className="text-black/70 mb-6">Our team runs continuous creative tests for DTC brands.</p>
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
