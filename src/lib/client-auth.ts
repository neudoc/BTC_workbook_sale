export async function hasSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { session?: unknown };
    return Boolean(data?.session);
  } catch {
    return false;
  }
}

