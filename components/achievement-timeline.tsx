"use client"

import { Icon } from "@/lib/icons"
import {
  Tick01Icon,
  File01Icon,
  Mail01Icon,
  CheckmarkCircle01Icon
} from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"

const timelineSteps = [
  {
    label: "Today",
    title: "Start your complaint",
    icon: File01Icon,
    items: [
      "Describe your issue in plain English",
      "Upload evidence (receipts, screenshots, emails)",
      "AI identifies your legal rights",
    ],
  },
  {
    label: "Day 1",
    title: "Get your letter ready",
    icon: Mail01Icon,
    items: [
      "Review AI-generated complaint letter",
      "Automatic legal citations included",
      "Company contacts identified",
    ],
  },
  {
    label: "Day 7",
    title: "Get results",
    icon: CheckmarkCircle01Icon,
    items: [
      "Track company response",
      "Escalation guidance if needed",
      "Resolution support",
    ],
  },
]

export function AchievementTimeline() {
  return (
    <section className="py-16 md:py-24 border-b border-forest-100">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground font-display">
            From complaint to resolution
          </h2>
          <p className="text-lg text-muted-foreground">
            See what you can achieve with NoReply
          </p>
        </div>

        {/* Timeline with pills and cards */}
        <div className="max-w-5xl mx-auto">
          {/* Time pills with connecting lines */}
          <div className="relative flex items-center mb-12">
            {/* Single continuous connecting line - from center of first pill to center of last pill */}
            <div className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-forest-200 z-0" 
                 style={{ 
                   left: '16.66%', 
                   right: '16.66%'
                 }} />
            
            {timelineSteps.map((step, index) => (
              <div key={step.label} className="relative flex-1 flex items-center justify-center z-10">
                {/* Pill with background to cover the line */}
                <div className="px-4 py-2 rounded-full bg-forest-500 text-white text-sm font-medium relative z-10">
                  {step.label}
                </div>
              </div>
            ))}
          </div>

          {/* Content cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {timelineSteps.map((step, index) => {
              return (
                <div
                  key={step.label}
                  className="p-6 rounded-lg border border-forest-200 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-forest-50 border border-forest-100">
                      <Icon icon={step.icon} size={20} color="currentColor" className="text-forest-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground font-display">
                      {step.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Icon icon={Tick01Icon} size={20} color="currentColor" className="h-5 w-5 text-peach-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
