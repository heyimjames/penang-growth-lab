"use client"

import { useState } from "react"
import { Sheet } from "@silk-hq/components"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import { 
  Mail01Icon, 
  Copy01Icon, 
  CheckmarkCircle01Icon,
  Link04Icon,
  UserMultiple02Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ExecutiveContact {
  name: string
  title: string
  email?: string
  linkedIn?: string
}

interface ContactEmailsSheetProps {
  emails: string[]
  executives?: ExecutiveContact[]
  companyName: string
  trigger: React.ReactNode
  onSearchExecutives?: () => void
  isSearching?: boolean
}

export function ContactEmailsSheet({
  emails,
  executives = [],
  companyName,
  trigger,
  onSearchExecutives,
  isSearching,
}: ContactEmailsSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      toast.success("Email copied!")
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const handleCopyAll = async () => {
    const allEmails = [
      ...emails,
      ...executives.filter(e => e.email).map(e => e.email!),
    ]
    const uniqueEmails = [...new Set(allEmails)]
    
    if (uniqueEmails.length === 0) {
      toast.error("No emails to copy")
      return
    }

    try {
      await navigator.clipboard.writeText(uniqueEmails.join(", "))
      toast.success(`Copied ${uniqueEmails.length} emails`)
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const totalEmails = emails.length + executives.filter(e => e.email).length

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
            <div className="px-5 pb-3 border-b border-border flex items-center justify-between shrink-0">
              <div>
                <Sheet.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Icon icon={Mail01Icon} size={20} className="text-lavender-500" />
                  Contact Emails
                </Sheet.Title>
                <Sheet.Description className="text-sm text-muted-foreground mt-1">
                  {companyName} • {totalEmails} contact{totalEmails !== 1 ? "s" : ""} found
                </Sheet.Description>
              </div>
              {totalEmails > 0 && (
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="text-sm text-lavender-600 hover:text-lavender-700 font-medium flex items-center gap-1"
                >
                  <Icon icon={Copy01Icon} size={14} />
                  Copy All
                </button>
              )}
            </div>
            
            {/* Email List */}
            <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0">
              {/* General Emails */}
              {emails.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Customer Service
                  </p>
                  <div className="space-y-2">
                    {emails.map((email, i) => (
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
                        <div className={cn(
                          "w-2.5 h-2.5 rounded-full shrink-0",
                          i === 0 ? "bg-forest-500" : "bg-lavender-400"
                        )} />
                        <span className="flex-1 font-mono text-sm truncate">
                          {email}
                        </span>
                        {i === 0 && (
                          <Badge className="text-[10px] px-1.5 py-0 h-4 bg-forest-100 text-forest-700 border-forest-200 shrink-0">
                            Best
                          </Badge>
                        )}
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
              
              {/* Executive Contacts */}
              {executives.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <Icon icon={CheckmarkBadge01Icon} size={12} className="text-forest-500" />
                    Verified Staff
                  </p>
                  <div className="space-y-2">
                    {executives.map((exec, i) => (
                      <div
                        key={exec.name}
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
              
              {/* Empty State */}
              {emails.length === 0 && executives.length === 0 && (
                <div className="text-center py-8">
                  <Icon icon={Mail01Icon} size={32} className="mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No contact emails found yet
                  </p>
                </div>
              )}
            </div>
            
            {/* Find More Button */}
            {onSearchExecutives && (
              <div className="sticky bottom-0 px-5 py-4 border-t border-border bg-card safe-area-bottom shrink-0">
                <Button
                  onClick={() => {
                    onSearchExecutives()
                    setIsOpen(false)
                  }}
                  disabled={isSearching}
                  variant="outline"
                  className="w-full h-12 rounded-xl text-base font-medium"
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Icon icon={UserMultiple02Icon} size={18} className="mr-2" />
                      Find Senior Staff
                    </>
                  )}
                </Button>
              </div>
            )}
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  )
}


