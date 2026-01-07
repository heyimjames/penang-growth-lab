import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { CaseCard } from "@/components/case-card"
import { Icon } from "@/lib/icons"
import { PlusSignIcon, FolderOpenIcon } from "@hugeicons-pro/core-stroke-rounded"
import { getCases } from "@/lib/actions/cases"

export default async function CasesPage() {
  const cases = await getCases()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Complaints</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-0.5 hidden sm:block">
              Manage and track all your consumer complaints.
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

      {/* Cases */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        {cases.length > 0 ? (
          <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:space-y-0">
            {cases.map((caseData) => (
              <CaseCard key={caseData.id} caseData={caseData} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <Icon icon={FolderOpenIcon} size={56} color="currentColor" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No complaints yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              You haven&apos;t created any complaints yet. Start your first complaint to fight back against unfair treatment.
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
