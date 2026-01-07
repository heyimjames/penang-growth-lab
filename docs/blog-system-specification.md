# Blog System Specification

## Overview

A best-in-class blog system for NoReply, designed to educate consumers on their rights, drive tool usage, and convert readers into platform users. The blog serves as a content hub that complements the 23 free tools and the core case management platform.

---

## 1. Page Structure Diagrams

### 1.1 Blog Homepage (`/blog`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                            HEADER                                    │
│  [Logo]  Free Tools ▼   Glossary   Blog   [Log in]  [Start a Case]  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         HERO SECTION                                 │
│                                                                      │
│  Consumer Rights Insights                                            │
│  Expert guides, success stories, and practical advice to help you   │
│  stand up to companies and get what you deserve.                    │
│                                                                      │
│  [Search posts...]                              [Subscribe button]   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      FEATURED POST (Latest)                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                              │    │
│  │  [Featured Image - 16:9 aspect ratio]                       │    │
│  │                                                              │    │
│  ├─────────────────────────────────────────────────────────────┤    │
│  │  CATEGORY PILL    •    5 min read    •    Dec 28, 2024      │    │
│  │                                                              │    │
│  │  How to Get a Full Refund When Your Flight Is Cancelled     │    │
│  │                                                              │    │
│  │  Learn exactly what compensation you're owed under UK law   │    │
│  │  and EU261, plus a step-by-step guide to claiming it.       │    │
│  │                                                              │    │
│  │  [Read article →]                                           │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     CATEGORY FILTER PILLS                            │
│                                                                      │
│  [All]  [Rights & Claims]  [Success Stories]  [Guides]  [News]      │
│  [Travel]  [Money & Finance]  [Housing]  [Utilities]                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        POST GRID (3 columns)                         │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ [Thumbnail]  │  │ [Thumbnail]  │  │ [Thumbnail]  │              │
│  │              │  │              │  │              │              │
│  │ Category     │  │ Category     │  │ Category     │              │
│  │ Post Title   │  │ Post Title   │  │ Post Title   │              │
│  │ Excerpt...   │  │ Excerpt...   │  │ Excerpt...   │              │
│  │ 4 min • Date │  │ 6 min • Date │  │ 3 min • Date │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │     ...      │  │     ...      │  │     ...      │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│                      [Load more posts]                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    NEWSLETTER SIGNUP SECTION                         │
│                                                                      │
│  Stay informed on your consumer rights                              │
│  Weekly tips, law changes, and success stories.                     │
│                                                                      │
│  [Email input........................]  [Subscribe]                  │
│                                                                      │
│  Join 12,000+ subscribers. Unsubscribe anytime.                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           FOOTER                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Mobile Layout (Blog Homepage):**
```
┌─────────────────────────┐
│        HEADER           │
├─────────────────────────┤
│      HERO SECTION       │
│  (stacked, centered)    │
├─────────────────────────┤
│    FEATURED POST        │
│  (full width card)      │
├─────────────────────────┤
│   CATEGORY PILLS        │
│  (horizontal scroll)    │
├─────────────────────────┤
│  ┌───────────────────┐  │
│  │   Post Card 1     │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │   Post Card 2     │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │   Post Card 3     │  │
│  └───────────────────┘  │
│                         │
│   [Load more posts]     │
├─────────────────────────┤
│  NEWSLETTER SIGNUP      │
├─────────────────────────┤
│        FOOTER           │
└─────────────────────────┘
```

---

### 1.2 Blog Post Page (`/blog/[slug]`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                            HEADER                                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Blog                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       ARTICLE HEADER                                 │
│                                                                      │
│  CATEGORY PILL                                                       │
│                                                                      │
│  How to Get a Full Refund When Your Flight Is Cancelled             │
│                                                                      │
│  Published Dec 28, 2024  •  8 min read  •  Updated Jan 2, 2025      │
│                                                                      │
│  ┌────────┐                                                         │
│  │ Avatar │  Written by NoReply Team                                │
│  └────────┘                                                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [Hero Image - Full width, 16:9 aspect ratio]                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (Desktop)      │           ARTICLE CONTENT                 │
│                         │                                            │
│  TABLE OF CONTENTS      │  Introduction paragraph...                │
│  ─────────────────      │                                            │
│  • Introduction         │  ## Your Rights Under UK Law              │
│  • Your Rights          │                                            │
│  • Step-by-Step Guide   │  Body content with rich formatting...    │
│  • Common Pitfalls      │                                            │
│  • Related Tools        │  ┌────────────────────────────────────┐   │
│                         │  │      INLINE TOOL CTA BLOCK          │   │
│  ─────────────────      │  │                                      │   │
│                         │  │  💡 Calculate your compensation      │   │
│  SHARE                  │  │                                      │   │
│  [Twitter] [LinkedIn]   │  │  Use our free Flight Compensation   │   │
│  [Copy link]            │  │  Calculator to find out exactly     │   │
│                         │  │  what you're owed.                  │   │
│  ─────────────────      │  │                                      │   │
│                         │  │  [Calculate now →]                  │   │
│  TAGS                   │  └────────────────────────────────────┘   │
│  #flight-delays         │                                            │
│  #eu261                 │  More content...                          │
│  #compensation          │                                            │
│  #travel-rights         │  ┌────────────────────────────────────┐   │
│                         │  │    INLINE IMAGE (optional)          │   │
│                         │  │                                      │   │
│                         │  │  [Explanatory diagram/screenshot]   │   │
│                         │  │                                      │   │
│                         │  │  Caption: EU261 compensation tiers  │   │
│                         │  └────────────────────────────────────┘   │
│                         │                                            │
│                         │  ## Step-by-Step Guide                    │
│                         │                                            │
│                         │  1. Document everything...                │
│                         │  2. Contact the airline...                │
│                         │                                            │
│                         │  ┌────────────────────────────────────┐   │
│                         │  │    INLINE NEWSLETTER SIGNUP         │   │
│                         │  │                                      │   │
│                         │  │  📬 Get weekly rights tips           │   │
│                         │  │                                      │   │
│                         │  │  Join 12,000+ subscribers getting   │   │
│                         │  │  consumer rights advice.             │   │
│                         │  │                                      │   │
│                         │  │  [Email............] [Subscribe]    │   │
│                         │  └────────────────────────────────────┘   │
│                         │                                            │
│                         │  ## Common Pitfalls                       │
│                         │                                            │
│                         │  More content...                          │
└─────────────────────────┴───────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     AUTHOR BIO SECTION                               │
│                                                                      │
│  ┌────────────┐                                                     │
│  │   Avatar   │  NoReply Team                                       │
│  │            │  Consumer rights experts dedicated to helping       │
│  └────────────┘  you get what you deserve.                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    RELATED TOOLS SECTION                             │
│                                                                      │
│  Tools mentioned in this article                                    │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ Flight Comp Calc │  │ Consumer Rights  │  │ Refund Timeline  │  │
│  │ Calculate what   │  │ Check your full  │  │ Know exactly     │  │
│  │ you're owed...   │  │ rights...        │  │ when to expect...│  │
│  │ [Use tool →]     │  │ [Use tool →]     │  │ [Use tool →]     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    RELATED POSTS SECTION                             │
│                                                                      │
│  More articles you might like                                       │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   [Thumbnail]    │  │   [Thumbnail]    │  │   [Thumbnail]    │  │
│  │   Category       │  │   Category       │  │   Category       │  │
│  │   Post Title     │  │   Post Title     │  │   Post Title     │  │
│  │   5 min read     │  │   3 min read     │  │   7 min read     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         FINAL CTA                                    │
│                                                                      │
│  Ready to take action?                                              │
│                                                                      │
│  Start your free case and let us help you get the outcome           │
│  you deserve.                                                        │
│                                                                      │
│  [Start Your Free Case]                                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           FOOTER                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Mobile Layout (Blog Post):**
```
┌─────────────────────────┐
│        HEADER           │
├─────────────────────────┤
│  ← Back to Blog         │
├─────────────────────────┤
│  Category • 8 min read  │
│                         │
│  Article Title          │
│  (full width)           │
│                         │
│  Date • Author          │
├─────────────────────────┤
│     [Hero Image]        │
├─────────────────────────┤
│  JUMP TO: ▼             │
│  (Collapsible TOC)      │
├─────────────────────────┤
│                         │
│   ARTICLE CONTENT       │
│   (full width)          │
│                         │
│   Inline CTAs/Signups   │
│   (full width blocks)   │
│                         │
├─────────────────────────┤
│    SHARE BUTTONS        │
│   (horizontal row)      │
├─────────────────────────┤
│      AUTHOR BIO         │
├─────────────────────────┤
│    RELATED TOOLS        │
│  (horizontal scroll)    │
├─────────────────────────┤
│    RELATED POSTS        │
│  (vertical stack)       │
├─────────────────────────┤
│      FINAL CTA          │
├─────────────────────────┤
│        FOOTER           │
└─────────────────────────┘
```

---

### 1.3 Category Page (`/blog/category/[slug]`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                            HEADER                                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Blog                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      CATEGORY HEADER                                 │
│                                                                      │
│  [Category Icon]                                                    │
│                                                                      │
│  Travel & Holidays                                                  │
│                                                                      │
│  Expert guides on flight delays, holiday compensation,              │
│  and your travel rights.                                            │
│                                                                      │
│  24 articles                                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     RELATED TOOLS BAR                                │
│                                                                      │
│  Free tools for this topic:                                         │
│                                                                      │
│  [Flight Compensation Calculator]  [Holiday Compensation Calculator] │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        POST GRID                                     │
│                     (Same as blog homepage)                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           FOOTER                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component List

### 2.1 Navigation Components

| Component | File Path | Description |
|-----------|-----------|-------------|
| `BlogNavLink` | `components/blog/blog-nav-link.tsx` | "Blog" link for header navigation |
| `BlogFooterSection` | `components/footer.tsx` (update) | Blog link in footer Resources column |

### 2.2 Blog Homepage Components

| Component | File Path | Description |
|-----------|-----------|-------------|
| `BlogHero` | `components/blog/blog-hero.tsx` | Hero section with title, description, search, subscribe CTA |
| `FeaturedPost` | `components/blog/featured-post.tsx` | Large featured post card for latest/pinned article |
| `CategoryFilter` | `components/blog/category-filter.tsx` | Horizontal pill buttons to filter by category |
| `PostCard` | `components/blog/post-card.tsx` | Individual post preview card for grid |
| `PostGrid` | `components/blog/post-grid.tsx` | Responsive grid of PostCards with load more |
| `BlogSearch` | `components/blog/blog-search.tsx` | Search input with autocomplete |

### 2.3 Blog Post Components

| Component | File Path | Description |
|-----------|-----------|-------------|
| `ArticleHeader` | `components/blog/article-header.tsx` | Title, meta, author, date, reading time |
| `ArticleHeroImage` | `components/blog/article-hero-image.tsx` | Full-width hero image with optional caption |
| `ArticleContent` | `components/blog/article-content.tsx` | MDX renderer with custom component mapping |
| `TableOfContents` | `components/blog/table-of-contents.tsx` | Sticky sidebar TOC with scroll spy |
| `ShareButtons` | `components/blog/share-buttons.tsx` | Twitter, LinkedIn, copy link buttons |
| `TagList` | `components/blog/tag-list.tsx` | Display tags with links |
| `AuthorBio` | `components/blog/author-bio.tsx` | Author card with avatar and bio |
| `BackToBlog` | `components/blog/back-to-blog.tsx` | Navigation link back to blog index |

### 2.4 Inline Content Blocks (MDX Components)

| Component | File Path | Description |
|-----------|-----------|-------------|
| `InlineNewsletterSignup` | `components/blog/inline-newsletter-signup.tsx` | Mid-article newsletter subscription form |
| `InlineToolCTA` | `components/blog/inline-tool-cta.tsx` | CTA block linking to specific tool |
| `InlineCTA` | `components/blog/inline-cta.tsx` | Generic CTA (sign up, start case, etc.) |
| `InlineImage` | `components/blog/inline-image.tsx` | Optimized image with caption and lightbox |
| `Callout` | `components/blog/callout.tsx` | Highlighted tip, warning, or info box |
| `StepByStep` | `components/blog/step-by-step.tsx` | Numbered step guide component |

### 2.5 Related Content Components

| Component | File Path | Description |
|-----------|-----------|-------------|
| `RelatedTools` | `components/blog/related-tools.tsx` | Grid of relevant tools from tools-data.ts |
| `RelatedPosts` | `components/blog/related-posts.tsx` | Grid of related articles by category/tags |
| `FinalCTA` | `components/blog/final-cta.tsx` | End-of-article call to action section |

### 2.6 Category Page Components

| Component | File Path | Description |
|-----------|-----------|-------------|
| `CategoryHeader` | `components/blog/category-header.tsx` | Category title, description, article count |
| `CategoryToolBar` | `components/blog/category-tool-bar.tsx` | Related tools for the category |

### 2.7 Shared/Utility Components

| Component | File Path | Description |
|-----------|-----------|-------------|
| `ReadingTime` | `components/blog/reading-time.tsx` | Calculate and display reading time |
| `PostMeta` | `components/blog/post-meta.tsx` | Date, reading time, category pill |
| `CategoryPill` | `components/blog/category-pill.tsx` | Styled category badge |

---

## 3. Data Model

### 3.1 Blog Post Schema

```typescript
// lib/blog/types.ts

export interface BlogPost {
  // Core identification
  id: string
  slug: string

  // Content
  title: string
  excerpt: string           // 150-200 character summary
  content: string           // MDX content

  // Media
  heroImage?: {
    src: string
    alt: string
    caption?: string
    credit?: string
  }

  // Taxonomy
  category: BlogCategory
  tags: string[]            // e.g., ["flight-delays", "eu261", "compensation"]

  // Related content
  relatedTools: string[]    // Tool slugs from tools-data.ts
  relatedPosts?: string[]   // Manual override, otherwise auto-generated

  // Author
  author: BlogAuthor

  // Dates
  publishedAt: string       // ISO 8601
  updatedAt?: string        // ISO 8601

  // SEO
  seo: BlogPostSEO

  // Status
  status: 'draft' | 'published' | 'archived'
  featured: boolean         // Pin to top of blog

  // Analytics
  readingTimeMinutes: number  // Calculated from content
}

export interface BlogPostSEO {
  metaTitle: string         // Max 60 chars, defaults to title
  metaDescription: string   // Max 160 chars, defaults to excerpt
  canonicalUrl?: string
  ogImage?: string          // Defaults to heroImage
  noIndex?: boolean
  schema?: {
    // JSON-LD structured data
    "@type": "Article" | "BlogPosting" | "HowTo"
    // Additional schema fields auto-generated
  }
}

export interface BlogAuthor {
  id: string
  name: string
  avatar?: string
  bio?: string
  twitter?: string
  linkedin?: string
}

export type BlogCategory =
  | 'rights-claims'      // Rights & Claims - legal rights explanations
  | 'success-stories'    // Success Stories - case studies and wins
  | 'guides'             // How-To Guides - step-by-step tutorials
  | 'news'               // News & Updates - law changes, company policies
  | 'travel'             // Travel & Holidays - flights, hotels, packages
  | 'money-finance'      // Money & Finance - banks, credit cards, insurance
  | 'housing'            // Housing & Property - rent, deposits, repairs
  | 'utilities'          // Utilities & Bills - energy, broadband, mobile

export interface BlogCategoryMeta {
  id: BlogCategory
  name: string
  description: string
  icon: string            // Hugeicons Pro icon name
  relatedToolCategories: string[]  // Maps to tool categories
}
```

### 3.2 Blog Categories Configuration

```typescript
// lib/blog/categories.ts

export const blogCategories: Record<BlogCategory, BlogCategoryMeta> = {
  'rights-claims': {
    id: 'rights-claims',
    name: 'Rights & Claims',
    description: 'Understand your legal rights and how to claim what you\'re owed.',
    icon: 'Scale01Icon',
    relatedToolCategories: ['rights-protection']
  },
  'success-stories': {
    id: 'success-stories',
    name: 'Success Stories',
    description: 'Real cases and wins from consumers who fought back.',
    icon: 'Trophy01Icon',
    relatedToolCategories: []
  },
  'guides': {
    id: 'guides',
    name: 'How-To Guides',
    description: 'Step-by-step guides to resolve common consumer issues.',
    icon: 'Book01Icon',
    relatedToolCategories: ['take-action']
  },
  'news': {
    id: 'news',
    name: 'News & Updates',
    description: 'Latest changes in consumer law and company policies.',
    icon: 'Newspaper01Icon',
    relatedToolCategories: []
  },
  'travel': {
    id: 'travel',
    name: 'Travel & Holidays',
    description: 'Flight delays, holiday disasters, and your travel rights.',
    icon: 'Plane01Icon',
    relatedToolCategories: ['travel-holidays']
  },
  'money-finance': {
    id: 'money-finance',
    name: 'Money & Finance',
    description: 'Banks, credit cards, insurance, and financial disputes.',
    icon: 'Wallet01Icon',
    relatedToolCategories: ['money-finance']
  },
  'housing': {
    id: 'housing',
    name: 'Housing & Property',
    description: 'Rental disputes, deposits, and property rights.',
    icon: 'Home01Icon',
    relatedToolCategories: ['housing-vehicles']
  },
  'utilities': {
    id: 'utilities',
    name: 'Utilities & Bills',
    description: 'Energy, broadband, mobile, and utility complaints.',
    icon: 'Plug01Icon',
    relatedToolCategories: ['utilities-bills']
  }
}
```

### 3.3 MDX Content Structure

```mdx
// content/blog/how-to-get-flight-refund.mdx

---
title: "How to Get a Full Refund When Your Flight Is Cancelled"
excerpt: "Learn exactly what compensation you're owed under UK law and EU261, plus a step-by-step guide to claiming it."
category: "travel"
tags: ["flight-delays", "eu261", "compensation", "refunds"]
author: "noreply-team"
publishedAt: "2024-12-28"
updatedAt: "2025-01-02"
heroImage:
  src: "/blog/flight-cancelled-hero.jpg"
  alt: "Airport departure board showing cancelled flights"
  caption: "Know your rights when flights are cancelled"
relatedTools: ["flight-compensation-calculator", "consumer-rights-checker", "refund-timeline-checker"]
featured: true
seo:
  metaTitle: "Flight Cancelled? Here's How to Get a Full Refund (2025 Guide)"
  metaDescription: "Complete guide to claiming flight compensation under EU261 and UK law. Free calculator included."
---

When your flight is cancelled, you have more rights than most airlines will tell you...

## Your Rights Under EU261

Under EU261 regulations, you're entitled to...

<Callout type="tip">
  Airlines must offer you a choice between a refund and rebooking. Don't let them
  pressure you into accepting vouchers.
</Callout>

<InlineToolCTA
  tool="flight-compensation-calculator"
  heading="Calculate your compensation"
  description="Find out exactly what you're owed in under 2 minutes."
/>

## Step-by-Step Claim Guide

<StepByStep>
  1. Document the cancellation notification
  2. Keep all boarding passes and booking confirmations
  3. Request written confirmation of the cancellation reason
  4. Submit your claim within 6 years (UK) or 3 years (EU)
</StepByStep>

<InlineImage
  src="/blog/eu261-compensation-tiers.png"
  alt="EU261 compensation amounts based on flight distance"
  caption="EU261 compensation tiers based on flight distance"
/>

## Common Airline Tactics to Avoid

Airlines often try to...

<InlineNewsletterSignup
  heading="Get weekly rights tips"
  description="Join 12,000+ subscribers getting expert consumer advice."
/>

## When to Escalate

If the airline refuses your claim...

<InlineCTA
  heading="Ready to fight back?"
  description="Let us handle your case and get the compensation you deserve."
  buttonText="Start Your Free Case"
  buttonHref="/auth/sign-up"
/>
```

### 3.4 File-Based Content Structure

```
content/
└── blog/
    ├── how-to-get-flight-refund.mdx
    ├── section-75-explained.mdx
    ├── success-story-amazon-refund.mdx
    ├── consumer-rights-act-2015-guide.mdx
    └── ...

public/
└── blog/
    ├── flight-cancelled-hero.jpg
    ├── eu261-compensation-tiers.png
    └── ...
```

---

## 4. Information Architecture

### 4.1 URL Structure

| Route | Purpose |
|-------|---------|
| `/blog` | Blog homepage with all posts |
| `/blog/[slug]` | Individual blog post |
| `/blog/category/[category]` | Category archive |
| `/blog/tag/[tag]` | Tag archive |
| `/blog/search` | Search results page |

### 4.2 Navigation Hierarchy

```
Blog
├── All Posts (default view)
├── Categories
│   ├── Rights & Claims
│   ├── Success Stories
│   ├── How-To Guides
│   ├── News & Updates
│   ├── Travel & Holidays
│   ├── Money & Finance
│   ├── Housing & Property
│   └── Utilities & Bills
├── Tags (via post tags)
└── Search
```

### 4.3 Related Posts Algorithm

Related posts are determined by (in order of priority):

1. **Manual override**: If `relatedPosts` is specified in frontmatter
2. **Same category**: Posts in the same category
3. **Shared tags**: Posts with overlapping tags (weighted by overlap count)
4. **Related tools**: Posts mentioning the same tools
5. **Recency**: Prefer newer posts

```typescript
// lib/blog/related-posts.ts

export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  // Manual override
  if (currentPost.relatedPosts?.length) {
    return currentPost.relatedPosts
      .map(slug => allPosts.find(p => p.slug === slug))
      .filter(Boolean)
      .slice(0, limit)
  }

  // Score-based algorithm
  const scored = allPosts
    .filter(p => p.slug !== currentPost.slug && p.status === 'published')
    .map(post => ({
      post,
      score: calculateRelatedScore(currentPost, post)
    }))
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map(s => s.post)
}

function calculateRelatedScore(current: BlogPost, candidate: BlogPost): number {
  let score = 0

  // Same category: +10
  if (current.category === candidate.category) score += 10

  // Shared tags: +3 per tag
  const sharedTags = current.tags.filter(t => candidate.tags.includes(t))
  score += sharedTags.length * 3

  // Shared tools: +5 per tool
  const sharedTools = current.relatedTools.filter(t =>
    candidate.relatedTools.includes(t)
  )
  score += sharedTools.length * 5

  // Recency bonus: up to +2 for posts within 30 days
  const daysDiff = daysBetween(candidate.publishedAt, new Date())
  if (daysDiff < 30) score += 2 - (daysDiff / 15)

  return score
}
```

### 4.4 Category-to-Tool Mapping

Categories map to existing tool categories for automatic related tools:

| Blog Category | Tool Categories | Example Tools |
|---------------|-----------------|---------------|
| `travel` | `travel-holidays` | Flight Compensation Calculator, Holiday Compensation Calculator |
| `money-finance` | `money-finance` | Section 75 Checker, Bank Fees Calculator |
| `housing` | `housing-vehicles` | Rental Deposit Calculator, Car Lemon Law Checker |
| `utilities` | `utilities-bills` | Energy Bill Complaint Generator, Broadband Speed Complaint Generator |
| `rights-claims` | `rights-protection` | Consumer Rights Checker, Cooling-Off Calculator |
| `guides` | `take-action` | Small Claims Calculator, Ombudsman Finder |

---

## 5. Implementation Considerations

### 5.1 Content Management

**Recommended Approach: File-Based MDX**

Given the existing codebase uses Next.js App Router with React 19, use:

- **Content storage**: MDX files in `/content/blog/` directory
- **Content processing**: `@next/mdx` or `contentlayer` for MDX compilation
- **Type safety**: Zod schemas for frontmatter validation
- **Hot reload**: Full MDX support in development

**Alternative: Headless CMS**

If editorial workflow becomes complex, consider:
- **Sanity.io**: Real-time preview, GROQ queries, portable text
- **Contentful**: Structured content, CDN delivery
- **Strapi**: Self-hosted, customizable

### 5.2 SEO Best Practices

```typescript
// app/blog/[slug]/page.tsx

import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  return {
    title: post.seo.metaTitle || post.title,
    description: post.seo.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [post.seo.ogImage || post.heroImage?.src],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.seo.ogImage || post.heroImage?.src],
    },
    alternates: {
      canonical: post.seo.canonicalUrl || `/blog/${post.slug}`,
    },
  }
}

// JSON-LD structured data
export default function BlogPost({ post }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage?.src,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NoReply',
      logo: {
        '@type': 'ImageObject',
        url: 'https://noreply.com/logo.png',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ... */}
    </>
  )
}
```

### 5.3 Performance Optimizations

1. **Static Generation**: Use `generateStaticParams` for all blog posts
2. **Image Optimization**: Next.js `Image` component with blur placeholders
3. **Code Splitting**: Dynamic imports for heavy MDX components
4. **ISR**: Incremental Static Regeneration for content updates without full rebuild

```typescript
// app/blog/[slug]/page.tsx

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Revalidate every hour for content updates
export const revalidate = 3600
```

### 5.4 Mobile Responsiveness

**Breakpoint Strategy (aligned with existing Tailwind config):**

| Breakpoint | Width | Layout Adjustments |
|------------|-------|-------------------|
| Mobile | < 640px | Single column, stacked cards, horizontal scroll for filters |
| Tablet | 640px - 1024px | Two-column grid, collapsible TOC |
| Desktop | > 1024px | Three-column grid, sticky sidebar TOC |

**Key Mobile Considerations:**

- Category filter pills: Horizontal scroll with fade edges
- Table of Contents: Collapsible accordion at top of article
- Share buttons: Fixed bottom bar on scroll
- Related posts: Vertical stack instead of grid
- Inline CTAs: Full-width with adjusted padding

### 5.5 Newsletter Integration

```typescript
// lib/blog/newsletter.ts

// Integrate with existing Supabase or add provider
export async function subscribeToNewsletter(email: string, source: string) {
  // Option 1: Supabase table
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, source, subscribed_at: new Date() })

  // Option 2: Third-party (Buttondown, ConvertKit, Mailchimp)
  // await fetch('https://api.buttondown.email/v1/subscribers', { ... })

  return { success: !error, error }
}
```

### 5.6 Analytics Events

Track these events for content optimization:

| Event | Trigger | Properties |
|-------|---------|------------|
| `blog.post_view` | Page load | `slug`, `category`, `tags` |
| `blog.scroll_depth` | 25%, 50%, 75%, 100% scroll | `slug`, `depth` |
| `blog.tool_cta_click` | Inline tool CTA clicked | `slug`, `tool_slug` |
| `blog.newsletter_signup` | Newsletter form submitted | `slug`, `source` |
| `blog.share_click` | Share button clicked | `slug`, `platform` |
| `blog.related_post_click` | Related post clicked | `from_slug`, `to_slug` |

### 5.7 Accessibility Requirements

- Proper heading hierarchy (h1 for title, h2-h6 for content)
- Alt text for all images
- Sufficient color contrast (already met in design system)
- Keyboard navigation for all interactive elements
- ARIA labels for icon buttons
- Focus indicators on interactive elements
- Skip links for navigation

### 5.8 RSS Feed

```typescript
// app/blog/rss.xml/route.ts

import { getAllPosts } from '@/lib/blog'

export async function GET() {
  const posts = await getAllPosts()

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>NoReply Blog</title>
        <description>Consumer rights insights and guides</description>
        <link>https://noreply.com/blog</link>
        <atom:link href="https://noreply.com/blog/rss.xml" rel="self" type="application/rss+xml"/>
        ${posts.map(post => `
          <item>
            <title>${escapeXml(post.title)}</title>
            <description>${escapeXml(post.excerpt)}</description>
            <link>https://noreply.com/blog/${post.slug}</link>
            <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
            <guid>https://noreply.com/blog/${post.slug}</guid>
          </item>
        `).join('')}
      </channel>
    </rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
```

---

## 6. Implementation Phases

### Phase 1: Foundation
- [ ] Set up MDX content infrastructure
- [ ] Create blog data types and helpers
- [ ] Add "Blog" link to header and footer
- [ ] Create blog homepage with basic post grid
- [ ] Create blog post page with MDX rendering

### Phase 2: Content Components
- [ ] Build inline CTA components (tool, newsletter, generic)
- [ ] Build inline image component with captions
- [ ] Build callout and step-by-step components
- [ ] Implement Table of Contents with scroll spy

### Phase 3: Navigation & Discovery
- [ ] Implement category pages
- [ ] Add tag pages
- [ ] Build related posts algorithm
- [ ] Add search functionality

### Phase 4: Engagement
- [ ] Newsletter signup integration
- [ ] Share buttons
- [ ] Related tools section
- [ ] Final CTA component

### Phase 5: Polish
- [ ] SEO metadata and JSON-LD
- [ ] RSS feed
- [ ] Analytics events
- [ ] Performance optimization
- [ ] Accessibility audit

---

## 7. Component Specifications

### 7.1 InlineToolCTA Component

```typescript
// components/blog/inline-tool-cta.tsx

interface InlineToolCTAProps {
  tool: string          // Tool slug from tools-data.ts
  heading?: string      // Override default heading
  description?: string  // Override default description
  variant?: 'default' | 'compact' | 'featured'
}

// Styling: Forest green border, light forest background
// Icon: Pull from tool definition
// Button: "Use this tool →" with coral variant
```

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│  🛫  Calculate your flight compensation                  │
│                                                          │
│  Use our free Flight Compensation Calculator to find    │
│  out exactly what you're owed in under 2 minutes.       │
│                                                          │
│  [Use this tool →]                                       │
└─────────────────────────────────────────────────────────┘
```

### 7.2 InlineNewsletterSignup Component

```typescript
// components/blog/inline-newsletter-signup.tsx

interface InlineNewsletterSignupProps {
  heading?: string
  description?: string
  source?: string  // For analytics tracking
}

// Styling: Subtle forest-50 background, rounded corners
// Form: Email input + Subscribe button
// Success state: "Thanks! Check your inbox."
```

### 7.3 PostCard Component

```typescript
// components/blog/post-card.tsx

interface PostCardProps {
  post: BlogPost
  variant?: 'default' | 'featured' | 'compact'
}

// Default: Thumbnail, category, title, excerpt, meta
// Featured: Larger, horizontal layout on desktop
// Compact: No thumbnail, just text
```

### 7.4 RelatedPosts Component

```typescript
// components/blog/related-posts.tsx

interface RelatedPostsProps {
  currentPost: BlogPost
  posts: BlogPost[]
  limit?: number  // Default: 3
}

// Heading: "More articles you might like"
// Layout: 3-column grid on desktop, stack on mobile
// Cards: Thumbnail + category + title + reading time
```

---

## 8. Footer Update Specification

Update `/components/footer.tsx` to add Blog link:

**Resources Column (current):**
```
Resources
├── All Free Tools
└── Glossary
```

**Resources Column (updated):**
```
Resources
├── All Free Tools
├── Glossary
└── Blog         ← Add this
```

---

## 9. Header Update Specification

Update `/components/header.tsx` to add Blog link:

**Current navigation:**
```
[Free Tools ▼]  [Glossary]  [Log in]  [Start a Case]
```

**Updated navigation:**
```
[Free Tools ▼]  [Glossary]  [Blog]  [Log in]  [Start a Case]
```

---

## 10. Example Content Structure

### Sample Post Categories & Topics

| Category | Example Posts |
|----------|---------------|
| Rights & Claims | "The Consumer Rights Act 2015: Your Complete Guide", "Section 75 Explained: Free Purchase Protection" |
| Success Stories | "How Jane Got £3,000 Back From British Airways", "£12,000 Refund: A Banking Complaint Win" |
| Guides | "How to Write a Complaint Letter That Gets Results", "Small Claims Court: Step-by-Step Guide" |
| News | "New Flight Delay Rules for 2025", "Energy Price Cap Update: What It Means for You" |
| Travel | "EU261 Compensation: The Complete 2025 Guide", "Package Holiday Rights Explained" |
| Money & Finance | "Chargeback vs Section 75: Which Should You Use?", "Hidden Bank Fees You Can Claim Back" |
| Housing | "Tenant Deposit Protection: Know Your Rights", "Landlord Not Returning Deposit? Here's What to Do" |
| Utilities | "How to Complain About Your Energy Bill", "Broadband Speed Complaints: Getting What You Pay For" |
