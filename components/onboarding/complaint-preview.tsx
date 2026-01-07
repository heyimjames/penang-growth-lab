"use client"

import { CompanyLogo } from "@/components/company-logo"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Icon } from "@/lib/icons"
import {
  Building01Icon,
  TextIcon,
  CreditCardIcon,
  Target01Icon,
  SparklesIcon,
  CheckmarkCircle01Icon,
  JusticeScale01Icon,
  AnalyticsUpIcon,
} from "@hugeicons-pro/core-stroke-rounded"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import type { OnboardingFormData } from "@/app/onboarding/page"

interface QuickAnalysis {
  issues: string[]
  confidence: number
  suggestedOutcome?: string
}

interface ComplaintPreviewProps {
  formData: OnboardingFormData
  isAnalyzing: boolean
  analysis: QuickAnalysis | null
}

const outcomeLabels: Record<string, string> = {
  "ai-suggested": "AI Will Suggest",
  "full-refund": "Full Refund",
  "partial-refund": "Partial Refund",
  "replacement": "Replacement",
  "compensation": "Compensation",
}

// Animated section wrapper
function PreviewSection({
  isVisible,
  delay = 0,
  children,
}: {
  isVisible: boolean
  delay?: number
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{
            delay,
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Individual preview cards
function CompanyPreviewCard({
  name,
  domain,
}: {
  name: string
  domain?: string
}) {
  return (
    <Card className="border-peach-200 dark:border-peach-900 bg-gradient-to-br from-peach-50/50 to-white dark:from-peach-950/20 dark:to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-peach-100 dark:bg-peach-900/30">
            <Icon icon={Building01Icon} size={16} className="text-peach-600 dark:text-peach-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Company</p>
            <div className="flex items-center gap-2">
              <CompanyLogo companyName={name} domain={domain} size={24} showFallback />
              <div>
                <p className="font-semibold text-sm text-foreground">{name}</p>
                {domain && <p className="text-xs text-muted-foreground">{domain}</p>}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ComplaintExcerptCard({ text }: { text: string }) {
  const excerpt = text.length > 150 ? text.slice(0, 150) + "..." : text

  return (
    <Card className="border-lavender-200 dark:border-lavender-900 bg-gradient-to-br from-lavender-50/50 to-white dark:from-lavender-950/20 dark:to-transparent">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-lavender-100 dark:bg-lavender-900/30 shrink-0">
            <Icon icon={TextIcon} size={16} className="text-lavender-600 dark:text-lavender-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Your Issue</p>
            <p className="text-sm text-foreground leading-relaxed">{excerpt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AmountCard({ amount, currency }: { amount: string; currency: string }) {
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$"
  const formatted = parseFloat(amount || "0").toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <Card className="border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50/50 to-white dark:from-green-950/20 dark:to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <Icon icon={CreditCardIcon} size={16} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Amount at Stake</p>
            <p className="font-bold text-lg text-green-600 dark:text-green-400 font-mono">
              {symbol}{formatted}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OutcomeCard({ outcome }: { outcome: string }) {
  const label = outcomeLabels[outcome] || outcome

  return (
    <Card className="border-forest-200 dark:border-forest-900 bg-gradient-to-br from-forest-50/50 to-white dark:from-forest-950/20 dark:to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-forest-100 dark:bg-forest-900/30">
            <Icon icon={Target01Icon} size={16} className="text-forest-600 dark:text-forest-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Your Goal</p>
            <Badge className="bg-forest-100 text-forest-700 dark:bg-forest-900/50 dark:text-forest-300 border-0">
              {label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Analysis skeleton
function AnalysisSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <Card className="border-2 border-dashed border-peach-300 dark:border-peach-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-peach-100 dark:bg-peach-900/30">
              <Icon icon={SparklesIcon} size={16} className="text-peach-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Analyzing your case...</p>
              <p className="text-xs text-muted-foreground">Finding relevant issues & laws</p>
            </div>
          </div>
          <div className="space-y-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <Skeleton className="h-3 rounded-full bg-peach-200 dark:bg-peach-900" />
            </motion.div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Analysis results
function AnalysisResults({ analysis }: { analysis: QuickAnalysis }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Confidence Score */}
      <Card className="border-2 border-peach-300 dark:border-peach-700 bg-gradient-to-br from-peach-50 to-peach-100/50 dark:from-peach-950/40 dark:to-peach-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-peach-500">
                <Icon icon={AnalyticsUpIcon} size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Case Strength</p>
                <p className="font-semibold text-foreground">Initial Assessment</p>
              </div>
            </div>
            <div className={cn(
              "text-3xl font-bold font-mono",
              analysis.confidence >= 70 ? "text-green-600 dark:text-green-400" :
                analysis.confidence >= 50 ? "text-amber-600 dark:text-amber-400" :
                  "text-red-600 dark:text-red-400"
            )}>
              {analysis.confidence}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues Found */}
      {analysis.issues.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon={JusticeScale01Icon} size={16} className="text-blue-600" />
              <p className="text-sm font-medium text-foreground">Potential Issues</p>
            </div>
            <div className="space-y-2">
              {analysis.issues.map((issue, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg"
                >
                  <Icon
                    icon={CheckmarkCircle01Icon}
                    size={14}
                    className="text-green-600 mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-foreground">{issue}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* What's next hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center p-4 bg-gradient-to-br from-lavender-50 to-peach-50 dark:from-lavender-950/20 dark:to-peach-950/20 rounded-lg border border-lavender-200 dark:border-lavender-800"
      >
        <Icon icon={SparklesIcon} size={20} className="text-lavender-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">Looking promising!</p>
        <p className="text-xs text-muted-foreground mt-1">
          Create a full case for detailed legal analysis & AI-generated complaint letter
        </p>
      </motion.div>
    </motion.div>
  )
}

export function ComplaintPreview({
  formData,
  isAnalyzing,
  analysis,
}: ComplaintPreviewProps) {
  const hasCompany = formData.companyName.length >= 2
  const hasComplaint = formData.complaint.length >= 20
  const hasAmount = formData.amount && parseFloat(formData.amount) > 0
  const hasOutcome = !!formData.outcome
  const hasAnyData = hasCompany || hasComplaint || hasAmount || hasOutcome

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-peach-100 dark:bg-peach-900/30 rounded-full mb-3"
        >
          <div className="w-2 h-2 rounded-full bg-peach-500 animate-pulse" />
          <span className="text-xs font-medium text-peach-700 dark:text-peach-300">Live Preview</span>
        </motion.div>
        <h2 className="text-xl font-display font-bold text-foreground">
          Your Complaint
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Watch your case take shape
        </p>
      </div>

      {/* Empty state */}
      <AnimatePresence>
        {!hasAnyData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Icon icon={TextIcon} size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Start filling in the form to see your complaint preview
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview cards */}
      <div className="space-y-4">
        <PreviewSection isVisible={hasCompany} delay={0}>
          <CompanyPreviewCard
            name={formData.companyName}
            domain={formData.companyDomain}
          />
        </PreviewSection>

        <PreviewSection isVisible={hasComplaint} delay={0.1}>
          <ComplaintExcerptCard text={formData.complaint} />
        </PreviewSection>

        <div className="grid grid-cols-2 gap-4">
          <PreviewSection isVisible={!!hasAmount} delay={0.2}>
            <AmountCard amount={formData.amount} currency={formData.currency} />
          </PreviewSection>

          <PreviewSection isVisible={hasOutcome} delay={0.3}>
            <OutcomeCard outcome={formData.outcome} />
          </PreviewSection>
        </div>

        {/* Analysis section */}
        <AnimatePresence mode="wait">
          {isAnalyzing && <AnalysisSkeleton key="skeleton" />}
          {analysis && !isAnalyzing && <AnalysisResults key="results" analysis={analysis} />}
        </AnimatePresence>
      </div>
    </div>
  )
}
