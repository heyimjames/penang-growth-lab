"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Link2, Check } from "lucide-react"
import { useState } from "react"

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="rounded-full" asChild>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </a>
      </Button>
      <Button variant="outline" size="sm" className="rounded-full" asChild>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={copyToClipboard}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Link Copied
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4 mr-2" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  )
}
