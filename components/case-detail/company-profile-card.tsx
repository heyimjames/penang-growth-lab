"use client"

import { CompanyLogo } from "@/components/company-logo"
import { Icon } from "@/lib/icons"
import { Store04Icon } from "@hugeicons-pro/core-stroke-rounded"
import { Twitter, Facebook, Instagram, Linkedin, Youtube, ExternalLink, Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"
import { CompanyIntel } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface CompanyProfileCardProps {
  companyName: string
  domain?: string | null
  companyIntel?: CompanyIntel | null
}

// Render star rating with precise visual representation
function StarRating({ score, maxScore = 5 }: { score: number; maxScore?: number }) {
  const fullStars = Math.floor(score)
  const decimal = score - fullStars
  const hasHalfStar = decimal >= 0.25 && decimal < 0.75
  const hasFullStar = decimal >= 0.75
  const actualFullStars = fullStars + (hasFullStar ? 1 : 0)
  const emptyStars = maxScore - actualFullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(actualFullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-3 h-3 fill-amber-400 text-amber-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-3 h-3 fill-amber-400 text-amber-400" />}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3 h-3 text-stone-300 dark:text-stone-600" />
      ))}
    </div>
  )
}

// Get color based on rating score
function getRatingColor(score: number): { bg: string; text: string; border: string } {
  if (score >= 4.5) return { 
    bg: "bg-emerald-500", 
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800"
  }
  if (score >= 4.0) return { 
    bg: "bg-green-500", 
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800"
  }
  if (score >= 3.0) return { 
    bg: "bg-yellow-500", 
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800"
  }
  if (score >= 2.0) return { 
    bg: "bg-orange-500", 
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800"
  }
  return { 
    bg: "bg-red-500", 
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800"
  }
}

// Platform logos/icons
function PlatformLogo({ platform }: { platform: "trustpilot" | "google" | "tripadvisor" }) {
  switch (platform) {
    case "trustpilot":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      )
    case "google":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )
    case "tripadvisor":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#00AF87">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
  }
}

// Rating platform badge with improved design
function RatingBadge({
  platform,
  score,
  reviewCount,
  url,
  fetchedAt,
}: {
  platform: "trustpilot" | "google" | "tripadvisor"
  score: number
  reviewCount: number
  url: string
  fetchedAt?: string
}) {
  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toLocaleString()
  }

  const platformNames: Record<string, string> = {
    trustpilot: "Trustpilot",
    google: "Google",
    tripadvisor: "TripAdvisor",
  }

  const ratingColors = getRatingColor(score)
  const timeAgo = fetchedAt ? formatDistanceToNow(new Date(fetchedAt), { addSuffix: true }) : null

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center gap-2.5 p-3 rounded-xl border transition-all",
        "bg-gradient-to-br from-white to-stone-50 dark:from-stone-900 dark:to-stone-900/50",
        "hover:shadow-md hover:border-stone-300 dark:hover:border-stone-600",
        "border-border"
      )}
    >
      {/* Score badge */}
      <div
        className={cn(
          "w-11 h-11 rounded-lg flex flex-col items-center justify-center text-white shrink-0 shadow-sm",
          ratingColors.bg
        )}
      >
        <span className="text-sm font-bold leading-none">{score.toFixed(1)}</span>
        <span className="text-[8px] opacity-80">/5</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <PlatformLogo platform={platform} />
          <span className="text-xs font-semibold text-foreground">{platformNames[platform]}</span>
        </div>
        <div className="flex items-center gap-1">
          <StarRating score={score} />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-[10px] text-muted-foreground">
            {formatCount(reviewCount)} reviews
          </p>
          {timeAgo && (
            <>
              <span className="text-[10px] text-muted-foreground/50">•</span>
              <p className="text-[10px] text-muted-foreground/70">
                {timeAgo}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Arrow indicator */}
      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0" />
    </a>
  )
}

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

// Social media link button - only shown if URL exists
function SocialLink({ platform, url }: { platform: string; url: string }) {
  if (!url) return null

  const icons: Record<string, React.ReactNode> = {
    twitter: <Twitter className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    tiktok: <TikTokIcon className="w-4 h-4" />,
  }

  const colors: Record<string, string> = {
    twitter: "hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900",
    facebook: "hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600",
    instagram: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white",
    linkedin: "hover:bg-blue-700 hover:text-white dark:hover:bg-blue-700",
    youtube: "hover:bg-red-600 hover:text-white dark:hover:bg-red-600",
    tiktok: "hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900",
  }

  const labels: Record<string, string> = {
    twitter: "X (Twitter)",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
  }

  // Extract username/handle from URL for tooltip
  const getHandle = (url: string, platform: string): string => {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
      const pathParts = urlObj.pathname.split("/").filter(Boolean)
      if (platform === "twitter" || platform === "instagram" || platform === "tiktok") {
        return `@${pathParts[0]?.replace("@", "") || ""}`
      }
      if (platform === "linkedin" && pathParts[0] === "company") {
        return pathParts[1] || ""
      }
      return pathParts[0] || ""
    } catch {
      return ""
    }
  }

  const handle = getHandle(url, platform)

  return (
    <a
      href={url.startsWith("http") ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      title={`${labels[platform] || platform}${handle ? `: ${handle}` : ""}`}
      className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
        "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
        "border border-transparent hover:border-stone-200 dark:hover:border-stone-700",
        "shadow-sm hover:shadow-md",
        colors[platform]
      )}
    >
      {icons[platform] || <ExternalLink className="w-4 h-4" />}
    </a>
  )
}

export function CompanyProfileCard({ companyName, domain, companyIntel }: CompanyProfileCardProps) {
  const ratings = companyIntel?.ratings
  const socialLinks = companyIntel?.socialLinks
  const profile = companyIntel?.companyProfile
  const hasRatings = ratings?.trustpilot || ratings?.google || ratings?.tripadvisor
  
  // Only show social links section if we have at least one official link
  const officialSocialLinks = socialLinks ? Object.entries(socialLinks).filter(([, url]) => url) : []
  const hasSocialLinks = officialSocialLinks.length > 0

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-gradient-to-br from-stone-50 to-stone-100/50 dark:from-stone-900/50 dark:to-stone-800/30">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <Icon icon={Store04Icon} size={16} className="text-forest-500" />
          Company Profile
        </h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Logo and basic info */}
        <div className="flex items-start gap-3">
          <CompanyLogo
            companyName={companyName}
            domain={domain || undefined}
            size={52}
            className="shrink-0 rounded-lg shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-sm leading-tight">{companyName}</h4>
            {domain && (
              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-lavender-600 hover:text-lavender-700 dark:text-lavender-400 dark:hover:text-lavender-300 hover:underline inline-flex items-center gap-1 mt-0.5"
              >
                {domain}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {profile?.industry && (
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{profile.industry}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {profile?.description && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{profile.description}</p>
          </div>
        )}

        {/* Ratings section */}
        {hasRatings && (
          <div className="pt-3 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
              Public Ratings
            </p>
            <div className="space-y-2">
              {ratings?.trustpilot && (
                <RatingBadge
                  platform="trustpilot"
                  score={ratings.trustpilot.score}
                  reviewCount={ratings.trustpilot.reviewCount}
                  url={ratings.trustpilot.url}
                  fetchedAt={ratings.trustpilot.fetchedAt}
                />
              )}
              {ratings?.google && (
                <RatingBadge
                  platform="google"
                  score={ratings.google.score}
                  reviewCount={ratings.google.reviewCount}
                  url={ratings.google.url}
                  fetchedAt={ratings.google.fetchedAt}
                />
              )}
              {ratings?.tripadvisor && (
                <RatingBadge
                  platform="tripadvisor"
                  score={ratings.tripadvisor.score}
                  reviewCount={ratings.tripadvisor.reviewCount}
                  url={ratings.tripadvisor.url}
                  fetchedAt={ratings.tripadvisor.fetchedAt}
                />
              )}
            </div>
          </div>
        )}

        {/* Fallback: Check Public Reviews links (only if no ratings were fetched) */}
        {!hasRatings && domain && (
          <div className="pt-3 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
              Check Reviews
            </p>
            <div className="flex gap-2">
              <a
                href={`https://www.trustpilot.com/review/${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex-1 flex items-center gap-2 p-2.5 rounded-lg border transition-all",
                  "bg-white dark:bg-stone-900 border-border hover:border-emerald-300 dark:hover:border-emerald-700",
                  "hover:shadow-sm"
                )}
              >
                <div className="w-7 h-7 rounded-md flex items-center justify-center bg-emerald-500 text-white shrink-0">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-foreground">Trustpilot</span>
                </div>
              </a>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(companyName)}+reviews`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex-1 flex items-center gap-2 p-2.5 rounded-lg border transition-all",
                  "bg-white dark:bg-stone-900 border-border hover:border-blue-300 dark:hover:border-blue-700",
                  "hover:shadow-sm"
                )}
              >
                <div className="w-7 h-7 rounded-md flex items-center justify-center bg-white dark:bg-stone-800 border border-border shrink-0">
                  <PlatformLogo platform="google" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-foreground">Google</span>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Official Social Media Links - only show if we have verified links */}
        {hasSocialLinks && (
          <div className="pt-3 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
              Official Channels
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks?.twitter && <SocialLink platform="twitter" url={socialLinks.twitter} />}
              {socialLinks?.facebook && <SocialLink platform="facebook" url={socialLinks.facebook} />}
              {socialLinks?.instagram && <SocialLink platform="instagram" url={socialLinks.instagram} />}
              {socialLinks?.linkedin && <SocialLink platform="linkedin" url={socialLinks.linkedin} />}
              {socialLinks?.youtube && <SocialLink platform="youtube" url={socialLinks.youtube} />}
              {socialLinks?.tiktok && <SocialLink platform="tiktok" url={socialLinks.tiktok} />}
            </div>
          </div>
        )}

        {/* Company details (if available) */}
        {(profile?.headquarters || profile?.founded || profile?.employees) && (
          <div className="pt-3 border-t border-border space-y-1.5">
            {profile?.headquarters && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">HQ</span>
                <span className="font-medium text-foreground">{profile.headquarters}</span>
              </div>
            )}
            {profile?.founded && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Founded</span>
                <span className="font-medium text-foreground">{profile.founded}</span>
              </div>
            )}
            {profile?.employees && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Employees</span>
                <span className="font-medium text-foreground">{profile.employees}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
