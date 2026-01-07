"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import { Icon } from "@/lib/icons"
import { 
  Clock01Icon, 
  AlertCircleIcon, 
  CheckmarkCircle01Icon, 
  InformationCircleIcon,
  Add01Icon,
  Mail01Icon,
  Time01Icon,
  Cancel01Icon,
  Award01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { updateCase } from "@/lib/actions/cases"
import { toast } from "sonner"

interface TimelineEvent {
  date: Date
  event: string
  type: "info" | "warning" | "success" | "error"
}

interface CaseTimelineProps {
  caseId: string
  timeline: TimelineEvent[]
  currentStatus?: string
}

const typeConfig = {
  info: {
    icon: InformationCircleIcon,
    dot: "bg-lavender-500",
  },
  warning: {
    icon: AlertCircleIcon,
    dot: "bg-amber-500",
  },
  success: {
    icon: CheckmarkCircle01Icon,
    dot: "bg-forest-500",
  },
  error: {
    icon: AlertCircleIcon,
    dot: "bg-red-500",
  },
}

// Typical complaint process steps
const processSteps = [
  { step: 1, label: "Send complaint", icon: Mail01Icon, done: true },
  { step: 2, label: "Wait 14 days", icon: Time01Icon, done: false },
  { step: 3, label: "Follow up", icon: Mail01Icon, done: false },
  { step: 4, label: "Escalate if needed", icon: AlertCircleIcon, done: false },
]

// No default timeline - use actual data passed from parent

const quickAddOptions = [
  { label: "Sent complaint", type: "info" as const, icon: Mail01Icon },
  { label: "Received response", type: "success" as const, icon: CheckmarkCircle01Icon },
  { label: "Sent follow-up", type: "info" as const, icon: Mail01Icon },
  { label: "No response (14 days)", type: "warning" as const, icon: Time01Icon },
  { label: "Escalated", type: "error" as const, icon: AlertCircleIcon },
]

const outcomeOptions = [
  { value: "full-refund", label: "Full refund received" },
  { value: "partial-refund", label: "Partial refund received" },
  { value: "replacement", label: "Replacement provided" },
  { value: "voucher-credit", label: "Voucher/credit received" },
  { value: "apology", label: "Apology received" },
  { value: "compensation", label: "Additional compensation" },
  { value: "other", label: "Other resolution" },
]

export function CaseTimeline({ caseId, timeline, currentStatus }: CaseTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(timeline)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState("")
  const [outcomeDetails, setOutcomeDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResolved, setIsResolved] = useState(currentStatus === "resolved")
  
  const sortedTimeline = [...events].sort((a, b) => b.date.getTime() - a.date.getTime())

  const addEvent = (label: string, type: TimelineEvent["type"]) => {
    setEvents([...events, { date: new Date(), event: label, type }])
  }

  const handleMarkResolved = async () => {
    if (!selectedOutcome) {
      toast.error("Please select an outcome")
      return
    }

    setIsSubmitting(true)
    try {
      const outcomeLabel = outcomeOptions.find(o => o.value === selectedOutcome)?.label || selectedOutcome
      const fullOutcome = outcomeDetails 
        ? `${outcomeLabel}: ${outcomeDetails}`
        : outcomeLabel

      const result = await updateCase(caseId, {
        status: "resolved",
        resolution_outcome: fullOutcome,
        resolved_at: new Date().toISOString(),
      })

      if (result) {
        // Add success event to timeline
        setEvents([...events, { 
          date: new Date(), 
          event: `🎉 Case resolved: ${outcomeLabel}`, 
          type: "success" 
        }])
        setIsResolved(true)
        setShowSuccessDialog(false)
        toast.success("Congratulations! Your case has been marked as resolved.")
      } else {
        throw new Error("Failed to update case")
      }
    } catch (error) {
      console.error("Error marking case as resolved:", error)
      toast.error("Failed to mark case as resolved. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Process Guide - Horizontal steps */}
      <div className="rounded-xl border border-border bg-card p-5 overflow-hidden">
        <p className="text-xs font-medium text-muted-foreground mb-3">Typical complaint process</p>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 -mb-1">
          {processSteps.map((step, idx) => (
            <div key={step.step} className="flex items-center shrink-0 sm:shrink sm:flex-1 min-w-0">
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg sm:flex-1 min-w-0",
                step.done ? "bg-forest-50 dark:bg-forest-950/30" : "bg-muted/50"
              )}>
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                  step.done
                    ? "bg-forest-500 text-white"
                    : "bg-muted-foreground/20 text-muted-foreground"
                )}>
                  {step.done ? "✓" : step.step}
                </div>
                <span className={cn(
                  "text-xs font-medium whitespace-nowrap sm:truncate",
                  step.done ? "text-forest-700 dark:text-forest-300" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </div>
              {idx < processSteps.length - 1 && (
                <div className="w-4 h-px bg-border shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Timeline */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">Activity log</p>
            <span className="text-[10px] text-muted-foreground">{events.length} event{events.length !== 1 ? "s" : ""}</span>
          </div>
          
          <div className="space-y-0">
            {sortedTimeline.map((event, index) => {
              const config = typeConfig[event.type]
              const isLast = index === sortedTimeline.length - 1

              return (
                <div key={index} className="flex gap-3">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={cn("w-2 h-2 rounded-full shrink-0 mt-1.5", config.dot)} />
                    {!isLast && <div className="w-px flex-1 bg-border my-1" />}
                  </div>

                  {/* Content */}
                  <div className={cn("flex-1 pb-3", isLast && "pb-0")}>
                    <p className="text-sm font-medium leading-tight">{event.event}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {format(event.date, "MMM d")} • {formatDistanceToNow(event.date, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Add */}
        <div className="lg:col-span-2 space-y-5">
          {/* Mark as Resolved - Prominent CTA */}
          {!isResolved ? (
            <button
              onClick={() => setShowSuccessDialog(true)}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-forest-300 dark:border-forest-700 bg-gradient-to-br from-forest-50 to-forest-100/50 dark:from-forest-950/40 dark:to-forest-900/20 hover:border-forest-400 dark:hover:border-forest-600 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-forest-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon icon={Award01Icon} size={20} color="white" />
              </div>
              <div>
                <p className="font-semibold text-forest-700 dark:text-forest-300">Case Resolved?</p>
                <p className="text-xs text-forest-600/80 dark:text-forest-400/80">
                  Mark as successful and record your outcome
                </p>
              </div>
            </button>
          ) : (
            <div className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-forest-400 dark:border-forest-600 bg-forest-100 dark:bg-forest-900/40">
              <div className="w-10 h-10 rounded-full bg-forest-500 flex items-center justify-center shrink-0">
                <Icon icon={CheckmarkCircle01Icon} size={20} color="white" />
              </div>
              <div>
                <p className="font-semibold text-forest-700 dark:text-forest-300">Case Resolved! 🎉</p>
                <p className="text-xs text-forest-600/80 dark:text-forest-400/80">
                  Congratulations on your successful outcome
                </p>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">Log an event</p>
            <div className="grid grid-cols-1 gap-1.5">
              {quickAddOptions.map((item) => (
                <button
                  key={item.label}
                  onClick={() => addEvent(item.label, item.type)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", typeConfig[item.type].dot)} />
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Next step hint */}
          {!isResolved && (
            <div className="rounded-lg bg-lavender-50/80 dark:bg-lavender-950/20 p-3 border border-lavender-200/30">
              <p className="font-medium text-xs text-lavender-700 dark:text-lavender-300 mb-0.5">Next step</p>
              <p className="text-[11px] text-lavender-600/80 dark:text-lavender-400/80">
                Send your complaint letter, then log the event here to track responses.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon icon={Award01Icon} size={20} className="text-forest-500" />
              Mark Case as Resolved
            </DialogTitle>
            <DialogDescription>
              Congratulations! Tell us about the outcome you received.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">What outcome did you receive?</Label>
              <RadioGroup value={selectedOutcome} onValueChange={setSelectedOutcome}>
                {outcomeOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="text-sm font-normal cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details" className="text-sm font-medium">
                Details (optional)
              </Label>
              <Textarea
                id="details"
                placeholder="e.g., Received £150 refund on 15th January..."
                value={outcomeDetails}
                onChange={(e) => setOutcomeDetails(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowSuccessDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMarkResolved}
              disabled={isSubmitting || !selectedOutcome}
              className="bg-forest-500 hover:bg-forest-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon icon={CheckmarkCircle01Icon} size={16} className="mr-2" />
                  Mark as Resolved
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
