import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { pool } from "@/db";

export type PrivateRole = "admin" | "owner";

export interface SessionUser {
  username: string;
  role: PrivateRole;
}

const COOKIE = "noor_session";

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function checkPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const previous = Buffer.from(hash, "hex");
  return next.length === previous.length && timingSafeEqual(next, previous);
}

export async function ensurePrivateUsers() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_sessions (
      token TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      role TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `);

  const accounts = [
    { username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD, role: "admin" },
    { username: process.env.OWNER_USERNAME, password: process.env.OWNER_PASSWORD, role: "owner" },
  ].filter((account) => account.username && account.password);

  for (const account of accounts) {
    const passwordHash = hashPassword(account.password as string);
    await pool.query(
      `INSERT INTO app_users (username, password_hash, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (username)
       DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
      [account.username, passwordHash, account.role]
    );
  }
}

export async function loginPrivateUser(username: string, password: string): Promise<SessionUser | null> {
  await ensurePrivateUsers();
  const result = await pool.query("SELECT username, password_hash, role FROM app_users WHERE username = $1", [
    username.trim(),
  ]);
  const row = result.rows[0] as { username: string; password_hash: string; role: PrivateRole } | undefined;
  if (!row || !checkPassword(password, row.password_hash)) return null;
  if (row.role !== "admin" && row.role !== "owner") return null;

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await pool.query("INSERT INTO app_sessions (token, username, role, expires_at) VALUES ($1, $2, $3, $4)", [
    token,
    row.username,
    row.role,
    expires,
  ]);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
  return { username: row.username, role: row.role };
}

export async function currentPrivateUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  await ensurePrivateUsers();
  const result = await pool.query(
    "SELECT username, role FROM app_sessions WHERE token = $1 AND expires_at > NOW()",
    [token]
  );
  const row = result.rows[0] as SessionUser | undefined;
  return row ?? null;
}

export async function logoutPrivateUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (token) {
    await ensurePrivateUsers();
    await pool.query("DELETE FROM app_sessions WHERE token = $1", [token]);
  }
  cookieStore.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}


