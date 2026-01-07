"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import {
  ChevronRight,
  Eye,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { getLogoUrl } from "@/lib/logo"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { deleteCase, getCase, createCase } from "@/lib/actions/cases"

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

export function NavCases({ cases }: { cases: Case[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const draftId = searchParams.get("draft")
  const { isMobile, setOpenMobile } = useSidebar()
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering interactive elements after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const handleViewCase = (caseId: string) => {
    closeMobileSidebar()
    router.push(`/cases/${caseId}`)
  }

  const handleEditCase = (caseId: string) => {
    closeMobileSidebar()
    router.push(`/new?draft=${caseId}`)
  }

  const handleDuplicateCase = async (caseId: string) => {
    try {
      const originalCase = await getCase(caseId)
      if (!originalCase) {
        toast.error("Case not found")
        return
      }

      const duplicateData = {
        title: `${originalCase.title || originalCase.company_name} (Copy)`,
        complaint_text: originalCase.complaint_text,
        company_name: originalCase.company_name,
        company_domain: originalCase.company_domain,
        purchase_date: originalCase.purchase_date,
        purchase_amount: originalCase.purchase_amount,
        currency: originalCase.currency,
        desired_outcome: originalCase.desired_outcome,
        status: "draft" as const,
      }

      const newCase = await createCase(duplicateData)
      if (newCase) {
        toast.success("Case duplicated successfully")
        closeMobileSidebar()
        router.push(`/cases/${newCase.id}`)
      } else {
        toast.error("Failed to duplicate case")
      }
    } catch (error) {
      console.error("Error duplicating case:", error)
      toast.error("Failed to duplicate case")
    }
  }

  const handleDeleteCase = async (caseId: string) => {
    if (!confirm("Are you sure you want to delete this case? This action cannot be undone.")) {
      return
    }

    setDeletingCaseId(caseId)
    try {
      const success = await deleteCase(caseId)
      if (success) {
        toast.success("Case deleted successfully")
        if (pathname === `/cases/${caseId}`) {
          router.push("/cases")
        }
      } else {
        toast.error("Failed to delete case")
      }
    } catch (error) {
      console.error("Error deleting case:", error)
      toast.error("Failed to delete case")
    } finally {
      setDeletingCaseId(null)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>Complaints</span>
        {cases.length > 0 && (
          <span className="text-xs text-muted-foreground font-normal">{cases.length}</span>
        )}
      </SidebarGroupLabel>
      <SidebarMenu>
        {/* Show recent cases directly */}
        {cases.slice(0, 5).map((caseItem) => {
          const companyName = caseItem.company_name || caseItem.title || "Untitled Case"
          const domain = caseItem.company_domain || guessDomain(companyName)
          const isActive = pathname === `/cases/${caseItem.id}` || (pathname === "/new" && draftId === caseItem.id)

          return (
            <SidebarMenuItem key={caseItem.id} className="group/case">
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={`/cases/${caseItem.id}`} onClick={closeMobileSidebar}>
                  <Avatar className="size-5 rounded-sm border border-sidebar-border bg-white dark:bg-sidebar-accent">
                    <AvatarImage
                      src={getLogoUrl(domain, 32)}
                      alt={companyName}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-[10px] rounded-md text-muted-foreground">
                      {companyName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{companyName}</span>
                </Link>
              </SidebarMenuButton>
              {mounted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/case:opacity-100 focus:opacity-100 hover:bg-sidebar-accent transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">More</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem onClick={() => handleViewCase(caseItem.id)}>
                      <Eye className="text-muted-foreground" />
                      <span>View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditCase(caseItem.id)}>
                      <Pencil className="text-muted-foreground" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateCase(caseItem.id)}>
                      <Copy className="text-muted-foreground" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteCase(caseItem.id)}
                      disabled={deletingCaseId === caseItem.id}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="text-destructive" />
                      <span>{deletingCaseId === caseItem.id ? "Deleting..." : "Delete"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          )
        })}

        {/* View all cases link */}
        {cases.length > 5 && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/cases" onClick={closeMobileSidebar}>
                <ChevronRight className="size-4" />
                <span>View all {cases.length} complaints</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {/* Empty state */}
        {cases.length === 0 && (
          <SidebarMenuItem>
            <div className="px-2 py-3 text-xs text-muted-foreground text-center">
              No cases yet
            </div>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
