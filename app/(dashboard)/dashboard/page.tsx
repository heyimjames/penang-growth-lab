import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CaseCard } from "@/components/case-card"
import { Icon } from "@/lib/icons"
import { PlusSignIcon, FolderOpenIcon, File01Icon, Clock01Icon, CheckmarkCircle01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { getCases, getCaseStats } from "@/lib/actions/cases"
import { DashboardTracker } from "@/components/dashboard/dashboard-tracker"

export default async function DashboardPage() {
  const [cases, stats] = await Promise.all([getCases(), getCaseStats()])
  const recentCases = cases.slice(0, 3)

  const statCards = [
    {
      title: "Total Complaints",
      value: stats.total.toString(),
      description: "Complaints created",
      icon: FolderOpenIcon,
      color: "text-forest-500",
    },
    {
      title: "Active",
      value: stats.active.toString(),
      description: "In progress",
      icon: Clock01Icon,
      color: "text-lavender-500",
    },
    {
      title: "Drafts",
      value: stats.draft.toString(),
      description: "Not yet submitted",
      icon: File01Icon,
      color: "text-muted-foreground",
    },
    {
      title: "Resolved",
      value: stats.resolved.toString(),
      description: "Successfully closed",
      icon: CheckmarkCircle01Icon,
      color: "text-[var(--color-success)]",
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <DashboardTracker stats={stats} />
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-1 hidden sm:block">
              Welcome back! Here&apos;s an overview of your complaints.
            </p>
          </div>
          <Button asChild size="sm" variant="coral" className="sm:hidden">
            <Link href="/new">
              <Icon icon={PlusSignIcon} size={18} />
            </Link>
          </Button>
          <Button asChild variant="coral" className="hidden sm:flex">
            <Link href="/new" className="flex items-center">
              <Icon icon={PlusSignIcon} size={16} className="mr-2" />
              New Complaint
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats - Horizontal scroll on mobile */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:overflow-visible scrollbar-hide">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="flex-shrink-0 w-32 sm:w-auto bg-card border border-border rounded-xl p-3 sm:p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon icon={stat.icon} size={18} className={stat.color} />
                <span className="text-2xl sm:text-3xl font-bold">{stat.value}</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions - Simplified on mobile */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-lavender-100 dark:bg-lavender-950/30 rounded-xl p-4 sm:p-6 border border-lavender-200/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold">Ready to fight back?</h3>
              <p className="text-sm text-muted-foreground mt-0.5 hidden sm:block">
                Start a new complaint and let our AI help you build a compelling case.
              </p>
            </div>
            <Button asChild variant="coral" className="shrink-0">
              <Link href="/new" className="flex items-center">
                <Icon icon={PlusSignIcon} size={16} className="sm:mr-2" />
                <span className="hidden sm:inline">Start New Complaint</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Cases */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Recent Complaints</h2>
          {cases.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cases">View all</Link>
            </Button>
          )}
        </div>

        {recentCases.length > 0 ? (
          <div className="space-y-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:space-y-0">
            {recentCases.map((caseData) => (
              <CaseCard key={caseData.id} caseData={caseData} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <Icon icon={FolderOpenIcon} size={48} color="currentColor" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">No complaints yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
              Start your first complaint to fight back against unfair treatment.
            </p>
            <Button asChild variant="coral">
              <Link href="/new" className="flex items-center">
                <Icon icon={PlusSignIcon} size={16} className="mr-2" />
                Create Your First Complaint
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
