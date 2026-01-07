"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Icon } from "@/lib/icons"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight01Icon,
  Call02Icon,
  LinkSquare01Icon,
  InformationCircleIcon,
} from "@hugeicons-pro/core-stroke-rounded"

interface OmbudsmanInfo {
  name: string
  shortName: string
  url: string
  phone?: string
  description: string
  maxAward?: string
  processingTime?: string
  requirement: string
}

interface RegulatorInfo {
  name: string
  shortName: string
  url: string
  description: string
  canAward: boolean
}

interface ADRInfo {
  name: string
  url: string
  description: string
}

interface EscalationPathwayProps {
  companyName: string
  industry: string
  ombudsman: OmbudsmanInfo | null
  regulator: RegulatorInfo | null
  adr: ADRInfo | null
  complaintDeadline: string
  escalationDeadline: string
}

export function EscalationPathway({
  companyName,
  industry,
  ombudsman,
  regulator,
  adr,
  complaintDeadline,
  escalationDeadline,
}: EscalationPathwayProps) {
  const hasOmbudsmanOrADR = ombudsman || adr

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display mb-2">If {companyName} Won&apos;t Help</h2>
        <p className="text-sm text-muted-foreground">
          External escalation options if your complaint isn&apos;t resolved
        </p>
      </div>

      {/* Timeline reminder */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
        <Icon icon={InformationCircleIcon} size={20} className="text-amber-600 shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-amber-800">Important Deadlines</p>
          <p className="text-amber-700">
            Wait <strong>{complaintDeadline}</strong> for company response before escalating.
            You have <strong>{escalationDeadline}</strong> to make a claim.
          </p>
        </div>
      </div>

      {/* Escalation flow */}
      <div className="space-y-4">
        {/* Ombudsman */}
        {ombudsman && (
          <div className="relative">
            <div className="rounded-xl border-2 border-lavender-300 bg-gradient-to-br from-lavender-50 to-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge className="mb-2 bg-lavender-100 text-lavender-700 hover:bg-lavender-100">
                    Recommended
                  </Badge>
                  <h3 className="font-semibold text-lg">{ombudsman.shortName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ombudsman.description}
                  </p>
                </div>
                <a
                  href={ombudsman.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full bg-lavender-500 p-3 text-white hover:bg-lavender-600 transition-colors"
                >
                  <Icon icon={LinkSquare01Icon} size={20} />
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-lavender-200">
                {ombudsman.maxAward && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Max Award</p>
                    <p className="font-semibold text-lavender-700">{ombudsman.maxAward}</p>
                  </div>
                )}
                {ombudsman.processingTime && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Processing</p>
                    <p className="font-semibold">{ombudsman.processingTime}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Requirement</p>
                  <p className="font-semibold">{ombudsman.requirement}</p>
                </div>
              </div>

              {ombudsman.phone && (
                <a
                  href={`tel:${ombudsman.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 mt-4 text-sm text-lavender-600 hover:text-lavender-700"
                >
                  <Icon icon={Call02Icon} size={16} />
                  {ombudsman.phone}
                </a>
              )}
            </div>

            {/* Arrow to next */}
            {(adr || regulator) && (
              <div className="flex justify-center my-2">
                <div className="h-8 w-0.5 bg-forest-200" />
              </div>
            )}
          </div>
        )}

        {/* ADR */}
        {adr && !ombudsman && (
          <div className="relative">
            <div className="rounded-xl border border-forest-200 bg-forest-50/50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    Alternative Dispute Resolution
                  </Badge>
                  <h3 className="font-semibold text-lg">{adr.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {adr.description}
                  </p>
                </div>
                <a
                  href={adr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full bg-forest-500 p-3 text-white hover:bg-forest-600 transition-colors"
                >
                  <Icon icon={LinkSquare01Icon} size={20} />
                </a>
              </div>
            </div>

            {regulator && (
              <div className="flex justify-center my-2">
                <div className="h-8 w-0.5 bg-forest-200" />
              </div>
            )}
          </div>
        )}

        {/* Regulator */}
        {regulator && (
          <div className="relative">
            <div className="rounded-xl border border-forest-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    Regulator
                  </Badge>
                  <h3 className="font-semibold text-lg">{regulator.shortName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {regulator.description}
                  </p>
                  {!regulator.canAward && (
                    <p className="text-xs text-amber-600 mt-2">
                      Note: Regulators can&apos;t award compensation for individual complaints, but can investigate patterns of misconduct.
                    </p>
                  )}
                </div>
                <a
                  href={regulator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full bg-forest-100 p-3 text-forest-600 hover:bg-forest-200 transition-colors"
                >
                  <Icon icon={LinkSquare01Icon} size={20} />
                </a>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <div className="h-8 w-0.5 bg-forest-200" />
            </div>
          </div>
        )}

        {/* Small Claims Court */}
        <div className="rounded-xl border border-charcoal/20 bg-charcoal p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge className="mb-2 bg-white/20 text-white hover:bg-white/20">
                Final Resort
              </Badge>
              <h3 className="font-semibold text-lg">Small Claims Court</h3>
              <p className="text-sm text-white/70 mt-1">
                Take legal action for claims up to £10,000 (England/Wales). No lawyer needed.
                Court fee: £35-£455 depending on claim amount.
              </p>
            </div>
            <a
              href="https://www.gov.uk/make-court-claim-for-money"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-white/20 p-3 text-white hover:bg-white/30 transition-colors"
            >
              <Icon icon={LinkSquare01Icon} size={20} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wide">Max Claim</p>
              <p className="font-semibold">£10,000</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wide">Processing</p>
              <p className="font-semibold">4-8 weeks typical</p>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful links */}
      <div className="pt-4 border-t border-forest-100">
        <p className="text-xs text-muted-foreground mb-2">Helpful resources:</p>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://www.citizensadvice.org.uk/consumer/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-forest-600 hover:text-forest-700 hover:underline"
          >
            Citizens Advice
            <Icon icon={ArrowRight01Icon} size={12} />
          </a>
          <span className="text-muted-foreground">|</span>
          <a
            href="https://www.which.co.uk/consumer-rights"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-forest-600 hover:text-forest-700 hover:underline"
          >
            Which? Consumer Rights
            <Icon icon={ArrowRight01Icon} size={12} />
          </a>
          <span className="text-muted-foreground">|</span>
          <a
            href="https://www.gov.uk/consumer-protection-rights"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-forest-600 hover:text-forest-700 hover:underline"
          >
            Gov.uk Consumer Rights
            <Icon icon={ArrowRight01Icon} size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}
