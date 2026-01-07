"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import { 
  Copy01Icon, 
  CheckmarkCircle01Icon,
  Search01Icon,
  Loading03Icon,
  UserMultipleIcon,
  Link04Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useEmailContext } from "./email-context"

interface ExecutiveContact {
  name: string
  title: string
  email?: string
  linkedIn?: string
}

interface ContactEmailsCardProps {
  emails: string[]
  executiveContacts?: ExecutiveContact[]
  companyName: string
  companyDomain?: string
  onEmailsUpdate?: (emails: string[], executives: ExecutiveContact[]) => void
}

export function ContactEmailsCard({ 
  emails: initialEmails, 
  executiveContacts: initialExecutives = [],
  companyName,
  companyDomain,
  onEmailsUpdate,
}: ContactEmailsCardProps) {
  const { addEmails } = useEmailContext()
  const [emails, setEmails] = useState(initialEmails)
  const [executives, setExecutives] = useState<ExecutiveContact[]>(initialExecutives)
  const [copied, setCopied] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

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
      setCopied(true)
      toast.success(`Copied ${uniqueEmails.length} email${uniqueEmails.length > 1 ? "s" : ""} to clipboard`)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      toast.success("Email copied!")
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const handleSearchExecutives = async () => {
    setIsSearching(true)
    
    try {
      const response = await fetch("/api/research/executives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          companyName,
          domain: companyDomain,
        }),
      })

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data = await response.json()
      
      if (data.error && data.executives.length === 0) {
        toast.error("Search not available")
        return
      }

      // Merge new executives with existing ones
      const newExecutives = data.executives as ExecutiveContact[]
      const existingNames = new Set(executives.map(e => e.name.toLowerCase()))
      const uniqueNewExecutives = newExecutives.filter(
        e => !existingNames.has(e.name.toLowerCase())
      )
      
      // Merge new emails with existing ones
      const newEmails = data.emails as string[]
      const existingEmails = new Set(emails.map(e => e.toLowerCase()))
      const uniqueNewEmails = newEmails.filter(
        e => !existingEmails.has(e.toLowerCase())
      )

      if (uniqueNewExecutives.length === 0 && uniqueNewEmails.length === 0) {
        toast.info("No additional contacts found")
      } else {
        const updatedExecutives = [...executives, ...uniqueNewExecutives]
        const updatedEmails = [...emails, ...uniqueNewEmails]
        
        setExecutives(updatedExecutives)
        setEmails(updatedEmails)
        
        // Notify parent about new emails (for use in Letters tab)
        onEmailsUpdate?.(updatedEmails, updatedExecutives)
        
        // Also update shared context for other components
        addEmails(updatedEmails, updatedExecutives)
        
        const parts = []
        if (uniqueNewExecutives.length > 0) {
          parts.push(`${uniqueNewExecutives.length} executive${uniqueNewExecutives.length > 1 ? "s" : ""}`)
        }
        if (uniqueNewEmails.length > 0) {
          parts.push(`${uniqueNewEmails.length} email${uniqueNewEmails.length > 1 ? "s" : ""}`)
        }
        toast.success(`Found ${parts.join(" and ")}! Added to complaint recipients.`)
      }
      
      setHasSearched(true)
    } catch (error) {
      console.error("Executive search error:", error)
      toast.error("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const allEmailsCount = emails.length + executives.filter(e => e.email).length

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-foreground">Contact Emails</p>
        {allEmailsCount > 0 && (
          <button
            onClick={handleCopyAll}
            className="text-xs text-lavender-600 hover:text-lavender-700 hover:underline flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-lavender-50 dark:hover:bg-lavender-950/30 transition-colors"
          >
            {copied ? (
              <>
                <Icon icon={CheckmarkCircle01Icon} size={14} className="text-forest-500" />
                Copied
              </>
            ) : (
              <>
                <Icon icon={Copy01Icon} size={14} />
                Copy all
              </>
            )}
          </button>
        )}
      </div>

      {/* General Emails */}
      {emails.length > 0 && (
        <div className="space-y-1.5">
          {emails.slice(0, 5).map((email, i) => (
            <div 
              key={i}
              className="group flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <a 
                href={`mailto:${email}`}
                className="text-sm text-lavender-600 hover:underline truncate flex-1 font-mono"
              >
                {email}
              </a>
              {i === 0 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 shrink-0">Best</Badge>
              )}
              <button
                onClick={() => handleCopyEmail(email)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-muted rounded-md shrink-0"
                title="Copy email"
              >
                <Icon icon={Copy01Icon} size={14} className="text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Verified Executive Contacts */}
      {executives.length > 0 && (
        <div className={cn(emails.length > 0 && "mt-3 pt-3 border-t border-border")}>
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Icon icon={CheckmarkBadge01Icon} size={14} className="text-forest-500" />
            Verified Staff
          </p>
          <div className="space-y-1.5">
            {executives.slice(0, 5).map((exec, i) => (
              <div key={i} className="group flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium truncate">{exec.name}</span>
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] px-1.5 py-0 h-5 bg-lavender-100 dark:bg-lavender-900/30 text-lavender-700 dark:text-lavender-300 shrink-0"
                    >
                      {exec.title}
                    </Badge>
                  </div>
                  {exec.email && (
                    <a 
                      href={`mailto:${exec.email}`}
                      className="text-sm text-lavender-600 hover:underline truncate block font-mono mt-0.5"
                    >
                      {exec.email}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {exec.email && (
                    <button
                      onClick={() => handleCopyEmail(exec.email!)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-muted rounded-md"
                      title="Copy email"
                    >
                      <Icon icon={Copy01Icon} size={14} className="text-muted-foreground" />
                    </button>
                  )}
                  {exec.linkedIn && (
                    <a 
                      href={exec.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-md transition-colors"
                      title="Verified on LinkedIn"
                    >
                      <Icon icon={Link04Icon} size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {emails.length === 0 && executives.length === 0 && (
        <p className="text-sm text-muted-foreground mb-3">
          No contact emails found yet.
        </p>
      )}

      {/* Search Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSearchExecutives}
        disabled={isSearching}
        className={cn(
          "w-full mt-3 h-9 text-sm",
          hasSearched && "border-forest-200 dark:border-forest-800"
        )}
      >
        {isSearching ? (
          <>
            <Icon icon={Loading03Icon} size={16} className="mr-2 animate-spin" />
            Searching...
          </>
        ) : hasSearched ? (
          <>
            <Icon icon={Search01Icon} size={16} className="mr-2" />
            Search Again
          </>
        ) : (
          <>
            <Icon icon={Search01Icon} size={16} className="mr-2" />
            Find Senior Staff
          </>
        )}
      </Button>
    </div>
  )
}




