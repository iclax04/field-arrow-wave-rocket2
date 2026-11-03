import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime, w as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as errMsg } from "./format-BVC2xU7d.mjs";
import { t as useCurrentUserState } from "./use-current-user-BBitMO9P.mjs";
import { n as sendEmailCode, t as confirmEmailCode } from "./verify.functions-2_Z_w9Pd.mjs";
import { n as Route, o as RedirectToSignIn } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-email-DGtfdp68.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyPage() {
	const { email, code: hinted } = Route.useSearch();
	const { user, isPending } = useCurrentUserState();
	const router = useRouter();
	const [code, setCode] = (0, import_react.useState)(hinted);
	const [error, setError] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)(null);
	const [devCode, setDevCode] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [wait, setWait] = (0, import_react.useState)(60);
	(0, import_react.useEffect)(() => {
		if (wait <= 0) return;
		const timer = window.setInterval(() => setWait((value) => Math.max(0, value - 1)), 1e3);
		return () => window.clearInterval(timer);
	}, [wait]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 py-16 text-muted",
		children: "Checking your session…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function resend() {
		setBusy(true);
		setError(null);
		try {
			const result = await sendEmailCode();
			setWait(60);
			setDevCode(result.devCode);
			setNote(result.sent ? "A new code is on the way." : "Email delivery is not configured, so the code is shown below.");
		} catch (caught) {
			setError(errMsg(caught));
		} finally {
			setBusy(false);
		}
	}
	async function onSubmit(event) {
		event.preventDefault();
		setBusy(true);
		setError(null);
		try {
			await confirmEmailCode({ data: { code } });
			await router.invalidate();
			window.location.replace("/dashboard");
		} catch (caught) {
			setError(errMsg(caught));
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Agora Gallery NFTs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-4xl",
					children: "Verify your email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						"Enter the 6-digit code sent to ",
						email || "your email",
						". It expires in 10 minutes."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-8 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label",
								children: "Verification code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field text-center text-2xl tracking-[0.4em]",
								inputMode: "numeric",
								autoComplete: "one-time-code",
								maxLength: 6,
								value: code,
								onChange: (event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6)),
								required: true
							})]
						}),
						hinted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "rounded-xl bg-raised p-3 text-sm",
							children: [
								"Your code is ",
								hinted,
								". Email delivery is not configured yet, so it is shown here."
							]
						}) : null,
						devCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "rounded-xl bg-raised p-3 text-sm",
							children: [
								"Your code is ",
								devCode,
								"."
							]
						}) : null,
						note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: note
						}) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							role: "alert",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn w-full",
							type: "submit",
							disabled: busy || code.length !== 6,
							children: busy ? "Checking…" : "Verify email"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-4 text-sm font-semibold text-accent disabled:opacity-50",
					disabled: busy || wait > 0,
					onClick: () => void resend(),
					children: wait > 0 ? `Resend code in ${wait}s` : "Resend code"
				})
			]
		})
	});
}
//#endregion
export { VerifyPage as component };
