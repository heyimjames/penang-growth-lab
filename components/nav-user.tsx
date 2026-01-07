"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronsUpDown,
} from "lucide-react"
import {
  Settings01Icon,
  Logout01Icon,
  KnightShieldIcon,
} from "@hugeicons-pro/core-stroke-rounded"
import { Icon } from "@/lib/icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserAvatar } from "@/components/user-avatar"
import { signOut } from "@/lib/actions/auth"
import { showWelcomeModal } from "@/components/welcome-modal"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface NavUserProps {
  name?: string | null
  email?: string | null
}

export function NavUser({ name, email }: NavUserProps) {
  const { isMobile, setOpenMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch with dropdown menu IDs
  useEffect(() => {
    setMounted(true)
  }, [])

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const handleSignOut = async () => {
    trackEvent(AnalyticsEvents.AUTH.LOGOUT)
    closeMobileSidebar()
    await signOut()
  }

  // Show static version during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <UserAvatar name={name} email={email} size="sm" className="rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name || email?.split("@")[0] || "My Account"}</span>
              <span className="truncate text-xs text-muted-foreground">{email || "Manage settings"}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar name={name} email={email} size="sm" className="rounded-lg" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name || email?.split("@")[0] || "My Account"}</span>
                <span className="truncate text-xs text-muted-foreground">{email || "Manage settings"}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar name={name} email={email} size="sm" className="rounded-lg" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name || email?.split("@")[0] || "My Account"}</span>
                  <span className="truncate text-xs text-muted-foreground">{email || "Manage settings"}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/account" onClick={closeMobileSidebar}>
                  <Icon icon={Settings01Icon} size={16} />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  closeMobileSidebar()
                  showWelcomeModal()
                }} 
                className="cursor-pointer"
              >
                <Icon icon={KnightShieldIcon} size={16} />
                Welcome Tour
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
              <Icon icon={Logout01Icon} size={16} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
