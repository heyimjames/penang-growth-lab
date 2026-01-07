"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import {
  Copy01Icon,
  CheckmarkCircle01Icon,
  ArrowDown01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

interface TemplatePhrase {
  context: string
  text: string
}

interface TemplatePhraseSectionProps {
  phrases: TemplatePhrase[]
  companyName: string
}

export function TemplatePhraseSection({ phrases, companyName }: TemplatePhraseSectionProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCopy = async (index: number, text: string) => {
    // Replace placeholders
    const processedText = text
      .replace(/\[company\]/gi, companyName)
      .replace(/\[date\]/gi, new Date().toLocaleDateString("en-GB"))

    await navigator.clipboard.writeText(processedText)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  if (!phrases || phrases.length === 0) return null

  const displayedPhrases = isExpanded ? phrases : phrases.slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-display">Template Phrases</h2>
        <p className="text-xs text-muted-foreground">Click to copy</p>
      </div>

      <div className="space-y-3">
        {displayedPhrases.map((phrase, index) => (
          <div
            key={index}
            className="group rounded-lg border border-forest-100 bg-white p-4 hover:border-forest-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs font-medium text-forest-600 uppercase tracking-wide mb-1">
                  {phrase.context}
                </p>
                <p className="text-sm text-muted-foreground">
                  &ldquo;{phrase.text}&rdquo;
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(index, phrase.text)}
                className={cn(
                  "h-8 shrink-0 transition-all",
                  copiedIndex === index
                    ? "bg-forest-100 text-forest-700"
                    : "opacity-0 group-hover:opacity-100"
                )}
              >
                <Icon
                  icon={copiedIndex === index ? CheckmarkCircle01Icon : Copy01Icon}
                  size={14}
                  className="mr-1"
                />
                {copiedIndex === index ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {phrases.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          <Icon
            icon={ArrowDown01Icon}
            size={16}
            className={cn("mr-2 transition-transform", isExpanded && "rotate-180")}
          />
          {isExpanded ? "Show less" : `Show ${phrases.length - 3} more phrases`}
        </Button>
      )}
    </div>
  )
}
