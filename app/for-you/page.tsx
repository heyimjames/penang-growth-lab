import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  Airplane01Icon,
  ShoppingBag01Icon,
  Home01Icon,
  Car01Icon,
  CreditCardIcon,
  Wifi01Icon,
  HeartbreakIcon,
  CheckmarkSquare01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "This Is For You – Been Wronged by a Company?",
  description: "NoReply is for anyone who's been ignored, fobbed off, or wronged by a company. Flight cancelled? Product broken? Deposit stolen? You have more power than you think.",
  keywords: [
    "company complaint",
    "ignored by company",
    "get refund UK",
    "flight cancelled help",
    "landlord dispute",
    "consumer rights help",
    "wronged by company",
  ],
  openGraph: {
    title: "Been Wronged by a Company? This Is For You.",
    description: "NoReply is for anyone who's been ignored, fobbed off, or wronged by a company. You have more power than you think.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Been Wronged by a Company? This Is For You.",
    description: "NoReply is for anyone who's been ignored or wronged by a company. You have more power than you think.",
  },
}

const situations = [
  {
    icon: Airplane01Icon,
    title: "Your holiday was ruined",
    description: "Flight cancelled with no compensation. Hotel nothing like the pictures. Travel company won't return your calls.",
  },
  {
    icon: ShoppingBag01Icon,
    title: "You got ripped off",
    description: "Product arrived broken. Refund denied. Company keeps passing you between departments until you give up.",
  },
  {
    icon: Home01Icon,
    title: "Your landlord took advantage",
    description: "Deposit unfairly withheld. Repairs never done. Eviction threats when you complained.",
  },
  {
    icon: Car01Icon,
    title: "The garage lied to you",
    description: "Car problems hidden from you. Unnecessary repairs charged. Warranty claim rejected without reason.",
  },
  {
    icon: CreditCardIcon,
    title: "The bank won't listen",
    description: "Unfair charges that don't make sense. PPI never refunded. Loan terms that weren't what you agreed to.",
  },
  {
    icon: Wifi01Icon,
    title: "Your provider trapped you",
    description: "Service that never works. Contract you can't escape. Price increases you never agreed to.",
  },
]

const truths = [
  "You're not being difficult - you're being reasonable",
  "Your complaint isn't too small to matter",
  "You don't need to be a legal expert",
  "You deserve a proper response, not a template email",
  "It's not about the money - it's about being treated fairly",
  "You have the right to be taken seriously",
]

export default function ForYouPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-forest-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-peach-500 uppercase tracking-wide mb-4">
                This is for you
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-foreground font-hero mb-6">
                You've Been Let Down.<br />
                <span className="text-peach-500">You're Not Powerless.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                If you&apos;ve ever walked away from a bad experience thinking &ldquo;there&apos;s nothing I can do&rdquo;
                - you&apos;re not alone. Millions of people are wronged by companies every year and never fight back.
                Not because they don&apos;t deserve justice, but because they don&apos;t know where to start.
              </p>
              <p className="text-xl text-foreground font-medium">
                That&apos;s why we built NoReply.
              </p>
            </div>
          </div>
        </section>

        {/* You're not alone */}
        <section className="py-16 md:py-24 border-b border-forest-100 bg-forest-50/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display mb-4">
                Sound Familiar?
              </h2>
              <p className="text-lg text-muted-foreground">
                These stories come from real people who felt stuck. People who spent hours on hold,
                wrote emails that went unanswered, and wondered if it was worth the fight.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {situations.map((situation) => (
                <div
                  key={situation.title}
                  className="p-6 bg-white border border-forest-100 rounded-lg hover:border-forest-200 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-peach-50 flex items-center justify-center mb-4">
                    <Icon icon={situation.icon} size={24} color="currentColor" className="text-peach-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground font-display mb-2">
                    {situation.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {situation.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The problem */}
        <section className="py-16 md:py-24 border-b border-forest-100">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display mb-6">
                  Companies Count on You Giving Up
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Here&apos;s the uncomfortable truth: when you complain, most companies aren&apos;t trying to help you.
                    They&apos;re trying to make you go away.
                  </p>
                  <p>
                    They use hold times, template responses, and endless department transfers as weapons.
                    They know that most people will eventually give up - and they&apos;re counting on it.
                  </p>
                  <p>
                    The ones who get results? They know how to speak the language companies understand:
                    specific laws, clear deadlines, and proper escalation channels.
                  </p>
                  <p className="text-foreground font-medium">
                    That knowledge shouldn&apos;t be reserved for people who can afford lawyers.
                  </p>
                </div>
              </div>
              <div className="bg-forest-500 rounded-lg p-8 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Icon icon={HeartbreakIcon} size={24} color="currentColor" className="text-peach-300" />
                  <span className="text-sm font-semibold text-forest-100 uppercase tracking-wide">The reality</span>
                </div>
                <p className="text-3xl md:text-4xl font-bold font-display mb-4">
                  £3.4 billion
                </p>
                <p className="text-forest-100">
                  That&apos;s how much UK consumers lose to unresolved complaints every year.
                  Most of that money could be recovered - if people knew their rights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The truths */}
        <section className="py-16 md:py-24 border-b border-forest-100 bg-dots-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display mb-4">
                What We Want You to Know
              </h2>
              <p className="text-lg text-muted-foreground">
                Before you use our tools, we want you to understand something important.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="space-y-4">
                {truths.map((truth) => (
                  <div
                    key={truth}
                    className="flex items-start gap-4 p-4 bg-white border border-forest-100 rounded-lg"
                  >
                    <div className="shrink-0 mt-0.5">
                      <Icon icon={CheckmarkSquare01Icon} size={20} color="currentColor" className="text-forest-500" />
                    </div>
                    <p className="text-lg text-foreground font-medium">
                      {truth}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Who we are */}
        <section className="py-16 md:py-24 border-b border-forest-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display mb-6">
                We&apos;re On Your Side
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  NoReply was built by people who&apos;ve been exactly where you are.
                  We&apos;ve felt the frustration of being ignored, the anger of being treated unfairly,
                  and the helplessness of not knowing what to do next.
                </p>
                <p>
                  We built the tool we wished existed. Something that takes your side from the start.
                  Something that treats your complaint as valid - because it is.
                  Something that gives you the same ammunition that companies use against you.
                </p>
                <p className="text-foreground font-medium">
                  Consumer laws exist to protect you. We&apos;re here to help you use them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Types of people */}
        <section className="py-16 md:py-24 border-b border-forest-100 bg-forest-50/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display mb-4">
                NoReply Is For...
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              <div className="space-y-6">
                <div className="p-6 bg-white border border-forest-100 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground font-display mb-2">
                    First-time complainers
                  </h3>
                  <p className="text-muted-foreground">
                    You&apos;ve never done this before and don&apos;t know where to start.
                    We&apos;ll guide you through every step.
                  </p>
                </div>
                <div className="p-6 bg-white border border-forest-100 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground font-display mb-2">
                    Busy people
                  </h3>
                  <p className="text-muted-foreground">
                    You don&apos;t have hours to spend on hold or researching consumer law.
                    We do the heavy lifting in minutes.
                  </p>
                </div>
                <div className="p-6 bg-white border border-forest-100 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground font-display mb-2">
                    People who&apos;ve already tried
                  </h3>
                  <p className="text-muted-foreground">
                    Your complaint was ignored. Now you need something more professional,
                    more formal, more impossible to dismiss.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-white border border-forest-100 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground font-display mb-2">
                    People who hate confrontation
                  </h3>
                  <p className="text-muted-foreground">
                    Standing up for yourself doesn&apos;t mean shouting. A calm, professional letter
                    citing the right laws is far more powerful.
                  </p>
                </div>
                <div className="p-6 bg-white border border-forest-100 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground font-display mb-2">
                    People who think it&apos;s not worth it
                  </h3>
                  <p className="text-muted-foreground">
                    Whether it&apos;s £50 or £5,000, you deserve to be treated fairly.
                    We help you fight back without the fight.
                  </p>
                </div>
                <div className="p-6 bg-white border border-forest-100 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground font-display mb-2">
                    Anyone who&apos;s been wronged
                  </h3>
                  <p className="text-muted-foreground">
                    If a company has let you down, taken your money, or ruined your plans -
                    you belong here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-forest-500 relative overflow-hidden">
          {/* Curved top edge */}
          <div
            className="absolute top-0 left-0 right-0 h-12 bg-forest-50"
            style={{
              borderRadius: "0 0 50% 50%",
              transform: "translateY(-50%)"
            }}
          />

          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl text-white mb-6 font-hero">
                Your Fight Starts Here
              </h2>
              <p className="text-xl text-forest-100 mb-8">
                You&apos;ve already been through enough. Let us help you get the resolution you deserve.
              </p>
              <Button
                size="lg"
                variant="coral"
                asChild
                className="px-8 h-12 font-medium"
              >
                <Link href="/new" className="flex items-center">
                  Start Your Free Complaint
                  <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
                </Link>
              </Button>
              <p className="mt-4 text-sm text-forest-200">No credit card required</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
