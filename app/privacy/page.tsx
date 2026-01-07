import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how NoReply collects, uses, and protects your personal information. We're committed to keeping your complaint data private and secure.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | NoReply",
    description: "Learn how NoReply protects your personal information and complaint data.",
    type: "website",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-foreground font-display mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-12">
              Last updated: December 2024
            </p>

            <div className="prose prose-forest max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Overview
                </h2>
                <p className="text-muted-foreground mb-4">
                  NoReply (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Information We Collect
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p><strong className="text-foreground">Account Information:</strong> When you create an account, we collect your email address and password (encrypted).</p>
                  <p><strong className="text-foreground">Case Information:</strong> When you create a case, we collect the details you provide about your complaint, including company names, descriptions of issues, and any evidence you upload.</p>
                  <p><strong className="text-foreground">Usage Data:</strong> We collect anonymous analytics about how you use our service to improve the product.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To generate complaint letters and provide our core service</li>
                  <li>To research companies and find relevant contact information</li>
                  <li>To identify applicable consumer laws for your situation</li>
                  <li>To communicate with you about your account and cases</li>
                  <li>To improve our AI models and service quality</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Data Storage and Security
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Your data is stored securely using industry-standard encryption. We use Supabase for our database infrastructure, which provides:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption at rest and in transit</li>
                    <li>Row-level security ensuring you can only access your own data</li>
                    <li>Regular security audits and compliance certifications</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Data Sharing
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p><strong className="text-foreground">We do not sell your data.</strong> We only share information in the following limited circumstances:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Service Providers:</strong> We use trusted third parties (e.g., hosting, analytics) who process data on our behalf under strict confidentiality agreements.</li>
                    <li><strong className="text-foreground">Legal Requirements:</strong> We may disclose information if required by law or to protect our rights.</li>
                    <li><strong className="text-foreground">With Your Consent:</strong> We&apos;ll share information if you explicitly ask us to.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  AI Processing
                </h2>
                <p className="text-muted-foreground mb-4">
                  We use AI to analyze your complaint and generate letters. This processing happens on secure servers.
                  We do not use your personal case data to train public AI models. Your complaint details are processed
                  only to provide you with our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Your Rights
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data</li>
                    <li><strong className="text-foreground">Rectification:</strong> Correct any inaccurate information</li>
                    <li><strong className="text-foreground">Deletion:</strong> Delete your account and all associated data</li>
                    <li><strong className="text-foreground">Portability:</strong> Export your data in a machine-readable format</li>
                  </ul>
                  <p>To exercise these rights, email us at <a href="mailto:privacy@usenoreply.com" className="text-forest-600 hover:underline">privacy@usenoreply.com</a>.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Cookies
                </h2>
                <p className="text-muted-foreground mb-4">
                  We use essential cookies to keep you logged in and remember your preferences.
                  We use analytics cookies (with your consent) to understand how our service is used.
                  You can disable cookies in your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Changes to This Policy
                </h2>
                <p className="text-muted-foreground mb-4">
                  We may update this policy from time to time. We&apos;ll notify you of significant changes
                  by email or through the service. Continued use after changes constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground font-display mb-4">
                  Contact Us
                </h2>
                <p className="text-muted-foreground">
                  Questions about this policy? Email us at{" "}
                  <a href="mailto:privacy@usenoreply.com" className="text-forest-600 hover:underline">
                    privacy@usenoreply.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
