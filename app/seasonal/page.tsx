import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  GiftIcon,
  AirplaneTakeOff01Icon,
  ShoppingBag01Icon,
  Calendar01Icon,
  FavouriteIcon,
  Sun01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

export const metadata: Metadata = {
  title: "Seasonal Consumer Rights Guides | NoReply",
  description:
    "Know your consumer rights throughout the year. Holiday returns, summer flight delays, Black Friday issues, and more.",
}

const campaigns = [
  {
    slug: "christmas-returns",
    title: "Christmas Returns",
    description: "Know your rights for holiday gifts and purchases",
    icon: GiftIcon,
    color: "red",
    season: "December - January",
    highlight: "Extended return windows",
  },
  {
    slug: "summer-flights",
    title: "Summer Flight Delays",
    description: "Claim up to £520 for delays and cancellations",
    icon: AirplaneTakeOff01Icon,
    color: "sky",
    season: "June - September",
    highlight: "UK261 compensation",
  },
  {
    slug: "black-friday",
    title: "Black Friday Rights",
    description: "Sale items have the same rights as full-price",
    icon: ShoppingBag01Icon,
    color: "charcoal",
    season: "November",
    highlight: "Fake discount claims",
  },
]

const upcomingCampaigns = [
  {
    title: "Valentine's Day Bookings",
    description: "Restaurant and travel booking issues",
    icon: FavouriteIcon,
    season: "February",
  },
  {
    title: "Easter Travel",
    description: "Holiday and flight compensation",
    icon: Calendar01Icon,
    season: "March - April",
  },
  {
    title: "Summer Holidays",
    description: "Package holiday complaints",
    icon: Sun01Icon,
    season: "July - August",
  },
]

export default function SeasonalPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-forest-100">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Badge className="mb-4">Seasonal Guides</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display mb-4">
              Consumer Rights<br />
              <span className="text-peach-500">All Year Round</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Know your rights throughout the year with our seasonal guides. From Christmas returns to summer flight delays.
            </p>
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="py-16 md:py-20 border-b border-forest-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold font-display mb-8">Featured Guides</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Link
                  key={campaign.slug}
                  href={`/seasonal/${campaign.slug}`}
                  className="group p-6 rounded-xl border border-forest-100 hover:border-peach-300 hover:shadow-md transition-all bg-white"
                >
                  <div className={`h-12 w-12 rounded-lg bg-${campaign.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon icon={campaign.icon} size={24} className={`text-${campaign.color}-600`} />
                  </div>
                  <Badge variant="outline" className="mb-2 text-xs">
                    {campaign.season}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-2">{campaign.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                  <div className="flex items-center gap-2 text-sm text-peach-600 font-medium">
                    <span>{campaign.highlight}</span>
                    <Icon icon={ArrowRight01Icon} size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 md:py-20 bg-forest-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold font-display mb-8">Coming Soon</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {upcomingCampaigns.map((campaign, i) => (
                <div key={i} className="p-6 rounded-xl border border-forest-200 bg-white/50">
                  <div className="h-12 w-12 rounded-lg bg-forest-100 flex items-center justify-center mb-4">
                    <Icon icon={campaign.icon} size={24} className="text-forest-600" />
                  </div>
                  <Badge variant="outline" className="mb-2 text-xs">
                    {campaign.season}
                  </Badge>
                  <h3 className="font-semibold mb-2">{campaign.title}</h3>
                  <p className="text-sm text-muted-foreground">{campaign.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-forest-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-display">
            Can&apos;t Wait for Seasonal Guides?
          </h2>
          <p className="text-forest-100 mb-6 max-w-lg mx-auto">
            Start a complaint now. Our AI handles any consumer issue, any time of year.
          </p>
          <Button size="lg" variant="coral" asChild>
            <Link href="/new">
              Start My Complaint
              <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
