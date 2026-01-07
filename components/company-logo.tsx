"use client"

import { useState } from "react"
import { Icon } from "@/lib/icons"
import { BuildingIcon } from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"
import { extractDomain } from "@/lib/domain"

interface CompanyLogoProps {
  companyName?: string
  domain?: string
  size?: number
  className?: string
  showFallback?: boolean
}

// Logo sources in priority order
function getLogoSources(domain: string, size: number): string[] {
  const sources: string[] = []
  
  // 1. logo.dev - high quality logos (uses public token, rate limited but free)
  // Format: https://img.logo.dev/{domain}?token=pk_X&size=128&format=png
  const logoDevToken = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN
  if (logoDevToken) {
    sources.push(`https://img.logo.dev/${domain}?token=${logoDevToken}&size=${Math.min(size * 2, 256)}&format=png`)
  }
  
  // 2. Google favicon service - reliable fallback, max 128px
  sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=${Math.min(size * 2, 128)}`)
  
  return sources
}

export function CompanyLogo({ companyName, domain, size = 48, className, showFallback = true }: CompanyLogoProps) {
  const [sourceIndex, setSourceIndex] = useState(0)
  const [allFailed, setAllFailed] = useState(false)
  
  const cleanDomain = domain || (companyName ? extractDomain(companyName) : null)
  const sources = cleanDomain ? getLogoSources(cleanDomain, size) : []

  const handleError = () => {
    if (sourceIndex < sources.length - 1) {
      // Try next source
      setSourceIndex(prev => prev + 1)
    } else {
      // All sources failed
      setAllFailed(true)
    }
  }

  if ((!cleanDomain || allFailed) && showFallback) {
    return (
      <div
        className={cn("flex items-center justify-center rounded-lg bg-muted", className)}
        style={{ width: size, height: size }}
      >
        <Icon icon={BuildingIcon} size={size / 2} color="currentColor" className="text-muted-foreground" />
      </div>
    )
  }

  if (!cleanDomain || sources.length === 0) return null

  return (
    <div
      className={cn("relative rounded-lg overflow-hidden bg-white border border-border", className)}
      style={{ width: size, height: size }}
    >
      <img
        src={sources[sourceIndex]}
        alt={`${companyName || domain} logo`}
        className="w-full h-full object-contain"
        onError={handleError}
      />
    </div>
  )
}

// Re-export extractDomain for backwards compatibility
export { extractDomain } from "@/lib/domain"
