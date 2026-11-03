import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { w as toggleFavorite } from "./market.functions-D39Za-xC.mjs";
import { a as formatEth } from "./format-BVC2xU7d.mjs";
import { p as Heart } from "../_libs/lucide-react.mjs";
import { u as useMarket } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cards-84hk_AbC.js
var import_jsx_runtime = require_jsx_runtime();
function ArtworkCard({ work, liked, onLike }) {
	const price = work.listing_kind === "auction" ? work.high_bid ? `Bid ${formatEth(work.high_bid)}` : `From ${formatEth(work.price)}` : work.price ? formatEth(work.price) : "Unlisted";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/art/$id",
			params: { id: String(work.id) },
			className: "block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl bg-raised",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: work.image_url,
					alt: "",
					className: "aspect-[3/4] w-full object-cover"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-2 pb-2 pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "truncate text-base",
						children: work.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-muted",
						children: work.creator_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm font-semibold",
						children: price
					})
				]
			})]
		}), onLike ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onLike,
			"aria-label": liked ? `Remove ${work.title} from saved` : `Save ${work.title}`,
			className: "ml-2 inline-flex h-11 w-11 items-center justify-center text-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
				size: 18,
				className: liked ? "fill-violet text-violet" : "",
				"aria-hidden": true
			})
		}) : null]
	});
}
function FloorCard({ work }) {
	const { me, refresh } = useMarket();
	const liked = me?.favoriteIds.includes(work.id) ?? false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArtworkCard, {
		work,
		liked,
		onLike: me ? () => {
			toggleFavorite({ data: work.id }).then(() => refresh());
		} : void 0
	});
}
function WorkGrid({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3",
		children
	});
}
function Modal({ title, children, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-end bg-ink/70 p-4 sm:place-items-center",
		role: "dialog",
		"aria-modal": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lift max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl bg-surface p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost px-3",
					onClick: onClose,
					children: "Close"
				})]
			}), children]
		})
	});
}
//#endregion
export { Modal as n, WorkGrid as r, FloorCard as t };
