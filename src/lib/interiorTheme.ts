export type LifestylePhoto = "walking" | "gardening" | "cycling";

export const interiorPhotos = {
  walking: "/images/interior/walking.webp",
  gardening: "/images/interior/gardening.webp",
  cycling: "/images/interior/cycling.webp",
} as const satisfies Record<LifestylePhoto, string>;

// Choose by page family, not randomly, so imagery stays stable across visits.
export function photoForInteriorPage(eyebrow: string, title: string): LifestylePhoto {
  if (/resource|education|news|daily|blog|faq|working|family|caregiver|privacy|terms|referral/i.test(`${eyebrow} ${title}`)) return "gardening";
  if (/compare|ancillary|vision|dental|schedule|coverage options|secure external|enrollment|licensed state/i.test(`${eyebrow} ${title}`)) return "cycling";
  return "walking";
}
