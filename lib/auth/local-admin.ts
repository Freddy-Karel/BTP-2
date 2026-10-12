import "server-only";

import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { query } from "@/lib/db/postgres";

const COOKIE_NAME = "alliance_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  email: string;
  exp: number;
};

function getSecret() {
  return process.env.AUTH_SECRET || "dev-only-change-me";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function encodeSession(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodeSession(value?: string): SessionPayload | null {
  if (!value) return null;
  const [body, signature] = value.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!payload.email || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = pbkdf2Sync(password, salt, 210_000, 32, "sha256").toString("hex");
  return { salt, hash };
}

function verifyPassword(password: string, salt: string, hash: string) {
  const candidate = hashPassword(password, salt).hash;
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

async function ensureSeedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!email || !password) return;

  const existing = await query<{ id: number }>(
    "select id from admin_users where email = $1 limit 1",
    [email],
  );
  if (existing.rowCount) return;

  const { salt, hash } = hashPassword(password);
  await query(
    `insert into admin_users (email, password_salt, password_hash)
     values ($1, $2, $3)`,
    [email, salt, hash],
  );
}

export async function signInAdmin(email: string, password: string) {
  await ensureSeedAdmin();

  const result = await query<{
    email: string;
    password_salt: string;
    password_hash: string;
  }>(
    `select email, password_salt, password_hash
     from admin_users
     where email = $1
     limit 1`,
    [email],
  );

  const user = result.rows[0];
  if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
    return false;
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encodeSession({ email: user.email, exp }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return true;
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(COOKIE_NAME)?.value);
}

export async function updateLocalAdminPassword(email: string, password: string) {
  const { salt, hash } = hashPassword(password);
  await query(
    `update admin_users
     set password_salt = $2, password_hash = $3, updated_at = now()
     where email = $1`,
    [email, salt, hash],
  );
}

