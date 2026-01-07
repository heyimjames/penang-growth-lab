"use client"

import Link from "next/link"
import { ArrowLeft, Clock, TrendingUp, CheckCircle, AlertTriangle, Target, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ScalingMetaAdsGuide() {
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
                Meta Ads
              </span>
              <span className="text-sm text-white/40 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                20 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How to Scale Meta Ads Without Destroying Your ROAS
            </h1>
            <p className="text-xl text-white/60">
              Learn the proven strategies for scaling your Meta campaigns from $1k to $100k+ in monthly spend while maintaining profitability.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-12">
            <h2 className="font-semibold mb-4">In This Guide</h2>
            <ul className="space-y-2 text-white/60">
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">1.</span> Why ROAS Drops When You Scale
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">2.</span> The 20% Rule for Scaling
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">3.</span> Horizontal vs Vertical Scaling
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">4.</span> Creative Velocity Requirements
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">5.</span> Budget Allocation Frameworks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">6.</span> Common Scaling Mistakes
              </li>
            </ul>
          </div>

          {/* Content */}
          <article className="prose prose-invert max-w-none">
            {/* Section 1 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <AlertTriangle className="h-5 w-5 text-[#cff128]" />
                </span>
                Why ROAS Drops When You Scale
              </h2>
              <p className="text-white/70 mb-4">
                Every advertiser who has tried to scale Meta ads has experienced the dreaded ROAS cliff. You're running
                profitable campaigns at $500/day, so you double the budget to $1,000/day, and suddenly your ROAS tanks.
                Here's why this happens:
              </p>
              <div className="grid gap-4 my-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">Audience Saturation</h4>
                  <p className="text-sm text-white/60">
                    When you increase spend quickly, Meta has to show your ads to less qualified prospects. Your warm
                    audience gets exhausted, and you're forced into colder audiences that convert worse.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">Learning Phase Reset</h4>
                  <p className="text-sm text-white/60">
                    Significant budget changes (more than 20% up or down) trigger the learning phase. Meta's algorithm
                    needs 50 conversions to optimize, and during learning, performance is volatile.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">CPM Inflation</h4>
                  <p className="text-sm text-white/60">
                    Higher budgets compete for more impressions in the auction. You end up paying more per 1,000
                    impressions, which directly impacts your efficiency metrics.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <TrendingUp className="h-5 w-5 text-[#cff128]" />
                </span>
                The 20% Rule for Scaling
              </h2>
              <p className="text-white/70 mb-4">
                The golden rule of Meta ads scaling: never increase budget by more than 20% every 3-4 days. This keeps
                you out of the learning phase while allowing meaningful growth.
              </p>
              <div className="p-6 rounded-xl bg-[#cff128]/10 border border-[#cff128]/20 my-6">
                <h4 className="font-semibold text-[#cff128] mb-3">Example Scaling Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Day 1-3:</span>
                    <span className="text-white">$500/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Day 4-6:</span>
                    <span className="text-white">$600/day (+20%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Day 7-9:</span>
                    <span className="text-white">$720/day (+20%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Day 10-12:</span>
                    <span className="text-white">$864/day (+20%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Day 13-15:</span>
                    <span className="text-white">$1,037/day (+20%)</span>
                  </div>
                  <div className="pt-2 border-t border-[#cff128]/20 flex justify-between font-semibold">
                    <span className="text-white/80">Result:</span>
                    <span className="text-[#cff128]">2x budget in ~2 weeks</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/70">
                  <strong className="text-red-400">Warning:</strong> If performance dips after a budget increase,
                  don't panic-adjust. Give it 48-72 hours to stabilize. Quick reversals cause more harm than the
                  initial increase.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <Target className="h-5 w-5 text-[#cff128]" />
                </span>
                Horizontal vs Vertical Scaling
              </h2>
              <p className="text-white/70 mb-4">
                There are two primary approaches to scaling, and the most successful advertisers use both strategically.
              </p>
              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-3">Vertical Scaling</h4>
                  <p className="text-sm text-white/60 mb-4">
                    Increasing budget on existing winning ad sets. Simpler but limited by audience size.
                  </p>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      Quick to implement
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      Maintains proven performance
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                      Limited ceiling
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-3">Horizontal Scaling</h4>
                  <p className="text-sm text-white/60 mb-4">
                    Creating new campaigns, ad sets, or creatives to find additional winning angles.
                  </p>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      Unlocks new audiences
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      Diversifies risk
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                      More effort and testing required
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-white/70">
                <strong className="text-white">Our recommendation:</strong> Start with vertical scaling until you hit
                diminishing returns (usually around 2-3x your original budget), then shift to horizontal scaling to
                unlock the next level of growth.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <DollarSign className="h-5 w-5 text-[#cff128]" />
                </span>
                Creative Velocity Requirements
              </h2>
              <p className="text-white/70 mb-4">
                The #1 reason campaigns fail to scale is creative fatigue. Here's a rough guide for creative output
                based on spend level:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm my-6">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-white/50 font-medium">Monthly Spend</th>
                      <th className="text-left py-3 text-white/50 font-medium">New Creatives/Month</th>
                      <th className="text-left py-3 text-white/50 font-medium">Testing Budget</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    <tr className="border-b border-white/5">
                      <td className="py-3">$5k - $15k</td>
                      <td className="py-3">8-12</td>
                      <td className="py-3">10-15%</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3">$15k - $50k</td>
                      <td className="py-3">15-25</td>
                      <td className="py-3">15-20%</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3">$50k - $150k</td>
                      <td className="py-3">30-50</td>
                      <td className="py-3">20-25%</td>
                    </tr>
                    <tr>
                      <td className="py-3">$150k+</td>
                      <td className="py-3">50+</td>
                      <td className="py-3">25-30%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-white/70">
                Remember: not all creatives need to be completely new productions. Iterations on winning concepts
                (new hooks, different thumbnails, alternate CTAs) count toward your velocity.
              </p>
            </section>

            {/* Key Takeaways */}
            <section className="p-6 rounded-2xl bg-[#cff128]/10 border border-[#cff128]/20 mb-12">
              <h3 className="font-bold text-lg mb-4">Key Takeaways</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Never increase budget more than 20% every 3-4 days</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Use vertical scaling first, then expand horizontally</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Creative velocity is the #1 factor in successful scaling</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Allocate 15-25% of budget to testing new creatives</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Be patient - successful scaling is a marathon, not a sprint</span>
                </li>
              </ul>
            </section>
          </article>

          {/* CTA */}
          <div className="p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Ready to Scale Your Ads Profitably?</h2>
            <p className="text-black/70 mb-6">
              Our team has scaled dozens of brands from $10k to $500k+ in monthly ad spend. Let's talk about your growth goals.
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
