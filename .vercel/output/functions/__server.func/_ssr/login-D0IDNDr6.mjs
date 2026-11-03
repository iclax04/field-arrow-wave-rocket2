import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, C as useNavigate, T as require_jsx_runtime, w as useRouter, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as errMsg } from "./format-BVC2xU7d.mjs";
import { i as signIn, t as authClient } from "./client-A6JBalEN.mjs";
import { t as useCurrentUserState } from "./use-current-user-BBitMO9P.mjs";
import { a as GROK_PROVIDERS } from "./server-Ca1SLScK.mjs";
import { n as sendEmailCode, r as verificationStatus } from "./verify.functions-2_Z_w9Pd.mjs";
import { r as Route } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-D0IDNDr6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { mode: requested } = Route.useSearch();
	const navigate = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const router = useRouter();
	const [mode, setMode] = (0, import_react.useState)(requested);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [adult, setAdult] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (requested === "up") navigate({
			to: "/create-account",
			replace: true
		});
	}, [requested, navigate]);
	async function onSubmit(event) {
		event.preventDefault();
		setBusy(true);
		setError(null);
		try {
			if (mode === "up") {
				if (!adult) throw new Error("You must confirm that you are 18 or older.");
				const result = await authClient.signUp.email({
					email,
					password,
					name: name || "Collector",
					callbackURL: "/"
				});
				if (result.error) throw new Error(result.error.message || "Could not create the account.");
			} else {
				const result = await authClient.signIn.email({
					email,
					password,
					callbackURL: "/"
				});
				if (result.error) throw new Error(result.error.message || "Could not sign in.");
			}
			const status = await verificationStatus();
			if (!status.verified) {
				let devCode = "";
				try {
					devCode = (await sendEmailCode()).devCode ?? "";
				} catch {}
				const codeQuery = devCode ? `&code=${encodeURIComponent(devCode)}` : "";
				window.location.replace(`/verify-email?email=${encodeURIComponent(status.email)}${codeQuery}`);
				return;
			}
			await router.invalidate();
			window.location.replace("/dashboard");
		} catch (caught) {
			setError(errMsg(caught));
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-serif text-4xl",
					children: mode === "up" ? "Create an account" : "Sign in"
				}),
				isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-muted",
					children: "Checking your session…"
				}) : null,
				!isPending && user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-muted",
					children: ["You are signed in. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: "text-accent",
						children: "Go to your dashboard."
					})]
				}) : null,
				!isPending && !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-3",
					children: [
						GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn-ghost w-full",
							onClick: () => signIn(provider.providerId, { callbackURL: "/" }),
							children: ["Continue with ", provider.label]
						}, provider.providerId)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit,
							className: "space-y-3 pt-4",
							children: [
								mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "field",
										value: name,
										onChange: (event) => setName(event.target.value),
										required: true
									})]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "field",
										type: "email",
										autoComplete: "email",
										value: email,
										onChange: (event) => setEmail(event.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "field",
										type: "password",
										autoComplete: mode === "up" ? "new-password" : "current-password",
										value: password,
										onChange: (event) => setPassword(event.target.value),
										minLength: 8,
										required: true
									})]
								}),
								mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 rounded-2xl bg-raised p-4 text-sm text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Digital assets can lose value. You can lose the entire amount you deposit. This marketplace does not provide investment advice." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Identity verification (KYC) may be required before a withdrawal is approved." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-start gap-2 text-fg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												className: "mt-1",
												checked: adult,
												onChange: (event) => setAdult(event.target.checked),
												required: true
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I confirm that I am 18 or older and that I agree to the Terms of Service." })]
										})
									]
								}) : null,
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-danger",
									children: error
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn w-full",
									type: "submit",
									disabled: busy,
									children: busy ? "Working…" : mode === "up" ? "Create account" : "Sign in with email"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-muted underline",
							onClick: () => setMode(mode === "up" ? "in" : "up"),
							children: mode === "up" ? "I already have an account" : "Create an email account"
						})
					]
				}) : null
			]
		})
	});
}
//#endregion
export { LoginPage as component };
