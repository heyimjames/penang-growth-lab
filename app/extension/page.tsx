"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ExtensionBrowserMockup } from "@/components/extension-browser-mockup"
import { Icon } from "@/lib/icons"
import {
  JusticeScale01Icon,
  MessageMultiple01Icon,
  FolderOpenIcon,
  Tick01Icon,
  Download01Icon,
  UserCircle02Icon,
  SidebarLeft01Icon,
  Rocket01Icon,
  Store01Icon,
  Airplane01Icon,
  Wifi01Icon,
  CreditCardIcon,
  Home01Icon,
  QuoteDownIcon,
  ArrowDown01Icon,
  Video01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { KnightShieldIcon } from "@hugeicons-pro/core-bulk-rounded"

const companyTypes = [
  { name: "Retailers", icon: Store01Icon, examples: "Online shops, marketplaces, electronics" },
  { name: "Airlines", icon: Airplane01Icon, examples: "Flights, holidays, travel agents" },
  { name: "Telecoms", icon: Wifi01Icon, examples: "Broadband, mobile, TV packages" },
  { name: "Finance", icon: CreditCardIcon, examples: "Banks, credit cards, buy now pay later" },
  { name: "Utilities", icon: Home01Icon, examples: "Energy, water, home services" },
  { name: "Subscriptions", icon: Video01Icon, examples: "Streaming, software, memberships" },
]

const faqs = [
  {
    question: "Is the extension free?",
    answer: "Yes! The extension is completely free to install and use. Some advanced AI features use credits from your NoReply account.",
  },
  {
    question: "Does it work on any website?",
    answer: "The extension works on any website where you're chatting with customer support. It automatically detects the type of company and shows relevant consumer rights.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We never store your chat conversations. The extension only processes data locally and syncs with your NoReply account when you explicitly save notes to a case.",
  },
  {
    question: "Do I need a NoReply account?",
    answer: "You'll need a free NoReply account to use the AI response suggestions and save notes to your cases. Legal references work without an account.",
  },
]

const features = [
  {
    icon: JusticeScale01Icon,
    title: "Instant Legal Reference",
    description:
      "Look up your consumer rights in real-time. Get relevant laws, regulations, and precedents as you chat with support.",
  },
  {
    icon: MessageMultiple01Icon,
    title: "AI Response Suggestions",
    description:
      "Paste what the company says and get AI-powered response suggestions. Choose firm, polite, or escalation tones.",
  },
  {
    icon: FolderOpenIcon,
    title: "Complaint Context at Hand",
    description:
      "Access your NoReply complaints directly in the sidebar. Reference your evidence and letter points during conversations.",
  },
]

const steps = [
  {
    number: "01",
    icon: Download01Icon,
    title: "Install the Extension",
    description: "Add NoReply to Chrome with one click. It's free and takes seconds.",
  },
  {
    number: "02",
    icon: UserCircle02Icon,
    title: "Log In to Your Account",
    description: "Connect with your existing NoReply account to sync your complaints and credits.",
  },
  {
    number: "03",
    icon: SidebarLeft01Icon,
    title: "Open the Sidebar",
    description: "Click the NoReply icon when you're on a support chat or company website.",
  },
  {
    number: "04",
    icon: Rocket01Icon,
    title: "Get Real-Time Help",
    description: "Receive legal references, response suggestions, and save notes to your complaints.",
  },
]

export default function ExtensionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-10 sm:py-16 md:py-24 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-forest-50 via-background to-coral-50/30" />
          <div className="absolute inset-0 bg-dots-subtle" />

          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Copy */}
              <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-forest-600 bg-forest-100 px-3 py-1.5 rounded-full">
                  <Icon icon={KnightShieldIcon} size={14} />
                  Chrome Extension
                </div>

                <h1 className="text-foreground font-hero" style={{ fontSize: 'clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem)' }}>
                  Fight Back.{" "}
                  <span className="text-peach-500">Right Where You Need It.</span>
                </h1>

                <p className="text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ fontSize: 'clamp(1.125rem, 1rem + 0.625vw, 1.375rem)' }}>
                  Get real-time legal guidance and AI-powered response suggestions during live chats with companies.
                  Your rights, always at hand.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    variant="coral"
                    asChild
                    className="px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base font-medium w-full sm:w-auto"
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        alert("Chrome Web Store link coming soon!")
                      }}
                    >
                      <Icon icon={Download01Icon} size={18} className="mr-2" />
                      Add to Chrome - It's Free
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-forest-200 text-forest-600 hover:bg-forest-50 px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base font-medium w-full sm:w-auto"
                  >
                    <Link href="#how-it-works">
                      See How It Works
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <Icon icon={Tick01Icon} size={16} className="text-forest-500" />
                    <span>Free forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon={Tick01Icon} size={16} className="text-forest-500" />
                    <span>Syncs your complaints</span>
                  </div>
                </div>
              </div>

              {/* Right: Browser Mockup */}
              <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
                <ExtensionBrowserMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 md:py-24 border-b border-forest-100">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-foreground font-display">
                Your Secret Weapon in Every Chat
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Stop feeling unprepared when companies push back. Have everything you need right in your browser.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-forest-100 hover:border-forest-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-coral-100 text-coral-600 mb-3 sm:mb-4">
                    <Icon icon={feature.icon} size={20} className="sm:hidden" />
                    <Icon icon={feature.icon} size={24} className="hidden sm:block" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2 text-foreground font-display">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Works Everywhere */}
        <section className="py-12 sm:py-16 md:py-20 bg-coral-50/50 border-b border-forest-100">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-foreground font-display">
                Works With Any Company
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                The extension automatically detects company types and shows relevant consumer rights.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {companyTypes.map((type) => (
                <div
                  key={type.name}
                  className="p-4 sm:p-5 bg-white rounded-xl border border-forest-100 text-center hover:border-coral-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-coral-100 text-coral-600 mx-auto mb-3">
                    <Icon icon={type.icon} size={20} className="sm:hidden" />
                    <Icon icon={type.icon} size={24} className="hidden sm:block" />
                  </div>
                  <p className="font-semibold text-sm sm:text-base text-foreground mb-1">{type.name}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{type.examples}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-12 sm:py-16 md:py-24 bg-forest-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-foreground font-display">
                How It Works
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Get set up in under a minute. No technical skills required.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative p-3 sm:p-4 md:p-6 bg-white rounded-xl sm:rounded-2xl border border-forest-100"
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-forest-100 mb-2 sm:mb-4 font-display">
                    {step.number}
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-forest-500 text-white mb-2 sm:mb-4">
                    <Icon icon={step.icon} size={16} className="sm:hidden" />
                    <Icon icon={step.icon} size={20} className="hidden sm:block" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 text-foreground font-display">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-12 sm:py-16 md:py-20 border-b border-forest-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Icon icon={QuoteDownIcon} size={40} className="text-coral-300 mx-auto mb-6" />
              <blockquote className="text-lg sm:text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-6">
                "I was on live chat with my broadband provider and they kept saying no to my refund request.
                I opened NoReply, saw I had rights under Ofcom regulations, and used the suggested response.
                Got my £120 back within 10 minutes."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-forest-100 flex items-center justify-center">
                  <span className="text-forest-600 font-semibold text-sm sm:text-base">JT</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-sm sm:text-base">James T.</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Manchester, UK</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 sm:py-16 md:py-24 bg-forest-50/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-foreground font-display">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Everything you need to know about the NoReply extension.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group p-4 sm:p-5 bg-white rounded-xl border border-forest-100 hover:border-forest-200 transition-colors"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-semibold text-sm sm:text-base text-foreground pr-4">
                      {faq.question}
                    </span>
                    <span className="shrink-0 text-forest-400 group-open:rotate-180 transition-transform">
                      <Icon icon={ArrowDown01Icon} size={18} />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Already a User CTA */}
        <section className="py-12 sm:py-16 md:py-24 bg-forest-500">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-white mb-6 font-hero" style={{ fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem)' }}>
                Ready to Fight Smarter?
              </h2>
              <p className="text-forest-100 mb-6 sm:mb-8" style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)' }}>
                Add the extension to Chrome and start getting real-time help in your next support conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  variant="coral"
                  asChild
                  className="px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base font-medium w-full sm:w-auto"
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      alert("Chrome Web Store link coming soon!")
                    }}
                  >
                    <Icon icon={Download01Icon} size={18} className="mr-2" />
                    Add to Chrome
                  </a>
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="bg-white hover:bg-forest-100 text-forest-700 px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base font-medium w-full sm:w-auto"
                >
                  <Link href="/auth/login">
                    Already have NoReply? Sign in
                  </Link>
                </Button>
              </div>
              <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-forest-200">
                Your complaints and credits sync automatically when you log in.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
