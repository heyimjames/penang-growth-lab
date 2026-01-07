"use client"

import { trackEvent, AnalyticsEvents } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

interface TrackedCTAProps extends Omit<ComponentProps<typeof Button>, "onClick"> {
  href: string
  buttonText: string
  location: string
  eventName?: string
  eventProperties?: Record<string, unknown>
  children: ReactNode
}

export function TrackedCTA({
  href,
  buttonText,
  location,
  eventName,
  eventProperties,
  children,
  ...buttonProps
}: TrackedCTAProps) {
  const handleClick = () => {
    trackEvent(eventName || AnalyticsEvents.NAVIGATION.CTA_CLICKED, {
      button_text: buttonText,
      location,
      destination: href,
      ...eventProperties,
    })
  }

  return (
    <Button asChild {...buttonProps} onClick={handleClick}>
      <Link href={href} onClick={handleClick}>
        {children}
      </Link>
    </Button>
  )
}

interface TrackedLinkProps {
  href: string
  linkText: string
  location: string
  eventName?: string
  eventProperties?: Record<string, unknown>
  children: ReactNode
  className?: string
}

export function TrackedLink({
  href,
  linkText,
  location,
  eventName,
  eventProperties,
  children,
  className,
}: TrackedLinkProps) {
  const handleClick = () => {
    trackEvent(eventName || AnalyticsEvents.NAVIGATION.LINK_CLICKED, {
      link_text: linkText,
      location,
      destination: href,
      ...eventProperties,
    })
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
