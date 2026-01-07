"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import {
  Mail01Icon,
  Call02Icon,
  Comment01Icon,
  ArrowRight01Icon,
  Copy01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

interface QuickActionsBarProps {
  companyName: string
  emails: { address: string; type: string }[]
  phones: { number: string; type: string; hours?: string; cost?: string }[]
  socialMedia: {
    twitter?: string
    facebook?: string
  }
  liveChat?: string
}

export function QuickActionsBar({
  companyName,
  emails,
  phones,
  socialMedia,
  liveChat,
}: QuickActionsBarProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const handleCopyEmail = async (email: string) => {
    await navigator.clipboard.writeText(email)
    setCopiedEmail(email)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  // Get primary email (complaints first, then customer service)
  const primaryEmail = emails.find((e) => e.type === "Complaints") || emails[0]
  // Get primary phone
  const primaryPhone = phones.find((p) => p.type === "Customer Service") || phones[0]

  const actions = [
    primaryEmail && {
      id: "email",
      label: "Email",
      sublabel: primaryEmail.type,
      icon: Mail01Icon,
      action: () => handleCopyEmail(primaryEmail.address),
      actionLabel: copiedEmail === primaryEmail.address ? "Copied!" : "Copy",
      href: `mailto:${primaryEmail.address}`,
    },
    primaryPhone && {
      id: "call",
      label: "Call",
      sublabel: primaryPhone.hours || "Customer Service",
      icon: Call02Icon,
      href: `tel:${primaryPhone.number.replace(/\s/g, "")}`,
      actionLabel: primaryPhone.number,
    },
    liveChat && {
      id: "chat",
      label: "Live Chat",
      sublabel: "Start chat online",
      icon: Comment01Icon,
      href: liveChat,
      external: true,
    },
    socialMedia?.twitter && {
      id: "twitter",
      label: "Tweet",
      sublabel: `@${socialMedia.twitter}`,
      icon: () => (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `@${socialMedia.twitter} `
      )}`,
      external: true,
    },
    {
      id: "complaint",
      label: "Start Complaint",
      sublabel: "AI-powered letter",
      icon: ArrowRight01Icon,
      href: `/new?company=${encodeURIComponent(companyName)}`,
      primary: true,
    },
  ].filter(Boolean) as Array<{
    id: string
    label: string
    sublabel: string
    icon: React.ComponentType<{ size?: number; className?: string }> | (() => JSX.Element)
    action?: () => void
    actionLabel?: string
    href?: string
    external?: boolean
    primary?: boolean
  }>

  return (
    <div className="w-full overflow-x-auto pb-2 -mb-2">
      <div className="flex gap-3 min-w-max px-1">
        {actions.map((item) => {
          const IconComponent = item.icon
          const content = (
            <div
              className={cn(
                "flex flex-col items-center justify-center min-w-[100px] p-4 rounded-xl border transition-all",
                item.primary
                  ? "bg-coral-500 border-coral-500 text-white hover:bg-coral-600"
                  : "bg-white border-forest-100 hover:border-forest-300 hover:shadow-sm"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full mb-2",
                  item.primary ? "bg-coral-400" : "bg-forest-50"
                )}
              >
                {typeof IconComponent === "function" && IconComponent.length === 0 ? (
                  <IconComponent />
                ) : (
                  <Icon
                    icon={IconComponent as React.ComponentType<{ size?: number; className?: string }>}
                    size={20}
                    className={item.primary ? "text-white" : "text-forest-600"}
                  />
                )}
              </div>
              <span className="font-medium text-sm">{item.label}</span>
              <span
                className={cn(
                  "text-xs mt-0.5",
                  item.primary ? "text-coral-100" : "text-muted-foreground"
                )}
              >
                {item.sublabel}
              </span>
              {item.actionLabel && !item.primary && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-7 text-xs"
                  onClick={(e) => {
                    if (item.action) {
                      e.preventDefault()
                      item.action()
                    }
                  }}
                >
                  <Icon
                    icon={copiedEmail === (emails.find((e) => e.type === "Complaints") || emails[0])?.address ? CheckmarkCircle01Icon : Copy01Icon}
                    size={12}
                    className="mr-1"
                  />
                  {item.actionLabel}
                </Button>
              )}
            </div>
          )

          if (item.href) {
            return item.external ? (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {content}
              </a>
            ) : (
              <Link key={item.id} href={item.href} className="block">
                {content}
              </Link>
            )
          }

          return (
            <button key={item.id} onClick={item.action} className="block">
              {content}
            </button>
          )
        })}
      </div>
    </div>
  )
}
