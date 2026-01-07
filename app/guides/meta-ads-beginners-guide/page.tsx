"use client"

import Link from "next/link"
import { BookOpen, Clock, ArrowLeft, ArrowRight, ExternalLink, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MetaAdsBeginnerGuidePage() {
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
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Guides
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium text-[#cff128] bg-[#cff128]/10 px-3 py-1 rounded-full">
                Meta Ads
              </span>
              <span className="flex items-center gap-1 text-sm text-white/40">
                <Clock className="h-4 w-4" />
                25 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              The Complete Beginner's Guide to Meta Ads for E-commerce
            </h1>
            <p className="text-xl text-white/60">
              Everything you need to know to launch your first profitable Meta advertising campaign.
              From account setup to your first sale.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-12">
            <h2 className="font-semibold mb-4">What You'll Learn</h2>
            <nav className="space-y-2">
              <a href="#why-meta-ads" className="block text-white/70 hover:text-[#cff128] transition-colors">
                1. Why Meta Ads for E-commerce?
              </a>
              <a href="#account-setup" className="block text-white/70 hover:text-[#cff128] transition-colors">
                2. Setting Up Your Business Manager & Ad Account
              </a>
              <a href="#pixel-setup" className="block text-white/70 hover:text-[#cff128] transition-colors">
                3. Installing the Meta Pixel & Tracking Events
              </a>
              <a href="#campaign-structure" className="block text-white/70 hover:text-[#cff128] transition-colors">
                4. Understanding Campaign Structure
              </a>
              <a href="#first-campaign" className="block text-white/70 hover:text-[#cff128] transition-colors">
                5. Creating Your First Campaign
              </a>
              <a href="#budgets-bidding" className="block text-white/70 hover:text-[#cff128] transition-colors">
                6. Budgets, Bidding & Optimization
              </a>
              <a href="#measuring-success" className="block text-white/70 hover:text-[#cff128] transition-colors">
                7. Measuring Success & Next Steps
              </a>
            </nav>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {/* Section 1 */}
            <section id="why-meta-ads" className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">1. Why Meta Ads for E-commerce?</h2>
              <p className="text-white/70 mb-4">
                Meta (Facebook & Instagram) remains one of the most powerful advertising platforms for e-commerce brands.
                With over 3 billion monthly active users and sophisticated targeting capabilities, it offers unparalleled
                reach and the ability to find your ideal customers at scale.
              </p>
              <p className="text-white/70 mb-4">
                For DTC brands specifically, Meta Ads excel because:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] mt-0.5 flex-shrink-0" />
                  <span className="text-white/70"><strong className="text-white">Visual-first platform</strong> - Perfect for showcasing products through images and video</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] mt-0.5 flex-shrink-0" />
                  <span className="text-white/70"><strong className="text-white">Powerful algorithm</strong> - Meta's machine learning finds buyers you'd never discover manually</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] mt-0.5 flex-shrink-0" />
                  <span className="text-white/70"><strong className="text-white">Full-funnel capability</strong> - From awareness to purchase in one platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] mt-0.5 flex-shrink-0" />
                  <span className="text-white/70"><strong className="text-white">Scalable</strong> - From $10/day to $10,000/day with the right approach</span>
                </li>
              </ul>
              <div className="p-4 rounded-xl bg-[#cff128]/10 border border-[#cff128]/20">
                <p className="text-sm text-white/70">
                  <strong className="text-[#cff128]">Pro tip:</strong> While Meta's targeting has changed post-iOS 14.5,
                  the algorithm has actually become better at finding conversions when given the right creative signals.
                  Creative quality matters more than ever.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="account-setup" className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">2. Setting Up Your Business Manager & Ad Account</h2>
              <p className="text-white/70 mb-4">
                Before running ads, you need to set up the proper account structure. This includes Business Manager,
                Ad Account, and connecting your Pages and Instagram accounts.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Step 1: Create a Business Manager</h3>
              <p className="text-white/70 mb-4">
                Go to <code className="px-2 py-1 bg-white/10 rounded text-[#cff128]">business.facebook.com</code> and create
                a Business Manager account. This is your central hub for all advertising assets.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Step 2: Set Up Your Ad Account</h3>
              <p className="text-white/70 mb-4">
                In Business Settings, create a new Ad Account. Important settings to configure:
              </p>
              <ul className="space-y-2 mb-6 text-white/70">
                <li>• <strong className="text-white">Time zone:</strong> Match your business time zone for easier reporting</li>
                <li>• <strong className="text-white">Currency:</strong> Select your primary currency (you can't change this later)</li>
                <li>• <strong className="text-white">Payment method:</strong> Add a credit card or PayPal for ad billing</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Step 3: Connect Your Assets</h3>
              <p className="text-white/70 mb-4">
                Connect your Facebook Page, Instagram account, and website domain. Verify your domain to unlock
                more conversion events for tracking.
              </p>
            </section>

            {/* Section 3 */}
            <section id="pixel-setup" className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">3. Installing the Meta Pixel & Tracking Events</h2>
              <p className="text-white/70 mb-4">
                The Meta Pixel is essential for tracking conversions and building audiences. Without proper tracking,
                you're flying blind.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Base Pixel Installation</h3>
              <p className="text-white/70 mb-4">
                Add the base pixel code to your website header. If you're on Shopify, this is done automatically
                through the Facebook sales channel integration.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Essential Events to Track</h3>
              <p className="text-white/70 mb-4">
                For e-commerce, you need these events firing correctly:
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-white/50 font-medium">Event</th>
                      <th className="text-left py-2 text-white/50 font-medium">When It Fires</th>
                      <th className="text-left py-2 text-white/50 font-medium">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    <tr className="border-b border-white/5">
                      <td className="py-2 font-mono text-[#cff128]">Purchase</td>
                      <td className="py-2">Order confirmation page</td>
                      <td className="py-2 text-red-400">Critical</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 font-mono text-[#cff128]">AddToCart</td>
                      <td className="py-2">Product added to cart</td>
                      <td className="py-2 text-yellow-400">High</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 font-mono text-[#cff128]">InitiateCheckout</td>
                      <td className="py-2">Checkout started</td>
                      <td className="py-2 text-yellow-400">High</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 font-mono text-[#cff128]">ViewContent</td>
                      <td className="py-2">Product page view</td>
                      <td className="py-2 text-green-400">Medium</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-[#cff128]">PageView</td>
                      <td className="py-2">Every page</td>
                      <td className="py-2 text-green-400">Medium</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-[#cff128]/10 border border-[#cff128]/20">
                <p className="text-sm text-white/70">
                  <strong className="text-[#cff128]">Important:</strong> In 2024, you should also set up the Conversions API (CAPI)
                  for server-side tracking. This improves data quality and helps offset iOS tracking limitations.
                  Use our <Link href="/guides/facebook-pixel-setup" className="text-[#cff128] hover:underline">detailed pixel setup guide</Link> for instructions.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="campaign-structure" className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">4. Understanding Campaign Structure</h2>
              <p className="text-white/70 mb-4">
                Meta Ads has a three-tier structure: Campaign → Ad Set → Ad. Understanding this hierarchy
                is crucial for organizing your advertising.
              </p>

              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">Campaign Level</h4>
                  <p className="text-sm text-white/70">
                    Set your objective (what you want to achieve). For e-commerce, this is typically "Sales."
                    Budget can be set here (CBO) or at ad set level.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">Ad Set Level</h4>
                  <p className="text-sm text-white/70">
                    Define your audience (targeting), placement (where ads show), schedule, and optimization goal.
                    Each ad set can target different audiences.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">Ad Level</h4>
                  <p className="text-sm text-white/70">
                    The actual creative - your images/videos, copy, headlines, and landing page URLs.
                    This is what users see in their feed.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="first-campaign" className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">5. Creating Your First Campaign</h2>
              <p className="text-white/70 mb-4">
                Let's walk through creating a simple but effective first campaign structure.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Recommended First Campaign Setup</h3>
              <ul className="space-y-2 mb-6 text-white/70">
                <li>• <strong className="text-white">Objective:</strong> Sales (Conversions)</li>
                <li>• <strong className="text-white">Optimization:</strong> Purchase</li>
                <li>• <strong className="text-white">Budget:</strong> $50-100/day to start (CBO)</li>
                <li>• <strong className="text-white">Audience:</strong> Broad targeting (no detailed targeting)</li>
                <li>• <strong className="text-white">Placements:</strong> Advantage+ placements (all placements)</li>
                <li>• <strong className="text-white">Ads:</strong> 3-5 different creatives to test</li>
              </ul>

              <div className="p-4 rounded-xl bg-[#cff128]/10 border border-[#cff128]/20 mb-6">
                <p className="text-sm text-white/70">
                  <strong className="text-[#cff128]">Why broad targeting?</strong> In 2024, Meta's algorithm is sophisticated
                  enough to find your buyers without detailed interest targeting. Starting broad gives the algorithm
                  more room to learn and often outperforms narrow audiences.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Creative Best Practices</h3>
              <p className="text-white/70 mb-4">
                Your creative is the most important variable. For your first campaign, include:
              </p>
              <ul className="space-y-2 mb-6 text-white/70">
                <li>• <strong className="text-white">1 video ad:</strong> Product demo or founder story (15-30 seconds)</li>
                <li>• <strong className="text-white">1 static image:</strong> Product hero shot with key benefit</li>
                <li>• <strong className="text-white">1 carousel:</strong> Multiple products or benefits</li>
                <li>• <strong className="text-white">1 UGC-style:</strong> Customer testimonial or unboxing</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="budgets-bidding" className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">6. Budgets, Bidding & Optimization</h2>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Starting Budget</h3>
              <p className="text-white/70 mb-4">
                Your budget should allow for at least 50 optimization events (purchases) per week per ad set.
                If your CPA is $30, you'd need at least $215/week ($30 × 50 ÷ 7) per ad set.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Bid Strategy</h3>
              <p className="text-white/70 mb-4">
                For beginners, stick with "Highest Volume" (lowest cost). This lets Meta find as many conversions
                as possible within your budget. You can experiment with cost caps later.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Learning Phase</h3>
              <p className="text-white/70 mb-4">
                New ad sets enter a "learning phase" while Meta's algorithm figures out the best way to deliver your ads.
                Avoid making changes during this phase (typically 50 optimization events or 7 days).
              </p>
            </section>

            {/* Section 7 */}
            <section id="measuring-success" className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">7. Measuring Success & Next Steps</h2>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Key Metrics to Track</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-white/50 font-medium">Metric</th>
                      <th className="text-left py-2 text-white/50 font-medium">What It Tells You</th>
                      <th className="text-left py-2 text-white/50 font-medium">Benchmark</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    <tr className="border-b border-white/5">
                      <td className="py-2">ROAS</td>
                      <td className="py-2">Revenue per dollar spent</td>
                      <td className="py-2">2-4x (varies by margin)</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2">CPA</td>
                      <td className="py-2">Cost per purchase</td>
                      <td className="py-2">Target: 1/3 of AOV</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2">CTR</td>
                      <td className="py-2">Ad engagement</td>
                      <td className="py-2">1-2%+</td>
                    </tr>
                    <tr>
                      <td className="py-2">CPM</td>
                      <td className="py-2">Cost to reach 1k people</td>
                      <td className="py-2">$10-25</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">When to Make Changes</h3>
              <ul className="space-y-2 mb-6 text-white/70">
                <li>• Wait at least 3-7 days before judging performance</li>
                <li>• Look at 7-day click attribution (not 1-day)</li>
                <li>• Kill ads with 0 purchases after 2x your target CPA in spend</li>
                <li>• Scale winners by 20-30% every 3-4 days</li>
              </ul>
            </section>

            {/* Next Steps */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-4">Ready for More?</h3>
              <div className="space-y-3">
                <Link href="/guides/scaling-meta-ads" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <span>How to Scale Meta Ads Without Destroying Your ROAS</span>
                  <ArrowRight className="h-4 w-4 text-[#cff128]" />
                </Link>
                <Link href="/guides/creative-strategy-guide" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <span>The E-commerce Creative Strategy Playbook</span>
                  <ArrowRight className="h-4 w-4 text-[#cff128]" />
                </Link>
                <Link href="/tools/roas-calculator" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <span>Use our ROAS Calculator</span>
                  <ArrowRight className="h-4 w-4 text-[#cff128]" />
                </Link>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Need Help Getting Started?</h2>
            <p className="text-black/70 mb-6">Our team has launched hundreds of successful Meta Ads campaigns for DTC brands.</p>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button className="bg-black text-white hover:bg-black/90 font-semibold">
                Work With Us <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </article>
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
