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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/lib/icons"
import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  SparklesIcon,
  Clock01Icon,
  CreditCardIcon,
  CustomerService01Icon,
  Globe02Icon,
  AiMagicIcon,
} from "@hugeicons-pro/core-stroke-rounded"

export const metadata: Metadata = {
  title: "Best Complaint Letter Tools UK 2025 | NoReply vs Resolver vs Which? vs DIY",
  description:
    "Compare the best ways to write a complaint letter in the UK. See how AI-powered tools like NoReply stack up against Resolver, Which?, Citizens Advice templates, and writing your own complaint letter.",
  keywords: [
    "complaint letter generator",
    "best complaint letter tool UK",
    "NoReply vs Resolver",
    "how to write a complaint letter UK",
    "consumer complaint tools",
    "AI complaint letter",
    "complaint letter template UK",
    "Resolver alternative",
    "Which? complaint tool",
    "consumer rights tools UK",
    "free complaint letter generator",
    "complaint letter software",
  ],
  openGraph: {
    title: "Best Complaint Letter Tools UK 2025 - Comparison Guide",
    description:
      "Which complaint letter tool is best? Compare NoReply, Resolver, Which?, templates, and DIY approaches.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Complaint Letter Tools UK 2025",
    description:
      "Compare the best ways to write a consumer complaint letter in the UK.",
  },
}

// Structured data for the comparison article
function generateArticleStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Best Complaint Letter Tools UK 2025: NoReply vs Resolver vs Which? vs DIY",
    description:
      "A comprehensive comparison of complaint letter tools and methods available to UK consumers, including AI-powered generators, free templates, and DIY approaches.",
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
      "@id": "https://usenoreply.com/compare/complaint-letter-tools",
    },
  }
}

// ItemList structured data for the comparison
function generateItemListStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best Complaint Letter Tools UK 2025",
    description:
      "Ranked list of the best ways to write a consumer complaint letter in the UK",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "NoReply",
        description:
          "AI-powered complaint letter generator with legal research and company intelligence",
        url: "https://usenoreply.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Resolver",
        description:
          "Free complaint management platform for UK consumers",
        url: "https://www.resolver.co.uk",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Which? Complaint Tool",
        description:
          "Consumer Rights organisation complaint letter templates",
        url: "https://www.which.co.uk",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Citizens Advice Templates",
        description: "Free complaint letter templates from Citizens Advice",
        url: "https://www.citizensadvice.org.uk",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "DIY Complaint Letter",
        description: "Writing your own complaint letter from scratch",
      },
    ],
  }
}

const tools = [
  {
    name: "NoReply",
    type: "AI-Powered Platform",
    description:
      "AI-powered consumer advocacy platform that researches your rights, finds company contacts, and generates legally-backed complaint letters.",
    website: "usenoreply.com",
    pricing: "Free tier + £2.99/case",
    bestFor: "Getting results fast with professionally structured complaints",
    pros: [
      "AI researches applicable consumer laws automatically",
      "Finds company complaint contacts and executive emails",
      "Analyzes uploaded evidence (photos, documents, videos)",
      "Generates multiple letter formats (initial, follow-up, escalation)",
      "UK consumer law expertise built-in",
      "Ready in minutes, not hours",
    ],
    cons: [
      "Premium features require payment",
      "UK-focused (limited international coverage)",
      "Requires account creation",
    ],
    features: {
      aiPowered: true,
      legalResearch: true,
      companyLookup: true,
      evidenceAnalysis: true,
      freeOption: true,
      templates: true,
      tracking: true,
    },
    verdict:
      "Best for consumers who want professional, legally-grounded complaints without spending hours on research.",
  },
  {
    name: "Resolver",
    type: "Free Platform",
    description:
      "Free complaint management platform that helps you escalate issues with companies through a structured process.",
    website: "resolver.co.uk",
    pricing: "Free",
    bestFor: "Managing multiple complaints with built-in escalation paths",
    pros: [
      "Completely free to use",
      "Tracks complaint history",
      "Knows escalation paths for major companies",
      "Covers many UK sectors",
      "Deadline reminders",
    ],
    cons: [
      "Generic letter templates (not tailored to your case)",
      "No AI-powered legal research",
      "Limited customization",
      "Can be slow for complex cases",
      "No evidence analysis",
    ],
    features: {
      aiPowered: false,
      legalResearch: false,
      companyLookup: true,
      evidenceAnalysis: false,
      freeOption: true,
      templates: true,
      tracking: true,
    },
    verdict:
      "Best for straightforward complaints where you need help with the process but not the content.",
  },
  {
    name: "Which? Complaint Tool",
    type: "Consumer Organisation",
    description:
      "Template-based complaint letter tool from the UK's leading consumer rights organisation.",
    website: "which.co.uk",
    pricing: "Free templates (membership £10.75/month for full access)",
    bestFor: "Access to trusted consumer rights information",
    pros: [
      "Trusted consumer rights organisation",
      "Well-researched legal information",
      "Covers wide range of complaint types",
      "Quality template letters",
      "Extensive consumer guides",
    ],
    cons: [
      "Templates are generic, not personalised",
      "Full access requires membership",
      "You fill in the blanks yourself",
      "No AI or automation",
      "Time-consuming to research and customize",
    ],
    features: {
      aiPowered: false,
      legalResearch: false,
      companyLookup: false,
      evidenceAnalysis: false,
      freeOption: true,
      templates: true,
      tracking: false,
    },
    verdict:
      "Best for consumers who want trusted templates and don't mind doing the work themselves.",
  },
  {
    name: "Citizens Advice Templates",
    type: "Charity Resource",
    description:
      "Free complaint letter templates and consumer rights guides from the UK's advice charity.",
    website: "citizensadvice.org.uk",
    pricing: "Free",
    bestFor: "Basic guidance and simple template letters",
    pros: [
      "Completely free",
      "Trusted charity source",
      "Basic templates for common issues",
      "Links to further help and support",
      "Covers vulnerable consumers",
    ],
    cons: [
      "Very basic templates",
      "No personalization",
      "No tech features",
      "You do all the research",
      "Limited complaint types covered",
    ],
    features: {
      aiPowered: false,
      legalResearch: false,
      companyLookup: false,
      evidenceAnalysis: false,
      freeOption: true,
      templates: true,
      tracking: false,
    },
    verdict:
      "Best for simple complaints where budget is the main concern.",
  },
  {
    name: "DIY (Write Your Own)",
    type: "Self-Service",
    description:
      "Writing your own complaint letter from scratch, researching laws and contacts yourself.",
    website: "N/A",
    pricing: "Free (but time-intensive)",
    bestFor: "Those with time, legal knowledge, or simple complaints",
    pros: [
      "Completely free",
      "Full control over content",
      "No account required",
      "Can be highly personalised",
    ],
    cons: [
      "Time-consuming (hours of research)",
      "Easy to miss relevant laws",
      "May not find best contacts",
      "Emotional complaints less effective",
      "No guidance on escalation",
      "Risk of weak legal arguments",
    ],
    features: {
      aiPowered: false,
      legalResearch: false,
      companyLookup: false,
      evidenceAnalysis: false,
      freeOption: true,
      templates: false,
      tracking: false,
    },
    verdict:
      "Only recommended if you have legal knowledge or the complaint is very simple.",
  },
]

const featureComparison = [
  { feature: "AI-Powered Letters", key: "aiPowered" },
  { feature: "Legal Research", key: "legalResearch" },
  { feature: "Company Contact Lookup", key: "companyLookup" },
  { feature: "Evidence Analysis", key: "evidenceAnalysis" },
  { feature: "Free Option Available", key: "freeOption" },
  { feature: "Letter Templates", key: "templates" },
  { feature: "Complaint Tracking", key: "tracking" },
]

export default function ComparisonPage() {
  const articleSchema = generateArticleStructuredData()
  const itemListSchema = generateItemListStructuredData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="border-b border-forest-100 bg-forest-50/30">
            <div className="container mx-auto px-4 py-12 md:py-16">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <Icon icon={ArrowLeft01Icon} size={16} />
                Back to Home
              </Link>

              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-100 text-lavender-700 text-sm font-medium mb-4">
                  <Icon icon={SparklesIcon} size={14} />
                  2025 Comparison Guide
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl text-foreground font-hero mb-4">
                  Best Complaint Letter Tools UK 2025
                </h1>

                <p className="text-xl text-muted-foreground mb-4">
                  Compare the best ways to write a consumer complaint letter.
                  From AI-powered generators to free templates - find the right
                  approach for your situation.
                </p>

                <p className="text-sm text-muted-foreground">
                  Last updated: January 2025 | Covers UK consumer complaints
                </p>
              </div>
            </div>
          </section>

          {/* Quick Summary */}
          <section className="py-12 border-b border-forest-100">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 font-display">
                Quick Summary
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-forest-500 text-white rounded-lg p-6">
                  <p className="text-sm font-medium opacity-80 mb-1">
                    Best Overall
                  </p>
                  <p className="text-xl font-bold mb-2">NoReply</p>
                  <p className="text-sm opacity-90">
                    AI-powered letters with legal research. Best for getting
                    professional results quickly.
                  </p>
                </div>

                <div className="bg-white border border-forest-100 rounded-lg p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Best Free Option
                  </p>
                  <p className="text-xl font-bold mb-2">Resolver</p>
                  <p className="text-sm text-muted-foreground">
                    Free platform with complaint tracking. Good for simple cases.
                  </p>
                </div>

                <div className="bg-white border border-forest-100 rounded-lg p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Best for Research
                  </p>
                  <p className="text-xl font-bold mb-2">Which?</p>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive consumer rights guides. Requires membership
                    for full access.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section className="py-12 border-b border-forest-100">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 font-display">
                Feature Comparison
              </h2>

              <Card className="py-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Feature</TableHead>
                      {tools.map((tool) => (
                        <TableHead
                          key={tool.name}
                          className="text-center font-semibold min-w-[100px]"
                        >
                          {tool.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featureComparison.map((item) => (
                      <TableRow key={item.key}>
                        <TableCell className="font-medium">
                          {item.feature}
                        </TableCell>
                        {tools.map((tool) => (
                          <TableCell
                            key={`${tool.name}-${item.key}`}
                            className="text-center"
                          >
                            {tool.features[
                              item.key as keyof typeof tool.features
                            ] ? (
                              <Icon
                                icon={CheckmarkCircle01Icon}
                                size={20}
                                className="text-forest-500 mx-auto"
                              />
                            ) : (
                              <Icon
                                icon={Cancel01Icon}
                                size={20}
                                className="text-stone-300 mx-auto"
                              />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-medium">Pricing</TableCell>
                      {tools.map((tool) => (
                        <TableCell
                          key={`${tool.name}-pricing`}
                          className="text-center text-xs"
                        >
                          {tool.pricing}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          </section>

          {/* Detailed Reviews */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 font-display">
                Detailed Reviews
              </h2>

              <div className="space-y-12">
                {tools.map((tool, index) => (
                  <div
                    key={tool.name}
                    id={tool.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                    className="scroll-mt-24"
                  >
                    <div
                      className={`border rounded-lg overflow-hidden ${
                        index === 0
                          ? "border-forest-500 ring-2 ring-forest-500/20"
                          : "border-forest-100"
                      }`}
                    >
                      {/* Header */}
                      <div
                        className={`p-6 ${
                          index === 0
                            ? "bg-forest-500 text-white"
                            : "bg-forest-50"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span
                                className={`text-2xl font-bold ${
                                  index === 0 ? "" : "text-foreground"
                                }`}
                              >
                                {index + 1}. {tool.name}
                              </span>
                              {index === 0 && (
                                <span className="px-2 py-0.5 bg-peach-400 text-white text-xs font-semibold rounded-full">
                                  Editor&apos;s Choice
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-sm ${
                                index === 0
                                  ? "opacity-90"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {tool.type} • {tool.pricing}
                            </p>
                          </div>
                          {tool.website !== "N/A" && (
                            <a
                              href={`https://${
                                tool.website.startsWith("www.")
                                  ? tool.website
                                  : `www.${tool.website}`
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm ${
                                index === 0
                                  ? "text-white/80 hover:text-white"
                                  : "text-forest-600 hover:underline"
                              }`}
                            >
                              {tool.website} →
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 bg-white">
                        <p className="text-muted-foreground mb-6">
                          {tool.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          {/* Pros */}
                          <div>
                            <h4 className="font-semibold text-forest-600 mb-3">
                              Pros
                            </h4>
                            <ul className="space-y-2">
                              {tool.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Icon
                                    icon={CheckmarkCircle01Icon}
                                    size={16}
                                    className="text-forest-500 mt-0.5 shrink-0"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {pro}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Cons */}
                          <div>
                            <h4 className="font-semibold text-peach-600 mb-3">
                              Cons
                            </h4>
                            <ul className="space-y-2">
                              {tool.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Icon
                                    icon={Cancel01Icon}
                                    size={16}
                                    className="text-peach-500 mt-0.5 shrink-0"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {con}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Best For & Verdict */}
                        <div className="bg-forest-50 rounded-lg p-4">
                          <div className="flex flex-wrap gap-6">
                            <div>
                              <p className="text-xs font-medium text-forest-600 uppercase tracking-wide mb-1">
                                Best For
                              </p>
                              <p className="text-sm">{tool.bestFor}</p>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                              <p className="text-xs font-medium text-forest-600 uppercase tracking-wide mb-1">
                                Our Verdict
                              </p>
                              <p className="text-sm">{tool.verdict}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How to Choose */}
          <section className="py-12 border-t border-forest-100 bg-forest-50/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-6 font-display">
                  How to Choose the Right Tool
                </h2>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-forest-500 text-white flex items-center justify-center">
                      <Icon icon={Clock01Icon} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        If You Want Results Fast
                      </h3>
                      <p className="text-muted-foreground">
                        Choose <strong>NoReply</strong>. AI handles the legal
                        research and letter writing in minutes. Best for
                        professional, legally-backed complaints without spending
                        hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-forest-500 text-white flex items-center justify-center">
                      <Icon icon={CreditCardIcon} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        If Budget Is Your Priority
                      </h3>
                      <p className="text-muted-foreground">
                        Choose <strong>Resolver</strong> or{" "}
                        <strong>Citizens Advice templates</strong>. Both are
                        completely free, though you&apos;ll do more work
                        yourself.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-forest-500 text-white flex items-center justify-center">
                      <Icon icon={CustomerService01Icon} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        If It&apos;s a Simple Complaint
                      </h3>
                      <p className="text-muted-foreground">
                        <strong>Resolver</strong> or <strong>DIY</strong> may be
                        sufficient. For straightforward issues like late
                        deliveries, a basic template often works.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-forest-500 text-white flex items-center justify-center">
                      <Icon icon={AiMagicIcon} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        If It&apos;s a Complex Dispute
                      </h3>
                      <p className="text-muted-foreground">
                        Choose <strong>NoReply</strong>. Complex cases involving
                        multiple issues, significant money, or stubborn
                        companies need properly researched legal arguments.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-forest-500 text-white flex items-center justify-center">
                      <Icon icon={Globe02Icon} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        If You Want to Learn Your Rights
                      </h3>
                      <p className="text-muted-foreground">
                        <strong>Which?</strong> has excellent educational
                        content. Their guides explain consumer law in depth,
                        though full access requires membership.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12 border-t border-forest-100">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-6 font-display">
                  Frequently Asked Questions
                </h2>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-1">
                    <AccordionTrigger>
                      What is the best complaint letter generator UK?
                    </AccordionTrigger>
                    <AccordionContent>
                      For most UK consumers, NoReply offers the best combination
                      of AI-powered letter generation, legal research, and
                      company intelligence. It creates professional,
                      legally-backed complaints in minutes. For free alternatives,
                      Resolver offers complaint tracking and escalation paths.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2">
                    <AccordionTrigger>
                      Is there a free complaint letter generator?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes. Resolver is completely free and offers template
                      letters with complaint tracking. Citizens Advice provides
                      free basic templates. NoReply also offers a free tier with
                      one case included. Which? has some free templates but full
                      access requires membership.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3">
                    <AccordionTrigger>
                      Can AI write a complaint letter?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes. Tools like NoReply use AI to analyze your situation,
                      research applicable consumer laws, and generate
                      professionally structured complaint letters. This is more
                      effective than generic templates because the AI tailors
                      the legal arguments to your specific case.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-4">
                    <AccordionTrigger>
                      What should a UK complaint letter include?
                    </AccordionTrigger>
                    <AccordionContent>
                      A good UK complaint letter should include: your details
                      and the company&apos;s, a clear description of the issue,
                      reference to the relevant consumer law (e.g., Consumer
                      Rights Act 2015), what resolution you&apos;re seeking, a
                      deadline for response, and any evidence references.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-5">
                    <AccordionTrigger>
                      How effective are complaint letter generators?
                    </AccordionTrigger>
                    <AccordionContent>
                      Professional complaint letters citing relevant consumer
                      laws are significantly more effective than vague
                      complaints. Companies are legally obligated to respond to
                      complaints that correctly cite their statutory obligations.
                      AI-powered tools that research the applicable laws tend to
                      produce better results than generic templates.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-16 bg-forest-500">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-display">
                Ready to Fight Back?
              </h2>
              <p className="text-forest-100 mb-6 max-w-lg mx-auto">
                NoReply creates professional, AI-powered complaint letters in
                minutes. Try it free with your first case.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="coral" size="lg">
                  <Link href="/new">Start Free Complaint</Link>
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
