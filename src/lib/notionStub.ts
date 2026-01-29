type NotionQueuePayload = {
  from: string;
  to: string;
  body: string;
  sid: string;
};

export async function queueNotionStub(_payload: NotionQueuePayload) {
  // Stub only. Notion integration will be implemented after approval.
  void _payload;
  return null;
}
