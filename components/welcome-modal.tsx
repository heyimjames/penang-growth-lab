"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icon } from "@/lib/icons"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import {
  Edit02Icon,
  AiMagicIcon,
  Mail01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Tick02Icon,
  SmartPhone01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

const WELCOME_SEEN_KEY = "noreply_welcome_seen"
export const SHOW_WELCOME_EVENT = "noreply:show-welcome"

// Helper function to trigger the welcome modal from anywhere
export function showWelcomeModal() {
  window.dispatchEvent(new CustomEvent(SHOW_WELCOME_EVENT))
}

interface WelcomeSlide {
  icon: React.ComponentType<any>
  iconColor: string
  iconBg: string
  title: string
  description: string
  bullets: string[]
}

const slides: WelcomeSlide[] = [
  {
    icon: KnightShieldIcon,
    iconColor: "text-peach-500",
    iconBg: "bg-peach-50 dark:bg-peach-950",
    title: "Welcome to NoReply",
    description: "You've taken the first step. We help you fight back against companies that ignore you.",
    bullets: [
      "AI-powered complaint letters",
      "Backed by UK consumer law",
      "Track cases in one place",
    ],
  },
  {
    icon: Edit02Icon,
    iconColor: "text-forest-500",
    iconBg: "bg-forest-50 dark:bg-forest-950",
    title: "Tell Us What Happened",
    description: "Describe your issue in plain English. No legal jargon needed — just tell your story.",
    bullets: [
      "Type or use voice input",
      "Upload photos & receipts",
      "We handle the rest",
    ],
  },
  {
    icon: AiMagicIcon,
    iconColor: "text-lavender-500",
    iconBg: "bg-lavender-50 dark:bg-lavender-950",
    title: "AI Builds Your Case",
    description: "Our AI researches your rights and drafts a professional complaint letter for you.",
    bullets: [
      "References relevant laws",
      "Professional formatting",
      "Ready in under a minute",
    ],
  },
  {
    icon: Mail01Icon,
    iconColor: "text-forest-500",
    iconBg: "bg-forest-50 dark:bg-forest-950",
    title: "Send & Get Results",
    description: "Download your letter and send it. Track responses and escalate if needed.",
    bullets: [
      "Copy, download, or email",
      "Set response deadlines",
      "Escalate to ombudsman",
    ],
  },
]

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPhoneStep, setShowPhoneStep] = useState(false)

  const openModal = useCallback(() => {
    setCurrentSlide(0)
    setShowPhoneStep(false)
    setPhoneNumber("")
    setIsOpen(true)
  }, [])

  useEffect(() => {
    // Check if user has already seen the welcome modal
    const hasSeen = localStorage.getItem(WELCOME_SEEN_KEY)
    if (!hasSeen) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        setIsOpen(true)
        trackEvent(AnalyticsEvents.ONBOARDING.WELCOME_MODAL_VIEWED, {
          trigger: "auto",
        })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Listen for external trigger to show the modal
  useEffect(() => {
    const handleShowWelcome = () => openModal()
    window.addEventListener(SHOW_WELCOME_EVENT, handleShowWelcome)
    return () => window.removeEventListener(SHOW_WELCOME_EVENT, handleShowWelcome)
  }, [openModal])

  const handleDismiss = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, "true")
    setIsOpen(false)
    trackEvent(AnalyticsEvents.ONBOARDING.WELCOME_MODAL_DISMISSED, {
      dismissed_at_step: showPhoneStep ? "phone" : currentSlide,
      completed_steps: currentSlide,
    })
  }

  const handleNext = () => {
    trackEvent(AnalyticsEvents.ONBOARDING.ONBOARDING_STEP_COMPLETED, {
      step: currentSlide,
      step_title: slides[currentSlide]?.title,
    })
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      // After last slide, show phone step
      setShowPhoneStep(true)
    }
  }

  const handlePrev = () => {
    if (showPhoneStep) {
      setShowPhoneStep(false)
    } else if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleSavePhone = async () => {
    if (!phoneNumber.trim()) {
      handleDismiss()
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from("profiles")
          .update({ phone_number: phoneNumber.trim() })
          .eq("user_id", user.id)
      }
    } catch {
      // Silently fail - phone number is optional
    } finally {
      setIsSubmitting(false)
      handleDismiss()
    }
  }

  const slide = slides[currentSlide]
  const isLastSlide = currentSlide === slides.length - 1 && !showPhoneStep
  const totalSteps = slides.length + 1 // +1 for phone step

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleDismiss()
    }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 pt-6 pb-2">
          {[...slides, null].map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (index < slides.length) {
                  setCurrentSlide(index)
                  setShowPhoneStep(false)
                } else {
                  setCurrentSlide(slides.length - 1)
                  setShowPhoneStep(true)
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                (showPhoneStep && index === slides.length) || (!showPhoneStep && index === currentSlide)
                  ? "w-6 bg-peach-500" 
                  : "w-1.5 bg-muted hover:bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Fixed height content area */}
        <div className="px-6 pb-6 min-h-[320px] flex flex-col">
          {showPhoneStep ? (
            // Phone number collection step
            <>
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-lavender-50 dark:bg-lavender-950 flex items-center justify-center">
                  <Icon icon={SmartPhone01Icon} size={32} className="text-lavender-500" />
                </div>
              </div>

              <DialogHeader className="text-center mb-4">
                <DialogTitle className="text-xl">Stay in the Loop</DialogTitle>
                <DialogDescription className="text-sm leading-relaxed mt-2">
                  Get notified when companies respond to your complaints. Totally optional.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-3">
                  <Input
                    type="tel"
                    placeholder="+44 7XXX XXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-11 text-center text-base"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    We&apos;ll only text you about your cases. No spam, ever.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-auto pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="flex-shrink-0"
                >
                  <Icon icon={ArrowLeft01Icon} size={16} />
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-muted-foreground"
                  onClick={handleDismiss}
                >
                  Skip
                </Button>
                <Button
                  variant="coral"
                  className="flex-1"
                  onClick={handleSavePhone}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Continue"}
                  <Icon icon={ArrowRight01Icon} size={16} className="ml-1" />
                </Button>
              </div>
            </>
          ) : (
            // Regular slide content
            <>
              <div className="flex justify-center mb-4">
                <div className={`h-16 w-16 rounded-2xl ${slide.iconBg} flex items-center justify-center`}>
                  <Icon icon={slide.icon} size={32} className={slide.iconColor} />
                </div>
              </div>

              <DialogHeader className="text-center mb-4">
                <DialogTitle className="text-xl">{slide.title}</DialogTitle>
                <DialogDescription className="text-sm leading-relaxed mt-2">
                  {slide.description}
                </DialogDescription>
              </DialogHeader>

              {/* Bullets - shown for all slides now */}
              <ul className="space-y-2.5 flex-1">
                {slide.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-center gap-2.5 text-sm">
                    <div className="h-5 w-5 rounded-full bg-forest-100 dark:bg-forest-900 flex items-center justify-center flex-shrink-0">
                      <Icon icon={Tick02Icon} size={12} className="text-forest-600 dark:text-forest-400" />
                    </div>
                    <span className="text-foreground">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-auto pt-4">
                {currentSlide > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    className="flex-shrink-0"
                  >
                    <Icon icon={ArrowLeft01Icon} size={16} />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  className="flex-1 text-muted-foreground"
                  onClick={handleDismiss}
                >
                  Skip
                </Button>
                <Button
                  variant="coral"
                  className="flex-1"
                  onClick={handleNext}
                >
                  {isLastSlide ? "Almost done" : "Next"}
                  <Icon icon={ArrowRight01Icon} size={16} className="ml-1" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
