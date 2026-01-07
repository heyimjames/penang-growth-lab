"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useMemo, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { getCase } from "@/lib/actions/cases"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Map route segments to human-readable labels
const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  cases: "Complaints",
  new: "New Complaint",
  settings: "Settings",
  profile: "Profile",
  letters: "Letters",
  evidence: "Evidence",
  timeline: "Timeline",
}

function generateBreadcrumbs(pathname: string, draftCaseName?: string | null) {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs: { label: string; href: string; isCurrentPage: boolean }[] = []
  
  // Always start with NoReply as home
  breadcrumbs.push({ label: "NoReply", href: "/dashboard", isCurrentPage: false })
  
  // Skip if we're already on dashboard
  if (pathname === "/dashboard") {
    return [{ label: "NoReply", href: "/dashboard", isCurrentPage: true }]
  }
  
  let currentPath = ""
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    // Skip "dashboard" segment as we already have NoReply as root
    if (segment === "dashboard") return
    
    // Check if this is a UUID (case ID)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)
    
    let label = routeLabels[segment] || segment
    
    // For UUIDs in cases, show "Case Details"
    if (isUUID && segments[index - 1] === "cases") {
      label = "Case Details"
    }
    
    // For /new page with draft, show complaint name instead of "New Complaint"
    if (segment === "new" && draftCaseName) {
      label = draftCaseName
    }
    
    breadcrumbs.push({
      label,
      href: currentPath,
      isCurrentPage: isLast,
    })
  })
  
  return breadcrumbs
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const draftId = searchParams.get("draft")
  const [draftCaseName, setDraftCaseName] = useState<string | null>(null)

  // Fetch case name if editing a draft
  useEffect(() => {
    if (draftId && pathname === "/new") {
      getCase(draftId).then((caseData) => {
        if (caseData?.company_name) {
          setDraftCaseName(caseData.company_name)
        }
      }).catch(() => {
        // Ignore errors
      })
    } else {
      setDraftCaseName(null)
    }
  }, [draftId, pathname])

  const breadcrumbs = useMemo(() => generateBreadcrumbs(pathname, draftCaseName), [pathname, draftCaseName])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.isCurrentPage ? (
                <BreadcrumbPage className={cn(
                  "text-sm",
                  index === 0 && "font-semibold font-display"
                )}>
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link 
                    href={crumb.href}
                    className={cn(
                      "text-sm",
                      index === 0 && "font-semibold font-display text-foreground"
                    )}
                  >
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Mobile version - just shows current page title
export function MobileBreadcrumbs() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const draftId = searchParams.get("draft")
  const [draftCaseName, setDraftCaseName] = useState<string | null>(null)

  // Fetch case name if editing a draft
  useEffect(() => {
    if (draftId && pathname === "/new") {
      getCase(draftId).then((caseData) => {
        if (caseData?.company_name) {
          setDraftCaseName(caseData.company_name)
        }
      }).catch(() => {
        // Ignore errors
      })
    } else {
      setDraftCaseName(null)
    }
  }, [draftId, pathname])

  const breadcrumbs = useMemo(() => generateBreadcrumbs(pathname, draftCaseName), [pathname, draftCaseName])
  
  // Get the last breadcrumb (current page)
  const currentPage = breadcrumbs[breadcrumbs.length - 1]
  
  // If on dashboard, show NoReply
  if (pathname === "/dashboard") {
    return <span className="font-semibold font-display text-foreground">NoReply</span>
  }
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <Link href="/dashboard" className="font-semibold font-display text-foreground">
        NoReply
      </Link>
      <span className="text-muted-foreground">/</span>
      <span className="text-muted-foreground truncate max-w-[150px]">{currentPage?.label}</span>
    </div>
  )
}




