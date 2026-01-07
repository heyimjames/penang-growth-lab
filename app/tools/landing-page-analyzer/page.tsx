"use client"

import { useState } from "react"
import Link from "next/link"
import { Globe, Sparkles, ArrowLeft, Loader2, AlertCircle, CheckCircle2, TrendingUp, Layout, Type, Users, MousePointer, Palette, FileText, Shield, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SectionAnalysis {
  score: number
  feedback: string
  suggestions: string[]
}

interface LandingPageAnalysis {
  overallScore: number
  conversionPotential: "low" | "medium" | "high"
  sections: {
    headline: SectionAnalysis
    valueProposition: SectionAnalysis
    socialProof: SectionAnalysis
    cta: SectionAnalysis
    visualDesign: SectionAnalysis
    copywriting: SectionAnalysis
    trustSignals: SectionAnalysis
    mobileOptimization: SectionAnalysis
  }
  prioritizedActions: string[]
  competitiveInsights: string
}

const pageTypes = [
  { id: "product", label: "Product Page" },
  { id: "landing", label: "Landing Page" },
  { id: "collection", label: "Collection Page" },
  { id: "homepage", label: "Homepage" },
  { id: "checkout", label: "Checkout" },
]

const industries = [
  { id: "ecommerce", label: "E-commerce / DTC" },
  { id: "saas", label: "SaaS / Software" },
  { id: "fashion", label: "Fashion / Apparel" },
  { id: "beauty", label: "Beauty / Skincare" },
  { id: "fitness", label: "Fitness / Health" },
  { id: "food", label: "Food / Beverage" },
  { id: "home", label: "Home / Furniture" },
  { id: "other", label: "Other" },
]

const sectionConfig = {
  headline: { label: "Headline", icon: Type, description: "First impression and hook" },
  valueProposition: { label: "Value Proposition", icon: TrendingUp, description: "What makes you unique" },
  socialProof: { label: "Social Proof", icon: Users, description: "Reviews, testimonials, trust" },
  cta: { label: "Call-to-Action", icon: MousePointer, description: "Button placement and copy" },
  visualDesign: { label: "Visual Design", icon: Palette, description: "Layout and aesthetics" },
  copywriting: { label: "Copywriting", icon: FileText, description: "Persuasion and clarity" },
  trustSignals: { label: "Trust Signals", icon: Shield, description: "Security and guarantees" },
  mobileOptimization: { label: "Mobile UX", icon: Smartphone, description: "Mobile experience" },
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e"
    if (score >= 60) return "#cff128"
    if (score >= 40) return "#f59e0b"
    return "#ef4444"
  }

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-xs text-white/50">/ 100</span>
      </div>
    </div>
  )
}

function SectionCard({
  sectionKey,
  data,
  isExpanded,
  onToggle
}: {
  sectionKey: keyof typeof sectionConfig
  data: SectionAnalysis
  isExpanded: boolean
  onToggle: () => void
}) {
  const config = sectionConfig[sectionKey]
  const Icon = config.icon

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-[#cff128]"
    if (score >= 40) return "text-amber-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500/10"
    if (score >= 60) return "bg-[#cff128]/10"
    if (score >= 40) return "bg-amber-500/10"
    return "bg-red-500/10"
  }

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getScoreBg(data.score)}`}>
            <Icon className={`h-5 w-5 ${getScoreColor(data.score)}`} />
          </div>
          <div className="text-left">
            <h3 className="font-medium">{config.label}</h3>
            <p className="text-xs text-white/50">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>{data.score}</span>
          <svg
            className={`h-5 w-5 text-white/40 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/5">
          <p className="text-sm text-white/70 mb-4">{data.feedback}</p>
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-[#cff128] uppercase tracking-wide">Suggestions</h4>
            {data.suggestions.map((suggestion, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#cff128] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/60">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function LandingPageAnalyzerPage() {
  const [url, setUrl] = useState("")
  const [pageType, setPageType] = useState("product")
  const [industry, setIndustry] = useState("ecommerce")
  const [targetAudience, setTargetAudience] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<LandingPageAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>("headline")

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const analyzePage = async () => {
    if (!url) {
      setError("Please enter a URL to analyze")
      return
    }

    let normalizedUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      normalizedUrl = "https://" + url
    }

    if (!isValidUrl(normalizedUrl)) {
      setError("Please enter a valid URL")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze/landing-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: normalizedUrl,
          pageType,
          industry,
          targetAudience,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze page")
      }

      const result = await response.json()
      setAnalysis(result)
    } catch {
      setError("Failed to analyze page. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getConversionPotentialColor = (potential: string) => {
    switch (potential) {
      case "high": return "text-green-400 bg-green-500/10"
      case "medium": return "text-[#cff128] bg-[#cff128]/10"
      case "low": return "text-red-400 bg-red-500/10"
      default: return "text-white/60 bg-white/5"
    }
  }

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>

          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#cff128]/10">
                <Globe className="h-6 w-6 text-[#cff128]" />
              </div>
              <span className="text-sm font-medium text-[#cff128]">AI-Powered</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Landing Page Analyzer
            </h1>
            <p className="text-xl text-white/60">
              Get instant AI-powered CRO analysis of your landing page. Discover exactly
              what's hurting your conversion rate and how to fix it.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* URL Input */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-lg font-semibold mb-4">Enter Your URL</h2>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    placeholder="https://yourstore.com/product"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h2 className="text-lg font-semibold">Page Details</h2>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Page Type</label>
                  <div className="flex flex-wrap gap-2">
                    {pageTypes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setPageType(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          pageType === t.id
                            ? "bg-[#cff128] text-black"
                            : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Industry</label>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((i) => (
                      <button
                        key={i.id}
                        onClick={() => setIndustry(i.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          industry === i.id
                            ? "bg-[#cff128] text-black"
                            : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        {i.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Target Audience (optional)</label>
                  <Input
                    placeholder="e.g., Women 25-34 interested in skincare"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={analyzePage}
                disabled={isAnalyzing || !url}
                className="w-full bg-[#cff128] text-black hover:bg-[#e5f875] font-semibold h-12"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Page...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Landing Page
                  </>
                )}
              </Button>

              {/* What We Analyze */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-4">What We Analyze</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(sectionConfig).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <div key={key} className="flex items-center gap-2 text-sm text-white/60">
                        <Icon className="h-4 w-4 text-[#cff128]" />
                        {config.label}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {analysis ? (
                <>
                  {/* Overall Score */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold mb-1">Overall Score</h2>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getConversionPotentialColor(analysis.conversionPotential)}`}>
                          {analysis.conversionPotential} Conversion Potential
                        </span>
                      </div>
                      <ScoreRing score={analysis.overallScore} size={120} />
                    </div>
                  </div>

                  {/* Priority Actions */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#cff128]" />
                      Priority Actions
                    </h2>
                    <ol className="space-y-3">
                      {analysis.prioritizedActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#cff128] text-black text-sm font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-white/80">{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Section Analysis */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Detailed Analysis</h2>
                    {(Object.keys(sectionConfig) as Array<keyof typeof sectionConfig>).map((key) => (
                      <SectionCard
                        key={key}
                        sectionKey={key}
                        data={analysis.sections[key]}
                        isExpanded={expandedSection === key}
                        onToggle={() => setExpandedSection(expandedSection === key ? null : key)}
                      />
                    ))}
                  </div>

                  {/* Competitive Insights */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Layout className="h-5 w-5 text-[#cff128]" />
                      Competitive Insights
                    </h2>
                    <p className="text-white/70">{analysis.competitiveInsights}</p>
                  </div>
                </>
              ) : (
                <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="p-4 rounded-full bg-white/5 w-fit mx-auto mb-4">
                    <Globe className="h-8 w-8 text-white/30" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                  <p className="text-white/60">
                    Enter a URL to get instant AI-powered feedback on how to
                    improve your landing page conversion rate.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 md:p-12 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
              Want a Full CRO Audit?
            </h2>
            <p className="text-black/70 mb-6 max-w-xl mx-auto">
              This tool gives you a quick snapshot. Our team does comprehensive CRO audits
              with heatmaps, user recordings, and A/B test recommendations.
            </p>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button size="lg" className="bg-black text-white hover:bg-black/90 font-semibold">
                Get Full CRO Audit
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
