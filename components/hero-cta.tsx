"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"
import { Icon } from "@/lib/icons"
import { ArrowRight01Icon } from "@hugeicons-pro/core-stroke-rounded"

interface HeroCTAProps {
  variant?: "primary" | "secondary"
  href: string
  children: React.ReactNode
  location?: string
  className?: string
}

export function HeroCTA({
  variant = "primary",
  href,
  children,
  location = "hero",
  className,
}: HeroCTAProps) {
  const handleClick = () => {
    trackEvent(AnalyticsEvents.NAVIGATION.CTA_CLICKED, {
      button_text: typeof children === "string" ? children : "CTA",
      location,
      destination: href,
      variant,
    })
  }

  if (variant === "primary") {
    return (
      <Button
        size="lg"
        variant="coral"
        asChild
        className={className || "px-8 h-12 text-base font-medium"}
      >
        <Link href={href} onClick={handleClick}>
          {children}
        </Link>
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      variant="outline"
      asChild
      className={className || "border-forest-200 text-forest-600 hover:bg-forest-50 px-8 h-12 text-base font-medium"}
    >
      <Link href={href} onClick={handleClick}>
        {children}
      </Link>
    </Button>
  )
}

// Simpler version for use in pricing sections
export function PricingCTA({
  href,
  children,
  planName,
  highlighted,
  className,
}: {
  href: string
  children: React.ReactNode
  planName: string
  highlighted?: boolean
  className?: string
}) {
  const handleClick = () => {
    trackEvent(AnalyticsEvents.NAVIGATION.CTA_CLICKED, {
      button_text: typeof children === "string" ? children : "Get Started",
      location: "pricing_section",
      destination: href,
      plan: planName,
    })
  }

  return (
    <Button
      size="lg"
      variant={highlighted ? "coral" : "outline"}
      asChild
      className={className || "w-full"}
    >
      <Link href={href} onClick={handleClick}>
        {children}
        {highlighted && <Icon icon={ArrowRight01Icon} size={18} className="ml-2" />}
      </Link>
    </Button>
  )
}
