"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import { ArrowRight01Icon, Mail01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface TrackedStartComplaintButtonProps {
  companyName: string
  variant?: "primary" | "secondary" | "sidebar"
  location: string
}

export function TrackedStartComplaintButton({
  companyName,
  variant = "primary",
  location,
}: TrackedStartComplaintButtonProps) {
  const handleClick = () => {
    trackEvent(AnalyticsEvents.COMPLAIN.START_COMPLAINT_CLICKED, {
      company_name: companyName,
      button_variant: variant,
      location,
    })
  }

  if (variant === "primary") {
    return (
      <Button size="lg" variant="coral" asChild className="px-8" onClick={handleClick}>
        <Link href={`/new?company=${encodeURIComponent(companyName)}`}>
          Start My {companyName} Complaint
          <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
        </Link>
      </Button>
    )
  }

  if (variant === "secondary") {
    return (
      <Button size="lg" variant="outline" asChild onClick={handleClick}>
        <Link href="#contact-info">
          <Icon icon={Mail01Icon} size={16} className="mr-2" />
          View Contact Details
        </Link>
      </Button>
    )
  }

  // sidebar variant
  return (
    <Button variant="coral" className="w-full" asChild onClick={handleClick}>
      <Link href={`/new?company=${encodeURIComponent(companyName)}`}>
        Start My Complaint
      </Link>
    </Button>
  )
}
