"use client"

import * as React from "react"
import Link from "next/link"
import { Icon } from "@/lib/icons"
import { ArrowRight01Icon, Menu01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toolCategories, getToolsByCategory } from "@/lib/tools-data"
import { motion, AnimatePresence } from "motion/react"

interface ToolsMegaMenuProps {
  className?: string
}

// Desktop Mega Menu
export function ToolsMegaMenu({ className }: ToolsMegaMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    // Delay closing to give user time to move to dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors",
          isOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        Free Tools
        <ChevronDownIcon
          className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      {/* Mega Menu Dropdown - Fixed to viewport center */}
      {isOpen && (
        <>
          {/* Invisible bridge to prevent menu closing when moving mouse */}
          <div 
            className="fixed left-0 right-0 top-10 h-8 z-40" 
            onMouseEnter={handleMouseEnter}
          />
          <div 
            className="fixed left-1/2 -translate-x-1/2 top-14 pt-2 z-50 w-[calc(100vw-2rem)] max-w-5xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
          <div className="bg-white dark:bg-card border border-forest-100 dark:border-border rounded-xl shadow-lg overflow-hidden">
            {/* Categories Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-0 divide-x divide-forest-100 dark:divide-border">
              {toolCategories.map((category) => {
                const categoryTools = getToolsByCategory(category.id)
                return (
                  <div key={category.id} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 aspect-square shrink-0 rounded-lg bg-forest-50 dark:bg-forest-900/30 border border-forest-100 dark:border-forest-800 flex items-center justify-center">
                        <Icon
                          icon={category.icon}
                          size={16}
                          className="text-forest-500 dark:text-forest-400"
                        />
                      </div>
                      <h3 className="text-xs font-semibold text-forest-600 dark:text-forest-400 uppercase tracking-wide">
                        {category.name}
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      {categoryTools.map((tool) => (
                        <li key={tool.href}>
                          <Link
                            href={tool.href}
                            className="block text-sm text-muted-foreground hover:text-foreground hover:bg-forest-50 dark:hover:bg-forest-900/30 -mx-2 px-2 py-1.5 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {tool.title.replace(" Calculator", "").replace(" Generator", "").replace(" Checker", "").replace(" Tracker", "")}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-forest-100 dark:border-border bg-forest-50/50 dark:bg-forest-900/20 px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                23 free tools to help you know your rights
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1 text-sm font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View all tools
                <Icon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  )
}

// Mobile Full-Screen Menu (Stripe-style)
export function MobileToolsMenu() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null)

  // Block body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setActiveCategory(null)
  }

  const handleBack = () => {
    setActiveCategory(null)
  }

  const activeCategoryData = activeCategory
    ? toolCategories.find((c) => c.id === activeCategory)
    : null
  const activeCategoryTools = activeCategory
    ? getToolsByCategory(activeCategory as any)
    : []

  return (
    <>
      {/* Trigger Button - Hamburger Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="h-10 w-10 flex items-center justify-center -mr-2 text-foreground"
        aria-label="Open menu"
      >
        <Icon icon={Menu01Icon} size={22} />
      </button>

      {/* Full-Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="flex items-center justify-between px-4 h-14 border-b border-forest-100 dark:border-border"
            >
              {activeCategory ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm font-medium text-forest-600 dark:text-forest-400"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <Link href="/" onClick={handleClose} className="text-xl font-bold tracking-tight text-foreground font-display">
                  NoReply
                </Link>
              )}
              <button
                onClick={handleClose}
                className="h-10 w-10 flex items-center justify-center -mr-2"
                aria-label="Close menu"
              >
                <XIcon className="h-5 w-5 text-muted-foreground" />
              </button>
            </motion.div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!activeCategory ? (
              // Main Menu
              <nav className="py-2">
                {/* Tools with drill-down */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  onClick={() => setActiveCategory("tools")}
                  className="w-full flex items-center justify-between px-4 py-4 border-b border-dashed border-forest-200 dark:border-border"
                >
                  <span className="text-lg font-medium text-foreground">Free Tools</span>
                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                </motion.button>

                {/* Glossary Link */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                >
                  <Link
                    href="/glossary"
                    onClick={handleClose}
                    className="flex items-center justify-between px-4 py-4 border-b border-dashed border-forest-200 dark:border-border"
                  >
                    <span className="text-lg font-medium text-foreground">Glossary</span>
                    <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </motion.div>

                {/* Pricing Link */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <Link
                    href="/pricing"
                    onClick={handleClose}
                    className="flex items-center justify-between px-4 py-4 border-b border-dashed border-forest-200 dark:border-border"
                  >
                    <span className="text-lg font-medium text-forest-600 dark:text-forest-400">Pricing</span>
                    <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </motion.div>

                {/* Sign in Link */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.25 }}
                >
                  <Link
                    href="/auth/login"
                    onClick={handleClose}
                    className="flex items-center justify-between px-4 py-4 border-b border-dashed border-forest-200 dark:border-border"
                  >
                    <span className="text-lg font-medium text-forest-600 dark:text-forest-400">Sign in</span>
                  </Link>
                </motion.div>

                {/* All tools Link */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  <Link
                    href="/tools"
                    onClick={handleClose}
                    className="flex items-center justify-between px-4 py-4 border-b border-dashed border-forest-200 dark:border-border"
                  >
                    <span className="text-lg font-medium text-foreground">All tools</span>
                    <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </motion.div>
              </nav>
            ) : activeCategory === "tools" ? (
              // Tools Categories View
              <div className="py-4">
                {toolCategories.map((category) => {
                  const categoryTools = getToolsByCategory(category.id)
                  return (
                    <div key={category.id} className="mb-6">
                      {/* Category Header */}
                      <div className="px-4 mb-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {category.name}
                        </h3>
                      </div>

                      {/* Tools List */}
                      <div className="space-y-1">
                        {categoryTools.map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={handleClose}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-forest-50 dark:hover:bg-forest-900/30 transition-colors"
                          >
                            <div className="h-10 w-10 rounded-lg bg-forest-50 dark:bg-forest-900/30 border border-forest-100 dark:border-border flex items-center justify-center shrink-0">
                              <Icon
                                icon={tool.icon}
                                size={20}
                                className="text-forest-500 dark:text-forest-400"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                {tool.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {tool.shortDescription}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.35 }}
            className="px-4 pt-4 pb-12 border-t border-forest-100 dark:border-border bg-forest-50/50 dark:bg-forest-900/20"
            style={{ paddingBottom: "max(3rem, calc(env(safe-area-inset-bottom) + 1.5rem))" }}
          >
            <Link
              href="/new"
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 py-4 bg-peach-500 hover:bg-peach-600 active:bg-peach-700 text-white text-base font-semibold rounded-full transition-colors"
            >
              Start now
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
