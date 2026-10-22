"use client";

// Client helpers for the private family/admin area.
// The token is issued by /api/admin/login (server checks ADMIN_USERNAME /
// ADMIN_PASSWORD env vars) and verified by /api/admin/me. Nothing secret
// lives in this client bundle.

export interface AdminSession {
  username: string;
  token: string;
}

const TOKEN_KEY = "noor-admin-token";
const USER_KEY = "noor-admin-user";

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    const username = window.localStorage.getItem(USER_KEY);
    if (token && username) return { username, token };
  } catch {
    // ignore
  }
  return null;
}

export function saveAdminSession(session: AdminSession) {
  try {
    window.localStorage.setItem(TOKEN_KEY, session.token);
    window.localStorage.setItem(USER_KEY, session.username);
  } catch {
    // ignore
  }
}

export function clearAdminSession() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
}

export async function verifyAdminSession(): Promise<{ isAdmin: boolean; username: string | null }> {
  const session = getAdminSession();
  if (!session) return { isAdmin: false, username: null };
  try {
    const res = await fetch("/api/admin/me", {
      headers: { Authorization: `Bearer ${session.token}` },
    });
    const data = await res.json();
    if (data?.isAdmin) return { isAdmin: true, username: data.username ?? session.username };
    clearAdminSession();
    return { isAdmin: false, username: null };
  } catch {
    return { isAdmin: false, username: null };
  }
}

export async function adminLogin(
  username: string,
  password: string
): Promise<{ ok: boolean; username?: string; token?: string; error?: string }> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok && data?.ok && data?.token) {
      saveAdminSession({ username: data.username, token: data.token });
      return { ok: true, username: data.username, token: data.token };
    }
    return { ok: false, error: data?.error || "Login failed. Please try again." };
  } catch {
    return { ok: false, error: "Could not reach the server. Check your connection." };
  }
}
