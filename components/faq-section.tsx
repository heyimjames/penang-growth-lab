"use client"

import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

const faqs = [
  {
    question: "Is NoReply free to use?",
    answer:
      "You can start a case and see what we find for free. We offer a free tier with basic features, and premium plans for unlimited cases, priority support, and advanced features like executive contact lookup and escalation tracking.",
  },
  {
    question: "Will companies actually take my AI-generated letter seriously?",
    answer:
      "Absolutely. Our letters are indistinguishable from those written by professional complaints handlers. They cite specific laws, reference your statutory rights, and follow the same structure used by consumer advocates. Companies respond to well-structured complaints that demonstrate knowledge of their legal obligations - which is exactly what we provide.",
  },
  {
    question: "Can I edit the letter before sending it?",
    answer:
      "Yes. You have full control over your letter. Review it, make any changes you want, and only send when you're completely happy. We generate the draft - you own the final version.",
  },
  {
    question: "What types of complaints can you help with?",
    answer:
      "We help with most UK consumer complaints: faulty products, service issues, flight delays, subscription cancellations, utility problems, landlord disputes, insurance claims, and more. If you've paid for something and didn't get what you were promised, we can probably help.",
  },
  {
    question: "What if the company doesn't respond?",
    answer:
      "Your complaint letter includes a deadline for response and references the relevant consumer laws. If they don't respond, you can escalate to the relevant ombudsman or regulatory body - we'll include their details in your case. Many companies respond quickly once they see a professionally structured complaint citing specific regulations.",
  },
  {
    question: "Is this legal advice?",
    answer:
      "NoReply is a consumer advocacy tool, not a law firm. We provide information about your consumer rights and help you communicate effectively with companies. For complex legal disputes or court proceedings, we recommend consulting a qualified solicitor.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your complaint details are encrypted and never shared with third parties. We don't sell your data. You can delete your account and all associated data at any time.",
  },
  {
    question: "Do I need legal knowledge to use this?",
    answer:
      "Not at all. Just describe your problem in plain English. Our AI handles the legal research, finds applicable regulations, and structures your complaint professionally.",
  },
]

function SectionNumber({ current, total }: { current: string; total: string }) {
  return (
    <div className="text-xs text-forest-400 font-mono tracking-widest mb-8">
      [ {current} / {total} ]
    </div>
  )
}

export function FAQSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionNumber current="06" total="06" />
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground font-display">
            FAQs
          </h2>
          <p className="text-lg text-muted-foreground">
            If you can't find the answer to your question below, email us at{" "}
            <a
              href="mailto:hello@usenoreply.com"
              className="text-forest-600 hover:underline"
            >
              hello@usenoreply.com
            </a>
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            onValueChange={(value) => {
              if (value) {
                const index = parseInt(value.replace("item-", ""), 10)
                const faq = faqs[index]
                if (faq) {
                  trackEvent(AnalyticsEvents.NAVIGATION.FAQ_EXPANDED, {
                    question: faq.question,
                    faq_index: index,
                    location: "landing_page",
                  })
                }
              }
            }}
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/faq">
                View All FAQs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
