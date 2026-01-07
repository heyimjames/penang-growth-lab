import { Metadata } from "next"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQs – Common Questions About Consumer Rights & NoReply",
  description:
    "Get answers to common questions about NoReply and UK consumer rights. Learn how AI-powered complaint letters work, what types of issues we help with, and how to get refunds and compensation.",
  keywords: [
    "NoReply FAQ",
    "consumer complaints help",
    "UK consumer rights questions",
    "complaint letter generator FAQ",
    "how to get refund UK",
    "consumer advocacy help",
    "Consumer Rights Act explained",
    "how to complain to a company UK",
    "AI complaint letter questions",
  ],
  openGraph: {
    title: "Frequently Asked Questions | NoReply",
    description:
      "Get answers to common questions about NoReply and UK consumer rights.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FAQs | NoReply",
    description: "Common questions about consumer rights and our AI-powered platform.",
  },
}

const faqCategories = [
  {
    title: "Getting Started",
    id: "getting-started",
    faqs: [
      {
        question: "What is NoReply?",
        answer:
          "NoReply is an AI-powered consumer advocacy platform that helps UK consumers create professional complaint letters and get resolution from companies. We research your rights, find the relevant laws, identify the best contacts at the company, and generate a legally-informed complaint letter - all in minutes.",
      },
      {
        question: "Is NoReply free to use?",
        answer:
          "You can start a case and see what we find for free. We offer a free tier with basic features, and premium plans for unlimited cases, priority support, and advanced features like executive contact lookup and escalation tracking.",
      },
      {
        question: "Do I need to create an account?",
        answer:
          "Yes, you'll need to create a free account to use NoReply. This allows us to save your cases, track company responses, and provide a secure environment for your complaint details. You can sign up with email or Google.",
      },
      {
        question: "How long does it take to generate a complaint letter?",
        answer:
          "Most cases are analysed and letters generated within 2-3 minutes. Complex cases involving multiple issues or extensive research may take slightly longer. You'll see real-time progress as we research your rights.",
      },
      {
        question: "Can I use NoReply on my phone?",
        answer:
          "Yes, NoReply is fully responsive and works on smartphones, tablets, and desktop computers. You can start a case on your phone during your commute and finish it on your laptop at home.",
      },
    ],
  },
  {
    title: "How It Works",
    id: "how-it-works",
    faqs: [
      {
        question: "What types of complaints can you help with?",
        answer:
          "We help with most UK consumer complaints including: faulty products and refunds, service issues, flight delays and cancellations, subscription cancellations, utility problems, landlord disputes, insurance claims, delivery failures, warranty issues, and more. If you've paid for something and didn't get what you were promised, we can probably help.",
      },
      {
        question: "Can I use NoReply for any company?",
        answer:
          "Yes, NoReply works with any UK-based company or any company that sold you goods or services in the UK. This includes online retailers, airlines, utilities, telecoms, landlords, subscription services, and more.",
      },
      {
        question: "How does NoReply find company contact information?",
        answer:
          "We maintain a database of company complaint departments, executive contacts, and regulatory bodies. When you name a company, we automatically find the most effective contact channels for your complaint. For premium users, we also identify executive escalation contacts for faster resolution.",
      },
      {
        question: "What consumer laws does NoReply reference?",
        answer:
          "Our AI references the Consumer Rights Act 2015, Consumer Contracts Regulations 2013, Sale of Goods Act, Package Travel Regulations, and relevant EU regulations that still apply in the UK (like EC 261 for flights). We automatically identify which laws apply to your specific situation.",
      },
      {
        question: "Can I edit the letter before sending it?",
        answer:
          "Absolutely. You have full control over your letter. Review it, make any changes you want, add personal details, and only send when you're completely happy. We generate the draft - you own the final version.",
      },
      {
        question: "How do I send the letter once it's generated?",
        answer:
          "You can copy your letter and send it via email, or print it to send by post. We provide the company's contact details including email addresses and postal addresses. For best results, we recommend sending via email and keeping a copy for your records.",
      },
    ],
  },
  {
    title: "Success & Results",
    id: "success-results",
    faqs: [
      {
        question: "Will companies actually take my AI-generated letter seriously?",
        answer:
          "Yes. Our letters are indistinguishable from those written by professional complaints handlers. They cite specific laws, reference your statutory rights, and follow the same structure used by consumer advocates. Companies respond to well-structured complaints that demonstrate knowledge of their legal obligations - which is exactly what we provide.",
      },
      {
        question: "What's your success rate?",
        answer:
          "While we can't guarantee outcomes (every case is different), users who send NoReply-generated letters typically see response rates of over 80% within the deadline period. Many users report successful resolutions including refunds, compensation, and service corrections.",
      },
      {
        question: "What if the company doesn't respond?",
        answer:
          "Your complaint letter includes a deadline for response (usually 14 days) and references the relevant consumer laws. If they don't respond, you can escalate to the relevant ombudsman or regulatory body - we include their details in your case. Many companies respond quickly once they see a professionally structured complaint citing specific regulations.",
      },
      {
        question: "Can you guarantee I'll get a refund or compensation?",
        answer:
          "We can't guarantee specific outcomes as each case depends on its circumstances and the company's response. What we can guarantee is that you'll have a professionally structured, legally-informed complaint that gives you the best possible chance of success.",
      },
      {
        question: "What if my complaint is rejected?",
        answer:
          "If the company rejects your complaint, we'll help you understand your escalation options. This might include the relevant ombudsman, trading standards, or in some cases, small claims court. Premium users get guidance on next steps and escalation letter templates.",
      },
    ],
  },
  {
    title: "Legal & Compliance",
    id: "legal",
    faqs: [
      {
        question: "Is this legal advice?",
        answer:
          "NoReply is a consumer advocacy tool, not a law firm. We provide information about your consumer rights and help you communicate effectively with companies. For complex legal disputes, court proceedings, or situations where significant sums are at stake, we recommend consulting a qualified solicitor.",
      },
      {
        question: "Are the letters legally binding?",
        answer:
          "Our letters are formal complaints citing your legal rights - they're not legal documents like contracts. However, they do create a paper trail and put the company on notice of their legal obligations, which can be valuable evidence if you need to escalate to an ombudsman or court.",
      },
      {
        question: "Can NoReply help with court claims?",
        answer:
          "We help with pre-court complaints and can provide information about the small claims process. However, for actual court proceedings, you should consult a solicitor or use resources like Citizens Advice. Our complaint letters can serve as evidence of your attempts to resolve the matter.",
      },
      {
        question: "Do I need legal knowledge to use NoReply?",
        answer:
          "Not at all. Just describe your problem in plain English - tell us what happened and what you want. Our AI handles the legal research, finds applicable regulations, and structures your complaint professionally. We translate consumer law into everyday language.",
      },
    ],
  },
  {
    title: "Privacy & Security",
    id: "privacy",
    faqs: [
      {
        question: "Is my data secure?",
        answer:
          "Yes. Your complaint details are encrypted in transit and at rest. We use industry-standard security practices and never share your data with third parties. Your information is only used to generate your complaint letters and improve our service.",
      },
      {
        question: "Will companies know I used AI to write my letter?",
        answer:
          "No. There's nothing in our letters that identifies them as AI-generated. They read like professionally written complaints because that's exactly what they are - the AI is trained on effective complaint letter formats and consumer advocacy best practices.",
      },
      {
        question: "Do you store my documents and evidence?",
        answer:
          "We store case details securely so you can access them later and track responses. Any documents you upload (receipts, contracts, etc.) are encrypted and only accessible to you. You can delete your data at any time from your account settings.",
      },
      {
        question: "Do you sell my data?",
        answer:
          "No, never. We don't sell, share, or monetize your personal data. Our business model is based on subscriptions, not data harvesting. Your complaint details are used solely to help you resolve your issue.",
      },
      {
        question: "Can I delete my account and data?",
        answer:
          "Yes. You can delete your account and all associated data at any time from your account settings. We'll remove all your cases, letters, and personal information from our systems.",
      },
    ],
  },
  {
    title: "Pricing & Plans",
    id: "pricing",
    faqs: [
      {
        question: "What's included in the free tier?",
        answer:
          "The free tier includes basic case creation, AI-powered rights analysis, and complaint letter generation. It's perfect for one-off complaints. Premium features like executive contacts, escalation tracking, and unlimited cases require a subscription.",
      },
      {
        question: "What do premium plans include?",
        answer:
          "Premium plans include unlimited cases, executive contact lookup for faster resolution, escalation letter templates, priority AI processing, response tracking and reminders, and dedicated support. Check our pricing page for current plan details.",
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer:
          "Yes. You can cancel your subscription at any time with no cancellation fees. You'll retain access to premium features until the end of your billing period, and your cases and letters remain accessible.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "Yes. If you're not satisfied with NoReply within the first 14 days of your subscription, contact us for a full refund. We want you to be completely happy with the service.",
      },
    ],
  },
  {
    title: "Specific Complaint Types",
    id: "complaint-types",
    faqs: [
      {
        question: "Can you help with flight delay compensation?",
        answer:
          "Yes. We specialise in EC 261 flight compensation claims. If your flight was delayed over 3 hours, cancelled, or you were denied boarding, you may be entitled to up to £520 compensation. We'll check if your flight qualifies and generate the appropriate claim letter.",
      },
      {
        question: "What about faulty product refunds?",
        answer:
          "Absolutely. Under the Consumer Rights Act 2015, goods must be of satisfactory quality, fit for purpose, and as described. If your product is faulty, you have the right to a refund within 30 days, or a repair/replacement after that. We'll cite the specific sections that apply to your case.",
      },
      {
        question: "Can you help cancel difficult subscriptions?",
        answer:
          "Yes. Many users come to us frustrated by companies making cancellation difficult. We'll help you exercise your cancellation rights, including cooling-off periods and dealing with companies that ignore cancellation requests.",
      },
      {
        question: "Do you help with landlord disputes?",
        answer:
          "We can help with many landlord issues including deposit disputes, repair obligations, and unlawful eviction concerns. We reference the Housing Act, Tenant Fees Act, and relevant tenancy regulations. For complex housing matters, you may also want to contact Shelter.",
      },
      {
        question: "What about utility company complaints?",
        answer:
          "Yes. We help with energy suppliers, water companies, and telecoms. If you've been overcharged, experienced service failures, or had billing issues, we'll identify the relevant regulations and ombudsman schemes for escalation if needed.",
      },
    ],
  },
]

// Generate JSON-LD structured data for FAQs
function generateFAQStructuredData() {
  const allFaqs = faqCategories.flatMap((category) => category.faqs)
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export default function FAQPage() {
  const structuredData = generateFAQStructuredData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b border-forest-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-foreground mb-6 font-hero" style={{ fontSize: 'clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem)' }}>
                Frequently Asked Questions
              </h1>
              <p className="text-muted-foreground mb-8" style={{ fontSize: 'clamp(1.125rem, 1rem + 0.625vw, 1.375rem)' }}>
                Everything you need to know about using NoReply to resolve your
                consumer complaints. Can't find your answer?{" "}
                <a
                  href="mailto:hello@usenoreply.com"
                  className="text-forest-600 hover:underline"
                >
                  Contact us
                </a>
                .
              </p>

              {/* Quick Navigation */}
              <div className="flex flex-wrap justify-center gap-2">
                {faqCategories.map((category) => (
                  <a
                    key={category.id}
                    href={`#${category.id}`}
                    className="px-4 py-2 text-sm font-medium text-forest-600 bg-forest-50 hover:bg-forest-100 rounded-full transition-colors"
                  >
                    {category.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-16">
              {faqCategories.map((category) => (
                <div key={category.id} id={category.id} className="scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 font-display">
                    {category.title}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-forest-50 dark:bg-forest-900/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 font-display">
                Ready to Get Your Issue Resolved?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of UK consumers who've successfully resolved their
                complaints with NoReply.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/new">
                    Start Your Complaint
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl font-bold tracking-tight mb-4 font-display">
                Still Have Questions?
              </h2>
              <p className="text-muted-foreground mb-6">
                Our team is here to help. Reach out and we'll get back to you as
                soon as possible.
              </p>
              <a
                href="mailto:hello@usenoreply.com"
                className="inline-flex items-center text-forest-600 hover:underline font-medium"
              >
                hello@usenoreply.com
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
