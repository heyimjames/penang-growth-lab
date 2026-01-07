import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chrome Extension – Fight Back from Any Website",
  description:
    "Install the NoReply Chrome extension to create complaint letters directly from any company website. One-click access to your consumer rights while browsing. Free to install.",
  keywords: [
    "NoReply Chrome extension",
    "consumer rights extension",
    "complaint letter browser extension",
    "Chrome extension UK",
    "browser plugin consumer",
    "one-click complaint",
  ],
  openGraph: {
    title: "NoReply Chrome Extension | Fight Back from Any Website",
    description:
      "Create complaint letters directly from any company website. One-click access to your consumer rights.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NoReply Chrome Extension",
    description: "Fight back from any website with one click.",
  },
}

export default function ExtensionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
