type AdminAuthResult =
  | { ok: true }
  | { ok: false; status: number; body: { ok: false; error: string } };

export function requireAdminKey(req: Request): AdminAuthResult {
  const secret = process.env.ADMIN_API_KEY?.trim() || process.env.ADMIN_SECRET?.trim();
  if (!secret) {
    return { ok: false, status: 503, body: { ok: false, error: "Admin API key is not configured." } };
  }

  const url = new URL(req.url);
  const provided = url.searchParams.get("key")?.trim() || req.headers.get("x-admin-key")?.trim();
  if (!provided || provided !== secret) {
    return { ok: false, status: 401, body: { ok: false, error: "Unauthorized." } };
  }

  return { ok: true };
}
