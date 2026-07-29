import { GOOGLE_BUSINESS_PROFILE_REVIEW_PATH } from "@/lib/googleBusinessProfile";

export const PLANENROLL = "https://www.sunfirematrix.com/app/consumer/medicareadvocates/21729046/#/";
export const UHONE_ANCILLARY = "https://shop.uhone.com/en/quote/census?brokerid=AA5620604";
export const ALLSTATE_HEALTH_SOLUTIONS =
  "https://customer.enroll.natgenhealth.com/quick-quote/?agent=CfDJ8FIfQXHyEOZEm91JXGawb_HZSIuV-qXpMQ3xIPcSLZtjt_k9FumEyZoGRRPlQ5KlwyIAA80toXG285u3amEHnPq1Sw&product=all-products";
export const GBP_REVIEWS = GOOGLE_BUSINESS_PROFILE_REVIEW_PATH;
export const FACEBOOK = "https://www.facebook.com/pmackiniv";
export const INSTAGRAM = "https://www.instagram.com/pmackiniv/";
export const LINKEDIN_PERSONAL = "https://www.linkedin.com/in/patrick-mackin-iv-297574187";
export const LINKEDIN_COMPANY_PUBLIC = "https://www.linkedin.com/company/111003981/";

export function externalLinkProps() {
  return {
    target: "_blank",
    rel: "noopener noreferrer",
  };
}
