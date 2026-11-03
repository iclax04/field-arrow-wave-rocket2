import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as rejectOffer, g as makeOffer, h as listWork, m as getWorkOffers, n as buyListing, o as getArtwork, r as cancelMyListing, t as acceptOffer, v as placeBid } from "./market.functions-D39Za-xC.mjs";
import { a as formatEth, l as royaltyLabel, r as errMsg, s as formatWhen, t as available } from "./format-BVC2xU7d.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Modal } from "./cards-84hk_AbC.mjs";
import { l as Route, u as useMarket } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/art._id-CuW0LCYb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ArtPage() {
	const { id } = Route.useParams();
	const { me, refresh } = useMarket();
	const [pack, setPack] = (0, import_react.useState)(void 0);
	const [error, setError] = (0, import_react.useState)(null);
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [bid, setBid] = (0, import_react.useState)("");
	const [offer, setOffer] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("fixed");
	const [hours, setHours] = (0, import_react.useState)("24");
	const [offers, setOffers] = (0, import_react.useState)([]);
	function load() {
		getArtwork({ data: Number(id) }).then((value) => {
			setPack(value);
			setError(null);
		}).catch((caught) => setError(errMsg(caught)));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [id]);
	(0, import_react.useEffect)(() => {
		const artwork = pack?.work;
		if (!me || !artwork || me.profile.user_id !== artwork.owner_id) {
			setOffers([]);
			return;
		}
		getWorkOffers({ data: artwork.id }).then(setOffers).catch(() => setOffers([]));
	}, [
		me?.profile.user_id,
		pack?.work?.id,
		pack?.work?.owner_id
	]);
	const work = pack?.work ?? null;
	const mine = Boolean(work && me && me.profile.user_id === work.owner_id);
	async function run(action, done) {
		setBusy(true);
		try {
			await action();
			toast.success(done);
			setConfirm(false);
			refresh();
			load();
			if (me) getWorkOffers({ data: Number(id) }).then(setOffers).catch(() => void 0);
		} catch (caught) {
			toast.error(errMsg(caught));
		} finally {
			setBusy(false);
		}
	}
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mx-auto max-w-6xl px-4 py-16 text-danger",
		children: error
	});
	if (pack === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[3/4] max-w-xl animate-pulse rounded-2xl bg-raised" })
	});
	if (!work) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: "This work is not on the floor."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-7",
				children: [work.media_kind === "video" && work.media_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: work.media_url,
					poster: work.image_url,
					controls: true,
					className: "w-full rounded-2xl bg-ink"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: work.image_url,
					alt: work.title,
					className: "w-full rounded-2xl object-cover"
				}), work.media_kind === "audio" && work.media_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
					src: work.media_url,
					controls: true,
					className: "mt-4 w-full"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "kicker",
						children: [
							"#",
							work.token_id,
							" · ",
							work.category_slug
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-serif text-4xl",
						children: work.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted",
						children: work.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Artist",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/artist/$slug",
									params: { slug: work.creator_username },
									className: "underline",
									children: work.creator_name
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Holder",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/artist/$slug",
									params: { slug: work.owner_username },
									className: "underline",
									children: work.owner_name
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, {
								label: "Royalty",
								children: [royaltyLabel(work.royalty_bps), " on resale"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Saved",
								children: work.likes_count
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-2xl bg-surface p-4",
						children: [
							work.listing_kind === "fixed" && work.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "kicker",
									children: "Buy now"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-serif text-4xl tabular-nums",
									children: formatEth(work.price)
								}),
								!mine && me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn mt-4 w-full",
									onClick: () => setConfirm(true),
									children: "Buy"
								}) : null
							] }) : null,
							work.listing_kind === "auction" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "kicker",
									children: "Auction"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-serif text-4xl tabular-nums",
									children: formatEth(work.high_bid || work.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, { ends: work.ends_at }),
								!mine && me ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "mt-4 flex gap-2",
									onSubmit: (event) => {
										event.preventDefault();
										if (!work.listing_id) return;
										run(() => placeBid({ data: {
											listingId: work.listing_id,
											amount: Number(bid)
										} }), "Bid placed");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "field",
										inputMode: "decimal",
										placeholder: "Your bid",
										value: bid,
										onChange: (event) => setBid(event.target.value),
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn",
										type: "submit",
										disabled: busy,
										children: "Bid"
									})]
								}) : null
							] }) : null,
							!work.listing_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: "Not listed."
							}) : null,
							!me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: { mode: "in" },
								className: "btn mt-4 w-full",
								children: "Sign in to collect"
							}) : null,
							mine && work.listing_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-ghost mt-4 w-full",
								disabled: busy,
								onClick: () => void run(() => cancelMyListing({ data: work.listing_id }), "Listing cancelled"),
								children: "Cancel listing"
							}) : null
						]
					}),
					!mine && me ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 flex gap-2",
						onSubmit: (event) => {
							event.preventDefault();
							run(() => makeOffer({ data: {
								artworkId: work.id,
								amount: Number(offer)
							} }), "Offer made");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							inputMode: "decimal",
							placeholder: "Make an offer",
							value: offer,
							onChange: (event) => setOffer(event.target.value),
							required: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn-ghost",
							type: "submit",
							disabled: busy,
							children: "Offer"
						})]
					}) : null,
					mine && !work.listing_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 space-y-3",
						onSubmit: (event) => {
							event.preventDefault();
							run(() => listWork({ data: {
								artworkId: work.id,
								kind,
								price: Number(price),
								endsInHours: Number(hours)
							} }), "Listed");
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "kicker",
								children: "List this work"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "field",
									value: kind,
									onChange: (event) => setKind(event.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "fixed",
										children: "Fixed price"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "auction",
										children: "Timed auction"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "field",
									inputMode: "decimal",
									placeholder: "ETH",
									value: price,
									onChange: (event) => setPrice(event.target.value),
									required: true
								})]
							}),
							kind === "auction" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label",
									children: "Hours"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "field",
									inputMode: "numeric",
									value: hours,
									onChange: (event) => setHours(event.target.value)
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn w-full",
								type: "submit",
								disabled: busy,
								children: "List"
							})
						]
					}) : null,
					mine && offers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker",
							children: "Offers on this work"
						}), offers.map((offer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								offer.bidder_name,
								" offered ",
								formatEth(offer.amount)
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn",
									disabled: busy,
									onClick: () => void run(() => acceptOffer({ data: offer.id }), "Offer accepted"),
									children: "Accept"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn-ghost",
									disabled: busy,
									onClick: () => void run(() => rejectOffer({ data: offer.id }), "Offer declined"),
									children: "Decline"
								})]
							})]
						}, offer.id))]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-2xl",
								children: "Price history"
							}),
							pack && pack.history.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex h-24 items-end gap-2",
								children: pack.history.map((row) => {
									const max = Math.max(...pack.history.map((item) => Number(item.price)));
									const height = max > 0 ? Math.max(12, Number(row.price) / max * 100) : 12;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-full flex-1 items-end",
										title: formatEth(row.price),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full rounded-t-lg bg-accent",
											style: { height: `${height}%` }
										})
									}, row.id);
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 divide-y divide-line text-sm",
								children: pack.history.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										row.kind,
										" · ",
										row.buyer_name
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums",
										children: formatEth(row.price)
									})]
								}, row.id))
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "No sales yet. The first hand is still the artist’s."
							}),
							pack && pack.offerCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm text-muted",
								children: [
									pack.offerCount,
									" open offer",
									pack.offerCount === 1 ? "" : "s",
									pack.topOffer ? `, top ${formatEth(pack.topOffer)}` : "",
									"."
								]
							}) : null
						]
					})
				]
			}),
			confirm && work.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				title: "Confirm purchase",
				onClose: () => setConfirm(false),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Pay ",
						formatEth(work.price),
						" for ",
						work.title,
						" from your available balance."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Available ",
							me ? formatEth(available(me.profile.balance, me.profile.locked_balance)) : "—",
							". The artist royalty and platform fee come out of that price."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn mt-4 w-full",
						disabled: busy,
						onClick: () => void run(() => buyListing({ data: work.listing_id }), "It’s yours"),
						children: busy ? "Settling…" : "Confirm"
					})
				]
			}) : null
		]
	});
}
function Row({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-right",
			children
		})]
	});
}
function Countdown({ ends }) {
	const [label, setLabel] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!ends) return;
		const tick = () => {
			const ms = new Date(ends).getTime() - Date.now();
			if (ms <= 0) {
				setLabel("Ended");
				return;
			}
			const s = Math.floor(ms / 1e3);
			const h = Math.floor(s / 3600);
			const m = Math.floor(s % 3600 / 60);
			setLabel(`${h}h ${m}m ${s % 60}s left`);
		};
		tick();
		const timer = window.setInterval(tick, 1e3);
		return () => window.clearInterval(timer);
	}, [ends]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-sm text-muted",
		children: label || (ends ? formatWhen(ends) : "")
	});
}
//#endregion
export { ArtPage as component };
