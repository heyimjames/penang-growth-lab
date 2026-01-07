import { type NextRequest, NextResponse } from "next/server"

interface ExaResult {
  url: string
  title: string
  text?: string
  highlights?: string[]
}

interface ExaSearchResponse {
  results: ExaResult[]
}

interface CompanyMetadata {
  name: string
  description: string | null
  ogImage: string | null
  favicon: string | null
  domain: string
}

interface CompanyRating {
  score: number
  reviewCount: number
  url: string
  fetchedAt: string
}

interface CompanyProfile {
  description?: string
  industry?: string
  ratings?: {
    trustpilot?: CompanyRating
    google?: CompanyRating
    tripadvisor?: CompanyRating
  }
  socialLinks?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }
}

interface ContactInfo {
  emails: string[]
  executiveContacts: {
    name: string
    title: string
    email?: string
    linkedIn?: string
  }[]
  source: string
}

// Email priority scoring - higher score = more useful to user
function scoreEmail(email: string): number {
  const lowerEmail = email.toLowerCase()

  // Highest priority: direct customer-facing support
  if (lowerEmail.includes("customer.service") || lowerEmail.includes("customerservice")) return 100
  if (lowerEmail.includes("customer.support") || lowerEmail.includes("customersupport")) return 98
  if (lowerEmail.includes("customer.success") || lowerEmail.includes("customersuccess")) return 95
  if (lowerEmail.includes("customer.care") || lowerEmail.includes("customercare")) return 93
  if (lowerEmail.includes("support@")) return 90
  if (lowerEmail.includes("help@")) return 88
  if (lowerEmail.includes("contact@")) return 85
  if (lowerEmail.includes("service@")) return 83
  if (lowerEmail.includes("complaints@")) return 80
  if (lowerEmail.includes("feedback@")) return 78

  // Medium priority: general inquiry emails
  if (lowerEmail.includes("info@")) return 60
  if (lowerEmail.includes("enquiries@") || lowerEmail.includes("enquiry@")) return 58
  if (lowerEmail.includes("hello@")) return 55
  if (lowerEmail.includes("general@")) return 50

  // Lower priority but still useful: executive escalation
  if (lowerEmail.includes("ceo@") || lowerEmail.includes("chief")) return 45
  if (lowerEmail.includes("executive@")) return 43
  if (lowerEmail.includes("office@")) return 40

  // Low priority: sales/marketing (but could be useful if no other option)
  if (lowerEmail.includes("sales@")) return 20
  if (lowerEmail.includes("marketing@")) return 15

  // Default score for other emails
  return 30
}

// Third-party domains that are NOT the company we're researching
// These are regulators, ombudsmen, or complaint aggregators - NOT company emails
const THIRD_PARTY_DOMAINS = [
  "ombudsman",
  "ofcom.org",
  "citizensadvice.org",
  "resolver.co.uk",
  "trustpilot.com",
  "bbb.org",
  "complaintsboard.com",
  "moneysavingexpert.com",
  "which.co.uk",
  "gov.uk",
  "actionfraud",
  "tradingstandards",
  "financialombudsman",
  "ico.org.uk",
]

// Check if email belongs to a third-party (not the company)
function isThirdPartyEmail(email: string): boolean {
  const lowerEmail = email.toLowerCase()
  return THIRD_PARTY_DOMAINS.some(domain => lowerEmail.includes(domain))
}

// Check if email matches company domain
function emailMatchesDomain(email: string, companyDomain: string | null): boolean {
  if (!companyDomain) return true // If we don't know domain, allow all
  
  const emailDomain = email.toLowerCase().split("@")[1]
  if (!emailDomain) return false
  
  // Extract base domain (e.g., "three.co.uk" from "support.three.co.uk")
  const normalizedCompanyDomain = companyDomain.toLowerCase().replace(/^www\./, "")
  
  return emailDomain === normalizedCompanyDomain || emailDomain.endsWith("." + normalizedCompanyDomain)
}

// Filter out definitely useless emails
function isUselessEmail(email: string): boolean {
  const lowerEmail = email.toLowerCase()
  return (
    lowerEmail.includes("noreply") ||
    lowerEmail.includes("no-reply") ||
    lowerEmail.includes("donotreply") ||
    lowerEmail.includes("do-not-reply") ||
    lowerEmail.includes("privacy") ||
    lowerEmail.includes("careers") ||
    lowerEmail.includes("jobs") ||
    lowerEmail.includes("recruitment") ||
    lowerEmail.includes("newsletter") ||
    lowerEmail.includes("subscribe") ||
    lowerEmail.includes("unsubscribe") ||
    lowerEmail.includes("webmaster") ||
    lowerEmail.includes("postmaster") ||
    lowerEmail.includes("example.com") ||
    lowerEmail.includes("test@") ||
    lowerEmail.includes("demo@")
  )
}

// Extract Trustpilot rating from page content - improved with multiple fallback patterns
function extractTrustpilotRating(markdown: string, html?: string): { score: number; reviewCount: number } | null {
  // Priority 1: Look for TrustScore specifically mentioned
  const trustScorePatterns = [
    /TrustScore\s*[:\s]*(\d+\.?\d*)/i,
    /TrustScore.*?(\d+\.\d)\s*(?:out of 5)?/i,
    /trust\s*score[:\s]*(\d+\.?\d*)/i,
  ]

  // Priority 2: Look for star ratings in various formats
  const starPatterns = [
    /(\d+\.\d)\s*(?:out of|\/)\s*5(?:\s*stars?)?/i,
    /rated\s+(\d+\.?\d*)\s*(?:out of|\/)\s*5/i,
    /(\d+\.\d)\s*stars?\s*(?:on\s*trustpilot)?/i,
    /average[:\s]+(\d+\.?\d*)/i,
    /rating[:\s]+(\d+\.?\d*)/i,
    /(\d+\.\d)\s*\|\s*trustpilot/i,
  ]

  // Priority 3: Look for score in structured data-like formats
  const structuredPatterns = [
    /"ratingValue"[:\s]*"?(\d+\.?\d*)"?/i,
    /"aggregateRating".*?"ratingValue"[:\s]*"?(\d+\.?\d*)"?/i,
    /data-score="(\d+\.?\d*)"/i,
  ]

  let score: number | null = null
  const allPatterns = [...trustScorePatterns, ...starPatterns, ...structuredPatterns]
  
  for (const pattern of allPatterns) {
    const match = markdown.match(pattern)
    if (match?.[1]) {
      const parsed = parseFloat(match[1])
      if (parsed >= 1 && parsed <= 5) {
        score = parsed
        break
      }
    }
  }

  // Also try on raw HTML if provided
  if (!score && html) {
    for (const pattern of allPatterns) {
      const match = html.match(pattern)
      if (match?.[1]) {
        const parsed = parseFloat(match[1])
        if (parsed >= 1 && parsed <= 5) {
          score = parsed
          break
        }
      }
    }
  }

  if (!score) return null

  // Extract review count with multiple patterns
  const reviewPatterns = [
    /(\d{1,3}(?:,\d{3})*)\s*(?:total\s*)?reviews?/i,
    /based\s*on\s*(\d{1,3}(?:,\d{3})*)\s*reviews?/i,
    /(\d{1,3}(?:,\d{3})*)\s*verified\s*reviews?/i,
    /(\d+(?:\.\d+)?)\s*[KkMm]\s*reviews?/i,
    /"reviewCount"[:\s]*"?(\d+)"?/i,
    /(\d{1,3}(?:,\d{3})*)\s*experiences?/i,
  ]

  let reviewCount = 0
  for (const pattern of reviewPatterns) {
    const match = markdown.match(pattern)
    if (match?.[1]) {
      let countStr = match[1].replace(/,/g, "")
      if (countStr.toLowerCase().includes("k")) {
        reviewCount = Math.round(parseFloat(countStr) * 1000)
      } else if (countStr.toLowerCase().includes("m")) {
        reviewCount = Math.round(parseFloat(countStr) * 1000000)
      } else {
        reviewCount = parseInt(countStr, 10)
      }
      if (reviewCount > 0) break
    }
  }

  return { score, reviewCount }
}

// Extract Google Business/Maps rating from search results or places data
function extractGoogleRating(markdown: string): { score: number; reviewCount: number } | null {
  // Look for Google reviews patterns
  const scorePatterns = [
    /(\d+\.\d)\s*\((\d{1,3}(?:,\d{3})*)\s*(?:reviews?|ratings?)\)/i, // "4.2 (1,234 reviews)"
    /(\d+\.\d)\s*stars?\s*·\s*(\d{1,3}(?:,\d{3})*)\s*(?:reviews?|ratings?)/i, // "4.2 stars · 1,234 reviews"
    /google\s*reviews?[:\s]*(\d+\.\d)/i,
    /rated\s*(\d+\.\d)\s*on\s*google/i,
    /"aggregateRating".*?"ratingValue"[:\s]*"?(\d+\.?\d*)"?.*?"reviewCount"[:\s]*"?(\d+)"?/is,
  ]

  for (const pattern of scorePatterns) {
    const match = markdown.match(pattern)
    if (match) {
      const score = parseFloat(match[1])
      if (score >= 1 && score <= 5) {
        const reviewCount = match[2] ? parseInt(match[2].replace(/,/g, ""), 10) : 0
        return { score, reviewCount }
      }
    }
  }

  return null
}

// Validate that a social media link is an official company profile (not a share/intent link)
function isOfficialSocialLink(url: string, platform: string): boolean {
  const lower = url.toLowerCase()
  
  // Common sharing/non-profile patterns to exclude
  const excludePatterns = [
    "/share", "/sharer", "/intent", "/dialog", "/login", "/signup",
    "/search", "/explore", "/hashtag", "/status/", "/post/",
    "/feed", "/help", "/about", "/terms", "/privacy", "/policy",
    "?ref=", "?src=", "?utm_", "/plugins/", "/embed/",
  ]
  
  if (excludePatterns.some(pattern => lower.includes(pattern))) {
    return false
  }

  // Platform-specific validation
  switch (platform) {
    case "twitter":
      // Valid: twitter.com/username or x.com/username (not reserved names)
      const twitterReserved = ["home", "explore", "notifications", "messages", "settings", "compose", "i"]
      const twitterUsername = lower.match(/(?:twitter\.com|x\.com)\/([a-z0-9_]+)/)?.[1]
      return !twitterReserved.includes(twitterUsername || "")
    
    case "facebook":
      // Valid: facebook.com/pagename (not reserved)
      const fbReserved = ["home", "watch", "marketplace", "groups", "gaming", "bookmarks"]
      const fbPage = lower.match(/facebook\.com\/([a-z0-9._-]+)/)?.[1]
      return !fbReserved.includes(fbPage || "")
    
    case "instagram":
      // Valid: instagram.com/username
      const igReserved = ["explore", "accounts", "direct", "about"]
      const igUsername = lower.match(/instagram\.com\/([a-z0-9._]+)/)?.[1]
      return !igReserved.includes(igUsername || "")
    
    case "linkedin":
      // Valid: linkedin.com/company/name
      return lower.includes("/company/")
    
    case "youtube":
      // Valid: youtube.com/@handle, /c/, /channel/, /user/
      return /youtube\.com\/(?:@|c\/|channel\/|user\/)/.test(lower)
    
    default:
      return true
  }
}

// Extract and validate official social media links from website content
function extractSocialLinks(markdown: string, companyName?: string): CompanyProfile["socialLinks"] {
  const socialLinks: CompanyProfile["socialLinks"] = {}
  
  // Use original case content for URL extraction
  const content = markdown

  // Twitter/X - extract all matches and pick the best one
  const twitterMatches = content.matchAll(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/gi)
  for (const match of twitterMatches) {
    const url = match[0].startsWith("http") ? match[0] : `https://${match[0]}`
    if (isOfficialSocialLink(url, "twitter")) {
      // Normalize to x.com
      socialLinks.twitter = url.replace("twitter.com", "x.com")
      break
    }
  }

  // Facebook
  const fbMatches = content.matchAll(/(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9._-]+)/gi)
  for (const match of fbMatches) {
    const url = match[0].startsWith("http") ? match[0] : `https://${match[0]}`
    if (isOfficialSocialLink(url, "facebook")) {
      socialLinks.facebook = url
      break
    }
  }

  // Instagram
  const igMatches = content.matchAll(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)/gi)
  for (const match of igMatches) {
    const url = match[0].startsWith("http") ? match[0] : `https://${match[0]}`
    if (isOfficialSocialLink(url, "instagram")) {
      socialLinks.instagram = url
      break
    }
  }

  // LinkedIn - only company pages
  const liMatches = content.matchAll(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/company\/([a-zA-Z0-9-]+)/gi)
  for (const match of liMatches) {
    const url = match[0].startsWith("http") ? match[0] : `https://${match[0]}`
    if (isOfficialSocialLink(url, "linkedin")) {
      socialLinks.linkedin = url
      break
    }
  }

  // YouTube
  const ytMatches = content.matchAll(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:@|c\/|channel\/|user\/)([a-zA-Z0-9_-]+)/gi)
  for (const match of ytMatches) {
    const url = match[0].startsWith("http") ? match[0] : `https://${match[0]}`
    if (isOfficialSocialLink(url, "youtube")) {
      socialLinks.youtube = url
      break
    }
  }

  // TikTok (bonus - common platform now)
  const tiktokMatches = content.matchAll(/(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9._]+)/gi)
  for (const match of tiktokMatches) {
    const url = match[0].startsWith("http") ? match[0] : `https://${match[0]}`
    // TikTok links are generally profile links if they have @
    if (!url.includes("/video/")) {
      (socialLinks as Record<string, string>).tiktok = url
      break
    }
  }

  return socialLinks
}

export async function POST(request: NextRequest) {
  try {
    const { companyName } = await request.json()

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    const EXA_API_KEY = process.env.EXA_API_KEY
    const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY

    const isUrl = companyName.includes(".") && !companyName.includes(" ")
    let domain = isUrl
      ? companyName
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "")
          .split("/")[0]
      : null

    let companyMetadata: CompanyMetadata | null = null
    if (FIRECRAWL_API_KEY && isUrl) {
      try {
        const urlToScrape = companyName.startsWith("http") ? companyName : `https://${companyName}`
        const firecrawlResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: urlToScrape,
            formats: ["markdown"],
          }),
        })

        if (firecrawlResponse.ok) {
          const scrapeData = await firecrawlResponse.json()
          const metadata = scrapeData.data?.metadata || {}

          companyMetadata = {
            name: metadata.title || metadata.ogTitle || domain || companyName,
            description: metadata.description || metadata.ogDescription || null,
            ogImage: metadata.ogImage || null,
            favicon: metadata.favicon || (domain ? `https://${domain}/favicon.ico` : null),
            domain: domain || guessDomain(companyName),
          }
        }
      } catch (e) {
        console.error("Firecrawl metadata error:", e)
      }
    }

    if (!EXA_API_KEY) {
      // Return mock data with any Firecrawl metadata we have
      return NextResponse.json({
        company: companyMetadata || {
          name: companyName,
          domain: domain || guessDomain(companyName),
          description: null,
          ogImage: null,
          favicon: null,
        },
        complaints: [],
        contacts: null,
        profile: {
          description: companyMetadata?.description || undefined,
        },
        cached: false,
        mock: true,
      })
    }

    const searchName = companyMetadata?.name || companyName

    const [companyResults, complaintsResults, contactResults] = await Promise.all([
      // Company info search via Exa
      fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "x-api-key": EXA_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `${searchName} company official website about contact`,
          type: "neural",
          useAutoprompt: true,
          numResults: 5,
          contents: {
            text: { maxCharacters: 1000 },
            highlights: true,
          },
        }),
      }).then((r) => r.json()) as Promise<ExaSearchResponse>,

      // Complaints/reviews search via Exa
      fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "x-api-key": EXA_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `${searchName} customer complaints reviews problems`,
          type: "neural",
          useAutoprompt: true,
          numResults: 10,
          contents: {
            text: { maxCharacters: 500 },
            highlights: true,
          },
          includeDomains: [
            "trustpilot.com",
            "reviews.io",
            "sitejabber.com",
            "bbb.org",
            "complaintsboard.com",
            "resolver.co.uk",
            "moneysavingexpert.com",
          ],
        }),
      }).then((r) => r.json()) as Promise<ExaSearchResponse>,

      // Contact information search via Exa
      fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "x-api-key": EXA_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `${searchName} customer service email complaints department contact executive email CEO`,
          type: "neural",
          useAutoprompt: true,
          numResults: 10,
          contents: {
            text: { maxCharacters: 1500 },
            highlights: true,
          },
        }),
      }).then((r) => r.json()) as Promise<ExaSearchResponse>,
    ])

    // Extract company domain from results if not already known
    if (!domain) {
      const officialSite = companyResults.results?.find(
        (r: ExaResult) =>
          !r.url.includes("wikipedia") &&
          !r.url.includes("linkedin") &&
          !r.url.includes("facebook") &&
          !r.url.includes("twitter") &&
          !r.url.includes("youtube"),
      )
      domain = officialSite ? new URL(officialSite.url).hostname.replace("www.", "") : guessDomain(companyName)
    }

    // Extract complaint summaries
    const complaints =
      complaintsResults.results?.slice(0, 5).map((r: ExaResult) => ({
        title: r.title,
        url: r.url,
        summary: r.text?.slice(0, 200) + "..." || "",
      })) || []

    // Extract emails from Exa contact search results
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const exaContactEmails: string[] = []
    const contactSources: { url: string; title: string }[] = []

    contactResults.results?.forEach((r: ExaResult) => {
      const textContent = (r.text || "") + " " + (r.highlights?.join(" ") || "")
      const foundEmails = textContent.match(emailRegex) || []
      foundEmails.forEach((email: string) => {
        if (!exaContactEmails.includes(email.toLowerCase())) {
          exaContactEmails.push(email.toLowerCase())
        }
      })
      if (foundEmails.length > 0) {
        contactSources.push({ url: r.url, title: r.title })
      }
    })

    let contacts: ContactInfo | null = null

    // Filter and categorize emails
    const filterEmail = (email: string) =>
      !isUselessEmail(email) &&
      !email.includes("sentry.io") &&
      !isThirdPartyEmail(email)

    const isExecutiveEmail = (email: string) =>
      email.includes("ceo") ||
      email.includes("cfo") ||
      email.includes("coo") ||
      email.includes("director") ||
      email.includes("executive") ||
      email.includes("md@") ||
      email.includes("president")

    const isCustomerServiceEmail = (email: string) =>
      email.includes("support") ||
      email.includes("help") ||
      email.includes("customer") ||
      email.includes("service") ||
      email.includes("complaints") ||
      email.includes("contact") ||
      email.includes("info@") ||
      email.includes("enquir")

    // First filter out useless and third-party emails
    const filteredExaEmails = exaContactEmails.filter(filterEmail)
    
    // Separate emails that match company domain (prioritized) from others
    const companyDomainEmails = filteredExaEmails.filter(e => emailMatchesDomain(e, domain))
    const otherSourceEmails = filteredExaEmails.filter(e => !emailMatchesDomain(e, domain))
    // Prioritize company domain emails, categorize by type
    const executiveEmails = companyDomainEmails.filter(isExecutiveEmail)
    const customerServiceEmails = companyDomainEmails.filter(isCustomerServiceEmail)
    const otherCompanyEmails = companyDomainEmails.filter(e => !isExecutiveEmail(e) && !isCustomerServiceEmail(e))
    
    // Keep other source emails as fallback (but not prioritized)
    const otherEmails = [
      ...otherCompanyEmails,
      ...otherSourceEmails.filter(e => !executiveEmails.includes(e) && !customerServiceEmails.includes(e))
    ]

    const executiveContacts: { name: string; title: string; email?: string; linkedIn?: string }[] = []

    if (FIRECRAWL_API_KEY && domain) {
      try {
        // Scrape contact page for additional emails
        const contactPageUrl = `https://${domain}/contact`
        const firecrawlResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: contactPageUrl,
            formats: ["markdown"],
          }),
        })

        if (firecrawlResponse.ok) {
          const firecrawlData = await firecrawlResponse.json()
          const content = firecrawlData.data?.markdown || ""

          // Extract email addresses from the content
          const firecrawlEmails = [...new Set(content.match(emailRegex) || [])] as string[]
          // Firecrawl is scraping the company's own site, so these should be company emails
          // Still filter out useless/third-party emails just in case
          const filteredFirecrawlEmails = firecrawlEmails.filter(filterEmail)

          // Add Firecrawl emails to appropriate categories (prioritize these as they're from the company site)
          filteredFirecrawlEmails.forEach((email: string) => {
            const lowerEmail = email.toLowerCase()
            // Prioritize emails from company domain
            const isCompanyEmail = emailMatchesDomain(lowerEmail, domain)
            
            if (isExecutiveEmail(lowerEmail) && !executiveEmails.includes(lowerEmail)) {
              if (isCompanyEmail) {
                executiveEmails.unshift(lowerEmail) // Add to front (higher priority)
              } else {
                executiveEmails.push(lowerEmail)
              }
            } else if (isCustomerServiceEmail(lowerEmail) && !customerServiceEmails.includes(lowerEmail)) {
              if (isCompanyEmail) {
                customerServiceEmails.unshift(lowerEmail) // Add to front (higher priority)
              } else {
                customerServiceEmails.push(lowerEmail)
              }
            } else if (!otherEmails.includes(lowerEmail) && !executiveEmails.includes(lowerEmail) && !customerServiceEmails.includes(lowerEmail)) {
              otherEmails.push(lowerEmail)
            }
          })

          if (filteredFirecrawlEmails.length > 0) {
            contactSources.push({ url: contactPageUrl, title: "Company Contact Page" })
          }
        }

        // Search for executive contacts using Exa if available
        if (EXA_API_KEY) {
          try {
            const executiveSearch = await fetch("https://api.exa.ai/search", {
              method: "POST",
              headers: {
                "x-api-key": EXA_API_KEY,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: `${searchName} CEO COO CFO "Chief Executive" "Chief Operating" executive leadership team contact`,
                type: "neural",
                useAutoprompt: true,
                numResults: 10,
                contents: {
                  text: { maxCharacters: 2000 },
                  highlights: true,
                },
                includeDomains: ["linkedin.com", domain],
              }),
            })

            if (executiveSearch.ok) {
              const execData: ExaSearchResponse = await executiveSearch.json()

              // Parse executive info from results
              const executiveTitles = [
                "CEO",
                "COO",
                "CFO",
                "CTO",
                "CMO",
                "Chief Executive",
                "Chief Operating",
                "Chief Financial",
                "Chief Technology",
                "Chief Marketing",
                "Managing Director",
                "President",
                "Vice President",
                "VP",
                "Director",
                "Head of Customer",
                "Customer Success",
                "Customer Service Director",
                "Founder",
                "Co-Founder",
              ]

              for (const result of execData.results || []) {
                const text = result.text || ""
                const title = result.title || ""

                // Check if this result contains executive info
                for (const execTitle of executiveTitles) {
                  if (title.toLowerCase().includes(execTitle.toLowerCase()) || text.toLowerCase().includes(execTitle.toLowerCase())) {
                    // Try to extract name from title or URL
                    let name = ""
                    if (result.url.includes("linkedin.com/in/")) {
                      const linkedInPath = result.url.split("linkedin.com/in/")[1]?.split(/[/?]/)[0] || ""
                      name = linkedInPath
                        .split("-")
                        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
                        .join(" ")
                    } else if (title) {
                      // Try to extract name from title
                      const nameMatch = title.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/)
                      if (nameMatch) name = nameMatch[1]
                    }

                    // Try to find matching email for this executive
                    const matchingEmail = executiveEmails.find(e => 
                      e.toLowerCase().includes(execTitle.toLowerCase().split(" ")[0].toLowerCase())
                    )

                    if (name && !executiveContacts.some((e) => e.name === name)) {
                      executiveContacts.push({
                        name,
                        title: execTitle,
                        email: matchingEmail,
                        linkedIn: result.url.includes("linkedin.com") ? result.url : undefined,
                      })
                    }
                    break
                  }
                }
              }
            }
          } catch (e) {
            console.error("Executive search error:", e)
          }
        }

        // Fetch company metadata if we don't have it yet
        if (!companyMetadata) {
          const homepageResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: `https://${domain}`,
              formats: ["markdown"],
            }),
          })

          if (homepageResponse.ok) {
            const homeData = await homepageResponse.json()
            const metadata = homeData.data?.metadata || {}

            companyMetadata = {
              name: metadata.title || metadata.ogTitle || companyName,
              description: metadata.description || metadata.ogDescription || null,
              ogImage: metadata.ogImage || null,
              favicon: metadata.favicon || `https://${domain}/favicon.ico`,
              domain: domain,
            }
          }
        }
      } catch (e) {
        console.error("Firecrawl error:", e)
        // Continue without Firecrawl contacts - not critical
      }
    }

    // Combine all emails with priority: customer service first, then executive, then others
    const finalEmails = [
      ...customerServiceEmails.sort((a, b) => scoreEmail(b) - scoreEmail(a)),
      ...executiveEmails.sort((a, b) => scoreEmail(b) - scoreEmail(a)),
      ...otherEmails.sort((a, b) => scoreEmail(b) - scoreEmail(a)),
    ]

    if (finalEmails.length > 0 || executiveContacts.length > 0) {
      contacts = {
        emails: finalEmails.slice(0, 5), // Return top 5 most useful emails
        executiveContacts: executiveContacts.slice(0, 5), // Return top 5 executives
        source: contactSources.length > 0 ? contactSources[0].url : `https://${domain}/contact`,
      }
    }

    const officialSite = companyResults.results?.find(
      (r: ExaResult) => !r.url.includes("wikipedia") && !r.url.includes("linkedin") && !r.url.includes("facebook"),
    )

    // Fetch company profile data (ratings, social links) in parallel
    const profile: CompanyProfile = {
      description: companyMetadata?.description || officialSite?.text?.slice(0, 300) || undefined,
    }

    if (FIRECRAWL_API_KEY && domain) {
      const fetchedAt = new Date().toISOString()
      const searchName = companyMetadata?.name || companyName

      // Fetch Trustpilot, Google Reviews, and social links in parallel
      const [trustpilotResult, googleResult, homepageResult] = await Promise.allSettled([
        // Trustpilot rating
        (async () => {
          const trustpilotUrl = `https://www.trustpilot.com/review/${domain}`
          const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: trustpilotUrl,
              formats: ["markdown", "html"],
              waitFor: 3000,
            }),
          })

          if (!response.ok) return null

          const data = await response.json()
          const markdown = data.data?.markdown || ""
          const html = data.data?.html || ""
          const rating = extractTrustpilotRating(markdown, html)

          if (rating && rating.score > 0) {
            return {
              score: Math.round(rating.score * 10) / 10, // Round to 1 decimal
              reviewCount: rating.reviewCount,
              url: trustpilotUrl,
              fetchedAt,
            }
          }
          return null
        })(),

        // Google Reviews - search for the business
        (async () => {
          // Search Google for the company's reviews/rating
          const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchName + " reviews")}`
          const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: googleSearchUrl,
              formats: ["markdown"],
              waitFor: 2000,
            }),
          })

          if (!response.ok) return null

          const data = await response.json()
          const markdown = data.data?.markdown || ""
          const rating = extractGoogleRating(markdown)

          if (rating && rating.score > 0) {
            return {
              score: Math.round(rating.score * 10) / 10,
              reviewCount: rating.reviewCount,
              url: `https://www.google.com/search?q=${encodeURIComponent(searchName + " reviews")}`,
              fetchedAt,
            }
          }
          return null
        })(),

        // Homepage for social links
        (async () => {
          const homepageUrl = `https://${domain}`
          const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: homepageUrl,
              formats: ["markdown"],
            }),
          })

          if (!response.ok) return null

          const data = await response.json()
          return data.data?.markdown || ""
        })(),
      ])

      // Process Trustpilot rating
      if (trustpilotResult.status === "fulfilled" && trustpilotResult.value) {
        profile.ratings = {
          ...profile.ratings,
          trustpilot: trustpilotResult.value,
        }
      }

      // Process Google rating
      if (googleResult.status === "fulfilled" && googleResult.value) {
        profile.ratings = {
          ...profile.ratings,
          google: googleResult.value,
        }
      }

      // Process social links from homepage
      if (homepageResult.status === "fulfilled" && homepageResult.value) {
        const socialLinks = extractSocialLinks(homepageResult.value, searchName)
        if (Object.keys(socialLinks).length > 0) {
          profile.socialLinks = socialLinks
        }
      }

      // If we didn't get social links from homepage, try the contact or about page
      if (!profile.socialLinks || Object.keys(profile.socialLinks).length === 0) {
        try {
          const aboutPageUrl = `https://${domain}/about`
          const aboutResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: aboutPageUrl,
              formats: ["markdown"],
            }),
          })

          if (aboutResponse.ok) {
            const data = await aboutResponse.json()
            const markdown = data.data?.markdown || ""
            const socialLinks = extractSocialLinks(markdown, searchName)
            if (Object.keys(socialLinks).length > 0) {
              profile.socialLinks = socialLinks
            }
          }
        } catch {
          // Ignore - about page might not exist
        }
      }
    }

    return NextResponse.json({
      company: companyMetadata || {
        name: companyName,
        domain,
        description: officialSite?.text?.slice(0, 300) || null,
        ogImage: null,
        favicon: domain ? `https://${domain}/favicon.ico` : null,
      },
      complaints,
      contacts,
      profile,
      cached: false,
      mock: false,
    })
  } catch (error) {
    console.error("Company research error:", error)
    return NextResponse.json({ error: "Failed to research company" }, { status: 500 })
  }
}

function guessDomain(companyName: string): string {
  const normalized = companyName.toLowerCase().trim()

  const knownDomains: Record<string, string> = {
    amazon: "amazon.com",
    "british airways": "britishairways.com",
    ryanair: "ryanair.com",
    easyjet: "easyjet.com",
    hilton: "hilton.com",
    marriott: "marriott.com",
    tesco: "tesco.com",
    sainsburys: "sainsburys.co.uk",
    asda: "asda.com",
    argos: "argos.co.uk",
    currys: "currys.co.uk",
    "john lewis": "johnlewis.com",
    vodafone: "vodafone.co.uk",
    ee: "ee.co.uk",
    three: "three.co.uk",
    o2: "o2.co.uk",
    sky: "sky.com",
    bt: "bt.com",
    virgin: "virginmedia.com",
  }

  if (knownDomains[normalized]) {
    return knownDomains[normalized]
  }

  return normalized.replace(/\s+/g, "") + ".com"
}
