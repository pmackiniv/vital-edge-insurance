export type ResourceContactMethod = "Call" | "Text" | "Email";

export function getResourceContact(method: ResourceContactMethod, phone: string, email: string) {
  const cleanPhone = phone.trim();
  const cleanEmail = email.trim();
  const phoneRequired = method !== "Email";
  const emailRequired = method === "Email";
  const primaryValue = emailRequired ? cleanEmail : cleanPhone;
  const additionalContact = emailRequired
    ? cleanPhone && `Phone: ${cleanPhone}`
    : cleanEmail && `Email: ${cleanEmail}`;
  return {
    phoneRequired,
    emailRequired,
    hasRequiredContact: Boolean(primaryValue),
    summary: [`${method}: ${primaryValue}`, additionalContact].filter(Boolean).join(" | "),
  };
}
