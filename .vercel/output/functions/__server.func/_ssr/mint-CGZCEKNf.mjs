import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, C as useNavigate, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as mintWork, s as getCatalog } from "./market.functions-D39Za-xC.mjs";
import { a as formatEth, r as errMsg, t as available } from "./format-BVC2xU7d.mjs";
import { t as useCurrentUserState } from "./use-current-user-BBitMO9P.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as RequireVerified } from "./require-verified-CpnwFXF0.mjs";
import { n as fileToMedia, t as fileToCover } from "./files-vJyWivql.mjs";
import { o as RedirectToSignIn, u as useMarket } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mint-CGZCEKNf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MintPage() {
	const { user, isPending } = useCurrentUserState();
	const { me, refresh } = useMarket();
	const navigate = useNavigate();
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [royalty, setRoyalty] = (0, import_react.useState)(5);
	const [mediaKind, setMediaKind] = (0, import_react.useState)("image");
	const [imageData, setImageData] = (0, import_react.useState)("");
	const [mediaData, setMediaData] = (0, import_react.useState)(null);
	const [listKind, setListKind] = (0, import_react.useState)("none");
	const [price, setPrice] = (0, import_react.useState)("");
	const [hours, setHours] = (0, import_react.useState)("48");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getCatalog({ data: {} }).then((value) => {
			setCategories(value.categories);
			setCategory((current) => current || value.categories[0]?.slug || "");
		}).catch(() => void 0);
	}, []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 py-16 text-muted",
		children: "Checking your session…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (me?.emailVerified === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireVerified, {});
	const fee = Number(me?.mintFee ?? .2);
	const avail = me ? available(me.profile.balance, me.profile.locked_balance) : 0;
	async function onSubmit(event) {
		event.preventDefault();
		if (!imageData) {
			toast.error("Add a cover image.");
			return;
		}
		setBusy(true);
		try {
			const result = await mintWork({ data: {
				title,
				description,
				category,
				royaltyPct: royalty,
				mediaKind,
				imageData,
				mediaData,
				listKind,
				price: listKind === "none" ? null : Number(price),
				endsInHours: Number(hours)
			} });
			toast.success(`Minted #${result.tokenId}`);
			refresh();
			navigate({
				to: "/art/$id",
				params: { id: String(result.id) }
			});
		} catch (caught) {
			toast.error(errMsg(caught));
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4 md:col-span-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Mint"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-4xl",
					children: "Put a work on the floor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted",
					children: [
						"Minting costs ",
						formatEth(fee),
						", taken from your available balance before the work is recorded.",
						avail < fee ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							" Not enough yet. ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/deposit",
								className: "text-fg underline",
								children: "Deposit ETH"
							}),
							"."
						] }) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						value: title,
						onChange: (event) => setTitle(event.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "field min-h-28 py-3",
						value: description,
						onChange: (event) => setDescription(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Category"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "field",
						value: category,
						onChange: (event) => setCategory(event.target.value),
						children: categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.slug,
							children: item.name
						}, item.slug))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "label",
						children: [
							"Royalty ",
							royalty,
							"%"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 10,
						step: .5,
						value: royalty,
						onChange: (event) => setRoyalty(Number(event.target.value)),
						className: "w-full"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Medium"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field",
						value: mediaKind,
						onChange: (event) => setMediaKind(event.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "image",
								children: "Image"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "video",
								children: "Video"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "audio",
								children: "Audio"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Cover image"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field py-2",
						type: "file",
						accept: "image/*",
						onChange: (event) => {
							const file = event.target.files?.[0];
							if (!file) return;
							fileToCover(file).then(setImageData).catch((caught) => toast.error(errMsg(caught)));
						}
					})]
				}),
				mediaKind !== "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "label",
						children: [mediaKind === "video" ? "Video" : "Audio", " file"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field py-2",
						type: "file",
						accept: mediaKind === "video" ? "video/mp4,video/webm" : "audio/*",
						onChange: (event) => {
							const file = event.target.files?.[0];
							if (!file) return;
							fileToMedia(file, mediaKind).then(setMediaData).catch((caught) => toast.error(errMsg(caught)));
						}
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Listing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field",
						value: listKind,
						onChange: (event) => setListKind(event.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "none",
								children: "Do not list yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "fixed",
								children: "Fixed price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "auction",
								children: "Timed auction"
							})
						]
					})]
				}),
				listKind !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "label",
						children: [listKind === "auction" ? "Start price" : "Price", " ETH"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						inputMode: "decimal",
						value: price,
						onChange: (event) => setPrice(event.target.value),
						required: true
					})] }), listKind === "auction" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Hours"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						inputMode: "numeric",
						value: hours,
						onChange: (event) => setHours(event.target.value)
					})] }) : null]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn",
					type: "submit",
					disabled: busy || avail < fee,
					children: busy ? "Minting…" : `Mint for ${formatEth(fee)}`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "md:col-span-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-2xl bg-raised",
					children: imageData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: imageData,
						alt: "",
						className: "aspect-[3/4] w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[3/4] bg-surface" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-serif text-2xl",
					children: title || "Untitled"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: me?.profile.display_name
				})
			]
		})]
	});
}
//#endregion
export { MintPage as component };
