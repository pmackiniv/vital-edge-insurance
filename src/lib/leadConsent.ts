export const DATA_SHARING_RECIPIENT = "Vital Edge Licensed Agent" as const;

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
