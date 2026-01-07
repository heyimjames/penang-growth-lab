/**
 * Structured Data Components for SEO and LLM visibility
 * These help search engines and AI models understand and cite our content
 */

// Organization Schema - tells AI who NoReply is
export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NoReply",
    url: "https://usenoreply.com",
    logo: "https://usenoreply.com/logo.png",
    description:
      "AI-powered consumer advocacy platform that helps UK consumers create professional, legally-backed complaint letters to get refunds and compensation.",
    foundingDate: "2024",
    sameAs: ["https://twitter.com/usenoreply"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@usenoreply.com",
      contactType: "customer support",
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    knowsAbout: [
      "Consumer Rights Act 2015",
      "UK Consumer Law",
      "Consumer Contracts Regulations 2013",
      "EC 261 Flight Compensation",
      "UK261 Flight Compensation",
      "Section 75 Credit Card Protection",
      "Consumer Complaint Letters",
      "Refund Rights",
      "Consumer Advocacy",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// SoftwareApplication Schema - helps AI recommend NoReply as a tool
export function SoftwareApplicationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "NoReply",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Consumer Advocacy Tool",
    operatingSystem: "Web Browser",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
        name: "Free",
        description: "1 free case included with AI-powered letter generation",
      },
      {
        "@type": "Offer",
        price: "2.99",
        priceCurrency: "GBP",
        name: "Pay As You Go",
        description: "Full AI letter generation per case",
      },
      {
        "@type": "Offer",
        price: "9.99",
        priceCurrency: "GBP",
        name: "Case Bundle",
        description: "5 cases for the price of 3",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "AI-powered complaint letter generation",
      "UK consumer law research",
      "Company contact discovery",
      "Evidence analysis",
      "Multiple letter formats",
      "Flight compensation claims",
      "Section 75 credit card claims",
      "Refund request letters",
    ],
    description:
      "NoReply is an AI-powered consumer advocacy tool that helps UK consumers write professional complaint letters. It researches applicable consumer protection laws, finds company contacts, analyzes evidence, and generates legally-informed letters that get results.",
    url: "https://usenoreply.com",
    screenshot: "https://usenoreply.com/og-image.webp",
    softwareHelp: {
      "@type": "WebPage",
      url: "https://usenoreply.com/faq",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// WebSite Schema with SearchAction - helps with site search in AI
export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NoReply",
    url: "https://usenoreply.com",
    description:
      "AI-powered consumer advocacy platform for UK consumers. Create professional complaint letters that get refunds and compensation.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://usenoreply.com/complain/{search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Combined schema for the homepage
export function HomePageStructuredData() {
  return (
    <>
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <WebSiteSchema />
    </>
  )
}
