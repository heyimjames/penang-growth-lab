import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://growth.penangmedia.com"),
  title: {
    default: "Penang Growth Lab – Free Tools & Resources for E-Commerce Brands",
    template: "%s | Penang Growth Lab",
  },
  description:
    "Free calculators, AI-powered tools, and expert guides to scale your DTC brand. ROAS calculators, ad copy generators, profit analyzers, and more. Built by Penang Media.",
  keywords: [
    "ecommerce tools",
    "ROAS calculator",
    "ad copy generator",
    "Facebook ads tools",
    "DTC brand growth",
    "ecommerce marketing",
    "paid ads calculator",
    "meta ads tools",
    "google ads tools",
    "ecommerce profitability",
    "Penang Media",
  ],
  authors: [{ name: "Penang Media" }],
  creator: "Penang Media",
  publisher: "Penang Media",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Penang Growth Lab – Free Tools & Resources for E-Commerce Brands",
    description: "Free calculators, AI-powered tools, and expert guides to scale your DTC brand. Built by Penang Media.",
    url: "https://growth.penangmedia.com",
    siteName: "Penang Growth Lab",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Penang Growth Lab – E-Commerce Growth Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free E-Commerce Growth Tools by Penang Media",
    description: "ROAS calculators, AI ad copy generators, profit analyzers and more. Scale your DTC brand.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://growth.penangmedia.com",
  },
  category: "E-Commerce Marketing",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#cff128" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" closeButton />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
