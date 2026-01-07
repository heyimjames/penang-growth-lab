"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { Icon } from "@/lib/icons"
import {
  ArrowRight01Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Globe02Icon,
  Mail01Icon,
  Call02Icon,
  Clock01Icon,
} from "@hugeicons-pro/core-stroke-rounded"
import { useToolTracking } from "@/lib/hooks/use-tool-tracking"

type Country = "uk" | "us" | "eu" | "au" | "ca"

type Industry =
  | "energy"
  | "finance"
  | "telecoms"
  | "travel"
  | "legal"
  | "property"
  | "motor"
  | "furniture"
  | "retail"
  | "public"
  | "health"
  | "parking"

const countryConfig: Record<Country, { name: string; flag: string }> = {
  uk: { name: "United Kingdom", flag: "🇬🇧" },
  us: { name: "United States", flag: "🇺🇸" },
  eu: { name: "European Union", flag: "🇪🇺" },
  au: { name: "Australia", flag: "🇦🇺" },
  ca: { name: "Canada", flag: "🇨🇦" },
}

interface OmbudsmanInfo {
  name: string
  description: string
  website: string
  phone?: string
  email?: string
  waitPeriod: string
  freeService: boolean
  whatTheyCover: string[]
  howToComplain: string[]
  beforeYouComplain: string[]
  tips: string[]
  country: Country
}

// Industries available per country (not all countries have ombudsmen for all industries)
const industriesByCountry: Record<Country, Industry[]> = {
  uk: ["energy", "finance", "telecoms", "travel", "legal", "property", "motor", "furniture", "retail", "public", "health", "parking"],
  us: ["finance", "telecoms", "health", "retail"],
  eu: ["finance", "telecoms", "travel", "retail"],
  au: ["energy", "finance", "telecoms", "health", "retail"],
  ca: ["finance", "telecoms", "health", "retail"],
}

const ombudsmenData: Record<Country, Partial<Record<Industry, OmbudsmanInfo>>> = {
  uk: {
    energy: {
      name: "Energy Ombudsman",
      description: "For complaints about gas and electricity suppliers and network operators.",
      website: "https://www.energyombudsman.org",
      phone: "0330 440 1624",
      waitPeriod: "8 weeks",
      freeService: true,
      whatTheyCover: [
        "Billing disputes and meter readings",
        "Switching supplier problems",
        "Connection and disconnection issues",
        "Customer service failures",
        "Misleading sales practices",
      ],
      howToComplain: [
        "Complain directly to your supplier first",
        "Wait 8 weeks, or get a deadlock letter",
        "Submit your case online at energyombudsman.org",
        "The ombudsman will investigate and make a decision",
      ],
      beforeYouComplain: [
        "Keep all correspondence with your supplier",
        "Note dates, names, and what was promised",
        "Gather bills and meter readings",
        "Request a deadlock letter if they won't resolve it",
      ],
      tips: [
        "Most cases are resolved within 2 months",
        "Compensation awards average £50-£500",
        "The supplier must comply with the decision",
      ],
      country: "uk",
    },
    finance: {
      name: "Financial Ombudsman Service (FOS)",
      description: "For complaints about banks, insurance, loans, pensions, and other financial services.",
      website: "https://www.financial-ombudsman.org.uk",
      phone: "0800 023 4567",
      waitPeriod: "8 weeks",
      freeService: true,
      whatTheyCover: [
        "Bank account disputes",
        "Credit card and loan issues",
        "Insurance claim rejections",
        "Pension and investment problems",
        "Mis-sold financial products (PPI, etc.)",
        "Mortgage complaints",
      ],
      howToComplain: [
        "Complain to your financial provider first",
        "Wait 8 weeks or get a final response letter",
        "Submit your case online or by phone",
        "FOS will review and make a binding decision",
      ],
      beforeYouComplain: [
        "Get the firm's final response letter",
        "Gather statements, contracts, and correspondence",
        "Calculate any financial loss clearly",
        "Complain within 6 years of the event",
      ],
      tips: [
        "FOS can award up to £415,000 compensation",
        "Their decision is binding on the company, not on you",
        "You can still go to court if you disagree",
      ],
      country: "uk",
    },
    telecoms: {
      name: "Ombudsman Services: Communications",
      description: "For complaints about phone, broadband, and TV providers.",
      website: "https://www.ombudsman-services.org/sectors/communications",
      phone: "0330 440 1614",
      waitPeriod: "8 weeks",
      freeService: true,
      whatTheyCover: [
        "Billing errors and disputes",
        "Contract and switching problems",
        "Service quality issues",
        "Mis-selling of contracts",
        "Complaints about customer service",
      ],
      howToComplain: [
        "Complain to your provider first",
        "Wait 8 weeks or request a deadlock letter",
        "Check if your provider uses this ombudsman (not all do)",
        "Submit your case online",
      ],
      beforeYouComplain: [
        "Check which ombudsman your provider uses",
        "Some use CISAS instead - check their website",
        "Keep copies of bills and contracts",
        "Note all service outages and issues",
      ],
      tips: [
        "Ofcom regulates telecoms but doesn't handle individual complaints",
        "You can claim for inconvenience, not just financial loss",
        "Consider automatic compensation for outages",
      ],
      country: "uk",
    },
    travel: {
      name: "ABTA Arbitration / Civil Aviation Authority",
      description: "For complaints about travel agents, tour operators, and airlines.",
      website: "https://www.abta.com/help-and-complaints",
      phone: "020 3117 0599",
      waitPeriod: "8 weeks",
      freeService: false,
      whatTheyCover: [
        "Package holiday problems",
        "Flight delays and cancellations",
        "Hotel booking issues",
        "Travel agent failures",
        "Refund disputes",
      ],
      howToComplain: [
        "Complain to the travel company first",
        "For ABTA members, use ABTA's dispute resolution",
        "For airlines, try CAA ADR schemes or court",
        "Keep all booking confirmations and receipts",
      ],
      beforeYouComplain: [
        "Check if the company is ABTA registered",
        "For flights, check UK261/EU261 compensation rights",
        "Document everything with photos and receipts",
        "Check your travel insurance policy",
      ],
      tips: [
        "ABTA arbitration costs from £108",
        "Airlines have specific compensation schemes",
        "Small claims court may be faster for refunds",
      ],
      country: "uk",
    },
    legal: {
      name: "Legal Ombudsman",
      description: "For complaints about lawyers, solicitors, and legal service providers.",
      website: "https://www.legalombudsman.org.uk",
      phone: "0300 555 0333",
      email: "enquiries@legalombudsman.org.uk",
      waitPeriod: "8 weeks",
      freeService: true,
      whatTheyCover: [
        "Poor quality legal work",
        "Costs and billing disputes",
        "Delays in handling your case",
        "Failure to follow instructions",
        "Poor communication",
      ],
      howToComplain: [
        "Use the firm's internal complaints procedure first",
        "Give them 8 weeks to respond",
        "Submit to the Legal Ombudsman within 6 months of their final response",
        "Complaints must be within 6 years of the problem",
      ],
      beforeYouComplain: [
        "Check the firm's complaints procedure",
        "Gather all correspondence and invoices",
        "Document specific failures clearly",
        "Note any financial loss or impact",
      ],
      tips: [
        "Can award up to £50,000 compensation",
        "Cannot deal with negligence claims - those go to court",
        "For negligence, you may need another solicitor",
      ],
      country: "uk",
    },
    property: {
      name: "Property Ombudsman",
      description: "For complaints about estate agents, lettings agents, and property management.",
      website: "https://www.tpos.co.uk",
      phone: "01onal722 333306",
      waitPeriod: "8 weeks",
      freeService: true,
      whatTheyCover: [
        "Estate agent service failures",
        "Lettings agent disputes",
        "Deposit deductions",
        "Fees and charges disputes",
        "Property management issues",
      ],
      howToComplain: [
        "Complain to the agent's head office first",
        "Give them 8 weeks to resolve",
        "Check they're registered with TPO or PRS",
        "Submit your case online",
      ],
      beforeYouComplain: [
        "Check the agent's redress scheme membership",
        "Gather tenancy agreements and inventories",
        "Keep photos and correspondence",
        "For deposits, try the deposit scheme first",
      ],
      tips: [
        "All agents must belong to a redress scheme by law",
        "Can award up to £25,000",
        "For deposit disputes, use the deposit protection scheme",
      ],
      country: "uk",
    },
    motor: {
      name: "Motor Ombudsman",
      description: "For complaints about car purchases, repairs, and warranties.",
      website: "https://www.themotorombudsman.org",
      phone: "0345 241 3008",
      waitPeriod: "8 weeks",
      freeService: true,
      whatTheyCover: [
        "New and used car purchases",
        "Servicing and repairs",
        "Extended warranties",
        "Manufacturer warranty issues",
        "Vehicle advertising disputes",
      ],
      howToComplain: [
        "Complain to the garage or dealer first",
        "Check they're Motor Ombudsman accredited",
        "Wait 8 weeks or get deadlock letter",
        "Submit your case online",
      ],
      beforeYouComplain: [
        "Check the business is Motor Ombudsman accredited",
        "Get an independent inspection report if possible",
        "Keep all invoices, receipts, and correspondence",
        "Note mileage and dates of work",
      ],
      tips: [
        "Not all garages are members - check first",
        "For non-members, consider small claims court",
        "Consumer Rights Act gives you 6 years to claim",
      ],
      country: "uk",
    },
    furniture: {
      name: "Furniture & Home Improvement Ombudsman",
      description: "For complaints about furniture retailers and home improvement companies.",
      website: "https://www.fhio.org",
      phone: "0333 241 3209",
      waitPeriod: "8 weeks",
      freeService: true,
      whatTheyCover: [
        "Furniture quality issues",
        "Delivery problems",
        "Installation failures",
        "Home improvement work",
        "Contract disputes",
      ],
      howToComplain: [
        "Complain to the retailer first",
        "Check they're FHIO registered",
        "Wait 8 weeks for response",
        "Submit online if unresolved",
      ],
      beforeYouComplain: [
        "Check the company is a member",
        "Take photos of any damage or defects",
        "Keep delivery notes and contracts",
        "Note any verbal promises made",
      ],
      tips: [
        "Not all furniture retailers are members",
        "For non-members, use small claims court",
        "Consumer Rights Act applies to all retailers",
      ],
      country: "uk",
    },
    retail: {
      name: "Retail ADR (Limited Coverage)",
      description: "General retail has limited ombudsman coverage - alternative routes available.",
      website: "https://www.retailadr.org.uk",
      waitPeriod: "8 weeks",
      freeService: true,
      whatTheyCover: [
        "Some retailers are members of ADR schemes",
        "Many are not covered by any ombudsman",
        "Alternative routes may be needed",
      ],
      howToComplain: [
        "Complain to the retailer directly",
        "Check if they're registered with any ADR scheme",
        "Consider small claims court for refunds",
        "Trading Standards can investigate but not get you compensation",
      ],
      beforeYouComplain: [
        "Check the retailer's complaint policy",
        "Keep all receipts and correspondence",
        "Know your Consumer Rights Act protections",
        "Consider chargeback if you paid by card",
      ],
      tips: [
        "Small claims court is often the best route",
        "Section 75/chargeback can be faster than court",
        "Trading Standards handles criminal matters, not refunds",
      ],
      country: "uk",
    },
    public: {
      name: "Parliamentary & Health Service Ombudsman",
      description: "For complaints about government departments and the NHS in England.",
      website: "https://www.ombudsman.org.uk",
      phone: "0345 015 4033",
      waitPeriod: "Varies",
      freeService: true,
      whatTheyCover: [
        "NHS treatment complaints",
        "Government department failures",
        "Benefits decisions (after Tribunal)",
        "HMRC complaints",
        "Home Office and DVLA issues",
      ],
      howToComplain: [
        "Exhaust the organisation's complaint procedure first",
        "For NHS: GP → NHS England → PHSO",
        "For government: Internal → MP → PHSO",
        "Your MP must refer your case for government complaints",
      ],
      beforeYouComplain: [
        "Complete all internal complaint stages",
        "For government, contact your MP first",
        "Gather medical records if NHS complaint",
        "Document the impact on your life",
      ],
      tips: [
        "Process can take 6-12 months",
        "Can recommend compensation and apology",
        "Cannot overturn Tribunal decisions",
      ],
      country: "uk",
    },
    health: {
      name: "Parliamentary & Health Service Ombudsman",
      description: "For complaints about NHS services in England.",
      website: "https://www.ombudsman.org.uk",
      phone: "0345 015 4033",
      waitPeriod: "After NHS complaints process",
      freeService: true,
      whatTheyCover: [
        "NHS hospital treatment",
        "GP services",
        "Mental health services",
        "NHS dental treatment",
        "Ambulance services",
      ],
      howToComplain: [
        "Complain to the NHS provider first",
        "Escalate to NHS England if unresolved",
        "Then approach PHSO",
        "Time limits apply - usually 12 months",
      ],
      beforeYouComplain: [
        "Request your medical records",
        "Keep a diary of events",
        "Get support from PALS at the hospital",
        "Consider independent advocacy services",
      ],
      tips: [
        "PHSO cannot award large compensation",
        "For clinical negligence, you may need a solicitor",
        "The process focuses on learning, not punishment",
      ],
      country: "uk",
    },
    parking: {
      name: "POPLA / IAS",
      description: "For private parking charge appeals.",
      website: "https://www.popla.co.uk",
      waitPeriod: "After parking company appeal",
      freeService: true,
      whatTheyCover: [
        "Private parking charge disputes",
        "Unclear signage claims",
        "Excessive charges",
        "Driver vs keeper liability",
      ],
      howToComplain: [
        "Appeal to the parking company first",
        "If rejected, check if they use POPLA or IAS",
        "Submit your appeal with evidence",
        "Decision is usually binding on the company",
      ],
      beforeYouComplain: [
        "Take photos of all signage",
        "Note the date, time, and circumstances",
        "Check if the driver or keeper is liable",
        "Keep the original parking charge notice",
      ],
      tips: [
        "For council parking, appeal to the council then tribunal",
        "Many private charges are unenforceable if poorly signed",
        "Never ignore a charge - it can affect credit",
      ],
      country: "uk",
    },
  },
  us: {
    finance: {
      name: "Consumer Financial Protection Bureau (CFPB)",
      description: "Federal agency handling complaints about financial products and services.",
      website: "https://www.consumerfinance.gov/complaint",
      phone: "1-855-411-2372",
      waitPeriod: "15 days for company response",
      freeService: true,
      whatTheyCover: [
        "Credit cards and bank accounts",
        "Mortgages and home loans",
        "Student loans",
        "Debt collection issues",
        "Credit reporting problems",
      ],
      howToComplain: [
        "Submit complaint at consumerfinance.gov",
        "Company must respond within 15 days",
        "CFPB will publish response",
        "You can dispute the response if unsatisfied",
      ],
      beforeYouComplain: [
        "Try to resolve with the company first",
        "Gather account statements and correspondence",
        "Document dates and amounts clearly",
        "Note any financial harm suffered",
      ],
      tips: [
        "CFPB publishes complaints in a public database",
        "Companies take CFPB complaints seriously",
        "You can also file with your state AG",
      ],
      country: "us",
    },
    telecoms: {
      name: "Federal Communications Commission (FCC)",
      description: "Federal agency handling phone, internet, and TV complaints.",
      website: "https://consumercomplaints.fcc.gov",
      phone: "1-888-225-5322",
      waitPeriod: "30 days for company response",
      freeService: true,
      whatTheyCover: [
        "Billing and service quality",
        "Cramming and slamming",
        "Robocalls and spam texts",
        "Internet service issues",
        "Cable and satellite TV",
      ],
      howToComplain: [
        "File complaint at consumercomplaints.fcc.gov",
        "Company must respond within 30 days",
        "FCC reviews and may take action",
        "You can escalate if unresolved",
      ],
      beforeYouComplain: [
        "Contact your provider's customer service first",
        "Document outages and service issues",
        "Keep copies of bills showing errors",
        "Note any switching or cramming issues",
      ],
      tips: [
        "FCC can fine companies for violations",
        "State PUC may also handle complaints",
        "Consider small claims court for refunds",
      ],
      country: "us",
    },
    health: {
      name: "State Medical Boards / CMS",
      description: "For complaints about healthcare providers and insurance.",
      website: "https://www.cms.gov/medicare/beneficiary-complaints",
      phone: "1-800-633-4227",
      waitPeriod: "Varies by state",
      freeService: true,
      whatTheyCover: [
        "Medical malpractice concerns",
        "Insurance claim denials",
        "Hospital billing disputes",
        "Quality of care issues",
        "Medicare/Medicaid problems",
      ],
      howToComplain: [
        "File with your state medical board for provider issues",
        "Contact your state insurance commissioner for insurance",
        "Use CMS for Medicare/Medicaid complaints",
        "Consider patient advocacy organizations",
      ],
      beforeYouComplain: [
        "Request your medical records",
        "Get itemized bills and EOBs",
        "Document dates and communications",
        "Consider getting a second medical opinion",
      ],
      tips: [
        "Medical malpractice may require an attorney",
        "Most states have patient rights advocates",
        "Hospital financial assistance may be available",
      ],
      country: "us",
    },
    retail: {
      name: "Federal Trade Commission (FTC) / State AG",
      description: "For consumer protection and unfair business practices.",
      website: "https://reportfraud.ftc.gov",
      phone: "1-877-382-4357",
      waitPeriod: "Varies",
      freeService: true,
      whatTheyCover: [
        "Deceptive advertising",
        "Warranty issues",
        "Unfair business practices",
        "Online shopping problems",
        "Scams and fraud",
      ],
      howToComplain: [
        "Report to FTC at reportfraud.ftc.gov",
        "File with your state attorney general",
        "Contact local consumer protection office",
        "Consider small claims court for refunds",
      ],
      beforeYouComplain: [
        "Gather receipts and order confirmations",
        "Keep screenshots of ads and promises",
        "Document all communication attempts",
        "Check your credit card chargeback rights",
      ],
      tips: [
        "FTC doesn't resolve individual complaints but tracks patterns",
        "State AG may pursue group actions",
        "Credit card chargeback may be fastest remedy",
      ],
      country: "us",
    },
  },
  eu: {
    finance: {
      name: "European Banking Authority / National Ombudsmen",
      description: "For cross-border financial complaints in the EU.",
      website: "https://www.eba.europa.eu",
      waitPeriod: "Varies by country",
      freeService: true,
      whatTheyCover: [
        "Cross-border banking issues",
        "Payment service problems",
        "Insurance complaints",
        "Investment disputes",
        "Credit and lending issues",
      ],
      howToComplain: [
        "Contact your national financial ombudsman first",
        "For cross-border issues, use FIN-NET network",
        "File with EBA for systemic issues",
        "Use European Consumer Centre for cross-border help",
      ],
      beforeYouComplain: [
        "Identify which country's rules apply",
        "Complain to the company in writing first",
        "Gather contracts and statements",
        "Use FIN-NET to find the right ombudsman",
      ],
      tips: [
        "FIN-NET connects national ombudsmen across EU",
        "European Consumer Centre offers free advice",
        "SEPA rules protect payment rights",
      ],
      country: "eu",
    },
    telecoms: {
      name: "National Telecom Regulators / BEREC",
      description: "For telecom complaints in EU member states.",
      website: "https://www.berec.europa.eu",
      waitPeriod: "Varies by country",
      freeService: true,
      whatTheyCover: [
        "Roaming charges and fees",
        "Contract and switching issues",
        "Service quality problems",
        "Net neutrality violations",
        "Cross-border calling issues",
      ],
      howToComplain: [
        "Contact your national telecom regulator",
        "Use European Consumer Centre for cross-border",
        "Check BEREC for net neutrality issues",
        "File with ODR platform for online purchases",
      ],
      beforeYouComplain: [
        "Know your EU roaming rights",
        "Keep records of charges and bills",
        "Document service outages",
        "Check contract terms carefully",
      ],
      tips: [
        "EU roaming: 'Roam Like at Home' rules apply",
        "Net neutrality protections are EU law",
        "Each country has its own regulator",
      ],
      country: "eu",
    },
    travel: {
      name: "National Enforcement Bodies / European Consumer Centre",
      description: "For airline and travel complaints under EU261.",
      website: "https://ec.europa.eu/consumers/odr",
      waitPeriod: "6 weeks (airlines)",
      freeService: true,
      whatTheyCover: [
        "Flight delays over 3 hours",
        "Flight cancellations",
        "Denied boarding",
        "Package holiday problems",
        "Cross-border travel issues",
      ],
      howToComplain: [
        "Claim directly from airline first",
        "Contact your National Enforcement Body",
        "Use European Consumer Centre for cross-border",
        "Consider ADR or small claims court",
      ],
      beforeYouComplain: [
        "Know your EU261 rights (€250-€600)",
        "Keep boarding passes and delay evidence",
        "Document any expenses incurred",
        "Check if delay was airline's fault",
      ],
      tips: [
        "EU261 applies to EU airlines worldwide",
        "6-year time limit in most countries",
        "Weather and strikes may be extraordinary circumstances",
      ],
      country: "eu",
    },
    retail: {
      name: "Online Dispute Resolution (ODR) Platform",
      description: "EU platform for online shopping disputes.",
      website: "https://ec.europa.eu/consumers/odr",
      waitPeriod: "90 days",
      freeService: true,
      whatTheyCover: [
        "Online purchases from EU sellers",
        "Digital content issues",
        "Cross-border shopping problems",
        "Returns and refunds",
        "Product quality disputes",
      ],
      howToComplain: [
        "Try to resolve with seller first",
        "Submit complaint through ODR platform",
        "Platform connects you to ADR body",
        "European Consumer Centre can assist",
      ],
      beforeYouComplain: [
        "Confirm seller is EU-based",
        "Keep order confirmations and receipts",
        "Document any defects with photos",
        "Check your 14-day withdrawal right",
      ],
      tips: [
        "14-day cooling-off period for online purchases",
        "2-year guarantee under EU law",
        "European Consumer Centres offer free help",
      ],
      country: "eu",
    },
  },
  au: {
    energy: {
      name: "Energy & Water Ombudsman (State-based)",
      description: "For electricity, gas, and water complaints in your state.",
      website: "https://www.ewon.com.au",
      phone: "1800 246 545",
      waitPeriod: "Varies (usually 20 business days)",
      freeService: true,
      whatTheyCover: [
        "Billing disputes",
        "Disconnection issues",
        "Connection problems",
        "Hardship and payment plans",
        "Customer service failures",
      ],
      howToComplain: [
        "Complain to your retailer/distributor first",
        "Contact your state's energy ombudsman",
        "NSW: EWON, VIC: EWOV, QLD: EWOQ, SA: EWOSA",
        "Submit your case online or by phone",
      ],
      beforeYouComplain: [
        "Keep copies of all bills and correspondence",
        "Note reference numbers and dates",
        "Document any hardship circumstances",
        "Request a review of bills if disputed",
      ],
      tips: [
        "Each state has its own ombudsman",
        "Hardship programs are available",
        "Energy price comparator sites can help",
      ],
      country: "au",
    },
    finance: {
      name: "Australian Financial Complaints Authority (AFCA)",
      description: "For complaints about banks, insurers, and financial services.",
      website: "https://www.afca.org.au",
      phone: "1800 931 678",
      waitPeriod: "45 days (general), 21 days (hardship)",
      freeService: true,
      whatTheyCover: [
        "Banking and credit disputes",
        "Insurance claim denials",
        "Superannuation issues",
        "Investment complaints",
        "Financial advice problems",
      ],
      howToComplain: [
        "Lodge internal dispute with your provider first",
        "Wait for their final response (or 45 days)",
        "Submit to AFCA online or by phone",
        "AFCA will investigate and make a decision",
      ],
      beforeYouComplain: [
        "Get the provider's internal dispute resolution response",
        "Gather account statements and contracts",
        "Calculate your financial loss",
        "Time limits: 6 years for most complaints",
      ],
      tips: [
        "AFCA decisions are binding on the provider",
        "You can still go to court if you disagree",
        "Can award up to $1 million compensation",
      ],
      country: "au",
    },
    telecoms: {
      name: "Telecommunications Industry Ombudsman (TIO)",
      description: "For phone, internet, and NBN complaints.",
      website: "https://www.tio.com.au",
      phone: "1800 062 058",
      waitPeriod: "After provider complaint",
      freeService: true,
      whatTheyCover: [
        "Phone and internet faults",
        "Billing disputes",
        "Contract issues",
        "Connection and disconnection",
        "Customer service failures",
      ],
      howToComplain: [
        "Complain to your provider first",
        "Give them time to respond",
        "Contact TIO if unresolved",
        "TIO will facilitate resolution",
      ],
      beforeYouComplain: [
        "Document all faults and outages",
        "Keep copies of bills and contracts",
        "Note all contact with provider",
        "Check if NBN is responsible",
      ],
      tips: [
        "TIO is free and independent",
        "Most complaints resolved within weeks",
        "Provider pays for TIO involvement",
      ],
      country: "au",
    },
    health: {
      name: "Health Complaints Commissioner (State-based)",
      description: "For complaints about healthcare providers.",
      website: "https://www.hccc.nsw.gov.au",
      phone: "1800 043 159",
      waitPeriod: "Varies by state",
      freeService: true,
      whatTheyCover: [
        "Medical treatment concerns",
        "Hospital services",
        "Health practitioner conduct",
        "Private health insurance",
        "Aged care complaints",
      ],
      howToComplain: [
        "Contact your state health complaints body",
        "NSW: HCCC, VIC: HCC, QLD: OHO",
        "For insurance: contact AFCA",
        "Aged care: Aged Care Quality and Safety Commission",
      ],
      beforeYouComplain: [
        "Request your medical records",
        "Document the timeline of events",
        "Get a second medical opinion if needed",
        "Keep records of any expenses",
      ],
      tips: [
        "Each state has its own complaints body",
        "AHPRA handles practitioner registration",
        "Malpractice claims may need a lawyer",
      ],
      country: "au",
    },
    retail: {
      name: "ACCC / State Fair Trading",
      description: "For consumer protection and business conduct.",
      website: "https://www.accc.gov.au",
      phone: "1300 302 502",
      waitPeriod: "Varies",
      freeService: true,
      whatTheyCover: [
        "Australian Consumer Guarantees",
        "Misleading advertising",
        "Product safety issues",
        "Refunds and repairs",
        "Unfair contract terms",
      ],
      howToComplain: [
        "Contact the business directly first",
        "Lodge complaint with state fair trading",
        "Report to ACCC for patterns of conduct",
        "Consider NCAT/VCAT for disputes",
      ],
      beforeYouComplain: [
        "Know your Australian Consumer Guarantee rights",
        "Keep receipts and proof of purchase",
        "Document faults with photos",
        "Get repair quotes if applicable",
      ],
      tips: [
        "Consumer guarantees have no fixed time limit",
        "NCAT/VCAT can order refunds and compensation",
        "Chargeback through your bank may be faster",
      ],
      country: "au",
    },
  },
  ca: {
    finance: {
      name: "Ombudsman for Banking Services (OBSI)",
      description: "For complaints about banks and investment firms.",
      website: "https://www.obsi.ca",
      phone: "1-888-451-4519",
      waitPeriod: "90 days from firm's final response",
      freeService: true,
      whatTheyCover: [
        "Banking service complaints",
        "Investment losses",
        "Mortgage issues",
        "Credit card disputes",
        "Service quality problems",
      ],
      howToComplain: [
        "Complain to your bank/firm first",
        "Wait for their final response (or 90 days)",
        "Submit to OBSI if unresolved",
        "OBSI will investigate and recommend",
      ],
      beforeYouComplain: [
        "Exhaust internal complaint process",
        "Gather statements and correspondence",
        "Document your financial loss",
        "Check time limits (6 years general)",
      ],
      tips: [
        "OBSI can recommend up to $350,000",
        "Recommendations are not binding",
        "ADR Chambers handles some firms",
      ],
      country: "ca",
    },
    telecoms: {
      name: "Commission for Complaints for Telecom-TV Services (CCTS)",
      description: "For phone, internet, and TV service complaints.",
      website: "https://www.ccts-cprst.ca",
      phone: "1-888-221-1687",
      waitPeriod: "After provider complaint",
      freeService: true,
      whatTheyCover: [
        "Billing disputes",
        "Contract issues",
        "Service quality problems",
        "Cancellation and switching",
        "Misleading sales practices",
      ],
      howToComplain: [
        "Complain to your provider first",
        "Allow time for response",
        "Contact CCTS if unresolved",
        "CCTS will facilitate resolution",
      ],
      beforeYouComplain: [
        "Keep copies of all bills and contracts",
        "Document service issues",
        "Note all contact with provider",
        "Check if CRTC rules were violated",
      ],
      tips: [
        "CCTS is free and impartial",
        "Most cases resolved within 60 days",
        "Provider must participate by law",
      ],
      country: "ca",
    },
    health: {
      name: "Provincial Patient Ombudsman",
      description: "For healthcare complaints in your province.",
      website: "https://patientombudsman.ca",
      phone: "1-888-321-0339",
      waitPeriod: "Varies by province",
      freeService: true,
      whatTheyCover: [
        "Hospital care concerns",
        "Long-term care issues",
        "Home care complaints",
        "Mental health services",
        "Patient rights violations",
      ],
      howToComplain: [
        "Complain to the healthcare provider first",
        "Contact your provincial patient ombudsman",
        "ON: Patient Ombudsman, BC: Patient Care Quality Office",
        "Each province has different processes",
      ],
      beforeYouComplain: [
        "Request your medical records",
        "Document events and dates",
        "Get a second opinion if needed",
        "Check provincial time limits",
      ],
      tips: [
        "Each province has its own process",
        "Regulatory colleges handle practitioner issues",
        "Malpractice claims need a lawyer",
      ],
      country: "ca",
    },
    retail: {
      name: "Provincial Consumer Protection Offices",
      description: "For consumer complaints and business practices.",
      website: "https://www.canada.ca/en/services/finance/consumer-affairs.html",
      waitPeriod: "Varies by province",
      freeService: true,
      whatTheyCover: [
        "Defective products",
        "Misleading advertising",
        "Contract disputes",
        "Refund issues",
        "Unfair business practices",
      ],
      howToComplain: [
        "Contact the business directly first",
        "File with provincial consumer protection office",
        "ON: Consumer Protection Ontario, BC: Consumer Protection BC",
        "Consider small claims court for refunds",
      ],
      beforeYouComplain: [
        "Keep all receipts and proof of purchase",
        "Document the issue with photos",
        "Know your provincial consumer rights",
        "Check cooling-off periods",
      ],
      tips: [
        "Laws vary by province",
        "Small claims court limits vary",
        "Credit card chargeback may be fastest",
      ],
      country: "ca",
    },
  },
}

function ResultCard({ industry, info }: { industry: Industry; info: OmbudsmanInfo }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Ombudsman Details */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{info.name}</h3>
            <p className="text-sm text-muted-foreground">{info.description}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full ${info.freeService ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {info.freeService ? "Free service" : "May have fees"}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <a
            href={info.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-forest-50 rounded-md hover:bg-forest-100 transition-colors"
          >
            <Icon icon={Globe02Icon} size={18} className="text-forest-500" />
            <span className="text-sm text-foreground">Visit website</span>
          </a>
          {info.phone && (
            <a
              href={`tel:${info.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 p-3 bg-forest-50 rounded-md hover:bg-forest-100 transition-colors"
            >
              <Icon icon={Call02Icon} size={18} className="text-forest-500" />
              <span className="text-sm text-foreground">{info.phone}</span>
            </a>
          )}
          {info.email && (
            <a
              href={`mailto:${info.email}`}
              className="flex items-center gap-3 p-3 bg-forest-50 rounded-md hover:bg-forest-100 transition-colors"
            >
              <Icon icon={Mail01Icon} size={18} className="text-forest-500" />
              <span className="text-sm text-foreground">{info.email}</span>
            </a>
          )}
          <div className="flex items-center gap-3 p-3 bg-forest-50 rounded-md">
            <Icon icon={Clock01Icon} size={18} className="text-forest-500" />
            <span className="text-sm text-foreground">Wait period: {info.waitPeriod}</span>
          </div>
        </div>
      </div>

      {/* What They Cover */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">What They Cover</h3>
        <ul className="space-y-2">
          {info.whatTheyCover.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Icon icon={CheckmarkCircle01Icon} size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* How to Complain */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">How to Complain</h3>
        <ol className="space-y-3">
          {info.howToComplain.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-forest-100 text-forest-600 text-sm font-medium flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Before You Complain */}
      <div className="p-6 bg-background border border-forest-100 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Before You Complain</h3>
        <ul className="space-y-2">
          {info.beforeYouComplain.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Icon icon={AlertCircleIcon} size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tips */}
      <div className="p-4 bg-forest-50 border border-forest-200 rounded-lg">
        <h4 className="font-medium text-forest-700 mb-2">Good to Know</h4>
        <ul className="space-y-1">
          {info.tips.map((tip, i) => (
            <li key={i} className="text-sm text-forest-600">• {tip}</li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="p-6 bg-forest-500 rounded-lg text-white">
        <h3 className="font-semibold text-lg mb-2">Need help preparing your complaint?</h3>
        <p className="text-forest-100 mb-4">
          NoReply can help you draft a professional complaint letter before escalating to the ombudsman.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="coral">
            <Link href={`/new?tool=ombudsman&industry=${industry}`} className="flex items-center">
              Prepare Your Complaint
              <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="bg-white/10 text-white hover:bg-white hover:text-forest-700"
          >
            <Link href="/auth/sign-up">Create Free Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const industryLabels: Record<Industry, string> = {
  energy: "Energy (gas & electricity)",
  finance: "Finance (banks, insurance, loans)",
  telecoms: "Telecoms (phone, broadband, TV)",
  travel: "Travel & holidays",
  legal: "Legal services",
  property: "Property (estate agents, lettings)",
  motor: "Motor (car dealers, garages)",
  furniture: "Furniture & home improvement",
  retail: "General retail",
  health: "Healthcare",
  public: "Government & public services",
  parking: "Private parking",
}

export function OmbudsmanFinderForm() {
  const [country, setCountry] = useState<Country | "">("")
  const [industry, setIndustry] = useState<Industry | "">("")
  const [result, setResult] = useState<OmbudsmanInfo | null>(null)
  const [error, setError] = useState("")

  // Get available industries for selected country
  const availableIndustries = country ? industriesByCountry[country] : []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!country) {
      setError("Please select your country")
      return
    }

    if (!industry) {
      setError("Please select an industry")
      return
    }

    const countryData = ombudsmenData[country]
    if (countryData && countryData[industry]) {
      setResult(countryData[industry]!)
    }
  }

  const handleReset = () => {
    setCountry("")
    setIndustry("")
    setResult(null)
    setError("")
  }

  const handleCountryChange = (value: Country) => {
    setCountry(value)
    setIndustry("") // Reset industry when country changes
  }

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country Selector */}
          <div className="space-y-2">
            <Label htmlFor="country">
              <span className="flex items-center gap-2">
                <Icon icon={Globe02Icon} size={16} className="text-muted-foreground" />
                Where are you located?
              </span>
            </Label>
            <Select value={country} onValueChange={(value) => handleCountryChange(value as Country)}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.flag} {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Industry Selector */}
          <div className="space-y-2">
            <Label htmlFor="industry">What industry is your complaint about?</Label>
            <Select
              value={industry}
              onValueChange={(value) => setIndustry(value as Industry)}
              disabled={!country}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder={country ? "Select an industry" : "Select a country first"} />
              </SelectTrigger>
              <SelectContent>
                {availableIndustries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {industryLabels[ind]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {country && (
              <p className="text-xs text-muted-foreground">
                {availableIndustries.length} industries have ombudsman services in {countryConfig[country].name}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={!country || !industry}
            className="w-full bg-forest-500 hover:bg-forest-600 text-white h-12"
          >
            Find My Ombudsman
            <Icon icon={ArrowRight01Icon} size={16} className="ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free tool. No account required. Your data is not stored.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Your Ombudsman ({countryConfig[country as Country].flag})
            </h2>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Search again
            </Button>
          </div>
          <ResultCard industry={industry as Industry} info={result} />
        </div>
      )}
    </div>
  )
}
