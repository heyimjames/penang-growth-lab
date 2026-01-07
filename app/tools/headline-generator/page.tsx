"use client"

import { useState } from "react"
import Link from "next/link"
import { Zap, ExternalLink, Sparkles, Copy, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Headline {
  headline: string
  angle: string
}

const angleLabels: Record<string, string> = {
  benefit: "Benefit-Focused",
  problem: "Problem-Agitate",
  "social-proof": "Social Proof",
  curiosity: "Curiosity Gap",
  question: "Question-Based",
  numbers: "Numbers/Data",
}

export default function HeadlineGeneratorPage() {
  const [topic, setTopic] = useState("")
  const [context, setContext] = useState("")
  const [type, setType] = useState("ad")
  const [tone, setTone] = useState("professional")

  const [isGenerating, setIsGenerating] = useState(false)
  const [headlines, setHeadlines] = useState<Headline[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!topic) {
      setError("Please enter a topic or product")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const response = await fetch("/api/generate/headline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, context, type, tone }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate headlines")
      }

      const data = await response.json()
      setHeadlines(data.headlines || [])
    } catch {
      setError("Failed to generate headlines. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-white">AI Headline Generator</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#cff128]/10">
                <Zap className="h-8 w-8 text-[#cff128]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-bold">AI Headline Generator</h1>
                  <span className="px-2 py-1 text-xs font-medium bg-[#cff128]/10 text-[#cff128] rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> AI
                  </span>
                </div>
              </div>
            </div>
            <p className="text-lg text-white/60">
              Generate attention-grabbing headlines for ads, emails, landing pages, and social media.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input form */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-6">What Do You Need Headlines For?</h2>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="topic" className="text-white/70">Topic or Product *</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Organic skincare for sensitive skin"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <Label htmlFor="context" className="text-white/70">Additional Context (optional)</Label>
                  <Textarea
                    id="context"
                    placeholder="Any specific angles, benefits, or target audience details..."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70">Headline Type</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ad">Ad Headlines</SelectItem>
                        <SelectItem value="email">Email Subject Lines</SelectItem>
                        <SelectItem value="landing">Landing Page</SelectItem>
                        <SelectItem value="social">Social Media Hooks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white/70">Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual & Friendly</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="curious">Curiosity-Driven</SelectItem>
                        <SelectItem value="emotional">Emotional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-[#cff128] text-black hover:bg-[#e5f875] font-semibold h-12"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Headlines
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Generated Headlines</h2>

              {headlines.length === 0 && !isGenerating && (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 border-dashed text-center">
                  <Sparkles className="h-8 w-8 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">Your generated headlines will appear here</p>
                  <p className="text-white/30 text-sm mt-1">Fill in the form and click generate</p>
                </div>
              )}

              {isGenerating && (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <Loader2 className="h-8 w-8 text-[#cff128] mx-auto mb-3 animate-spin" />
                  <p className="text-white/60">Generating your headlines...</p>
                </div>
              )}

              {headlines.map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#cff128] bg-[#cff128]/10 px-2 py-1 rounded-full">
                      {angleLabels[item.angle] || item.angle}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item.headline, index)}
                      className="text-white/50 hover:text-white h-8"
                    >
                      {copiedIndex === index ? (
                        <><Check className="h-4 w-4 mr-1" /> Copied</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-1" /> Copy</>
                      )}
                    </Button>
                  </div>
                  <p className="font-medium text-lg">{item.headline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Headline Formula Guide */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Proven Headline Formulas</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">How to [Achieve Desired Outcome]</h3>
                <p className="text-white/60">Example: "How to Double Your ROAS in 30 Days"</p>
              </div>
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">[Number] Ways to [Achieve Goal]</h3>
                <p className="text-white/60">Example: "7 Ways to Lower Your CAC This Month"</p>
              </div>
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">The Secret to [Desired Outcome]</h3>
                <p className="text-white/60">Example: "The Secret to 5x ROAS on Meta"</p>
              </div>
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">Why [Audience] Are [Doing Thing]</h3>
                <p className="text-white/60">Example: "Why Top Brands Are Ditching Broad Targeting"</p>
              </div>
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">[Achieve Goal] Without [Pain Point]</h3>
                <p className="text-white/60">Example: "Scale Your Ads Without Burning Budget"</p>
              </div>
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">What [Experts] Know About [Topic]</h3>
                <p className="text-white/60">Example: "What 8-Figure Brands Know About Creative"</p>
              </div>
            </div>
          </div>

          {/* Related tools */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/tools/ad-copy-generator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">AI Ad Copy Generator</h3>
                <p className="text-sm text-white/50 mt-1">Generate full ad copy variations</p>
              </Link>
              <Link href="/tools/email-subject-generator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Email Subject Generator</h3>
                <p className="text-sm text-white/50 mt-1">Generate high-open-rate subject lines</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Need Professional Copywriting?</h2>
            <p className="text-black/70 mb-6">Our team creates high-converting ad copy for DTC brands.</p>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button className="bg-black text-white hover:bg-black/90 font-semibold">
                Work With Us <ExternalLink className="ml-2 h-4 w-4" />
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
