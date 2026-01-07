"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LifeBuoy } from "lucide-react"
import { Settings02Icon, PlusSignIcon } from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { Icon } from "@/lib/icons"

import { NavMain } from "@/components/nav-main"
import { NavCases } from "@/components/nav-cases"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { CreditsPrompt } from "@/components/credits-prompt"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface Case {
  id: string
  title: string
  company_name?: string
  company_domain?: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  cases?: Case[]
  userEmail?: string | null
  userName?: string | null
  credits?: number
}

const ADMIN_EMAIL = "james@octoberwip.com"

export function AppSidebar({ cases = [], userEmail, userName, credits = 0, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const { setOpenMobile, isMobile } = useSidebar()
  const isAdmin = userEmail === ADMIN_EMAIL

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar variant="sidebar" collapsible="none" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" onClick={closeMobileSidebar}>
                <div className="bg-forest-500 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Icon icon={KnightShieldIcon} size={18} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold font-display">NoReply</span>
                  <span className="truncate text-xs text-muted-foreground">Consumer Advocacy</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Start New Complaint CTA */}
        <SidebarGroup className="py-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  "justify-center bg-coral-500 text-white",
                  "rounded-full",
                  "hover:bg-coral-400 hover:text-white",
                  "active:bg-coral-600",
                  "data-[state=open]:bg-coral-600 data-[state=open]:text-white",
                  "transition-all duration-200",
                  "focus-visible:ring-coral-500/50",
                  pathname === "/new" && "ring-2 ring-coral-300 ring-offset-2 ring-offset-background"
                )}
              >
                <Link href="/new" onClick={closeMobileSidebar}>
                  <Icon icon={PlusSignIcon} size={16} className="shrink-0" />
                  <span>New Complaint</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
        <NavCases cases={cases} />
        <NavSecondary
          items={[
            ...(isAdmin ? [{
              title: "Admin",
              url: "/admin",
              icon: Settings02Icon,
              isHugeIcon: true,
            }] : []),
            {
              title: "Help & Support",
              url: "/help",
              icon: LifeBuoy,
            },
          ]}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        <CreditsPrompt credits={credits} variant="sidebar" />
        <NavUser name={userName} email={userEmail} />
      </SidebarFooter>
    </Sidebar>
  )
}
