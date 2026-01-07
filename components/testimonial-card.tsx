import { Icon } from "@/lib/icons"
import { StarIcon } from "@hugeicons-pro/core-stroke-rounded"
import { StarIcon as StarSolidIcon } from "@hugeicons-pro/core-solid-rounded"
import { cn } from "@/lib/utils"

interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  company: string
  platform: "twitter" | "trustpilot" | "slack"
  rating?: number
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          icon={i < rating ? StarSolidIcon : StarIcon}
          size={16}
          color={i < rating ? "#fbbf24" : "currentColor"}
          className={cn(
            "h-4 w-4",
            i < rating ? "text-amber-400" : "text-muted"
          )}
        />
      ))}
    </div>
  )
}

function PlatformBadge({ platform }: { platform: TestimonialCardProps["platform"] }) {
  const badges = {
    twitter: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    trustpilot: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
    slack: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
  }

  return (
    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-charcoal text-white">
      {badges[platform]}
    </div>
  )
}

export function TestimonialCard({
  quote,
  name,
  role,
  company,
  platform,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className="flex flex-col p-6 border border-forest-100 rounded-lg bg-white">
      <div className="flex items-start justify-between mb-4">
        <StarRating rating={rating} />
        <PlatformBadge platform={platform} />
      </div>
      <blockquote className="flex-1 text-foreground mb-4">
        "{quote}"
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-forest-100 flex items-center justify-center text-forest-600 font-medium">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-medium text-foreground">{name}</div>
          <div className="text-sm text-muted-foreground">
            {role} • {company}
          </div>
        </div>
      </div>
    </div>
  )
}

interface FeaturedTestimonialProps {
  quote: string
  name: string
  title: string
  context?: string
}

export function FeaturedTestimonial({
  quote,
  name,
  title,
  context,
}: FeaturedTestimonialProps) {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      {/* Concentric circles centered behind text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" r="15%" fill="none" stroke="#9baca4" strokeWidth="1" opacity="0.15" />
          <circle cx="50%" cy="50%" r="25%" fill="none" stroke="#9baca4" strokeWidth="1" opacity="0.12" />
          <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#9baca4" strokeWidth="1" opacity="0.09" />
          <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#9baca4" strokeWidth="1" opacity="0.06" />
          <circle cx="50%" cy="50%" r="55%" fill="none" stroke="#9baca4" strokeWidth="1" opacity="0.03" />
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl text-forest-200 font-serif mb-6">"</div>
          <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-8 font-display">
            {quote}
          </blockquote>
          <div className="space-y-1">
            <div className="font-semibold text-foreground">{name}</div>
            <div className="text-peach-500 font-medium">{title}</div>
            {context && (
              <div className="text-sm text-muted-foreground">{context}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
