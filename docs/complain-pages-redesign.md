# Company Complaint Pages Redesign Plan

## Current State Analysis

The current `/complain/[company]` pages are **basic and unhelpful** because they:

1. **Show generic, industry-level content** - Not company-specific intelligence
2. **Only provide email contacts** - Missing phone, postal, social, executive contacts
3. **Have no escalation guidance** - Users don't know what to do if ignored
4. **Lack actionable process steps** - No clear "what to do next" journey
5. **Missing regulatory context** - Which ombudsman, what ADR scheme, what regulator
6. **No practical tools** - No calculators, templates, or checklists
7. **No social proof** - No success stories or community insights
8. **Poor information hierarchy** - Everything looks equally important

---

## Redesigned Page Structure

### 1. Hero Section (Enhanced)
- Company logo, name, industry badge ✓ (existing)
- **NEW:** Company "complaint score" or responsiveness rating
- **NEW:** Quick stats bar: avg response time, resolution rate, cases this month
- **NEW:** Alert banner for known issues (e.g., "High complaint volume - expect delays")
- Primary CTA: "Start Your Complaint"

### 2. Quick Actions Bar (NEW)
Horizontal scrollable cards for immediate actions:
- 📧 Email Complaints Team
- 📞 Call Customer Service
- 💬 Live Chat
- 🐦 Tweet @Company
- 📝 Start AI Complaint Letter

### 3. Step-by-Step Complaint Process (NEW)
Visual timeline showing the complaint journey:

```
Step 1: Contact Customer Service (Day 1)
   ↓ No response after 14 days?
Step 2: Formal Written Complaint (Day 14)
   ↓ No resolution after 8 weeks?
Step 3: Request Deadlock Letter (Week 8)
   ↓
Step 4: Escalate to [Ombudsman/ADR] (Free)
   ↓ Decision not accepted?
Step 5: Small Claims Court (Up to £10,000)
```

Each step expandable with:
- What to do
- Template text/phrases
- Expected timeline
- What to include

### 4. Contact Information (Enhanced)
Organized by purpose with copy buttons:

**For Initial Complaints:**
- Customer Service Email
- Customer Service Phone
- Live Chat Link
- Opening Hours

**For Escalation:**
- Complaints Department Email
- Executive/CEO Email
- Registered Office Address (for formal letters)

**For Public Pressure:**
- Twitter/X Handle
- Facebook Page
- Trustpilot Profile

### 5. Your Rights & Entitlements (Enhanced)
- **Relevant Laws** with expandable details ✓ (existing, improve)
- **NEW:** Interactive calculator where applicable:
  - Airlines: Flight delay compensation (£220-£520 based on distance/delay)
  - Retail: Refund timeline calculator (30 days full refund, 6 months repair/replace)
  - Utilities: Compensation estimator (Ofgem automatic compensation)
- **NEW:** "What you can claim" checklist specific to issue type

### 6. Common Issues (Enhanced)
Current cards are too basic. Each issue should expand to show:
- Detailed description
- What evidence to gather
- Key phrases to use
- Typical resolution timeline
- Success rate for this issue type
- Link to start complaint with issue pre-filled

### 7. Escalation Pathway (NEW - Critical Section)
Visual flowchart with:

**Internal Escalation:**
- Who to contact at each level
- When to escalate (timeline triggers)
- Template escalation phrases

**External Escalation:**
- Which Ombudsman/ADR scheme covers this company
- Link to ombudsman with pre-filled company info
- Which regulator (FCA, Ofgem, Ofcom, CAA, etc.)
- When small claims court is appropriate

**Industry-Specific:**
| Industry | Ombudsman/ADR | Regulator | Deadline |
|----------|---------------|-----------|----------|
| Banking | Financial Ombudsman | FCA | 6 months from final response |
| Energy | Energy Ombudsman | Ofgem | 12 months |
| Telecoms | CISAS or Ombudsman Services | Ofcom | 12 months |
| Airlines | CAA/ADR scheme | CAA | 6 years |
| Retail | Retail ADR (if member) | Trading Standards | 6 years |

### 8. What to Include in Your Complaint (NEW)
Checklist format:
- [ ] Your account/reference number
- [ ] Date of purchase/incident
- [ ] Clear description of what went wrong
- [ ] How it affected you (financial loss, inconvenience)
- [ ] What resolution you want
- [ ] Deadline for response (14 days reasonable)
- [ ] Evidence attached (receipts, photos, screenshots)

### 9. Template Phrases (NEW)
Expandable sections with copy-paste phrases:
- Opening your complaint
- Describing the issue
- Stating your rights
- Requesting resolution
- Setting deadlines
- Escalation language

### 10. FAQ Section (NEW)
Company-specific FAQs:
- "How long does [Company] take to respond?"
- "Can I get a refund from [Company]?"
- "Who regulates [Company]?"
- "What ombudsman covers [Company]?"
- "Can I claim compensation from [Company]?"

### 11. Success Stories / Community Insights (NEW)
- Anonymized case studies
- "What worked" tips from other users
- Average payout amounts
- Resolution rate trends

### 12. Related Resources (NEW)
- Link to relevant guides on the site
- External links: Citizens Advice, Ombudsman, Which?
- Template letter downloads
- Related companies in same industry

### 13. Sidebar (Enhanced)
- Quick contact card ✓ (existing)
- **NEW:** "Save for later" / bookmark functionality
- **NEW:** Share buttons
- **NEW:** Print-friendly version
- CTA card ✓ (existing)

---

## New Data Model

```typescript
interface CompanyData {
  // Existing
  name: string
  slug: string
  domain: string | null
  description: string | null
  industry: string | null

  // Enhanced Stats
  stats: {
    successRate: number | null
    avgResponseDays: number | null
    totalCases: number
    avgPayout: number | null
    // NEW
    casesThisMonth: number
    responseRateTrend: 'improving' | 'stable' | 'declining' | null
    complaintsVolume: 'low' | 'moderate' | 'high' | null
  }

  // Enhanced Contacts
  contacts: {
    emails: CompanyEmail[]
    // NEW
    phones: CompanyPhone[]
    addresses: CompanyAddress[]
    socialMedia: SocialMediaLinks
    executiveContacts: ExecutiveContact[]
    liveChat: string | null
    openingHours: string | null
  }

  // NEW: Regulatory Information
  regulation: {
    ombudsman: OmbudsmanInfo | null
    adrScheme: ADRSchemeInfo | null
    regulator: RegulatorInfo | null
    complaintDeadline: string // e.g., "8 weeks"
    escalationDeadline: string // e.g., "6 months from final response"
  }

  // Enhanced Laws
  relevantLaws: RelevantLaw[]

  // Enhanced Issues
  commonIssues: EnhancedCommonIssue[]

  // NEW
  complaintProcess: ComplaintStep[]
  faqs: FAQ[]
  templatePhrases: TemplatePhraseCategory[]
  tips: string[]
  whatToInclude: string[]

  // NEW: Alerts
  alerts: CompanyAlert[]
}

interface CompanyPhone {
  number: string
  type: 'Customer Service' | 'Complaints' | 'Sales'
  hours: string | null
  cost: string | null // e.g., "Free from UK mobiles"
}

interface CompanyAddress {
  type: 'Customer Service' | 'Registered Office' | 'Head Office'
  address: string
  postcode: string
}

interface SocialMediaLinks {
  twitter: string | null
  facebook: string | null
  instagram: string | null
  trustpilot: string | null
}

interface ExecutiveContact {
  name: string | null
  title: string
  email: string
}

interface OmbudsmanInfo {
  name: string
  url: string
  description: string
  maxAward: string | null
  processingTime: string | null
}

interface ComplaintStep {
  step: number
  title: string
  description: string
  timeline: string
  whatToDo: string[]
  templateText: string | null
  escalationTrigger: string | null
}

interface EnhancedCommonIssue {
  type: string
  title: string
  description: string
  // NEW
  detailedDescription: string
  evidenceNeeded: string[]
  keyPhrases: string[]
  typicalTimeline: string
  successRate: number | null
  avgCompensation: number | null
}

interface FAQ {
  question: string
  answer: string
}

interface TemplatePhraseCategory {
  category: string
  phrases: TemplatePhrase[]
}

interface TemplatePhrase {
  context: string
  text: string
}

interface CompanyAlert {
  type: 'warning' | 'info' | 'success'
  title: string
  message: string
  expiresAt: string | null
}
```

---

## New Components Needed

### 1. `ComplaintProcessTimeline`
Visual step-by-step timeline with expandable steps

### 2. `QuickActionsBar`
Horizontal scrollable action cards

### 3. `ContactCard`
Enhanced contact display with categories, copy buttons, hours

### 4. `EscalationPathway`
Visual flowchart showing escalation options

### 5. `CompensationCalculator`
Industry-specific calculators:
- `FlightDelayCalculator`
- `RefundTimelineCalculator`
- `UtilityCompensationCalculator`

### 6. `TemplatePhrasesAccordion`
Expandable sections with copyable template text

### 7. `FAQAccordion`
Company-specific FAQ section

### 8. `WhatToIncludeChecklist`
Interactive checklist for complaint preparation

### 9. `IssueDetailCard`
Enhanced issue card with expandable details

### 10. `CompanyAlert`
Alert banner for known issues or warnings

### 11. `RegulatoryInfoCard`
Shows ombudsman, ADR, regulator info

---

## Implementation Phases

### Phase 1: Core Structure & Layout
- Redesign page layout with new sections
- Implement `ComplaintProcessTimeline`
- Implement `QuickActionsBar`
- Enhanced contact cards with more contact types

### Phase 2: Escalation & Regulatory
- Add `EscalationPathway` component
- Add regulatory/ombudsman data to company-data.ts
- Implement `RegulatoryInfoCard`

### Phase 3: Enhanced Content
- Add `FAQAccordion`
- Add `TemplatePhrasesAccordion`
- Add `WhatToIncludeChecklist`
- Enhanced issue cards

### Phase 4: Interactive Tools
- `FlightDelayCalculator` for airlines
- `RefundTimelineCalculator` for retail
- Other industry-specific tools

### Phase 5: Social Proof & Intelligence
- Success stories section
- Company alerts
- Trend indicators

---

## Design Principles

1. **Scannable** - Clear headings, bullet points, expandable sections
2. **Actionable** - Every section leads to a clear next step
3. **Trustworthy** - Cite sources, show legal backing, professional tone
4. **Mobile-first** - Collapsible sections, touch-friendly targets
5. **Empowering** - Make users feel informed and confident
6. **Honest** - Realistic expectations, not over-promising

---

## Success Metrics

- Time on page (should increase with better content)
- Scroll depth (users reading more sections)
- CTA click rate (starting complaints)
- Bounce rate (should decrease)
- Return visits (users bookmarking/returning)
- SEO rankings for "[company] complaint" searches
