"use client"

import Link from "next/link"
import { toolCategories, getToolsByCategory } from "@/lib/tools-data"

const footerLinks = {
  product: [
    { label: "Fight Back", href: "/new" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Compare Tools", href: "/compare/complaint-letter-tools" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "This Is For You", href: "/for-you" },
    { label: "Contact", href: "mailto:hello@usenoreply.com" },
  ],
  resources: [
    { label: "All Free Tools", href: "/tools" },
    { label: "UK Consumer Rights Guide", href: "/guides/uk-consumer-rights" },
    { label: "Communities", href: "/communities" },
    { label: "Glossary", href: "/glossary" },
    { label: "Blog", href: "/blog" },
    { label: "FAQs", href: "/faq" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Disclaimer", href: "/legal/disclaimer" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-forest-100 dark:border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Tool Categories Section */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold text-foreground mb-6 font-display">
            Free Consumer Rights Tools
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {toolCategories.map((category) => {
              const categoryTools = getToolsByCategory(category.id)
              return (
                <div key={category.id}>
                  <h4 className="text-xs font-semibold text-forest-500 dark:text-forest-400 uppercase tracking-wide mb-3">
                    {category.name}
                  </h4>
                  <ul className="space-y-2">
                    {categoryTools.map((tool) => (
                      <li key={tool.href}>
                        <Link
                          href={tool.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {(tool.name || tool.title || "").replace(" Calculator", "").replace(" Generator", "").replace(" Checker", "").replace(" Tracker", "")}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-8 border-t border-forest-100 dark:border-border">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold tracking-tight text-foreground font-display">NoReply</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              You have rights. We help you use them.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 font-display">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 font-display">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 font-display">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 font-display">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest-100 dark:border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} NoReply. All rights reserved.
            </p>
            <span className="hidden sm:inline text-muted-foreground/50">•</span>
            <a 
              href="https://logo.dev" 
              target="_blank" 
              rel="noopener"
              className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
            >
              Logos by Logo.dev
            </a>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            This tool provides AI-generated suggestions. Always verify legal advice with a qualified professional.
          </p>
        </div>
      </div>
    </footer>
  )
}
