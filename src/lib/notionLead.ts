export type NotionLeadPayload = {
  topic: string;
  county: string;
  state?: string;
  zip?: string;
  contactMethod: string;
  message: string;
  receivedAtIso: string;
  leadSource?: string;
  pageSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  linkedinReferral?: boolean;
  eventReferral?: boolean;
  partnerReferral?: boolean;
  leadCategory?: string;
  consentTimestamp?: string;
  permissionToContact?: boolean;
  permissionToContactMethod?: string;
  permissionToContactText?: string;
  permissionToContactVersion?: string;
  automatedContactConsent?: boolean;
  automatedContactConsentText?: string;
  automatedContactConsentVersion?: string;
};

export type NotionSyncResult = {
  status: "sent" | "skipped" | "failed";
  reason?: string;
  ok?: boolean;
  skipped?: boolean;
};

export async function syncLeadToNotion(payload: NotionLeadPayload): Promise<NotionSyncResult> {
  const apiKey = process.env.NOTION_API_KEY?.trim();
  const databaseId = process.env.NOTION_DATABASE_ID?.trim();

  if (!apiKey || !databaseId) {
    return { status: "skipped", reason: "notion_not_configured", ok: false, skipped: true };
  }

  const titleLabel = `Website – ${payload.topic || "General"} – ${payload.receivedAtIso.slice(0, 10)}`;
  const messageWithAuditDetails = [
    payload.message || "",
    "",
    "Permission to Contact audit:",
    `Permission to Contact: ${payload.permissionToContact ? "yes" : "no"}`,
    `Contact method captured: ${payload.permissionToContactMethod || payload.contactMethod || "N/A"}`,
    `PTC version: ${payload.permissionToContactVersion || "N/A"}`,
    payload.permissionToContactText ? `PTC text: ${payload.permissionToContactText}` : "",
    `Automated contact consent: ${payload.automatedContactConsent ? "yes" : "no"}`,
    `Automated consent version: ${payload.automatedContactConsentVersion || "N/A"}`,
    payload.automatedContactConsentText ? `Automated consent text: ${payload.automatedContactConsentText}` : "",
    "",
    "Lead source and routing:",
    `Lead category: ${payload.leadCategory || "N/A"}`,
    `Lead source: ${payload.leadSource || "Website"}`,
    `Page source: ${payload.pageSource || "N/A"}`,
    `State: ${payload.state || "N/A"}`,
    `ZIP: ${payload.zip || "N/A"}`,
    `UTM source: ${payload.utmSource || "N/A"}`,
    `UTM medium: ${payload.utmMedium || "N/A"}`,
    `UTM campaign: ${payload.utmCampaign || "N/A"}`,
    `LinkedIn referral: ${payload.linkedinReferral ? "yes" : "no"}`,
    `Event referral: ${payload.eventReferral ? "yes" : "no"}`,
    `Partner referral: ${payload.partnerReferral ? "yes" : "no"}`,
    `Consent timestamp: ${payload.consentTimestamp || payload.receivedAtIso}`,
  ].filter(Boolean).join("\n");

  const body = {
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: titleLabel.slice(0, 2000) } }],
      },
      Topic: {
        rich_text: [{ text: { content: (payload.topic || "General inquiry").slice(0, 2000) } }],
      },
      County: {
        rich_text: [{ text: { content: (payload.county || "").slice(0, 2000) } }],
      },
      Contact: {
        rich_text: [{ text: { content: (payload.contactMethod || "").slice(0, 2000) } }],
      },
      Message: {
        rich_text: [{ text: { content: messageWithAuditDetails.slice(0, 2000) } }],
      },
      Source: {
        rich_text: [{ text: { content: (payload.leadSource || "Website").slice(0, 2000) } }],
      },
      Received: {
        date: { start: payload.receivedAtIso.slice(0, 19) },
      },
    },
  };

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { status: "failed", reason: `notion_api_${res.status}: ${errText.slice(0, 200)}`, ok: false };
    }

    return { status: "sent", ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { status: "failed", reason: message.slice(0, 200), ok: false };
  }
}
