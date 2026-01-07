"use server"

import type {
  CheatSheetLocation,
  CheatSheetCategory,
  CheatSheetInput,
  CheatSheetResult,
  ConsumerRight,
  LegalReference,
  TimelineEntry,
  EscalationStep,
} from "@/lib/types"

// Location display names
const locationNames: Record<CheatSheetLocation, string> = {
  uk: "United Kingdom",
  us: "United States",
  eu: "European Union",
  australia: "Australia",
  canada: "Canada",
}

// Category display names
const categoryNames: Record<CheatSheetCategory, string> = {
  "faulty-goods": "Faulty Goods & Products",
  refunds: "Refunds & Returns",
  "online-purchases": "Online Purchases",
  delivery: "Delivery Issues",
  services: "Services Not As Described",
  subscriptions: "Subscriptions & Memberships",
  travel: "Travel & Flights",
  financial: "Financial Services",
  general: "General Consumer Rights",
}

// UK Consumer Rights Data
const ukRights: Record<CheatSheetCategory, ConsumerRight[]> = {
  "faulty-goods": [
    {
      title: "Right to Reject",
      description:
        "You can reject faulty goods and get a full refund within 30 days of purchase.",
      keyPoints: [
        "Full refund within 30 days for faulty goods",
        "No deductions can be made for use",
        "Applies to goods not of satisfactory quality, not fit for purpose, or not as described",
      ],
      timeLimit: "30 days from delivery",
    },
    {
      title: "Right to Repair or Replacement",
      description:
        "After 30 days, you can request a repair or replacement. If that fails, you can claim a refund.",
      keyPoints: [
        "One repair or replacement attempt allowed",
        "Must be done within reasonable time and without inconvenience",
        "If repair/replacement fails, entitled to refund",
      ],
      timeLimit: "Up to 6 years (5 in Scotland)",
    },
    {
      title: "Burden of Proof",
      description:
        "In the first 6 months, faults are presumed to have existed at purchase unless the retailer proves otherwise.",
      keyPoints: [
        "First 6 months: retailer must prove fault wasn't there at purchase",
        "After 6 months: you must prove fault existed at purchase",
        "Expert reports can help establish when fault occurred",
      ],
      timeLimit: "6 months presumption period",
    },
  ],
  refunds: [
    {
      title: "30-Day Short-Term Right to Reject",
      description:
        "Return faulty goods for a full refund within 30 days.",
      keyPoints: [
        "Applies to goods not of satisfactory quality",
        "Applies to goods not fit for purpose",
        "Applies to goods not as described",
        "Full refund with no deductions",
      ],
      timeLimit: "30 days",
    },
    {
      title: "14-Day Cooling-Off Period",
      description:
        "Cancel most online or distance purchases within 14 days for any reason.",
      keyPoints: [
        "No reason needed to cancel",
        "14 days from receiving goods",
        "Refund within 14 days of cancellation",
        "Some exceptions apply (personalized items, perishables)",
      ],
      timeLimit: "14 days from delivery",
    },
    {
      title: "Final Right to Reject",
      description:
        "After a failed repair or replacement, you can reject goods for a refund.",
      keyPoints: [
        "Available after repair/replacement fails",
        "Partial refund may apply after 6 months (fair use deduction)",
        "Retailer cannot make endless repair attempts",
      ],
      timeLimit: "Up to 6 years",
    },
  ],
  "online-purchases": [
    {
      title: "14-Day Cancellation Right",
      description:
        "Cancel online purchases within 14 days of delivery for any reason.",
      keyPoints: [
        "Starts from day after delivery",
        "Must notify seller of cancellation",
        "14 more days to return goods after cancellation",
        "Refund within 14 days of seller receiving goods",
      ],
      timeLimit: "14 days from delivery",
    },
    {
      title: "Clear Information Rights",
      description:
        "Sellers must provide clear information before you buy.",
      keyPoints: [
        "Total price including all taxes",
        "Delivery costs and arrangements",
        "Cancellation rights explained",
        "Trader's identity and address",
      ],
    },
    {
      title: "Delivery Rights",
      description:
        "Goods must be delivered within agreed timeframe or within 30 days.",
      keyPoints: [
        "If no date agreed, delivery within 30 days",
        "Can cancel if delivery is late",
        "Risk passes to you on delivery",
        "Can specify safe place for delivery",
      ],
      timeLimit: "30 days default",
    },
  ],
  delivery: [
    {
      title: "Delivery Timeframe",
      description: "Goods must be delivered within the agreed time or 30 days.",
      keyPoints: [
        "30 days maximum if no date agreed",
        "Seller is responsible until delivery",
        "Risk passes to you when you receive goods",
      ],
      timeLimit: "30 days default",
    },
    {
      title: "Failed Delivery Rights",
      description:
        "If delivery fails or is late, you have options.",
      keyPoints: [
        "Request redelivery at a convenient time",
        "Cancel order if time was essential",
        "Full refund if you cancel due to late delivery",
        "Seller responsible for goods until delivered",
      ],
    },
    {
      title: "Damaged in Transit",
      description:
        "If goods arrive damaged, the seller is responsible.",
      keyPoints: [
        "Seller must resolve issue, not courier",
        "Can request replacement or refund",
        "Document damage with photos",
        "Report within 30 days for full refund rights",
      ],
    },
  ],
  services: [
    {
      title: "Reasonable Care and Skill",
      description:
        "Services must be performed with reasonable care and skill.",
      keyPoints: [
        "Work must be done to a reasonable standard",
        "Trader must have appropriate qualifications",
        "Can claim for work not done properly",
      ],
    },
    {
      title: "Information Must Be Accurate",
      description:
        "Any information given about the service must be accurate.",
      keyPoints: [
        "Verbal and written promises are binding",
        "Service must match any description given",
        "Can claim if service doesn't match what was promised",
      ],
    },
    {
      title: "Reasonable Price",
      description:
        "If no price agreed, you only need to pay a reasonable amount.",
      keyPoints: [
        "Get quotes in writing before work starts",
        "Challenge excessive charges",
        "Compare with similar services",
      ],
    },
    {
      title: "Remedies for Poor Service",
      description: "If service is substandard, you have remedies.",
      keyPoints: [
        "Right to repeat performance at no cost",
        "Right to price reduction if repeat performance fails",
        "Can claim damages for losses caused",
      ],
    },
  ],
  subscriptions: [
    {
      title: "Right to Cancel",
      description:
        "You can cancel subscriptions under certain conditions.",
      keyPoints: [
        "14-day cooling-off for new subscriptions",
        "Check contract terms for ongoing subscriptions",
        "Written cancellation creates paper trail",
        "Keep confirmation of cancellation",
      ],
    },
    {
      title: "Unfair Contract Terms",
      description:
        "Terms that are unfair cannot be enforced against you.",
      keyPoints: [
        "Hidden fees may be unenforceable",
        "Excessive cancellation fees can be challenged",
        "Automatic renewals must be clearly disclosed",
        "Terms can't exclude your statutory rights",
      ],
    },
    {
      title: "Ongoing Charges",
      description:
        "Know your rights regarding ongoing subscription charges.",
      keyPoints: [
        "Cancel before renewal date to avoid charges",
        "Request confirmation of cancellation in writing",
        "Contact bank if unauthorized charges continue",
        "Consider chargeback for disputed charges",
      ],
    },
  ],
  travel: [
    {
      title: "Flight Delay Compensation (UK261)",
      description:
        "Compensation for delayed or cancelled flights.",
      keyPoints: [
        "£220 for flights under 1,500km",
        "£350 for flights 1,500-3,500km",
        "£520 for flights over 3,500km",
        "Delay must be 3+ hours at destination",
      ],
      timeLimit: "6 years to claim",
    },
    {
      title: "Package Holiday Protection",
      description:
        "Additional protections for package holidays.",
      keyPoints: [
        "ATOL protection for package holidays by air",
        "Right to refund if holiday significantly changed",
        "Compensation for holiday not as described",
        "Tour operator liable for all elements",
      ],
    },
    {
      title: "Cancelled Flights",
      description:
        "Rights when your flight is cancelled.",
      keyPoints: [
        "Full refund or alternative flight",
        "Compensation unless extraordinary circumstances",
        "Care and assistance (meals, accommodation)",
        "14 days notice exempts airline from compensation",
      ],
    },
  ],
  financial: [
    {
      title: "Section 75 Protection",
      description:
        "Credit card company is jointly liable for purchases £100-£30,000.",
      keyPoints: [
        "Applies to credit card purchases only",
        "Minimum £100 item value",
        "Maximum £30,000 item value",
        "Claim against card company if retailer fails",
      ],
    },
    {
      title: "Chargeback Rights",
      description:
        "Dispute transactions with your card provider.",
      keyPoints: [
        "Works with debit and credit cards",
        "No minimum purchase amount",
        "Time limits apply (usually 120 days)",
        "Card scheme rules, not law",
      ],
      timeLimit: "Usually 120 days",
    },
    {
      title: "Financial Ombudsman",
      description:
        "Free dispute resolution for financial complaints.",
      keyPoints: [
        "Free to use",
        "Decisions binding on financial firms",
        "Covers banks, insurers, lenders",
        "8 weeks after complaint to firm before escalating",
      ],
    },
  ],
  general: [
    {
      title: "Satisfactory Quality",
      description:
        "All goods must be of satisfactory quality.",
      keyPoints: [
        "Free from defects",
        "Safe and durable",
        "Acceptable appearance and finish",
        "Must meet reasonable expectations",
      ],
    },
    {
      title: "Fit for Purpose",
      description:
        "Goods must be fit for their intended purpose.",
      keyPoints: [
        "Suitable for general purpose",
        "Suitable for any specific purpose you mentioned",
        "Must work as expected",
      ],
    },
    {
      title: "As Described",
      description:
        "Goods must match their description.",
      keyPoints: [
        "Must match verbal descriptions",
        "Must match written descriptions",
        "Must match images and samples",
        "Advertising claims are binding",
      ],
    },
    {
      title: "Your Contract is With the Retailer",
      description:
        "The retailer, not the manufacturer, is responsible.",
      keyPoints: [
        "Claim against who you bought from",
        "Retailer cannot pass you to manufacturer",
        "Manufacturer warranty is additional, not replacement",
      ],
    },
  ],
}

// UK Laws
const ukLaws: Record<CheatSheetCategory, LegalReference[]> = {
  "faulty-goods": [
    {
      name: "Consumer Rights Act 2015",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Sections 9-11, 19-24",
      whatItMeans:
        "Your main protection for faulty goods. Guarantees goods are of satisfactory quality, fit for purpose, and as described.",
    },
    {
      name: "Sale of Goods Act 1979",
      jurisdiction: "UK",
      relevance: "medium",
      keyProvision: "Sections 12-15",
      whatItMeans:
        "Still applies to contracts made before October 2015. Similar protections to CRA 2015.",
    },
  ],
  refunds: [
    {
      name: "Consumer Rights Act 2015",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Sections 19-24",
      whatItMeans:
        "Establishes your right to reject, repair, replacement, and refund for faulty goods.",
    },
    {
      name: "Consumer Contracts Regulations 2013",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Regulations 27-38",
      whatItMeans:
        "Provides 14-day cooling-off period for distance and online purchases.",
    },
  ],
  "online-purchases": [
    {
      name: "Consumer Contracts Regulations 2013",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Parts 2 and 3",
      whatItMeans:
        "Comprehensive protections for online and distance purchases including 14-day cancellation right.",
    },
    {
      name: "Consumer Rights Act 2015",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Part 1, Chapter 2",
      whatItMeans: "Goods bought online must still be satisfactory quality, fit for purpose, and as described.",
    },
    {
      name: "Electronic Commerce Regulations 2002",
      jurisdiction: "UK",
      relevance: "medium",
      keyProvision: "Regulations 6-9",
      whatItMeans:
        "Online sellers must provide clear information about their identity and terms.",
    },
  ],
  delivery: [
    {
      name: "Consumer Rights Act 2015",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Section 28",
      whatItMeans:
        "Goods must be delivered within agreed time or 30 days. Risk passes on delivery.",
    },
    {
      name: "Consumer Contracts Regulations 2013",
      jurisdiction: "UK",
      relevance: "medium",
      keyProvision: "Regulation 42",
      whatItMeans:
        "Risk in goods passes to consumer only when they take physical possession.",
    },
  ],
  services: [
    {
      name: "Consumer Rights Act 2015",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Part 1, Chapter 4 (Sections 48-57)",
      whatItMeans:
        "Services must be performed with reasonable care and skill, matching any information given.",
    },
    {
      name: "Supply of Goods and Services Act 1982",
      jurisdiction: "UK",
      relevance: "medium",
      keyProvision: "Sections 13-15",
      whatItMeans:
        "Implied terms about care, skill, time, and price for services.",
    },
  ],
  subscriptions: [
    {
      name: "Consumer Contracts Regulations 2013",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Regulations 27-38",
      whatItMeans:
        "14-day cancellation right for new subscriptions taken out online or by phone.",
    },
    {
      name: "Consumer Rights Act 2015",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Part 2 (Unfair Terms)",
      whatItMeans:
        "Unfair contract terms in subscriptions cannot be enforced against you.",
    },
  ],
  travel: [
    {
      name: "UK Air Passenger Rights (UK261)",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Retained EU Regulation 261/2004",
      whatItMeans:
        "Compensation of £220-£520 for delayed or cancelled flights departing from UK.",
    },
    {
      name: "Package Travel Regulations 2018",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Parts 2-5",
      whatItMeans:
        "Comprehensive protection for package holidays including ATOL protection.",
    },
    {
      name: "Civil Aviation Act 2012",
      jurisdiction: "UK",
      relevance: "medium",
      keyProvision: "Part 1",
      whatItMeans: "CAA has powers to enforce passenger rights.",
    },
  ],
  financial: [
    {
      name: "Consumer Credit Act 1974",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Section 75",
      whatItMeans:
        "Credit card company jointly liable with retailer for purchases £100-£30,000.",
    },
    {
      name: "Payment Services Regulations 2017",
      jurisdiction: "UK",
      relevance: "medium",
      keyProvision: "Part 7",
      whatItMeans: "Protections for unauthorized transactions and payment disputes.",
    },
    {
      name: "Financial Services and Markets Act 2000",
      jurisdiction: "UK",
      relevance: "medium",
      keyProvision: "Part XVI",
      whatItMeans:
        "Establishes the Financial Ombudsman Service for disputes.",
    },
  ],
  general: [
    {
      name: "Consumer Rights Act 2015",
      jurisdiction: "UK",
      relevance: "high",
      keyProvision: "Part 1",
      whatItMeans:
        "Your main consumer protection law. Covers goods, services, and digital content.",
    },
    {
      name: "Consumer Protection from Unfair Trading Regulations 2008",
      jurisdiction: "UK",
      relevance: "medium",
      keyProvision: "Regulations 3-7",
      whatItMeans:
        "Protects against misleading actions, aggressive practices, and unfair commercial practices.",
    },
  ],
}

// UK Timeline entries
const ukTimelines: Record<CheatSheetCategory, TimelineEntry[]> = {
  "faulty-goods": [
    {
      period: "0-30 days",
      title: "Short-term right to reject",
      description: "Full refund available for faulty goods",
      isActive: true,
    },
    {
      period: "30 days - 6 months",
      title: "Repair or replacement first",
      description:
        "Request repair/replacement. Refund if this fails. Fault presumed to exist at purchase.",
    },
    {
      period: "6 months - 6 years",
      title: "You must prove fault",
      description:
        "Still have rights but must prove fault existed at purchase. May face deduction for use.",
    },
  ],
  refunds: [
    {
      period: "0-14 days",
      title: "Cooling-off period",
      description: "Cancel online purchases for any reason",
      isActive: true,
    },
    {
      period: "0-30 days",
      title: "Full refund for faults",
      description: "Return faulty goods for full refund",
    },
    {
      period: "30 days - 6 months",
      title: "Repair/replace first",
      description: "One chance to repair/replace before refund",
    },
    {
      period: "6 months - 6 years",
      title: "Reduced refund possible",
      description: "Fair deduction for use may apply",
    },
  ],
  "online-purchases": [
    {
      period: "0-14 days",
      title: "Cancellation period",
      description: "Cancel for any reason, no questions asked",
      isActive: true,
    },
    {
      period: "14 days after cancel",
      title: "Return goods",
      description: "Return goods within 14 days of cancelling",
    },
    {
      period: "14 days after return",
      title: "Refund due",
      description: "Seller must refund within 14 days of receiving returns",
    },
  ],
  delivery: [
    {
      period: "Agreed date",
      title: "Expected delivery",
      description: "Delivery should arrive by agreed date",
      isActive: true,
    },
    {
      period: "30 days max",
      title: "Default deadline",
      description: "If no date agreed, must deliver within 30 days",
    },
    {
      period: "After deadline",
      title: "Right to cancel",
      description: "Can cancel and get full refund if delivery is late",
    },
  ],
  services: [
    {
      period: "During service",
      title: "Reasonable skill and care",
      description: "Work must be done to reasonable standard",
      isActive: true,
    },
    {
      period: "If problems arise",
      title: "Right to repeat performance",
      description: "Request service be done again properly at no extra cost",
    },
    {
      period: "If repeat fails",
      title: "Price reduction",
      description: "Entitled to money back if service cannot be fixed",
    },
  ],
  subscriptions: [
    {
      period: "0-14 days",
      title: "Cooling-off period",
      description: "Cancel new subscriptions for any reason",
      isActive: true,
    },
    {
      period: "Before renewal",
      title: "Cancel before billing",
      description: "Cancel to avoid next billing cycle",
    },
    {
      period: "If issues arise",
      title: "Dispute with bank",
      description: "Consider chargeback for unauthorized charges",
    },
  ],
  travel: [
    {
      period: "Flight day",
      title: "Immediate rights",
      description: "Right to care (meals, refreshments, communication)",
      isActive: true,
    },
    {
      period: "3+ hours delay",
      title: "Compensation triggers",
      description: "Entitled to compensation if delay is 3+ hours at destination",
    },
    {
      period: "6 years",
      title: "Time limit to claim",
      description: "Can claim flight compensation up to 6 years after flight",
    },
  ],
  financial: [
    {
      period: "Immediately",
      title: "Contact retailer first",
      description: "Try to resolve with retailer before card claim",
      isActive: true,
    },
    {
      period: "120 days",
      title: "Chargeback window",
      description: "Typical deadline for chargeback claims",
    },
    {
      period: "6 years",
      title: "Section 75 limit",
      description: "Time limit to make Section 75 claim",
    },
  ],
  general: [
    {
      period: "0-30 days",
      title: "Full refund rights",
      description: "Reject faulty goods for full refund",
      isActive: true,
    },
    {
      period: "0-6 months",
      title: "Fault presumed",
      description: "Retailer must prove fault wasn't present at purchase",
    },
    {
      period: "6 years",
      title: "Time limit",
      description: "Maximum time to bring claim (5 years in Scotland)",
    },
  ],
}

// UK Escalation paths
const ukEscalation: EscalationStep[] = [
  {
    step: 1,
    title: "Contact the retailer",
    description:
      "Write a formal complaint to the retailer explaining the issue and what you want. Keep copies of all correspondence.",
    when: "First step for any complaint",
  },
  {
    step: 2,
    title: "Escalate to management",
    description:
      "If initial contact fails, escalate to a manager or the complaints department. Send a Letter Before Action if needed.",
    when: "If no response within 14 days",
  },
  {
    step: 3,
    title: "Alternative Dispute Resolution",
    description:
      "Use ADR schemes, ombudsman services, or mediation. Many industries have free dispute resolution.",
    when: "After 8 weeks or final response",
  },
  {
    step: 4,
    title: "Small Claims Court",
    description:
      "For claims up to £10,000 in England/Wales (£5,000 in Scotland). Court fees start from £35.",
    when: "As a last resort after ADR fails",
  },
]

// UK Resources
const ukResources = [
  {
    name: "Citizens Advice",
    url: "https://www.citizensadvice.org.uk/consumer/",
    description: "Free advice on consumer rights and how to complain",
  },
  {
    name: "Which? Consumer Rights",
    url: "https://www.which.co.uk/consumer-rights",
    description: "Detailed guides on UK consumer law",
  },
  {
    name: "Gov.uk Consumer Rights",
    url: "https://www.gov.uk/consumer-protection-rights",
    description: "Official government guidance on consumer protection",
  },
  {
    name: "Financial Ombudsman Service",
    url: "https://www.financial-ombudsman.org.uk/",
    description: "Free dispute resolution for financial complaints",
  },
  {
    name: "Trading Standards",
    url: "https://www.tradingstandards.uk/",
    description: "Report scams and unfair trading practices",
  },
]

// Common dos and don'ts
const commonDos = [
  "Keep all receipts, confirmations, and correspondence",
  "Put complaints in writing (email creates a paper trail)",
  "Note dates, times, and names of people you speak to",
  "Quote specific laws when making formal complaints",
  "Set clear deadlines for responses (14 days is reasonable)",
  "Take photos of faulty goods or damage",
  "Stay calm and professional in all communications",
  "Keep copies of everything you send",
]

const commonDonts = [
  "Don't accept 'store policy' as a reason to refuse your rights",
  "Don't let retailers send you to the manufacturer for faulty goods",
  "Don't accept a repair if you want a refund within 30 days",
  "Don't miss the 14-day cooling-off period for online purchases",
  "Don't throw away faulty goods before the dispute is resolved",
  "Don't accept gift cards if you're entitled to a cash refund",
  "Don't be aggressive—it undermines your position",
  "Don't sign anything waiving your statutory rights",
]

// Key phrases to use
const ukKeyPhrases: Record<CheatSheetCategory, string[]> = {
  "faulty-goods": [
    "Under the Consumer Rights Act 2015, I am entitled to a full refund as the goods are not of satisfactory quality.",
    "The goods are not fit for purpose as required by Section 10 of the Consumer Rights Act 2015.",
    "I am exercising my short-term right to reject under Section 20 of the Consumer Rights Act 2015.",
    "As less than 6 months have passed, the burden is on you to prove the fault was not present at purchase.",
  ],
  refunds: [
    "I am entitled to a full refund under my 30-day right to reject.",
    "I am cancelling under the Consumer Contracts Regulations 2013 within the 14-day cooling-off period.",
    "Please process my refund within 14 days as required by law.",
    "Your store policy does not override my statutory rights.",
  ],
  "online-purchases": [
    "I am exercising my right to cancel under the Consumer Contracts Regulations 2013.",
    "Please confirm receipt of my cancellation and provide return instructions.",
    "I expect my refund within 14 days of you receiving the returned goods.",
    "I did not receive all the pre-contract information required by the Regulations.",
  ],
  delivery: [
    "The goods have not been delivered within the agreed timeframe.",
    "Under Section 28 of the Consumer Rights Act 2015, you are responsible until delivery is made to me.",
    "As delivery was essential and not made on time, I am cancelling the order for a full refund.",
    "The goods arrived damaged and I am rejecting them under the Consumer Rights Act 2015.",
  ],
  services: [
    "The service was not performed with reasonable care and skill as required by Section 49 of the Consumer Rights Act 2015.",
    "I am entitled to have the service performed again at no extra cost.",
    "The service did not match the information you provided, which is binding under Section 50.",
    "I am requesting a price reduction as the service cannot be satisfactorily repeated.",
  ],
  subscriptions: [
    "I am cancelling my subscription within the 14-day cooling-off period.",
    "Please confirm cancellation in writing and stop all future charges.",
    "The automatic renewal term was not clearly disclosed and may be unfair under the Consumer Rights Act 2015.",
    "I do not consent to continued charges and will dispute them with my bank if necessary.",
  ],
  travel: [
    "Under UK261, I am entitled to compensation for this delayed flight.",
    "Please confirm whether you are claiming extraordinary circumstances, and provide evidence.",
    "I require care and assistance as my flight has been delayed over 2 hours.",
    "I am entitled to a full refund or rerouting as my flight has been cancelled.",
  ],
  financial: [
    "I am making a claim under Section 75 of the Consumer Credit Act 1974.",
    "You are jointly liable with the retailer for this breach of contract.",
    "I request you process a chargeback for this disputed transaction.",
    "I will escalate this to the Financial Ombudsman Service if not resolved within 8 weeks.",
  ],
  general: [
    "Under the Consumer Rights Act 2015, these goods must be of satisfactory quality, fit for purpose, and as described.",
    "My contract is with you as the retailer, not the manufacturer.",
    "Please respond to this complaint within 14 days.",
    "If this matter is not resolved, I will escalate to relevant authorities and consider legal action.",
  ],
}

// Related tools mapping
const relatedToolsMap: Record<CheatSheetCategory, { name: string; href: string; description: string }[]> = {
  "faulty-goods": [
    { name: "Complaint Checker", href: "/tools/complaint-checker", description: "Check the strength of your complaint" },
    { name: "Refund Timeline", href: "/tools/refund-timeline", description: "Understand your refund deadlines" },
    { name: "Section 75 Checker", href: "/tools/section-75-checker", description: "Check if your card offers protection" },
  ],
  refunds: [
    { name: "Refund Timeline", href: "/tools/refund-timeline", description: "Check your refund deadlines" },
    { name: "Cooling-Off Calculator", href: "/tools/cooling-off-checker", description: "Calculate your cancellation deadline" },
    { name: "Complaint Checker", href: "/tools/complaint-checker", description: "Assess your complaint strength" },
  ],
  "online-purchases": [
    { name: "Cooling-Off Calculator", href: "/tools/cooling-off-checker", description: "Check your cancellation rights" },
    { name: "Section 75 Checker", href: "/tools/section-75-checker", description: "Check payment protection" },
    { name: "Response Deadline", href: "/tools/response-deadline", description: "Track company response times" },
  ],
  delivery: [
    { name: "Complaint Checker", href: "/tools/complaint-checker", description: "Check your complaint strength" },
    { name: "Response Deadline", href: "/tools/response-deadline", description: "Track delivery deadlines" },
    { name: "Section 75 Checker", href: "/tools/section-75-checker", description: "Check payment protection" },
  ],
  services: [
    { name: "Complaint Checker", href: "/tools/complaint-checker", description: "Assess your case strength" },
    { name: "Ombudsman Finder", href: "/tools/ombudsman-finder", description: "Find dispute resolution services" },
    { name: "Small Claims Calculator", href: "/tools/small-claims-calculator", description: "Calculate court fees" },
  ],
  subscriptions: [
    { name: "Cancel Subscription", href: "/tools/cancel-subscription", description: "Generate cancellation letter" },
    { name: "Cooling-Off Calculator", href: "/tools/cooling-off-checker", description: "Check cancellation deadline" },
    { name: "Section 75 Checker", href: "/tools/section-75-checker", description: "Dispute charges with card" },
  ],
  travel: [
    { name: "Flight Compensation", href: "/tools/flight-compensation", description: "Calculate your compensation" },
    { name: "Ombudsman Finder", href: "/tools/ombudsman-finder", description: "Find aviation ombudsman" },
    { name: "Section 75 Checker", href: "/tools/section-75-checker", description: "Check card protection" },
  ],
  financial: [
    { name: "Section 75 Checker", href: "/tools/section-75-checker", description: "Check Section 75 eligibility" },
    { name: "Ombudsman Finder", href: "/tools/ombudsman-finder", description: "Find Financial Ombudsman" },
    { name: "Small Claims Calculator", href: "/tools/small-claims-calculator", description: "Calculate court fees" },
  ],
  general: [
    { name: "Complaint Checker", href: "/tools/complaint-checker", description: "Check your rights" },
    { name: "Refund Timeline", href: "/tools/refund-timeline", description: "Understand deadlines" },
    { name: "Ombudsman Finder", href: "/tools/ombudsman-finder", description: "Find dispute resolution" },
  ],
}

// Generate cheat sheet function
export async function generateCheatSheet(
  input: CheatSheetInput
): Promise<CheatSheetResult> {
  // Simulate processing time for UX
  await new Promise((resolve) => setTimeout(resolve, 800))

  const { location, category } = input

  // For now, we focus on UK. Other locations would follow similar pattern.
  if (location !== "uk") {
    // Return a basic result for non-UK locations with a message
    return {
      location,
      locationName: locationNames[location],
      category,
      categoryName: categoryNames[category],
      generatedAt: new Date().toISOString(),
      summary: `Consumer rights information for ${locationNames[location]} coming soon. Currently, our most comprehensive coverage is for the United Kingdom.`,
      keyRights: [
        {
          title: "General Consumer Protection",
          description:
            "Most countries have laws protecting consumers from faulty goods and unfair practices.",
          keyPoints: [
            "Check your local consumer protection agency",
            "Keep all receipts and documentation",
            "Put complaints in writing",
            "Know your chargeback rights with your payment provider",
          ],
        },
      ],
      applicableLaws: [
        {
          name: "Local Consumer Protection Laws",
          jurisdiction: locationNames[location],
          relevance: "high",
          keyProvision: "Varies by jurisdiction",
          whatItMeans:
            "Contact your local consumer protection agency for specific laws in your area.",
        },
      ],
      timeline: [
        {
          period: "Varies",
          title: "Check local laws",
          description: "Time limits for claims vary by jurisdiction",
          isActive: true,
        },
      ],
      dos: commonDos.slice(0, 5),
      donts: commonDonts.slice(0, 5),
      keyPhrases: [
        "I am a consumer and I believe my rights have been violated.",
        "Please provide a full refund or appropriate remedy.",
        "I expect a response within 14 business days.",
      ],
      escalationPath: [
        {
          step: 1,
          title: "Contact the seller",
          description: "Start with a formal complaint to the seller",
          when: "First step",
        },
        {
          step: 2,
          title: "Consumer protection agency",
          description: "Escalate to your local consumer protection agency",
          when: "If seller doesn't respond",
        },
        {
          step: 3,
          title: "Legal action",
          description: "Consider small claims court or legal advice",
          when: "As a last resort",
        },
      ],
      officialResources: [
        {
          name: "Your Local Consumer Agency",
          url: "#",
          description: "Search for consumer protection in your area",
        },
      ],
      relatedTools: [
        { name: "Complaint Checker", href: "/tools/complaint-checker", description: "Assess your complaint" },
        { name: "Section 75 Checker", href: "/tools/section-75-checker", description: "Check payment protection" },
      ],
    }
  }

  // UK-specific result
  return {
    location,
    locationName: locationNames[location],
    category,
    categoryName: categoryNames[category],
    generatedAt: new Date().toISOString(),
    summary: getSummary(category),
    keyRights: ukRights[category],
    applicableLaws: ukLaws[category],
    timeline: ukTimelines[category],
    dos: commonDos,
    donts: commonDonts,
    keyPhrases: ukKeyPhrases[category],
    escalationPath: ukEscalation,
    officialResources: ukResources,
    relatedTools: relatedToolsMap[category],
  }
}

function getSummary(category: CheatSheetCategory): string {
  const summaries: Record<CheatSheetCategory, string> = {
    "faulty-goods":
      "If you've bought faulty goods, UK law gives you strong protections. Within 30 days, you can reject goods for a full refund. After that, you can request repair or replacement, and if those fail, claim a refund. The Consumer Rights Act 2015 is your main protection.",
    refunds:
      "Your refund rights in the UK depend on why you're returning goods. For faulty items, you have up to 6 years to claim (though rights reduce over time). For online purchases, you have 14 days to cancel for any reason. Know your rights and don't accept less.",
    "online-purchases":
      "When you buy online, you have extra protection under the Consumer Contracts Regulations. You can cancel within 14 days of delivery for any reason. Sellers must provide clear information before purchase and goods must still be satisfactory quality.",
    delivery:
      "Sellers are responsible for goods until they're delivered to you. If goods don't arrive or arrive damaged, it's the seller's problem to fix—not the courier's. You can cancel for a full refund if delivery is late beyond an agreed date.",
    services:
      "Services must be performed with reasonable care and skill. If the work is substandard, you can request it be done again at no cost. If that's not possible, you can claim a price reduction. Any information the trader gives you about the service is binding.",
    subscriptions:
      "You can cancel new subscriptions within 14 days under the cooling-off period. For ongoing subscriptions, check your contract terms. Unfair terms (like excessive cancellation fees) may be unenforceable. Always cancel in writing and keep confirmation.",
    travel:
      "Flight delays and cancellations can entitle you to compensation of £220-£520 under UK261 regulations. Airlines must also provide care (meals, refreshments) during delays. Package holidays have additional protections including ATOL. You have 6 years to claim.",
    financial:
      "Section 75 makes your credit card company jointly liable for purchases between £100-£30,000. Chargeback can help with debit cards. The Financial Ombudsman offers free dispute resolution. These protections can recover your money when retailers fail.",
    general:
      "UK consumer law gives you strong protections. Goods must be satisfactory quality, fit for purpose, and as described. Services must be performed with reasonable care. Your contract is with the retailer, who cannot pass you to the manufacturer. Know your rights and assert them confidently.",
  }
  return summaries[category]
}

// Export types for form component
export type { CheatSheetLocation, CheatSheetCategory }
