"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import { ComplaintPreview } from "@/components/onboarding/complaint-preview"
import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import { ArrowRight01Icon, SparklesIcon } from "@hugeicons-pro/core-stroke-rounded"
import { motion, AnimatePresence } from "motion/react"
import { completeOnboarding } from "@/lib/actions/profile"

export interface OnboardingFormData {
  companyName: string
  companyDomain?: string
  complaint: string
  amount: string
  currency: string
  outcome: string
}

interface QuickAnalysis {
  issues: string[]
  confidence: number
  suggestedOutcome?: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<OnboardingFormData>({
    companyName: "",
    complaint: "",
    amount: "",
    currency: "GBP",
    outcome: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<QuickAnalysis | null>(null)
  const [showCTA, setShowCTA] = useState(false)

  const handleDataChange = useCallback((updates: Partial<OnboardingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    // Reset analysis when form data changes significantly
    if (updates.complaint || updates.companyName) {
      setAnalysis(null)
      setShowCTA(false)
    }
  }, [])

  const handleAnalyze = async () => {
    if (!formData.companyName || !formData.complaint) return

    setIsAnalyzing(true)
    setShowCTA(false)

    try {
      const response = await fetch("/api/onboarding/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysis(data)

        // Show CTA after analysis animation completes
        setTimeout(() => setShowCTA(true), 1500)
      }
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCreateCase = async () => {
    // Mark onboarding as complete
    await completeOnboarding()

    // Navigate to new case with prefilled data
    const params = new URLSearchParams({
      company: formData.companyName,
      complaint: formData.complaint,
      amount: formData.amount,
      currency: formData.currency,
      outcome: formData.outcome,
    })

    router.push(`/new?${params.toString()}`)
  }

  const handleSkip = async () => {
    await completeOnboarding()
    router.push("/dashboard")
  }

  const isFormValid = formData.companyName.length >= 2 && formData.complaint.length >= 20

  return (
    <div className="min-h-screen bg-alabaster dark:bg-volcanic">
      {/* Mobile: Stack | Desktop: 50:50 split */}
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Left side: Form */}
        <div className="lg:w-1/2 p-6 lg:p-12 flex flex-col">
          <div className="flex-1 max-w-lg mx-auto w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-2">
                Let&apos;s Build Your Case
              </h1>
              <p className="text-muted-foreground">
                Tell us about your issue and watch your complaint take shape in real-time.
              </p>
            </motion.div>

            {/* Form */}
            <OnboardingForm
              formData={formData}
              onDataChange={handleDataChange}
            />

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 space-y-4"
            >
              <Button
                onClick={handleAnalyze}
                disabled={!isFormValid || isAnalyzing}
                variant="coral"
                size="lg"
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Icon icon={SparklesIcon} size={18} className="mr-2 animate-pulse" />
                    Analyzing Your Case...
                  </>
                ) : (
                  <>
                    <Icon icon={SparklesIcon} size={18} className="mr-2" />
                    See What We Can Do
                  </>
                )}
              </Button>

              <AnimatePresence>
                {showCTA && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Button
                      onClick={handleCreateCase}
                      variant="default"
                      size="lg"
                      className="w-full"
                    >
                      Create Full Case
                      <Icon icon={ArrowRight01Icon} size={18} className="ml-2" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleSkip}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Skip for now
              </button>
            </motion.div>
          </div>
        </div>

        {/* Right side: Preview (sticky on desktop) */}
        <div className="lg:w-1/2 lg:sticky lg:top-0 lg:h-screen bg-gradient-to-br from-pearl/50 to-alabaster dark:from-charcoal dark:to-volcanic border-t lg:border-t-0 lg:border-l border-border p-6 lg:p-12 overflow-y-auto">
          <ComplaintPreview
            formData={formData}
            isAnalyzing={isAnalyzing}
            analysis={analysis}
          />
        </div>

      </div>
    </div>
  )
}
