export type BlogCategory =
  | "rights-claims"
  | "success-stories"
  | "guides"
  | "news"
  | "travel"
  | "money-finance"
  | "housing"
  | "utilities"

export interface BlogAuthor {
  id: string
  name: string
  avatar?: string
  bio?: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  heroImage?: {
    src: string
    alt: string
    caption?: string
  }
  category: BlogCategory
  tags: string[]
  relatedTools: string[]
  author: BlogAuthor
  publishedAt: string
  updatedAt?: string
  featured: boolean
  readingTimeMinutes: number
}

export interface BlogCategoryMeta {
  id: BlogCategory
  name: string
  description: string
  color: string
}

export const blogCategories: Record<BlogCategory, BlogCategoryMeta> = {
  "rights-claims": {
    id: "rights-claims",
    name: "Rights & Claims",
    description: "Understand your legal rights and how to claim what you're owed.",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  "success-stories": {
    id: "success-stories",
    name: "Success Stories",
    description: "Real cases and wins from consumers who fought back.",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  guides: {
    id: "guides",
    name: "How-To Guides",
    description: "Step-by-step guides to resolve common consumer issues.",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  news: {
    id: "news",
    name: "News & Updates",
    description: "Latest changes in consumer law and company policies.",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  travel: {
    id: "travel",
    name: "Travel & Holidays",
    description: "Flight delays, holiday disasters, and your travel rights.",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  },
  "money-finance": {
    id: "money-finance",
    name: "Money & Finance",
    description: "Banks, credit cards, insurance, and financial disputes.",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  housing: {
    id: "housing",
    name: "Housing & Property",
    description: "Rental disputes, deposits, and property rights.",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  utilities: {
    id: "utilities",
    name: "Utilities & Bills",
    description: "Energy, broadband, mobile, and utility complaints.",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  },
}

export function getCategoryMeta(category: BlogCategory): BlogCategoryMeta {
  return blogCategories[category]
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
