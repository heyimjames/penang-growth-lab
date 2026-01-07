import { createClient } from "@/lib/supabase/server"

// ============== TYPE DEFINITIONS ==============

interface CompanyEmail {
  address: string
  type: "Customer Service" | "Complaints" | "General" | "Executive"
}

interface CompanyPhone {
  number: string
  type: "Customer Service" | "Complaints" | "Sales" | "General"
  hours?: string
  cost?: string // e.g., "Free from UK mobiles", "Premium rate"
}

interface CompanyAddress {
  type: "Customer Service" | "Registered Office" | "Head Office"
  lines: string[]
  postcode: string
}

interface SocialMediaLinks {
  twitter?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  trustpilot?: string
}

interface ExecutiveContact {
  name?: string
  title: string
  email?: string
}

interface RelevantLaw {
  name: string
  description: string
  sections?: string[]
}

interface CommonIssue {
  type: string
  title: string
  description: string
  evidenceNeeded?: string[]
  typicalResolution?: string
  successRate?: number
}

interface ComplaintStep {
  step: number
  title: string
  description: string
  timeline: string
  actions: string[]
  templateText?: string
  escalationTrigger?: string
}

interface FAQ {
  question: string
  answer: string
}

interface TemplatePhrase {
  context: string
  text: string
}

interface OmbudsmanInfo {
  name: string
  shortName: string
  url: string
  phone?: string
  description: string
  maxAward?: string
  processingTime?: string
  requirement: string // e.g., "8 weeks or deadlock letter"
}

interface RegulatorInfo {
  name: string
  shortName: string
  url: string
  description: string
  canAward: boolean
}

interface ADRInfo {
  name: string
  url: string
  description: string
}

export interface CompanyData {
  name: string
  slug: string
  domain: string | null
  description: string | null
  industry: string | null
  stats: {
    successRate: number | null
    avgResponseDays: number | null
    totalCases: number
    avgPayout: number | null
  }
  contacts: {
    emails: CompanyEmail[]
    phones: CompanyPhone[]
    addresses: CompanyAddress[]
    socialMedia: SocialMediaLinks
    executives: ExecutiveContact[]
    liveChat?: string
    openingHours?: string
  }
  regulation: {
    ombudsman: OmbudsmanInfo | null
    regulator: RegulatorInfo | null
    adr: ADRInfo | null
    complaintDeadline: string
    escalationDeadline: string
  }
  relevantLaws: RelevantLaw[]
  commonIssues: CommonIssue[]
  complaintProcess: ComplaintStep[]
  tips: string[]
  faqs: FAQ[]
  templatePhrases: TemplatePhrase[]
}

// ============== REGULATORY INFO BY INDUSTRY ==============

const industryRegulation: Record<string, CompanyData["regulation"]> = {
  airline: {
    ombudsman: null, // Airlines don't have a mandatory ombudsman, but CAA ADR
    regulator: {
      name: "Civil Aviation Authority",
      shortName: "CAA",
      url: "https://www.caa.co.uk/passengers/",
      description: "Regulates UK airlines and can take action for systematic issues",
      canAward: false,
    },
    adr: {
      name: "Aviation ADR",
      url: "https://www.aviationadr.org.uk/",
      description: "Free alternative dispute resolution for flight complaints",
    },
    complaintDeadline: "8 weeks",
    escalationDeadline: "6 years from incident",
  },
  telecom: {
    ombudsman: {
      name: "Communications & Internet Services Adjudication Scheme",
      shortName: "CISAS",
      url: "https://www.cisas.org.uk/",
      phone: "020 7520 3827",
      description: "Free ombudsman for telecoms complaints",
      maxAward: "£10,000",
      processingTime: "6-8 weeks",
      requirement: "8 weeks or deadlock letter",
    },
    regulator: {
      name: "Office of Communications",
      shortName: "Ofcom",
      url: "https://www.ofcom.org.uk/",
      description: "Regulates UK telecoms, broadband, and postal services",
      canAward: false,
    },
    adr: null,
    complaintDeadline: "8 weeks",
    escalationDeadline: "12 months from deadlock",
  },
  banking: {
    ombudsman: {
      name: "Financial Ombudsman Service",
      shortName: "FOS",
      url: "https://www.financial-ombudsman.org.uk/",
      phone: "0800 023 4567",
      description: "Free ombudsman for financial services complaints",
      maxAward: "£430,000",
      processingTime: "3-6 months typical",
      requirement: "8 weeks or deadlock letter",
    },
    regulator: {
      name: "Financial Conduct Authority",
      shortName: "FCA",
      url: "https://www.fca.org.uk/",
      description: "Regulates UK financial services firms",
      canAward: false,
    },
    adr: null,
    complaintDeadline: "8 weeks",
    escalationDeadline: "6 months from final response",
  },
  utility: {
    ombudsman: {
      name: "Energy Ombudsman",
      shortName: "Energy Ombudsman",
      url: "https://www.energyombudsman.org/",
      phone: "0330 440 1624",
      description: "Free ombudsman for energy complaints",
      maxAward: "£10,000",
      processingTime: "6-8 weeks",
      requirement: "8 weeks or deadlock letter",
    },
    regulator: {
      name: "Office of Gas and Electricity Markets",
      shortName: "Ofgem",
      url: "https://www.ofgem.gov.uk/",
      description: "Regulates UK gas and electricity markets",
      canAward: false,
    },
    adr: null,
    complaintDeadline: "8 weeks",
    escalationDeadline: "12 months from deadlock",
  },
  insurance: {
    ombudsman: {
      name: "Financial Ombudsman Service",
      shortName: "FOS",
      url: "https://www.financial-ombudsman.org.uk/",
      phone: "0800 023 4567",
      description: "Free ombudsman for insurance complaints",
      maxAward: "£430,000",
      processingTime: "3-6 months typical",
      requirement: "8 weeks or deadlock letter",
    },
    regulator: {
      name: "Financial Conduct Authority",
      shortName: "FCA",
      url: "https://www.fca.org.uk/",
      description: "Regulates UK insurance companies",
      canAward: false,
    },
    adr: null,
    complaintDeadline: "8 weeks",
    escalationDeadline: "6 months from final response",
  },
  retail: {
    ombudsman: null, // No mandatory ombudsman for retail
    regulator: {
      name: "Trading Standards",
      shortName: "Trading Standards",
      url: "https://www.citizensadvice.org.uk/consumer/get-more-help/report-to-trading-standards/",
      description: "Enforces consumer protection laws for retail",
      canAward: false,
    },
    adr: {
      name: "Retail ADR",
      url: "https://www.retailadr.org.uk/",
      description: "Voluntary ADR scheme for retail complaints (if retailer is a member)",
    },
    complaintDeadline: "8 weeks recommended",
    escalationDeadline: "6 years from incident",
  },
  delivery: {
    ombudsman: null,
    regulator: {
      name: "Trading Standards",
      shortName: "Trading Standards",
      url: "https://www.citizensadvice.org.uk/consumer/get-more-help/report-to-trading-standards/",
      description: "Enforces consumer protection laws",
      canAward: false,
    },
    adr: null,
    complaintDeadline: "8 weeks recommended",
    escalationDeadline: "6 years from incident",
  },
  travel: {
    ombudsman: null,
    regulator: {
      name: "Competition and Markets Authority",
      shortName: "CMA",
      url: "https://www.gov.uk/government/organisations/competition-and-markets-authority",
      description: "Enforces competition and consumer law",
      canAward: false,
    },
    adr: {
      name: "ABTA Arbitration",
      url: "https://www.abta.com/help-and-complaints",
      description: "Dispute resolution for ABTA member travel companies",
    },
    complaintDeadline: "8 weeks recommended",
    escalationDeadline: "6 years from incident",
  },
  gym: {
    ombudsman: null,
    regulator: {
      name: "Trading Standards",
      shortName: "Trading Standards",
      url: "https://www.citizensadvice.org.uk/consumer/get-more-help/report-to-trading-standards/",
      description: "Enforces consumer protection laws",
      canAward: false,
    },
    adr: null,
    complaintDeadline: "8 weeks recommended",
    escalationDeadline: "6 years from incident",
  },
  supermarket: {
    ombudsman: null,
    regulator: {
      name: "Trading Standards",
      shortName: "Trading Standards",
      url: "https://www.citizensadvice.org.uk/consumer/get-more-help/report-to-trading-standards/",
      description: "Enforces consumer protection laws",
      canAward: false,
    },
    adr: null,
    complaintDeadline: "8 weeks recommended",
    escalationDeadline: "6 years from incident",
  },
}

// ============== COMPLAINT PROCESS BY INDUSTRY ==============

const industryComplaintProcess: Record<string, ComplaintStep[]> = {
  default: [
    {
      step: 1,
      title: "Contact Customer Service",
      description: "Start by contacting the company directly to explain your issue.",
      timeline: "Day 1",
      actions: [
        "Call or email customer service",
        "Clearly explain what went wrong",
        "State what resolution you want",
        "Ask for a complaint reference number",
      ],
      escalationTrigger: "No response within 14 days or unsatisfactory response",
    },
    {
      step: 2,
      title: "Make a Formal Written Complaint",
      description: "Put your complaint in writing to the complaints department.",
      timeline: "Week 2",
      actions: [
        "Write to the complaints department (email or letter)",
        "Reference your previous contact",
        "Include all evidence (receipts, photos, correspondence)",
        "Set a deadline for response (14 days is reasonable)",
        "Mention relevant laws and your rights",
      ],
      templateText: "I am writing to formally complain about [issue]. Despite contacting customer service on [date], this matter remains unresolved. Under the Consumer Rights Act 2015, I am entitled to [remedy]. I expect a response within 14 days.",
      escalationTrigger: "No satisfactory response within 8 weeks total",
    },
    {
      step: 3,
      title: "Request a Deadlock Letter",
      description: "If unresolved after 8 weeks, ask for a 'deadlock letter' confirming the dispute.",
      timeline: "Week 8",
      actions: [
        "Request a deadlock letter in writing",
        "This confirms you've reached an impasse",
        "You need this to escalate to an ombudsman or ADR",
      ],
      escalationTrigger: "Deadlock letter received or 8 weeks passed",
    },
    {
      step: 4,
      title: "Escalate to Ombudsman or ADR",
      description: "Free external dispute resolution if the company is a member.",
      timeline: "Week 9+",
      actions: [
        "Check if the company is part of an ombudsman or ADR scheme",
        "Submit your complaint with all evidence",
        "The decision is usually binding on the company",
      ],
      escalationTrigger: "Ombudsman decision not accepted",
    },
    {
      step: 5,
      title: "Small Claims Court",
      description: "Legal action for claims up to £10,000 (England/Wales).",
      timeline: "Final resort",
      actions: [
        "Use Money Claim Online (gov.uk)",
        "Court fee depends on claim amount (£35-£455)",
        "No lawyer needed for small claims",
        "Company often settles to avoid court",
      ],
    },
  ],
  airline: [
    {
      step: 1,
      title: "Submit Claim to Airline",
      description: "File your claim through the airline's official complaints process.",
      timeline: "Day 1",
      actions: [
        "Use the airline's online complaints form",
        "Include booking reference and flight details",
        "Attach boarding pass and delay evidence",
        "Clearly state compensation amount claimed",
      ],
      escalationTrigger: "No response within 14 days or claim rejected",
    },
    {
      step: 2,
      title: "Send a Formal Letter Before Action",
      description: "A formal legal letter often prompts airlines to settle.",
      timeline: "Week 3",
      actions: [
        "Send a 'Letter Before Action' to the airline",
        "Reference UK261 and specific compensation amounts",
        "Give 14 days to respond before legal action",
        "Send by email and recorded delivery post",
      ],
      templateText: "LETTER BEFORE ACTION\n\nI am writing regarding my claim for compensation under UK Regulation 261/2004. Flight [number] on [date] was delayed by [hours]. Under Article 7, I am entitled to £[amount]. If payment is not received within 14 days, I will issue court proceedings without further notice.",
      escalationTrigger: "No satisfactory response within 14 days",
    },
    {
      step: 3,
      title: "Use Aviation ADR",
      description: "Free alternative dispute resolution approved by the CAA.",
      timeline: "Week 5",
      actions: [
        "Check if airline is a member of Aviation ADR or CEDR",
        "Submit your complaint online",
        "Decision is binding on the airline",
        "Free for passengers",
      ],
      escalationTrigger: "ADR decision not in your favour",
    },
    {
      step: 4,
      title: "Money Claim Online",
      description: "Take legal action through the small claims court.",
      timeline: "Week 8+",
      actions: [
        "Use Money Claim Online (gov.uk)",
        "Court fee: £35-£115 for most flight claims",
        "Airlines often settle once court claim filed",
        "No lawyer needed",
      ],
    },
  ],
}

// ============== FAQ BY INDUSTRY ==============

const industryFAQs: Record<string, FAQ[]> = {
  airline: [
    { question: "How much compensation am I entitled to?", answer: "Under UK261, you can claim £220 for short flights (<1,500km), £350 for medium flights (1,500-3,500km), or £520 for long flights (>3,500km) if delayed 3+ hours or cancelled." },
    { question: "Can I claim for delays caused by bad weather?", answer: "No, 'extraordinary circumstances' like severe weather, strikes, or security threats are exempt. But technical faults and crew shortages are NOT exempt." },
    { question: "How long do I have to claim?", answer: "You have 6 years from the flight date to make a claim under UK law." },
    { question: "Do I need a lawyer?", answer: "No. Small claims court is designed for individuals. Most cases are straightforward." },
  ],
  telecom: [
    { question: "Can I exit my contract early?", answer: "You can exit penalty-free if the provider significantly changes your contract terms (e.g., price increase beyond RPI). You have 30 days to cancel after notification." },
    { question: "What is automatic compensation?", answer: "Ofcom rules mean providers must automatically compensate for delayed repairs (£9.76/day), missed engineer appointments (£31.59), and delayed new service (£6.10/day)." },
    { question: "How long should I wait before going to the ombudsman?", answer: "You must give the company 8 weeks to resolve your complaint, or receive a deadlock letter, before contacting CISAS or Ombudsman Services." },
  ],
  banking: [
    { question: "What can the Financial Ombudsman award?", answer: "Up to £430,000 in compensation for complaints about events after 1 April 2019. Plus interest and distress/inconvenience awards." },
    { question: "How long do I have to complain?", answer: "You must complain to the bank within 6 years of the problem (or 3 years from when you became aware). Then you have 6 months from the bank's final response to go to FOS." },
    { question: "What if my bank says no?", answer: "The Financial Ombudsman upholds around 30-40% of banking complaints. It's worth trying if you have a genuine case." },
  ],
  utility: [
    { question: "What automatic compensation can I get?", answer: "Ofgem requires compensation for: switching delays (£30), missed appointments (£30), wrong billing after switch (£30), and supply interruptions." },
    { question: "Can I switch supplier if I'm in debt?", answer: "Yes, if your debt is under £500. The new supplier will usually take on the debt." },
    { question: "My bill seems too high - what can I do?", answer: "Request a meter reading, check for estimated bills, ask for a smart meter installation, or request a billing review." },
  ],
  retail: [
    { question: "How long do I have to return faulty goods?", answer: "30 days for a full refund. After 30 days, the retailer can offer repair or replacement first. Up to 6 years to make a claim." },
    { question: "The shop says 'no refunds' - is that legal?", answer: "No. Shops cannot remove your statutory rights. You're always entitled to a refund for faulty goods within 30 days regardless of their policy." },
    { question: "Can I return something I've changed my mind about?", answer: "Only for online/phone purchases - you have 14 days. In-store purchases have no legal right to return unless faulty, though many shops offer goodwill returns." },
  ],
  insurance: [
    { question: "My claim was rejected - what can I do?", answer: "Ask for written reasons, check your policy wording, then complain formally. If rejected again, take it to the Financial Ombudsman within 6 months." },
    { question: "How long should a claim take?", answer: "Insurers should settle claims 'promptly'. If taking more than a few weeks for a straightforward claim, complain." },
    { question: "Can they void my policy for an innocent mistake?", answer: "Under the Consumer Insurance Act 2012, insurers can only void policies if you deliberately or recklessly misrepresented facts. Innocent mistakes should be treated proportionately." },
  ],
  gym: [
    { question: "Can I cancel my gym membership?", answer: "You have 14 days cooling-off for memberships signed online or off-premises. After that, check your contract terms - but unfair terms may be unenforceable." },
    { question: "The gym has closed - do I get a refund?", answer: "Yes. If the service is no longer available, you're entitled to a refund for the unused portion of your membership." },
    { question: "They keep charging me after I cancelled - what do I do?", answer: "Contact your bank to dispute the charges and cancel the direct debit. Keep proof of your cancellation." },
  ],
}

// ============== TEMPLATE PHRASES ==============

const commonTemplatePhrases: TemplatePhrase[] = [
  { context: "Opening a complaint", text: "I am writing to formally complain about [issue] that occurred on [date]." },
  { context: "Stating your rights", text: "Under the Consumer Rights Act 2015, I am entitled to [goods of satisfactory quality / services performed with reasonable care and skill / a full refund within 30 days]." },
  { context: "Describing impact", text: "This has caused me [financial loss of £X / significant inconvenience / distress] because [specific impact]." },
  { context: "Requesting resolution", text: "To resolve this matter, I am requesting [full refund / compensation of £X / replacement / repair] within 14 days." },
  { context: "Setting a deadline", text: "If I do not receive a satisfactory response within 14 days, I will escalate this complaint to [ombudsman/trading standards/court]." },
  { context: "Escalation warning", text: "I have given you reasonable time to resolve this matter. If not resolved by [date], I will proceed with formal escalation including [ombudsman complaint / small claims court action]." },
  { context: "Evidence reference", text: "I enclose copies of [receipt / booking confirmation / photographs / previous correspondence] as evidence of my claim." },
]

// Default data by industry
const industryDefaults: Record<
  string,
  { laws: RelevantLaw[]; issues: CommonIssue[]; tips: string[] }
> = {
  airline: {
    laws: [
      {
        name: "UK261 Flight Compensation Regulation",
        description:
          "Compensation of £220-£520 for delays over 3 hours, cancellations, and denied boarding on UK flights.",
        sections: ["UK261/2004", "Article 7"],
      },
      {
        name: "Consumer Rights Act 2015",
        description:
          "Services must be performed with reasonable care and skill.",
        sections: ["Section 49", "Section 54"],
      },
    ],
    issues: [
      {
        type: "flight-delay",
        title: "Flight Delayed Over 3 Hours",
        description: "Claim compensation of £220-£520",
      },
      {
        type: "flight-cancelled",
        title: "Flight Cancelled",
        description: "Full refund plus compensation",
      },
      {
        type: "lost-baggage",
        title: "Lost or Damaged Baggage",
        description: "Claim up to £1,300 under Montreal Convention",
      },
      {
        type: "denied-boarding",
        title: "Denied Boarding",
        description: "Compensation plus alternative flight",
      },
    ],
    tips: [
      "Keep your boarding pass and booking confirmation",
      "Document the delay with photos of departure boards",
      "Airlines must provide food, drink, and accommodation for long delays",
      "You can claim for flights up to 6 years old",
      "Extraordinary circumstances don't include crew shortages or technical issues",
    ],
  },
  retail: {
    laws: [
      {
        name: "Consumer Rights Act 2015",
        description:
          "Products must be of satisfactory quality, fit for purpose, and as described.",
        sections: ["Section 9", "Section 10", "Section 11"],
      },
      {
        name: "Consumer Contracts Regulations 2013",
        description:
          "14-day cooling-off period for online and distance purchases.",
        sections: ["Regulation 29", "Regulation 30"],
      },
      {
        name: "Section 75 Protection",
        description:
          "Credit card purchases between £100-£30,000 have joint liability protection.",
      },
    ],
    issues: [
      {
        type: "faulty-product",
        title: "Faulty or Defective Product",
        description: "Full refund within 30 days, repair/replace after",
      },
      {
        type: "not-as-described",
        title: "Item Not as Described",
        description: "Full refund or replacement",
      },
      {
        type: "non-delivery",
        title: "Item Never Arrived",
        description: "Full refund if not delivered",
      },
      {
        type: "return-refused",
        title: "Return Refused",
        description: "Challenge unfair return policies",
      },
    ],
    tips: [
      "Keep all receipts and order confirmations",
      "Take photos of any defects or damage",
      "You have 30 days for a full refund on faulty goods",
      "The retailer is responsible, not the manufacturer",
      "Online purchases have a 14-day cooling-off period",
    ],
  },
  telecom: {
    laws: [
      {
        name: "Consumer Rights Act 2015",
        description:
          "Services must be performed with reasonable care and skill.",
        sections: ["Section 49"],
      },
      {
        name: "Ofcom General Conditions",
        description:
          "Rules for contract changes, billing accuracy, and switching.",
      },
      {
        name: "Communications Act 2003",
        description:
          "Regulatory framework for electronic communications services.",
      },
    ],
    issues: [
      {
        type: "billing-error",
        title: "Incorrect Billing",
        description: "Dispute unexpected charges",
      },
      {
        type: "contract-dispute",
        title: "Contract Dispute",
        description: "Challenge unfair contract terms",
      },
      {
        type: "service-quality",
        title: "Poor Service Quality",
        description: "Compensation for outages",
      },
      {
        type: "cancellation-issue",
        title: "Cancellation Problem",
        description: "Challenge exit fees or delays",
      },
    ],
    tips: [
      "Document all service outages with dates and times",
      "Keep records of all billing statements",
      "You can exit contracts penalty-free if terms change significantly",
      "Ofcom has automatic compensation rules for some issues",
      "Use the Ombudsman Services after 8 weeks of deadlock",
    ],
  },
  banking: {
    laws: [
      {
        name: "Consumer Rights Act 2015",
        description:
          "Financial services must be performed with reasonable care and skill.",
      },
      {
        name: "Payment Services Regulations 2017",
        description:
          "Protection for unauthorized transactions and payment errors.",
      },
      {
        name: "FCA Consumer Duty",
        description:
          "Financial firms must act in customers' best interests.",
      },
    ],
    issues: [
      {
        type: "unauthorized-charge",
        title: "Unauthorized Transaction",
        description: "Reclaim fraudulent charges",
      },
      {
        type: "unfair-fee",
        title: "Unfair Fees",
        description: "Challenge excessive charges",
      },
      {
        type: "account-issue",
        title: "Account Problem",
        description: "Resolve access or closure issues",
      },
      {
        type: "mis-selling",
        title: "Product Mis-selling",
        description: "Compensation for unsuitable products",
      },
    ],
    tips: [
      "Report unauthorized transactions within 13 months",
      "Banks must respond to complaints within 8 weeks",
      "The Financial Ombudsman can award up to £430,000",
      "Keep records of all communications",
      "Vulnerable customers have additional protections",
    ],
  },
  utility: {
    laws: [
      {
        name: "Consumer Rights Act 2015",
        description:
          "Utility services must be performed with reasonable care and skill.",
      },
      {
        name: "Ofgem Standards of Conduct",
        description:
          "Rules for fair treatment and accurate billing.",
      },
    ],
    issues: [
      {
        type: "billing-error",
        title: "Billing Error",
        description: "Dispute incorrect charges",
      },
      {
        type: "supply-issue",
        title: "Supply Problem",
        description: "Compensation for outages",
      },
      {
        type: "switching-issue",
        title: "Switching Problem",
        description: "Resolve supplier switch issues",
      },
      {
        type: "meter-problem",
        title: "Meter Issue",
        description: "Challenge inaccurate readings",
      },
    ],
    tips: [
      "Take regular meter readings and photos",
      "Keep copies of all bills and statements",
      "Energy companies must give notice before price increases",
      "You can switch supplier without penalty in most cases",
      "The Energy Ombudsman can help after 8 weeks",
    ],
  },
  delivery: {
    laws: [
      {
        name: "Consumer Rights Act 2015",
        description:
          "Delivery services must be performed with reasonable care and skill.",
        sections: ["Section 49", "Section 52"],
      },
      {
        name: "Consumer Contracts Regulations 2013",
        description:
          "Goods must be delivered within 30 days unless otherwise agreed.",
        sections: ["Regulation 42"],
      },
    ],
    issues: [
      {
        type: "lost-parcel",
        title: "Lost Parcel",
        description: "Full refund for lost items",
      },
      {
        type: "damaged-parcel",
        title: "Damaged Parcel",
        description: "Compensation for damaged goods",
      },
      {
        type: "misdelivered",
        title: "Misdelivered Parcel",
        description: "Parcel left in wrong location",
      },
      {
        type: "late-delivery",
        title: "Late Delivery",
        description: "Missed delivery deadline",
      },
    ],
    tips: [
      "The retailer is responsible, not the courier - complain to the seller first",
      "Take photos of damaged packaging before opening",
      "Check 'safe place' instructions on your account",
      "Request signature on delivery for valuable items",
      "Keep tracking information and delivery notifications",
    ],
  },
  travel: {
    laws: [
      {
        name: "Package Travel Regulations 2018",
        description:
          "Protection for package holidays including compensation for significant issues.",
        sections: ["Regulation 15", "Regulation 16"],
      },
      {
        name: "Consumer Rights Act 2015",
        description:
          "Travel services must be performed with reasonable care and skill.",
      },
      {
        name: "ATOL Protection",
        description:
          "Financial protection for air package holidays if company fails.",
      },
    ],
    issues: [
      {
        type: "holiday-ruined",
        title: "Holiday Not As Described",
        description: "Compensation for misrepresentation",
      },
      {
        type: "accommodation-issue",
        title: "Accommodation Problems",
        description: "Dirty, wrong room, or unavailable",
      },
      {
        type: "cancellation",
        title: "Booking Cancelled",
        description: "Full refund plus compensation",
      },
      {
        type: "price-increase",
        title: "Price Increase After Booking",
        description: "Challenge unfair price changes",
      },
    ],
    tips: [
      "Document everything with photos and videos",
      "Report problems to the rep immediately and get written confirmation",
      "Keep all receipts for expenses caused by issues",
      "Package holidays have stronger protection than DIY bookings",
      "Check if your booking is ATOL or ABTA protected",
    ],
  },
  insurance: {
    laws: [
      {
        name: "Consumer Insurance Act 2012",
        description:
          "Requires consumers to take reasonable care not to misrepresent facts.",
      },
      {
        name: "FCA Insurance Conduct of Business",
        description:
          "Rules for fair treatment and claims handling.",
        sections: ["ICOBS 8"],
      },
      {
        name: "FCA Consumer Duty",
        description:
          "Insurance firms must act in customers' best interests.",
      },
    ],
    issues: [
      {
        type: "claim-rejected",
        title: "Claim Rejected",
        description: "Challenge unfair claim denial",
      },
      {
        type: "underpaid-claim",
        title: "Underpaid Claim",
        description: "Settlement too low",
      },
      {
        type: "policy-cancelled",
        title: "Policy Cancelled Unfairly",
        description: "Challenge cancellation",
      },
      {
        type: "premium-increase",
        title: "Excessive Premium Increase",
        description: "Dispute renewal price hike",
      },
    ],
    tips: [
      "Read your policy documents carefully before claiming",
      "Keep all correspondence and claim reference numbers",
      "Insurers must handle claims fairly and promptly",
      "The Financial Ombudsman is free to use",
      "Get independent valuations for disputed amounts",
    ],
  },
  gym: {
    laws: [
      {
        name: "Consumer Rights Act 2015",
        description:
          "Gym services must be performed with reasonable care and skill.",
        sections: ["Section 49"],
      },
      {
        name: "Consumer Contracts Regulations 2013",
        description:
          "14-day cooling-off period for gym memberships signed online or off-premises.",
      },
      {
        name: "Unfair Terms Regulations",
        description:
          "Contract terms must be fair and clearly explained.",
      },
    ],
    issues: [
      {
        type: "cancellation-refused",
        title: "Can't Cancel Membership",
        description: "Challenge unfair cancellation terms",
      },
      {
        type: "hidden-fees",
        title: "Hidden Fees",
        description: "Unexpected charges or admin fees",
      },
      {
        type: "facility-closed",
        title: "Facility Closure",
        description: "Gym closed without notice or refund",
      },
      {
        type: "contract-dispute",
        title: "Contract Dispute",
        description: "Terms not as agreed",
      },
    ],
    tips: [
      "Check the minimum contract period before signing",
      "You have 14 days to cancel online sign-ups",
      "Gyms can't enforce unfair cancellation terms",
      "Medical evidence may allow early termination",
      "Direct debit gives you chargeback rights",
    ],
  },
  supermarket: {
    laws: [
      {
        name: "Consumer Rights Act 2015",
        description:
          "Products must be of satisfactory quality and as described.",
        sections: ["Section 9", "Section 10", "Section 11"],
      },
      {
        name: "Food Safety Act 1990",
        description:
          "Food must be safe to eat and as described.",
      },
      {
        name: "Weights and Measures Act 1985",
        description:
          "Products must be accurately weighed and measured.",
      },
    ],
    issues: [
      {
        type: "food-quality",
        title: "Poor Food Quality",
        description: "Expired, spoiled, or contaminated food",
      },
      {
        type: "price-mismatch",
        title: "Price Mismatch",
        description: "Charged more than shelf price",
      },
      {
        type: "substitution",
        title: "Unacceptable Substitution",
        description: "Online order substituted poorly",
      },
      {
        type: "missing-items",
        title: "Missing Items",
        description: "Items charged but not delivered",
      },
    ],
    tips: [
      "Check use-by dates before purchasing",
      "Keep receipts for price disputes",
      "Report food safety issues to Environmental Health",
      "Substitutions can be rejected at delivery",
      "Clubcard/loyalty prices must be honored if advertised",
    ],
  },
}

// Known companies with specific data
const knownCompanies: Record<string, Partial<CompanyData>> = {
  // ============== AIRLINES ==============
  ryanair: {
    name: "Ryanair",
    domain: "ryanair.com",
    description: "Europe's largest budget airline, known for low fares but strict policies on baggage, check-in, and changes. Common complaints include flight delays, denied boarding, and baggage fees.",
    industry: "airline",
    contacts: {
      emails: [
        { address: "customerqueries@ryanair.com", type: "Customer Service" },
        { address: "legalclaims@ryanair.com", type: "Complaints" },
      ],
      phones: [
        { number: "0330 100 7838", type: "Customer Service", hours: "Mon-Fri 9am-7pm, Sat 9am-6pm, Sun 10am-6pm", cost: "Local rate" },
        { number: "+353 1 249 7791", type: "Customer Service", hours: "24/7 for urgent booking issues", cost: "International rate" },
      ],
      addresses: [
        { type: "Registered Office", lines: ["Ryanair DAC", "Ryanair Dublin Office", "Airside Business Park", "Swords", "Co. Dublin"], postcode: "K67 NY94" },
        { type: "Customer Service", lines: ["Ryanair Customer Service", "PO Box 11451", "Swords"], postcode: "Co. Dublin" },
      ],
      socialMedia: {
        twitter: "Ryanair",
        facebook: "ryanair",
        instagram: "ryanair",
        trustpilot: "ryanair.com",
      },
      executives: [
        { name: "Michael O'Leary", title: "Group CEO", email: "michael.oleary@ryanair.com" },
        { name: "Eddie Wilson", title: "CEO Ryanair DAC", email: "eddie.wilson@ryanair.com" },
      ],
      liveChat: "https://www.ryanair.com/gb/en/useful-info/help-centre",
      openingHours: "Customer service: Mon-Fri 9am-7pm, Sat 9am-6pm, Sun 10am-6pm",
    },
  },
  "british-airways": {
    name: "British Airways",
    domain: "britishairways.com",
    description: "UK's flag carrier airline offering flights worldwide. Common complaints include delays, cancellations, lost baggage, and issues with Executive Club loyalty programme.",
    industry: "airline",
    contacts: {
      emails: [
        { address: "customer.relations@ba.com", type: "Customer Service" },
        { address: "your.relations@ba.com", type: "Complaints" },
      ],
      phones: [
        { number: "0344 493 0787", type: "Customer Service", hours: "24/7", cost: "Local rate" },
        { number: "0344 493 0777", type: "Complaints", hours: "Mon-Fri 9am-5pm", cost: "Local rate" },
      ],
      addresses: [
        { type: "Customer Service", lines: ["British Airways Customer Relations", "PO Box 5619", "Sudbury"], postcode: "CO10 2PG" },
        { type: "Registered Office", lines: ["British Airways Plc", "Waterside", "PO Box 365", "Harmondsworth", "West Drayton"], postcode: "UB7 0GB" },
      ],
      socialMedia: {
        twitter: "British_Airways",
        facebook: "britishairways",
        instagram: "britishairways",
        trustpilot: "britishairways.com",
      },
      executives: [
        { name: "Sean Doyle", title: "CEO British Airways", email: "sean.doyle@ba.com" },
      ],
      liveChat: "https://www.britishairways.com/travel/help-and-contacts/public/en_gb",
      openingHours: "24/7 phone support",
    },
  },
  easyjet: {
    name: "easyJet",
    domain: "easyjet.com",
    description: "UK-based low-cost carrier serving European destinations. Common complaints include flight delays, cancellations, and baggage issues.",
    industry: "airline",
    contacts: {
      emails: [
        { address: "customerservices@easyjet.com", type: "Customer Service" },
        { address: "complaints@easyjet.com", type: "Complaints" },
      ],
      phones: [
        { number: "0330 365 5000", type: "Customer Service", hours: "8am-8pm daily", cost: "Local rate" },
      ],
      addresses: [
        { type: "Registered Office", lines: ["easyJet Airline Company Limited", "Hangar 89", "London Luton Airport"], postcode: "LU2 9PF" },
        { type: "Customer Service", lines: ["easyJet Customer Services", "PO Box 695", "Luton"], postcode: "LU1 9JR" },
      ],
      socialMedia: {
        twitter: "easyJet",
        facebook: "easyJet",
        instagram: "easyjet",
        trustpilot: "easyjet.com",
      },
      executives: [
        { name: "Johan Lundgren", title: "CEO easyJet" },
      ],
      liveChat: "https://www.easyjet.com/en/help",
      openingHours: "8am-8pm daily",
    },
  },
  "wizz-air": {
    name: "Wizz Air",
    domain: "wizzair.com",
    description: "Hungarian ultra low-cost carrier popular in UK",
    industry: "airline",
    contacts: {
      emails: [
        { address: "info@wizzair.com", type: "Customer Service" },
        { address: "complaints@wizzair.com", type: "Complaints" },
      ],
      executives: [
        { name: "József Váradi", title: "CEO Wizz Air" },
      ],
    },
  },
  jet2: {
    name: "Jet2",
    domain: "jet2.com",
    description: "UK leisure airline and package holiday company",
    industry: "airline",
    contacts: {
      emails: [
        { address: "customerservices@jet2.com", type: "Customer Service" },
        { address: "customer.relations@jet2.com", type: "Complaints" },
      ],
      executives: [
        { name: "Steve Heapy", title: "CEO Jet2" },
      ],
    },
  },
  "tui-airways": {
    name: "TUI Airways",
    domain: "tui.co.uk",
    description: "UK's largest holiday airline",
    industry: "airline",
    contacts: {
      emails: [
        { address: "customer.support@tui.co.uk", type: "Customer Service" },
        { address: "customerrelations@tui.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "David Burling", title: "Managing Director TUI UK" },
      ],
    },
  },
  "virgin-atlantic": {
    name: "Virgin Atlantic",
    domain: "virginatlantic.com",
    description: "UK long-haul airline",
    industry: "airline",
    contacts: {
      emails: [
        { address: "customer.relations@fly.virgin.com", type: "Customer Service" },
        { address: "complaints@fly.virgin.com", type: "Complaints" },
      ],
      executives: [
        { name: "Shai Weiss", title: "CEO Virgin Atlantic" },
      ],
    },
  },

  // ============== TELECOMS ==============
  "virgin-media": {
    name: "Virgin Media",
    domain: "virginmedia.com",
    description: "UK telecommunications provider",
    industry: "telecom",
    contacts: {
      emails: [
        { address: "complaints@virginmedia.com", type: "Complaints" },
        { address: "customer.support@virginmedia.co.uk", type: "Customer Service" },
      ],
      executives: [
        { name: "Lutz Schüler", title: "CEO Virgin Media O2" },
      ],
    },
  },
  bt: {
    name: "BT",
    domain: "bt.com",
    description: "British telecommunications company",
    industry: "telecom",
    contacts: {
      emails: [
        { address: "btcustomerservices@bt.com", type: "Customer Service" },
        { address: "complaints@bt.com", type: "Complaints" },
      ],
      executives: [
        { name: "Philip Jansen", title: "CEO BT Group" },
      ],
    },
  },
  sky: {
    name: "Sky",
    domain: "sky.com",
    description: "UK broadcaster and telecommunications company",
    industry: "telecom",
    contacts: {
      emails: [
        { address: "mysky@sky.uk", type: "Customer Service" },
        { address: "customersupport@sky.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Dana Strong", title: "Group CEO Sky" },
      ],
    },
  },
  three: {
    name: "Three",
    domain: "three.co.uk",
    description: "UK mobile network operator",
    industry: "telecom",
    contacts: {
      emails: [
        { address: "complaints@three.co.uk", type: "Complaints" },
        { address: "customerservices@three.co.uk", type: "Customer Service" },
      ],
      executives: [
        { name: "Robert Finnegan", title: "CEO Three UK" },
      ],
    },
  },
  vodafone: {
    name: "Vodafone",
    domain: "vodafone.co.uk",
    description: "Global telecommunications company",
    industry: "telecom",
    contacts: {
      emails: [
        { address: "customer.services@vodafone.co.uk", type: "Customer Service" },
        { address: "executivecomplaint@vodafone.com", type: "Executive" },
      ],
      executives: [
        { name: "Margherita Della Valle", title: "CEO Vodafone Group" },
      ],
    },
  },
  ee: {
    name: "EE",
    domain: "ee.co.uk",
    description: "UK's largest mobile network",
    industry: "telecom",
    contacts: {
      emails: [
        { address: "customerrelations@ee.co.uk", type: "Complaints" },
        { address: "customer.care@ee.co.uk", type: "Customer Service" },
      ],
      executives: [
        { name: "Marc Sherwood", title: "CEO EE" },
      ],
    },
  },
  talktalk: {
    name: "TalkTalk",
    domain: "talktalk.co.uk",
    description: "UK broadband and phone provider",
    industry: "telecom",
    contacts: {
      emails: [
        { address: "customer.support@talktalk.co.uk", type: "Customer Service" },
        { address: "resolutions@talktalk.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Tristia Harrison", title: "CEO TalkTalk" },
      ],
    },
  },
  plusnet: {
    name: "Plusnet",
    domain: "plus.net",
    description: "UK broadband and home phone provider",
    industry: "telecom",
    contacts: {
      emails: [
        { address: "complaints@plus.net", type: "Complaints" },
        { address: "feedback@plus.net", type: "Customer Service" },
      ],
      executives: [
        { name: "Andy Baker", title: "CEO Plusnet" },
      ],
    },
  },

  // ============== RETAIL ==============
  amazon: {
    name: "Amazon",
    domain: "amazon.co.uk",
    description: "Global e-commerce and technology company",
    industry: "retail",
    contacts: {
      emails: [
        { address: "cs-reply@amazon.co.uk", type: "Customer Service" },
        { address: "executive-relations@amazon.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Doug Gurr", title: "UK Country Manager" },
        { name: "Andy Jassy", title: "CEO Amazon" },
      ],
    },
  },
  argos: {
    name: "Argos",
    domain: "argos.co.uk",
    description: "UK catalogue and retail store",
    industry: "retail",
    contacts: {
      emails: [
        { address: "customerservices@argos.co.uk", type: "Customer Service" },
        { address: "executive.support@sainsburys.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Simon Roberts", title: "CEO Sainsbury's Group" },
      ],
    },
  },
  currys: {
    name: "Currys",
    domain: "currys.co.uk",
    description: "UK electrical retailer",
    industry: "retail",
    contacts: {
      emails: [
        { address: "customer.services@currys.co.uk", type: "Customer Service" },
        { address: "ceoteam@currys.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Alex Mayfield", title: "CEO Currys" },
      ],
    },
  },
  "john-lewis": {
    name: "John Lewis",
    domain: "johnlewis.com",
    description: "UK department store chain",
    industry: "retail",
    contacts: {
      emails: [
        { address: "customer.services@johnlewis.co.uk", type: "Customer Service" },
        { address: "executive.office@johnlewis.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Nish Kankiwala", title: "CEO John Lewis Partnership" },
      ],
    },
  },
  asos: {
    name: "ASOS",
    domain: "asos.com",
    description: "Online fashion retailer",
    industry: "retail",
    contacts: {
      emails: [
        { address: "customercare@asos.com", type: "Customer Service" },
        { address: "complaints@asos.com", type: "Complaints" },
      ],
      executives: [
        { name: "José Antonio Ramos Calamonte", title: "CEO ASOS" },
      ],
    },
  },
  boohoo: {
    name: "Boohoo",
    domain: "boohoo.com",
    description: "Online fast fashion retailer",
    industry: "retail",
    contacts: {
      emails: [
        { address: "customerservices@boohoo.com", type: "Customer Service" },
        { address: "complaints@boohoo.com", type: "Complaints" },
      ],
      executives: [
        { name: "John Lyttle", title: "CEO Boohoo Group" },
      ],
    },
  },
  very: {
    name: "Very",
    domain: "very.co.uk",
    description: "Online department store",
    industry: "retail",
    contacts: {
      emails: [
        { address: "customerservice@very.co.uk", type: "Customer Service" },
        { address: "complaints@theverygroup.com", type: "Complaints" },
      ],
      executives: [
        { name: "Henry Sherwood", title: "CEO The Very Group" },
      ],
    },
  },
  "jd-sports": {
    name: "JD Sports",
    domain: "jdsports.co.uk",
    description: "Sports fashion retailer",
    industry: "retail",
    contacts: {
      emails: [
        { address: "customercare@jdsports.co.uk", type: "Customer Service" },
        { address: "complaints@jdplc.com", type: "Complaints" },
      ],
      executives: [
        { name: "Régis Schultz", title: "CEO JD Sports" },
      ],
    },
  },
  "sports-direct": {
    name: "Sports Direct",
    domain: "sportsdirect.com",
    description: "UK sports retailer",
    industry: "retail",
    contacts: {
      emails: [
        { address: "customerservices@sportsdirect.com", type: "Customer Service" },
        { address: "ceoteam@frasers.group", type: "Executive" },
      ],
      executives: [
        { name: "Michael Murray", title: "CEO Frasers Group" },
      ],
    },
  },
  next: {
    name: "Next",
    domain: "next.co.uk",
    description: "UK clothing and home products retailer",
    industry: "retail",
    contacts: {
      emails: [
        { address: "comments@next.co.uk", type: "Customer Service" },
        { address: "companysecretary@next.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Simon Wolfson", title: "CEO Next" },
      ],
    },
  },
  "marks-and-spencer": {
    name: "Marks & Spencer",
    domain: "marksandspencer.com",
    description: "British retailer of clothing, food, and home products",
    industry: "retail",
    contacts: {
      emails: [
        { address: "customerservices@marksandspencer.com", type: "Customer Service" },
        { address: "executive.office@marks-and-spencer.com", type: "Executive" },
      ],
      executives: [
        { name: "Stuart Machin", title: "CEO M&S" },
      ],
    },
  },
  ikea: {
    name: "IKEA",
    domain: "ikea.com/gb",
    description: "Swedish furniture retailer",
    industry: "retail",
    contacts: {
      emails: [
        { address: "customerrelations.uk@ingka.ikea.com", type: "Customer Service" },
        { address: "complaints.uk@ikea.com", type: "Complaints" },
      ],
      executives: [
        { name: "Peter Jelkeby", title: "Country Retail Manager UK & IE" },
      ],
    },
  },
  wayfair: {
    name: "Wayfair",
    domain: "wayfair.co.uk",
    description: "Online furniture and home goods retailer",
    industry: "retail",
    contacts: {
      emails: [
        { address: "service@wayfair.co.uk", type: "Customer Service" },
        { address: "escalations@wayfair.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Niraj Shah", title: "CEO Wayfair" },
      ],
    },
  },

  // ============== SUPERMARKETS ==============
  tesco: {
    name: "Tesco",
    domain: "tesco.com",
    description: "UK's largest supermarket chain",
    industry: "supermarket",
    contacts: {
      emails: [
        { address: "customer.service@tesco.co.uk", type: "Customer Service" },
        { address: "executive.support@tesco.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Ken Murphy", title: "CEO Tesco" },
      ],
    },
  },
  sainsburys: {
    name: "Sainsbury's",
    domain: "sainsburys.co.uk",
    description: "UK supermarket chain",
    industry: "supermarket",
    contacts: {
      emails: [
        { address: "customerservice@sainsburys.co.uk", type: "Customer Service" },
        { address: "executive.support@sainsburys.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Simon Roberts", title: "CEO Sainsbury's" },
      ],
    },
  },
  asda: {
    name: "Asda",
    domain: "asda.com",
    description: "UK supermarket chain",
    industry: "supermarket",
    contacts: {
      emails: [
        { address: "customer.services@asda.co.uk", type: "Customer Service" },
        { address: "ceoteam@asda.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Mohsin Issa", title: "Co-owner Asda" },
      ],
    },
  },
  morrisons: {
    name: "Morrisons",
    domain: "morrisons.com",
    description: "UK supermarket chain",
    industry: "supermarket",
    contacts: {
      emails: [
        { address: "customer.services@morrisonsplc.co.uk", type: "Customer Service" },
        { address: "yourcomments@morrisons.com", type: "Complaints" },
      ],
      executives: [
        { name: "Rami Baitiéh", title: "CEO Morrisons" },
      ],
    },
  },
  aldi: {
    name: "Aldi",
    domain: "aldi.co.uk",
    description: "German discount supermarket chain",
    industry: "supermarket",
    contacts: {
      emails: [
        { address: "customer.service@aldi.co.uk", type: "Customer Service" },
        { address: "complaints@aldi.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Giles Hurley", title: "CEO Aldi UK & Ireland" },
      ],
    },
  },
  lidl: {
    name: "Lidl",
    domain: "lidl.co.uk",
    description: "German discount supermarket chain",
    industry: "supermarket",
    contacts: {
      emails: [
        { address: "customer.services@lidl.co.uk", type: "Customer Service" },
        { address: "complaints@lidl.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Ryan McDonnell", title: "CEO Lidl GB" },
      ],
    },
  },
  ocado: {
    name: "Ocado",
    domain: "ocado.com",
    description: "Online supermarket",
    industry: "supermarket",
    contacts: {
      emails: [
        { address: "ocado@ocado.com", type: "Customer Service" },
        { address: "customerfeedback@ocado.com", type: "Complaints" },
      ],
      executives: [
        { name: "Tim Steiner", title: "CEO Ocado Group" },
      ],
    },
  },

  // ============== ENERGY/UTILITY ==============
  "british-gas": {
    name: "British Gas",
    domain: "britishgas.co.uk",
    description: "UK energy and home services provider",
    industry: "utility",
    contacts: {
      emails: [
        { address: "customer.service@britishgas.co.uk", type: "Customer Service" },
        { address: "chiefexecutive@centrica.com", type: "Executive" },
      ],
      executives: [
        { name: "Chris O'Shea", title: "CEO Centrica" },
      ],
    },
  },
  edf: {
    name: "EDF Energy",
    domain: "edfenergy.com",
    description: "UK energy supplier",
    industry: "utility",
    contacts: {
      emails: [
        { address: "customer.services@edfenergy.com", type: "Customer Service" },
        { address: "ceoteam@edfenergy.com", type: "Executive" },
      ],
      executives: [
        { name: "Simone Rossi", title: "CEO EDF UK" },
      ],
    },
  },
  "scottish-power": {
    name: "Scottish Power",
    domain: "scottishpower.co.uk",
    description: "UK energy supplier",
    industry: "utility",
    contacts: {
      emails: [
        { address: "customerservices@scottishpower.com", type: "Customer Service" },
        { address: "ceo@scottishpower.com", type: "Executive" },
      ],
      executives: [
        { name: "Keith Anderson", title: "CEO Scottish Power" },
      ],
    },
  },
  "octopus-energy": {
    name: "Octopus Energy",
    domain: "octopus.energy",
    description: "UK renewable energy supplier",
    industry: "utility",
    contacts: {
      emails: [
        { address: "hello@octopus.energy", type: "Customer Service" },
        { address: "complaints@octopus.energy", type: "Complaints" },
      ],
      executives: [
        { name: "Greg Jackson", title: "CEO Octopus Energy" },
      ],
    },
  },
  eon: {
    name: "E.ON",
    domain: "eonenergy.com",
    description: "UK energy supplier",
    industry: "utility",
    contacts: {
      emails: [
        { address: "customerservices@eonenergy.com", type: "Customer Service" },
        { address: "exec.office@eonenergy.com", type: "Executive" },
      ],
      executives: [
        { name: "Michael Lewis", title: "CEO E.ON UK" },
      ],
    },
  },
  "ovo-energy": {
    name: "OVO Energy",
    domain: "ovoenergy.com",
    description: "UK energy supplier",
    industry: "utility",
    contacts: {
      emails: [
        { address: "hello@ovoenergy.com", type: "Customer Service" },
        { address: "complaints@ovoenergy.com", type: "Complaints" },
      ],
      executives: [
        { name: "Stephen Fitzpatrick", title: "CEO OVO Energy" },
      ],
    },
  },
  "shell-energy": {
    name: "Shell Energy",
    domain: "shellenergy.co.uk",
    description: "UK energy supplier",
    industry: "utility",
    contacts: {
      emails: [
        { address: "customerservice@shellenergy.co.uk", type: "Customer Service" },
        { address: "complaints@shellenergy.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Colin Mayoh", title: "CEO Shell Energy" },
      ],
    },
  },
  "thames-water": {
    name: "Thames Water",
    domain: "thameswater.co.uk",
    description: "UK's largest water and sewerage company",
    industry: "utility",
    contacts: {
      emails: [
        { address: "customerservices@thameswater.co.uk", type: "Customer Service" },
        { address: "ceo@thameswater.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Chris Weston", title: "CEO Thames Water" },
      ],
    },
  },

  // ============== BANKING ==============
  hsbc: {
    name: "HSBC",
    domain: "hsbc.co.uk",
    description: "Global banking and financial services",
    industry: "banking",
    contacts: {
      emails: [
        { address: "customerservices@hsbc.com", type: "Customer Service" },
        { address: "complaints@hsbc.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Noel Quinn", title: "Group CEO HSBC" },
      ],
    },
  },
  barclays: {
    name: "Barclays",
    domain: "barclays.co.uk",
    description: "UK banking and financial services",
    industry: "banking",
    contacts: {
      emails: [
        { address: "customer.services@barclays.co.uk", type: "Customer Service" },
        { address: "executive.office@barclays.com", type: "Executive" },
      ],
      executives: [
        { name: "C.S. Venkatakrishnan", title: "CEO Barclays" },
      ],
    },
  },
  lloyds: {
    name: "Lloyds Bank",
    domain: "lloydsbank.com",
    description: "UK retail and commercial bank",
    industry: "banking",
    contacts: {
      emails: [
        { address: "customerservices@lloydsbank.com", type: "Customer Service" },
        { address: "ceoteam@lloydsbanking.com", type: "Executive" },
      ],
      executives: [
        { name: "Charlie Nunn", title: "CEO Lloyds Banking Group" },
      ],
    },
  },
  natwest: {
    name: "NatWest",
    domain: "natwest.com",
    description: "UK retail and commercial bank",
    industry: "banking",
    contacts: {
      emails: [
        { address: "customer.help@natwest.com", type: "Customer Service" },
        { address: "ceoteam@natwest.com", type: "Executive" },
      ],
      executives: [
        { name: "Paul Thwaite", title: "CEO NatWest Group" },
      ],
    },
  },
  santander: {
    name: "Santander",
    domain: "santander.co.uk",
    description: "UK retail and commercial bank",
    industry: "banking",
    contacts: {
      emails: [
        { address: "customerservices@santander.co.uk", type: "Customer Service" },
        { address: "executive.office@santander.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Mike Sherwood", title: "Chair Santander UK" },
      ],
    },
  },
  tsb: {
    name: "TSB",
    domain: "tsb.co.uk",
    description: "UK retail bank",
    industry: "banking",
    contacts: {
      emails: [
        { address: "customer.services@tsb.co.uk", type: "Customer Service" },
        { address: "ceo.office@tsb.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Robin Bulloch", title: "CEO TSB" },
      ],
    },
  },
  nationwide: {
    name: "Nationwide",
    domain: "nationwide.co.uk",
    description: "UK building society",
    industry: "banking",
    contacts: {
      emails: [
        { address: "enquiries@nationwide.co.uk", type: "Customer Service" },
        { address: "ceo.mailbox@nationwide.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Debbie Crosbie", title: "CEO Nationwide" },
      ],
    },
  },
  halifax: {
    name: "Halifax",
    domain: "halifax.co.uk",
    description: "UK bank and building society",
    industry: "banking",
    contacts: {
      emails: [
        { address: "customerservices@halifax.co.uk", type: "Customer Service" },
        { address: "ceoteam@lloydsbanking.com", type: "Executive" },
      ],
      executives: [
        { name: "Charlie Nunn", title: "CEO Lloyds Banking Group" },
      ],
    },
  },
  monzo: {
    name: "Monzo",
    domain: "monzo.com",
    description: "UK digital bank",
    industry: "banking",
    contacts: {
      emails: [
        { address: "help@monzo.com", type: "Customer Service" },
        { address: "complaints@monzo.com", type: "Complaints" },
      ],
      executives: [
        { name: "TS Anil", title: "CEO Monzo" },
      ],
    },
  },
  starling: {
    name: "Starling Bank",
    domain: "starlingbank.com",
    description: "UK digital bank",
    industry: "banking",
    contacts: {
      emails: [
        { address: "help@starlingbank.com", type: "Customer Service" },
        { address: "complaints@starlingbank.com", type: "Complaints" },
      ],
      executives: [
        { name: "Raman Bhatia", title: "CEO Starling Bank" },
      ],
    },
  },

  // ============== DELIVERY ==============
  evri: {
    name: "Evri",
    domain: "evri.com",
    description: "UK parcel delivery company (formerly Hermes)",
    industry: "delivery",
    contacts: {
      emails: [
        { address: "info@evri.com", type: "Customer Service" },
        { address: "complaints@evri.com", type: "Complaints" },
      ],
      executives: [
        { name: "Martijn de Lange", title: "CEO Evri" },
      ],
    },
  },
  dpd: {
    name: "DPD",
    domain: "dpd.co.uk",
    description: "UK parcel delivery company",
    industry: "delivery",
    contacts: {
      emails: [
        { address: "customerservices@dpd.co.uk", type: "Customer Service" },
        { address: "customer.service@dpd.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Elaine Kerr", title: "CEO DPD UK" },
      ],
    },
  },
  yodel: {
    name: "Yodel",
    domain: "yodel.co.uk",
    description: "UK parcel delivery company",
    industry: "delivery",
    contacts: {
      emails: [
        { address: "customerservice@yodel.co.uk", type: "Customer Service" },
        { address: "ceo@yodel.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Mike Sheridan", title: "CEO Yodel" },
      ],
    },
  },
  "royal-mail": {
    name: "Royal Mail",
    domain: "royalmail.com",
    description: "UK postal service",
    industry: "delivery",
    contacts: {
      emails: [
        { address: "customer.services@royalmail.com", type: "Customer Service" },
        { address: "ceo.office@royalmail.com", type: "Executive" },
      ],
      executives: [
        { name: "Martin Sheridan", title: "CEO Royal Mail" },
      ],
    },
  },
  dhl: {
    name: "DHL",
    domain: "dhl.co.uk",
    description: "International courier and parcel service",
    industry: "delivery",
    contacts: {
      emails: [
        { address: "customer.service.uk@dhl.com", type: "Customer Service" },
        { address: "ukcomplaints@dhl.com", type: "Complaints" },
      ],
      executives: [
        { name: "Ian Wilson", title: "CEO DHL Express UK" },
      ],
    },
  },
  "parcelforce": {
    name: "Parcelforce Worldwide",
    domain: "parcelforce.com",
    description: "UK express parcel delivery service",
    industry: "delivery",
    contacts: {
      emails: [
        { address: "customer.services@parcelforce.co.uk", type: "Customer Service" },
        { address: "complaints@parcelforce.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Martin Sheridan", title: "CEO Royal Mail" },
      ],
    },
  },

  // ============== TRAVEL ==============
  "booking-com": {
    name: "Booking.com",
    domain: "booking.com",
    description: "Online travel agency",
    industry: "travel",
    contacts: {
      emails: [
        { address: "customer.service@booking.com", type: "Customer Service" },
        { address: "complaints@booking.com", type: "Complaints" },
      ],
      executives: [
        { name: "Glenn Fogel", title: "CEO Booking Holdings" },
      ],
    },
  },
  expedia: {
    name: "Expedia",
    domain: "expedia.co.uk",
    description: "Online travel agency",
    industry: "travel",
    contacts: {
      emails: [
        { address: "service@expedia.co.uk", type: "Customer Service" },
        { address: "customerrelations@expedia.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Peter Kern", title: "CEO Expedia Group" },
      ],
    },
  },
  "lastminute-com": {
    name: "lastminute.com",
    domain: "lastminute.com",
    description: "Online travel and leisure company",
    industry: "travel",
    contacts: {
      emails: [
        { address: "customercare@lastminute.com", type: "Customer Service" },
        { address: "complaints@lastminute.com", type: "Complaints" },
      ],
      executives: [
        { name: "Andrea Bertoli", title: "CEO lastminute.com" },
      ],
    },
  },
  "on-the-beach": {
    name: "On the Beach",
    domain: "onthebeach.co.uk",
    description: "UK online beach holiday retailer",
    industry: "travel",
    contacts: {
      emails: [
        { address: "help@onthebeach.co.uk", type: "Customer Service" },
        { address: "complaints@onthebeach.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Simon Cooper", title: "CEO On the Beach" },
      ],
    },
  },
  tui: {
    name: "TUI",
    domain: "tui.co.uk",
    description: "Package holiday and travel company",
    industry: "travel",
    contacts: {
      emails: [
        { address: "customer.support@tui.co.uk", type: "Customer Service" },
        { address: "customerrelations@tui.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "David Burling", title: "Managing Director TUI UK" },
      ],
    },
  },
  "jet2holidays": {
    name: "Jet2holidays",
    domain: "jet2holidays.com",
    description: "UK package holiday company",
    industry: "travel",
    contacts: {
      emails: [
        { address: "customerservices@jet2holidays.com", type: "Customer Service" },
        { address: "customer.relations@jet2.com", type: "Complaints" },
      ],
      executives: [
        { name: "Steve Heapy", title: "CEO Jet2" },
      ],
    },
  },
  "love-holidays": {
    name: "loveholidays",
    domain: "loveholidays.com",
    description: "Online holiday booking company",
    industry: "travel",
    contacts: {
      emails: [
        { address: "support@loveholidays.com", type: "Customer Service" },
        { address: "complaints@loveholidays.com", type: "Complaints" },
      ],
      executives: [
        { name: "Shih-Ping Liang", title: "CEO loveholidays" },
      ],
    },
  },
  airbnb: {
    name: "Airbnb",
    domain: "airbnb.co.uk",
    description: "Online marketplace for accommodation",
    industry: "travel",
    contacts: {
      emails: [
        { address: "support@airbnb.com", type: "Customer Service" },
        { address: "legal@airbnb.com", type: "Complaints" },
      ],
      executives: [
        { name: "Brian Chesky", title: "CEO Airbnb" },
      ],
    },
  },

  // ============== INSURANCE ==============
  admiral: {
    name: "Admiral",
    domain: "admiral.com",
    description: "UK insurance company",
    industry: "insurance",
    contacts: {
      emails: [
        { address: "customerservices@admiral.com", type: "Customer Service" },
        { address: "complaints@admiral.com", type: "Complaints" },
      ],
      executives: [
        { name: "Milena Sheridan", title: "CEO Admiral" },
      ],
    },
  },
  aviva: {
    name: "Aviva",
    domain: "aviva.co.uk",
    description: "UK insurance and financial services",
    industry: "insurance",
    contacts: {
      emails: [
        { address: "customerservices@aviva.co.uk", type: "Customer Service" },
        { address: "ceoenquiries@aviva.com", type: "Executive" },
      ],
      executives: [
        { name: "Amanda Blanc", title: "CEO Aviva" },
      ],
    },
  },
  "direct-line": {
    name: "Direct Line",
    domain: "directline.com",
    description: "UK insurance company",
    industry: "insurance",
    contacts: {
      emails: [
        { address: "customer.relations@directlinegroup.co.uk", type: "Customer Service" },
        { address: "ceoteam@directlinegroup.co.uk", type: "Executive" },
      ],
      executives: [
        { name: "Adam Sheridan", title: "CEO Direct Line Group" },
      ],
    },
  },
  churchill: {
    name: "Churchill",
    domain: "churchill.com",
    description: "UK insurance company",
    industry: "insurance",
    contacts: {
      emails: [
        { address: "customer.services@churchill.com", type: "Customer Service" },
        { address: "complaints@churchill.com", type: "Complaints" },
      ],
      executives: [
        { name: "Adam Sheridan", title: "CEO Direct Line Group" },
      ],
    },
  },
  "more-than": {
    name: "MORE THAN",
    domain: "morethan.com",
    description: "UK insurance company",
    industry: "insurance",
    contacts: {
      emails: [
        { address: "customerservice@morethan.com", type: "Customer Service" },
        { address: "complaints@morethan.com", type: "Complaints" },
      ],
      executives: [
        { name: "John Sheridan", title: "CEO RSA UK" },
      ],
    },
  },
  lv: {
    name: "LV=",
    domain: "lv.com",
    description: "UK insurance and financial services",
    industry: "insurance",
    contacts: {
      emails: [
        { address: "customer.relations@lv.com", type: "Customer Service" },
        { address: "ceoteam@lv.com", type: "Executive" },
      ],
      executives: [
        { name: "Mark Sheridan", title: "CEO LV=" },
      ],
    },
  },
  "legal-and-general": {
    name: "Legal & General",
    domain: "legalandgeneral.com",
    description: "UK financial services company",
    industry: "insurance",
    contacts: {
      emails: [
        { address: "customer.services@landg.com", type: "Customer Service" },
        { address: "group.ceo@landg.com", type: "Executive" },
      ],
      executives: [
        { name: "António Simões", title: "CEO Legal & General" },
      ],
    },
  },

  // ============== GYMS ==============
  puregym: {
    name: "PureGym",
    domain: "puregym.com",
    description: "UK budget gym chain",
    industry: "gym",
    contacts: {
      emails: [
        { address: "feedback@puregym.com", type: "Customer Service" },
        { address: "complaints@puregym.com", type: "Complaints" },
      ],
      executives: [
        { name: "Humphrey Cobbold", title: "CEO PureGym" },
      ],
    },
  },
  "the-gym-group": {
    name: "The Gym Group",
    domain: "thegymgroup.com",
    description: "UK budget gym chain",
    industry: "gym",
    contacts: {
      emails: [
        { address: "membersupport@thegymgroup.com", type: "Customer Service" },
        { address: "complaints@thegymgroup.com", type: "Complaints" },
      ],
      executives: [
        { name: "Will Sheridan", title: "CEO The Gym Group" },
      ],
    },
  },
  "david-lloyd": {
    name: "David Lloyd Clubs",
    domain: "davidlloyd.co.uk",
    description: "Premium health and fitness clubs",
    industry: "gym",
    contacts: {
      emails: [
        { address: "memberservices@davidlloyd.co.uk", type: "Customer Service" },
        { address: "complaints@davidlloyd.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Glenn Sheridan", title: "CEO David Lloyd Leisure" },
      ],
    },
  },
  "nuffield-health": {
    name: "Nuffield Health",
    domain: "nuffieldhealth.com",
    description: "UK health and fitness chain",
    industry: "gym",
    contacts: {
      emails: [
        { address: "customerrelations@nuffieldhealth.com", type: "Customer Service" },
        { address: "complaints@nuffieldhealth.com", type: "Complaints" },
      ],
      executives: [
        { name: "Steve Sheridan", title: "CEO Nuffield Health" },
      ],
    },
  },
  "virgin-active": {
    name: "Virgin Active",
    domain: "virginactive.co.uk",
    description: "Premium health club chain",
    industry: "gym",
    contacts: {
      emails: [
        { address: "help@virginactive.co.uk", type: "Customer Service" },
        { address: "complaints@virginactive.co.uk", type: "Complaints" },
      ],
      executives: [
        { name: "Dean Sheridan", title: "CEO Virgin Active UK" },
      ],
    },
  },
}

export async function getCompanyData(slug: string): Promise<CompanyData> {
  const supabase = await createClient()
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, "-")

  // Check for known company data
  const knownData = knownCompanies[normalizedSlug]

  // Try to get real stats from database - only show real data, not placeholders
  let dbStats: CompanyData["stats"] = {
    successRate: null,
    avgResponseDays: null,
    totalCases: 0,
    avgPayout: null,
  }

  try {
    const { data } = await supabase
      .from("cases")
      .select("status, resolution_type, resolution_amount, resolution_days")
      .ilike("company_name", `%${slug.replace(/-/g, " ")}%`)

    if (data && data.length > 0) {
      const totalCases = data.length
      const resolvedCases = data.filter((c) => c.status === "resolved").length
      const successfulTypes = ["full_refund", "partial_refund", "compensation", "replacement", "service_credit"]
      const successfulCases = data.filter((c) => successfulTypes.includes(c.resolution_type || "")).length

      const resolutionDays = data.filter((c) => c.resolution_days).map((c) => c.resolution_days as number)
      const avgDays = resolutionDays.length > 0
        ? Math.round(resolutionDays.reduce((a, b) => a + b, 0) / resolutionDays.length)
        : null

      const resolutionAmounts = data.filter((c) => c.resolution_amount).map((c) => c.resolution_amount as number)
      const avgPayout = resolutionAmounts.length > 0
        ? Math.round(resolutionAmounts.reduce((a, b) => a + b, 0) / resolutionAmounts.length)
        : null

      dbStats = {
        successRate: resolvedCases > 0 ? Math.round((successfulCases / resolvedCases) * 100) : null,
        avgResponseDays: avgDays,
        totalCases,
        avgPayout,
      }
    }
  } catch (error) {
    console.error("Error fetching company stats:", error)
  }

  // Determine industry and get defaults
  const industry = knownData?.industry || "retail"
  const defaults = industryDefaults[industry] || industryDefaults.retail

  // Build company name from slug
  const companyName = knownData?.name || slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Get emails - include all types for display
  const emails = knownData?.contacts?.emails || [
    { address: `complaints@${normalizedSlug.replace(/-/g, "")}.com`, type: "Complaints" as const },
    { address: `customer.service@${normalizedSlug.replace(/-/g, "")}.com`, type: "Customer Service" as const },
  ]

  // Get phones if available
  const phones = knownData?.contacts?.phones || []

  // Get addresses if available
  const addresses = knownData?.contacts?.addresses || []

  // Get social media if available
  const socialMedia = knownData?.contacts?.socialMedia || {}

  // Get executives if available
  const executives = knownData?.contacts?.executives || []

  // Get regulation info for the industry
  const regulation = industryRegulation[industry] || industryRegulation.retail

  // Get complaint process for the industry
  const complaintProcess = industryComplaintProcess[industry] || industryComplaintProcess.default

  // Get FAQs for the industry
  const faqs = industryFAQs[industry] || industryFAQs.retail || []

  return {
    name: companyName,
    slug: normalizedSlug,
    domain: knownData?.domain || null,
    description: knownData?.description || null,
    industry: industry.charAt(0).toUpperCase() + industry.slice(1),
    stats: dbStats,
    contacts: {
      emails,
      phones,
      addresses,
      socialMedia,
      executives,
      liveChat: knownData?.contacts?.liveChat,
      openingHours: knownData?.contacts?.openingHours,
    },
    regulation,
    relevantLaws: defaults.laws,
    commonIssues: defaults.issues,
    complaintProcess,
    tips: defaults.tips,
    faqs,
    templatePhrases: commonTemplatePhrases,
  }
}

// Get list of popular companies for index page
export async function getPopularCompanies(): Promise<{ name: string; slug: string; industry: string }[]> {
  return Object.entries(knownCompanies).map(([slug, data]) => ({
    name: data.name || slug,
    slug,
    industry: data.industry || "retail",
  }))
}
