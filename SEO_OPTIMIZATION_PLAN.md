# SEO Optimization Plan for Vital Edge Insurance
**Agent:** Patrick Mackin IV  
**Target:** Rank for "Vital Edge" + "Patrick Mackin" + Florida health insurance searches  
**Date:** February 1, 2026

---

## Executive Summary

Current SEO foundation is solid but missing **critical name-brand optimization** for:
1. **Patrick Mackin IV** (agent name) - not in any metadata
2. **Vital Edge Insurance** brand reinforcement
3. **Florida health insurance** + **Jacksonville insurance agent** keyword targeting
4. Local SEO signals for AEO (Answer Engine Optimization)

---

## Current State Analysis

### ✅ What's Working
- Schema.org markup (Organization, LocalBusiness, InsuranceAgency)
- Sitemap.xml and robots.txt present
- Service area targeting (Duval, St. Johns, Miami-Dade)
- Clean URL structure
- Mobile-friendly Next.js setup

### ❌ Critical Gaps
1. **Agent name missing**: "Patrick Mackin IV" appears nowhere in metadata
2. **Generic titles**: Pages lack specific Florida/Jacksonville targeting
3. **Weak OpenGraph**: OG titles don't include agent name or strong local signals
4. **No Person schema**: Missing schema.org/Person for Patrick Mackin IV
5. **Thin descriptions**: Many pages have no metadata exports
6. **AEO gaps**: Missing FAQ schema on key pages, weak answer-engine signals

---

## Priority 1: Name-Brand Injection (Immediate)

### A. Root Layout Metadata (`src/app/layout.tsx`)

**Current:**
```typescript
title: {
  default: "Vital Edge Insurance | Health Insurance Guidance in Jacksonville, FL",
  template: "%s | Vital Edge Insurance",
}
```

**Optimized:**
```typescript
title: {
  default: "Patrick Mackin IV | Vital Edge Insurance | Licensed Florida Health Insurance Agent in Jacksonville",
  template: "%s | Patrick Mackin IV | Vital Edge Insurance",
}
description: "Patrick Mackin IV, licensed Florida health insurance agent serving Jacksonville, Duval County, St. Johns County. Independent guidance for ACA Marketplace, Medicare, Medigap, ICHRA, and small business health insurance. Vital Edge Insurance provides education-first support for individuals, families, and employers."
```

**OpenGraph:**
```typescript
openGraph: {
  type: "website",
  url: absoluteUrl("/"),
  title: "Patrick Mackin IV | Vital Edge Insurance | Florida Health Insurance Agent",
  description: "Licensed Florida health insurance agent Patrick Mackin IV provides independent guidance for ACA, Medicare, and small business coverage in Jacksonville, Duval County, and St. Johns County.",
  siteName: "Vital Edge Insurance",
  images: [
    {
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "Patrick Mackin IV - Vital Edge Insurance - Licensed Florida Health Insurance Agent",
    },
  ],
}
```

---

### B. Add Person Schema (`src/lib/site.ts`)

**New function to add:**
```typescript
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Patrick Mackin IV",
    jobTitle: "Licensed Health Insurance Agent",
    worksFor: {
      "@type": "InsuranceAgency",
      name: site.legalName,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      addressCountry: site.address.addressCountry,
    },
    telephone: site.phoneE164,
    email: site.email,
    url: absoluteUrl("/about"),
    sameAs: site.sameAs,
    areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    knowsAbout: [
      "ACA Marketplace",
      "Medicare",
      "Medicare Supplement",
      "Medigap",
      "ICHRA",
      "Small Group Health Insurance",
      "Florida Health Insurance",
      "Health Insurance Compliance",
    ],
  };
}
```

**Inject into layout.tsx:**
```typescript
const person = personJsonLd();
// ... in return:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
/>
```

---

## Priority 2: Page-Level Metadata (High Impact)

### About Page (`src/app/about/page.tsx`)

**Add export:**
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Patrick Mackin IV",
  description: "Patrick Mackin IV is a licensed Florida health insurance agent and founder of Vital Edge Insurance, serving Jacksonville, Duval County, St. Johns County, and Miami-Dade County with independent guidance for ACA, Medicare, and small business health insurance.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: "About Patrick Mackin IV | Vital Edge Insurance",
    description: "Licensed Florida health insurance agent providing independent, education-first guidance in Jacksonville and surrounding counties.",
    url: absoluteUrl("/about"),
  },
};
```

---

### ACA Page (`src/app/aca/page.tsx`)

**Add export:**
```typescript
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "ACA Marketplace Health Insurance | Florida HealthCare.gov Enrollment Help",
  description: "Patrick Mackin IV provides ACA Marketplace enrollment guidance in Jacksonville, FL. Get help with HealthCare.gov eligibility, subsidies, Special Enrollment Periods, and plan selection for Duval, St. Johns, and Miami-Dade counties.",
  alternates: {
    canonical: absoluteUrl("/aca"),
  },
  openGraph: {
    title: "ACA Marketplace Help in Jacksonville, FL | Patrick Mackin IV",
    description: "Licensed agent support for Florida ACA Marketplace enrollment, subsidies, and plan selection.",
    url: absoluteUrl("/aca"),
  },
};
```

---

### Medicare Page (`src/app/medicare/page.tsx`)

**Add export:**
```typescript
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Medicare Guidance in Jacksonville, FL | Medicare Supplement & Medigap Help",
  description: "Patrick Mackin IV provides Medicare education, Medicare Supplement (Medigap), and Medicare Advantage guidance in Jacksonville, Duval County, and St. Johns County. Licensed Florida agent for Original Medicare, Part D, and supplemental coverage.",
  alternates: {
    canonical: absoluteUrl("/medicare"),
  },
  openGraph: {
    title: "Medicare Help in Jacksonville, FL | Patrick Mackin IV | Vital Edge Insurance",
    description: "Licensed Medicare guidance for Jacksonville residents. Education on Medicare Supplement, Medigap, Part D, and enrollment timing.",
    url: absoluteUrl("/medicare"),
  },
};
```

---

### Duval County Page (`src/app/duval-county/page.tsx`)

**Add export:**
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Duval County Health Insurance Agent | Jacksonville, FL",
  description: "Patrick Mackin IV serves Duval County and Jacksonville with local health insurance guidance for ACA Marketplace, Medicare, small business group plans, and ICHRA. Licensed Florida agent with education-first approach.",
  alternates: {
    canonical: absoluteUrl("/duval-county"),
  },
  openGraph: {
    title: "Duval County Health Insurance | Patrick Mackin IV | Jacksonville Agent",
    description: "Local health insurance agent serving Duval County and Jacksonville, FL with ACA, Medicare, and small business coverage guidance.",
    url: absoluteUrl("/duval-county"),
  },
};
```

---

### St. Johns County Page (`src/app/st-johns-county/page.tsx`)

**Add export:**
```typescript
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "St. Johns County Health Insurance Agent | St. Augustine, FL",
  description: "Patrick Mackin IV provides health insurance guidance in St. Johns County and St. Augustine, FL. Licensed agent for ACA Marketplace, Medicare, Medigap, and small business health insurance.",
  alternates: {
    canonical: absoluteUrl("/st-johns-county"),
  },
  openGraph: {
    title: "St. Johns County Health Insurance | Patrick Mackin IV",
    description: "Licensed Florida health insurance agent serving St. Johns County and St. Augustine with ACA, Medicare, and employer coverage guidance.",
    url: absoluteUrl("/st-johns-county"),
  },
};
```

---

### Miami Page (`src/app/miami/page.tsx`)

**Add export:**
```typescript
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Miami-Dade County Health Insurance Agent | Miami, FL",
  description: "Patrick Mackin IV serves Miami-Dade County with health insurance guidance for ACA Marketplace, Medicare, and small business coverage. Licensed Florida agent with regional support for Miami metro area.",
  alternates: {
    canonical: absoluteUrl("/miami"),
  },
  openGraph: {
    title: "Miami-Dade Health Insurance | Patrick Mackin IV | Vital Edge Insurance",
    description: "Licensed health insurance agent serving Miami-Dade County with ACA, Medicare, and employer coverage guidance.",
    url: absoluteUrl("/miami"),
  },
};
```

---

### ICHRA Page (`src/app/ichra/page.tsx`)

**Add export:**
```typescript
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "ICHRA Health Insurance | Individual Coverage HRA | Florida Employer Guide",
  description: "Patrick Mackin IV helps Florida employers and employees navigate ICHRA (Individual Coverage Health Reimbursement Arrangement). Licensed agent guidance for defined contribution health benefits in Jacksonville and Miami.",
  alternates: {
    canonical: absoluteUrl("/ichra"),
  },
  openGraph: {
    title: "ICHRA Guidance in Florida | Patrick Mackin IV | Vital Edge Insurance",
    description: "Licensed agent support for ICHRA setup, employee guidance, and compliance in Florida.",
    url: absoluteUrl("/ichra"),
  },
};
```

---

### Off-Exchange Page (`src/app/off-exchange/page.tsx`)

**Add export:**
```typescript
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Off-Exchange Health Insurance | Florida Non-Marketplace Plans",
  description: "Patrick Mackin IV provides guidance on off-exchange health insurance options in Florida when ACA Marketplace coverage isn't the right fit. Licensed agent for Jacksonville, Duval, St. Johns, and Miami-Dade counties.",
  alternates: {
    canonical: absoluteUrl("/off-exchange"),
  },
  openGraph: {
    title: "Off-Exchange Health Insurance in Florida | Patrick Mackin IV",
    description: "Licensed agent guidance for non-Marketplace health insurance options in Florida.",
    url: absoluteUrl("/off-exchange"),
  },
};
```

---

### Small Group Page (`src/app/small-group/page.tsx`)

**Add export:**
```typescript
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Small Business Health Insurance | Florida Group Coverage | Jacksonville",
  description: "Patrick Mackin IV helps Florida small businesses with group health insurance, renewals, and employee benefits. Licensed agent serving Jacksonville, Duval County, St. Johns County, and Miami-Dade County employers.",
  alternates: {
    canonical: absoluteUrl("/small-group"),
  },
  openGraph: {
    title: "Small Business Health Insurance in Florida | Patrick Mackin IV",
    description: "Licensed agent support for small group health insurance, renewals, and employee benefits in Florida.",
    url: absoluteUrl("/small-group"),
  },
};
```

---

## Priority 3: AEO (Answer Engine Optimization)

### Add FAQ Schema to Key Pages

**Example for ACA page (`src/app/aca/page.tsx`):**

```typescript
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who can help me enroll in ACA Marketplace health insurance in Jacksonville, FL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Patrick Mackin IV, a licensed Florida health insurance agent with Vital Edge Insurance, provides ACA Marketplace enrollment guidance in Jacksonville, Duval County, St. Johns County, and Miami-Dade County. He offers education-first support for HealthCare.gov eligibility, subsidies, and plan selection.",
      },
    },
    {
      "@type": "Question",
      name: "What is the ACA Open Enrollment Period in Florida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The ACA Open Enrollment Period typically runs from November 1 to January 15 each year. Special Enrollment Periods may be available if you experience qualifying life events such as losing coverage, moving, marriage, or having a baby.",
      },
    },
    {
      "@type": "Question",
      name: "How do I know if I qualify for ACA subsidies in Florida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ACA subsidies are based on your household income and size. Most people with income between 100% and 400% of the Federal Poverty Level qualify for premium tax credits. Patrick Mackin IV can help you understand eligibility and estimate your subsidy during a free consultation.",
      },
    },
  ],
};

// Add to return:
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
```

**Repeat for Medicare, ICHRA, and other key pages with agent-name-specific answers.**

---

## Priority 4: Technical SEO Enhancements

### A. Update `site.ts` with Agent Info

```typescript
export const site = {
  name: "Vital Edge Insurance",
  legalName: "Vital Edge Insurance",
  agentName: "Patrick Mackin IV", // ADD THIS
  agentTitle: "Licensed Florida Health Insurance Agent", // ADD THIS
  domain: "vital-edge-insurance.vercel.app",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  // ... rest unchanged
```

---

### B. Add Twitter Card Metadata

**In `layout.tsx`:**
```typescript
twitter: {
  card: "summary_large_image",
  title: "Patrick Mackin IV | Vital Edge Insurance | Florida Health Insurance Agent",
  description: "Licensed Florida health insurance agent serving Jacksonville, Duval County, St. Johns County, and Miami-Dade County.",
  images: ["/og.png"],
  creator: "@VitalEdgeIns", // if you have Twitter
},
```

---

### C. Add Breadcrumb Schema (Example for ACA page)

```typescript
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: absoluteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ACA Marketplace",
      item: absoluteUrl("/aca"),
    },
  ],
};
```

---

## Priority 5: Content Enhancements for Ranking

### A. Add "About Patrick Mackin IV" Section to About Page

```markdown
## About Patrick Mackin IV

Patrick Mackin IV is a licensed Florida health insurance agent and the founder of Vital Edge Insurance. Based in Jacksonville, Patrick serves individuals, families, and small businesses across Duval County, St. Johns County, and Miami-Dade County.

With a focus on education-first guidance, Patrick specializes in:
- ACA Marketplace (HealthCare.gov) enrollment and subsidies
- Medicare education, Medicare Supplement (Medigap), and Part D
- ICHRA (Individual Coverage Health Reimbursement Arrangement)
- Small business group health insurance
- Off-exchange health insurance options

Patrick is committed to compliance, transparency, and helping clients make informed decisions about their health coverage. He is not affiliated with any healthcare clinic and operates as an independent insurance agent.

**Contact Patrick:**
- Phone: (352) 214-8879
- Email: pmackiniv27@icloud.com
- LinkedIn: [Patrick Mackin IV](https://www.linkedin.com/in/patrick-mackin-iv-297574187)
```

---

### B. Add Agent Bio to Footer

**In `src/components/Footer.tsx`:**
```tsx
<div className="text-xs text-white/70">
  <strong className="text-white">Patrick Mackin IV</strong>, Licensed Florida Health Insurance Agent
  <br />
  Serving Jacksonville, Duval County, St. Johns County, and Miami-Dade County
</div>
```

---

## Priority 6: Local SEO Signals

### A. Add Google Business Profile Schema

```typescript
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: site.legalName,
    url: site.siteUrl,
    telephone: site.phoneE164,
    email: site.email,
    priceRange: "$$",
    image: absoluteUrl("/og.png"),
    areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    address: {
      "@type": "PostalAddress",
      ...site.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "30.3322", // Jacksonville, FL
      longitude: "-81.6557",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
  };
}
```

---

## Priority 7: Link Building & Off-Page SEO

### Immediate Actions
1. **Claim Google Business Profile** for "Vital Edge Insurance" in Jacksonville
2. **LinkedIn optimization**: Update Patrick's LinkedIn headline to "Licensed Florida Health Insurance Agent | Vital Edge Insurance | Jacksonville, Duval, St. Johns County"
3. **Directory listings**: Submit to:
   - Florida Department of Financial Services agent directory
   - HealthCare.gov Find Local Help
   - Medicare.gov Find Someone to Talk To
   - Local Jacksonville business directories
4. **Backlinks**: Reach out to CPA firms, real estate agents, mortgage brokers (from your B2B outreach list) for reciprocal links

---

## Priority 8: Content Marketing for SEO

### Blog Posts to Write (Target Keywords)
1. "How to Choose a Health Insurance Agent in Jacksonville, FL" (target: "Jacksonville health insurance agent")
2. "ACA Open Enrollment 2026: What Duval County Residents Need to Know" (target: "Duval County ACA")
3. "Medicare Supplement vs Medicare Advantage in Florida: What's the Difference?" (target: "Florida Medicare Supplement")
4. "ICHRA for Small Businesses in Jacksonville: A Complete Guide" (target: "Jacksonville ICHRA")
5. "Patrick Mackin IV: Why I Became a Health Insurance Agent in Florida" (brand story, name SEO)

---

## Implementation Checklist

### Week 1 (Immediate)
- [ ] Update `src/app/layout.tsx` with Patrick Mackin IV in title/description/OG
- [ ] Add `personJsonLd()` to `src/lib/site.ts`
- [ ] Inject Person schema into `layout.tsx`
- [ ] Add metadata exports to all pages (about, aca, medicare, duval-county, st-johns-county, miami, ichra, off-exchange, small-group)
- [ ] Update `site.ts` with `agentName` and `agentTitle` constants
- [ ] Add agent bio section to About page
- [ ] Add agent name to Footer component

### Week 2 (High Priority)
- [ ] Add FAQ schema to ACA, Medicare, ICHRA pages with agent-name-specific answers
- [ ] Add breadcrumb schema to all service pages
- [ ] Update OpenGraph images to include "Patrick Mackin IV" text overlay
- [ ] Claim and optimize Google Business Profile
- [ ] Update LinkedIn profiles (personal + company)

### Week 3 (Ongoing)
- [ ] Submit to Florida insurance agent directories
- [ ] Write first 2 blog posts with target keywords
- [ ] Reach out to 10 B2B partners for backlinks
- [ ] Set up Google Search Console and submit sitemap
- [ ] Monitor rankings for "Patrick Mackin IV health insurance", "Vital Edge Insurance Jacksonville", "Duval County health insurance agent"

---

## Expected Results

### 30 Days
- "Patrick Mackin IV" + "health insurance" → Top 10
- "Vital Edge Insurance" → Top 5
- "Vital Edge Insurance Jacksonville" → Top 3

### 60 Days
- "Jacksonville health insurance agent" → Page 1
- "Duval County ACA" → Page 1
- "Medicare agent Jacksonville FL" → Page 1

### 90 Days
- "Florida health insurance agent" → Page 2-3
- "Jacksonville Medicare Supplement" → Page 1
- "ICHRA Jacksonville" → Top 3

---

## Monitoring & Reporting

### Tools to Set Up
1. **Google Search Console**: Track impressions, clicks, rankings
2. **Google Analytics 4**: Monitor organic traffic, conversions
3. **Ahrefs/SEMrush** (optional): Track keyword rankings and backlinks

### Weekly Metrics
- Organic search impressions
- Click-through rate (CTR)
- Keyword rankings for "Patrick Mackin IV", "Vital Edge Insurance", target service keywords
- Lead form submissions from organic search

---

## Notes for Codex

This plan prioritizes **name-brand SEO** (Patrick Mackin IV + Vital Edge Insurance) combined with **local + service keyword targeting** (Jacksonville, Duval County, ACA, Medicare, etc.).

All changes are **compliance-safe** (no Medicare Advantage marketing language, no plan recommendations, education-first framing).

The metadata updates are **low-risk, high-impact** and can be implemented immediately without breaking existing functionality.

Focus on **schema markup** (Person, FAQPage, Breadcrumb) for AEO since Google and AI search engines (ChatGPT, Perplexity, Claude) increasingly pull from structured data for answers.

---

**End of Report**
