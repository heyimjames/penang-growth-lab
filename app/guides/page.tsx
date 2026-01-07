"use client"

import Link from "next/link"
import { BookOpen, Clock, ArrowRight, TrendingUp, Target, Zap, Users, DollarSign, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

const guides = [
  {
    slug: "meta-ads-beginners-guide",
    title: "The Complete Beginner's Guide to Meta Ads for E-commerce",
    description: "Everything you need to know to launch your first profitable Meta advertising campaign. From account setup to your first sale.",
    readTime: "25 min read",
    category: "Meta Ads",
    icon: Target,
    featured: true,
  },
  {
    slug: "scaling-meta-ads",
    title: "How to Scale Meta Ads Without Destroying Your ROAS",
    description: "Learn the proven strategies for scaling your Meta campaigns from $1k to $100k+ in monthly spend while maintaining profitability.",
    readTime: "20 min read",
    category: "Meta Ads",
    icon: TrendingUp,
    featured: true,
  },
  {
    slug: "creative-strategy-guide",
    title: "The E-commerce Creative Strategy Playbook",
    description: "How to develop a winning creative strategy, test systematically, and find ads that scale. Includes frameworks and examples.",
    readTime: "30 min read",
    category: "Creative",
    icon: Zap,
    featured: true,
  },
  {
    slug: "facebook-pixel-setup",
    title: "Facebook Pixel & Conversions API Setup Guide",
    description: "Step-by-step guide to setting up the Facebook Pixel, Conversions API, and tracking events for accurate attribution.",
    readTime: "15 min read",
    category: "Tracking",
    icon: BarChart3,
  },
  {
    slug: "audience-targeting-guide",
    title: "Meta Ads Audience Targeting in 2024",
    description: "How to build effective audiences in the post-iOS 14.5 era. Broad vs interests vs lookalikes explained.",
    readTime: "18 min read",
    category: "Meta Ads",
    icon: Users,
  },
  {
    slug: "unit-economics-guide",
    title: "Understanding E-commerce Unit Economics",
    description: "Master the metrics that matter: CAC, LTV, contribution margin, and how they affect your advertising strategy.",
    readTime: "22 min read",
    category: "Fundamentals",
    icon: DollarSign,
  },
  {
    slug: "google-ads-ecommerce",
    title: "Google Ads for E-commerce: Complete Guide",
    description: "From Shopping campaigns to Performance Max, learn how to set up and optimize Google Ads for your store.",
    readTime: "28 min read",
    category: "Google Ads",
    icon: Target,
  },
  {
    slug: "creative-testing-framework",
    title: "The Creative Testing Framework That Finds Winners",
    description: "A systematic approach to testing creatives, identifying patterns, and scaling winners. Used by 8-figure brands.",
    readTime: "20 min read",
    category: "Creative",
    icon: Zap,
  },
]

const categories = [
  { name: "All", count: guides.length },
  { name: "Meta Ads", count: guides.filter(g => g.category === "Meta Ads").length },
  { name: "Creative", count: guides.filter(g => g.category === "Creative").length },
  { name: "Google Ads", count: guides.filter(g => g.category === "Google Ads").length },
  { name: "Fundamentals", count: guides.filter(g => g.category === "Fundamentals").length },
  { name: "Tracking", count: guides.filter(g => g.category === "Tracking").length },
]

export default function GuidesPage() {
  const featuredGuides = guides.filter(g => g.featured)
  const otherGuides = guides.filter(g => !g.featured)

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
              <Link href="/tools" className="text-sm text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cff128] rounded">Tools</Link>
              <Link href="/guides" className="text-sm text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cff128] rounded" aria-current="page">Guides</Link>
              <Link href="/blog" className="text-sm text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cff128] rounded">Blog</Link>
            </div>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button>Work With Us</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#cff128]/10">
                <BookOpen className="h-6 w-6 text-[#cff128]" />
              </div>
              <span className="text-sm font-medium text-[#cff128]">Free Guides</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              E-commerce Marketing Guides
            </h1>
            <p className="text-xl text-white/60">
              In-depth guides covering everything from Meta Ads fundamentals to advanced scaling strategies.
              Built from experience managing millions in ad spend.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors"
              >
                {cat.name} <span className="text-white/40">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Featured Guides */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Featured Guides</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#cff128]/10">
                      <guide.icon className="h-5 w-5 text-[#cff128]" />
                    </div>
                    <span className="text-xs font-medium text-[#cff128] bg-[#cff128]/10 px-2 py-1 rounded-full">
                      {guide.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[#cff128] transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-white/60 mb-4">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-white/40">
                      <Clock className="h-3 w-3" />
                      {guide.readTime}
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-[#cff128] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* All Guides */}
          <section>
            <h2 className="text-2xl font-bold mb-6">All Guides</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {otherGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group flex items-start gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-all"
                >
                  <div className="p-2 rounded-lg bg-[#cff128]/10 flex-shrink-0">
                    <guide.icon className="h-5 w-5 text-[#cff128]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#cff128]">{guide.category}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-xs text-white/40">{guide.readTime}</span>
                    </div>
                    <h3 className="font-semibold group-hover:text-[#cff128] transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-white/50 mt-1 line-clamp-2">
                      {guide.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-[#cff128] transition-colors flex-shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="mt-16 p-8 md:p-12 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
              Want Personalized Strategy?
            </h2>
            <p className="text-black/70 mb-6 max-w-xl mx-auto">
              These guides are great for learning, but every brand is different.
              Let's discuss a strategy tailored to your specific situation.
            </p>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button size="lg" variant="dark">
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
