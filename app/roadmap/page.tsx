import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Icon } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { FeatureRequestsSection } from "@/components/feature-requests-section"
import { getFeatureRequests, getUserVotes } from "@/lib/actions/feature-requests"
import { createClient } from "@/lib/supabase/server"
import {
  CheckmarkCircle01Icon,
  Clock01Icon,
  Rocket01Icon,
  Calendar01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Mail01Icon,
  FileSearchIcon,
  AlertCircleIcon,
  LegalDocument01Icon,
  CreditCardIcon,
  Globe02Icon,
  AnalyticsUpIcon,
  Notification01Icon,
  UserMultipleIcon,
  ApiIcon,
  PaintBrushIcon,
  Settings01Icon,
  LanguageSkillIcon,
  CloudDownloadIcon,
  LockPasswordIcon,
  Delete01Icon,
  Share01Icon,
  Clock02Icon,
  FileExportIcon,
  Building02Icon,
  SmartPhoneIcon,
} from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"

export const metadata: Metadata = {
  title: "Product Roadmap – See What's Coming Next",
  description: "See what's coming next to NoReply. Our public product roadmap shows planned features, improvements, and enhancements. Vote on features you want to see built.",
  keywords: [
    "NoReply roadmap",
    "upcoming features",
    "product updates",
    "consumer tools roadmap",
    "feature requests",
  ],
  openGraph: {
    title: "Product Roadmap | NoReply",
    description: "See what's coming next to NoReply. Vote on features you want to see built.",
    type: "website",
  },
}

type Status = "completed" | "in-progress" | "planned" | "considering"
type Priority = "critical" | "high" | "medium" | "low"
type Effort = "small" | "medium" | "large"

interface RoadmapItem {
  title: string
  description: string
  status: Status
  priority: Priority
  effort: Effort
  category: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const statusConfig: Record<Status, { label: string; bgColor: string; textColor: string }> = {
  completed: { label: "Completed", bgColor: "bg-forest-500", textColor: "text-white" },
  "in-progress": { label: "In Progress", bgColor: "bg-coral", textColor: "text-white" },
  planned: { label: "Planned", bgColor: "bg-lavender-500", textColor: "text-white" },
  considering: { label: "Considering", bgColor: "bg-stone", textColor: "text-white" },
}

const priorityConfig: Record<Priority, { label: string; dotColor: string }> = {
  critical: { label: "Critical", dotColor: "bg-red-500" },
  high: { label: "High", dotColor: "bg-coral" },
  medium: { label: "Medium", dotColor: "bg-lavender-500" },
  low: { label: "Low", dotColor: "bg-stone" },
}

const effortLabels: Record<Effort, string> = {
  small: "Quick Win",
  medium: "Medium Effort",
  large: "Major Project",
}

// Roadmap items ordered by priority and ease of implementation
const roadmapItems: RoadmapItem[] = [
  // ========== COMPLETED ==========
  {
    title: "Voice & Text Input",
    description: "Describe your issue naturally via voice recording or text. Our AI structures it into a professional complaint.",
    status: "completed",
    priority: "critical",
    effort: "medium",
    category: "Core Features",
    icon: Rocket01Icon,
  },
  {
    title: "Evidence Upload & Analysis",
    description: "Upload receipts, screenshots, and documents. AI analyzes each piece of evidence and extracts key details.",
    status: "completed",
    priority: "critical",
    effort: "large",
    category: "Core Features",
    icon: FileSearchIcon,
  },
  {
    title: "Company Intelligence",
    description: "AI-powered research finds company contact details, executive contacts, complaint patterns, and response rates.",
    status: "completed",
    priority: "critical",
    effort: "large",
    category: "Core Features",
    icon: Building02Icon,
  },
  {
    title: "Terms & Conditions Analysis",
    description: "AI-powered analysis of company T&Cs to find loopholes, unfair terms, and what the company might use against you.",
    status: "completed",
    priority: "critical",
    effort: "medium",
    category: "Core Features",
    icon: FileSearchIcon,
  },
  {
    title: "Free Consumer Tools",
    description: "10 free tools including Rights Checker, Flight Compensation Calculator, Section 75 Checker, and more.",
    status: "completed",
    priority: "critical",
    effort: "large",
    category: "Free Tools",
    icon: CheckmarkCircle01Icon,
  },
  {
    title: "PDF Letter Export",
    description: "Export generated letters as professionally formatted PDF documents ready to print or email.",
    status: "completed",
    priority: "critical",
    effort: "small",
    category: "Core Features",
    icon: FileExportIcon,
  },
  {
    title: "Draft Auto-Save",
    description: "Auto-save progress in the case creation wizard so you don't lose work if you close the browser.",
    status: "completed",
    priority: "critical",
    effort: "medium",
    category: "UX Improvements",
    icon: Clock02Icon,
  },
  {
    title: "Letter Before Action",
    description: "Generate legally-compliant Letter Before Action (LBA) as the final step before court proceedings.",
    status: "completed",
    priority: "critical",
    effort: "medium",
    category: "Letter Types",
    icon: LegalDocument01Icon,
  },
  {
    title: "Follow-up Letters",
    description: "Generate follow-up letters when companies don't respond within 14 days.",
    status: "completed",
    priority: "high",
    effort: "small",
    category: "Letter Types",
    icon: Mail01Icon,
  },
  {
    title: "Escalation Letters",
    description: "Generate letters to ombudsmen and regulatory bodies when companies fail to resolve issues.",
    status: "completed",
    priority: "high",
    effort: "small",
    category: "Letter Types",
    icon: AlertCircleIcon,
  },
  {
    title: "Section 75 & Chargeback Claims",
    description: "Generate specific letters for credit card Section 75 claims and debit card chargebacks.",
    status: "completed",
    priority: "high",
    effort: "medium",
    category: "Letter Types",
    icon: CreditCardIcon,
  },
  {
    title: "AI Case Assistant",
    description: "Chat with AI to get help with your case, understand your rights, and get advice on next steps.",
    status: "completed",
    priority: "high",
    effort: "medium",
    category: "Core Features",
    icon: CheckmarkCircle01Icon,
  },
  {
    title: "GDPR Data Export",
    description: "Export all your case data, evidence metadata, and messages as JSON for data portability.",
    status: "completed",
    priority: "high",
    effort: "small",
    category: "Privacy & Security",
    icon: CloudDownloadIcon,
  },
  {
    title: "Account Deletion",
    description: "Permanently delete your account and all associated data (GDPR right to erasure).",
    status: "completed",
    priority: "high",
    effort: "small",
    category: "Privacy & Security",
    icon: Delete01Icon,
  },
  {
    title: "Password Change",
    description: "Change your account password from the settings page.",
    status: "completed",
    priority: "high",
    effort: "small",
    category: "Privacy & Security",
    icon: LockPasswordIcon,
  },

  // ========== IN PROGRESS ==========
  {
    title: "Deadline Reminder System",
    description: "Automated email reminders for 14-day response deadlines, follow-up dates, and escalation timelines.",
    status: "in-progress",
    priority: "critical",
    effort: "medium",
    category: "Core Features",
    icon: Notification01Icon,
  },

  // ========== PLANNED (HIGH PRIORITY) ==========
  {
    title: "Ombudsman Directory",
    description: "Built-in directory of UK ombudsmen and regulatory bodies with direct links to complaint forms.",
    status: "planned",
    priority: "high",
    effort: "small",
    category: "Escalation",
    icon: Building02Icon,
  },
  {
    title: "Small Claims Court Guidance",
    description: "Step-by-step guide to filing a claim through Money Claims Online (MCOL) when escalation fails.",
    status: "planned",
    priority: "high",
    effort: "medium",
    category: "Escalation",
    icon: LegalDocument01Icon,
  },
  {
    title: "Response Analysis",
    description: "AI analysis of company responses to identify if their offer meets legal requirements.",
    status: "planned",
    priority: "high",
    effort: "medium",
    category: "Core Features",
    icon: CheckmarkCircle01Icon,
  },
  {
    title: "Case Archiving",
    description: "Archive resolved cases to keep your dashboard clean while retaining records.",
    status: "planned",
    priority: "medium",
    effort: "small",
    category: "Case Management",
    icon: Settings01Icon,
  },
  {
    title: "Letter Version History",
    description: "Track multiple versions of generated letters and compare changes.",
    status: "planned",
    priority: "medium",
    effort: "small",
    category: "Case Management",
    icon: Clock01Icon,
  },
  {
    title: "Email Integration",
    description: "Send complaint letters directly from the platform via email.",
    status: "planned",
    priority: "medium",
    effort: "large",
    category: "Core Features",
    icon: Mail01Icon,
  },
  {
    title: "Scottish Law Support",
    description: "Specific guidance for Scottish consumer law nuances and different regulatory bodies.",
    status: "planned",
    priority: "medium",
    effort: "medium",
    category: "Legal Coverage",
    icon: Globe02Icon,
  },
  {
    title: "EU261 Flight Compensation",
    description: "Specialized workflow for flight delay/cancellation claims under EU261 regulation.",
    status: "planned",
    priority: "medium",
    effort: "medium",
    category: "Specialized Claims",
    icon: Globe02Icon,
  },
  {
    title: "Package Travel Claims",
    description: "Dedicated support for Package Travel Regulations claims (complex holiday complaints).",
    status: "planned",
    priority: "medium",
    effort: "medium",
    category: "Specialized Claims",
    icon: Globe02Icon,
  },
  {
    title: "BNPL Protection Guidance",
    description: "Guidance for Buy Now Pay Later disputes (Klarna, Clearpay) which have different protections than credit cards.",
    status: "planned",
    priority: "medium",
    effort: "small",
    category: "Payment Protection",
    icon: CreditCardIcon,
  },
  {
    title: "Two-Factor Authentication",
    description: "Add 2FA support for enhanced account security.",
    status: "planned",
    priority: "medium",
    effort: "medium",
    category: "Privacy & Security",
    icon: KnightShieldIcon,
  },
  {
    title: "Success Rate Analytics",
    description: "View resolution statistics by company - \"85% of British Airways cases resolved\".",
    status: "planned",
    priority: "medium",
    effort: "large",
    category: "Analytics",
    icon: AnalyticsUpIcon,
  },
  {
    title: "Social Media Drafts",
    description: "Generate Twitter/X complaint threads and other social media posts for public escalation.",
    status: "planned",
    priority: "medium",
    effort: "small",
    category: "Escalation",
    icon: Share01Icon,
  },

  // ========== CONSIDERING ==========
  {
    title: "Mobile App",
    description: "Native iOS and Android apps for managing cases on the go.",
    status: "considering",
    priority: "medium",
    effort: "large",
    category: "Platform",
    icon: SmartPhoneIcon,
  },
  {
    title: "Multi-Language Support",
    description: "Support for multiple languages to serve the UK's diverse population.",
    status: "considering",
    priority: "low",
    effort: "large",
    category: "Accessibility",
    icon: LanguageSkillIcon,
  },
  {
    title: "Team/Family Accounts",
    description: "Share cases with family members or manage cases on behalf of others.",
    status: "considering",
    priority: "low",
    effort: "large",
    category: "Platform",
    icon: UserMultipleIcon,
  },
  {
    title: "API Access",
    description: "Public API for integrating NoReply into other workflows and applications.",
    status: "considering",
    priority: "low",
    effort: "large",
    category: "Platform",
    icon: ApiIcon,
  },
  {
    title: "White-Label Solution",
    description: "White-label version for consumer advocacy agencies and legal firms.",
    status: "considering",
    priority: "low",
    effort: "large",
    category: "Business",
    icon: PaintBrushIcon,
  },
  {
    title: "B2B Complaint Handling",
    description: "Support for business-to-business complaints (different legal protections apply).",
    status: "considering",
    priority: "low",
    effort: "medium",
    category: "Legal Coverage",
    icon: Building02Icon,
  },
]

// Group items by status
const groupedItems = {
  completed: roadmapItems.filter(item => item.status === "completed"),
  "in-progress": roadmapItems.filter(item => item.status === "in-progress"),
  planned: roadmapItems.filter(item => item.status === "planned"),
  considering: roadmapItems.filter(item => item.status === "considering"),
}

function SectionNumber({ current, total }: { current: string; total: string }) {
  return (
    <div className="text-xs text-forest-400 font-mono tracking-widest mb-8">
      [ {current} / {total} ]
    </div>
  )
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const ItemIcon = item.icon

  return (
    <div className="p-6 border border-forest-100 rounded-md hover:border-forest-200 transition-colors bg-white group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-forest-50 border border-forest-100 group-hover:border-forest-200 transition-colors">
          <Icon icon={ItemIcon} size={20} color="currentColor" className="text-lavender-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${priorityConfig[item.priority].dotColor}`} />
          <span className="text-xs text-muted-foreground">{priorityConfig[item.priority].label}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <h3 className="text-base font-semibold text-foreground font-display">{item.title}</h3>
          <p className="text-xs text-forest-400">{item.category}</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-forest-50">
        <span className="text-xs text-forest-400 font-mono">{effortLabels[item.effort]}</span>
      </div>
    </div>
  )
}

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ highlight?: string }>
}) {
  // Fetch feature requests
  const featureRequests = await getFeatureRequests({
    status: ["approved", "planned", "in_progress", "shipped"],
    sortBy: "votes",
  })

  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // Get user's votes if authenticated
  const userVotes = isAuthenticated ? await getUserVotes() : []

  // Get highlighted request ID from URL
  const params = await searchParams
  const highlightedId = params.highlight

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-forest-100">
          <div className="container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16 py-12 md:py-16 lg:py-20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <Icon icon={ArrowLeft01Icon} size={16} />
              Back to NoReply
            </Link>

            <div className="max-w-2xl">
              <h1 className="text-foreground font-hero mb-6" style={{ fontSize: 'clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem)' }}>
                What We're<br />
                <span className="text-peach-500">Building Next</span>
              </h1>

              <p className="text-muted-foreground max-w-lg leading-relaxed" style={{ fontSize: 'clamp(1.125rem, 1rem + 0.625vw, 1.375rem)' }}>
                Our roadmap is driven by user feedback and our mission to make consumer rights accessible to everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="border-b border-forest-100 bg-forest-50/30">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-forest-600 font-display">{groupedItems.completed.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Shipped</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-coral font-display">{groupedItems["in-progress"].length}</p>
                <p className="text-sm text-muted-foreground mt-1">Building</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-lavender-600 font-display">{groupedItems.planned.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Planned</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-stone font-display">{groupedItems.considering.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Exploring</p>
              </div>
            </div>
          </div>
        </section>

        {/* In Progress Section */}
        {groupedItems["in-progress"].length > 0 && (
          <section className="py-16 md:py-24 border-b border-forest-100">
            <div className="container mx-auto px-4">
              <SectionNumber current="01" total="04" />

              <div className="max-w-2xl mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig["in-progress"].bgColor} ${statusConfig["in-progress"].textColor}`}>
                    <Icon icon={Rocket01Icon} size={16} />
                    In Progress
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground font-display">
                  Currently Building
                </h2>
                <p className="text-lg text-muted-foreground">
                  Features actively being developed right now.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {groupedItems["in-progress"].map((item, idx) => (
                  <RoadmapCard key={idx} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Planned Section */}
        {groupedItems.planned.length > 0 && (
          <section className="py-16 md:py-24 border-b border-forest-100 bg-dots-subtle">
            <div className="container mx-auto px-4">
              <SectionNumber current="02" total="04" />

              <div className="max-w-2xl mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.planned.bgColor} ${statusConfig.planned.textColor}`}>
                    <Icon icon={Calendar01Icon} size={16} />
                    Planned
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground font-display">
                  Coming Soon
                </h2>
                <p className="text-lg text-muted-foreground">
                  Features on our roadmap, ordered by priority.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {groupedItems.planned.map((item, idx) => (
                  <RoadmapCard key={idx} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Considering Section */}
        {groupedItems.considering.length > 0 && (
          <section className="py-16 md:py-24 border-b border-forest-100">
            <div className="container mx-auto px-4">
              <SectionNumber current="03" total="04" />

              <div className="max-w-2xl mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.considering.bgColor} ${statusConfig.considering.textColor}`}>
                    <Icon icon={Clock01Icon} size={16} />
                    Exploring
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground font-display">
                  Under Consideration
                </h2>
                <p className="text-lg text-muted-foreground">
                  Ideas we're evaluating based on user feedback.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {groupedItems.considering.map((item, idx) => (
                  <RoadmapCard key={idx} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Completed Section */}
        {groupedItems.completed.length > 0 && (
          <section className="py-16 md:py-24 border-b border-forest-100 bg-forest-50/30">
            <div className="container mx-auto px-4">
              <SectionNumber current="04" total="04" />

              <div className="max-w-2xl mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.completed.bgColor} ${statusConfig.completed.textColor}`}>
                    <Icon icon={CheckmarkCircle01Icon} size={16} />
                    Shipped
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground font-display">
                  Recently Completed
                </h2>
                <p className="text-lg text-muted-foreground">
                  Features we've shipped and you can use today.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {groupedItems.completed.map((item, idx) => (
                  <RoadmapCard key={idx} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Community Feature Requests */}
        <section id="feature-requests" className="py-16 md:py-24 border-b border-forest-100">
          <div className="container mx-auto px-4">
            <SectionNumber current="05" total="05" />

            <div className="max-w-2xl mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-peach-500 text-white">
                  <Icon icon={CheckmarkCircle01Icon} size={16} />
                  Community Ideas
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground font-display">
                Feature Requests
              </h2>
              <p className="text-lg text-muted-foreground">
                Vote on features you want to see, or submit your own ideas. We build what you need.
              </p>
            </div>

            <FeatureRequestsSection
              requests={featureRequests}
              userVotes={userVotes}
              isAuthenticated={isAuthenticated}
              highlightedId={highlightedId}
            />
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 bg-forest-500 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-12 bg-forest-50/30"
            style={{
              borderRadius: "0 0 50% 50%",
              transform: "translateY(-50%)"
            }}
          />

          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-white mb-6 font-hero" style={{ fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem)' }}>
                Need Something Else?
              </h2>
              <p className="text-forest-100 mb-8" style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)' }}>
                Got feedback, questions, or partnership ideas? We'd love to hear from you.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-coral hover:bg-coral-light text-white rounded-md px-8 h-12 font-medium"
              >
                <a href="mailto:feedback@usenoreply.com?subject=NoReply Feedback" className="flex items-center">
                  <Icon icon={Mail01Icon} size={18} className="mr-2" />
                  Get in Touch
                  <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
