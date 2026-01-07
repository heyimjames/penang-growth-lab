import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Icon } from "@/lib/icons"
import { ArrowRight01Icon, Target01Icon, CheckmarkCircle01Icon } from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us – Our Mission to Help Consumers Fight Back",
  description: "NoReply empowers UK consumers to stand up against companies that ignore them. Learn how our AI-powered platform helps you get refunds, compensation, and the resolution you deserve.",
  keywords: [
    "about NoReply",
    "consumer advocacy UK",
    "complaint letter service",
    "AI consumer rights",
    "UK consumer protection",
    "fight back against companies",
  ],
  openGraph: {
    title: "About NoReply – Helping Consumers Get Heard",
    description: "We believe everyone deserves to be heard. When companies ignore your complaints, we give you the tools to be taken seriously.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About NoReply – Helping Consumers Get Heard",
    description: "We believe everyone deserves to be heard. When companies ignore your complaints, we give you the tools to be taken seriously.",
  },
}

const values = [
  {
    icon: Target01Icon,
    title: "Consumer First",
    description: "Every feature we build starts with one question: does this help consumers get better outcomes?",
  },
  {
    icon: KnightShieldIcon,
    title: "Privacy by Design",
    description: "Your complaint data is encrypted and never shared. We don't sell your information to anyone.",
  },
  {
    icon: CheckmarkCircle01Icon,
    title: "AI for Good",
    description: "We use AI to level the playing field, giving individuals the same tools that corporations have.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-forest-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-foreground font-hero mb-6" style={{ fontSize: 'clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem)' }}>
                Helping Consumers <span className="text-peach-500">Get Heard.</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed" style={{ fontSize: 'clamp(1.125rem, 1rem + 0.625vw, 1.375rem)' }}>
                We believe everyone deserves to be heard. When companies ignore your complaints,
                we give you the tools to be taken seriously.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 md:py-24 border-b border-forest-100">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground font-display mb-6">
                  Why We Built This
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We&apos;ve all been there. A flight gets cancelled. A product arrives broken.
                    A company takes your money and stops responding. You spend hours on hold,
                    write angry emails, and get nowhere.
                  </p>
                  <p>
                    The problem isn&apos;t your complaint - it&apos;s how it&apos;s presented.
                    Companies have legal teams and carefully worded policies.
                    When you respond with frustration, they ignore you.
                  </p>
                  <p>
                    NoReply changes that. Our AI researches your consumer rights, identifies
                    the specific laws that protect you, and generates professional complaint
                    letters that companies have to take seriously.
                  </p>
                  <p className="font-medium text-foreground">
                    We&apos;re not lawyers, and we&apos;re not here to replace them. We&apos;re here
                    to help you stand up for yourself.
                  </p>
                </div>
              </div>
              <div className="bg-forest-50 rounded-lg p-8 border border-forest-100">
                <blockquote className="text-lg text-foreground italic mb-4">
                  &ldquo;I was ready to give up on my £450 refund. NoReply turned my rambling
                  complaint into a professional letter citing the Consumer Rights Act.
                  I got a full refund in 5 days.&rdquo;
                </blockquote>
                <div className="text-sm text-muted-foreground">
                  — Sarah M., London
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why NoReply */}
        <section className="py-16 md:py-24 border-b border-forest-100 bg-peach-50 dark:bg-peach-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground font-display mb-6">
                Why &ldquo;NoReply&rdquo;?
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  You know those emails from <span className="font-mono text-sm bg-forest-100 dark:bg-forest-900 px-2 py-1 rounded">noreply@company.com</span>?
                </p>
                <p>
                  Companies use &ldquo;noreply&rdquo; addresses to send you bills, receipts, and terms changes &mdash;
                  but conveniently make it impossible to respond. It&apos;s a one-way conversation where
                  they talk <em>at</em> you, not <em>with</em> you.
                </p>
                <p>
                  Our name is a wink to that reality. When companies think they don&apos;t have to reply to you,
                  we help you send them something they can&apos;t ignore.
                </p>
                <p className="font-medium text-foreground">
                  They said &ldquo;no reply.&rdquo; We say otherwise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 border-b border-forest-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-display mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value) => (
                <div key={value.title} className="bg-white p-6 rounded-lg border border-forest-100">
                  <Icon icon={value.icon} size={28} color="currentColor" className="text-forest-500 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground font-display mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-forest-500">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-white mb-6 font-hero" style={{ fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem)' }}>
                Ready to Get Results?
              </h2>
              <p className="text-forest-100 mb-8" style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)' }}>
                Start your free complaint today. No credit card required.
              </p>
              <Button
                size="lg"
                asChild
                variant="coral"
                className="px-8 h-12 font-medium"
              >
                <Link href="/new" className="flex items-center">
                  Start Your Free Complaint
                  <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
