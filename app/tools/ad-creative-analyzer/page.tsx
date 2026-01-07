"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Upload, Sparkles, Target, Eye, MessageSquare, MousePointer, ArrowLeft, Loader2, X, Image as ImageIcon, Link as LinkIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AdCreativeAnalysis {
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  hookAnalysis: {
    score: number
    feedback: string
  }
  visualAnalysis: {
    score: number
    feedback: string
  }
  copyAnalysis: {
    score: number
    feedback: string
  }
  ctaAnalysis: {
    score: number
    feedback: string
  }
  platformFit: {
    meta: number
    tiktok: number
    google: number
  }
  predictedPerformance: string
}

const platforms = [
  { id: "meta", label: "Meta (Facebook/Instagram)" },
  { id: "tiktok", label: "TikTok" },
  { id: "google", label: "Google Display" },
  { id: "youtube", label: "YouTube" },
]

const adTypes = [
  { id: "image", label: "Static Image" },
  { id: "video", label: "Video" },
  { id: "carousel", label: "Carousel" },
  { id: "ugc", label: "UGC Style" },
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

function ScoreRing({ score, size = 120, label }: { score: number; size?: number; label?: string }) {
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
      {label && <span className="mt-2 text-sm text-white/60">{label}</span>}
    </div>
  )
}

function ScoreBar({ score, label, icon: Icon }: { score: number; label: string; icon: React.ElementType }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-[#cff128]"
    if (score >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-white/60" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold">{score}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export default function AdCreativeAnalyzerPage() {
  const [inputMethod, setInputMethod] = useState<"upload" | "url">("upload")
  const [imageUrl, setImageUrl] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [platform, setPlatform] = useState("meta")
  const [adType, setAdType] = useState("image")
  const [industry, setIndustry] = useState("ecommerce")
  const [adCopy, setAdCopy] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AdCreativeAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be under 10MB")
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file")
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleUrlChange = (url: string) => {
    setImageUrl(url)
    if (url && url.startsWith("http")) {
      setImagePreview(url)
    } else {
      setImagePreview(null)
    }
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const analyzeCreative = async () => {
    if (!imageFile && !imageUrl) {
      setError("Please provide an image to analyze")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      if (imageFile) {
        formData.append("image", imageFile)
      } else if (imageUrl) {
        formData.append("imageUrl", imageUrl)
      }
      formData.append("platform", platform)
      formData.append("adType", adType)
      formData.append("industry", industry)
      if (adCopy) {
        formData.append("adCopy", adCopy)
      }

      const response = await fetch("/api/analyze/ad-creative", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze creative")
      }

      const result = await response.json()
      setAnalysis(result)
    } catch (err) {
      setError("Failed to analyze creative. Please try again.")
    } finally {
      setIsAnalyzing(false)
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
                <Sparkles className="h-6 w-6 text-[#cff128]" />
              </div>
              <span className="text-sm font-medium text-[#cff128]">AI-Powered</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ad Creative Analyzer
            </h1>
            <p className="text-xl text-white/60">
              Get instant AI-powered feedback on your ad creatives. Find out what's working,
              what's not, and exactly how to improve your CTR and conversions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Image Input */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-lg font-semibold mb-4">Upload Creative</h2>

                {/* Input Method Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setInputMethod("upload")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inputMethod === "upload"
                        ? "bg-[#cff128] text-black"
                        : "bg-white/5 text-white/60 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Upload
                  </button>
                  <button
                    onClick={() => setInputMethod("url")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inputMethod === "url"
                        ? "bg-[#cff128] text-black"
                        : "bg-white/5 text-white/60 hover:text-white"
                    }`}
                  >
                    <LinkIcon className="h-4 w-4" />
                    URL
                  </button>
                </div>

                {inputMethod === "upload" ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-[#cff128]/50 transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {imagePreview && inputMethod === "upload" ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            clearImage()
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-white/30 mx-auto mb-3" />
                        <p className="text-white/60 mb-1">Drop your ad creative here or click to upload</p>
                        <p className="text-sm text-white/40">PNG, JPG, or GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Input
                      placeholder="https://example.com/ad-image.jpg"
                      value={imageUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                    {imagePreview && inputMethod === "url" && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg"
                          onError={() => setImagePreview(null)}
                        />
                        <button
                          onClick={clearImage}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h2 className="text-lg font-semibold">Ad Details</h2>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          platform === p.id
                            ? "bg-[#cff128] text-black"
                            : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Ad Type</label>
                  <div className="flex flex-wrap gap-2">
                    {adTypes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setAdType(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          adType === t.id
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
                  <label className="text-sm text-white/60 mb-2 block">Ad Copy (optional)</label>
                  <Textarea
                    placeholder="Paste your ad headline and body copy here for a more complete analysis..."
                    value={adCopy}
                    onChange={(e) => setAdCopy(e.target.value)}
                    rows={3}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
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
                onClick={analyzeCreative}
                disabled={isAnalyzing || (!imageFile && !imageUrl)}
                className="w-full bg-[#cff128] text-black hover:bg-[#e5f875] font-semibold h-12"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Creative...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Creative
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {analysis ? (
                <>
                  {/* Overall Score */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#cff128]/10 to-transparent border border-[#cff128]/20 text-center">
                    <h2 className="text-lg font-semibold mb-4">Overall Score</h2>
                    <ScoreRing score={analysis.overallScore} size={150} />
                    <p className="mt-4 text-white/60">{analysis.predictedPerformance}</p>
                  </div>

                  {/* Category Scores */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <h2 className="text-lg font-semibold">Performance Breakdown</h2>
                    <ScoreBar score={analysis.hookAnalysis.score} label="Hook / Attention" icon={Eye} />
                    <ScoreBar score={analysis.visualAnalysis.score} label="Visual Impact" icon={ImageIcon} />
                    <ScoreBar score={analysis.copyAnalysis.score} label="Copy / Messaging" icon={MessageSquare} />
                    <ScoreBar score={analysis.ctaAnalysis.score} label="Call-to-Action" icon={MousePointer} />
                  </div>

                  {/* Platform Fit */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h2 className="text-lg font-semibold mb-4">Platform Fit</h2>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <ScoreRing score={analysis.platformFit.meta} size={80} />
                        <p className="mt-2 text-sm text-white/60">Meta</p>
                      </div>
                      <div>
                        <ScoreRing score={analysis.platformFit.tiktok} size={80} />
                        <p className="mt-2 text-sm text-white/60">TikTok</p>
                      </div>
                      <div>
                        <ScoreRing score={analysis.platformFit.google} size={80} />
                        <p className="mt-2 text-sm text-white/60">Google</p>
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/20">
                      <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {analysis.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-white/70">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/20">
                      <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Weaknesses
                      </h3>
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-white/70">• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Improvements */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-[#cff128]" />
                      Recommended Improvements
                    </h2>
                    <ul className="space-y-3">
                      {analysis.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#cff128]/20 text-[#cff128] text-sm font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-white/80">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Detailed Feedback */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <h2 className="text-lg font-semibold">Detailed Feedback</h2>

                    <div className="p-4 rounded-lg bg-white/5">
                      <h4 className="font-medium text-[#cff128] mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Hook Analysis
                      </h4>
                      <p className="text-sm text-white/70">{analysis.hookAnalysis.feedback}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5">
                      <h4 className="font-medium text-[#cff128] mb-2 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Visual Analysis
                      </h4>
                      <p className="text-sm text-white/70">{analysis.visualAnalysis.feedback}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5">
                      <h4 className="font-medium text-[#cff128] mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Copy Analysis
                      </h4>
                      <p className="text-sm text-white/70">{analysis.copyAnalysis.feedback}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5">
                      <h4 className="font-medium text-[#cff128] mb-2 flex items-center gap-2">
                        <MousePointer className="h-4 w-4" />
                        CTA Analysis
                      </h4>
                      <p className="text-sm text-white/70">{analysis.ctaAnalysis.feedback}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="p-4 rounded-full bg-white/5 w-fit mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-white/30" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                  <p className="text-white/60">
                    Upload an ad creative to get instant AI-powered feedback on how to improve your CTR and conversions.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 md:p-12 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
              Want More In-Depth Creative Analysis?
            </h2>
            <p className="text-black/70 mb-6 max-w-xl mx-auto">
              Our team reviews every creative with a proven framework. Get detailed feedback
              and a creative strategy tailored to your brand.
            </p>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button size="lg" className="bg-black text-white hover:bg-black/90 font-semibold">
                Get Expert Creative Review
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
