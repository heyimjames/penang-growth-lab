import {
  Calculator,
  Target,
  TrendingUp,
  DollarSign,
  BarChart3,
  PenTool,
  Zap,
  Users,
  ShoppingCart,
  LineChart,
  Percent,
  Clock,
  Mail,
  Link2,
  FlaskConical,
  Sparkles,
  Image,
  FileText,
  MessageSquare,
  Globe,
  type LucideIcon,
} from "lucide-react"

export interface Tool {
  id: string
  name: string
  description: string
  shortDescription: string
  href: string
  icon: LucideIcon
  category: ToolCategory
  isAI?: boolean
  isNew?: boolean
  isFeatured?: boolean
  comingSoon?: boolean
}

export type ToolCategory =
  | "calculators"
  | "ai-tools"
  | "analytics"
  | "creative"
  | "email"
  | "tracking"

export const toolCategoryInfo: Record<ToolCategory, { name: string; description: string }> = {
  calculators: {
    name: "Calculators",
    description: "Essential metrics and profitability calculators",
  },
  "ai-tools": {
    name: "AI Tools",
    description: "AI-powered content and analysis tools",
  },
  analytics: {
    name: "Analytics",
    description: "Performance analysis and benchmarking",
  },
  creative: {
    name: "Creative",
    description: "Ad creative and content tools",
  },
  email: {
    name: "Email",
    description: "Email marketing optimization",
  },
  tracking: {
    name: "Tracking",
    description: "Attribution and tracking tools",
  },
}

export const tools: Tool[] = [
  // CALCULATORS
  {
    id: "roas-calculator",
    name: "ROAS Calculator",
    description: "Calculate your Return on Ad Spend and understand if your campaigns are profitable. Input your revenue and ad spend to get instant ROAS metrics.",
    shortDescription: "Calculate return on ad spend",
    href: "/tools/roas-calculator",
    icon: Calculator,
    category: "calculators",
    isFeatured: true,
  },
  {
    id: "break-even-roas",
    name: "Break-Even ROAS Calculator",
    description: "Determine the minimum ROAS you need to break even based on your profit margins. Essential for setting campaign targets.",
    shortDescription: "Find your minimum profitable ROAS",
    href: "/tools/break-even-roas",
    icon: Target,
    category: "calculators",
    isFeatured: true,
  },
  {
    id: "profit-margin-calculator",
    name: "Profit Margin Calculator",
    description: "Calculate gross and net profit margins for your products. Understand your true profitability after all costs.",
    shortDescription: "Calculate gross & net margins",
    href: "/tools/profit-margin-calculator",
    icon: Percent,
    category: "calculators",
  },
  {
    id: "cpm-cpc-calculator",
    name: "CPM/CPC/CTR Calculator",
    description: "Calculate Cost Per Mille, Cost Per Click, Click-Through Rate, and other essential ad metrics from your campaign data.",
    shortDescription: "Calculate key ad metrics",
    href: "/tools/cpm-cpc-calculator",
    icon: BarChart3,
    category: "calculators",
  },
  {
    id: "ltv-calculator",
    name: "Customer LTV Calculator",
    description: "Calculate Customer Lifetime Value to understand how much you can spend to acquire customers profitably.",
    shortDescription: "Calculate customer lifetime value",
    href: "/tools/ltv-calculator",
    icon: Users,
    category: "calculators",
  },
  {
    id: "cac-calculator",
    name: "CAC Calculator",
    description: "Calculate your Customer Acquisition Cost and LTV:CAC ratio to ensure sustainable growth.",
    shortDescription: "Calculate acquisition cost",
    href: "/tools/cac-calculator",
    icon: DollarSign,
    category: "calculators",
  },
  {
    id: "ad-budget-planner",
    name: "Ad Budget Planner",
    description: "Plan your advertising budget based on revenue goals, target ROAS, and historical performance data.",
    shortDescription: "Plan your ad spend",
    href: "/tools/ad-budget-planner",
    icon: TrendingUp,
    category: "calculators",
  },
  {
    id: "mer-calculator",
    name: "MER Calculator",
    description: "Calculate your Marketing Efficiency Ratio (Total Revenue / Total Marketing Spend) for a holistic view of marketing performance.",
    shortDescription: "Marketing efficiency ratio",
    href: "/tools/mer-calculator",
    icon: LineChart,
    category: "calculators",
  },
  {
    id: "contribution-margin",
    name: "Contribution Margin Calculator",
    description: "Calculate contribution margin per unit and total to understand which products drive the most profit.",
    shortDescription: "Calculate contribution margin",
    href: "/tools/contribution-margin",
    icon: ShoppingCart,
    category: "calculators",
  },

  // AI TOOLS
  {
    id: "ad-copy-generator",
    name: "AI Ad Copy Generator",
    description: "Generate high-converting ad copy for Meta and Google Ads. Input your product details and get multiple variations instantly.",
    shortDescription: "Generate ad copy with AI",
    href: "/tools/ad-copy-generator",
    icon: PenTool,
    category: "ai-tools",
    isAI: true,
    isFeatured: true,
    isNew: true,
  },
  {
    id: "headline-generator",
    name: "AI Headline Generator",
    description: "Generate attention-grabbing headlines for ads, landing pages, and email subject lines using AI.",
    shortDescription: "Generate compelling headlines",
    href: "/tools/headline-generator",
    icon: Zap,
    category: "ai-tools",
    isAI: true,
  },
  {
    id: "product-description-writer",
    name: "AI Product Description Writer",
    description: "Generate compelling product descriptions that convert. Optimized for e-commerce product pages.",
    shortDescription: "Write product descriptions",
    href: "/tools/product-description-writer",
    icon: FileText,
    category: "ai-tools",
    isAI: true,
  },
  {
    id: "creative-brief-generator",
    name: "AI Creative Brief Generator",
    description: "Generate comprehensive creative briefs for your ad campaigns. Perfect for briefing designers and creative teams.",
    shortDescription: "Generate creative briefs",
    href: "/tools/creative-brief-generator",
    icon: Sparkles,
    category: "ai-tools",
    isAI: true,
  },
  {
    id: "ad-creative-analyzer",
    name: "AI Ad Creative Analyzer",
    description: "Upload your ad creative and get AI-powered feedback on what's working and what could be improved.",
    shortDescription: "Get AI feedback on creatives",
    href: "/tools/ad-creative-analyzer",
    icon: Image,
    category: "ai-tools",
    isAI: true,
    isNew: true,
  },
  {
    id: "landing-page-analyzer",
    name: "AI Landing Page Analyzer",
    description: "Analyze your landing page for conversion optimization. Get actionable recommendations to improve performance.",
    shortDescription: "Analyze landing pages",
    href: "/tools/landing-page-analyzer",
    icon: Globe,
    category: "ai-tools",
    isAI: true,
  },
  {
    id: "copywriting-assistant",
    name: "AI Copywriting Assistant",
    description: "Generate high-converting copy for ads, emails, landing pages, and more. Trained on proven direct response frameworks.",
    shortDescription: "Generate marketing copy",
    href: "/tools/copywriting-assistant",
    icon: PenTool,
    category: "ai-tools",
    isAI: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "competitor-ad-analyzer",
    name: "Competitor Ad Research Guide",
    description: "Learn how to research and analyze your competitors' ads using Meta Ad Library and other tools.",
    shortDescription: "Research competitor ads",
    href: "/tools/competitor-ad-analyzer",
    icon: Target,
    category: "ai-tools",
  },

  // EMAIL TOOLS
  {
    id: "email-subject-generator",
    name: "AI Email Subject Line Generator",
    description: "Generate high-open-rate email subject lines for your campaigns. Optimized for e-commerce and DTC brands.",
    shortDescription: "Generate email subjects",
    href: "/tools/email-subject-generator",
    icon: Mail,
    category: "email",
    isAI: true,
  },
  {
    id: "email-flow-planner",
    name: "Email Flow Planner",
    description: "Plan your email automation flows. Templates for welcome series, abandoned cart, post-purchase, and winback campaigns.",
    shortDescription: "Plan email automations",
    href: "/tools/email-flow-planner",
    icon: MessageSquare,
    category: "email",
  },

  // TRACKING TOOLS
  {
    id: "utm-builder",
    name: "UTM Builder",
    description: "Build UTM tracking URLs for your campaigns. Ensure accurate attribution across all marketing channels.",
    shortDescription: "Build tracking URLs",
    href: "/tools/utm-builder",
    icon: Link2,
    category: "tracking",
  },
  {
    id: "ab-test-calculator",
    name: "A/B Test Calculator",
    description: "Calculate statistical significance for your A/B tests. Know when you have enough data to make decisions.",
    shortDescription: "Calculate test significance",
    href: "/tools/ab-test-calculator",
    icon: FlaskConical,
    category: "tracking",
  },
  {
    id: "attribution-guide",
    name: "Attribution Model Guide",
    description: "Understand different attribution models and choose the right one for your business. First-click, last-click, data-driven, and more.",
    shortDescription: "Understand attribution",
    href: "/tools/attribution-guide",
    icon: BarChart3,
    category: "tracking",
  },

  // ANALYTICS
  {
    id: "scaling-readiness-quiz",
    name: "Scaling Readiness Quiz",
    description: "Take this quiz to assess if your brand is ready to scale paid advertising. Get personalized recommendations.",
    shortDescription: "Assess scaling readiness",
    href: "/tools/scaling-readiness-quiz",
    icon: TrendingUp,
    category: "analytics",
    isFeatured: true,
  },
  {
    id: "benchmark-comparison",
    name: "Industry Benchmarks",
    description: "Compare your metrics against industry benchmarks. See how your CPM, CPC, CTR, and ROAS stack up.",
    shortDescription: "Compare to benchmarks",
    href: "/tools/benchmark-comparison",
    icon: BarChart3,
    category: "analytics",
  },
  {
    id: "ad-fatigue-calculator",
    name: "Ad Fatigue Calculator",
    description: "Calculate when your ads will experience fatigue based on audience size and frequency. Plan creative refreshes.",
    shortDescription: "Predict ad fatigue",
    href: "/tools/ad-fatigue-calculator",
    icon: Clock,
    category: "analytics",
  },
]

export const featuredTools = tools.filter((tool) => tool.isFeatured)
export const aiTools = tools.filter((tool) => tool.isAI)
export const newTools = tools.filter((tool) => tool.isNew)

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category)
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id)
}

// Tool category info for navigation - array format for components
export const toolCategories = Object.entries(toolCategoryInfo).map(([id, info]) => ({
  id: id as ToolCategory,
  ...info,
}))

// Alias for backwards compatibility
export const toolCategoryList = toolCategories
