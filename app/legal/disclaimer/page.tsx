import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Legal Disclaimer",
  description: "Important legal disclaimer: NoReply is not a law firm and does not provide legal advice. Read our full disclaimer about our AI-powered consumer advocacy service.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Legal Disclaimer | NoReply",
    description: "Important legal disclaimer regarding NoReply's services. We are not a law firm and do not provide legal advice.",
    type: "website",
  },
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display mb-6">
              Legal Disclaimer
            </h1>
            <p className="text-muted-foreground mb-8">
              Last updated: December 2024
            </p>

            <div className="prose prose-forest max-w-none">
              {/* Main Disclaimer */}
              <div className="bg-peach-50 border border-peach-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-foreground font-display mt-0 mb-3">
                  Important Notice
                </h2>
                <p className="text-foreground mb-0">
                  <strong>NoReply is NOT a law firm, does NOT provide legal advice, and is NOT a substitute for professional legal counsel.</strong> Our service is an information and organizational tool designed to help consumers compile their complaints and research publicly available consumer protection information.
                </p>
              </div>

              {/* No Legal Advice */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  No Legal Advice
                </h2>
                <p className="text-muted-foreground mb-4">
                  The information provided by NoReply, including but not limited to AI-generated complaint letters, legal references, consumer law summaries, and regulatory body information, is for general informational purposes only. This information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Does not constitute legal advice</li>
                  <li>Does not create an attorney-client relationship</li>
                  <li>Should not be relied upon as a substitute for consultation with a qualified legal professional</li>
                  <li>May not be accurate, complete, or up-to-date</li>
                  <li>May not apply to your specific situation or jurisdiction</li>
                </ul>
              </section>

              {/* No Guarantee of Outcomes */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  No Guarantee of Outcomes
                </h2>
                <p className="text-muted-foreground mb-4">
                  NoReply makes no representations, warranties, or guarantees regarding:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>The success of any complaint or claim you make</li>
                  <li>The accuracy of confidence scores or case assessments</li>
                  <li>The likelihood of receiving refunds, compensation, or any specific outcome</li>
                  <li>The effectiveness of generated complaint letters</li>
                  <li>The responsiveness of companies or regulatory bodies</li>
                  <li>Timeframes for resolution of any dispute</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Past results mentioned in testimonials or case studies do not guarantee similar future outcomes. Each consumer dispute is unique and outcomes depend on many factors outside our control.
                </p>
              </section>

              {/* AI-Generated Content */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  AI-Generated Content
                </h2>
                <p className="text-muted-foreground mb-4">
                  NoReply uses artificial intelligence to generate complaint letters, analyze evidence, and research consumer protection laws. You acknowledge that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>AI-generated content may contain errors, inaccuracies, or outdated information</li>
                  <li>Legal references and citations should be independently verified</li>
                  <li>AI analysis is based on pattern recognition and may not account for all relevant factors</li>
                  <li>You are solely responsible for reviewing, editing, and verifying any content before use</li>
                  <li>The AI may misinterpret your situation or provide irrelevant suggestions</li>
                </ul>
              </section>

              {/* Your Responsibilities */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Your Responsibilities
                </h2>
                <p className="text-muted-foreground mb-4">
                  By using NoReply, you agree that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>You are responsible for the accuracy of information you provide</li>
                  <li>You will review all generated content before sending to any party</li>
                  <li>You will seek professional legal advice for complex or high-value disputes</li>
                  <li>You will verify all legal references and regulatory information independently</li>
                  <li>You will comply with all applicable laws when pursuing your complaint</li>
                  <li>You will not use the service for fraudulent, malicious, or illegal purposes</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Limitation of Liability
                </h2>
                <p className="text-muted-foreground mb-4">
                  To the maximum extent permitted by applicable law, NoReply and its owners, operators, employees, agents, and affiliates shall not be liable for any:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Direct, indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of profits, revenue, data, or business opportunities</li>
                  <li>Damages arising from your use or inability to use the service</li>
                  <li>Damages arising from any decisions made based on our content</li>
                  <li>Damages arising from the outcome of any dispute with a company</li>
                  <li>Damages arising from third-party actions or inactions</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  This limitation applies regardless of the legal theory under which damages are sought (contract, tort, negligence, strict liability, or otherwise).
                </p>
              </section>

              {/* Indemnification */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Indemnification
                </h2>
                <p className="text-muted-foreground">
                  You agree to indemnify, defend, and hold harmless NoReply and its owners, operators, employees, agents, and affiliates from any claims, damages, losses, liabilities, costs, or expenses (including reasonable legal fees) arising from your use of the service, your violation of these terms, or your violation of any rights of a third party.
                </p>
              </section>

              {/* Jurisdiction-Specific Notices */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Jurisdiction-Specific Notices
                </h2>
                <p className="text-muted-foreground mb-4">
                  Consumer protection laws vary significantly between countries and regions. While NoReply attempts to provide relevant legal information based on your location, we cannot guarantee:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>That the laws referenced apply to your specific situation</li>
                  <li>That all relevant laws have been identified</li>
                  <li>That the legal information is current or accurate</li>
                  <li>That cross-border disputes will be resolved in any particular jurisdiction</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  For disputes involving significant amounts or complex legal issues, we strongly recommend consulting with a lawyer licensed in the relevant jurisdiction.
                </p>
              </section>

              {/* Third-Party Services */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Third-Party Services and Links
                </h2>
                <p className="text-muted-foreground">
                  NoReply may provide links to regulatory bodies, ombudsman services, and other third-party websites. We are not responsible for the content, accuracy, or practices of these third parties. Links are provided for convenience only and do not imply endorsement.
                </p>
              </section>

              {/* Changes to This Disclaimer */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Changes to This Disclaimer
                </h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting. Your continued use of NoReply after changes are posted constitutes acceptance of the modified disclaimer.
                </p>
              </section>

              {/* Contact */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Questions
                </h2>
                <p className="text-muted-foreground">
                  If you have questions about this disclaimer, please contact us at{" "}
                  <a href="mailto:legal@usenoreply.com" className="text-forest-600 hover:underline">
                    legal@usenoreply.com
                  </a>
                </p>
              </section>

              {/* Related Links */}
              <div className="border-t border-forest-100 pt-8 mt-8">
                <h3 className="text-lg font-semibold text-foreground font-display mb-4">
                  Related Documents
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/terms" className="text-forest-600 hover:underline">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-forest-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
