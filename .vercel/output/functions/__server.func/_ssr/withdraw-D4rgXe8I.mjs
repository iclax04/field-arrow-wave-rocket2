import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as getWithdrawals, x as requestWithdrawal } from "./market.functions-D39Za-xC.mjs";
import { a as formatEth, d as shortAddr, r as errMsg, s as formatWhen, t as available } from "./format-BVC2xU7d.mjs";
import { t as useCurrentUserState } from "./use-current-user-BBitMO9P.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as RequireVerified } from "./require-verified-CpnwFXF0.mjs";
import { o as RedirectToSignIn, u as useMarket } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/withdraw-D4rgXe8I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WithdrawPage() {
	const { user, isPending } = useCurrentUserState();
	const { me, refresh } = useMarket();
	const [pack, setPack] = (0, import_react.useState)(null);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [destination, setDestination] = (0, import_react.useState)("");
	const [confirmEmail, setConfirmEmail] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	function load() {
		getWithdrawals().then(setPack).catch((caught) => toast.error(errMsg(caught)));
	}
	(0, import_react.useEffect)(() => {
		if (user) load();
	}, [user?.id]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 py-16 text-muted",
		children: "Checking your session…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (me?.emailVerified === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireVerified, {});
	const avail = pack ? available(pack.balance, pack.locked) : me ? available(me.profile.balance, me.profile.locked_balance) : 0;
	async function onSubmit(event) {
		event.preventDefault();
		setBusy(true);
		try {
			const result = await requestWithdrawal({ data: {
				amount: Number(amount),
				destination,
				confirmEmail
			} });
			toast.success(result.status === "completed" ? "Withdrawal sent" : "Withdrawal is waiting on the desk");
			setAmount("");
			refresh();
			load();
		} catch (caught) {
			toast.error(errMsg(caught));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-10 px-4 py-8 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Withdraw"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-serif text-4xl",
				children: "Send ETH out"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-muted",
				children: [
					"Available ",
					formatEth(avail),
					". Minimum ",
					formatEth(pack?.min ?? "0.05"),
					" plus a network fee of ",
					formatEth(pack?.networkFee ?? "0.002"),
					". Funds lock when you request, so they cannot be spent twice. Confirm with the email on this account."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-6 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label",
							children: "Amount"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							inputMode: "decimal",
							value: amount,
							onChange: (event) => setAmount(event.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label",
							children: "Destination address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: destination,
							onChange: (event) => setDestination(event.target.value),
							placeholder: "0x",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label",
							children: "Confirm email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							type: "email",
							value: confirmEmail,
							onChange: (event) => setConfirmEmail(event.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn",
						type: "submit",
						disabled: busy,
						children: busy ? "Locking…" : "Request withdrawal"
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-serif text-2xl",
			children: "History"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 divide-y divide-line",
			children: pack?.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "py-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: formatEth(item.amount)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "capitalize",
							children: item.status
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted",
						children: [
							shortAddr(item.destination),
							" · ",
							formatWhen(item.created_at)
						]
					}),
					item.reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-danger",
						children: item.reason
					}) : null
				]
			}, item.id))
		})] })]
	});
}
//#endregion
export { WithdrawPage as component };
