import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME || "najans";
}

function getAdminPassword(): string {
  // IMPORTANT: set ADMIN_PASSWORD in your Vercel project environment
  // variables. The fallback below is only for local development.
  return process.env.ADMIN_PASSWORD || "noor-admin-123";
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "noor-quran-local-dev-secret-change-me";
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function signAdminToken(username: string): string {
  const payload = JSON.stringify({
    u: username,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  const body = Buffer.from(payload, "utf8").toString("base64url");
  const sig = createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = String(body?.username || "").trim();
    const password = String(body?.password || "");

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: "Please enter username and password." }, { status: 400 });
    }

    if (!safeEqual(username.toLowerCase(), getAdminUsername().toLowerCase()) || !safeEqual(password, getAdminPassword())) {
      // Small delay to slow down guessing
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json({ ok: false, error: "Wrong username or password." }, { status: 401 });
    }

    const token = signAdminToken(username);
    return NextResponse.json({ ok: true, username, token });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ ok: false, error: "Login failed. Please try again." }, { status: 500 });
  }
}
