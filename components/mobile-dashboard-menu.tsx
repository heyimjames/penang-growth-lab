"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { Icon } from "@/lib/icons"
import {
  Menu01Icon,
  DashboardSquare01Icon,
  FolderOpenIcon,
  PlusSignIcon,
  Settings01Icon,
  Logout01Icon,
  User02Icon,
  ArrowDown01Icon,
  CustomerService01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { XIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"
import { signOut } from "@/lib/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreditsPrompt } from "@/components/credits-prompt"
import { getLogoUrl } from "@/lib/logo"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface Case {
  id: string
  title: string
  company_name?: string
  company_domain?: string
}

function guessDomain(companyName: string): string {
  const normalized = companyName.toLowerCase().trim()
  const knownDomains: Record<string, string> = {
    "british airways": "britishairways.com",
    "paradise beach resort": "paradisebeachresort.com",
    amazon: "amazon.com",
    ryanair: "ryanair.com",
    easyjet: "easyjet.com",
    hilton: "hilton.com",
    marriott: "marriott.com",
    tesco: "tesco.com",
    vodafone: "vodafone.co.uk",
    sky: "sky.com",
    bt: "bt.com",
  }
  if (knownDomains[normalized]) return knownDomains[normalized]
  return normalized.replace(/\s+/g, "") + ".com"
}

interface MobileDashboardMenuProps {
  cases?: Case[]
  credits?: number
}

export function MobileDashboardMenu({ cases = [], credits = 0 }: MobileDashboardMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isCasesOpen, setIsCasesOpen] = React.useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const draftId = searchParams.get("draft")

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
    setIsCasesOpen(false)
  }

  const handleBack = () => {
    setIsCasesOpen(false)
  }

  const handleSignOut = async () => {
    trackEvent(AnalyticsEvents.AUTH.LOGOUT)
    handleClose()
    await signOut()
  }

  const isActive = (href: string, matchPrefix = false) => {
    if (matchPrefix) {
      return pathname === href || pathname.startsWith(`${href}/`)
    }
    return pathname === href
  }

  return (
    <>
      {/* Trigger Button - Hamburger Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="h-10 w-10 flex items-center justify-center -mr-2 text-foreground md:hidden"
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
              className="flex items-center justify-between px-4 h-14 border-b border-forest-100 dark:border-border safe-area-top pt-[env(safe-area-inset-top)]"
            >
              {isCasesOpen ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm font-medium text-forest-600 dark:text-forest-400"
                >
                  <ChevronRightIcon className="h-4 w-4 rotate-180" />
                  Back
                </button>
              ) : (
                <Link href="/dashboard" onClick={handleClose} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-500 shadow-sm">
                    <Icon icon={KnightShieldIcon} size={20} color="white" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-foreground font-display">
                    NoReply
                  </span>
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
              {!isCasesOpen ? (
                // Main Menu
                <nav className="py-2">
                  {/* Dashboard */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <Link
                      href="/dashboard"
                      onClick={handleClose}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 border-b border-dashed border-forest-200 dark:border-border",
                        isActive("/dashboard") && "bg-forest-500/5"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-11 h-11 rounded-xl shrink-0",
                        isActive("/dashboard")
                          ? "bg-forest-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Icon icon={DashboardSquare01Icon} size={20} />
                      </div>
                      <span className={cn(
                        "text-lg font-medium",
                        isActive("/dashboard") ? "text-forest-600 dark:text-forest-400" : "text-foreground"
                      )}>
                        Dashboard
                      </span>
                    </Link>
                  </motion.div>

                  {/* Cases with drill-down */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                    onClick={() => setIsCasesOpen(true)}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-4 border-b border-dashed border-forest-200 dark:border-border",
                      isActive("/cases", true) && "bg-forest-500/5"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-11 h-11 rounded-xl shrink-0",
                      isActive("/cases", true)
                        ? "bg-forest-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      <Icon icon={FolderOpenIcon} size={20} />
                    </div>
                    <span className={cn(
                      "text-lg font-medium flex-1 text-left",
                      isActive("/cases", true) ? "text-forest-600 dark:text-forest-400" : "text-foreground"
                    )}>
                      My Complaints
                    </span>
                    {cases.length > 0 && (
                      <span className="text-sm text-muted-foreground mr-1">{cases.length}</span>
                    )}
                    <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                  </motion.button>

                  {/* Account Settings */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <Link
                      href="/account"
                      onClick={handleClose}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 border-b border-dashed border-forest-200 dark:border-border",
                        isActive("/account") && "bg-forest-500/5"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-11 h-11 rounded-xl shrink-0",
                        isActive("/account")
                          ? "bg-forest-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Icon icon={Settings01Icon} size={20} />
                      </div>
                      <span className={cn(
                        "text-lg font-medium",
                        isActive("/account") ? "text-forest-600 dark:text-forest-400" : "text-foreground"
                      )}>
                        Account Settings
                      </span>
                    </Link>
                  </motion.div>

                  {/* Help & Support */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                  >
                    <Link
                      href="/help"
                      onClick={handleClose}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 border-b border-dashed border-forest-200 dark:border-border",
                        isActive("/help") && "bg-forest-500/5"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-11 h-11 rounded-xl shrink-0",
                        isActive("/help")
                          ? "bg-forest-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Icon icon={CustomerService01Icon} size={20} />
                      </div>
                      <span className={cn(
                        "text-lg font-medium",
                        isActive("/help") ? "text-forest-600 dark:text-forest-400" : "text-foreground"
                      )}>
                        Help & Support
                      </span>
                    </Link>
                  </motion.div>

                  {/* Sign Out */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-4 px-4 py-4 border-b border-dashed border-forest-200 dark:border-border"
                  >
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-destructive/10 text-destructive">
                      <Icon icon={Logout01Icon} size={20} />
                    </div>
                    <span className="text-lg font-medium text-destructive">
                      Sign out
                    </span>
                  </motion.button>
                </nav>
              ) : (
                // Cases View
                <div className="py-4">
                  {/* All Cases Link */}
                  <div className="px-4 mb-4">
                    <Link
                      href="/cases"
                      onClick={handleClose}
                      className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="text-base font-medium text-foreground">View all cases</span>
                      <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </div>

                  {/* Cases List */}
                  {cases.length > 0 ? (
                    <div className="space-y-1">
                      <div className="px-4 mb-2">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Recent Cases
                        </h3>
                      </div>
                      {cases.map((caseItem) => {
                        const companyName = caseItem.company_name || caseItem.title || "Untitled Case"
                        const domain = caseItem.company_domain || guessDomain(companyName)
                        const isCaseActive = pathname === `/cases/${caseItem.id}` || (pathname === "/new" && draftId === caseItem.id)

                        return (
                          <Link
                            key={caseItem.id}
                            href={`/cases/${caseItem.id}`}
                            onClick={handleClose}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 hover:bg-forest-50 dark:hover:bg-forest-900/30 transition-colors",
                              isCaseActive && "bg-forest-500/10"
                            )}
                          >
                            <Avatar className="h-10 w-10 rounded-xl border border-border/50 shadow-sm bg-white dark:bg-muted shrink-0">
                              <AvatarImage
                                src={getLogoUrl(domain, 40)}
                                alt={companyName}
                                className="object-contain p-1.5"
                              />
                              <AvatarFallback className="text-sm bg-muted rounded-xl font-medium">
                                {companyName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-base font-medium truncate",
                                isCaseActive ? "text-forest-600 dark:text-forest-400" : "text-foreground"
                              )}>
                                {companyName}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mx-auto mb-4">
                        <Icon icon={FolderOpenIcon} size={28} className="text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">No cases yet</p>
                      <Link
                        href="/new"
                        onClick={handleClose}
                        className="inline-flex items-center gap-2 text-forest-600 dark:text-forest-400 font-medium"
                      >
                        Start your first complaint
                        <ChevronRightIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Credits Prompt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.32 }}
            >
              <CreditsPrompt credits={credits} variant="mobile" />
            </motion.div>

            {/* Footer CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.38 }}
              className="px-4 pt-2 pb-12 bg-forest-50/50 dark:bg-forest-900/20"
              style={{ paddingBottom: "max(3rem, calc(env(safe-area-inset-bottom) + 1.5rem))" }}
            >
              <Link
                href="/new"
                onClick={handleClose}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-4",
                  "bg-forest-500 hover:bg-forest-600 active:bg-forest-700",
                  "text-white text-base font-semibold rounded-full transition-colors"
                )}
              >
                <Icon icon={PlusSignIcon} size={20} />
                Start New Complaint
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
