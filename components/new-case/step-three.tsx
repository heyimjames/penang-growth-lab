"use client"

import { Icon } from "@/lib/icons"
import { CheckmarkCircle01Icon, FileSearchIcon, JusticeScale01Icon, Building01Icon, File01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { cn } from "@/lib/utils"

interface StepThreeProps {
  isAnalyzing: boolean
}

const analysisSteps = [
  { icon: FileSearchIcon, label: "Analyzing your complaint...", delay: 0 },
  { icon: Building01Icon, label: "Researching company...", delay: 750 },
  { icon: JusticeScale01Icon, label: "Finding relevant laws...", delay: 1500 },
  { icon: File01Icon, label: "Building your complaint...", delay: 2250 },
]

export function StepThree({ isAnalyzing }: StepThreeProps) {
  return (
    <div className="py-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-full bg-lavender-100 flex items-center justify-center">
            {isAnalyzing ? (
              <div className="w-10 h-10 border-[3px] border-lavender-200 border-t-lavender-500 rounded-full animate-spin" />
            ) : (
              <Icon icon={CheckmarkCircle01Icon} size={40} className="text-lavender-500" />
            )}
          </div>
          {isAnalyzing && <div className="absolute inset-0 rounded-full border-2 border-lavender-300 animate-ping" />}
        </div>

        <h3 className="text-xl font-semibold mb-2">{isAnalyzing ? "Building Your Complaint" : "Analysis Complete"}</h3>
        <p className="text-muted-foreground max-w-md">
          {isAnalyzing
            ? "Our AI is analyzing your complaint, researching relevant consumer laws, and preparing everything."
            : "Your case has been analyzed. Review the results on the next page."}
        </p>
        {isAnalyzing && (
          <p className="text-xs text-muted-foreground mt-2">
            This usually takes 15-30 seconds
          </p>
        )}

        {/* Analysis Steps */}
        <div className="mt-8 space-y-4 w-full max-w-sm">
          {analysisSteps.map((step, index) => (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-500",
                isAnalyzing ? "bg-muted/50" : "bg-success/10",
              )}
              style={{
                animationDelay: `${step.delay}ms`,
              }}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  isAnalyzing ? "bg-lavender-100 text-lavender-500" : "bg-success/20 text-success",
                )}
              >
                <Icon icon={step.icon} size={16} />
              </div>
              <span className="text-sm font-medium">{step.label}</span>
              {!isAnalyzing && (
                <svg className="h-4 w-4 ml-auto text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
