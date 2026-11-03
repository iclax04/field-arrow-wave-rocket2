import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as getDeposits, y as registerDeposit } from "./market.functions-D39Za-xC.mjs";
import { a as formatEth, i as ethUsdRate, o as formatUsd, r as errMsg, s as formatWhen } from "./format-BVC2xU7d.mjs";
import { t as useCurrentUserState } from "./use-current-user-BBitMO9P.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as RequireVerified } from "./require-verified-CpnwFXF0.mjs";
import { o as RedirectToSignIn, u as useMarket } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deposit-DGmkXb4b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DepositPage() {
	const { user, isPending } = useCurrentUserState();
	const { me, refresh } = useMarket();
	const [pack, setPack] = (0, import_react.useState)(null);
	const [amount, setAmount] = (0, import_react.useState)("1");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	function load() {
		return getDeposits().then((value) => {
			setPack(value);
			if (value.items.some((item) => item.status === "pending" || item.status === "confirming")) refresh();
		}).catch((caught) => toast.error(errMsg(caught)));
	}
	(0, import_react.useEffect)(() => {
		if (!user) return;
		load();
		const timer = window.setInterval(() => {
			load();
		}, 2e3);
		return () => window.clearInterval(timer);
	}, [user?.id]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 py-16 text-muted",
		children: "Checking your session…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (me?.emailVerified === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireVerified, {});
	async function send(next) {
		setBusy(true);
		try {
			await registerDeposit({ data: Number(next) });
			toast.success("Deposit submitted. Confirmations are counting.");
			await load();
		} catch (caught) {
			toast.error(errMsg(caught));
		} finally {
			setBusy(false);
		}
	}
	const usd = Number(amount);
	const usdLabel = Number.isFinite(usd) ? formatUsd(usd * ethUsdRate()) : "—";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "Deposit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Send ETH only. This address belongs to your account."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6",
				onSubmit: (event) => {
					event.preventDefault();
					send(amount);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label",
							children: "Amount to transfer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							inputMode: "decimal",
							value: amount,
							onChange: (event) => setAmount(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: ["≈ ", usdLabel]
					}),
					pack ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl bg-paper p-3",
							dangerouslySetInnerHTML: { __html: pack.qr }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "break-all font-mono text-sm",
								children: pack.address
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-ghost mt-3",
								onClick: () => {
									navigator.clipboard.writeText(pack.address).then(() => {
										setCopied(true);
										window.setTimeout(() => setCopied(false), 1500);
									});
								},
								children: copied ? "Copied" : "Copy address"
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-40 animate-pulse rounded-2xl bg-raised" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn mt-6",
						disabled: busy,
						type: "submit",
						children: busy ? "Sending…" : "Deposit"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 text-xl font-bold",
				children: "Deposit history"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 overflow-x-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 font-medium",
								children: "When"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 font-medium",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 font-medium",
								children: "Status"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: pack?.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 pr-3",
								children: formatWhen(item.created_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 pr-3 tabular-nums",
								children: formatEth(item.amount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-3 capitalize",
								children: [
									item.status,
									" · ",
									item.confirmations,
									"/",
									pack.required
								]
							})
						]
					}, item.id)) })]
				}), pack && pack.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "No deposits yet."
				}) : null]
			})
		]
	});
}
//#endregion
export { DepositPage as component };
