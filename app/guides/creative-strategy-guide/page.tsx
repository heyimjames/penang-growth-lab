"use client"

import Link from "next/link"
import { ArrowLeft, Clock, Zap, CheckCircle, Lightbulb, Target, Layers, Video, Image } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreativeStrategyGuide() {
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
                Creative
              </span>
              <span className="text-sm text-white/40 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                30 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              The E-commerce Creative Strategy Playbook
            </h1>
            <p className="text-xl text-white/60">
              How to develop a winning creative strategy, test systematically, and find ads that scale. Includes frameworks and examples.
            </p>
          </header>

          {/* Table of Contents */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-12">
            <h2 className="font-semibold mb-4">In This Guide</h2>
            <ul className="space-y-2 text-white/60">
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">1.</span> The Creative-First Mindset
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">2.</span> Understanding Creative Formats
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">3.</span> The Modular Creative Framework
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">4.</span> Hook Development Strategies
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">5.</span> Testing Methodology
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#cff128]">6.</span> Scaling Winners
              </li>
            </ul>
          </div>

          {/* Content */}
          <article className="prose prose-invert max-w-none">
            {/* Section 1 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <Lightbulb className="h-5 w-5 text-[#cff128]" />
                </span>
                The Creative-First Mindset
              </h2>
              <p className="text-white/70 mb-4">
                In 2024, creative is the new targeting. With Meta's broad targeting and Advantage+ campaigns dominating,
                the algorithm decides who sees your ads. Your job is to give it the best creative possible.
              </p>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 my-6">
                <h4 className="font-semibold text-white mb-3">The Modern Media Buying Reality</h4>
                <p className="text-sm text-white/60 mb-4">
                  Creative accounts for 60-80% of ad performance. Targeting and bidding strategy? Maybe 20-40%.
                  This means your creative team is now your most important growth lever.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-4 rounded-lg bg-black/30">
                    <div className="text-3xl font-bold text-[#cff128]">70%</div>
                    <div className="text-xs text-white/50 mt-1">Impact from Creative</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-black/30">
                    <div className="text-3xl font-bold text-white/50">30%</div>
                    <div className="text-xs text-white/50 mt-1">Impact from Targeting</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <Layers className="h-5 w-5 text-[#cff128]" />
                </span>
                Understanding Creative Formats
              </h2>
              <p className="text-white/70 mb-4">
                Different formats serve different purposes. Here's when to use each:
              </p>
              <div className="grid gap-4 my-6">
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Video className="h-5 w-5 text-[#cff128]" />
                    <h4 className="font-semibold">UGC Video (15-60 seconds)</h4>
                  </div>
                  <p className="text-sm text-white/60 mb-3">
                    Best for: Building trust, demonstrating product, telling stories
                  </p>
                  <ul className="text-sm text-white/50 space-y-1">
                    <li>• Hook must grab attention in first 3 seconds</li>
                    <li>• Sound-off optimized with captions</li>
                    <li>• Mobile-first vertical format (9:16)</li>
                  </ul>
                </div>
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Image className="h-5 w-5 text-[#cff128]" />
                    <h4 className="font-semibold">Static Images</h4>
                  </div>
                  <p className="text-sm text-white/60 mb-3">
                    Best for: Offers, social proof, product showcases, retargeting
                  </p>
                  <ul className="text-sm text-white/50 space-y-1">
                    <li>• Clear, readable text (20% rule is gone but clarity matters)</li>
                    <li>• High contrast for thumb-stopping power</li>
                    <li>• Single clear message per image</li>
                  </ul>
                </div>
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Layers className="h-5 w-5 text-[#cff128]" />
                    <h4 className="font-semibold">Carousel</h4>
                  </div>
                  <p className="text-sm text-white/60 mb-3">
                    Best for: Product collections, step-by-step benefits, storytelling
                  </p>
                  <ul className="text-sm text-white/50 space-y-1">
                    <li>• First card must stand alone and hook</li>
                    <li>• Create "slide bait" to encourage swiping</li>
                    <li>• End with clear CTA</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <Target className="h-5 w-5 text-[#cff128]" />
                </span>
                The Modular Creative Framework
              </h2>
              <p className="text-white/70 mb-4">
                Instead of creating ads from scratch, break them into modules that can be mixed and matched:
              </p>
              <div className="p-6 rounded-xl bg-[#cff128]/10 border border-[#cff128]/20 my-6">
                <h4 className="font-semibold text-[#cff128] mb-4">Creative Module System</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-1 rounded bg-black/30 text-xs font-mono text-[#cff128]">HOOK</span>
                    <div>
                      <p className="text-sm text-white/80">Opening 3 seconds that grabs attention</p>
                      <p className="text-xs text-white/50 mt-1">Problem statement, pattern interrupt, curiosity gap</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-1 rounded bg-black/30 text-xs font-mono text-[#cff128]">BODY</span>
                    <div>
                      <p className="text-sm text-white/80">Main content that educates or entertains</p>
                      <p className="text-xs text-white/50 mt-1">Demo, testimonial, benefits, story</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-1 rounded bg-black/30 text-xs font-mono text-[#cff128]">CTA</span>
                    <div>
                      <p className="text-sm text-white/80">Clear call-to-action with urgency</p>
                      <p className="text-xs text-white/50 mt-1">Offer, scarcity, social proof</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-white/70">
                With 5 hooks, 3 bodies, and 3 CTAs, you can create 45 unique ad variations from the same base content.
                This is the key to testing at scale.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#cff128]/10">
                  <Zap className="h-5 w-5 text-[#cff128]" />
                </span>
                Hook Development Strategies
              </h2>
              <p className="text-white/70 mb-4">
                The hook is everything. Here are proven hook formulas that work for e-commerce:
              </p>
              <div className="grid gap-3 my-6">
                {[
                  { type: "Problem Call-Out", example: '"Tired of [problem]? I was too until..."' },
                  { type: "Pattern Interrupt", example: '"Stop scrolling! You need to see this..."' },
                  { type: "Social Proof", example: '"10,000+ people have already discovered..."' },
                  { type: "Curiosity Gap", example: '"The reason your [thing] isn\'t working..."' },
                  { type: "Transformation", example: '"Before vs After using [product]..."' },
                  { type: "Controversy", example: '"Unpopular opinion: [statement]..."' },
                  { type: "Educational", example: '"3 things nobody tells you about..."' },
                  { type: "Direct Benefit", example: '"Get [specific result] in [timeframe]..."' },
                ].map((hook, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[#cff128] font-semibold text-sm w-40 flex-shrink-0">{hook.type}</span>
                    <span className="text-white/60 text-sm italic">{hook.example}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Testing Methodology</h2>
              <p className="text-white/70 mb-4">
                Creative testing should be systematic, not random. Here's our framework:
              </p>
              <div className="space-y-4 my-6">
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">Phase 1: Concept Testing</h4>
                  <p className="text-sm text-white/60">
                    Test different concepts/angles (3-5 variations) with broad targeting. Goal: Find which message resonates.
                    Budget: $20-50 per concept over 3-5 days.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">Phase 2: Hook Testing</h4>
                  <p className="text-sm text-white/60">
                    Take winning concepts and test multiple hooks (5-10 variations). Same body and CTA.
                    Goal: Maximize thumb-stop rate. Budget: $10-20 per hook variation.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#cff128] mb-2">Phase 3: Element Testing</h4>
                  <p className="text-sm text-white/60">
                    Fine-tune winning combinations by testing CTAs, thumbnails, captions, and music.
                    Goal: Incremental improvements. Budget: $5-10 per variation.
                  </p>
                </div>
              </div>
            </section>

            {/* Key Takeaways */}
            <section className="p-6 rounded-2xl bg-[#cff128]/10 border border-[#cff128]/20 mb-12">
              <h3 className="font-bold text-lg mb-4">Key Takeaways</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Creative is the #1 lever for performance - invest heavily here</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Use the modular framework to create variations efficiently</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">The hook determines 80% of whether someone watches your ad</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Test systematically: concepts → hooks → elements</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#cff128] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Aim for 15-30+ new creatives per month at scale</span>
                </li>
              </ul>
            </section>
          </article>

          {/* CTA */}
          <div className="p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Need Help With Creative Strategy?</h2>
            <p className="text-black/70 mb-6">
              We produce hundreds of winning creatives for DTC brands every month. Let's talk about your creative needs.
            </p>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button className="bg-black text-white hover:bg-black/90 font-semibold">
                Get Creative Support
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
