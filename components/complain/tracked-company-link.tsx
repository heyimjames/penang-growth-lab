"use client"

import Link from "next/link"
import { Icon } from "@/lib/icons"
import { ArrowRight01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface TrackedCompanyLinkProps {
  company: {
    name: string
    slug: string
    industry?: string | null
  }
}

export function TrackedCompanyLink({ company }: TrackedCompanyLinkProps) {
  const handleClick = () => {
    trackEvent(AnalyticsEvents.COMPLAIN.COMPANY_CLICKED, {
      company_name: company.name,
      company_slug: company.slug,
      industry: company.industry,
      source: "directory",
    })
  }

  return (
    <Link
      href={`/complain/${company.slug}`}
      onClick={handleClick}
      className="flex items-center justify-between p-4 rounded-lg border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-colors group"
    >
      <span className="font-medium">{company.name}</span>
      <Icon
        icon={ArrowRight01Icon}
        size={18}
        className="text-muted-foreground group-hover:text-peach-500 transition-colors"
      />
    </Link>
  )
}
