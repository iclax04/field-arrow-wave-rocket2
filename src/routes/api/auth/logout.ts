import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { SESSION_TOKEN_COOKIE } from "@/lib/auth/server";

function cookieValue(header: string, name: string): string {
  const parts = header.split(";").map((part) => part.trim());
  const hit = parts.find((part) => part.startsWith(`${name}=`));
  if (!hit) return "";
  try {
    return decodeURIComponent(hit.slice(name.length + 1));
  } catch {
    return hit.slice(name.length + 1);
  }
}

function expired(name: string): string {
  return `${name}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

async function endSession(request: Request): Promise<Response> {
  const headers = new Headers({ "Cache-Control": "no-store", "content-type": "application/json" });
  for (const name of [
    SESSION_TOKEN_COOKIE,
    "__Host-grok-auth.session_data",
    "__Host-grok-auth.account_data",
    "better-auth.session_token",
    "better-auth.session_data",
  ]) {
    headers.append("set-cookie", expired(name));
  }

  try {
    const sql = await getSql();
    await sql.query(`
      create table if not exists revoked_sessions (
        token text primary key,
        user_id text not null,
        expires_at timestamptz not null
      )
    `);
    const cookie = request.headers.get("cookie") ?? "";
    const authHeader = request.headers.get("authorization") ?? "";
    const bearer = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";
    const cookieToken = cookieValue(cookie, SESSION_TOKEN_COOKIE);
    const tokens = [...new Set([bearer, cookieToken].filter(Boolean))];
    for (const token of tokens) {
      const rows = await sql.query<{ userId: string; expiresAt: string }>(
        `select "userId", "expiresAt" from "session" where "token" = $1`,
        [token],
      );
      const row = rows[0];
      if (!row) continue;
      const sessions = await sql.query<{ token: string; expiresAt: string }>(
        `select "token", "expiresAt" from "session" where "userId" = $1`,
        [row.userId],
      );
      for (const item of sessions) {
        await sql.query(
          `insert into revoked_sessions (token, user_id, expires_at) values ($1, $2, $3::timestamptz) on conflict (token) do nothing`,
          [item.token, row.userId, item.expiresAt],
        );
      }
      await sql.query(`delete from "session" where "userId" = $1`, [row.userId]);
      await sql.query(
        `insert into activity_log (user_id, kind, detail) values ($1, 'sign_out', 'Signed out')`,
        [row.userId],
      );
    }
  } catch (error) {
    console.error("[auth] sign-out failed", error);
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: ({ request }) => endSession(request),
    },
  },
});
