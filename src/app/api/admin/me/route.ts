import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "noor-quran-local-dev-secret-change-me";
}

function verifyToken(token: string): { username: string } | null {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;
    const expected = createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload?.u || typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return { username: String(payload.u) };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    return NextResponse.json({ isAdmin: false, username: null });
  }
  const session = verifyToken(token);
  if (!session) {
    return NextResponse.json({ isAdmin: false, username: null });
  }
  return NextResponse.json({ isAdmin: true, username: session.username });
}
