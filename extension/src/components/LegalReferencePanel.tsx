import { useState, useMemo } from "react"
import { api, LegalReference, CompanyIntel } from "@/lib/api"
import { Search, Scale, Building2, Loader2, ExternalLink, AlertCircle, Sparkles, ChevronDown, ChevronUp, Tag } from "lucide-react"

interface LegalReferencePanelProps {
  domain: string | null
}

// Expanded category types
type SiteCategory =
  | "retail"
  | "telecom"
  | "travel"
  | "utilities"
  | "finance"
  | "insurance"
  | "streaming"
  | "subscriptions"
  | "food_delivery"
  | "home_services"
  | "automotive"
  | "healthcare"
  | "fitness"
  | "education"
  | "gaming"
  | "general"

interface ContextRight {
  title: string
  summary: string
  law: string
  actionTip?: string // Actionable next step
  compensation?: string // Potential compensation amount
}

interface CategoryMatch {
  category: SiteCategory
  matchedPattern: string
  confidence: "high" | "medium" | "low"
}

// Comprehensive domain patterns with confidence levels
const DOMAIN_PATTERNS: { patterns: string[]; category: SiteCategory; confidence: "high" | "medium" | "low" }[] = [
  // RETAIL - High confidence (specific retailers)
  {
    patterns: [
      "amazon", "ebay", "argos", "currys", "johnlewis", "john-lewis", "asos", "next.co", "boots.com",
      "tesco", "sainsbury", "asda", "morrisons", "aldi", "lidl", "waitrose", "ocado",
      "walmart", "target", "bestbuy", "costco", "ikea", "wayfair", "overstock",
      "very.co", "littlewoods", "jdsports", "sportsdirect", "decathlon", "halfords",
      "homebase", "bandq", "screwfix", "toolstation", "wickes",
      "marksandspencer", "m-and-s", "primark", "hm.com", "zara.com", "uniqlo", "gap.com",
      "nike.com", "adidas.co", "puma.com", "newlook", "riverisland", "topshop", "boohoo",
      "prettylittlething", "missguided", "shein", "zalando", "farfetch", "selfridges",
      "harrods", "debenhams", "ao.com", "appliances", "robertdyas", "lakeland",
      "therange", "dunelm", "matalan", "tkmaxx", "homesense", "smythstoys", "entertainer",
      "lego.com", "apple.com/shop", "samsung.com/shop", "dyson.co", "gtech", "shark",
      "etsy.com", "notonthehighstreet", "wish.com", "aliexpress", "banggood", "gearbest"
    ],
    category: "retail",
    confidence: "high",
  },
  // RETAIL - Medium confidence (generic terms)
  {
    patterns: ["shop", "store", "outlet", "mall", "buy", "order", "cart", "checkout"],
    category: "retail",
    confidence: "medium",
  },

  // TELECOM - High confidence
  {
    patterns: [
      "vodafone", "ee.co", "o2.co", "three.co", "bt.com", "sky.com", "virginmedia", "virgin-media",
      "talktalk", "plusnet", "now-tv", "nowtv", "giffgaff", "tesco-mobile", "id-mobile", "idmobile",
      "lebara", "lycamobile", "voxi", "smarty", "utility-warehouse",
      "tmobile", "t-mobile", "verizon", "att.com", "sprint", "xfinity", "comcast", "spectrum",
      "cox.com", "centurylink", "frontier", "cricket", "boost", "metro-by-t",
      "hyperoptic", "community-fibre", "zen.co", "shell-energy", "truespeed", "giganet"
    ],
    category: "telecom",
    confidence: "high",
  },
  {
    patterns: ["mobile", "telecom", "broadband", "fibre", "fiber", "internet-provider", "5g", "4g"],
    category: "telecom",
    confidence: "medium",
  },

  // TRAVEL - High confidence
  {
    patterns: [
      "ryanair", "easyjet", "britishairways", "british-airways", "ba.com", "lufthansa", "klm.com",
      "airfrance", "vueling", "wizz", "jet2", "tui.co", "thomson", "virginatlantic", "emirates",
      "qatar", "etihad", "singapore-air", "united.com", "delta.com", "american-airlines", "southwest",
      "norwegian", "icelandair", "aer-lingus", "iberia", "tap.pt", "alitalia", "swiss.com",
      "expedia", "booking.com", "hotels.com", "trivago", "kayak", "skyscanner", "momondo",
      "airbnb", "vrbo", "homeaway", "tripadvisor", "laterooms", "lastminute",
      "trainline", "nationalrail", "eurostar", "avanti", "gwr.com", "lner", "southeastern",
      "nationalexpress", "megabus", "flixbus", "greyhound",
      "enterprise", "hertz", "avis", "europcar", "sixt", "budget-rent", "thrifty",
      "loveholidays", "onthebeach", "first-choice", "kuoni", "trailfinders",
      "cruise.co", "royalcaribbean", "carnival", "ncl.com", "msc-cruises", "cunard", "pandocruises",
      "getaway", "vacation", "holiday"
    ],
    category: "travel",
    confidence: "high",
  },
  {
    patterns: ["travel", "flights", "airline", "hotel", "resort", "cruise", "tour", "booking"],
    category: "travel",
    confidence: "medium",
  },

  // UTILITIES - High confidence
  {
    patterns: [
      "britishgas", "british-gas", "edfenergy", "edf-energy", "eon-energy", "eon.co", "sse.co",
      "octopusenergy", "octopus-energy", "bulb.co", "scottishpower", "scottish-power", "npower",
      "so-energy", "ecotricity", "good-energy", "green-energy", "ovo-energy", "ovoenergy",
      "utilita", "utility-point", "pure-planet", "avro-energy", "igloo-energy",
      "thameswater", "thames-water", "unitedutilities", "united-utilities", "anglian-water",
      "wessex-water", "yorkshire-water", "severn-trent", "welsh-water", "southern-water",
      "northumbrian-water", "south-west-water", "affinity-water"
    ],
    category: "utilities",
    confidence: "high",
  },
  {
    patterns: ["energy", "water", "gas", "electric", "utility", "power", "supplier"],
    category: "utilities",
    confidence: "medium",
  },

  // FINANCE - High confidence
  {
    patterns: [
      "barclays", "hsbc", "lloyds", "lloydsbankinggroup", "natwest", "rbs.co", "santander",
      "halifax", "bankofscotland", "nationwide", "tsb.co", "metro-bank", "co-operative-bank",
      "monzo", "revolut", "starling", "chase.co", "marcus.co", "atom-bank", "tandem-bank",
      "firstdirect", "first-direct", "cahoot", "smile.co",
      "paypal", "klarna", "clearpay", "laybuy", "afterpay", "affirm", "zip.co",
      "americanexpress", "amex", "mastercard", "visa.co", "discover",
      "experian", "equifax", "transunion", "clearscore", "credit-karma", "totally-money",
      "moneysupermarket", "comparethemarket", "confused.com", "gocompare", "uswitch",
      "zopa", "funding-circle", "ratesetter", "lending-works",
      "openbanking", "wise.com", "transferwise", "worldremit", "remitly", "xe.com", "western-union",
      "coinbase", "binance", "kraken", "crypto.com", "gemini", "etoro"
    ],
    category: "finance",
    confidence: "high",
  },
  {
    patterns: ["bank", "credit", "loan", "mortgage", "invest", "trading", "savings", "finance"],
    category: "finance",
    confidence: "medium",
  },

  // INSURANCE - High confidence
  {
    patterns: [
      "aviva", "directline", "direct-line", "admiral", "churchillinsurance", "churchill-insurance",
      "lv.com", "liverpool-victoria", "axa.co", "zurich.co", "allianz", "rsa-insurance",
      "legal-and-general", "legalandgeneral", "prudential", "aegon", "scottish-widows",
      "standardlife", "standard-life", "royal-london", "sun-life", "canada-life",
      "hastings-direct", "esure", "1stcentral", "rac.co", "aa.com", "greenlight",
      "by-miles", "cuvva", "dayinsure", "veygo", "zego", "coya", "lemonade",
      "simply-business", "hiscox", "qdos", "markel-direct", "aig.co",
      "bupa", "vitality", "simplyhealth", "westfield-health", "benenden",
      "homeserve", "domestic-and-general", "d-and-g", "warranty-direct",
      "petplan", "morethan", "john-lewis-insurance", "m-and-s-insurance",
      "saga.co", "staysure", "insure-and-go", "world-nomads"
    ],
    category: "insurance",
    confidence: "high",
  },
  {
    patterns: ["insurance", "insure", "cover", "policy", "claim", "underwriter"],
    category: "insurance",
    confidence: "medium",
  },

  // STREAMING - High confidence
  {
    patterns: [
      "netflix", "disneyplus", "disney-plus", "primevideo", "prime-video", "amazonprime",
      "nowtv", "now-tv", "skygo", "sky-go", "apple-tv", "appletv", "hulu", "hbomax", "hbo-max",
      "paramount-plus", "paramountplus", "peacock", "discovery-plus", "discoveryplus",
      "britbox", "itvhub", "itv-hub", "bbc-iplayer", "channel4.com", "all4",
      "hayu", "shudder", "crunchyroll", "funimation", "dazn", "bt-sport", "eurosport-player",
      "spotify", "applemusic", "apple-music", "amazonmusic", "amazon-music", "tidal",
      "deezer", "soundcloud", "youtube-music", "youtubemusic", "pandora", "audible",
      "youtube-premium", "youtubepremium", "twitch", "vimeo",
      "kindle-unlimited", "scribd", "medium.com", "substack", "patreon"
    ],
    category: "streaming",
    confidence: "high",
  },
  {
    patterns: ["streaming", "stream", "watch", "video", "music", "podcast", "listen"],
    category: "streaming",
    confidence: "low",
  },

  // SUBSCRIPTIONS (SaaS, boxes, memberships) - High confidence
  {
    patterns: [
      "graze.com", "hellofresh", "gousto", "mindfulchef", "abel-and-cole", "riverford",
      "oddbox", "allplants", "pasta-evangelists",
      "birchbox", "glossybox", "lookfantastic", "thebeautybox", "cultbeauty",
      "stitchfix", "thread.com", "renttherunway",
      "barkbox", "butternutbox", "tails.com", "poochandmutt", "katkin",
      "microsoft365", "office365", "adobe", "creative-cloud", "canva", "figma",
      "dropbox", "google-one", "icloud", "onedrive", "evernote", "notion",
      "slack", "zoom.us", "teams", "asana", "monday.com", "trello", "clickup",
      "1password", "lastpass", "dashlane", "nordvpn", "expressvpn", "surfshark",
      "mcafee", "norton", "kaspersky", "bitdefender", "avast", "avg",
      "linkedin-premium", "indeed-prime", "glassdoor",
      "ancestry", "23andme", "myheritage", "findmypast"
    ],
    category: "subscriptions",
    confidence: "high",
  },
  {
    patterns: ["subscription", "subscribe", "membership", "premium", "pro-plan", "upgrade"],
    category: "subscriptions",
    confidence: "medium",
  },

  // FOOD DELIVERY - High confidence
  {
    patterns: [
      "deliveroo", "ubereats", "uber-eats", "justeat", "just-eat", "grubhub", "doordash",
      "postmates", "seamless", "caviar", "foodpanda", "swiggy", "zomato",
      "dominos", "pizzahut", "pizza-hut", "papajohns", "papa-johns",
      "mcdonalds", "burgerking", "burger-king", "kfc.co", "subway.co", "wendys",
      "nandos", "wagamama", "gourmetburger", "fiveguys", "five-guys", "shakeshack",
      "starbucks", "costa.co", "pret", "greggs", "caffenero", "eat.",
      "getir", "gopuff", "gorillas", "jiffy", "zapp", "dija",
      "toogoodtogo", "olio.com", "karma-app", "foodcloud"
    ],
    category: "food_delivery",
    confidence: "high",
  },
  {
    patterns: ["food", "delivery", "takeaway", "takeout", "restaurant", "order-food", "eat"],
    category: "food_delivery",
    confidence: "low",
  },

  // HOME SERVICES - High confidence
  {
    patterns: [
      "rightmove", "zoopla", "onthemarket", "openrent", "spareroom", "ideal-flatmate",
      "purplebricks", "yopa", "strike", "doorsteps", "foxtons", "savills", "knightfrank",
      "countrywide", "connells", "bairstow-eves", "winkworth", "marsh-parsons",
      "checkatrade", "trustatrader", "mybuilder", "ratedpeople", "bark.com",
      "taskrabbit", "airtasker", "hassle.com", "housekeep", "handy.com",
      "fantastic-services", "molly-maid", "ovenu", "oven-wizards",
      "british-gas-homecare", "homeserve", "247-home-rescue", "checkatrade",
      "locksmith", "plumber", "electrician", "boiler", "heating"
    ],
    category: "home_services",
    confidence: "high",
  },
  {
    patterns: ["property", "estate", "letting", "rental", "tenant", "landlord", "moving", "removals"],
    category: "home_services",
    confidence: "medium",
  },

  // AUTOMOTIVE - High confidence
  {
    patterns: [
      "autotrader", "auto-trader", "motors.co", "carwow", "cazoo", "cinch", "cargurus",
      "webuyanycar", "we-buy-any-car", "motorpoint", "arnold-clark", "evans-halshaw",
      "halfords", "kwik-fit", "national-tyres", "ats-euromaster", "formula-one-autocentres",
      "greenflag", "rac.co", "aa.com", "theaa",
      "tesla", "bmw.co", "mercedes-benz", "audi.co", "volkswagen", "ford.co", "vauxhall",
      "toyota.co", "honda.co", "nissan.co", "hyundai.co", "kia.co", "mazda", "volvo",
      "peugeot", "citroen", "renault", "seat.co", "skoda", "fiat", "jeep", "land-rover",
      "jaguar", "porsche", "ferrari", "lamborghini", "bentley", "rolls-royce", "aston-martin",
      "vantage-leasing", "nationwide-vehicle", "lex-autolease", "arval", "alphabet",
      "uber.com", "bolt.eu", "freenow", "kapten", "ola.co", "lyft"
    ],
    category: "automotive",
    confidence: "high",
  },
  {
    patterns: ["car", "vehicle", "motor", "auto", "driving", "lease", "garage", "mot", "service"],
    category: "automotive",
    confidence: "low",
  },

  // HEALTHCARE - High confidence
  {
    patterns: [
      "nhs.uk", "patient-access", "myGP", "doctorlink", "econsult", "askmygp",
      "babylon", "pushdoctor", "push-doctor", "livi.co", "kry.se", "gp-at-hand",
      "boots-opticians", "specsavers", "vision-express", "optical-express",
      "mydentist", "dentalcare", "bupa-dental", "dentex",
      "superdrug-health", "lloydspharmacy", "lloyds-pharmacy", "well-pharmacy",
      "pharmacy2u", "chemist-direct", "chemist-4-u", "simplymedsuk",
      "pharmacy-online", "doctorfox", "treated.com", "zava", "superdrug-online-doctor",
      "medicspot", "thriva", "letsgetchecked", "hurdle", "qured"
    ],
    category: "healthcare",
    confidence: "high",
  },
  {
    patterns: ["health", "medical", "doctor", "gp", "pharmacy", "prescription", "clinic", "dental", "optician"],
    category: "healthcare",
    confidence: "medium",
  },

  // FITNESS - High confidence
  {
    patterns: [
      "puregym", "pure-gym", "thegym", "the-gym", "davidlloyd", "david-lloyd", "nuffield",
      "virgin-active", "bannatyne", "anytime-fitness", "fitness-first", "jd-gyms",
      "classpass", "hussle", "payasugym", "move-gb", "gympass",
      "peloton", "zwift", "strava", "runkeeper", "mapmyrun", "nike-run", "garmin-connect",
      "myfitnesspal", "noom", "weightwatchers", "weight-watchers", "slimming-world",
      "fiit", "les-mills", "beachbody", "apple-fitness", "fitbit-premium",
      "freeletics", "centr", "kayla-itsines", "joe-wicks", "yoga-with-adriene"
    ],
    category: "fitness",
    confidence: "high",
  },
  {
    patterns: ["gym", "fitness", "workout", "exercise", "training", "yoga", "pilates", "running"],
    category: "fitness",
    confidence: "medium",
  },

  // EDUCATION - High confidence
  {
    patterns: [
      "udemy", "coursera", "edx.org", "skillshare", "masterclass", "linkedin-learning",
      "pluralsight", "treehouse", "codecademy", "datacamp", "brilliant.org",
      "futurelearn", "open-university", "openlearn", "alison.com", "khan-academy",
      "duolingo", "babbel", "rosetta-stone", "busuu", "memrise", "italki",
      "chegg", "bartleby", "course-hero", "studocu", "quizlet", "brainly",
      "tutorful", "superprof", "mytutor", "explore-learning",
      "ucas.com", "whatuni", "studentroom", "save-the-student", "unidays"
    ],
    category: "education",
    confidence: "high",
  },
  {
    patterns: ["learn", "course", "tutor", "study", "education", "university", "school", "training"],
    category: "education",
    confidence: "low",
  },

  // GAMING - High confidence
  {
    patterns: [
      "steam", "epicgames", "epic-games", "gog.com", "origin.com", "ubisoft", "blizzard",
      "playstation", "xbox.com", "nintendo", "gamestop", "game.co", "smyths",
      "twitch", "discord.com", "humble-bundle", "g2a.com", "cdkeys", "greenmangaming",
      "ea.com", "activision", "riotgames", "rockstargames",
      "roblox", "minecraft", "fortnite", "callofduty", "fifa.com",
      "gamepass", "ps-plus", "nintendo-switch-online", "geforce-now", "stadia",
      "bet365", "williamhill", "ladbrokes", "coral", "paddy-power", "betfair",
      "sky-bet", "betway", "888", "unibet", "bwin", "betfred"
    ],
    category: "gaming",
    confidence: "high",
  },
  {
    patterns: ["game", "gaming", "play", "esports", "bet", "casino", "gambling"],
    category: "gaming",
    confidence: "medium",
  },
]

// Comprehensive consumer rights per category
const CONTEXT_RIGHTS: Record<SiteCategory, ContextRight[]> = {
  retail: [
    {
      title: "30-Day Refund Right",
      summary: "Full refund within 30 days for faulty goods - no repair/replacement required first",
      law: "Consumer Rights Act 2015 s.22",
      actionTip: "Simply return the item and state you're rejecting it under CRA 2015",
      compensation: "Full purchase price"
    },
    {
      title: "Satisfactory Quality",
      summary: "Products must be free from defects, safe, durable, and as described",
      law: "Consumer Rights Act 2015 s.9-11",
      actionTip: "Document the fault with photos/video before contacting seller"
    },
    {
      title: "6-Month Repair Window",
      summary: "If fault appears within 6 months, it's assumed to have been there at purchase",
      law: "Consumer Rights Act 2015 s.19",
      actionTip: "Burden of proof is on retailer to show the fault wasn't present"
    },
    {
      title: "14-Day Cooling Off",
      summary: "Cancel online purchases within 14 days for any reason - no questions asked",
      law: "Consumer Contracts Regulations 2013",
      actionTip: "Send written cancellation notice and return within 14 days of receipt"
    },
    {
      title: "Delivery Rights",
      summary: "If no delivery date agreed, must arrive within 30 days",
      law: "Consumer Rights Act 2015 s.28",
      actionTip: "If late, you can set a new deadline and cancel if missed"
    },
  ],
  telecom: [
    {
      title: "Contract Exit for Changes",
      summary: "Cancel without penalty if provider changes terms to your disadvantage",
      law: "Ofcom General Conditions C1",
      actionTip: "Write within 30 days of being notified of the change",
      compensation: "Exit without early termination fee"
    },
    {
      title: "Speed Guarantee",
      summary: "Broadband must meet minimum guaranteed speed or you can exit",
      law: "Ofcom Voluntary Codes of Practice",
      actionTip: "Run speed tests at different times and keep records"
    },
    {
      title: "Bill Shock Protection",
      summary: "Usage caps and notifications required before extra charges apply",
      law: "Ofcom General Conditions",
      actionTip: "Check your contract for spending cap terms"
    },
    {
      title: "Ombudsman Escalation",
      summary: "Free dispute resolution after 8 weeks or deadlock letter",
      law: "Alternative Dispute Resolution Regulations",
      actionTip: "Request deadlock letter if complaint unresolved",
      compensation: "Up to £10,000 through CISAS or Ombudsman Services"
    },
    {
      title: "Switching Rights",
      summary: "New provider handles switch, can't be charged by old provider during switch",
      law: "Ofcom Switching Rules",
      actionTip: "Only contact new provider - they manage the process"
    },
  ],
  travel: [
    {
      title: "Flight Delay Compensation",
      summary: "£220-£520 for delays over 3 hours depending on distance",
      law: "UK261 (retained EU Regulation 261/2004)",
      actionTip: "Claim directly from airline within 6 years",
      compensation: "£220 (short), £350 (medium), £520 (long haul)"
    },
    {
      title: "Denied Boarding",
      summary: "Same compensation as delays plus next available flight/full refund",
      law: "UK261 Article 7",
      actionTip: "Don't accept vouchers - insist on cash compensation",
      compensation: "Up to £520 plus meals/accommodation"
    },
    {
      title: "Cancellation Rights",
      summary: "Full refund within 7 days for cancelled flights",
      law: "UK261 Article 8",
      actionTip: "Refund to original payment method, not vouchers"
    },
    {
      title: "Package Holiday Protection",
      summary: "Full refund for significant changes or cancellations, protected if provider fails",
      law: "Package Travel Regulations 2018",
      actionTip: "ATOL/ABTA protection applies - check your booking confirmation"
    },
    {
      title: "Lost Luggage",
      summary: "Claim up to ~£1,300 for delayed, damaged, or lost baggage",
      law: "Montreal Convention",
      actionTip: "Report at airport and keep receipts for essential purchases",
      compensation: "Up to 1,288 SDR (~£1,300)"
    },
  ],
  utilities: [
    {
      title: "Cannot Disconnect During Dispute",
      summary: "Energy company cannot cut supply while you're actively disputing a bill",
      law: "Ofgem Standards of Conduct",
      actionTip: "Put dispute in writing and keep paying undisputed amount"
    },
    {
      title: "Back-Billing Limit",
      summary: "Cannot be charged for energy used more than 12 months ago",
      law: "Ofgem Back-Billing Principle",
      actionTip: "Challenge any bill covering period over 12 months old",
      compensation: "Write off of charges older than 12 months"
    },
    {
      title: "Prepayment Meter Protection",
      summary: "Force-fitting prepayment meters now heavily restricted",
      law: "Ofgem Supplier Licence Conditions",
      actionTip: "Complain if threatened with forced prepayment installation"
    },
    {
      title: "Switching Rights",
      summary: "Switch within 21 days, no exit fees on standard variable tariff",
      law: "Ofgem Supplier Licensing",
      actionTip: "Use switching sites to compare - process takes up to 21 days"
    },
    {
      title: "Guaranteed Standards",
      summary: "Automatic compensation for supply failures, missed appointments",
      law: "Guaranteed Standards of Performance",
      actionTip: "Claim within 3 months of incident",
      compensation: "£30-£150 depending on failure type"
    },
  ],
  finance: [
    {
      title: "Section 75 Protection",
      summary: "Credit card company equally liable for purchases £100-£30,000",
      law: "Consumer Credit Act 1974 s.75",
      actionTip: "Claim from card issuer if retailer won't help - even for part payment",
      compensation: "Full refund plus compensation possible"
    },
    {
      title: "Chargeback Rights",
      summary: "Dispute transactions for goods/services not received or not as described",
      law: "Card Scheme Rules (Visa/Mastercard)",
      actionTip: "Contact bank within 120 days of transaction"
    },
    {
      title: "Unfair Overdraft Charges",
      summary: "Challenge disproportionate charges on bank accounts",
      law: "FCA CONC Rules",
      actionTip: "Request refund of charges if they caused financial hardship"
    },
    {
      title: "Financial Ombudsman",
      summary: "Free dispute resolution - binding decisions up to £415,000",
      law: "FCA Handbook DISP",
      actionTip: "Wait 8 weeks or get deadlock letter, then escalate free",
      compensation: "Up to £415,000 (from April 2024)"
    },
    {
      title: "Right to Close Account",
      summary: "Banks must allow you to close accounts and switch freely",
      law: "Current Account Switch Service",
      actionTip: "7-day switching guarantee with automatic redirect"
    },
  ],
  insurance: [
    {
      title: "14-Day Cooling Off",
      summary: "Cancel any insurance policy within 14 days for full refund",
      law: "Insurance: Conduct of Business Sourcebook",
      actionTip: "Applies from policy start or document receipt, whichever is later"
    },
    {
      title: "Fair Claims Handling",
      summary: "Insurers must handle claims promptly and fairly",
      law: "FCA Insurance Conduct of Business",
      actionTip: "Keep all communication records and get decisions in writing"
    },
    {
      title: "Automatic Renewal Notice",
      summary: "Must be told about auto-renewal and last year's premium before renewal",
      law: "FCA General Insurance Pricing Practices",
      actionTip: "Compare quotes before renewal - loyalty penalty banned"
    },
    {
      title: "Financial Ombudsman",
      summary: "Free escalation if complaint unresolved after 8 weeks",
      law: "FCA DISP Rules",
      actionTip: "FOS decisions are binding on insurer",
      compensation: "Up to £415,000"
    },
    {
      title: "Reasonable Excesses",
      summary: "Excess charges must be clear and not excessive",
      law: "Consumer Rights Act 2015",
      actionTip: "Challenge if excess seems disproportionate to risk"
    },
  ],
  streaming: [
    {
      title: "14-Day Cooling Off",
      summary: "Cancel within 14 days of signing up for digital subscriptions",
      law: "Consumer Contracts Regulations 2013",
      actionTip: "Note: May not apply if you started streaming immediately"
    },
    {
      title: "Cancel Anytime",
      summary: "Can cancel subscriptions at any time - access until period ends",
      law: "Consumer Rights Act 2015",
      actionTip: "Check account settings for cancellation option"
    },
    {
      title: "Auto-Renewal Notice",
      summary: "Must be notified before subscription auto-renews",
      law: "Consumer Contracts Regulations 2013",
      actionTip: "Set calendar reminder before renewal date"
    },
    {
      title: "Price Change Notice",
      summary: "Must be told of price increases before they apply",
      law: "Consumer Rights Act 2015",
      actionTip: "Can cancel without penalty if price increases"
    },
    {
      title: "Service as Described",
      summary: "Content and quality must match what was advertised",
      law: "Consumer Rights Act 2015 s.49",
      actionTip: "Document missing features or quality issues"
    },
  ],
  subscriptions: [
    {
      title: "14-Day Cooling Off",
      summary: "Cancel within 14 days of subscription start",
      law: "Consumer Contracts Regulations 2013",
      actionTip: "Request refund for any payment made"
    },
    {
      title: "Clear Pricing",
      summary: "Full cost including renewals must be clearly displayed",
      law: "Consumer Protection from Unfair Trading Regulations",
      actionTip: "Challenge if hidden fees weren't disclosed"
    },
    {
      title: "Easy Cancellation",
      summary: "Must be as easy to cancel as it was to sign up",
      law: "FTC Click-to-Cancel Rule / UK Equivalent Practice",
      actionTip: "If cancellation is difficult, complain to Trading Standards"
    },
    {
      title: "Free Trial Transparency",
      summary: "Free trials must clearly state when charges begin",
      law: "Consumer Protection Regulations",
      actionTip: "Screenshot terms before signing up"
    },
    {
      title: "Subscription Box Returns",
      summary: "Physical subscription items have 14-day return right",
      law: "Consumer Contracts Regulations 2013",
      actionTip: "Return unused items for refund"
    },
  ],
  food_delivery: [
    {
      title: "Food Safety Standards",
      summary: "Food must be safe, as described, and at correct temperature",
      law: "Food Safety Act 1990",
      actionTip: "Report food safety issues to local council"
    },
    {
      title: "Refund for Missing Items",
      summary: "Full refund for items not delivered or substantially wrong",
      law: "Consumer Rights Act 2015",
      actionTip: "Report in app immediately and request refund"
    },
    {
      title: "Late Delivery",
      summary: "Entitled to refund if delivery significantly later than estimated",
      law: "Consumer Rights Act 2015",
      actionTip: "Screenshot the original delivery estimate"
    },
    {
      title: "Allergen Information",
      summary: "Restaurants must provide accurate allergen information",
      law: "Food Information Regulations 2014",
      actionTip: "Report allergen errors to Food Standards Agency"
    },
    {
      title: "Driver Issues",
      summary: "Platform responsible for service even if using contractors",
      law: "Consumer Rights Act 2015",
      actionTip: "Complain to platform, not just restaurant"
    },
  ],
  home_services: [
    {
      title: "Reasonable Care & Skill",
      summary: "Tradespeople must carry out work to reasonable standard",
      law: "Consumer Rights Act 2015 s.49",
      actionTip: "Get quotes in writing and photograph work progress"
    },
    {
      title: "Price Agreement",
      summary: "If no price agreed, must be reasonable. Binding quotes can't change",
      law: "Consumer Rights Act 2015 s.51",
      actionTip: "Get written quote (fixed) not estimate (can change)"
    },
    {
      title: "Cooling Off for Doorstep Sales",
      summary: "14-day cancellation for unsolicited home visits",
      law: "Consumer Contracts Regulations 2013",
      actionTip: "Applies if trader visited without appointment"
    },
    {
      title: "Deposit Protection",
      summary: "Rental deposits must be in government-backed scheme",
      law: "Housing Act 2004",
      actionTip: "Landlord must protect within 30 days and give prescribed info",
      compensation: "1-3x deposit if not protected"
    },
    {
      title: "Agency Fees Banned",
      summary: "Letting agents cannot charge tenants fees (viewing, admin, etc.)",
      law: "Tenant Fees Act 2019",
      actionTip: "Report banned fees to Trading Standards"
    },
  ],
  automotive: [
    {
      title: "30-Day Rejection Right",
      summary: "Reject faulty vehicle within 30 days for full refund",
      law: "Consumer Rights Act 2015 s.22",
      actionTip: "Document fault immediately and notify dealer in writing"
    },
    {
      title: "6-Month Repair Right",
      summary: "Faults within 6 months assumed to be there at purchase",
      law: "Consumer Rights Act 2015",
      actionTip: "Dealer must prove fault wasn't present, not you"
    },
    {
      title: "Service as Described",
      summary: "MOT, repairs, servicing must be done with reasonable skill",
      law: "Consumer Rights Act 2015 s.49",
      actionTip: "Get itemised invoice and photos of work done"
    },
    {
      title: "Finance Agreement Rights",
      summary: "Voluntary termination after paying half of total amount",
      law: "Consumer Credit Act 1974 s.99-100",
      actionTip: "Can hand back car with nothing more to pay after 50%"
    },
    {
      title: "Mileage & History",
      summary: "Clocked mileage or hidden history is fraud",
      law: "Consumer Protection from Unfair Trading Regulations",
      actionTip: "Check HPI history and report clocking to Trading Standards"
    },
  ],
  healthcare: [
    {
      title: "Prescription Rights",
      summary: "Free prescriptions in Scotland, Wales, NI. Prepayment options in England",
      law: "NHS Regulations",
      actionTip: "Check if you qualify for free prescriptions or get PPC"
    },
    {
      title: "NHS Complaint Process",
      summary: "Formal complaints procedure with escalation to Ombudsman",
      law: "NHS Constitution",
      actionTip: "Complain within 12 months, escalate to PHSO if unresolved"
    },
    {
      title: "Access to Records",
      summary: "Right to see your medical records within 1 month",
      law: "UK GDPR / Data Protection Act 2018",
      actionTip: "Submit Subject Access Request to practice/hospital"
    },
    {
      title: "Private Healthcare Refund",
      summary: "Unsatisfactory treatment from private providers can be refunded",
      law: "Consumer Rights Act 2015",
      actionTip: "Document concerns and complain formally"
    },
    {
      title: "Dental Banding",
      summary: "NHS dental charges are banded - cannot be charged more than band rate",
      law: "NHS Dental Regulations",
      actionTip: "Check band before treatment and get treatment plan"
    },
  ],
  fitness: [
    {
      title: "14-Day Cooling Off",
      summary: "Cancel gym membership within 14 days of joining online",
      law: "Consumer Contracts Regulations 2013",
      actionTip: "Applies to online sign-ups even for physical gym"
    },
    {
      title: "Reasonable Notice Period",
      summary: "Cancellation terms must be fair and clearly stated",
      law: "Consumer Rights Act 2015 - Unfair Terms",
      actionTip: "Challenge excessive notice periods (over 1 month)"
    },
    {
      title: "Freeze for Medical",
      summary: "Most gyms allow freeze or cancellation for medical reasons",
      law: "Common Industry Practice + Unfair Terms",
      actionTip: "Provide doctor's note and request freeze"
    },
    {
      title: "Service as Described",
      summary: "Facilities must match what was advertised/promised",
      law: "Consumer Rights Act 2015",
      actionTip: "Document closed facilities and request fee reduction"
    },
    {
      title: "Direct Debit Protection",
      summary: "Banks must refund under Direct Debit Guarantee if error",
      law: "Direct Debit Guarantee",
      actionTip: "Contact bank if gym takes wrong amount"
    },
  ],
  education: [
    {
      title: "14-Day Cooling Off",
      summary: "Cancel online courses within 14 days of purchase",
      law: "Consumer Contracts Regulations 2013",
      actionTip: "Note: May not apply if you accessed significant content"
    },
    {
      title: "Course as Described",
      summary: "Course content and quality must match description",
      law: "Consumer Rights Act 2015",
      actionTip: "Screenshot course promises and compare to reality"
    },
    {
      title: "Accreditation Accuracy",
      summary: "Qualifications and accreditations must be genuine",
      law: "Consumer Protection Regulations",
      actionTip: "Verify accreditation with awarding body"
    },
    {
      title: "Student Complaints",
      summary: "Universities have formal complaints and OIA escalation",
      law: "Higher Education Act",
      actionTip: "Escalate to OIA after internal process exhausted"
    },
    {
      title: "Refund for Cancellation",
      summary: "Provider must refund if they cancel course",
      law: "Consumer Rights Act 2015",
      actionTip: "Entitled to full refund plus any additional losses"
    },
  ],
  gaming: [
    {
      title: "14-Day Cooling Off",
      summary: "Cancel digital game purchases within 14 days if not downloaded/played",
      law: "Consumer Contracts Regulations 2013",
      actionTip: "Waived if you consent to immediate access"
    },
    {
      title: "Defective Digital Content",
      summary: "Games must work as described without game-breaking bugs",
      law: "Consumer Rights Act 2015 s.34",
      actionTip: "Document bugs and request repair (patch) or refund"
    },
    {
      title: "Platform Refund Policies",
      summary: "Steam: 2hrs/14days. Xbox/PS/Nintendo have similar policies",
      law: "Platform Terms (enhanced by CRA 2015)",
      actionTip: "Use platform refund system for fastest resolution"
    },
    {
      title: "Gambling Self-Exclusion",
      summary: "Right to self-exclude from gambling sites",
      law: "Gambling Commission LCCP",
      actionTip: "Use GAMSTOP for UK-wide self-exclusion"
    },
    {
      title: "Loot Box Disclosure",
      summary: "Probability of items must be disclosed",
      law: "Consumer Protection Regulations / Industry Codes",
      actionTip: "Report misleading odds to ASA"
    },
  ],
  general: [
    {
      title: "Satisfactory Quality",
      summary: "All goods must be of satisfactory quality and as described",
      law: "Consumer Rights Act 2015 s.9-11",
      actionTip: "Document issues and contact seller in writing"
    },
    {
      title: "14-Day Cooling Off",
      summary: "Online purchases can be cancelled within 14 days",
      law: "Consumer Contracts Regulations 2013",
      actionTip: "Send written cancellation notice"
    },
    {
      title: "Unfair Contract Terms",
      summary: "Unfair terms in consumer contracts are not binding",
      law: "Consumer Rights Act 2015 Part 2",
      actionTip: "Challenge terms that create significant imbalance"
    },
    {
      title: "Reasonable Service",
      summary: "Services must be performed with reasonable care and skill",
      law: "Consumer Rights Act 2015 s.49",
      actionTip: "Document the service and any shortcomings"
    },
    {
      title: "Data Protection Rights",
      summary: "Access, correct, or delete your personal data",
      law: "UK GDPR / Data Protection Act 2018",
      actionTip: "Submit SAR within 1 month response time"
    },
  ],
}

function detectCategory(domain: string | null): CategoryMatch {
  if (!domain) return { category: "general", matchedPattern: "", confidence: "low" }

  const lowerDomain = domain.toLowerCase()

  for (const { patterns, category, confidence } of DOMAIN_PATTERNS) {
    for (const pattern of patterns) {
      if (lowerDomain.includes(pattern)) {
        return { category, matchedPattern: pattern, confidence }
      }
    }
  }

  return { category: "general", matchedPattern: "", confidence: "low" }
}

const CATEGORY_LABELS: Record<SiteCategory, string> = {
  retail: "Retail & Shopping",
  telecom: "Telecom & Broadband",
  travel: "Travel & Airlines",
  utilities: "Energy & Utilities",
  finance: "Banking & Finance",
  insurance: "Insurance",
  streaming: "Streaming & Media",
  subscriptions: "Subscriptions",
  food_delivery: "Food & Delivery",
  home_services: "Property & Home",
  automotive: "Automotive",
  healthcare: "Healthcare",
  fitness: "Fitness & Wellness",
  education: "Education & Learning",
  gaming: "Gaming & Gambling",
  general: "General Consumer",
}

const CATEGORY_ICONS: Record<SiteCategory, string> = {
  retail: "🛒",
  telecom: "📱",
  travel: "✈️",
  utilities: "⚡",
  finance: "🏦",
  insurance: "🛡️",
  streaming: "📺",
  subscriptions: "📦",
  food_delivery: "🍔",
  home_services: "🏠",
  automotive: "🚗",
  healthcare: "🏥",
  fitness: "💪",
  education: "📚",
  gaming: "🎮",
  general: "📋",
}

export function LegalReferencePanel({ domain }: LegalReferencePanelProps) {
  const [query, setQuery] = useState("")
  const [references, setReferences] = useState<LegalReference[]>([])
  const [companyIntel, setCompanyIntel] = useState<CompanyIntel | null>(null)
  const [loading, setLoading] = useState(false)
  const [companyLoading, setCompanyLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedRights, setExpandedRights] = useState<Set<number>>(new Set())

  // Detect site category based on domain
  const categoryMatch = useMemo(() => detectCategory(domain), [domain])
  const contextRights = CONTEXT_RIGHTS[categoryMatch.category]
  const categoryLabel = CATEGORY_LABELS[categoryMatch.category]
  const categoryIcon = CATEGORY_ICONS[categoryMatch.category]

  const toggleRightExpanded = (index: number) => {
    setExpandedRights(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const getConfidenceColor = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return "bg-green-100 text-green-700 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getConfidenceLabel = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return "Exact match"
      case "medium":
        return "Likely match"
      case "low":
        return "Best guess"
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const result = await api.searchLegal(query)
      setReferences(result.references || [])
    } catch (err) {
      setError("Failed to search legal references")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFetchCompanyIntel = async () => {
    if (!domain) return

    setCompanyLoading(true)

    try {
      const intel = await api.getCompanyIntel(domain)
      setCompanyIntel(intel)
    } catch (err) {
      console.error("Failed to fetch company intel:", err)
    } finally {
      setCompanyLoading(false)
    }
  }

  const getRelevanceColor = (relevance: LegalReference["relevance"]) => {
    switch (relevance) {
      case "high":
        return "bg-coral-100 text-coral-700 border-coral-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Category Detection Badge */}
      <div className="bg-gradient-to-r from-coral-50 to-lavender-50 border border-coral-100 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryIcon}</span>
            <span className="font-semibold text-forest-900">{categoryLabel}</span>
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getConfidenceColor(categoryMatch.confidence)}`}>
            {getConfidenceLabel(categoryMatch.confidence)}
          </span>
        </div>
        {categoryMatch.matchedPattern && (
          <div className="flex items-center gap-1.5 text-[10px] text-forest-500">
            <Tag className="w-3 h-3" />
            <span>Detected from: <span className="font-mono bg-white/50 px-1 rounded">{categoryMatch.matchedPattern}</span></span>
          </div>
        )}
        {domain && (
          <p className="text-[10px] text-forest-400 mt-1 truncate">
            on {domain}
          </p>
        )}
      </div>

      {/* Context-Aware Rights */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-coral-500" />
            <label className="text-xs font-medium text-forest-500 uppercase tracking-wide">
              Your Rights ({contextRights.length})
            </label>
          </div>
          <span className="text-[10px] text-forest-400">Tap to expand</span>
        </div>
        <div className="space-y-2">
          {contextRights.map((right, index) => {
            const isExpanded = expandedRights.has(index)
            return (
              <div
                key={index}
                className="bg-white border border-forest-100 rounded-lg overflow-hidden hover:border-coral-200 transition-colors cursor-pointer"
                onClick={() => toggleRightExpanded(index)}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <Scale className="w-4 h-4 text-coral-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-forest-900">{right.title}</p>
                        <p className="text-xs text-forest-600 mt-0.5">{right.summary}</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-forest-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-forest-400 shrink-0" />
                    )}
                  </div>

                  {/* Compensation badge (always visible if present) */}
                  {right.compensation && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      <span>💰</span>
                      {right.compensation}
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 border-t border-forest-50 bg-forest-50/30">
                    <div className="pt-2 space-y-2">
                      {/* Legal basis */}
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-medium text-forest-400 uppercase w-12 shrink-0">Law</span>
                        <span className="text-xs text-forest-700 font-medium">{right.law}</span>
                      </div>

                      {/* Action tip */}
                      {right.actionTip && (
                        <div className="flex items-start gap-2">
                          <span className="text-[10px] font-medium text-forest-400 uppercase w-12 shrink-0">Action</span>
                          <span className="text-xs text-forest-600">{right.actionTip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-forest-500 uppercase tracking-wide">
          Search More
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g., refund rights, faulty goods"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-forest-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-forest-500 hover:bg-forest-600 disabled:bg-forest-300 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Company Intel */}
      {domain && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-forest-500 uppercase tracking-wide">
              Company Intel
            </label>
            {!companyIntel && (
              <button
                onClick={handleFetchCompanyIntel}
                disabled={companyLoading}
                className="text-xs text-coral-500 hover:text-coral-600 font-medium"
              >
                {companyLoading ? "Loading..." : "Fetch Info"}
              </button>
            )}
          </div>

          {companyIntel ? (
            <div className="p-3 bg-white border border-forest-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-forest-500" />
                <span className="font-medium text-forest-900">{companyIntel.name}</span>
              </div>
              {companyIntel.complaint_channels.length > 0 && (
                <div className="text-xs text-forest-500">
                  <span className="font-medium">Complaint channels: </span>
                  {companyIntel.complaint_channels.join(", ")}
                </div>
              )}
              {companyIntel.response_time && (
                <div className="text-xs text-forest-500 mt-1">
                  <span className="font-medium">Avg response: </span>
                  {companyIntel.response_time}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-forest-50 border border-forest-100 rounded-lg text-xs text-forest-500 text-center">
              Click "Fetch Info" to get company details
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {references.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-forest-500 uppercase tracking-wide">
            Search Results ({references.length})
          </label>
          <div className="space-y-2">
            {references.map((ref, index) => (
              <div
                key={index}
                className="p-3 bg-white border border-forest-100 rounded-lg hover:border-forest-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-coral-500 shrink-0" />
                    <span className="font-medium text-sm text-forest-900">{ref.title}</span>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getRelevanceColor(
                      ref.relevance
                    )}`}
                  >
                    {ref.relevance}
                  </span>
                </div>
                <p className="text-xs text-forest-600 mb-2">{ref.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-forest-400">{ref.source}</span>
                  <button className="text-[10px] text-coral-500 hover:text-coral-600 font-medium flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Learn more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
