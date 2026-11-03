import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as getHome } from "./market.functions-D39Za-xC.mjs";
import { a as formatEth, r as errMsg } from "./format-BVC2xU7d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/artists-D-Gucfgm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ArtistsPage() {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		getHome().then((value) => {
			if (live) setData(value);
		}).catch((caught) => {
			if (live) setError(errMsg(caught));
		});
		return () => {
			live = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl",
				children: "Artists"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "Studios on Agora, ordered by sales."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3",
				children: data?.artists.map((artist) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/artist/$slug",
					params: { slug: artist.username },
					className: "rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xl font-bold",
							children: artist.display_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								"@",
								artist.username,
								" · ",
								artist.city || "Studio"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 line-clamp-3 text-sm",
							children: artist.bio
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm font-semibold text-accent",
							children: [
								artist.works,
								" works · ",
								formatEth(artist.volume)
							]
						})
					]
				}, artist.username))
			})
		]
	});
}
//#endregion
export { ArtistsPage as component };
