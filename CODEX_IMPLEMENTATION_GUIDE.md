# Codex Implementation Guide: SEO Optimization
**Quick-start guide for implementing Priority 1 & 2 SEO changes**

---

## Step 1: Update Root Layout Metadata

**File:** `src/app/layout.tsx`

**Find this block (lines 10-48):**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: "Vital Edge Insurance | Health Insurance Guidance in Jacksonville, FL",
    template: "%s | Vital Edge Insurance",
  },
  description:
    "Independent guidance for ACA Marketplace, individual and family plans, small business options, and Medicare education in Jacksonville, FL. Duval, St. Johns, and Miami-Dade County service areas.",
  // ... rest
```

**Replace with:**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: "Patrick Mackin IV | Vital Edge Insurance | Licensed Florida Health Insurance Agent in Jacksonville",
    template: "%s | Patrick Mackin IV | Vital Edge Insurance",
  },
  description:
    "Patrick Mackin IV, licensed Florida health insurance agent serving Jacksonville, Duval County, St. Johns County. Independent guidance for ACA Marketplace, Medicare, Medigap, ICHRA, and small business health insurance. Vital Edge Insurance provides education-first support for individuals, families, and employers.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "Patrick Mackin IV | Vital Edge Insurance | Florida Health Insurance Agent",
    description:
      "Licensed Florida health insurance agent Patrick Mackin IV provides independent guidance for ACA, Medicare, and small business coverage in Jacksonville, Duval County, and St. Johns County.",
    siteName: "Vital Edge Insurance",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Patrick Mackin IV - Vital Edge Insurance - Licensed Florida Health Insurance Agent",
      },
    ],
  },
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patrick Mackin IV | Vital Edge Insurance | Florida Health Insurance Agent",
    description: "Licensed Florida health insurance agent serving Jacksonville, Duval County, St. Johns County, and Miami-Dade County.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

---

## Step 2: Add Person Schema to site.ts

**File:** `src/lib/site.ts`

**Add this function at the end of the file (after `insuranceAgencyJsonLd()`):**

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

---

## Step 3: Inject Person Schema into Layout

**File:** `src/app/layout.tsx`

**Find this block (around line 51):**
```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = organizationJsonLd();
  const local = localBusinessJsonLd();
  const agency = insuranceAgencyJsonLd();
```

**Change to:**
```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = organizationJsonLd();
  const local = localBusinessJsonLd();
  const agency = insuranceAgencyJsonLd();
  const person = personJsonLd();
```

**Then find the script tags (around line 64-75) and add the person schema:**
```typescript
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(local) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(agency) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
```

**Don't forget to import `personJsonLd` at the top:**
```typescript
import { absoluteUrl, insuranceAgencyJsonLd, localBusinessJsonLd, organizationJsonLd, personJsonLd, site } from "@/lib/site";
```

---

## Step 4: Add Metadata to About Page

**File:** `src/app/about/page.tsx`

**Add at the top (after imports, before `export default function Page()`):**

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

## Step 5: Add Metadata to ACA Page

**File:** `src/app/aca/page.tsx`

**Add at the top:**

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

## Step 6: Add Metadata to Medicare Page

**File:** `src/app/medicare/page.tsx`

**Add at the top:**

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

## Step 7: Add Metadata to Duval County Page

**File:** `src/app/duval-county/page.tsx`

**Add at the top:**

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

## Step 8: Add Metadata to St. Johns County Page

**File:** `src/app/st-johns-county/page.tsx`

**Add at the top:**

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

## Step 9: Add Metadata to Miami Page

**File:** `src/app/miami/page.tsx`

**Add at the top:**

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

## Step 10: Add Metadata to ICHRA Page

**File:** `src/app/ichra/page.tsx`

**Add at the top:**

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

## Step 11: Add Metadata to Off-Exchange Page

**File:** `src/app/off-exchange/page.tsx`

**Add at the top:**

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

## Step 12: Add Metadata to Small Group Page

**File:** `src/app/small-group/page.tsx`

**Add at the top:**

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

## Validation Checklist

After implementing, run:

```bash
cd /Users/patrickmackiniv/Projects/vital-edge-insurance
npm run lint
npm run build
```

**Expected output:**
- ✓ Lint passes
- ✓ Build completes with no errors
- ✓ All routes compile successfully

**Manual checks:**
1. Visit `http://localhost:3000` and view page source
2. Search for `"Patrick Mackin IV"` in `<title>` tag → should appear
3. Search for `"@type": "Person"` in JSON-LD → should appear
4. Check OpenGraph meta tags → should include agent name

---

## Testing SEO Changes

**Tools:**
1. **View Page Source**: Right-click → View Page Source, search for "Patrick Mackin IV"
2. **Google Rich Results Test**: https://search.google.com/test/rich-results
3. **OpenGraph Preview**: https://www.opengraph.xyz/
4. **Schema Validator**: https://validator.schema.org/

**Expected Results:**
- Title tags include "Patrick Mackin IV"
- Meta descriptions mention agent name + location
- Person schema validates
- OpenGraph images have alt text with agent name

---

## Next Steps After Implementation

1. **Deploy to production** (Vercel will auto-deploy on push to main)
2. **Submit sitemap** to Google Search Console: `https://yourdomain.com/sitemap.xml`
3. **Monitor rankings** for:
   - "Patrick Mackin IV health insurance"
   - "Vital Edge Insurance Jacksonville"
   - "Duval County health insurance agent"
4. **Claim Google Business Profile** for Vital Edge Insurance
5. **Update LinkedIn** headline to include "Licensed Florida Health Insurance Agent"

---

**End of Implementation Guide**
