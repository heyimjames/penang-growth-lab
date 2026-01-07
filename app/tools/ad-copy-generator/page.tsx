"use client"

import { useState } from "react"
import Link from "next/link"
import { PenTool, ExternalLink, Sparkles, Copy, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdCopy {
  headline: string
  primaryText: string
  description?: string
}

export default function AdCopyGeneratorPage() {
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [tone, setTone] = useState("professional")
  const [platform, setPlatform] = useState("meta")

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCopy, setGeneratedCopy] = useState<AdCopy[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!productName || !productDescription) {
      setError("Please fill in at least the product name and description")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const response = await fetch("/api/generate/ad-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productDescription,
          targetAudience,
          tone,
          platform,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate ad copy")
      }

      const data = await response.json()
      setGeneratedCopy(data.variations || [])
    } catch {
      setError("Failed to generate ad copy. Please try again.")
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
            <span className="text-white">AI Ad Copy Generator</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#cff128]/10">
                <PenTool className="h-8 w-8 text-[#cff128]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-bold">AI Ad Copy Generator</h1>
                  <span className="px-2 py-1 text-xs font-medium bg-[#cff128]/10 text-[#cff128] rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> AI
                  </span>
                </div>
              </div>
            </div>
            <p className="text-lg text-white/60">
              Generate high-converting ad copy for Meta and Google Ads using AI.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input form */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-6">Tell Us About Your Product</h2>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="productName" className="text-white/70">Product/Brand Name *</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., CloudComfort Mattress"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <Label htmlFor="productDescription" className="text-white/70">Product Description *</Label>
                  <Textarea
                    id="productDescription"
                    placeholder="Describe your product, its key benefits, and what makes it unique..."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience" className="text-white/70">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    placeholder="e.g., Health-conscious millennials, busy professionals"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70">Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meta">Meta (Facebook/Instagram)</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
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
                        <SelectItem value="urgent">Urgent & Action-Oriented</SelectItem>
                        <SelectItem value="luxurious">Luxurious & Premium</SelectItem>
                        <SelectItem value="playful">Playful & Fun</SelectItem>
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
                      Generate Ad Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Generated Ad Copy</h2>

              {generatedCopy.length === 0 && !isGenerating && (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 border-dashed text-center">
                  <Sparkles className="h-8 w-8 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">Your generated ad copy will appear here</p>
                  <p className="text-white/30 text-sm mt-1">Fill in the form and click generate</p>
                </div>
              )}

              {isGenerating && (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <Loader2 className="h-8 w-8 text-[#cff128] mx-auto mb-3 animate-spin" />
                  <p className="text-white/60">Generating your ad copy...</p>
                </div>
              )}

              {generatedCopy.map((copy, index) => (
                <div key={index} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#cff128]/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-[#cff128] bg-[#cff128]/10 px-2 py-1 rounded-full">
                      Variation {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${copy.headline}\n\n${copy.primaryText}${copy.description ? `\n\n${copy.description}` : ""}`, index)}
                      className="text-white/50 hover:text-white h-8"
                    >
                      {copiedIndex === index ? (
                        <><Check className="h-4 w-4 mr-1" /> Copied</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-1" /> Copy</>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/40 mb-1">HEADLINE</p>
                      <p className="font-semibold text-lg">{copy.headline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">PRIMARY TEXT</p>
                      <p className="text-white/80 whitespace-pre-wrap">{copy.primaryText}</p>
                    </div>
                    {copy.description && (
                      <div>
                        <p className="text-xs text-white/40 mb-1">DESCRIPTION</p>
                        <p className="text-white/70 text-sm">{copy.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Tips for Better Ad Copy</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">Do:</h3>
                <ul className="space-y-2 text-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Be specific about benefits and outcomes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Include social proof when possible
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Use power words that trigger emotion
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Include a clear call-to-action
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-400 mb-2">Don't:</h3>
                <ul className="space-y-2 text-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Make exaggerated claims
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Use ALL CAPS excessively
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Forget to tailor copy for the platform
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Ignore platform character limits
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related tools */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/tools/headline-generator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">AI Headline Generator</h3>
                <p className="text-sm text-white/50 mt-1">Generate attention-grabbing headlines</p>
              </Link>
              <Link href="/tools/product-description-writer" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Product Description Writer</h3>
                <p className="text-sm text-white/50 mt-1">Write compelling product descriptions</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Want Expert Creative Strategy?</h2>
            <p className="text-black/70 mb-6">Our team creates thousands of high-performing ad creatives for DTC brands.</p>
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
