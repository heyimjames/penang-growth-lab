export type BlogCategory =
  | "meta-ads"
  | "creative"
  | "analytics"
  | "tracking"
  | "strategy"
  | "case-study"

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  category: BlogCategory
  featured?: boolean
}

export const blogCategories: Record<BlogCategory, { name: string; color: string }> = {
  "meta-ads": {
    name: "Meta Ads",
    color: "bg-[#cff128]/10 text-[#cff128]",
  },
  creative: {
    name: "Creative",
    color: "bg-purple-500/10 text-purple-400",
  },
  analytics: {
    name: "Analytics",
    color: "bg-blue-500/10 text-blue-400",
  },
  tracking: {
    name: "Tracking",
    color: "bg-orange-500/10 text-orange-400",
  },
  strategy: {
    name: "Strategy",
    color: "bg-green-500/10 text-green-400",
  },
  "case-study": {
    name: "Case Study",
    color: "bg-pink-500/10 text-pink-400",
  },
}

export const blogPosts: BlogPost[] = [
  {
    slug: "meta-advantage-plus-2024",
    title: "Meta Advantage+ Shopping Campaigns: The 2024 Guide",
    excerpt:
      "Everything you need to know about Advantage+ Shopping campaigns and how to use them effectively for your e-commerce brand.",
    date: "Jan 5, 2024",
    readTime: "8 min read",
    category: "meta-ads",
    featured: true,
    content: `
## What Are Advantage+ Shopping Campaigns?

Advantage+ Shopping Campaigns (ASC) are Meta's automated campaign type specifically designed for e-commerce. Launched in 2022, they've become the go-to campaign type for many DTC brands looking to maximize conversions with minimal manual optimization.

Unlike traditional campaigns where you control every targeting variable, ASC leverages Meta's machine learning to find your best customers automatically. You provide the creative, the budget, and Meta does the rest.

## When Should You Use Advantage+ Shopping?

ASC works best when:

- You have strong pixel data (at least 50 purchases/week)
- Your creative is proven and diverse
- You want to scale efficiently without constant optimization
- Your products appeal to a broad audience

They may not be ideal if:

- You're a new brand with limited data
- You need precise audience exclusions
- You have very niche products with specific targeting needs

## Setting Up Your First ASC Campaign

**Step 1: Campaign Creation**
In Ads Manager, choose "Sales" as your objective and select "Advantage+ Shopping Campaign" from the options.

**Step 2: Budget & Schedule**
Set your daily budget. Meta recommends starting with at least $50/day to give the algorithm room to learn. ASC doesn't have a learning phase in the traditional sense, but performance stabilizes after about 50 conversions.

**Step 3: Creative Setup**
This is where the magic happens. You can add up to 150 ads to a single ASC campaign. Meta will automatically test different combinations and serve the best performers.

Best practices for ASC creative:
- Mix video and static images
- Include a variety of angles (product focus, lifestyle, UGC, social proof)
- Test different hooks and CTAs
- Refresh creative every 2-3 weeks

## The Existing Customer Budget Cap

One crucial setting in ASC is the "Existing Customer Budget Cap." This limits how much of your budget goes to retargeting vs prospecting.

**Recommended settings:**
- New brands: 10-20% existing customer cap
- Established brands with strong retention: 20-30%
- Brands focused purely on acquisition: 5-10%

If you don't set this cap, Meta will often over-serve to existing customers (they're easier to convert), inflating your ROAS while not actually acquiring new customers.

## ASC vs CBO Campaigns

Should you run ASC alongside traditional CBO campaigns? Our recommendation:

**Run both, but with different purposes:**
- ASC: Primary acquisition engine, fed with your best creative
- CBO: Testing ground for new creative, audiences, and concepts

Once something proves successful in CBO testing, graduate it to your ASC.

## Key Metrics to Watch

When evaluating ASC performance, focus on:

1. **New Customer Acquisition Cost** - Not just CAC, but specifically new customers
2. **Incremental ROAS** - Are these sales you wouldn't have gotten organically?
3. **Creative Performance** - Which ads are driving results? Double down on winners
4. **Audience Breakdown** - Use the reporting to see prospecting vs retargeting split

## Common ASC Mistakes

**Mistake 1: Not enough creative variety**
ASC needs diversity to optimize. With only 3-5 ads, the algorithm is limited.

**Mistake 2: Ignoring the existing customer cap**
This single setting can be the difference between profitable growth and inflated metrics.

**Mistake 3: Budget fluctuations**
Avoid dramatic budget changes. Scale incrementally (20% every 3-4 days max).

**Mistake 4: Expecting miracles without good creative**
ASC is only as good as the ads you feed it. Creative is still king.

## Conclusion

Advantage+ Shopping Campaigns have become an essential tool for e-commerce advertisers. When set up correctly with strong creative and proper budget caps, they can be your most efficient acquisition channel.

The key is to treat ASC as your primary scaling vehicle while maintaining separate testing campaigns to feed it with proven creative.

Start with a modest budget, ensure you have the existing customer cap configured, and let the machine learning do its job. Just don't forget - your creative is still the biggest lever for performance.
    `,
  },
  {
    slug: "creative-fatigue-signs",
    title: "5 Signs Your Ad Creative Has Fatigue (And How to Fix It)",
    excerpt:
      "Learn to spot the warning signs of creative fatigue before your campaigns crash, plus strategies to keep your ads fresh.",
    date: "Jan 2, 2024",
    readTime: "6 min read",
    category: "creative",
    featured: true,
    content: `
## What Is Creative Fatigue?

Creative fatigue happens when your target audience has seen your ads so many times that they stop responding to them. It's one of the most common reasons for declining campaign performance, yet many advertisers fail to spot it until it's too late.

## Sign #1: Frequency Is Climbing While Results Drop

The most obvious indicator. Watch for:

- Frequency above 3-4 for prospecting audiences
- Frequency above 6-8 for retargeting
- CTR declining as frequency increases
- CPA rising alongside frequency

**The fix:** Set up automated rules to alert you when frequency crosses thresholds. Consider pausing ads that exceed 4x frequency for prospecting.

## Sign #2: CTR Is Declining Week Over Week

A healthy ad maintains relatively stable CTR. If you're seeing 10-20% CTR decline week over week for the same ads, fatigue is setting in.

**The fix:** Have new creative ready to rotate in before CTR drops below your threshold. A good rule: replace bottom 20% performers every 2 weeks.

## Sign #3: CPM Is Stable But CPA Is Rising

This is sneaky. When CPM stays the same but CPA increases, it means you're paying the same to reach people, but fewer are converting. Classic fatigue signal.

**The fix:** This often indicates the message has worn out, not just the visual. Try testing new angles and hooks, not just new visuals.

## Sign #4: Comments Are Getting Negative or Repetitive

User feedback is valuable data. Watch for:

- "I keep seeing this ad"
- Negative comments increasing
- Hide/report rates rising
- Same users commenting multiple times

**The fix:** Monitor ad comments weekly. Negative sentiment is both a cause and symptom of fatigue. Hide negative comments and refresh creative.

## Sign #5: New Audiences Perform Better Than Established Ones

If new audiences consistently outperform your established ones with the same creative, your established audiences are fatigued.

**The fix:** Rotate creative more aggressively in high-frequency audiences. Consider expanding targeting to reach fresh users.

## How to Prevent Creative Fatigue

**1. Build a Creative Pipeline**
Aim for 15-30 new creative assets per month depending on spend level. Don't wait until performance drops.

**2. Test Variations, Not Just New Concepts**
A winning concept can have 10+ variations: different hooks, thumbnails, CTAs, music, and pacing. Iterate on what works.

**3. Use Modular Creative**
Build ads from interchangeable components (hooks, bodies, CTAs). This lets you create variations quickly.

**4. Set Up Monitoring Dashboards**
Track frequency, CTR, and CPA trends by creative. Automate alerts for early warning signs.

**5. Have a Refresh Calendar**
Plan creative refreshes every 2-3 weeks for high-spend campaigns. Don't wait for performance to drop.

## Recovery Strategies

Already in fatigue? Here's the recovery playbook:

1. **Pause the fatigued creative** - Stop the bleeding
2. **Launch fresh creative** - Ideally concepts you've been testing
3. **Reset audience learning** - Consider duplicating the ad set with fresh creative
4. **Reduce frequency caps** - Temporarily limit how often users see your ads
5. **Expand targeting** - Reach users who haven't been overexposed

## Conclusion

Creative fatigue is inevitable, but crashing performance isn't. The key is proactive creative management - always be testing, always have new creative ready, and monitor the warning signs closely.

The best advertisers treat creative development as a continuous process, not a one-time task. Your creative pipeline should always be full.
    `,
  },
  {
    slug: "roas-vs-mer",
    title: "ROAS vs MER: Which Metric Should You Trust?",
    excerpt:
      "Understanding the difference between platform ROAS and blended MER, and when to use each for decision making.",
    date: "Dec 28, 2023",
    readTime: "7 min read",
    category: "analytics",
    featured: true,
    content: `
## The Attribution Problem

If you're running paid ads in 2024, you've probably noticed something: the ROAS your ad platforms report doesn't match reality. Meta says you did $100K in revenue, Google says $80K, and your Shopify shows $120K total. What's going on?

Welcome to the world of attribution chaos.

## What Is Platform ROAS?

Platform ROAS (Return on Ad Spend) is what Meta, Google, or TikTok reports in their dashboards. It's calculated as:

**Platform ROAS = Revenue Attributed by Platform / Ad Spend**

The problem? Each platform uses its own attribution model and counts conversions differently:

- Meta uses a 7-day click, 1-day view window
- Google uses various models including data-driven
- They all want credit for the same sale

This leads to "double counting" - where the same purchase is claimed by multiple platforms.

## What Is MER?

Marketing Efficiency Ratio (MER) takes a different approach. Instead of trusting platform attribution, it looks at your entire business:

**MER = Total Revenue / Total Marketing Spend**

If you spent $50,000 on all marketing and generated $200,000 in revenue, your MER is 4.0.

MER doesn't care which platform "gets credit." It just asks: "Are we making money?"

## When to Use Platform ROAS

Platform ROAS is still useful for:

**1. Relative Comparisons**
Comparing performance between ads, ad sets, or campaigns within the same platform is valid. If Ad A has 3x ROAS and Ad B has 2x ROAS in Meta, Ad A is probably better.

**2. Optimization Signals**
Use platform ROAS to identify what's working and what isn't within that platform's ecosystem.

**3. Creative Performance**
Platform metrics help you understand which creatives resonate with audiences.

## When to Use MER

MER is better for:

**1. Business-Level Decisions**
Should you increase overall ad spend? MER tells you if marketing is profitable.

**2. Budget Allocation**
How much to spend in total, regardless of channel.

**3. Financial Planning**
MER directly correlates with your P&L.

**4. Investor/Stakeholder Reporting**
MER is a trusted metric because it can't be gamed by attribution.

## The Hybrid Approach

Most sophisticated advertisers use both:

- **MER** for overall business health and total budget decisions
- **Platform ROAS** for optimization within channels
- **Incrementality testing** to validate channel effectiveness

## Setting MER Targets

Your target MER depends on your profit margins:

| Gross Margin | Break-Even MER | Target MER |
|-------------|----------------|------------|
| 30% | 3.3 | 4.0+ |
| 40% | 2.5 | 3.0+ |
| 50% | 2.0 | 2.5+ |
| 60% | 1.67 | 2.0+ |

## Common Pitfalls

**Pitfall 1: Trusting Platform ROAS Blindly**
If Meta says you're doing 5x ROAS but your bank account doesn't reflect it, believe your bank account.

**Pitfall 2: Ignoring Platform ROAS Entirely**
Platform metrics still provide valuable optimization signals. Don't throw them out completely.

**Pitfall 3: Not Accounting for Seasonality**
MER fluctuates with demand cycles. Compare YoY, not just MoM.

## Conclusion

The answer to "which metric should you trust?" is: both, for different purposes.

Use MER to understand business health and make high-level budget decisions. Use platform ROAS for in-platform optimization and creative decisions.

The best operators track both religiously and never let platform vanity metrics override business reality.
    `,
  },
  {
    slug: "ugc-that-converts",
    title: "How to Brief UGC Creators for Ads That Actually Convert",
    excerpt:
      "A step-by-step framework for briefing UGC creators that results in scroll-stopping, conversion-driving content.",
    date: "Dec 22, 2023",
    readTime: "10 min read",
    category: "creative",
    content: `
## Why Most UGC Doesn't Perform

You've hired creators, sent products, and received... mediocre content. Sound familiar?

The problem usually isn't the creator - it's the brief. Great UGC requires great direction.

## The UGC Brief Framework

Every winning UGC brief includes these elements:

### 1. The Hook (First 3 Seconds)

This is the most important part. Be specific:

**Bad:** "Start with something attention-grabbing"
**Good:** "Open with: 'I was skeptical about [product] until this happened...'"

Give them the exact words or a clear pattern to follow.

### 2. The Problem/Pain Point

What struggle does your customer face? The creator needs to connect emotionally.

**Include:**
- Specific scenarios they should mention
- Emotions to convey (frustration, embarrassment, confusion)
- Real customer language to reference

### 3. The Solution Moment

How does your product solve the problem? This is your transformation.

**Include:**
- Key product features to highlight
- Benefits (not just features)
- Before/after contrasts

### 4. Social Proof Elements

Build credibility throughout:

- Personal results to mention
- Numbers to reference ("In just 2 weeks...")
- Reactions from others

### 5. Call to Action

What should viewers do next? Be explicit:

- "Link in bio"
- "Shop now"
- "Use my code"

## Brief Template

Here's a copy-paste template:

---

**Campaign:** [Name]
**Product:** [Product name + key info]
**Target Audience:** [Who we're speaking to]

**The Hook (Pick One):**
- Option A: "[Exact script]"
- Option B: "[Exact script]"
- Option C: "[Exact script]"

**Key Messages (Include All):**
1. [Message 1 with talking point]
2. [Message 2 with talking point]
3. [Message 3 with talking point]

**What NOT to Say:**
- [Avoid this]
- [Avoid that]

**Visual Requirements:**
- Lighting: [Natural preferred]
- Setting: [At home, outdoors, etc.]
- Product shots: [When to show product]

**Deliverables:**
- [X] vertical videos
- Length: [15-60 seconds]
- Format: [Raw footage + edited if applicable]

---

## Selecting the Right Creators

Not all UGC creators are equal. Look for:

**1. Authenticity Over Polish**
Overly produced content often performs worse. Look for natural, relatable delivery.

**2. Platform Native**
TikTok-style content for TikTok, Reels-style for Instagram. Creators should know the platform.

**3. Relevant Demographics**
The creator should match or aspirationally match your target customer.

**4. Portfolio Quality**
Ask for examples of past ad content, not just organic posts.

## Iteration and Feedback

Great UGC is a collaboration:

**First Round:** Expect 60-70% of what you want. Provide specific feedback.

**Second Round:** Should be 90%+. Minor tweaks only.

**Pro Tip:** Send reference videos of ads you like. Visual examples beat written descriptions.

## Compensation Guidelines

| Creator Level | Rate Range | Best For |
|--------------|-----------|----------|
| Micro (1-10K) | $100-300 | Testing, volume |
| Mid (10-100K) | $300-800 | Quality + reach |
| Established (100K+) | $800-2,500+ | Anchor content |

## Conclusion

The difference between UGC that converts and UGC that flops is almost always in the brief. Invest time in detailed, specific briefs, and your hit rate will increase dramatically.

Remember: creators want to deliver great work. Your job is to make it easy for them by being crystal clear about what "great" looks like.
    `,
  },
  {
    slug: "scaling-without-killing-roas",
    title: "The 20% Rule: How We Scale Ad Spend Without Killing ROAS",
    excerpt:
      "Our proven approach to scaling campaigns profitably, used across dozens of 7 and 8-figure DTC brands.",
    date: "Dec 5, 2023",
    readTime: "9 min read",
    category: "strategy",
    content: `
## The Scaling Paradox

Every media buyer has experienced it: you find a winning campaign, try to scale the budget, and performance tanks. It feels like the algorithm is punishing you for success.

But scaling doesn't have to destroy ROAS. Here's how we do it.

## The 20% Rule

Never increase budget by more than 20% every 3-4 days.

This simple rule keeps you out of the learning phase while allowing meaningful growth.

**Example Timeline:**
- Day 1: $500/day
- Day 4: $600/day (+20%)
- Day 7: $720/day (+20%)
- Day 10: $864/day (+20%)
- Day 13: $1,037/day (+20%)

Result: 2x budget in about 2 weeks, without triggering dramatic ROAS drops.

## Why This Works

Meta's algorithm optimizes based on recent performance data. When you make massive budget jumps:

1. The algorithm has to find new audiences quickly
2. It serves to less qualified prospects
3. Learning phase resets, causing volatility

Incremental increases let the algorithm expand gradually while maintaining optimization.

## Vertical vs. Horizontal Scaling

**Vertical Scaling:** Increasing budget on existing winning ad sets.
- Simpler to execute
- Limited by audience saturation
- Use the 20% rule

**Horizontal Scaling:** Creating new campaigns, ad sets, or creatives.
- Unlocks new audiences
- More effort required
- Essential for 10x+ growth

**Our Approach:** Start vertical until you see diminishing returns (usually 2-3x original budget), then expand horizontally.

## Creative Velocity at Scale

The #1 scaling killer is creative fatigue. Here's what we recommend:

| Monthly Spend | New Creatives/Month |
|--------------|-------------------|
| $5K-15K | 8-12 |
| $15K-50K | 15-25 |
| $50K-150K | 30-50 |
| $150K+ | 50+ |

Not all need to be fully new productions. Iterations count: new hooks, thumbnails, CTAs, music.

## The Testing Budget

Always reserve budget for testing:

- 10-15% at lower spend levels
- 15-25% at higher spend levels

This testing budget feeds your scaling campaigns with proven creative.

## Monitoring During Scale

Watch these metrics closely during scaling:

1. **CPA Trend** - Should stay within 20% of baseline
2. **Frequency** - Watch for sudden spikes
3. **Audience Saturation** - Monitor audience reach %
4. **Creative Fatigue** - CTR trends by creative

Set up automated rules to pause if CPA exceeds 130% of target for 2+ days.

## When to Pull Back

Scaling isn't always the right move. Pull back if:

- CPA exceeds target by 30%+ for 3+ days
- Frequency is climbing without sales
- You're running low on fresh creative
- Seasonal factors suggest lower demand

It's okay to scale down and regroup. Preservation of profit is more important than hitting spend targets.

## Conclusion

Scaling doesn't have to be a boom-bust cycle. The 20% rule, combined with adequate creative velocity and proper monitoring, allows for sustainable growth.

Remember: the goal isn't to spend more money - it's to acquire more customers profitably. Keep that north star in mind, and scaling becomes much less stressful.
    `,
  },
  {
    slug: "google-pmax-vs-meta",
    title: "Google Performance Max vs Meta Ads: Where Should You Spend?",
    excerpt:
      "A comparison of the two biggest paid ad platforms for e-commerce and how to allocate budget between them.",
    date: "Nov 28, 2023",
    readTime: "8 min read",
    category: "strategy",
    content: `
## The Two Giants of E-commerce Advertising

For most DTC brands, Meta (Facebook/Instagram) and Google represent the lion's share of paid advertising budget. But how do you decide how much to allocate to each?

## Meta Ads: The Demand Creator

Meta excels at:

**1. Demand Generation**
Meta puts your product in front of people who didn't know they wanted it. The visual, social nature of the platform creates desire.

**2. Brand Building**
Video content, UGC, and lifestyle imagery build brand awareness alongside direct response.

**3. Prospecting**
Meta's algorithm is exceptional at finding new customers who match your buyer profile.

**Best For:**
- Impulse purchase products
- Visually compelling products
- Brands with strong creative
- Cold audience acquisition

## Google Performance Max: The Demand Capturer

Google excels at:

**1. High-Intent Traffic**
When someone searches "buy [product]," they're ready to purchase. Google captures this demand.

**2. Shopping Feeds**
Product listings appear right when users are searching for what you sell.

**3. Brand Defense**
Capture searches for your brand name before competitors do.

**Best For:**
- Products people actively search for
- Commodity/replacement purchases
- High-consideration products
- Retargeting warm audiences

## Budget Allocation Framework

Here's how we typically recommend splitting budgets:

**New Brands (No Brand Awareness):**
- Meta: 70-80%
- Google: 20-30%

Meta does the heavy lifting of introducing your brand to the market.

**Established Brands (Some Search Volume):**
- Meta: 50-60%
- Google: 40-50%

As brand awareness grows, more people search for you. Capture that demand.

**Mature Brands (Strong Brand Recognition):**
- Meta: 40-50%
- Google: 50-60%

With significant search volume, Google becomes increasingly efficient.

## Running Both Effectively

### Meta Strategy
- Focus on cold audience acquisition
- Test creative aggressively
- Use Advantage+ Shopping campaigns for scale
- Layer in retargeting (but watch incrementality)

### Google Strategy
- Performance Max for Shopping
- Brand campaigns (protect your ROAS)
- Non-brand Search for category terms
- YouTube for top-of-funnel (optional)

## The Attribution Overlap

Warning: Both platforms will claim credit for the same sales. This is normal.

Don't add up Meta ROAS + Google ROAS and expect that to equal your true ROAS. Use blended MER (Marketing Efficiency Ratio) to understand true performance:

**MER = Total Revenue / Total Ad Spend**

## How to Test Allocation Changes

Want to shift budget between platforms? Test properly:

1. **Make one change at a time** - Don't shift 30% of budget overnight
2. **Run for 2+ weeks** - Give both platforms time to adjust
3. **Track blended metrics** - MER, overall CPA, total revenue
4. **Watch for cannibalization** - Did one platform just steal from the other?

## Conclusion

Most brands should be on both Meta and Google. The question is proportion, not either/or.

Start with the framework above based on your brand maturity, but don't be afraid to adjust based on your specific data. Every brand is different, and the optimal split will evolve as you grow.

Test, measure, iterate.
    `,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getAllPosts(): BlogPost[] {
  return blogPosts
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured)
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return blogPosts.filter((post) => post.category === category)
}
