import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@/lib/icons"
import {
  ArrowLeft01Icon,
  BookOpen01Icon,
  ShoppingBag01Icon,
  Airplane01Icon,
  Home01Icon,
  CreditCardIcon,
  Calendar01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

export const metadata: Metadata = {
  title: "UK Consumer Rights Guide 2025 | Your Complete Legal Rights Explained | NoReply",
  description:
    "Comprehensive guide to UK consumer rights in 2025. Learn about the Consumer Rights Act 2015, refund rights, faulty goods, online purchases, flight compensation, Section 75 claims, and how to enforce your legal rights.",
  keywords: [
    "UK consumer rights",
    "Consumer Rights Act 2015",
    "consumer rights UK",
    "refund rights UK",
    "faulty goods rights",
    "online shopping rights UK",
    "flight compensation UK",
    "Section 75",
    "consumer protection UK",
    "UK consumer law",
    "Consumer Contracts Regulations",
    "cooling off period UK",
    "UK261 flight compensation",
    "EC261",
    "how to get a refund UK",
    "consumer rights guide",
  ],
  openGraph: {
    title: "UK Consumer Rights Guide 2025 | Complete Legal Guide",
    description:
      "Everything you need to know about your consumer rights in the UK. Comprehensive guide covering refunds, faulty goods, online purchases, flights, and more.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Consumer Rights Guide 2025",
    description:
      "Your complete guide to consumer rights in the UK. Know your rights, get what you're owed.",
  },
}

// Structured data for the guide
function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "UK Consumer Rights Guide 2025: Your Complete Legal Rights Explained",
    description:
      "Comprehensive guide to UK consumer rights covering the Consumer Rights Act 2015, refund rights, faulty goods, online purchases, flight compensation, and Section 75 claims.",
    author: {
      "@type": "Organization",
      name: "NoReply",
      url: "https://usenoreply.com",
    },
    publisher: {
      "@type": "Organization",
      name: "NoReply",
      url: "https://usenoreply.com",
    },
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://usenoreply.com/guides/uk-consumer-rights",
    },
    about: [
      { "@type": "Thing", name: "Consumer Rights Act 2015" },
      { "@type": "Thing", name: "UK Consumer Law" },
      { "@type": "Thing", name: "Consumer Protection" },
    ],
  }
}

// FAQ structured data
function generateFAQStructuredData() {
  const faqs = [
    {
      question: "What are my rights if I buy a faulty product in the UK?",
      answer:
        "Under the Consumer Rights Act 2015, goods must be of satisfactory quality, fit for purpose, and as described. If faulty, you have 30 days for a full refund. After 30 days but within 6 months, the retailer must repair or replace. After 6 months, you must prove the fault was present at purchase.",
    },
    {
      question: "How long do I have to return something bought online in the UK?",
      answer:
        "Under the Consumer Contracts Regulations 2013, you have 14 days from delivery to cancel an online purchase for any reason (the 'cooling-off period'). The retailer then has 14 days to refund you after receiving the returned goods.",
    },
    {
      question: "What is Section 75 credit card protection?",
      answer:
        "Section 75 of the Consumer Credit Act 1974 makes your credit card company jointly liable with the retailer for purchases between £100 and £30,000. If the retailer fails to deliver, goes bust, or the goods are faulty, you can claim from your credit card company.",
    },
    {
      question: "How much flight delay compensation can I claim in the UK?",
      answer:
        "Under UK261 (formerly EC261), you may be entitled to: £220 for flights under 1,500km, £350 for flights 1,500-3,500km, or £520 for flights over 3,500km. The flight must be delayed by 3+ hours or cancelled, departing from a UK airport or arriving in the UK on a UK/EU carrier.",
    },
    {
      question: "Can a shop refuse to give me a refund?",
      answer:
        "A shop can refuse a refund if: the item isn't faulty and you simply changed your mind (unless bought online), you've had the item over 30 days and it's faulty, or you caused the damage. However, they cannot refuse for faulty goods within 30 days, and you always have online cancellation rights.",
    },
    {
      question: "What should I do if a company ignores my complaint?",
      answer:
        "First, send a formal written complaint citing the relevant consumer law. Set a deadline (usually 14 days). If ignored, escalate to the relevant ombudsman or regulatory body. You can also consider small claims court for amounts up to £10,000 in England and Wales.",
    },
    {
      question: "Do consumer rights apply to private sales?",
      answer:
        "The Consumer Rights Act 2015 only applies to business-to-consumer transactions. Private sales (e.g., Facebook Marketplace between individuals) are covered by the weaker Sale of Goods Act 1979, which only requires goods to be 'as described'.",
    },
    {
      question: "What is the difference between a refund, repair, and replacement?",
      answer:
        "Within 30 days of purchase, you can demand a full refund for faulty goods. After 30 days, the retailer can choose to repair or replace first. If repair/replacement fails or is impossible, you're then entitled to a refund (potentially with a deduction for use after 6 months).",
    },
  ]

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

const tableOfContents = [
  { id: "overview", title: "Overview of UK Consumer Law" },
  { id: "consumer-rights-act", title: "Consumer Rights Act 2015" },
  { id: "online-purchases", title: "Online & Distance Purchases" },
  { id: "refunds", title: "Refund Rights & Timelines" },
  { id: "faulty-goods", title: "Faulty Goods & Services" },
  { id: "flight-compensation", title: "Flight Delay Compensation" },
  { id: "section-75", title: "Section 75 Credit Card Protection" },
  { id: "how-to-complain", title: "How to Make a Complaint" },
  { id: "escalation", title: "Escalation & Ombudsman" },
  { id: "faq", title: "Frequently Asked Questions" },
]

export default function UKConsumerRightsGuidePage() {
  const articleSchema = generateStructuredData()
  const faqSchema = generateFAQStructuredData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="border-b border-forest-100 bg-forest-50/30">
            <div className="container mx-auto px-4 py-12 md:py-16">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <Icon icon={ArrowLeft01Icon} size={16} />
                Back to Tools
              </Link>

              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-700 text-sm font-medium mb-4">
                  <Icon icon={BookOpen01Icon} size={14} />
                  Comprehensive Guide
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl text-foreground font-hero mb-4">
                  UK Consumer Rights Guide 2025
                </h1>

                <p className="text-xl text-muted-foreground mb-6">
                  Your complete guide to consumer protection in the United
                  Kingdom. Know your rights under the Consumer Rights Act 2015,
                  Consumer Contracts Regulations, and other key legislation.
                </p>

                <p className="text-sm text-muted-foreground">
                  Last updated: January 2025 | Covers England, Wales, Scotland &
                  Northern Ireland
                </p>
              </div>
            </div>
          </section>

          {/* Table of Contents */}
          <section className="border-b border-forest-100 py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h2 className="text-lg font-semibold mb-4 font-display">
                  Table of Contents
                </h2>
                <nav className="grid sm:grid-cols-2 gap-2">
                  {tableOfContents.map((item, index) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-forest-600 transition-colors"
                    >
                      <span className="text-forest-400 font-mono text-xs">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <article className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto prose prose-forest">
                {/* Overview */}
                <section id="overview" className="scroll-mt-24 mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
                    Overview of UK Consumer Law
                  </h2>

                  <p className="text-muted-foreground mb-4">
                    UK consumer protection law gives you significant rights when
                    buying goods and services. The main legislation includes:
                  </p>

                  <div className="bg-forest-50 border border-forest-100 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-4">Key UK Consumer Laws</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Icon
                          icon={CheckmarkCircle01Icon}
                          size={18}
                          className="text-forest-500 mt-0.5 shrink-0"
                        />
                        <div>
                          <strong>Consumer Rights Act 2015</strong> – Your main
                          rights for goods, services, and digital content
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Icon
                          icon={CheckmarkCircle01Icon}
                          size={18}
                          className="text-forest-500 mt-0.5 shrink-0"
                        />
                        <div>
                          <strong>Consumer Contracts Regulations 2013</strong> –
                          Rights for online and distance purchases
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Icon
                          icon={CheckmarkCircle01Icon}
                          size={18}
                          className="text-forest-500 mt-0.5 shrink-0"
                        />
                        <div>
                          <strong>Consumer Credit Act 1974</strong> – Section 75
                          credit card protection
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Icon
                          icon={CheckmarkCircle01Icon}
                          size={18}
                          className="text-forest-500 mt-0.5 shrink-0"
                        />
                        <div>
                          <strong>UK261 Regulation</strong> – Flight delay and
                          cancellation compensation
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Icon
                          icon={CheckmarkCircle01Icon}
                          size={18}
                          className="text-forest-500 mt-0.5 shrink-0"
                        />
                        <div>
                          <strong>
                            Package Travel Regulations 2018
                          </strong> – Protection for package holidays
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-lavender-50 border border-lavender-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <Icon
                        icon={AlertCircleIcon}
                        size={20}
                        className="text-lavender-600 mt-0.5 shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-lavender-900 mb-1">
                          Important Note
                        </h4>
                        <p className="text-sm text-lavender-700">
                          Consumer rights apply to purchases from businesses
                          only (B2C). Private sales between individuals have
                          different, more limited protections under common law.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Consumer Rights Act 2015 */}
                <section id="consumer-rights-act" className="scroll-mt-24 mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
                    Consumer Rights Act 2015
                  </h2>

                  <p className="text-muted-foreground mb-6">
                    The Consumer Rights Act 2015 is the cornerstone of UK
                    consumer protection. It replaced most of the Sale of Goods
                    Act 1979 for consumer transactions and sets out your rights
                    when buying goods, services, and digital content.
                  </p>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Rights for Goods
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    Every product you buy from a business must be:
                  </p>

                  <div className="grid gap-4 mb-6">
                    <div className="bg-white border border-forest-100 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">
                        Satisfactory Quality
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Free from defects, safe, durable, and of a standard a
                        reasonable person would expect given the price and
                        description.
                      </p>
                    </div>
                    <div className="bg-white border border-forest-100 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Fit for Purpose</h4>
                      <p className="text-sm text-muted-foreground">
                        Suitable for any specific purpose you made clear to the
                        seller before buying, as well as its general purpose.
                      </p>
                    </div>
                    <div className="bg-white border border-forest-100 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">As Described</h4>
                      <p className="text-sm text-muted-foreground">
                        Must match any description given by the seller, on
                        packaging, in advertising, or verbally.
                      </p>
                    </div>
                    <div className="bg-white border border-forest-100 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Match the Sample</h4>
                      <p className="text-sm text-muted-foreground">
                        If you bought based on a sample, the final product must
                        match it in quality and features.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Rights for Services
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    When you pay for a service, it must be:
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Performed with <strong>reasonable care and skill</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Completed within a <strong>reasonable time</strong> (if
                        no time was agreed)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Charged at a <strong>reasonable price</strong> (if no
                        price was agreed)
                      </span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Rights for Digital Content
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    Digital content (apps, games, downloads, streaming) must be:
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Of satisfactory quality
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Fit for purpose
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        As described
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Free from defects that would damage your device
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Online Purchases */}
                <section id="online-purchases" className="scroll-mt-24 mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
                    Online & Distance Purchases
                  </h2>

                  <p className="text-muted-foreground mb-6">
                    The Consumer Contracts Regulations 2013 give you extra
                    rights when buying online, by phone, or mail order. These
                    are in addition to your rights under the Consumer Rights Act.
                  </p>

                  <div className="bg-peach-50 border border-peach-200 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4 font-display text-peach-900">
                      14-Day Cooling-Off Period
                    </h3>
                    <p className="text-peach-800 mb-4">
                      You have the right to cancel most online purchases within{" "}
                      <strong>14 days of receiving the goods</strong>, for any
                      reason or no reason at all. You don&apos;t need to give an
                      explanation.
                    </p>
                    <ul className="space-y-2 text-sm text-peach-700">
                      <li>
                        • The 14 days start when you receive the goods (not when
                        you order)
                      </li>
                      <li>
                        • You have a further 14 days to return the goods after
                        cancelling
                      </li>
                      <li>
                        • The seller must refund you within 14 days of receiving
                        the return
                      </li>
                      <li>
                        • Basic return shipping costs may be your responsibility
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Exceptions to the Cooling-Off Period
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    You cannot cancel and return these items under the
                    cooling-off period:
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-muted-foreground">
                        • Perishable goods (fresh food, flowers)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-muted-foreground">
                        • Sealed goods that have been opened (hygiene products,
                        underwear)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-muted-foreground">
                        • Personalised or custom-made items
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-muted-foreground">
                        • Sealed audio, video, or software if unsealed
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-muted-foreground">
                        • Newspapers and magazines (except subscriptions)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-muted-foreground">
                        • Digital content once download/streaming has started
                        (with consent)
                      </span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Delivery Rights
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    When buying online, you also have delivery rights:
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Goods must be delivered within the agreed timeframe
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        If no time agreed, delivery must be within 30 days
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        The seller is responsible for the goods until you
                        receive them
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        If delivery fails, you can cancel and get a full refund
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Refunds */}
                <section id="refunds" className="scroll-mt-24 mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
                    Refund Rights & Timelines
                  </h2>

                  <p className="text-muted-foreground mb-6">
                    Your refund rights depend on why you&apos;re returning the
                    item and how long you&apos;ve had it. Here are the key
                    timelines:
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="bg-white border-l-4 border-forest-500 p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          icon={Calendar01Icon}
                          size={18}
                          className="text-forest-500"
                        />
                        <h4 className="font-semibold">
                          Within 30 Days (Short-Term Right to Reject)
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        If goods are faulty, you can reject them and demand a{" "}
                        <strong>full refund</strong>. The retailer cannot insist
                        on repair or replacement.
                      </p>
                    </div>

                    <div className="bg-white border-l-4 border-lavender-500 p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          icon={Calendar01Icon}
                          size={18}
                          className="text-lavender-500"
                        />
                        <h4 className="font-semibold">
                          30 Days to 6 Months
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The retailer can choose to{" "}
                        <strong>repair or replace</strong> first. If
                        repair/replacement fails or is impossible, you get a
                        full refund. The fault is assumed to have been present
                        at purchase.
                      </p>
                    </div>

                    <div className="bg-white border-l-4 border-peach-500 p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          icon={Calendar01Icon}
                          size={18}
                          className="text-peach-500"
                        />
                        <h4 className="font-semibold">After 6 Months</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>You must prove</strong> the fault was present at
                        purchase. You may only be entitled to a{" "}
                        <strong>partial refund</strong> (with deduction for use)
                        rather than full refund.
                      </p>
                    </div>
                  </div>

                  <div className="bg-forest-50 border border-forest-100 rounded-lg p-6">
                    <h4 className="font-semibold mb-3">
                      Important: Change of Mind vs Faulty
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-forest-700 mb-2">
                          Change of Mind (In-Store)
                        </p>
                        <p className="text-muted-foreground">
                          No legal right to return. Any returns policy is at the
                          retailer&apos;s discretion (store credit, exchanges).
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-forest-700 mb-2">
                          Change of Mind (Online)
                        </p>
                        <p className="text-muted-foreground">
                          14-day cooling-off period applies. Full refund within
                          14 days of you receiving the goods.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Faulty Goods */}
                <section id="faulty-goods" className="scroll-mt-24 mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
                    Faulty Goods & Services
                  </h2>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    What Counts as Faulty?
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    A product is legally faulty if it:
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Doesn&apos;t work or has defects
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Is unsafe or doesn&apos;t meet safety standards
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Doesn&apos;t match the description or sample
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Isn&apos;t fit for its normal purpose or a purpose you
                        specified
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Doesn&apos;t last a reasonable amount of time
                      </span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Your Remedies
                  </h3>

                  <Card className="mb-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timeframe</TableHead>
                          <TableHead>Your Rights</TableHead>
                          <TableHead>Burden of Proof</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">0-30 days</TableCell>
                          <TableCell>Full refund on demand</TableCell>
                          <TableCell>On seller</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">30 days - 6 months</TableCell>
                          <TableCell>Repair or replace first, then refund</TableCell>
                          <TableCell>On seller</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">6 months +</TableCell>
                          <TableCell>Repair or replace, partial refund possible</TableCell>
                          <TableCell>On buyer</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Card>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Faulty Services
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    If a service wasn&apos;t performed with reasonable care and
                    skill:
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="font-medium text-forest-600 shrink-0">
                        1.
                      </span>
                      <span className="text-muted-foreground">
                        The business must <strong>repeat the service</strong> at
                        no extra cost
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-medium text-forest-600 shrink-0">
                        2.
                      </span>
                      <span className="text-muted-foreground">
                        If repeat isn&apos;t possible, you&apos;re entitled to a{" "}
                        <strong>price reduction</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-medium text-forest-600 shrink-0">
                        3.
                      </span>
                      <span className="text-muted-foreground">
                        Price reduction can be up to 100% (full refund) in
                        serious cases
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Flight Compensation */}
                <section id="flight-compensation" className="scroll-mt-24 mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display flex items-center gap-3">
                    <Icon icon={Airplane01Icon} size={28} className="text-forest-500" />
                    Flight Delay Compensation
                  </h2>

                  <p className="text-muted-foreground mb-6">
                    UK261 (the UK version of EU Regulation EC261/2004) gives you
                    the right to compensation for flight delays, cancellations,
                    and denied boarding.
                  </p>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    When You Can Claim
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    UK261 applies to flights:
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        <strong>Departing from a UK airport</strong> (any
                        airline)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        <strong>Arriving in the UK</strong> from outside the UK
                        (UK or EU carrier only)
                      </span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Compensation Amounts
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white border border-forest-100 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-forest-600 mb-1">
                        £220
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Flights under 1,500km
                      </p>
                    </div>
                    <div className="bg-white border border-forest-100 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-forest-600 mb-1">
                        £350
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Flights 1,500km - 3,500km
                      </p>
                    </div>
                    <div className="bg-white border border-forest-100 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-forest-600 mb-1">
                        £520
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Flights over 3,500km
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Qualifying Situations
                  </h3>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Flight delayed by <strong>3 hours or more</strong> at
                        arrival
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Flight <strong>cancelled</strong> with less than 14
                        days&apos; notice
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        <strong>Denied boarding</strong> due to overbooking
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        <strong>Missed connection</strong> causing 3+ hour delay
                        (same booking)
                      </span>
                    </li>
                  </ul>

                  <div className="bg-lavender-50 border border-lavender-200 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-lavender-900 mb-2">
                      Extraordinary Circumstances
                    </h4>
                    <p className="text-sm text-lavender-700 mb-3">
                      Airlines don&apos;t have to pay compensation if the
                      disruption was caused by &quot;extraordinary
                      circumstances&quot; outside their control:
                    </p>
                    <ul className="text-sm text-lavender-700 space-y-1">
                      <li>• Severe weather conditions</li>
                      <li>• Air traffic control restrictions</li>
                      <li>• Security threats or political instability</li>
                      <li>• Bird strikes</li>
                    </ul>
                    <p className="text-sm text-lavender-700 mt-3">
                      Note: Technical faults and staff strikes are generally{" "}
                      <strong>NOT</strong> extraordinary circumstances.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Time Limit to Claim
                  </h3>

                  <p className="text-muted-foreground">
                    In England, Wales, and Northern Ireland, you have{" "}
                    <strong>6 years</strong> to make a claim. In Scotland, you
                    have <strong>5 years</strong>.
                  </p>
                </section>

                {/* Section 75 */}
                <section id="section-75" className="scroll-mt-24 mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display flex items-center gap-3">
                    <Icon icon={CreditCardIcon} size={28} className="text-forest-500" />
                    Section 75 Credit Card Protection
                  </h2>

                  <p className="text-muted-foreground mb-6">
                    Section 75 of the Consumer Credit Act 1974 is one of the
                    most powerful consumer protections in the UK. It makes your
                    credit card company jointly liable with the retailer.
                  </p>

                  <div className="bg-forest-500 text-white rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-3">How It Works</h3>
                    <p className="mb-4 opacity-90">
                      If you pay for something (or even just a deposit) using a
                      credit card and something goes wrong, you can claim from
                      your credit card company instead of (or as well as) the
                      retailer.
                    </p>
                    <p className="text-sm opacity-75">
                      This is especially valuable when a company goes bust, or
                      refuses to respond to your complaint.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Requirements
                  </h3>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Item/service cost between{" "}
                        <strong>£100 and £30,000</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        Paid (at least partially) by <strong>credit card</strong>{" "}
                        (not debit card)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        There&apos;s been a <strong>breach of contract</strong>{" "}
                        or <strong>misrepresentation</strong>
                      </span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Section 75 vs Chargeback
                  </h3>

                  <Card className="mb-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Feature</TableHead>
                          <TableHead>Section 75</TableHead>
                          <TableHead>Chargeback</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Legal basis</TableCell>
                          <TableCell>Statutory right</TableCell>
                          <TableCell>Card network rules</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Card type</TableCell>
                          <TableCell>Credit cards only</TableCell>
                          <TableCell>Credit & debit cards</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Minimum value</TableCell>
                          <TableCell>£100</TableCell>
                          <TableCell>No minimum</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Time limit</TableCell>
                          <TableCell>6 years</TableCell>
                          <TableCell>120 days typically</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Claim amount</TableCell>
                          <TableCell>Full loss (not just amount paid)</TableCell>
                          <TableCell>Amount paid only</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Card>
                </section>

                {/* How to Complain */}
                <section id="how-to-complain" className="scroll-mt-24 mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
                    How to Make a Complaint
                  </h2>

                  <p className="text-muted-foreground mb-6">
                    A well-structured complaint dramatically increases your
                    chances of success. Follow these steps:
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-forest-500 text-white flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">
                          Gather Your Evidence
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Collect receipts, order confirmations, photos of
                          faults, screenshots of communications, and any other
                          relevant documents.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-forest-500 text-white flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">
                          Contact the Right Person
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Start with customer service, but be prepared to
                          escalate to the complaints department or management.
                          Written complaints (email) create a paper trail.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-forest-500 text-white flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">State the Law</h4>
                        <p className="text-sm text-muted-foreground">
                          Reference the specific consumer protection law that
                          applies. This shows you know your rights and
                          aren&apos;t making unreasonable demands.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-forest-500 text-white flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">
                          Be Clear About What You Want
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          State exactly what resolution you&apos;re seeking:
                          full refund, repair, replacement, or compensation.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-forest-500 text-white flex items-center justify-center text-sm font-bold">
                        5
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Set a Deadline</h4>
                        <p className="text-sm text-muted-foreground">
                          Give a reasonable deadline (14 days is standard) and
                          state what you&apos;ll do if they don&apos;t respond
                          (e.g., escalate to ombudsman).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-forest-50 border border-forest-100 rounded-lg p-6">
                    <h4 className="font-semibold mb-3">
                      Key Phrases to Use in Your Complaint
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>
                        &quot;Under the Consumer Rights Act 2015, goods must
                        be...&quot;
                      </li>
                      <li>
                        &quot;I am exercising my statutory right to a full
                        refund...&quot;
                      </li>
                      <li>
                        &quot;This constitutes a breach of contract because...&quot;
                      </li>
                      <li>
                        &quot;Please respond within 14 days, failing which I will
                        escalate to...&quot;
                      </li>
                      <li>
                        &quot;I reserve my right to pursue this matter through
                        the small claims court...&quot;
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Escalation */}
                <section id="escalation" className="scroll-mt-24 mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
                    Escalation & Ombudsman Services
                  </h2>

                  <p className="text-muted-foreground mb-6">
                    If a company doesn&apos;t resolve your complaint, you can
                    escalate to an ombudsman or regulatory body. Most are free
                    to use.
                  </p>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Key Ombudsman Services
                  </h3>

                  <div className="grid gap-4 mb-6">
                    <div className="bg-white border border-forest-100 rounded-lg p-4">
                      <h4 className="font-semibold mb-1">
                        Financial Ombudsman Service
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Banks, credit cards, loans, insurance, investments
                      </p>
                      <a
                        href="https://www.financial-ombudsman.org.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-forest-600 hover:underline"
                      >
                        financial-ombudsman.org.uk
                      </a>
                    </div>

                    <div className="bg-white border border-forest-100 rounded-lg p-4">
                      <h4 className="font-semibold mb-1">
                        Energy Ombudsman
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Gas and electricity suppliers
                      </p>
                      <a
                        href="https://www.energyombudsman.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-forest-600 hover:underline"
                      >
                        energyombudsman.org
                      </a>
                    </div>

                    <div className="bg-white border border-forest-100 rounded-lg p-4">
                      <h4 className="font-semibold mb-1">
                        Communications Ombudsman (CISAS/Ombudsman Services)
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Phone, broadband, TV providers
                      </p>
                      <a
                        href="https://www.cedr.com/consumer/cisas/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-forest-600 hover:underline"
                      >
                        cedr.com/consumer/cisas
                      </a>
                    </div>

                    <div className="bg-white border border-forest-100 rounded-lg p-4">
                      <h4 className="font-semibold mb-1">
                        Civil Aviation Authority (CAA)
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Flight delays, cancellations, airline complaints
                      </p>
                      <a
                        href="https://www.caa.co.uk/passengers/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-forest-600 hover:underline"
                      >
                        caa.co.uk/passengers
                      </a>
                    </div>

                    <div className="bg-white border border-forest-100 rounded-lg p-4">
                      <h4 className="font-semibold mb-1">
                        The Property Ombudsman
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Estate agents, lettings agents
                      </p>
                      <a
                        href="https://www.tpos.co.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-forest-600 hover:underline"
                      >
                        tpos.co.uk
                      </a>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 font-display">
                    Small Claims Court
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    If an ombudsman can&apos;t help or doesn&apos;t cover your
                    issue, you can take the matter to small claims court:
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        <strong>England & Wales:</strong> Claims up to £10,000
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        <strong>Scotland:</strong> Simple Procedure for claims up
                        to £5,000
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon
                        icon={CheckmarkCircle01Icon}
                        size={18}
                        className="text-forest-500 mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">
                        <strong>Northern Ireland:</strong> Small claims up to
                        £3,000
                      </span>
                    </li>
                  </ul>

                  <p className="text-muted-foreground">
                    Court fees vary by claim value. You don&apos;t need a lawyer
                    for small claims, and hearings are informal.
                  </p>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="scroll-mt-24 mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
                    Frequently Asked Questions
                  </h2>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="faq-1">
                      <AccordionTrigger>
                        What are my rights if I buy a faulty product in the UK?
                      </AccordionTrigger>
                      <AccordionContent>
                        Under the Consumer Rights Act 2015, goods must be of satisfactory quality, fit for purpose, and as described. If faulty, you have 30 days for a full refund. After 30 days but within 6 months, the retailer must repair or replace. After 6 months, you must prove the fault was present at purchase.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-2">
                      <AccordionTrigger>
                        How long do I have to return something bought online in the UK?
                      </AccordionTrigger>
                      <AccordionContent>
                        Under the Consumer Contracts Regulations 2013, you have 14 days from delivery to cancel an online purchase for any reason. The retailer then has 14 days to refund you after receiving the returned goods.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-3">
                      <AccordionTrigger>
                        What is Section 75 credit card protection?
                      </AccordionTrigger>
                      <AccordionContent>
                        Section 75 of the Consumer Credit Act 1974 makes your credit card company jointly liable with the retailer for purchases between £100 and £30,000. If the retailer fails to deliver, goes bust, or the goods are faulty, you can claim from your credit card company.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-4">
                      <AccordionTrigger>
                        How much flight delay compensation can I claim in the UK?
                      </AccordionTrigger>
                      <AccordionContent>
                        Under UK261, you may be entitled to: £220 for flights under 1,500km, £350 for flights 1,500-3,500km, or £520 for flights over 3,500km. The flight must be delayed by 3+ hours or cancelled.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-5">
                      <AccordionTrigger>
                        Can a shop refuse to give me a refund?
                      </AccordionTrigger>
                      <AccordionContent>
                        A shop can refuse a refund if the item isn&apos;t faulty and you simply changed your mind (unless bought online). However, they cannot refuse for faulty goods within 30 days, and you always have online cancellation rights.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-6">
                      <AccordionTrigger>
                        What should I do if a company ignores my complaint?
                      </AccordionTrigger>
                      <AccordionContent>
                        Send a formal written complaint citing the relevant consumer law, set a deadline (usually 14 days). If ignored, escalate to the relevant ombudsman or consider small claims court for amounts up to £10,000.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-7">
                      <AccordionTrigger>
                        Do consumer rights apply to private sales?
                      </AccordionTrigger>
                      <AccordionContent>
                        The Consumer Rights Act 2015 only applies to business-to-consumer transactions. Private sales have more limited protections under common law.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-8">
                      <AccordionTrigger>
                        What is the difference between a refund, repair, and replacement?
                      </AccordionTrigger>
                      <AccordionContent>
                        Within 30 days, you can demand a full refund for faulty goods. After 30 days, the retailer can choose to repair or replace first. If that fails, you&apos;re then entitled to a refund.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </section>
              </div>
            </div>
          </article>

          {/* CTA Section */}
          <section className="py-12 md:py-16 bg-forest-500">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-display">
                Need Help Enforcing Your Rights?
              </h2>
              <p className="text-forest-100 mb-6 max-w-lg mx-auto">
                NoReply creates professional, legally-backed complaint letters
                that cite the relevant consumer laws for your specific
                situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="coral" size="lg">
                  <Link href="/new">Create a Complaint Letter</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  <Link href="/tools">Browse Free Tools</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
