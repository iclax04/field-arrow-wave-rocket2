import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getSql, type Sql } from "@/lib/db";
import { sendAccountNotice } from "@/lib/mail.server";

const scryptAsync = promisify(scrypt);
const COOKIE = "agora_admin";
const IDLE_MS = 30 * 60 * 1000;

export class AdminError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Admin = {
  id: string;
  email: string;
  name: string;
  role: "super" | "support";
  must_change_password: boolean;
};

const hits = new Map<string, number[]>();

function limit(key: string, max = 40) {
  const now = Date.now();
  const prev = (hits.get(key) ?? []).filter((at) => now - at < 60_000);
  if (prev.length >= max) throw new AdminError(429, "Too many requests. Try again shortly.");
  prev.push(now);
  hits.set(key, prev);
}

function ipOf(request: Request) {
  return (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "").split(",")[0]?.trim() || "";
}

function readCookie(request: Request) {
  const header = request.headers.get("cookie") ?? "";
  const hit = header.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`));
  return hit ? decodeURIComponent(hit.slice(COOKIE.length + 1)) : "";
}

function setCookie(token: string, request: Request, maxAge = 30 * 60) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function clearCookie(request: Request) {
  return setCookie("", request, 0);
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

async function checkPassword(password: string, stored: string) {
  const [salt, hex] = stored.split(":");
  if (!salt || !hex) return false;
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hex, "hex");
  return expected.length === buf.length && timingSafeEqual(expected, buf);
}

async function audit(sql: Sql, actor: string, action: string, target: string, detail: string, ip: string, oldValue = "", next = "") {
  await sql.query(
    `insert into audit_log (actor_id, action, target, detail, ip, old_value, new_value)
     values ($1, $2, $3, $4, $5, $6, $7)`,
    [actor, action, target, detail.slice(0, 500), ip.slice(0, 80), oldValue.slice(0, 500), next.slice(0, 500)],
  );
}

export async function ensureDefaultAdmin(sql: Sql) {
  const email = (process.env.ADMIN_EMAIL || "admin@agoragallery.nfts").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "AgoraDesk#2026";
  const rows = await sql.query<{ id: string; must_change_password: boolean }>(
    `select id, must_change_password from admin_accounts where email = $1`,
    [email],
  );
  const existing = rows[0];
  if (existing) {
    if (existing.must_change_password) {
      await sql.query(`update admin_accounts set must_change_password = false where id = $1`, [existing.id]);
    }
    return;
  }
  const any = await sql.query(`select id from admin_accounts limit 1`);
  if (any.length) return;
  await sql.query(
    `insert into admin_accounts (id, email, name, password_hash, role, must_change_password)
     values ($1, $2, 'Gallery admin', $3, 'super', false)`,
    [`admin:${randomBytes(8).toString("hex")}`, email, await hashPassword(password)],
  );
}

async function requireAdmin(request: Request, opts?: { allowPasswordChange?: boolean; superOnly?: boolean }) {
  const sql = await getSql();
  await ensureDefaultAdmin(sql);
  const token = readCookie(request);
  if (!token) throw new AdminError(401, "Sign in required.");
  const rows = await sql.query<Admin & { last_seen: string }>(
    `select a.id, a.email, a.name, a.role, a.must_change_password, s.last_seen
     from admin_sessions s join admin_accounts a on a.id = s.admin_id
     where s.token = $1 and s.expires_at > now()`,
    [token],
  );
  const admin = rows[0];
  if (!admin) throw new AdminError(401, "Sign in required.");
  if (Date.now() - new Date(admin.last_seen).getTime() > IDLE_MS) {
    await sql.query(`delete from admin_sessions where token = $1`, [token]);
    throw new AdminError(401, "Your admin session expired.");
  }
  if (admin.must_change_password && !opts?.allowPasswordChange) {
    throw new AdminError(403, "Change your password before continuing.");
  }
  if (opts?.superOnly && admin.role !== "super") throw new AdminError(403, "A super admin is required.");
  await sql.query(`update admin_sessions set last_seen = now(), expires_at = now() + interval '30 minutes' where token = $1`, [token]);
  return { sql, admin, token, ip: ipOf(request) };
}

async function userEmail(sql: Sql, userId: string) {
  const rows = await sql.query<{ email: string }>(`select "email" as email from "user" where "id" = $1`, [userId]);
  return rows[0]?.email ?? "";
}

async function notice(to: string, subject: string, text: string) {
  try {
    await sendAccountNotice(to, subject, text);
  } catch (error) {
    console.error("[admin mail]", error);
  }
}

async function resolveUser(sql: Sql, raw: string) {
  const key = raw.trim();
  if (!key) return "";
  const rows = await sql.query<{ user_id: string }>(
    `select p.user_id from profiles p
     left join "user" u on u."id" = p.user_id
     where p.user_id = $1 or lower(p.username) = lower($1) or lower(coalesce(u."email", '')) = lower($1)
     limit 1`,
    [key],
  );
  return rows[0]?.user_id ?? "";
}

function json(data: unknown, status = 200, headers?: Headers) {
  const out = headers ?? new Headers();
  out.set("content-type", "application/json; charset=utf-8");
  out.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { status, headers: out });
}

async function bodyOf(request: Request) {
  if (request.method === "GET" || request.method === "HEAD") return {} as Record<string, unknown>;
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function text(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function amountOf(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0 || n > 1_000_000) throw new AdminError(400, "Enter a valid ETH amount.");
  return n.toFixed(6);
}

export async function handleAdmin(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/admin\/?/, "").replace(/\/$/, "");
  const method = request.method.toUpperCase();
  try {
    limit(`admin:${ipOf(request)}:${path}`, path === "login" ? 10 : 60);
    if (path === "login" && method === "POST") return await login(request);
    if (path === "logout" && method === "POST") return await logout(request);
    if (path === "session" && method === "GET") return await session(request);
    if (path === "password" && method === "POST") return await changePassword(request);
    if (path === "overview" && method === "GET") return await overview(request);
    if (path === "users" && method === "GET") return await users(request, url);
    if (path === "users" && method === "PUT") return await saveUser(request);
    const userAction = path.match(/^users\/([^/]+)(?:\/(balance|reset-password|verify|suspend|ban|delete|sign-out|deposits|withdrawals|artworks|transactions|activity))?$/);
    if (userAction && method === "GET" && !userAction[2]) return await userDetail(request, decodeURIComponent(userAction[1]));
    if (userAction && method === "PUT" && !userAction[2]) return await saveUser(request, decodeURIComponent(userAction[1]));
    if (userAction && method === "POST" && userAction[2] === "balance") return await adjustBalance(request, decodeURIComponent(userAction[1]));
    if (userAction && method === "POST" && userAction[2]) return await userActionRoute(request, decodeURIComponent(userAction[1]), userAction[2]);
    if (userAction && method === "GET" && userAction[2]) return await userTab(request, decodeURIComponent(userAction[1]), userAction[2]);
    if (path === "deposits" && method === "GET") return await deposits(request, url);
    if (path === "deposits" && method === "POST") return await manualDeposit(request);
    const depositAction = path.match(/^deposits\/(\d+)\/(approve|reject)$/);
    if (depositAction && method === "POST") return await depositDecision(request, Number(depositAction[1]), depositAction[2] as "approve" | "reject");
    if (path === "withdrawals" && method === "GET") return await withdrawals(request, url);
    const withdrawalAction = path.match(/^withdrawals\/(\d+)\/(approve|reject|complete)$/);
    if (withdrawalAction && method === "POST") return await withdrawalDecision(request, Number(withdrawalAction[1]), withdrawalAction[2] as "approve" | "reject" | "complete");
    if (path === "deposit-address" && method === "GET") return await depositAddress(request);
    if (path === "deposit-address" && method === "PUT") return await saveDepositAddress(request);
    if (path === "artworks" && method === "GET") return await artworks(request);
    if (path === "artworks" && method === "POST") return await moderate(request);
    if (path === "transactions" && method === "GET") return await transactions(request, url);
    if (path === "transactions/export" && method === "GET") return await exportTransactions(request, url);
    if (path === "settings" && method === "GET") return await settings(request);
    if (path === "settings" && method === "PUT") return await saveSettings(request);
    if (path === "admins" && method === "GET") return await admins(request);
    if (path === "admins" && method === "POST") return await addAdmin(request);
    const adminRemove = path.match(/^admins\/(.+)$/);
    if (adminRemove && method === "DELETE") return await removeAdmin(request, decodeURIComponent(adminRemove[1]));
    if (path === "audit-log" && method === "GET") return await auditLog(request);
    return json({ error: "Not found.", status: 404 });
  } catch (error) {
    if (error instanceof AdminError) return json({ error: error.message }, error.status);
    console.error("[admin]", error);
    return json({ error: "Something went wrong." }, 500);
  }
}

async function login(request: Request) {
  const sql = await getSql();
  await ensureDefaultAdmin(sql);
  const body = await bodyOf(request);
  const email = text(body.email, 200).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const rows = await sql.query<{ id: string; password_hash: string; failed_attempts: number; locked_until: string | null; must_change_password: boolean }>(
    `select id, password_hash, failed_attempts, locked_until, must_change_password from admin_accounts where email = $1`,
    [email],
  );
  const account = rows[0];
  if (account?.locked_until && new Date(account.locked_until).getTime() > Date.now()) {
    throw new AdminError(423, "This admin account is locked. Try again in 15 minutes.");
  }
  if (!account || !(await checkPassword(password, account.password_hash))) {
    if (account) {
      const attempts = account.failed_attempts + 1;
      await sql.query(
        `update admin_accounts set failed_attempts = $2, locked_until = case when $2 >= 5 then now() + interval '15 minutes' else null end where id = $1`,
        [account.id, attempts],
      );
    }
    throw new AdminError(401, "Email or password is incorrect.");
  }
  await sql.query(`update admin_accounts set failed_attempts = 0, locked_until = null where id = $1`, [account.id]);
  const token = randomBytes(32).toString("hex");
  await sql.query(
    `insert into admin_sessions (token, admin_id, expires_at, ip) values ($1, $2, now() + interval '30 minutes', $3)`,
    [token, account.id, ipOf(request)],
  );
  await audit(sql, account.id, "admin.login", account.id, "Signed in", ipOf(request));
  const headers = new Headers();
  headers.append("set-cookie", setCookie(token, request));
  return json({ ok: true, mustChange: account.must_change_password }, 200, headers);
}

async function logout(request: Request) {
  const sql = await getSql();
  const token = readCookie(request);
  if (token) {
    const rows = await sql.query<{ admin_id: string }>(`delete from admin_sessions where token = $1 returning admin_id`, [token]);
    if (rows[0]) await audit(sql, rows[0].admin_id, "admin.logout", rows[0].admin_id, "Signed out", ipOf(request));
  }
  const headers = new Headers();
  headers.append("set-cookie", clearCookie(request));
  return json({ ok: true }, 200, headers);
}

async function session(request: Request) {
  const { admin } = await requireAdmin(request, { allowPasswordChange: true });
  const headers = new Headers();
  headers.append("set-cookie", setCookie(readCookie(request), request));
  return json({ admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role, mustChange: admin.must_change_password } }, 200, headers);
}

async function changePassword(request: Request) {
  const { sql, admin, ip } = await requireAdmin(request, { allowPasswordChange: true });
  const body = await bodyOf(request);
  const password = typeof body.password === "string" ? body.password : "";
  if (password.length < 8 || password.length > 72) throw new AdminError(400, "Password must be 8–72 characters.");
  await sql.query(`update admin_accounts set password_hash = $2, must_change_password = false where id = $1`, [admin.id, await hashPassword(password)]);
  await audit(sql, admin.id, "admin.password", admin.id, "Password changed", ip);
  return json({ ok: true });
}

async function overview(request: Request) {
  const { sql } = await requireAdmin(request);
  const users = await sql.query<{ n: number; bal: string }>(
    `select count(*)::int as n, coalesce(sum(balance),0)::text as bal from profiles where role in ('user','admin')`,
  );
  const pendingD = await sql.query<{ n: number }>(`select count(*)::int as n from deposits where status in ('pending','confirming')`);
  const pendingW = await sql.query<{ n: number }>(`select count(*)::int as n from withdrawals where status = 'pending'`);
  const works = await sql.query<{ n: number }>(`select count(*)::int as n from artworks where removed = false`);
  const mint = await sql.query<{ v: string }>(`select coalesce(sum(price),0)::text as v from transactions where kind = 'mint_fee'`);
  const activity = await sql.query(
    `select id, action, target, detail, ${iso("created_at")} as at from audit_log order by created_at desc limit 8`,
  );
  return json({
    users: users[0]?.n ?? 0,
    balances: users[0]?.bal ?? "0",
    pendingDeposits: pendingD[0]?.n ?? 0,
    pendingWithdrawals: pendingW[0]?.n ?? 0,
    artworks: works[0]?.n ?? 0,
    mintFees: mint[0]?.v ?? "0",
    activity,
  });
}

function iso(column: string) {
  return `to_char(${column} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;
}

async function users(request: Request, url: URL) {
  const { sql } = await requireAdmin(request);
  const q = text(url.searchParams.get("q"), 80);
  const status = text(url.searchParams.get("status"), 20);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1) || 1);
  const like = `%${q.replace(/[%_]/g, "")}%`;
  const rows = await sql.query(
    `select p.user_id, p.display_name, p.username, coalesce(u."email", '') as email, p.balance::text as balance,
            p.status, ${iso("p.created_at")} as joined
     from profiles p
     left join "user" u on u."id" = p.user_id
     where p.role <> 'treasury'
       and ($1 = '' or p.display_name ilike $2 or p.username ilike $2 or coalesce(u."email", '') ilike $2)
       and ($3 = '' or p.status = $3)
     order by p.created_at desc
     limit 20 offset $4`,
    [q, like, status, (page - 1) * 20],
  );
  const total = await sql.query<{ n: number }>(
    `select count(*)::int as n from profiles p left join "user" u on u."id" = p.user_id
     where p.role <> 'treasury'
       and ($1 = '' or p.display_name ilike $2 or p.username ilike $2 or coalesce(u."email", '') ilike $2)
       and ($3 = '' or p.status = $3)`,
    [q, like, status],
  );
  return json({ rows, page, total: total[0]?.n ?? 0 });
}

async function userDetail(request: Request, userId: string) {
  const { sql } = await requireAdmin(request);
  const rows = await sql.query(
    `select p.user_id, p.display_name, p.username, coalesce(u."email", '') as email, coalesce(u."emailVerified", false) as verified,
            p.phone, p.bio, p.avatar_url, p.wallet_address, p.deposit_address, p.use_platform_deposit,
            p.role, p.status, p.balance::text as balance, p.locked_balance::text as locked
     from profiles p left join "user" u on u."id" = p.user_id
     where p.user_id = $1`,
    [userId],
  );
  if (!rows[0]) throw new AdminError(404, "User not found.");
  return json({ user: rows[0] });
}

async function saveUser(request: Request, userId?: string) {
  const { sql, admin, ip } = await requireAdmin(request);
  const body = await bodyOf(request);
  const id = userId || text(body.userId, 120);
  if (!id || id === "house:platform") throw new AdminError(400, "That account cannot be edited this way.");
  const current = await sql.query<{ role: string; status: string; display_name: string }>(
    `select role, status, display_name from profiles where user_id = $1`,
    [id],
  );
  if (!current[0]) throw new AdminError(404, "User not found.");
  const username = text(body.username, 24).toLowerCase();
  if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new AdminError(400, "Username is not valid.");
  const displayName = text(body.displayName, 80);
  if (!displayName) throw new AdminError(400, "Name is required.");
  const role = body.role === "admin" || body.role === "catalog" || body.role === "user" ? body.role : "user";
  if (admin.role !== "super" && role !== current[0].role) throw new AdminError(403, "A super admin is required to change roles.");
  const status = ["active", "suspended", "banned", "deleted"].includes(String(body.status)) ? String(body.status) : "active";
  const email = text(body.email, 200).toLowerCase();
  const avatar = text(body.avatarUrl, 400_000);
  await sql.query(
    `update profiles set username = $2, display_name = $3, bio = $4, phone = $5, avatar_url = $6,
       wallet_address = $7, role = $8, status = $9, use_platform_deposit = $10, deposit_address = $11
     where user_id = $1`,
    [id, username, displayName, text(body.bio, 600), text(body.phone, 32), avatar || null, text(body.wallet, 80), role, status, body.usePlatformDeposit !== false, text(body.depositAddress, 80) || null],
  );
  if (email) {
    try {
      await sql.query(`update "user" set "email" = $2, "name" = $3, "updatedAt" = now() where "id" = $1`, [id, email, displayName]);
    } catch {
      throw new AdminError(400, "That email is already in use.");
    }
  }
  await audit(sql, admin.id, "user.update", id, `${role}/${status}`, ip, current[0].display_name, displayName);
  return json({ ok: true });
}

async function adjustBalance(request: Request, userId: string) {
  const { sql, admin, ip } = await requireAdmin(request, { superOnly: true });
  const body = await bodyOf(request);
  const mode = body.mode === "add" || body.mode === "sub" ? body.mode : "set";
  const reason = text(body.reason, 240);
  if (reason.length < 3) throw new AdminError(400, "A reason is required.");
  const n = Number(body.amount);
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000) throw new AdminError(400, "Amount is not valid.");
  const rows = await sql.query<{ old: string; balance: string }>(
    `with locked as (
        select user_id, balance from profiles where user_id = $1 for update
      ),
      next as (
        select user_id, balance as old,
          case $2 when 'add' then balance + $3::numeric when 'sub' then balance - $3::numeric else $3::numeric end as value
        from locked
      ),
      upd as (
        update profiles p set balance = next.value
        from next
        where p.user_id = next.user_id and next.value >= 0 and next.value >= p.locked_balance
        returning p.balance::text as balance, next.old::text as old
      )
      select old, balance from upd`,
    [userId, mode, n.toFixed(6)],
  );
  if (!rows[0]) throw new AdminError(400, "Balance cannot sit below locked funds or zero.");
  await sql.query(
    `insert into transactions (buyer_id, price, kind, note) values ($1, $2::numeric, 'adjustment', $3)`,
    [userId, rows[0].balance, `${mode} ${n} ETH — ${reason}`],
  );
  await sql.query(
    `insert into notifications (user_id, body, href) values ($1, $2, '/dashboard')`,
    [userId, `Your balance is now ${rows[0].balance} ETH. ${reason}`],
  );
  await sql.query(
    `insert into activity_log (user_id, kind, detail) values ($1, 'profile', $2)`,
    [userId, `Balance ${mode} to ${rows[0].balance} ETH. ${reason}`],
  );
  await audit(sql, admin.id, "balance.adjust", userId, reason, ip, rows[0].old, rows[0].balance);
  return json({ ok: true, balance: rows[0].balance });
}

async function userActionRoute(request: Request, userId: string, action: string) {
  const { sql, admin, ip } = await requireAdmin(request, { superOnly: action === "delete" });
  if (action === "reset-password") {
    const body = await bodyOf(request);
    const password = typeof body.password === "string" ? body.password : "";
    if (password.length < 8) throw new AdminError(400, "Password must be at least 8 characters.");
    const accounts = await sql.query<{ id: string }>(`select "id" from "account" where "userId" = $1 and "providerId" = 'credential'`, [userId]);
    if (!accounts[0]) throw new AdminError(400, "This account has no password.");
    const { hashPassword: hash } = await import("better-auth/crypto");
    await sql.query(`update "account" set "password" = $2, "updatedAt" = now() where "id" = $1`, [accounts[0].id, await hash(password)]);
    await audit(sql, admin.id, "password.reset", userId, "Password replaced", ip);
    return json({ ok: true });
  }
  if (action === "verify") {
    await sql.query(`update "user" set "emailVerified" = true, "updatedAt" = now() where "id" = $1`, [userId]);
    await audit(sql, admin.id, "user.verify", userId, "Email verified by admin", ip);
    return json({ ok: true });
  }
  if (action === "suspend" || action === "ban" || action === "delete") {
    const status = action === "suspend" ? "suspended" : action === "ban" ? "banned" : "deleted";
    await sql.query(`update profiles set status = $2 where user_id = $1`, [userId, status]);
    await sql.query(`delete from "session" where "userId" = $1`, [userId]);
    await audit(sql, admin.id, `user.${action}`, userId, status, ip);
    return json({ ok: true });
  }
  if (action === "sign-out") {
    await sql.query(`delete from "session" where "userId" = $1`, [userId]);
    await audit(sql, admin.id, "user.signout", userId, "All sessions ended", ip);
    return json({ ok: true });
  }
  throw new AdminError(404, "Not found.");
}

async function userTab(request: Request, userId: string, tab: string) {
  const { sql } = await requireAdmin(request);
  if (tab === "deposits") {
    return json({ rows: await sql.query(`select id, amount::text as amount, tx_hash, status, ${iso("created_at")} as at from deposits where user_id = $1 order by created_at desc limit 50`, [userId]) });
  }
  if (tab === "withdrawals") {
    return json({ rows: await sql.query(`select id, amount::text as amount, destination, status, tx_hash, ${iso("created_at")} as at from withdrawals where user_id = $1 order by created_at desc limit 50`, [userId]) });
  }
  if (tab === "artworks") {
    return json({ rows: await sql.query(`select id, title, hidden, removed, ${iso("created_at")} as at from artworks where creator_id = $1 order by created_at desc limit 50`, [userId]) });
  }
  if (tab === "transactions") {
    return json({ rows: await sql.query(`select id, kind, price::text as price, note, ${iso("created_at")} as at from transactions where buyer_id = $1 or seller_id = $1 order by created_at desc limit 50`, [userId]) });
  }
  if (tab === "activity") {
    return json({ rows: await sql.query(`select id, kind, detail, ${iso("created_at")} as at from activity_log where user_id = $1 order by created_at desc limit 50`, [userId]) });
  }
  throw new AdminError(404, "Not found.");
}

async function deposits(request: Request, url: URL) {
  const { sql } = await requireAdmin(request);
  const filter = text(url.searchParams.get("status"), 20);
  const where = filter === "pending" ? "d.status in ('pending','confirming')" : filter === "approved" ? "d.status in ('approved','completed')" : filter === "rejected" ? "d.status in ('rejected','failed')" : "true";
  const rows = await sql.query(
    `select d.id, p.display_name, p.username, d.user_id, d.amount::text as amount, d.tx_hash, d.status, d.reject_reason, ${iso("d.created_at")} as at
     from deposits d join profiles p on p.user_id = d.user_id
     where ${where}
     order by d.created_at desc limit 100`,
  );
  return json({ rows });
}

async function depositDecision(request: Request, id: number, action: "approve" | "reject") {
  const { sql, admin, ip } = await requireAdmin(request);
  const body = await bodyOf(request);
  if (action === "reject") {
    const reason = text(body.reason, 240);
    if (reason.length < 3) throw new AdminError(400, "A reason is required.");
    const rows = await sql.query<{ user_id: string }>(
      `update deposits set status = 'rejected', reject_reason = $2, updated_at = now()
       where id = $1 and status in ('pending','confirming') returning user_id`,
      [id, reason],
    );
    if (!rows[0]) throw new AdminError(400, "That deposit is not pending.");
    await sql.query(`insert into notifications (user_id, body, href) values ($1, $2, '/deposit')`, [rows[0].user_id, `Deposit rejected: ${reason}`]);
    const email = await userEmail(sql, rows[0].user_id);
    if (email) await notice(email, "Deposit rejected", `Your deposit was rejected. Reason: ${reason}`);
    await audit(sql, admin.id, "deposit.reject", String(id), reason, ip);
    return json({ ok: true });
  }
  const nextAmount = body.amount == null || body.amount === "" ? null : amountOf(body.amount);
  const rows = await sql.query<{ user_id: string; amount: string }>(
    `with d as (
        select * from deposits where id = $1 and status in ('pending','confirming') for update
      ),
      upd as (
        update deposits set status = 'approved', amount = coalesce($2::numeric, amount), confirmations = greatest(confirmations, 1), updated_at = now()
        where id = (select id from d) returning user_id, amount
      ),
      cred as (
        update profiles set balance = balance + (select amount from upd)
        where user_id = (select user_id from upd) and exists (select 1 from upd)
        returning user_id
      ),
      tx as (
        insert into transactions (buyer_id, price, kind, tx_hash, note)
        select user_id, amount, 'deposit', (select tx_hash from d), 'Deposit approved' from upd
        where exists (select 1 from cred)
        returning id
      )
      select user_id, amount::text as amount from upd where exists (select 1 from tx)`,
    [id, nextAmount],
  );
  if (!rows[0]) throw new AdminError(400, "That deposit is not pending.");
  await sql.query(`insert into notifications (user_id, body, href) values ($1, $2, '/deposit')`, [rows[0].user_id, `Deposit of ${rows[0].amount} ETH was approved.`]);
  const email = await userEmail(sql, rows[0].user_id);
  if (email) await notice(email, "Deposit approved", `Your deposit of ${rows[0].amount} ETH was approved and added to your balance.`);
  await audit(sql, admin.id, "deposit.approve", String(id), rows[0].amount, ip);
  return json({ ok: true });
}

async function manualDeposit(request: Request) {
  const { sql, admin, ip } = await requireAdmin(request);
  const body = await bodyOf(request);
  const userId = await resolveUser(sql, text(body.userId, 200));
  const amount = amountOf(body.amount);
  const txHash = text(body.txHash, 80) || `0x${randomBytes(32).toString("hex")}`;
  const rows = await sql.query<{ id: number }>(
    `with ins as (
        insert into deposits (user_id, tx_hash, amount, confirmations, status)
        select $1, $2, $3::numeric, 12, 'approved' from profiles where user_id = $1
        returning id, user_id, amount, tx_hash
      ),
      cred as (
        update profiles set balance = balance + (select amount from ins)
        where user_id = (select user_id from ins)
        returning user_id
      )
      select id from ins where exists (select 1 from cred)`,
    [userId, txHash, amount],
  );
  if (!rows[0]) throw new AdminError(404, "User not found.");
  await sql.query(`insert into transactions (buyer_id, price, kind, tx_hash, note) values ($1, $2::numeric, 'deposit', $3, 'Manual deposit')`, [userId, amount, txHash]);
  await audit(sql, admin.id, "deposit.manual", userId, amount, ip);
  return json({ ok: true, id: rows[0].id });
}

async function withdrawals(request: Request, url: URL) {
  const { sql } = await requireAdmin(request);
  const filter = text(url.searchParams.get("status"), 20);
  const warn = await sql.query<{ withdrawal_warn_eth: string }>(`select withdrawal_warn_eth::text as withdrawal_warn_eth from settings where id = 1`);
  const limitEth = Number(warn[0]?.withdrawal_warn_eth ?? 5);
  const rows = await sql.query<{ id: number; user_id: string; display_name: string; amount: string; destination: string; status: string; tx_hash: string | null; at: string; seen: number }>(
    `select w.id, w.user_id, p.display_name, w.amount::text as amount, w.destination, w.status, w.tx_hash, ${iso("w.created_at")} as at,
            (select count(*)::int from withdrawals older where older.user_id = w.user_id and older.destination = w.destination and older.id <> w.id and older.status in ('approved','completed')) as seen
     from withdrawals w join profiles p on p.user_id = w.user_id
     where ($1 = '' or w.status = $1)
     order by case when w.status = 'pending' then 0 else 1 end, w.created_at desc limit 100`,
    [filter],
  );
  return json({
    limitEth,
    rows: rows.map((row) => {
      const fresh = row.seen === 0;
      const large = Number(row.amount) > limitEth;
      return {
        ...row,
        warning: fresh || large,
        warningNote: [fresh ? "New destination" : "", large ? "Above limit" : ""].filter(Boolean).join(" · "),
      };
    }),
  });
}

async function withdrawalDecision(request: Request, id: number, action: "approve" | "reject" | "complete") {
  const { sql, admin, ip } = await requireAdmin(request);
  const body = await bodyOf(request);
  if (action === "approve") {
    const rows = await sql.query<{ user_id: string; amount: string }>(
      `update withdrawals set status = 'approved', updated_at = now() where id = $1 and status = 'pending' returning user_id, amount::text as amount`,
      [id],
    );
    if (!rows[0]) throw new AdminError(400, "That withdrawal is not pending.");
    const email = await userEmail(sql, rows[0].user_id);
    if (email) await notice(email, "Withdrawal approved", `Your withdrawal of ${rows[0].amount} ETH was approved.`);
    await sql.query(`insert into notifications (user_id, body, href) values ($1, $2, '/withdraw')`, [rows[0].user_id, `Withdrawal of ${rows[0].amount} ETH approved.`]);
    await audit(sql, admin.id, "withdrawal.approve", String(id), rows[0].amount, ip);
    return json({ ok: true });
  }
  if (action === "reject") {
    const reason = text(body.reason, 240);
    if (reason.length < 3) throw new AdminError(400, "A reason is required.");
    const rows = await sql.query<{ user_id: string; amount: string }>(
      `with w as (select * from withdrawals where id = $1 and status in ('pending','approved') for update),
        rel as (
          update profiles set locked_balance = greatest(0, locked_balance - ((select amount from w) + (select network_fee from w)))
          where user_id = (select user_id from w) and exists (select 1 from w)
          returning user_id
        ),
        done as (
          update withdrawals set status = 'rejected', reason = $2, updated_at = now()
          where id = (select id from w) and exists (select 1 from rel)
          returning user_id, amount::text as amount
        )
        select user_id, amount from done`,
      [id, reason],
    );
    if (!rows[0]) throw new AdminError(400, "That withdrawal cannot be rejected.");
    const email = await userEmail(sql, rows[0].user_id);
    if (email) await notice(email, "Withdrawal rejected", `Your withdrawal of ${rows[0].amount} ETH was rejected and the funds were returned. Reason: ${reason}`);
    await sql.query(`insert into notifications (user_id, body, href) values ($1, $2, '/withdraw')`, [rows[0].user_id, `Withdrawal rejected: ${reason}`]);
    await audit(sql, admin.id, "withdrawal.reject", String(id), reason, ip);
    return json({ ok: true });
  }
  const txHash = text(body.txHash, 80);
  if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) throw new AdminError(400, "Enter the transaction hash.");
  const rows = await sql.query<{ user_id: string; amount: string }>(
    `with w as (select * from withdrawals where id = $1 and status = 'approved' for update),
      upd as (
        update profiles p
        set balance = p.balance - (w.amount + w.network_fee),
            locked_balance = greatest(0, p.locked_balance - (w.amount + w.network_fee))
        from w
        where p.user_id = w.user_id and p.balance >= (w.amount + w.network_fee)
        returning p.user_id
      ),
      done as (
        update withdrawals set status = 'completed', tx_hash = $2, updated_at = now()
        where id = (select id from w) and exists (select 1 from upd)
        returning user_id, amount::text as amount
      )
      select user_id, amount from done`,
    [id, txHash],
  );
  if (!rows[0]) throw new AdminError(400, "Approve the withdrawal before marking it complete.");
  await sql.query(
    `insert into transactions (buyer_id, price, kind, tx_hash, note) values ($1, $2::numeric, 'withdrawal', $3, 'Withdrawal completed')`,
    [rows[0].user_id, rows[0].amount, txHash],
  );
  const email = await userEmail(sql, rows[0].user_id);
  if (email) await notice(email, "Withdrawal sent", `Your withdrawal of ${rows[0].amount} ETH was sent. Transaction: ${txHash}`);
  await audit(sql, admin.id, "withdrawal.complete", String(id), txHash, ip);
  return json({ ok: true });
}

async function depositAddress(request: Request) {
  const { sql } = await requireAdmin(request);
  const settingsRow = await sql.query<{ platform_deposit_address: string }>(`select platform_deposit_address from settings where id = 1`);
  const history = await sql.query(`select id, address, actor_id, ${iso("created_at")} as at from deposit_address_history order by created_at desc limit 20`);
  let qr = "";
  const address = settingsRow[0]?.platform_deposit_address ?? "";
  if (address) {
    const mod = (await import("qrcode")) as { toString?: (text: string, opts: object) => Promise<string>; default?: { toString: (text: string, opts: object) => Promise<string> } };
    const toString = mod.toString ?? mod.default?.toString;
    if (toString) qr = (await toString(address, { type: "svg", margin: 1 })).replace(/<\?xml[^>]*>/, "");
  }
  return json({ address, qr, history });
}

async function saveDepositAddress(request: Request) {
  const { sql, admin, ip } = await requireAdmin(request, { superOnly: true });
  const body = await bodyOf(request);
  const raw = text(body.address, 80);
  const { getAddress } = await import("ethers");
  let address = "";
  if (raw) {
    try {
      address = getAddress(raw);
    } catch {
      throw new AdminError(400, "That address failed checksum validation.");
    }
  }
  const prev = await sql.query<{ platform_deposit_address: string }>(`select platform_deposit_address from settings where id = 1`);
  await sql.query(`update settings set platform_deposit_address = $1 where id = 1`, [address]);
  if (address) await sql.query(`insert into deposit_address_history (address, actor_id) values ($1, $2)`, [address, admin.id]);
  await audit(sql, admin.id, "deposit-address", "settings", address, ip, prev[0]?.platform_deposit_address ?? "", address);
  return json({ ok: true, address });
}

async function artworks(request: Request) {
  const { sql } = await requireAdmin(request);
  const rows = await sql.query(
    `select a.id, a.title, p.display_name as artist, a.hidden, a.removed, a.image_url, ${iso("a.created_at")} as at
     from artworks a join profiles p on p.user_id = a.creator_id
     order by a.created_at desc limit 100`,
  );
  return json({ rows });
}

async function moderate(request: Request) {
  const { sql, admin, ip } = await requireAdmin(request);
  const body = await bodyOf(request);
  const id = Number(body.id);
  const action = body.action === "hide" || body.action === "unhide" || body.action === "remove" ? body.action : "";
  if (!action || !Number.isInteger(id)) throw new AdminError(400, "Unknown action.");
  if (action === "hide") await sql.query(`update artworks set hidden = true where id = $1`, [id]);
  if (action === "unhide") await sql.query(`update artworks set hidden = false, removed = false where id = $1`, [id]);
  if (action === "remove") await sql.query(`update artworks set removed = true, hidden = true where id = $1`, [id]);
  await audit(sql, admin.id, `work.${action}`, String(id), action, ip);
  return json({ ok: true });
}

async function transactions(request: Request, url: URL) {
  const { sql } = await requireAdmin(request);
  const raw = text(url.searchParams.get("kind"), 40);
  const kind = raw === "purchase" ? "sale" : raw;
  const rows = await sql.query(
    `select t.id, t.kind, t.price::text as price, t.note, t.tx_hash, ${iso("t.created_at")} as at,
            b.display_name as buyer, s.display_name as seller
     from transactions t
     left join profiles b on b.user_id = t.buyer_id
     left join profiles s on s.user_id = t.seller_id
     where ($1 = '' or t.kind = $1)
     order by t.created_at desc limit 200`,
    [kind],
  );
  return json({ rows });
}

async function exportTransactions(request: Request, url: URL) {
  const { sql } = await requireAdmin(request);
  const raw = text(url.searchParams.get("kind"), 40);
  const kind = raw === "purchase" ? "sale" : raw;
  const rows = await sql.query<{ id: number; kind: string; price: string; note: string | null; tx_hash: string | null; at: string }>(
    `select id, kind, price::text as price, note, tx_hash, ${iso("created_at")} as at from transactions where ($1 = '' or kind = $1) order by created_at desc`,
    [kind],
  );
  const lines = ["id,kind,price,note,tx_hash,at", ...rows.map((row) => [row.id, row.kind, row.price, csv(row.note), csv(row.tx_hash), row.at].join(","))];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=transactions.csv" },
  });
}

function csv(value: string | null) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

async function settings(request: Request) {
  const { sql } = await requireAdmin(request);
  const rows = await sql.query(
    `select platform_fee_bps, mint_fee::text as mint_fee, min_withdrawal::text as min_withdrawal,
            auto_approve_under::text as auto_approve_under, auto_approve_enabled, support_email, announcement,
            withdrawal_warn_eth::text as withdrawal_warn_eth
     from settings where id = 1`,
  );
  return json({ settings: rows[0] });
}

async function saveSettings(request: Request) {
  const { sql, admin, ip } = await requireAdmin(request, { superOnly: true });
  const body = await bodyOf(request);
  const mintFee = Number(body.mintFee);
  const minW = Number(body.minWithdrawal);
  const feePct = Number(body.platformFeePct);
  const auto = Number(body.autoApproveUnder);
  const warn = Number(body.withdrawalWarnEth);
  if (![mintFee, minW, feePct, auto, warn].every((n) => Number.isFinite(n) && n >= 0)) throw new AdminError(400, "Enter valid numbers.");
  if (feePct > 20) throw new AdminError(400, "Platform fee must be 20% or less.");
  await sql.query(
    `update settings set mint_fee = $1::numeric, min_withdrawal = $2::numeric, platform_fee_bps = $3,
       auto_approve_under = $4::numeric, auto_approve_enabled = $5, support_email = $6, announcement = $7,
       withdrawal_warn_eth = $8::numeric
     where id = 1`,
    [mintFee.toFixed(6), minW.toFixed(6), Math.round(feePct * 100), auto.toFixed(6), body.autoApproveEnabled === true, text(body.supportEmail, 200), text(body.announcement, 240), warn.toFixed(6)],
  );
  await audit(sql, admin.id, "settings.save", "settings", "Updated settings", ip);
  return json({ ok: true });
}

async function admins(request: Request) {
  const { sql } = await requireAdmin(request, { superOnly: true });
  const rows = await sql.query(`select id, email, name, role, must_change_password, ${iso("created_at")} as at from admin_accounts order by created_at`);
  return json({ rows });
}

async function addAdmin(request: Request) {
  const { sql, admin, ip } = await requireAdmin(request, { superOnly: true });
  const body = await bodyOf(request);
  const email = text(body.email, 200).toLowerCase();
  const name = text(body.name, 80);
  const password = typeof body.password === "string" ? body.password : "";
  const role = body.role === "support" ? "support" : "super";
  if (!email.includes("@") || name.length < 2 || password.length < 8) throw new AdminError(400, "Name, email, and a password of at least 8 characters are required.");
  const id = `admin:${randomBytes(8).toString("hex")}`;
  try {
    await sql.query(
      `insert into admin_accounts (id, email, name, password_hash, role, must_change_password) values ($1, $2, $3, $4, $5, true)`,
      [id, email, name, await hashPassword(password), role],
    );
  } catch {
    throw new AdminError(400, "That email is already an admin.");
  }
  await audit(sql, admin.id, "admin.add", id, `${email} ${role}`, ip);
  return json({ ok: true, id });
}

async function removeAdmin(request: Request, id: string) {
  const { sql, admin, ip } = await requireAdmin(request, { superOnly: true });
  if (id === admin.id) throw new AdminError(400, "You cannot remove yourself.");
  const supers = await sql.query<{ n: number }>(`select count(*)::int as n from admin_accounts where role = 'super' and id <> $1`, [id]);
  const target = await sql.query<{ role: string }>(`select role from admin_accounts where id = $1`, [id]);
  if (target[0]?.role === "super" && (supers[0]?.n ?? 0) < 1) throw new AdminError(400, "Keep at least one super admin.");
  await sql.query(`delete from admin_accounts where id = $1`, [id]);
  await audit(sql, admin.id, "admin.remove", id, "Removed", ip);
  return json({ ok: true });
}

async function auditLog(request: Request) {
  const { sql } = await requireAdmin(request);
  const rows = await sql.query(
    `select id, actor_id, action, target, detail, ip, old_value, new_value, ${iso("created_at")} as at
     from audit_log order by created_at desc limit 200`,
  );
  return json({ rows });
}
