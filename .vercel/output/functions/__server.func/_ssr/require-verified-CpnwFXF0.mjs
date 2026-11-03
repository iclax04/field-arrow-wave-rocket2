import { S as Navigate, T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as useMarket } from "./router-BgE8hBxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/require-verified-CpnwFXF0.js
var import_jsx_runtime = require_jsx_runtime();
function RequireVerified() {
	const { me } = useMarket();
	if (!me || me.emailVerified !== false) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/verify-email",
		search: {
			email: me.email ?? "",
			code: ""
		},
		replace: true
	});
}
//#endregion
export { RequireVerified as t };
