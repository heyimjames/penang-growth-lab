import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import {
  Search01Icon,
  ArrowRight01Icon,
  AirplaneTakeOff01Icon,
  ShoppingBag01Icon,
  Building01Icon,
  Idea01Icon,
  Wifi01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { getPopularCompanies } from "@/lib/company-data"
import { ComplainDirectoryTracker } from "@/components/complain/complain-directory-tracker"
import { TrackedCompanyLink } from "@/components/complain/tracked-company-link"

export const metadata: Metadata = {
  title: "Company Complaints Directory | NoReply",
  description:
    "Find complaint guides, contact information, and success rates for UK companies. Start your complaint in minutes.",
}

const industryIcons: Record<string, typeof Building01Icon> = {
  airline: AirplaneTakeOff01Icon,
  retail: ShoppingBag01Icon,
  banking: Building01Icon,
  utility: Idea01Icon,
  telecom: Wifi01Icon,
}

export default async function CompaniesPage() {
  const companies = await getPopularCompanies()

  // Group by industry
  const byIndustry = companies.reduce<Record<string, typeof companies>>((acc, company) => {
    const industry = company.industry || "other"
    if (!acc[industry]) acc[industry] = []
    acc[industry].push(company)
    return acc
  }, {})

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ComplainDirectoryTracker
        companyCount={companies.length}
        industryCount={Object.keys(byIndustry).length}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-forest-100 bg-gradient-to-b from-forest-50/30 to-background">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display mb-4">
                Company Complaint<br />
                <span className="text-peach-500">Directory</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Find contact information, success rates, and legal rights for complaints against UK companies.
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Icon
                  icon={Search01Icon}
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search for a company..."
                  className="pl-12 h-12 text-base"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Companies by Industry */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {Object.entries(byIndustry).map(([industry, industryCompanies]) => {
                const IconComponent = industryIcons[industry] || Building01Icon
                return (
                  <div key={industry}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-lg bg-forest-100 flex items-center justify-center">
                        <Icon icon={IconComponent} size={20} className="text-forest-600" />
                      </div>
                      <h2 className="text-xl font-bold font-display capitalize">{industry}</h2>
                      <Badge variant="outline">{industryCompanies.length} companies</Badge>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {industryCompanies.map((company) => (
                        <TrackedCompanyLink
                          key={company.slug}
                          company={company}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Can't Find Your Company */}
        <section className="py-12 md:py-16 bg-forest-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4 font-display">
                Can&apos;t Find Your Company?
              </h2>
              <p className="text-muted-foreground mb-6">
                No problem! Our AI can research any company and create a professional complaint letter.
              </p>
              <Button size="lg" variant="coral" asChild>
                <Link href="/new">
                  Start Any Complaint
                  <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
