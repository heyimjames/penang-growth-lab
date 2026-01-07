"use client"

import { ReactNode, useRef, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCaseTabs } from "./case-tabs-context"
import { motion, AnimatePresence, type Variants } from "motion/react"
import { cn } from "@/lib/utils"

interface CaseControlledTabsProps {
  children: ReactNode
}

export function CaseControlledTabs({ children }: CaseControlledTabsProps) {
  const { activeTab, setActiveTab } = useCaseTabs()

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {children}
    </Tabs>
  )
}

// Animated tab content wrapper with simple stagger fade
export function AnimatedTabContent({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const { activeTab } = useCaseTabs()
  const isActive = activeTab === value

  const variants: Variants = {
    initial: {
      opacity: 0,
      y: 8,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -4,
      transition: {
        duration: 0.15,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <TabsContent value={value} className={cn("mt-4 overflow-visible", className)} forceMount>
      <AnimatePresence mode="wait" initial={false}>
        {isActive && (
          <motion.div
            key={value}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="overflow-visible"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </TabsContent>
  )
}

// Individual tab button with hover effects
function AnimatedTabTrigger({
  value,
  children,
  isActive,
}: {
  value: string
  children: ReactNode
  isActive: boolean
}) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "relative px-4 py-2 text-sm z-10 shrink-0",
        "transition-all duration-200",
        // Mobile: pill style
        "rounded-full sm:rounded-md",
        // Mobile: inactive pills - visible background and border
        "bg-muted/30 border border-border/40",
        "hover:bg-muted/50 hover:border-border/60",
        // Mobile: active state with stronger background
        "data-[state=active]:bg-background data-[state=active]:border-border",
        "data-[state=active]:shadow-sm",
        // Desktop: transparent background
        "sm:bg-transparent sm:border-transparent sm:hover:bg-transparent",
        "sm:data-[state=active]:bg-transparent sm:data-[state=active]:border-transparent sm:data-[state=active]:shadow-none",
        // Text colors
        "data-[state=active]:text-foreground data-[state=inactive]:text-foreground/70",
        "data-[state=inactive]:hover:text-foreground"
      )}
    >
      <motion.span
        animate={{
          fontWeight: isActive ? 500 : 400,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </TabsTrigger>
  )
}

export function CaseTabsList() {
  const { activeTab } = useCaseTabs()
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const desktopTabsRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Update indicator position (desktop only)
  useEffect(() => {
    // Reset immediately when tab changes
    setIndicatorStyle({ left: 0, width: 0 })
    
    // Don't update if on responses tab or ref not available
    if (activeTab === "responses" || !desktopTabsRef.current) {
      return
    }

    const updateIndicator = () => {
      if (!desktopTabsRef.current) {
        setIndicatorStyle({ left: 0, width: 0 })
        return
      }

      // Find the button that matches the active tab value
      const activeButton = desktopTabsRef.current.querySelector(
        `[value="${activeTab}"][data-state="active"]`
      ) as HTMLElement

      // Fallback to any active button if exact match not found
      const fallbackButton = activeButton || desktopTabsRef.current.querySelector(
        `[data-state="active"]`
      ) as HTMLElement

      if (fallbackButton && fallbackButton.offsetParent !== null) {
        const containerRect = desktopTabsRef.current.getBoundingClientRect()
        const buttonRect = fallbackButton.getBoundingClientRect()

        // Only set if we have valid dimensions and button is actually visible
        if (buttonRect.width > 0 && containerRect.width > 0 && buttonRect.height > 0) {
          const left = buttonRect.left - containerRect.left
          const width = buttonRect.width
          
          // Validate the position is within bounds
          if (left >= 0 && left < containerRect.width && width > 0) {
            setIndicatorStyle({ left, width })
            return
          }
        }
      }
      
      // Reset if anything is invalid
      setIndicatorStyle({ left: 0, width: 0 })
    }

    // Update after a delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(updateIndicator, 100)

    return () => clearTimeout(timeoutId)
  }, [activeTab])

  // Auto-scroll to active tab on mobile
  useEffect(() => {
    if (activeTab === "responses" || !scrollContainerRef.current) {
      return
    }

    const scrollToActiveTab = () => {
      const container = scrollContainerRef.current
      if (!container) return

      const activeButton = container.querySelector(
        `[value="${activeTab}"][data-state="active"]`
      ) as HTMLElement

      if (activeButton) {
        const containerRect = container.getBoundingClientRect()
        const buttonRect = activeButton.getBoundingClientRect()
        const scrollLeft = container.scrollLeft
        const buttonLeft = buttonRect.left - containerRect.left + scrollLeft
        const buttonWidth = buttonRect.width
        const containerWidth = containerRect.width

        // Calculate scroll position to center the button
        const targetScroll = buttonLeft - containerWidth / 2 + buttonWidth / 2

        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth',
        })
      }
    }

    // Delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToActiveTab, 150)
    return () => clearTimeout(timeoutId)
  }, [activeTab])

  // Hide tabs on responses tab (they're shown in the fixed header instead)
  if (activeTab === "responses") {
    return null
  }

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "letters", label: "Letters" },
    { value: "evidence", label: "Evidence" },
    { value: "timeline", label: "Timeline" },
    { value: "responses", label: "Responses" },
  ]

  return (
    <div className="w-full sm:w-auto">
      {/* Mobile: Horizontally scrollable pills */}
      <div
        ref={scrollContainerRef}
        className="sm:hidden overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2"
      >
        <TabsList className="relative bg-transparent p-0 inline-flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <AnimatedTabTrigger
              key={tab.value}
              value={tab.value}
              isActive={activeTab === tab.value}
            >
              {tab.label}
            </AnimatedTabTrigger>
          ))}
        </TabsList>
      </div>

      {/* Desktop: Original design with indicator */}
      <TabsList
        ref={desktopTabsRef}
        className="hidden sm:inline-flex relative bg-muted/50 p-1 rounded-lg w-auto overflow-hidden"
      >
        {/* Animated background indicator - only show on desktop when we have valid dimensions */}
        {indicatorStyle.width > 0 && indicatorStyle.left >= 0 && indicatorStyle.width < 1000 && (
          <motion.div
            className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm z-0"
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
            }}
            style={{ pointerEvents: 'none' }}
          />
        )}

        {tabs.map((tab) => (
          <AnimatedTabTrigger
            key={tab.value}
            value={tab.value}
            isActive={activeTab === tab.value}
          >
            {tab.label}
          </AnimatedTabTrigger>
        ))}
      </TabsList>
    </div>
  )
}

export { TabsContent }
