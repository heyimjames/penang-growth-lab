"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, ExternalLink, Sparkles, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { tools, toolCategories, type ToolCategory } from "@/lib/tools-data"
import { useState, useMemo, Suspense } from "react"

function ToolsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category") as ToolCategory | null

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">(categoryParam || "all")

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        searchQuery === "" ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const categories = [
    { id: "all" as const, name: "All Tools", count: tools.length },
    ...Object.entries(toolCategories).map(([id, info]) => ({
      id: id as ToolCategory,
      name: info.name,
      count: tools.filter((t) => t.category === id).length,
    })),
  ]

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
              <Link href="/tools" className="text-sm text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cff128] rounded" aria-current="page">
                Tools
              </Link>
              <Link href="/guides" className="text-sm text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cff128] rounded">
                Guides
              </Link>
              <Link href="/blog" className="text-sm text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cff128] rounded">
                Blog
              </Link>
              <Link
                href="https://www.penangmedia.com"
                target="_blank"
                className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cff128] rounded"
              >
                Penang Media <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button>
                Work With Us
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-12 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Tools</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Free E-Commerce Tools</h1>
          <p className="text-lg text-white/60 max-w-2xl">
            Calculators, AI-powered generators, and analytics tools to help you scale your DTC brand profitably.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#cff128]/50 focus:ring-[#cff128]/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Categories</h3>
                <nav className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-[#cff128]/10 text-[#cff128]"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-xs ${selectedCategory === cat.id ? "text-[#cff128]/70" : "text-white/40"}`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tools grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-white/50">
                  {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
                </p>
              </div>

              {filteredTools.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-white/50">No tools found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                    className="mt-4 text-[#cff128] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 hover:bg-white/[0.07] transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-[#cff128]/10 text-[#cff128] group-hover:bg-[#cff128]/20 transition-colors">
                          <tool.icon className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          {tool.isAI && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-[#cff128]/10 text-[#cff128] rounded-full flex items-center gap-1">
                              <Sparkles className="h-3 w-3" /> AI
                            </span>
                          )}
                          {tool.isNew && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-[#cff128] transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-white/50 line-clamp-2">
                        {tool.shortDescription}
                      </p>
                      <div className="mt-4 flex items-center text-sm text-[#cff128] opacity-0 group-hover:opacity-100 transition-opacity">
                        Use tool <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help Scaling Your Brand?</h2>
          <p className="text-white/60 mb-6 max-w-xl mx-auto">
            Our team at Penang Media has helped 100+ DTC brands achieve 4-5x ROAS.
          </p>
          <Link href="https://www.penangmedia.com" target="_blank">
            <Button>
              Get in Touch <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold">PENANG</span>
              <span className="text-lg font-bold text-[#cff128]">GROWTH LAB</span>
            </Link>
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} Penang Media. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <ToolsContent />
    </Suspense>
  )
}
