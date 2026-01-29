export function findSensitiveIdentifier(messageRaw: unknown): string | null {
  const message = String(messageRaw ?? "").trim();
  if (!message) return null;

  const lower = message.toLowerCase();

  if (/\b(ssn|social security|medicare id|medicare number|mbi)\b/.test(lower)) {
    return "Please remove SSN/Medicare ID (MBI) or other sensitive identifiers.";
  }

  if (/\b\d{3}-\d{2}-\d{4}\b/.test(message)) {
    return "Please remove SSN/Medicare ID (MBI) or other sensitive identifiers.";
  }

  if (/\d{9,}/.test(message)) {
    return "Please remove long ID numbers from the message.";
  }

  const mbiLike = message.match(/\b[A-Z0-9]{11}\b/gi);
  if (mbiLike?.some((token) => (token.match(/\d/g)?.length ?? 0) >= 2)) {
    return "Please remove Medicare ID (MBI) or other sensitive identifiers.";
  }

  return null;
}
