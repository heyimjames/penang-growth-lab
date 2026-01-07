<div align="center">

```
    ███╗   ██╗ ██████╗ ██████╗ ███████╗██████╗ ██╗  ██╗   ██╗
    ████╗  ██║██╔═══██╗██╔══██╗██╔════╝██╔══██╗██║  ╚██╗ ██╔╝
    ██╔██╗ ██║██║   ██║██████╔╝█████╗  ██████╔╝██║   ╚████╔╝
    ██║╚██╗██║██║   ██║██╔══██╗██╔══╝  ██╔═══╝ ██║    ╚██╔╝
    ██║ ╚████║╚██████╔╝██║  ██║███████╗██║     ███████╗██║
    ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚═╝

          ╔══════════════════════════════════════╗
          ║   Your Voice. Your Rights. Your Win. ║
          ╚══════════════════════════════════════╝

                    ⚖️  FIGHT BACK  ⚖️
```

# NoReply

**AI-Powered Consumer Rights Platform**

*Helping UK consumers fight back against unfair treatment with professional, legally-structured complaint letters*

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=flat-square&logo=supabase)](https://supabase.com/)

[![Claude AI](https://img.shields.io/badge/Claude-Anthropic-D97706?style=flat-square&logo=anthropic)](https://www.anthropic.com/)
[![Gemini](https://img.shields.io/badge/Gemini-Google-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)](https://vercel.com/)

[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production-success?style=flat-square)](https://usenoreply.com)
[![Version](https://img.shields.io/badge/Version-0.1.0-blue?style=flat-square)](package.json)

[Website](https://usenoreply.com) · [Blog](https://usenoreply.com/blog) · [Free Tools](https://usenoreply.com/tools)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Components](#components)
- [Free Consumer Tools](#free-consumer-tools)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Commands](#commands)
- [Contributing](#contributing)

---

## Overview

**NoReply** is an AI-powered platform that helps UK consumers create professional, legally-structured complaint letters. Whether you're dealing with a cancelled flight, a faulty product, or poor service, NoReply researches relevant consumer laws, identifies the right contacts, and generates complaint letters that companies have to take seriously.

### Why NoReply?

| Problem | Solution |
|---------|----------|
| Companies ignore vague complaints | AI generates legally-precise letters citing specific regulations |
| Finding the right laws is hard | Automated research across UK Consumer Rights Act, EU261, GDPR, and more |
| Don't know who to contact | Company intelligence finds customer service emails and executive contacts |
| Evidence gets lost | Secure upload with AI analysis that extracts key details |
| No time to write letters | Professional letters generated in minutes, not hours |

### Key Stats

- **23** free consumer rights tools
- **11** blog posts with consumer guides
- **131** React components
- **29** API endpoints
- **50+** pages and routes

---

## Features

### Core Platform

| Feature | Description |
|---------|-------------|
| **AI Case Analysis** | Claude analyzes complaints to identify legal issues and applicable laws |
| **Evidence Analysis** | Google Gemini extracts text and details from images, PDFs, and videos |
| **Company Research** | Automated lookup of customer service contacts, complaint patterns, and executive emails |
| **Letter Generation** | Professional complaint letters with customizable tone (formal, assertive, friendly) |
| **Multi-Letter Support** | Generate initial complaints, follow-ups, escalations, and legal threats |
| **Case Management** | Track status, timeline, responses, and resolution |
| **AI Chat Assistant** | Get help analyzing company responses and drafting follow-ups |

### Payment Protection Detection

- **Section 75** - Credit card purchases over £100
- **Chargeback** - Visa/Mastercard dispute process
- **PayPal Buyer Protection** - PayPal purchases
- **Direct Debit Guarantee** - Unauthorized payments

### Chrome Extension

Side panel extension for quick complaint capture and AI-assisted responses while browsing.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.1.1 | React framework with App Router |
| [React](https://react.dev/) | 19.2.0 | UI library with Server Components |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1.9 | Utility-first CSS with CSS variables |
| [shadcn/ui](https://ui.shadcn.com/) | Latest | Component library (new-york style) |
| [Radix UI](https://www.radix-ui.com/) | Latest | Accessible component primitives |
| [React Hook Form](https://react-hook-form.com/) | 7.60.0 | Form management |
| [Zod](https://zod.dev/) | 3.25.76 | Schema validation |
| [Recharts](https://recharts.org/) | 2.15.4 | Data visualization |
| [Motion](https://motion.dev/) | 12.23.25 | Animations |

### Backend & Services

| Service | Purpose |
|---------|---------|
| [Supabase](https://supabase.com/) | PostgreSQL database, authentication, file storage |
| [Anthropic Claude](https://www.anthropic.com/) | AI for case analysis and letter generation |
| [Google Gemini](https://ai.google.dev/) | Evidence analysis (images, PDFs, videos) |
| [Perplexity](https://perplexity.ai/) | Legal research |
| [Exa AI](https://exa.ai/) | Neural search for company research |
| [Firecrawl](https://firecrawl.dev/) | Web scraping for company metadata |
| [Stripe](https://stripe.com/) | Payment processing |
| [Vercel](https://vercel.com/) | Hosting and deployment |

### Icons

| Library | Usage |
|---------|-------|
| [Lucide React](https://lucide.dev/) | General UI icons |
| [HugeIcons Pro](https://hugeicons.com/) | Premium stroke and solid icons |

---

## Getting Started

### Prerequisites

- **Node.js** 18.0+
- **pnpm** 8.0+ (recommended)
- **Supabase** account
- **Anthropic API** key
- **Google AI API** key (for Gemini)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/noreply.git
cd noreply/fightback

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations (see Database Schema section)

# Start development server
pnpm dev

# Open http://localhost:3000
```

---

## Project Structure

```
fightback/
├── app/                              # Next.js App Router
│   ├── (dashboard)/                  # Protected routes (authenticated)
│   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   ├── dashboard/page.tsx        # Main dashboard
│   │   ├── cases/page.tsx            # Cases list
│   │   ├── cases/[id]/page.tsx       # Case detail view
│   │   ├── new/page.tsx              # New case wizard
│   │   ├── account/page.tsx          # Account settings
│   │   ├── stats/page.tsx            # User statistics
│   │   └── help/page.tsx             # Help center
│   ├── api/                          # API routes (29 endpoints)
│   │   ├── analyze/                  # Case & evidence analysis
│   │   ├── generate/                 # Letter generation
│   │   ├── research/                 # Company & legal research
│   │   ├── chat/                     # AI chat assistant
│   │   ├── checkout/                 # Stripe checkout
│   │   └── webhooks/                 # Stripe & Slack webhooks
│   ├── auth/                         # Authentication pages
│   ├── blog/                         # Blog listing & posts
│   ├── tools/                        # 23 free consumer tools
│   ├── communities/page.tsx          # Community directory
│   ├── glossary/page.tsx             # Consumer rights glossary
│   ├── roadmap/page.tsx              # Product roadmap
│   └── [legal pages]/                # about, privacy, terms, faq
│
├── components/                       # React components (131 total)
│   ├── ui/                           # shadcn/ui primitives (40+)
│   ├── case-detail/                  # Case view components (18)
│   ├── new-case/                     # Case creation wizard (4 steps)
│   ├── blog/                         # Blog components (7)
│   └── [feature components]/         # Forms, navigation, etc.
│
├── lib/                              # Core logic
│   ├── actions/                      # Server actions (12 files)
│   ├── supabase/                     # Supabase clients
│   ├── blog/                         # Blog system
│   ├── types.ts                      # TypeScript interfaces
│   ├── tools-data.ts                 # Tool definitions
│   ├── stripe.ts                     # Stripe configuration
│   └── utils.ts                      # Utilities
│
├── hooks/                            # Custom React hooks
├── styles/                           # Global CSS
├── scripts/                          # Database migrations (8 SQL files)
├── extension/                        # Chrome extension source
├── docs/                             # Documentation
└── public/                           # Static assets
```

---

## Components

### UI Components (`components/ui/`)

Core shadcn/ui components with custom styling:

| Category | Components |
|----------|------------|
| **Layout** | `sidebar`, `card`, `sheet`, `separator`, `resizable` |
| **Forms** | `input`, `textarea`, `checkbox`, `radio-group`, `select`, `switch`, `slider` |
| **Navigation** | `tabs`, `breadcrumb`, `dropdown-menu`, `navigation-menu`, `collapsible` |
| **Feedback** | `dialog`, `alert-dialog`, `popover`, `tooltip`, `sonner` (toasts) |
| **Data Display** | `accordion`, `badge`, `avatar`, `progress`, `skeleton`, `carousel` |
| **Buttons** | `button` (7 variants: default, coral, violet, outline, ghost, link, destructive) |

### Case Management (`components/case-detail/`)

| Component | Purpose |
|-----------|---------|
| `case-detail-client.tsx` | Main case container with tabs |
| `case-timeline.tsx` | Case history and milestones |
| `case-evidence.tsx` | Evidence list with upload |
| `case-letters.tsx` | Generated letters display |
| `case-responses.tsx` | Company response tracking |
| `editable-complaint.tsx` | Complaint text editor |
| `evidence-upload-sheet.tsx` | File upload dialog |
| `evidence-detail-sheet.tsx` | File preview with AI analysis |
| `generate-letter-cta.tsx` | Letter generation button |
| `letter-type-sheet.tsx` | Letter type selector |
| `executive-search-sheet.tsx` | Executive contact finder |
| `contact-emails-card.tsx` | Company email display |

### New Case Wizard (`components/new-case/`)

| Step | Component | Purpose |
|------|-----------|---------|
| 1 | `step-one.tsx` | Complaint description (text/voice) |
| 2 | `step-two.tsx` | Company details & case info |
| 3 | `step-three.tsx` | Evidence upload |
| 4 | `step-four.tsx` | Review & confirm |

### Blog Components (`components/blog/`)

| Component | Purpose |
|-----------|---------|
| `post-card.tsx` | Blog post preview card |
| `blog-search.tsx` | Search with filters |
| `category-filter.tsx` | Category filtering |
| `reading-progress.tsx` | Reading progress bar |
| `table-of-contents.tsx` | Post navigation |
| `share-buttons.tsx` | Social sharing |
| `pagination.tsx` | Post pagination |

### Form Components (25+)

Specialized forms for each consumer rights tool:

```
bank-fees-form.tsx            flight-compensation-form.tsx
holiday-compensation-form.tsx delivery-compensation-form.tsx
rental-deposit-form.tsx       energy-bill-complaint-form.tsx
broadband-complaint-form.tsx  parking-fine-appeal-form.tsx
car-lemon-law-form.tsx        warranty-checker-form.tsx
section-75-form.tsx           gdpr-request-form.tsx
small-claims-form.tsx         cooling-off-form.tsx
contract-termination-form.tsx cancel-subscription-form.tsx
complaint-checker-form.tsx    ombudsman-finder-form.tsx
response-deadline-form.tsx    refund-timeline-form.tsx
insurance-timeline-form.tsx   product-recall-form.tsx
consumer-rights-cheat-sheet-form.tsx
```

---

## Free Consumer Tools

23 standalone tools available at `/tools`:

### Consumer Rights

| Tool | Path | Description |
|------|------|-------------|
| Complaint Checker | `/tools/complaint-checker` | Check complaint strength and applicable laws |
| Consumer Rights Cheat Sheet | `/tools/consumer-rights-cheat-sheet` | Quick reference for UK consumer law |
| Section 75 Checker | `/tools/section-75-checker` | Check credit card purchase protection |
| Warranty Checker | `/tools/warranty-checker` | Check warranty and statutory rights |
| GDPR Request Generator | `/tools/gdpr-request` | Generate data access/deletion requests |
| Ombudsman Finder | `/tools/ombudsman-finder` | Find the right ombudsman for your complaint |

### Travel & Compensation

| Tool | Path | Description |
|------|------|-------------|
| Flight Compensation | `/tools/flight-compensation` | Calculate EU261/UK261 flight compensation |
| Holiday Compensation | `/tools/holiday-compensation` | Package holiday claims calculator |
| Delivery Compensation | `/tools/delivery-compensation` | Late/missing delivery claims |

### Finance & Contracts

| Tool | Path | Description |
|------|------|-------------|
| Bank Fees Calculator | `/tools/bank-fees` | Reclaim unfair bank charges |
| Contract Termination | `/tools/contract-termination` | Early contract exit guide |
| Cancel Subscription | `/tools/cancel-subscription` | Subscription cancellation helper |
| Cooling-Off Checker | `/tools/cooling-off-checker` | Check 14-day cooling-off rights |

### Housing & Vehicles

| Tool | Path | Description |
|------|------|-------------|
| Rental Deposit | `/tools/rental-deposit` | Tenancy deposit dispute helper |
| Car Lemon Law | `/tools/car-lemon-law` | Faulty vehicle rights checker |

### Utilities & Services

| Tool | Path | Description |
|------|------|-------------|
| Energy Bill Complaint | `/tools/energy-bill-complaint` | Energy overcharging disputes |
| Broadband Complaint | `/tools/broadband-complaint` | Internet service issues |

### Legal & Claims

| Tool | Path | Description |
|------|------|-------------|
| Small Claims Calculator | `/tools/small-claims-calculator` | Court fees and claim value |
| Parking Fine Appeal | `/tools/parking-fine-appeal` | Private parking ticket appeals |
| Response Deadline | `/tools/response-deadline` | Track company response deadlines |
| Refund Timeline | `/tools/refund-timeline` | Refund processing tracker |
| Insurance Timeline | `/tools/insurance-timeline` | Insurance claim tracker |
| Product Recall | `/tools/product-recall` | Product safety recall checker |

---

## API Routes

### Analysis & Generation

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analyze` | POST | Analyze complaint and identify legal issues |
| `/api/analyze/evidence` | POST | Analyze uploaded evidence with Gemini |
| `/api/generate/letter` | POST | Generate complaint letter |
| `/api/generate/letter-type` | POST | Determine appropriate letter type |

### Research

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/research/company` | POST | Company info via Firecrawl & Exa |
| `/api/research/legal` | POST | Legal research via Perplexity |
| `/api/research/executives` | POST | Executive contact search |
| `/api/research/terms` | POST | Company terms analysis |

### Case Management

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/cases` | GET | List user's cases |
| `/api/cases/[id]` | GET/PATCH | Get or update specific case |
| `/api/cases/[id]/notes` | GET/POST | Case notes |

### Other

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | AI chat assistant |
| `/api/transcribe` | POST | Voice-to-text transcription |
| `/api/checkout` | POST | Stripe checkout session |
| `/api/auth/session` | GET | Session info |
| `/api/webhooks/stripe` | POST | Stripe payment webhooks |
| `/api/webhooks/slack` | POST | Slack integration |
| `/api/feature-requests/process` | POST | Process feature requests |

---

## Database Schema

### Tables

```sql
-- Cases: Main complaint data
cases (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  company_name TEXT,
  company_domain TEXT,
  complaint_text TEXT,
  purchase_date DATE,
  purchase_amount DECIMAL,
  currency TEXT,
  desired_outcomes JSONB,
  payment_method TEXT,
  card_type TEXT,
  incident_country TEXT,
  user_country TEXT,

  -- AI Analysis Results
  confidence_score INTEGER,
  identified_issues JSONB,
  legal_basis JSONB,
  company_intel JSONB,

  -- Status & Resolution
  status TEXT, -- draft, analyzing, analyzed, ready, sent, resolved
  resolution_type TEXT,
  resolution_details TEXT,
  resolved_at TIMESTAMP,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Evidence: File uploads with AI analysis
evidence (
  id UUID PRIMARY KEY,
  case_id UUID REFERENCES cases,
  user_id UUID REFERENCES auth.users,
  file_name TEXT,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT,
  analyzed BOOLEAN,
  analysis_summary TEXT,
  analysis_details JSONB,
  indexed_for_letter BOOLEAN,
  user_context TEXT,
  created_at TIMESTAMP
)

-- Case Messages: AI chat history
case_messages (
  id UUID PRIMARY KEY,
  case_id UUID REFERENCES cases,
  user_id UUID REFERENCES auth.users,
  role TEXT, -- user, assistant, system
  content TEXT,
  tool_invocations JSONB,
  metadata JSONB,
  created_at TIMESTAMP
)

-- User Credits: Credit balance tracking
user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Credit Transactions: Purchase/usage history
credit_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  amount INTEGER,
  type TEXT, -- purchase, case_usage, refund
  description TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMP
)

-- Feature Requests: Community voting
feature_requests (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  raw_request TEXT,
  title TEXT,
  description TEXT,
  category TEXT,
  priority_suggestion TEXT,
  is_relevant BOOLEAN,
  status TEXT,
  vote_count INTEGER,
  created_at TIMESTAMP
)

-- Profiles: Extended user data
profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Row Level Security

All tables have RLS enabled - users can only access their own data.

---

## Environment Variables

### Required

```env
# Site
NEXT_PUBLIC_SITE_URL=https://usenoreply.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services
ANTHROPIC_API_KEY=your_anthropic_key        # Claude for analysis & letters
GOOGLE_AI_API_KEY=your_google_ai_key        # Gemini for evidence analysis
PERPLEXITY_API_KEY=your_perplexity_key      # Legal research
EXA_API_KEY=your_exa_key                    # Company search
FIRECRAWL_API_KEY=your_firecrawl_key        # Web scraping

# Payments
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Optional

```env
# Logo API (falls back to Google favicons)
NEXT_PUBLIC_LOGO_DEV_TOKEN=your_logo_dev_token

# Analytics
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token

# Slack Integration
SLACK_WEBHOOK_URL=your_slack_webhook
SLACK_SIGNING_SECRET=your_slack_secret

# GitHub Automation
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_org
GITHUB_REPO=your_repo_name
```

---

## Commands

```bash
pnpm dev      # Start development server (http://localhost:3000)
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

---

## Contributing

### Code Style

- **TypeScript** for all new code
- **Server Components** by default, Client Components when needed
- **Server Actions** for mutations (`lib/actions/`)
- **Tailwind CSS** with design system variables
- Follow patterns in `CLAUDE.md`

### Design System

The app uses a "New Nature" design system with warm, organic tones:

| Color | Usage |
|-------|-------|
| **Coral** `#FF7759` | Primary accent, CTAs |
| **Violet** `#D18EE2` | Secondary accent |
| **Forest** `#355146` | Dark accent |
| **Lavender** | Backgrounds, highlights |

---

## License

This project is **private** and proprietary. All rights reserved.

---

<div align="center">

**Made for consumers everywhere**

[Website](https://usenoreply.com) · [Blog](https://usenoreply.com/blog) · [Free Tools](https://usenoreply.com/tools) · [Communities](https://usenoreply.com/communities)

</div>
