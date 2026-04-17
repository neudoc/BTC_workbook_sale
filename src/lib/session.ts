import { cookies } from "next/headers";

export type Role = "member" | "expert_pending" | "expert" | "admin";

export type Session = {
  name: string;
  email: string;
  role: Role;
};

const COOKIE_NAME = "bt_session";

export function getSession(): Session | null {
  const value = cookies().get(COOKIE_NAME)?.value;
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Session;
    if (!parsed?.email || !parsed?.role || !parsed?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasRole(session: Session | null, allowed: Role[]) {
  if (!session) return false;
  return allowed.includes(session.role);
}

