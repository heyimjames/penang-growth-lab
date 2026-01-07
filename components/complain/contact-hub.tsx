"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import {
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  UserIcon,
  Clock01Icon,
  LinkSquare01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

interface CompanyEmail {
  address: string
  type: string
}

interface CompanyPhone {
  number: string
  type: string
  hours?: string
  cost?: string
}

interface CompanyAddress {
  type: string
  lines: string[]
  postcode: string
}

interface SocialMediaLinks {
  twitter?: string
  facebook?: string
  instagram?: string
  trustpilot?: string
}

interface ExecutiveContact {
  name?: string
  title: string
  email?: string
}

interface ContactHubProps {
  emails: CompanyEmail[]
  phones: CompanyPhone[]
  addresses: CompanyAddress[]
  socialMedia: SocialMediaLinks
  executives: ExecutiveContact[]
  openingHours?: string
  liveChat?: string
}

export function ContactHub({
  emails,
  phones,
  addresses,
  socialMedia,
  executives,
  openingHours,
  liveChat,
}: ContactHubProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedItem(label)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const hasEmails = emails.length > 0
  const hasPhones = phones.length > 0
  const hasAddresses = addresses.length > 0
  const hasExecutives = executives.length > 0
  const hasSocial = Object.values(socialMedia).some(Boolean)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-display">Contact Information</h2>

      {/* Opening hours banner */}
      {openingHours && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-forest-50 rounded-lg p-3">
          <Icon icon={Clock01Icon} size={16} className="shrink-0 text-forest-600" />
          <span>{openingHours}</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Emails */}
        {hasEmails && (
          <div className="rounded-xl border border-forest-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon={Mail01Icon} size={18} className="text-forest-600" />
              <h3 className="font-semibold text-sm">Email</h3>
            </div>
            <div className="space-y-2">
              {emails.map((email, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-mono truncate">{email.address}</p>
                    <p className="text-xs text-muted-foreground">{email.type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(email.address, `email-${i}`)}
                    className="h-7 shrink-0"
                  >
                    <Icon
                      icon={copiedItem === `email-${i}` ? CheckmarkCircle01Icon : Copy01Icon}
                      size={14}
                    />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phones */}
        {hasPhones && (
          <div className="rounded-xl border border-forest-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon={Call02Icon} size={18} className="text-forest-600" />
              <h3 className="font-semibold text-sm">Phone</h3>
            </div>
            <div className="space-y-2">
              {phones.map((phone, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="min-w-0">
                    <a
                      href={`tel:${phone.number.replace(/\s/g, "")}`}
                      className="text-sm font-mono hover:text-coral-600 transition-colors"
                    >
                      {phone.number}
                    </a>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{phone.type}</span>
                      {phone.cost && (
                        <>
                          <span>|</span>
                          <span>{phone.cost}</span>
                        </>
                      )}
                    </div>
                    {phone.hours && (
                      <p className="text-xs text-muted-foreground">{phone.hours}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(phone.number, `phone-${i}`)}
                    className="h-7 shrink-0"
                  >
                    <Icon
                      icon={copiedItem === `phone-${i}` ? CheckmarkCircle01Icon : Copy01Icon}
                      size={14}
                    />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Addresses */}
        {hasAddresses && (
          <div className="rounded-xl border border-forest-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon={Location01Icon} size={18} className="text-forest-600" />
              <h3 className="font-semibold text-sm">Postal Address</h3>
            </div>
            <div className="space-y-3">
              {addresses.map((address, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-muted/50"
                >
                  <Badge variant="outline" className="mb-2 text-xs">
                    {address.type}
                  </Badge>
                  <div className="flex items-start justify-between gap-2">
                    <address className="text-sm not-italic leading-relaxed">
                      {address.lines.map((line, j) => (
                        <span key={j}>
                          {line}
                          {j < address.lines.length - 1 && <br />}
                        </span>
                      ))}
                      <br />
                      {address.postcode}
                    </address>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopy(
                          [...address.lines, address.postcode].join("\n"),
                          `address-${i}`
                        )
                      }
                      className="h-7 shrink-0"
                    >
                      <Icon
                        icon={copiedItem === `address-${i}` ? CheckmarkCircle01Icon : Copy01Icon}
                        size={14}
                      />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Executive Contacts */}
        {hasExecutives && (
          <div className="rounded-xl border border-lavender-200 bg-lavender-50/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon={UserIcon} size={18} className="text-lavender-600" />
              <h3 className="font-semibold text-sm">Executive Contacts</h3>
              <Badge variant="outline" className="text-xs ml-auto">
                For escalation
              </Badge>
            </div>
            <div className="space-y-2">
              {executives.map((exec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white"
                >
                  <div className="min-w-0">
                    {exec.name && (
                      <p className="text-sm font-medium">{exec.name}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{exec.title}</p>
                    {exec.email && (
                      <p className="text-sm font-mono text-lavender-700 truncate">
                        {exec.email}
                      </p>
                    )}
                  </div>
                  {exec.email && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(exec.email!, `exec-${i}`)}
                      className="h-7 shrink-0"
                    >
                      <Icon
                        icon={copiedItem === `exec-${i}` ? CheckmarkCircle01Icon : Copy01Icon}
                        size={14}
                      />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Use executive contacts only after standard complaints process fails.
            </p>
          </div>
        )}
      </div>

      {/* Social Media */}
      {hasSocial && (
        <div className="pt-4 border-t border-forest-100">
          <h3 className="font-semibold text-sm mb-3">Social Media</h3>
          <div className="flex flex-wrap gap-2">
            {socialMedia.twitter && (
              <a
                href={`https://twitter.com/${socialMedia.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @{socialMedia.twitter}
              </a>
            )}
            {socialMedia.facebook && (
              <a
                href={`https://facebook.com/${socialMedia.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
            )}
            {socialMedia.trustpilot && (
              <a
                href={`https://www.trustpilot.com/review/${socialMedia.trustpilot}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                Trustpilot Reviews
              </a>
            )}
          </div>
        </div>
      )}

      {/* Live Chat */}
      {liveChat && (
        <a
          href={liveChat}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-3 rounded-lg border border-forest-200 bg-forest-50 hover:bg-forest-100 transition-colors text-sm font-medium"
        >
          <Icon icon={LinkSquare01Icon} size={16} />
          Open Live Chat
        </a>
      )}
    </div>
  )
}
