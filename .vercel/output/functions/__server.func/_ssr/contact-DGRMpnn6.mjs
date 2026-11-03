import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as submitContact } from "./market.functions-D39Za-xC.mjs";
import { r as errMsg } from "./format-BVC2xU7d.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-DGRMpnn6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const [sent, setSent] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		setBusy(true);
		try {
			await submitContact({ data: {
				name: String(form.get("name") ?? ""),
				email: String(form.get("email") ?? ""),
				topic: String(form.get("topic") ?? ""),
				message: String(form.get("message") ?? "")
			} });
			setSent(true);
		} catch (caught) {
			toast.error(errMsg(caught));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-accent",
				children: "Support"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl",
				children: "Contact Us"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Send a message to support@agoragallery.com. We reply by email."
			}),
			sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 rounded-2xl bg-raised p-4 text-sm",
				children: "We received your message and will reply to the email address you provided."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						name: "name",
						required: true,
						autoComplete: "name"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						name: "email",
						type: "email",
						required: true,
						autoComplete: "email"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Topic"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field",
						name: "topic",
						defaultValue: "Account",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Account" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Buying" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Selling" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Deposits" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Other" })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Message"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "field min-h-32 py-3",
						name: "message",
						required: true,
						minLength: 10
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn w-fit",
						disabled: busy,
						type: "submit",
						children: busy ? "Sending…" : "Send message"
					})
				]
			})
		]
	});
}
//#endregion
export { ContactPage as component };
