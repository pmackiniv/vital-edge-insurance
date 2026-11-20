export type MedicareNewsArticle = {
  slug: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  description: string;
  publishedDate: string;
  sourceAttribution: string;
  summaryPoints: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  framingQuestion?: string;
};

export const MANDATORY_CMS_DISCLAIMER =
  "We do not offer every plan available in your area. We represent many organizations which offer several products in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.";

export const LOOKUP_FALLBACK_LINE = "Can't find the plan you're looking for? Call me!";

export const PATRICK_POSITIONING_LINE =
  "I am Patrick Mackin IV, founder of Vital Edge Insurance and an independent licensed Medicare broker (NPN 21729046, FL License #G275791) serving clients across 13 states. I am the product: a real person who works for my clients all through 2027 and for the rest of their lives, not someone who disappears after an enrollment.";

export const medicareNewsArticles: MedicareNewsArticle[] = [
  {
    slug: "glp-1-bridge-program",
    eyebrow: "2027 Medicare Drug Coverage News",
    title: "Medicare GLP-1 Bridge Program: $50/Month Coverage Through December 31, 2027",
    metaTitle: "Medicare GLP-1 Bridge Program ($50/Month Through 2027) | Vital Edge Insurance",
    description:
      "Plain-language breakdown of the Medicare GLP-1 Bridge Program, where eligible Part D enrollees can access certain weight-management GLP-1 medications for $50 a month through December 31, 2027.",
    publishedDate: "2026-11-19",
    sourceAttribution: "CMS Medicare GLP-1 Bridge Program guidance",
    summaryPoints: [
      "Eligible Part D enrollees can get certain weight-management GLP-1 medications for $50 a month.",
      "That $50 monthly rate runs through December 31, 2027.",
      "Eligibility rules apply and plans do not all handle it the same way, so reviewing your exact coverage and pharmacy setup matters.",
    ],
    sections: [
      {
        heading: "What the GLP-1 Bridge Program Actually Covers",
        paragraphs: [
          "Medicare has a GLP-1 Bridge Program that gives eligible Part D enrollees a way to get certain weight-management GLP-1 medications for $50 a month through December 31, 2027.",
          "For seniors who have been paying steep out-of-pocket costs or waiting for clearer Medicare drug rules, this is genuinely good news. That said, eligibility rules apply and not every Part D plan handles coverage, prior authorizations, or preferred pharmacies the same way.",
        ],
      },
      {
        heading: "Why Checking Your Specific Coverage Matters Before December 7",
        paragraphs: [
          "Before assuming a medication is covered automatically, I always walk through your exact prescription list, your preferred pharmacy, and your ZIP code. The right plan fit starts with keeping your doctors and covering your prescriptions cleanly.",
          "Once we put the right plan in place, I stay in your corner all through 2027 and for the rest of your life to help with pharmacy questions, prior authorization follow-up, and annual reviews.",
        ],
      },
    ],
  },
  {
    slug: "medicare-shared-savings-program-2027",
    eyebrow: "2027 Medicare Care Coordination News",
    title: "Medicare Shared Savings Program: $2.5 Billion Saved and New April 1, 2027 Cost Reductions",
    metaTitle: "Medicare Shared Savings Program ($2.5B Saved & Apr 2027 OOP Reductions) | Vital Edge Insurance",
    description:
      "The Medicare Shared Savings Program saved $2.5 billion in 2025 across 12.6 million people, and starting April 1, 2027 approved care organizations can reduce or eliminate beneficiary out-of-pocket costs for certain items and services.",
    publishedDate: "2026-11-19",
    sourceAttribution: "CMS Medicare Shared Savings Program 2025 results and 2027 rules",
    summaryPoints: [
      "The Medicare Shared Savings Program saved $2.5 billion in net savings in 2025, its largest year ever.",
      "The program currently serves 12.6 million Medicare beneficiaries.",
      "Starting April 1, 2027, approved care organizations can reduce or even eliminate beneficiary out-of-pocket costs for certain items and services, depending on care setup and doctor participation.",
    ],
    sections: [
      {
        heading: "Why This Record Savings Year Matters to Beneficiaries",
        paragraphs: [
          "The Medicare Shared Savings Program saved $2.5 billion in 2025, its largest year ever, and serves 12.6 million people nationwide. When doctors and care teams coordinate care well, Medicare spends less and patients get steadier follow-through.",
          "Starting April 1, 2027, approved care organizations in the program can reduce or even eliminate what beneficiaries pay out of pocket for certain items and services.",
        ],
      },
      {
        heading: "How to Know If Your Doctors Participate",
        paragraphs: [
          "Whether these out-of-pocket reductions apply to you depends on how your care is set up and which programs your doctors take part in. That is one of the biggest reasons I never rush people through a quick phone script.",
          "I take the time to check your doctors and prescriptions alongside your ZIP code, and I keep working for my clients all through 2027 and for the rest of their lives as programs like this roll out.",
        ],
      },
    ],
  },
  {
    slug: "2027-medicare-part-b-premium",
    eyebrow: "2027 CMS Premium Announcement",
    title: "2027 Medicare Part B Premium Rises to $209.40/Month: What You Can Still Review Before December 7",
    metaTitle: "2027 Medicare Part B Premium ($209.40/Month Standard) | Vital Edge Insurance",
    description:
      "CMS announced the 2027 standard Part B premium is $209.40 a month (up $6.50), with higher income brackets paying up to $711.80 a month. Learn what cannot be changed and what plan fit you can review before AEP ends December 7.",
    publishedDate: "2026-11-19",
    sourceAttribution: "CMS 2027 Medicare Part B Premium Announcement (released November 17, 2026)",
    summaryPoints: [
      "The standard 2027 Medicare Part B premium is $209.40 a month, up $6.50 from 2026.",
      "Higher income brackets pay up to $711.80 a month at the top, an increase of up to $21.90 a month.",
      "The premium comes straight out of your Social Security check and cannot be changed, but your plan fit around it can still be reviewed before AEP ends December 7.",
    ],
    sections: [
      {
        heading: "The Exact 2027 Part B Numbers Announced by CMS",
        paragraphs: [
          "CMS announced that the standard Medicare Part B premium for 2027 is $209.40 a month, up $6.50 from 2026. Higher income brackets pay more, up to $711.80 a month at the top, which is an increase of up to $21.90 a month.",
          "For most beneficiaries, that Part B premium is deducted straight from the monthly Social Security check. Nobody can change the federal Part B premium itself.",
        ],
      },
      {
        heading: "What You Can Control Before AEP Closes on December 7",
        paragraphs: [
          "While the Part B premium itself is set by CMS, you can still review whether the Medicare plan built around it is the right fit for your budget, your doctors, and your prescriptions before the Annual Enrollment Period ends on December 7.",
          "A clear side-by-side ZIP code review takes just a few minutes, and you get a real licensed broker who stays in your corner all through 2027 and for life.",
        ],
      },
    ],
  },
  {
    slug: "2027-otc-allowances-falling",
    eyebrow: "2027 Medicare Advantage Benefit Changes",
    title: "2027 Medicare Advantage OTC Allowances Are Falling: 58% of Plans vs. 66.3% in 2026",
    metaTitle: "2027 Medicare Advantage OTC Allowances Falling (58% vs 66.3%) | Vital Edge Insurance",
    description:
      "Only 58% of Medicare Advantage plans include an over-the-counter allowance in 2027, down from 66.3% in 2026 per MoneyGeek analysis of CMS plan files. Review your 2027 plan before December 7.",
    publishedDate: "2026-11-19",
    sourceAttribution: "MoneyGeek analysis of 2027 CMS plan files",
    framingQuestion: "Is your OTC allowance being dramatically reduced?",
    summaryPoints: [
      "Only 58% of Medicare Advantage plans include an over-the-counter (OTC) allowance in 2027, down from 66.3% in 2026.",
      "Most of the drop comes from returning plans quietly cutting the benefit back rather than plans disappearing.",
      "Anyone who uses that card for vitamins, pain relief, and everyday health items could lose real money over a year without checking their 2027 notice.",
    ],
    sections: [
      {
        heading: "Is Your OTC Allowance Being Dramatically Reduced?",
        paragraphs: [
          "According to a MoneyGeek analysis of CMS plan files, only 58% of Medicare Advantage plans include an over-the-counter allowance in 2027, down from 66.3% in 2026.",
          "Most of that drop is not from plans shutting down completely. It is returning plans quietly cutting the benefit back for 2027. If you rely on that allowance for vitamins, pain relief, and everyday health items, a quiet cut adds up to real money over 12 months.",
        ],
      },
      {
        heading: "Check Your 2027 Plan Lineup Before December 7",
        paragraphs: [
          "Never assume your current plan kept the same extras for 2027. Take a few minutes to check your ZIP code, confirm that your doctors stay in network, verify your prescriptions, and see how your 2027 benefits compare.",
          "I work one-on-one with clients across 13 states, and I stay with you all through 2027 and for life so benefit surprises never catch you off guard.",
        ],
      },
    ],
  },
  {
    slug: "medicare-advantage-appeals-win-rate",
    eyebrow: "Medicare Beneficiary Rights & Advocacy",
    title: "80.7% of Appealed Medicare Advantage Denials Are Overturned: Know Your 65-Day Window",
    metaTitle: "80.7% of Medicare Advantage Appeals Win (65-Day Window) | Vital Edge Insurance",
    description:
      "A KFF analysis of 2024 appeals found 80.7% of appealed Medicare Advantage prior-authorization denials were overturned in full or in part. Beneficiaries have 65 days from the denial notice date to appeal.",
    publishedDate: "2026-11-19",
    sourceAttribution: "KFF analysis of 2024 Medicare Advantage prior-authorization appeals",
    summaryPoints: [
      "When a Medicare Advantage prior-authorization denial is appealed, 80.7% of appeals are overturned in full or in part (KFF analysis of 2024 appeals).",
      "A denial letter is not the final word.",
      "Beneficiaries have 65 days from the date on the denial notice to appeal to the plan.",
    ],
    sections: [
      {
        heading: "Why a Denial Letter Is Not the Final Word",
        paragraphs: [
          "A KFF analysis of 2024 Medicare Advantage appeals found that when a prior-authorization denial is appealed, it is overturned 80.7% of the time, in full or in part.",
          "Most people never file an appeal because nobody tells them those numbers or explains the deadline. Beneficiaries have 65 days from the date on the denial notice to appeal to the plan.",
        ],
      },
      {
        heading: "Why Having a Real Broker in Your Corner Matters All Year",
        paragraphs: [
          "Anyone can enroll you and disappear once the application goes through. Having a real person in your corner when a denial letter shows up in your mailbox is the entire point of working with an independent broker.",
          "I work for my clients all through 2027 and for the rest of their lives, helping you understand your appeal window, check your doctors and prescriptions every year, and protect your coverage long after enrollment day.",
        ],
      },
    ],
  },
];

export const medicareNewsSlugs = medicareNewsArticles.map((article) => article.slug);

export function getMedicareNewsArticle(slug: string) {
  return medicareNewsArticles.find((article) => article.slug === slug);
}
