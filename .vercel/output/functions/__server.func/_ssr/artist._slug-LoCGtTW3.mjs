import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getArtist } from "./market.functions-D39Za-xC.mjs";
import { d as shortAddr, r as errMsg } from "./format-BVC2xU7d.mjs";
import { r as WorkGrid, t as FloorCard } from "./cards-84hk_AbC.mjs";
import { c as Route } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/artist._slug-LoCGtTW3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ArtistPage() {
	const { slug } = Route.useParams();
	const [tab, setTab] = (0, import_react.useState)("created");
	const [data, setData] = (0, import_react.useState)(void 0);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		getArtist({ data: slug }).then((value) => {
			if (live) setData(value);
		}).catch((caught) => {
			if (live) setError(errMsg(caught));
		});
		return () => {
			live = false;
		};
	}, [slug]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mx-auto max-w-6xl px-4 py-16 text-danger",
		children: error
	});
	if (data === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-16 text-muted",
		children: "Loading studio…"
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: "No studio by that name."
	});
	const { profile } = data;
	const works = tab === "created" ? data.created : data.owned;
	const initials = profile.display_name.split(" ").slice(0, 2).map((part) => part[0]).join("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-4",
				children: [profile.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: profile.avatar_url,
					alt: "",
					className: "h-20 w-20 rounded-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-20 w-20 place-items-center rounded-full bg-raised font-serif text-2xl",
					children: initials
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-4xl",
						children: profile.display_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted",
						children: [
							"@",
							profile.username,
							profile.city ? ` · ${profile.city}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl",
						children: profile.bio
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: shortAddr(profile.wallet_address)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-4 text-sm",
						children: [profile.x_handle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "underline",
							href: `https://x.com/${profile.x_handle}`,
							children: "X"
						}) : null, profile.site_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "underline",
							href: profile.site_url,
							children: "Site"
						}) : null]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: tab === "created" ? "btn" : "btn-ghost",
					onClick: () => setTab("created"),
					children: "Created"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: tab === "owned" ? "btn" : "btn-ghost",
					onClick: () => setTab("owned"),
					children: "Collected"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: works.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkGrid, { children: works.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloorCard, { work }, work.id)) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Nothing in this column yet."
				})
			})
		]
	});
}
//#endregion
export { ArtistPage as component };
