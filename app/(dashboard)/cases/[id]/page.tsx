import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CaseStatus } from "@/components/case-status"
import { ConfidenceScore } from "@/components/confidence-score"
import { CaseTimeline } from "@/components/case-detail/case-timeline"
import { CaseEvidence } from "@/components/case-detail/case-evidence"
import { CaseLetters } from "@/components/case-detail/case-letters"
import { CaseResponses } from "@/components/case-detail/case-responses"
import { ContactEmailsCard } from "@/components/case-detail/contact-emails-card"
import { EmailProvider } from "@/components/case-detail/email-context"
import { CaseTabsProvider } from "@/components/case-detail/case-tabs-context"
import { CaseControlledTabs, CaseTabsList, AnimatedTabContent } from "@/components/case-detail/case-controlled-tabs"
import { GenerateLetterCTA } from "@/components/case-detail/generate-letter-cta"
import { CompanyLogo } from "@/components/company-logo"
import { CaseDetailWrapper, CompactCaseHeader } from "@/components/case-detail/case-detail-client"
import { CompanyProfileCard } from "@/components/case-detail/company-profile-card"
import { EditableComplaint } from "@/components/case-detail/editable-complaint"
import { DeleteCaseDialog } from "@/components/case-detail/delete-case-dialog"
import { ResolutionTracker } from "@/components/case-detail/resolution-tracker"
import { Icon } from "@/lib/icons"
import {
  ArrowLeft01Icon,
  Download01Icon,
  Share01Icon,
  MoreHorizontalIcon,
  JusticeScale01Icon,
  Building01Icon,
  File01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import Link from "next/link"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCase } from "@/lib/actions/cases"
import { getLettersForCase } from "@/lib/actions/letters"
import { getEvidence } from "@/lib/actions/evidence"
import { notFound } from "next/navigation"
import { extractDomain } from "@/lib/domain"
import { HeroImage } from "@/components/case-detail/hero-image"

// Get OG image URL from domain
function getOGImageUrl(domain: string | null): string | null {
  if (!domain) return null
  return `https://${domain}/og-image.png`
}

// Get fallback image
function getFallbackImage(companyName: string): string {
  const cleanName = companyName.toLowerCase().replace(/[^a-z0-9]/g, "").trim()
  let hash = 0
  for (let i = 0; i < cleanName.length; i++) {
    hash = ((hash << 5) - hash) + cleanName.charCodeAt(i)
    hash = hash & hash
  }
  const seed = Math.abs(hash) % 1000
  return `https://picsum.photos/seed/${seed}/1200/400`
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [caseData, letters, evidence] = await Promise.all([
    getCase(id),
    getLettersForCase(id),
    getEvidence(id),
  ])

  if (!caseData) {
    notFound()
  }

  const domain = caseData.company_domain || extractDomain(caseData.company_name)
  const ogImageUrl = getOGImageUrl(domain)
  const fallbackImageUrl = getFallbackImage(caseData.company_name)
  const currencySymbol = caseData.currency === "GBP" ? "£" : caseData.currency === "USD" ? "$" : "€"

  const legalBasis = caseData.legal_basis || []
  const companyIntel = caseData.company_intel

  // Build timeline from actual case data
  const timeline: { date: Date; event: string; type: "info" | "warning" | "success" | "error" }[] = []
  
  // Case created event
  if (caseData.created_at) {
    timeline.push({
      date: new Date(caseData.created_at),
      event: "Case created",
      type: "info",
    })
  }
  
  // Analysis completed (if confidence score exists)
  if (caseData.confidence_score !== null && caseData.status !== "draft") {
    // Estimate analysis time as shortly after creation
    const analysisDate = new Date(caseData.created_at)
    analysisDate.setMinutes(analysisDate.getMinutes() + 1)
    timeline.push({
      date: analysisDate,
      event: `Analysis complete (${caseData.confidence_score}% confidence)`,
      type: "success",
    })
  }
  
  // Letter generated (if exists)
  if (caseData.generated_letter) {
    const letterDate = new Date(caseData.updated_at || caseData.created_at)
    timeline.push({
      date: letterDate,
      event: "Complaint letter generated",
      type: "success",
    })
  }
  
  // Status-based events
  if (caseData.status === "sent") {
    timeline.push({
      date: new Date(caseData.updated_at || caseData.created_at),
      event: "Complaint sent to company",
      type: "info",
    })
  }
  
  // Resolved event
  if (caseData.status === "resolved" && caseData.resolved_at) {
    timeline.push({
      date: new Date(caseData.resolved_at),
      event: caseData.resolution_outcome 
        ? `🎉 Case resolved: ${caseData.resolution_outcome}`
        : "🎉 Case resolved",
      type: "success",
    })
  }

  return (
    <CaseTabsProvider>
    <div className="min-h-screen bg-background">
      <CaseDetailWrapper
        caseData={caseData}
        compactHeader={<CompactCaseHeader caseData={caseData} />}
        mainHeader={
          <>
            {/* Compact Hero */}
            <div className="relative w-full h-48 overflow-hidden">
              <HeroImage
                ogImageUrl={ogImageUrl}
                fallbackImageUrl={fallbackImageUrl}
                companyName={caseData.company_name}
                domain={domain}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-white pointer-events-none" />
              
              {/* Back button overlay */}
              <div className="absolute top-4 left-4">
                <Button variant="secondary" size="sm" asChild className="bg-white/90 hover:bg-white">
                  <Link href="/cases">
                    <Icon icon={ArrowLeft01Icon} size={16} className="mr-2" />
                    Cases
                  </Link>
                </Button>
              </div>

              {/* Actions overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                  <Icon icon={Download01Icon} size={16} className="mr-1.5" />
                  Export
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white h-9 w-9">
                      <Icon icon={MoreHorizontalIcon} size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/new?draft=${id}`}>Edit Case</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DeleteCaseDialog caseId={id} companyName={caseData.company_name} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Company Header - within main header */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 mb-6">
              <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-start sm:items-center gap-4">
                  <CompanyLogo 
                    companyName={caseData.company_name} 
                    domain={caseData.company_domain} 
                    size={48}
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-bold">{caseData.company_name}</h1>
                      <CaseStatus status={caseData.status} resolutionOutcome={caseData.resolution_outcome} />
                    </div>
                    {caseData.title && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{caseData.title}</p>
                    )}
                  </div>
                </div>
                
                {/* Key metrics row */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-4 pt-4 border-t border-border">
                  {caseData.confidence_score !== null && (
                    <ConfidenceScore score={caseData.confidence_score} size="sm" variant="subtle" />
                  )}
                  {caseData.purchase_amount && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-mono font-semibold">{currencySymbol}{caseData.purchase_amount.toFixed(0)}</span>
                    </div>
                  )}
                  {caseData.purchase_date && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{format(new Date(caseData.purchase_date), "MMM d, yyyy")}</span>
                    </div>
                  )}
                  {caseData.desired_outcome && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-muted-foreground">Seeking:</span>
                      <Badge variant="outline" className="capitalize">
                        {caseData.desired_outcome === "ai-suggested" 
                          ? "AI Suggested" 
                          : caseData.desired_outcome.replace(/-/g, " ")}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Additional details row */}
                {(caseData.payment_method || caseData.booking_platform || caseData.incident_country) && (
                  <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-3 pt-3 border-t border-border/50">
                    {caseData.payment_method && caseData.payment_method !== "none" && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="text-muted-foreground">Paid via:</span>
                        <span className="font-medium capitalize">{caseData.payment_method.replace(/-/g, " ")}</span>
                        {caseData.card_type && (
                          <span className="text-muted-foreground">({caseData.card_type})</span>
                        )}
                      </div>
                    )}
                    {caseData.booking_platform && caseData.booking_platform !== "none" && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="text-muted-foreground">Booked via:</span>
                        <span className="font-medium capitalize">{caseData.booking_platform.replace(/-/g, " ")}</span>
                      </div>
                    )}
                    {caseData.incident_country && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{caseData.incident_country}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Multiple desired outcomes */}
                {caseData.desired_outcomes && caseData.desired_outcomes.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <span className="text-sm text-muted-foreground mr-2">All desired outcomes:</span>
                    <div className="inline-flex flex-wrap gap-1.5 mt-1">
                      {caseData.desired_outcomes.map((outcome, i) => (
                        <Badge key={i} variant="secondary" className="capitalize text-xs">
                          {outcome === "ai-suggested" ? "AI Suggested" : outcome.replace(/-/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        }
      >
        {/* Main Content Area - wrapped by CaseDetailWrapper */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <EmailProvider
            initialEmails={companyIntel?.contactEmails || []}
            initialExecutives={companyIntel?.executiveContacts || []}
          >
          <CaseControlledTabs>
            <CaseTabsList />

          {/* Overview Tab */}
          <AnimatedTabContent value="overview">
            <div className="grid lg:grid-cols-5 gap-5">
              {/* Main Content - wider */}
              <div className="lg:col-span-3 space-y-5">
                {/* Complaint - Editable */}
                <EditableComplaint 
                  caseId={caseData.id} 
                  initialComplaint={caseData.complaint_text} 
                />

                {/* Issues + Legal */}
                <div className="space-y-5">
                  {/* Issues */}
                  {caseData.identified_issues && caseData.identified_issues.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
                        <Icon icon={CheckmarkCircle01Icon} size={18} className="text-forest-500" />
                        Issues Found
                      </h3>
                      <div className="space-y-2">
                        {caseData.identified_issues.map((issue, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <span className="w-5 h-5 rounded-full bg-forest-100 dark:bg-forest-900 text-forest-600 dark:text-forest-400 flex items-center justify-center shrink-0 text-xs font-medium">
                              {index + 1}
                            </span>
                            <span className="text-muted-foreground">{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Legal Basis */}
                  {legalBasis.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
                        <Icon icon={JusticeScale01Icon} size={18} className="text-lavender-500" />
                        Legal Basis
                        <Badge variant="outline" className="ml-auto text-xs">{legalBasis.length} rights</Badge>
                      </h3>
                      <div className="space-y-3">
                        {legalBasis.map((law, index) => (
                          <div key={index} className="text-sm p-3 rounded-lg bg-lavender-50 dark:bg-lavender-950/20 border border-lavender-200 dark:border-lavender-900">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="font-semibold">{law.law}</p>
                              {law.strength && (
                                <Badge variant="outline" className="text-xs capitalize shrink-0">{law.strength}</Badge>
                              )}
                            </div>
                            {law.section && (
                              <p className="text-xs text-lavender-600 dark:text-lavender-400 mb-1">{law.section}</p>
                            )}
                            {(law.summary || law.description) && (
                              <p className="text-xs text-muted-foreground">{law.summary || law.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Similar Complaints */}
                  {companyIntel?.similarComplaints && companyIntel.similarComplaints.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
                        <Icon icon={File01Icon} size={18} className="text-amber-500" />
                        Similar Complaints Found
                        <Badge variant="outline" className="ml-auto text-xs">{companyIntel.similarComplaints.length}</Badge>
                      </h3>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {companyIntel.similarComplaints.map((complaint, index) => (
                          <a 
                            key={index} 
                            href={complaint.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-950/30 transition-colors"
                          >
                            <p className="font-medium text-amber-800 dark:text-amber-300 line-clamp-1">{complaint.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{complaint.summary}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action */}
                  {companyIntel?.recommendedAction && (
                    <div className="rounded-xl border-2 border-peach-400 bg-gradient-to-br from-peach-50 to-peach-100/50 dark:from-peach-950/40 dark:to-peach-900/20 p-5">
                      <h3 className="text-base font-semibold flex items-center gap-2 mb-2">
                        <span className="text-lg">💡</span>
                        Recommended Action
                      </h3>
                      <p className="text-sm text-foreground">{companyIntel.recommendedAction}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar - narrower */}
              <div className="lg:col-span-2 space-y-5">
                {/* Resolution Tracker - show for sent cases */}
                {(caseData.status === "sent" || caseData.status === "resolved" || caseData.status === "ready") && (
                  <ResolutionTracker caseData={caseData} />
                )}

                {/* Continue Editing for drafts/analyzed cases */}
                {(caseData.status === "draft" || caseData.status === "analyzed") && (
                  <div className="rounded-xl border border-forest-200 dark:border-forest-800 bg-gradient-to-br from-forest-50 to-forest-100/50 dark:from-forest-950/30 dark:to-forest-900/20 p-5">
                    <h3 className="font-semibold mb-1">Continue Your Complaint</h3>
                    <p className="text-sm text-muted-foreground mb-3">Pick up where you left off</p>
                    <Button asChild className="w-full bg-forest-500 hover:bg-forest-600 text-white">
                      <Link href={`/new?draft=${caseData.id}`}>
                        Continue Editing
                      </Link>
                    </Button>
                  </div>
                )}

                {/* CTA Card */}
                <GenerateLetterCTA />

                {/* Contact Information */}
                <ContactEmailsCard 
                  emails={companyIntel?.contactEmails || []}
                  executiveContacts={companyIntel?.executiveContacts}
                  companyName={caseData.company_name}
                  companyDomain={extractDomain(caseData.company_name, caseData.company_domain)}
                />

                {/* Company Profile */}
                <CompanyProfileCard
                  companyName={caseData.company_name}
                  domain={domain}
                  companyIntel={companyIntel}
                />
              </div>
            </div>
          </AnimatedTabContent>

          {/* Letters Tab */}
          <AnimatedTabContent value="letters">
            <CaseLetters
              caseId={caseData.id}
              letters={letters}
              evidence={evidence}
              caseData={{
                companyName: caseData.company_name,
                complaintText: caseData.complaint_text,
                title: caseData.title || `Complaint against ${caseData.company_name}`,
                purchaseAmount: caseData.purchase_amount || 0,
                currency: currencySymbol,
                incidentDate: caseData.purchase_date ? new Date(caseData.purchase_date) : new Date(),
                desiredOutcome: caseData.desired_outcome || "full refund",
                issues: caseData.identified_issues || [],
                legalBasis: legalBasis.map(law => ({ 
                  law: law.law, 
                  section: law.section || law.description || "",
                  summary: law.summary || law.description,
                  strength: law.strength || law.relevance,
                })),
                compensation: { recommended: caseData.purchase_amount ? caseData.purchase_amount * 0.67 : 0 },
                contactEmails: companyIntel?.contactEmails || [],
                twitterHandle: companyIntel?.socialHandles?.twitter || null,
                incidentCountry: caseData.incident_country || undefined,
                userCountry: caseData.user_country || undefined,
                paymentMethod: caseData.payment_method || undefined,
              }} 
            />
          </AnimatedTabContent>

          {/* Evidence Tab */}
          <AnimatedTabContent value="evidence">
            <CaseEvidence
              caseId={caseData.id}
              initialEvidence={evidence}
              complaint={caseData.complaint_text}
              companyName={caseData.company_name}
            />
          </AnimatedTabContent>

          {/* Timeline Tab */}
          <AnimatedTabContent value="timeline">
            <CaseTimeline
              caseId={caseData.id}
              timeline={timeline}
              currentStatus={caseData.status}
            />
          </AnimatedTabContent>

          {/* Responses Tab */}
          <AnimatedTabContent value="responses">
            <CaseResponses caseData={caseData} evidence={evidence} />
          </AnimatedTabContent>
          </CaseControlledTabs>
          </EmailProvider>
        </div>
      </CaseDetailWrapper>
    </div>
    </CaseTabsProvider>
  )
}
