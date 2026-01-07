"use client"

import { useState } from "react"
import Link from "next/link"
import { PenTool, Sparkles, ArrowLeft, Loader2, AlertCircle, Copy, Check, Lightbulb, Mail, MessageSquare, Globe, Smartphone, FileText, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CopyVariation {
  headline: string
  body: string
  cta?: string
  angle: string
}

interface CopyResponse {
  variations: CopyVariation[]
  tips: string[]
}

const copyTypes = [
  { id: "product-description", label: "Product Description", icon: ShoppingBag },
  { id: "facebook-ad", label: "Facebook/Meta Ad", icon: MessageSquare },
  { id: "google-ad", label: "Google Ad", icon: Globe },
  { id: "email-subject", label: "Email Subject Lines", icon: Mail },
  { id: "email-body", label: "Email Body", icon: Mail },
  { id: "landing-page-hero", label: "Landing Page Hero", icon: Globe },
  { id: "social-post", label: "Social Media Post", icon: MessageSquare },
  { id: "sms-marketing", label: "SMS Marketing", icon: Smartphone },
]

const tones = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual & Friendly" },
  { id: "urgent", label: "Urgent & Direct" },
  { id: "luxurious", label: "Luxurious & Premium" },
  { id: "playful", label: "Playful & Fun" },
  { id: "empathetic", label: "Empathetic & Caring" },
  { id: "authoritative", label: "Authoritative & Expert" },
]

function CopyCard({ variation, index }: { variation: CopyVariation; index: number }) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#cff128] bg-[#cff128]/10 px-2 py-1 rounded-full">
          {variation.angle}
        </span>
        <span className="text-xs text-white/40">Variation {index + 1}</span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-white/50 uppercase tracking-wide">Headline</label>
          <button
            onClick={() => copyToClipboard(variation.headline, `headline-${index}`)}
            className="text-white/40 hover:text-white transition-colors"
          >
            {copiedField === `headline-${index}` ? (
              <Check className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <p className="font-semibold text-lg">{variation.headline}</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-white/50 uppercase tracking-wide">Body Copy</label>
          <button
            onClick={() => copyToClipboard(variation.body, `body-${index}`)}
            className="text-white/40 hover:text-white transition-colors"
          >
            {copiedField === `body-${index}` ? (
              <Check className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <p className="text-white/70 whitespace-pre-wrap">{variation.body}</p>
      </div>

      {variation.cta && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-white/50 uppercase tracking-wide">Call-to-Action</label>
            <button
              onClick={() => copyToClipboard(variation.cta!, `cta-${index}`)}
              className="text-white/40 hover:text-white transition-colors"
            >
              {copiedField === `cta-${index}` ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <span className="inline-block px-4 py-2 bg-[#cff128] text-black font-semibold rounded-lg text-sm">
            {variation.cta}
          </span>
        </div>
      )}

      <button
        onClick={() => {
          const fullCopy = `${variation.headline}\n\n${variation.body}${variation.cta ? `\n\n${variation.cta}` : ""}`
          copyToClipboard(fullCopy, `full-${index}`)
        }}
        className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        {copiedField === `full-${index}` ? (
          <>
            <Check className="h-4 w-4 text-green-400" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy All
          </>
        )}
      </button>
    </div>
  )
}

export default function CopywritingAssistantPage() {
  const [copyType, setCopyType] = useState("facebook-ad")
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [tone, setTone] = useState("professional")
  const [keyBenefits, setKeyBenefits] = useState("")
  const [additionalContext, setAdditionalContext] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CopyResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateCopy = async () => {
    if (!productName.trim()) {
      setError("Please enter a product name")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate/copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          copyType,
          productName,
          productDescription,
          targetAudience,
          tone,
          keyBenefits,
          additionalContext,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate copy")
      }

      const data = await response.json()
      setResult(data)
    } catch {
      setError("Failed to generate copy. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedCopyType = copyTypes.find((t) => t.id === copyType)
  const CopyTypeIcon = selectedCopyType?.icon || FileText

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
                <PenTool className="h-6 w-6 text-[#cff128]" />
              </div>
              <span className="text-sm font-medium text-[#cff128]">AI-Powered</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI Copywriting Assistant
            </h1>
            <p className="text-xl text-white/60">
              Generate high-converting copy for ads, emails, landing pages, and more.
              Trained on proven direct response frameworks.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Copy Type Selection */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-lg font-semibold mb-4">What do you need?</h2>
                <div className="grid grid-cols-2 gap-2">
                  {copyTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setCopyType(type.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-all ${
                          copyType === type.id
                            ? "bg-[#cff128] text-black"
                            : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h2 className="text-lg font-semibold">Tell us about your product</h2>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Product/Brand Name *</label>
                  <Input
                    placeholder="e.g., GlowSkin Serum"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Product Description</label>
                  <Textarea
                    placeholder="Briefly describe what your product does..."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows={3}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Target Audience</label>
                  <Input
                    placeholder="e.g., Women 25-40 concerned about aging skin"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Key Benefits</label>
                  <Input
                    placeholder="e.g., Reduces wrinkles, hydrates skin, natural ingredients"
                    value={keyBenefits}
                    onChange={(e) => setKeyBenefits(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Tone Selection */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-lg font-semibold mb-4">Tone of Voice</h2>
                <div className="flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        tone === t.id
                          ? "bg-[#cff128] text-black"
                          : "bg-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Context */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-lg font-semibold mb-4">Additional Context (optional)</h2>
                <Textarea
                  placeholder="Any specific angles, offers, or information you want included..."
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  rows={2}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={generateCopy}
                disabled={isGenerating || !productName.trim()}
                className="w-full bg-[#cff128] text-black hover:bg-[#e5f875] font-semibold h-12"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Copy...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate {selectedCopyType?.label || "Copy"}
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Generated Copy */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CopyTypeIcon className="h-5 w-5 text-[#cff128]" />
                      <h2 className="text-lg font-semibold">Generated {selectedCopyType?.label}</h2>
                    </div>

                    {result.variations.map((variation, index) => (
                      <CopyCard key={index} variation={variation} index={index} />
                    ))}
                  </div>

                  {/* Tips */}
                  {result.tips && result.tips.length > 0 && (
                    <div className="p-6 rounded-2xl bg-[#cff128]/10 border border-[#cff128]/20">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-[#cff128]" />
                        Pro Tips
                      </h3>
                      <ul className="space-y-2">
                        {result.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                            <span className="text-[#cff128]">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    onClick={generateCopy}
                    variant="outline"
                    className="w-full border-white/20 hover:bg-white/5"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate More Variations
                  </Button>
                </>
              ) : (
                <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="p-4 rounded-full bg-white/5 w-fit mx-auto mb-4">
                    <PenTool className="h-8 w-8 text-white/30" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Copy Generated Yet</h3>
                  <p className="text-white/60">
                    Fill in your product details and click generate to create
                    high-converting copy for your marketing campaigns.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 md:p-12 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
              Need Custom Copy That Converts?
            </h2>
            <p className="text-black/70 mb-6 max-w-xl mx-auto">
              Our copywriters have written millions in high-converting ad copy.
              Get a custom creative strategy for your brand.
            </p>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button size="lg" className="bg-black text-white hover:bg-black/90 font-semibold">
                Get Custom Copy
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
