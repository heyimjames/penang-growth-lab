"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Clock, Calendar, Share2, Copy, Check, Twitter, Linkedin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPostBySlug, getAllPosts, blogCategories, type BlogPost } from "@/lib/blog-data"
import { useState, useEffect } from "react"

// Simple markdown to HTML converter
function renderContent(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-8 mb-4 text-white">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4 text-white">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-white/70">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 text-white/70"><span class="font-semibold text-white">$1.</span> $2</li>')
    .replace(/(<li class="ml-4.*?<\/li>\n?)+/g, (match) => {
      const isOrdered = match.includes('<span class="font-semibold')
      const tag = isOrdered ? "ol" : "ul"
      return `<${tag} class="space-y-2 my-4 list-disc list-inside">${match}</${tag}>`
    })
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split("|").filter(Boolean).map((c) => c.trim())
      if (cells.every((c) => c.match(/^-+$/))) return ""
      const cellHtml = cells.map((c) => `<td class="px-4 py-2 border border-white/10 text-white/70">${c}</td>`).join("")
      return `<tr>${cellHtml}</tr>`
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (match) => {
      return `<div class="overflow-x-auto my-6"><table class="w-full border-collapse text-sm"><tbody>${match}</tbody></table></div>`
    })
    .replace(/^(?!<[hluotd])(.+)$/gm, (_, text) => {
      if (text.trim()) return `<p class="my-4 text-white/70 leading-relaxed">${text}</p>`
      return ""
    })
    .replace(/\n{3,}/g, "\n\n")
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors"
        title="Copy link"
      >
        {copied ? <Check className="h-4 w-4 text-[#cff128]" /> : <Copy className="h-4 w-4 text-white/60" />}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors"
        title="Share on Twitter"
      >
        <Twitter className="h-4 w-4 text-white/60" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4 text-white/60" />
      </a>
    </div>
  )
}

function RelatedPosts({ currentSlug, category }: { currentSlug: string; category: string }) {
  const allPosts = getAllPosts()
  const related = allPosts.filter((p) => p.slug !== currentSlug).slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-white/10">
      <h2 className="text-xl font-bold mb-6">More Articles</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#cff128]/50 transition-colors"
          >
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${blogCategories[post.category].color}`}>
              {blogCategories[post.category].name}
            </span>
            <h3 className="font-semibold mt-3 group-hover:text-[#cff128] transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-white/50 mt-2 line-clamp-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const foundPost = getPostBySlug(slug)
    setPost(foundPost)
    setIsLoading(false)
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">PENANG</span>
                <span className="text-xl font-bold text-[#cff128]">GROWTH LAB</span>
              </Link>
            </div>
          </div>
        </nav>
        <main className="pt-32 pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-white/60 mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button className="bg-[#cff128] text-black hover:bg-[#e5f875]">Back to Blog</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const categoryMeta = blogCategories[post.category]
  const htmlContent = renderContent(post.content)
  const pageUrl = typeof window !== "undefined" ? window.location.href : ""

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
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${categoryMeta.color}`}>
                {categoryMeta.name}
              </span>
              <span className="text-sm text-white/40 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="text-sm text-white/40 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-white/60">{post.excerpt}</p>
          </header>

          {/* Content */}
          <article
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share this article
              </p>
              <ShareButtons title={post.title} url={pageUrl} />
            </div>
          </div>

          {/* Related Posts */}
          <RelatedPosts currentSlug={post.slug} category={post.category} />

          {/* CTA */}
          <div className="mt-16 p-8 rounded-2xl bg-[#cff128] text-center">
            <h2 className="text-2xl font-bold text-black mb-3">Want to Talk Strategy?</h2>
            <p className="text-black/70 mb-6">
              Get personalized advice for your brand from our team of e-commerce growth experts.
            </p>
            <Link href="https://www.penangmedia.com" target="_blank">
              <Button variant="dark">
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
