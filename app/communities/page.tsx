import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ExternalLink,
  Users,
  MessageSquare,
  Scale,
  Home,
  Wallet,
  Shield,
  ArrowRight,
  Sparkles
} from "lucide-react"

export const metadata: Metadata = {
  title: "Consumer Rights Communities – Reddit, Forums & Support Groups",
  description: "Find the best UK consumer rights communities on Reddit, forums, and more. Connect with others fighting for refunds, compensation, and fair treatment from companies.",
  keywords: [
    "consumer rights reddit",
    "UK consumer forums",
    "LegalAdviceUK",
    "money saving expert forum",
    "consumer help communities",
    "complaint support groups",
    "consumer advocacy groups UK",
  ],
  openGraph: {
    title: "Consumer Rights Communities | NoReply",
    description: "Find UK consumer rights communities on Reddit, forums, and more. Connect with others fighting for their rights.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Consumer Rights Communities | NoReply",
    description: "Find UK consumer rights communities on Reddit and forums.",
  },
}

interface Community {
  name: string
  description: string
  members: string
  url: string
  platform: "reddit" | "forum" | "official"
  icon: React.ReactNode
  tags: string[]
}

const redditCommunities: Community[] = [
  {
    name: "r/LegalAdviceUK",
    description: "The largest UK legal advice community. Get informal guidance on consumer disputes, contracts, and your legal rights from helpful community members.",
    members: "810k+",
    url: "https://reddit.com/r/LegalAdviceUK",
    platform: "reddit",
    icon: <Scale className="w-5 h-5" />,
    tags: ["Legal Advice", "Consumer Law", "Disputes"],
  },
  {
    name: "r/UKPersonalFinance",
    description: "Massive community for UK money matters. Covers debt advice, credit issues, bank disputes, and financial consumer rights.",
    members: "1.8M",
    url: "https://reddit.com/r/UKPersonalFinance",
    platform: "reddit",
    icon: <Wallet className="w-5 h-5" />,
    tags: ["Money", "Debt", "Banking"],
  },
  {
    name: "r/HousingUK",
    description: "Advice and discussion for UK renters, buyers, and homeowners. Great for tenant rights, deposit disputes, and landlord issues.",
    members: "200k+",
    url: "https://reddit.com/r/HousingUK",
    platform: "reddit",
    icon: <Home className="w-5 h-5" />,
    tags: ["Renting", "Deposits", "Landlords"],
  },
  {
    name: "r/DWPhelp",
    description: "Support for navigating the UK benefits system. Covers Universal Credit, PIP, ESA, and dealing with DWP disputes.",
    members: "8.6k",
    url: "https://reddit.com/r/DWPhelp",
    platform: "reddit",
    icon: <Shield className="w-5 h-5" />,
    tags: ["Benefits", "DWP", "Support"],
  },
  {
    name: "r/LandlordLove",
    description: "Tenant advocacy community sharing experiences and advice on dealing with problematic landlords and housing issues.",
    members: "76k+",
    url: "https://reddit.com/r/LandlordLove",
    platform: "reddit",
    icon: <Home className="w-5 h-5" />,
    tags: ["Tenants", "Advocacy", "Housing"],
  },
]

const forumCommunities: Community[] = [
  {
    name: "MoneySavingExpert Forum",
    description: "The UK's largest consumer forum. Covers everything from reclaiming bank charges to energy complaints, with dedicated consumer rights sections.",
    members: "1.3M+",
    url: "https://forums.moneysavingexpert.com/categories/consumer-rights",
    platform: "forum",
    icon: <Wallet className="w-5 h-5" />,
    tags: ["Money", "Reclaims", "Consumer Rights"],
  },
  {
    name: "LegalBeagles",
    description: "Independent consumer law forum running since 2007. Covers debt, contracts, and consumer disputes with volunteer legal advisors.",
    members: "140k+",
    url: "https://legalbeagles.info/forums/",
    platform: "forum",
    icon: <Scale className="w-5 h-5" />,
    tags: ["Legal", "Debt", "Consumer Law"],
  },
  {
    name: "Consumer Action Group",
    description: "Free consumer forum covering bank charges, parking tickets, debt collection, and more. One of the original UK consumer rights communities.",
    members: "Est. 2006",
    url: "https://www.consumeractiongroup.co.uk/forums/",
    platform: "forum",
    icon: <MessageSquare className="w-5 h-5" />,
    tags: ["Bank Charges", "Parking", "Debt"],
  },
  {
    name: "What Consumer Forum",
    description: "Consumer advice forum covering a wide range of UK consumer rights issues with community support and expert input.",
    members: "Active",
    url: "https://whatconsumer.co.uk/forum/",
    platform: "forum",
    icon: <MessageSquare className="w-5 h-5" />,
    tags: ["Advice", "Rights", "Support"],
  },
]

const officialResources: Community[] = [
  {
    name: "Citizens Advice",
    description: "Free, independent, and confidential advice on consumer rights. Can refer complaints to Trading Standards for investigation.",
    members: "Official",
    url: "https://www.citizensadvice.org.uk/consumer/",
    platform: "official",
    icon: <Shield className="w-5 h-5" />,
    tags: ["Official", "Free Advice", "Trading Standards"],
  },
  {
    name: "Which? Consumer Rights",
    description: "Trusted consumer guides with template letters and step-by-step advice for common complaints and disputes.",
    members: "Official",
    url: "https://www.which.co.uk/consumer-rights",
    platform: "official",
    icon: <Scale className="w-5 h-5" />,
    tags: ["Guides", "Templates", "Trusted"],
  },
  {
    name: "Financial Ombudsman Service",
    description: "Free dispute resolution for complaints about banks, insurers, and financial companies. Decisions are binding on firms.",
    members: "Official",
    url: "https://www.financial-ombudsman.org.uk/consumers",
    platform: "official",
    icon: <Wallet className="w-5 h-5" />,
    tags: ["Banking", "Insurance", "Free"],
  },
  {
    name: "UK International Consumer Centre",
    description: "Free help with cross-border consumer disputes between UK consumers and businesses in other countries.",
    members: "Official",
    url: "https://www.ukecc.net/",
    platform: "official",
    icon: <Shield className="w-5 h-5" />,
    tags: ["International", "Cross-Border", "EU"],
  },
]

function CommunityCard({ community }: { community: Community }) {
  const platformColors = {
    reddit: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    forum: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    official: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  }

  return (
    <a
      href={community.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border bg-card hover:border-coral/50 hover:shadow-lg transition-all duration-200 active:scale-[0.98] touch-manipulation"
    >
      {/* Header with icon, name, and external link */}
      <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-lavender-100 dark:bg-lavender-950 flex items-center justify-center text-lavender-600 shrink-0">
            {community.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-coral transition-colors text-sm sm:text-base truncate">
              {community.name}
            </h3>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{community.members} members</span>
            </div>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-coral transition-colors shrink-0 mt-0.5" />
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-3 sm:line-clamp-none">
        {community.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {community.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className={`text-[10px] sm:text-xs px-2 py-0.5 ${platformColors[community.platform]}`}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </a>
  )
}

function SectionHeader({
  icon,
  iconBgClass,
  title,
  subtitle
}: {
  icon: React.ReactNode
  iconBgClass: string
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-start sm:items-center gap-3 mb-6 sm:mb-8">
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${iconBgClass} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-display">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}

export default function CommunitiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-10 sm:py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                Community Directory
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 font-hero">
                You're Not Alone in This
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed px-2">
                Thousands of people are fighting for their consumer rights every day.
                Join these communities to get advice, share experiences, and learn from others
                who&apos;ve been through similar situations.
              </p>
            </div>
          </div>
        </section>

        {/* Reddit Communities */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4">
            <SectionHeader
              icon={
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              }
              iconBgClass="bg-orange-100 dark:bg-orange-950"
              title="Reddit Communities"
              subtitle="Active discussions and real-time advice"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {redditCommunities.map((community) => (
                <CommunityCard key={community.name} community={community} />
              ))}
            </div>
          </div>
        </section>

        {/* Forums */}
        <section className="py-8 sm:py-12 md:py-16 bg-lavender-50 dark:bg-lavender-950/30 border-y border-lavender-200/50 dark:border-lavender-800/30">
          <div className="container mx-auto px-4">
            <SectionHeader
              icon={<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
              iconBgClass="bg-blue-100 dark:bg-blue-950"
              title="Consumer Forums"
              subtitle="In-depth discussions and experienced advisors"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {forumCommunities.map((community) => (
                <CommunityCard key={community.name} community={community} />
              ))}
            </div>
          </div>
        </section>

        {/* Official Resources */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4">
            <SectionHeader
              icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />}
              iconBgClass="bg-green-100 dark:bg-green-950"
              title="Official Resources"
              subtitle="Government-backed and trusted organisations"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {officialResources.map((community) => (
                <CommunityCard key={community.name} community={community} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-24 bg-forest-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 text-xs sm:text-sm mb-4 sm:mb-6">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Ready to take action?</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-hero px-2">
                Communities Are Great for Advice.
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                NoReply Gets You Results.
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-forest-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                While communities help you understand your rights, NoReply generates
                professional, legally-backed complaint letters that get companies to respond.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                <Button
                  asChild
                  size="lg"
                  variant="coral"
                  className="rounded-full h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto"
                >
                  <Link href="/new">
                    Start Your Free Complaint
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-full h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base bg-white/10 text-white hover:bg-white hover:text-forest-700 w-full sm:w-auto"
                >
                  <Link href="/tools">
                    Explore Free Tools
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
