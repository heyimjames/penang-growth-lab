import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing – Simple, Pay-As-You-Go Consumer Advocacy",
  description:
    "Start free, pay only when you need to fight back. NoReply offers simple pricing from £2.99 per case. No subscriptions required. AI-powered complaint letters that get results.",
  keywords: [
    "NoReply pricing",
    "complaint letter cost",
    "consumer advocacy pricing",
    "pay per case",
    "cheap complaint service",
    "affordable legal letter",
    "free complaint tool",
  ],
  openGraph: {
    title: "Simple Pricing | NoReply",
    description:
      "Start free. Pay only when you need to fight back. From £2.99 per case.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Simple Pricing | NoReply",
    description: "Start free. Pay only when you need to fight back. From £2.99 per case.",
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
