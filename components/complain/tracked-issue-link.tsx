"use client"

import Link from "next/link"
import { Icon } from "@/lib/icons"
import { ArrowRight01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface TrackedIssueLinkProps {
  companyName: string
  issue: {
    type: string
    title: string
    description: string
  }
  index: number
}

export function TrackedIssueLink({ companyName, issue, index }: TrackedIssueLinkProps) {
  const handleClick = () => {
    trackEvent(AnalyticsEvents.COMPLAIN.ISSUE_CLICKED, {
      company_name: companyName,
      issue_type: issue.type,
      issue_title: issue.title,
      issue_index: index,
    })
  }

  return (
    <Link
      href={`/new?company=${encodeURIComponent(companyName)}&issue=${encodeURIComponent(issue.type)}`}
      onClick={handleClick}
      className="flex items-center justify-between p-4 rounded-lg border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-peach-100 text-peach-600 flex items-center justify-center text-sm font-medium">
          {index + 1}
        </span>
        <div>
          <p className="font-medium">{issue.title}</p>
          <p className="text-sm text-muted-foreground">{issue.description}</p>
        </div>
      </div>
      <Icon
        icon={ArrowRight01Icon}
        size={18}
        className="text-muted-foreground group-hover:text-peach-500 transition-colors"
      />
    </Link>
  )
}
