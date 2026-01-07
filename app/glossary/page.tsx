import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Icon } from "@/lib/icons"
import {
  BookOpen01Icon,
  Search01Icon,
  ArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded"

export const metadata: Metadata = {
  title: "Consumer Rights Glossary – 50+ Terms Explained in Plain English",
  description:
    "Understand key consumer rights terms, legal jargon, and phrases companies use. Our glossary explains everything from Section 75 to ADR schemes, chargeback to satisfactory quality.",
  keywords: [
    "consumer rights glossary",
    "consumer law terms UK",
    "Section 75 explained",
    "what is chargeback",
    "ombudsman meaning",
    "consumer protection terms",
    "legal terms UK explained",
    "ADR schemes meaning",
    "cooling off period definition",
    "satisfactory quality meaning",
    "Consumer Rights Act terms",
  ],
  openGraph: {
    title: "Consumer Rights Glossary | NoReply",
    description:
      "50+ consumer rights terms explained in plain English. From Section 75 to ombudsman.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Consumer Rights Glossary | NoReply",
    description: "50+ consumer rights terms explained in plain English.",
  },
}

interface GlossaryTerm {
  term: string
  definition: string
  example?: string
  relatedTerms?: string[]
  category: "rights" | "legal" | "financial" | "process" | "tactics"
}

const glossaryTerms: GlossaryTerm[] = [
  // Consumer Rights Terms
  {
    term: "Consumer Rights Act 2015",
    definition:
      "The main UK law protecting consumers when buying goods, services, or digital content. It replaced several older laws and sets out your rights when things go wrong with purchases.",
    example:
      "If your new laptop stops working within 30 days, the Consumer Rights Act 2015 entitles you to a full refund.",
    relatedTerms: ["Satisfactory Quality", "30-Day Right to Reject", "Repair or Replace"],
    category: "rights",
  },
  {
    term: "Satisfactory Quality",
    definition:
      "A legal standard meaning goods must be free from defects, safe, durable, and match any description. What counts as 'satisfactory' depends on the price and product type.",
    example:
      "A £5 umbrella isn't expected to last as long as a £100 one, but both should work properly from day one.",
    relatedTerms: ["Fit for Purpose", "As Described"],
    category: "rights",
  },
  {
    term: "Fit for Purpose",
    definition:
      "Goods must work for their intended use and any specific purpose you told the seller about before buying.",
    example:
      "If you told a salesperson you needed walking boots for hiking in snow, they must be suitable for that purpose.",
    relatedTerms: ["Satisfactory Quality", "As Described"],
    category: "rights",
  },
  {
    term: "As Described",
    definition:
      "Products must match any description given by the seller, including advertising, packaging, and verbal statements made before purchase.",
    example:
      'If a car is advertised as having "full service history" but doesn\'t, you can claim under the As Described requirement.',
    relatedTerms: ["Satisfactory Quality", "Misrepresentation"],
    category: "rights",
  },
  {
    term: "30-Day Right to Reject",
    definition:
      "Within 30 days of receiving faulty goods, you have the right to reject them for a full refund. After 30 days, the retailer can offer repair or replacement first.",
    example:
      "Your new TV developed a fault after 2 weeks. You can reject it and get a full refund under the 30-day right.",
    relatedTerms: ["Short-Term Right to Reject", "Repair or Replace"],
    category: "rights",
  },
  {
    term: "Cooling-Off Period",
    definition:
      "A 14-day period during which you can cancel most online, phone, or doorstep purchases without giving any reason. Starts when you receive the goods.",
    example:
      "You ordered shoes online but changed your mind. You have 14 days from delivery to return them for a full refund.",
    relatedTerms: ["Distance Selling", "Consumer Contracts Regulations 2013"],
    category: "rights",
  },
  {
    term: "Distance Selling",
    definition:
      "Any sale made without face-to-face contact, including online, phone, mail order, or TV shopping purchases. These have extra protections including the cooling-off period.",
    example:
      "Buying a product through a website, TV shopping channel, or phone order all count as distance selling.",
    relatedTerms: ["Cooling-Off Period", "Consumer Contracts Regulations 2013"],
    category: "rights",
  },

  // Financial Protection Terms
  {
    term: "Section 75",
    definition:
      "Section 75 of the Consumer Credit Act 1974 makes your credit card company jointly liable with the seller for purchases between £100 and £30,000. If the seller won't help, you can claim from your card provider.",
    example:
      "A company went bust before delivering your £500 sofa. You can claim the full amount back from your credit card company under Section 75.",
    relatedTerms: ["Chargeback", "Joint Liability"],
    category: "financial",
  },
  {
    term: "Chargeback",
    definition:
      "A process where your bank reverses a card payment when goods aren't delivered, are faulty, or not as described. Works with debit and credit cards but has shorter time limits than Section 75.",
    example:
      "You paid for concert tickets that never arrived. Your bank can do a chargeback to get your money back.",
    relatedTerms: ["Section 75", "Disputed Transaction"],
    category: "financial",
  },
  {
    term: "Joint Liability",
    definition:
      "When two parties are equally responsible for a debt or obligation. Under Section 75, your credit card company shares liability with the seller for problems with purchases.",
    example:
      "The car dealership won't fix a fault. Because of joint liability, your credit card company must help resolve it.",
    relatedTerms: ["Section 75", "Consumer Credit Act 1974"],
    category: "financial",
  },

  // Legal Process Terms
  {
    term: "Ombudsman",
    definition:
      "An independent person or organization that investigates complaints against companies when you can't resolve issues directly. Different industries have different ombudsmen (financial, energy, telecoms, etc.).",
    example:
      "Your bank won't refund unauthorized transactions. The Financial Ombudsman can investigate and make a binding decision.",
    relatedTerms: ["ADR", "Deadlock Letter", "Final Response"],
    category: "process",
  },
  {
    term: "ADR (Alternative Dispute Resolution)",
    definition:
      "Ways to resolve disputes without going to court, including ombudsmen, arbitration, and mediation. Many industries require companies to offer ADR to customers.",
    example:
      "Before taking a retailer to court, you might try mediation through an ADR scheme to reach an agreement.",
    relatedTerms: ["Ombudsman", "Mediation", "Arbitration"],
    category: "process",
  },
  {
    term: "Deadlock Letter",
    definition:
      "A letter from a company stating they won't do anything more about your complaint. Also called a 'final response.' Receiving one allows you to escalate to an ombudsman immediately.",
    example:
      "The energy company sent a deadlock letter refusing to reduce your bill. You can now take your case to the Energy Ombudsman.",
    relatedTerms: ["Final Response", "Ombudsman", "8-Week Rule"],
    category: "process",
  },
  {
    term: "8-Week Rule",
    definition:
      "If a company hasn't resolved your complaint within 8 weeks, you can escalate to the relevant ombudsman even without a deadlock letter.",
    example:
      "It's been 10 weeks since you complained to your insurance company. You can now go to the Financial Ombudsman without waiting for their response.",
    relatedTerms: ["Ombudsman", "Deadlock Letter", "Final Response"],
    category: "process",
  },
  {
    term: "Small Claims Court",
    definition:
      "A simplified court process for disputes up to £10,000 in England and Wales. You don't usually need a lawyer, and it's designed to be accessible for ordinary consumers.",
    example:
      "The company owes you £2,000 for a faulty product. You can take them to small claims court yourself without hiring a solicitor.",
    relatedTerms: ["County Court", "Court Fees", "Enforcement"],
    category: "legal",
  },
  {
    term: "Letter Before Action",
    definition:
      "A formal letter warning a company you'll take legal action if they don't resolve your complaint. Courts expect you to send one before starting proceedings.",
    example:
      "Before going to court, you send a Letter Before Action giving the company 14 days to pay what they owe.",
    relatedTerms: ["Pre-Action Protocol", "Small Claims Court"],
    category: "legal",
  },

  // Company Tactics Terms
  {
    term: "Fobbing Off",
    definition:
      "When a company gives you the runaround, makes excuses, or tries to avoid dealing with your complaint properly. A common tactic to make customers give up.",
    example:
      'Being told "our policy doesn\'t allow refunds" when the law says otherwise is a classic fob-off.',
    relatedTerms: ["Statutory Rights", "Consumer Rights Act 2015"],
    category: "tactics",
  },
  {
    term: "Goodwill Gesture",
    definition:
      "When a company offers compensation 'as a gesture of goodwill' rather than admitting fault. Accepting one doesn't affect your legal rights, but companies hope it ends the matter.",
    example:
      "The airline offered £50 'as a goodwill gesture' for a 6-hour delay, but you might be legally entitled to £220.",
    relatedTerms: ["Without Prejudice", "Full and Final Settlement"],
    category: "tactics",
  },
  {
    term: "Full and Final Settlement",
    definition:
      "An offer to close a dispute completely. Once accepted, you usually can't pursue the matter further. Companies use this to prevent future claims.",
    example:
      'Before accepting a "full and final settlement," make sure it covers everything you\'re entitled to.',
    relatedTerms: ["Goodwill Gesture", "Without Prejudice"],
    category: "tactics",
  },
  {
    term: "Without Prejudice",
    definition:
      "A legal term meaning something can't be used as evidence in court. Companies mark settlement offers 'without prejudice' to negotiate freely without admitting liability.",
    example:
      'A "without prejudice" offer of £500 can\'t be mentioned if you later take the company to court.',
    relatedTerms: ["Full and Final Settlement", "Admission of Liability"],
    category: "tactics",
  },
  {
    term: "Extraordinary Circumstances",
    definition:
      "Events beyond a company's control that excuse them from liability. Airlines often claim this for delays, but many situations (like technical faults) don't actually qualify.",
    example:
      "The airline claimed 'extraordinary circumstances' for a mechanical fault, but courts have ruled these are usually the airline's responsibility.",
    relatedTerms: ["UK261", "EU261", "Flight Compensation"],
    category: "tactics",
  },

  // Additional Important Terms
  {
    term: "UK261",
    definition:
      "UK flight compensation rules that replaced EU261 after Brexit. Entitles passengers to compensation of £220-£520 for delays of 3+ hours on UK flights or flights departing from the UK on UK carriers.",
    example:
      "Your flight from London to New York was delayed by 4 hours. Under UK261, you're entitled to £520 compensation.",
    relatedTerms: ["EU261", "Extraordinary Circumstances"],
    category: "rights",
  },
  {
    term: "GDPR (General Data Protection Regulation)",
    definition:
      "Data protection law giving you rights over how companies use your personal information, including the right to access, correct, or delete your data.",
    example:
      "Under GDPR, you can request a copy of all data a company holds about you, and they must respond within 30 days.",
    relatedTerms: ["Subject Access Request", "Right to Erasure"],
    category: "rights",
  },
  {
    term: "Subject Access Request (SAR)",
    definition:
      "A formal request for all personal data a company holds about you. Companies must respond within 30 days and usually can't charge a fee.",
    example:
      "You submitted a SAR to your former employer to get copies of all emails and records they hold about you.",
    relatedTerms: ["GDPR", "Right to Erasure", "Data Protection"],
    category: "rights",
  },
  {
    term: "Trading Standards",
    definition:
      "Local government departments that enforce consumer protection laws against businesses. They investigate rogue traders, unsafe products, and misleading advertising.",
    example:
      "If a business repeatedly scams customers, you can report them to Trading Standards who may take legal action.",
    relatedTerms: ["Consumer Protection", "Enforcement"],
    category: "process",
  },
  {
    term: "Statutory Rights",
    definition:
      "Legal rights given to you by law that can't be taken away by company terms and conditions. Notices saying 'this doesn't affect your statutory rights' acknowledge this.",
    example:
      'A shop\'s "no refunds" policy doesn\'t override your statutory right to return faulty goods.',
    relatedTerms: ["Consumer Rights Act 2015", "Terms and Conditions"],
    category: "rights",
  },
  {
    term: "Burden of Proof",
    definition:
      "Who has to prove their case in a dispute. For faulty goods, the burden is on the retailer for the first 6 months to prove the item wasn't faulty when sold.",
    example:
      "Your phone stopped working after 3 months. The shop must prove it wasn't faulty from the start, not the other way around.",
    relatedTerms: ["6-Month Rule", "Reverse Burden of Proof"],
    category: "legal",
  },
  {
    term: "6-Month Rule",
    definition:
      "If goods develop a fault within 6 months of purchase, they're presumed to have been faulty from the start. The retailer must prove otherwise if they dispute your claim.",
    example:
      "Your washing machine broke after 4 months. The shop can't claim you damaged it—they must prove the fault wasn't present at purchase.",
    relatedTerms: ["Burden of Proof", "Satisfactory Quality"],
    category: "rights",
  },
  {
    term: "Repair or Replace",
    definition:
      "After the first 30 days, if goods are faulty the retailer can choose to repair or replace them before offering a refund. But they only get one chance to fix the problem.",
    example:
      "Your TV developed a fault after 2 months. The shop can offer a repair, but if that fails, you're entitled to a refund.",
    relatedTerms: ["30-Day Right to Reject", "Consumer Rights Act 2015"],
    category: "rights",
  },
  {
    term: "Unfair Contract Terms",
    definition:
      "Terms in a contract that create a significant imbalance against the consumer. Courts can declare these terms void and unenforceable.",
    example:
      "A term saying the company isn't responsible for any losses, even those caused by their negligence, would be unfair and unenforceable.",
    relatedTerms: ["Consumer Rights Act 2015", "Terms and Conditions"],
    category: "legal",
  },
  {
    term: "Misrepresentation",
    definition:
      "A false statement of fact that induces you to enter a contract. You may be able to cancel the contract and/or claim damages for losses.",
    example:
      'The seller said the car had "no accident history" but a check revealed major crash damage. This is misrepresentation.',
    relatedTerms: ["As Described", "Fraud"],
    category: "legal",
  },
]

// Group terms by category for display
const categories = {
  rights: { name: "Consumer Rights", color: "forest" },
  financial: { name: "Financial Protection", color: "peach" },
  process: { name: "Complaints Process", color: "lavender" },
  legal: { name: "Legal Terms", color: "forest" },
  tactics: { name: "Company Tactics", color: "peach" },
}

// Sort terms alphabetically
const sortedTerms = [...glossaryTerms].sort((a, b) =>
  a.term.localeCompare(b.term)
)

// Get unique first letters for navigation
const letters = [...new Set(sortedTerms.map((term) => term.term[0].toUpperCase()))].sort()

export default function GlossaryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-forest-100 dark:border-border bg-gradient-to-b from-forest-50/50 to-background dark:from-forest-950/20 dark:to-background">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/30 text-lavender-700 dark:text-lavender-300 text-sm font-medium mb-6">
                <Icon icon={BookOpen01Icon} size={14} />
                Consumer Rights Education
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl text-foreground font-hero mb-6">
                Consumer Rights
                <br />
                <span className="text-peach-500">Glossary</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Plain English definitions of the legal terms, jargon, and phrases
                you need to understand when dealing with companies.
              </p>

              <p className="text-sm text-muted-foreground">
                {glossaryTerms.length} terms covering UK consumer protection law
              </p>
            </div>
          </div>
        </section>

        {/* Alphabet Navigation */}
        <section className="border-b border-forest-100 dark:border-border sticky top-14 bg-background z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-1 py-3">
              {letters.map((letter) => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="w-8 h-8 flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-forest-50 dark:hover:bg-forest-900/30 rounded transition-colors"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Glossary Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {letters.map((letter) => {
                const termsForLetter = sortedTerms.filter(
                  (term) => term.term[0].toUpperCase() === letter
                )
                return (
                  <div key={letter} id={`letter-${letter}`} className="mb-12">
                    <h2 className="text-3xl font-bold text-forest-500 dark:text-forest-400 font-display mb-6 sticky top-28 bg-background py-2 z-30">
                      {letter}
                    </h2>
                    <div className="space-y-6">
                      {termsForLetter.map((item) => (
                        <article
                          key={item.term}
                          id={item.term.toLowerCase().replace(/\s+/g, "-")}
                          className="border border-forest-100 dark:border-border rounded-xl p-6 hover:border-forest-200 dark:hover:border-forest-700 transition-colors scroll-mt-36"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-foreground font-display">
                              {item.term}
                            </h3>
                            <span
                              className={`text-xs font-medium uppercase tracking-wide px-2 py-1 rounded-full ${
                                item.category === "rights"
                                  ? "bg-forest-100 dark:bg-forest-900/30 text-forest-600 dark:text-forest-400"
                                  : item.category === "financial"
                                    ? "bg-peach-100 dark:bg-peach-900/30 text-peach-600 dark:text-peach-400"
                                    : item.category === "process"
                                      ? "bg-lavender-100 dark:bg-lavender-900/30 text-lavender-600 dark:text-lavender-400"
                                      : item.category === "legal"
                                        ? "bg-forest-100 dark:bg-forest-900/30 text-forest-600 dark:text-forest-400"
                                        : "bg-peach-100 dark:bg-peach-900/30 text-peach-600 dark:text-peach-400"
                              }`}
                            >
                              {categories[item.category].name}
                            </span>
                          </div>

                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {item.definition}
                          </p>

                          {item.example && (
                            <div className="bg-forest-50/50 dark:bg-forest-900/20 rounded-lg p-4 mb-4">
                              <p className="text-sm">
                                <span className="font-semibold text-forest-600 dark:text-forest-400">
                                  Example:{" "}
                                </span>
                                <span className="text-muted-foreground">
                                  {item.example}
                                </span>
                              </p>
                            </div>
                          )}

                          {item.relatedTerms && item.relatedTerms.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs text-muted-foreground">
                                Related:
                              </span>
                              {item.relatedTerms.map((related) => (
                                <a
                                  key={related}
                                  href={`#${related.toLowerCase().replace(/\s+/g, "-")}`}
                                  className="text-xs text-forest-600 dark:text-forest-400 hover:underline"
                                >
                                  {related}
                                </a>
                              ))}
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-forest-600 dark:bg-forest-700">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl text-white mb-6 font-hero">
                Know Your Rights. Now Take Action.
              </h2>
              <p className="text-forest-100 text-lg mb-8 max-w-xl mx-auto">
                Understanding the terms is just the first step. Let NoReply help
                you use this knowledge to get the outcome you deserve.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/new"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-peach-500 hover:bg-peach-600 rounded-full transition-colors"
                >
                  Start Your Free Complaint
                  <Icon icon={ArrowRight01Icon} size={18} />
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-white/10 hover:bg-white hover:text-forest-700 rounded-full transition-colors"
                >
                  Explore Free Tools
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
