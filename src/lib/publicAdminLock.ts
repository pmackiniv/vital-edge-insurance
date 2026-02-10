export function isPublicAdminLockEnabled(value: string | undefined): boolean {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return true;
  return normalized !== "false" && normalized !== "0" && normalized !== "off";
}

export function isLockedAdminPath(pathname: string): boolean {
  const normalized = pathname.trim();
  if (normalized === "/admin" || normalized.startsWith("/admin/")) {
    return true;
  }
  if (normalized === "/api/admin" || normalized.startsWith("/api/admin/")) {
    return true;
  }
  return false;
}

export function isAdminApiPath(pathname: string): boolean {
  const normalized = pathname.trim();
  return normalized === "/api/admin" || normalized.startsWith("/api/admin/");
}

export function canBypassAdminLock(
  pathname: string,
  providedKey: string | undefined,
  adminSecret: string | undefined,
): boolean {
  if (!isAdminApiPath(pathname)) return false;
  const expected = String(adminSecret ?? "").trim();
  const provided = String(providedKey ?? "").trim();
  if (!expected || !provided) return false;
  return expected === provided;
}
