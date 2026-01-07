# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NoReply (codename: FightBack) is an AI-powered consumer advocacy platform helping UK consumers create professional, legally-structured complaint letters. Users describe issues, upload evidence, and the system generates complaint letters citing relevant consumer laws.

**Live at:** https://usenoreply.com

## Commands

```bash
pnpm dev      # Start development server (localhost:3000)
pnpm build    # Build for production
pnpm lint     # Run ESLint
pnpm start    # Start production server
```

## Tech Stack

- **Framework**: Next.js 16 with React 19 (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI**: shadcn/ui (new-york style) + Radix primitives
- **Database/Auth/Storage**: Supabase with Row Level Security
- **Payments**: Stripe (credit-based system)
- **Deployment**: Vercel

### AI Services Pipeline

| Service | Purpose | API Key |
|---------|---------|---------|
| **Claude (Anthropic)** | Case analysis, letter generation, chat assistant | `ANTHROPIC_API_KEY` |
| **Gemini (Google)** | Evidence analysis (images, PDFs, videos) | `GOOGLE_AI_API_KEY` |
| **Perplexity** | Legal research | `PERPLEXITY_API_KEY` |
| **Exa AI** | Company search and research | `EXA_API_KEY` |
| **Firecrawl** | Web scraping for company contacts | `FIRECRAWL_API_KEY` |

## Architecture

### Directory Structure

```
fightback/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Protected routes (authenticated)
│   ├── api/                # API routes (29 endpoints)
│   ├── auth/               # Authentication pages
│   ├── blog/               # Blog system
│   ├── tools/              # 23 free consumer tools
│   └── [public pages]/     # about, pricing, faq, etc.
├── components/             # React components (131 total)
│   ├── ui/                 # shadcn/ui primitives
│   ├── case-detail/        # Case view components
│   ├── new-case/           # 4-step case creation wizard
│   └── blog/               # Blog components
├── lib/
│   ├── actions/            # Server Actions (14 files)
│   ├── supabase/           # Supabase clients
│   ├── types.ts            # Core TypeScript interfaces
│   └── tools-data.ts       # Tool definitions
├── scripts/                # SQL migrations (run manually in Supabase)
└── extension/              # Chrome extension source
```

### Route Groups

- `app/(dashboard)/` - Authenticated routes with sidebar layout
- `app/auth/` - Login, signup, password reset
- `app/tools/` - 23 standalone consumer rights tools
- `app/api/` - AI analysis, generation, research, webhooks

### Supabase Integration

```
lib/supabase/
├── client.ts     # Browser client (use in Client Components)
├── server.ts     # Server client (use in Server Components/Actions)
└── middleware.ts # Session refresh
```

- **middleware.ts** (root) refreshes Supabase sessions on each request
- All tables have RLS - users only access their own data

### Server Actions (`lib/actions/`)

Core CRUD operations with automatic user scoping:
- `cases.ts` - Case management (main workflow)
- `evidence.ts` - File uploads and AI analysis
- `letters.ts` - Generated letter management
- `messages.ts` - AI chat history
- `credits.ts` - Credit balance and transactions
- `profile.ts` - User profile management

### Data Model

Key tables (see `scripts/` for full schemas):

```typescript
// Core case data with AI analysis fields
Case {
  complaint_text, company_name, purchase_date, purchase_amount,
  confidence_score, identified_issues, legal_basis, company_intel,
  status: 'draft' | 'analyzing' | 'analyzed' | 'ready' | 'sent' | 'resolved'
}

// File uploads with Gemini analysis
Evidence {
  file_name, storage_path, analyzed, analysis_summary, analysis_details
}

// Multi-letter support
Letter {
  letter_type: 'initial' | 'follow-up' | 'letter-before-action' | 'escalation' | 'chargeback'
}
```

### AI Workflow

1. **Case Creation** (`app/(dashboard)/new/`) - 4-step wizard
2. **Case Analysis** (`/api/analyze`) - Claude identifies issues and legal basis
3. **Evidence Analysis** (`/api/analyze/evidence`) - Gemini extracts details from files
4. **Company Research** (`/api/research/company`) - Exa + Firecrawl find contacts
5. **Legal Research** (`/api/research/legal`) - Perplexity finds applicable laws
6. **Letter Generation** (`/api/generate/letter`) - Claude creates complaint letter
7. **Chat Assistant** (`/api/chat`) - Claude helps with follow-ups

## Design System

"New Nature" - warm, organic tones inspired by Cohere.

### Colors (CSS Variables)

| Role | Variable | Hex | Usage |
|------|----------|-----|-------|
| Primary | `--coral` | `#FF7759` | CTAs, active states |
| Secondary | `--violet` | `#D18EE2` | Accents, gradients |
| Neutral Light | `--alabaster` | `#F8F8F5` | Backgrounds |
| Neutral Dark | `--charcoal` | `#222621` | Text, dark backgrounds |
| Links | `--acrylic` | `#3E7EF2` | Links, info states |

### Typography

- `font-display` (Space Grotesk) - Headings
- `font-sans` (Inter) - Body text
- `font-mono` (IBM Plex Mono) - Code

### Component Patterns

- Buttons: `rounded-full` with hover lift (`hover:-translate-y-0.5`)
- Inputs: Coral focus ring
- Gradients: `.text-gradient`, `.bg-gradient-brand`, `.underline-gradient`
- Glass effect: `.glass` class for glassmorphism

### Key Guidelines

- Fixed sidebar on desktop, slide-out drawer on mobile (`lg:` breakpoint)
- Keyboard accessible with `:focus-visible` (not `:focus`)
- 44px minimum touch targets on mobile
- 16px minimum input font size (prevents iOS zoom)
- Honor `prefers-reduced-motion`
- Use `aria-current="page"` on active nav links
- Animate only `transform` and `opacity` (GPU-accelerated)

## Path Aliases

`@/*` maps to project root (e.g., `@/components/ui/button`)

## Environment Variables

See `.env.example` for full list. Required:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`, `PERPLEXITY_API_KEY`
- `EXA_API_KEY`, `FIRECRAWL_API_KEY`
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
