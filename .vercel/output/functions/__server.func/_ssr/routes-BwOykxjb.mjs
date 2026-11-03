import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, S as Navigate, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as getHome } from "./market.functions-D39Za-xC.mjs";
import { i as ethUsdRate, o as formatUsd, r as errMsg } from "./format-BVC2xU7d.mjs";
import { t as useCurrentUserState } from "./use-current-user-BBitMO9P.mjs";
import { b as Camera, f as Image, g as Frame, i as Shapes, m as Grid2x2, u as Layers } from "../_libs/lucide-react.mjs";
import { u as useMarket } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BwOykxjb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var floor = {
	q: "",
	category: "",
	kind: "",
	min: "",
	max: "",
	sort: "newest",
	artist: ""
};
var ICONS = {
	photography: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
		size: 14,
		"aria-hidden": true
	}),
	painting: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
		size: 14,
		"aria-hidden": true
	}),
	textile: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
		size: 14,
		"aria-hidden": true
	}),
	object: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shapes, {
		size: 14,
		"aria-hidden": true
	}),
	installation: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, {
		size: 14,
		"aria-hidden": true
	})
};
function HomePage() {
	const { user, isPending } = useCurrentUserState();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [chip, setChip] = (0, import_react.useState)("all");
	const [slide, setSlide] = (0, import_react.useState)(0);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [shown, setShown] = (0, import_react.useState)(true);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const { toggleTheme } = useMarket();
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (user) return;
		let live = true;
		let first = true;
		async function pull() {
			try {
				const value = await getHome();
				if (!live) return;
				if (first) {
					setData(value);
					first = false;
					return;
				}
				setShown(false);
				window.setTimeout(() => {
					if (!live) return;
					setData(value);
					setSlide(0);
					setShown(true);
				}, 280);
			} catch (caught) {
				if (live) setError(errMsg(caught));
			}
		}
		pull();
		const timer = window.setInterval(() => {
			if (!paused) pull();
		}, 15e3);
		return () => {
			live = false;
			window.clearInterval(timer);
		};
	}, [paused, user]);
	if (!mounted || isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-[#0d0d0f] px-4 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-40 animate-pulse rounded-full bg-white/10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid grid-cols-2 gap-3",
			children: Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[3/4] animate-pulse rounded-2xl bg-white/10" }, index))
		})]
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/dashboard",
		replace: true
	});
	const slides = (data?.featured.length ? data.featured : data?.floor ?? []).slice(0, 5);
	const current = slides[slide] ?? slides[0];
	const rows = (data?.floor ?? []).filter((work) => chip === "all" || work.category_slug === chip);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-[#0d0d0f] pb-8 text-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: chip === "all",
					onClick: () => setChip("all"),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid2x2, {
						size: 14,
						"aria-hidden": true
					}),
					children: "All"
				}), data?.categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: chip === category.slug,
					onClick: () => setChip(category.slug),
					icon: ICONS[category.slug],
					children: category.name
				}, category.slug))]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 text-sm text-red-300",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: `px-4 transition-opacity duration-500 ${shown ? "opacity-100" : "opacity-0"}`,
				onMouseEnter: () => setPaused(true),
				onMouseLeave: () => setPaused(false),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold",
						children: "Featured artworks"
					}),
					data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-2 gap-3",
						children: data.featured.slice(0, 4).map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/art/$id",
							params: { id: String(work.id) },
							className: "overflow-hidden rounded-2xl bg-white/5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: work.image_url,
									alt: "",
									className: "aspect-[3/4] w-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block px-3 py-2 text-sm font-semibold",
									children: work.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block px-3 pb-3 text-xs text-white/60",
									children: [
										work.creator_name,
										" · ",
										usd(work.price)
									]
								})
							]
						}, work.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-2 gap-3",
						children: Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[3/4] animate-pulse rounded-2xl bg-white/10" }, index))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-8 text-lg font-bold",
						children: "Trending artists"
					}),
					data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-2",
						children: data.artists.slice(0, 4).map((artist) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/artist/$slug",
							params: { slug: artist.username },
							className: "rounded-2xl border border-white/10 px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold",
								children: artist.display_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-sm text-white/55",
								children: [
									artist.city || "United States",
									" · ",
									artist.works,
									" works"
								]
							})]
						}, artist.username))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-2",
						children: Array.from({ length: 3 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-2xl bg-white/10" }, index))
					})
				]
			}),
			current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/art/$id",
						params: { id: String(current.id) },
						className: "relative block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: current.image_url,
								alt: "",
								className: "aspect-[4/5] w-full object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-x-0 bottom-0 p-4 pb-20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "flex items-center gap-2 text-3xl font-bold",
									children: [current.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 flex items-center gap-1.5 text-sm text-white/90",
									children: [
										"By ",
										current.creator_name,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {})
									]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/explore",
						search: floor,
						className: "btn absolute inset-x-4 bottom-4",
						children: "Explore artworks"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex justify-center gap-1.5",
					"aria-hidden": true,
					children: slides.map((work, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": `Show ${work.title}`,
						onClick: () => setSlide(index),
						className: `h-1 rounded-full ${index === slide ? "w-6 bg-white" : "w-4 bg-white/30"}`
					}, work.id))
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-4 aspect-[4/5] animate-pulse rounded-2xl bg-white/5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center justify-between px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold",
					children: "Artworks"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/explore",
					search: {
						...floor,
						category: chip === "all" ? "" : chip
					},
					className: "rounded-full border border-white/15 px-4 py-1.5 text-sm font-semibold",
					children: "Browse"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex px-4 text-[11px] font-semibold tracking-[0.14em] text-white/45",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "COLLECTION" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto",
					children: "FLOOR"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2",
				children: rows.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/art/$id",
					params: { id: String(work.id) },
					className: "flex items-center gap-3 px-4 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: work.image_url,
							alt: "",
							className: "h-11 w-11 rounded-lg object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 truncate font-semibold",
								children: [work.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm text-white/55",
								children: work.creator_name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-semibold",
								children: usd(work.price)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-white/50",
								children: work.price ? `${Number(work.price).toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})} ETH` : "Unlisted"
							})]
						})
					]
				}) }, work.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-6 flex items-center justify-between rounded-full border border-white/10 px-3 py-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatUsd(ethUsdRate()) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: toggleTheme,
						className: "rounded-full px-3 py-1 text-white/80",
						"aria-label": "Toggle color theme",
						children: "Theme"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-white px-3 py-1 text-xs font-bold text-black",
						children: "USD"
					})
				]
			})
		]
	});
}
function Chip({ active, onClick, icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: `flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold ${active ? "bg-white text-black" : "bg-white/10 text-white"}`,
		children: [icon, children]
	});
}
function Check() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent text-[10px] text-white",
		"aria-hidden": true,
		children: "✓"
	});
}
function usd(price) {
	if (!price) return "—";
	const n = Number(price);
	if (!Number.isFinite(n)) return "—";
	return formatUsd(n * ethUsdRate());
}
//#endregion
export { HomePage as component };
