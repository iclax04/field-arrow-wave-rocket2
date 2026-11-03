import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/help-BEe-Ha_A.js
var import_jsx_runtime = require_jsx_runtime();
var ITEMS = [
	["How do I create an account?", "Choose Create account, confirm that you are 18 or older, and use your email and a password of at least 8 characters. You can also continue with Google or X."],
	["How do I add funds?", "After you sign in, open Deposit from your dashboard. Send ETH to the address shown for your account, then register the transfer. The balance updates after the required confirmations."],
	["How do I buy a work?", "Open the artwork and choose Buy now, or place a bid on an auction. The price, artist royalty, and platform fee are shown before you confirm."],
	["How do I sign out?", "Open the account menu or the dashboard sidebar and choose Sign out. Signing out ends the session on this device and in other open tabs."],
	["Why do I see a US dollar amount?", "Each ETH price includes an estimated dollar value using a reference rate. It is not a live market quote."]
];
function HelpPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-2xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-accent",
				children: "Support"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl",
				children: "Help Center"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "Answers to common questions. If you still need help, contact us."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-8 space-y-6",
				children: ITEMS.map(([question, answer]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "font-semibold",
					children: question
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-1 text-sm leading-6 text-muted",
					children: answer
				})] }, question))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/contact",
					className: "text-accent",
					children: "Contact support"
				})
			})
		]
	});
}
//#endregion
export { HelpPage as component };
