import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime, m as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as adminFetch } from "./admin-client-B0sXbIcE.mjs";
import { f as BackButton } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/frame-u_PiU_JB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [
	["overview", "Overview"],
	["users", "Users"],
	["deposits", "Deposits"],
	["withdrawals", "Withdrawals"],
	["address", "Deposit address"],
	["artworks", "Artworks"],
	["transactions", "Transactions"],
	["settings", "Settings"],
	["admins", "Admin accounts"],
	["audit", "Audit log"]
];
function AdminFrame({ children, counts }) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const section = useRouterState({ select: (state) => state.location.search.section || "overview" });
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const last = { at: Date.now() };
		const mark = () => {
			last.at = Date.now();
		};
		const events = ["pointerdown", "keydown"];
		for (const name of events) window.addEventListener(name, mark);
		const timer = window.setInterval(() => {
			if (Date.now() - last.at >= 18e5) adminFetch("logout", { method: "POST" }).finally(() => window.location.replace("/admin/login"));
		}, 15e3);
		return () => {
			for (const name of events) window.removeEventListener(name, mark);
			window.clearInterval(timer);
		};
	}, []);
	async function signOut() {
		try {
			await adminFetch("logout", { method: "POST" });
		} finally {
			window.location.replace("/admin/login");
		}
	}
	const nav = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "grid gap-1 text-sm",
		children: [LINKS.map(([id, label]) => {
			const active = pathname === "/admin" && section === id;
			const badge = id === "deposits" ? counts?.deposits : id === "withdrawals" ? counts?.withdrawals : 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin",
				search: { section: id },
				className: `flex items-center justify-between rounded-xl px-3 py-2 ${active ? "bg-[#2563eb] text-white" : "hover:bg-black/5"}`,
				onClick: () => setOpen(false),
				children: [label, badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-red-600 px-2 py-0.5 text-xs text-white",
					children: badge
				}) : null]
			}, id);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "mt-4 rounded-xl px-3 py-2 text-left font-semibold text-red-700 hover:bg-red-50",
			onClick: () => void signOut(),
			children: "Sign out"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#f4f6f8] text-[#111827] md:grid md:grid-cols-[15rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden border-r border-black/10 bg-white p-4 md:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-3 py-2 text-lg font-extrabold",
				children: "Agora admin"
			}), nav]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2 border-b border-black/10 bg-white px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-xl border px-3 py-2 text-sm md:hidden",
					onClick: () => setOpen((value) => !value),
					children: "Menu"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b bg-white p-3 md:hidden",
				children: nav
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4",
				children
			})
		] })]
	});
}
//#endregion
export { AdminFrame as t };
