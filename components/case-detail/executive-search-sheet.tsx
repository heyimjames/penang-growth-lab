"use client"

import { useState } from "react"
import { Sheet } from "@silk-hq/components"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import { 
  Search01Icon, 
  UserMultiple02Icon,
  Link04Icon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  Loading03Icon,
  Mail01Icon,
  CheckmarkBadge01Icon,
  Add01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ExecutiveContact {
  name: string
  title: string
  email?: string
  linkedIn?: string
}

interface ExecutiveSearchSheetProps {
  companyName: string
  companyDomain?: string
  onSearch: () => Promise<{ executives: ExecutiveContact[]; emails: string[] }>
  onAddContacts: (emails: string[], executives: ExecutiveContact[]) => void
  trigger: React.ReactNode
}

export function ExecutiveSearchSheet({
  companyName,
  companyDomain: _companyDomain,
  onSearch,
  onAddContacts,
  trigger,
}: ExecutiveSearchSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<{ executives: ExecutiveContact[]; emails: string[] } | null>(null)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      const data = await onSearch()
      setResults(data)
      setHasSearched(true)
      
      if (data.executives.length === 0 && data.emails.length === 0) {
        toast.info("No additional contacts found")
      }
    } catch (err) {
      console.error("Search error:", err)
      toast.error("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      toast.success("Email copied!")
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch (_err) {
      toast.error("Failed to copy")
    }
  }

  const handleAddAll = () => {
    if (!results) return
    
    onAddContacts(results.emails, results.executives)
    toast.success("Contacts added to your case!")
    setIsOpen(false)
  }

  const totalFound = (results?.executives.length || 0) + (results?.emails.length || 0)

  return (
    <Sheet.Root presented={isOpen} onPresentedChange={setIsOpen} license="non-commercial">
      <Sheet.Trigger asChild>
        {trigger}
      </Sheet.Trigger>
      <Sheet.Portal>
        <Sheet.View
          className="z-[100]"
          contentPlacement="bottom"
          swipeOvershoot={false}
        >
          <Sheet.Backdrop 
            className="bg-black/40 backdrop-blur-sm"
            themeColorDimming="auto"
          />
          <Sheet.Content className="rounded-t-[20px] bg-card border-t border-x border-border shadow-xl max-h-[85dvh] flex flex-col">
            <Sheet.BleedingBackground className="bg-card" />
            <Sheet.Handle className="bg-muted-foreground/20 w-10 h-1 rounded-full mx-auto mt-3 mb-2" />
            
            {/* Header */}
            <div className="px-5 pb-3 border-b border-border shrink-0">
              <Sheet.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Icon icon={UserMultiple02Icon} size={20} className="text-lavender-500" />
                Find Senior Staff
              </Sheet.Title>
              <Sheet.Description className="text-sm text-muted-foreground mt-1">
                Search for executives and decision-makers at {companyName}
              </Sheet.Description>
            </div>
            
            {/* Content */}
            <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0">
              {/* Initial State - Search Button */}
              {!hasSearched && !isSearching && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center">
                    <Icon icon={Search01Icon} size={28} className="text-lavender-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Find Decision Makers
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                    We'll search for senior staff at {companyName} including executives, managers, and customer relations leads.
                  </p>
                  <Button
                    onClick={handleSearch}
                    className="bg-lavender-500 hover:bg-lavender-600 text-white"
                  >
                    <Icon icon={Search01Icon} size={16} className="mr-2" />
                    Start Search
                  </Button>
                </div>
              )}
              
              {/* Loading State */}
              {isSearching && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center">
                    <Icon icon={Loading03Icon} size={28} className="text-lavender-600 animate-spin" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Searching...
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Finding contacts at {companyName}
                  </p>
                </div>
              )}
              
              {/* Results */}
              {hasSearched && !isSearching && results && (
                <>
                  {/* Summary Badge */}
                  {totalFound > 0 && (
                    <div className="flex items-center justify-center gap-2 mb-4 p-3 rounded-xl bg-forest-50 dark:bg-forest-950/30 border border-forest-200 dark:border-forest-800">
                      <Icon icon={CheckmarkBadge01Icon} size={18} className="text-forest-600" />
                      <span className="text-sm font-medium text-forest-700 dark:text-forest-300">
                        Found {totalFound} contact{totalFound !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  
                  {/* Executives */}
                  {results.executives.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Executives & Managers
                      </p>
                      <div className="space-y-2">
                        {results.executives.map((exec, i) => (
                          <div
                            key={`${exec.name}-${i}`}
                            className="p-3 rounded-xl border border-border bg-card"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="min-w-0">
                                <span className="font-medium text-sm block truncate">
                                  {exec.name}
                                </span>
                                <Badge 
                                  variant="secondary" 
                                  className="text-[10px] px-1.5 py-0 h-4 mt-1 bg-lavender-100 dark:bg-lavender-900/30 text-lavender-700 dark:text-lavender-300"
                                >
                                  {exec.title}
                                </Badge>
                              </div>
                              {exec.linkedIn && (
                                <a
                                  href={exec.linkedIn}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors shrink-0"
                                >
                                  <Icon icon={Link04Icon} size={16} />
                                </a>
                              )}
                            </div>
                            {exec.email && (
                              <button
                                type="button"
                                onClick={() => handleCopyEmail(exec.email!)}
                                className={cn(
                                  "w-full flex items-center gap-2 p-2 rounded-lg transition-all text-left active:scale-[0.98]",
                                  copiedEmail === exec.email
                                    ? "bg-forest-100 dark:bg-forest-900/30"
                                    : "bg-muted/50 hover:bg-muted"
                                )}
                              >
                                <Icon icon={Mail01Icon} size={14} className="text-muted-foreground" />
                                <span className="flex-1 font-mono text-xs truncate text-lavender-600">
                                  {exec.email}
                                </span>
                                <Icon 
                                  icon={copiedEmail === exec.email ? CheckmarkCircle01Icon : Copy01Icon} 
                                  size={14} 
                                  className={cn(
                                    "shrink-0",
                                    copiedEmail === exec.email ? "text-forest-500" : "text-muted-foreground"
                                  )} 
                                />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Additional Emails */}
                  {results.emails.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Additional Emails
                      </p>
                      <div className="space-y-2">
                        {results.emails.map((email) => (
                          <button
                            key={email}
                            type="button"
                            onClick={() => handleCopyEmail(email)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left active:scale-[0.98]",
                              copiedEmail === email
                                ? "border-forest-400 bg-forest-50 dark:bg-forest-950/30"
                                : "border-border hover:border-muted-foreground/40 bg-card hover:bg-muted/30"
                            )}
                          >
                            <Icon icon={Mail01Icon} size={16} className="text-muted-foreground shrink-0" />
                            <span className="flex-1 font-mono text-sm truncate">
                              {email}
                            </span>
                            <Icon 
                              icon={copiedEmail === email ? CheckmarkCircle01Icon : Copy01Icon} 
                              size={16} 
                              className={cn(
                                "shrink-0",
                                copiedEmail === email ? "text-forest-500" : "text-muted-foreground"
                              )} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Empty Results */}
                  {totalFound === 0 && (
                    <div className="text-center py-8">
                      <Icon icon={UserMultiple02Icon} size={32} className="mx-auto mb-3 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">
                        No additional contacts found for {companyName}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Action Buttons */}
            {hasSearched && !isSearching && totalFound > 0 && (
              <div className="sticky bottom-0 px-5 py-4 border-t border-border bg-card safe-area-bottom shrink-0 space-y-2">
                <Button
                  onClick={handleAddAll}
                  className="w-full h-12 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-base font-semibold"
                >
                  <Icon icon={Add01Icon} size={18} className="mr-2" />
                  Add {totalFound} Contact{totalFound !== 1 ? "s" : ""} to Case
                </Button>
                <Button
                  onClick={handleSearch}
                  variant="ghost"
                  className="w-full text-muted-foreground"
                >
                  Search Again
                </Button>
              </div>
            )}
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}


