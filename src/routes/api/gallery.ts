import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";
import { getSql } from "@/lib/db";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/gallery")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const view = url.searchParams.get("view") ?? "floor";
        const sql = await getSql();

        if (view === "floor") {
          const works = await sql.query(
            `select a.id, a.title, c.display_name as artist, c.username,
                    l.kind, l.price::text as price
             from artworks a
             join profiles c on c.user_id = a.creator_id
             left join listings l on l.artwork_id = a.id and l.status = 'active'
             where a.hidden = false and a.removed = false
             order by a.created_at desc
             limit 24`,
          );
          return json({ works });
        }

        if (view === "search") {
          const q = (url.searchParams.get("q") ?? "").trim().slice(0, 40);
          if (q.length < 2) return json({ studios: [] });
          const like = `%${q.replace(/[%_]/g, "")}%`;
          const studios = await sql.query(
            `select username, display_name, city
             from profiles
             where status = 'active' and role <> 'treasury'
               and (username ilike $1 or display_name ilike $1)
             order by display_name
             limit 12`,
            [like],
          );
          return json({ studios });
        }

        if (view === "me") {
          const session = await auth.api.getSession({ headers: request.headers });
          const userId = session?.user?.id;
          if (!userId) return json({ error: "Sign in required." }, 401);
          const profile = await sql.query(
            `select username, display_name, balance::text as balance, locked_balance::text as locked
             from profiles where user_id = $1`,
            [userId],
          );
          const activity = await sql.query(
            `select kind, detail, created_at from activity_log where user_id = $1 order by created_at desc limit 30`,
            [userId],
          );
          const minted = await sql.query<{ n: number }>(
            `select count(*)::int as n from artworks where creator_id = $1 and removed = false`,
            [userId],
          );
          return json({ profile: profile[0] ?? null, minted: minted[0]?.n ?? 0, activity });
        }

        return json({ error: "Unknown view. Use floor, search, or me." }, 400);
      },
    },
  },
});
