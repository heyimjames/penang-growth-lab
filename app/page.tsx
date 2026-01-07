"use client"

import Link from "next/link"
import { ArrowRight, Zap, Calculator, TrendingUp, PenTool, BarChart3, Target, Sparkles, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { featuredTools, tools } from "@/lib/tools-data"

export default function HomePage() {
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
              <Link href="/tools" className="text-sm text-white/70 hover:text-white transition-colors">
                Tools
              </Link>
              <Link href="/guides" className="text-sm text-white/70 hover:text-white transition-colors">
                Guides
              </Link>
              <Link href="/blog" className="text-sm text-white/70 hover:text-white transition-colors">
                Blog
              </Link>
              <Link
                href="https://www.penangmedia.com"
                target="_blank"
                className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1"
              >
                Penang Media <ExternalLink className="h-3 w-3" />
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-50" />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#cff128]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#cff128]/5 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="h-4 w-4 text-[#cff128]" />
              <span className="text-sm text-white/70">Free tools for e-commerce brands</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
              SCALE YOUR
              <br />
              <span className="text-[#cff128]">E-COMMERCE</span>
              <br />
              BRAND
            </h1>

            {/* Subheadline */}
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-10">
              Free calculators, AI-powered tools, and expert guides to help DTC brands
              grow profitably. Built by the team at Penang Media.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tools">
                <Button size="lg" className="bg-[#cff128] text-black hover:bg-[#e5f875] font-semibold text-lg px-8 h-14">
                  Explore Free Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/guides">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 font-semibold text-lg px-8 h-14">
                  Read Guides
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#cff128]">{tools.length}+</div>
                <div className="text-sm text-white/50 mt-1">Free Tools</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#cff128]">$50M+</div>
                <div className="text-sm text-white/50 mt-1">Ad Spend Managed</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#cff128]">100+</div>
                <div className="text-sm text-white/50 mt-1">Brands Scaled</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Featured Tools</h2>
              <p className="text-white/60 mt-2">Our most popular free tools</p>
            </div>
            <Link href="/tools" className="hidden sm:flex items-center gap-2 text-[#cff128] hover:underline">
              View all tools <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-[#cff128]/10 text-[#cff128] group-hover:bg-[#cff128]/20 transition-colors">
                    <tool.icon className="h-6 w-6" />
                  </div>
                  {tool.isAI && (
                    <span className="px-2 py-1 text-xs font-medium bg-[#cff128]/10 text-[#cff128] rounded-full">
                      AI
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[#cff128] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-white/50">
                  {tool.shortDescription}
                </p>
                <div className="mt-4 flex items-center text-sm text-[#cff128] opacity-0 group-hover:opacity-100 transition-opacity">
                  Try now <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>

          <Link href="/tools" className="sm:hidden flex items-center justify-center gap-2 mt-8 text-[#cff128]">
            View all tools <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-20 md:py-32 bg-white/[0.02] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Scale</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              From calculating your metrics to generating ad copy, we have the tools to help you grow.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Calculators */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              <Calculator className="h-10 w-10 text-[#cff128] mb-6" />
              <h3 className="text-xl font-semibold mb-3">Calculators</h3>
              <p className="text-white/50 mb-6">
                ROAS, profit margins, LTV, CAC, and more. Know your numbers inside out.
              </p>
              <Link href="/tools?category=calculators" className="text-[#cff128] text-sm flex items-center gap-1 hover:underline">
                9 calculators <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* AI Tools */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              <Sparkles className="h-10 w-10 text-[#cff128] mb-6" />
              <h3 className="text-xl font-semibold mb-3">AI Tools</h3>
              <p className="text-white/50 mb-6">
                Generate ad copy, headlines, product descriptions, and get creative feedback.
              </p>
              <Link href="/tools?category=ai-tools" className="text-[#cff128] text-sm flex items-center gap-1 hover:underline">
                7 AI tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Analytics */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              <BarChart3 className="h-10 w-10 text-[#cff128] mb-6" />
              <h3 className="text-xl font-semibold mb-3">Analytics</h3>
              <p className="text-white/50 mb-6">
                Benchmark your metrics, predict ad fatigue, and assess scaling readiness.
              </p>
              <Link href="/tools?category=analytics" className="text-[#cff128] text-sm flex items-center gap-1 hover:underline">
                3 analytics tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Email */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              <PenTool className="h-10 w-10 text-[#cff128] mb-6" />
              <h3 className="text-xl font-semibold mb-3">Email Marketing</h3>
              <p className="text-white/50 mb-6">
                Subject line generators, email flow planners, and automation templates.
              </p>
              <Link href="/tools?category=email" className="text-[#cff128] text-sm flex items-center gap-1 hover:underline">
                2 email tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Tracking */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              <Target className="h-10 w-10 text-[#cff128] mb-6" />
              <h3 className="text-xl font-semibold mb-3">Tracking & Attribution</h3>
              <p className="text-white/50 mb-6">
                UTM builders, A/B test calculators, and attribution model guides.
              </p>
              <Link href="/tools?category=tracking" className="text-[#cff128] text-sm flex items-center gap-1 hover:underline">
                3 tracking tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Guides */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20">
              <TrendingUp className="h-10 w-10 text-[#cff128] mb-6" />
              <h3 className="text-xl font-semibold mb-3">Expert Guides</h3>
              <p className="text-white/50 mb-6">
                In-depth playbooks on Meta Ads, Google Ads, email marketing, and more.
              </p>
              <Link href="/guides" className="text-[#cff128] text-sm flex items-center gap-1 hover:underline">
                Browse guides <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Penang Media Section */}
      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built by the Team Behind
                <span className="text-[#cff128]"> 8-Figure Brands</span>
              </h2>
              <p className="text-lg text-white/60 mb-8">
                Penang Media has helped DTC brands scale from startup to 8-figure revenue.
                We built these tools based on what we use internally to drive results for our clients.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-[#cff128]/20">
                    <Zap className="h-4 w-4 text-[#cff128]" />
                  </div>
                  <div>
                    <div className="font-medium">Tens of millions in ad spend data</div>
                    <div className="text-sm text-white/50">Benchmarks based on real campaign performance</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-[#cff128]/20">
                    <Zap className="h-4 w-4 text-[#cff128]" />
                  </div>
                  <div>
                    <div className="font-medium">Battle-tested frameworks</div>
                    <div className="text-sm text-white/50">The same tools we use for our clients</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-[#cff128]/20">
                    <Zap className="h-4 w-4 text-[#cff128]" />
                  </div>
                  <div>
                    <div className="font-medium">Always free, no catch</div>
                    <div className="text-sm text-white/50">Use our tools whether you work with us or not</div>
                  </div>
                </li>
              </ul>
              <Link href="https://www.penangmedia.com" target="_blank">
                <Button className="bg-[#cff128] text-black hover:bg-[#e5f875] font-semibold">
                  Learn About Penang Media
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Stats card */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#cff128]/5 rounded-3xl blur-3xl" />
              <div className="relative p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-4xl md:text-5xl font-bold text-[#cff128]">4-5x</div>
                    <div className="text-white/50 mt-2">Average client ROAS</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold text-[#cff128]">12+</div>
                    <div className="text-white/50 mt-2">Months avg partnership</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold text-[#cff128]">6x</div>
                    <div className="text-white/50 mt-2">Daily customer increase</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold text-[#cff128]">10+</div>
                    <div className="text-white/50 mt-2">Years experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-[#cff128]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">
            Ready to Scale Your Brand?
          </h2>
          <p className="text-lg text-black/70 max-w-2xl mx-auto mb-10">
            Start with our free tools, or talk to our team about how Penang Media
            can help you reach your growth goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tools">
              <Button size="lg" className="bg-black text-white hover:bg-black/90 font-semibold text-lg px-8 h-14">
                Explore Free Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button size="lg" variant="outline" className="border-black/30 text-black hover:bg-black/5 font-semibold text-lg px-8 h-14">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold">PENANG</span>
                <span className="text-lg font-bold text-[#cff128]">GROWTH LAB</span>
              </Link>
              <p className="text-sm text-white/50">
                Free tools and resources for e-commerce brands. Built by Penang Media.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="/tools/roas-calculator" className="hover:text-white transition-colors">ROAS Calculator</Link></li>
                <li><Link href="/tools/ad-copy-generator" className="hover:text-white transition-colors">Ad Copy Generator</Link></li>
                <li><Link href="/tools/break-even-roas" className="hover:text-white transition-colors">Break-Even ROAS</Link></li>
                <li><Link href="/tools" className="hover:text-white transition-colors">All Tools</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/glossary" className="hover:text-white transition-colors">Glossary</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Penang Media</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="https://www.penangmedia.com" target="_blank" className="hover:text-white transition-colors">Website</Link></li>
                <li><Link href="https://www.penangmedia.com/#services" target="_blank" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="https://www.penangmedia.com/#contact" target="_blank" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} Penang Media. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
