import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CompanyLogo } from "@/components/company-logo"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  JusticeScale01Icon,
  FavouriteIcon,
  AnalyticsUpIcon,
  UserGroupIcon,
  Building01Icon,
  AlertCircleIcon,
} from "@hugeicons-pro/core-stroke-rounded"
import { getCompanyData } from "@/lib/company-data"
import { ComplainCompanyTracker } from "@/components/complain/complain-company-tracker"
import { TrackedIssueLink } from "@/components/complain/tracked-issue-link"
import { TrackedStartComplaintButton } from "@/components/complain/tracked-start-complaint-button"
import { ComplaintProcessTimeline } from "@/components/complain/complaint-process-timeline"
import { QuickActionsBar } from "@/components/complain/quick-actions-bar"
import { EscalationPathway } from "@/components/complain/escalation-pathway"
import { FAQAccordion } from "@/components/complain/faq-accordion"
import { TemplatePhraseSection } from "@/components/complain/template-phrases-section"
import { ContactHub } from "@/components/complain/contact-hub"

interface PageProps {
  params: Promise<{ company: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { company } = await params
  const companyName = decodeURIComponent(company).replace(/-/g, " ")
  const formattedName = companyName.replace(/\b\w/g, (c) => c.toUpperCase())
  const slug = company.toLowerCase()

  const pageUrl = `https://noreply.uk/complain/${slug}`
  const ogImageUrl = `https://noreply.uk/api/og?company=${encodeURIComponent(formattedName)}`

  return {
    title: `How to Complain to ${formattedName} | Complete Guide | NoReply`,
    description: `Step-by-step guide to complaining to ${formattedName}. Contact details, escalation pathways, your legal rights, and AI-powered complaint letters. Know your UK consumer rights.`,
    keywords: [
      `${formattedName} complaint`,
      `complain to ${formattedName}`,
      `${formattedName} customer service`,
      `${formattedName} refund`,
      `${formattedName} contact email`,
      `${formattedName} phone number`,
      `${formattedName} ombudsman`,
      "UK consumer rights",
      "complaint letter template",
    ],
    openGraph: {
      title: `How to Complain to ${formattedName} | NoReply`,
      description: `Complete guide to getting results from ${formattedName}. Contact details, escalation options, and AI-powered complaint letters.`,
      url: pageUrl,
      type: "website",
      locale: "en_GB",
      siteName: "NoReply",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `How to complain to ${formattedName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `How to Complain to ${formattedName}`,
      description: `Complete guide with contact details, escalation options, and AI-powered complaint letters.`,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// JSON-LD structured data for SEO
function generateJsonLd(companyData: {
  name: string
  slug: string
  description: string | null
  industry: string | null
  relevantLaws: { name: string; description: string }[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `How to Complain to ${companyData.name}`,
    description: companyData.description || `Complete guide to filing an effective complaint against ${companyData.name}`,
    url: `https://noreply.uk/complain/${companyData.slug}`,
    mainEntity: {
      "@type": "HowTo",
      name: `How to Make a Complaint Against ${companyData.name}`,
      description: `Step-by-step guide to filing an effective complaint against ${companyData.name} in the UK`,
      step: [
        {
          "@type": "HowToStep",
          name: "Contact Customer Service",
          text: "Start by contacting the company directly to explain your issue",
        },
        {
          "@type": "HowToStep",
          name: "Make a Formal Written Complaint",
          text: "Put your complaint in writing with evidence and a deadline",
        },
        {
          "@type": "HowToStep",
          name: "Escalate if Needed",
          text: "Use ombudsman, ADR, or small claims court if unresolved",
        },
      ],
    },
    about: {
      "@type": "Organization",
      name: companyData.name,
      industry: companyData.industry,
    },
    provider: {
      "@type": "Organization",
      name: "NoReply",
      url: "https://noreply.uk",
    },
  }
}

export default async function CompanyComplaintPage({ params }: PageProps) {
  const { company } = await params
  const companySlug = decodeURIComponent(company)
  const companyData = await getCompanyData(companySlug)

  const {
    name,
    slug,
    domain,
    description,
    industry,
    stats,
    contacts,
    regulation,
    relevantLaws,
    commonIssues,
    complaintProcess,
    tips,
    faqs,
    templatePhrases,
  } = companyData

  // Generate JSON-LD for SEO
  const jsonLd = generateJsonLd({ name, slug, description, industry, relevantLaws })

  // Determine if we have rich contact data
  const hasPhones = contacts.phones.length > 0
  const hasSocialMedia = Object.values(contacts.socialMedia).some(Boolean)
  const hasRichData = hasPhones || hasSocialMedia || contacts.addresses.length > 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ComplainCompanyTracker
        companyName={name}
        companySlug={slug}
        industry={industry}
        hasStats={stats.totalCases > 0}
      />
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-forest-100 bg-gradient-to-b from-peach-50/30 to-background">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-5xl mx-auto">
              {/* Breadcrumb */}
              <nav className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <span aria-hidden="true">/</span>
                <Link href="/complain" className="hover:text-foreground transition-colors">Companies</Link>
                <span aria-hidden="true">/</span>
                <span className="text-foreground" aria-current="page">{name}</span>
              </nav>

              {/* Company Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 text-center sm:text-left">
                <CompanyLogo
                  companyName={name}
                  domain={domain}
                  size={80}
                  className="rounded-xl border border-border shadow-sm shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap mb-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-display">
                      Complain to {name}
                    </h1>
                    {industry && (
                      <Badge variant="outline">
                        <Icon icon={Building01Icon} size={12} className="mr-1" />
                        {industry}
                      </Badge>
                    )}
                  </div>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                    {description || `Complete guide to filing an effective complaint against ${name}. Contact details, your rights, and escalation options.`}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              {stats.totalCases > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {stats.successRate !== null && (
                    <div className="p-3 rounded-lg bg-white border border-forest-100">
                      <div className="flex items-center gap-2 text-forest-600 mb-1">
                        <Icon icon={AnalyticsUpIcon} size={16} />
                        <span className="text-xs font-medium uppercase tracking-wide">Success Rate</span>
                      </div>
                      <p className="text-xl font-bold">{stats.successRate}%</p>
                    </div>
                  )}
                  {stats.avgResponseDays !== null && (
                    <div className="p-3 rounded-lg bg-white border border-forest-100">
                      <div className="flex items-center gap-2 text-forest-600 mb-1">
                        <Icon icon={Clock01Icon} size={16} />
                        <span className="text-xs font-medium uppercase tracking-wide">Avg Response</span>
                      </div>
                      <p className="text-xl font-bold">{stats.avgResponseDays} days</p>
                    </div>
                  )}
                  <div className="p-3 rounded-lg bg-white border border-forest-100">
                    <div className="flex items-center gap-2 text-forest-600 mb-1">
                      <Icon icon={UserGroupIcon} size={16} />
                      <span className="text-xs font-medium uppercase tracking-wide">Cases Filed</span>
                    </div>
                    <p className="text-xl font-bold">{stats.totalCases.toLocaleString()}</p>
                  </div>
                  {stats.avgPayout !== null && (
                    <div className="p-3 rounded-lg bg-white border border-forest-100">
                      <div className="flex items-center gap-2 text-forest-600 mb-1">
                        <Icon icon={FavouriteIcon} size={16} />
                        <span className="text-xs font-medium uppercase tracking-wide">Avg Payout</span>
                      </div>
                      <p className="text-xl font-bold">£{stats.avgPayout}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-forest-50 border border-forest-100 mb-6 text-center text-sm text-muted-foreground">
                  Be the first to file a complaint against {name} and help build our community data.
                </div>
              )}

              {/* Quick Actions Bar */}
              <QuickActionsBar
                companyName={name}
                emails={contacts.emails}
                phones={contacts.phones}
                socialMedia={contacts.socialMedia}
                liveChat={contacts.liveChat}
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-12">
                  {/* Complaint Process Timeline */}
                  <ComplaintProcessTimeline
                    steps={complaintProcess}
                    companyName={name}
                  />

                  {/* Common Issues */}
                  <div>
                    <h2 className="text-xl font-bold mb-4 font-display">
                      Common {name} Complaints
                    </h2>
                    <div className="grid gap-3">
                      {commonIssues.map((issue, i) => (
                        <TrackedIssueLink
                          key={i}
                          companyName={name}
                          issue={issue}
                          index={i}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Your Rights */}
                  <div>
                    <h2 className="text-xl font-bold mb-4 font-display flex items-center gap-2">
                      <Icon icon={JusticeScale01Icon} size={20} className="text-lavender-500" />
                      Your Legal Rights
                    </h2>
                    <div className="space-y-3">
                      {relevantLaws.map((law, i) => (
                        <div key={i} className="p-4 rounded-lg bg-lavender-50 border border-lavender-200">
                          <h3 className="font-semibold text-lavender-800">{law.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{law.description}</p>
                          {law.sections && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {law.sections.map((section, j) => (
                                <Badge key={j} variant="outline" className="text-xs">
                                  {section}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h2 className="text-xl font-bold mb-4 font-display">
                      Tips for {name} Complaints
                    </h2>
                    <div className="bg-forest-50 rounded-lg p-5 border border-forest-100">
                      <ul className="space-y-3">
                        {tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Icon icon={CheckmarkCircle01Icon} size={18} className="text-forest-500 mt-0.5 shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Escalation Pathway */}
                  <EscalationPathway
                    companyName={name}
                    industry={industry || "retail"}
                    ombudsman={regulation.ombudsman}
                    regulator={regulation.regulator}
                    adr={regulation.adr}
                    complaintDeadline={regulation.complaintDeadline}
                    escalationDeadline={regulation.escalationDeadline}
                  />

                  {/* FAQ Section */}
                  {faqs.length > 0 && (
                    <FAQAccordion faqs={faqs} companyName={name} />
                  )}

                  {/* Template Phrases */}
                  {templatePhrases.length > 0 && (
                    <TemplatePhraseSection phrases={templatePhrases} companyName={name} />
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Contact Hub */}
                  <div className="sticky top-24">
                    <ContactHub
                      emails={contacts.emails}
                      phones={contacts.phones}
                      addresses={contacts.addresses}
                      socialMedia={contacts.socialMedia}
                      executives={contacts.executives}
                      openingHours={contacts.openingHours}
                      liveChat={contacts.liveChat}
                    />

                    {/* CTA Card */}
                    <div className="mt-6 rounded-xl border-2 border-coral-300 bg-gradient-to-br from-coral-50 to-white p-5">
                      <h3 className="font-semibold mb-2">Ready to Fight Back?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create a professional, legally-backed complaint letter in minutes using AI.
                      </p>
                      <TrackedStartComplaintButton
                        companyName={name}
                        variant="sidebar"
                        location="sidebar"
                      />
                      <p className="text-xs text-center text-muted-foreground mt-3">
                        Free to start • No credit card required
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-12 md:py-16 bg-forest-500">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-display">
              Don&apos;t Let {name} Ignore You
            </h2>
            <p className="text-forest-100 mb-6 max-w-lg mx-auto">
              Join thousands of UK consumers who&apos;ve successfully fought back and won. Our AI-powered platform helps you create effective complaints that get results.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="coral" asChild>
                <Link href={`/new?company=${encodeURIComponent(name)}`}>
                  Start My Complaint
                  <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <Link href="/auth/sign-up">
                  Create Free Account
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-6 border-t border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto">
              <strong>Disclaimer:</strong> NoReply is an independent consumer advocacy platform. We are not affiliated with, endorsed by, or connected to {name} or any companies listed on this site. Contact information is sourced from publicly available sources and may change. Statistics shown are based solely on cases filed through our platform. This page is for informational purposes only and does not constitute legal advice. For complex legal matters, please consult a qualified solicitor.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
