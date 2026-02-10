export const ADMIN_SESSION_COOKIE = "ve_admin_session";

export type AdminSession = {
  email: string;
  exp: number;
};

function normalizeSecret(secret: string | undefined): string {
  return String(secret || "").trim();
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

async function signPayload(payloadBase64Url: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadBase64Url));
  return toBase64Url(new Uint8Array(signatureBuffer));
}

export function sessionTtlSeconds(): number {
  const raw = Number(process.env.ADMIN_UI_SESSION_TTL_HOURS || 12);
  const hours = Number.isFinite(raw) && raw > 0 ? raw : 12;
  return Math.floor(hours * 3600);
}

export async function createSessionToken(email: string): Promise<string> {
  const secret = normalizeSecret(process.env.ADMIN_UI_SESSION_SECRET);
  if (!secret) {
    throw new Error("ADMIN_UI_SESSION_SECRET is required for admin session signing.");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSession = {
    email: String(email || "").trim().toLowerCase(),
    exp: now + sessionTtlSeconds(),
  };

  const payloadBase64Url = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await signPayload(payloadBase64Url, secret);
  return `${payloadBase64Url}.${signature}`;
}

export async function verifySessionToken(token: string | undefined): Promise<AdminSession | null> {
  const secret = normalizeSecret(process.env.ADMIN_UI_SESSION_SECRET);
  if (!secret) return null;

  const value = String(token || "").trim();
  if (!value.includes(".")) return null;

  const [payloadBase64Url, providedSignature] = value.split(".");
  if (!payloadBase64Url || !providedSignature) return null;

  const expectedSignature = await signPayload(payloadBase64Url, secret);
  if (!safeEqual(expectedSignature, providedSignature)) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadBase64Url))) as AdminSession;
    if (!payload?.email || typeof payload.exp !== "number") return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return {
      email: payload.email,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}
