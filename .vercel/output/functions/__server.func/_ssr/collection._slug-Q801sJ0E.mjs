import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as getCollection } from "./market.functions-D39Za-xC.mjs";
import { r as errMsg } from "./format-BVC2xU7d.mjs";
import { r as WorkGrid, t as FloorCard } from "./cards-84hk_AbC.mjs";
import { s as Route } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collection._slug-Q801sJ0E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CollectionPage() {
	const { slug } = Route.useParams();
	const [data, setData] = (0, import_react.useState)(void 0);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		getCollection({ data: slug }).then((value) => {
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
		children: "Opening the room…"
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: "That collection is not on the floor."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Collection"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-serif text-4xl md:text-5xl",
				children: data.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-muted",
				children: data.blurb
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: data.works.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkGrid, { children: data.works.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloorCard, { work }, work.id)) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Nothing is hanging in this room yet."
				})
			})
		]
	});
}
//#endregion
export { CollectionPage as component };
