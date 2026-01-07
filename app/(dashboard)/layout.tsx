import type React from "react"
import { cookies } from "next/headers"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { getCases } from "@/lib/actions/cases"
import { getUserCredits } from "@/lib/actions/credits"
import { MobileDashboardMenu } from "@/components/mobile-dashboard-menu"
import { DashboardBreadcrumbs, MobileBreadcrumbs } from "@/components/dashboard-breadcrumbs"
import { SelineIdentify } from "@/components/seline-identify"
import { WelcomeModal } from "@/components/welcome-modal"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const cases = await getCases()

  // Get current user info and credits
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userEmail = user?.email || null
  const userCredits = await getUserCredits()
  const credits = userCredits?.credits ?? 0

  // Get user profile for name
  let userName: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .single()
    userName = profile?.full_name || null
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {/* Identify user in Seline analytics */}
      {user && (
        <SelineIdentify
          userId={user.id}
          email={userEmail}
          name={userName}
          credits={credits}
        />
      )}
      <AppSidebar cases={cases} userEmail={userEmail} userName={userName} credits={credits} />
      <SidebarInset>
        {/* Mobile header - full-screen menu trigger (<768px) */}
        <header className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between border-b border-sidebar-border px-4 bg-sidebar h-14 pt-[env(safe-area-inset-top)]">
          <MobileBreadcrumbs />
          <MobileDashboardMenu cases={cases} credits={credits} />
        </header>

        {/* Main content area - no header on desktop, mobile header handled above */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-0">
          {children}
        </main>

        {/* Welcome modal for new users */}
        <WelcomeModal />
      </SidebarInset>
    </SidebarProvider>
  )
}
