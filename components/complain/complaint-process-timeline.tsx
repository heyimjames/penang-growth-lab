"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import {
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  Copy01Icon,
  Clock01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

interface ComplaintStep {
  step: number
  title: string
  description: string
  timeline: string
  actions: string[]
  templateText?: string
  escalationTrigger?: string
}

interface ComplaintProcessTimelineProps {
  steps: ComplaintStep[]
  companyName: string
}

export function ComplaintProcessTimeline({ steps, companyName }: ComplaintProcessTimelineProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(1)
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const handleCopyTemplate = async (step: number, text: string) => {
    // Replace placeholders with company name
    const filledText = text.replace(/\[company\]/gi, companyName)
    await navigator.clipboard.writeText(filledText)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold font-display">Step-by-Step Complaint Process</h2>
      </div>

      <div className="relative">
        {/* Vertical line connecting steps */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-coral-300 via-peach-300 to-forest-300" />

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isExpanded = expandedStep === step.step
            const isLast = index === steps.length - 1

            return (
              <div key={step.step} className="relative">
                {/* Step indicator */}
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : step.step)}
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-4">
                    {/* Step number circle */}
                    <div
                      className={cn(
                        "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-white font-bold transition-all",
                        isExpanded
                          ? "border-coral-500 text-coral-600 shadow-md"
                          : "border-forest-200 text-forest-600"
                      )}
                    >
                      {step.step}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3
                          className={cn(
                            "font-semibold transition-colors",
                            isExpanded ? "text-coral-700" : "text-foreground"
                          )}
                        >
                          {step.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          <Icon icon={Clock01Icon} size={12} className="mr-1" />
                          {step.timeline}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </div>

                    {/* Expand indicator */}
                    <div
                      className={cn(
                        "mt-3 transition-transform",
                        isExpanded && "rotate-90"
                      )}
                    >
                      <Icon icon={ArrowRight01Icon} size={20} className="text-muted-foreground" />
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="ml-16 mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Actions checklist */}
                    <div className="rounded-lg border border-forest-100 bg-forest-50/50 p-4">
                      <h4 className="font-medium text-sm text-forest-700 mb-3">What to do:</h4>
                      <ul className="space-y-2">
                        {step.actions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Icon
                              icon={CheckmarkCircle01Icon}
                              size={16}
                              className="text-forest-500 mt-0.5 shrink-0"
                            />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Template text */}
                    {step.templateText && (
                      <div className="rounded-lg border border-lavender-200 bg-lavender-50 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm text-lavender-700">Template text:</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyTemplate(step.step, step.templateText!)}
                            className="h-8 text-xs"
                          >
                            <Icon
                              icon={Copy01Icon}
                              size={14}
                              className="mr-1"
                            />
                            {copiedStep === step.step ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground italic bg-white/50 rounded p-3">
                          &ldquo;{step.templateText}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Escalation trigger */}
                    {step.escalationTrigger && !isLast && (
                      <div className="flex items-center gap-2 text-sm text-coral-600 bg-coral-50 rounded-lg p-3 border border-coral-100">
                        <Icon icon={ArrowRight01Icon} size={16} />
                        <span>
                          <strong>Move to next step if:</strong> {step.escalationTrigger}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
