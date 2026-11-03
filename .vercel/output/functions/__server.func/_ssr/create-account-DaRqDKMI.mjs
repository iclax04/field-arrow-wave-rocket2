import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as updateMe } from "./market.functions-D39Za-xC.mjs";
import { r as errMsg } from "./format-BVC2xU7d.mjs";
import { i as signIn, t as authClient } from "./client-A6JBalEN.mjs";
import { t as useCurrentUserState } from "./use-current-user-BBitMO9P.mjs";
import { a as GROK_PROVIDERS } from "./server-Ca1SLScK.mjs";
import { n as sendEmailCode } from "./verify.functions-2_Z_w9Pd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-account-DaRqDKMI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CreateAccountPage() {
	const { user, isPending } = useCurrentUserState();
	const [name, setName] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [adult, setAdult] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		setError(null);
		const handle = username.trim().toLowerCase();
		if (!/^[a-z0-9_]{3,24}$/.test(handle)) {
			setError("Username must be 3–24 letters, numbers, or underscores.");
			return;
		}
		if (password !== confirm) {
			setError("Passwords do not match.");
			return;
		}
		if (!adult) {
			setError("You must confirm that you are 18 or older.");
			return;
		}
		setBusy(true);
		try {
			const result = await authClient.signUp.email({
				email: email.trim(),
				password,
				name: name.trim(),
				callbackURL: "/dashboard"
			});
			if (result.error) throw new Error(result.error.message || "Could not create the account.");
			await updateMe({ data: {
				displayName: name.trim(),
				username: handle,
				bio: "",
				city: "",
				phone: "",
				region: "",
				postalCode: "",
				siteUrl: "",
				xHandle: "",
				avatar: "",
				clearAvatar: false,
				wallet: ""
			} });
			await sendEmailCode();
			window.location.replace(`/verify-email?email=${encodeURIComponent(email.trim())}`);
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
					children: "Create an account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Open a studio, mint work, and collect from the marketplace."
				}),
				isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-muted",
					children: "Checking your session…"
				}) : null,
				!isPending && user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-sm text-muted",
					children: ["You are already signed in. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: "font-semibold text-accent",
						children: "Go to your dashboard."
					})]
				}) : null,
				!isPending && !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-3",
					children: [
						GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn-ghost w-full",
							onClick: () => signIn(provider.providerId, { callbackURL: "/dashboard" }),
							children: ["Continue with ", provider.label]
						}, provider.providerId)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit,
							className: "space-y-3 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label",
										children: "Full name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "field",
										value: name,
										onChange: (event) => setName(event.target.value),
										autoComplete: "name",
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label",
										children: "Username"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "field",
										value: username,
										onChange: (event) => setUsername(event.target.value),
										autoComplete: "username",
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "field",
										type: "email",
										value: email,
										onChange: (event) => setEmail(event.target.value),
										autoComplete: "email",
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
										value: password,
										onChange: (event) => setPassword(event.target.value),
										autoComplete: "new-password",
										minLength: 8,
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label",
										children: "Confirm password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "field",
										type: "password",
										value: confirm,
										onChange: (event) => setConfirm(event.target.value),
										autoComplete: "new-password",
										minLength: 8,
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 rounded-2xl bg-raised p-4 text-sm text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Digital assets can lose value. You can lose the entire amount you deposit. This marketplace does not provide investment advice." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Identity verification may be required before a withdrawal is approved." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-start gap-2 text-fg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												className: "mt-1",
												checked: adult,
												onChange: (event) => setAdult(event.target.checked),
												required: true
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"I confirm that I am 18 or older and that I agree to the",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/legal/$page",
													params: { page: "terms" },
													className: "text-accent",
													children: "Terms of Service"
												}),
												"."
											] })]
										})
									]
								}),
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-danger",
									role: "alert",
									children: error
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn w-full",
									type: "submit",
									disabled: busy,
									children: busy ? "Creating account…" : "Create account"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["Already have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: { mode: "in" },
								className: "font-semibold text-accent",
								children: "Sign in"
							})]
						})
					]
				}) : null
			]
		})
	});
}
//#endregion
export { CreateAccountPage as component };
