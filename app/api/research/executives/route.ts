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

interface ExecutiveContact {
  name: string
  title: string
  email?: string
  linkedIn?: string
}

// Third-party domains that are NOT the company we're researching
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
  
  const normalizedCompanyDomain = companyDomain.toLowerCase().replace(/^www\./, "")
  return emailDomain === normalizedCompanyDomain || emailDomain.endsWith("." + normalizedCompanyDomain)
}

// Executive titles to search for
const EXECUTIVE_TITLES = [
  "CEO",
  "COO",
  "CFO",
  "CTO",
  "CMO",
  "Chief Executive Officer",
  "Chief Operating Officer", 
  "Chief Financial Officer",
  "Chief Technology Officer",
  "Chief Marketing Officer",
  "Chief Customer Officer",
  "Managing Director",
  "President",
  "Vice President Customer",
  "VP Customer Experience",
  "Director of Customer Service",
  "Head of Customer Service",
  "Head of Customer Experience",
  "Customer Success Director",
  "Founder",
  "Co-Founder",
]

export async function POST(request: NextRequest) {
  try {
    const { companyName, domain } = await request.json()

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    const EXA_API_KEY = process.env.EXA_API_KEY

    if (!EXA_API_KEY) {
      return NextResponse.json({ 
        error: "Search not available",
        executives: [],
        emails: [] 
      }, { status: 503 })
    }

    const executives: ExecutiveContact[] = []
    const emails: string[] = []
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

    // Search for executives on LinkedIn and company website
    const searchDomains = ["linkedin.com"]
    if (domain) searchDomains.push(domain)

    const executiveSearch = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "x-api-key": EXA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${companyName} CEO COO CFO "Chief Executive" "Chief Customer" "Head of Customer Service" executive leadership team email contact`,
        type: "neural",
        useAutoprompt: true,
        numResults: 15,
        contents: {
          text: { maxCharacters: 3000 },
          highlights: true,
        },
        includeDomains: searchDomains,
      }),
    })

    if (!executiveSearch.ok) {
      console.error("Exa search failed:", await executiveSearch.text())
      return NextResponse.json({ 
        executives: [],
        emails: [],
        error: "Search failed" 
      })
    }

    const execData: ExaSearchResponse = await executiveSearch.json()

    // Also search specifically for contact/email pages
    const contactSearch = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "x-api-key": EXA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${companyName} executive email address contact complaints escalation CEO email`,
        type: "neural",
        useAutoprompt: true,
        numResults: 10,
        contents: {
          text: { maxCharacters: 2000 },
          highlights: true,
        },
      }),
    })

    let contactData: ExaSearchResponse = { results: [] }
    if (contactSearch.ok) {
      contactData = await contactSearch.json()
    }

    // Combine results
    const allResults = [...(execData.results || []), ...(contactData.results || [])]

    // Extract emails from all results
    for (const result of allResults) {
      const textContent = (result.text || "") + " " + (result.highlights?.join(" ") || "")
      const foundEmails = textContent.match(emailRegex) || []
      
      foundEmails.forEach((email: string) => {
        const lowerEmail = email.toLowerCase()
        // Filter out useless and third-party emails
        if (
          !lowerEmail.includes("noreply") &&
          !lowerEmail.includes("no-reply") &&
          !lowerEmail.includes("privacy") &&
          !lowerEmail.includes("careers") &&
          !lowerEmail.includes("newsletter") &&
          !lowerEmail.includes("example.com") &&
          !lowerEmail.includes("sentry.io") &&
          !isThirdPartyEmail(lowerEmail) &&
          !emails.includes(lowerEmail)
        ) {
          // Prioritize emails matching company domain
          if (emailMatchesDomain(lowerEmail, domain)) {
            emails.unshift(lowerEmail) // Add to front
          } else {
            emails.push(lowerEmail)
          }
        }
      })
    }

    // Parse executive info from results
    for (const result of execData.results || []) {
      const text = result.text || ""
      const title = result.title || ""

      // Check if this result contains executive info
      for (const execTitle of EXECUTIVE_TITLES) {
        const execTitleLower = execTitle.toLowerCase()
        if (
          title.toLowerCase().includes(execTitleLower) || 
          text.toLowerCase().includes(execTitleLower)
        ) {
          // Try to extract name from LinkedIn URL or title
          let name = ""
          if (result.url.includes("linkedin.com/in/")) {
            const linkedInPath = result.url.split("linkedin.com/in/")[1]?.split(/[/?]/)[0] || ""
            name = linkedInPath
              .split("-")
              .filter((part: string) => part.length > 1 && isNaN(Number(part)))
              .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
              .slice(0, 3) // Max 3 parts (first, middle, last)
              .join(" ")
          } else if (title) {
            // Try to extract name from title
            const nameMatch = title.match(/^([A-Z][a-z]+ (?:[A-Z][a-z]+ )?[A-Z][a-z]+)/)
            if (nameMatch) name = nameMatch[1]
          }

          // Find any email that might be related to this person
          const nameParts = name.toLowerCase().split(" ")
          const matchingEmail = emails.find(e => 
            nameParts.some(part => e.includes(part)) ||
            e.includes(execTitleLower.split(" ")[0])
          )

          if (name && name.length > 3 && !executives.some((e) => e.name === name)) {
            executives.push({
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

    // Only keep verified executives (those with LinkedIn profiles)
    const verifiedExecutives = executives.filter(e => e.linkedIn)

    // Sort executives: those with emails first, then by title importance
    const titlePriority: Record<string, number> = {
      "CEO": 10,
      "Chief Executive Officer": 10,
      "COO": 9,
      "Chief Operating Officer": 9,
      "Chief Customer Officer": 8,
      "Managing Director": 7,
      "President": 7,
      "Head of Customer Service": 6,
      "Director of Customer Service": 6,
      "Customer Success Director": 5,
      "VP Customer Experience": 4,
      "Vice President Customer": 4,
      "Head of Customer Experience": 4,
      "Founder": 3,
      "Co-Founder": 3,
    }

    verifiedExecutives.sort((a, b) => {
      // Prioritize those with emails
      if (a.email && !b.email) return -1
      if (!a.email && b.email) return 1
      // Then by title importance
      const aPriority = titlePriority[a.title] || 0
      const bPriority = titlePriority[b.title] || 0
      return bPriority - aPriority
    })

    // Score and sort emails
    const scoreEmail = (email: string): number => {
      const lowerEmail = email.toLowerCase()
      if (lowerEmail.includes("ceo@") || lowerEmail.includes("chief")) return 100
      if (lowerEmail.includes("executive@")) return 90
      if (lowerEmail.includes("director")) return 80
      if (lowerEmail.includes("complaints@")) return 70
      if (lowerEmail.includes("customer.service") || lowerEmail.includes("customerservice")) return 60
      if (lowerEmail.includes("support@")) return 50
      if (lowerEmail.includes("contact@")) return 40
      if (lowerEmail.includes("info@")) return 30
      return 20
    }

    const sortedEmails = emails.sort((a, b) => scoreEmail(b) - scoreEmail(a))

    return NextResponse.json({
      executives: verifiedExecutives.slice(0, 10),
      emails: sortedEmails.slice(0, 10),
      searchedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Executive search error:", error)
    return NextResponse.json({ 
      error: "Search failed",
      executives: [],
      emails: [] 
    }, { status: 500 })
  }
}




