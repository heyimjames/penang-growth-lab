// Helper to extract domain from company name or URL
// This is a shared utility that can be used by both server and client components

export function extractDomain(input: string, existingDomain?: string | null): string | null {
  // If we already have a domain, use it
  if (existingDomain) {
    return existingDomain
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .toLowerCase()
  }

  if (!input || input.trim().length < 2) return null

  // If it looks like a URL or domain, clean it up
  if (input.includes(".")) {
    return input
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .toLowerCase()
  }

  // Common company to domain mappings
  const commonMappings: Record<string, string> = {
    amazon: "amazon.com",
    google: "google.com",
    apple: "apple.com",
    microsoft: "microsoft.com",
    "british airways": "britishairways.com",
    ryanair: "ryanair.com",
    easyjet: "easyjet.com",
    hilton: "hilton.com",
    marriott: "marriott.com",
    booking: "booking.com",
    "booking.com": "booking.com",
    airbnb: "airbnb.com",
    uber: "uber.com",
    deliveroo: "deliveroo.com",
    "just eat": "just-eat.co.uk",
    argos: "argos.co.uk",
    currys: "currys.co.uk",
    "john lewis": "johnlewis.com",
    tesco: "tesco.com",
    sainsburys: "sainsburys.co.uk",
    asda: "asda.com",
    vodafone: "vodafone.co.uk",
    ee: "ee.co.uk",
    three: "three.co.uk",
    o2: "o2.co.uk",
    sky: "sky.com",
    bt: "bt.com",
    "virgin media": "virginmedia.com",
    "pure gym": "puregym.com",
    puregym: "puregym.com",
    netflix: "netflix.com",
    spotify: "spotify.com",
    disney: "disney.com",
    "disney+": "disneyplus.com",
    expedia: "expedia.com",
    "hotels.com": "hotels.com",
    tripadvisor: "tripadvisor.com",
    kayak: "kayak.com",
    skyscanner: "skyscanner.com",
    trainline: "trainline.com",
    "national rail": "nationalrail.co.uk",
    "paradise beach resort": "paradisebeachresort.com",
  }

  const lowerInput = input.toLowerCase().trim()
  if (commonMappings[lowerInput]) {
    return commonMappings[lowerInput]
  }

  // Generate a domain from the company name
  const simplified = lowerInput.replace(/[^a-z0-9]/g, "")
  if (simplified.length >= 2) {
    return `${simplified}.com`
  }

  return null
}




