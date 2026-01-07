"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CaseStatus } from "@/components/case-status"
import { ConfidenceScore } from "@/components/confidence-score"
import { CompanyLogo } from "@/components/company-logo"
import { formatDistanceToNow } from "date-fns"
import { Icon } from "@/lib/icons"
import { ArrowRightIcon, BuildingIcon, MoreVerticalIcon } from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"
import type { Case } from "@/lib/types"
import { extractDomain } from "./company-logo"
import { CaseActionsSheet } from "./case-actions-sheet"

interface CaseCardProps {
  caseData: Case
  className?: string
}

// Generate a concise summary from complaint text (client-side, improved extraction)
function generateSummary(complaintText: string, maxLength: number = 150): string {
  if (!complaintText) return "No details available"
  
  // Try to extract the first meaningful sentences
  const sentences = complaintText.split(/[.!?]\s+/).filter(s => s.trim().length > 15)
  
  if (sentences.length > 0) {
    // Combine first 2-3 sentences for better context
    let summary = sentences.slice(0, Math.min(3, sentences.length)).join(". ")
    
    // If still too short and we have more sentences, add one more
    if (summary.length < 80 && sentences.length > 3) {
      summary = sentences.slice(0, 4).join(". ")
    }
    
    // Truncate if needed
    if (summary.length > maxLength) {
      summary = summary.substring(0, maxLength).trim()
      // Try to cut at a word boundary
      const lastSpace = summary.lastIndexOf(" ")
      const lastPeriod = summary.lastIndexOf(".")
      const cutPoint = lastPeriod > maxLength * 0.7 ? lastPeriod + 1 : lastSpace
      if (cutPoint > maxLength * 0.6) {
        summary = summary.substring(0, cutPoint)
      }
      if (!summary.endsWith(".") && !summary.endsWith("...")) {
        summary += "..."
      }
    }
    
    return summary
  }
  
  // Fallback: truncate the whole text
  if (complaintText.length > maxLength) {
    return complaintText.substring(0, maxLength).trim() + "..."
  }
  
  return complaintText
}

// Get OG image URL from domain - try common patterns
function getOGImageUrl(domain: string | null): string | null {
  if (!domain) return null
  
  // Try common OG image paths (many sites use these patterns)
  // The image component will handle errors gracefully
  return `https://${domain}/og-image.png`
}

// Get Unsplash fallback image based on company name
function getUnsplashFallback(companyName: string): string {
  // Clean company name for search - extract key terms
  const cleanName = companyName
    .toLowerCase()
    .replace(/\s+(airways|airlines|airline|air)$/i, "")
    .replace(/\s+(resort|hotel|inn|lodging)$/i, "")
    .replace(/\s+(restaurant|cafe|bistro)$/i, "")
    .replace(/\s+(store|shop|retail)$/i, "")
    .trim()
  
  // Create a simple hash from company name for consistent image per company
  let hash = 0
  for (let i = 0; i < cleanName.length; i++) {
    hash = ((hash << 5) - hash) + cleanName.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  
  // Use Picsum Photos with a seed based on company name for consistent images
  // This gives us a random but consistent image per company
  const seed = Math.abs(hash) % 1000
  return `https://picsum.photos/seed/${seed}/800/400`
}

export function CaseCard({ caseData, className }: CaseCardProps) {
  const currency = caseData.currency || "GBP"
  const currencySymbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "€"
  const summary = generateSummary(caseData.complaint_text)
  const domain = caseData.company_domain || extractDomain(caseData.company_name)
  const ogImageUrl = getOGImageUrl(domain)
  const fallbackImageUrl = getUnsplashFallback(caseData.company_name)
  const [imageError, setImageError] = useState(false)
  
  // Drafts should link to continue editing, other cases to view
  const isDraft = caseData.status === "draft"
  const linkHref = isDraft ? `/new?draft=${caseData.id}` : `/cases/${caseData.id}`

  return (
    <>
      {/* Mobile: Simpler list-style card with actions sheet */}
      <div
        className={cn(
          "sm:hidden flex items-center gap-3 p-3 bg-card border border-border rounded-xl transition-colors",
          className,
        )}
      >
        <Link href={linkHref} className="flex items-center gap-3 flex-1 min-w-0 active:opacity-70">
          <CompanyLogo companyName={caseData.company_name} domain={caseData.company_domain} size={40} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold truncate text-sm">{caseData.company_name}</span>
              <CaseStatus status={caseData.status} resolutionOutcome={caseData.resolution_outcome} />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{summary}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              {caseData.purchase_amount && (
                <span className="font-mono font-medium text-foreground">
                  {currencySymbol}{caseData.purchase_amount.toFixed(0)}
                </span>
              )}
              {caseData.confidence_score !== null && (
                <span className="text-peach-500 font-medium">{caseData.confidence_score}% match</span>
              )}
            </div>
          </div>
        </Link>
        <CaseActionsSheet
          caseId={caseData.id}
          caseName={caseData.company_name}
          trigger={
            <button
              type="button"
              className="p-2 -mr-1 rounded-lg hover:bg-muted active:bg-muted/80 transition-colors shrink-0"
            >
              <Icon icon={MoreVerticalIcon} size={18} className="text-muted-foreground" />
            </button>
          }
        />
      </div>

      {/* Desktop: Full card - wrapped in Link */}
      <Link href={linkHref} className="hidden sm:block">

      {/* Desktop: Full card with improved layout */}
      <div className="hidden sm:block">
        <Card
          className={cn(
            "flex flex-col bg-card border border-border rounded-xl transition-all duration-200 group cursor-pointer h-full overflow-hidden p-0 gap-0",
            className,
          )}
        >
        {/* Image at top with fade - OG image or Unsplash fallback */}
        <div className="relative w-full h-40 overflow-hidden">
          {(ogImageUrl && domain && !imageError) ? (
            <Image
              src={ogImageUrl}
              alt={`${caseData.company_name} website preview`}
              fill
              className="object-cover"
              unoptimized
              onError={() => {
                setImageError(true)
              }}
            />
          ) : (
            <Image
              src={fallbackImageUrl}
              alt={`${caseData.company_name}`}
              fill
              className="object-cover"
              unoptimized
            />
          )}
          {/* White gradient overlay - 40% at top to 100% at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white pointer-events-none" />
          {/* Status and confidence score overlaid on top corners */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <CaseStatus status={caseData.status} resolutionOutcome={caseData.resolution_outcome} />
            {caseData.confidence_score !== null && (
              <ConfidenceScore 
                score={caseData.confidence_score} 
                size="sm" 
                className="bg-black/85 backdrop-blur-md shadow-lg [&_span]:text-white [&_span]:font-semibold"
              />
            )}
          </div>
          {/* Company Logo and Name - overlapping bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
            <div className="flex items-start gap-2.5">
              <CompanyLogo companyName={caseData.company_name} domain={caseData.company_domain} size={32} className="shrink-0" />
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="font-semibold text-base leading-tight mb-0.5">{caseData.company_name}</h3>
                {caseData.title && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{caseData.title}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content section */}
        <div className="flex flex-col flex-1 px-4 pt-1 pb-2">
          {/* Summary/Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-2">
            {summary}
          </p>
        </div>
        
        {/* Footer */}
        <CardFooter className="!pt-2 pb-3 px-4 border-t border-border flex items-center justify-between bg-muted/30 mt-auto">
          {caseData.purchase_amount ? (
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-mono font-semibold text-foreground">
                {currencySymbol}{caseData.purchase_amount.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon icon={BuildingIcon} size={16} />
              <span>Pending analysis</span>
            </div>
          )}
          <Icon icon={ArrowRightIcon} size={16} className="h-4 w-4 text-muted-foreground group-hover:text-peach-500 transition-colors" />
        </CardFooter>
        </Card>
      </div>
      </Link>
    </>
  )
}
