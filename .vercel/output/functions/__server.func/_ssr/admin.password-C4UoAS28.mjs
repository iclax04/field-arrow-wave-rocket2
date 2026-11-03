import { o as __toESM } from "../_runtime.mjs";
import { $ as require_react, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as adminFetch } from "./admin-client-B0sXbIcE.mjs";
import { f as BackButton } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.password-C4UoAS28.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PasswordPage() {
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	async function onSubmit(event) {
		event.preventDefault();
		if (password !== confirm) {
			setError("Passwords do not match.");
			return;
		}
		try {
			await adminFetch("password", {
				method: "POST",
				body: JSON.stringify({ password })
			});
			window.location.replace("/admin");
		} catch (caught) {
			setError(caught instanceof Error ? caught.message : "Could not save the password.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid min-h-screen max-w-md place-items-center bg-[#f4f6f8] px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "w-full rounded-3xl bg-white p-8 shadow-sm",
			onSubmit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-3xl font-bold",
					children: "Choose a new password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-[#6b7280]",
					children: "This admin password must be changed before the desk opens."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "label mt-6",
					children: ["New password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						type: "password",
						value: password,
						onChange: (event) => setPassword(event.target.value),
						minLength: 8,
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "label mt-3",
					children: ["Confirm", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						type: "password",
						value: confirm,
						onChange: (event) => setConfirm(event.target.value),
						required: true
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-red-700",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn mt-4",
					type: "submit",
					children: "Save password"
				})
			]
		})
	});
}
//#endregion
export { PasswordPage as component };
