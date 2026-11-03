import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { $ as require_react, C as useNavigate, Q as notFound, S as Navigate, T as require_jsx_runtime, _ as Outlet, b as createRootRoute, f as Scripts, g as createRouter, m as useRouterState, n as require_react_dom, p as HeadContent, v as lazyRouteComponent, w as useRouter, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as getHome, f as getMe } from "./market.functions-D39Za-xC.mjs";
import { c as getDisplayZone, i as ethUsdRate, n as displayZones, o as formatUsd, u as setDisplayZone } from "./format-BVC2xU7d.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { a as signOut, r as getBearerToken, t as authClient } from "./client-A6JBalEN.mjs";
import { t as useCurrentUserState } from "./use-current-user-BBitMO9P.mjs";
import { a as Search, n as TriangleAlert, o as Moon, r as Sun, s as Menu, t as X, x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as auth, t as SESSION_TOKEN_COOKIE } from "./server-Ca1SLScK.mjs";
import { i as getSql } from "./db-DWDn8PPZ.mjs";
import { t as sendAccountNotice } from "./mail.server--cXB2VJG.mjs";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DR0K5QPe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter$20 = () => import("./admin-C0VkW0DH.mjs");
var SECTIONS = [
	"overview",
	"users",
	"deposits",
	"withdrawals",
	"address",
	"artworks",
	"transactions",
	"settings",
	"admins",
	"audit"
];
var Route$25 = createFileRoute("/admin")({
	validateSearch: (search) => ({ section: SECTIONS.includes(search.section) ? search.section : "overview" }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/back-button-CS0p2Ju9.js
function BackButton({ className = "" }) {
	const router = useRouter();
	const { user } = useCurrentUserState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: `inline-flex items-center gap-2 px-1 py-2 text-sm font-semibold ${className}`,
		onClick: () => {
			if (window.history.length > 1) router.history.back();
			else router.navigate({ to: user ? "/dashboard" : "/" });
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
			size: 18,
			"aria-hidden": true
		}), "Back"]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users._id-DfKtkSyo.js
var $$splitComponentImporter$19 = () => import("./admin.users._id-CZ6Pi2X3.mjs");
var Route$24 = createFileRoute("/admin/users/$id")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/provider-DxUH19D8.js
var MarketContext = (0, import_react.createContext)(null);
function applyTheme(next) {
	const root = document.documentElement;
	root.dataset.theme = next;
	root.style.colorScheme = next;
	root.style.backgroundColor = next === "dark" ? "#0b1220" : "#ffffff";
	const meta = document.querySelector("meta[name=\"theme-color\"]");
	if (meta) meta.setAttribute("content", next === "dark" ? "#0b1220" : "#ffffff");
	try {
		window.localStorage.setItem("agora-theme", next);
	} catch {}
}
function MarketProvider({ children }) {
	const { user, isPending } = useCurrentUserState();
	const [me, setMe] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [theme, setTheme] = (0, import_react.useState)("light");
	const [timeZone, setTimeZoneState] = (0, import_react.useState)(getDisplayZone());
	const userId = user?.id;
	(0, import_react.useEffect)(() => {
		const next = window.localStorage.getItem("agora-theme") === "dark" ? "dark" : "light";
		applyTheme(next);
		setTheme(next);
	}, []);
	const toggleTheme = (0, import_react.useCallback)(() => {
		const next = (document.documentElement.dataset.theme === "dark" ? "dark" : "light") === "dark" ? "light" : "dark";
		applyTheme(next);
		setTheme(next);
	}, []);
	const setTimeZone = (0, import_react.useCallback)((zone) => {
		setDisplayZone(zone);
		const next = getDisplayZone();
		setTimeZoneState(next);
		try {
			window.localStorage.setItem("agora-tz", next);
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		const stored = window.localStorage.getItem("agora-tz");
		if (stored) setTimeZone(stored);
	}, [setTimeZone]);
	const refresh = (0, import_react.useCallback)(() => {
		if (!userId) {
			setMe(null);
			setReady(true);
			return;
		}
		getMe().then(setMe).catch(() => setMe(null)).finally(() => setReady(true));
	}, [userId]);
	(0, import_react.useEffect)(() => {
		setReady(false);
		refresh();
	}, [refresh]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MarketContext.Provider, {
		value: {
			me,
			authPending: isPending,
			ready,
			refresh,
			theme,
			toggleTheme,
			timeZone,
			setTimeZone
		},
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			theme,
			position: "top-center"
		})]
	});
}
function useMarket() {
	const value = (0, import_react.useContext)(MarketContext);
	if (!value) throw new Error("useMarket must be used inside MarketProvider");
	return value;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/art._id-Chu17aE6.js
var $$splitComponentImporter$18 = () => import("./art._id-CuW0LCYb.mjs");
var Route$23 = createFileRoute("/art/$id")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/artist._slug-DjmKpHw1.js
var $$splitComponentImporter$17 = () => import("./artist._slug-LoCGtTW3.mjs");
var Route$22 = createFileRoute("/artist/$slug")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/collection._slug-D0p5qFSU.js
var $$splitComponentImporter$16 = () => import("./collection._slug-Q801sJ0E.mjs");
var Route$21 = createFileRoute("/collection/$slug")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/gates-DAcC0TmH.js
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/explore-Cr_EJwax.js
var $$splitComponentImporter$15 = () => import("./explore-Cic2JhOd.mjs");
var Route$20 = createFileRoute("/explore")({
	validateSearch: (search) => ({
		q: typeof search.q === "string" ? search.q : "",
		category: typeof search.category === "string" ? search.category : "",
		kind: search.kind === "fixed" || search.kind === "auction" ? search.kind : "",
		min: typeof search.min === "string" ? search.min : "",
		max: typeof search.max === "string" ? search.max : "",
		sort: search.sort === "price_asc" || search.sort === "price_desc" || search.sort === "ending" ? search.sort : "newest",
		artist: typeof search.artist === "string" ? search.artist : ""
	}),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/legal._page-DxNRW7yE.js
var $$splitComponentImporter$14 = () => import("./legal._page-BCF1osRd.mjs");
var PAGES = {
	terms: {
		title: "Terms of Service",
		body: [
			"These terms govern your use of Agora Gallery NFTs. By creating an account, you agree to them.",
			"You must be at least 18 years old and able to form a binding contract under US law. You are responsible for the accuracy of your account information.",
			"Artworks listed on the marketplace are offered by their owners. A completed purchase transfers the listed work in our records and pays the seller, the artist royalty, and the platform fee.",
			"Digital assets are volatile. Agora Gallery NFTs does not provide investment, legal, or tax advice. You can lose the entire amount you deposit.",
			"We may suspend an account that violates these terms, including fraud, infringement, or misuse of the withdrawal process."
		]
	},
	privacy: {
		title: "Privacy Policy",
		body: [
			"We collect the information you give us: name, email, password (stored as a hash), profile details, and messages you send to support.",
			"We also store marketplace activity, including listings, purchases, deposits, withdrawals, and sign-in records, so we can operate your account and investigate disputes.",
			"We do not sell personal information. We share it only with service providers who process it for us, or when the law requires it.",
			"You may request a correction or deletion of your account by contacting support@agoragallery.com. Some records are kept where we have a legal duty to retain them."
		]
	},
	cookies: {
		title: "Cookie Policy",
		body: [
			"We use a necessary session cookie to keep you signed in. It is httpOnly, Secure, and SameSite, and it is cleared when you sign out.",
			"Your theme, time zone, and cookie choice are stored in local storage on this device. They are not used for advertising.",
			"Blocking the session cookie will sign you out. You can withdraw the cookie choice by clearing site data in your browser."
		]
	},
	fees: {
		title: "Fees and Royalties",
		body: [
			"Minting a work charges the mint fee shown on the mint page. The default is 0.20 ETH. The fee is paid from your account balance to the platform.",
			"A primary or secondary sale pays the artist the royalty percentage set when the work was minted. The platform fee is taken from the sale price. The seller receives the remainder.",
			"Withdrawals may include a network fee. The minimum withdrawal is set by the marketplace and shown before you confirm.",
			"US dollar amounts next to ETH prices use a published reference rate. They are estimates, not a quote or an offer to exchange at that price."
		]
	}
};
var Route$19 = createFileRoute("/legal/$page")({
	component: lazyRouteComponent($$splitComponentImporter$14, "component"),
	loader: ({ params }) => {
		if (!PAGES[params.page]) throw notFound();
		return PAGES[params.page];
	}
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/login-Cfe7ICRM.js
var $$splitComponentImporter$13 = () => import("./login-D0IDNDr6.mjs");
var Route$18 = createFileRoute("/login")({
	validateSearch: (search) => ({ mode: search.mode === "up" ? "up" : "in" }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/verify-email-9OXKo2a8.js
var $$splitComponentImporter$12 = () => import("./verify-email-DGtfdp68.mjs");
var Route$17 = createFileRoute("/verify-email")({
	validateSearch: (search) => ({
		email: typeof search.email === "string" ? search.email : "",
		code: typeof search.code === "string" ? search.code.replace(/\D/g, "").slice(0, 6) : ""
	}),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BgE8hBxI.js
var router_BgE8hBxI_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var PROTECTED = [
	"/dashboard",
	"/mint",
	"/deposit",
	"/withdraw"
];
var WARN_MS = 168e4;
var LIMIT_MS = 18e5;
function SessionWatch() {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const [warn, setWarn] = (0, import_react.useState)(false);
	const last = (0, import_react.useRef)(Date.now());
	const signedOut = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const leave = () => {
			if (signedOut.current) return;
			if (window.location.pathname.startsWith("/admin")) return;
			signedOut.current = true;
			window.location.replace("/");
		};
		let channel = null;
		try {
			channel = new BroadcastChannel("agora-auth");
			channel.onmessage = (event) => {
				if (event.data === "signed-out") leave();
			};
		} catch {
			channel = null;
		}
		const onStorage = (event) => {
			if (event.key === "agora-signed-out") leave();
		};
		window.addEventListener("storage", onStorage);
		return () => {
			channel?.close();
			window.removeEventListener("storage", onStorage);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (isPending || user) return;
		if (PROTECTED.some((path) => pathname === path || pathname.startsWith(`${path}/`))) window.location.replace("/login?mode=in");
	}, [
		isPending,
		user,
		pathname
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const mark = () => {
			last.current = Date.now();
			setWarn(false);
		};
		const events = [
			"pointerdown",
			"keydown",
			"scroll"
		];
		for (const name of events) window.addEventListener(name, mark, { passive: true });
		const timer = window.setInterval(() => {
			const idle = Date.now() - last.current;
			if (idle >= LIMIT_MS) {
				signOut("/");
				return;
			}
			if (idle >= WARN_MS) setWarn(true);
		}, 15e3);
		const onFocus = () => {
			authClient.getSession().then((result) => {
				if (!result.data?.user && !getBearerToken()) {
					if (PROTECTED.some((path) => pathname === path)) window.location.replace("/login?mode=in");
				}
			});
		};
		window.addEventListener("focus", onFocus);
		return () => {
			for (const name of events) window.removeEventListener(name, mark);
			window.clearInterval(timer);
			window.removeEventListener("focus", onFocus);
		};
	}, [user, pathname]);
	if (!warn) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[90] grid place-items-center bg-ink/50 px-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "idle-title",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-line bg-surface p-6 text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "idle-title",
					className: "text-xl",
					children: "You will be signed out soon"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "For your security, this session ends after 30 minutes without activity. Two minutes remain."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn",
						onClick: () => {
							last.current = Date.now();
							setWarn(false);
						},
						children: "Stay signed in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-ghost",
						onClick: () => void signOut("/"),
						children: "Sign out"
					})]
				})
			]
		})
	});
}
var floor = {
	q: "",
	category: "",
	kind: "",
	min: "",
	max: "",
	sort: "newest",
	artist: ""
};
function Shell({ children }) {
	const { me, toggleTheme, timeZone, setTimeZone } = useMarket();
	const { user } = useCurrentUserState();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const [q, setQ] = (0, import_react.useState)("");
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [account, setAccount] = (0, import_react.useState)(false);
	const [banner, setBanner] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (pathname.startsWith("/admin")) return;
		getHome().then((data) => setBanner(data.announcement || "")).catch(() => void 0);
	}, [pathname]);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = menu ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [menu]);
	function search(event) {
		event.preventDefault();
		setMenu(false);
		navigate({
			to: "/explore",
			search: {
				...floor,
				q
			}
		});
	}
	if (pathname.startsWith("/admin")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#f4f6f8] text-[#111827]",
		children
	});
	const letter = (me?.profile.display_name || "A").charAt(0).toUpperCase();
	const home = pathname === "/";
	const studio = pathname === "/dashboard";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: home || studio ? "min-h-screen bg-[#0d0d0f] text-white" : "min-h-screen bg-bg text-fg",
		children: [
			!studio && !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: `sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] ${home ? "border-white/10 bg-[#0d0d0f] text-white" : "border-line bg-bg text-fg"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 md:hidden ${home ? "text-white" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid h-11 w-11 place-items-center",
							"aria-label": menu ? "Close menu" : "Open menu",
							"aria-expanded": menu,
							onClick: () => setMenu((value) => !value),
							children: menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								size: 22,
								"aria-hidden": true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
								size: 22,
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-w-0 items-center gap-2 text-lg font-extrabold tracking-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-full bg-accent text-sm text-white",
								children: "A"
							}), "Agora"]
						}),
						user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ml-auto grid h-11 w-11 place-items-center",
							"aria-label": "Search",
							onClick: () => setMenu(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								size: 20,
								"aria-hidden": true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountButton, {
							letter,
							name: me?.profile.display_name,
							open: account,
							setOpen: setAccount
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: { mode: "in" },
								className: "px-2 text-sm font-semibold",
								children: "Sign in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/create-account",
								className: "rounded-full bg-accent px-3 py-2 text-xs font-bold text-white",
								children: "Create account"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto hidden h-16 max-w-6xl items-center gap-2 px-4 md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-w-0 items-center gap-2 text-lg font-extrabold tracking-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-full bg-accent text-sm text-white",
								children: "A"
							}), "Agora Gallery NFTs"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "ml-4 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
								to: "/explore",
								search: floor,
								active: pathname === "/explore",
								children: "Explore"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
								to: "/artists",
								active: pathname.startsWith("/artist"),
								children: "Artists"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
							onSubmit: search,
							className: "ml-auto w-56",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchField, {
								q,
								setQ
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeButton, { onClick: toggleTheme }),
						user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountButton, {
							letter,
							name: me?.profile.display_name,
							open: account,
							setOpen: setAccount
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							search: { mode: "in" },
							className: "btn-ghost px-3 text-sm",
							children: "Sign in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/create-account",
							className: "btn px-3 text-sm",
							children: "Create account"
						})] })
					]
				})]
			}) : null,
			menu && !studio ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `fixed inset-0 z-[80] flex h-dvh flex-col pt-[env(safe-area-inset-top)] md:hidden ${home ? "bg-[#0d0d0f] text-white" : "bg-bg text-fg"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-16 items-center justify-between border-b border-line px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-extrabold",
						children: "Agora Gallery NFTs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface",
						"aria-label": "Close menu",
						onClick: () => setMenu(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							size: 20,
							"aria-hidden": true
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
							onSubmit: search,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchField, {
								q,
								setQ
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "mt-4 grid gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
								to: "/explore",
								search: floor,
								active: pathname === "/explore",
								children: "Explore"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
								to: "/artists",
								active: pathname.startsWith("/artist"),
								children: "Artists"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "mt-3 flex min-h-12 w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-left text-sm font-semibold",
							onClick: toggleTheme,
							children: [
								"Dark mode",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-accent px-3 py-1 text-xs font-bold text-white dark:hidden",
									children: "Off"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden rounded-full bg-accent px-3 py-1 text-xs font-bold text-white dark:inline",
									children: "On"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedIn, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard",
								className: "btn-ghost",
								children: "Dashboard"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-ghost",
								onClick: () => void signOut("/"),
								children: "Sign out"
							})] })
						})
					]
				})]
			}), document.body) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				banner && !pathname.startsWith("/admin") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "bg-[#2563eb] px-4 py-2 text-center text-sm text-white",
					children: banner
				}) : null,
				pathname !== "/" && !studio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl px-3 pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {})
				}) : null,
				children
			] }),
			studio ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
				timeZone,
				setTimeZone,
				dark: home
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieNotice, { lift: studio }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionWatch, {})
		]
	});
}
function ThemeButton({ onClick, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: `grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface ${className}`,
		onClick,
		"aria-label": "Toggle color theme",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {
			size: 18,
			className: "dark:hidden",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
			size: 18,
			className: "hidden dark:block",
			"aria-hidden": true
		})]
	});
}
function SearchField({ q, setQ }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "relative block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Search artworks"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
				size: 16,
				className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (event) => setQ(event.target.value),
				placeholder: "Search artworks",
				className: "field bg-surface pl-9"
			})
		]
	});
}
function NavLink({ to, search, active, children }) {
	const className = `rounded-xl px-3 py-3 text-base font-semibold md:py-2 md:text-sm ${active ? "bg-accent text-white" : "text-fg"}`;
	if (search) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		search,
		className,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className,
		children
	});
}
function AccountButton({ letter, name, open, setOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "grid h-11 w-11 place-items-center rounded-full bg-accent text-sm font-bold text-white",
			"aria-label": "Account menu",
			"aria-expanded": open,
			onClick: () => setOpen(!open),
			children: letter
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 z-10 mt-2 w-56 rounded-2xl border border-line bg-surface p-2 text-fg shadow-[var(--shadow)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 py-2 text-sm font-semibold",
					children: name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					className: "block rounded-xl px-3 py-2 text-sm hover:bg-raised",
					onClick: () => setOpen(false),
					children: "Dashboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-raised",
					onClick: () => void signOut("/"),
					children: "Sign out"
				})
			]
		}) : null]
	});
}
function Footer({ timeZone, setTimeZone, dark }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: dark ? "mt-8 border-t border-white/10 bg-[#0d0d0f] text-white" : "mt-16 border-t border-line bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-extrabold",
						children: "Agora Gallery NFTs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "A marketplace for original digital art. Prices are shown in ETH with an estimated US dollar value."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [
							"Reference rate: 1 ETH ≈ ",
							formatUsd(ethUsdRate()),
							". This is not a live quote."
						]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Company"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/legal/$page",
							params: { page: "terms" },
							children: "Terms of Service"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/legal/$page",
							params: { page: "privacy" },
							children: "Privacy Policy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/legal/$page",
							params: { page: "cookies" },
							children: "Cookie Policy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/legal/$page",
							params: { page: "fees" },
							children: "Fees and Royalties"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Support"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/help",
							children: "Help Center"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							children: "Contact Us"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "mailto:support@agoragallery.com",
							children: "support@agoragallery.com"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://x.com",
							rel: "noreferrer",
							children: "X"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://www.instagram.com",
							rel: "noreferrer",
							children: "Instagram"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "Time zone"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "field mt-2",
							value: timeZone,
							onChange: (event) => setTimeZone(event.target.value),
							"aria-label": "Time zone",
							children: displayZones().map((zone) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: zone,
								children: zone.replace("America/", "").replace("Pacific/", "").replaceAll("_", " ")
							}, zone))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted",
							children: "Times use a 12-hour clock. The default is US Eastern."
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto max-w-6xl px-4 py-4 text-sm text-muted",
				children: "© 2026 Agora Gallery NFTs. All rights reserved."
			})
		})]
	});
}
function CookieNotice({ lift = false }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			setOpen(window.localStorage.getItem("agora-cookies") !== "accepted");
		} catch {
			setOpen(true);
		}
	}, []);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `fixed inset-x-0 z-50 border-t border-line bg-surface p-4 text-sm shadow-[var(--shadow)] ${lift ? "bottom-16" : "bottom-0"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "max-w-3xl text-muted",
				children: [
					"We use necessary cookies to keep you signed in. See the ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/legal/$page",
						params: { page: "cookies" },
						className: "text-accent",
						children: "Cookie Policy"
					}),
					"."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn",
				onClick: () => {
					try {
						window.localStorage.setItem("agora-cookies", "accepted");
					} catch {}
					setOpen(false);
				},
				children: "Accept"
			})]
		})
	});
}
var styles_default = "/assets/styles-0YCLIhiq.css";
var APP_NAME = "Agora Gallery NFTs";
var Route$16 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Agora Gallery NFTs is a contemporary art exchange with fixed prices, timed bids, and artist royalties."
			},
			{
				name: "theme-color",
				content: "#ffffff"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: "try{var d=localStorage.getItem('agora-theme')==='dark';var r=document.documentElement;r.dataset.theme=d?'dark':'light';r.style.colorScheme=d?'dark':'light';var m=document.querySelector('meta[name=\"theme-color\"]');if(m)m.setAttribute('content',d?'#0b1220':'#ffffff')}catch(e){}" } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$11 = () => import("./routes-BwOykxjb.mjs");
var Route$15 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./activity-DKYjBl_Z.mjs");
var Route$14 = createFileRoute("/activity")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./artists-D-Gucfgm.mjs");
var Route$13 = createFileRoute("/artists")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./contact-DGRMpnn6.mjs");
var Route$12 = createFileRoute("/contact")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./create-account-DaRqDKMI.mjs");
var Route$11 = createFileRoute("/create-account")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./dashboard-5PlW_9pd.mjs");
var Route$10 = createFileRoute("/dashboard")({
	headers: () => ({ "Cache-Control": "no-store" }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./deposit-DGmkXb4b.mjs");
var Route$9 = createFileRoute("/deposit")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./help-BEe-Ha_A.mjs");
var Route$8 = createFileRoute("/help")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./mint-CGZCEKNf.mjs");
var Route$7 = createFileRoute("/mint")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./withdraw-D4rgXe8I.mjs");
var Route$6 = createFileRoute("/withdraw")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.login-CeiCFn29.mjs");
var Route$5 = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.password-C4UoAS28.mjs");
var Route$4 = createFileRoute("/admin/password")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
function json$1(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "content-type": "application/json; charset=utf-8" }
	});
}
var Route$3 = createFileRoute("/api/gallery")({ server: { handlers: { GET: async ({ request }) => {
	const url = new URL(request.url);
	const view = url.searchParams.get("view") ?? "floor";
	const sql = await getSql();
	if (view === "floor") return json$1({ works: await sql.query(`select a.id, a.title, c.display_name as artist, c.username,
                    l.kind, l.price::text as price
             from artworks a
             join profiles c on c.user_id = a.creator_id
             left join listings l on l.artwork_id = a.id and l.status = 'active'
             where a.hidden = false and a.removed = false
             order by a.created_at desc
             limit 24`) });
	if (view === "search") {
		const q = (url.searchParams.get("q") ?? "").trim().slice(0, 40);
		if (q.length < 2) return json$1({ studios: [] });
		const like = `%${q.replace(/[%_]/g, "")}%`;
		return json$1({ studios: await sql.query(`select username, display_name, city
             from profiles
             where status = 'active' and role <> 'treasury'
               and (username ilike $1 or display_name ilike $1)
             order by display_name
             limit 12`, [like]) });
	}
	if (view === "me") {
		const userId = (await auth.api.getSession({ headers: request.headers }))?.user?.id;
		if (!userId) return json$1({ error: "Sign in required." }, 401);
		const profile = await sql.query(`select username, display_name, balance::text as balance, locked_balance::text as locked
             from profiles where user_id = $1`, [userId]);
		const activity = await sql.query(`select kind, detail, created_at from activity_log where user_id = $1 order by created_at desc limit 30`, [userId]);
		const minted = await sql.query(`select count(*)::int as n from artworks where creator_id = $1 and removed = false`, [userId]);
		return json$1({
			profile: profile[0] ?? null,
			minted: minted[0]?.n ?? 0,
			activity
		});
	}
	return json$1({ error: "Unknown view. Use floor, search, or me." }, 400);
} } } });
var scryptAsync = promisify(scrypt);
var COOKIE = "agora_admin";
var IDLE_MS = 18e5;
var AdminError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
var hits = /* @__PURE__ */ new Map();
function limit(key, max = 40) {
	const now = Date.now();
	const prev = (hits.get(key) ?? []).filter((at) => now - at < 6e4);
	if (prev.length >= max) throw new AdminError(429, "Too many requests. Try again shortly.");
	prev.push(now);
	hits.set(key, prev);
}
function ipOf(request) {
	return (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "").split(",")[0]?.trim() || "";
}
function readCookie(request) {
	const hit = (request.headers.get("cookie") ?? "").split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`));
	return hit ? decodeURIComponent(hit.slice(12)) : "";
}
function setCookie(token, request, maxAge = 1800) {
	return `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}
function clearCookie(request) {
	return setCookie("", request, 0);
}
async function hashPassword(password) {
	const salt = randomBytes(16).toString("hex");
	return `${salt}:${(await scryptAsync(password, salt, 64)).toString("hex")}`;
}
async function checkPassword(password, stored) {
	const [salt, hex] = stored.split(":");
	if (!salt || !hex) return false;
	const buf = await scryptAsync(password, salt, 64);
	const expected = Buffer.from(hex, "hex");
	return expected.length === buf.length && timingSafeEqual(expected, buf);
}
async function audit(sql, actor, action, target, detail, ip, oldValue = "", next = "") {
	await sql.query(`insert into audit_log (actor_id, action, target, detail, ip, old_value, new_value)
     values ($1, $2, $3, $4, $5, $6, $7)`, [
		actor,
		action,
		target,
		detail.slice(0, 500),
		ip.slice(0, 80),
		oldValue.slice(0, 500),
		next.slice(0, 500)
	]);
}
async function ensureDefaultAdmin(sql) {
	const email = (process.env.ADMIN_EMAIL || "admin@agoragallery.nfts").trim().toLowerCase();
	const password = process.env.ADMIN_PASSWORD || "AgoraDesk#2026";
	if ((await sql.query(`select id from admin_accounts where email = $1`, [email])).length) return;
	if ((await sql.query(`select id from admin_accounts limit 1`)).length) return;
	await sql.query(`insert into admin_accounts (id, email, name, password_hash, role, must_change_password)
     values ($1, $2, 'Gallery admin', $3, 'super', true)`, [
		`admin:${randomBytes(8).toString("hex")}`,
		email,
		await hashPassword(password)
	]);
}
async function requireAdmin(request, opts) {
	const sql = await getSql();
	await ensureDefaultAdmin(sql);
	const token = readCookie(request);
	if (!token) throw new AdminError(401, "Sign in required.");
	const admin = (await sql.query(`select a.id, a.email, a.name, a.role, a.must_change_password, s.last_seen
     from admin_sessions s join admin_accounts a on a.id = s.admin_id
     where s.token = $1 and s.expires_at > now()`, [token]))[0];
	if (!admin) throw new AdminError(401, "Sign in required.");
	if (Date.now() - new Date(admin.last_seen).getTime() > IDLE_MS) {
		await sql.query(`delete from admin_sessions where token = $1`, [token]);
		throw new AdminError(401, "Your admin session expired.");
	}
	if (admin.must_change_password && !opts?.allowPasswordChange) throw new AdminError(403, "Change your password before continuing.");
	if (opts?.superOnly && admin.role !== "super") throw new AdminError(403, "A super admin is required.");
	await sql.query(`update admin_sessions set last_seen = now(), expires_at = now() + interval '30 minutes' where token = $1`, [token]);
	return {
		sql,
		admin,
		token,
		ip: ipOf(request)
	};
}
async function userEmail(sql, userId) {
	return (await sql.query(`select "email" as email from "user" where "id" = $1`, [userId]))[0]?.email ?? "";
}
async function notice(to, subject, text) {
	try {
		await sendAccountNotice(to, subject, text);
	} catch (error) {
		console.error("[admin mail]", error);
	}
}
async function resolveUser(sql, raw) {
	const key = raw.trim();
	if (!key) return "";
	return (await sql.query(`select p.user_id from profiles p
     left join "user" u on u."id" = p.user_id
     where p.user_id = $1 or lower(p.username) = lower($1) or lower(coalesce(u."email", '')) = lower($1)
     limit 1`, [key]))[0]?.user_id ?? "";
}
function json(data, status = 200, headers) {
	const out = headers ?? new Headers();
	out.set("content-type", "application/json; charset=utf-8");
	out.set("cache-control", "no-store");
	return new Response(JSON.stringify(data), {
		status,
		headers: out
	});
}
async function bodyOf(request) {
	if (request.method === "GET" || request.method === "HEAD") return {};
	try {
		return await request.json();
	} catch {
		return {};
	}
}
function text(value, max) {
	return String(value ?? "").trim().slice(0, max);
}
function amountOf(value) {
	const n = Number(value);
	if (!Number.isFinite(n) || n <= 0 || n > 1e6) throw new AdminError(400, "Enter a valid ETH amount.");
	return n.toFixed(6);
}
async function handleAdmin(request) {
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
		if (depositAction && method === "POST") return await depositDecision(request, Number(depositAction[1]), depositAction[2]);
		if (path === "withdrawals" && method === "GET") return await withdrawals(request, url);
		const withdrawalAction = path.match(/^withdrawals\/(\d+)\/(approve|reject|complete)$/);
		if (withdrawalAction && method === "POST") return await withdrawalDecision(request, Number(withdrawalAction[1]), withdrawalAction[2]);
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
		return json({
			error: "Not found.",
			status: 404
		});
	} catch (error) {
		if (error instanceof AdminError) return json({
			error: error.message,
			status: error.status
		});
		console.error("[admin]", error);
		return json({
			error: "Something went wrong.",
			status: 500
		});
	}
}
async function login(request) {
	const sql = await getSql();
	await ensureDefaultAdmin(sql);
	const body = await bodyOf(request);
	const email = text(body.email, 200).toLowerCase();
	const password = typeof body.password === "string" ? body.password : "";
	const account = (await sql.query(`select id, password_hash, failed_attempts, locked_until, must_change_password from admin_accounts where email = $1`, [email]))[0];
	if (account?.locked_until && new Date(account.locked_until).getTime() > Date.now()) throw new AdminError(423, "This admin account is locked. Try again in 15 minutes.");
	if (!account || !await checkPassword(password, account.password_hash)) {
		if (account) {
			const attempts = account.failed_attempts + 1;
			await sql.query(`update admin_accounts set failed_attempts = $2, locked_until = case when $2 >= 5 then now() + interval '15 minutes' else null end where id = $1`, [account.id, attempts]);
		}
		throw new AdminError(401, "Email or password is incorrect.");
	}
	await sql.query(`update admin_accounts set failed_attempts = 0, locked_until = null where id = $1`, [account.id]);
	const token = randomBytes(32).toString("hex");
	await sql.query(`insert into admin_sessions (token, admin_id, expires_at, ip) values ($1, $2, now() + interval '30 minutes', $3)`, [
		token,
		account.id,
		ipOf(request)
	]);
	await audit(sql, account.id, "admin.login", account.id, "Signed in", ipOf(request));
	const headers = new Headers();
	headers.append("set-cookie", setCookie(token, request));
	return json({
		ok: true,
		mustChange: account.must_change_password
	}, 200, headers);
}
async function logout(request) {
	const sql = await getSql();
	const token = readCookie(request);
	if (token) {
		const rows = await sql.query(`delete from admin_sessions where token = $1 returning admin_id`, [token]);
		if (rows[0]) await audit(sql, rows[0].admin_id, "admin.logout", rows[0].admin_id, "Signed out", ipOf(request));
	}
	const headers = new Headers();
	headers.append("set-cookie", clearCookie(request));
	return json({ ok: true }, 200, headers);
}
async function session(request) {
	const { admin } = await requireAdmin(request, { allowPasswordChange: true });
	const headers = new Headers();
	headers.append("set-cookie", setCookie(readCookie(request), request));
	return json({ admin: {
		id: admin.id,
		email: admin.email,
		name: admin.name,
		role: admin.role,
		mustChange: admin.must_change_password
	} }, 200, headers);
}
async function changePassword(request) {
	const { sql, admin, ip } = await requireAdmin(request, { allowPasswordChange: true });
	const body = await bodyOf(request);
	const password = typeof body.password === "string" ? body.password : "";
	if (password.length < 8 || password.length > 72) throw new AdminError(400, "Password must be 8–72 characters.");
	await sql.query(`update admin_accounts set password_hash = $2, must_change_password = false where id = $1`, [admin.id, await hashPassword(password)]);
	await audit(sql, admin.id, "admin.password", admin.id, "Password changed", ip);
	return json({ ok: true });
}
async function overview(request) {
	const { sql } = await requireAdmin(request);
	const users = await sql.query(`select count(*)::int as n, coalesce(sum(balance),0)::text as bal from profiles where role in ('user','admin')`);
	const pendingD = await sql.query(`select count(*)::int as n from deposits where status in ('pending','confirming')`);
	const pendingW = await sql.query(`select count(*)::int as n from withdrawals where status = 'pending'`);
	const works = await sql.query(`select count(*)::int as n from artworks where removed = false`);
	const mint = await sql.query(`select coalesce(sum(price),0)::text as v from transactions where kind = 'mint_fee'`);
	const activity = await sql.query(`select id, action, target, detail, ${iso("created_at")} as at from audit_log order by created_at desc limit 8`);
	return json({
		users: users[0]?.n ?? 0,
		balances: users[0]?.bal ?? "0",
		pendingDeposits: pendingD[0]?.n ?? 0,
		pendingWithdrawals: pendingW[0]?.n ?? 0,
		artworks: works[0]?.n ?? 0,
		mintFees: mint[0]?.v ?? "0",
		activity
	});
}
function iso(column) {
	return `to_char(${column} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;
}
async function users(request, url) {
	const { sql } = await requireAdmin(request);
	const q = text(url.searchParams.get("q"), 80);
	const status = text(url.searchParams.get("status"), 20);
	const page = Math.max(1, Number(url.searchParams.get("page") || 1) || 1);
	const like = `%${q.replace(/[%_]/g, "")}%`;
	return json({
		rows: await sql.query(`select p.user_id, p.display_name, p.username, coalesce(u."email", '') as email, p.balance::text as balance,
            p.status, ${iso("p.created_at")} as joined
     from profiles p
     left join "user" u on u."id" = p.user_id
     where p.role <> 'treasury'
       and ($1 = '' or p.display_name ilike $2 or p.username ilike $2 or coalesce(u."email", '') ilike $2)
       and ($3 = '' or p.status = $3)
     order by p.created_at desc
     limit 20 offset $4`, [
			q,
			like,
			status,
			(page - 1) * 20
		]),
		page,
		total: (await sql.query(`select count(*)::int as n from profiles p left join "user" u on u."id" = p.user_id
     where p.role <> 'treasury'
       and ($1 = '' or p.display_name ilike $2 or p.username ilike $2 or coalesce(u."email", '') ilike $2)
       and ($3 = '' or p.status = $3)`, [
			q,
			like,
			status
		]))[0]?.n ?? 0
	});
}
async function userDetail(request, userId) {
	const { sql } = await requireAdmin(request);
	const rows = await sql.query(`select p.user_id, p.display_name, p.username, coalesce(u."email", '') as email, coalesce(u."emailVerified", false) as verified,
            p.phone, p.bio, p.avatar_url, p.wallet_address, p.deposit_address, p.use_platform_deposit,
            p.role, p.status, p.balance::text as balance, p.locked_balance::text as locked
     from profiles p left join "user" u on u."id" = p.user_id
     where p.user_id = $1`, [userId]);
	if (!rows[0]) throw new AdminError(404, "User not found.");
	return json({ user: rows[0] });
}
async function saveUser(request, userId) {
	const { sql, admin, ip } = await requireAdmin(request);
	const body = await bodyOf(request);
	const id = userId || text(body.userId, 120);
	if (!id || id === "house:platform") throw new AdminError(400, "That account cannot be edited this way.");
	const current = await sql.query(`select role, status, display_name from profiles where user_id = $1`, [id]);
	if (!current[0]) throw new AdminError(404, "User not found.");
	const username = text(body.username, 24).toLowerCase();
	if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new AdminError(400, "Username is not valid.");
	const displayName = text(body.displayName, 80);
	if (!displayName) throw new AdminError(400, "Name is required.");
	const role = body.role === "admin" || body.role === "catalog" || body.role === "user" ? body.role : "user";
	if (admin.role !== "super" && role !== current[0].role) throw new AdminError(403, "A super admin is required to change roles.");
	const status = [
		"active",
		"suspended",
		"banned",
		"deleted"
	].includes(String(body.status)) ? String(body.status) : "active";
	const email = text(body.email, 200).toLowerCase();
	const avatar = text(body.avatarUrl, 4e5);
	await sql.query(`update profiles set username = $2, display_name = $3, bio = $4, phone = $5, avatar_url = $6,
       wallet_address = $7, role = $8, status = $9, use_platform_deposit = $10, deposit_address = $11
     where user_id = $1`, [
		id,
		username,
		displayName,
		text(body.bio, 600),
		text(body.phone, 32),
		avatar || null,
		text(body.wallet, 80),
		role,
		status,
		body.usePlatformDeposit !== false,
		text(body.depositAddress, 80) || null
	]);
	if (email) try {
		await sql.query(`update "user" set "email" = $2, "name" = $3, "updatedAt" = now() where "id" = $1`, [
			id,
			email,
			displayName
		]);
	} catch {
		throw new AdminError(400, "That email is already in use.");
	}
	await audit(sql, admin.id, "user.update", id, `${role}/${status}`, ip, current[0].display_name, displayName);
	return json({ ok: true });
}
async function adjustBalance(request, userId) {
	const { sql, admin, ip } = await requireAdmin(request, { superOnly: true });
	const body = await bodyOf(request);
	const mode = body.mode === "add" || body.mode === "sub" ? body.mode : "set";
	const reason = text(body.reason, 240);
	if (reason.length < 3) throw new AdminError(400, "A reason is required.");
	const n = Number(body.amount);
	if (!Number.isFinite(n) || n < 0 || n > 1e6) throw new AdminError(400, "Amount is not valid.");
	const rows = await sql.query(`with locked as (
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
      select old, balance from upd`, [
		userId,
		mode,
		n.toFixed(6)
	]);
	if (!rows[0]) throw new AdminError(400, "Balance cannot sit below locked funds or zero.");
	await sql.query(`insert into transactions (buyer_id, price, kind, note) values ($1, $2::numeric, 'adjustment', $3)`, [
		userId,
		rows[0].balance,
		`${mode} ${n} ETH — ${reason}`
	]);
	await audit(sql, admin.id, "balance.adjust", userId, reason, ip, rows[0].old, rows[0].balance);
	return json({
		ok: true,
		balance: rows[0].balance
	});
}
async function userActionRoute(request, userId, action) {
	const { sql, admin, ip } = await requireAdmin(request, { superOnly: action === "delete" });
	if (action === "reset-password") {
		const body = await bodyOf(request);
		const password = typeof body.password === "string" ? body.password : "";
		if (password.length < 8) throw new AdminError(400, "Password must be at least 8 characters.");
		const accounts = await sql.query(`select "id" from "account" where "userId" = $1 and "providerId" = 'credential'`, [userId]);
		if (!accounts[0]) throw new AdminError(400, "This account has no password.");
		const { hashPassword: hash } = await import("./crypto-QVkT-fgq.mjs").then((n) => n.t).then((n) => n.t);
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
async function userTab(request, userId, tab) {
	const { sql } = await requireAdmin(request);
	if (tab === "deposits") return json({ rows: await sql.query(`select id, amount::text as amount, tx_hash, status, ${iso("created_at")} as at from deposits where user_id = $1 order by created_at desc limit 50`, [userId]) });
	if (tab === "withdrawals") return json({ rows: await sql.query(`select id, amount::text as amount, destination, status, tx_hash, ${iso("created_at")} as at from withdrawals where user_id = $1 order by created_at desc limit 50`, [userId]) });
	if (tab === "artworks") return json({ rows: await sql.query(`select id, title, hidden, removed, ${iso("created_at")} as at from artworks where creator_id = $1 order by created_at desc limit 50`, [userId]) });
	if (tab === "transactions") return json({ rows: await sql.query(`select id, kind, price::text as price, note, ${iso("created_at")} as at from transactions where buyer_id = $1 or seller_id = $1 order by created_at desc limit 50`, [userId]) });
	if (tab === "activity") return json({ rows: await sql.query(`select id, kind, detail, ${iso("created_at")} as at from activity_log where user_id = $1 order by created_at desc limit 50`, [userId]) });
	throw new AdminError(404, "Not found.");
}
async function deposits(request, url) {
	const { sql } = await requireAdmin(request);
	const filter = text(url.searchParams.get("status"), 20);
	const where = filter === "pending" ? "d.status in ('pending','confirming')" : filter === "approved" ? "d.status in ('approved','completed')" : filter === "rejected" ? "d.status in ('rejected','failed')" : "true";
	return json({ rows: await sql.query(`select d.id, p.display_name, p.username, d.user_id, d.amount::text as amount, d.tx_hash, d.status, d.reject_reason, ${iso("d.created_at")} as at
     from deposits d join profiles p on p.user_id = d.user_id
     where ${where}
     order by d.created_at desc limit 100`) });
}
async function depositDecision(request, id, action) {
	const { sql, admin, ip } = await requireAdmin(request);
	const body = await bodyOf(request);
	if (action === "reject") {
		const reason = text(body.reason, 240);
		if (reason.length < 3) throw new AdminError(400, "A reason is required.");
		const rows = await sql.query(`update deposits set status = 'rejected', reject_reason = $2, updated_at = now()
       where id = $1 and status in ('pending','confirming') returning user_id`, [id, reason]);
		if (!rows[0]) throw new AdminError(400, "That deposit is not pending.");
		await sql.query(`insert into notifications (user_id, body, href) values ($1, $2, '/deposit')`, [rows[0].user_id, `Deposit rejected: ${reason}`]);
		const email = await userEmail(sql, rows[0].user_id);
		if (email) await notice(email, "Deposit rejected", `Your deposit was rejected. Reason: ${reason}`);
		await audit(sql, admin.id, "deposit.reject", String(id), reason, ip);
		return json({ ok: true });
	}
	const nextAmount = body.amount == null || body.amount === "" ? null : amountOf(body.amount);
	const rows = await sql.query(`with d as (
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
      select user_id, amount::text as amount from upd where exists (select 1 from tx)`, [id, nextAmount]);
	if (!rows[0]) throw new AdminError(400, "That deposit is not pending.");
	await sql.query(`insert into notifications (user_id, body, href) values ($1, $2, '/deposit')`, [rows[0].user_id, `Deposit of ${rows[0].amount} ETH was approved.`]);
	const email = await userEmail(sql, rows[0].user_id);
	if (email) await notice(email, "Deposit approved", `Your deposit of ${rows[0].amount} ETH was approved and added to your balance.`);
	await audit(sql, admin.id, "deposit.approve", String(id), rows[0].amount, ip);
	return json({ ok: true });
}
async function manualDeposit(request) {
	const { sql, admin, ip } = await requireAdmin(request);
	const body = await bodyOf(request);
	const userId = await resolveUser(sql, text(body.userId, 200));
	const amount = amountOf(body.amount);
	const txHash = text(body.txHash, 80) || `0x${randomBytes(32).toString("hex")}`;
	const rows = await sql.query(`with ins as (
        insert into deposits (user_id, tx_hash, amount, confirmations, status)
        select $1, $2, $3::numeric, 12, 'approved' from profiles where user_id = $1
        returning id, user_id, amount, tx_hash
      ),
      cred as (
        update profiles set balance = balance + (select amount from ins)
        where user_id = (select user_id from ins)
        returning user_id
      )
      select id from ins where exists (select 1 from cred)`, [
		userId,
		txHash,
		amount
	]);
	if (!rows[0]) throw new AdminError(404, "User not found.");
	await sql.query(`insert into transactions (buyer_id, price, kind, tx_hash, note) values ($1, $2::numeric, 'deposit', $3, 'Manual deposit')`, [
		userId,
		amount,
		txHash
	]);
	await audit(sql, admin.id, "deposit.manual", userId, amount, ip);
	return json({
		ok: true,
		id: rows[0].id
	});
}
async function withdrawals(request, url) {
	const { sql } = await requireAdmin(request);
	const filter = text(url.searchParams.get("status"), 20);
	const warn = await sql.query(`select withdrawal_warn_eth::text as withdrawal_warn_eth from settings where id = 1`);
	const limitEth = Number(warn[0]?.withdrawal_warn_eth ?? 5);
	return json({
		limitEth,
		rows: (await sql.query(`select w.id, w.user_id, p.display_name, w.amount::text as amount, w.destination, w.status, w.tx_hash, ${iso("w.created_at")} as at,
            (select count(*)::int from withdrawals older where older.user_id = w.user_id and older.destination = w.destination and older.id <> w.id and older.status in ('approved','completed')) as seen
     from withdrawals w join profiles p on p.user_id = w.user_id
     where ($1 = '' or w.status = $1)
     order by case when w.status = 'pending' then 0 else 1 end, w.created_at desc limit 100`, [filter])).map((row) => {
			const fresh = row.seen === 0;
			const large = Number(row.amount) > limitEth;
			return {
				...row,
				warning: fresh || large,
				warningNote: [fresh ? "New destination" : "", large ? "Above limit" : ""].filter(Boolean).join(" · ")
			};
		})
	});
}
async function withdrawalDecision(request, id, action) {
	const { sql, admin, ip } = await requireAdmin(request);
	const body = await bodyOf(request);
	if (action === "approve") {
		const rows = await sql.query(`update withdrawals set status = 'approved', updated_at = now() where id = $1 and status = 'pending' returning user_id, amount::text as amount`, [id]);
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
		const rows = await sql.query(`with w as (select * from withdrawals where id = $1 and status in ('pending','approved') for update),
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
        select user_id, amount from done`, [id, reason]);
		if (!rows[0]) throw new AdminError(400, "That withdrawal cannot be rejected.");
		const email = await userEmail(sql, rows[0].user_id);
		if (email) await notice(email, "Withdrawal rejected", `Your withdrawal of ${rows[0].amount} ETH was rejected and the funds were returned. Reason: ${reason}`);
		await sql.query(`insert into notifications (user_id, body, href) values ($1, $2, '/withdraw')`, [rows[0].user_id, `Withdrawal rejected: ${reason}`]);
		await audit(sql, admin.id, "withdrawal.reject", String(id), reason, ip);
		return json({ ok: true });
	}
	const txHash = text(body.txHash, 80);
	if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) throw new AdminError(400, "Enter the transaction hash.");
	const rows = await sql.query(`with w as (select * from withdrawals where id = $1 and status = 'approved' for update),
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
      select user_id, amount from done`, [id, txHash]);
	if (!rows[0]) throw new AdminError(400, "Approve the withdrawal before marking it complete.");
	await sql.query(`insert into transactions (buyer_id, price, kind, tx_hash, note) values ($1, $2::numeric, 'withdrawal', $3, 'Withdrawal completed')`, [
		rows[0].user_id,
		rows[0].amount,
		txHash
	]);
	const email = await userEmail(sql, rows[0].user_id);
	if (email) await notice(email, "Withdrawal sent", `Your withdrawal of ${rows[0].amount} ETH was sent. Transaction: ${txHash}`);
	await audit(sql, admin.id, "withdrawal.complete", String(id), txHash, ip);
	return json({ ok: true });
}
async function depositAddress(request) {
	const { sql } = await requireAdmin(request);
	const settingsRow = await sql.query(`select platform_deposit_address from settings where id = 1`);
	const history = await sql.query(`select id, address, actor_id, ${iso("created_at")} as at from deposit_address_history order by created_at desc limit 20`);
	let qr = "";
	const address = settingsRow[0]?.platform_deposit_address ?? "";
	if (address) {
		const mod = await import("../_libs/qrcode.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
		const toString = mod.toString ?? mod.default?.toString;
		if (toString) qr = (await toString(address, {
			type: "svg",
			margin: 1
		})).replace(/<\?xml[^>]*>/, "");
	}
	return json({
		address,
		qr,
		history
	});
}
async function saveDepositAddress(request) {
	const { sql, admin, ip } = await requireAdmin(request, { superOnly: true });
	const raw = text((await bodyOf(request)).address, 80);
	const { getAddress } = await import("../_libs/ethers.mjs").then((n) => n.t);
	let address = "";
	if (raw) try {
		address = getAddress(raw);
	} catch {
		throw new AdminError(400, "That address failed checksum validation.");
	}
	const prev = await sql.query(`select platform_deposit_address from settings where id = 1`);
	await sql.query(`update settings set platform_deposit_address = $1 where id = 1`, [address]);
	if (address) await sql.query(`insert into deposit_address_history (address, actor_id) values ($1, $2)`, [address, admin.id]);
	await audit(sql, admin.id, "deposit-address", "settings", address, ip, prev[0]?.platform_deposit_address ?? "", address);
	return json({
		ok: true,
		address
	});
}
async function artworks(request) {
	const { sql } = await requireAdmin(request);
	return json({ rows: await sql.query(`select a.id, a.title, p.display_name as artist, a.hidden, a.removed, a.image_url, ${iso("a.created_at")} as at
     from artworks a join profiles p on p.user_id = a.creator_id
     order by a.created_at desc limit 100`) });
}
async function moderate(request) {
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
async function transactions(request, url) {
	const { sql } = await requireAdmin(request);
	const kind = text(url.searchParams.get("kind"), 40);
	return json({ rows: await sql.query(`select t.id, t.kind, t.price::text as price, t.note, t.tx_hash, ${iso("t.created_at")} as at,
            b.display_name as buyer, s.display_name as seller
     from transactions t
     left join profiles b on b.user_id = t.buyer_id
     left join profiles s on s.user_id = t.seller_id
     where ($1 = '' or t.kind = $1)
     order by t.created_at desc limit 200`, [kind]) });
}
async function exportTransactions(request, url) {
	const { sql } = await requireAdmin(request);
	const kind = text(url.searchParams.get("kind"), 40);
	const lines = ["id,kind,price,note,tx_hash,at", ...(await sql.query(`select id, kind, price::text as price, note, tx_hash, ${iso("created_at")} as at from transactions where ($1 = '' or kind = $1) order by created_at desc`, [kind])).map((row) => [
		row.id,
		row.kind,
		row.price,
		csv(row.note),
		csv(row.tx_hash),
		row.at
	].join(","))];
	return new Response(lines.join("\n"), { headers: {
		"content-type": "text/csv; charset=utf-8",
		"content-disposition": "attachment; filename=transactions.csv"
	} });
}
function csv(value) {
	return `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;
}
async function settings(request) {
	const { sql } = await requireAdmin(request);
	return json({ settings: (await sql.query(`select platform_fee_bps, mint_fee::text as mint_fee, min_withdrawal::text as min_withdrawal,
            auto_approve_under::text as auto_approve_under, auto_approve_enabled, support_email, announcement,
            withdrawal_warn_eth::text as withdrawal_warn_eth
     from settings where id = 1`))[0] });
}
async function saveSettings(request) {
	const { sql, admin, ip } = await requireAdmin(request, { superOnly: true });
	const body = await bodyOf(request);
	const mintFee = Number(body.mintFee);
	const minW = Number(body.minWithdrawal);
	const feePct = Number(body.platformFeePct);
	const auto = Number(body.autoApproveUnder);
	const warn = Number(body.withdrawalWarnEth);
	if (![
		mintFee,
		minW,
		feePct,
		auto,
		warn
	].every((n) => Number.isFinite(n) && n >= 0)) throw new AdminError(400, "Enter valid numbers.");
	if (feePct > 20) throw new AdminError(400, "Platform fee must be 20% or less.");
	await sql.query(`update settings set mint_fee = $1::numeric, min_withdrawal = $2::numeric, platform_fee_bps = $3,
       auto_approve_under = $4::numeric, auto_approve_enabled = $5, support_email = $6, announcement = $7,
       withdrawal_warn_eth = $8::numeric
     where id = 1`, [
		mintFee.toFixed(6),
		minW.toFixed(6),
		Math.round(feePct * 100),
		auto.toFixed(6),
		body.autoApproveEnabled === true,
		text(body.supportEmail, 200),
		text(body.announcement, 240),
		warn.toFixed(6)
	]);
	await audit(sql, admin.id, "settings.save", "settings", "Updated settings", ip);
	return json({ ok: true });
}
async function admins(request) {
	const { sql } = await requireAdmin(request, { superOnly: true });
	return json({ rows: await sql.query(`select id, email, name, role, must_change_password, ${iso("created_at")} as at from admin_accounts order by created_at`) });
}
async function addAdmin(request) {
	const { sql, admin, ip } = await requireAdmin(request, { superOnly: true });
	const body = await bodyOf(request);
	const email = text(body.email, 200).toLowerCase();
	const name = text(body.name, 80);
	const password = typeof body.password === "string" ? body.password : "";
	const role = body.role === "support" ? "support" : "super";
	if (!email.includes("@") || name.length < 2 || password.length < 8) throw new AdminError(400, "Name, email, and a password of at least 8 characters are required.");
	const id = `admin:${randomBytes(8).toString("hex")}`;
	try {
		await sql.query(`insert into admin_accounts (id, email, name, password_hash, role, must_change_password) values ($1, $2, $3, $4, $5, true)`, [
			id,
			email,
			name,
			await hashPassword(password),
			role
		]);
	} catch {
		throw new AdminError(400, "That email is already an admin.");
	}
	await audit(sql, admin.id, "admin.add", id, `${email} ${role}`, ip);
	return json({
		ok: true,
		id
	});
}
async function removeAdmin(request, id) {
	const { sql, admin, ip } = await requireAdmin(request, { superOnly: true });
	if (id === admin.id) throw new AdminError(400, "You cannot remove yourself.");
	const supers = await sql.query(`select count(*)::int as n from admin_accounts where role = 'super' and id <> $1`, [id]);
	if ((await sql.query(`select role from admin_accounts where id = $1`, [id]))[0]?.role === "super" && (supers[0]?.n ?? 0) < 1) throw new AdminError(400, "Keep at least one super admin.");
	await sql.query(`delete from admin_accounts where id = $1`, [id]);
	await audit(sql, admin.id, "admin.remove", id, "Removed", ip);
	return json({ ok: true });
}
async function auditLog(request) {
	const { sql } = await requireAdmin(request);
	return json({ rows: await sql.query(`select id, actor_id, action, target, detail, ip, old_value, new_value, ${iso("created_at")} as at
     from audit_log order by created_at desc limit 200`) });
}
var Route$2 = createFileRoute("/api/admin/$")({ server: { handlers: {
	GET: ({ request }) => handleAdmin(request),
	POST: ({ request }) => handleAdmin(request),
	PUT: ({ request }) => handleAdmin(request),
	DELETE: ({ request }) => handleAdmin(request)
} } });
var Route$1 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
function cookieValue(header, name) {
	const hit = header.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
	if (!hit) return "";
	try {
		return decodeURIComponent(hit.slice(name.length + 1));
	} catch {
		return hit.slice(name.length + 1);
	}
}
function expired(name) {
	return `${name}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`;
}
async function endSession(request) {
	const headers = new Headers({
		"Cache-Control": "no-store",
		"content-type": "application/json"
	});
	for (const name of [
		SESSION_TOKEN_COOKIE,
		"__Host-grok-auth.session_data",
		"__Host-grok-auth.account_data",
		"better-auth.session_token",
		"better-auth.session_data"
	]) headers.append("set-cookie", expired(name));
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
			const row = (await sql.query(`select "userId", "expiresAt" from "session" where "token" = $1`, [token]))[0];
			if (!row) continue;
			const sessions = await sql.query(`select "token", "expiresAt" from "session" where "userId" = $1`, [row.userId]);
			for (const item of sessions) await sql.query(`insert into revoked_sessions (token, user_id, expires_at) values ($1, $2, $3::timestamptz) on conflict (token) do nothing`, [
				item.token,
				row.userId,
				item.expiresAt
			]);
			await sql.query(`delete from "session" where "userId" = $1`, [row.userId]);
			await sql.query(`insert into activity_log (user_id, kind, detail) values ($1, 'sign_out', 'Signed out')`, [row.userId]);
		}
	} catch (error) {
		console.error("[auth] sign-out failed", error);
	}
	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers
	});
}
var Route = createFileRoute("/api/auth/logout")({ server: { handlers: { POST: ({ request }) => endSession(request) } } });
var IndexRoute = Route$15.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$16
});
var ActivityRoute = Route$14.update({
	id: "/activity",
	path: "/activity",
	getParentRoute: () => Route$16
});
var AdminRoute = Route$25.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$16
});
var ArtistsRoute = Route$13.update({
	id: "/artists",
	path: "/artists",
	getParentRoute: () => Route$16
});
var ContactRoute = Route$12.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$16
});
var CreateAccountRoute = Route$11.update({
	id: "/create-account",
	path: "/create-account",
	getParentRoute: () => Route$16
});
var DashboardRoute = Route$10.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$16
});
var DepositRoute = Route$9.update({
	id: "/deposit",
	path: "/deposit",
	getParentRoute: () => Route$16
});
var ExploreRoute = Route$20.update({
	id: "/explore",
	path: "/explore",
	getParentRoute: () => Route$16
});
var HelpRoute = Route$8.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => Route$16
});
var LoginRoute = Route$18.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$16
});
var MintRoute = Route$7.update({
	id: "/mint",
	path: "/mint",
	getParentRoute: () => Route$16
});
var VerifyEmailRoute = Route$17.update({
	id: "/verify-email",
	path: "/verify-email",
	getParentRoute: () => Route$16
});
var WithdrawRoute = Route$6.update({
	id: "/withdraw",
	path: "/withdraw",
	getParentRoute: () => Route$16
});
var AdminLoginRoute = Route$5.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRoute
});
var AdminPasswordRoute = Route$4.update({
	id: "/password",
	path: "/password",
	getParentRoute: () => AdminRoute
});
var ApiGalleryRoute = Route$3.update({
	id: "/api/gallery",
	path: "/api/gallery",
	getParentRoute: () => Route$16
});
var ArtIdRoute = Route$23.update({
	id: "/art/$id",
	path: "/art/$id",
	getParentRoute: () => Route$16
});
var ArtistSlugRoute = Route$22.update({
	id: "/artist/$slug",
	path: "/artist/$slug",
	getParentRoute: () => Route$16
});
var CollectionSlugRoute = Route$21.update({
	id: "/collection/$slug",
	path: "/collection/$slug",
	getParentRoute: () => Route$16
});
var LegalPageRoute = Route$19.update({
	id: "/legal/$page",
	path: "/legal/$page",
	getParentRoute: () => Route$16
});
var AdminUsersIdRoute = Route$24.update({
	id: "/users/$id",
	path: "/users/$id",
	getParentRoute: () => AdminRoute
});
var ApiAdminSplatRoute = Route$2.update({
	id: "/api/admin/$",
	path: "/api/admin/$",
	getParentRoute: () => Route$16
});
var ApiAuthSplatRoute = Route$1.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$16
});
var ApiAuthLogoutRoute = Route.update({
	id: "/api/auth/logout",
	path: "/api/auth/logout",
	getParentRoute: () => Route$16
});
var AdminRouteChildren = {
	AdminLoginRoute,
	AdminPasswordRoute,
	AdminUsersIdRoute
};
var rootRouteChildren = {
	IndexRoute,
	ActivityRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	ArtistsRoute,
	ContactRoute,
	CreateAccountRoute,
	DashboardRoute,
	DepositRoute,
	ExploreRoute,
	HelpRoute,
	LoginRoute,
	MintRoute,
	VerifyEmailRoute,
	WithdrawRoute,
	ApiGalleryRoute,
	ArtIdRoute,
	ArtistSlugRoute,
	CollectionSlugRoute,
	LegalPageRoute,
	ApiAdminSplatRoute,
	ApiAuthSplatRoute,
	ApiAuthLogoutRoute
};
var routeTree = Route$16._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$20 as a, Route$22 as c, Route$24 as d, BackButton as f, getRouter, Route$19 as i, Route$23 as l, Route$17 as n, RedirectToSignIn as o, Route$25 as p, Route$18 as r, Route$21 as s, router_BgE8hBxI_exports as t, useMarket as u };
