export const DATA_SHARING_RECIPIENT = "Vital Edge Licensed Agent" as const;
export const PERMISSION_TO_CONTACT_VERSION = "2026-07-01-ptc-v1" as const;
export const AUTOMATED_CONTACT_CONSENT_VERSION = "2026-07-01-auto-contact-v1" as const;

export const PERMISSION_TO_CONTACT_TEXT =
  "Please contact me by call, text, and/or email about my insurance request. Message and data rates may apply. I can reply STOP to opt out of texts." as const;

export const AUTOMATED_CONTACT_CONSENT_TEXT =
  "Optional: Vital Edge Insurance and Patrick Mackin IV may use automated technology, such as text reminders or dialing systems, to contact me about this request. This is optional and not required to buy coverage. I can opt out anytime." as const;

type LeadConsentInput = {
  consent?: boolean;
  dataSharingConsent?: boolean;
  dataSharingRecipient?: string;
  dataSharingEntities?: string[];
  leadTransferDisclosureAck?: boolean;
};

export function validateLeadConsent(input: LeadConsentInput): string | null {
  if (!input.consent) {
    return "Missing required contact consent.";
  }
  if (!input.leadTransferDisclosureAck) {
    return "Please acknowledge that your information will be provided to a licensed agent.";
  }
  if (!input.dataSharingConsent) {
    return "Please provide express written consent to share your information with a licensed agent.";
  }
  if ((input.dataSharingRecipient || "").trim() !== DATA_SHARING_RECIPIENT) {
    return "Please confirm the authorized data recipient before continuing.";
  }
  if (!Array.isArray(input.dataSharingEntities) || input.dataSharingEntities.length === 0) {
    return "Please confirm the list of entities authorized to receive your information.";
  }
  const normalizedEntities = input.dataSharingEntities.map((entity) => entity.trim().toLowerCase());
  if (!normalizedEntities.includes(DATA_SHARING_RECIPIENT.toLowerCase())) {
    return "Authorized data-sharing entities must include the licensed agent recipient.";
  }
  return null;
}
