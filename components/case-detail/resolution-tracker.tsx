"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icon } from "@/lib/icons"
import {
  CheckmarkCircle01Icon,
  Cancel01Icon,
  MoneyBag01Icon,
  RefreshIcon,
  GiftIcon,
  ThumbsUpIcon,
  Clock01Icon,
  Sad01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { recordCaseOutcome } from "@/lib/actions/outcomes"
import { toast } from "sonner"
import type { ResolutionType, Case } from "@/lib/types"

interface ResolutionTrackerProps {
  caseData: Case
}

const resolutionOptions: {
  value: ResolutionType
  label: string
  icon: typeof CheckmarkCircle01Icon
  description: string
  positive: boolean
}[] = [
  {
    value: "full_refund",
    label: "Full Refund",
    icon: CheckmarkCircle01Icon,
    description: "Got all my money back",
    positive: true,
  },
  {
    value: "partial_refund",
    label: "Partial Refund",
    icon: MoneyBag01Icon,
    description: "Got some money back",
    positive: true,
  },
  {
    value: "compensation",
    label: "Compensation",
    icon: GiftIcon,
    description: "Received extra compensation",
    positive: true,
  },
  {
    value: "replacement",
    label: "Replacement",
    icon: RefreshIcon,
    description: "Got a replacement product/service",
    positive: true,
  },
  {
    value: "service_credit",
    label: "Service Credit",
    icon: ThumbsUpIcon,
    description: "Received store credit or voucher",
    positive: true,
  },
  {
    value: "apology",
    label: "Apology Only",
    icon: ThumbsUpIcon,
    description: "Got an apology but no compensation",
    positive: false,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: Cancel01Icon,
    description: "Company refused to help",
    positive: false,
  },
  {
    value: "no_response",
    label: "No Response",
    icon: Clock01Icon,
    description: "Never heard back from the company",
    positive: false,
  },
]

export function ResolutionTracker({ caseData }: ResolutionTrackerProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"outcome" | "details" | "testimonial" | "success">("outcome")
  const [selectedOutcome, setSelectedOutcome] = useState<ResolutionType | null>(null)
  const [amount, setAmount] = useState("")
  const [testimonial, setTestimonial] = useState("")
  const [shareTestimonial, setShareTestimonial] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isResolved = caseData.status === "resolved"
  const selectedOption = resolutionOptions.find((o) => o.value === selectedOutcome)
  const isPositiveOutcome = selectedOption?.positive ?? false

  const handleOutcomeSelect = (outcome: ResolutionType) => {
    setSelectedOutcome(outcome)
    const option = resolutionOptions.find((o) => o.value === outcome)
    if (option?.positive) {
      setStep("details")
    } else {
      setStep("testimonial")
    }
  }

  const handleSubmit = async () => {
    if (!selectedOutcome) return

    setIsSubmitting(true)
    try {
      const result = await recordCaseOutcome({
        caseId: caseData.id,
        resolutionType: selectedOutcome,
        resolutionAmount: amount ? parseFloat(amount) : undefined,
        testimonialText: testimonial || undefined,
        shareTestimonial,
      })

      if (result.success) {
        setStep("success")
      } else {
        toast.error(result.error || "Failed to record outcome")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep("outcome")
    setSelectedOutcome(null)
    setAmount("")
    setTestimonial("")
    setShareTestimonial(false)
  }

  if (isResolved) {
    return (
      <div className="rounded-xl border border-forest-200 bg-gradient-to-br from-forest-50 to-forest-100/50 p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-forest-500 flex items-center justify-center">
            <Icon icon={CheckmarkCircle01Icon} size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-forest-800">Case Resolved</h3>
            <p className="text-sm text-forest-600">
              {caseData.resolution_type?.replace(/_/g, " ")}
              {caseData.resolution_amount && ` • £${caseData.resolution_amount}`}
            </p>
          </div>
        </div>
        {!caseData.testimonial_text && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Share Your Success Story
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Experience</DialogTitle>
                <DialogDescription>
                  Help others who are going through similar situations by sharing your story.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="testimonial">Your Story</Label>
                  <Textarea
                    id="testimonial"
                    value={testimonial}
                    onChange={(e) => setTestimonial(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="mt-1.5 min-h-[100px]"
                  />
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="share"
                    checked={shareTestimonial}
                    onCheckedChange={(checked) => setShareTestimonial(checked === true)}
                  />
                  <Label htmlFor="share" className="text-sm text-muted-foreground cursor-pointer">
                    I agree to share this testimonial publicly (anonymized)
                  </Label>
                </div>
                <Button className="w-full" onClick={handleSubmit} disabled={!testimonial || isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Testimonial"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
      <DialogTrigger asChild>
        <div className="rounded-xl border-2 border-dashed border-peach-300 bg-gradient-to-br from-peach-50 to-peach-100/50 p-5 cursor-pointer hover:border-peach-400 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-peach-100 flex items-center justify-center">
              <Icon icon={ThumbsUpIcon} size={20} className="text-peach-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Did You Get a Result?</h3>
              <p className="text-sm text-muted-foreground">
                Let us know how it went - your feedback helps others
              </p>
            </div>
          </div>
          <Button variant="coral" size="sm" className="mt-4 w-full">
            Record Outcome
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {step === "outcome" && (
          <>
            <DialogHeader>
              <DialogTitle>What Happened With Your Case?</DialogTitle>
              <DialogDescription>
                Select the outcome of your complaint against {caseData.company_name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 pt-4">
              {resolutionOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOutcomeSelect(option.value)}
                  className={`p-4 rounded-lg border text-left transition-all hover:border-forest-300 hover:bg-forest-50 ${
                    option.positive
                      ? "border-forest-200 bg-forest-50/50"
                      : "border-stone-200 bg-stone-50/50"
                  }`}
                >
                  <Icon
                    icon={option.icon}
                    size={20}
                    className={option.positive ? "text-forest-500" : "text-stone-500"}
                  />
                  <p className="font-medium text-sm mt-2">{option.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>Great News! 🎉</DialogTitle>
              <DialogDescription>
                How much did you receive from {caseData.company_name}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="amount">Amount Received (£)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 450"
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank if not applicable
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("outcome")} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep("testimonial")} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "testimonial" && (
          <>
            <DialogHeader>
              <DialogTitle>
                {isPositiveOutcome ? "Share Your Win!" : "Sorry to Hear That"}
              </DialogTitle>
              <DialogDescription>
                {isPositiveOutcome
                  ? "Your story could help others fighting the same battle"
                  : "Your feedback still helps us improve and support others"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="testimonial">Your Experience (Optional)</Label>
                <Textarea
                  id="testimonial"
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  placeholder={
                    isPositiveOutcome
                      ? "How did NoReply help you get this result?"
                      : "What could have helped in your situation?"
                  }
                  className="mt-1.5 min-h-[100px]"
                />
              </div>
              {testimonial && (
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="share"
                    checked={shareTestimonial}
                    onCheckedChange={(checked) => setShareTestimonial(checked === true)}
                  />
                  <Label htmlFor="share" className="text-sm text-muted-foreground cursor-pointer">
                    Share this testimonial publicly to help others (your name will be anonymized)
                  </Label>
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(isPositiveOutcome ? "details" : "outcome")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Saving..." : "Submit"}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="text-center py-6">
            <div className="h-16 w-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4">
              <Icon
                icon={isPositiveOutcome ? CheckmarkCircle01Icon : Sad01Icon}
                size={32}
                className={isPositiveOutcome ? "text-forest-500" : "text-stone-500"}
              />
            </div>
            <DialogTitle className="mb-2">
              {isPositiveOutcome ? "Congratulations!" : "Thanks for Letting Us Know"}
            </DialogTitle>
            <DialogDescription>
              {isPositiveOutcome
                ? "Your success story will inspire others to fight back. Well done!"
                : "Your feedback helps us improve. Don't give up - consider escalating to an ombudsman."}
            </DialogDescription>
            <Button onClick={() => setOpen(false)} className="mt-6">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
