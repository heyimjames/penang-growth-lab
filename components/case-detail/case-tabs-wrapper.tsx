"use client"

import { useState, ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Icon } from "@/lib/icons"
import { Edit02Icon } from "@hugeicons-pro/core-stroke-rounded"

interface CaseTabsWrapperProps {
  overviewContent: ReactNode
  lettersContent: ReactNode
  evidenceContent: ReactNode
  timelineContent: ReactNode
  showGenerateCTA?: boolean
}

export function CaseTabsWrapper({
  overviewContent,
  lettersContent,
  evidenceContent,
  timelineContent,
  showGenerateCTA = true,
}: CaseTabsWrapperProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const handleGenerateLetter = () => {
    // Switch to the letters tab
    setActiveTab("letters")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="bg-muted/50 p-1 rounded-lg w-full sm:w-auto inline-flex">
        <TabsTrigger
          value="overview"
          className="rounded-md px-3 sm:px-4 py-2 text-sm flex-1 sm:flex-none data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="letters"
          className="rounded-md px-3 sm:px-4 py-2 text-sm flex-1 sm:flex-none data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          Letters
        </TabsTrigger>
        <TabsTrigger
          value="evidence"
          className="rounded-md px-3 sm:px-4 py-2 text-sm flex-1 sm:flex-none data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          Evidence
        </TabsTrigger>
        <TabsTrigger
          value="timeline"
          className="rounded-md px-3 sm:px-4 py-2 text-sm flex-1 sm:flex-none data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          Timeline
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab - inject the generate button handler */}
      <TabsContent value="overview" className="mt-0">
        <OverviewWithGenerateButton
          onGenerateClick={handleGenerateLetter}
          showCTA={showGenerateCTA}
        >
          {overviewContent}
        </OverviewWithGenerateButton>
      </TabsContent>

      {/* Letters Tab */}
      <TabsContent value="letters" className="mt-0">
        {lettersContent}
      </TabsContent>

      {/* Evidence Tab */}
      <TabsContent value="evidence" className="mt-0">
        {evidenceContent}
      </TabsContent>

      {/* Timeline Tab */}
      <TabsContent value="timeline" className="mt-0">
        {timelineContent}
      </TabsContent>
    </Tabs>
  )
}

// Sub-component to inject the generate button with the correct handler
function OverviewWithGenerateButton({
  children,
  onGenerateClick,
  showCTA,
}: {
  children: ReactNode
  onGenerateClick: () => void
  showCTA: boolean
}) {
  return (
    <div className="relative">
      {children}
      {/* The generate button is rendered via the GenerateLetterCTA component */}
    </div>
  )
}

// Export a separate CTA component that can be placed in the overview
export function GenerateLetterCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="rounded-xl border border-peach-200 dark:border-peach-800 bg-gradient-to-br from-peach-50 to-lavender-50 dark:from-peach-950/30 dark:to-lavender-950/30 p-4">
      <h3 className="font-semibold mb-1">Ready to take action?</h3>
      <p className="text-sm text-muted-foreground mb-3">Generate a professional complaint letter</p>
      <Button
        onClick={onClick}
        variant="coral"
        className="w-full"
      >
        <Icon icon={Edit02Icon} size={16} className="mr-2" />
        Generate Letter
      </Button>
    </div>
  )
}
