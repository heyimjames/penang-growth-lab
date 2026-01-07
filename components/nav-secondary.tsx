"use client"

import * as React from "react"
import Link from "next/link"
import { type LucideIcon } from "lucide-react"
import { Icon } from "@/lib/icons"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>
  isHugeIcon?: boolean
}

export function NavSecondary({
  items,
  ...props
}: {
  items: NavItem[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isMobile, setOpenMobile } = useSidebar()

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url} onClick={closeMobileSidebar}>
                  {item.isHugeIcon ? (
                    <Icon icon={item.icon as React.ComponentType<{ size?: number }>} size={16} className="opacity-65" />
                  ) : (
                    <item.icon className="opacity-65" />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
