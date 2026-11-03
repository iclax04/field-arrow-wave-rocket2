import { o as __toESM } from "../_runtime.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-D0T8XjwZ.mjs";
import { i as getSql } from "./db-DWDn8PPZ.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market.functions-d1rXB66l.js
var ISO = (col) => `to_char(${col} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;
var PROFILE_COLS = `
  user_id, username, display_name, bio, city, phone, region, postal_code, avatar_url, wallet_address,
  deposit_address, role, status, site_url, x_handle,
  balance::text as balance, locked_balance::text as locked_balance,
  ${ISO("created_at")} as created_at
`;
var CARD_SELECT = `
  select a.id, a.token_id, a.title, a.description, a.image_url, a.media_kind, a.media_url,
    a.category_slug, a.royalty_bps, a.likes_count, a.featured, a.hidden, a.removed,
    a.creator_id, a.owner_id,
    c.username as creator_username, c.display_name as creator_name,
    o.username as owner_username, o.display_name as owner_name,
    l.id as listing_id, l.kind as listing_kind, l.price::text as price,
    ${ISO("l.ends_at")} as ends_at,
    (select b.amount::text from bids b where b.listing_id = l.id and b.status = 'leading' limit 1) as high_bid
`;
var CARD_FROM = `
  from artworks a
  join profiles c on c.user_id = a.creator_id
  join profiles o on o.user_id = a.owner_id
  left join listings l on l.artwork_id = a.id and l.status = 'active'
`;
var hits = /* @__PURE__ */ new Map();
function rateLimit(key, limit, windowMs) {
	const now = Date.now();
	const entry = hits.get(key);
	if (!entry || now - entry.t > windowMs) {
		if (hits.size > 4e3) hits.clear();
		hits.set(key, {
			n: 1,
			t: now
		});
		return;
	}
	entry.n += 1;
	if (entry.n > limit) throw new Error("Too many requests. Wait a moment.");
}
function text(value, max) {
	if (typeof value !== "string") return "";
	return value.trim().slice(0, max);
}
function like(value) {
	return `%${value.replace(/[%_]/g, "").slice(0, 80)}%`;
}
function posAmount(value, label) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n) || n <= 0 || n > 1e6) throw new Error(`${label} is not a valid amount.`);
	return n.toFixed(6);
}
function intId(value) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isInteger(n) || n <= 0 || n > 1e9) throw new Error("That record was not found.");
	return n;
}
async function shaHex(input) {
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function depositAddressFor(userId) {
	return `0x${(await shaHex(`oriel-deposit-v1:${userId}`)).slice(0, 40)}`;
}
function txHash() {
	const bytes = /* @__PURE__ */ new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return `0x${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}
function slug(input) {
	const base = input.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16);
	return base.length >= 3 ? base : "collector";
}
function assertData(data, kind) {
	if (!{
		image: /^data:image\/(jpeg|jpg|png|webp);base64,[a-z0-9+/=\s]+$/i,
		video: /^data:video\/(mp4|webm);base64,[a-z0-9+/=\s]+$/i,
		audio: /^data:audio\/(mpeg|mp3|wav|ogg|webm);base64,[a-z0-9+/=\s]+$/i
	}[kind].test(data)) throw new Error("That file type is not allowed.");
	if (data.length > 17e5) throw new Error("File is too large. Keep it under about 1 MB.");
}
async function qrFor(address) {
	const mod = await import("../_libs/qrcode.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const toString = mod.toString ?? mod.default?.toString;
	if (!toString) return "";
	return (await toString(address, {
		type: "svg",
		margin: 0,
		color: {
			dark: "#16130f",
			light: "#00000000"
		}
	})).replace(/<\?xml[^>]*>/, "");
}
async function loadSettings(sql) {
	const row = (await sql.query(`select platform_fee_bps, mint_fee::text as mint_fee, min_withdrawal::text as min_withdrawal,
            confirmations_required, auto_approve_under::text as auto_approve_under,
            hot_wallet_balance::text as hot_wallet_balance, hot_wallet_alert::text as hot_wallet_alert,
            network_fee::text as network_fee, featured_title, gallery_name, tagline, auto_approve_enabled
     from settings where id = 1`))[0];
	if (!row) throw new Error("Exchange settings are missing.");
	return row;
}
async function loadProfile(sql, userId) {
	return (await sql.query(`select ${PROFILE_COLS} from profiles where user_id = $1`, [userId]))[0] ?? null;
}
async function ensureProfile(sql, userId) {
	const existing = await loadProfile(sql, userId);
	if (existing) return existing;
	const user = (await sql.query(`select "name", "email", "image" from "user" where "id" = $1`, [userId]))[0];
	if (!user) throw new Error("Account not found.");
	let username = slug(user.name || "collector");
	for (let i = 0; i < 30; i += 1) {
		if (!(await sql.query(`select 1 from profiles where username = $1`, [username])).length) break;
		username = `${slug(user.name || "collector")}${i + 2}`.slice(0, 24);
	}
	const deposit = await depositAddressFor(userId);
	const wallet = `0x${(await shaHex(`oriel-wallet:${userId}`)).slice(0, 40)}`;
	await sql.query(`insert into profiles (
       user_id, username, display_name, avatar_url, deposit_address, wallet_address, balance, role, status
     ) values ($1, $2, $3, $4, $5, $6, 0, 'user', 'active')
     on conflict (user_id) do nothing`, [
		userId,
		username,
		(user.name || "Collector").slice(0, 80),
		user.image,
		deposit,
		wallet
	]);
	const created = await loadProfile(sql, userId);
	if (!created) throw new Error("Could not open a studio.");
	return created;
}
function assertActive(profile) {
	if (profile.status === "active") return;
	if (profile.status === "suspended") throw new Error("This studio is suspended.");
	throw new Error("This studio is closed.");
}
async function assertVerified(sql, userId) {
	if (!(await sql.query(`select "emailVerified" as verified from "user" where "id" = $1`, [userId]))[0]?.verified) throw new Error("Verify your email before you continue.");
}
async function notify(sql, userId, body, href) {
	if (!userId || userId.startsWith("house:")) return;
	await sql.query(`insert into notifications (user_id, body, href) values ($1, $2, $3)`, [
		userId,
		body.slice(0, 240),
		href
	]);
}
async function audit(sql, actor, action, target, detail) {
	await sql.query(`insert into audit_log (actor_id, action, target, detail) values ($1, $2, $3, $4)`, [
		actor,
		action,
		target,
		detail.slice(0, 500)
	]);
}
async function noteActivity(sql, userId, kind, detail) {
	if (!userId || userId.startsWith("house:")) return;
	await sql.query(`insert into activity_log (user_id, kind, detail) values ($1, $2, $3)`, [
		userId,
		kind,
		detail.slice(0, 240)
	]);
}
async function advanceDeposits(sql) {
	const settings = await loadSettings(sql);
	const required = Number(settings.confirmations_required) || 12;
	const open = await sql.query(`select id, extract(epoch from created_at) as created_epoch, confirmations
     from deposits where status in ('pending', 'confirming')`);
	const now = Date.now() / 1e3;
	for (const row of open) {
		const conf = Math.max(0, Math.min(required, Math.floor((now - Number(row.created_epoch)) / 1.25)));
		if (conf !== Number(row.confirmations) || conf >= required) await sql.query(`update deposits set confirmations = $2, status = 'confirming', updated_at = now()
         where id = $1 and status in ('pending', 'confirming')`, [row.id, conf]);
	}
}
async function settleOne(sql, listingId) {
	if (!(await sql.query(`select id from bids where listing_id = $1 and status = 'leading'`, [listingId])).length) {
		await sql.query(`update listings set status = 'ended'
       where id = $1 and status = 'active' and kind = 'auction' and ends_at <= now()`, [listingId]);
		return;
	}
	const row = (await sql.query(`with s as (select platform_fee_bps as fee_bps from settings where id = 1),
      lst as (
        select l.id as listing_id, l.artwork_id, l.seller_id, a.creator_id, a.royalty_bps, a.title
        from listings l
        join artworks a on a.id = l.artwork_id
        where l.id = $1 and l.status = 'active' and l.kind = 'auction' and l.ends_at <= now()
        for update of l
      ),
      cur as (
        select id, bidder_id, amount from bids where listing_id = $1 and status = 'leading'
      ),
      calc as (
        select lst.*, cur.id as bid_id, cur.bidder_id, cur.amount,
          case when lst.seller_id = lst.creator_id then 0::numeric
               else round(cur.amount * lst.royalty_bps / 10000.0, 6) end as royalty,
          round(cur.amount * (select fee_bps from s) / 10000.0, 6) as fee
        from lst, cur
      ),
      gate as (
        select 1 as ok from profiles p, calc c
        where p.user_id = c.bidder_id and p.balance >= c.amount and p.locked_balance >= c.amount
      ),
      deltas as (
        select user_id, sum(dbal) as dbal, sum(dlock) as dlock from (
          select bidder_id as user_id, -amount as dbal, -amount as dlock from calc
          union all
          select seller_id, amount - royalty - fee, 0::numeric from calc
          union all
          select creator_id, royalty, 0::numeric from calc where royalty > 0 and creator_id <> seller_id
          union all
          select 'house:platform'::text, fee, 0::numeric from calc where fee > 0
        ) raw group by user_id
      ),
      paid as (
        update profiles p
        set balance = p.balance + d.dbal,
            locked_balance = greatest(0, p.locked_balance + d.dlock)
        from deltas d
        where p.user_id = d.user_id and exists (select 1 from gate)
        returning p.user_id
      ),
      moved as (
        update artworks set owner_id = (select bidder_id from calc)
        where id = (select artwork_id from calc) and exists (select 1 from gate)
        returning id
      ),
      closed as (
        update listings set status = 'sold'
        where id = (select listing_id from calc) and exists (select 1 from gate)
        returning id
      ),
      won as (
        update bids set status = 'won'
        where id = (select bid_id from calc) and exists (select 1 from gate)
        returning id
      ),
      tx as (
        insert into transactions (artwork_id, buyer_id, seller_id, price, royalty_amount, platform_fee, seller_proceeds, kind)
        select artwork_id, bidder_id, seller_id, amount, royalty, fee, amount - royalty - fee, 'auction'
        from calc where exists (select 1 from gate)
        returning id
      )
      select c.artwork_id, c.title, c.seller_id, c.bidder_id, c.amount::text as amount
      from calc c
      where exists (select 1 from paid) and exists (select 1 from moved)
        and exists (select 1 from closed) and exists (select 1 from won) and exists (select 1 from tx)`, [listingId]))[0];
	if (!row) return;
	await notify(sql, row.seller_id, `Auction won on ${row.title}.`, `/art/${row.artwork_id}`);
	await notify(sql, row.bidder_id, `You won ${row.title}.`, `/art/${row.artwork_id}`);
}
async function prepare(sql) {
	await advanceDeposits(sql);
	const due = await sql.query(`select id from listings where status = 'active' and kind = 'auction' and ends_at <= now()`);
	for (const row of due) await settleOne(sql, row.id);
}
async function cards(sql, where, params) {
	return sql.query(`${CARD_SELECT} ${CARD_FROM} where ${where}`, params);
}
async function requireAdmin(sql, userId) {
	const profile = await ensureProfile(sql, userId);
	assertActive(profile);
	if (profile.role !== "admin") throw new Error("The desk is closed to this account.");
	return profile;
}
var getHome_createServerFn_handler = createServerRpc({
	id: "ae4a8ec054cbd0ecd5cf7fa52cd8908ae7664d47dedabf1a130d0fe106de5f39",
	name: "getHome",
	filename: "src/lib/market.functions.ts"
}, (opts) => getHome.__executeServer(opts));
var getHome = createServerFn({ method: "GET" }).handler(getHome_createServerFn_handler, async () => {
	const sql = await getSql();
	await prepare(sql);
	const settings = await loadSettings(sql);
	const featured = await cards(sql, `a.hidden = false and a.removed = false order by random() limit 8`, []);
	const floor = await cards(sql, `a.hidden = false and a.removed = false order by l.created_at desc nulls last, a.created_at desc limit 12`, []);
	const artists = await sql.query(`select p.username, p.display_name, p.city, p.bio,
            count(distinct a.id)::int as works,
            coalesce(sum(t.price) filter (where t.kind in ('sale','auction','offer')), 0)::text as volume
     from profiles p
     left join artworks a on a.creator_id = p.user_id and a.removed = false and a.hidden = false
     left join transactions t on t.seller_id = p.user_id
     where p.role = 'catalog' and p.status = 'active'
     group by p.user_id
     order by random()
     limit 8`);
	const categories = await sql.query(`select c.slug, c.name, count(a.id)::int as count
     from categories c
     left join artworks a on a.category_slug = c.slug and a.hidden = false and a.removed = false
     group by c.id order by c.sort, c.name`);
	const volume = await sql.query(`select coalesce(sum(price), 0)::text as volume from transactions where kind in ('sale','auction','offer')`);
	const works = await sql.query(`select count(*)::int as n from artworks where hidden = false and removed = false`);
	const collections = await sql.query(`select c.slug, c.name, c.blurb, count(a.id)::int as works,
            (select a2.image_url from collection_artworks ca2
             join artworks a2 on a2.id = ca2.artwork_id
             where ca2.collection_id = c.id and a2.hidden = false and a2.removed = false
             order by ca2.position limit 1) as cover
     from collections c
     left join collection_artworks ca on ca.collection_id = c.id
     left join artworks a on a.id = ca.artwork_id and a.hidden = false and a.removed = false
     group by c.id
     order by c.sort, c.name`);
	const stamp = await sql.query(`select (count(*)::text) as n from (
       select id from artworks
       union all
       select id from transactions
     ) s`);
	return {
		featuredTitle: settings.featured_title,
		galleryName: settings.gallery_name,
		tagline: settings.tagline,
		feeBps: settings.platform_fee_bps,
		featured,
		floor,
		artists,
		categories,
		collections,
		volume: volume[0]?.volume ?? "0",
		works: works[0]?.n ?? 0,
		stamp: stamp[0]?.n ?? "0",
		announcement: (await sql.query(`select announcement from settings where id = 1`))[0]?.announcement ?? ""
	};
});
var getCatalog_createServerFn_handler = createServerRpc({
	id: "7cb14b52a8e0c242dd1b1d3a6a7a892d3fb192cbb937d28ee11aaf2e3e0931ae",
	name: "getCatalog",
	filename: "src/lib/market.functions.ts"
}, (opts) => getCatalog.__executeServer(opts));
var getCatalog = createServerFn({ method: "GET" }).validator((input) => {
	const src = input ?? {};
	const kind = src.kind === "fixed" || src.kind === "auction" ? src.kind : "";
	const sort = src.sort === "price_asc" || src.sort === "price_desc" || src.sort === "ending" ? src.sort : "newest";
	const min = text(src.min, 20);
	const max = text(src.max, 20);
	if (min && !Number.isFinite(Number(min))) throw new Error("Minimum price is not valid.");
	if (max && !Number.isFinite(Number(max))) throw new Error("Maximum price is not valid.");
	return {
		q: text(src.q, 80),
		category: text(src.category, 40),
		artist: text(src.artist, 80),
		kind,
		sort,
		min: min ? Number(min) : null,
		max: max ? Number(max) : null
	};
}).handler(getCatalog_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await prepare(sql);
	return {
		works: await cards(sql, `a.hidden = false and a.removed = false
       and ($1 = '' or a.category_slug = $1)
       and ($2 = '' or a.title ilike $3 or c.display_name ilike $3 or c.username ilike $3)
       and ($4 = '' or c.username = $4 or c.display_name ilike $5)
       and ($6 = '' or l.kind = $6)
       and ($7::numeric is null or l.price >= $7::numeric)
       and ($8::numeric is null or l.price <= $8::numeric)
       order by
         case when $9 = 'price_asc' then l.price end asc nulls last,
         case when $9 = 'price_desc' then l.price end desc nulls last,
         case when $9 = 'ending' then l.ends_at end asc nulls last,
         a.created_at desc
       limit 60`, [
			data.category,
			data.q,
			like(data.q),
			data.artist,
			like(data.artist),
			data.kind,
			data.min,
			data.max,
			data.sort
		]),
		categories: await sql.query(`select slug, name from categories order by sort, name`)
	};
});
var getArtwork_createServerFn_handler = createServerRpc({
	id: "3e12606da1bae9870641b3562ad4728f1d5e17da11840cb74b232fb51ad257b0",
	name: "getArtwork",
	filename: "src/lib/market.functions.ts"
}, (opts) => getArtwork.__executeServer(opts));
var getArtwork = createServerFn({ method: "GET" }).validator((input) => intId(input)).handler(getArtwork_createServerFn_handler, async ({ data: id }) => {
	const sql = await getSql();
	await prepare(sql);
	const work = (await cards(sql, `a.id = $1 and a.removed = false and a.hidden = false`, [id]))[0];
	if (!work) return null;
	const history = await sql.query(`select t.id, t.price::text as price, t.kind, ${ISO("t.created_at")} as created_at,
              b.display_name as buyer_name, s.display_name as seller_name
       from transactions t
       left join profiles b on b.user_id = t.buyer_id
       left join profiles s on s.user_id = t.seller_id
       where t.artwork_id = $1 and t.kind in ('sale','auction','offer')
       order by t.created_at asc`, [id]);
	const offer = await sql.query(`select count(*)::int as n, max(amount)::text as top
       from offers where artwork_id = $1 and status = 'active'`, [id]);
	return {
		work,
		history,
		offerCount: offer[0]?.n ?? 0,
		topOffer: offer[0]?.top ?? null
	};
});
var getArtist_createServerFn_handler = createServerRpc({
	id: "9a3cc47f59973770f873ede7b156348286035d2fc2c2cb2a223789802bed9dd8",
	name: "getArtist",
	filename: "src/lib/market.functions.ts"
}, (opts) => getArtist.__executeServer(opts));
var getArtist = createServerFn({ method: "GET" }).validator((input) => text(input, 40).toLowerCase()).handler(getArtist_createServerFn_handler, async ({ data: username }) => {
	const sql = await getSql();
	await prepare(sql);
	const profile = (await sql.query(`select ${PROFILE_COLS} from profiles where username = $1 and role <> 'treasury' and status <> 'deleted'`, [username]))[0];
	if (!profile) return null;
	return {
		profile,
		created: await cards(sql, `a.creator_id = $1 and a.hidden = false and a.removed = false order by a.created_at desc`, [profile.user_id]),
		owned: await cards(sql, `a.owner_id = $1 and a.creator_id <> $1 and a.hidden = false and a.removed = false order by a.created_at desc`, [profile.user_id])
	};
});
var getActivity_createServerFn_handler = createServerRpc({
	id: "db4ae6d39eb1501245ec751fe6a81bd54d04b1b9a1ffda76d4413ea281ca3422",
	name: "getActivity",
	filename: "src/lib/market.functions.ts"
}, (opts) => getActivity.__executeServer(opts));
var getActivity = createServerFn({ method: "GET" }).handler(getActivity_createServerFn_handler, async () => {
	const sql = await getSql();
	await prepare(sql);
	const items = (await sql.query(`select t.id, t.kind, t.price::text as price, ${ISO("t.created_at")} as at,
            a.title, a.id as artwork_id, a.image_url,
            b.display_name as buyer_name, s.display_name as seller_name
     from transactions t
     left join artworks a on a.id = t.artwork_id
     left join profiles b on b.user_id = t.buyer_id
     left join profiles s on s.user_id = t.seller_id
     where t.kind in ('sale','auction','offer','mint')
     order by t.created_at desc limit 40`)).map((row) => ({
		id: `t-${row.id}`,
		at: row.at,
		href: row.artwork_id ? `/art/${row.artwork_id}` : "/activity",
		image: row.image_url,
		text: row.kind === "mint" ? `${row.buyer_name ?? "A studio"} minted ${row.title ?? "a work"}` : `${row.buyer_name ?? "A collector"} took ${row.title ?? "a work"} from ${row.seller_name ?? "a studio"} for ${Number(row.price).toFixed(2)} ETH`
	}));
	const bids = await sql.query(`select b.id, b.amount::text as amount, ${ISO("b.created_at")} as at,
            a.title, a.id as artwork_id, a.image_url, p.display_name as bidder
     from bids b
     join listings l on l.id = b.listing_id
     join artworks a on a.id = l.artwork_id
     join profiles p on p.user_id = b.bidder_id
     where b.status = 'leading' and a.hidden = false and a.removed = false
     order by b.created_at desc limit 12`);
	for (const bid of bids) items.push({
		id: `b-${bid.id}`,
		at: bid.at,
		href: `/art/${bid.artwork_id}`,
		image: bid.image_url,
		text: `${bid.bidder} bid ${Number(bid.amount).toFixed(2)} ETH on ${bid.title}`
	});
	items.sort((a, b) => a.at < b.at ? 1 : -1);
	return { items: items.slice(0, 40) };
});
var getMe_createServerFn_handler = createServerRpc({
	id: "e9d8cfea6297f7170a5aaeccfe282a2ab1e7a074f2d807f2f36b6702f1334f60",
	name: "getMe",
	filename: "src/lib/market.functions.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMe_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await prepare(sql);
	const profile = await ensureProfile(sql, context.userId);
	await sql.query(`insert into activity_log (user_id, kind, detail)
       select $1, 'login', 'Signed in'
       where not exists (
         select 1 from activity_log
         where user_id = $1 and kind = 'login' and created_at > now() - interval '6 hours'
       )`, [context.userId]);
	const settings = await loadSettings(sql);
	const emailRows = await sql.query(`select "email", "emailVerified" as verified from "user" where "id" = $1`, [context.userId]);
	const favs = await sql.query(`select artwork_id from favorites where user_id = $1`, [context.userId]);
	const notifications = await sql.query(`select id, body, href, read, ${ISO("created_at")} as created_at
       from notifications where user_id = $1 order by created_at desc limit 20`, [context.userId]);
	const admins = await sql.query(`select count(*)::int as n from profiles where role = 'admin'`);
	return {
		profile,
		email: emailRows[0]?.email ?? null,
		emailVerified: Boolean(emailRows[0]?.verified),
		favoriteIds: favs.map((f) => f.artwork_id),
		notifications,
		unread: notifications.filter((n) => !n.read).length,
		canClaimDesk: (admins[0]?.n ?? 0) === 0 && profile.role !== "admin" && profile.status === "active",
		qr: profile.deposit_address ? await qrFor(profile.deposit_address) : "",
		mintFee: settings.mint_fee,
		minWithdrawal: settings.min_withdrawal,
		networkFee: settings.network_fee,
		confirmationsRequired: Number(settings.confirmations_required) || 12
	};
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "b692f91edd540f170070111f4bf5bff76968eaea4398433c192598c5a8d8c26f",
	name: "markNotificationsRead",
	filename: "src/lib/market.functions.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	await (await getSql()).query(`update notifications set read = true where user_id = $1 and read = false`, [context.userId]);
	return { ok: true };
});
var updateMe_createServerFn_handler = createServerRpc({
	id: "1d6d86ff86e2dbc1348ef0314afe674b237453a8e602261e61388bcb26136d0b",
	name: "updateMe",
	filename: "src/lib/market.functions.ts"
}, (opts) => updateMe.__executeServer(opts));
var updateMe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const username = text(src.username, 24).toLowerCase();
	if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Username must be 3–24 letters, numbers, or underscores.");
	const displayName = text(src.displayName, 80);
	if (displayName.length < 1) throw new Error("Name is required.");
	const avatar = typeof src.avatar === "string" ? src.avatar : "";
	if (avatar) assertData(avatar, "image");
	const site = text(src.siteUrl, 200);
	if (site && !/^https:\/\/[^\s]+$/i.test(site)) throw new Error("Site must be an https link.");
	const handle = text(src.xHandle, 40).replace(/^@/, "");
	if (handle && !/^[A-Za-z0-9_]{1,40}$/.test(handle)) throw new Error("That X handle is not valid.");
	const wallet = text(src.wallet, 80);
	if (wallet && !/^0x[a-fA-F0-9]{40}$/.test(wallet)) throw new Error("That is not an Ethereum address.");
	const phone = text(src.phone, 20);
	const digits = phone.replace(/\D/g, "");
	if (phone && (digits.length < 10 || digits.length > 11)) throw new Error("Enter a 10-digit US phone number.");
	const region = text(src.region, 2).toUpperCase();
	if (region && !/^[A-Z]{2}$/.test(region)) throw new Error("Choose a US state.");
	const postal = text(src.postalCode, 10);
	if (postal && !/^\d{5}(-\d{4})?$/.test(postal)) throw new Error("Enter a 5-digit ZIP code.");
	return {
		username,
		displayName,
		bio: text(src.bio, 600),
		city: text(src.city, 80),
		phone,
		region,
		postalCode: postal,
		siteUrl: site,
		xHandle: handle,
		avatar,
		clearAvatar: src.clearAvatar === true,
		wallet
	};
}).handler(updateMe_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	rateLimit(`profile:${context.userId}`, 20, 6e4);
	const profile = await ensureProfile(sql, context.userId);
	assertActive(profile);
	if ((await sql.query(`select 1 from profiles where username = $1 and user_id <> $2`, [data.username, context.userId])).length) throw new Error("That username is taken.");
	let wallet = profile.wallet_address;
	if (data.wallet) {
		const { getAddress } = await import("../_libs/ethers.mjs").then((n) => n.t);
		try {
			wallet = getAddress(data.wallet);
		} catch {
			throw new Error("That address failed checksum validation.");
		}
	}
	const avatar = data.avatar ? data.avatar : data.clearAvatar ? null : profile.avatar_url;
	await sql.query(`update profiles set username = $2, display_name = $3, bio = $4, city = $5,
         phone = $6, region = $7, postal_code = $8,
         site_url = $9, x_handle = $10, avatar_url = $11, wallet_address = $12
       where user_id = $1`, [
		context.userId,
		data.username,
		data.displayName,
		data.bio,
		data.city,
		data.phone,
		data.region,
		data.postalCode,
		data.siteUrl || null,
		data.xHandle || null,
		avatar,
		wallet
	]);
	await sql.query(`update "user" set "name" = $2, "updatedAt" = now() where "id" = $1`, [context.userId, data.displayName]);
	await noteActivity(sql, context.userId, "profile", "Updated profile");
	return loadProfile(sql, context.userId);
});
var toggleFavorite_createServerFn_handler = createServerRpc({
	id: "e2e8428f8387e47ae1a158f3ad5be084a63e0d0868c6d463961cbe0e6c7a5154",
	name: "toggleFavorite",
	filename: "src/lib/market.functions.ts"
}, (opts) => toggleFavorite.__executeServer(opts));
var toggleFavorite = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(toggleFavorite_createServerFn_handler, async ({ context, data: artworkId }) => {
	const sql = await getSql();
	rateLimit(`fav:${context.userId}`, 40, 6e4);
	assertActive(await ensureProfile(sql, context.userId));
	const rows = await sql.query(`with existing as (
         select 1 as x from favorites where user_id = $1 and artwork_id = $2
       ),
       del as (
         delete from favorites
         where user_id = $1 and artwork_id = $2 and exists (select 1 from existing)
         returning 1
       ),
       ins as (
         insert into favorites (user_id, artwork_id)
         select $1, $2
         where not exists (select 1 from existing)
           and exists (select 1 from artworks where id = $2 and removed = false)
         on conflict do nothing
         returning 1
       ),
       upd as (
         update artworks
         set likes_count = greatest(0, likes_count + case
           when exists (select 1 from ins) then 1
           when exists (select 1 from del) then -1
           else 0 end)
         where id = $2
         returning likes_count
       )
       select likes_count, exists (select 1 from ins) as liked from upd`, [context.userId, artworkId]);
	return {
		likes: rows[0]?.likes_count ?? 0,
		on: Boolean(rows[0]?.liked)
	};
});
var mintWork_createServerFn_handler = createServerRpc({
	id: "061e28896f030a55c6366f1de014f12db2ac9413e31a6d3543ddab6599b5a46e",
	name: "mintWork",
	filename: "src/lib/market.functions.ts"
}, (opts) => mintWork.__executeServer(opts));
var mintWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const title = text(src.title, 80);
	if (title.length < 1) throw new Error("Give the work a title.");
	const description = text(src.description, 2e3);
	const category = text(src.category, 40);
	if (!category) throw new Error("Pick a category.");
	const royalty = Number(src.royaltyPct);
	if (!Number.isFinite(royalty) || royalty < 0 || royalty > 10) throw new Error("Royalty must be between 0 and 10%.");
	const mediaKind = src.mediaKind === "video" || src.mediaKind === "audio" ? src.mediaKind : "image";
	const imageData = typeof src.imageData === "string" ? src.imageData : "";
	assertData(imageData, "image");
	const mediaData = typeof src.mediaData === "string" && src.mediaData ? src.mediaData : null;
	if (mediaKind !== "image") {
		if (!mediaData) throw new Error("Add the video or audio file.");
		assertData(mediaData, mediaKind);
	}
	const listKind = src.listKind === "fixed" || src.listKind === "auction" ? src.listKind : "none";
	const price = listKind === "none" ? null : posAmount(src.price, "Price");
	const hours = Number(src.endsInHours ?? 24);
	if (listKind === "auction" && (!Number.isFinite(hours) || hours < 1 || hours > 336)) throw new Error("Auctions run from 1 to 336 hours.");
	return {
		title,
		description,
		category,
		royaltyBps: Math.round(royalty * 100),
		mediaKind,
		imageData,
		mediaData: mediaKind === "image" ? null : mediaData,
		listKind,
		price,
		hours: listKind === "auction" ? Math.round(hours) : null
	};
}).handler(mintWork_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	rateLimit(`mint:${context.userId}`, 8, 36e5);
	const profile = await ensureProfile(sql, context.userId);
	assertActive(profile);
	await assertVerified(sql, context.userId);
	if (!(await sql.query(`select 1 from categories where slug = $1`, [data.category])).length) throw new Error("Pick a category.");
	const settings = await loadSettings(sql);
	if (Number(profile.balance) - Number(profile.locked_balance) < Number(settings.mint_fee)) throw new Error(`Minting costs ${Number(settings.mint_fee)} ETH. Deposit to continue.`);
	const art = (await sql.query(`with fee as (select mint_fee from settings where id = 1),
        gate as (
          select fee.mint_fee from profiles p, fee
          where p.user_id = $1 and p.status = 'active'
            and (p.balance - p.locked_balance) >= fee.mint_fee
        ),
        nums as (select coalesce(max(token_id), 1000) + 1 as token_id from artworks),
        paid as (
          update profiles p set balance = p.balance + v.delta
          from (
            select $1::text as user_id, -(select mint_fee from gate) as delta
            union all
            select 'house:platform'::text, (select mint_fee from gate)
          ) v
          where p.user_id = v.user_id and exists (select 1 from gate)
          returning p.user_id
        ),
        art as (
          insert into artworks (
            token_id, creator_id, owner_id, title, description, category_slug,
            media_kind, image_url, media_url, royalty_bps
          )
          select (select token_id from nums), $1, $1, $2, $3, $4, $5, $6, $7, $8
          where exists (select 1 from gate)
          returning id, token_id
        ),
        fee_tx as (
          insert into transactions (artwork_id, buyer_id, price, kind, note)
          select id, $1, (select mint_fee from gate), 'mint_fee', 'Minting fee' from art
          returning id
        ),
        mint_tx as (
          insert into transactions (artwork_id, buyer_id, seller_id, price, kind, note)
          select id, $1, $1, 0, 'mint', 'Minted' from art
          returning id
        )
        select id, token_id from art
        where exists (select 1 from paid) and exists (select 1 from fee_tx) and exists (select 1 from mint_tx)`, [
		context.userId,
		data.title,
		data.description,
		data.category,
		data.mediaKind,
		data.imageData,
		data.mediaData,
		data.royaltyBps
	]))[0];
	if (!art) throw new Error("Minting did not complete. Check your available balance.");
	await noteActivity(sql, context.userId, "mint", `Minted ${data.title}`);
	if (data.listKind !== "none" && data.price) await sql.query(`insert into listings (artwork_id, seller_id, kind, price, ends_at)
         values ($1, $2, $3, $4::numeric, case when $3 = 'auction' then now() + ($5::int * interval '1 hour') else null end)`, [
		art.id,
		context.userId,
		data.listKind,
		data.price,
		data.hours ?? 24
	]);
	return {
		id: art.id,
		tokenId: art.token_id
	};
});
async function createListing(sql, userId, artworkId, kind, price, hours) {
	if (!(await sql.query(`select 1 from artworks where id = $1 and owner_id = $2 and removed = false and hidden = false`, [artworkId, userId])).length) throw new Error("You can only list a work you hold.");
	if ((await sql.query(`select 1 from listings where artwork_id = $1 and status = 'active'`, [artworkId])).length) throw new Error("This work is already listed.");
	await sql.query(`insert into listings (artwork_id, seller_id, kind, price, ends_at)
     values ($1, $2, $3, $4::numeric, case when $3 = 'auction' then now() + ($5::int * interval '1 hour') else null end)`, [
		artworkId,
		userId,
		kind,
		price,
		hours ?? 24
	]);
}
var listWork_createServerFn_handler = createServerRpc({
	id: "afba91369f21ff181a4e3273dfd19b743903bd3c57c1efe6a7fc4f5951f1e5d0",
	name: "listWork",
	filename: "src/lib/market.functions.ts"
}, (opts) => listWork.__executeServer(opts));
var listWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const kind = src.kind === "auction" ? "auction" : "fixed";
	const hours = Number(src.endsInHours ?? 24);
	if (kind === "auction" && (!Number.isFinite(hours) || hours < 1 || hours > 336)) throw new Error("Auctions run from 1 to 336 hours.");
	return {
		artworkId: intId(src.artworkId),
		kind,
		price: posAmount(src.price, "Price"),
		hours: Math.round(hours)
	};
}).handler(listWork_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	rateLimit(`list:${context.userId}`, 20, 6e4);
	assertActive(await ensureProfile(sql, context.userId));
	await createListing(sql, context.userId, data.artworkId, data.kind, data.price, data.hours);
	return { ok: true };
});
var buyListing_createServerFn_handler = createServerRpc({
	id: "8921579bed4b158008145af61d7ef4187564f07e79e3765a8cf5c1dbe0572071",
	name: "buyListing",
	filename: "src/lib/market.functions.ts"
}, (opts) => buyListing.__executeServer(opts));
var buyListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(buyListing_createServerFn_handler, async ({ context, data: listingId }) => {
	const sql = await getSql();
	rateLimit(`money:${context.userId}`, 30, 6e4);
	await prepare(sql);
	const profile = await ensureProfile(sql, context.userId);
	assertActive(profile);
	const listing = (await sql.query(`select l.price::text as price, l.seller_id, a.title
       from listings l join artworks a on a.id = l.artwork_id
       where l.id = $1 and l.status = 'active' and l.kind = 'fixed'`, [listingId]))[0];
	if (!listing) throw new Error("That listing is no longer active.");
	if (listing.seller_id === context.userId) throw new Error("You already hold this work.");
	if (Number(profile.balance) - Number(profile.locked_balance) < Number(listing.price)) throw new Error("Not enough available ETH. Deposit to continue.");
	const sale = (await sql.query(`with s as (select platform_fee_bps as fee_bps from settings where id = 1),
        lst as (
          select l.id as listing_id, l.artwork_id, l.seller_id, l.price, a.creator_id, a.royalty_bps, a.title
          from listings l join artworks a on a.id = l.artwork_id
          where l.id = $1 and l.status = 'active' and l.kind = 'fixed'
            and a.hidden = false and a.removed = false and a.owner_id = l.seller_id
          for update of l
        ),
        calc as (
          select lst.*,
            case when lst.seller_id = lst.creator_id then 0::numeric
                 else round(lst.price * lst.royalty_bps / 10000.0, 6) end as royalty,
            round(lst.price * (select fee_bps from s) / 10000.0, 6) as fee
          from lst
        ),
        gate as (
          select 1 as ok from profiles p, calc c
          where p.user_id = $2 and p.status = 'active' and p.user_id <> c.seller_id
            and (p.balance - p.locked_balance) >= c.price
        ),
        deltas as (
          select user_id, sum(delta) as delta from (
            select $2::text as user_id, -(select price from calc) as delta
            union all select seller_id, price - royalty - fee from calc
            union all select creator_id, royalty from calc where royalty > 0 and creator_id <> seller_id
            union all select 'house:platform'::text, fee from calc where fee > 0
          ) raw group by user_id
        ),
        paid as (
          update profiles p set balance = p.balance + d.delta
          from deltas d
          where p.user_id = d.user_id and exists (select 1 from gate) and d.delta is not null
          returning p.user_id
        ),
        moved as (
          update artworks set owner_id = $2
          where id = (select artwork_id from calc) and exists (select 1 from gate)
          returning id
        ),
        closed as (
          update listings set status = 'sold'
          where id = (select listing_id from calc) and exists (select 1 from gate)
          returning id
        ),
        tx as (
          insert into transactions (artwork_id, buyer_id, seller_id, price, royalty_amount, platform_fee, seller_proceeds, kind)
          select artwork_id, $2, seller_id, price, royalty, fee, price - royalty - fee, 'sale'
          from calc where exists (select 1 from gate)
          returning id
        )
        select c.artwork_id, c.title, c.seller_id from calc c
        where exists (select 1 from paid) and exists (select 1 from moved)
          and exists (select 1 from closed) and exists (select 1 from tx)`, [listingId, context.userId]))[0];
	if (!sale) throw new Error("That listing changed. Try again.");
	await notify(sql, sale.seller_id, `${profile.display_name} bought ${sale.title}.`, `/art/${sale.artwork_id}`);
	await noteActivity(sql, context.userId, "purchase", `Bought ${sale.title}`);
	await noteActivity(sql, sale.seller_id, "sale", `Sold ${sale.title}`);
	return {
		ok: true,
		artworkId: sale.artwork_id
	};
});
var placeBid_createServerFn_handler = createServerRpc({
	id: "90adb195c97d20e2b738b064d375672952be407fee63cf8b10388df5195db0f7",
	name: "placeBid",
	filename: "src/lib/market.functions.ts"
}, (opts) => placeBid.__executeServer(opts));
var placeBid = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	return {
		listingId: intId(src.listingId),
		amount: posAmount(src.amount, "Bid")
	};
}).handler(placeBid_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	rateLimit(`money:${context.userId}`, 30, 6e4);
	await prepare(sql);
	assertActive(await ensureProfile(sql, context.userId));
	const bid = (await sql.query(`with lst as (
          select l.id, l.artwork_id, l.seller_id, l.price, a.title
          from listings l join artworks a on a.id = l.artwork_id
          where l.id = $1 and l.status = 'active' and l.kind = 'auction' and l.ends_at > now()
            and a.hidden = false and a.removed = false
          for update of l
        ),
        cur as (
          select id, bidder_id, amount from bids where listing_id = $1 and status = 'leading'
        ),
        gate as (
          select 1 as ok from profiles p, lst
          where p.user_id = $2 and p.status = 'active' and p.user_id <> lst.seller_id
            and (p.balance - p.locked_balance + coalesce((select amount from cur where bidder_id = p.user_id), 0)) >= $3::numeric
            and (
              (not exists (select 1 from cur) and $3::numeric >= lst.price)
              or (exists (select 1 from cur) and $3::numeric >= round((select amount from cur) * 1.05, 6))
            )
        ),
        deltas as (
          select user_id, sum(dlock) as dlock from (
            select $2::text as user_id, $3::numeric as dlock
            union all select bidder_id, -amount from cur
          ) raw group by user_id
        ),
        locked as (
          update profiles p set locked_balance = p.locked_balance + d.dlock
          from deltas d
          where p.user_id = d.user_id and exists (select 1 from gate)
          returning p.user_id
        ),
        old as (
          update bids set status = 'refunded'
          where id = (select id from cur) and exists (select 1 from gate)
          returning id
        ),
        ins as (
          insert into bids (listing_id, bidder_id, amount, status)
          select id, $2, $3::numeric, 'leading' from lst where exists (select 1 from gate)
          returning id
        )
        select i.id, l.artwork_id, l.title, l.seller_id
        from ins i, lst l
        where exists (select 1 from locked)
          and (not exists (select 1 from cur) or exists (select 1 from old))`, [
		data.listingId,
		context.userId,
		data.amount
	]))[0];
	if (!bid) throw new Error("Bid not accepted. It must clear the start price and beat the current bid by 5%.");
	await notify(sql, bid.seller_id, `New bid of ${Number(data.amount).toFixed(2)} ETH on ${bid.title}.`, `/art/${bid.artwork_id}`);
	await noteActivity(sql, context.userId, "bid", `Bid ${Number(data.amount).toFixed(2)} ETH on ${bid.title}`);
	return { ok: true };
});
var makeOffer_createServerFn_handler = createServerRpc({
	id: "21d794f47730e4f3a5a8d314deb04735837b81c7d5fcbd2e1bd59b87617412b1",
	name: "makeOffer",
	filename: "src/lib/market.functions.ts"
}, (opts) => makeOffer.__executeServer(opts));
var makeOffer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	return {
		artworkId: intId(src.artworkId),
		amount: posAmount(src.amount, "Offer")
	};
}).handler(makeOffer_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	rateLimit(`money:${context.userId}`, 30, 6e4);
	const profile = await ensureProfile(sql, context.userId);
	assertActive(profile);
	const offer = (await sql.query(`with art as (
          select id, owner_id, title from artworks
          where id = $1 and hidden = false and removed = false and owner_id <> $2
        ),
        gate as (
          select 1 as ok from profiles p, art
          where p.user_id = $2 and p.status = 'active'
            and (p.balance - p.locked_balance) >= $3::numeric
            and not exists (
              select 1 from offers o where o.artwork_id = art.id and o.bidder_id = $2 and o.status = 'active'
            )
        ),
        locked as (
          update profiles set locked_balance = locked_balance + $3::numeric
          where user_id = $2 and exists (select 1 from gate)
          returning user_id
        ),
        ins as (
          insert into offers (artwork_id, bidder_id, amount)
          select id, $2, $3::numeric from art where exists (select 1 from gate)
          returning id, artwork_id
        )
        select i.id, a.owner_id, a.title from ins i, art a
        where exists (select 1 from locked)`, [
		data.artworkId,
		context.userId,
		data.amount
	]))[0];
	if (!offer) throw new Error("Offer not accepted. Check your balance, or withdraw the offer you already have on this work.");
	await notify(sql, offer.owner_id, `${profile.display_name} offered ${Number(data.amount).toFixed(2)} ETH on ${offer.title}.`, `/art/${data.artworkId}`);
	await noteActivity(sql, context.userId, "offer", `Offered ${Number(data.amount).toFixed(2)} ETH on ${offer.title}`);
	return { ok: true };
});
var withdrawOffer_createServerFn_handler = createServerRpc({
	id: "5ebd0523330cf07d1888762b5dfd6319588f0b21cbea94fbaf74e73d9744dd45",
	name: "withdrawOffer",
	filename: "src/lib/market.functions.ts"
}, (opts) => withdrawOffer.__executeServer(opts));
var withdrawOffer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(withdrawOffer_createServerFn_handler, async ({ context, data: offerId }) => {
	const sql = await getSql();
	assertActive(await ensureProfile(sql, context.userId));
	if (!(await sql.query(`with o as (
          select id, bidder_id, amount from offers
          where id = $1 and bidder_id = $2 and status = 'active'
        ),
        rel as (
          update profiles set locked_balance = greatest(0, locked_balance - (select amount from o))
          where user_id = $2 and exists (select 1 from o)
          returning user_id
        ),
        done as (
          update offers set status = 'withdrawn'
          where id = (select id from o) and exists (select 1 from rel)
          returning id
        )
        select id from done`, [offerId, context.userId])).length) throw new Error("That offer is not active.");
	return { ok: true };
});
var acceptOffer_createServerFn_handler = createServerRpc({
	id: "e9a156f78d6db0debfcbe7baf819faa7126cb91a85189211ed4249af352334b4",
	name: "acceptOffer",
	filename: "src/lib/market.functions.ts"
}, (opts) => acceptOffer.__executeServer(opts));
var acceptOffer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(acceptOffer_createServerFn_handler, async ({ context, data: offerId }) => {
	const sql = await getSql();
	rateLimit(`money:${context.userId}`, 30, 6e4);
	assertActive(await ensureProfile(sql, context.userId));
	const row = (await sql.query(`with s as (select platform_fee_bps as fee_bps from settings where id = 1),
        off as (
          select o.id, o.artwork_id, o.bidder_id, o.amount, a.owner_id, a.creator_id, a.royalty_bps, a.title
          from offers o join artworks a on a.id = o.artwork_id
          where o.id = $1 and o.status = 'active' and a.owner_id = $2
            and a.hidden = false and a.removed = false
          for update of o
        ),
        calc as (
          select off.*,
            case when off.owner_id = off.creator_id then 0::numeric
                 else round(off.amount * off.royalty_bps / 10000.0, 6) end as royalty,
            round(off.amount * (select fee_bps from s) / 10000.0, 6) as fee
          from off
        ),
        gate as (
          select 1 as ok from profiles p, calc c
          where p.user_id = c.bidder_id and p.status = 'active'
            and p.balance >= c.amount and p.locked_balance >= c.amount
        ),
        others as (
          select id, bidder_id, amount from offers
          where artwork_id = (select artwork_id from calc) and status = 'active' and id <> (select id from calc)
        ),
        lead as (
          select b.bidder_id, b.amount from bids b
          join listings l on l.id = b.listing_id
          where l.artwork_id = (select artwork_id from calc) and l.status = 'active' and b.status = 'leading'
        ),
        deltas as (
          select user_id, sum(dbal) as dbal, sum(dlock) as dlock from (
            select bidder_id as user_id, -amount as dbal, -amount as dlock from calc
            union all select owner_id, amount - royalty - fee, 0::numeric from calc
            union all select creator_id, royalty, 0::numeric from calc where royalty > 0 and creator_id <> owner_id
            union all select 'house:platform'::text, fee, 0::numeric from calc where fee > 0
            union all select bidder_id, 0::numeric, -amount from others
            union all select bidder_id, 0::numeric, -amount from lead
          ) raw group by user_id
        ),
        paid as (
          update profiles p
          set balance = p.balance + d.dbal, locked_balance = greatest(0, p.locked_balance + d.dlock)
          from deltas d
          where p.user_id = d.user_id and exists (select 1 from gate)
          returning p.user_id
        ),
        moved as (
          update artworks set owner_id = (select bidder_id from calc)
          where id = (select artwork_id from calc) and exists (select 1 from gate)
          returning id
        ),
        closed_list as (
          update listings set status = 'cancelled'
          where artwork_id = (select artwork_id from calc) and status = 'active' and exists (select 1 from gate)
          returning id
        ),
        won as (
          update offers set status = 'accepted'
          where id = (select id from calc) and exists (select 1 from gate)
          returning id
        ),
        rest as (
          update offers set status = 'rejected'
          where artwork_id = (select artwork_id from calc) and status = 'active' and id <> (select id from calc)
            and exists (select 1 from gate)
          returning id
        ),
        unbid as (
          update bids set status = 'refunded'
          where status = 'leading' and listing_id in (
            select id from listings where artwork_id = (select artwork_id from calc)
          ) and exists (select 1 from gate)
          returning id
        ),
        tx as (
          insert into transactions (artwork_id, buyer_id, seller_id, price, royalty_amount, platform_fee, seller_proceeds, kind)
          select artwork_id, bidder_id, owner_id, amount, royalty, fee, amount - royalty - fee, 'offer'
          from calc where exists (select 1 from gate)
          returning id
        )
        select c.artwork_id, c.title, c.bidder_id from calc c
        where exists (select 1 from paid) and exists (select 1 from moved) and exists (select 1 from won)
          and exists (select 1 from tx)
          and (select count(*) from closed_list) >= 0
          and (select count(*) from rest) >= 0
          and (select count(*) from unbid) >= 0`, [offerId, context.userId]))[0];
	if (!row) throw new Error("Could not accept that offer.");
	await notify(sql, row.bidder_id, `Your offer was accepted for ${row.title}.`, `/art/${row.artwork_id}`);
	await noteActivity(sql, context.userId, "sale", `Accepted an offer on ${row.title}`);
	await noteActivity(sql, row.bidder_id, "purchase", `Offer accepted for ${row.title}`);
	return { ok: true };
});
var rejectOffer_createServerFn_handler = createServerRpc({
	id: "008eb50db9c4be6edc6a3c1246a6b008c29e9d5030c9b005ed2d52c6497883e6",
	name: "rejectOffer",
	filename: "src/lib/market.functions.ts"
}, (opts) => rejectOffer.__executeServer(opts));
var rejectOffer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(rejectOffer_createServerFn_handler, async ({ context, data: offerId }) => {
	const sql = await getSql();
	assertActive(await ensureProfile(sql, context.userId));
	if (!(await sql.query(`with o as (
          select o.id, o.bidder_id, o.amount from offers o
          join artworks a on a.id = o.artwork_id
          where o.id = $1 and o.status = 'active' and a.owner_id = $2
        ),
        rel as (
          update profiles set locked_balance = greatest(0, locked_balance - (select amount from o))
          where user_id = (select bidder_id from o) and exists (select 1 from o)
          returning user_id
        ),
        done as (
          update offers set status = 'rejected'
          where id = (select id from o) and exists (select 1 from rel)
          returning id
        )
        select id from done`, [offerId, context.userId])).length) throw new Error("That offer is not yours to decline.");
	return { ok: true };
});
async function cancelListingRow(sql, listingId) {
	return (await sql.query(`with lst as (
        select id from listings where id = $1 and status = 'active' for update
      ),
      cur as (
        select id, bidder_id, amount from bids where listing_id = $1 and status = 'leading'
      ),
      rel as (
        update profiles p set locked_balance = greatest(0, p.locked_balance - c.amount)
        from cur c, lst
        where p.user_id = c.bidder_id
        returning p.user_id
      ),
      ub as (
        update bids set status = 'refunded'
        where listing_id = (select id from lst) and status = 'leading' and exists (select 1 from lst)
        returning id
      ),
      cl as (
        update listings set status = 'cancelled'
        where id = (select id from lst)
        returning id
      )
      select id from cl
      where exists (select 1 from lst)
        and (select count(*) from rel) >= 0
        and (select count(*) from ub) >= 0`, [listingId])).length > 0;
}
var cancelMyListing_createServerFn_handler = createServerRpc({
	id: "6737ea3418e25ec0cf6941983bbe7242b0b05e07dd513ad42acb0aee8c825346",
	name: "cancelMyListing",
	filename: "src/lib/market.functions.ts"
}, (opts) => cancelMyListing.__executeServer(opts));
var cancelMyListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(cancelMyListing_createServerFn_handler, async ({ context, data: listingId }) => {
	const sql = await getSql();
	assertActive(await ensureProfile(sql, context.userId));
	const rows = await sql.query(`select seller_id from listings where id = $1 and status = 'active'`, [listingId]);
	if (!rows[0] || rows[0].seller_id !== context.userId) throw new Error("Only the seller can cancel this listing.");
	if (!await cancelListingRow(sql, listingId)) throw new Error("That listing is not active.");
	return { ok: true };
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "a257b0578733cd4af80c05e81105e53df57c9576e0af6ac4db26df74817ff6f7",
	name: "getDashboard",
	filename: "src/lib/market.functions.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await prepare(sql);
	const profile = await ensureProfile(sql, context.userId);
	const id = context.userId;
	const [created, owned, listed, watchlist] = await Promise.all([
		cards(sql, `a.creator_id = $1 and a.removed = false order by a.created_at desc`, [id]),
		cards(sql, `a.owner_id = $1 and a.removed = false order by a.created_at desc`, [id]),
		cards(sql, `l.seller_id = $1 and l.status = 'active' and a.removed = false order by l.created_at desc`, [id]),
		cards(sql, `a.id in (select artwork_id from favorites where user_id = $1) and a.removed = false order by a.created_at desc`, [id])
	]);
	return {
		profile,
		created,
		owned,
		listed,
		watchlist,
		sold: await sql.query(`select t.id, a.title, t.artwork_id, t.price::text as price, t.kind, ${ISO("t.created_at")} as at
       from transactions t left join artworks a on a.id = t.artwork_id
       where t.seller_id = $1 and t.kind in ('sale','auction','offer')
       order by t.created_at desc limit 40`, [id]),
		purchases: await sql.query(`select t.id, a.title, t.artwork_id, t.price::text as price, t.kind, ${ISO("t.created_at")} as at
       from transactions t left join artworks a on a.id = t.artwork_id
       where t.buyer_id = $1 and t.kind in ('sale','auction','offer','mint_fee')
       order by t.created_at desc limit 40`, [id]),
		offersIn: await sql.query(`select o.id, o.artwork_id, a.title, o.amount::text as amount, p.display_name as bidder_name
       from offers o
       join artworks a on a.id = o.artwork_id
       join profiles p on p.user_id = o.bidder_id
       where a.owner_id = $1 and o.status = 'active'
       order by o.created_at desc`, [id]),
		offersOut: await sql.query(`select o.id, o.artwork_id, a.title, o.amount::text as amount, o.status
       from offers o join artworks a on a.id = o.artwork_id
       where o.bidder_id = $1 and o.status = 'active'
       order by o.created_at desc`, [id]),
		activity: await sql.query(`select id, kind, detail, ${ISO("created_at")} as at
       from activity_log where user_id = $1 order by created_at desc limit 40`, [id]),
		mintedCount: created.length
	};
});
var searchStudios_createServerFn_handler = createServerRpc({
	id: "3dea1ba68c5cfe5778cce461113c1b72a7a5d5358a07d81a6daa224476e43a06",
	name: "searchStudios",
	filename: "src/lib/market.functions.ts"
}, (opts) => searchStudios.__executeServer(opts));
var searchStudios = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => text(input, 40)).handler(searchStudios_createServerFn_handler, async ({ context, data: q }) => {
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	const query = q.trim();
	if (query.length < 2) return [];
	const like = `%${query.replace(/[%_]/g, "")}%`;
	return sql.query(`select p.username, p.display_name, p.city, count(a.id)::int as works
       from profiles p
       left join artworks a on a.creator_id = p.user_id and a.removed = false and a.hidden = false
       where p.status = 'active' and p.role <> 'treasury'
         and (p.username ilike $1 or p.display_name ilike $1)
       group by p.user_id
       order by p.display_name
       limit 12`, [like]);
});
var registerDeposit_createServerFn_handler = createServerRpc({
	id: "c5a84f0287e89fd63c37cf430fe633181ea7779d9e99ee6bb7f240a37f62fd70",
	name: "registerDeposit",
	filename: "src/lib/market.functions.ts"
}, (opts) => registerDeposit.__executeServer(opts));
var registerDeposit = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => posAmount(input, "Deposit")).handler(registerDeposit_createServerFn_handler, async ({ context, data: amount }) => {
	const sql = await getSql();
	rateLimit(`dep:${context.userId}`, 6, 6e5);
	assertActive(await ensureProfile(sql, context.userId));
	await assertVerified(sql, context.userId);
	if (Number(amount) < .01 || Number(amount) > 100) throw new Error("Register between 0.01 and 100 ETH at a time.");
	const hash = txHash();
	await sql.query(`insert into deposits (user_id, tx_hash, amount, confirmations, status)
       values ($1, $2, $3::numeric, 0, 'pending')`, [
		context.userId,
		hash,
		amount
	]);
	await audit(sql, context.userId, "deposit.register", hash, amount);
	await noteActivity(sql, context.userId, "deposit", `Registered a transfer of ${amount} ETH`);
	return { txHash: hash };
});
var getDeposits_createServerFn_handler = createServerRpc({
	id: "dce0439c090542fc6943139f86515966d4fdd91216b761c4ccdc4d7beccb3e6b",
	name: "getDeposits",
	filename: "src/lib/market.functions.ts"
}, (opts) => getDeposits.__executeServer(opts));
var getDeposits = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDeposits_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await prepare(sql);
	const profile = await ensureProfile(sql, context.userId);
	const settings = await loadSettings(sql);
	const items = await sql.query(`select id, tx_hash, amount::text as amount, confirmations, status, ${ISO("created_at")} as created_at
       from deposits where user_id = $1 order by created_at desc limit 20`, [context.userId]);
	const prefs = await sql.query(`select deposit_address, use_platform_deposit from profiles where user_id = $1`, [context.userId]);
	const platform = await sql.query(`select platform_deposit_address from settings where id = 1`);
	const personal = prefs[0]?.deposit_address ?? "";
	const shared = platform[0]?.platform_deposit_address ?? "";
	const address = prefs[0]?.use_platform_deposit === false ? personal : shared || personal;
	return {
		address,
		qr: address ? await qrFor(address) : "",
		required: Number(settings.confirmations_required) || 12,
		items,
		balance: profile.balance,
		locked: profile.locked_balance
	};
});
var requestWithdrawal_createServerFn_handler = createServerRpc({
	id: "b6e7e02ba66f4d3aa4b577ec364388d654a2b26c5ec16af824d3775fe53f5d42",
	name: "requestWithdrawal",
	filename: "src/lib/market.functions.ts"
}, (opts) => requestWithdrawal.__executeServer(opts));
var requestWithdrawal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const destination = text(src.destination, 80);
	if (!/^0x[a-fA-F0-9]{40}$/.test(destination)) throw new Error("Enter a valid Ethereum address.");
	const confirmEmail = text(src.confirmEmail, 200).toLowerCase();
	return {
		amount: posAmount(src.amount, "Withdrawal"),
		destination,
		confirmEmail
	};
}).handler(requestWithdrawal_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	rateLimit(`wd:${context.userId}`, 5, 6e5);
	const profile = await ensureProfile(sql, context.userId);
	assertActive(profile);
	await assertVerified(sql, context.userId);
	const email = (await sql.query(`select "email" from "user" where "id" = $1`, [context.userId]))[0]?.email?.toLowerCase() ?? "";
	if (!email || data.confirmEmail !== email) throw new Error("Confirm the withdrawal with the email on this account.");
	const { getAddress } = await import("../_libs/ethers.mjs").then((n) => n.t);
	let destination = data.destination;
	try {
		destination = getAddress(destination);
	} catch {
		throw new Error("That address failed checksum validation.");
	}
	if (destination.toLowerCase() === profile.deposit_address?.toLowerCase()) throw new Error("Send withdrawals to your own wallet, not your Agora deposit address.");
	const settings = await loadSettings(sql);
	if (Number(data.amount) < Number(settings.min_withdrawal)) throw new Error(`Minimum withdrawal is ${settings.min_withdrawal} ETH.`);
	const row = (await sql.query(`with s as (
          select min_withdrawal, network_fee, auto_approve_under, hot_wallet_balance from settings where id = 1
        ),
        gate as (
          select s.network_fee from profiles p, s
          where p.user_id = $1 and p.status = 'active'
            and $2::numeric >= s.min_withdrawal
            and (p.balance - p.locked_balance) >= ($2::numeric + s.network_fee)
        ),
        locked as (
          update profiles
          set locked_balance = locked_balance + ($2::numeric + (select network_fee from gate))
          where user_id = $1 and exists (select 1 from gate)
          returning user_id
        ),
        w as (
          insert into withdrawals (user_id, amount, network_fee, destination, status)
          select $1, $2::numeric, network_fee, $3, 'pending' from gate
          where exists (select 1 from locked)
          returning id, amount::text as amount, network_fee::text as network_fee
        )
        select id, amount, network_fee from w`, [
		context.userId,
		data.amount,
		destination
	]))[0];
	if (!row) throw new Error("Not enough available ETH to cover the amount and network fee.");
	await audit(sql, context.userId, "withdrawal.request", String(row.id), data.amount);
	await noteActivity(sql, context.userId, "withdrawal", `Requested ${data.amount} ETH`);
	if (settings.auto_approve_enabled && Number(settings.auto_approve_under) > 0 && Number(data.amount) <= Number(settings.auto_approve_under) && Number(settings.hot_wallet_balance) >= Number(data.amount)) {
		await completeWithdrawal(sql, row.id, context.userId);
		return {
			id: row.id,
			status: "completed"
		};
	}
	return {
		id: row.id,
		status: "pending"
	};
});
async function completeWithdrawal(sql, id, actor, supplied) {
	const hash = supplied && /^0x[a-fA-F0-9]{64}$/.test(supplied) ? supplied : txHash();
	const row = (await sql.query(`with w as (
        select * from withdrawals where id = $1 and status in ('pending', 'approved') for update
      ),
      gate as (
        select 1 as ok from w, settings s, profiles p
        where s.id = 1 and p.user_id = w.user_id
          and p.balance >= (w.amount + w.network_fee)
          and p.locked_balance >= (w.amount + w.network_fee)
          and s.hot_wallet_balance >= w.amount
      ),
      upd as (
        update profiles p
        set balance = p.balance - (w.amount + w.network_fee),
            locked_balance = greatest(0, p.locked_balance - (w.amount + w.network_fee))
        from w
        where p.user_id = w.user_id and exists (select 1 from gate)
        returning p.user_id
      ),
      hot as (
        update settings set hot_wallet_balance = hot_wallet_balance - (select amount from w)
        where id = 1 and exists (select 1 from gate)
        returning hot_wallet_balance
      ),
      fee as (
        update profiles set balance = balance + (select network_fee from w)
        where user_id = 'house:platform' and exists (select 1 from gate)
        returning user_id
      ),
      tx as (
        insert into transactions (buyer_id, price, kind, tx_hash, note, platform_fee)
        select user_id, amount, 'withdrawal', $2, 'Withdrawal sent', network_fee from w
        where exists (select 1 from gate)
        returning id
      ),
      fin as (
        update withdrawals
        set status = 'completed', tx_hash = $2, updated_at = now()
        where id = (select id from w) and exists (select 1 from gate)
        returning user_id, amount::text as amount
      )
      select user_id, amount from fin
      where exists (select 1 from upd) and exists (select 1 from hot)
        and exists (select 1 from tx) and (select count(*) from fee) >= 0`, [id, hash]))[0];
	if (!row) throw new Error("The reserve cannot cover that withdrawal yet.");
	await notify(sql, row.user_id, `Withdrawal of ${Number(row.amount).toFixed(4)} ETH sent.`, "/withdraw");
	await noteActivity(sql, row.user_id, "withdrawal", `Withdrawal of ${Number(row.amount).toFixed(4)} ETH sent`);
	await audit(sql, actor, "withdrawal.complete", String(id), hash);
	return row;
}
var getWithdrawals_createServerFn_handler = createServerRpc({
	id: "3f27edea00258b3f677e4712d0916c976a1f48e7e9c3a94064d07ae7c014de50",
	name: "getWithdrawals",
	filename: "src/lib/market.functions.ts"
}, (opts) => getWithdrawals.__executeServer(opts));
var getWithdrawals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getWithdrawals_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const profile = await ensureProfile(sql, context.userId);
	const settings = await loadSettings(sql);
	return {
		items: await sql.query(`select id, amount::text as amount, network_fee::text as network_fee, destination, status,
              tx_hash, reason, ${ISO("created_at")} as created_at
       from withdrawals where user_id = $1 order by created_at desc limit 20`, [context.userId]),
		balance: profile.balance,
		locked: profile.locked_balance,
		min: settings.min_withdrawal,
		networkFee: settings.network_fee
	};
});
var claimDesk_createServerFn_handler = createServerRpc({
	id: "82fa1cfc7f470b282ce3dc88ddce4b8038217da395ed9c6c66276efacaa1d095",
	name: "claimDesk",
	filename: "src/lib/market.functions.ts"
}, (opts) => claimDesk.__executeServer(opts));
var claimDesk = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimDesk_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	assertActive(await ensureProfile(sql, context.userId));
	if (!(await sql.query(`update profiles set role = 'admin'
       where user_id = $1 and status = 'active'
         and not exists (select 1 from profiles where role = 'admin')
       returning user_id`, [context.userId])).length) throw new Error("The desk already has someone on it.");
	await audit(sql, context.userId, "desk.claim", context.userId, "Opened the desk");
	return { ok: true };
});
var adminOverview_createServerFn_handler = createServerRpc({
	id: "01bfa81b667606bbebc32357ef6926d69821dee4320fa5047e8666f1c66dc26b",
	name: "adminOverview",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminOverview.__executeServer(opts));
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminOverview_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await prepare(sql);
	await requireAdmin(sql, context.userId);
	const settings = await loadSettings(sql);
	const users = await sql.query(`select count(*)::int as n from profiles where role in ('user','admin')`);
	const nfts = await sql.query(`select count(*)::int as n from artworks where removed = false`);
	const volume = await sql.query(`select coalesce(sum(price),0)::text as v from transactions where kind in ('sale','auction','offer')`);
	const fees = await sql.query(`select coalesce(sum(platform_fee),0)::text as v from transactions`);
	const mintFees = await sql.query(`select coalesce(sum(price),0)::text as v from transactions where kind = 'mint_fee'`);
	const pendingW = await sql.query(`select count(*)::int as n from withdrawals where status = 'pending'`);
	const deposits = await sql.query(`select count(*)::int as n, coalesce(sum(amount), 0)::text as v from deposits where status = 'completed'`);
	const withdrawals = await sql.query(`select count(*)::int as n, coalesce(sum(amount), 0)::text as v from withdrawals where status = 'completed'`);
	return {
		users: users[0]?.n ?? 0,
		nfts: nfts[0]?.n ?? 0,
		volume: volume[0]?.v ?? "0",
		fees: fees[0]?.v ?? "0",
		mintFees: mintFees[0]?.v ?? "0",
		pendingWithdrawals: pendingW[0]?.n ?? 0,
		deposits: deposits[0]?.n ?? 0,
		depositVolume: deposits[0]?.v ?? "0",
		withdrawals: withdrawals[0]?.n ?? 0,
		withdrawalVolume: withdrawals[0]?.v ?? "0",
		hotWallet: settings.hot_wallet_balance,
		hotAlert: settings.hot_wallet_alert,
		lowReserve: Number(settings.hot_wallet_balance) < Number(settings.hot_wallet_alert)
	};
});
var adminUsers_createServerFn_handler = createServerRpc({
	id: "0133856b202e5db78e4a97bec6b4296c69ffb1b17edb4bc339aae9f9162d7a26",
	name: "adminUsers",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminUsers.__executeServer(opts));
var adminUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => text(input, 80)).handler(adminUsers_createServerFn_handler, async ({ context, data: q }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	return sql.query(`select ${PROFILE_COLS}, u."email" as email
       from profiles p
       left join "user" u on u."id" = p.user_id
       where p.role <> 'treasury'
         and ($1 = '' or p.display_name ilike $2 or p.username ilike $2 or coalesce(u."email", '') ilike $2
              or p.wallet_address ilike $2 or coalesce(p.deposit_address, '') ilike $2)
       order by p.created_at desc limit 80`, [q, like(q)]);
});
var adminUpdateUser_createServerFn_handler = createServerRpc({
	id: "54a3eeda593532857eeeffb8a7c92dd7f15726a5203e288714dbe623b9e1061c",
	name: "adminUpdateUser",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminUpdateUser.__executeServer(opts));
var adminUpdateUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const username = text(src.username, 24).toLowerCase();
	if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Username is not valid.");
	const displayName = text(src.displayName, 80);
	if (!displayName) throw new Error("Name is required.");
	const role = src.role === "admin" || src.role === "catalog" || src.role === "user" ? src.role : "user";
	const status = src.status === "suspended" || src.status === "banned" || src.status === "deleted" || src.status === "active" ? src.status : "active";
	const email = text(src.email, 200);
	const avatar = text(src.avatarUrl, 4e5);
	if (avatar.startsWith("data:")) assertData(avatar, "image");
	return {
		userId: text(src.userId, 120),
		username,
		displayName,
		bio: text(src.bio, 600),
		city: text(src.city, 80),
		email,
		avatar,
		wallet: text(src.wallet, 80),
		siteUrl: text(src.siteUrl, 200),
		xHandle: text(src.xHandle, 40).replace(/^@/, ""),
		role,
		status
	};
}).handler(adminUpdateUser_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	rateLimit(`admin:${context.userId}`, 40, 6e4);
	await requireAdmin(sql, context.userId);
	if (!data.userId || data.userId === "house:platform") throw new Error("That account cannot be edited this way.");
	const current = await loadProfile(sql, data.userId);
	if (!current) throw new Error("Collector not found.");
	if (current.role === "admin" && data.role !== "admin") {
		if (((await sql.query(`select count(*)::int as n from profiles where role = 'admin' and user_id <> $1`, [data.userId]))[0]?.n ?? 0) === 0) throw new Error("The desk needs at least one admin.");
	}
	if (data.userId === context.userId && (data.status !== "active" || data.role !== "admin")) throw new Error("You cannot suspend or demote yourself.");
	if ((await sql.query(`select 1 from profiles where username = $1 and user_id <> $2`, [data.username, data.userId])).length) throw new Error("That username is taken.");
	await sql.query(`update profiles set username = $2, display_name = $3, bio = $4, city = $5, avatar_url = $6,
         wallet_address = $7, site_url = $8, x_handle = $9, role = $10, status = $11
       where user_id = $1`, [
		data.userId,
		data.username,
		data.displayName,
		data.bio,
		data.city,
		data.avatar || null,
		data.wallet,
		data.siteUrl || null,
		data.xHandle || null,
		data.role,
		data.status
	]);
	if (data.email) try {
		await sql.query(`update "user" set "email" = $2, "name" = $3, "updatedAt" = now() where "id" = $1`, [
			data.userId,
			data.email,
			data.displayName
		]);
	} catch {
		throw new Error("That email is already in use.");
	}
	if (data.status === "banned" || data.status === "deleted") {
		const lists = await sql.query(`select id from listings where seller_id = $1 and status = 'active'`, [data.userId]);
		for (const list of lists) await cancelListingRow(sql, list.id);
		await sql.query(`with sums as (
            select coalesce((select sum(amount) from bids where bidder_id = $1 and status = 'leading'), 0)
                 + coalesce((select sum(amount) from offers where bidder_id = $1 and status = 'active'), 0) as amt
          ),
          upd as (
            update profiles set locked_balance = greatest(0, locked_balance - (select amt from sums))
            where user_id = $1 returning user_id
          ),
          ub as (
            update bids set status = 'refunded' where bidder_id = $1 and status = 'leading' returning id
          ),
          uo as (
            update offers set status = 'withdrawn' where bidder_id = $1 and status = 'active' returning id
          )
          select user_id from upd where exists (select 1 from upd)`, [data.userId]);
	}
	await audit(sql, context.userId, "user.update", data.userId, `${data.role}/${data.status}`);
	return { ok: true };
});
var adminSetBalance_createServerFn_handler = createServerRpc({
	id: "677e48a6c6a71be9266ae9a70b8dee0dace33bea8d739e4f596275281012b9aa",
	name: "adminSetBalance",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminSetBalance.__executeServer(opts));
var adminSetBalance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const reason = text(src.reason, 240);
	if (reason.length < 3) throw new Error("A reason is required.");
	const n = Number(src.balance);
	if (!Number.isFinite(n) || n < 0 || n > 1e6) throw new Error("Balance is not valid.");
	return {
		userId: text(src.userId, 120),
		balance: n.toFixed(6),
		reason
	};
}).handler(adminSetBalance_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	if (!(await sql.query(`update profiles set balance = $2::numeric
       where user_id = $1 and $2::numeric >= locked_balance
       returning user_id`, [data.userId, data.balance])).length) throw new Error("Balance cannot sit below locked funds.");
	await sql.query(`insert into transactions (buyer_id, price, kind, note) values ($1, $2::numeric, 'adjustment', $3)`, [
		data.userId,
		data.balance,
		data.reason
	]);
	await audit(sql, context.userId, "balance.set", data.userId, `${data.balance} ETH — ${data.reason}`);
	return { ok: true };
});
var adminResetPassword_createServerFn_handler = createServerRpc({
	id: "ea661934dab77a6aaa7d87521d85cf2955510513def52f43d258211f97943267",
	name: "adminResetPassword",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminResetPassword.__executeServer(opts));
var adminResetPassword = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const password = typeof src.password === "string" ? src.password : "";
	if (password.length < 8 || password.length > 72) throw new Error("Password must be 8–72 characters.");
	return {
		userId: text(src.userId, 120),
		password
	};
}).handler(adminResetPassword_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const account = (await sql.query(`select "id" from "account" where "userId" = $1 and "providerId" = 'credential'`, [data.userId]))[0];
	if (!account) throw new Error("This account signs in with Google or X and has no password.");
	const { hashPassword } = await import("./crypto-QVkT-fgq.mjs").then((n) => n.t).then((n) => n.t);
	const hash = await hashPassword(data.password);
	await sql.query(`update "account" set "password" = $2, "updatedAt" = now() where "id" = $1`, [account.id, hash]);
	await audit(sql, context.userId, "password.reset", data.userId, "Password replaced");
	return { ok: true };
});
var adminWorks_createServerFn_handler = createServerRpc({
	id: "1fdf96c243d4441cad639837ea2a58da4cd52548117ad7904f0c84d12d000df5",
	name: "adminWorks",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminWorks.__executeServer(opts));
var adminWorks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminWorks_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	return sql.query(`${CARD_SELECT} ${CARD_FROM} where true order by a.created_at desc limit 80`);
});
var adminModerate_createServerFn_handler = createServerRpc({
	id: "5ffd786ea725c95ca1e030fc9d3939468a80fa53571de272ac898c26e50a5fcb",
	name: "adminModerate",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminModerate.__executeServer(opts));
var adminModerate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const action = src.action === "hide" || src.action === "remove" || src.action === "restore" || src.action === "feature" ? src.action : null;
	if (!action) throw new Error("Unknown action.");
	return {
		artworkId: intId(src.artworkId),
		action,
		featured: src.featured === true
	};
}).handler(adminModerate_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	if (data.action === "feature") await sql.query(`update artworks set featured = $2 where id = $1`, [data.artworkId, data.featured]);
	else if (data.action === "restore") await sql.query(`update artworks set hidden = false, removed = false where id = $1`, [data.artworkId]);
	else {
		const lists = await sql.query(`select id from listings where artwork_id = $1 and status = 'active'`, [data.artworkId]);
		for (const list of lists) await cancelListingRow(sql, list.id);
		await sql.query(`with o as (
            select id, bidder_id, amount from offers where artwork_id = $1 and status = 'active'
          ),
          rel as (
            update profiles p set locked_balance = greatest(0, p.locked_balance - o.amount)
            from o where p.user_id = o.bidder_id
            returning p.user_id
          ),
          u as (
            update offers set status = 'rejected' where artwork_id = $1 and status = 'active' returning id
          )
          select id from u`, [data.artworkId]);
		if (data.action === "hide") await sql.query(`update artworks set hidden = true where id = $1`, [data.artworkId]);
		else await sql.query(`update artworks set removed = true, hidden = true where id = $1`, [data.artworkId]);
	}
	await audit(sql, context.userId, `work.${data.action}`, String(data.artworkId), "");
	return { ok: true };
});
var adminLedger_createServerFn_handler = createServerRpc({
	id: "7786f781ed50e08d9b81e5fbf8fb2bdf6a0da37afe1e8ba64b5b2af30b75f521",
	name: "adminLedger",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminLedger.__executeServer(opts));
var adminLedger = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminLedger_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	return sql.query(`select t.id, ${ISO("t.created_at")} as at, t.kind, a.title,
              b.display_name as buyer, s.display_name as seller,
              t.price::text as price, t.royalty_amount::text as royalty_amount,
              t.platform_fee::text as platform_fee, t.seller_proceeds::text as seller_proceeds,
              t.tx_hash, t.note
       from transactions t
       left join artworks a on a.id = t.artwork_id
       left join profiles b on b.user_id = t.buyer_id
       left join profiles s on s.user_id = t.seller_id
       order by t.created_at desc limit 200`);
});
var adminGetSettings_createServerFn_handler = createServerRpc({
	id: "03b5f5aa65280abbb765af48297c4062e7e1df2a237a5048042f112f16627aa7",
	name: "adminGetSettings",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminGetSettings.__executeServer(opts));
var adminGetSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminGetSettings_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	return {
		settings: await loadSettings(sql),
		categories: await sql.query(`select id, slug, name from categories order by sort, name`)
	};
});
var adminSaveSettings_createServerFn_handler = createServerRpc({
	id: "17c7640d4a16ab7343279032c12888e3a23f6829f06872e8b3aad8ed88737c22",
	name: "adminSaveSettings",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminSaveSettings.__executeServer(opts));
var adminSaveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const feeBps = Number(src.platformFeePct) * 100;
	const mintFee = Number(src.mintFee);
	const minW = Number(src.minWithdrawal);
	const conf = Number(src.confirmations);
	const auto = Number(src.autoApproveUnder);
	const hot = Number(src.hotWallet);
	const alert = Number(src.hotAlert);
	const network = Number(src.networkFee);
	const title = text(src.featuredTitle, 60);
	const galleryName = text(src.galleryName, 60);
	const tagline = text(src.tagline, 160);
	if (![
		feeBps,
		mintFee,
		minW,
		conf,
		auto,
		hot,
		alert,
		network
	].every((n) => Number.isFinite(n))) throw new Error("Settings contain an invalid number.");
	if (feeBps < 0 || feeBps > 2e3) throw new Error("Platform fee must be between 0 and 20%.");
	if (mintFee < 0 || mintFee > 10) throw new Error("Mint fee looks wrong.");
	if (conf < 1 || conf > 64) throw new Error("Confirmations must be 1–64.");
	if (!title) throw new Error("Name the featured collection.");
	if (galleryName.length < 2) throw new Error("Name the gallery.");
	return {
		feeBps: Math.round(feeBps),
		mintFee: mintFee.toFixed(6),
		minW: minW.toFixed(6),
		conf: Math.round(conf),
		auto: auto.toFixed(6),
		hot: hot.toFixed(6),
		alert: alert.toFixed(6),
		network: network.toFixed(6),
		title,
		galleryName,
		tagline
	};
}).handler(adminSaveSettings_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	await sql.query(`update settings set platform_fee_bps = $1, mint_fee = $2::numeric, min_withdrawal = $3::numeric,
         confirmations_required = $4, auto_approve_under = $5::numeric, hot_wallet_balance = $6::numeric,
         hot_wallet_alert = $7::numeric, network_fee = $8::numeric, featured_title = $9,
         gallery_name = $10, tagline = $11
       where id = 1`, [
		data.feeBps,
		data.mintFee,
		data.minW,
		data.conf,
		data.auto,
		data.hot,
		data.alert,
		data.network,
		data.title,
		data.galleryName,
		data.tagline
	]);
	await audit(sql, context.userId, "settings.save", "settings", data.title);
	return { ok: true };
});
var adminAddCategory_createServerFn_handler = createServerRpc({
	id: "fba86b414fec579c5946b5620d6214d7453dccd30ac0c1268b394c1f32055e8c",
	name: "adminAddCategory",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminAddCategory.__executeServer(opts));
var adminAddCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const name = text(input, 40);
	if (name.length < 2) throw new Error("Category name is too short.");
	return name;
}).handler(adminAddCategory_createServerFn_handler, async ({ context, data: name }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	await sql.query(`insert into categories (slug, name, sort) values ($1, $2, 50) on conflict (slug) do nothing`, [slugName, name]);
	await audit(sql, context.userId, "category.add", slugName, name);
	return { ok: true };
});
var adminDeposits_createServerFn_handler = createServerRpc({
	id: "47fd3b41dba1518ab331393a5558f32a7c067f4d118a3ecebc6a3ddae9197fd0",
	name: "adminDeposits",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminDeposits.__executeServer(opts));
var adminDeposits = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminDeposits_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await prepare(sql);
	await requireAdmin(sql, context.userId);
	return sql.query(`select d.id, p.username, d.amount::text as amount, d.confirmations, d.status, d.tx_hash,
              ${ISO("d.created_at")} as at
       from deposits d join profiles p on p.user_id = d.user_id
       order by d.created_at desc limit 50`);
});
var adminWithdrawals_createServerFn_handler = createServerRpc({
	id: "bd16b8e6bc29ea6625462a2661d69926695c395a984245fc40469821f85cdd4b",
	name: "adminWithdrawals",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminWithdrawals.__executeServer(opts));
var adminWithdrawals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminWithdrawals_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	return sql.query(`select w.id, p.username, w.amount::text as amount, w.network_fee::text as network_fee,
              w.destination, w.status, w.tx_hash, ${ISO("w.created_at")} as at
       from withdrawals w join profiles p on p.user_id = w.user_id
       order by case when w.status = 'pending' then 0 else 1 end, w.created_at desc limit 50`);
});
var adminDecideWithdrawal_createServerFn_handler = createServerRpc({
	id: "e40e58f23ed60af2e2f4373f0f9f5179446e882278f5064c07849e663c895133",
	name: "adminDecideWithdrawal",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminDecideWithdrawal.__executeServer(opts));
var adminDecideWithdrawal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const decision = src.decision === "approve" || src.decision === "reject" ? src.decision : null;
	if (!decision) throw new Error("Choose approve or reject.");
	const txHashIn = text(src.txHash, 80);
	if (txHashIn && !/^0x[a-fA-F0-9]{64}$/.test(txHashIn)) throw new Error("Transaction hash must be 0x and 64 hex characters.");
	return {
		id: intId(src.id),
		decision,
		reason: text(src.reason, 240),
		txHash: txHashIn
	};
}).handler(adminDecideWithdrawal_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	if (data.decision === "reject") {
		if (data.reason.length < 3) throw new Error("A reason is required to reject.");
		if (!(await sql.query(`with w as (
            select * from withdrawals where id = $1 and status = 'pending' for update
          ),
          rel as (
            update profiles set locked_balance = greatest(0, locked_balance - ((select amount from w) + (select network_fee from w)))
            where user_id = (select user_id from w) and exists (select 1 from w)
            returning user_id
          ),
          done as (
            update withdrawals set status = 'rejected', reason = $2, updated_at = now()
            where id = (select id from w) and exists (select 1 from rel)
            returning id
          )
          select id from done`, [data.id, data.reason])).length) throw new Error("That withdrawal is not pending.");
		await audit(sql, context.userId, "withdrawal.reject", String(data.id), data.reason);
		return { ok: true };
	}
	await completeWithdrawal(sql, data.id, context.userId, data.txHash || void 0);
	return { ok: true };
});
var adminAudit_createServerFn_handler = createServerRpc({
	id: "265a16da582d23e04c4c7c3d4024c252f020218e94873b5a0ebdfefb99995e14",
	name: "adminAudit",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminAudit.__executeServer(opts));
var adminAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminAudit_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	return sql.query(`select a.id, a.action, a.target, a.detail, ${ISO("a.created_at")} as at,
              coalesce(p.display_name, a.actor_id) as actor
       from audit_log a left join profiles p on p.user_id = a.actor_id
       order by a.created_at desc limit 80`);
});
var getCollection_createServerFn_handler = createServerRpc({
	id: "9bf5737d8c43dfdd8624a1080e62c1d63164ff039f78bd86594ae4cfaf4acb8e",
	name: "getCollection",
	filename: "src/lib/market.functions.ts"
}, (opts) => getCollection.__executeServer(opts));
var getCollection = createServerFn({ method: "GET" }).validator((input) => text(input, 60).toLowerCase()).handler(getCollection_createServerFn_handler, async ({ data: slug }) => {
	const sql = await getSql();
	await prepare(sql);
	const collection = (await sql.query(`select slug, name, blurb from collections where slug = $1`, [slug]))[0];
	if (!collection) return null;
	const works = await sql.query(`${CARD_SELECT} ${CARD_FROM}
       join collection_artworks ca on ca.artwork_id = a.id
       join collections col on col.id = ca.collection_id
       where col.slug = $1 and a.hidden = false and a.removed = false
       order by ca.position, a.id`, [slug]);
	return {
		...collection,
		works
	};
});
var getWorkOffers_createServerFn_handler = createServerRpc({
	id: "e1c86aa2309ba6313132a7d61f38610fdaf14e3e6d4cc12a35fd8d52efdce6a6",
	name: "getWorkOffers",
	filename: "src/lib/market.functions.ts"
}, (opts) => getWorkOffers.__executeServer(opts));
var getWorkOffers = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => intId(input)).handler(getWorkOffers_createServerFn_handler, async ({ context, data: artworkId }) => {
	const sql = await getSql();
	const profile = await ensureProfile(sql, context.userId);
	return sql.query(`select o.id, o.amount::text as amount, p.display_name as bidder_name
       from offers o
       join profiles p on p.user_id = o.bidder_id
       join artworks a on a.id = o.artwork_id
       where o.artwork_id = $1 and o.status = 'active' and a.owner_id = $2
       order by o.amount desc`, [artworkId, profile.user_id]);
});
function collectionSlug(name) {
	const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
	return slug.length >= 2 ? slug : "";
}
var adminListCollections_createServerFn_handler = createServerRpc({
	id: "d60c783cc459731164e035a7e298ba5e67e202fcffaae5550d3dda79e4433ea0",
	name: "adminListCollections",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminListCollections.__executeServer(opts));
var adminListCollections = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListCollections_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const rows = await sql.query(`select c.slug, c.name, c.blurb, ca.artwork_id
       from collections c
       left join collection_artworks ca on ca.collection_id = c.id
       order by c.sort, c.name, ca.position`);
	const map = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const current = map.get(row.slug) ?? {
			slug: row.slug,
			name: row.name,
			blurb: row.blurb,
			artworkIds: []
		};
		if (row.artwork_id) current.artworkIds.push(row.artwork_id);
		map.set(row.slug, current);
	}
	return [...map.values()];
});
var adminSaveCollection_createServerFn_handler = createServerRpc({
	id: "3ae36125d2e30512a1c51a66d2ddaaefb78b79a3491a09d6620fd6d788072e6b",
	name: "adminSaveCollection",
	filename: "src/lib/market.functions.ts"
}, (opts) => adminSaveCollection.__executeServer(opts));
var adminSaveCollection = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const src = input ?? {};
	const name = text(src.name, 60);
	if (name.length < 2) throw new Error("Name the collection.");
	const ids = Array.isArray(src.artworkIds) ? src.artworkIds.map((id) => intId(id)).slice(0, 24) : [];
	return {
		name,
		blurb: text(src.blurb, 280),
		artworkIds: [...new Set(ids)]
	};
}).handler(adminSaveCollection_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const slug = collectionSlug(data.name);
	if (!slug) throw new Error("That name cannot become a link.");
	const id = (await sql.query(`insert into collections (slug, name, blurb, sort)
       values ($1, $2, $3, 10)
       on conflict (slug) do update set name = excluded.name, blurb = excluded.blurb
       returning id`, [
		slug,
		data.name,
		data.blurb
	]))[0]?.id;
	if (!id) throw new Error("Could not save the collection.");
	await sql.query(`delete from collection_artworks where collection_id = $1`, [id]);
	for (let i = 0; i < data.artworkIds.length; i += 1) await sql.query(`insert into collection_artworks (collection_id, artwork_id, position)
         select $1, id, $3 from artworks where id = $2 and removed = false
         on conflict do nothing`, [
		id,
		data.artworkIds[i],
		i + 1
	]);
	await audit(sql, context.userId, "collection.save", slug, data.name);
	return { slug };
});
var submitContact_createServerFn_handler = createServerRpc({
	id: "fcf395896484559c964641aa73e059f72911f550f58de5369dba6c4a3d282790",
	name: "submitContact",
	filename: "src/lib/market.functions.ts"
}, (opts) => submitContact.__executeServer(opts));
var submitContact = createServerFn({ method: "POST" }).validator((input) => {
	const src = input ?? {};
	const name = text(src.name, 80);
	const email = text(src.email, 200);
	const topic = text(src.topic, 40);
	const message = text(src.message, 2e3);
	if (name.length < 2) throw new Error("Enter your name.");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
	if (![
		"Account",
		"Buying",
		"Selling",
		"Deposits",
		"Other"
	].includes(topic)) throw new Error("Choose a topic.");
	if (message.length < 10) throw new Error("Please write at least a short message.");
	return {
		name,
		email,
		topic,
		message
	};
}).handler(submitContact_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	rateLimit(`contact:${data.email.toLowerCase()}`, 5, 36e5);
	await sql.query(`insert into contact_messages (name, email, topic, message) values ($1, $2, $3, $4)`, [
		data.name,
		data.email,
		data.topic,
		data.message
	]);
	return { ok: true };
});
//#endregion
export { acceptOffer_createServerFn_handler, adminAddCategory_createServerFn_handler, adminAudit_createServerFn_handler, adminDecideWithdrawal_createServerFn_handler, adminDeposits_createServerFn_handler, adminGetSettings_createServerFn_handler, adminLedger_createServerFn_handler, adminListCollections_createServerFn_handler, adminModerate_createServerFn_handler, adminOverview_createServerFn_handler, adminResetPassword_createServerFn_handler, adminSaveCollection_createServerFn_handler, adminSaveSettings_createServerFn_handler, adminSetBalance_createServerFn_handler, adminUpdateUser_createServerFn_handler, adminUsers_createServerFn_handler, adminWithdrawals_createServerFn_handler, adminWorks_createServerFn_handler, buyListing_createServerFn_handler, cancelMyListing_createServerFn_handler, claimDesk_createServerFn_handler, getActivity_createServerFn_handler, getArtist_createServerFn_handler, getArtwork_createServerFn_handler, getCatalog_createServerFn_handler, getCollection_createServerFn_handler, getDashboard_createServerFn_handler, getDeposits_createServerFn_handler, getHome_createServerFn_handler, getMe_createServerFn_handler, getWithdrawals_createServerFn_handler, getWorkOffers_createServerFn_handler, listWork_createServerFn_handler, makeOffer_createServerFn_handler, markNotificationsRead_createServerFn_handler, mintWork_createServerFn_handler, placeBid_createServerFn_handler, registerDeposit_createServerFn_handler, rejectOffer_createServerFn_handler, requestWithdrawal_createServerFn_handler, searchStudios_createServerFn_handler, submitContact_createServerFn_handler, toggleFavorite_createServerFn_handler, updateMe_createServerFn_handler, withdrawOffer_createServerFn_handler };
