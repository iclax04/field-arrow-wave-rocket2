import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as withdrawOffer, S as searchStudios, T as updateMe, b as rejectOffer, l as getDashboard, t as acceptOffer } from "./market.functions-D39Za-xC.mjs";
import { d as shortAddr, i as ethUsdRate, o as formatUsd, r as errMsg, s as formatWhen, t as available } from "./format-BVC2xU7d.mjs";
import { a as signOut, t as authClient } from "./client-A6JBalEN.mjs";
import { t as useCurrentUserState } from "./use-current-user-BBitMO9P.mjs";
import { _ as Eye, a as Search, c as List, d as Info, h as Gem, l as LayoutGrid, o as Moon, r as Sun, s as Menu, t as X, v as EyeOff, y as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as RequireVerified } from "./require-verified-CpnwFXF0.mjs";
import { t as fileToCover } from "./files-vJyWivql.mjs";
import { f as BackButton, o as RedirectToSignIn, u as useMarket } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-5PlW_9pd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudioView({ name, username, avatarUrl, joined, wallets, balanceEth, portfolioEth, unit, setUnit, hideValue, setHideValue, tab, setTab, menu, setMenu, more, setMore, walletsOpen, setWalletsOpen, searchOpen, setSearchOpen, query, setQuery, hits, onSearch, assetQuery, setAssetQuery, sort, setSort, layout, setLayout, works, trades, activity, offersIn, offersOut, onAccept, onDecline, onWithdraw, onTheme, theme, onSignOut, profile }) {
	const tabs = [
		{
			id: "overview",
			label: "Overview"
		},
		{
			id: "holdings",
			label: "Holdings"
		},
		{
			id: "trades",
			label: "Trades"
		},
		{
			id: "activity",
			label: "Activity"
		},
		{
			id: "orders",
			label: "Orders"
		},
		{
			id: "watch",
			label: "Watchlist"
		}
	];
	const shown = hideValue ? "••••" : money(tab === "holdings" || tab === "watch" || tab === "overview" ? portfolioEth : balanceEth, unit);
	const [accountOpen, setAccountOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "desk min-h-screen bg-[#0d0d0f] pb-24 text-white md:grid md:grid-cols-[13rem_1fr] md:pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden border-r border-white/10 p-4 md:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-3 py-2 text-lg font-extrabold",
				children: "Agora"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-2 grid gap-1 text-sm",
				children: [
					tabs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `rounded-xl px-3 py-2 text-left ${tab === item.id ? "bg-white text-black" : "hover:bg-white/5"}`,
						onClick: () => setTab(item.id),
						children: item.label
					}, item.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mint",
						className: "rounded-xl px-3 py-2 hover:bg-white/5",
						children: "Mint"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/deposit",
						className: "rounded-xl px-3 py-2 hover:bg-white/5",
						children: "Deposit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/withdraw",
						className: "rounded-xl px-3 py-2 hover:bg-white/5",
						children: "Withdraw"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex h-14 items-center gap-1 bg-[#0d0d0f]/95 px-2 pt-[env(safe-area-inset-top)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid h-11 w-11 place-items-center md:hidden",
							"aria-label": "Open menu",
							onClick: () => setMenu(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 22 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-lg font-extrabold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-full bg-[#2081e2] text-sm",
								children: "A"
							}), "Agora"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative ml-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-[#2aab9b] text-sm font-bold",
								"aria-label": "Account menu",
								"aria-expanded": accountOpen,
								onClick: () => setAccountOpen((value) => !value),
								children: avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: avatarUrl,
									alt: "",
									className: "h-full w-full object-cover"
								}) : name.charAt(0)
							}), accountOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute right-0 z-40 mt-2 w-52 rounded-2xl border border-white/10 bg-[#16181d] p-2 text-sm shadow-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "block w-full rounded-xl px-3 py-2 text-left hover:bg-white/5",
										onClick: () => {
											setTab("profile");
											setAccountOpen(false);
										},
										children: "Edit profile"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "block w-full rounded-xl px-3 py-2 text-left hover:bg-white/5",
										onClick: () => {
											setTab("activity");
											setAccountOpen(false);
										},
										children: "Account Activity"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "block w-full rounded-xl px-3 py-2 text-left hover:bg-white/5",
										onClick: onSignOut,
										children: "Sign out"
									})
								]
							}) : null]
						})
					]
				}),
				tab !== "overview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {})
				}) : null,
				searchOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "px-4 pb-3",
					onSubmit: (event) => {
						event.preventDefault();
						onSearch();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Search collectors"
					}), hits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 overflow-hidden rounded-2xl border border-white/10",
						children: hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/artist/$slug",
							params: { slug: hit.username },
							className: "block px-4 py-3 text-sm hover:bg-white/5",
							children: [
								hit.display_name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-white/50",
									children: ["@", hit.username]
								})
							]
						}) }, hit.username))
					}) : null]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-[radial-gradient(120%_80%_at_50%_0%,#12343c_0%,#0d0d0f_68%)] px-4 pb-2 pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-start justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-[#2aab9b] text-3xl font-bold ring-4 ring-[#0d0d0f]",
								children: avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: avatarUrl,
									alt: "",
									className: "h-full w-full object-cover"
								}) : name.charAt(0)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 text-3xl font-bold tracking-tight",
							children: name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "mt-1 flex items-center gap-1 text-sm text-white/60",
							onClick: () => setWalletsOpen(!walletsOpen),
							children: [
								wallets.length,
								" ",
								wallets.length === 1 ? "wallet" : "wallets",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 14 })
							]
						}),
						walletsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1 text-sm text-white/70",
							children: wallets.map((wallet) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								wallet.label,
								": ",
								shortAddr(wallet.address)
							] }, wallet.label))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-white/70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-white",
									children: "0"
								}),
								" Following",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-1",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-white",
									children: "0"
								}),
								" Followers",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-1",
									children: "·"
								}),
								"Joined ",
								joined
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-white/40",
							children: ["@", username]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sticky top-14 z-20 border-b border-white/10 bg-[#0d0d0f]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-5 overflow-x-auto px-4",
						children: tabs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `shrink-0 border-b-2 py-3 text-sm font-semibold ${tab === item.id ? "border-white text-white" : "border-transparent text-white/50"}`,
							onClick: () => setTab(item.id),
							children: item.label
						}, item.id))
					})
				}),
				tab === "profile" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-6",
					children: profile
				}) : null,
				tab !== "profile" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 pt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-sm text-white/60",
						children: [
							"Portfolio value",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								title: "Estimated from listed prices. Unlisted works count as zero.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { size: 14 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": hideValue ? "Show value" : "Hide value",
								onClick: () => setHideValue(!hideValue),
								children: hideValue ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 14 })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-4xl font-bold tracking-tight",
						children: shown
					})]
				}) : null,
				tab === "overview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-white/60",
						children: "Recent activity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityRows, { rows: activity.slice(0, 6) })]
				}) : null,
				tab === "holdings" || tab === "watch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-sm text-white/70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "w-full bg-transparent outline-none placeholder:text-white/40",
									value: assetQuery,
									onChange: (event) => setAssetQuery(event.target.value),
									placeholder: "Search"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-full border border-white/15 px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Sort"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "bg-transparent outline-none",
									value: sort,
									onChange: (event) => setSort(event.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "recent",
											children: "Recently received"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "value",
											children: "Highest value"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "name",
											children: "Name"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `grid h-10 w-10 place-items-center rounded-xl border border-white/15 ${layout === "grid" ? "bg-white text-black" : ""}`,
								"aria-label": "Grid",
								onClick: () => setLayout("grid"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { size: 16 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `grid h-10 w-10 place-items-center rounded-xl border border-white/15 ${layout === "list" ? "bg-white text-black" : ""}`,
								"aria-label": "List",
								onClick: () => setLayout("list"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { size: 16 })
							})
						]
					}), layout === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex px-4 pb-2 text-xs tracking-wide text-white/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									children: "ASSET"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VALUE" })]
							}),
							works.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "px-4 py-8 text-sm text-white/50",
								children: [
									"No ",
									tab === "watch" ? "saved works" : "holdings",
									" yet."
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: works.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "border-t border-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/art/$id",
									params: { id: String(work.id) },
									className: "flex items-center gap-3 px-4 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: work.image_url,
											alt: "",
											className: "h-12 w-12 rounded-lg object-cover"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate font-semibold",
												children: work.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-xs text-white/45",
												children: work.category_slug
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm tabular-nums",
											children: work.price ? money(Number(work.price), unit) : "—"
										})
									]
								})
							}, work.id)) })
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-2 gap-3 px-4",
						children: works.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/art/$id",
							params: { id: String(work.id) },
							className: "overflow-hidden rounded-2xl bg-[#16181d]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: work.image_url,
									alt: "",
									className: "aspect-square w-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block px-3 py-2 text-sm font-semibold",
									children: work.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block px-3 pb-3 text-xs text-white/50",
									children: work.price ? money(Number(work.price), unit) : "Unlisted"
								})
							]
						}, work.id))
					})]
				}) : null,
				tab === "trades" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4",
					children: [trades.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-4 py-8 text-sm text-white/50",
						children: "No trades yet."
					}) : null, trades.map((trade) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-semibold",
							children: trade.title || trade.kind
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-white/45",
							children: formatWhen(trade.at)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: money(Number(trade.price), unit)
						})]
					}, `${trade.kind}-${trade.id}`))]
				}) : null,
				tab === "activity" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityRows, { rows: activity })
				}) : null,
				tab === "orders" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-6 px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-white/60",
						children: "Incoming"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-2",
						children: [offersIn.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-white/50",
							children: "No incoming offers."
						}) : null, offersIn.map((offer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl border border-white/10 p-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								offer.bidder_name,
								" offered ",
								money(Number(offer.amount), unit),
								" on ",
								offer.title
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-full bg-[#2081e2] px-4 py-2 text-sm font-semibold",
									onClick: () => onAccept(offer.id),
									children: "Accept"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-full border border-white/20 px-4 py-2 text-sm",
									onClick: () => onDecline(offer.id),
									children: "Decline"
								})]
							})]
						}, offer.id))]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-white/60",
						children: "Your offers"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-2",
						children: [offersOut.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-white/50",
							children: "No open offers."
						}) : null, offersOut.map((offer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl border border-white/10 p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/art/$id",
									params: { id: String(offer.artwork_id) },
									className: "font-semibold",
									children: offer.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 tabular-nums",
									children: money(Number(offer.amount), unit)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-3 rounded-full border border-white/20 px-4 py-2 text-sm",
									onClick: () => onWithdraw(offer.id),
									children: "Withdraw"
								})
							]
						}, offer.id))]
					})] })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-white/10 bg-[#0d0d0f] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-sm font-semibold tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, {
								size: 16,
								className: "text-white/70"
							}), hideValue ? "••••" : money(balanceEth, unit)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 text-white/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Light",
								className: theme === "light" ? "text-white" : "",
								onClick: () => onTheme("light"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { size: 16 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Dark",
								className: theme === "dark" ? "text-white" : "",
								onClick: () => onTheme("dark"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { size: 16 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex rounded-full bg-white/10 p-0.5 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `rounded-full px-3 py-1 ${unit === "eth" ? "bg-white text-black" : "text-white/70"}`,
								onClick: () => setUnit("eth"),
								children: "Crypto"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `rounded-full px-3 py-1 ${unit === "usd" ? "bg-white text-black" : "text-white/70"}`,
								onClick: () => setUnit("usd"),
								children: "USD"
							})]
						})
					]
				}),
				menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-50 bg-black/60",
					onClick: () => setMenu(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-full w-72 bg-[#111214] p-4",
						onClick: (event) => event.stopPropagation(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: "Agora"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Close menu",
								onClick: () => setMenu(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "mt-6 grid gap-1 text-sm",
							children: [
								tabs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-xl px-3 py-3 text-left hover:bg-white/5",
									onClick: () => {
										setTab(item.id);
										setMenu(false);
									},
									children: item.label
								}, item.id)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/mint",
									className: "rounded-xl px-3 py-3 hover:bg-white/5",
									children: "Mint"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/deposit",
									className: "rounded-xl px-3 py-3 hover:bg-white/5",
									children: "Deposit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/withdraw",
									className: "rounded-xl px-3 py-3 hover:bg-white/5",
									children: "Withdraw"
								})
							]
						})]
					})
				}) : null
			]
		})]
	});
}
function money(eth, unit) {
	if (!Number.isFinite(eth)) return "—";
	if (unit === "usd") return formatUsd(eth * ethUsdRate());
	return `${eth.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 4
	})} ETH`;
}
function ActivityRows({ rows }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 py-6 text-sm text-white/50",
		children: "No activity yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-start justify-between gap-3 border-t border-white/10 px-4 py-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "capitalize",
				children: row.kind.replaceAll("_", " ")
			}),
			" · ",
			row.detail
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shrink-0 text-xs text-white/40",
			children: formatWhen(row.at)
		})]
	}, row.id)) });
}
function DashboardPage() {
	const { user, isPending } = useCurrentUserState();
	const { me, refresh, theme, toggleTheme } = useMarket();
	const [tab, setTab] = (0, import_react.useState)("holdings");
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [assetQuery, setAssetQuery] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("recent");
	const [layout, setLayout] = (0, import_react.useState)("list");
	const [unit, setUnit] = (0, import_react.useState)("usd");
	const [hideValue, setHideValue] = (0, import_react.useState)(false);
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [more, setMore] = (0, import_react.useState)(false);
	const [wallets, setWallets] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	function load() {
		getDashboard().then((value) => setData(value)).catch((caught) => setError(errMsg(caught)));
	}
	(0, import_react.useEffect)(() => {
		if (user) load();
	}, [user?.id]);
	const portfolioEth = (0, import_react.useMemo)(() => {
		return (data?.owned ?? []).reduce((sum, work) => sum + (work.price ? Number(work.price) : 0), 0);
	}, [data]);
	const works = (0, import_react.useMemo)(() => {
		const source = tab === "watch" ? data?.watchlist ?? [] : data?.owned ?? [];
		const q = assetQuery.trim().toLowerCase();
		return [...source.filter((work) => !q || work.title.toLowerCase().includes(q) || work.category_slug.includes(q))].sort((a, b) => {
			if (sort === "name") return a.title.localeCompare(b.title);
			if (sort === "value") return Number(b.price ?? 0) - Number(a.price ?? 0);
			return 0;
		});
	}, [
		data,
		tab,
		assetQuery,
		sort
	]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "bg-[#0d0d0f] px-4 py-16 text-white/60",
		children: "Checking your session…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (me?.emailVerified === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireVerified, {});
	const avail = me ? available(me.profile.balance, me.profile.locked_balance) : 0;
	const profile = me?.profile;
	const joined = profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
		timeZone: "UTC"
	}) : "";
	const walletRows = [profile?.deposit_address ? {
		label: "Deposit",
		address: profile.deposit_address
	} : null, profile?.wallet_address ? {
		label: "Personal",
		address: profile.wallet_address
	} : null].filter((row) => Boolean(row));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioView, {
		name: profile?.display_name || "Collector",
		username: profile?.username || "collector",
		avatarUrl: profile?.avatar_url ?? null,
		joined,
		wallets: walletRows,
		balanceEth: avail,
		portfolioEth,
		unit,
		setUnit,
		hideValue,
		setHideValue,
		tab,
		setTab,
		menu,
		setMenu,
		more,
		setMore,
		walletsOpen: wallets,
		setWalletsOpen: setWallets,
		searchOpen,
		setSearchOpen,
		query,
		setQuery,
		hits,
		onSearch: () => {
			searchStudios({ data: query }).then(setHits).catch((caught) => toast.error(errMsg(caught)));
		},
		assetQuery,
		setAssetQuery,
		sort,
		setSort,
		layout,
		setLayout,
		works,
		trades: [...data?.sold ?? [], ...data?.purchases ?? []],
		activity: data?.activity ?? [],
		offersIn: data?.offersIn ?? [],
		offersOut: data?.offersOut ?? [],
		onAccept: (id) => {
			acceptOffer({ data: id }).then(() => {
				toast.success("Accepted");
				refresh();
				load();
			}).catch((caught) => toast.error(errMsg(caught)));
		},
		onDecline: (id) => {
			rejectOffer({ data: id }).then(() => {
				toast.success("Declined");
				load();
			}).catch((caught) => toast.error(errMsg(caught)));
		},
		onWithdraw: (id) => {
			withdrawOffer({ data: id }).then(() => {
				toast.success("Withdrawn");
				refresh();
				load();
			}).catch((caught) => toast.error(errMsg(caught)));
		},
		onTheme: (mode) => {
			if (theme !== mode) toggleTheme();
		},
		theme,
		onSignOut: () => void signOut("/"),
		profile: me ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileForm, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordForm, {})] }) : null
	});
}
var US_STATES = [
	"AL",
	"AK",
	"AZ",
	"AR",
	"CA",
	"CO",
	"CT",
	"DE",
	"DC",
	"FL",
	"GA",
	"HI",
	"ID",
	"IL",
	"IN",
	"IA",
	"KS",
	"KY",
	"LA",
	"ME",
	"MD",
	"MA",
	"MI",
	"MN",
	"MS",
	"MO",
	"MT",
	"NE",
	"NV",
	"NH",
	"NJ",
	"NM",
	"NY",
	"NC",
	"ND",
	"OH",
	"OK",
	"OR",
	"PA",
	"RI",
	"SC",
	"SD",
	"TN",
	"TX",
	"UT",
	"VT",
	"VA",
	"WA",
	"WV",
	"WI",
	"WY"
];
function ProfileForm() {
	const { me, refresh } = useMarket();
	const profile = me?.profile;
	const [displayName, setDisplayName] = (0, import_react.useState)(profile?.display_name ?? "");
	const [username, setUsername] = (0, import_react.useState)(profile?.username ?? "");
	const [bio, setBio] = (0, import_react.useState)(profile?.bio ?? "");
	const [city, setCity] = (0, import_react.useState)(profile?.city ?? "");
	const [region, setRegion] = (0, import_react.useState)(profile?.region ?? "");
	const [postalCode, setPostalCode] = (0, import_react.useState)(profile?.postal_code ?? "");
	const [phone, setPhone] = (0, import_react.useState)(profile?.phone ?? "");
	const [siteUrl, setSiteUrl] = (0, import_react.useState)(profile?.site_url ?? "");
	const [xHandle, setXHandle] = (0, import_react.useState)(profile?.x_handle ?? "");
	const [wallet, setWallet] = (0, import_react.useState)(profile?.wallet_address ?? "");
	const [avatar, setAvatar] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!profile) return;
		setDisplayName(profile.display_name);
		setUsername(profile.username);
		setBio(profile.bio);
		setCity(profile.city);
		setRegion(profile.region ?? "");
		setPostalCode(profile.postal_code ?? "");
		setPhone(profile.phone ?? "");
		setSiteUrl(profile.site_url ?? "");
		setXHandle(profile.x_handle ?? "");
		setWallet(profile.wallet_address ?? "");
	}, [profile?.user_id]);
	if (!profile) return null;
	async function onSubmit(event) {
		event.preventDefault();
		setBusy(true);
		try {
			await updateMe({ data: {
				displayName,
				username,
				bio,
				city,
				region,
				postalCode,
				phone,
				siteUrl,
				xHandle,
				avatar,
				clearAvatar: false,
				wallet
			} });
			toast.success("Profile saved");
			refresh();
		} catch (caught) {
			toast.error(errMsg(caught));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "grid max-w-xl gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-3xl font-bold",
				children: "Edit profile"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "Name"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: displayName,
				onChange: (event) => setDisplayName(event.target.value),
				autoComplete: "name"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "Username"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: username,
				onChange: (event) => setUsername(event.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "Phone"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: phone,
				onChange: (event) => setPhone(event.target.value),
				autoComplete: "tel",
				placeholder: "(555) 555-0100"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "City"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: city,
				onChange: (event) => setCity(event.target.value),
				autoComplete: "address-level2"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "State"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "field",
				value: region,
				onChange: (event) => setRegion(event.target.value),
				autoComplete: "address-level1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Select"
				}), US_STATES.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: code,
					children: code
				}, code))]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "ZIP code"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: postalCode,
				onChange: (event) => setPostalCode(event.target.value),
				autoComplete: "postal-code",
				inputMode: "numeric",
				placeholder: "10001"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "Bio"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "field min-h-24 py-3",
				value: bio,
				onChange: (event) => setBio(event.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "Site"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: siteUrl,
				onChange: (event) => setSiteUrl(event.target.value),
				placeholder: "https://"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "X"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: xHandle,
				onChange: (event) => setXHandle(event.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "Avatar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field py-2",
				type: "file",
				accept: "image/*",
				onChange: (event) => {
					const file = event.target.files?.[0];
					if (!file) return;
					fileToCover(file).then(setAvatar).catch((caught) => toast.error(errMsg(caught)));
				}
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "Personal wallet"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: wallet,
				onChange: (event) => setWallet(event.target.value),
				placeholder: "0x"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn w-fit",
				disabled: busy,
				type: "submit",
				children: busy ? "Saving…" : "Save profile"
			})
		]
	});
}
function PasswordForm() {
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		setBusy(true);
		try {
			const result = await authClient.changePassword({
				currentPassword,
				newPassword,
				revokeOtherSessions: false
			});
			if (result.error) throw new Error(result.error.message || "Could not change the password.");
			setCurrentPassword("");
			setNewPassword("");
			toast.success("Password updated");
		} catch (caught) {
			toast.error(errMsg(caught));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "mt-10 grid max-w-xl gap-3 border-t border-line pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-3xl",
				children: "Password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "Current password"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				type: "password",
				autoComplete: "current-password",
				value: currentPassword,
				onChange: (event) => setCurrentPassword(event.target.value),
				required: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label",
				children: "New password"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				type: "password",
				autoComplete: "new-password",
				minLength: 8,
				value: newPassword,
				onChange: (event) => setNewPassword(event.target.value),
				required: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn w-fit",
				disabled: busy,
				type: "submit",
				children: busy ? "Saving…" : "Change password"
			})
		]
	});
}
//#endregion
export { DashboardPage as component };
