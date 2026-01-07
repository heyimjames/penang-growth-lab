"use client"

import { useState } from "react"
import Link from "next/link"
import { Link2, ExternalLink, Copy, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UTMBuilderPage() {
  const [baseUrl, setBaseUrl] = useState<string>("")
  const [source, setSource] = useState<string>("")
  const [medium, setMedium] = useState<string>("")
  const [campaign, setCampaign] = useState<string>("")
  const [term, setTerm] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [copied, setCopied] = useState(false)

  const buildUrl = () => {
    if (!baseUrl) return ""

    let url = baseUrl
    if (!url.includes("?")) {
      url += "?"
    } else {
      url += "&"
    }

    const params: string[] = []
    if (source) params.push(`utm_source=${encodeURIComponent(source)}`)
    if (medium) params.push(`utm_medium=${encodeURIComponent(medium)}`)
    if (campaign) params.push(`utm_campaign=${encodeURIComponent(campaign)}`)
    if (term) params.push(`utm_term=${encodeURIComponent(term)}`)
    if (content) params.push(`utm_content=${encodeURIComponent(content)}`)

    return url + params.join("&")
  }

  const generatedUrl = buildUrl()

  const copyToClipboard = async () => {
    if (generatedUrl) {
      await navigator.clipboard.writeText(generatedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const presetSources = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "google", label: "Google" },
    { value: "tiktok", label: "TikTok" },
    { value: "email", label: "Email" },
    { value: "youtube", label: "YouTube" },
    { value: "twitter", label: "Twitter/X" },
    { value: "linkedin", label: "LinkedIn" },
  ]

  const presetMediums = [
    { value: "cpc", label: "CPC (Paid)" },
    { value: "cpm", label: "CPM (Display)" },
    { value: "social", label: "Social (Organic)" },
    { value: "email", label: "Email" },
    { value: "affiliate", label: "Affiliate" },
    { value: "referral", label: "Referral" },
    { value: "organic", label: "Organic" },
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
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-white">UTM Builder</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#cff128]/10">
                <Link2 className="h-8 w-8 text-[#cff128]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">UTM Builder</h1>
            </div>
            <p className="text-lg text-white/60">
              Build UTM tracking URLs to accurately attribute traffic across marketing channels.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Builder Form */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-6">Build Your URL</h2>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="baseUrl" className="text-white/70">Website URL *</Label>
                  <Input
                    id="baseUrl"
                    type="url"
                    placeholder="https://yoursite.com/landing-page"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <Label htmlFor="source" className="text-white/70">Campaign Source (utm_source) *</Label>
                  <div className="mt-2 space-y-2">
                    <Select value={source} onValueChange={setSource}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select or type below" />
                      </SelectTrigger>
                      <SelectContent>
                        {presetSources.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Or type custom source..."
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <p className="mt-1 text-xs text-white/40">Where the traffic comes from (e.g., facebook, google)</p>
                </div>

                <div>
                  <Label htmlFor="medium" className="text-white/70">Campaign Medium (utm_medium) *</Label>
                  <div className="mt-2 space-y-2">
                    <Select value={medium} onValueChange={setMedium}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select or type below" />
                      </SelectTrigger>
                      <SelectContent>
                        {presetMediums.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Or type custom medium..."
                      value={medium}
                      onChange={(e) => setMedium(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <p className="mt-1 text-xs text-white/40">Marketing medium (e.g., cpc, email, social)</p>
                </div>

                <div>
                  <Label htmlFor="campaign" className="text-white/70">Campaign Name (utm_campaign) *</Label>
                  <Input
                    id="campaign"
                    placeholder="summer_sale_2024"
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Identify the specific campaign</p>
                </div>

                <div>
                  <Label htmlFor="term" className="text-white/70">Campaign Term (utm_term)</Label>
                  <Input
                    id="term"
                    placeholder="running_shoes"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Keywords for paid search (optional)</p>
                </div>

                <div>
                  <Label htmlFor="content" className="text-white/70">Campaign Content (utm_content)</Label>
                  <Input
                    id="content"
                    placeholder="video_ad_v2"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                  <p className="mt-1 text-xs text-white/40">Differentiate ads/links (optional)</p>
                </div>
              </div>
            </div>

            {/* Generated URL */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20">
                <h2 className="text-lg font-semibold mb-4">Generated URL</h2>

                {generatedUrl && baseUrl ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-black/30 break-all">
                      <p className="text-sm text-[#cff128] font-mono">{generatedUrl}</p>
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      className="w-full bg-[#cff128] text-black hover:bg-[#e5f875] font-semibold"
                    >
                      {copied ? (
                        <><Check className="mr-2 h-4 w-4" /> Copied!</>
                      ) : (
                        <><Copy className="mr-2 h-4 w-4" /> Copy URL</>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="p-8 rounded-xl bg-black/20 border border-white/5 text-center">
                    <Link2 className="h-8 w-8 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">Enter a URL to generate your UTM link</p>
                  </div>
                )}
              </div>

              {/* Parameter Preview */}
              {(source || medium || campaign) && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold mb-4">Parameters Preview</h3>
                  <div className="space-y-2 text-sm">
                    {source && (
                      <div className="flex justify-between">
                        <span className="text-white/50">utm_source</span>
                        <span className="text-[#cff128] font-mono">{source}</span>
                      </div>
                    )}
                    {medium && (
                      <div className="flex justify-between">
                        <span className="text-white/50">utm_medium</span>
                        <span className="text-[#cff128] font-mono">{medium}</span>
                      </div>
                    )}
                    {campaign && (
                      <div className="flex justify-between">
                        <span className="text-white/50">utm_campaign</span>
                        <span className="text-[#cff128] font-mono">{campaign}</span>
                      </div>
                    )}
                    {term && (
                      <div className="flex justify-between">
                        <span className="text-white/50">utm_term</span>
                        <span className="text-[#cff128] font-mono">{term}</span>
                      </div>
                    )}
                    {content && (
                      <div className="flex justify-between">
                        <span className="text-white/50">utm_content</span>
                        <span className="text-[#cff128] font-mono">{content}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* UTM Parameter Guide */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">UTM Parameter Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-white/50 font-medium">Parameter</th>
                    <th className="text-left py-2 text-white/50 font-medium">Required</th>
                    <th className="text-left py-2 text-white/50 font-medium">Purpose</th>
                    <th className="text-left py-2 text-white/50 font-medium">Example</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-[#cff128]">utm_source</td>
                    <td className="py-2">Yes</td>
                    <td className="py-2">Traffic source</td>
                    <td className="py-2">facebook, google, newsletter</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-[#cff128]">utm_medium</td>
                    <td className="py-2">Yes</td>
                    <td className="py-2">Marketing medium</td>
                    <td className="py-2">cpc, email, social</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-[#cff128]">utm_campaign</td>
                    <td className="py-2">Yes</td>
                    <td className="py-2">Campaign identifier</td>
                    <td className="py-2">spring_sale, product_launch</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-white/60">utm_term</td>
                    <td className="py-2">No</td>
                    <td className="py-2">Paid search keywords</td>
                    <td className="py-2">running_shoes, skincare</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-white/60">utm_content</td>
                    <td className="py-2">No</td>
                    <td className="py-2">Ad/link differentiation</td>
                    <td className="py-2">video_v1, cta_button</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Best Practices */}
          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">UTM Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium text-[#cff128] mb-2">Do:</h3>
                <ul className="space-y-2 text-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Use lowercase for consistency
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Use underscores instead of spaces
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Create a naming convention and stick to it
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#cff128]">•</span>
                    Document your UTM parameters in a spreadsheet
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-400 mb-2">Don't:</h3>
                <ul className="space-y-2 text-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Use UTMs for internal links
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Use spaces or special characters
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Use generic values like "link" or "ad"
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Forget to shorten long URLs for social sharing
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related tools */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/tools/attribution-guide" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">Attribution Model Guide</h3>
                <p className="text-sm text-white/50 mt-1">Understand attribution models</p>
              </Link>
              <Link href="/tools/ab-test-calculator" className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors">
                <h3 className="font-medium group-hover:text-[#cff128] transition-colors">A/B Test Calculator</h3>
                <p className="text-sm text-white/50 mt-1">Calculate test significance</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Need Help With Attribution?</h2>
            <p className="text-black/70 mb-6">Our team helps DTC brands set up proper tracking and attribution.</p>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button className="bg-black text-white hover:bg-black/90 font-semibold">
                Get in Touch <ExternalLink className="ml-2 h-4 w-4" />
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
