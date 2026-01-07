"use client"

import Link from "next/link"
import { Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllPosts, getFeaturedPosts, blogCategories } from "@/lib/blog-data"

const allPosts = getAllPosts()
const categories = ["All", ...Object.values(blogCategories).map(c => c.name)]

export default function BlogPage() {
  const featuredPosts = allPosts.filter(p => p.featured)
  const recentPosts = allPosts.filter(p => !p.featured)

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
              <Link href="/guides" className="text-sm text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cff128] rounded">Guides</Link>
              <Link href="/blog" className="text-sm text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cff128] rounded" aria-current="page">Blog</Link>
              <Link
                href="https://www.penangmedia.com"
                target="_blank"
                className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cff128] rounded"
              >
                Penang Media <ExternalLink className="h-3 w-3" />
              </Link>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              The Growth Lab Blog
            </h1>
            <p className="text-xl text-white/60">
              Insights on e-commerce growth, paid advertising, and creative strategy.
              Straight from the trenches of managing millions in ad spend.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Posts */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Featured</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group relative overflow-hidden rounded-2xl ${
                    index === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <div className={`p-6 h-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 group-hover:border-[#cff128]/50 transition-all ${
                    index === 0 ? "md:p-8" : ""
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-[#cff128] bg-[#cff128]/10 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h3 className={`font-bold mb-2 group-hover:text-[#cff128] transition-colors ${
                      index === 0 ? "text-2xl md:text-3xl" : "text-lg"
                    }`}>
                      {post.title}
                    </h3>
                    <p className={`text-white/60 mb-4 ${index === 0 ? "text-base" : "text-sm"}`}>
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* All Posts */}
          <section>
            <h2 className="text-2xl font-bold mb-6">All Posts</h2>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex items-start gap-6 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-[#cff128]">{post.category}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-xs text-white/40">{post.date}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-xs text-white/40">{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-[#cff128] transition-colors mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-white/50 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-[#cff128] transition-colors flex-shrink-0 mt-2" />
                </Link>
              ))}
            </div>
          </section>

          {/* Newsletter */}
          <div className="mt-16 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Get Growth Insights Delivered
            </h2>
            <p className="text-white/60 mb-6 max-w-xl mx-auto">
              Join 5,000+ e-commerce operators getting weekly insights on paid ads,
              creative strategy, and growth tactics.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cff128] focus-visible:border-[#cff128] text-base min-h-[44px] transition-all"
              />
              <Button className="px-6">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-white/40 mt-3">No spam. Unsubscribe anytime.</p>
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
