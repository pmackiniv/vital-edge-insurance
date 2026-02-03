type NotionLeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  topic?: string;
};

export async function submitNotionLead(_payload: NotionLeadPayload) {
  return { ok: true };
}
