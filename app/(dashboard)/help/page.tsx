"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  HelpCircle,
  Headphones,
  Mail,
  FileText,
  CheckCircle,
  ArrowRight,
  MessageCircleQuestion,
} from "lucide-react"

const quickLinks = [
  {
    title: "Getting Started",
    description: "Learn the basics of creating your first case",
    icon: BookOpen,
    href: "#getting-started",
  },
  {
    title: "FAQs",
    description: "Answers to commonly asked questions",
    icon: HelpCircle,
    href: "/faq",
  },
  {
    title: "Contact Support",
    description: "Get help from our team",
    icon: Headphones,
    href: "mailto:hello@usenoreply.com",
  },
]

const guides = [
  {
    title: "How to Create a Case",
    description: "Step-by-step guide to filing your first complaint",
    time: "3 min read",
  },
  {
    title: "Understanding Your Rights",
    description: "Overview of UK consumer protection laws",
    time: "5 min read",
  },
  {
    title: "Uploading Evidence",
    description: "Best practices for documenting your case",
    time: "2 min read",
  },
  {
    title: "Sending Your Letter",
    description: "How to deliver your complaint effectively",
    time: "2 min read",
  },
]

const faqs = [
  {
    question: "How long does it take to generate a letter?",
    answer: "Most letters are generated within 1-2 minutes. Complex cases with multiple issues may take slightly longer as we research relevant laws and regulations.",
  },
  {
    question: "Can I edit the generated letter?",
    answer: "Yes! All generated letters can be fully edited before sending. We recommend reviewing the letter to add any personal details or specific circumstances.",
  },
  {
    question: "What happens after I send my letter?",
    answer: "Companies typically respond within 14-28 days. You can track your case status in the dashboard and we'll help you with follow-up steps if needed.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level encryption and never share your personal information. Your case data is stored securely and only accessible to you.",
  },
]

export default function HelpPage() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
          Help & Support
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Find answers, learn how to use NoReply, or get in touch with our support team.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickLinks.map((link) => (
          <Link key={link.title} href={link.href}>
            <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border-forest-200 dark:border-forest-800">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-900/50 text-forest-600 dark:text-forest-400 flex items-center justify-center mb-2">
                  <link.icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-base">{link.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{link.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Getting Started Section */}
      <section id="getting-started" className="scroll-mt-20">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Getting Started</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Card className="border-forest-200 dark:border-forest-800">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-forest-500 text-white flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Describe Your Issue</h3>
                  <p className="text-sm text-muted-foreground">
                    Tell us what happened in your own words. Include details like dates, amounts, and what you've already tried.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-forest-500 text-white flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Upload Evidence</h3>
                  <p className="text-sm text-muted-foreground">
                    Add receipts, screenshots, emails, or any documentation that supports your case. The more evidence, the stronger your position.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-forest-500 text-white flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Review & Send</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll research your rights and generate a professional letter. Review it, make any edits, and send it to the company.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button asChild variant="coral" className="w-full sm:w-auto">
                  <Link href="/new">
                    Start Your First Complaint
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Guides Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Guides</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {guides.map((guide) => (
            <Card key={guide.title} className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-lavender-100 dark:bg-lavender-900/50 text-lavender-600 dark:text-lavender-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-[18px] h-[18px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate">{guide.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{guide.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{guide.time}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Frequently Asked Questions</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2 flex items-start gap-2">
                  <MessageCircleQuestion className="w-[18px] h-[18px] text-peach-500 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground pl-6">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Button asChild variant="outline">
            <Link href="/faq">
              View All FAQs
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Still Need Help?</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Card className="bg-forest-50/50 dark:bg-forest-900/20 border-forest-200 dark:border-forest-800">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-forest-500 text-white flex items-center justify-center flex-shrink-0">
                <Headphones className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-foreground text-lg mb-1">Contact Our Support Team</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Can't find what you're looking for? Our team is here to help with any questions about your case or the platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="default">
                    <a href="mailto:hello@usenoreply.com">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Support
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Trust indicators */}
      <section className="pt-4">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-forest-500" />
            <span>Typically responds within 24 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-forest-500" />
            <span>UK-based support team</span>
          </div>
        </div>
      </section>
    </div>
  )
}
