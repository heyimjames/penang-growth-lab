"use client"

import { ReactNode, useRef, useEffect } from "react"
import { useCaseTabs } from "./case-tabs-context"
import { CompanyLogo } from "@/components/company-logo"
import { CaseStatus } from "@/components/case-status"
import { Case } from "@/lib/types"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface CaseDetailClientProps {
  caseData: Case
  compactHeader: ReactNode
  mainHeader: ReactNode
  children: ReactNode
}

// Fixed header + tabs shown on responses tab
export function CompactCaseHeader({ caseData }: { caseData: Case }) {
  const currencySymbol = caseData.currency === "GBP" ? "£" : caseData.currency === "USD" ? "$" : "€"
  const { activeTab, setActiveTab } = useCaseTabs()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)
  
  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "letters", label: "Letters" },
    { value: "evidence", label: "Evidence" },
    { value: "timeline", label: "Timeline" },
    { value: "responses", label: "Responses" },
  ]

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const activeButton = activeTabRef.current
      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      
      // Check if button is outside visible area
      if (buttonRect.left < containerRect.left || buttonRect.right > containerRect.right) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [activeTab])
  
  return (
    <div className="fixed top-14 left-0 right-0 md:left-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:md:left-[var(--sidebar-width-icon)] z-30 bg-background/95 backdrop-blur-sm border-b border-border transition-[left] duration-200 ease-linear">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Case info row */}
        <div className="flex items-center gap-3 py-2 border-b border-border/50">
          <CompanyLogo 
            companyName={caseData.company_name} 
            domain={caseData.company_domain} 
            size={28}
          />
          <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm truncate">{caseData.company_name}</span>
            <CaseStatus status={caseData.status} resolutionOutcome={caseData.resolution_outcome} />
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
            {caseData.purchase_amount && (
              <span className="font-mono font-medium text-foreground">
                {currencySymbol}{caseData.purchase_amount.toFixed(0)}
              </span>
            )}
            {caseData.confidence_score !== null && (
              <span className="text-peach-500 font-medium">{caseData.confidence_score}%</span>
            )}
          </div>
        </div>
        {/* Tabs row - horizontally scrollable on mobile, inline on desktop */}
        <div className="py-2 -mx-4 sm:mx-0">
          <div 
            ref={scrollContainerRef}
            className="flex sm:inline-flex gap-3 sm:gap-1 overflow-x-auto scrollbar-hide px-4 sm:px-0 sm:bg-muted/50 sm:p-1 sm:rounded-lg snap-x snap-mandatory sm:snap-none relative"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value
              return (
                <button
                  key={tab.value}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "shrink-0 snap-center transition-all duration-200 relative",
                    // Mobile: pill style
                    "px-4 py-2 rounded-full text-sm font-medium",
                    // Desktop: tab style
                    "sm:rounded-md sm:px-4 sm:py-2",
                    // Mobile: inactive pills - visible background and border
                    !isActive && "bg-muted/30 border border-border/40 hover:bg-muted/50 hover:border-border/60",
                    // Mobile: active state with stronger background
                    isActive && "bg-background border border-border shadow-sm",
                    // Desktop: transparent background
                    "sm:bg-transparent sm:border-transparent sm:hover:bg-transparent",
                    isActive && "sm:bg-background sm:shadow-sm",
                    // Text colors
                    isActive
                      ? "text-foreground z-10 sm:z-auto"
                      : "text-foreground/70 hover:text-foreground z-0 sm:text-muted-foreground sm:hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrapper that conditionally shows/hides elements based on active tab
export function CaseDetailWrapper({
  caseData,
  compactHeader,
  mainHeader,
  children
}: CaseDetailClientProps) {
  const { activeTab } = useCaseTabs()
  const isResponsesTab = activeTab === "responses"
  const previousTab = useRef(activeTab)

  // Track case view on mount
  useEffect(() => {
    trackEvent(AnalyticsEvents.CASE.VIEWED, {
      case_id: caseData.id,
      company_name: caseData.company_name,
      case_status: caseData.status,
      confidence_score: caseData.confidence_score,
    })
  }, [caseData.id, caseData.company_name, caseData.status, caseData.confidence_score])

  // Track tab changes
  useEffect(() => {
    if (previousTab.current !== activeTab) {
      trackEvent(AnalyticsEvents.CASE.TAB_CHANGED, {
        case_id: caseData.id,
        from_tab: previousTab.current,
        to_tab: activeTab,
      })
      previousTab.current = activeTab
    }
  }, [activeTab, caseData.id])

  return (
    <div className="contents">
      {/* Animated header transitions */}
      <AnimatePresence mode="wait">
        {isResponsesTab ? (
          <motion.div
            key="compact-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {compactHeader}
          </motion.div>
        ) : (
          <motion.div
            key="main-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {mainHeader}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content - uses animated padding for responses tab to account for fixed header */}
      <motion.div
        initial={false}
        animate={{ paddingTop: isResponsesTab ? 120 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  )
}

