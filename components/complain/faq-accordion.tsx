"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/lib/icons"
import { ArrowDown01Icon } from "@hugeicons-pro/core-stroke-rounded"

interface FAQ {
  question: string
  answer: string
}

interface FAQAccordionProps {
  faqs: FAQ[]
  companyName: string
}

export function FAQAccordion({ faqs, companyName }: FAQAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  if (!faqs || faqs.length === 0) return null

  // Replace [company] placeholders with actual company name
  const processedFaqs = faqs.map((faq) => ({
    question: faq.question.replace(/\[company\]/gi, companyName),
    answer: faq.answer.replace(/\[company\]/gi, companyName),
  }))

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-display">Frequently Asked Questions</h2>

      <div className="divide-y divide-forest-100 rounded-xl border border-forest-100 bg-white overflow-hidden">
        {processedFaqs.map((faq, index) => {
          const isExpanded = expandedIndex === index

          return (
            <div key={index}>
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-forest-50/50 transition-colors"
              >
                <span className="font-medium text-sm">{faq.question}</span>
                <Icon
                  icon={ArrowDown01Icon}
                  size={18}
                  className={cn(
                    "shrink-0 text-muted-foreground transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid transition-all duration-200 ease-in-out",
                  isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 text-sm text-muted-foreground">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
