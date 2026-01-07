"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TrustedByCarousel } from "@/components/trusted-by-carousel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Icon } from "@/lib/icons"
import {
  Tick01Icon,
  Loading03Icon,
  ArrowRight01Icon,
  CreditCardIcon,
  Time02Icon,
  ZapIcon,
  File01Icon,
  Rocket01Icon,
  MessageQuestionIcon,
  LockIcon,
  LegalDocument01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"
import { toast } from "sonner"
import { PRICE_IDS } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

const pricingPlans = [
  {
    id: "free",
    name: "Free",
    subtitle: "For trying out NoReply",
    price: "0",
    period: "forever",
    cta: "Start Free",
    ctaVariant: "outline" as const,
    priceId: null,
    features: [
      "1 free complaint case",
      "AI-powered letter generation",
      "Company research & intel",
      "Basic evidence analysis",
      "Email support",
    ],
  },
  {
    id: "payg",
    name: "Pay As You Go",
    subtitle: "For individuals with occasional disputes",
    price: "2.99",
    period: "per complaint",
    cta: "Buy 1 Credit",
    ctaVariant: "coral" as const,
    priceId: PRICE_IDS.SINGLE_CASE,
    highlighted: true,
    features: [
      "Everything in Free",
      "Priority AI processing",
      "Video & image evidence analysis",
      "Deep legal research",
      "30-day case history",
      "No subscription required",
    ],
  },
  {
    id: "bundle",
    name: "Bundle",
    subtitle: "For families and frequent complainers",
    price: "9.99",
    period: "for 5 complaints",
    originalPrice: "14.95",
    cta: "Buy 5 Credits",
    ctaVariant: "default" as const,
    priceId: PRICE_IDS.CASE_BUNDLE,
    features: [
      "Everything in Pay As You Go",
      "90-day case history",
      "Priority support",
      "Credits never expire",
      "Share with family members",
      "Only £2.00 per complaint",
    ],
  },
]

const pricingFAQs = [
  {
    question: "How are complaints different between plans?",
    answer: "The Free plan gives you one complaint to try our service. Pay As You Go and Bundle plans include priority AI processing, advanced evidence analysis (including video), and deeper legal research. Bundle also extends your case history to 90 days.",
  },
  {
    question: "Do credits expire?",
    answer: "No, your credits never expire. Once purchased, they're yours to use whenever you need them. We don't believe in pressuring you to use credits before an arbitrary deadline.",
  },
  {
    question: "Can I share credits with family members?",
    answer: "Yes! With the Bundle plan, you can use your credits to help family members with their complaints. Each case will be stored in your account with full history.",
  },
  {
    question: "What evidence types do you support?",
    answer: "We support images (receipts, screenshots), documents (PDFs, contracts), and with paid plans, video evidence. Our AI analyzes your evidence to strengthen your complaint with specific details and references.",
  },
  {
    question: "How secure is my payment information?",
    answer: "We never see or store your card details. All payments are processed by Stripe, a PCI Level 1 certified payment processor trusted by millions of businesses including Amazon, Google, and Shopify.",
  },
  {
    question: "Can I get a refund if my complaint doesn't work?",
    answer: "While we can't guarantee company responses (that's on them!), we stand behind the quality of our AI-generated complaints. If you're unsatisfied with the letter quality, contact us within 7 days for a refund.",
  },
  {
    question: "What consumer laws does NoReply reference?",
    answer: "Our AI researches applicable UK consumer protection laws including the Consumer Rights Act 2015, Consumer Contracts Regulations, Sale of Goods Act, and sector-specific regulations. We cite the specific provisions that apply to your situation.",
  },
  {
    question: "Do you have a Microsoft Outlook / O365 integration?",
    answer: "Not yet, but it's on our roadmap! Currently, you can copy your complaint letters and paste them into any email client. We're working on direct integrations for major platforms.",
  },
]

const resourceLinks = [
  {
    title: "Security",
    description: "How we protect your data",
    href: "/security",
    icon: LockIcon,
    iconBg: "bg-teal-100 dark:bg-teal-950",
    iconColor: "text-teal-600",
  },
  {
    title: "Policies",
    description: "Terms, privacy & more",
    href: "/policies",
    icon: LegalDocument01Icon,
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-600",
  },
  {
    title: "More FAQs",
    description: "Common questions answered",
    href: "/help",
    icon: MessageQuestionIcon,
    iconBg: "bg-violet-100 dark:bg-violet-950",
    iconColor: "text-violet-600",
  },
]

function PricingSearchParamsHandler({
  user,
  checkingAuth,
  handlePurchase
}: {
  user: any
  checkingAuth: boolean
  handlePurchase: (priceId: string) => void
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const action = searchParams.get("action")
    const priceId = searchParams.get("priceId")

    if (action === "purchase" && priceId && user && !checkingAuth) {
      handlePurchase(priceId)
    }
  }, [searchParams, user, checkingAuth, handlePurchase])

  return null
}

export default function PricingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setCheckingAuth(false)
    }
    checkAuth()

    // Track pricing page view
    trackEvent(AnalyticsEvents.PRICING.PAGE_VIEWED)
  }, [])

  const handlePurchase = async (priceId: string | null) => {
    if (!priceId) {
      trackEvent(AnalyticsEvents.NAVIGATION.CTA_CLICKED, {
        button_text: "Start Free",
        location: "pricing_page",
        plan: "free",
      })
      router.push("/auth/sign-up")
      return
    }

    // Find plan info for tracking
    const plan = pricingPlans.find(p => p.priceId === priceId)
    trackEvent(AnalyticsEvents.PRICING.PURCHASE_STARTED, {
      plan_id: plan?.id,
      plan_name: plan?.name,
      price: plan?.price,
      price_id: priceId,
    })

    if (!user) {
      const returnUrl = `/pricing?action=purchase&priceId=${priceId}`
      router.push(`/auth/sign-up?redirect=${encodeURIComponent(returnUrl)}`)
      return
    }

    setIsLoading(priceId)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.error) {
        trackEvent("purchase_error", { error: data.error, price_id: priceId })
        toast.error(data.error)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Purchase error:", error)
      trackEvent("purchase_error", { error: "checkout_failed", price_id: priceId })
      toast.error("Failed to start checkout")
    } finally {
      setIsLoading(null)
    }
  }

  const handleFreePlan = () => {
    trackEvent(AnalyticsEvents.NAVIGATION.CTA_CLICKED, {
      button_text: "Start Free",
      location: "pricing_page",
      plan: "free",
    })
    if (user) {
      router.push("/new")
    } else {
      router.push("/auth/sign-up")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <Suspense fallback={null}>
        <PricingSearchParamsHandler
          user={user}
          checkingAuth={checkingAuth}
          handlePurchase={handlePurchase}
        />
      </Suspense>

      <main className="flex-1">
        {/* Hero Section with gradient background */}
        <section className="relative overflow-hidden border-b border-forest-100">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-peach-50 via-background to-lavender-50 dark:from-peach-950/20 dark:via-background dark:to-lavender-950/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-coral-200/30 rounded-full blur-3xl dark:bg-coral-900/20" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lavender-200/30 rounded-full blur-3xl dark:bg-lavender-900/20" />

          <div className="relative container mx-auto px-4 py-16 sm:py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-foreground font-hero" style={{ fontSize: 'clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem)' }}>
                Simple pricing, <span className="text-peach-500">powerful results.</span>
              </h1>
              <p className="mt-6 text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(1.125rem, 1rem + 0.625vw, 1.375rem)' }}>
                No subscriptions. No hidden fees. Pay only when you need to fight back against companies that wronged you.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "relative flex flex-col rounded-2xl bg-card p-6 sm:p-8 transition-all duration-200",
                    plan.highlighted
                      ? "border-2 border-coral shadow-xl shadow-coral/10 scale-[1.02] z-10"
                      : "border border-border hover:border-muted-foreground/30 hover:shadow-lg"
                  )}
                >
                  {/* Plan header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold font-display">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.subtitle}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold font-display tracking-tight">
                        £{plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span className="ml-2 text-lg text-muted-foreground line-through">
                          £{plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{plan.period}</p>
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant={plan.ctaVariant}
                    size="lg"
                    className={cn(
                      "w-full mb-8",
                      plan.highlighted && "shadow-md"
                    )}
                    onClick={() => plan.id === "free" ? handleFreePlan() : handlePurchase(plan.priceId)}
                    disabled={isLoading !== null || checkingAuth}
                  >
                    {isLoading !== null && isLoading === plan.priceId ? (
                      <>
                        <Icon icon={Loading03Icon} size={18} className="mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Icon
                          icon={Tick01Icon}
                          size={18}
                          className={cn(
                            "shrink-0 mt-0.5",
                            plan.highlighted ? "text-coral" : "text-forest-500"
                          )}
                        />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Icon icon={KnightShieldIcon} size={18} className="text-forest-500" />
                <span>Stripe secured payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon={Time02Icon} size={18} className="text-forest-500" />
                <span>7-day refund guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon={CreditCardIcon} size={18} className="text-forest-500" />
                <span>No recurring charges</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="py-12 sm:py-16 border-y border-forest-100 bg-forest-50/30">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground mb-8">
              Trusted by consumers fighting back against
            </p>
            <TrustedByCarousel />
          </div>
        </section>

        {/* Featured Quote */}
        <section className="py-16 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl text-peach-200 font-serif mb-4">"</div>
              <blockquote className="font-medium text-foreground leading-relaxed font-display" style={{ fontSize: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)' }}>
                I was ready to give up on my £800 refund. NoReply turned my frustrated emails into a professional letter citing specific laws. Three days later, I had a full refund and an apology.
              </blockquote>
              <div className="mt-8">
                <p className="font-semibold text-foreground">Michael Chen</p>
                <p className="text-sm text-peach-500">Got £800 refund from major retailer</p>
                <p className="text-xs text-muted-foreground mt-1">After 6 weeks of being ignored by customer service</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-forest-50/30 border-y border-forest-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-bold font-display text-center text-foreground mb-10" style={{ fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 2rem)' }}>
                Frequently asked questions
              </h2>

              <Accordion type="single" collapsible className="w-full">
                {pricingFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-forest-100">
                    <AccordionTrigger className="text-left text-base text-foreground hover:text-peach-500 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-semibold font-display text-center text-foreground mb-8" style={{ fontSize: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)' }}>
                Resources
              </h2>

              <div className="grid sm:grid-cols-3 gap-6">
                {resourceLinks.map((resource) => (
                  <Link
                    key={resource.title}
                    href={resource.href}
                    className="flex items-center gap-4 p-4 rounded-xl border border-forest-100 bg-card hover:border-forest-200 hover:shadow-md transition-all group"
                  >
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      resource.iconBg
                    )}>
                      <Icon icon={resource.icon} size={20} className={resource.iconColor} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-peach-500 transition-colors">
                        {resource.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{resource.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 sm:py-20 bg-forest-500">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <Icon icon={Rocket01Icon} size={32} className="mx-auto mb-4 text-peach-300" />
              <h2 className="text-white font-hero mb-4" style={{ fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem)' }}>
                Ready to fight back?
              </h2>
              <p className="text-forest-100 mb-8 max-w-lg mx-auto">
                Start with a free complaint to see the power of AI-backed consumer advocacy. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="coral"
                  className="px-8"
                  onClick={() => handleFreePlan()}
                >
                  Start Your Free Complaint
                  <Icon icon={ArrowRight01Icon} size={18} className="ml-2" />
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
