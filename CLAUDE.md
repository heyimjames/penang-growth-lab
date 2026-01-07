# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Penang Growth Lab is a free tools and resources platform for e-commerce and DTC brands. It features calculators, AI-powered content tools, and expert guides to help brands grow profitably. Built by Penang Media.

**Live at:** https://growth.penangmedia.com

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
- **UI**: shadcn/ui + Radix primitives
- **AI**: Anthropic Claude for content generation
- **Deployment**: Vercel

## Architecture

### Directory Structure

```
penang-growth-lab/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Protected routes (authenticated)
│   ├── api/                # API routes
│   ├── blog/               # Blog system
│   ├── guides/             # Expert guides (5 guides)
│   ├── tools/              # 25+ free tools
│   └── [public pages]/     # about, privacy, terms, etc.
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives
│   └── [feature forms]/    # Tool-specific form components
├── lib/
│   ├── tools-data.ts       # Tool definitions and categories
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utilities
├── hooks/                  # Custom React hooks
└── public/                 # Static assets
```

### Tool Categories

Tools are organized into categories defined in `lib/tools-data.ts`:

| Category | Tools | Examples |
|----------|-------|----------|
| **Calculators** | 9 | ROAS, Break-Even ROAS, LTV, CAC, Margins |
| **AI Tools** | 7 | Ad Copy Generator, Headline Generator, Creative Analyzer |
| **Analytics** | 3 | Scaling Quiz, Benchmarks, Ad Fatigue Calculator |
| **Email** | 2 | Subject Line Generator, Flow Planner |
| **Tracking** | 3 | UTM Builder, A/B Test Calculator, Attribution Guide |

### API Routes

| Endpoint | Purpose |
|----------|---------|
| `/api/generate/ad-copy` | Generate ad copy with Claude |
| `/api/generate/headline` | Generate headlines |
| `/api/generate/copy` | General copywriting |
| `/api/analyze/ad-creative` | Analyze ad creatives |
| `/api/analyze/landing-page` | Analyze landing pages |

## Design System

Dark-first design with lime yellow accent inspired by Penang Media branding.

### Colors (CSS Variables)

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#0a0a0a` | Page background |
| Primary | `#cff128` | CTAs, highlights, accent |
| Foreground | `#ffffff` | Text |
| Muted | `rgba(255,255,255,0.5)` | Secondary text |
| Card | `rgba(255,255,255,0.05)` | Card backgrounds |
| Border | `rgba(255,255,255,0.1)` | Borders |

### Typography

- `font-sans` (Inter) - Body text
- `font-mono` (JetBrains Mono) - Code

### Component Patterns

- Dark mode by default (`defaultTheme="dark"`)
- Buttons: Rounded with lime hover states
- Cards: Subtle glass effect with `bg-white/5 border-white/10`
- Focus rings use primary lime color
- CTAs use `bg-[#cff128] text-black`

### Key Guidelines

- All tools are **free** - no authentication required for tool access
- Dashboard features require authentication
- Honor `prefers-reduced-motion`
- 44px minimum touch targets on mobile
- Use `aria-current="page"` on active nav links
- Animate only `transform` and `opacity` (GPU-accelerated)

## Adding New Tools

1. Add tool definition to `lib/tools-data.ts`:

```typescript
{
  id: "tool-slug",
  name: "Tool Name",
  description: "Full description",
  shortDescription: "Brief tagline",
  href: "/tools/tool-slug",
  icon: IconComponent,
  category: "calculators" | "ai-tools" | "analytics" | "email" | "tracking",
  isAI?: boolean,
  isNew?: boolean,
  isFeatured?: boolean,
}
```

2. Create page at `app/tools/tool-slug/page.tsx`

3. If AI-powered, add API route at `app/api/generate/` or `app/api/analyze/`

## Path Aliases

`@/*` maps to project root (e.g., `@/components/ui/button`)

## Environment Variables

See `.env.example` for full list. Required:
- `ANTHROPIC_API_KEY` - Claude for AI tools

Optional:
- `NEXT_PUBLIC_SITE_URL` - Site URL for metadata
